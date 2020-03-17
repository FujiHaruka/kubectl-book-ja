{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- リソースの特定のフィールドをフォーマットして表示します
- get コマンドでスクリプトを書くときに使います

{% endpanel %}

# リソースのフィールドを表示する

## 動機

Kubectl の get コマンドは検索したリソースからフィールドを抽出し、フォーマットして出力することができます。

これは Kubernetes クラスタからリソースについてのデータを収集または処理するスクリプトを書くときに便利です。

## Get

`kubectl get` コマンドはクラスタからリソースを読み込み、フォーマットして出力します。この章の例では、リソースを検索するためにコマンドの引数に**リソースタイプ**をバージョンとグループ名付きで与えます。検索オプションの詳細は[クエリとオプション](queries_and_options.md)をご覧ください。

リソースから特定のフィールドをフォーマットして表示するには JSON パスを使うことができます。

{% panel style="warning", title="スクリプトの落とし穴" %}
デフォルトでは、API グループやバージョンを指定しなければ、apiserver が選んだグループとバージョンが使用されます。

**リソースの構造は API グループとバージョンによって変わる可能性があるため**、`kubectl get` からフィールドを出力するときには将来のリリースでコマンドが壊れないことを保証するために、API グループとバージョンを指定することを**推奨します**。

これを省略すると、異なる API グループ / バージョンがクラスタのアップグレード後に使われ、その API グループ / バージョンがフィールドの表現を変更してしまうかもしれません。

{% endpanel %}

### JSON パス

JSON パスからフィールドを表示します。

**注意:** JSON パスはファイルから読み込むこともでき、そのためには `-o custom-columns-file` を使用します。

- JSON パステンプレートは {} で囲まれた JSONPath 記法で構成されます。もともとの JSONPath 構文に加えて、いつくかの拡張が追加されています。
  - `$` 演算子はオプショナルです (デフォルトではルートオブジェクトから式が始まります)
  - JSONPath 式の中ではテキストの引用符に "" を使います
  - リストをイテレートするには range 演算子を使います
  - スライスのインデックスの負数を使うとリストを後ろから逆方向に進みます。負のインデックスはリストを「包み込み」ません。負のインデックスが有効な範囲は -index + listLength >= 0 です。

### JSON パスの記号一覧

| 機能                | 説明                       | 例                                                             | 結果                                              |
| ----------------- | ------------------------ | ------------------------------------------------------------- | ----------------------------------------------- |
| text              | プレーンテキスト                 | 種類は {.kind}                                                   | 種類は List                                        |
| @                 | 現在のオブジェクト                | {@}                                                           | 入力と同じ                                           |
| . or []           | 子演算子                     | {.kind} or {[‘kind’]}                                         | List                                            |
| ..                | 再帰的降下                    | {..name}                                                      | 127.0.0.1 127.0.0.2 myself e2e                  |
| *                 | ワイルドカード。全オブジェクトを取得       | {.items[*].metadata.name}                                     | [127.0.0.1 127.0.0.2]                           |
| [start:end :step] | subscript operator       | {.users[0].name}                                              | myself                                          |
| [,]               | ユニオン演算子                  | {.items[*][‘metadata.name’, ‘status.capacity’]}               | 127.0.0.1 127.0.0.2 map[cpu:4] map[cpu:8]       |
| ?()               | フィルター                    | {.users[?(@.name==“e2e”)].user.password}                      | secret                                          |
| range, end        | リストのイテレート                | {range .items[*]}[{.metadata.name}, {.status.capacity}] {end} | [127.0.0.1, map[cpu:4]] [127.0.0.2, map[cpu:8]] |
| “                 | quote interpreted string | {range .items[*]}{.metadata.name}{’\t’} {end}                 | 127.0.0.1 127.0.0.2                             |

- - -

{% method %}

リスト中の最初の Deployment を一行の JSON 表現で表示します。

{% sample lang="yaml" %}

```bash
kubectl get deployment.v1.apps -o=jsonpath='{.items[0]}{"\n"}'

```

```bash
map[apiVersion:apps/v1 kind:Deployment...replicas:1 updatedReplicas:1]]
```

{% endmethod %}

- - -

{% method %}

リスト中の 最初の Deployment の `metadata.name` フィールドを表示します。

{% sample lang="yaml" %}

```bash
kubectl get deployment.v1.apps -o=jsonpath='{.items[0].metadata.name}{"\n"}'
```

```bash
nginx
```

{% endmethod %}

- - -

{% method %}

各 Deployment ごとに、その `metadata.name` フィールドを改行区切りで表示します。

{% sample lang="yaml" %}

```bash
kubectl get deployment.v1.apps -o=jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}'
```

```bash
nginx
nginx2
```

{% endmethod %}

- - -

{% method %}

各 Deployment ごとに、その `metadata.name` と `.status.availableReplicas` を表示します。

{% sample lang="yaml" %}

```bash
kubectl get deployment.v1.apps -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.availableReplicas}{"\n"}{end}'
```

```bash
nginx	1
nginx2	1
```

{% endmethod %}

- - -

{% method %}

Deployment のリストを一行で表示します。

{% sample lang="yaml" %}

```bash
kubectl get deployment.v1.apps -o=jsonpath='{@}{"\n"}'
```

```bash
map[kind:List apiVersion:v1 metadata:map[selfLink: resourceVersion:] items:[map[apiVersion:apps/v1 kind:Deployment...replicas:1 updatedReplicas:1]]]]
```

{% endmethod %}

- - -

{% method %}

各 Deployment を改行区切りで表示します。

{% sample lang="yaml" %}

```bash
kubectl get deployment.v1.apps -o=jsonpath='{range .items[*]}{@}{"\n"}{end}'
```

```bash
map[kind:Deployment...readyReplicas:1]]
map[kind:Deployment...readyReplicas:1]]
```

{% endmethod %}

- - -

{% panel style="info", title="リテラルの構文" %}
リテラル構文では、スペースを含む JSONPath テンプレートは (上の bash で示したシングルクォートではなく) ダブルクォートで囲います。
これは、テンプレート内のリテラルを囲む引用符にはシングルクォートを使うか、エスケープしたダブルクォートを使う必要があることを意味します。

例:

```bash
C:\> kubectl get pods -o=jsonpath="{range .items[*]}{.metadata.name}{'\t'}{.status.startTime}{'\n'}{end}"
```

{% endpanel %}
