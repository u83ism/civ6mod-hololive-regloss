---
name: civ6-mod-research
description: Civ6 Modding(ModBuddy/Art/Icon/XLP/ArtDef/BLPなど、公式ドキュメントが薄い領域)について調べ物をする時に使う。「これってどうなってるんだっけ」「Civ6 modで◯◯できる?」「なんで動かないか調べて」と言われたとき、または断片的なフォーラム情報だけで仮説を立てて試行錯誤しそうになった場面で必ず使うこと。leader-bootstrap/mod-bootstrap skillの実装作業中に技術的に詰まった時の調査手順としても使う。
---

# Civ6 Modding調べ物の作法

Civ6のModBuddy/Art Pipeline周りは公式ドキュメントが薄く、英語フォーラム(CivFanatics)は玉石混交かつ古い(Civ5時代の情報が混入する)。過去に一条莉々華Modのアイコン実装で、フォーラムの断片情報とAI要約だけを頼りに「PNG直置きで動く」→「DDS直置きで動く」→「.tex手書きだけ追加すれば動く」と3回連続で誤った仮説を試して外し、実際に動いている一次情報(実物ファイル・日本語Wikiの実践記録)を先に見ていれば避けられた回り道をした。この反省を踏まえた調べ物の優先順位と手順をここに書く。

## 1. 調査の優先順位

断片情報から仮説を積み上げる前に、必ずこの順で一次情報を確認する:

1. **`https://civ6wiki.info/?MOD/作成方法`とその配下ページ**(日本語、実践者による確立済み手順)。特にArt/Icon/ModBuddy関連は「指導者アイコンの作り方」「文明アイコン」「ローディング画面・リザルト」ページに`.tex`/`.xlp`の具体的な書き換え手順・ビルド後のフォルダ構成・`cooker.log`の見方まで載っている。**「新文明・指導者」配下と「その他」配下の主要ページはすでに以下へ要約済み**なので、これらのトピックは都度WebFetchし直さず先に読むこと。未収録のページ(偉人の追加配下など、執筆時点で空だったページ)や下記に無い内容だけ改めて取得すればよい:
   - `leader-icons/references/icon-blp-pipeline.md`(指導者/文明アイコン)、`leader-icons/references/loading-and-diplomacy-screen.md`(ローディング画面・外交交渉画面・クレオパトラ対策)
   - `leader-abilities/references/trait-and-identity-patterns.md`(文明特性・指導者特性・文明カラー・AIの好み・多言語対応)
   - `leader-unique-content/references/unique-content-patterns.md`(固有ユニット/区域/施設/建造物=UU/UD/UI/UB)
   - `leader-bootstrap/references/bootstrap-troubleshooting.md`(LeaderCriteriaクラッシュ対処・DLC対応)
2. **同作者(yosxpeee)の別サイト**: `https://brokenhumanoid.oops.jp/public/mdwiki/#!<ページ名>.md`(MDwiki形式)、および対応するGitHubリポジトリ`https://github.com/yosxpeee/Civ6Mods`。特に`GSLeaderTemplate`は実際に動作するModBuddyプロジェクトテンプレート一式(`.civ6proj`/`.Art.xml`/`XLPs/`/`Textures/`(`.dds`+`.tex`ペア)/`ArtDefs/`)が丸ごと入っており、スキーマの実例として非常に有用
3. **実機にインストール済みの参考Mod**(`Documents/My Games/Sid Meier's Civilization VI/Mods/`配下)。実際に動いている他ModのXML/modinfoは伝聞より確実な一次情報。複数の独立したMod(できれば作者違い)で同じパターンが確認できれば、それはほぼ確定的な事実として扱ってよい
4. **Civ6 SDK同梱ドキュメント/サンプル**(`Sid Meier's Civilization VI SDK/Documentation/Civ6Docs.html`、`Examples/Example Art Mod/`)。公式だが英語かつ量が多いので、上記1-3で仮説が立った後の裏取りに向く
5. **CivFanatics forums等の英語コミュニティ**。最後の手段。Civ5とCiv6の情報が検索結果に混在しやすく、"Import into VFS"のようなCiv5専用概念をCiv6の話として誤読しやすいので要注意

## 2. civ6wiki.info(PukiWiki)を読むときの注意

- **文字コードはEUC-JP**。`WebFetch`はAIによる要約を返すため、この手のWikiで数値・フォーマット名(ミップマップ有無、ABGR8等)を誤要約することがある(実例: あるページの「ミップマップあり」を要約が拾い損ね、別ページの「ミップマップなし」と混同しかけた)。**数値・スキーマ・設定値など間違えると気づきにくい情報は、`curl -s -A "Mozilla/5.0" <URL> | iconv -f EUC-JP -t UTF-8 | sed 's/<[^>]*>//g'`で生テキストを直接読むこと**。WebFetchの要約だけで結論を出さない
- **ナビゲーションに載っていないページが存在することがある**。`nav.md`相当のページ(civ6wiki.infoなら各カテゴリの一覧ページ)にリンクが無くても、URLパターンが分かれば直接アクセスできる場合がある。逆に、リンクがコメントアウトされている(=作者が書きかけで諦めた)ページは本当に存在しない場合もあるので、404を確認したら深追いしない
- URLはEUC-JPパーセントエンコードなので、日本語ページ名を含むリンクをそのままコピペしてWebFetch/curlに渡してよい

## 3. 判断に迷ったら実機ログより先にここを見る

`leader-bootstrap` Skill 5節の実機デバッグ手順(Modding.log/Database.log確認)は「配線が正しく見えるのに動かない」時の一番強い証拠だが、**そもそもの手順自体が根本的に間違っている**(例: BLPコンパイルが必須なのにXMLの書き方だけ疑っている)場合はログを何度見ても手がかりが出ない。ログ調査で埒が明かない、かつ触っている領域がArt/Icon/ModBuddyなら、ログの深掘りを続ける前に本Skillの1節に戻ること。
