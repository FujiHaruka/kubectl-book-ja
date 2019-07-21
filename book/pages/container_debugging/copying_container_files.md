{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/JH35X82)**
{% endpanel %}

{% panel style="info", title="TL;DR" %}

{% endpanel %}
- クラスタ内のコンテナに / コンテナからファイルをコピーする

# コンテナのファイルをコピー

## 動機

- クラスタ内のコンテナからローカルのファイルシステムにファイルをコピーする
- ローカルのファイルシステムからクラスタ内のコンテナにファイルをコピーする

{% panel style="warning", title="Tar のインストール" %}
{% endpanel %}
コピーするには、コンテナイメージ内に **tar** のインストールが必要です。
{% method %}

## ローカルからリモートへ

ローカルのファイルをリモートにあるクラスタ内の Pod にコピーします。

- ローカルファイルの形式は `<path>`
- リモートファイルの形式は `<pod-name>:<path>`
{% sample lang="yaml" %}

```bash
kubectl cp /tmp/foo_dir <some-pod>:/tmp/bar_dir
```

{% endmethod %}
## リモートからローカルへ
{% method %}

Pod からリモートのファイルをローカルのファイルにコピーします。

- ローカルファイルの形式は `<path>`
- リモートファイルの形式は `<pod-name>:<path>`

```bash
{% sample lang="yaml" %}
kubectl cp /tmp/foo <some-pod>:/tmp/bar
```

## コンテナを指定

{% endmethod %}
複数コンテナを実行している Pod 内で特定のコンテナを指定します。
{% method %}

- `-c <container-name>`

```bash
kubectl cp /tmp/foo <some-pod>:/tmp/bar -c <specific-container>
```
{% sample lang="yaml" %}

## 名前空間

Pod の名前空間を指定するには、Pod 名に `<namespace>/` というプレフィックスを付けます。

{% endmethod %}
- `<pod-namespace>/<pod-name>:<path>`
{% method %}

```bash
kubectl cp /tmp/foo <some-namespace>/<some-pod>:/tmp/bar
```
