{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の間違いは [GitHub の翻訳リポジトリ](https://github.com/FujiHaruka/kubectl-book-ja/issues) までお願いします。

See [CONTRIBUTING](https://github.com/kubernetes/kubectl/blob/master/docs/book/CONTRIBUTING.md) for
instructions on filing/fixing issues and adding new content.

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- Kubectl は Kubernetes の CLI
- Kubectl は Kubernetes クラスタを扱うための十徳ナイフ
- Kubectl は Kubernetes 上のアプリケーションのデプロイと管理に使う
- Kubectl はより高レベルのフレームワークを記述・構築するために使うこともできる

{% endpanel %}

# Kubectl

Kubectl は Kubenetes の CLI バージョンで、多くの仕事ができる十徳ナイフです。

この本は、Kubectl を使って Kubernetes 内のアプリケーションを宣言的に管理することにフォーカスしていますが、Kubectl の他の機能も網羅しています。

## コマンドの分類

Kubectl コマンドは一般的に以下のカテゴリの一つに分類されます。

| 種類           | 用途                          | 説明                                                 |
| ------------ | --------------------------- | -------------------------------------------------- |
| 宣言的リソース管理    | デプロイと (GitOps のような) オペレーション | リソース構成を使い Kubernetes ワークロードを宣言的に管理する               |
| 命令的リソース管理    | デプロイのみ                      | コマンドラインに引数とフラグを与えて Kubernetes ワークロードを管理するコマンドを実行する |
| ワークロードの状態を表示 | デバッグ                        | ワークロードについての情報を表示する                                 |
| コンテナの相互作用    | デバッグ                        | Exec、Attach、Cp、Logs                                |
| クラスタ管理       | クラスタ Ops                    | Drain and Cordon Nodes                             |

## 宣言的なアプリケーション管理

リソースを管理する方法は、リソース構成と呼ばれる宣言的なファイルを置き、Kubectl **Apply** コマンドで管理するのが推奨方法です。このコマンドはローカル (またはリモート) にあるファイル群を読み込み、そこに宣言された望ましい状態に合わせてクラスタの状態を変更します。

{% panel style="info", title="Apply" %}
Apply は Kubernetes のリソースを管理するための推奨方法です。

{% endpanel %}

## ワークロードの状態を表示

ワークロードの状態を確認する必要があるときに使用します。

- リソースの状態とその情報を要約して表示する
- リソースの状態とその情報を完全に表示する
- リソースから特定のフィールドを表示する
- ラベルにマッチするリソースを検索する

## ワークロードのデバッグ

Kubectl はデバッグをサポートするために以下のようなコマンドを提供します。

- コンテナのログを表示する
- クラスタのイベントを表示する
- コンテナに対して Exec やアタッチを実行する
- クラスタ内のコンテナにあるファイルをユーザーのファイルシステムにコピーする

## クラスタの管理

時には、クラスタの Node に何らかの操作を実行したくなることがあります。Kubectl は Node からワークロードをドレイン？するコマンドをサポートしています。それを使うと、ワークロードを停止したりデバッグしたりできます。

## 命令的なコマンド

リソース構成のファイルを書くのは**開発**時には冗長にすぎると感じる人がいるかもしれません。そういうときには、シェルのようなワークフローでクラスタを**命令的**に扱いたくなります。Kubectl はリソースを生成・変更するためのユーザーフレンドリーなコマンドを提供しています。

- Deployment、StatefulSet、Service、ConfigMap などのリソースを生成・作成する
- リソースにフィールドを設定する
- テキストエディタでリソースを (稼働させたまま) 編集する

{% panel style="danger", title="開発用" %}
命令的なコマンドはユーザーフレンドリーであるため開発用クラスタ内でワークロードを試行錯誤する上で時間の節約になりますが、本番で使うべきではありません。

{% endpanel %}
