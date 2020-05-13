# JSからPOSTリクエストしてみよう

前回までで、Web APIに登録済みのコメント一覧を取得して、Vue.jsで表示することまでできました。データの読み込み(参照系)の処理ができたわけですね。

次は、掲示板に新しいコメントを投稿できるようにしていきます。新しいコメントを投稿できるようにするためにはWeb APIに投稿したコメントを保存するように依頼する必要があります。つまり、データの書き込み(更新系)処理を行う必要があるのです。

この単元では、データの書き込み処理をWeb APIにお願いする時に使われるHTTPメソッドの1つである、POSTメソッドをJSから操作する方法を学びます。

## (1)
POSTリクエストを行なっている箇所です。パッと見の印象で、GETリクエストに比べて記述が増えてますね。順番に見ていきましょう。

まず、[リクエストしたいWeb API](http://localhost:4000/spec/#/paths/~1comments/post)を確認します。どのような依頼(HTTPリクエスト)をすれば、新しいコメントを投稿をしてくれるのか見るのですね。

### path 

```
/comments
```

これに関してはGETのときと同じ

### HTTPメソッド

```
POST
```

### リクエストボディ 
- `name`, `content`は、string型
- `application/json`の形式でやり取りする


```
{
  "comment": {
    "name": "山田太郎",
    "content": "こんにちは！"
  }
}
```

次に、この依頼内容を実現するHTTPリクエストをするために、HTTPクライアントである[Fetch API](https://developer.mozilla.org/ja/docs/Web/API/WindowOrWorkerGlobalScope/fetch)の使い方を見て行きます。

### path

GETリクエストした時と同じように第1引数にstring型でURLとして渡すだけなので、これまでやってきたことと同じです。

```js
const response = await fetch('http://localhost:4000/comments')
```

### HTTPメソッド

Fetch APIではデフォルトのHTTPメソッドがGETなので、POSTに変更してあげないといけません。[Fetch APIの引数](https://developer.mozilla.org/ja/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)を見ると、第2引数にHTTPリクエストの挙動を変更するオプションを取れることがわかります。その中で、`method`があり、これを変更すると任意のHTTPメソッドでリクエストできるようです。実際にPOSTメソッドにすると、次のようになります。

```js
const response = await fetch('http://localhost:4000/comments', {
  method: 'POST',
})
```

### リクエストボディ 

まず、`{ comment: {...} }`のJSON形式のデータを用意する必要があります。JSでは、JSオブジェクトをJSONに変換する、[JSON.stringify()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)というメソッドがあるので、これを使って作りましょう。

そして、作成したリクエストボディをFetch APIのリクエストに含めるためのオプションとして`body`があるので、これに作成したJSONを指定します。

```js
const requestBody = {
  comment: {
    name: 'yinm',
    content: 'POSTリクエスト完全に理解した！'
  }
}

const response = await fetch('http://localhost:4000/comments', {
  method: 'POST',
  body: JSON.stringify(requestBody),
})
```

ここまで完成した気持ちになるのですが、実際に処理してみるとHTTPのステータスコードが[415](https://developer.mozilla.org/ja/docs/Web/HTTP/Status/415)のエラーが返ってきます。このエラーは、リクエストボディの形式がサポートしていない形式なので、サーバーがリクエストの受け入れを拒否することを示します。このエラーを回避するために、JSON形式(`application/json`)でリクエストしているよとサーバーに伝える必要があるのですね。

リクエストボディなどの形式を伝えるための方法として、HTTPでは[Content-Type](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Content-Type)ヘッダーを使うという仕様があります。このヘッダーをFetch APIのリクエストに含めるためのオプションとして、`headers`があるのでこれを使います。

```js
const requestBody = {
  comment: {
    name: 'yinm',
    content: 'POSTリクエスト完全に理解した！'
  }
}

const response = await fetch('http://localhost:4000/comments', {
  method: 'POST',
  body: JSON.stringify(requestBody),
  headers: {
    'Content-Type': 'application/json'
  }
})
```

これで完成です。POSTリクエストができるようになりましたね。