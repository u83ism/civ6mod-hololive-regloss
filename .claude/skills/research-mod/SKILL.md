---
name: research-mod
description: Civ6 Mod制作に関わる調べ物をする時は、詰まる前・仮説を立てる前の時点で真っ先に必ず使う(「詰まったら使う」ではない)。ModBuddy/Art/Icon/XLP/ArtDef/BLPなど公式ドキュメントが薄い領域はもちろん、Civ6 Modding全般(XML/Lua実装、ゲーム仕様確認、数値・サイズ等の裏取り)が対象。「これってどうなってるんだっけ」「Civ6 modで◯◯できる?」「なんで動かないか調べて」「(仕様/数値/サイズ)を確認して」と言われたとき、または断片的な情報だけで仮説を立てて試行錯誤しそうになった場面で使う。バイナリ解析や汎用WebSearchに自己判断で進む前に、まずこのSkillの優先順位に従うこと。leader-bootstrap/mod-bootstrap skillの実装作業中の調査手順としても使う。
---

# Civ6 Modding調べ物の作法

Civ6のModBuddy/Art Pipeline周りは公式ドキュメントが薄く、英語フォーラム(CivFanatics)は玉石混交かつ古い(Civ5時代の情報が混入する)。過去に一条莉々華Modのアイコン実装で、フォーラムの断片情報とAI要約だけを頼りに「PNG直置きで動く」→「DDS直置きで動く」→「.tex手書きだけ追加すれば動く」と3回連続で誤った仮説を試して外し、実際に動いている一次情報(実物ファイル・日本語Wikiの実践記録)を先に見ていれば避けられた回り道をした。この反省を踏まえた調べ物の優先順位と手順をここに書く。

## 1. 調査の優先順位

断片情報から仮説を積み上げる前に、必ずこの順で一次情報を確認する:

1. **civ6wiki.info・brokenhumanoid mdwiki(日本語の参考資料)**。詳細ページ索引は2節参照。特にArt/Icon/ModBuddy関連は「指導者アイコンの作り方」「文明アイコン」「ローディング画面・リザルト」ページに`.tex`/`.xlp`の具体的な書き換え手順・ビルド後のフォルダ構成・`cooker.log`の見方まで載っている。**「新文明・指導者」配下と「その他」配下の主要ページはすでに以下へ要約済み**なので、これらのトピックは都度WebFetchし直さず先に読むこと。未収録のページ(2節の一覧で「未収録」と付いているもの)だけ改めて取得すればよい:
   - `leader-icons/references/icon-blp-pipeline.md`(指導者/文明アイコン)、`leader-icons/references/loading-and-diplomacy-screen.md`(ローディング画面・外交交渉画面・クレオパトラ対策)
   - `leader-abilities/references/trait-and-identity-patterns.md`(文明特性・指導者特性・文明カラー・AIの好み・多言語対応)
   - `leader-unique-content/references/unique-content-patterns.md`(固有ユニット/区域/施設/建造物=UU/UD/UI/UB)
   - `leader-bootstrap/references/bootstrap-troubleshooting.md`(LeaderCriteriaクラッシュ対処・DLC対応)
   - `leader-bootstrap/references/firetuner.md`(FireTunerによる実機Live操作・God Mode的デバッグ)
2. **GSLeaderTemplate・実際に動くModサンプル(サンプル・テンプレート)**。詳細は3節参照。実際に動作するModBuddyプロジェクトファイル一式で、スキーマの実例として非常に有用
3. **実機にインストール済みの参考Mod**(`Documents/My Games/Sid Meier's Civilization VI/Mods/`配下)。実際に動いている他ModのXML/modinfoは伝聞より確実な一次情報。複数の独立したMod(できれば作者違い)で同じパターンが確認できれば、それはほぼ確定的な事実として扱ってよい
4. **Civ6 SDK同梱ドキュメント/サンプル**(`Sid Meier's Civilization VI SDK/Documentation/Civ6Docs.html`、`Examples/Example Art Mod/`)。公式だが英語かつ量が多いので、上記1-3で仮説が立った後の裏取りに向く
5. **CivFanatics forums等の英語コミュニティ**。最後の手段。Civ5とCiv6の情報が検索結果に混在しやすく、"Import into VFS"のようなCiv5専用概念をCiv6の話として誤読しやすいので要注意

## 2. 参考資料(日本語Wiki・執筆ガイド)

### civ6wiki.info: `MOD/作成方法`配下ページ索引(2026-09時点、全21ページ)

トップページ: `https://civ6wiki.info/?MOD/%BA%EE%C0%AE%CA%FD%CB%A1`。文字コードはEUC-JP、読み方の注意は4節参照。配下は3カテゴリで、以下が全ページ(ナビゲーションに載らないページも含む)。「収録先」列がある行はすでに要約済みなので再取得不要、無い行(**未収録**)だけ都度取得する:

**新文明・指導者(12ページ)**

| ページ名 | 収録先 |
| --- | --- |
| 指導者アイコンの作り方 | `leader-icons/references/icon-blp-pipeline.md` |
| 文明アイコン | `leader-icons/references/icon-blp-pipeline.md` |
| ローディング画面・リザルト | `leader-icons/references/loading-and-diplomacy-screen.md` |
| 勝手に出てくるクレオパトラを消す方法 | `leader-icons/references/loading-and-diplomacy-screen.md` |
| 指導者特性 | `leader-abilities/references/trait-and-identity-patterns.md` |
| 文明特性 | `leader-abilities/references/trait-and-identity-patterns.md` |
| 文明カラー・AIの好み | `leader-abilities/references/trait-and-identity-patterns.md` |
| UU / UD / UI / UB(4ページ) | `leader-unique-content/references/unique-content-patterns.md` |
| **その他細かい部分** | 未収録 |

**その他(6ページ)**

| ページ名 | 収録先 |
| --- | --- |
| 指導者の定義を変えるとクラッシュする場合の対処 | `leader-bootstrap/references/bootstrap-troubleshooting.md` |
| DLC対応 | `leader-bootstrap/references/bootstrap-troubleshooting.md` |
| 多言語対応(日本語化) | `leader-abilities/references/trait-and-identity-patterns.md` |
| **各種ログの出力** | 未収録 |
| **LEADER_JASPER_KITTYの罠** | 未収録(SDKサンプルCiv `LEADER_JASPER_KITTY`を参考にする際の落とし穴。3節のSDK Example Art Modに関連) |
| **modinfo** | 未収録 |

**偉人の追加**: 執筆時点でページ自体が空(子ページ無し)。

### brokenhumanoid mdwiki(同作者yosxpeeeの別サイト)

`https://brokenhumanoid.oops.jp/public/mdwiki/#!<ページ名>.md`(MDwiki形式のSPAなので、WebFetchでは中身が取れない。`curl -s -A "Mozilla/5.0" "https://brokenhumanoid.oops.jp/public/mdwiki/<ページ名>.md"`で生Markdownを直接取得すること)。ナビゲーション(`navigation.md`)に載っている全ページ:

- Tutorial: `ModBuddy.md`(環境設定) / `CreateVanilla.md`(プロジェクト作成) / `initialize.md`(最初にやること) / `LeaderTraits.md`(指導者特性) / `MiscLeaders.md`(アジェンダ・好む宗教・AIの設定) / `CivilizationTraits.md`(文明特性) / `MiscCiv.md`(都市名・市民名・開始地点補正) / `ChangeCivColors.md`(文明カラー) / `UniqueUnits.md` / `UniqueDistricts.md` / `UniqueBuildings.md` / `UniqueImprovements.md`(固有UU/UD/UB/UI) / `mod_uniqued.md`(MODの固有化)
- Tips: `TipsCombatBonus1.md`(相手の状態による戦闘力増加特性) / `TipsCombatBonus2.md`(自軍の状態による戦闘力増加特性) / `ChangeModifiers.md`(Modifierの効果範囲を変える) / `ChangeMusic.md`(音楽の変更) / `Wwise.md`(サウンド追加) / `FireTuner.md`(→`leader-bootstrap/references/firetuner.md`に収録済み)
- コメントアウトされ未執筆(存在しない): エラーログ/Workshop公開/DLC参照/指導者・背景画像変更/アイコン作成/河川湖山脈砂漠の名前/ユニークプロジェクト/固有総督/Lua Script。リンクをたどっても404なので深追いしない

civ6wiki.infoと内容が重なる項目(指導者特性・文明特性・文明カラー・UU/UD/UB/UI等)も多いが、著者の別解説として食い違いがあれば両方読んで判断すること。

## 3. サンプル・テンプレート(実際に動くコード一式)

### GSLeaderTemplate(`https://github.com/yosxpeee/Civ6Mods/tree/master/GSLeaderTemplate`)

ModBuddyプロジェクトのテンプレート一式。`GSLeaderTemplate/GSLeaderTemplate/`配下の構成:

- `GSLeaderTemplate.civ6proj` / `Mod.Art.xml` — ModBuddyプロジェクト本体とArt定義の登録
- `ArtDefs/`(`.artdef`): `Buildings` `Civilizations` `Cultures` `Districts` `FallbackLeaders` `Improvements` `Landmarks` `Leaders` `Units`
- `XLPs/`(`.xlp`): `LeaderFallbacks.xlp` `NewLeader_Icons.xlp` `UILeaders.xlp`
- `Textures/`: 文明/指導者アイコン各サイズの`.DDS`+`.tex`ペア一式、`FALLBACK_*`(6表情分の指導者フォールバック立ち絵)、`PORTRAIT_LEADER_*`(選択画面全身ポートレート)、`hogehoge_LoadingInfo_*`/`hogehoge_DiplomacyInfo_Background`(ローディング・外交交渉画面背景)
- `NewLeader_*.xml`: `Civilizations` `Config` `ConfigText`/`ConfigTextJP` `CoreColors` `Dialogs`/`DialogsJP` `Icons` `LeaderAnimations` `Leaders` `Moments` `PlayerColors` `Text`/`TextJP` `UB` `UD` `UI` `UP` `UU`(固有ユニット/区域/施設/改善/政策を含む最小構成の型)

**注意**: テンプレートには`GameplayScripts/`(Lua)・`Agenda`・拡張パック別(`Expansion1`/`Expansion2`)ファイル・`UnitAbilities`が含まれない。これらが必要な作業(固有ユニットの特殊能力、拡張パック限定コンテンツ等)は次項の実例Modを参照すること。

### 同リポジトリ内の実例Mod(NewLeader1〜NewLeader10、NewLeaderYzsp等)

同じ`yosxpeee/Civ6Mods`リポジトリ直下に、作者が実際にリリースした指導者Mod10本以上が丸ごと入っている(`Readme.md`にキャラ名と一覧あり)。例えば`NewLeader3`(長門/陸奥)は上記テンプレートに加えて`GameplayScripts/*.lua`+`*.xml`・`*_Agenda.xml`・`*_Expansion1.xml`/`*_Expansion1Text.xml`/`*_Expansion2.xml`等・`*_UnitAbilities.xml`を含む、より完成度の高い実例。複数の指導者Modを横断して共通パターンを確認すれば、それはほぼ確定的な事実として扱ってよい(1節の優先順位3と同じ考え方)。

### Civ6 SDK Example Art Mod

`Sid Meier's Civilization VI SDK/Examples/Example Art Mod/`(ローカル、SDKインストール時のみ)。サンプル文明`LEADER_JASPER_KITTY`を素材にしている。ただしciv6wiki.info「LEADER_JASPER_KITTYの罠」ページ(2節、未収録)にこのサンプルを参考にする際の落とし穴が書かれている可能性が高いので、SDKサンプルだけを鵜呑みにせず先にそちらも読むこと。

## 4. civ6wiki.info(PukiWiki)を読むときの注意

- **文字コードはEUC-JP**。`WebFetch`はAIによる要約を返すため、この手のWikiで数値・フォーマット名(ミップマップ有無、ABGR8等)を誤要約することがある(実例: あるページの「ミップマップあり」を要約が拾い損ね、別ページの「ミップマップなし」と混同しかけた)。**数値・スキーマ・設定値など間違えると気づきにくい情報は、`curl -s -A "Mozilla/5.0" <URL> | iconv -f EUC-JP -t UTF-8 | sed 's/<[^>]*>//g'`で生テキストを直接読むこと**。WebFetchの要約だけで結論を出さない
- **ナビゲーションに載っていないページが存在することがある**。`nav.md`相当のページ(civ6wiki.infoなら各カテゴリの一覧ページ)にリンクが無くても、URLパターンが分かれば直接アクセスできる場合がある。逆に、リンクがコメントアウトされている(=作者が書きかけで諦めた)ページは本当に存在しない場合もあるので、404を確認したら深追いしない
- URLはEUC-JPパーセントエンコードなので、日本語ページ名を含むリンクをそのままコピペしてWebFetch/curlに渡してよい
- **新しいページ名(このSkillに載っていない未収録ページ)のURLを自分で組み立てるときは、UTF-8の`encodeURIComponent`を使わないこと**。`?MOD/作成方法/新文明・指導者/文明アイコン`のようなパス階層は、区切りの`/`はそのまま、各セグメントをEUC-JPバイト列にpercent-encodeする必要がある。実際に動いた手順:
  ```bash
  printf 'MOD/作成方法/新文明・指導者/文明アイコン' | iconv -f UTF-8 -t EUC-JP | xxd -p | tr -d '\n' | sed 's/\(..\)/%\1/g'
  # → %4d%4f%44%2f%ba%ee%c0%ae%ca%fd%cb%a1%2f%bf%b7%ca%b8%cc%c0%a1%a6%bb%d8%c6%b3%bc%d4%2f%ca%b8%cc%c0%a5%a2%a5%a4%a5%b3%a5%f3
  ```
  ASCII部分(`MOD`や`/`)も一緒にpercent-encodeされるが害はない。`https://civ6wiki.info/?`の後にこれを繋げてcurlに渡す。UTF-8percent-encode(`encodeURIComponent`等)で組み立てたURLは「有効なWikiNameではありません」と返ってくるだけで、404にすらならないので気づきにくい

## 5. 判断に迷ったら実機ログより先にここを見る

`leader-bootstrap` Skill 5節の実機デバッグ手順(Modding.log/Database.log確認)は「配線が正しく見えるのに動かない」時の一番強い証拠だが、**そもそもの手順自体が根本的に間違っている**(例: BLPコンパイルが必須なのにXMLの書き方だけ疑っている)場合はログを何度見ても手がかりが出ない。ログ調査で埒が明かない、かつ触っている領域がArt/Icon/ModBuddyなら、ログの深掘りを続ける前に本Skillの1節に戻ること。
