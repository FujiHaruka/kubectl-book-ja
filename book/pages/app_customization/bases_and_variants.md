{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- `kustomization.yaml` の構成をベースとしたリソース構成の再利用
- 複数の環境向けにベースをカスタマイズする
- 複数のプロジェクトをまたいだベースの再利用

{% endpanel %}

# ベースとバリエーション

## 動機

ユーザーが**一つのリソース構成を変形して**複数の構成をデプロイしたり、**同じリソース構成を再利用**したりすることはよくあります。
`kustomization.yaml` によって作成されたリソース構成は、`kustomization.yaml` を**ベース**とし、複数のプロジェクトをまたいで再利用することができます。

例。

- **dev、test、staging、canary、production 環境**にデプロイされるプロジェクトで、各環境で設定が違っている
- **複数のクラスタ**にデプロイされるプロジェクトで、各クラスタでプロジェクトの設定やバージョンが異なっている

{% panel style="info", title="Reference" %}

- [bases](../reference/kustomize.md#bases)

 {% endpanel %}

## ベース

ベースは `kustomization.yaml` の中で共有されるリソース構成で、別の `kustomization.yaml` が利用したりカスタマイズしたりします。

ベースの例。

- Common Java Base
  - 複数のアプリで使用 (ゲストブック、カレンダー、認証など)
- Common Guest Book App Base
  - 複数の環境で使用 (test、staging、production など)
- Common Prod Guest Book App Base
  - 複数のクラスタで使用 (us-west、us-east、us-canary など)

## ベースへの参照

プロジェクトにベースを追加するには、別の `kustomization.yaml` があるディレクトリのパス (`kustomization.yaml` への相対パス) を **`base`** に追加します。これによって、ベースプロジェクトから現プロジェクトにすべてのリソースが自動的に追加、kustomize されます。

ベースの取りうる値は以下です。

- `kustomization.yaml` からの相対パス - たとえば `../base`
- URL - たとえば `github.com/kubernetes-sigs/kustomize/examples/multibases?ref=v1.0.6`

### 図

単一のベースが単一のアプリケーションに継承される

```mermaid
graph TD;
  B[B]-->A[A];
```

ベースを共有し、異なるアプリケーションに継承される

```mermaid
graph TD;
  B1[B1]-->A1[A1];
  B2[B2]-->A1[A1];
  B2[B2]-->A2[A2];
  B3[B3]-->A2[A2];
```

{% method %}

**例:** `kustomization.yaml` をベースとして追加する

{% sample lang="yaml" %}

**入力:** kustomization.yaml ファイル

```yaml
# kustomization.yaml
bases:
- ../base
```

**ベース:** kustomization.yaml とリソース構成

```yaml
# ../base/kustomization.yaml
configMapGenerator:
- name: my-java-server-env-vars
  literals:	
  - JAVA_HOME=/opt/java/jdk
  - JAVA_TOOL_OPTIONS=-agentlib:hprof
resources:
- deployment.yaml
```

```yaml
# ../base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nginx
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
        volumeMounts:
        - mountPath: /etc/config
          name: config-volume
      volumes:
      - configMap:
          name: my-java-server-env-vars
        name: config-volume
```

**適用:** クラスタに適用されるリソース

```yaml
# Unmodified Generated Base Resource
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-java-server-env-vars-k44mhd6h5f
data:
  JAVA_HOME: /opt/java/jdk
  JAVA_TOOL_OPTIONS: -agentlib:hprof
---
# Unmodified  Config Resource
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nginx
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
        volumeMounts:
        - mountPath: /etc/config
          name: config-volume
      volumes:
      - configMap:
          name: my-java-server-env-vars-k44mhd6h5f
        name: config-volume
```

{% endmethod %}

{% panel style="info", title="ベース内のベース" %}
ベース自体にもバリエーションとそのベースを作れます。
詳細は [Advanced Composition](../app_composition_and_deployment/structure_multi_tier_apps.md) をご覧ください。

{% endpanel %}

```mermaid
graph TD;
  B1[B1]-->B2[B2];
  B2[B2]-->A[A];
```
