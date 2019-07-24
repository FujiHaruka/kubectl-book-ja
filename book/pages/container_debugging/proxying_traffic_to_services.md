{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- ローカルの接続をクラスタ内で稼働中の Service にプロキシする

{% endpanel %}

# Service への接続

## 動機

Kubernetes クラスタ内で稼働中のすべての Service が外部に公開されるわけではありません。
しかし、クラスタの内部に向けてのみ **clusterIp** を通じて公開している Service であっても、apiserver proxy を通じてアクセスできます。

Proxy を使用すると、**クラスタ内で外部に非公開な Kubernetes Service に接続できます**。

**注意:** LoadBalancer タイプや NodePort タイプを実行している Service は、外部に公開可能なため、
Proxy を使わなくてもアクセスできます。

{% method %}

## 内部 Service への接続

内部 Service への接続には、Proxy コマンドと Service Proxy URL を使います。

nginx service にアクセスするには、Proxy URL `http://127.0.0.1:8001/api/v1/namespaces/default/services/nginx/proxy/` を開きます。

{% sample lang="yaml" %}

```bash
kubectl proxy

Starting to serve on 127.0.0.1:8001
```

```bash
curl http://127.0.0.1:8001/api/v1/namespaces/default/services/nginx/proxy/
```

{% endmethod %}

{% panel style="info", title="リテラルの構文" %}
プロキシを通じて Service に接続するために、ユーザーは Proxy URL を作る必要があります。Proxy URL の形式は以下です。

`http://<apiserver-address>/api/v1/namespaces/<service-namespace>/services/[https:]<service-name>[:<port-name>]/proxy`

- <apiserver-address> は Proxy コマンドによって表示された URL
- ポート番号 <port-name> は、ポートに名前を指定していない場合はオプショナル
- プロトコルは `http` を使う場合はオプショナル

{% endpanel %}

## ビルトインのクラスタサービス

よくあるユースケースとして、クラスタ自体の一部分として稼働している Service に接続することが挙げられます。
ユーザーは Service と Proxy URL を `kubectl cluster-info` で表示できます。

```bash
kubectl cluster-info

Kubernetes master is running at https://104.197.5.247
GLBCDefaultBackend is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/default-http-backend:http/proxy
Heapster is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/heapster/proxy
KubeDNS is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
Metrics-server is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/https:metrics-server:/proxy
```

{% panel style="info", title="もっと知る" %}
クラスタへの接続に関する詳細は、[Accessing Clusters](https://kubernetes.io/docs/tasks/access-application-cluster/access-cluster/) を確認してください。

{% endpanel %}
