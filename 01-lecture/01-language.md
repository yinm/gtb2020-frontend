# プログラミング言語
Webフロントエンドの開発でよく使われるプログラミング言語として、JavaScript(以下「JS」という)があります。この単元ではJSの言語仕様や実行環境などについて学びます。

## JSの言語仕様
JSの言語仕様(プログラミング言語の文法などの意味を規定したドキュメント)は、ECMAScript(以下「ES」という)として定義されています。1997年にES1がリリースされ、現在の最新バージョンはES2019です(6月ごろにES2020がリリース予定)。

2019や2020の数字から気づく人もいるかもしれませんが、現在のESは西暦と合わせたバージョンに毎年バージョンアップするリリースサイクルになっています。このリリースサイクルは、ES2015(ES6とも呼ばれる。1つ前のバージョンがES5だったことに由来する)から始まりました。

参考
- [ECMAScript · JavaScript Primer #jsprimer](https://jsprimer.net/basic/ecmascript/)

## ESと実行環境の関係
JSの言語仕様はESとして定義されますが、実行環境(e.g. ブラウザ)によってESの構文やメソッドが使えないこともあります。例えば、「ES2015の機能を使いたいけど、IE11だと使えない」みたいな話を聞いたことあるかもしれません。これは、実行環境によってESにどこまで対応しているかの差異があることに起因しています。(ちなみに、ある機能がどのブラウザで対応しているかを調べる方法として、[Can I use... Support tables for HTML5, CSS3, etc](https://caniuse.com/)などがあります。例えば、[Promise](https://caniuse.com/#feat=promises)だとこうなります。)

先述のように、ESは毎年バージョンアップがされ、新しい機能が追加されます。しかし、自分が開発するアプリケーションがサポートする実行環境(例えば、講師が開発に携わってる[カラーミーショップ](https://help.shop-pro.jp/hc/ja/articles/115008889947-%E6%8E%A8%E5%A5%A8%E7%92%B0%E5%A2%83%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%E6%95%99%E3%81%88%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84)だとこんな感じ)だと新しいESに対応してないから、新しい機能が使えない...というのだと不便ですよね。実行環境が対応してないけど、ESの新しい機能を使って開発したい！という願いを叶えてくれるツールとして、TranspilerとPolyfillがあります。

[Transpiler](https://ja.wikipedia.org/wiki/%E3%83%88%E3%83%A9%E3%83%B3%E3%82%B9%E3%82%B3%E3%83%B3%E3%83%91%E3%82%A4%E3%83%A9)とは、高級言語(e.g. JS, Rubyのような人が読み書きしやすいなどの特徴があるプログラミング言語)間の変換を行うツールです。今回の話でいうと、ES2015以降のJSコード(開発者が実装するコード)を、ES5のコード(開発しているアプリケーションがサポートする実行環境で動作するコード)に変換するために使います。この変換を行うことで、開発中は新しいESの機能を使いつつ、実行環境でも動作するJSコードを生成できるようになります。このツールの具体例として、[Babel](https://babeljs.io/)などがあります。(Transpilerに似た用語として、[Compiler](https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%B3%E3%83%91%E3%82%A4%E3%83%A9)があります。こちらは、高級言語から機械語など低級言語への変換を行うツールです。Babelの公式ページではBabelのことをCompilerと説明しているのですが、Transpilerとして説明されていることもよく見かけるので、ここではTranspilerとして説明しました。)

次がPolyfillについてです。先に見たTranspilerではES2015以降のコードを、ES5のコードに変換してくれます。ただし、この時変換するのは構文(e.g. [const](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/const), [アロー関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions))を、ES5で実行可能なコードにしてくれているだけです。これがどういうことかというと、[Array.prototype.find()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/find)のようなES2015以降で追加されたビルトインオブジェクトのメソッドは依然として実行環境に存在しない可能性があり、存在しない場合には実行時エラーが起こります。この問題を解決するツールがPolyfillです。Polyfillとは、最近のESの機能をサポートしていないブラウザでも、その機能を使えるようにするためのコード(大体はJS)のことです。不足している機能をPolyfillを使って補うことで動作できるようにしようというわけですね。このツールの具体例として、[core-js](https://github.com/zloirock/core-js)や、[Polyfill.io](https://polyfill.io/v3/)があります。

## ホストオブジェクト
JSでプログラミングを行うときは、ESで定義されたAPIだけではなく、ホストオブジェクト(ブラウザなどの実行環境が提供するオブジェクト)が提供するAPIを使うことも多いでしょう。

例えば、ブラウザではホストオブジェクトとして、`document`(DOMに対する処理を行えるオブジェクト)が提供されているので、以下のコードが実行できます。

```js
document.querySelector('a')
```

しかし、別の実行環境であるNode.js(後述)では、上記のコードを実行すると、以下のエラーになってしまいます。

```sh
# Node.js v12.15.0 で実行
> document.querySelector('a')
Thrown:
ReferenceError: document is not defined
```

`ReferenceError: document is not defined`なので、「documentは定義されてないよ」というエラーですね。これは、Node.jsではホストオブジェクトとして`document`を提供していないためです。

Universal JavaScript(Isomorphic JavaScript)のような、ブラウザ(クライアント)とNode.js(サーバーサイド)の両環境で動作することを求められるコードを書くなどの場合には、ホストオブジェクトを意識する必要があります。

ホストオブジェクトのリファレンス
- ブラウザのホストオブジェクト: [Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API)
- Node.jsのホストオブジェクト: [Index | Node.js v13.12.0 Documentation](https://nodejs.org/api/)

## Node.js
先述した通り、JSの実行環境のひとつで、Webフロントエンド開発のツールやサーバーサイドの開発などで使われています。

また、Node.jsには[npm](https://github.com/npm/cli)というパッケージマネージャーが同梱されています。これはライブラリのインストールする際に使われるツールで、実際の開発でよく使うことになるでしょう(RubyでいうBundler、PHPでいうComposerです)。

ライブラリのインストール方法には大きく2種類あり、グローバルインストールとローカルインストールで、開発中によく使うのはローカルインストールです。実行方法は、`package-lock.json`(もしくは、`package.json`)があるディレクトリで、`npm install`コマンドを実行します。`package-lock.json`(もしくは、`package.json`)に書かれた依存関係をもとに、開発しているアプリケーションに必要なライブラリのインストールを行います(インストールした結果が、`node_modules`というディレクトリ配下に入ります)。

新しいライブラリを使う必要があるときは、`npm install パッケージ名`コマンドを使うと、ライブラリを`node_modules`に追加すると共に、`package.json`や`package-lock.json`に依存関係を追加できます。これによって開発メンバーがローカルインストールした時に同じライブラリがある状態で開発ができるようになります。(ライブラリの依存関係の表し方には種類があり、使い分けたりするのですが、そこは余力のある方は調べてみてください。)

npmに類似のツールとして、[Yarn](https://classic.yarnpkg.com/ja/)もあります。どちらを使うかはプロジェクトによりけりなので、携わるプロジェクトによって使い分けましょう(Yarnのプロジェクトの場合は、`package-lock.json`と同等の役割のファイルとして、`yarn.lock`というファイルがあるはずです)。

[Node.jsのリリースサイクルとしては、半年に一度メジャーバージョンアップが行われます。](https://nodejs.org/ja/about/releases/)メジャーバージョンが偶数のときはLTS(Long-Term Support)版になっており、重大なバグの修正などが2年半に渡って行われることが保証されてます。そのため、最新の機能を試したいなどの理由がない場合は、基本的にLTS版を利用することが推奨されます。

## TypeScript

Webフロントエンドのアプリケーション開発が大規模化するにつれて生まれる堅牢な実装がしたい要望や、コード補完など開発者の体験(Developer Experience)を向上させる役割を担う言語として、ここ数年のWebフロントエンドプロジェクトで採用されている事例をよく見る言語です。アプリケーション開発以外にも、ライブラリの開発でも採用されるケースが多いです。

TypeScript(以下「TS」という)は、[公式サイト](https://www.typescriptlang.org/)の説明を意訳すると、「JSの型付きスーパーセットのプログラミング言語であり、JSにコンパイルできる」になります。「型付き」というのは、TSは静的型付け言語であるということです(JSは動的型付け言語)。静的型付け言語と動的型付け言語の違いはいくつかありますが、1つに型エラーを検出するタイミングの違いがあります。JSで採用されている動的型付け言語は、コードを実行しないと型エラーを検出できません。例えば、以下のコード(`examples/typescript`にコードの全体があります)の場合、実行してみた時に初めてエラーがわかります。

```ts
// 意図したコード
const valid = 123.456
valid.toFixed()

// 意図しないコード (数値のつもりが、文字列として代入してしまった！)
const invalid = '123.456' 

// `toFixed()`は、Numberオブジェクトのメソッドなので、文字列(Stringオブジェクト)に対して使ってもメソッドが見つからずエラーになる
invalid.toFixed() 
// 実行時エラー
// TypeError: invalid.toFixed is not a function
```

静的型付け言語の場合は、コードを実行する前にコンパイル(コードを実行できる形式に変換する処理)が必要であり、そのコンパイル処理中に型エラーを検出できます。この特徴によって、実際にブラウザやNode.jsなどでJSの動作確認せずともエラーの検出ができるメリットが得られます。

```
// 上記と同じコードをTSでコンパイルした場合

// コンパイルエラー
// error TS2339: Property 'toFixed' does not exist on type '"123.456"'.
```

さらに、[Visual Studio Code](https://azure.microsoft.com/ja-jp/products/visual-studio-code/)など、エディタがTypeScriptのコード解析をサポートしている場合は、エディタ上で上記のコンパイルエラーと同等のエラーを得ることができます。

この辺りの特徴が堅牢な開発やコード補完などに一役買っています。

TSの特徴の説明に戻ります。「[スーパーセット](https://ja.wikipedia.org/wiki/TypeScript)」というのは、JSの上位互換であるということです。そのため、JSでできることは基本的にできる上で、先ほどの静的型付けの特徴を持っていることなど、TS独自の機能が追加されているのだなと理解しておけばいいと思います。

「JSにコンパイルできる」というのは、ブラウザやNode.jsといった実行環境は基本的にJSしか実行できないため、TSで書いたコードを動かせるようにするために必要なことになります。つまり、開発中にはTSを使い、実際にブラウザなど実行環境で動作させるときにはJSを使うということになります。ちなみに、TSのように、実装したコードから通常のJSを生成するプログラミング言語を、AltJS(Alternative JavaScriptの略)と言います。

