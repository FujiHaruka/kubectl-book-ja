{% panel style="success", title="翻訳" %}
このドキュメントは [The Kubectl Book](https://kubectl.docs.kubernetes.io/) の翻訳です。翻訳の GitHub リポジトリは[こちら](https://github.com/FujiHaruka/kubectl-book-ja)。

{% endpanel %}

{% panel style="info", title="TL;DR" %}

- 稼働中の Resource をエディタで編集する

{% endpanel %}

# リソースの編集

## 動機

クラスタ内のリソースを直接修正するために、構成をエディタで開きます。

{% method %}

## Edit

Edit を使うと、ローカルのファイルを介さずにクラスタ内のリソースを直接編集できます。

{% sample lang="yaml" %}

```yaml
# Edit the service named 'docker-registry':
kubectl edit svc/docker-registry
```

```yaml
# Use an alternative editor
KUBE_EDITOR="nano" kubectl edit svc/docker-registry
```

```yaml
# Edit the job 'myjob' in JSON using the v1 API format:
kubectl edit job.v1.batch/myjob -o json
```

```yaml
# Edit the deployment 'mydeployment' in YAML and save the modified config in its annotation:
kubectl edit deployment/mydeployment -o yaml --save-config
```

{% endmethod %}
