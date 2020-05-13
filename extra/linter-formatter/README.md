# Linter/Formatter
開発効率やコード品質の向上が期待できるツールとして、LinterやFormatterがあります。ここではそれらの紹介をします。

## Linter
コードを実行する前に、文法エラーや、コーディング規約に則ってないコードを検出してくれるツールです。また、検出したコードを自動修正する(後述のFormatterの機能)こともできます。Linterを使うメリットは、バグやバッドプラクティスを防いでコードの品質の向上に繋げられることや、見た目の一貫性を立つことで読みやすいコードにできること、コードレビュー時の負担を減らすこと(e.g. コーディング規約に沿ってない箇所がある場合はレビューできないようにプログラムでチェックする)などがあります。

JSのLinterなら、[ESLint](https://eslint.org/)を使うことが多いでしょう。TSの場合も、ESLintを使うのがいいでしょう(以前は[TSLint](https://github.com/palantir/tslint)も選択肢にあったのですが、ESLintとの統合が進められることになったので、TSLintは非推奨です)。

[ESLint自体が提供しているルール](https://eslint.org/docs/rules/)だけでもかなりの数があります。デフォルトでは全てのルールが無効の状態なので、ESLintを活用するには自分のプロジェクトに合わせたルールを有効にする必要があります。自分のプロジェクトに合わせたルールを1から作るのは大変(先ほど話したように、ルールはかなりの数があります...)なので、あらかじめよく使いそうなルールをまとめてくれた[Shareable Config](https://eslint.org/docs/developer-guide/shareable-configs)を使ってベースのルールセットを作り、その上で自分のプロジェクトに合わせてルールの追加や上書きを行うのが一般的です。

さらにプラグインという形でルールを追加することもできます。例えば、Vue.js用のルールである[eslint-plugin-vue](https://eslint.vuejs.org/)などが該当します。もちろん自分でルールを追加することもできるので、プロジェクトで必要だけれど欲しいルールが見つからないという時は自作してみるチャンスかもしれません。

以下では、`eslint`にあるコードを使って、ESLintによるエラー検出の動作確認をしてみます。

`.eslintrc.js`はESLintの設定ファイルです。ここでは、以下のルールを設定しました。
- クォーテーションがダブルクォーテーション(`"`)ではない場合にエラー
- 文末のセミコロンがない場合にエラー

```js
module.exports = {
  "rules": {
    "quotes": ["error", "double"],
    "semi": ["error", "always"]
  }
};
```

`src/index.js`がESLintによってチェックされるコードです。

```js
// クォーテーションがダブルクォーテーション(`"`)ではない
// 文末のセミコロンがない
console.log('Hello eslint')
```

npm scripts(package.jsonの`scripts`に定義したコマンド。ここでは、`npm run lint`)を使ってLintを実行すると、ルールに違反しているところがエラーになります。
ちなみに、VSCodeなどのエディタでESLintと連携していれば、エディタ上でもエラーを確認できるので修正がしやすいです。

```sh
$ npm run lint
> eslint src/**/*.js


/path/to/eslint/src/index.js
  3:13  error  Strings must use doublequote  quotes
  3:28  error  Missing semicolon             semi

✖ 2 problems (2 errors, 0 warnings)
  2 errors and 0 warnings potentially fixable with the `--fix` option.
```

`--fix`オプションをコマンド(ここでは、`npm run lint:fix`)で実行して、ルール違反しているところを自動修正できます。

```sh
# 以下のコマンドを実行後に、自動修正ができている
$ npm run lint:fix
> @ lint:fix /path/to/eslint
> npm run lint -- --fix


> @ lint /path/to/eslint
> eslint src/**/*.js "--fix"
```

## Formatter
コードを整形して、ソースコードの見た目の一貫性を保ってくれるツールです。Formatterを導入するメリットは、Linterにも書いた、見た目の一貫性を立つことで読みやすいコードにできることやコードレビュー時の負担を減らすことがあります。

よく使われるライブラリとして、[Prettier](https://prettier.io/)があります。

ここまで述べてきたように、LinterとFormatterにはどちらも同じような機能があります。しかし、この2つを併用するプロジェクトも多くあります。その理由はESLintの自動修正では修正できないコードも、Prettierなら修正できるためです。

以下では、`prettier`にあるコードを使って、ESLintだと自動修正できないが、Prettierなら自動修正できる例(1行の文字数が規定値より多い場合)を確認してみます。

検証のために、`.eslintrc.js`を作成します。今回はESLintのルールを[Prettierの1行の文字数の設定](https://prettier.io/docs/en/options.html#print-width)にあわせて、80文字にします。

```js
module.exports = {
  "rules": {
    "max-len": ["error", { "code": 80 }]
  }
};
```

`src/index.js`がエラーになるJSのコードです。1行で80文字を超えてます。

```js
// max-lenに違反しているが、ESLintでは自動修正できない
// Prettierなら自動修正できる
functionOfHavingManyLongArguments(longArgument1(), longArgument2(), longArgument3(), longArgument4());
```

ESLintの自動修正コマンド(ここでは、`npm run lint:fix`)で実行して、ルール違反はしているが自動修正できないことを確認します。

```sh
$ npm run lint:fix
> @ lint:fix /path/to/prettier
> npm run lint -- --fix


> @ lint /path/to/prettier
> eslint src/**/*.js "--fix"


/path/to/prettier/src/index.js
  3:1  error  This line has a length of 102. Maximum allowed is 80  max-len

✖ 1 problem (1 error, 0 warnings)
```

コマンド実行後でも、`src/index.js`も変わらずです。

次に、Prettier(ここでは、`npm run formatter`)を使って自動修正できることを確認します。

```sh
> /path/to/prettier
> prettier --write src/**/*.js
```

`src/index.js`が以下のように整形されます。

```js
// max-lenに違反しているが、ESLintでは自動修正できない
// Prettierなら自動修正できる
functionOfHavingManyLongArguments(
  longArgument1(),
  longArgument2(),
  longArgument3(),
  longArgument4()
);
```