# civ6mod-hololive-regloss

Civilization VI の新規文明追加Mod。hololive ReGLOSSをモチーフにした文明を実装する。

## 現状

スケルトンのみ。Civilization / Leader / Trait 等の具体的な設計は未着手。

## 構成

- `civ6mod-hololive-regloss.modinfo` — Modのエントリポイント。ActionGroupsで参照するファイルはすべて`Files`にも列挙する必要がある
- `XML/` — Civilization / Leader / Trait / UniqueUnit などのDB定義(XML/SQL)
- `Text/en_US/` — ローカライズテキスト
- `Lua/` — GameEventsフック等のスクリプト(複雑なロジックが必要になった場合)
- `Art/` — アイコン・リーダーシーン等のアセット

## 開発方針

- ModBuddyは日本語エンコーディングで文字化けが起きやすいため、通常の編集はテキストエディタ(UTF-8固定)で行う。ModBuddyはSteam Workshop公開時のみ使う想定
- ローカルテストは `Documents\My Games\Sid Meier's Civilization VI\Mods\` にこのフォルダをコピー/シンボリックリンクして行う

## TODO

- [ ] 文明・指導者のコンセプト決定(ReGLOSSメンバーのどの要素をTraitに落とし込むか)
- [ ] UniqueUnit / UniqueBuilding の設計
- [ ] 必要ならLuaでのGameEventsフック実装
