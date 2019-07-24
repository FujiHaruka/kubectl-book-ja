{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- Apply はリソース構成上で `kubectl apply` を実行することによってクラスタ内のリソースを作成・更新する
- Apply は、オペレーションの順序や、ユーザーが定義した状態とクラスタが定義した状態をマージするといった複雑性を管理する

{% endpanel %}

# Apply

## 動機

Apply は Kubernetes クラスタをローカルのファイルで定義された状態に一致させるよう更新するコマンドです。

```bash
kubectl apply
```

- 完全な宣言性 - 作成や更新を指示する必要はなく、ファイルを管理するだけです
- ユーザーが所有する状態 (たとえば Service `selector`) をクラスタが所有する状態 (たとえば Service `clusterIp`) にマージします

## 定義

- **リソース (Resource)**: クラスタ内の*オブジェクト* - たとえば Deployment、Service など
- **リソース構成 (Resource Config)**: リソースの望ましい状態を宣言した*ファイル* - たとえば deployment.yaml。リソースはこれらのファイルと Apply を使って作成・更新される

`kubectl apply` はローカルまたはリモートのファイルを通じてリソースを作成・更新します。これは生のリソース構成でもできますが、 `kustomization.yaml` を使うこともできます。

## 使い方

{% method %}

Apply はリソース構成ファイルに対して、あるいは `-f` オプションでディレクトリを指定して直接実行することもできますが、お勧めは `-k` オプションを使って `kustomization.yaml` に対して Apply を実行することです。`kustomization.yaml` を使うと多くのリソースを横断した設定 (たとえば名前空間) を定義できます。

{% sample lang="yaml" %}

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

# list of Resource Config to be Applied
resources:
- deployment.yaml

# namespace to deploy all Resources to
namespace: default

# labels added to all Resources
commonLabels:
  app: example
  env: test
```

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  labels:
    component: nginx
    tier: frontend
spec:
  selector:
    matchLabels:
      component: nginx
      tier: frontend
  template:
    metadata:
      labels:
        component: nginx
        tier: frontend
    spec:
      containers:
      - name: nginx
        image: nginx:1.15.4
```

{% endmethod %}

{% method %}

Apply コマンドは `kustomization.yaml` ファイルを含むディレクトリに `-k` オプションで実行するか、または生のリソース構成ファイルに対して `-f` オプションで実行します。

{% sample lang="yaml" %}

```bash
# Apply the Resource Config
kubectl apply -k .

# View the Resources
kubectl get -k .
```

{% endmethod %}

{% panel style="info", title="マルチリソースの設定" %}
一つのリソース構成ファイルを `\n---\n` で分割すると、複数のリソースを宣言できます。

{% endpanel %}

## CRUD 操作

### リソースの作成

リソース構成に宣言されているがまだ存在しないリソースは、Apply 実行時に作成されます。

### リソースの更新

リソース構成に宣言されていて、すでに存在するリソースは、Apply 実行時に更新されることがあります。

**追加のフィールド**

リソース構成に追加されたフィールドはリソースに追加されます。

**更新されたフィールド**

ローカルのリソース構成に指定されたフィールドの値がリソース内の値と異なる場合、リソース構成を稼働中のリソースにマージすることによって更新されます。詳細は [merging](field_merge_semantics.md) を確認してください。

**削除されたフィールド**

前回の Apply 実行時にリソース構成に存在したが削除されたフィールドは、リソースから削除され、デフォルト値に戻されます。

**管理されていないフィールド**

リソース構成に指定されていないがリソースにセットされているフィールドは、修正されずにそのまま残されます。

### リソースの削除

リソースの宣言的な削除は、まだ利用に適した形では存在しません。現在開発中です。

{% panel style="info", title="地道な継続的 Apply" %}
時には、リソース構成が変更されたら自動的に変更を Apply するのが便利な場合もあります。

たとえば Apply を定期的に実行するために UNIX の `watch` コマンドを使います。`watch -n 60 kubectl apply -k https://github.com/myorg/myrepo`

{% endpanel %}

## リソース作成の順序

あるリソースタイプが、先に作成される他のリソースタイプに依存することがあります。たとえば、名前空間上のリソース、Role 上の RoleBinding、CRD 上の CustomResource などです。

`kustomization.yaml` を使うと、Apply は上記のような依存関係をもつリソースが正しい順序で作成されるように、リソースタイプによってリソースを並び替えます。
