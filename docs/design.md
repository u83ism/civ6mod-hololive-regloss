# civ6mod-hololive-regloss 設計メモ

> ideaリポジトリでの構想段階を経ず、会話から直接kickoffしたプロジェクト。ideas/には要約は書かず、この台帳(`ideas/projects.md`)からこのファイルへ直接リンクする。

## 経緯

Civilization VIの新文明追加Modを作りたい。テーマはhololive ReGLOSSをモチーフにした文明。既に他作者Modの改変(SQLファイル編集)経験はある。1本目としてこのMod、以降複数Modの構想あり。

## Modding基礎知識・実装手順

Civ6 Modding全般の基礎知識(ファイル構造、modinfoの正しいスキーマ、Config.xmlの必須項目、Icon/Portraitの作法)と実機デバッグ手順は、**このMod系列共通のSkillとして`.claude/skills/mod-bootstrap`・`.claude/skills/leader-bootstrap`に切り出した**(次のReGLOSSメンバーMod立ち上げ時にフォルダごとコピーして使う想定)。このdesign.mdには一条莉々華固有の設計判断だけを書く。

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

**資源クラス別ゴールドボーナス**(文明固有能力「秘書見習い達の奮闘」) — 通常の産出に加えて、所有する資源の数に応じてゴールドを追加で得る(暫定値、要バランス調整):

| 資源クラス | 追加ゴールド(資源1つあたり) |
|---|---|
| ボーナス資源 | +3 |
| 戦略資源 | +5 |
| 高級資源 | +10 |

実装方式は「実装状況」節を参照(`MODIFIER_ALL_CITIES_ATTACH_MODIFIER`+`MODIFIER_CITY_PLOT_YIELDS_ADJUST_PLOT_YIELD`+`REQUIREMENT_PLOT_RESOURCE_CLASS_TYPE_MATCHES`の組み合わせ、ベースゲームのみで完結・Lua不要)。当初は指導者固有能力(LeaderTrait)として実装したが、2026-09-19に文明固有能力(CivilizationTrait)へ移設した。指導者固有能力の中身は改めて別途設計する(現状はプレースホルダー、指導者能力名のみ「かわいい！ポジティブ！ジーニアス！」で確定・実機確認済み)。

### 保留中の追加アイデア(技術検証済み・未実装)

以下は莉々華の能力候補として出たが、今回は資源Traitを優先して一旦確定・保留とした。技術的な実装可否は調査済み:

- **独占/大企業モードON時の追加ボーナス**: `.modinfo`の`ActionCriteria`で`ConfigurationValueMatches`(`Group=Game`, `ConfigurationId=GAMEMODE_MONOPOLIES`, `Value=1`)を使えば判定可能。Firaxis自身が`KublaiKhan_Vietnam.modinfo`で同じ手法を使っており(`Criteria id="Monopolies_Mode"`)、モードON時だけ追加XMLをロードする構成にできる。モノポリー/コーポレーション専用のEffect/RequirementタイプはDB上に存在しない(倍率計算はエンジン内部でハードコード)ため、直接フックはできない。コーポレーション本社の産出や設立コストなど周辺要素への一般的なModifierで代替する必要がある
- **コミュ力による外交関係値補正**: 任意の相手へのOpinion数値を直接動かす汎用効果は存在しない(Opinionはアジェンダごとにハードコードされた専用ModifierType、例: `MODIFIER_PLAYER_DIPLOMACY_AGENDA_SHORT_LIFE_GLORY`)。`EFFECT_ADJUST_PLAYER_GRIEVANCE_DECAY`(`ModifierType=MODIFIER_PLAYER_ADJUST_GRIEVANCE_DECAY`、`Amount`引数あり、`CollectionType=COLLECTION_OWNER`)でGrievance(外交不満)の減衰速度を上げることは可能。ゴルゴ(`TRAIT_AGENDA_WITH_SHIELD`、Expansion2で追加)・アレクサンドロス3世(`TRAIT_AGENDA_SHORT_LIFE_GLORY`、同じくExpansion2で追加)の実装で前例あり(`Amount=100`=減衰速度2倍)。2026-09-20に実機データ(`Expansion2_Leaders.xml`/`Macedonia_Persia_Expansion2.xml`)で再確認・リーダー名の誤記を修正(旧: アレクサンダー/キュロスと誤記していた)。
  **効果の向きに注意**: `CollectionType=COLLECTION_OWNER`は「他文明が自分に対して持つGrievance」ではなく**「自分(Owner)自身が他文明に対して持つGrievance」の減衰**を早める効果だと2026-09-20に実機検証で確定した(下記「実装状況」参照)。当初「自分に対する他文明のGrievance」と誤って記述していたが訂正

## 基礎情報(2026-09-19確定)

インストール済みの他作者Hololive Mod群(HktkNban氏のJP1〜5期生シリーズ、Neox/Keniisu氏のHoloEN/HoloID)の命名規則を実機ファイルで調査し、Neox/Keniisu系(パック名でスコープしたID、文明IDはキャラ名でなくテーマ名)をベースに採用した。

```
CIVILIZATION_REGLOSS_ICHIJOU        (表示名: 一条コーポレーション)
LEADER_REGLOSS_ICHIJOU_RIRIKA       (一条莉々華, 公式表記 "Ichijou Ririka" を採用)
TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA
AGENDA_REGLOSS_ICHIJOU_RIRIKA        (ユニークアジェンダ本体)
TRAIT_AGENDA_REGLOSS_ICHIJOU_RIRIKA  (アジェンダ紐付け用Trait)
```

カラー: Primary `#ee558b`(238,85,139) / Secondary 白(255,255,255,255)。

## 実装状況(2026-09-20更新)

莉々華の資源特化Trait(資源クラス別ゴールドボーナス)をXMLに実装済み。当初はLeaderTraitとして実装したが、同日中に文明固有能力(CivilizationTrait)へ移設した。

2026-09-20、ユニークアジェンダ「かわいい！ポジティブ！ジーニアス！」(`AGENDA_REGLOSS_ICHIJOU_RIRIKA`)を実装。指導者固有能力(`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA`)の名前として確定していた「かわいい！ポジティブ！ジーニアス！」を、アジェンダ側の名前として付け替えた(指導者固有能力は名前も含めて完全にプレースホルダーへ戻った)。アレクサンドロス3世のユニークアジェンダ`AGENDA_SHORT_LIFE_GLORY`(実機データで確認済み: [基礎情報](#基礎情報2026-09-19確定)参照)を土台に着手したが、当初実装(莉々華自身との戦争状態のみを見る)は本人の意図(都市国家攻撃も含めた一般的な好戦性を見たい)と食い違っていたため、同日中にWarmonger判定ベースに変更した(好み=好戦的でない文明、嫌い=好戦的な文明)。不平(Grievance)減衰速度2倍(`MODIFIER_PLAYER_ADJUST_GRIEVANCE_DECAY`、`Amount=100`)は変更せず継承。

- `XML/Leaders.xml` — Leader/Trait本体に加え、`Agendas`/`AgendaTraits`/`HistoricalAgendas`でユニークアジェンダを実装。好み/嫌いの判定は汎用の`MODIFIER_PLAYER_DIPLOMACY_SIMPLE_MODIFIER`+`REQUIREMENT_PLAYER_IS_NOT_WARMONGER`で組んでいる(バニラの専用ハードコードModifierType、例: `MODIFIER_PLAYER_DIPLOMACY_AGENDA_SHORT_LIFE_GLORY`、はModからは新規追加できないため代替)。好み側はバニラの`PLAYER_NOT_WARMONGER_SUBJECT`(`TRAIT_AGENDA_PEACEKEEPER`というRandom Agendaで実際に使われている生きたRequirementSet)を再利用、嫌い側の対になる`PLAYER_IS_WARMONGER_SUBJECT`はバニラの`AGENDA_MODIFIER_WARMONGER`が参照しているのに定義(RequirementSetRequirements)が丸ごと存在しない(バニラ側の未完成データの疑い)ため自前でInverse版を定義した。`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA`はName/Description参照のみ持ち、効果(Modifier)は無し。指導者固有能力の中身は未設計
- `XML/Civilizations.xml` — Civilization本体、CivilizationLeaders、CityNames(暫定で1件のみ)、および`TRAIT_CIVILIZATION_REGLOSS_ICHIJOU`(資源特化Trait本体)。`MODIFIER_ALL_CITIES_ATTACH_MODIFIER`で`MODIFIER_CITY_PLOT_YIELDS_ADJUST_PLOT_YIELD`(+`REQUIREMENT_PLOT_RESOURCE_CLASS_TYPE_MATCHES`)を自国の全都市に付与する構造。Firaxis公式信仰"Religious Idols"と同じパターンで、ベースゲームのみで完結(拡張パック依存なし)
  - 当初案(`MODIFIER_PLAYER_CITIES_ADJUST_RESOURCE_YIELD_BY_COUNT`、エチオピア方式)は資源クラスでの絞り込みができない(Subjectが都市でありタイルでないため)ことが実装直前に判明し、上記方式に変更した
- `XML/Colors.xml` — Colors/PlayerColors
- `XML/Config.xml` — リーダー選択画面(フロントエンド)用の登録。Icon/PortraitはArt未着手のため未指定。CivilizationAbility名/説明はCivilizationTrait実装済みのLOCキーを参照
- `Text/en_US/Text.xml`・`Text/ja_JP/Text.xml` — 文明名/説明、指導者名、指導者/文明Trait名・説明、アジェンダ名・説明・外交台詞、都市名1件。指導者固有能力の名前・効果テキストのみ「[仮題]」のプレースホルダーが残る

## 実機デバッグ記録

2026-09-19、リーダー選択画面への表示・実ゲームでの資源特化Trait動作(高級資源タイルのゴールド産出増加)を確認済み。LeaderTrait→CivilizationTraitへの移設後も文明能力としての発動を再確認済み。指導者能力名(当時)「かわいい！ポジティブ！ジーニアス！」もリーダー選択画面でぎりぎり表示崩れなしを確認(この名前は2026-09-20にユニークアジェンダ側へ付け替えたので、表示崩れの確認結果自体はそのままアジェンダ名にも当てはまる想定だが、アジェンダ名の表示箇所は選択画面とは別(外交画面等)のため未確認)。MODの基本的な骨格(文明・指導者・Trait)は動作するところまで到達した。

2026-09-20実装のユニークアジェンダ(`AGENDA_REGLOSS_ICHIJOU_RIRIKA`)の初期実装(莉々華自身との戦争状態を見る版)を、1vs1決闘モードで実機確認した。FireTunerの`Diplomacy.ltp`パネル(`GameEffects.GetModifiers()`でModifierインスタンスのOwner/Subject数/Activeを見られる)で「好み」側が`Active=true`・対象1件になっているのを確認(自分自身は`REQUIRES_MAJOR_CIV_OPPONENT`を満たせず対象外になるため、1vs1なら残る1件は相手プレイヤーで確定)。実際にOpinion内訳にも+4点反映されていることも確認済みで、判定の仕組み自体(汎用SimpleModifierによる好み/嫌いの発火・Opinion加算)は機能することが確定した。

その過程で別の罠を踏んだ: `ModifierStrings`(`Context="Sample"`、`Text="LOC_TOOLTIP_SAMPLE_DIPLOMACY_ALL"`)への登録が無いと、`SimpleModifierDescription`の値自体は存在するのにOpinion内訳の理由テキストが「理由不明」にフォールバックする(`LOC_TOOLTIP_SAMPLE_DIPLOMACY_ALL`の実体は`{diplomaticReason}`というプレースホルダーで、これがUI側の動的差し替えフック)。バニラの全Agenda系Modifier(`AGENDA_HIGH_CULTURE`等)はこの行を必ずセットで持っており、うちのXMLだけ抜けていたのが原因。`XML/Leaders.xml`に追記して解消し、これも実機で理由テキストが表示されることを確認済み。**今後DIPLOMACY_MODIFIER系のModifierを追加するときは、`TraitModifiers`/`Modifiers`/`ModifierArguments`に加えて`ModifierStrings`も忘れずにセットで書くこと。**

その後、判定条件を「莉々華との戦争状態」から「Warmonger判定(都市国家攻撃含む一般的な好戦性)」に変更した(上記「実装状況」参照)。2026-09-20、都市国家と交戦中(まだ都市を占領していない)の文明でOpinionが下がらないことを実機確認した。調査の結果、`REQUIREMENT_PLAYER_IS_NOT_WARMONGER`は「交戦中かどうか」ではなく`WARMONGER_CITY_PERCENT_OF_DOW`/`WARMONGER_FINAL_MAJOR_CITY_MULTIPLIER`/`WARMONGER_RAZE_PENALTY_PERCENT`等(`GlobalParameters.xml`)で加点される**「都市を占領/破壊したかどうか」の結果ベースの判定**であることが判明。「宣戦した時点で即反応する」汎用の仕組みはバニラに存在しない(汎用の「対象が誰かと交戦中か」を見るRequirementTypeが無く、既存の`REQUIREMENT_PLAYER_AT_WAR_AND_HAS_MET`はOwnerとの一対一関係しか見れない)。本人に確認の上、**この「占領/破壊の結果ベース」という仕様のまま維持することで確定**(2026-09-20)。「莉々華自身との戦争」+「Warmonger」のOR条件案も提示したが不採用。都市国家を1つ占領/滅亡させても、正当な大義(Casus Belli)付きの戦争だとバニラ自身もWarmonger扱いにしない(Grievanceも発生しない)ケースがあることも実機で確認済み(バニラの基準に忠実な結果であり、うちの実装のバグではない)。

**Grievance減衰効果(`REGLOSS_ICHIJOU_RIRIKA_AGENDA_GRIEVANCE_DECAY`)の向きを2026-09-20に実機検証で確定**: 公式Civilopedia(`LOC_PEDIA_CONCEPTS_PAGE_GRIEVANCES_CHAPTER_CONTENT_PARA_2`)によれば「Grievanceは平和な間だけターンごとに0へ近づく、戦争中は減衰しない」。この前提の上で2つのテストを実施:
- **非難声明で発生した「あなたが莉々華に対して持つ不平」(25→15→5)**: 太古の基礎減衰率(`GrievanceDecayRate=10`)通りにしか減らず、ブーストなし
- **自分が莉々華に奇襲戦争を仕掛けて発生した「莉々華があなたに対して持つ不平」(150、講和後に-20/ターンで減衰)**: 基礎値の**ちょうど2倍**で減衰

この2点から、`MODIFIER_PLAYER_ADJUST_GRIEVANCE_DECAY`(`CollectionType=COLLECTION_OWNER`)は**「他文明が自分(Owner)に対して持つGrievance」ではなく「自分(Owner)自身が他文明に対して持つGrievance」の減衰を早める効果**であることが確定した。ゲーム的には「莉々華を攻撃しても、彼女の中の恨みが早く消えるので関係修復がしやすくなる」という、攻撃した側が得をする方向の効果になる。「ポジティブ」なキャラ付けとしては妥当な解釈だが、design時の想定(自分への風当たりが弱まる)とは逆だったので注意。

デバッグで踏んだ罠(modinfoスキーマの選択ミス、`Players`テーブルのNOT NULL地獄、LocalizedText/Colorsの重複INSERT、ログの有効化方法と2種類のログの見方)は汎用知識として`.claude/skills/leader-bootstrap`に切り出し済み。次にModが読み込まれない系の問題が起きたら、まずそちらを参照する。

未解決で残っているもの: `Text.xml`/`Colors.xml`をFrontEndActions/InGameActions両方から重複読み込みしている影響と思われる`UNIQUE constraint failed`警告(Database.log)が出続けている。動作に実害は無さそうだが未整理。

## 保留・未着手のTODO
- [ ] 上記の`UNIQUE constraint failed`警告の整理(実害確認の上で、Text/Colorsの参照重複を解消する)
- [ ] 指導者固有能力(TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA)の中身の設計(現状は名前「かわいい！ポジティブ！ジーニアス！」のみ確定、効果は"[仮題] 未設計"のプレースホルダー)
- [ ] Art本制作: `Art/Source/`に絵師(X上で公開)からのアイコン加工元画像(`ichijou-corporation-logo1〜3.jpg`、複数パターンが1枚にまとまっており切り出しが必要)、および`ichijou-ririka-stand.webp`(2000x2000、リーダーポートレート素材候補)を配置済み。現状`Art/Icons/`のバッジアイコンは、これらとは別の暫定ロゴ(32x32・低解像度、既に削除済み)から自動生成したものなので、上記素材から切り出した本番アイコンに差し替えが必要。リーダー選択画面の全身ポートレート(`IMG_LEADER_..._FOREGROUND/BACKGROUND`)はArtDef+XLP+ModBuddyのAsset Manager経由のコンパイルが必要そうで、PNG直置きの簡易ルートが見当たらなかった(要ModBuddy、ただしテキスト絡みの文字化け問題とは無関係なのでArt制作だけModBuddyを使う手はある)
- [ ] UniqueUnit / UniqueBuilding の設計(CivilizationTraitは資源特化Traitとして設計・実装済み)
- [ ] 保留中の追加アイデア(独占/大企業モード連動ボーナス、コミュ力によるGrievance減衰)の実装要否再検討
- [ ] 必要ならLua実装(該当するGameEventsが存在するか先に確認)
