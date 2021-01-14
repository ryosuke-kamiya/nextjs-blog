import '../styles/global.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
//_app.jsは特殊なファイルでRouteコンポーネントをラップする。
// 全ページで共通させたいファイルを読み込む
// 全ページで共通してさせたい処理を組み込む。ログインとか
// 全ページで共通させたいレイアウトをくみ込む

//このファイルを作ったら再起動
