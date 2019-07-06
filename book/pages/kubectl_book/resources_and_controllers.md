

{% panel style="info", title="TL;DR" %}
- Kubernetes API は 2 つの部分からなります - リソースタイプとコントローラ
- リソースは json や yaml で宣言されたオブジェクトで、クラスタに書き込まれます
- コントローラはリソースの保存後に非同期にリソースを動かします
{% endpanel %}

# Kubernetes のリソースとコントローラの概要

この章では Kubernetes リソースモデルの背景を説明します。ここに書かれていることは [kubernetes.io](https://kubernetes.io/docs/home/) のドキュメントでも確認できます。

Kubernetes リソースの詳細は [kubernetes.io コンセプト](https://kubernetes.io/docs/concepts/)をご覧ください。

## リソース

Kubernetes オブジェクト (Deployment、Service、名前空間など) のインスタンスは**リソース**と呼ばれます。

コンテナを実行するリソースは特にワークロードといいます。

ワークロードの例。

- [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
- [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)
- [CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)
- [DaemonSets](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) 


**リソース API を使うには、まずリソースをファイルで宣言し、それから Kubernetes クラスタに適用します。これらの宣言的なファイルはリソース設定と呼ばれます。**

リソース設定は、Kubectl のようなツールを使って Kubernetes クラスタに (宣言的な作成・更新・削除を) 適用され、それから**コントローラ**が作動させます。

リソースは一意に識別されます。

- **apiVersion** (API タイプのグループとバージョン)
- **kind** (API タイプの名前)
- **metadata.namespace** (インスタンスの名前空間)
- **metadata.name** (インスタンス名)

{% panel style="warning", title="デフォルトの名前空間" %}
リソース設定で名前空間が省略されると *default* という名前空間が使用されます。ほとんどの場合、アプリケーションには明示的に名前空間を指定すべきです。名前空間は `kustomization.yaml` に記述します。
{% endpanel %}

{% method %}

### リソースの構造

リソースの構成要素は次の通りです。

**TypeMeta:** リソースタイプの **apiVersion** と**種類**

**ObjectMeta:** リソースの**名前**と**名前空間** + 他のメタデータ (ラベル、アノテーションなど)

**Spec:** リソースの望ましい状態 - クラスタに対して教えるこうなってほしいという状態

**Status:** オブジェクトの観測された状態 - クラスタが教えてくれる記録された状態

リソース設定を書くときには Status フィールドは省略します。

**Deployment のリソース設定の例**
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

{% panel style="info", title="Spec and Status" %}
ConfigMap や Secret のようなリソースには Status がありません。その結果、それらの Spec は暗黙的です (言い換えると spec フィールドがありません)。
{% endpanel %}

## コントローラ

コントローラは Kubernetes API を作動します。コントローラはシステムの状態を監視し、リソースを望ましい状態にするための変更 (作成、更新、削除) や、システムの変更 (Pod や Node の停止) を検知します。

コントローラはユーザーが (たとえばリソース設定の中で) 決めた意図通りの仕様や (たとえば Autoscaler による) 自動化の要求を満たすようクラスタを変更ます。

**例**: Deployment が作成されると、Deployment コントローラは Deployment が存在することを理解し、対応する ReplicaSet が期待どおりに存在するかどうか検証します。ReplicaSet が存在しなければ作成します。

{% panel style="warning", title="非同期な動作" %}
コントローラは非同期に実行されるため、コンテナイメージが壊れているとか Pod がスケジュール不能であるとかといった問題は CRUD のレスポンスでは顕在化しません。何かツールを作る場合には、コントローラの動作が完了するまでシステムの状態を監視しておくことが簡単にできるようにすべきです。変更動作が完了して望ましい状態が現在の状態と一致したら、リソースは**安定状態にある**なとみなされます。
{% endpanel %}

### コントローラの構造

**調停**

コントローラは自身が作成・削除するなどして調停中のリソースとその関連リソースを読み込むことによって、リソースを作動させます。

**コントローラが実行する調停は、イベントを調停するの*ではなく*、期待されるクラスタの状態を現在のクラスタの状態に調停します。**

1. Deployment コントローラは ReplicaSets を作成・削除します
1. ReplicaSet コントローラは Pod を作成・削除します
1. Scheduler (コントローラ) は Node を Pod に書き込みます
1. Node (コントローラ) は Node 上の Pod に定義されたコンテナを実行します

**監視**

コントローラがリソースを作動させるのは監視用のリソースタイプが書き、それからイベントから調停がトリガーされた**後**です。リソースが作成・更新・削除された後、リソースタイプを監視しているコントローラはリソースが変更されたという通知を受け取り、(この情報のためのイベントに依存することなく) システムの状態を読み込んで何を変更すべきかを理解します。

- Deployment コントローラは Deployment と ReplicaSet (と Pod) を監視します。
- ReplicaSet コントローラは ReplicaSets と Pod を監視します
- Scheduler (コントローラ) は Pod を監視します
- Node (コントローラ) は Pod (と Secret と ConfigMap) を監視します

{% panel style="info", title="レベルベースの調停とエッジベースの調停" %}
コントローラは個々のイベントに反応せず、調停が実行されるときにシステムの状態を調停するため、**複数の異なるイベントから来る複数の変更が観測されうるし、一緒に調停されるかもしれません。**これは**レベルベース**のシステムと呼ばれます。それと対比して、個々のイベントに対して反応するシステムは**エッジベース**のシステムと呼ばれます。
{% endpanel %}

## Kubernetes リソース API の概要

### Pod

コンテナは [*Pod*](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/) の中で実行され、Pod はクラスタ内の *Node* 上で実行をスケジュールされます。

Pod はアプリケーションの**単一のレプリカ**を実行し、以下を提供します。

- 計算リソース (CPU、メモリ、ディスク)
- 環境変数
- ヘルスチェック
- ネットワーク (IP アドレスは Pod 内のコンテナに共有されます)
- Shared Configuration と Secret のマウント
- Storage Volume のマウント
- 初期化

{% panel style="warning", title="マルチコンテナの Pod" %}
アプリケーションには複数のレプリカを作るべきです。ワークロード API を使うと Pod レプリカの作成および削除を PodTemplate で管理できます。

場合によっては Pod は複数のコンテナを含み、それがアプリケーションの一つのインスタンスを形成しているかもしれません。これらのコンテナはネットワーク (IP) とストレージを共有することによって協働します。
{% endpanel %}

### ワークロード

一般的に Pod は関心ごとに分けられた上位の抽象化によって管理されます。たとえば、レプリケーション、同一性、永続化ストレージ、カスタムスケジュール、ローリングアップデートなどです。

最もよく使われるワークロード API (Pod を管理する API) は以下です。

- [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) (ステートレスなアプリケーション)
  - レプリケーション + ロールアウト
- [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/) (ステートフルなアプリケーション)
  - レプリケーション + ロールアウト + 永続化ストレージ + 同一性
- [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) (バッチ処理)
  - 実行を完了する
- [CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) (スケジュールされたバッチ処理)
  - 定期的に実行を完了する
- [DaemonSets](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) (マシンごと)
  - Node ごとのスケジュール

{% panel style="success", title="API の抽象化レイヤー" %}
上位のワークロード API は下位のワークロード API を管理できます。Pod を直接管理する必要はありません。(たとえば Deployment は ReplicaSet を管理します)
{% endpanel %}

### サービスディスカバリとロードバランシング

サービスディスカバリとロードバランシングは **Service** オブジェクトが管理します。Service は一つの仮想 IP アドレスと DNS 名を提供し、ラベルにマッチする Pod たちにロードバランスされます。

{% panel style="info", title="内部 Service vs 外部 Services" %}
- [Service リソース](https://kubernetes.io/docs/concepts/services-networking/service/)
  (L4) は内に向けてはクラスタに、外に向けては HA プロキシを通じて Pod を公開することができます。
- [Ingress リソース](https://kubernetes.io/docs/concepts/services-networking/ingress/) (L7)
  は URI エンドポイントを公開し、それを Service に振り分けます。
{% endpanel %}

### Configuration と Secret

共有設定と機密情報は ConfigMap と Secret が提供します。これは環境変数、コマンドライン引数、ファイルを Pod とコンテナが使えるようにルーズに注入します。

{% panel style="info", title="ConfigMap vs Secret" %}
- [ConfigMaps](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/)
  は機密でないデータを Pod に提供します。
- [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
  は機密データを Pod に提供します。
{% endpanel %}
