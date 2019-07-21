{% panel style="success", title="Providing Feedback" %}
**Provide feedback at the [survey](https://www.surveymonkey.com/r/JH35X82)**
{% endpanel %}

# はじめに

アプリケーションを宣言的に管理するのが本番環境でのユースケースでは推奨されますが、命令的で porcelain なコマンドは開発や問題のバッグに役立ちます。
命令的な操作のシステムから来た人にとっては、これらのコマンドは部分的には Kubernetes の学習に役立つかもしれません。

**注意:** いつくかの命令的コマンドは `--dry-run -o yaml` とオプションを付けて実行することで、宣言的な形式を表示できます。

このセクションではリソース構成を生成または部分的に変更するための命令的コマンドを説明します。
