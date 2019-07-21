{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/C855WZW)**

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- Base の任意のリソースから任意のフィールドをカスタマイズする

{% endpanel %}

# リソースのフィールドをカスタマイズする

## 動機

ユーザーが Base から**任意のフィールドを修正**したくなることがよくあります。たとえば Pod のリソース割り当て予約や Deployment のレプリカ数といったフィールドです。Overlay や patch を使うと、バリエーションで Base のフィールドを上書きするようフィールドの値を指定できます。

{% panel style="info", title="Reference" %}

- [patchesjson6902](../reference/kustomize.md#patchesjson6902)
- [patchesStrategicMerge](../reference/kustomize.md#patchesstrategicmerge)

{% endpanel %}

## Overlay によって任意のフィールドをカスタマイズする

{% method %}

Base が提供するリソースに対して Overlay を与えると任意の**フィールドを追加、変更、削除**できます。
**Overlay は疎なリソース定義であり*、これを使うと Base にカスタマイズをテンプレートとして公開させることなく任意のカスタマイズを実行できます。

Overlay にはリソースを指定するために**グループ、バージョン、種類、名前**を書く必要があります。
そこに、Base リソースに設定する任意のフィールドを記述します。Overlay は **StrategicMergePatch** を使って適用されます。

**ユースケース:** 複数の環境 (test、dev、staging、canary、prod) で、replicas や resources といったフィールドを上書きします。

{% sample lang="yaml" %}

**入力:** kustomization.yaml ファイルと overlay

```yaml
# kustomization.yaml
bases:
- ../base
patchesStrategicMerge:
- overlay.yaml
```

```yaml
# overlay.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  # override replicas
  replicas: 3
  template:
    spec:
      containers:
      - name: nginx
        # override resources
        resources:
          limits:
            cpu: "1"
          requests:
            cpu: "0.5"
```

**Base:**

```yaml
# ../base/kustomization.yaml
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
        resources:
          limits:
            cpu: "0.2"
          requests:
            cpu: "0.1"
```

**適用:** クラスタに適用されるリソース

```yaml
# Overlayed Base Resource
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nginx
  name: nginx-deployment
spec:
  # replicas field has been added
  replicas: 3
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
        # resources have been overridden
        resources:
          limits:
            cpu: "1"
          requests:
            cpu: "0.5"
```

{% endmethod %}

{% panel style="info", title="Overlay のマージ意味論" %}
Overlay はクラスタにリソース構成を Apply するのと同じ[マージの意味論](../app_management/field_merge_semantics.md)を持ちます。一点違うのは、Overlay をマージする際には**前回適用されたリソース構成**はありません。そのため、そのため、フィールドが明示的に nil に設定されると、フィールドがただ削除されるという結果になります。

{% endpanel %}

## JsonPath による任意のフィールドのカスタマイズ

{% method %}

Base が提供するリソースに対して、**JSON Patch** を与えることで任意のフィールドを追加、変更、削除できます。

**ユースケース:** 複数の環境 (test、dev、staging、canary、prod) で、replicas や resources といったフィールドを上書きします。

JSON Patch は [RFC 6902](https://tools.ietf.org/html/rfc6902) で定められ、リソースに適用されるパッチとなります。Patch はリソースを指定するために、Patch 本体に加えて**グループ、バージョン、種類、名前**が必要です。Patch は Base のリソースを修正するために多くのパワフルな命令的操作を提供します。

{% sample lang="yaml" %}

**入力:** kustomization.yaml ファイル

```yaml
# kustomization.yaml
bases:
- ../base
patchesJson6902:
- target:
    group: apps
    version: v1
    kind: Deployment
    name: nginx-deployment
  path: patch.yaml
```

```yaml
# patch.yaml
- op: add
  path: /spec/replicas
  value: 3
```

```yaml
# ../base/kustomization.yaml
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
```

**適用:** クラスタに適用されるリソース

```yaml
# Patched Base Resource
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nginx
  name: nginx-deployment
spec:
  # replicas field has been added
  replicas: 3
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
```

{% endmethod %}
