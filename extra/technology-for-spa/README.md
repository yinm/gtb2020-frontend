# SPAを支える技術

## 描画処理 
ライブラリでいうと、Vue.jsやReactが該当します。

上記で見た通り、SPAではページコンテンツの生成をJSで行います。そのため、JSを使ってDOMの生成・削除を頻繁に行う必要が出てきます。ただし、これをブラウザのホストオブジェクトが提供している[Node.appendChild()](https://developer.mozilla.org/ja/docs/Web/API/Node/appendChild)などを使って素朴にやろうとすると、スパゲッティコードになってメンテナンスしづらくなったり、DOMを変更する処理はコストのかかる処理なのでパフォーマンスに問題が出てしまいます。この問題を解決するツールとして、描画処理を担当するライブラリがあります。主に以下の特徴を備えています。

- 宣言的(Declarative)に実装できるのでコード見通しがいい (それを支えるVirtual DOMのおかげでパフォーマンスが問題になりにくい)
- コンポーネントベースでUIを組み合わせて作れるので、統一された見た目が作りやすい (ただし、コンポーネントの設計を考える必要がある)

どちらも重要な要素なのですが、ここでは1つ目の宣言的に実装できるのでコード見通しがいいについて詳しく見てます。

「宣言的」という言葉が難しいのですが、「何をやりたいのかを伝える(= 目的を伝える)」ような意味だと思ってもらうといいです。対義語は「命令的(Imperative)」で、「どのようにやるのかを伝える(= 手段を伝える)」ような意味です。より理解を深めるためにコードを交えながら、比較して説明します。(コードは、`application-pattern`の配下に全体があります)

まずは、命令的に実装した場合の例です。

HTML

```html
<body>
  <h1>単語帳</h1>
  <div>
    <input id="term" type="text">
    <input id="description" type="text">
    <button id="add-button">登録</button>
  </div>

  <!-- dl要素の中身が空なので、どんな見た目になるのかわからない -->
  <dl id="words"></dl>
</body>
```

JS

```js
const words = document.querySelector('#words')
const term = document.querySelector('#term')
const description = document.querySelector('#description')
const addButton = document.querySelector('#add-button')

addButton.addEventListener('click', () => {
  // どうやって単語リストの中身を作るかを一つずつ指示している (命令的)
  const dt = document.createElement('dt')
  dt.style = "font-weight: bold;"
  dt.textContent = term.value

  const dd = document.createElement('dd')
  dd.textContent = description.value

  words.appendChild(dt)
  words.appendChild(dd)
})
```

JSでDOMを手続き的に生成しているのが特徴です。完成形の見た目を実装するのではなく、完成形に至るまでに必要な手順を実装している感じですね。このような実装だと、HTMLだけを見ても最終的な成果物がわかりにくいです。また、JSで追加している部分にCSSを当てたい場合などに、わざわざJSの実装を読む必要があり、メンテナンスしやすい状態とは言いにくいでしょう。現在は単語の追加処理だけですが、削除機能も欲しいとなった時に、該当のDOMを探して削除して...などと複雑さが増していきます。

次に、宣言的に実装した場合です。

HTML (Vue.jsを使ってます)

```html
<body>
  <div id="app">
    <h1>単語帳</h1>
    <div>
      <input type="text" v-model="term">
      <input type="text" v-model="description">
      <button @click="add">登録</button>
    </div>

    <dl>
      <!-- 登録済みの単語を1つずつ取り出してリストにする -->
      <template v-for="word in words">
        <dt style="font-weight: bold;">{{ word.term }}</dt>
        <dd>{{ word.description }}</dd>
      </template>
    </dl>
  </div>
</body>
```

JS (Vue.jsを使ってます)

```js
new Vue({
  el: '#app',
  data: {
    words: [],
    term: '',
    description: ''
  },
  methods: {
    add() {
      this.words.push({
        term: this.term,
        description: this.description
      })
    }
  }
})
```

今度はHTMLだけを見ても、最終的にどんな見た目になるかわかりやすくなりました。命令的な実装の時にあったJSでDOMを生成している処理は描画処理ライブラリの内部(ここで、Virtual DOMが使われます)で行なってくれるので、最終的にこんな見た目になって欲しいというHTMLとアプリケーションの状態(上記の例でいうと登録済みの単語である、`words`)を描画処理ライブラリ伝えるだけでよくなります。コードの見通しが良くなりましたね。CSSでスタイルを当てる場合もHTMLだけ読めば良いのでメンテナンスしやすそうです。削除機能を追加するときもDOMのことは気にせず、JSのオブジェクト(上記の例だと、`words`)に対して要素を削除するだけでいいので、そこまで複雑になりません。

このように、HTMLで最終的な見た目を作りつつ、そこにどういった状態を流し込むかだけを気にすればいいようになったので実装しやすいというのが、宣言的にUIを実装をできるメリットです。

宣言的UIに関する詳しい説明は、[宣言的UI - Speaker Deck](https://speakerdeck.com/sonatard/xuan-yan-de-ui?slide=21)などを見てもらうと理解が深まると思います。

(extra)
- Virtual DOMを実装して理解を深める: [仮想DOMは本当に“速い”のか？ DOM操作の新しい考え方を、フレームワークを実装して理解しよう - エンジニアHub｜若手Webエンジニアのキャリアを考える！](https://employment.en-japan.com/engineerhub/entry/2020/02/18/103000)
- コンポーネントの設計手法の一例: [Atomic Design | Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/)


## 状態管理・データフロー
ライブラリでいうと、VuexやReduxなどが該当します。

これまで言ってきた通り、SPAではページコンテンツの生成をJSで行います。そのため、JSを使って、ページをまたがった状態の保持や更新をする必要が出てきます。描画処理のライブラリでもコンポーネントに状態を持つことができるので、それで対応する方法もあります。しかし、同じ状態を表したいはずなのに別々のコンポーネントで状態を保持してしまうなどが起きるとメンテナンスがしづらくなってしまいます。この問題を解決するための手段として、[Flux](https://github.com/facebook/flux/tree/master/examples/flux-concepts)という設計手法がよく使われます。ざっくりとした特徴は次のものです。

- 状態をStoreという役割に集める(中央集権的に状態を管理する)
- 更新処理によるデータの流れ一方向に強制して、処理を把握しやすくする

ちなみに、状態管理・データフローのライブラリはSPAを作るために絶対必要なものという訳ではありません。状態の保持や更新処理が簡単なアプリケーションなら使わないことも選択できます。これからSPAを作って勉強してみようという人の場合は状態管理・データフローのライブラリは一旦無視して、後から勉強するでもいいと思います。

(extra)
- フロントエンドのアーキテクチャ変遷: [SPAにおける状態管理: 関数型のアプローチも取り入れるフロントエンド系アーキテクチャの変遷 - エンジニアHub｜若手Webエンジニアのキャリアを考える！](https://employment.en-japan.com/engineerhub/entry/2019/05/23/103000)
- Fluxを実装して理解を深める: [10分で実装するFlux](https://azu.github.io/slide/react-meetup/flux.html)

## 画面遷移
ライブラリでいうと、Vue RouterやReact Routerなどが該当します。

ブラウザのホストオブジェクトとして提供される[History](https://developer.mozilla.org/ja/docs/Web/API/History)を使うことで、URLのパスに合わせて表示内容を切り替える画面遷移を行なったり、ブラウザの「戻る」「進む」ボタンを押した時の挙動を制御したりします。

Historyが使えないブラウザのために、URIフラグメント(`#`)を使って同様の機能を実現することをサポートしているライブラリもあります。

## HTTP client
JSからWeb APIサーバーにリクエストする時に使います。

ブラウザのホストオブジェクトとして提供されている機能として、[XMLHttpRequest(以下「XHR」という)](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest)や[Fetch API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API)があります。研修の後半で行うハンズオンで、Fetch APIを使う例を見るので、ここでは紹介だけにしておきます。

また、XHRを使いやすくした[axios](https://github.com/axios/axios)などのライブラリもあります。業務ではこちらを使うことも多いかと思います。
