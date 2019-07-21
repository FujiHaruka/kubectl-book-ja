{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/JH35X82)**

{% endpanel %}

{% panel style="warning", title="Experimental" %}
**Content in this chapter is experimental and will evolve based on user feedback.**

Leave feedback on the conventions by creating an issue in the [kubectl](https://github.com/kubernetes/kubectl/issues)
GitHub repository.

Also provide feedback on new kubectl docs at the [survey](https://www.surveymonkey.com/r/JH35X82)

{% endpanel %}

{% panel style="info", title="TL;DR" %}
別々のチームが所有しているリソース構成への変更を切り離す

{% endpanel %}

# リポジトリ構造をベースとしたレイアウト

## 動機

- **別々の環境を管理するチーム間で分離する**
  - 権限
- きめ細かい制御
  - PR
  - Issue
  - Project
  - Automation

## ディレクトリ構造

### リソース構成

| リポジトリのタイプ | クラスタへのデプロイ          | 内容          | 名前の例         |
| --------- | ------------------- | ----------- | ------------ |
| Base      | **No** - Base として使用 | 他チームと共有する構成 | `platform`   |
| App       | **Yes** - 手動 or 継続的 | デプロイ可能な構成   | `guest-book` |

[ディレクトリ](structure_directories.md)と[ブランチ](structure_branches.md)で説明されているテクニックを使用します。

## ワークフロー例

1. Java プラットフォームチームに所属するアリスが他チームが使用する Java Base を更新する
2. アリスが新規リリースのために Git タグを作成する
3. GuestBook App チームに所属するボブが新しい Java Base に切り替えるため、参照を更新する

## 図

### シナリオ

1. アリスが Java Base リポジトリを修正し、v2 タグを作成する

- 変更はこの段階ではどこにもプッシュされない

1. ボブが GuestBook App リポジトリを修正し、Java Base の v2 を使うようにする

- 変更が継続的デプロイメントによりプッシュされる

{% sequence width=1000 %}

participant Base Repo as BR
participant App Repo as AR
participant Cluster as C

Note left of BR: Alice: Platform Dev
Note over BR: Alice modifies java Base
Note over BR: Alice tags java Base v2
Note left of AR: Bob: App Dev
Note over AR: Uses java Base v1
BR-->AR: Bob updates to reference Base v2
Note over AR: Uses java Base v2
AR-->C: java Base v2 changes deployed

{% endsequence %}

{% method %}

{% sample lang="yaml" %}

構造:

- プラットフォームチームが共有の構成のために Base リポジトリを作成する
- App チームが App を開発するために App リポジトリを作成する
  - Base リポジトリをリモートに参照

**Base リポジトリ**: プラットフォームチーム

```bash
tree
.
├── bases # Used as a Base only
│   ├── kustomization.yaml
│   └── ...
├── java # Java Bases
│   ├── kustomization.yaml # Uses bases: ["../bases"]
│   └── ...
└── python # Python Bases
```

**App リポジトリ:** GuestBook チーム

```bash
tree
.
├── bases # References Base Repositories
│   └── ...
├── prod
│   └── ...
├── staging
│   └── ...
└── test
    └── ...
```

{% endmethod %}

{% panel style="info", title="リモート URL vs Vendoring" %}

- 同じ組織が所有・管理しているリポジトリは URL によって参照できます
- 別の組織が所有・管理しているリポジトリは vendor として管理し、vendor ディレクトリへのパスによって参照すべきです

{% endpanel %}
