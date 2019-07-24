{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="warning", title="Experimental" %}
**Content in this chapter is experimental and will evolve based on user feedback.**

Leave feedback on the conventions by creating an issue in the [kubectl](https://github.com/kubernetes/kubectl/issues)
GitHub repository.

Also provide feedback on new kubectl docs at the [survey](https://www.surveymonkey.com/r/JH35X82)

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- 他のユーザーが Kustomize するためのホワイトボックスなアプリケーションをベースとして公開する

{% endpanel %}

# ベースの公開

## 動機

アプリケーションを構築するためにリソース構成をスクラッチで書かずに、共通のホワイトボックスなアプリケーションを実行したくなることがあります。そういう場合、公開されている既存のリソース構成を利用し、特定の用途のためにカスタマイズを追加してアプリケーションを構築したくなります。

- ホワイトボックスなアプリケーション (たとえば Cassandra、MongoDB) のインスタンスを既存のリソース構成から実行する
- アプリケーションを実行するためにリソース構成を公開する

## ホワイトボックスなベースの公開

{% method %}

ホワイトボックスなアプリケーションは URL で公開し、 `kustomization.yaml` の中でベースとして利用できます。これは以下の方法で利用できます。

**ユースケース:** ホワイトボックスなアプリケーションを GitHub で公開する

{% sample lang="yaml" %}

**入力:** kustomization.yaml ファイル

```yaml
# kustomization.yaml
bases:
# GitHub URL
- github.com/kubernetes-sigs/kustomize/examples/multibases/dev/?ref=v1.0.6
```

**適用:** クラスタに適用されるリソース

```yaml
# Resource comes from the Remote Base
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: myapp
  name: dev-myapp-pod
spec:
  containers:
  - image: nginx:1.7.9
    name: nginx
```

{% endmethod %}

## ホワイトボックスなベースをカスタマイズする

ホワイトボックスなアプリケーションを[ベースとバリエーション](../app_customization/bases_and_variants.md)で説明したのと同じ手法でカスタマイズできます。

## ホワイトボックスベースのバージョニング

ホワイトボックスベースは Git が提供する周知のバージョニング手法を使ってバージョニングできます。

**タグ:**

ベースをバージョニングするためにリポジトリにタグを適用し、そのタグを指すよう URL を修正します。`github.com/kubernetes-sigs/kustomize/examples/multibases?ref=v1.0.6`

**ブランチ:**

ベースをバージョニングするためにブランチを作成し、そのブランチを指すよう URL を修正します。`github.com/Liujingfang1/kustomize/examples/helloWorld?ref=repoUrl2`

**コミット:**

ベースのリポジトリがメンテナによって明示的にバージョニングされていない場合、特定のコミットにベースをピン付けできます。`github.com/Liujingfang1/kustomize/examples/helloWorld?ref=7050a45134e9848fca214ad7e7007e96e5042c03`

## ホワイトボックスベースのフォーク

GitHub にホストされているホワイトボックスベースを GitHub リポジトリをフォークすることによってフォークできます。これによって、ベース に対する変更を完全に管理できるようになります。その場合、定期的に upstream リポジトリの変更をフォークに pull し、不具合修正や最適化を取り入れるようにしてください。
