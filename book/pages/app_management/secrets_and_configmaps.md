{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/CLQBQHR)**
{% endpanel %}

{% panel style="info", title="TL;DR" %}

- Secret は `secretGenerator` を使用してファイルとリテラルから生成する
- ConfigMap は `configMapGenerator` を使用してファイルとリテラルから生成する
{% endpanel %}
- Secret と ConfigMap の変更をロールアウトする

# Secret と ConfigMap

{% panel style="info", title="Reference" %}

- [secretGenerators](../reference/kustomize.md#secretgenerator)
{% endpanel %}
- [configMapGenerators](../reference/kustomize.md#configmapgenerator)
- [generatorOptions](../reference/kustomize.md#generatoroptions)

## 動機

Secret リソースと ConfigMap リソースの元ソースは通常、`.properties` ファイルとして保存するなど、他の場所に保管します。Apply は Secret と ConfigMap をファイルやリテラルといった他のソースから生成する機能をサポートしています。

また、Secret と ConfigMap はそれを使用する Pod に変更をロールアウトするときに、他の多くのリソースとは違った方法でロールアウトを実行する必要があります。

## ジェネレータ

Secret リソースと ConfigMapリソースは、`secretGenerator` と `configMapGenerator` という項目を `kustomization.yaml` に追加することによって生成できます。

**生成されたリソースの名前には接尾辞が付加されますが、データが変更されると接尾辞も変更されます。詳細は [Rollouts](#rollouts) を確認してください。**

### ファイルによる ConfigMap

ConfigMap リソースは Java の `.properties` ファイルのようなファイルから生成されます。ConfigMap をファイルから生成するには、`configMapGenerator` の項目にファイル名を追加してください。

**例:** ファイルに記述された内容をデータ項目として持つ ConfigMap の生成

ConfigMap はファイルの内容から集められたデータ値を持ちます。各ファイルの内容は ConfigMap の中でファイル名をキーとした一つのデータとして現れます。
{% method %}

**入力:** kustomization.yaml ファイル

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
configMapGenerator:
{% sample lang="yaml" %}
- name: my-application-properties
  files:
  - application.properties
```

```yaml
# application.properties
FOO=Bar
```

**適用:** クラスタに適用されるリソース

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  # The name has had a suffix applied
  name: my-application-properties-c79528k426
# The data has been populated from each file's contents
data:
  application.properties: |
    FOO=Bar
```

### リテラルによる ConfigMap

ConfigMap リソースは `JAVA_HOME=/opt/java/jdk` のようなキーバリューのリテラルからも生成できます。キーバリューのリテラルから ConfigMap リソースを生成するには、`configMapGenerator` 項目を追加して、そこに `literals` のリストを定義してください。

{% panel style="info", title="リテラルの構文" %}

{% endmethod %}
- キーとバリューは `=` 記号で区切られます (左側がキー)
- 各リテラルの値は ConfigMap の中でキー名自体をキーとしたデータ項目として現れます。

**例:** リテラルによって生成された 2 つのデータ項目をもつ ConfigMap を生成

**入力:** kustomization.yaml ファイル

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
{% endpanel %}
kind: Kustomization
{% method %}
configMapGenerator:
- name: my-java-server-env-vars
{% sample lang="yaml" %}
  literals:
  - JAVA_HOME=/opt/java/jdk
  - JAVA_TOOL_OPTIONS=-agentlib:hprof
```

**適用:** クラスタに適用されるリソース

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  # The name has had a suffix applied
  name: my-java-server-env-vars-k44mhd6h5f
# The data has been populated from each literal pair
data:
  JAVA_HOME: /opt/java/jdk
  JAVA_TOOL_OPTIONS: -agentlib:hprof
```

### 環境ファイルによる ConfigMap

ConfigMap リソースをキーバリューから生成するにはリテラルを使うのが一つの選択肢ですが、環境ファイルのキーバリューからも生成できます。環境ファイルは一般に `.env` が末尾に付きます。環境ファイルから ConfigMap リソースを生成するには、`configMapGenerator` という項目を加え、そこに `env` 項目 (たとえば `env: config.env`) を追加します。

{% panel style="info", title="環境ファイルの構文" %}

- 環境ファイルの中でキーバリューは `=` で区切られます (左側がキー)。
{% endmethod %}
- 各行の値は ConfigMap の中でキー名自体をキーとしたデータ項目として現れます。

**例:** 環境ファイルによって生成された 3 つのデータをもつ ConfigMap を作成

**入力:** kustomization.yaml ファイル

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
configMapGenerator:
{% endpanel %}
- name: tracing-options
{% method %}
  env: tracing.env
```
{% sample lang="yaml" %}

```bash
# tracing.env
ENABLE_TRACING=true
SAMPLER_TYPE=probabilistic
SAMPLER_PARAMETERS=0.1
```

**適用:** クラスタに適用されるリソース

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  # The name has had a suffix applied
  name: tracing-options-6bh8gkdf7k
# The data has been populated from each literal pair
data:
  ENABLE_TRACING: "true"
  SAMPLER_TYPE: "probabilistic"
  SAMPLER_PARAMETERS: "0.1"
```

{% panel style="success", title="ベースの ConfigMap の値の上書き" %}
ベース (Base) から生成された ConfigMap は、Variant の ConfigMap 用に別のジェネレータを追加し、`behavior` フィールドを指定することで上書きできます。`behavior` は、`create` (デフォルト値)、`replace` (ベースの ConfigMap を置換)、`merge` (ConfigMap の値を追加または更新) のうちどれか一つの値を取ります (たとえば、`behavior: "merge"`)。ベースの詳しい使い方は [Bases and Variantions](../app_customization/bases_and_variants.md) 参照。

### ファイルによる Secret

Secret リソースは ConfigMap とほぼ同じように生成できます。リテラル、ファイル、環境ファイルから生成できます。

{% panel style="info", title="Secret の構文" %}
Secret のタイプは `type` フィールドを使って設定します。
{% endmethod %}

**例:** ローカルのファイルから `kubernetes.io/tls` という Secret を生成

**入力:** kustomization.yaml ファイル

```yaml
# kustomization.yaml
{% endpanel %}
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
secretGenerator:
- name: app-tls
  files:
    - "secret/tls.cert"
    - "secret/tls.key"
  type: "kubernetes.io/tls"
{% endpanel %}
```
{% method %}

**適用:** クラスタに適用されるリソース
{% sample lang="yaml" %}

```yaml
apiVersion: v1
kind: Secret
metadata:
  # The name has had a suffix applied
  name: app-tls-4tc9tcbd8k
type: kubernetes.io/tls
# The data has been populated from each command's output
data:
  tls.crt: LS0tLS1CRUd...tCg==
  tls.key: LS0tLS1CRUd...0tLQo=
```

### ジェネレータのオプション

`generatorOptions` を使って、生成されるオブジェクトに対して横断的にオプションを指定することもできます。

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
generatorOptions:
  # labels to add to all generated resources
  labels:
    kustomize.generated.resources: somevalue
  # annotations to add to all generated resources
  annotations:
{% endmethod %}
    kustomize.generated.resource: somevalue
  # disableNameSuffixHash is true disables the default behavior of adding a
  # suffix to the names of generated resources that is a hash of
{% method %}
  # the resource contents.
  disableNameSuffixHash: true
```
{% sample lang="yaml" %}

### 名前の接尾辞の伝播

ConfigMap と Secret を参照するワークロードは、生成されたリソースの名前を知る必要がありますが、その名前には接尾辞が含まれています。Apply はこれを自動的に処理してくれます。Apply は生成された ConfigMap と Secret への参照を識別し、更新します。

生成された ConfigMap の名前は `my-java-server-env-vars` のような文字列に、ConfigMap の中身に応じた一意な接尾辞が付きます。中身が変われば名前の接尾辞も変更されるため、新しい ConfigMap が作成されることになり、それを指すようにワークロードが作り変えられます。

PodTemplate volume は ConfigMap をジェネレータの中で指定された名前 (接尾辞を除いた名前) で参照します。Apply は ConfigMap の名前に適用された、接尾辞を含む名前に更新します。

**入力:** kustomization.yaml ファイルと deployment.yaml ファイル

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
configMapGenerator:
- name: my-java-server-env-vars
  literals:
{% endmethod %}
  - JAVA_HOME=/opt/java/jdk
  - JAVA_TOOL_OPTIONS=-agentlib:hprof
resources:
{% method %}
- deployment.yaml
```

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test-deployment
  labels:
    app: test
{% sample lang="yaml" %}
spec:
  selector:
    matchLabels:
      app: test
  template:
    metadata:
      labels:
        app: test
    spec:
      containers:
      - name: container
        image: k8s.gcr.io/busybox
        command: [ "/bin/sh", "-c", "ls /etc/config/" ]
        volumeMounts:
        - name: config-volume
          mountPath: /etc/config
      volumes:
      - name: config-volume
        configMap:
          name: my-java-server-env-vars
```

**適用:** クラスタに適用されるリソース

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  # The name has been updated to include the suffix
  name: my-java-server-env-vars-k44mhd6h5f
data:
  JAVA_HOME: /opt/java/jdk
  JAVA_TOOL_OPTIONS: -agentlib:hprof
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: test
  name: test-deployment
spec:
  selector:
    matchLabels:
      app: test
  template:
    metadata:
      labels:
        app: test
    spec:
      containers:
      - command:
        - /bin/sh
        - -c
        - ls /etc/config/
        image: k8s.gcr.io/busybox
        name: container
        volumeMounts:
        - mountPath: /etc/config
          name: config-volume
      volumes:
      - configMap:
          # The name has been updated to include the
          # suffix matching the ConfigMap
          name: my-java-server-env-vars-k44mhd6h5f
        name: config-volume
```

## ロールアウト

ConfigMap の値は Pod に使用されますが、その供給方法は環境変数、コマンドライン引数、ファイルがあります。

これらの区別は ConfigMap の変更が以下を伴うため、重要です。

- ファイルは、更新されるとそれを使用する**すべての** Pod によってマウントされているファイルが直ちに更新される
- 環境変数やコマンドライン引数は、Pod が再起動されるまで更新されない

ConfigMap の変更がプッシュされたら、ただちに Pod に対する ConfigMap の変更をローリングアップデートするのが典型的な運用方法です。

Apply はデータが更新されるたびに新しく ConfigMap を作成するため、ConfigMap のローリングアップデートは容易です。ワークロード (たとえば Deployment、StatefulSet など) は古い ConfigMap から新しい ConfigMap を指すように更新されます。これによって変更を少しずつ反映させることが可能になりますが、他の Pod Template の変更をロールアウトするときにも同様のやり方が採用されています。

生成された各リソースの名前には ConfigMap の内容をハッシュ化した接尾辞が付きます。この方法は、ConfigMap の内容が修正されるたびに新しい ConfigMap が生成されることを保証します。

**注意:** リソース名は接尾辞を含むため、`kubectl get` でリソースを探すときに、リソース名は kustomization.yaml ファイルの中で指定した名前と厳密に一致しません。
