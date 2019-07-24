{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- 継続的にリソースを監視し、変更を検知して表示します

{% endpanel %}

# リソースの変更を監視

## 動機

リソースが更新されるたびにリソースを表示します。

{% method %}

`kubectl get` に**オブジェクトの変更を継続的に監視させ**、リソースが変更されたとき、または監視プロセスが再確立されたときにオブジェクトを表示させることができます。

{% sample lang="yaml" %}

```bash
kubectl get deployments --watch
```

```bash
NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx     1         1         1            1           6h
nginx2    1         1         1            1           21m
```

{% endmethod %}

{% panel style="danger", title="watch のタイムアウト" %}
watch は kubectl が監視プロセスを再確立し、リソースを表示してから **5 分でタイムアウトします**。

{% endpanel %}

{% method %}

`kubectl get` にオブジェクトの変更を継続的に監視させるときに、`--watch-only` フラグを使うと**最初のリソース取得を行わずに**監視させることができます。

{% sample lang="yaml" %}

```bash
kubectl get deployments --watch-only
```

{% endmethod %}
