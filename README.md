# civ6mod-hololive-regloss

Civilization VI の新規文明追加Mod。hololive ReGLOSSをモチーフにした文明を実装する。

ゲームデザインの判断理由は[docs/design.md](docs/design.md)、実装の仕組み・実機で踏んだ罠は[docs/implementation-notes.md](docs/implementation-notes.md)、Mod固有名詞の各言語表記は[docs/glossary.md](docs/glossary.md)を参照(役割分担: 現状ステータス・TODOはこのREADME。詳細は`.claude/rules/documentation.md`)。

## 現状

一条莉々華(一条コーポレーション)の実装がほぼ完成。

- 文明・指導者・文明固有能力(資源クラス別ゴールドボーナス、労働者の使用回数+1)を実装し、リーダー選択画面・実ゲームでの動作を確認済み
- 指導者固有能力を実装: 独占/大企業モードON時「大天才」(産業/大企業改善のゴールド・文化力・科学力ボーナス、商品プロジェクト生産力+100%、交易路容量の重複解除・産出ボーナス、実機確認済み)、モードOFF側「推し事お疲れ様でした～」(市場+灯台の両方がある都市の交易路容量重複解除・産出ボーナス、効果自体は未実機確認)
- ユニークアジェンダ・外交交渉画面の台詞(GREETING/FIRST_MEETは配信者の決め台詞ベース)を実装・実機確認済み
- 固有ユニット「うに」(斥候の置換)を実装・実機確認済み、時代スコアポップアップ用の専用イラストも追加
- 文明/指導者のバッジアイコン(外交パネル・プレイヤーリスト等)を実装・実機確認済み
- 外交交渉画面のクレオパトラ対策(フォールバック静止画)、ローディング画面(ポートレート・背景)、外交交渉画面の背景(`DiplomacyInfo`)、ゲーム設定画面の全身ポートレート「Leader Placard」をすべて実装・実機確認済み(仕組みの詳細は`.claude/skills/make-fallback-portrait/references/fallback-and-loading-schema.md`参照)
- ローカライズは日本語(正本)・英語・簡体字中国語・繁体字中国語の4言語に対応
- 固有区域/施設/建造物は未着手

儒烏風亭らでんは土台のみ(2026-10-04): 文明・指導者・ダミーのTrait/アジェンダ、バッジアイコン(文明=能面のシルエット、指導者=顔)、外交交渉画面のフォールバック静止画、ローディング画面(ポートレート・背景)を用意し、BLPをビルド済み(アイコン・画像類は実機未確認)。文明BGMはカナダの曲(`ArtDefs/Civilizations.artdef`、嵐の訪れの文明、実機で鳴るのを確認済み、2026-10-04)。文明能力「芸術に満たされて」(傑作1つにつき産出4種+4)と指導者能力「芸術への渇望」(大芸術家ポイント+2・自然遺産で遺物)を実装し、実機で動作を確認した。アジェンダ・固有建造物「寄席」は未実装。設計は[docs/design.md](docs/design.md)の「儒烏風亭らでん」節。

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

- [ ] 儒烏風亭らでんの文明能力の強さの調整(傑作1つにつき産出4種+4は意図的に強め。実機で伸び方を見て数値を決める)
- [ ] らでんのローディング/外交交渉画面の背景が「SAMPLE」の透かしと「©COVER」入りの元素材(1000px幅を拡大)になっている。透かし無しの素材に差し替える
- [ ] らでんの文明名(現状は暫定の「儒烏風亭一門」)・都市名(暫定10件)・アジェンダの確定と、文明/指導者能力(名前は決定済み)の実装
- [ ] 固有ユニット「学芸員」(考古学者の置換、移動力6・コスト200)を実装済み。購入・発掘・秘宝の登録は実機で動作確認済み(2026-10-04)。考古博物館の支援枠(1人)・AIの運用は未確認
- [ ] 固有建造物「寄席」(円形劇場の置換)の実装
- [ ] 指導者固有能力「推し事お疲れ様でした～」(交易路容量+1・交易路産出+1×4)の効果自体の実機確認
- [ ] 指導者固有能力「大天才」の「大企業」改善ボーナス(文化力/科学力+4・ゴールド+2)の実機確認(「産業」側の+2/+2/+1は確認済み)
- [ ] UniqueDistrict / UniqueImprovement / UniqueBuilding の設計(UniqueUnit「うに」は実装済み)
- [ ] `Text.xml`/`Colors.xml`の重複読み込みによる`UNIQUE constraint failed`警告(Database.log)の整理(動作に実害は無さそうだが未整理)
- [ ] 必要ならLuaでのGameEventsフック実装
