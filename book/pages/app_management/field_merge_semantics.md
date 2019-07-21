{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/CLQBQHR)**
{% endpanel %}

{% panel style="info", title="TL;DR" %}

- リソース構成から追加また削除されたフィールドは Apply を実行することでリソースにマージされる
  - すでにリソースが存在していれば、Apply を実行するとリソースが更新され、ローカルにあるリソース構成がリモートのリソースにマージされる
{% endpanel %}
  - リソース構成から除かれたフィールドは、リモートのリソースから削除される

# フィールドのマージ

{% panel style="warning", title="高度な内容" %}
{% endpanel %}
この章には高度な内容が含まれるため、読み飛ばして後から戻っても構いません。

## フィールドはマージされるのはいつか？

このページでは、リソース構成がどのようにリソースとマージされるか、あるいはどのように他のリソース構成とマージされるかを説明します。マージされるタイミングは以下です。

- リソース構成の更新をクラスタ内で稼働中のリソースに適用する
- `kustomization.yaml` の中で `resources` および [bases](../app_customization/bases_and_variants.md) 上にパッチを定義する

### リソース構成の更新を適用する

Apply は新しいリソース構成を使ってリソースを置換するのではなく、**新しいリソース構成を稼働中のリソースにマージします**。そのために制御プレーンによって設定されうる値、たとえば autoscaler により設定される `replicas` の値などを保持します。

### パッチを定義する

`patches` は疎なリソース構成で、**他のリソース構成の中で定義された値を上書きするフィールドのサブセットを含みます**。上書き対象となるリソースは、同じグループ / バージョン / Kind / 名前空間をもつものです。これはリソース構成をフォークせずに、リソース構成で定義された値を変更するために使用されます。

## 動機 (Apply)

このページではリソース構成をマージするための意味論を説明します。

リソースフィールドの所有権は、人間の手で書かれた宣言的なリソース構成と、クラスタ内で実行されるコントローラが設定した値との間で共有されます。`status` や `clusterIp` のようないくつかのフィールドは、コントローラが排他的に所有します。`namespace` などのフィールドは、リソースを管理する人間が排他的に所有します。

`replicas` のような他のフィールドは、人間が所有することもありますし、apiserver やコントローラが所有することもあります。たとえば、`replicas` はユーザーが排他的に設定することもできますが、apiserver が暗黙的にデフォルト値を設定することもあり、あるいは HorizontalPodAutoscaler のようなコントローラが継続的に調整することもあります。

### 前回適用されたリソース構成

Apply はリソースを作成または更新するときに、適用されたリソース構成をリソース上のアノテーションに書き込みます。これによって前回適用されたリソース構成と今回のリソース構成を比較することができ、削除されたフィールドを特定できます。

```yaml
# deployment.yaml (Resource Config)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
{% method %}
spec:
  selector:
    matchLabels:
      app: nginx
  template:
{% sample lang="yaml" %}
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
```

```yaml
# Original Resource
Doesn't Exist
```

```yaml
# Applied Resource
kind: Deployment
metadata:
  annotations:
    # ...
    # This is the deployment.yaml Resource Config written as an annotation on the object
    # It was written by kubectl apply when the object was created
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.7.9","name":"nginx"}]}}}}
  # ...
spec:
  # ...
status:
  # ...
```

## リソースをマージする

以下はリソースをマージするときの意味論です。

フィールドの追加

- リソース構成に存在しているがリソースに欠落しているフィールドは、リソースに追加される
- フィールドは前回適用されたリソース構成に追加される

```yaml
# deployment.yaml (Resource Config)
apiVersion: apps/v1
kind: Deployment
{% endmethod %}
metadata:
  # ...
  name: nginx-deployment
spec:
  # ...
{% method %}
  minReadySeconds: 3
```

```yaml
# Original Resource
{% sample lang="yaml" %}
kind: Deployment
metadata:
  # ...
  name: nginx-deployment
spec:
  # ...
status:
  # ...
```

```yaml
# Applied Resource
kind: Deployment
metadata:
  # ...
  name: nginx-deployment
spec:
  # ...
  minReadySeconds: 3
status:
  # ...
```

**フィールドの更新**

- リソース構成にもリソースにも存在しているフィールドは、再帰的にマージされ、末端のプリミティブ値のフィールドが更新されるか、またはフィールドが追加 / 削除される
- フィールドは前回適用されたリソース構成の中で更新される

```yaml
# deployment.yaml (Resource Config)
apiVersion: apps/v1
kind: Deployment
metadata:
  # ...
  name: nginx-deployment
spec:
  # ...
{% endmethod %}
  replicas: 2
{% method %}
```

```yaml
# Original Resource
kind: Deployment
{% sample lang="yaml" %}
metadata:
  # ...
  name: nginx-deployment
spec:
  # ...
  # could be defaulted or set by Resource Config
  replicas: 1
status:
  # ...
```

```yaml
# Applied Resource
kind: Deployment
metadata:
  # ...
  name: nginx-deployment
spec:
  # ...
  # updated
  replicas: 2
status:
  # ...
```

**フィールドの削除**

- **前回適用されたリソース構成**に存在するが現在のリソース構成で除かれたフィールドは、リソースから削除される
- リソース構成で **null** 値で存在しているフィールドはリソースから削除される
- フィールドは前回適用されたリソース構成から除かれる

```yaml
# deployment.yaml (Resource Config)
apiVersion: apps/v1
kind: Deployment
metadata:
  # ...
  name: nginx-deployment
spec:
  # ...
{% endmethod %}
```
{% method %}

```yaml
# Original Resource
kind: Deployment
metadata:
  # ...
  name: nginx-deployment
  # Containers replicas and minReadySeconds
{% sample lang="yaml" %}
  kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment", "spec":{"replicas": "2", "minReadySeconds": "3", ...}, "metadata": {...}}
spec:
  # ...
  minReadySeconds: 3
  replicas: 2
status:
  # ...
```

```yaml
# Applied Resource
kind: Deployment
metadata:
  # ...
  name: nginx-deployment
  kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment", "spec":{...}, "metadata": {...}}
spec:
  # ...
  # deleted and then defaulted, but not in Last Applied
  replicas: 1
  # minReadySeconds deleted
status:
  # ...
```

{% panel style="danger", title="リソース構成からフィールドを削除する" %}
リソース構成から単にフィールドを除くだけでは所有権がクラスタに移ることは**ありません**。そうではなくリソースからフィールドを削除します。もしフィールドがリソース構成の中に設定され、ユーザーが所有権を放棄したい (たとえば `replicas` をリソース構成から除いて autoscaler に頼る) と思ったら、最初に、クラスタに保存されている前回適用されたリソース構成からフィールドを削除しなければなりません。

これを実行するには、`kubectl apply edit-last-applied` コマンドを使い、**前回適用されたリソース構成**から `replicas` を削除し、次に**リソース構成**からも削除します。

## フィールドのマージの意味論

### プリミティブ値のマージ

プリミティブ値のフィールドは現在の値を新しい値に置換することでマージします。

**フィールドの作成:** プリミティブ値のフィールドを追加

**フィールドの更新:** プリミティブ値のフィールドの値を変更

**フィールドの削除:** プリミティブ値のフィールドを削除

| リソース構成内のフィールド | リソース内のフィールド | 前回適用されたフィールド | アクション                |
{% endmethod %}
| ------------- | ----------- | ------------ | -------------------- |
| Yes           | Yes         | -            | 稼働中のリソースにリソース構成の値を設定 |
| Yes           | No          | -            | 稼働中のリソースにリソース構成の値を設定 |
| No            | -           | Yes          | リソースから削除             |
| No            | -           | No           | 何もしない                |

### オブジェクトのマージ

オブジェクトのフィールドは下位のフィールドを (フィールド名で) 再帰的にマージすることによって更新します。マージは末端でプリミティブ値のフィールドが見つかるか、フィールドを追加 / 削除するまで続きます。

{% endpanel %}
**フィールドの作成:** オブジェクトのフィールドを追加

**フィールドの更新:** 再帰的にオブジェクトの下位のフィールドを見て値を比較し、マージする

**フィールドの削除:** オブジェクトのフィールドを削除

**テーブルのマージ:** 各フィールドに対してリソース構成と同名のリソースの値をマージ

| リソース構成内のフィールド | リソース内のフィールド | 前回適用されたフィールド | アクション                   |
| ------------- | ----------- | ------------ | ----------------------- |
| Yes           | Yes         | -            | 再帰的にリソース構成とリソースの値をマージする |
| Yes           | No          | -            | 稼働中のリソースにリソース構成の値を設定    |
| No            | -           | Yes          | リソースからフィールドを削除する        |
| No            | -           | No           | 何もしない                   |

### マップのマージ

マップフィールドは要素を (キーで) マージします。マージは末端でプリミティブ値のフィールドが見つかるか、値が追加 / 削除されるまで続きます。

**フィールドの削除:** マップフィールドを追加

**フィールドの更新:** 再帰的にマップの値をキーで比較し、マージする

**フィールドの削除:** マップフィールドを削除

**テーブルのマージ:** 各マップの要素に対してリソース構成と同キーのリソースの値をマージ

| リソース構成内のキー | リソース内のキー | 前回適用されたリソース構成内のキー | アクション                   |
| ---------- | -------- | ----------------- | ----------------------- |
| Yes        | Yes      | -                 | 再帰的にリソース構成とリソースの値をマージする |
| Yes        | No       | -                 | 稼働中のリソースにリソース構成の値を設定    |
| No         | -        | Yes               | リソースから要素を削除             |
| No         | -        | No                | 何もしない                   |

### プリミティブ値のリストのマージ

プリミティブ値のリストは、フィールドに `patch strategy: merge` が設定されていればマージされ、そうでなければ置換されます。 [Finalizer list example](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.12/#objectmeta-v1-meta)

**マージ戦略**

- プリミティブ値のリストのマージは ordered set の挙動と似ています
- プリミティブ値のリストの置換はマージ時に置換されます

**順序付け:** リソース構成の中で定義された順序を使用します。リソース構成に定義されていない要素は、リソース構成内の要素に関して順序の保証はありません。

**マージテーブル:** 各リストの要素はリソース構成とリソースの要素を同じ値でマージします

| リソース構成の要素 | リソースの要素 | 前回適用されたリソース構成の要素 | アクション   |
| --------- | ------- | ---------------- | ------- |
| Yes       | Yes     | -                | 何もしない   |
| Yes       | No      | -                | リストに追加  |
| No        | -       | Yes              | リストから除く |
| No        | -       | No               | 何もしない   |

このマージ戦略は patch merge key を使ってリスト内のコンテナ要素を識別し、マージします。`patch merge key` はフィールド上の [Kubernetes API](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.12/#podspec-v1-core) で定義されています。

```yaml
# Last Applied
args: ["a", "b"]
```

```yaml
# Resource Config (Local)
args: ["a", "c"]
```

```yaml
# Resource (Live)
args: ["a", "b", "d"]
```

```yaml
# Applied Resource
args: ["a", "c", "d"]
```

### オブジェクトのリストのマージ

**マージ戦略:** プリミティブ値のリストはマージされるか置換されるかします。リストの `patch strategy` が **merge** でリストフィールドに `patch merge key` があるとき、リストはマージされます。 [Container list example](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.12/#podspec-v1-core)

**マージキー:** `patch merge key` はリスト内の同じ要素を識別するために使用されます。 map の要素 (キーによるキー) やオブジェクトのフィールド (フィールド名によるキー) と違って、リストは各要素を区別するビルトインの識別子がありません (インデックスは同一性を定義しません)。オブジェクトのフィールドの代わりに、マージする要素に対して人工のキー / バリューとして使われます。このフィールドは `patch merge key` です。同じ patch merge key をもつ要素はリストがマージされるときにマージされます。

**順序:** リソース構成の中で定義された順序を使用します。リソース構成の中で定義されていない要素は順序が保証されません。
{% method %}

**マージテーブル:** 各リストの要素に対してリソース構成とリソースの要素をマージしますが、`patch merge key` の値が同じ要素をマージします。

| リソース構成の要素 | リソースの要素 | 前回適用されたリソース構成の要素 | アクション                   |
| --------- | ------- | ---------------- | ----------------------- |
{% sample lang="yaml" %}
| Yes       | -       | -                | 再帰的にリソース構成とリソースの値をマージする |
| Yes       | No      | -                | リストに追加                  |
| No        | -       | Yes              | リストから除く                 |
| No        | -       | No               | 何もしない                   |

このマージ戦略は patch merge key を使ってリスト内のコンテナ要素を識別し、マージします。`patch merge key` はフィールド上の [Kubernetes API](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.12/#podspec-v1-core) で定義されています。

```yaml
# Last Applied Resource Config
containers:
- name: nginx          # key: nginx
  image: nginx:1.10
- name: nginx-helper-a # key: nginx-helper-a; will be deleted in result
  image: helper:1.3
- name: nginx-helper-b # key: nginx-helper-b; will be retained
  image: helper:1.3
```

```yaml
# Resource Config (Local)
containers:
{% endmethod %}
- name: nginx
  image: nginx:1.10
- name: nginx-helper-b
  image: helper:1.3
- name: nginx-helper-c # key: nginx-helper-c; will be added in result
  image: helper:1.3
```

```yaml
# Resource (Live)
containers:
- name: nginx
  image: nginx:1.10
- name: nginx-helper-a
  image: helper:1.3
- name: nginx-helper-b
  image: helper:1.3
  args: ["run"] # Field will be retained
- name: nginx-helper-d # key: nginx-helper-d; will be retained
  image: helper:1.3
```

```yaml
# Applied Resource
{% method %}
containers:
- name: nginx
  image: nginx:1.10
  # Element nginx-helper-a was Deleted
- name: nginx-helper-b
{% sample lang="yaml" %}
  image: helper:1.3
  # Field was Ignored
  args: ["run"]
  # Element was Added
- name: nginx-helper-c
  image: helper:1.3
  # Element was Ignored
- name: nginx-helper-d
  image: helper:1.3
```

{% panel style="info", title="Edit と Set" %}
`kubectl edit` と `kubectl set` は前回適用されたリソース構成を無視しますが、Apply は、`kubectl edit` や `kubectl set` でセットされたリソース構成の値を変更します。`kubectl edit` や `kubectl set` でセットされた値を無視するには、以下のようにします。

- `kubectl apply edit-last-applied` を使って前回適用されたリソース構成から (もし存在すれば) 値を削除します
- リソース構成からフィールドを削除します

これは autoscaler のようなクラスタコンポーネントによって設定された値を保持するのと同じテクニックです。
