# The Kubectl Book 日本語訳

[The Kubectl Book](https://kubectl.docs.kubernetes.io/) の日本語訳プロジェクト。

## Development

### Instalation

```
$ npm install
$ cd book; npm install
```

### 翻訳方法

1. `locales/` の YAML ファイルを編集する
1. `inalz build` で books/ の Markdown ファイルに反映される
1. book/ で `npm run build` すると `book/_book` に HTML 等が出力される
1. `serve _book` 等で確認できる
