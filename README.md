# poster-map

選挙用のポスター掲示場所をまとめた地図です。諸般の事情により埼玉県さいたま市の奴だけテスト用に付属しています。

## 使い方

青い丸がポスターの存在する場所です。
青い丸にマウスカーソルを合わせるとツールチップが出てて、ここで処理状況がわかります。
青い丸をクリックすると処理済みに変わり、赤い丸に変わります。
「状態をコピーする」ボタンを押すとクリップボードに処理状況を含めた文字列がコピーされます。
「復元する」ボタンを押して、文字列を貼り付け、「OK」を押すと、前の状態が復元されます。

## 動作確認の仕方

「復元する」ボタンを押して、以下の文字列を貼り付けると動作確認ができます。

```
region=japan&state=saitama&city=test&type=json
region=japan&state=saitama&city=test&type=kml
```


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
