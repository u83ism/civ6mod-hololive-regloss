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

実装方式(実機のCiv6インストール先ファイルで実例を確認済み):
- `MODIFIER_PLAYER_CITIES_ADJUST_RESOURCE_YIELD_BY_COUNT`(`EFFECT_ADJUST_RESOURCE_YIELD_BY_COUNT`、`CollectionType=COLLECTION_PLAYER_CITIES`) — エチオピア文明固有能力`TRAIT_FAITH_RESOURCES`が実際に使っている仕組み。引数は`YieldType`(今回は全て`YIELD_GOLD`)と`Amount`のみ
- 上記だけだと資源クラスを区別しないため、`REQUIREMENT_PLOT_RESOURCE_CLASS_TYPE_MATCHES`(`ResourceClassType`引数に`RESOURCECLASS_BONUS`/`RESOURCECLASS_LUXURY`/`RESOURCECLASS_STRATEGIC`を指定)をSubjectRequirementSetとして組み合わせる。この組み合わせは`Beliefs.xml`内の宗教信仰(資源クラス別にMineボーナスを変える信仰)で実際に使われている前例あり
- Modifierを3つ(ボーナス用/戦略用/高級用)作り、同じTraitに`TraitModifiers`で紐付ければ完成。**Lua不要、XML(SQL)のみで完結**

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

## 実機デバッグ記録(2026-09-19)

- ログ出力はデフォルト無効。`%LOCALAPPDATA%\Firaxis Games\Sid Meier's Civilization VI\AppOptions.txt`に`LoggingEnabled 1`を書けば有効化できる(`Documents\My Games\...\Logs`ではなく`%LOCALAPPDATA%\Firaxis Games\...\Logs`に出力される点に注意。READMEの想定と違うので追記要)
- Modが有効化されても、`Modding.log`にファイル読み込みの形跡が一切出ない(エラーも出ない)という状態が発生した。原因は`Modding.log`ではなく**`Database.log`側**に出ていた: `ERROR: UNIQUE constraint failed: LocalizedText.Language, LocalizedText.Tag`
  - 原因: `Text/en_US/Text.xml`・`Text/ja_JP/Text.xml`を、modinfoトップレベルの`<LocalizedText>`(Modブラウザの名前解決用)と、`ActionGroups`の`<UpdateText>`(shell/game両方)の3箇所で重複ロードしていた。同じ(Language, Tag)を2重INSERTしてトランザクション失敗 → そのMODの適用が丸ごとロールバックされ、他のMODは正常なのにうちのMODだけ何も反映されないという状態になっていた
  - 対策: Mod名/Teaser/Description専用の`Text/en_US/PackageText.xml`・`Text/ja_JP/PackageText.xml`を分離し、トップレベル`<LocalizedText>`はこちらだけを参照するようにした(Firaxis公式モドと同じ分割パターン)
- ディレクトリジャンクション経由でのMod配置も疑ったが、実フォルダコピーに変えても症状は変わらなかった(ジャンクションは無罪と判明)
- **真因(最終的に判明)**: PackageText分離後もMODが有効化リストには入るのに`Modding.log`にファイル読み込みの形跡が一切出ない状態が続いた。原因はmodinfoのスキーマ選択そのもの — `<ActionGroups><ActionGroup scope="game/shell" criteria="...">`形式(Firaxis公式のDLC全般が使っている新しめの形式)を使っていたが、この環境では**MOD自体が有効化リストに載るのに中身の適用処理が一切トリガーされず、エラーも出ないまま素通りされる**という状態になった
  - 修正: HktkNban系・Neox系(HoloEN/HoloID)がどちらも使っている**`<ActionCriteria />`(空)+`<FrontEndActions>`/`<InGameActions>`直下にアクション羅列**という一段古い形式に全面書き換えたところ、`ModdingUpdateConfigurationDatabase - Loading XML/Config.xml`のようなログが初めて出るようになった
  - 教訓: 新しいDLCのソースが動いているからといって、そのスキーマ形式がコミュニティMod環境でも同様に動くとは限らない。既存の**実際に動作実績のあるMod**の構造に合わせるのが一番安全
- 上記修正後、`Players`テーブルの大半の列がNOT NULL制約であることが芋づる式に判明(`LeaderIcon`→`LeaderAbilityIcon`→`CivilizationAbilityName`→おそらく`Portrait`/`PortraitBackground`も同様、と1つ直すたびに次のエラーが出る形で発覚)。Art未着手でも仮のType文字列を全項目に入れることで解決
- 教訓: Mod内で同じテキストファイルを複数箇所から参照する際は、キーの重複に注意。`database.log`と`Modding.log`は別々に確認する必要がある(片方にしかエラーが出ないケースがある)

**2026-09-19時点でリーダー選択画面への表示、および実ゲームでの資源特化Trait動作(高級資源タイルのゴールド産出増加)を確認済み。** MODの基本的な骨格(文明・指導者・Trait)は動作するところまで到達した。

## 保留・未着手のTODO
- [ ] `Text.xml`/`Colors.xml`をFrontEndActions/InGameActions両方から重複読み込みしている影響で出ている`UNIQUE constraint failed`警告(Database.log)の実害有無を確認し、必要なら整理する
- [ ] Trait名("[仮題] 資源王")・文明説明文・文明固有能力("未設計"のプレースホルダー)などの本文確定
- [ ] 都市名リストの拡充(現状1件のみ)
- [ ] Art本制作: `Art/Source/`に絵師(X上で公開)からのアイコン加工元画像(`ichijou-corporation-logo1〜3.jpg`、複数パターンが1枚にまとまっており切り出しが必要)、および`ichijou-ririka-stand.webp`(2000x2000、リーダーポートレート素材候補)を配置済み。現状`Art/Icons/`のバッジアイコンは、これらとは別の暫定ロゴ(32x32・低解像度、既に削除済み)から自動生成したものなので、上記素材から切り出した本番アイコンに差し替えが必要。リーダー選択画面の全身ポートレート(`IMG_LEADER_..._FOREGROUND/BACKGROUND`)はArtDef+XLP+ModBuddyのAsset Manager経由のコンパイルが必要そうで、PNG直置きの簡易ルートが見当たらなかった(要ModBuddy、ただしテキスト絡みの文字化け問題とは無関係なのでArt制作だけModBuddyを使う手はある)
- [ ] UniqueUnit / UniqueBuilding / CivilizationTrait の設計
- [ ] 保留中の追加アイデア(独占/大企業モード連動ボーナス、コミュ力によるGrievance減衰)の実装要否再検討
- [ ] 必要ならLua実装(該当するGameEventsが存在するか先に確認)
