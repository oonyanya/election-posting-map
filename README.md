# poster-map

選挙用のポスター掲示場所をまとめた地図です。諸般の事情により埼玉県の奴だけテスト用に付属しています。

デモサイト
https://ss749137.stars.ne.jp/

## 使い方

青い丸がポスターの存在する場所です。
青い丸をタップするとポップアップが出て、ここで処理状況などがわかります。
ポップアップの「未処理」ボタンをクリックすると「処理済」に変わり、赤い丸に変わります。
このボタンを再度クリックすると、「未処理」に変わり、青い丸に変化します。
「状態をコピーする」ボタンを押すとクリップボードに処理状況を含めた文字列がコピーされます。
「復元する」ボタンを押して、文字列を貼り付け、「OK」を押すと、先ほどコピーした処理状況を取り込むことができます。
なお、同じ端末であれば、「復元する」を押さなくても、「マップ」をクリックするだけで前の状態が復元されます。

### 処理状況の合成の仕方

「復元する」ボタンを押すと出てくる奴にコピーしたものを貼り付けることで作業状況を合成することができます。
例えば、一番目のテキストボックスにAさんが処理した奴を貼り付け、二番目のテキストボックスにBさんが作業した奴を貼り付け、改行します。
改行したところにCさんが作業した奴を貼り付け、「OK」ボタンを押すことで地図にはA・B・Cさんが作業した結果が表示されます。

## 選挙ポスター掲示場所の配置の仕方

public/dataにkmlを配置してください。
例えば、埼玉県さいたま市大宮区だとpublic/data/japan/saitama/saitama_oomiya.kmlみたいな形で配置します。
配置後はMapList.vueに適宜追加してください。
先ほどのやつですと、

```
<RouterLink :to="{ path:'/map',query:{region:'japan',state:'saitama',city:'saitama_oomiya',type:'kml' }}">さいたま市大宮区</RouterLink>
```

みたいに書きます。

## 動作確認の仕方

「復元する」ボタンを押して、以下の文字列を貼り付けると動作確認ができます。

```
region=japan&state=saitama&city=test&type=json
```

```
region=japan&state=saitama&city=test&type=kml
```

```
region=japan&state=saitama&city=test_no_geo_cache&type=kml
```

```
region=japan&state=saitama&city=test_geo_cache&type=kml
```

## ビルドの仕方

```sh
npm run build-only
```

でビルドしてください。buildだとエラーを吐きます。

```sh
node GenerateLatLangCache.js
```

こちらはkmlを追加した場合だけ実行してください。
たまにkmlによっては経度と緯度がかけていることがあります。
実行しない場合、マップを表示するたびに経度と緯度を取得しようとするため、レスポンスが遅くなります。

## 開発環境

VisualStudio 2022
