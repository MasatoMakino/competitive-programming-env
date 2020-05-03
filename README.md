# competitive-programming-env

> 競技プログラミング用開発環境です。

## Getting Started

### Download

[zipファイル](https://github.com/MasatoMakino/competitive-programming-env/archive/master.zip) をダウンロードして展開してしてください。

### auth.json

認証情報を格納した`./auth.json`ファイルを展開したディレクトリに追加してください。

```auth.json
{
  "atcoder": {
    "id": "...",
    "pass": "..."
  },
  "paiza": {
    "id": "...",
    "pass": "..."
  }
}
```

### yarn install

次に、ターミナルを開き、ファイルを展開したディレクトリに移動します。

```bash
cd <ファイルを展開したディレクトリ>
```

移動したら以下のコマンドを実行します。

```bash
yarn
```

必要なパッケージが`node_modules`ディレクトリ内にダウンロードされます。

## How to use

npm scriptsのinitコマンドを実行すると、testディレクトリとsrcディレクトリが初期化されます。watchコマンドを実行し、src/index.jsを更新するとテストが走ります。

## npm scripts

+ "watch" ソースファイルの更新に合わせて、自動でテストを繰り返します。
+ "testAll" テストを手動で実行します。
+ "init": クリップボードのURLから、テストケースを取得し、`src/index.js`を初期化します。
+ "add": 空のテストケースを作成し、src/index.js`を初期化します。リモートから取得できない場合のためのコマンドです。
