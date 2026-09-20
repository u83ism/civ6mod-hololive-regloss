# civ6mod-hololive-regloss

Civilization VI の新規文明追加Mod。hololive ReGLOSSをモチーフにした文明を実装する。

詳細な設計・調査メモは[docs/design.md](docs/design.md)を参照。

## 現状

一条莉々華(一条コーポレーション)の実装が進行中。

- 文明・指導者・文明固有能力(資源クラス別ゴールドボーナス)を実装し、リーダー選択画面・実ゲームでの動作を確認済み
- 文明/指導者のバッジアイコン(外交パネル・プレイヤーリスト等)を実装・実機確認済み
- 外交交渉画面のクレオパトラ対策(フォールバック静止画)、ローディング画面(ポートレート・背景)を実装・実機確認済み
- 指導者固有能力・固有ユニット/区域/施設、外交交渉画面の背景、リーダー選択画面の全身ポートレートは未着手
- 既知の未解決問題: リーダー選択画面の文明能力アイコンとパウズメニューのバッジが、本Modの`PlayerColors`ではなくバニラの汎用色プールで着色されてしまう(詳細は`docs/civ6-icon-color-bug-investigation.md`)

## 構成

- `civ6mod-hololive-regloss.modinfo` — Modのエントリポイント。ActionGroupsで参照するファイルはすべて`Files`にも列挙する必要がある
- `XML/` — Civilization / Leader / Trait / Colors / Config などのDB定義(XML)
- `Text/en_US/`, `Text/ja_JP/` — ローカライズテキスト
- `Art/` — アイコン・リーダーシーン等のアセット(`Art/Source/`が元画像、`Art/Icons/`が各サイズ展開済みPNG)
- `Platforms/` — ModBuddyビルド済みの`.blp`(バッジアイコン用)
- `tools/png2dds/` — 元画像からアイコン各サイズのPNG/DDSを自動生成するビルドスクリプト(TypeScript、`tsx`で実行)
- `tools/IconBuild/` — アイコン画像専用のModBuddyプロジェクト(本体Modとは分離)

## 開発方針

- ModBuddyは日本語エンコーディングで文字化けが起きやすいため、通常の編集はテキストエディタ(UTF-8固定)で行う。ModBuddyはアイコン等Artアセットのビルド時のみ使う
- ローカルテストは `Documents\My Games\Sid Meier's Civilization VI\Mods\` にこのフォルダをシンボリックリンクして行う
- `tools/`配下のTypeScript/Node.jsコードは`.claude/rules/`のコーディング規約に従う。Civ6 Modding固有の知識・手順は`.claude/skills/`を参照(`mod-bootstrap`→`leader-bootstrap`→`make-leader-icons`/`make-fallback-portrait`/`leader-abilities`/`leader-unique-content`の順)。未検証のciv6wiki.info要約等は`docs/civ6-research/`に分離してある

## TODO

- [ ] リーダー選択画面の能力アイコン/パウズメニューの色不具合の原因特定
- [ ] 指導者固有能力(TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA)の設計
- [ ] UniqueUnit / UniqueBuilding の設計
- [ ] 外交交渉画面の背景・リーダー選択画面の全身ポートレート(`PORTRAIT_*`、名称含め未検証)
- [ ] 必要ならLuaでのGameEventsフック実装
