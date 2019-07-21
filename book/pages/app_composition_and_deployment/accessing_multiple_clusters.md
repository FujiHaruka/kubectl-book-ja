{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/JH35X82)**
{% endpanel %}

{% panel style="info", title="TL;DR" %}

- `--context` フラグによって、ロールアウトする対象のクラスタを指定する
{% endpanel %}
- `--kubeconfig` フラグによって、ロールアウトする対象のクラスタを指定する

# 複数のクラスタを対象にする

## 動機

**一つのアプリケーションの複数のバリエーションを異なるクラスタ**にデプロイする必要があるという状況はよくあります。これは別々の `kustomization.yaml` のバリエーションを使って、各バリエーションが `--context` フラグや `--kubeconfig` フラグを使って対象となるクラスタを指定することで、別々のバリエーションを構成することでなされます。

**注意:** この章の例では、リソース構成を一つのディレクトリに保管し、クラスタ名にマッチするようにします。(つまりディレクトリ名がコンテキスト名になります)

## コンテキストを通じたクラスタの指定

kubeconfig ファイルによって複数のコンテキストを指定できます。各コンテキストには異なるクラスタと権限が含まれます。

### コンテキストの一覧

kubeconfig ファイルにあるコンテキストを一覧表示します

```sh
{% method %}
kubectl config get-contexts
```

{% sample lang="yaml" %}
```sh
CURRENT   NAME   CLUSTER   AUTHINFO   NAMESPACE
          us-central1-c  us-central1-c  us-central1-c
*         us-east1-c  us-east1-c  us-east1-c
          us-west2-c   us-west2-c   us-west2-c
```

### コンテキストを表示

現在のコンテキストに関する情報を表示します

{% endmethod %}
```sh
kubectl config --kubeconfig=config-demo view --minify
```
{% method %}

```yaml
apiVersion: v1
{% sample lang="yaml" %}
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
current-context: dev-frontend
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
```

### コンテキストフラグの指定

kubeconfig コンテキストをコマンドの一部として指定します。

**注意:** この例では `kustomization.yml` がコンテキスト名とマッチするディレクトリにあります。

{% endmethod %}
```sh
export CLUSTER=us-west2-c; kubectl apply -k ${CLUSTER} --context=${CLUSTER}
```
{% method %}

### コンテキストの切り替え

コマンドを実行する前に現在のコンテキストを切り替えます。

**注意:** この例では `kustomization.yml` がコンテキスト名とマッチするディレクトリにあります。
{% sample lang="yaml" %}

```sh
# change the context to us-west2-c
kubectl config use-context us-west2-c
# deploy Resources from the ./us-west2-c/kustomization.yaml
{% endmethod %}
kubectl apply -k ./us-west2-c
```

{% method %}
## Kubeconfig によるクラスタの指定

別の方法として、異なる kubeconfig ファイルを異なるクラスタのために使うこともできます。kubeconfig は `--kubeconfig` フラグで指定できます。

**注意:** この例では `kustomization.yml` が kubeconfig のあるディレクトリ名とマッチするディレクトリにあります。

{% sample lang="yaml" %}
```sh
kubectl apply -k ./us-west2-c --kubeconfig /path/to/us-west2-c/config
```

{% panel style="info", title="More Info" %}
kubeconfig とコンテキストを設定するための詳細は、k8s.io のドキュメント [Configure Access to Multiple Clusters](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) をご覧ください。
