{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- リソースに関する詳細なデバッグ情報を表示する

{% endpanel %}

# リソースの describe

## 動機

{% method %}

describe は、検索されたリソースの情報に加えて**他のソース (たとえばイベント) からも情報を集めて表示することのできる高レベルの操作**です。

describe は対象のリソースとそれに関連するリソースから、リソースに関する最も重要な情報を引き出し、その情報を複数行にフォーマットし、表示します。

- 関連するリソースからデータを集めます
- デバッグ用に詳細な出力をフォーマットします

{% sample lang="yaml" %}

```bash
kubectl describe deployments
```

```bash
Name:                   nginx
Namespace:              default
CreationTimestamp:      Thu, 15 Nov 2018 10:58:03 -0800
Labels:                 app=nginx
Annotations:            deployment.kubernetes.io/revision=1
Selector:               app=nginx
Replicas:               1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=nginx
  Containers:
   nginx:
    Image:        nginx
    Port:         <none>
    Host Port:    <none>
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Progressing    True    NewReplicaSetAvailable
  Available      True    MinimumReplicasAvailable
OldReplicaSets:  <none>
NewReplicaSet:   nginx-78f5d695bd (1/1 replicas created)
Events:          <none>
```

{% endmethod %}

{% panel style="info", title="Get vs Describe" %}
リソースを describe するとき、他のリソースからも情報を集めます。たとえば、Node を describe すると Pod リソースの情報を集め、Node の中での使用率を表示します。

リソースを get するときはそのリソースから読み取れる情報だけが表示されます。get はリソースの**フィールド**からデータを集めますが、他のリソースのフィールドは見ません。

{% endpanel %}
