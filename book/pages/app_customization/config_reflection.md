{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- 他のリソース構成のフィールドを `vars` によって Pod の環境変数とコマンドの引数に注入する

{% endpanel %}

# 構成の反映

## 動機

Pod 内で稼働しているアプリケーションがアプリケーションのコンテキストや設定について知りたくなることがあります。たとえば、**Pod はプロジェクト内で定義されている Service 名をコマンド引数から取ることができます**。
Service の値を PodSpec に直接ハードコーディングするのではなく、**`vars` エントリを使って Service の値を参照**することができます。
その値が `kustomization.yaml` によって (たとえば `namePrefix` を設定して) 更新また変更されると、PodSpec の中で参照されている場所まで値が伝播します。

{% panel style="info", title="Reference" %}

- [vars](../reference/kustomize.md#var)

 {% endpanel %} 

## Vars

`vars` セクションはプロジェクト内のリソース構成のフィールドに参照を持つ変数を含みます。以下を定義する必要があります。

- リソースの種類
- リソースのバージョン
- リソース名
- フィールドのパス

{% method %}

**例:** Pod のコマンドライン引数を Service 名の値に設定する。

Apply 時に `$(BACKEND_SERVICE_NAME)` は `vars` で指定されたオブジェクトの参照を使った値に解決されます。

{% sample lang="yaml" %}

**入力:** kustomization.yaml、deployment.yaml、service.yaml ファイル

```yaml
# kustomization.yaml
namePrefix: "test-"
vars:
  # Name of the variable so it can be referenced
- name: BACKEND_SERVICE_NAME
  # GVK of the object with the field
  objref:
    kind: Service
    name: backend-service
    apiVersion: v1
  # Path to the field
  fieldref:
    fieldpath: metadata.name
resources:
- deployment.yaml
- service.yaml
```

```yaml
# service.yaml
kind: Service
apiVersion: v1
metadata:
  # Value of the variable.  This will be customized with
  # a namePrefix, and change the Variable value.
  name: backend-service
spec:
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
```

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: curl-deployment
  labels:
    app: curl
spec:
  selector:
    matchLabels:
      app: curl
  template:
    metadata:
      labels:
        app: curl
    spec:
      containers:
      - name: curl
        image: ubuntu
        # Reference the Service name field value as a variable
        command: ["curl", "$(BACKEND_SERVICE_NAME)"]
```

**適用:** クラスタに適用されるリソース

```yaml
apiVersion: v1
kind: Service
metadata:
  name: test-backend-service
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: 9376
  selector:
    app: backend
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test-curl-deployment
  labels:
    app: curl
spec:
  selector:
    matchLabels:
      app: curl
  template:
    metadata:
      labels:
        app: curl
    spec:
      containers:
      - command:
        - curl
        # $(BACKEND_SERVICE_NAME) has been resolved to
        # test-backend-service
        - test-backend-service
        image: ubuntu
        name: curl
```

{% endmethod %}

{% panel style="warning", title="変数の参照" %}
変数はリソース構成を Pod に注入するためのものであり、他の用途に向いていません。変数は一般的なテンプレート機構として使う**べきではありません**。値の上書きは変数ではなく patch で行ってください。[ベースとバリエーション](bases_and_variants)を参照してください。

{% endpanel %}
