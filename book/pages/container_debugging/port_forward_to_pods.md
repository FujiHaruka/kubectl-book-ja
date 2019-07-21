{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/JH35X82)**
{% endpanel %}

{% panel style="info", title="TL;DR" %}

{% endpanel %}
- ローカルの接続をクラスタ内で実行中の Pod にポートフォワードする

# ポートフォワード

## 動機

ローカルのポートをポートフォワードすることで、クラスタ内で実行中の Pod のポートに接続します。
{% method %}

## 複数のポートをフォワードする

{% sample lang="yaml" %}
ローカルの 5000 番、6000 番ポートをリッスンし、Pod 内の 5000 番、6000 番ポートに / ポートからデータをフォワードします。

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

- - -
{% endmethod %}

## ローカルとリモートのポート番号が異なる場合

{% method %}
ローカルで 8888 番ポートをリッスンし、Pod 内の 5000 番ポートにフォワードします。

```bash
{% sample lang="yaml" %}
kubectl port-forward pod/mypod 8888:5000
```

- - -

{% endmethod %}
## ローカルのポート番号をランダムに割り当てる

ローカルのランダムなポート番号をリッスンし、Pod 内の 5000 番ポートにフォワードします。
{% method %}

```bash
kubectl port-forward pod/mypod :5000
{% sample lang="yaml" %}
```
