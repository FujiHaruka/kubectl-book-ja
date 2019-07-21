{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/JH35X82)**

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- クラスタ内のコンテナに / コンテナからファイルをコピーする

{% endpanel %}

# コンテナのファイルをコピー

## 動機

- クラスタ内のコンテナからローカルのファイルシステムにファイルをコピーする
- ローカルのファイルシステムからクラスタ内のコンテナにファイルをコピーする

{% panel style="warning", title="Tar のインストール" %}
コピーするには、コンテナイメージ内に **tar** のインストールが必要です。

{% endpanel %}

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

{% method %}

## リモートからローカルへ

Pod からリモートのファイルをローカルのファイルにコピーします。

- ローカルファイルの形式は `<path>`
- リモートファイルの形式は `<pod-name>:<path>`

{% sample lang="yaml" %}

```bash
kubectl cp /tmp/foo <some-pod>:/tmp/bar
```

{% endmethod %}

{% method %}

## コンテナを指定

複数コンテナを実行している Pod 内で特定のコンテナを指定します。

- `-c <container-name>`

{% sample lang="yaml" %}

```bash
kubectl cp /tmp/foo <some-pod>:/tmp/bar -c <specific-container>
```

{% endmethod %}

{% method %}

## 名前空間

Pod の名前空間を指定するには、Pod 名に `<namespace>/` というプレフィックスを付けます。

- `<pod-namespace>/<pod-name>:<path>`

{% sample lang="yaml" %}

```bash
kubectl cp /tmp/foo <some-namespace>/<some-pod>:/tmp/bar
```

{% endmethod %}
