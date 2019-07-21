{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/JH35X82)**
{% endpanel %}

{% panel style="info", title="TL;DR" %}

- リソースの作成
- リソースの表示
{% endpanel %}
- コンテナをデバッグする

# Kubectl を始める

**注意**: すでに Kubectl に慣れていれば、この章は飛ばしても構いません。

この章では、Kubectl の基本的なコマンドを概説しますが、各コマンドの詳細は以降の章で説明します。

Kubernetes API 自体の詳細については、[k8s.io](https://k8s.io) のドキュメントを読んでください。

## Kubernetes リソースをリスト表示する

{% method %}
Kubernetes の **Deployment** リソースのうち、kube-system という名前空間にあるものをリスト表示します。

**注意**: Deployment とは Pod レプリカを管理するリソースです。(Pod はコンテナを実行します)

```bash
{% sample lang="yaml" %}
kubectl get deployments --namespace kube-system
```

```bash
NAME                     DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
event-exporter-v0.2.3    1         1         1            1           14d
fluentd-gcp-scaler       1         1         1            1           14d
heapster-v1.6.0-beta.1   1         1         1            1           14d
kube-dns                 2         2         2            2           14d
kube-dns-autoscaler      1         1         1            1           14d
l7-default-backend       1         1         1            1           14d
metrics-server-v0.3.1    1         1         1            1           14d
```

名前空間 kube-system にある kube-dns という名前の Deployment について詳細を表示します。
{% endmethod %}

{% method %}
```bash
kubectl describe deployment kube-dns --namespace kube-system
```
{% sample lang="yaml" %}

```bash
Name:                   kube-dns
Namespace:              kube-system
CreationTimestamp:      Wed, 06 Mar 2019 17:36:05 -0800
Labels:                 addonmanager.kubernetes.io/mode=Reconcile
                        k8s-app=kube-dns
                        kubernetes.io/cluster-service=true
Annotations:            deployment.kubernetes.io/revision: 2
...
```

## 設定ファイルからリソースを作成する

{% endmethod %}
Kubernetes リソースをリモートにある設定ファイルから作成・更新します。

```bash
{% method %}
kubectl apply -f https://raw.githubusercontent.com/kubernetes/kubectl/master/docs/book/examples/nginx/nginx.yaml
```

{% sample lang="yaml" %}
```bash
service/nginx created
deployment.apps/nginx-deployment created
```

Kubernetes リソースをローカルにある設定ファイルから作成・更新します。

```bash
{% endmethod %}
kubectl apply -f ./examples/nginx/nginx.yaml
{% method %}
```

```bash
{% sample lang="yaml" %}
service/nginx created
deployment.apps/nginx-deployment created
```

Apply されたリソースを表示します。

```bash
kubectl get -f ./examples/nginx/nginx.yaml --show-labels
{% endmethod %}
```
{% method %}

```bash
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE   LABELS
{% sample lang="yaml" %}
service/nginx   ClusterIP   10.59.245.201   <none>        80/TCP    11m   <none>

NAME                               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE   LABELS
deployment.apps/nginx-deployment   3         3         3            3           11m   app=nginx
```

## コマンドから設定を生成する

Deployment リソースの設定ファイルを生成します。これをクラスタに適用するには、出力をファイルに書き込んでから、`kubectl apply -f <yaml-file>` を実行します。

**注意:** 生成された設定には削除すべき余計な箇所がありますが、go オブジェクトをシリアライズした結果生じたものです。
{% endmethod %}

```bash
kubectl create deployment nginx --dry-run -o yaml --image nginx
{% method %}
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null # delete this
{% sample lang="yaml" %}
  labels:
    app: nginx
  name: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  strategy: {} # delete this
  template:
    metadata:
      creationTimestamp: null # delete this
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
        resources: {} # delete this
status: {} # delete this
```

## リソースに関連した Pod を見る

Deployment によって作成された Pod を Pod ラベルで表示します。

```bash
kubectl get pods -l app=nginx
```

{% endmethod %}
```bash
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-5c689d88bb-b2xfk   1/1     Running   0          10m
{% method %}
nginx-deployment-5c689d88bb-rx569   1/1     Running   0          10m
nginx-deployment-5c689d88bb-s7xcv   1/1     Running   0          10m
```
{% sample lang="yaml" %}

## コンテナをデバッグする

Deployment が管理するすべての Pod からログを取得します。

```bash
kubectl logs -l app=nginx
```

特定の Pod のコンテナの中に入ってシェルを実行します。
{% endmethod %}

```bash
kubectl exec -i -t  nginx-deployment-5c689d88bb-s7xcv bash
{% method %}
```

```bash
{% sample lang="yaml" %}
root@nginx-deployment-5c689d88bb-s7xcv:/#
```
