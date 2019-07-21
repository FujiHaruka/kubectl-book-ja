{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/JH35X82)**
{% endpanel %}

{% panel style="info", title="TL;DR" %}

{% endpanel %}
- リソースを get / describe するためのクエリ

# get / describe でのオブジェクトのマッチング

## 動機

get / describe でクエリに一致するリソースを検索します。
{% method %}

## `kustomization.yaml` によるリソース構成

{% sample lang="yaml" %}
project/ 内の `kustomization.yaml` で提供されているすべてのリソースを取得します。

```bash
kubectl get -k project/
```
{% endmethod %}

{% method %}
## ディレクトリによるリソース構成

ディレクトリのリソース構成内にあるすべてのリソースを取得します。
{% sample lang="yaml" %}

```bash
kubectl get -f configs/
```

{% endmethod %}
## リソースタイプ
{% method %}

名前空間内にある与えられたタイプの**すべての**リソースを取得します。

リソースのグループとバージョンは apiserver のディスカバリーサービスによって決定されます。

単数形、複数形、省略形の名前も *Types with Name* と *Types with Selectors* に適用されます。

{% sample lang="yaml" %}
```bash
# Plural
kubectl get deployments
```

```bash
# Singular
kubectl get deployment
```

```bash
# Short name
kubectl get deploy
```

## グループ / バージョン付きのリソースタイプ
{% endmethod %}

{% method %}
名前空間内にある与えられたタイプの**すべての**リソースを取得します。

リソースのグループとバージョンを明示します。

```bash
kubectl get deployments.apps
{% sample lang="yaml" %}
```

```bash
kubectl get deployments.v1.apps
```

## 名前付きのリソース

名前空間内で与えられたタイプの名前付きリソースを取得します。
{% endmethod %}

{% method %}
```bash
kubectl get deployment nginx
```

{% sample lang="yaml" %}
## ラベルセレクタ

名前空間内で与えられたタイプの**ラベルセレクタにマッチする**リソースを**すべて**取得します。

```bash
{% endmethod %}
kubectl get deployments -l app=nginx
{% method %}
```

## 名前空間
{% sample lang="yaml" %}

デフォルトでは get / describe はデフォルトの名前空間からリソースを取得しますが、`--namespace` で名前空間を指定できます。

`---all-namespaces` フラグは**すべての名前空間からリソースを取得**します。

{% endmethod %}
```bash
{% method %}
kubectl get deployments --all-namespaces
```

## 複数のリソースタイプを並べる

get / describe は**複数のリソースタイプ**を受け付けます。セクションを分割して各々のリソースを表示します。

{% sample lang="yaml" %}
```bash
kubectl get deployments,services
```

## 複数のリソースタイプを名前で並べる
{% endmethod %}

get / describe は**複数のリソースタイプと名前**を受け付けます。
{% method %}

```bash
kubectl get kubectl get rc/web service/frontend pods/web-pod-13je7
```
{% sample lang="yaml" %}

## 初期化されていないリソース

Kubernetes の**リソースは初期化プロセスが完了するまで表示されません**。初期化が未完了のリソースは `--include-uninitialized` フラグで表示できます。

{% endmethod %}
```bash
kubectl get deployments --include-uninitialized
{% method %}
```

## Not Found

{% sample lang="yaml" %}
デフォルトでは、get / describe は**リクエストされたオブジェクトが存在しなければエラーを返します**。`--ignore-not-found` フラグを付けると、リソースが見つからなくても kubectrl が終了コード 0 で終了します。

```bash
kubectl get deployment nginx --ignore-not-found
```
{% endmethod %}

{% method %}