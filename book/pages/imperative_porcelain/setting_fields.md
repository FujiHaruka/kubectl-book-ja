{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- リソース上のフィールドを命令的に設定する

{% endpanel %}

# リソースの作成

## 動機

開発やデバッグの目的でリソース上のフィールドをコマンドラインから直接設定します。本番環境でのアプリケーション管理には向いていません。

{% method %}

## Scale

リソース上の Replicas フィールドを設定するには `kubectl scale` コマンドを使用します。

{% sample lang="yaml" %}

```bash
# Scale a replicaset named 'foo' to 3.
kubectl scale --replicas=3 rs/foo
```

```sh
# Scale a resource identified by type and name specified in "foo.yaml" to 3.
kubectl scale --replicas=3 -f foo.yaml
```

```sh
# If the deployment named mysql's current size is 2, scale mysql to 3.
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql
```

```sh
# Scale multiple replication controllers.
kubectl scale --replicas=5 rc/foo rc/bar rc/baz
```

```sh
# Scale statefulset named 'web' to 3.
kubectl scale --replicas=3 statefulset/web
```

{% endmethod %}

{% panel style="info", title="条件的にスケールを更新する" %}
replicas を条件的に更新することは可能ですが、replicas が `--current-replicas` フラグを使った前回の既知の値から変更されていない場合に限ります。
例: `kubectl scale --current-replicas=2 --replicas=3 deployment/mysql`

{% endpanel %}

{% method %}

## Labels

ラベルを設定するには `kubectl label` コマンドを使用します。複数のリソースを一つのコマンドで更新するには `-l` フラグを使用します。

{% sample lang="yaml" %}

```sh
# Update pod 'foo' with the label 'unhealthy' and the value 'true'.
kubectl label pods foo unhealthy=true
```

```sh
# Update pod 'foo' with the label 'status' and the value 'unhealthy', overwriting any existing value.
kubectl label --overwrite pods foo status=unhealthy
```

```sh
# Update all pods in the namespace
kubectl label pods --all status=unhealthy
```

```sh
# Update a pod identified by the type and name in "pod.json"
kubectl label -f pod.json status=unhealthy
```

```sh
# Update pod 'foo' only if the resource is unchanged from version 1.
kubectl label pods foo status=unhealthy --resource-version=1
```

```sh
# Update pod 'foo' by removing a label named 'bar' if it exists.
# Does not require the --overwrite flag.
kubectl label pods foo bar-
```

{% endmethod %}

{% method %}

## Annotations

アノテーションを設定するには `kubectl annotate` コマンドを使用します。

{% sample lang="yaml" %}

```sh
# Update pod 'foo' with the annotation 'description' and the value 'my frontend'.
# If the same annotation is set multiple times, only the last value will be applied
kubectl annotate pods foo description='my frontend'
```

```sh
# Update a pod identified by type and name in "pod.json"
kubectl annotate -f pod.json description='my frontend'
```

```sh
# Update pod 'foo' with the annotation 'description' and the value 'my frontend running nginx', overwriting any
existing value.
kubectl annotate --overwrite pods foo description='my frontend running nginx'
```

```sh
# Update all pods in the namespace
kubectl annotate pods --all description='my frontend running nginx'
```

```sh
# Update pod 'foo' only if the resource is unchanged from version 1.
kubectl annotate pods foo description='my frontend running nginx' --resource-version=1
```

```sh
# Update pod 'foo' by removing an annotation named 'description' if it exists.
# Does not require the --overwrite flag.
kubectl annotate pods foo description-
```

{% endmethod %}

{% method %}

## Patches

任意のフィールドを設定するには `kubectl patch` コマンドを使用します。

{% sample lang="yaml" %}

```sh
# Partially update a node using a strategic merge patch. Specify the patch as JSON.
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'
```

```sh
# Partially update a node using a strategic merge patch. Specify the patch as YAML.
kubectl patch node k8s-node-1 -p $'spec:\n unschedulable: true'
```

```sh
# Partially update a node identified by the type and name specified in "node.json" using strategic merge patch.
kubectl patch -f node.json -p '{"spec":{"unschedulable":true}}'
```

```sh
# Update a container's image; spec.containers[*].name is required because it's a merge key.
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'
```

```sh
# Update a container's image using a json patch with positional arrays.
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"newimage"}]'
```

{% endmethod %}
