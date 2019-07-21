{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/JH35X82)**

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- 命令的にリソースを作成する

{% endpanel %}

# リソースの作成

## 動機

開発やデバッグの用途でリソースをコマンドラインから直接作成します。本番環境でのアプリケーション管理には向いていません。

{% method %}

## Deployment

Deployment は `create deployment` コマンドで作成できます。

{% sample lang="yaml" %}

```bash
kubectl create deployment my-dep --image=busybox
```

{% endmethod %}

{% panel style="success", title="起動とアタッチ" %}
コンテナを起動した直後にアタッチするには `-i -t` フラグを使用します。例:
`kubectl run -t -i my-dep --image ubuntu -- bash`

{% endpanel %}

{% method %}

## ConfigMap

ファイル、ディレクトリ、特定のリテラル値に基づく ConfigMap を作成します。

一つの ConfigMap は一つ以上のキーバリュー値をまとめて持つことができます。

ファイルに基づく ConfigMap を作成するとき、キー名はデフォルトでファイルの basename になり、値はデフォルトでファイルの内容になります。basename が不正なキー名である場合、別のキー名を指定することもできます。

ディレクトリに基づく ConfigMap を作成するとき、ディレクトリ内のファイルの basename がキー名として正当であれば、ConfigMap の中にパッケージにされます。キー名として不正なファイルは虫されます (subdirectories、symlinks、devices、pipes など)。

{% sample lang="yaml" %}

```bash
# Create a new configmap named my-config based on folder bar
kubectl create configmap my-config --from-file=path/to/bar
```

```bash
# Create a new configmap named my-config with specified keys instead of file basenames on disk
kubectl create configmap my-config --from-file=key1=/path/to/bar/file1.txt --from-file=key2=/path/to/bar/file2.txt
```

```bash
# Create a new configmap named my-config with key1=config1 and key2=config2
kubectl create configmap my-config --from-literal=key1=config1 --from-literal=key2=config2
```

```bash
# Create a new configmap named my-config from an env file
kubectl create configmap my-config --from-env-file=path/to/bar.env
```

{% endmethod %}

{% method %}

## Secret

my-secret という名前の Secret を新規作成します。bar フォルダの各ファイルがキーになります。

{% sample lang="yaml" %}

```bash
kubectl create secret generic my-secret --from-file=path/to/bar
```

{% endmethod %}

{% panel style="success", title="構成のブートストラップ" %}
命令的なコマンドは `--dry-run -o yaml` を使用することでリソース構成のブートストラップとして使えます。
`kubectl create secret generic my-secret --from-file=path/to/bar --dry-run -o yaml`

{% endpanel %}

{% method %}

## 名前空間

my-namespace という名前の名前空間を新規作成します。

{% sample lang="yaml" %}

```bash
kubectl create namespace my-namespace
```

{% endmethod %}

## Auth リソース

{% method %}

### ClusterRole

API Group を指定して "foo" という名前の ClusterRole を作成します。

{% sample lang="yaml" %}

```bash
kubectl create clusterrole foo --verb=get,list,watch --resource=rs.extensions
```

{% endmethod %}

{% method %}

### ClusterRoleBinding

ユーザーにクラスタの管理者権限を与えることのできる Role を作成します。

{% sample lang="yaml" %}

```bash
kubectl create clusterrolebinding <choose-a-name> --clusterrole=cluster-admin --user=<your-cloud-email-account>
```

{% endmethod %}

{% panel style="info", title="要求された管理者権限" %}
cluster-admin role は新しい RBAC バインディングを作成するために要求されることがあります。


{% endpanel %}

{% method %}

### Role

API Group を指定した "foo" という名前の Role を作成します。

{% sample lang="yaml" %}

```bash
kubectl create role foo --verb=get,list,watch --resource=rs.extensions
```

{% endmethod %}

{% method %}

### RoleBinding

user1、user2、group1 が管理者用の ClusterRole を使えるようになるために RoleBinding を作成します

{% sample lang="yaml" %}

```bash
kubectl create rolebinding admin --clusterrole=admin --user=user1 --user=user2 --group=group1
```

{% endmethod %}

{% method %}

### ServiceAccount

my-service-account という名前の Service Account を新規作成します。

{% sample lang="yaml" %}

```bash
kubectl create serviceaccount my-service-account
```

{% endmethod %}
