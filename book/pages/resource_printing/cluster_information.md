{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の間違いは [GitHub の翻訳リポジトリ](https://github.com/FujiHaruka/kubectl-book-ja/issues) までお願いします。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- クラスタとクライアントのバージョン情報を表示します
- 制御プレインに関する情報を表示します
- Node に関する情報を表示します
- API に関する情報を表示します

{% endpanel %}

# クラスタの情報

## 動機

Kubernetes クラスタ上で実行するワークロードだけでなく、クラスタ自体について学ぶ必要があるかもしれません。そうしておくと、期待される挙動をデバッグするのに役立ちます。

## バージョン

{% method %}

`kubectl version` はクライアントとサーバーのバージョンを表示します。なお、クライアントをローカルでソースからビルドした場合には、クライアントのバージョンは表示されないこともあります。

{% sample lang="yaml" %}

```bash
kubectl version
```

```bash
Client Version: version.Info{Major:"1", Minor:"9", GitVersion:"v1.9.5", GitCommit:"f01a2bf98249a4db383560443a59bed0c13575df", GitTreeState:"clean", BuildDate:"2018-03-19T19:38:17Z", GoVersion:"go1.9.4", Compiler:"gc", Platform:"darwin/amd64"}
Server Version: version.Info{Major:"1", Minor:"11+", GitVersion:"v1.11.6-gke.2", GitCommit:"04ad69a117f331df6272a343b5d8f9e2aee5ab0c", GitTreeState:"clean", BuildDate:"2019-01-04T16:19:46Z", GoVersion:"go1.10.3b4", Compiler:"gc", Platform:"linux/amd64"}
```

{% endmethod %}

{% panel style="warning", title="バージョンのずれ" %}
Kubectl は Kubernetes クラスタに関して +/-1 のバージョン違いをサポートします。Kubectl のバージョンがクラスタのバージョンと 1 よりも大きく進んでいる、あるいは遅れていると、互換性が保証されません。

{% endpanel %}

## 制御プレインとアドオン

{% method %}

`kubectl cluster-info` は制御プレインとアドオンに関する情報を表示します。

{% sample lang="yaml" %}

```bash
kubectl cluster-info
```

```bash
  Kubernetes master is running at https://1.1.1.1
  GLBCDefaultBackend is running at https://1.1.1.1/api/v1/namespaces/kube-system/services/default-http-backend:http/proxy
  Heapster is running at https://1.1.1.1/api/v1/namespaces/kube-system/services/heapster/proxy
  KubeDNS is running at https://1.1.1.1/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
  Metrics-server is running at https://1.1.1.1/api/v1/namespaces/kube-system/services/https:metrics-server:/proxy
```

{% endmethod %}

{% panel style="info", title="Kube Proxy" %}
`cluster-info` によって表示される URL は `kubectl proxy` を実行することで `127.0.0.1:8001` からアクセスできるようになります。

{% endpanel %}

## Node

{% method %}

`kubectl top node` と `kubectl top pod` はトップの node と pod に関する情報を表示します。

{% sample lang="yaml" %}

```bash
kubectl top node
```

```bash
  NAME                                 CPU(cores)   CPU%      MEMORY(bytes)   MEMORY%   
  gke-dev-default-pool-e1e7bf6a-cc8b   37m          1%        571Mi           10%       
  gke-dev-default-pool-e1e7bf6a-f0xh   103m         5%        1106Mi          19%       
  gke-dev-default-pool-e1e7bf6a-jfq5   139m         7%        1252Mi          22%       
  gke-dev-default-pool-e1e7bf6a-x37l   112m         5%        982Mi           17%  
```

{% endmethod %}

## API

`kubectl api-versions` と `kubectl api-resources` は利用可能な Kubernetes API に関する情報を表示します。この情報はディスカバリーサービスから読み込まれます。

{% method %}

クラスタ内で利用可能なリソースタイプを表示します。

{% sample lang="yaml" %}

```bash
kubectl api-resources
```

```bash
NAME                              SHORTNAMES   APIGROUP                       NAMESPACED   KIND
bindings                                                                      true         Binding
componentstatuses                 cs                                          false        ComponentStatus
configmaps                        cm                                          true         ConfigMap
endpoints                         ep                                          true         Endpoints
events                            ev                                          true         Event
limitranges                       limits                                      true         LimitRange
namespaces                        ns                                          false        Namespace
...
```

{% endmethod %}

{% method %}

クラスタ内で利用可能な API のバージョンを表示します。

{% sample lang="yaml" %}

```bash
kubectl api-versions
```

```bash
  admissionregistration.k8s.io/v1beta1
  apiextensions.k8s.io/v1beta1
  apiregistration.k8s.io/v1
  apiregistration.k8s.io/v1beta1
  apps/v1
  apps/v1beta1
  apps/v1beta2
  ...
```

{% endmethod %}

{% panel style="info", title="Discovery" %}
ディスカバリーの情報は `kubectl proxy` コマンドを実行することで `127.0.0.1:8001/` から閲覧できます。特定の API のディスカバリーは `/api/v1` 下や `apis/<group>/<version>` で見られます。これは API グループに依存します。たとえば、`127.0.0.1:8001/apis/apps/v1` などになります。

{% endpanel %}

{% method %}

`kubectl explain` コマンドは特定のリソースタイプに関するメタデータを表示するのに使用できます。これはリソースタイプの情報を知るのに便利です。

{% sample lang="yaml" %}

```bash
kubectl explain deployment --api-version apps/v1
```

```bash
KIND:     Deployment
VERSION:  apps/v1

DESCRIPTION:
     Deployment enables declarative updates for Pods and ReplicaSets.

FIELDS:
   apiVersion	<string>
     APIVersion defines the versioned schema of this representation of an
     object. Servers should convert recognized schemas to the latest internal
     value, and may reject unrecognized values. More info:
     https://git.k8s.io/community/contributors/devel/api-conventions.md#resources

   kind	<string>
     Kind is a string value representing the REST resource this object
     represents. Servers may infer this from the endpoint the client submits
     requests to. Cannot be updated. In CamelCase. More info:
     https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds

   metadata	<Object>
     Standard object metadata.

   spec	<Object>
     Specification of the desired behavior of the Deployment.

   status	<Object>
     Most recently observed status of the Deployment.
```

{% endmethod %}
