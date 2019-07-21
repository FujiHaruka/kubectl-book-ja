{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/JH35X82)**
{% endpanel %}

{% panel style="info", title="TL;DR" %}

{% endpanel %}
- ローカルの接続をクラスタ内で実行中の Service にプロキシする

# Service への接続

## 動機

Kubernetes クラスタ内で実行中のすべての Service が外部に公開されているわけではありません。
しかし、**clusterIp** を通じてクラスタの内部に向けてのみ公開している Service であっても、apiserver proxy を通じてアクセスできます。

ユーザーは Proxy を使用すると、**クラスタ内の Kubernetes Service のうち外部に公開されていないものに接続できます**。

**注意:** LoadBalancer タイプや NodePort タイプを実行している Service は、外部に公開することができるため、
Proxy を通じてアクセスする必要はありません。

## 内部 Service への接続

{% method %}
内部 Service への接続には、Proxy コマンドと Service Proxy URL を使います。

nginx service にアクセスするには、Proxy URL `http://127.0.0.1:8001/api/v1/namespaces/default/services/nginx/proxy/` を開きます。

```bash
kubectl proxy

{% sample lang="yaml" %}
Starting to serve on 127.0.0.1:8001
```

```bash
curl http://127.0.0.1:8001/api/v1/namespaces/default/services/nginx/proxy/
```

{% panel style="info", title="リテラル構文" %}
プロキシを通じて Service に接続するには、ユーザーは Proxy URL を作らなければなりません。Proxy URL の形式は以下です。

`http://<apiserver-address>/api/v1/namespaces/<service-namespace>/services/[https:]<service-name>[:<port-name>]/proxy`
{% endmethod %}

- apiserver-address は Proxy コマンドによって表示された URL
- ポート番号は、ポートに名前を指定していない場合はオプショナル
- プロトコルは `http` を使う場合はオプショナル

## ビルトインのクラスタサービス

よくあるユースケースとして、クラスタ自体の一部分として実行される Service に接続することが挙げられます。
ユーザーはこれらの Service とその Proxy URL を `kubectl cluster-info` で表示できます。

{% endpanel %}
```bash
kubectl cluster-info

Kubernetes master is running at https://104.197.5.247
GLBCDefaultBackend is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/default-http-backend:http/proxy
Heapster is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/heapster/proxy
KubeDNS is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
Metrics-server is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/https:metrics-server:/proxy
```

{% panel style="info", title="More Info" %}
クラスタに接続することに関して詳細は、[Accessing Clusters](https://kubernetes.io/docs/tasks/access-application-cluster/access-cluster/) を確認してください。
