{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の間違いは [GitHub の翻訳リポジトリ](https://github.com/FujiHaruka/kubectl-book-ja/issues) までお願いします。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- プロジェクト内で宣言されたすべてのリソースにラベルを設定するには `commonLables` を使用する
- プロジェクト内で宣言されたすべてのリソースにアノテーションを設定するには `commonAnnotations` を使用する

{% endpanel %}

# ラベルとアノテーションを設定する

## 動機

プロジェクト内のすべてのリソースに共通のラベルやアノテーションを定義したくなることがあります。

- リソースに付けられたラベルを検索することでプロジェクト内のリソースを識別する
- プロジェクト内のすべてのリソースにメタデータを設定する (たとえば `environment=test`)
- 既存のプロジェクトをコピーまたはフォークして、ラベルとアノテーションを追加または変更する

プロジェクトのコピーについて詳細は [Bases and Variations](../app_customization/bases_and_variants.md) を確認してください。

{% panel style="info", title="Reference" %}

- [commonLabels](../reference/kustomize.md#commonlabels)
- [commonAnnotations](../reference/kustomize.md#commonannotations)

{% endpanel %}

## すべてのリソースにラベルを設定する

{% method %}

**例:** プロジェクト内のすべてのリソースに `commonLabels` に宣言されたラベルを追加する

**重要:** 一度設定した commonLabels は変更すべきではありません。Service やワークロードのセレクタを変更しないためです。

{% sample lang="yaml" %}

**入力:** kustomization.yaml ファイルと deployment.yaml ファイル

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
commonLabels:
  app: foo
  environment: test
resources:
- deployment.yaml
```

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
    bar: baz
spec:
  selector:
    matchLabels:
      app: nginx
      bar: baz
  template:
    metadata:
      labels:
        app: nginx
        bar: baz
    spec:
      containers:
      - name: nginx
        image: nginx
```

**適用:** クラスタに適用されるリソース

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: foo # Label was changed
    environment: test # Label was added
    bar: baz # Label was ignored
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: foo # Selector was changed
      environment: test # Selector was added
      bar: baz # Selector was ignored
  template:
    metadata:
      labels:
        app: foo # Label was changed
        environment: test # Label was added
        bar: baz # Label was ignored
    spec:
      containers:
      - image: nginx
        name: nginx
```

{% endmethod %}

{% panel style="warning", title="ラベルのセレクタへの伝播" %}
各リソースに付けられたラベルを更新すると、セレクタもそのラベルを対象とするように更新されます。たとえば、プロジェクト内の Service を取得するセレクタは、他のラベル**に加えて** commonLabels を含むように更新されます。

**注意:** 一度 commonLabels を設定したら、変更すべきではありません。Service やワークロードを取得するセレクタを変更しないためです。

{% endpanel %}

{% panel style="success", title="共通のラベル" %}
k8s.io ドキュメントではアプリケーションに適用可能な[共通ラベルの規則](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/)を定義しています。

**注意:** commonLabels は**不変の**ラベルにだけ設定されるべきです。セレクタに適用されるからです。

ワークロードリソースにラベル付けすることは、Pod へのクエリを単純にします - たとえば、Pod のログを取得する目的でラベルを付けます。

{% endpanel %}

## すべてのリソースにアノテーションを設定する

{% method %}

**例:** プロジェクト内のすべてのリソースに `commonAnnotations` で宣言されたアノテーションを追加する

{% sample lang="yaml" %}

**入力:** kustomization.yaml ファイルと deployment.yaml ファイル

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
commonAnnotations:
  oncallPager: 800-555-1212
resources:
- deployment.yaml
```

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
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
      - name: nginx
        image: nginx
```

**適用:** クラスタに適用されるリソース

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  # Annotation added to the Deployment
  annotations:
    oncallPager: 800-555-1212
  labels:
    app: nginx
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      # Annotation also added to PodTemplate
      annotations:
        oncallPager: 800-555-1212
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
```

{% endmethod %}

{% panel style="info", title="アノテーションの伝播" %}
各リソースのアノテーションを更新すると、ObjectMeta を含むすべてのフィールド (たとえば PodTemplate) にもアノテーションが追加されます。

{% endpanel %}
