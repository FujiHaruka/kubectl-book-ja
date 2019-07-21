{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/JH35X82)**

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- クラスタ内で実行中のリソースについて要約を取得する

{% endpanel %}

# リソースを要約する

## 動機

リソースとその状態を簡単に要約します。

リソースの状態を表形式で要約するのは、アプリケーションの開発時や問題の優先度を分類するときにクラスタの状態を表示する最も一般的な方法です。多くのリソースがある中で、**表形式の表示は最も関連する情報の要約をコンパクトにまとめます**。

## Get

`kubectl get` はリソースをクラスタから読み込み、出力としてフォーマットします。この章の例では、引数に**リソースタイプ**を指定して get することでリソースを検索します。

{% method %}

### デフォルト

出力フォーマットが指定されなければ、get はデフォルトの列を表示します。

**注意:** いくつかの列ではリソース上のフィールドを直接表示せずに、フィールドの要約を表示することがあります。

{% sample lang="yaml" %}

```bash
kubectl get deployments nginx
```

```bash
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx     1         1         1            0           5s
```

{% endmethod %}

- - -

{% method %}

### Wide

デフォルトの列に追加でいつくかの列を表示します。

**注意:** いくつかの列ではリソース上のフィールドを直接表示せずに、フィールドの要約を表示することがあります。

{% sample lang="yaml" %}

```bash
kubectl get -o=wide deployments nginx
```

```bash
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE       CONTAINERS   IMAGES    SELECTOR
nginx     1         1         1            1           26s       nginx        nginx     app=nginx
```

{% endmethod %}

- - -

{% method %}

### カスタム列

特定のフィールドを列に指定して表示します。

**注意:** カスタム列は `-o custom-columns-file` を使ってファイルから読み取ることもできます。

{% sample lang="yaml" %}

```bash
kubectl get deployments -o custom-columns="Name:metadata.name,Replicas:spec.replicas,Strategy:spec.strategy.type"
```

```bash
Name      Replicas   Strategy
nginx     1          RollingUpdate
```

{% endmethod %}

- - -

{% method %}

#### ラベル

特定のラベルを表の列にして表示します。

{% sample lang="yaml" %}

```bash
kubectl get deployments -L=app
```

```bash
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE       APP
nginx     1         1         1            1           8m        nginx
```

{% endmethod %}

- - -

{% method %}

### ラベルの表示

各リソースのすべてのラベルを一つの列に表示します (最後の列になります)。

{% sample lang="yaml" %}

```bash
kubectl get deployment --show-labels
```

```bash
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE       LABELS
nginx     1         1         1            1           7m        app=nginx
```

{% endmethod %}

- - -

{% method %}

### 種類の表示

Name 列の一部として Group.Kind を表示します。

**注意:** これはユーザーがグループをコマンド内で指定せず、どの API が使われているかを知りたいときに便利かもしれません。

{% sample lang="yaml" %}

```bash
kubectl get deployments --show-kind
```

```bash
NAME                          DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deployment.extensions/nginx   1         1         1            1           8m
```

{% endmethod %}
