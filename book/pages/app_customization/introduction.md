{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

# はじめに

このセクションでは、複数のチームで構成を共有してプロジェクトやアプリケーションを構築する方法を説明します。
kustomization を適用することで、複数のチームで共同作業でリソース構成を書くことができるようになります。

kustomization は以下の作業を容易にします。

- 異なる設定を持つ複数の環境のためにリソース構成のバリエーションの開発
- 異なる設定を持つ複数のクラスタのためにリソース構成のバリエーションの開発
- ユーザーが拡張・カスタマイズすることのできる既製のリソース構成の開発および公開
- 複数のソースからリソース構成を組み合わせる
