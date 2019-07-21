{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/JH35X82)**

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- 変更の差分をクラスタに Apply される前に確認する

{% endpanel %}

# ローカルの状態とクラスタの状態の差分

## 動機

変更があったときにクラスタに適用される前にどんな変更があったのかを確認できると便利です。

{% method %}

## 差分の生成

ユーザーのパス内で `diff` プログラムを実行すると、Apply により作られる変更の差分を表示します。

{% sample lang="yaml" %}

```sh
kubectl diff -k ./dir/
```

{% endmethod %}

{% method %}

## Diff プログラムの設定

環境変数 `KUBECTL_EXTERNAL_DIFF` を設定すると自分の diff コマンドを選択できます。デフォルトでは、パス内で利用可能な "diff" コマンドが "-u" (unified) と "-N" (treat new files as empty) オプションで実行されます。

{% sample lang="yaml" %}

```sh
export KUBECTL_EXTERNAL_DIFF=meld; kubectl diff -k ./dir/
```

{% endmethod %}
