# civ6mod-hololive-regloss 設計メモ

> ideaリポジトリでの構想段階を経ず、会話から直接kickoffしたプロジェクト。ideas/には要約は書かず、この台帳(`ideas/projects.md`)からこのファイルへ直接リンクする。

## 経緯

Civilization VIの新文明追加Modを作りたい。テーマはhololive ReGLOSSをモチーフにした文明。既に他作者Modの改変(SQLファイル編集)経験はある。1本目としてこのMod、以降複数Modの構想あり。

## Modding基礎知識(調査結果)

- **開発ツール**: Steam版Dev Tools(ModBuddy)。Windows専用。ただしXML/SQL/Lua編集自体はテキストエディタで完結でき、ModBuddyが必須なのはSteam Workshopへの直接アップロード機能のみ
- **ファイル構造**:
  - `.modinfo` — Modのエントリポイント。`ActionGroups`で参照するファイルは`Files`にも列挙が必要
  - `XML/` — Civilization / Leader / Trait / UniqueUnit等のDB定義(XML/SQL)
  - `Text/` — ローカライズテキスト
  - `Lua/` — GameEventsフック等のスクリプト
  - `Art/` — アイコン・リーダーシーン等のアセット
- **デバッグ**: ログフォルダの`database.log`(XML/SQL構文・DBエラー)、`lua.log`(Luaエラー)を見る
- **新文明追加の最低構成**: Civilization, Leader, Trait(ユニーク能力の本体。`TraitType`経由でユニット・建物等に紐付ける), UniqueUnit, (任意で)UniqueBuilding/UniqueDistrict, アイコン等Art。`Players`テーブルへのリーダー登録も必要
- **XML/SQLで足りる範囲**: 数値変更・既存ユニット置き換えなど、Traitシステムで表現できるもの
- **Luaが必要になる境界**: 「〜するたびに」のような条件トリガー型の挙動は、GameEvents(例: `GameEvents.CityCaptureComplete`、`SerialEventCityCreated`等)をフックする形でしか実装できない。Lua側から任意にゲーム内部を触れるわけではなく、**用意されたイベントに反応する形のみ**。実装したい能力が既存のGameEventsでカバーされているか先に確認するのが肝心

## 開発方針の決定事項

- **ModBuddyを避ける**: 日本語エンコーディングで文字化けが起きやすい(過去の他作者Mod改変経験より)。普段の編集はテキストエディタ(UTF-8固定)で行い、ModBuddyはSteam Workshop公開時のみ使う想定。BOM有無がCiv6側パーサに影響するかは未検証 — 最初の日本語テキストを含むファイルで実機ロード確認が必要
- **リポジトリはMod単位で分割**: 複数Mod構想があるが、Civ6のWorkshop配布単位(Mod=1パッケージ・固有ID・独立バージョニング)と、ideaリポジトリの既存運用(1アイデア=1実装リポジトリ)に合わせ、Mod単位でリポジトリを分ける方針。Lua共通処理の重複が実際に見えてきたら、その時点で共通ライブラリ化を検討する

## 参考資料

- [LeeS' Civilization 6 Modding Guide](https://forums.civfanatics.com/threads/lees-civilization-6-modding-guide.644687/)
- [CivFanatics: Civ6 Modding Tutorials & Reference](https://forums.civfanatics.com/resources/categories/civ6-modding-tutorials-reference.150/)
- [Civilization VI Modding Wiki](https://jonathanturnock.github.io/civ-vi-modding/docs/)
- [civ6schema (GitHub, DBスキーマ参照)](https://github.com/gqqnbig-civ6-mods/civ6schema)
- [Gedemon/Civ6-GCO (GitHub)](https://github.com/Gedemon/Civ6-GCO/blob/master/Scripts/GCO_PlayerScript.lua) — 複雑なLuaロジックの実例
- [Lua Game Events一覧 (Modiki)](https://modiki.civfanatics.com/index.php/Lua_Game_Events)
- [Without ModBuddy? (CivFanatics)](https://forums.civfanatics.com/threads/without-modbuddy.621318/) — ModBuddy無しでの制作について
- [Unique to one Civilization (CivFanatics)](https://forums.civfanatics.com/threads/unique-to-one-civilization.644667/) — TraitType経由の紐付け方

## 現状(2026-09-19時点)

スケルトンのみ作成済み。`civ6mod-hololive-regloss.modinfo`、空の`XML/Civilizations.xml`・`Text/en_US/Text.xml`、空の`Lua/`・`Art/`フォルダ。文明・指導者・Traitの具体的な中身は未着手。ローカルgitリポジトリのみ(mainブランチ、リモート未設定)。

## 次にやること

- [ ] コンセプト決定(ReGLOSSメンバーのどの要素をTraitに落とし込むか)
- [ ] UniqueUnit / UniqueBuilding の設計
- [ ] 必要ならLua実装(該当するGameEventsが存在するか先に確認)
