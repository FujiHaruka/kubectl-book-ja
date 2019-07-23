{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の間違いは [GitHub の翻訳リポジトリ](https://github.com/FujiHaruka/kubectl-book-ja/issues) までお願いします。

{% endpanel %}

{% panel style="warning", title="Experimental" %}
**Content in this chapter is experimental and will evolve based on user feedback.**

Leave feedback on the conventions by creating an issue in the [kubectl](https://github.com/kubernetes/kubectl/issues)
GitHub repository.

Also provide feedback on new kubectl docs at the [survey](https://www.surveymonkey.com/r/JH35X82)

{% endpanel %}

{% panel style="info", title="TL;DR" %}
分離された環境にデプロイするために構成の変更を切り離す

{% endpanel %}

# ブランチ構造をベースとしたレイアウト

## 動機

**なせブランチを使うか**。リリース時にロールアウトされる変更 (たとえば新しいフラグ) を、本番環境のイベントに対するレスポンスでロールアウトされる変更から分離するためです。

## ブランチ構造

ここで説明する方法は必要に応じて変更また応用してください。

| ブランチのタイプ | クラスタにデプロイするか              | 目的                                                             | 構成の変更例                             | ブランチ名の例                                        |
| -------- | ------------------------- | -------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------- |
| Base     | **No** - 他のブランチからマージされるだけ | リリースの一部としてロールアウトされるべき変更                                        | *pubsub topic* フラグを加える             | `master`, `release-1.14`, `i1026`              |
| Deploy   | **Yes** - 手動 or 継続的       | Base と、"production" (または dev、staging など) のイベントに対する反応として要求される変更 | **メモリリソース**の増量 - たとえばコンテナのクラッシュにより | `deploy-test`, `deploy-staging`, `deploy-prod` |

[ディレクトリ](structure_directories.md)と[ブランチ](structure_branches.md)で説明されているテクニックを使用します。

## ワークフロー例

### 図

#### シナリオ

1. Live Prod App のバージョンは *v1*
2. *v2* の変更が Base ブランチの構成にコミットされる
3. *v2* が Staging にロールアウトされる

- 継続的デプロイメントによりデプロイされる

1. Live Prod App が *v1* への変更を (*v2* とは無関係に) 要求する

- Prod のメモリリソースを変更

1. Prod ブランチの構成を *v1* のまま更新

- 継続的デプロイメントによりただちにデプロイされる

1. *v2* の変更が別でロールアウトされる

- Base ブランチのタグが Prod ブランチにマージされる
- Prod ブランチが継続的デプロイされる

{% sequence width=1000 %}

participant Base Branch as BB
participant Staging Branch as SB
participant Staging Clusters as SC
participant Prod Branch as PB
participant Prod Clusters as PC

Note over SC: At v1 release
Note over PC: At v1 release
Note left of BB: Bob: App Dev
Note over BB: Bob Adds Flag
Note over BB: Bob Tags v2
Note over SB: Bob Releases v2
BB-->SB: Merge v2
SB-->SC: Deploy
Note over SC: At v2 release
Note over BB,PC: Prod Outage
Note left of PB: Alice: App SRE
Note over PB: Alice fixes Config
PB-->PC: Alice's changes (only)
Note over PC: At v1* release
Note over BB,PC: Prod Outage resolved
Note over PB: Alice Releases v2
BB-->PB: Merge v2
PB-->PC: Deploy v2
Note over PC: At v2 release

{% endsequence %}

### 詳細

**注意:** アプリケーションのバージョンは *v1* から始まります

1. 開発者のボブは *v2* リリースで使用する新しいアプリのフラグを導入する

- 例: PubSub のトピック名

1. ボブは Base 構成を更新して新しいフラグを取り入れる

- Staging 環境用のトピック (`staging-topic`) を追加する
- Prod 環境用のトピック (`prod-topic`) を追加する
- フラグは *v2* リリースでロールアウトする

1. *v2* が切られる

- Base ブランチが *v2* タグでタグ付けされる

1. *v2* が Staging にロールアウトされる

- *v2* タグ -> Staring ブランチにマージ
- Staging ブランチを Staging クラスタにデプロイ

1. 運用担当のアリスが (*v1* の) Prod 環境で問題を発見する

- コンテナのメモリを増量することで修正する

1. アリスは Prod ブランチの構成を更新し、メモリリリースを増量する

- 変更は直接 Prod ブランチに行い、Base ブランチを経由しない

1. *v1* の変更が Prod にロールアウトされる (*v1++*)

- アリスの変更を含むが、ボブの変更は含まない

1. *v2* が Prod にロールアウトされる

- *v2* タグ -> Prod ブランチにマージ
- Prod ブランチを Prod クラスタにデプロイ

{% method %}

テクニック:

- 新しく要求されたフラグと環境変数をコードに追加するとき、Base ブランチのリリース構成に追加する
  - コードがロールアウトされると構成もロールアウトされるため
- フラグと設定は、デプロイブランチのデプロイディレクトリにあるリソース構成に合わせて調整する
  - 独立したバージョンがただちにロールアウトされる
- Base ブランチからデプロイブランチにマージし、ロールアウトを実行する

## ディレクトリとブランチのレイアウト

構造:

- 構成の変更を受ける Base ブランチ (`master`、`app-version` など) はリリースに結びつく
  - [ディレクトリ](structure_directories.md)と同様
- 環境ごとにデプロイブランチを分離する (`deploy-<env>` など)
  - 各ブランチに伴う新しいディレクトリは overlay カスタマイズを含む - `deploy-<env>` など

{% sample lang="yaml" %}

**Base ブランチ:** `master`

```bash
tree
.
├── bases
│   ├── ...
├── prod
│   ├── bases
│   │   ├── ...
│   ├── us-central
│   │   ├── kustomization.yaml
│   │   └── backend
│   │       └── deployment-patch.yaml
│   ├── us-east
│   │   └── kustomization.yaml
│   └── us-west
│       └── kustomization.yaml
├── staging
│   ├── bases
│   │   ├── ...
│   └── us-west
│       └── kustomization.yaml
└── test
    ├── bases
    │   ├── ...
    └── us-west
        └── kustomization.yaml
```

**デプロイブランチ:**

Prod ブランチ: `deploy-prod`

```bash
tree
.
├── bases # From Base Branch
│   └── ...
└── deploy-prod # Prod deploy folder
│   ├── us-central
│   │   ├── kustomization.yaml # Uses bases: ["../../prod/us-central"]
│   ├── us-east
│   │   └── kustomization.yaml # Uses bases: ["../../prod/us-east"]
│   └── us-west
│       └── kustomization.yaml # Uses bases: ["../../prod/us-west"]
├── prod # From Base Branch
│   └── ...
├── staging # From Base Branch
│   └── ...
└── test # From Base Branch
    └── ...
```

Staging ブランチ: `deploy-staging`

```bash
tree
.
├── bases # From Base Branch
│   ├── ...
├── deploy-staging # Staging deploy folder
│   └── us-west
│       └── kustomization.yaml # Uses bases: ["../../staging/us-west"]
├── prod # From Base Branch
│   └── ...
├── staging # From Base Branch
│   └── ...
└── test # From Base Branch
    └── ...
```

Test ブランチ: `deploy-test`

```bash
tree
.
├── bases # From Base Branch
│   ├── ...
├──deploy-test # Test deploy folder
│   └── us-west
│       └── kustomization.yaml # Uses bases: ["../../test/us-west"]
├── prod # From Base Branch
│   └── ...
├── staging # From Base Branch
│   └── ...
└── test # From Base Branch
    └── ...
```

{% endmethod %}

## ロールバックのワークフロー例

ブランチで運用するときのロールバックのワークフロー例の概要:

1. 動作中の Prod アプリは *v1*
2. 変更が Base ブランチの構成に取り入れられる

- バージョン *v2* としてリリースされる

1. リリース *v2* が切られ、ロールアウトされる

- Base のタグ *v2* が切られ、アーティファクト (イメージなど) がビルドされる

1. 変更が Base ブランチの構成に取り入れられる

- バージョン *v3* としてリリースされる

1. *v2* が (ついに) Prod にプッシュされる

- *v2* タグを Prod ブランチにマージ

1. Prod で *v2* に問題が見つかり、ロールバックしなければならなくなる

- *v2* の変更が新しいコミットとして Prod ブランチに行われ、ロールバックされる

1. Base ブランチは影響を受けない

- 修正が *v3* に取り入れられる

**注意:** "v3" で Base に新しい変更がコミットされた場合、"v2" から "v1" へのロールバックがより難しくなるということはありません。"v3" の変更は Prod ブランチにマージされていないからです。

### 図

{% sequence width=1000 %}

participant Base Branch as BB
participant Staging Branch as SB
participant Staging Clusters as SC
participant Prod Branch as PB
participant Prod Clusters as PC

Note over SC: At v1 release
Note over PC: At v1 release
Note left of BB: Bob: App Dev
Note over BB: Bob Adds Flag (for v2)
Note over BB: Bob Tags v2
Note over SB: Bob Releases v2
BB-->SB: Merge v2
SB-->SC: Deploy
Note over SC: At v2 release
Note over SB: Bob Adds another Flag (for v3)
Note over PB: Bob Releases v2
BB-->PB: Merge v2
PB-->PC: Deploy v2
Note over PC: At v2 release
Note over BB,PC: Unrelated Prod Outage
Note left of PB: Alice: App SRE
Note over PB: Alice rolls back v2 merge commit
PB-->PC: Deploy v1
Note over PC: At v1 release
Note over BB,PC: Prod Outage resolved

{% endsequence %}
