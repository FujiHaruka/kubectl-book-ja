{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- ローカルの接続をクラスタ内で稼働中の Pod にポートフォワードする

{% endpanel %}

# ポートフォワード

## 動機

ローカルのポートをポートフォワードすることで、クラスタ内で稼働中の Pod のポートに接続します。

{% method %}

## 複数のポートをフォワードする

ローカルの 5000 番、6000 番ポートを待ち受け、Pod 内の 5000 番、6000 番ポートに、あるいはポートからデータを転送します。

{% sample lang="yaml" %}

```bash
kubectl port-forward pod/mypod 5000 6000
```

{% endmethod %}

- - -

{% method %}

## ワークロード内の Pod

ローカルの 5000 番、6000 番ポートを待ち受け、Deployment に選択された Pod 内の  5000 番、6000 番ポートに、あるいはポートからデータを転送します。

{% sample lang="yaml" %}

```bash
kubectl port-forward deployment/mydeployment 5000 6000
```

{% endmethod %}

- - -

{% method %}

## ローカルとリモートのポート番号が異なる場合

ローカルで 8888 番ポートを待ち受け、Pod 内の 5000 番ポートに転送します。

{% sample lang="yaml" %}

```bash
kubectl port-forward pod/mypod 8888:5000
```

{% endmethod %}

- - -

{% method %}

## ローカルのポート番号をランダムに割り当てる

ローカルのランダムなポート番号を待ち受け、Pod 内の 5000 番ポートに転送します。

{% sample lang="yaml" %}

```bash
kubectl port-forward pod/mypod :5000
```

{% endmethod %}
