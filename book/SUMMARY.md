# Kubectl によるリソース管理

## 予備知識

- [Kubectl をはじめる](pages/kubectl_book/getting_started.md)
- [リソースとコントローラの概説](pages/kubectl_book/resources_and_controllers.md)

## アプリ管理

- [はじめに](pages/app_management/introduction.md)
- [Apply](pages/app_management/apply.md)
- [Secrets と ConfigMaps](pages/app_management/secrets_and_configmaps.md)
- [コンテナイメージ](pages/app_management/container_images.md)
- [名前空間と名前](pages/app_management/namespaces_and_names.md)
- [ラベルとアノテーション](pages/app_management/labels_and_annotations.md)
- [フィールドのマージについての意味論](pages/app_management/field_merge_semantics.md)

## リソースの表示

- [概要](pages/resource_printing/summaries.md)
- [詳細](pages/resource_printing/raw.md)
- [フィールド](pages/resource_printing/fields.md)
- [Describe](pages/resource_printing/describe.md)
- [クエリとオプション](pages/resource_printing/queries_and_options.md)
- [監視](pages/resource_printing/watch.md)
- [クラスタ情報](pages/resource_printing/cluster_information.md)

## コンテナのデバッグ

- [コンテナのログ](pages/container_debugging/container_logs.md)
- [コンテナのファイルコピー](pages/container_debugging/copying_container_files.md)
- [コンテナにコマンドを実行](pages/container_debugging/executing_a_command_in_a_container.md)
- [Pod へのポートフォワード](pages/container_debugging/port_forward_to_pods.md)
- [Service へのトラフィックをプロキシする](pages/container_debugging/proxying_traffic_to_services.md)

## アプリのカスタマイズ

- [はじめに](pages/app_customization/introduction.md)
- [Base とバリエーション](pages/app_customization/bases_and_variants.md)
- [Pod Template のカスタマイズ](pages/app_customization/customizing_pod_templates.md)
- [任意のフィールドのカスタマイズ](pages/app_customization/customizing_arbitrary_fields.md)
- [構成の反映](pages/app_customization/config_reflection.md)

## アプリの構造化

- [はじめに](pages/app_composition_and_deployment/structure_introduction.md)
- [ディレクトリによるレイアウト](pages/app_composition_and_deployment/structure_directories.md)
- [ブランチによるレイアウト](pages/app_composition_and_deployment/structure_branches.md)
- [リポジトリによるレイアウト](pages/app_composition_and_deployment/structure_repositories.md)
- [共有 Base によるレイアウト](pages/app_composition_and_deployment/structure_multi_tier_apps.md)

## アプリのデプロイ

- [ローカルの状態とリモートの状態の差分](pages/app_composition_and_deployment/diffing_local_and_remote_resources.md)
- [複数のクラスタにアクセス](pages/app_composition_and_deployment/accessing_multiple_clusters.md)
- [リソース構成の公開](pages/app_composition_and_deployment/publishing_bases.md)

## リファレンス

- [kustomization.yaml](pages/reference/kustomize.md)

## 例

- [kustomization.yaml](pages/examples/kustomize.md)

## 雑多な命令的コマンド

- [はじめに](pages/imperative_porcelain/introduction.md)
- [リソースの作成](pages/imperative_porcelain/creating_resources.md)
- [フィールドの設定](pages/imperative_porcelain/setting_fields.md)
- [ワークロードの編集](pages/imperative_porcelain/editing_workloads.md)
