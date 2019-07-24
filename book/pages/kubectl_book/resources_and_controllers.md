{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- Kubernetes API はリソースタイプとコントローラという 2 つの部分からなる
- リソースは JSON や YAML で宣言されたオブジェクトで、クラスタに書き込まれる
- コントローラはリソースが書き込まれてから、非同期にリソースを作動させる

{% endpanel %}

# Kubernetes のリソースとコントローラの概要

この章では、Kubernetes リソースモデルの背景を説明します。ここに書かれていることは [kubernetes.io](https://kubernetes.io/docs/home/) のドキュメントでも確認できます。

Kubernetes リソースの詳細は [kubernetes.io コンセプト](https://kubernetes.io/docs/concepts/)をご覧ください。

## リソース

Kubernetes オブジェクト (Deployment、Service、名前空間など) のインスタンスを**リソース**と呼びます。

特に、コンテナを実行するリソースは、**ワークロード**といいます。

以下がワークロードの例です。

- [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
- [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)
- [CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)
- [DaemonSets](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) 

**リソース API の機能を使うには、まずリソースをファイル内で宣言し、次に Kubernetes クラスタに Apply します。ここで記述される宣言的なファイルをリソース構成と呼びます。**

リソース構成は、Kubectl のようなツールを通じて Kubernetes クラスタに (宣言的な作成・更新・削除を) **Apply** され、そのあとで**コントローラ**がリソース構成を反映させます。

リソースは以下の属性によって一意に識別されます。

- **apiVersion** (API タイプグループとバージョン)
- **kind** (API タイプの名前)
- **metadata.namespace** (インスタンスの名前空間)
- **metadata.name** (インスタンス名)

{% panel style="warning", title="デフォルトの名前空間" %}
リソース構成で名前空間が省略されると **default** という名前空間が使用されますが、アプリケーションには名前空間を必ず明示的に指定すべきと言って差し支えありません。名前空間は `kustomization.yaml` に記述します。

{% endpanel %}

{% method %}

### リソースの構造

リソースの構成要素は次の通りです。

**TypeMeta:** リソースタイプの **apiVersion** と**種類**

**ObjectMeta:** リソースの**名前**、**名前空間** + 他のメタデータ (ラベル、アノテーションなど)

**Spec:** リソースの望ましい状態 - ユーザーがクラスタに教えるあるべき状態

**Status:** 観測された現在のオブジェクトの状態 - クラスタがユーザーに教える記録された状態

ユーザーがリソース構成を書くときには Status フィールドは省略します。

**Deployment のリソース構成の例**

{% sample lang="yaml" %}

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
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
      - name: nginx
        image: nginx:1.15.4
```

{% endmethod %}

{% panel style="info", title="Spec と Status" %}
ConfigMap や Secret のようなリソースには Status がありません。そのため、それらの Spec は暗黙的です (言い換えると spec フィールドがありません)。

{% endpanel %}

## コントローラ

コントローラは Kubernetes API を作動します。コントローラはシステムの状態を監視し、リソースを望ましい状態にするための変更 (作成、更新、削除) や、システムの変更 (Pod や Node の停止) を検知します。

コントローラはユーザーが (たとえばリソース構成の中で) 決めた意図通りの仕様や (たとえば Autoscaler による) 自動化の要求を満たすようにクラスタを変更します。

**例**: Deployment が作成されると、Deployment コントローラは Deployment が存在することを確認し、対応する ReplicaSet が期待どおりに存在するかどうか検証します。ReplicaSet が存在しなければ作成します。

{% panel style="warning", title="非同期な動作" %}
コントローラは非同期に実行されるため、コンテナイメージが壊れているとか Pod がスケジュール不能であるとかといった問題は CRUD のレスポンスでは顕在化しません。何かツールを作るときには、コントローラの動作が完了するまでシステムの状態の監視を簡単にできるようにすべきです。リソースの変更が完了して、望ましい状態とコントローラが観測した状態とが一致したら、リソースは**安定状態にある**とみなされます。

{% endpanel %}

### コントローラの構造

**調停**

コントローラがリソースを作動させるやり方は、リソースとそれに関連して作成・削除するリソースを読み込んで、期待される状態に一致させるというもので、これを「調停」といいます。

**コントローラは、イベントから受けた情報によってクラスタを調停するの*ではなく*、調停の実行時にクラスタを観測し、現在のクラスタの状態を期待されるクラスタの状態に一致させます。**

1. Deployment コントローラは ReplicaSets を作成・削除します
2. ReplicaSet コントローラは Pod を作成・削除します
3. Scheduler (コントローラ) は Node を Pod に書き込みます
4. Node (コントローラ) は Node 上の Pod に定義されたコンテナを実行します

**監視**

コントローラがリソースを作動させるタイミングは、監視用のリソースタイプによってリソースが書き込まれ、それからイベントが調停をトリガーした**後**です。リソースが作成・更新・削除された後、リソースタイプを監視しているコントローラはリソースが更新されたという通知を受け取り、(イベントが持っている更新情報に依存することなく) システムの状態を読み込んで何を更新すべきかを理解します。

- Deployment コントローラは Deployment と ReplicaSet (と Pod) を監視します
- ReplicaSet コントローラは ReplicaSets と Pod を監視します
- Scheduler (コントローラ) は Pod を監視します
- Node (コントローラ) は Pod (と Secret と ConfigMap) を監視します

{% panel style="info", title="レベルベースの調停とエッジベースの調停" %}
コントローラは個々のイベントに反応せず、調停の実行時にシステムの状態を期待される状態に一致させるため、**さまざまなイベントが変更を通知してきても、まとめて一度にシステムの観測と調停を行うことができます。**これは**レベルベース**のシステムと呼ばれます。これと対比して、個々のイベントに対して反応するシステムは**エッジベース**のシステムと呼ばれます。

{% endpanel %}

## Kubernetes リソース API の概要

### Pod

コンテナは [**Pod**](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/) の中で実行され、Pod の実行はクラスタ内の **Node** 上でスケジュールされます。

Pod はアプリケーションの**レプリカを一つ**を実行し、以下を提供します。

- 計算リソース (CPU、メモリ、ディスク)
- 環境変数
- ヘルスチェック
- ネットワーク (IP アドレスは Pod 内のコンテナに共有されます)
- Shared Configuration と Secret のマウント
- Storage Volume のマウント
- 初期化

{% panel style="warning", title="マルチコンテナの Pod" %}
アプリケーションの複数のレプリカを作るにはワークロード API を使うべきです。ワークロード API は Pod レプリカの作成および削除を PodTemplate で管理できます。

場合によっては Pod は複数のコンテナを含み、それがアプリケーションの一つのインスタンスを形成しているかもしれません。Pod 内のコンテナはネットワーク (IP) とストレージを共有することによって協働します。

{% endpanel %}

### ワークロード

一般的に Pod は関心ごとに分けられた上位の抽象化によって管理されます。たとえば、レプリケーション、同一性、永続化ストレージ、カスタムスケジュール、ローリングアップデートなどです。

最もよく使われるワークロード API (Pod を管理する API) は以下です。

- [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) (ステートレスなアプリケーション)
  - レプリケーション + ロールアウト
- [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/) (ステートフルなアプリケーション)
  - レプリケーション + ロールアウト + 永続化ストレージ + 同一性
- [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) (バッチ処理)
  - 処理を完了する
- [CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) (スケジュールされたバッチ処理)
  - 定期的に処理を完了する
- [DaemonSets](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) (マシンごと)
  - Node ごとのスケジュール

{% panel style="success", title="API の抽象化レイヤー" %}
上位のワークロード API は下位のワークロード API を管理できます。Pod を直接管理する必要はありません。(たとえば Deployment は ReplicaSet を管理します)

{% endpanel %}

### サービスディスカバリとロードバランシング

サービスディスカバリとロードバランシングは **Service** オブジェクトが管理します。Service は一つの仮想 IP アドレスと DNS 名を提供し、ラベルにマッチする Pod にロードバランスされます。

{% panel style="info", title="内部サービス vs 外部サービス" %}

- [Service リソース](https://kubernetes.io/docs/concepts/services-networking/service/)
    (L4) は内側に対してはクラスタに、外側に対しては HA プロキシを通じて Pod を公開することができます
- [Ingress Resources](https://kubernetes.io/docs/concepts/services-networking/ingress/) (L7)
    は URI エンドポイントを公開し、それを Service に振り分けます

{% endpanel %}

### Configuration と Secret

共有設定と機密情報は ConfigMap と Secret が提供します。これらを使用すると環境変数、コマンドライン引数、ファイルを Pod とコンテナに注入し、その中で使えるようになります。そのおかげで Pod とコンテナはそれらの設定に対して依存関係が薄くなります。

{% panel style="info", title="ConfigMap vs Secret" %}

- [ConfigMaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/)
    は機密でないデータを Pod に提供します
- [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
    は機密データを Pod に提供します

{% endpanel %}
