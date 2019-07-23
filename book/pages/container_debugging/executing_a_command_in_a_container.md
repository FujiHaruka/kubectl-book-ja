{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の間違いは [GitHub の翻訳リポジトリ](https://github.com/FujiHaruka/kubectl-book-ja/issues) までお願いします。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- コンテナの中でコマンドを実行する
- コンテナの中でシェルを取得する

{% endpanel %}

# コマンドの実行

## 動機

コンテナの内部でコマンドを実行することで、ワークロードをデバッグします。コマンドは tty 経由のシェルも可能です。

{% method %}

## コマンドの実行

クラスタ内のコンテナの中でコマンドを実行するには、**Pod 名**を指定します。

{% sample lang="yaml" %}

```bash
kubectl exec nginx-78f5d695bd-czm8z ls
```

```bash
bin  boot  dev	etc  home  lib	lib64  media  mnt  opt	proc  root  run  sbin  srv  sys  tmp  usr  var
```

{% endmethod %}

{% method %}

## シェルの実行

コンテナの中でシェルを取得するには、`-t -i` オプションを使って tty を取得し STDIN にアタッチします。

{% sample lang="yaml" %}

```bash
kubectl exec -t -i nginx-78f5d695bd-czm8z bash
```

```bash
root@nginx-78f5d695bd-czm8z:/# ls
bin  boot  dev	etc  home  lib	lib64  media  mnt  opt	proc  root  run  sbin  srv  sys  tmp  usr  var
```

{% endmethod %}

{% panel style="info", title="コンテナの指定" %}
複数のコンテナを実行する Pod に対しては、シェルを実行するコンテナを `-c <container-name>` で指定すべきです。

{% endpanel %}
