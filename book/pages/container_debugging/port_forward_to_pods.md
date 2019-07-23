{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の間違いは [GitHub の翻訳リポジトリ](https://github.com/FujiHaruka/kubectl-book-ja/issues) までお願いします。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- ローカルの接続をクラスタ内で実行中の Pod にポートフォワードする

{% endpanel %}

# ポートフォワード

## 動機

ローカルのポートをポートフォワードすることで、クラスタ内で実行中の Pod のポートに接続します。

{% method %}

## 複数のポートをフォワードする

ローカルの 5000 番、6000 番ポートをリッスンし、Pod 内の 5000 番、6000 番ポートに / ポートからデータをフォワードします。

{% sample lang="yaml" %}

```bash
kubectl port-forward pod/mypod 5000 6000
```

{% endmethod %}

- - -

{% method %}

## ワークロード内の Pod

ローカルの 5000 番、6000 番ポートをリッスンし、Deployment に選択された Pod 内の  5000 番、6000 番ポートに / ポートからデータをフォワードします。

{% sample lang="yaml" %}

```bash
kubectl port-forward deployment/mydeployment 5000 6000
```

{% endmethod %}

- - -

{% method %}

## ローカルとリモートのポート番号が異なる場合

ローカルで 8888 番ポートをリッスンし、Pod 内の 5000 番ポートにフォワードします。

{% sample lang="yaml" %}

```bash
kubectl port-forward pod/mypod 8888:5000
```

{% endmethod %}

- - -

{% method %}

## ローカルのポート番号をランダムに割り当てる

ローカルのランダムなポート番号をリッスンし、Pod 内の 5000 番ポートにフォワードします。

{% sample lang="yaml" %}

```bash
kubectl port-forward pod/mypod :5000
```

{% endmethod %}
