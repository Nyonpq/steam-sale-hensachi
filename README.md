# セール偏差値（Steam Sale Hensachi）

Steamで現在セール中のタイトルを、割引率・レビュー評価・人気度から算出した
独自指標「セール偏差値」でランキング表示するサイトです。

## 構成

- **Next.js 14 (App Router) + TypeScript + Tailwind CSS** — フロントエンド
- **`scripts/fetch-steam-data.mjs`** — SteamのStore API（公開・APIキー不要）から
  セール情報とレビュー評価を取得し、`data/deals.json` に書き出すNode.jsスクリプト
- **GitHub Actions（`.github/workflows/update-data.yml`）** — 6時間ごとに上記スクリプトを
  実行し、変更があれば自動でリポジトリにコミット＆push
- **Vercel** — GitHubへのpushをフックに自動で再ビルド・再デプロイ

つまり「Steamデータ取得→スコア計算→サイト更新」までが全て自動化されており、
サーバーやデータベースの管理は不要です（データはJSONファイルとしてリポジトリに保存）。

---

## 1. ローカルで動かす

```bash
npm install
npm run fetch-data   # Steamから最新データを取得して data/deals.json を更新
npm run dev           # http://localhost:3000 で確認
```

`npm run fetch-data` はインターネット経由でSteamの公開APIにアクセスします。
実行に数十秒かかることがあります（セール中タイトルごとにレビュー情報を
取得するため）。

---

## 2. GitHubにpushする

```bash
git init
git add .
git commit -m "init: steam sale hensachi"
git branch -M main
git remote add origin https://github.com/<あなたのユーザー名>/<リポジトリ名>.git
git push -u origin main
```

### 重要：GitHub Actionsに書き込み権限を与える

デフォルトではActionsはリポジトリへの書き込み（コミット・push）ができません。
以下の設定が必要です。

1. GitHubのリポジトリページ → **Settings** → **Actions** → **General**
2. 一番下の **Workflow permissions** で
   **「Read and write permissions」** を選択して保存

これを忘れると、`update-data.yml` が実行されてもデータ更新のコミットが
失敗します。

---

## 3. Vercelにデプロイする

1. [vercel.com](https://vercel.com) にGitHubアカウントでログイン
2. 「Add New... → Project」から、pushしたリポジトリを選択
3. Framework Presetは自動的に「Next.js」が検出されるのでそのままDeploy
4. 数分でURL（`https://xxxxx.vercel.app`）が発行される

以降、GitHub Actionsが`data/deals.json`を更新してpushするたびに、
Vercelが自動で再ビルド・再デプロイします（追加設定は不要）。

### 独自ドメインを使う場合

Vercelのプロジェクト設定 → **Domains** から取得済みのドメインを追加し、
表示される指示に従ってドメイン管理会社側でDNSレコード（CNAMEまたはA레코드）を
設定してください。AdSense審査では独自ドメインが推奨されます。

---

## 4. AdSenseに申請する前に

前回の相談内容の繰り返しになりますが、**申請前に必ず対応してください**：

- [ ] `data/deals.json`がサンプルデータのままになっていないか確認（`npm run fetch-data`を実行済みか）
- [ ] 「このサイトについて」「プライバシーポリシー」ページが公開されている（同梱済み）
- [ ] **APIデータの一覧表示だけでなく、あなた自身の文章によるオリジナル記事
      （攻略・レビュー・考察など）を最低でも10本前後追加する** — これが無いと
      「オリジナルコンテンツが不十分」として審査に落ちる可能性が高い
- [ ] サイトの表示速度・モバイル表示に問題がないか確認

## 5. 認識しておくべきリスク・限界

- SteamのAPIはValveが無償提供しているもので、**仕様変更や停止がいつ起きても
  Valve側に責任は発生しない**（利用規約に明記）。長期運用する場合は定期的な
  動作確認が必要。
- `featuredcategories`の`specials`はSteamが選定した注目セール（十数件程度）
  であり、セール中の全タイトルを網羅しているわけではない。対象を広げたい
  場合は`store.steampowered.com/search/results`のページング処理に置き換える
  必要がある（現状は未実装）。
- SteamDB・IsThereAnyDealなど強力な競合が既に存在するため、検索流入を
  得るには「セール偏差値」という独自の切り口をコンテンツ面でも育てる
  （なぜこのスコアなのか、実際に安くなった名作の解説記事を書く、など）
  ことが重要。
- AdSense収益が月1万円に届くまでには、一般的に相応のアクセス数と
  数ヶ月〜半年以上のSEO育成期間が必要になることが多い。

## 6. 今後の拡張アイデア

- タイトル別の詳細ページ（`/game/[appid]`）と過去のセール履歴グラフ
- Twitter/Xへの「本日の偏差値70超えセール」自動投稿ボット
- ジャンル別・価格帯別のフィルタリング
- セール対象を`search`APIのページングで拡大
