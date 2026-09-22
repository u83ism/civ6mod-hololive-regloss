# civ6mod-hololive-regloss

Civilization VI の新規文明追加Mod。hololive ReGLOSSをモチーフにした文明を実装する。

詳細な設計・調査メモは[docs/design.md](docs/design.md)を参照。

## 現状

一条莉々華(一条コーポレーション)の実装がほぼ完成。

- 文明・指導者・文明固有能力(資源クラス別ゴールドボーナス、労働者の使用回数+1)を実装し、リーダー選択画面・実ゲームでの動作を確認済み
- 指導者固有能力を実装・実機確認済み: 独占/大企業モードON時「大天才」(産業/大企業改善のゴールド・文化力・科学力ボーナス、商品プロジェクト生産力+100%、交易路容量の重複解除・産出ボーナス)、モードOFF側「推し事お疲れ様でした～」(市場+灯台の両方がある都市の交易路容量重複解除・産出ボーナス)
- ユニークアジェンダ・外交交渉画面の台詞(GREETING/FIRST_MEETは配信者の決め台詞ベース)を実装・実機確認済み
- 固有ユニット「うに」(斥候の置換)を実装、時代スコアポップアップ用の専用イラストも追加
- 文明/指導者のバッジアイコン(外交パネル・プレイヤーリスト等)を実装・実機確認済み
- 外交交渉画面のクレオパトラ対策(フォールバック静止画)、ローディング画面(ポートレート・背景)を実装・実機確認済み
- 外交交渉画面の背景(`DiplomacyInfo`)を実装(ローディング画面用背景テクスチャを流用。設定前は`SceneLayers`未設定によりクレオパトラの背景にフォールバックしていたことが判明。未実機確認)
- ローカライズは日本語(正本)・英語・簡体字中国語・繁体字中国語の4言語に対応
- 固有区域/施設/建造物、リーダー選択画面の全身ポートレートは未着手
- 既知の未解決問題: リーダー選択画面の文明能力アイコンとパウズメニューのバッジが、本Modの`PlayerColors`ではなくバニラの汎用色プールで着色されてしまう(詳細は`docs/civ6-icon-color-bug-investigation.md`)

## 構成

- `civ6mod-hololive-regloss.modinfo` — Modのエントリポイント。ActionGroupsで参照するファイルはすべて`Files`にも列挙する必要がある
- `XML/` — Civilization / Leader / Trait / Colors / Config などのDB定義(XML)
- `Text/ja_JP/`, `Text/en_US/`, `Text/zh_Hans_CN/`, `Text/zh_Hant_HK/` — ローカライズテキスト(`ja_JP`が正本)
- `Art/` — アイコン・リーダーシーン等のアセット(`Art/Source/`が元画像、`Art/Icons/`が各サイズ展開済みPNG)
- `Platforms/` — ModBuddyビルド済みの`.blp`(バッジアイコン用)
- `tools/png2dds/` — 元画像からアイコン各サイズのPNG/DDSを自動生成するビルドスクリプト(TypeScript、`tsx`で実行)
- `tools/IconBuild/` — アイコン画像専用のModBuddyプロジェクト(本体Modとは分離)

## 開発方針

- ModBuddyは日本語エンコーディングで文字化けが起きやすいため、通常の編集はテキストエディタ(UTF-8固定)で行う。ModBuddyはアイコン等Artアセットのビルド時のみ使う
- ローカルテストは `Documents\My Games\Sid Meier's Civilization VI\Mods\` にこのフォルダをシンボリックリンクして行う
- `main`=リリース済み安定版、`develop`=作業ブランチ。通常のコミットは`develop`に積み、リリース時に`develop`を`main`にマージする
- `tools/`配下のTypeScript/Node.jsコードは`.claude/rules/`のコーディング規約に従う。Civ6 Modding固有の知識・手順は`.claude/skills/`を参照(`bootstrap-mod`→`bootstrap-leader`→`make-leader-icons`/`make-fallback-portrait`/`implement-leader-abilities`/`add-unique-content`の順が基本線。日本語テキストは`write-official-jp-text-style`(英語/中国語は`write-official-en-text-style`/`write-official-zh-text-style`)、外交台詞は`implement-diplomacy-statements`、言語追加は`add-language`、調べ物は`research-mod`を使う)。未検証のciv6wiki.info要約等は`docs/civ6-research/`に分離してある
- Steam Workshop説明文・更新ノートは`write-steam-description`/`write-update-notes` Skillで管理。`docs/steam-description/`・`docs/update-notes/`配下の生成物はリリースのたびに作り直す使い捨て出力のためGit管理外
- バランスは意図的にやや強め。HktkNban氏のHololive JP Mod、Neox氏のHololive EN/ID Modと混ぜて使うことを前提にしており、単体でのバランスの良さより他作者Mod群の文明と並べたときに埋もれない強さを優先している

## TODO

- [ ] リーダー選択画面の能力アイコン/パウズメニューの色不具合の原因特定
- [ ] UniqueDistrict / UniqueImprovement / UniqueBuilding の設計(UniqueUnit「うに」は実装済み)
- [ ] 外交交渉画面の背景(`DiplomacyInfo`)実装の実機確認
- [ ] リーダー選択画面の全身ポートレート(`PORTRAIT_*`、名称含め未検証)
- [ ] 必要ならLuaでのGameEventsフック実装
