# civ6mod-hololive-regloss 設計メモ

> ideaリポジトリでの構想段階を経ず、会話から直接kickoffしたプロジェクト。ideas/には要約は書かず、この台帳(`ideas/projects.md`)からこのファイルへ直接リンクする。

## 経緯

Civilization VIの新文明追加Modを作りたい。テーマはhololive ReGLOSSをモチーフにした文明。既に他作者Modの改変(SQLファイル編集)経験はある。1本目としてこのMod、以降複数Modの構想あり。

## Modding基礎知識・実装手順

Civ6 Modding全般の基礎知識(ファイル構造、modinfoの正しいスキーマ、Config.xmlの必須項目、Icon/Portraitの作法)と実機デバッグ手順は、**このMod系列共通のSkillとして`.claude/skills/mod-setup`・`.claude/skills/leader-setup`に切り出した**(次のReGLOSSメンバーMod立ち上げ時にフォルダごとコピーして使う想定)。このdesign.mdには一条莉々華固有の設計判断だけを書く。

- **Luaが必要になる境界**(Skillに含めていない一般知識): 「〜するたびに」のような条件トリガー型の挙動は、GameEvents(例: `GameEvents.CityCaptureComplete`、`SerialEventCityCreated`等)をフックする形でしか実装できない。Lua側から任意にゲーム内部を触れるわけではなく、**用意されたイベントに反応する形のみ**。実装したい能力が既存のGameEventsでカバーされているか先に確認するのが肝心

## 開発方針の決定事項

- **ModBuddyを避ける**: 日本語エンコーディングで文字化けが起きやすい(過去の他作者Mod改変経験より)。普段の編集はテキストエディタ(UTF-8固定)で行い、ModBuddyはSteam Workshop公開時・Art資産コンパイル時のみ使う想定
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

## 指導者設計方針

- Hololive系Modの慣習に従い、ReGLOSSメンバーは1人1指導者としてバラバラに実装する(まとめて1文明にはしない)
- 1人目は一条莉々華から着手。社長キャラ → 経済特化、その中でも資源(ボーナス/戦略/高級資源)に特化した指導者とする

### 一条莉々華: 確定した能力(2026-09-19)

**資源クラス別ゴールドボーナス** — 通常の産出に加えて、所有する資源の数に応じてゴールドを追加で得る(暫定値、要バランス調整):

| 資源クラス | 追加ゴールド(資源1つあたり) |
|---|---|
| ボーナス資源 | +3 |
| 戦略資源 | +5 |
| 高級資源 | +10 |

実装方式は「実装状況」節を参照(`MODIFIER_ALL_CITIES_ATTACH_MODIFIER`+`MODIFIER_CITY_PLOT_YIELDS_ADJUST_PLOT_YIELD`+`REQUIREMENT_PLOT_RESOURCE_CLASS_TYPE_MATCHES`の組み合わせ、ベースゲームのみで完結・Lua不要)。

### 保留中の追加アイデア(技術検証済み・未実装)

以下は莉々華の能力候補として出たが、今回は資源Traitを優先して一旦確定・保留とした。技術的な実装可否は調査済み:

- **独占/大企業モードON時の追加ボーナス**: `.modinfo`の`ActionCriteria`で`ConfigurationValueMatches`(`Group=Game`, `ConfigurationId=GAMEMODE_MONOPOLIES`, `Value=1`)を使えば判定可能。Firaxis自身が`KublaiKhan_Vietnam.modinfo`で同じ手法を使っており(`Criteria id="Monopolies_Mode"`)、モードON時だけ追加XMLをロードする構成にできる。モノポリー/コーポレーション専用のEffect/RequirementタイプはDB上に存在しない(倍率計算はエンジン内部でハードコード)ため、直接フックはできない。コーポレーション本社の産出や設立コストなど周辺要素への一般的なModifierで代替する必要がある
- **コミュ力による外交関係値補正**: 任意の相手へのOpinion数値を直接動かす汎用効果は存在しない(Opinionはアジェンダごとにハードコード)。ただし`EFFECT_ADJUST_PLAYER_GRIEVANCE_DECAY`(`Amount`引数あり、`CollectionType=COLLECTION_OWNER`)で自分に対する他文明のGrievance(外交不満)の減衰速度を上げることは可能。アレクサンダー(`TRAIT_AGENDA_WITH_SHIELD`)・キュロス(`TRAIT_AGENDA_SHORT_LIFE_GLORY`)の実装で前例あり(`Amount=100`=減衰速度2倍)

## 基礎情報(2026-09-19確定)

インストール済みの他作者Hololive Mod群(HktkNban氏のJP1〜5期生シリーズ、Neox/Keniisu氏のHoloEN/HoloID)の命名規則を実機ファイルで調査し、Neox/Keniisu系(パック名でスコープしたID、文明IDはキャラ名でなくテーマ名)をベースに採用した。

```
CIVILIZATION_REGLOSS_ICHIJOU        (表示名: 一条コーポレーション)
LEADER_REGLOSS_ICHIJOU_RIRIKA       (一条莉々華, 公式表記 "Ichijou Ririka" を採用)
TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA
```

カラー: Primary `#ee558b`(238,85,139) / Secondary 白(255,255,255,255)。

## 実装状況(2026-09-19)

莉々華の資源特化Trait(資源クラス別ゴールドボーナス)をXMLに実装済み。

- `XML/Leaders.xml` — Leader/Trait本体。`MODIFIER_ALL_CITIES_ATTACH_MODIFIER`で`MODIFIER_CITY_PLOT_YIELDS_ADJUST_PLOT_YIELD`(+`REQUIREMENT_PLOT_RESOURCE_CLASS_TYPE_MATCHES`)を自国の全都市に付与する構造。Firaxis公式信仰"Religious Idols"と同じパターンで、ベースゲームのみで完結(拡張パック依存なし)
  - 当初案(`MODIFIER_PLAYER_CITIES_ADJUST_RESOURCE_YIELD_BY_COUNT`、エチオピア方式)は資源クラスでの絞り込みができない(Subjectが都市でありタイルでないため)ことが実装直前に判明し、上記方式に変更した
- `XML/Civilizations.xml` — Civilization本体、CivilizationLeaders、CityNames(暫定で1件のみ)
- `XML/Colors.xml` — Colors/PlayerColors
- `XML/Config.xml` — リーダー選択画面(フロントエンド)用の登録。Icon/Portrait/CivilizationAbilityはArt未着手・CivilizationTrait未設計のため未指定
- `Text/en_US/Text.xml`・`Text/ja_JP/Text.xml` — 文明名・指導者名・Trait名/説明・都市名1件

## 実機デバッグ記録

2026-09-19、リーダー選択画面への表示・実ゲームでの資源特化Trait動作(高級資源タイルのゴールド産出増加)を確認済み。MODの基本的な骨格(文明・指導者・Trait)は動作するところまで到達した。

デバッグで踏んだ罠(modinfoスキーマの選択ミス、`Players`テーブルのNOT NULL地獄、LocalizedText/Colorsの重複INSERT、ログの有効化方法と2種類のログの見方)は汎用知識として`.claude/skills/leader-setup`に切り出し済み。次にModが読み込まれない系の問題が起きたら、まずそちらを参照する。

未解決で残っているもの: `Text.xml`/`Colors.xml`をFrontEndActions/InGameActions両方から重複読み込みしている影響と思われる`UNIQUE constraint failed`警告(Database.log)が出続けている。動作に実害は無さそうだが未整理。

## 保留・未着手のTODO
- [ ] 上記の`UNIQUE constraint failed`警告の整理(実害確認の上で、Text/Colorsの参照重複を解消する)
- [ ] Trait名("[仮題] 資源王")・文明説明文・文明固有能力("未設計"のプレースホルダー)などの本文確定
- [ ] 都市名リストの拡充(現状1件のみ)
- [ ] Art本制作: `Art/Source/`に絵師(X上で公開)からのアイコン加工元画像(`ichijou-corporation-logo1〜3.jpg`、複数パターンが1枚にまとまっており切り出しが必要)、および`ichijou-ririka-stand.webp`(2000x2000、リーダーポートレート素材候補)を配置済み。現状`Art/Icons/`のバッジアイコンは、これらとは別の暫定ロゴ(32x32・低解像度、既に削除済み)から自動生成したものなので、上記素材から切り出した本番アイコンに差し替えが必要。リーダー選択画面の全身ポートレート(`IMG_LEADER_..._FOREGROUND/BACKGROUND`)はArtDef+XLP+ModBuddyのAsset Manager経由のコンパイルが必要そうで、PNG直置きの簡易ルートが見当たらなかった(要ModBuddy、ただしテキスト絡みの文字化け問題とは無関係なのでArt制作だけModBuddyを使う手はある)
- [ ] UniqueUnit / UniqueBuilding / CivilizationTrait の設計
- [ ] 保留中の追加アイデア(独占/大企業モード連動ボーナス、コミュ力によるGrievance減衰)の実装要否再検討
- [ ] 必要ならLua実装(該当するGameEventsが存在するか先に確認)
