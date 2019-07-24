{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- ベースの Pod と PodTemplate のイメージの**名前**と**タグ**を上書きする
- ベースの Pod と PodTemplate の環境変数と引数を上書きする

{% endpanel %}

# Pod のカスタマイズ

## 動機

ユーザーがアプリケーションを特定の環境用にカスタマイズすることがよくあります。
Pod Template をカスタマイズするシンプルな方法は**イメージ、環境変数、コマンドライン引数**を通じて行うことです。

よくある例は以下のようなものです。

- dev、test、canary、production 環境用に**異なるバージョンのイメージ**を実行する
- dev、test、canary、production 環境用に**異なる環境変数と引数**を Pod に設定する

{% panel style="info", title="Reference" %}

- [images](../reference/kustomize.md#images)
- [configMapGenerator](../reference/kustomize.md#configmapgenerator)
- [secretGenerator](../reference/kustomize.md#secretgenerator)

{% endpanel %}

## イメージのカスタマイズ

{% method %}

**ユースケース:** 複数の環境 (test、dev、staging、canary、prod) が異なるタグのイメージを使用します。

ベースの [Pod Template](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/#pod-templates) から `image` フィールドの名前とタグを上書きするには、`kustomization.yaml` の `images` フィールドを指定します。

| フィールド     | 説明                                                   | フィールドの例                   | 結果の例                               |
| --------- | ---------------------------------------------------- | ------------------------- | ---------------------------------- |
| `name`    | イメージ名にマッチするイメージ                                      | `name: nginx`             |                                    |
| `newTag`  | `name` にマッチするイメージ名をもつイメージに対して**タグ**や**ダイジェスト**を上書きする | `newTag: new`             | `nginx:old` -> `nginx:new`         |
| `newName` | `name` にマッチするイメージ名をもつイメージに対してイメージの**名前**を上書きする       | `newImage: nginx-special` | `nginx:old` -> `nginx-special:old` |

{% sample lang="yaml" %}

**入力:** `kustomization.yaml` ファイル

```yaml
# kustomization.yaml
bases:
- ../base
images:
  - name: nginx-pod
    newTag: 1.15
    newName: nginx-pod-2
```

**ベース:** `kustomization.yaml` により修正されるリソース

```yaml
# ../base/kustomization.yaml
resources:
- deployment.yaml
```

```yaml
# ../base/deployment.yaml
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
        image: nginx-pod
```

**適用:** クラスタに適用されるリソース

```yaml
# Modified Base Resource
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
      # The image image tag has been changed for the container
      - name: nginx
        image: nginx-pod-2:1.15
```

{% endmethod %}

{% panel style="info", title="イメージ名の置換" %}
`newImage` を使うとイメージ名を別の任意のイメージ名に置換できます。
たとえば、イメージ名を `webserver` や `database` と呼ぶために、`nginx` や `mysql` イメージ名を置換できます。

イメージのカスタマイズに関する詳細は [Container Images](../app_management/container_images.md) をご覧ください。

{% endpanel %}

## Pod の環境変数をカスタマイズする

{% method %}

**ユースケース:** 複数の環境 (test、dev、staging、canary、prod) に異なる環境変数を設定します。

Pod の環境変数を上書きします。

- ベースが Pod 内の ConfigMap データを環境変数として使用
- 各バリエーションは ConfigMap データを上書きまたは拡張する

{% sample lang="yaml" %}

**入力:** kustomization.yaml ファイル

```yaml
# kustomization.yaml
bases:
- ../base
configMapGenerator:
- name: special-config
  behavior: merge
  literals:
  - special.how=very # override the base value
  - special.type=charm # add a value to the base
```

**ベース: kustomization.yaml とリソース

```yaml
# ../base/kustomization.yaml
resources:
- deployment.yaml
configMapGenerator:
- name: special-config
  behavior: merge
  literals:
  - special.how=some # this value is overridden
  - special.other=that # this value is added
```

```yaml
# ../base/deployment.yaml
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
        envFrom:
        - configMapRef:
            name: special-config
```

**適用:** クラスタに適用されるリソース

```yaml
# Generated Variant Resource
apiVersion: v1
kind: ConfigMap
metadata:
  name: special-config-82tc88cmcg
data:
  special.how: very
  special.type: charm
  special.other: that
---
# Unmodified Base Resource
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
      - name: nginx
        image: nginx
        envFrom:
        # Container env will have the overridden ConfigMap values
        - configMapRef:
            name: special-config-82tc88cmcg
```

{% endmethod %}

[ConfigMaps and Secrets](../app_management/secrets_and_configmaps.md) 参照。

## Pod のコマンドライン引数をカスタマイズ

{% method %}

**ユースケース:** 複数の環境 (test、dev、staging、canary、prod) に異なるコマンドライン引数を与えます。

Pod のコマンド引数を上書きします。

- ベースは ConfigMap データをコマンド引数として使用
- 各バリエーションは異なる ConfigMap データを定義する

{% sample lang="yaml" %}

**入力:** kustomization.yaml ファイル

```yaml
# kustomization.yaml
bases:
- ../base
configMapGenerator:
- name: special-config
  behavior: merge
  literals:
  - SPECIAL_LEVEL=very
  - SPECIAL_TYPE=charm
```

```yaml
# ../base/kustomization.yaml
resources:
- deployment.yaml

configMapGenerator:
- name: special-config
  literals:
  - SPECIAL_LEVEL=override.me
  - SPECIAL_TYPE=override.me
```

```yaml
# ../base/deployment.yaml
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
      - name: test-container
        image: k8s.gcr.io/busybox
        command: [ "/bin/sh" ]
        # Use the ConfigMap Environment Variables in the Command
        args: ["-c", "echo $(SPECIAL_LEVEL_KEY) $(SPECIAL_TYPE_KEY)" ]
        env:
          - name: SPECIAL_LEVEL_KEY
            valueFrom:
              configMapKeyRef:
                name: special-config
                key: SPECIAL_LEVEL
          - name: SPECIAL_TYPE_KEY
            valueFrom:
              configMapKeyRef:
                name: special-config
                key: SPECIAL_TYPE
```

**適用:** クラスタに適用されるリソース

```yaml
# Generated Variant Resource
apiVersion: v1
kind: ConfigMap
metadata:
  name: special-config-82tc88cmcg
data:
  SPECIAL_LEVEL: very
  SPECIAL_TYPE: charm
---
# Unmodified Base Resource
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
      - image: k8s.gcr.io/busybox
        name: test-container
        command:
        - /bin/sh
        args:
        - -c
        # Container args will have the overridden ConfigMap values
        - echo $(SPECIAL_LEVEL_KEY) $(SPECIAL_TYPE_KEY)
        env:
        - name: SPECIAL_LEVEL_KEY
          valueFrom:
            configMapKeyRef:
              key: SPECIAL_LEVEL
              name: special-config-82tc88cmcg
        - name: SPECIAL_TYPE_KEY
          valueFrom:
            configMapKeyRef:
              key: SPECIAL_TYPE
              name: special-config-82tc88cmcg
```

{% endmethod %}

{% panel style="info", title="詳細" %}
ConfigMap と Secret の生成に関する詳細は [Secrets and ConfigMaps](../app_management/secrets_and_configmaps.md) を参照してください。

{% endpanel %}
