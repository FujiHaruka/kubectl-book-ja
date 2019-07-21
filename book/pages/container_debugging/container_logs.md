{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/JH35X82)**
{% endpanel %}

{% panel style="info", title="TL;DR" %}

{% endpanel %}
- クラスタ内のコンテナのログを表示する

# リソース情報の要約

## 動機

クラスタ内のコンテナのログを表示することで、ワークロードをデバッグします。
{% method %}

## Pod 内のコンテナのログを表示

{% sample lang="yaml" %}
単一のコンテナを実行している Pod のためにログを表示します。

```bash
kubectl logs echo-c6bc8ccff-nnj52
```

```bash
hello
hello
```
{% endmethod %}

{% panel style="success", title="クラッシュし続けるコンテナ" %}
もしコンテナがクラッシュをループしていて、コンテナ終了後にそのログを表示したい場合には、`-p` フラグを付けると**終了したコンテナのログを見ることができます**。例: `kubectl logs -p -c ruby web-1`

- - -

{% endpanel %}
## ワークロードのためにすべての Pod のログを表示

ワークロードのためにすべての Pod のログを表示します。
{% method %}

```bash
# Print logs from all containers matching label
{% sample lang="yaml" %}
kubectl logs -l app=nginx
```

{% panel style="success", title="Workloads Logs" %}
**ワークロードの管理下にあるすべてのコンテナ**のログを表示するには、`-l` フラグにワークロードのラベルセレクタを渡します。 たとえば、ワークロードのラベルセレクタが `app=nginx` だとすると、`-l "app=nginx"` を指定すると、そのワークロードのすべての Pod のログを表示できます。

{% endmethod %}
- - -

## コンテナのログを表示し続ける

コンテナからログをストリームとして表示します。

{% endpanel %}
```bash
# Follow logs from container
kubectl logs nginx-78f5d695bd-czm8z -f
{% method %}
```

- - -

{% sample lang="yaml" %}
## 終了したコンテナのログを表示

過去に実行したコンテナのログを表示します。これはクラッシュしたコンテナやクラッシュがループしているコンテナのログを表示するのに便利です。

```bash
# Print logs from exited container
{% endmethod %}
kubectl logs nginx-78f5d695bd-czm8z -p
```

{% method %}
- - -

## Pod 内のコンテナを選択する

{% sample lang="yaml" %}
Pod 内の特定のコンテナのログを表示します。これは Pod が複数のコンテナを実行していると必要になります。

```bash
# Print logs from the nginx container in the nginx-78f5d695bd-czm8z Pod
kubectl logs nginx-78f5d695bd-czm8z -c nginx
```
{% endmethod %}

- - -

{% method %}
## ある日時以後のログを表示

ある絶対時間以後に出力されたログを表示します。

{% sample lang="yaml" %}
```bash
# Print logs since a date
kubectl logs nginx-78f5d695bd-czm8z --since-time=2018-11-01T15:00:00Z
```

- - -
{% endmethod %}

## ある時間から現在までのログを表示

{% method %}
ある時間から現在までのログを表示します。

例:
{% sample lang="yaml" %}

- 0s: 0 秒
- 1m: 1 分
- 2h: 2 時間

```bash
{% endmethod %}
# Print logs for the past hour
kubectl logs nginx-78f5d695bd-czm8z --since=1h
```
{% method %}

- - -

## タイムスタンプを含める

ログの出力行にタイムスタンプを含めます。

```bash
# Print logs with timestamps
kubectl logs -l app=echo --timestamps
{% sample lang="yaml" %}
```

```bash
2018-11-16T05:26:31.38898405Z hello
2018-11-16T05:27:13.363932497Z hello
```
{% endmethod %}
