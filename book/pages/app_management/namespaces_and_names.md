{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- プロジェクト内のすべてのリソースに対して名前空間を設定するには `namespace` を使う
- プロジェクト内のすべてのリソースに対して名前の接頭辞を付けるには `namePrefix` を使う
- プロジェクト内のすべてのリソースに対して名前の接尾辞を付けるには `nameSuffix` を使う

{% endpanel %}

# 名前空間と命名の設定

## 動機

プロジェクト内のすべてのリソースに対して名前空間と命名に一貫性を強制すると便利な場合があります。

- すべてのリソースが正確な名前空間の中にあることを保証する
- すべてのリソースが共通の命名規則を共有することを保証する
- 既存のプロジェクトをコピーまたはフォークして、名前空間 / 名前を変更する

プロジェクトのコピーについての詳細は[ベースとバリエーション](../app_customization/bases_and_variants.md)を確認してください。

{% panel style="info", title="Reference" %}

- [namespace](../reference/kustomize.md#namespace)
- [namePrefix](../reference/kustomize.md#nameprefix)
- [nameSuffix](../reference/kustomize.md#namesuffix)

{% endpanel %}

## すべてのリソースに対して名前空間を設定する

Reference: 

リソース構成の中で宣言されたすべてのリソースの名前空間は `namespace` で設定できます。これにより設定される名前空間は、生成されたリソース (たとえば ConfigMap と Secret) にもそうでないリソースにも適用されます。

{% method %}

**例:** 名前空間で区切りたいリソースに対し `kustomization.yaml` の中に `namespace` を設定する

{% sample lang="yaml" %}

**入力:** kustomization.yaml ファイルと deployment.yaml ファイル

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: my-namespace
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
  labels:
    app: nginx
  name: nginx-deployment
  # The namespace has been added
  namespace: my-namespace
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

{% endmethod %}

{% panel style="info", title="名前空間の上書き" %}
名前空間の設定は、すでにリソースの名前空間が設定されている場合には、上書きされます。

{% endpanel %}

## すべてのリソースに対して名前の接頭辞や接尾辞を設定する

すべてのリソースに対して名前の接頭辞や接尾辞を設定するには `namePrefix` や `nameSuffix` を使用します。

{% method %}

**例:** すべてのリソースの名前に接頭辞を付ける

{% sample lang="yaml" %}

**入力:** kustomization.yaml ファイルと deployment.yaml ファイル

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namePrefix: foo-
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
  labels:
    app: nginx
  # The name has been prefixed with "foo-"
  name: foo-nginx-deployment
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

{% endmethod %}

{% panel style="info", title="参照先オブジェクトへの名前の伝播" %}
Deployment や StatefulSet といったリソースは、Pod 定義内で ConfigMap や Secret といった他のリソースに参照をもつことがあります。

これによって、生成されたリソース (たとえば ConfigMap と Secret) にもそうでないリソースにも名前の接頭辞や接尾辞が設定されます。

適用された namePrefix や nameSuffix は更新されたリソースを参照しているリソースに伝播します - たとえば Secret と ConfigMap への参照は namePrefix と nameSuffix と共に更新されます。

{% endpanel %}

{% method %}

**例:** すべてのリソースの名前に接頭辞を付ける

これは Deployment の中で参照されている ConfigMap が `foo` という接頭辞をもつよう更新します。

{% sample lang="yaml" %}

**入力:** kustomization.yaml ファイルと deployment.yaml ファイル

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namePrefix: foo-
configMapGenerator:
- name: props
  literals:	
  - BAR=baz
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
        env:
        - name: BAR
          valueFrom:
            configMapKeyRef:
              name: props
              key: BAR
```

**適用:** クラスタに適用されるリソース

```yaml
apiVersion: v1
data:
 BAR: baz
kind: ConfigMap
metadata:
 creationTimestamp: null
 name: foo-props-44kfh86dgg
---
apiVersion: apps/v1
kind: Deployment
metadata:
 labels:
   app: nginx
 name: foo-nginx-deployment
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
     - env:
       - name: BAR
         valueFrom:
           configMapKeyRef:
             key: BAR
             name: foo-props-44kfh86dgg
       image: nginx
       name: nginx
```

{% endmethod %}

{% panel style="info", title="参照" %}
Apply は `namePrefix` を、プロジェクト内のリソースが他のリソースによって参照されている場所ならどこへでも、伝播させます。それは以下を含みます。

- StatefulSet から参照される Service
- PodSpec から参照される ConfigMap
- PodSpec から参照される Secret

{% endpanel %}
