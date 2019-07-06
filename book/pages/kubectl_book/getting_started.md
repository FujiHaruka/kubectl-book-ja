

{% panel style="info", title="TL;DR" %}
- リソースの作成
- リソースの表示
- コンテナのデバッグ
{% endpanel %}

# Kubectl を始める

**注意**: すでに Kubectl に慣れていれば、この章は読み飛ばしても構いません。

この章では、Kubectl の基本的なコマンドを概説しますが、各コマンドの詳細は後の章で説明します。

Kubernetes API 自体の詳細については、[k8s.io](https://k8s.io) のドキュメントを読んでください。

## Kubernetes リソースをリスト表示する

{% method %}

Kubernetes の *Deployment* リソースのうち、kube-system という名前空間にあるものをリスト表示します。

**注意**: Deployment とは Pod レプリカを管理するリソースです。(Pod がコンテナを実行します)

{% sample lang="yaml" %}
```bash
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

{% endmethod %}

{% method %}

名前空間 kube-system にある kube-dns という Deployment の詳細を表示します。

{% sample lang="yaml" %}
```bash
kubectl describe deployment kube-dns --namespace kube-system
```
   
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
{% endmethod %}

## 設定ファイルからリソースを作成する

{% method %}

Kubernetes リソースをリモートにある設定ファイルから作成または更新します。

{% sample lang="yaml" %}
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/kubectl/master/docs/book/examples/nginx/nginx.yaml
```

```bash
service/nginx created
deployment.apps/nginx-deployment created
```
{% endmethod %}

{% method %}

Kubernetes リソースをローカルにある設定ファイルから作成または更新します。

{% sample lang="yaml" %}
```bash
kubectl apply -f ./examples/nginx/nginx.yaml
```

```bash
service/nginx created
deployment.apps/nginx-deployment created
```
{% endmethod %}

{% method %}

Apply されたリソースを表示します。

{% sample lang="yaml" %}
```bash
kubectl get -f ./examples/nginx/nginx.yaml --show-labels
```

```bash
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE   LABELS
service/nginx   ClusterIP   10.59.245.201   <none>        80/TCP    11m   <none>

NAME                               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE   LABELS
deployment.apps/nginx-deployment   3         3         3            3           11m   app=nginx
```
{% endmethod %}

## コマンドから設定を生成する

{% method %}

Deployment リソースの設定ファイルを生成します。これをクラスタに Apply するには、出力をファイルに書き込んでから、`kubectl apply -f <yaml-file>` を実行します。

**注意:** 生成された設定には削除すべき余分な箇所がありますが、go オブジェクトをシリアライズした結果生じたものです。

{% sample lang="yaml" %}
```bash
kubectl create deployment nginx --dry-run -o yaml --image nginx
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null # delete this
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
{% endmethod %}

## リソースに関連した Pod を見る

{% method %}

Deployment によって作成された Pod を Pod ラベルで表示します

{% sample lang="yaml" %}
```bash
kubectl get pods -l app=nginx
```

```bash
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-5c689d88bb-b2xfk   1/1     Running   0          10m
nginx-deployment-5c689d88bb-rx569   1/1     Running   0          10m
nginx-deployment-5c689d88bb-s7xcv   1/1     Running   0          10m
```
{% endmethod %}

## コンテナをデバッグする

{% method %}

Deployment が管理するすべての Pod からログを取得します。

{% sample lang="yaml" %}

```bash
kubectl logs -l app=nginx
```

{% endmethod %}

{% method %}

特定の Pod のコンテナの中に入ってシェルを実行します。

{% sample lang="yaml" %}

```bash
kubectl exec -i -t  nginx-deployment-5c689d88bb-s7xcv bash
```

```bash
root@nginx-deployment-5c689d88bb-s7xcv:/#
```

{% endmethod %}
