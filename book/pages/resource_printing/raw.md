{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- クラスタ内のリソースの詳細を YAML や JSON として取得、リスト表示します

{% endpanel %}

# リソースの詳細を表示する

## 動機

リソースの調査やデバッグのためです。

apiserver により etcd に保存された Kubernetes リソースは、**概要表示で表示されるよりも多くのフィールドを持っています**。リソースの詳細を YAML や JSON で表示することで、より多くの情報を知ることができます。リソースの詳細には以下が含まれます。

- リソース内で**ユーザー**が指定したフィールド (例: `metadata.name`)
- **apiserver** が所有するメタデータ (例: `metadata.creationTimestamp`)
- **apiserver** がデフォルト値を設定したフィールド (例: `spec.imagePullPolicy`)
- **コントローラ**が設定したフィールド (例: `spec.clusterIp`、`status`)

## Get

`kubectl get` はクラスタからリソースを読み込み、出力としてフォーマットします。この章の例では、引数に**リソースタイプ**を与えることでリソースを検索します。検索のオプションの詳細は[クエリとオプション](queries_and_options.md)を確認してください。

{% method %}

### YAML

リソースの詳細を YAML 形式で表示します。

{% sample lang="yaml" %}

```bash
kubectl get deployments -o yaml
```

```yaml
apiVersion: v1
items:
- apiVersion: extensions/v1beta1
  kind: Deployment
  metadata:
    annotations:
      deployment.kubernetes.io/revision: "1"
    creationTimestamp: 2018-11-15T18:58:03Z
    generation: 1
    labels:
      app: nginx
    name: nginx
    namespace: default
    resourceVersion: "1672574"
    selfLink: /apis/extensions/v1beta1/namespaces/default/deployments/nginx
    uid: 6131547f-e908-11e8-9ff6-42010a8a00d1
  spec:
    progressDeadlineSeconds: 600
    replicas: 1
    revisionHistoryLimit: 10
    selector:
      matchLabels:
        app: nginx
    strategy:
      rollingUpdate:
        maxSurge: 25%
        maxUnavailable: 25%
      type: RollingUpdate
    template:
      metadata:
        creationTimestamp: null
        labels:
          app: nginx
      spec:
        containers:
        - image: nginx
          imagePullPolicy: Always
          name: nginx
          resources: {}
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
        dnsPolicy: ClusterFirst
        restartPolicy: Always
        schedulerName: default-scheduler
        securityContext: {}
        terminationGracePeriodSeconds: 30
  status:
    availableReplicas: 1
    conditions:
    - lastTransitionTime: 2018-11-15T18:58:10Z
      lastUpdateTime: 2018-11-15T18:58:10Z
      message: Deployment has minimum availability.
      reason: MinimumReplicasAvailable
      status: "True"
      type: Available
    - lastTransitionTime: 2018-11-15T18:58:03Z
      lastUpdateTime: 2018-11-15T18:58:10Z
      message: ReplicaSet "nginx-78f5d695bd" has successfully progressed.
      reason: NewReplicaSetAvailable
      status: "True"
      type: Progressing
    observedGeneration: 1
    readyReplicas: 1
    replicas: 1
    updatedReplicas: 1
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
```

{% endmethod %}

- - -

{% method %}

### JSON

リソースの詳細を JSON 形式で出力します。

{% sample lang="yaml" %}

```bash
kubectl get deployments -o json
```

```json
{
    "apiVersion": "v1",
    "items": [
        {
            "apiVersion": "extensions/v1beta1",
            "kind": "Deployment",
            "metadata": {
                "annotations": {
                    "deployment.kubernetes.io/revision": "1"
                },
                "creationTimestamp": "2018-11-15T18:58:03Z",
                "generation": 1,
                "labels": {
                    "app": "nginx"
                },
                "name": "nginx",
                "namespace": "default",
                "resourceVersion": "1672574",
                "selfLink": "/apis/extensions/v1beta1/namespaces/default/deployments/nginx",
                "uid": "6131547f-e908-11e8-9ff6-42010a8a00d1"
            },
            "spec": {
                "progressDeadlineSeconds": 600,
                "replicas": 1,
                "revisionHistoryLimit": 10,
                "selector": {
                    "matchLabels": {
                        "app": "nginx"
                    }
                },
                "strategy": {
                    "rollingUpdate": {
                        "maxSurge": "25%",
                        "maxUnavailable": "25%"
                    },
                    "type": "RollingUpdate"
                },
                "template": {
                    "metadata": {
                        "creationTimestamp": null,
                        "labels": {
                            "app": "nginx"
                        }
                    },
                    "spec": {
                        "containers": [
                            {
                                "image": "nginx",
                                "imagePullPolicy": "Always",
                                "name": "nginx",
                                "resources": {},
                                "terminationMessagePath": "/dev/termination-log",
                                "terminationMessagePolicy": "File"
                            }
                        ],
                        "dnsPolicy": "ClusterFirst",
                        "restartPolicy": "Always",
                        "schedulerName": "default-scheduler",
                        "securityContext": {},
                        "terminationGracePeriodSeconds": 30
                    }
                }
            },
            "status": {
                "availableReplicas": 1,
                "conditions": [
                    {
                        "lastTransitionTime": "2018-11-15T18:58:10Z",
                        "lastUpdateTime": "2018-11-15T18:58:10Z",
                        "message": "Deployment has minimum availability.",
                        "reason": "MinimumReplicasAvailable",
                        "status": "True",
                        "type": "Available"
                    },
                    {
                        "lastTransitionTime": "2018-11-15T18:58:03Z",
                        "lastUpdateTime": "2018-11-15T18:58:10Z",
                        "message": "ReplicaSet \"nginx-78f5d695bd\" has successfully progressed.",
                        "reason": "NewReplicaSetAvailable",
                        "status": "True",
                        "type": "Progressing"
                    }
                ],
                "observedGeneration": 1,
                "readyReplicas": 1,
                "replicas": 1,
                "updatedReplicas": 1
            }
        }
    ],
    "kind": "List",
    "metadata": {
        "resourceVersion": "",
        "selfLink": ""
    }
}
```

{% endmethod %}
