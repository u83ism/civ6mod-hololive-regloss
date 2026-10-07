# civ6mod-hololive-regloss

Civilization VI の新規文明追加Mod。hololive ReGLOSSをモチーフにした文明を実装する。

ゲームデザインの判断理由は[docs/design.md](docs/design.md)、実装の仕組み・実機で踏んだ罠は[docs/implementation-notes.md](docs/implementation-notes.md)、Mod固有名詞の各言語表記は[docs/glossary.md](docs/glossary.md)を参照(役割分担: 現状ステータス・TODOはこのREADME。詳細は`.claude/rules/documentation.md`)。

## 現状

一条莉々華(一条コーポレーション)の実装がほぼ完成。

- 文明・指導者・文明固有能力(資源クラス別ゴールドボーナス、労働者の使用回数+1)を実装し、リーダー選択画面・実ゲームでの動作を確認済み
- 指導者固有能力を実装: 独占/大企業モードON時「大天才」(産業/大企業改善の文化力・科学力・ゴールドボーナス、商品プロジェクト生産力+100%。産業側と商品プロジェクトは実機確認済み、大企業側は未確認)、モードOFF側「推し事お疲れさまでした〜」(市場+灯台の両方がある都市の交易路容量重複解除・産出ボーナス、効果自体は未実機確認)
- ユニークアジェンダ・外交交渉画面の台詞(GREETING/FIRST_MEETは配信者の決め台詞ベース)を実装・実機確認済み
- 固有ユニット「うに」(斥候の置換)を実装・実機確認済み、時代スコアポップアップ用の専用イラストも追加
- 文明/指導者のバッジアイコン(外交パネル・プレイヤーリスト等)を実装・実機確認済み
- 外交交渉画面のクレオパトラ対策(フォールバック静止画)、ローディング画面(ポートレート・背景)、外交交渉画面の背景(`DiplomacyInfo`)、ゲーム設定画面の全身ポートレート「Leader Placard」をすべて実装・実機確認済み(仕組みの詳細は`.claude/skills/make-fallback-portrait/references/fallback-and-loading-schema.md`参照)
- ローカライズは日本語(正本)・英語・簡体字中国語・繁体字中国語の4言語に対応
- 固有区域/施設/建造物は未着手

儒烏風亭らでん(設計は[docs/design.md](docs/design.md)の「儒烏風亭らでん」節)もほぼ完成(2026-10-07)。細かい実機確認の残りは未実施(2026-10-07、本人判断でTODOをリセット)。

- 文明・指導者を実装し、文明BGMはカナダの曲(`ArtDefs/Civilizations.artdef`、嵐の訪れの文明)を実機で確認済み
- 文明能力「芸術に満たされて」(傑作1つにつき産出4種+4)、指導者能力「芸術への渇望」(大芸術家ポイント+2・自然遺産で遺物)を実装し、実機で動作を確認済み
- 固有建造物「寄席」(円形闘技場の置換)を実装し、建てられること・大芸術家ポイントが出ること(都市のぶん+1)・考古博物館を建てられることを実機確認済み(3Dモデルは未対応、劇場広場の見た目は目視で問題なさそう)。固有ユニット「学芸員」(考古学者の置換)も実装・実機確認済み。時代スコアポップアップ用の専用イラストも追加
- アジェンダはバニラの「文化重視」を流用し、実機で動作を確認済み
- 外交交渉画面の台詞(76タグ)を実装・実機確認済み(台詞案は[docs/diplomacy-statements-juufuutei-raden.md](docs/diplomacy-statements-juufuutei-raden.md))
- バッジアイコン(文明=能面のシルエット、指導者=顔)、外交交渉画面のフォールバック静止画、ローディング画面(ポートレート・背景)を用意しBLPをビルド済み
- 日本語(正本)・英語・簡体字中国語・繁体字中国語の4言語に対応(英語・中国語は2026-10-07に追加し、外交台詞は実機確認済み)

## 構成

- `civ6mod-hololive-regloss.modinfo` — Modのエントリポイント。ActionGroupsで参照するファイルはすべて`Files`にも列挙する必要がある
- `XML/` — Civilization / Leader / Trait / Colors / Config などのDB定義(XML)
- `Text/ja_JP/`, `Text/en_US/`, `Text/zh_Hans_CN/`, `Text/zh_Hant_HK/` — ローカライズテキスト(`ja_JP`が正本)
- `Art/` — アイコン・リーダーシーン等のアセット(`Art/Source/`が元画像、`Art/Icons/`が各サイズ展開済みPNG)
- `Platforms/` — ModBuddyビルド済みの`.blp`(バッジアイコン用)
- `tools/setup-dev-env.ps1` — 新しいPCでの開発環境セットアップ(`pwsh tools/setup-dev-env.ps1`、何度実行しても安全)。Modsフォルダへのジャンクション作成・`AppOptions.txt`のログ有効化(`-EnableTuner`でFireTunerも)・`npm ci`を行い、Development Tools/SDK Assets/`Art/Source/`の有無をチェックする
- `tools/loc-lookup/` — Civ6本体(Base+DLC)とこのModの`Text/`から、LOCタグまたは本文で公式の各言語訳を引くスクリプト(`npm run lookup -- <タグ正規表現>`、`--text <文字列>`で逆引き、初回は`npm ci`)。公式用語の確認に使う(`.claude/rules/game-terms.md`)
- `tools/png2dds/` — 元画像からアイコン各サイズのPNG/DDSを自動生成するビルドスクリプト(TypeScript、`tsx`で実行)
- `tools/IconBuild/` — アイコン画像専用のModBuddyプロジェクト(本体Modとは分離)

## 開発方針

- ModBuddyは日本語エンコーディングで文字化けが起きやすいため、通常の編集はテキストエディタ(UTF-8固定)で行う。ModBuddyはアイコン等Artアセットのビルド時のみ使う
- ローカルテストは `Documents\My Games\Sid Meier's Civilization VI\Mods\` にこのフォルダへのジャンクションを作って行う(`tools/setup-dev-env.ps1`が作る)
- `main`=リリース済み安定版、`develop`=作業ブランチ。通常のコミットは`develop`に積み、リリース時に`develop`を`main`にマージする
- `tools/`配下のTypeScript/Node.jsコードは`.claude/rules/`のコーディング規約に従う。Civ6 Modding固有の知識・手順は`.claude/skills/`を参照(`bootstrap-mod`→`bootstrap-leader`→`make-leader-icons`/`make-fallback-portrait`/`implement-leader-abilities`/`add-unique-content`の順が基本線。ゲーム内テキストは`write-game-text`、外交台詞は`implement-diplomacy-statements`、言語追加は`add-language`、調べ物は`research-mod`を使う)。未検証のciv6wiki.info要約等は`docs/civ6-research/`に分離してある
- Steam Workshop説明文・更新ノートは`write-steam-description`/`write-update-notes` Skillで管理。`docs/steam-description/`・`docs/update-notes/`配下の生成物はリリースのたびに作り直す使い捨て出力のためGit管理外
- バランスは意図的にやや強め。HktkNban氏のHololive JP Mod、Neox氏のHololive EN/ID Modと混ぜて使うことを前提にしており、単体でのバランスの良さより他作者Mod群の文明と並べたときに埋もれない強さを優先している

## TODO

- 一条莉々華の文明能力「秘書見習い達の奮闘」を2026-10-07に調整(資源ゴールド+2/+3/+5、最初の代表団2人分を追加)。実機で以下を確認する: Traitから付与した代表団ボーナスが動くか、政策「外交連盟」と併用した場合に加算されるか
- 上記調整に伴い、en/zhの「秘書見習い達の奮闘」説明文を再確認する(指示後)
- 上記調整に伴い、`docs/steam-description/`の4言語を更新する(リリース前、依頼時)
