{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- コンテナイメージの名前とタグを上書きまたは設定する

{% endpanel %}

# コンテナイメージ

## 動機

多くのワークロードを横断して使用されるコンテナイメージにはタグやダイジェストを定義すると便利なことがあります。

コンテナイメージのタグおよびダイジェストは、コンテナイメージの特定のバージョンやインスタンスを参照します - たとえば `nginx` コンテナイメージにタグ `1.15.9` や `1.14.9` を使うことができます。

- 複数のワークロードで使用するコンテナイメージの名前とタグを一度に更新する
- プロジェクト内で使用されるコンテナイメージのバージョンの可視性を高める
- 環境変数といった外部のソースからイメージのタグを設定する
- 既存のプロジェクトをコピーまたはフォークして、コンテナのためにイメージのタグを変更する
- イメージを保存するレジストリを変更する

プロジェクトのコピーについて詳細は[ベースとバリエーション](../app_customization/bases_and_variants.md)を確認してください。

{% panel style="info", title="Reference" %}

- [images](../reference/kustomize.md#images)

{% endpanel %}

## images

`kustomization.yaml` の `images` フィールドを使うとコンテナイメージのイメージタグを設定できます。`images` が指定されると、Apply は `name` に名前がマッチするイメージを新しいタグで上書きします。

| フィールド     | 説明                                                  | フィールドの例                   | 結果の例                               |
| --------- | --------------------------------------------------- | ------------------------- | ---------------------------------- |
| `name`    | マッチさせたいイメージ名                                        | `name: nginx`             |                                    |
| `newTag`  | `name` に名前がマッチするイメージの **tag** および **digest** を上書きする | `newTag: new`             | `nginx:old` -> `nginx:new`         |
| `newName` | `name` に名前がマッチするイメージの **name** を上書きする               | `newImage: nginx-special` | `nginx:old` -> `nginx-special:old` |

{% method %}

**例:** `deployment.yaml` 内のコンテナイメージを更新するために `kustomization.yaml` の `images` を更新

Apply を実行すると `nginx` イメージは `1.8.0` タグをもつように設定され (たとえば `nginx:1.8.0`)、イメージ名が `nginx-special` に変更されます。**name** にマッチする**すべての**イメージの名前およびタグが設定されます。

{% sample lang="yaml" %}

**入力:** kustomization.yaml ファイルと deployment.yaml ファイル

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
images:
  - name: nginx # match images with this name
    newTag: 1.8.0 # override the tag
    newName: nginx-special # override the name
resources:
- deployment.yaml
```

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
```

**適用:** クラスタに適用されるリソース

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nginx
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      # The image has been changed
      - image: nginx-special:1.8.0
        name: nginx
```

{% endmethod %}

## 名前の設定

{% method %}

イメージ名は `newName` と以前のコンテナイメージ名を指定することで設定できます。

{% sample lang="yaml" %}

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
images:
  - name: mycontainerregistry/myimage
    newName: differentregistry/myimage
```

{% endmethod %}

## タグの設定

{% method %}

イメージのタグは `newTag` とコンテナイメージ名を指定することで設定できます。

{% sample lang="yaml" %}

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
images:
  - name: mycontainerregistry/myimage
    newTag: v1
```

{% endmethod %}

## ダイジェストの設定

{% method %}

イメージのダイジェストは `digest` とコンテナイメージ名を指定することで設定できます。

{% sample lang="yaml" %}

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
images:
  - name: alpine
    digest: sha256:24a0c4b4a4c0eb97a1aabb8e29f18e917d05abfe1b7a7c07857230879ce7d3d3
```

{% endmethod %}

## 最新の commit SHA からタグを設定する

{% method %}

よく使われる CI/CD のパターンとして、コンテナイメージにソースコードの git commit SHA でタグ付けするというやり方があります。たとえば、イメージ名が `foo` で、commit が `1bb359ccce344ca5d263cd257958ea035c978fd3` であるソースコードでイメージをビルドすると、そのコンテナイメージは `foo:1bb359ccce344ca5d263cd257958ea035c978fd3` となります。

ビルドしたイメージをプッシュする単純な方法は、[kustomize standalone](https://github.com/kubernetes-sigs/kustomize/) をダウンロードして、`kustomize edit set imagetag` コマンドを実行してタグを更新することです。そうすると手動でイメージタグを更新せずに済みます。

**例:** 最新の git commit SHA を `foo` イメージのイメージタグに設定

{% sample lang="yaml" %}

```bash
kustomize edit set imagetag foo:$(git log -n 1 --pretty=format:"%H")
kubectl apply -f .
```

{% endmethod %}

## タグを環境変数から設定する

{% method %}

commit SHA からタグを設定するのと同じテクニックを使えば、環境変数からタグを設定できます。

**例:** `foo` イメージのタグを環境変数 `FOO_IMAGE_TAG` の値で設定

{% sample lang="yaml" %}

```bash
kustomize edit set image foo:$FOO_IMAGE_TAG
kubectl apply -f .
```

{% endmethod %}

{% panel style="info", title="イメージタグの更新をコミットする" %}
`kustomization.yaml` の変更は検査できるように git にコミットすることが**可能です**。ただし、すでに CI/CD システムによってプッシュされたイメージタグの更新をコミットするとき、その更新によって新たなビルドとデプロイメントがトリガーしないよう気をつけてください。

{% endpanel %}
