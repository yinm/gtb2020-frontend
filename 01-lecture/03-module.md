# モジュール機構
大規模開発を支える技術要素の1つとして、モジュール機構があります。JSでも比較的最近(ES2015)ですが、言語仕様としてサポートされました。この単元では、JSにおけるモジュール機構の歴史を学びます。

## モジュール機構の登場以前
上記の通り、ES2015より前(=ES5以前)のJSにはモジュール機構が存在しませんでした。そのため、名前空間の汚染が起こりやすい(e.g. 別ファイル間で同じ変数名を使った場合)という問題がありました。この問題の対応方法として使われていたのが、関数を利用してカプセル化を行う方法でした。この方法で名前空間の汚染は最小限にはできたものの、多少は汚染が起きてしまう問題が残ってました。この問題も後述のモジュール機構だと解決します。

参考
- [JavaScriptのスコープ総まとめ - スコープの種類とその基本 | CodeGrid](https://app.codegrid.net/entry/2017-js-scope-1)
- [[意訳]初学者のためのJavaScriptモジュール講座 Part1 - Qiita](https://qiita.com/chuck0523/items/1868a4c04ab4d8cdfb23)

## CommonJS (CJS)
CommonJSとは、JSを汎用言語(ブラウザ以外でもアプリケーション開発できるよう)にするための仕様(文脈によっては、それを策定するプロジェクト)です。先述の通り、ES5以前のJSにはモジュール機構がないなど、汎用言語にするには物足りない部分がありました。「言語仕様にないなら新しく仕様を作ればいいじゃない」ということで生まれたのがCommonJSです。

CommonJSの中のモジュールの仕様に準拠している実行環境としてNode.jsがあります。

利用方法
- モジュールの読み込み: [require(id)](https://nodejs.org/docs/latest-v12.x/api/modules.html#modules_require_id)
- モジュール外へ読み込み可能にする: [module.exports](https://nodejs.org/docs/latest-v12.x/api/modules.html#modules_module_exports), [exports](https://nodejs.org/docs/latest-v12.x/api/modules.html#modules_exports_shortcut)

参考
- [CommonJSの話](https://www.slideshare.net/terurou/common-js)
- [Node.jsとCommonJSについて - 自分の感受性くらい](http://meso.hatenablog.com/entry/20110626/1309082158)


## EcmaScript Modules (ESM)
ES2015でついに言語仕様としてモジュール機構をサポートすることになります。それが、EcmaScript Modules(以下、「ESM」という)です。

利用方法
- モジュールの読み込み: [import](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import)
- モジュール外へ読み込み可能にする: [export](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/export)

ESMにはいくつか特徴があります(ここでは一部を紹介)。
- 構文(`import`文, `export`文)としてサポートしているので、コードの実行前に依存関係を解決できる (CommonJSは仕組み上、実行しないと依存関係を解決できません。)
- モジュールレベルのスコープがある (モジュール内の変数や関数は、外からアクセスできない)
- 常に`'use strict'`になる
- モジュールコードはimport時の初回のみ評価する
- トップレベルの `“this”` は `undefined`

さて、言語仕様はできたのですが、ESMを利用するために必要なモジュールの読み込み方法や依存関係の解決については、言語仕様としては策定されていません。これは、読み込み方法などは実行環境に依存し、言語仕様としては預かり知らない部分であるためです。そのため、読み込み方法などは実行環境(e.g. ブラウザ, Node.js)ごとに仕様が作られることになります。

ブラウザにおいては、`<script>`タグの`type`属性によってモジュールか従来のスクリプトかを判定します。モジュールと判定してほしい場合は、`type="module"`と書きます。ブラウザの対応状況ですが、 https://caniuse.com/#feat=es6-module にあるようにモダンブラウザはほぼ対応しています。ただし、現状では、パフォーマンスの観点(依存関係の解決の度にリクエストが必要になるネットワーク通信のボトルネックを避けたい)などからブラウザのESMの読み込み機能は使わず、モジュールバンドラー(後述)を使ったファイルを読み込むことが一般的かと思います。

Node.jsにおいては、ブラウザにはない2つの問題があり、仕様策定が難航しています。2つの問題とは、以下のものです。
- 読み込むファイルがCommonJSかESMかわからない (ブラウザ側の対応である`type`ように、読み込み前に判定する術がない)
- CommonJSとの互換を維持する必要がある

現状で考えられている対応方法は、[ECMAScript Modules | Node.js v13.12.0 Documentation](https://nodejs.org/api/esm.html)にある3つです。
- 拡張子(ESMの場合は、`.mjs`)で判定する
- 一番近くの親のpackage.jsonの`type`フィールド(ESMの場合は、`module`)で判定する
- `node`コマンドや`eval`などの文字列に`--input-type`フラグ(ESMの場合は、`module`)をつけて判定する

参考
- [モジュール, 導入](https://ja.javascript.info/modules-intro)
- [.mjs とは何か、またはモジュールベース JS とエコシステムの今後 | blog.jxck.io](https://blog.jxck.io/entries/2017-08-15/universal-mjs-ecosystem.html)
- [Node.jsのECMAScript Modulesの紹介 - 技術探し](https://blog.hiroppy.me/entry/node-esm)

## モジュールバンドラー
モジュールバンドラーとは、モジュールの依存関係を解決して、1つ以上のファイルに結合する(=bundle)ライブラリです。

モジュールバンドラーの理解を深めるために誕生背景を見るべく、時代をNode.jsの登場 ~ ESMの登場前の間に戻します。この頃にはNode.jsを使って実装したモジュールが多く作られます。作成したNode.jsのモジュールを、npm(文脈によって意味が異なりますが、この場合はモジュールのレジストリ)に公開することで、他のNode.jsユーザーもモジュールを利用にできるエコシステムが発達していきます。モジュールの中には、Node.jsの実行環境に依存しないもの、つまりブラウザでもCommonJS形式のモジュールを読み込めさえすれば実行可能なものも多くありました。Webフロントエンドの開発でもこれらのモジュールが使えると便利そうだなと人々が思っていたときに、「なら読み込めるようにすればいいじゃない」ということで生まれたのがBrowserifyなどのモジュールバンドラーです。

結合できるモジュールの形式はモジュールバンドラーによって異なります。例えば、BrowserifyはCommonJS形式のモジュールのみですが、webpackはCommonJSだけでなくESMなども結合できます(これはデフォルトの機能だけで比較した場合の話です。プラグインなどの拡張機能を使えば、結合できるモジュール形式を増やすこともできるはずです)。

該当するライブラリの例
- webpack
- rollup.js
- Parcel
- Browserify

どのモジュールバンドラーがよく使われているかについては、あくまで自分の観測の範囲ですが、以下の感じでしょうか。
- Webフロントエンドのアプリケーションの開発なら、webpack
- ライブラリ開発なら、rollup.js