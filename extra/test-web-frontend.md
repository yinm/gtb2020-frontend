# テスト
プログラムが意図した挙動をしているかを確認する手段のひとつとして、自動テストがあります。ここでは具体的なテスト手法には触れませんが、JSで自動テストを書く時にどんなツールがあるのかを紹介します。

## テスティングツールの要素
Webフロントエンドのアプリケーションに自動テストを導入しようと思ったときに、色々なライブラリがあり面食らってしまうかもしれません。ここでは役割ベースでそれぞれのライブラリを分類することで、理解してきましょう。なお、中には複数の役割を1つで担ってるライブラリも存在します(e.g. Jest, Jasmine)。ちなみに、ここでの役割はWebフロントエンドだけでなく、サーバーサイド開発などでも共通の話なので、何かしらの環境で自動テストを書いたことある人だと理解がしやすいかもしれません。

### testing framework
テストの構造化([BDD](https://ja.wikipedia.org/wiki/%E3%83%93%E3%83%98%E3%82%A4%E3%83%93%E3%82%A2%E9%A7%86%E5%8B%95%E9%96%8B%E7%99%BA)のように、要求仕様を構造的に実装できる)、テストの実行、実行結果の判定や集計を行ってくれるライブラリ。このツールのおかげで、どのテストが失敗したかがわかり、修正がしやすくなります。

ライブラリの例
- [Mocha](https://mochajs.org/)
- [Jest](https://jestjs.io/ja/)
- [Jasmine](https://jasmine.github.io/)

### assertion
テストの結果が予想通りであることを検証するライブラリ。

ライブラリの例
- [Chai](https://www.chaijs.com/)
- [power-assert-js](https://github.com/power-assert-js/power-assert)
- [Jest](https://jestjs.io/ja/)
- [Jasmine](https://jasmine.github.io/)

### mock/spy/stub
特定の関数やモジュールを偽装したり、関数の呼び出し回数などの情報を提供するライブラリ。テストしたい対象に、処理が意図した通りに動かない可能性がある場合(e.g. Web APIに依存するテスト)に、意図した処理に差し替えてしまう用途などで使います。

ライブラリの例
- [Sinon.JS](https://sinonjs.org/)
- [testdouble](https://github.com/testdouble/testdouble.js)
- [Jest](https://jestjs.io/ja/)
- [Jasmine](https://jasmine.github.io/)

### coverage
コードカバレッジ(ソースコードに対してテストを行えている部分の割合)を教えてくれるライブラリ。品質の目安などに使われます。

ライブラリの例
- [istanbul-js](https://gotwarlost.github.io/istanbul/)
- [Jest](https://jestjs.io/ja/)

---

実際の業務でどのライブラリを使うかですが、新規案件なら[Jest](https://jestjs.io/ja/)が採用されてる事例を見ることが多い気がします。オールインワンで使いやすいことや実行速度が速いことなどが人気なのかなと思います。

今回紹介していない役割として、以下のようなものがあります。これらはWebフロントエンド特有のものも含まれるので、理解する必要が出てきた時に調べるといいかと思います。
- ブラウザ環境でテストを実行できるようにするためのテストランナー(e.g. [Karma](http://karma-runner.github.io/latest/index.html))
- ブラウザやブラウザ風な実行環境 (e.g. [Puppeteer](https://pptr.dev/), [jsdom](https://github.com/jsdom/jsdom))
- Vue.jsやReactなどのコンポーネントを単体テストしやすくするツール(e.g. [Vue Test Utils](https://vue-test-utils.vuejs.org/ja/), [Enzyme](https://enzymejs.github.io/enzyme/))
- End to Endテストのためのツール(e.g. [Cypress](https://www.cypress.io/))

(extra)
- JSのテスト方法への理解を深める(ライブラリが古いものもありますが、テスト方法をコードと合わせて学べるのでおすすめです) [一から始めるJavaScriptユニットテスト - Hatena Developer Blog](https://developer.hatenastaff.com/entry/2016/12/05/102351)


## テストの指針
ここまででテストに使うツールの紹介をしたのですが、実際にツールを使ってどこまでテストをするかはまた別の話になります。どこまでテストするかはプロジェクトによりけりだと思いますが、指針を考える上で参考になりそうな資料へのリンクを貼っておきます。

- [Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [The Testing Trophy](https://testingjavascript.com/)
