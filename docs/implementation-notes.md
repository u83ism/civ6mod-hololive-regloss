# 実装メモ(仕組み・実機の罠)

> `docs/design.md`はゲームデザイン(何をなぜそう作るか)に絞り、**どう実装したか・実機で踏んだ罠**はここに書く。ゲーム本体の公式仕様・慣習は`docs/civ6-research/vanilla-conventions.md`。
> 設計判断の背景(なぜその能力にしたか)は design.md の該当節を見ること。現状ステータス・TODOは[README.md](../README.md)だけが正。
> 2026-10-04、design.mdにあった「実装状況」「実機デバッグ記録」の2節を内容を変えずにここへ移した(`.claude/rules/documentation.md`の役割分担に合わせるため)。

## 実装状況(2026-09-20更新)

莉々華の資源特化Trait(資源クラス別ゴールドボーナス)をXMLに実装済み。当初はLeaderTraitとして実装したが、同日中に文明固有能力(CivilizationTrait)へ移設した。

2026-09-20、指導者固有能力を独占/大企業モード(`GAMEMODE_MONOPOLIES`)の有無でTraitTypeごと切り替わる構成にした(効果はまだ空のダミー、名前のみ確定)。モードOFF側(`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA`)の名前は「推し事お疲れ様でした～」、ON側(`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA_MONOPOLIES`)は「大天才」。

実装は`.modinfo`の`ActionCriteria`に`ConfigurationValueMatches`(`Group=Game`, `ConfigurationId=GAMEMODE_MONOPOLIES`, `Value=1`)による`Monopolies_Mode`基準を追加し(Firaxis公式`KublaiKhan_Vietnam.modinfo`の同名クライテリアをそのまま踏襲、2026-09-20実機ファイルで確認済み)、モード切替のやり方自体はFiraxis公式Babylon DLC(`Data/Babylon_Heroes_MODE.xml`、`GAMEMODE_HEROES`基準)のギルガメシュ実装をそのまま踏襲した(2026-09-20実機ファイルで確認済み、本人からの指摘で発見): ギルガメシュは英雄と伝説モードON時、既定のTraitType(`TRAIT_LEADER_ADVENTURES_ENKIDU`)を`Delete`し、別のTraitType(`TRAIT_LEADER_GILGAMESH_HEROES`)を新規定義して`LeaderTraits`で付け替える。同じTraitTypeのRowをName/Descriptionだけ上書きする(主キー一致のUPSERT)方式ではない。当初はUPSERT方式で実装したが、Firaxis公式の実例(TraitTypeごと切り替え)が見つかったため2026-09-20中に差し替えた。効果(Modifier)がモードごとに丸ごと変わる場合、TraitModifiersはTraitType単位で紐づくため、TraitType自体を分けたほうが自然に扱える。

`XML/Leaders.xml`にモードOFF側の既定Trait(`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA`)を定義し、`XML/Leaders_Monopolies.xml`(モードON時のみ`Monopolies_Mode`基準経由で読み込み)がこれを`Delete`して`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA_MONOPOLIES`に付け替える。Traits行の`Delete`により、紐づく`LeaderTraits`/`TraitModifiers`等は外部キーのカスケードで自動的に削除される想定(Firaxis実例でも明示的な`LeaderTraits`側の`Delete`は書かれていない)。**この機構全体(Firaxis実例と同一パターン)は2026-09-21に実機確認済み**(リーダー選択画面・ゲーム内ともモードON/OFF両方で指導者能力名が正しく切り替わることを本人確認済み)。

なお、公式データにはTraitTypeを分けず「同じTraitTypeのまま`<Traits><Update><Where/><Set>`でDescription(理屈上はNameも)だけ差し替える」パターンBも存在する(シュメールの文明能力「伝説の勇者」`TRAIT_CIVILIZATION_FIRST_CIVILIZATION`、蛮族一族モード`GAMEMODE_BARBARIAN_CLANS`向け、`DLC/BarbarianClansMode/Data/BarbarianClansMode_GameplayData.xml`)。使い分けの基準は指導者Trait/文明Traitの違いではなく「名前自体が変わるか」で、莉々華の指導者能力は名前ごと変わるためパターンA(ギルガメシュ方式)を採用と決定した(2026-09-20、本人確認済み)。両パターンの詳細は`.claude/skills/implement-leader-abilities/SKILL.md`の「ゲームモードの有無で能力を切り替える」節に記録済み。

2026-09-21、`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA_MONOPOLIES`(モードON側、名前「大天才」)の効果を実装(前日時点はダミー)。当初「産業」を区域(`DISTRICT_INDUSTRIAL_ZONE`)だと誤解して`MODIFIER_PLAYER_DISTRICTS_ADJUST_YIELD_CHANGE`で実装したが、本人から実機プレイでの指摘(タイルチップで改善/施設扱いに見える)を受けて調査し直し、「産業」(`IMPROVEMENT_INDUSTRY`)/「大企業」(`IMPROVEMENT_CORPORATION`)は`Kind="KIND_IMPROVEMENT"`の改善であると確認、同日中に資源特化Trait(`TRAIT_CIVILIZATION_REGLOSS_ICHIJOU`)と同じ`MODIFIER_PLAYER_CITIES_ATTACH_MODIFIER`→`MODIFIER_CITY_PLOT_YIELDS_ADJUST_PLOT_YIELD`+`REQUIREMENT_PLOT_IMPROVEMENT_TYPE_MATCHES`構造に差し替えた。**「産業」の文化力/科学力ボーナス(+2/+2)は実機確認済み**(2026-09-21、タイル産出内訳に食料/生産力/ゴールドと並んで表示されることを本人が確認)。確認直後、バランス調整で「大企業」側を「産業」の2倍(+4/+4)+ゴールド+1(産業/大企業共通)にする変更を実装したところ、**大企業タイル単体で文化力/科学力が+6(産業分+2+大企業分+4)になる不具合を実機で発見**(ImprovementTypeごとに数値を丸ごと分ける設計が原因の可能性が高い、詳細は上記「確定した能力」節の罠コメント参照)。同日中に「産業/大企業共通の基礎+大企業限定の上乗せ」という2階建て設計に修正、こちらは実機未確認。商品プロジェクトの生産力+100%は`MODIFIER_PLAYER_CITIES_ADJUST_PROJECT_PRODUCTION`を対象資源27種分複製(変更なし)で**実機確認済み**(2026-09-21、商品製造の生産速度倍化を本人が確認)。詳細な調査根拠・前例(都市国家の科学系宗主ボーナス、ギルガメシュの英雄創造プロジェクト生産力ボーナス)は上記「一条莉々華: 指導者固有能力「大天才」」節を参照。

2026-09-20、ユニークアジェンダ「かわいい！ポジティブ！ジーニアス！」(`AGENDA_REGLOSS_ICHIJOU_RIRIKA`)を実装。指導者固有能力(`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA`)の名前として確定していた「かわいい！ポジティブ！ジーニアス！」を、アジェンダ側の名前として付け替えた(指導者固有能力は名前も含めて完全にプレースホルダーへ戻った)。アレクサンドロス3世のユニークアジェンダ`AGENDA_SHORT_LIFE_GLORY`(実機データで確認済み: [基礎情報](#基礎情報2026-09-19確定)参照)を土台に着手したが、当初実装(莉々華自身との戦争状態のみを見る)は本人の意図(都市国家攻撃も含めた一般的な好戦性を見たい)と食い違っていたため、同日中にWarmonger判定ベースに変更した(好み=好戦的でない文明、嫌い=好戦的な文明)。不平(Grievance)減衰速度2倍(`MODIFIER_PLAYER_ADJUST_GRIEVANCE_DECAY`、`Amount=100`)は変更せず継承。

- `XML/Leaders.xml` — Leader/Trait本体に加え、`Agendas`/`AgendaTraits`/`HistoricalAgendas`でユニークアジェンダを実装。好み/嫌いの判定は汎用の`MODIFIER_PLAYER_DIPLOMACY_SIMPLE_MODIFIER`+`REQUIREMENT_PLAYER_IS_NOT_WARMONGER`で組んでいる(バニラの専用ハードコードModifierType、例: `MODIFIER_PLAYER_DIPLOMACY_AGENDA_SHORT_LIFE_GLORY`、はModからは新規追加できないため代替)。好み側はバニラの`PLAYER_NOT_WARMONGER_SUBJECT`(`TRAIT_AGENDA_PEACEKEEPER`というRandom Agendaで実際に使われている生きたRequirementSet)を再利用、嫌い側の対になる`PLAYER_IS_WARMONGER_SUBJECT`はバニラの`AGENDA_MODIFIER_WARMONGER`が参照しているのに定義(RequirementSetRequirements)が丸ごと存在しない(バニラ側の未完成データの疑い)ため自前でInverse版を定義した。`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA`は独占/大企業モードOFF側のName/Description参照を持つ(効果=Modifierはまだ無し)
- `XML/Leaders_Monopolies.xml` — 独占/大企業モード(`GAMEMODE_MONOPOLIES`)ON時のみ`.modinfo`の`Monopolies_Mode`基準経由で読み込まれ、`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA`を`Delete`して`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA_MONOPOLIES`(別TraitType)に`LeaderTraits`で付け替える。効果を2026-09-21実装: 「産業」改善+2文化力/+2科学力/+1ゴールド(実機確認済み)・「大企業」改善+4文化力/+4科学力/+1ゴールド(基礎+上乗せの2階建て方式に修正後、実機未確認)、商品プロジェクト生産力+100%×27資源(実機確認済み)。2026-09-22、ゴールドも大企業2倍(+2)にするバランス調整を実施: 文化力/科学力の上乗せModifier(`ATTACH_CORPORATION_TOPUP_CULTURE`/`_SCIENCE`)と全く同じ構造(`REQSET_PLOT_CORPORATION_ONLY`、Amount=1)を`ATTACH_CORPORATION_TOPUP_GOLD`として複製しただけなので、既知の罠(ImprovementTypeごとに分けた場合の多重発火)は再発しない想定。実機未確認
- `XML/Civilizations.xml` — Civilization本体、CivilizationLeaders、CityNames(暫定で1件のみ)、および`TRAIT_CIVILIZATION_REGLOSS_ICHIJOU`(資源特化Trait本体)。`MODIFIER_PLAYER_CITIES_ATTACH_MODIFIER`で`MODIFIER_CITY_PLOT_YIELDS_ADJUST_PLOT_YIELD`(+`REQUIREMENT_PLOT_IMPROVED_RESOURCE_CLASS_TYPE_MATCHES`、資源クラス一致かつ改善済みのタイルのみ)を自国の全都市に付与する構造。Firaxis公式信仰"Religious Idols"と似たパターンだが、外側ModifierTypeはReligious Idols本体の`MODIFIER_ALL_CITIES_ATTACH_MODIFIER`(全プレイヤーの全都市が対象)ではなく自国限定の`MODIFIER_PLAYER_CITIES_ATTACH_MODIFIER`を使う必要がある(下記「実機デバッグ記録」参照)。ベースゲームのみで完結を目指しているが、`REQUIREMENT_PLOT_IMPROVED_RESOURCE_CLASS_TYPE_MATCHES`の拡張パック依存有無は未検証(下記「実機デバッグ記録」参照)
  - 当初案(`MODIFIER_PLAYER_CITIES_ADJUST_RESOURCE_YIELD_BY_COUNT`、エチオピア方式)は資源クラスでの絞り込みができない(Subjectが都市でありタイルでないため)ことが実装直前に判明し、上記方式に変更した
- `XML/Colors.sql` — Colors/PlayerColors。`UpdateColors`にXML形式を渡すと実行時にPlayerColorsが解決されず汎用色にフォールバックするため、SQL形式で書いている(経緯は`docs/civ6-icon-color-bug-investigation.md`)。旧`XML/Colors.xml`は経緯記録として残置しているが、`.modinfo`からは参照していない
- `XML/Config.xml` — リーダー選択画面(フロントエンド)用の登録。CivilizationAbility名/説明はCivilizationTrait実装済みのLOCキーを参照。選択画面でも独占/大企業モードON時に指導者能力名/説明が「大天才」側に切り替わるよう、2026-09-21に`GameModePlayerInfoOverrides`+`Queries`/`QueryCriteria`/`PlayerInfoOverrideQueries`の4テーブルを追加。本人が選択画面での実機挙動差(ギルガメシュは英雄と伝説モードON/OFFで説明文が切り替わるのに莉々華は切り替わらない)に気づいたのが発端。`GameModePlayerInfoOverrides`単体は参照されず(`Base/Assets/Configuration/Data/Schema/AdditionalTables.sql`のコメント通り)、実際のロビー画面ロジック(`Base/Assets/UI/FrontEnd/PlayerSetupLogic.lua`)を読んで`Queries`/`QueryCriteria`/`PlayerInfoOverrideQueries`による明示的なクエリ登録が必要と判明した。**独占/大企業モードの導入元DLC(KublaiKhan_Vietnam)自身がこの登録をしていない**(Firaxis自身のクビライ・カン/レディ・チュウにも選択画面でのモード切替プレビューが無い)ため、Mod側で新規登録した。詳細は`.claude/skills/implement-leader-abilities/references/game-mode-switching-pattern.md`の罠の節を参照
- `Text/en_US/Text.xml`・`Text/ja_JP/Text.xml` — 文明名/説明、指導者名、指導者/文明Trait名・説明、アジェンダ名・説明・外交台詞、都市名1件。指導者固有能力は独占/大企業モードOFF/ON双方とも名前・効果テキストとも確定済み(「推し事お疲れ様でした～」/「大天才」、詳細は上記「指導者設計方針」内の各見出し参照)。ユニークアジェンダ名「KPG」も文字数対策の意図的な短縮であり確定済み(上記「ユニークアジェンダ「KPG」」節参照)

## 実機デバッグ記録

2026-09-19、リーダー選択画面への表示・実ゲームでの資源特化Trait動作(高級資源タイルのゴールド産出増加)を確認済み。LeaderTrait→CivilizationTraitへの移設後も文明能力としての発動を再確認済み。指導者能力名(当時)「かわいい！ポジティブ！ジーニアス！」もリーダー選択画面でぎりぎり表示崩れなしを確認(この名前は2026-09-20にユニークアジェンダ側へ付け替えたので、表示崩れの確認結果自体はそのままアジェンダ名にも当てはまる想定だが、アジェンダ名の表示箇所は選択画面とは別(外交画面等)のため未確認)。MODの基本的な骨格(文明・指導者・Trait)は動作するところまで到達した。

2026-09-20実装のユニークアジェンダ(`AGENDA_REGLOSS_ICHIJOU_RIRIKA`)の初期実装(莉々華自身との戦争状態を見る版)を、1vs1決闘モードで実機確認した。FireTunerの`Diplomacy.ltp`パネル(`GameEffects.GetModifiers()`でModifierインスタンスのOwner/Subject数/Activeを見られる)で「好み」側が`Active=true`・対象1件になっているのを確認(自分自身は`REQUIRES_MAJOR_CIV_OPPONENT`を満たせず対象外になるため、1vs1なら残る1件は相手プレイヤーで確定)。実際にOpinion内訳にも+4点反映されていることも確認済みで、判定の仕組み自体(汎用SimpleModifierによる好み/嫌いの発火・Opinion加算)は機能することが確定した。

その過程で別の罠を踏んだ: `ModifierStrings`(`Context="Sample"`、`Text="LOC_TOOLTIP_SAMPLE_DIPLOMACY_ALL"`)への登録が無いと、`SimpleModifierDescription`の値自体は存在するのにOpinion内訳の理由テキストが「理由不明」にフォールバックする(`LOC_TOOLTIP_SAMPLE_DIPLOMACY_ALL`の実体は`{diplomaticReason}`というプレースホルダーで、これがUI側の動的差し替えフック)。バニラの全Agenda系Modifier(`AGENDA_HIGH_CULTURE`等)はこの行を必ずセットで持っており、うちのXMLだけ抜けていたのが原因。`XML/Leaders.xml`に追記して解消し、これも実機で理由テキストが表示されることを確認済み。**今後DIPLOMACY_MODIFIER系のModifierを追加するときは、`TraitModifiers`/`Modifiers`/`ModifierArguments`に加えて`ModifierStrings`も忘れずにセットで書くこと。**

その後、判定条件を「莉々華との戦争状態」から「Warmonger判定(都市国家攻撃含む一般的な好戦性)」に変更した(上記「実装状況」参照)。2026-09-20、都市国家と交戦中(まだ都市を占領していない)の文明でOpinionが下がらないことを実機確認した。調査の結果、`REQUIREMENT_PLAYER_IS_NOT_WARMONGER`は「交戦中かどうか」ではなく`WARMONGER_CITY_PERCENT_OF_DOW`/`WARMONGER_FINAL_MAJOR_CITY_MULTIPLIER`/`WARMONGER_RAZE_PENALTY_PERCENT`等(`GlobalParameters.xml`)で加点される**「都市を占領/破壊したかどうか」の結果ベースの判定**であることが判明。「宣戦した時点で即反応する」汎用の仕組みはバニラに存在しない(汎用の「対象が誰かと交戦中か」を見るRequirementTypeが無く、既存の`REQUIREMENT_PLAYER_AT_WAR_AND_HAS_MET`はOwnerとの一対一関係しか見れない)。本人に確認の上、**この「占領/破壊の結果ベース」という仕様のまま維持することで確定**(2026-09-20)。「莉々華自身との戦争」+「Warmonger」のOR条件案も提示したが不採用。都市国家を1つ占領/滅亡させても、正当な大義(Casus Belli)付きの戦争だとバニラ自身もWarmonger扱いにしない(Grievanceも発生しない)ケースがあることも実機で確認済み(バニラの基準に忠実な結果であり、うちの実装のバグではない)。

**Grievance減衰効果(`REGLOSS_ICHIJOU_RIRIKA_AGENDA_GRIEVANCE_DECAY`)の向きを2026-09-20に実機検証で確定**: 公式Civilopedia(`LOC_PEDIA_CONCEPTS_PAGE_GRIEVANCES_CHAPTER_CONTENT_PARA_2`)によれば「Grievanceは平和な間だけターンごとに0へ近づく、戦争中は減衰しない」。この前提の上で2つのテストを実施:
- **非難声明で発生した「あなたが莉々華に対して持つ不平」(25→15→5)**: 太古の基礎減衰率(`GrievanceDecayRate=10`)通りにしか減らず、ブーストなし
- **自分が莉々華に奇襲戦争を仕掛けて発生した「莉々華があなたに対して持つ不平」(150、講和後に-20/ターンで減衰)**: 基礎値の**ちょうど2倍**で減衰

この2点から、`MODIFIER_PLAYER_ADJUST_GRIEVANCE_DECAY`(`CollectionType=COLLECTION_OWNER`)は**「他文明が自分(Owner)に対して持つGrievance」ではなく「自分(Owner)自身が他文明に対して持つGrievance」の減衰を早める効果**であることが確定した。ゲーム的には「莉々華を攻撃しても、彼女の中の恨みが早く消えるので関係修復がしやすくなる」という、攻撃した側が得をする方向の効果になる。「ポジティブ」なキャラ付けとしては妥当な解釈だが、design時の想定(自分への風当たりが弱まる)とは逆だったので注意。

デバッグで踏んだ罠(modinfoスキーマの選択ミス、`Players`テーブルのNOT NULL地獄、LocalizedText/Colorsの重複INSERT、ログの有効化方法と2種類のログの見方)は汎用知識として`.claude/skills/bootstrap-leader`に切り出し済み。次にModが読み込まれない系の問題が起きたら、まずそちらを参照する。

未解決で残っているもの: `Text.xml`/`Colors.xml`をFrontEndActions/InGameActions両方から重複読み込みしている影響と思われる`UNIQUE constraint failed`警告(Database.log)が出続けている。動作に実害は無さそうだが未整理。

**2026-09-20、実機プレイで資源特化Traitの重大バグを発見・修正(3件)**。いずれも一次情報(Civ6本体の`Base/Assets/Gameplay/Data/Modifiers.xml`/`Beliefs.xml`、`DLC/Expansion1/Data/Expansion1_Civilizations_Major.xml`、`DLC/CatherineDeMedici/Data/CatherineDeMedici_Leaders.xml`、`DLC/Expansion2/Data/Expansion2_Beliefs.xml`)で原因を裏取りした上で修正した(`research-mod` Skill手順に従い、SDK同梱ではなくゲーム本体のインストール先XMLを直接調査):

1. **敵文明の都市にも効果が出るバグ**: 外側Modifierの`MODIFIER_ALL_CITIES_ATTACH_MODIFIER`は`CollectionType=COLLECTION_ALL_CITIES`(`Modifiers.xml`で確認)であり、名前に反して**ゲーム内の全プレイヤーの全都市が対象**。Religious Idolsが絞り込み無しで問題ないのは、信仰ベリーフが本来「そのベリーフの宗教が多数派の都市ならどの文明でも効く」仕様だから。文明固有Trait(自国限定であるべき)にそのまま流用すると他文明の都市にも波及してしまう。自国の都市だけに絞る`MODIFIER_PLAYER_CITIES_ATTACH_MODIFIER`(`CollectionType=COLLECTION_PLAYER_CITIES`)に変更して解消(公式のToqui/Mapuche文明トレイトが同じ絞り込みを使用しているのを確認)。
2. **未発見の戦略資源タイル(一見空き地)にもボーナスが出るバグ**: `REQUIREMENT_PLOT_RESOURCE_CLASS_TYPE_MATCHES`は資源クラスの一致しか見ておらず、プレイヤーにまだ発見(可視化)されているかは問わない。当初は公式の`PLOT_HAS_STRATEGIC_MINE_REQUIREMENTS`(Beliefs.xml)に倣い`REQUIREMENT_PLOT_RESOURCE_VISIBLE`を`REGLOSS_ICHIJOU_REQSET_PLOT_STRATEGIC`にAND追加して解消したが、3番目の変更で後述の`REQUIREMENT_PLOT_IMPROVED_RESOURCE_CLASS_TYPE_MATCHES`に置き換わり、この可視性チェック自体は不要になり削除した。
3. **未開発(未改善)のタイルにもボーナスが出る仕様変更依頼**: 「資源タイルを改善(施設を建てる)して開発しないとボーナスが出ないようにしたい。ただし無関係な改善(例: 資源なし丘陵の鉱山)には付けたくない」という要望を受け、`REQUIREMENT_PLOT_RESOURCE_CLASS_TYPE_MATCHES`(資源クラス一致のみ判定)を`REQUIREMENT_PLOT_IMPROVED_RESOURCE_CLASS_TYPE_MATCHES`(資源クラス一致+正しい改善が建っていることを1つで判定)に置き換えた。Catherine de Medici指導者固有能力(`RESOURCECLASS_LUXURY`)・Gathering Storm信仰"Work Ethic"(`RESOURCECLASS_STRATEGIC`)で実例確認。資源クラスとの一致が前提のため無関係な改善では発火せず、改善済みなら発見済みでもあるため上記2の可視性チェックも自然に不要になった。**未検証の懸念**: この`RequirementType`のデータ上の使用例はいずれも拡張パック関連ファイルにしかなく、`RESOURCECLASS_BONUS`での使用例も未確認(`STRATEGIC`/`LUXURY`のみ)。Catherine de Mediciの`.modinfo`は拡張パック無しロースター(`Players:StandardPlayers`)でも読み込まれる条件になっており拡張パック限定ではない可能性が高いが、実機(拡張パック無し環境)での動作未確認。

この3点は`.claude/skills/implement-leader-abilities/SKILL.md`にも罠として反映済み。

**2026-09-20、`REQUIREMENT_PLOT_IMPROVED_RESOURCE_CLASS_TYPE_MATCHES`の「改善済み」判定の実機挙動を2パターン確認(REGLOSSの資源特化Traitで検証)**:
- **都市中心(City Center)の下に資源がある場合 → 改善済み扱いにならず、ボーナス不発火**(実機確認済み)。資源タイルに直接都市を建てると資源へのアクセス自体は維持される(Civ6の既知の仕様)が、それとは別に「改善済み」判定は満たさない。都市中心は`Improvement`ではなく`District`(`DISTRICT_CITY_CENTER`)なので「`Improvement`オブジェクトの有無」を見ている可能性が高いと予想したのは、この点では正しかった
- **産業区域(Industrial Zone)の下に資源がある場合 → 改善済み扱いになり、ボーナス発火**(実機確認済み)。区域は`Improvement`ではなく`District`という点は都市中心と同じカテゴリだが、実際には都市中心と異なり改善済み判定を満たした。「`District`か`Improvement`か」という単純な二分では説明が付かないため、判定ロジックの詳細は依然不明(都市中心だけが特別扱いされている可能性が高い)。産業区域以外の区域(聖地・キャンパス等)でも同様に改善済み扱いになるかは未検証

この2点も同じ`RequirementType`を使う限りカトリーヌ・ド・メディシスの能力(`TRAIT_LEADER_MAGNIFICENCES`)にも同様に当てはまるはずだが、そちらは未検証。

**2026-09-20〜21、外交交渉画面でクレオパトラが表示される不具合を修正、実機確認済み**。原因は`Leaders.artdef`(3Dモデル)と`FallbackLeaders.artdef`(フォールバック静止画)の両方が未実装だったため(片方だけでは解消しない)。詳細な実装・裏取り内容は`.claude/skills/make-fallback-portrait/references/fallback-and-loading-schema.md`参照。**画像加工の知見として、公式のフォールバック静止画は「そのまま」ではなく上部に余白(実測5〜15%、平均10%)・下部に黒フェード(実測20〜28%地点から黒へ線形減衰、アルファは不変でRGBのみ)が画像データ自体に焼き込まれており、これを自前の立ち絵にも同様に加工(上部余白+下部フェード)して初めて公式・他言語版Hololive Modと馴染む見た目になった(本人の目視評価「パーフェクト最高だ」)。** 目視での目安としては「上15%程度の余白、下2割程度を黒フェード」で通用する。膝下でのクロップ(全身ではなく膝のちょい下までで切る)も同様に必要だった。

**2026-09-21、ローディング画面(新規ゲーム開始時)にも一条莉々華の立ち絵・背景を実装、実機確認済み**(本人評価「パーフェクト。素晴らしい」)。`LoadingInfo`テーブル(`XML/Leaders.xml`)に`ForegroundImage="LEADER_REGLOSS_ICHIJOU_RIRIKA_NEUTRAL"`/`BackgroundImage="LEADER_REGLOSS_ICHIJOU_RIRIKA_BACKGROUND"`の行を追加。civ6wiki.infoの画像名(`hogehoge_LoadingInfo_*`)・XLP名(`UILeaders.xlp`)は実在せず架空だったと判明したため、ゲーム本体の`LoadScreen.lua`/DBスキーマ/公式DLC実データを直接読んで裏取りした(詳細は`.claude/skills/make-fallback-portrait/references/fallback-and-loading-schema.md`)。**背景画像はキャラクターを描き込む必要がない**(`LoadScreen.xml`上、背景とポートレートは完全に別レイヤーで重ねられる仕組みのため)ことが分かり、`Art/Source/ichijou-ririka/wallpaper-broadcast-night.webp`(環境イラスト、キャラなし)を中央クロップして使用。ポートレート側は`FALLBACK_NEUTRAL_*`と全く同じ加工(膝下クロップ+上部余白+下部フェード)が高さ1024向けにそのまま使い回せた。

`Art/Source/ichijou-ririka/`(一条莉々華関連の元画像は2026-10-04にこのサブディレクトリへ移した。追加指導者が出てきたため)には他に、絵師(X上で公開)からのアイコン加工元画像(`ichijou-corporation-logo1〜3.jpg`、複数パターンが1枚にまとまっており切り出しが必要だった)、`ichijou-ririka-stand.webp`(2000x2000、全身立ち絵)、他の壁紙素材数点(`wallpaper-broadcast-daytime.webp`等)が置いてある。`wallpaper-broadcast-daytime.webp`は2026-09-23時点で未使用。

## 文明のBGM(`ArtDefs/Civilizations.artdef`)

- 一条莉々華(`CIVILIZATION_REGLOSS_ICHIJOU`)のBGMは、バニラのブラジル(`XrefName`=`Brazil`)の曲を借りている。2026-10-04に実機で鳴ったのを確認した(本人の提案でブラジルにした)。仕組みと登録手順は`.claude/skills/implement-leader-abilities/SKILL.md`の「文明のBGM」節。

## 儒烏風亭らでん(`XML/JuufuuteiRaden.xml`)

- **大芸術家ポイントの数え方(実機、2026-10-05)**: 首都に劇場広場・寄席・考古博物館がある状態で10と表示された。都市のぶん(区域1+寄席1+考古博物館2=4)と、文明全体のぶん(指導者能力の+2)は別に数える。ピンガラの昇進「助成者」(都市の偉人ポイント+100%)は都市のぶんだけを倍にする(4×2+2=10)。計算式そのものは画面の数字からの推測

設計は`docs/design.md`の「儒烏風亭らでん」節。文明・指導者・ダミーのTrait/アジェンダ・LoadingInfo・DiplomacyInfo・固有ユニット「学芸員」を1ファイルにまとめ、Config.xml・Colors.sql・Icons.xml・Text/ja_JP/Text.xml・`ArtDefs/Leaders.artdef`・`.modinfo`は一条莉々華のファイルへ追記した。

- **画像**: 文明アイコン(能面のSVG→白シルエット、長辺を直径の90%)・指導者アイコン(顔)・外交交渉画面の静止画・ローディング画面のポートレートと背景を`tools/png2dds`の各スクリプトで生成し、BLPは`make-leader-icons`の日本語ユーザー名回避手順でクックした。元素材は`Art/Source/juufuutei-raden/`(git管理外)。ローディング・外交の背景は`SAMPLE`の透かしと`©COVER`入りの素材(1000px幅を拡大)で、差し替え待ち
- **文明BGM**: `ArtDefs/Civilizations.artdef`の`XrefName`=`Canada`(嵐の訪れの文明の曲)。実機で鳴るのを確認した(2026-10-04)。嵐の訪れ無しの環境での動作は未確認
- **文明能力「芸術に満たされて」**: `MODIFIER_PLAYER_CITIES_ADJUST_GREATWORK_YIELD`を、傑作の種類6(彫刻・肖像画・風景画・宗教画・遺物・秘宝)×産出4(食料・生産力・信仰力・文化力)の24本、`YieldChange=4`で`TraitModifiers`に付けた。コンゴ「ンキシ」と同じModifier。数値は全て同じなので、調整は`YieldChange`の値を書き換える
- **指導者能力「芸術への渇望」**: 大芸術家ポイント+2は`MODIFIER_PLAYER_ADJUST_GREAT_PERSON_POINTS`(バニラの政策「フレスコ画」と同じ。`GreatPersonClassType`・`Amount`)。自然遺産の遺物は`MODIFIER_PLAYER_ADJUST_NATURAL_WONDER_RELIC`(`Amount=1`)で、都市国家キャンディの宗主国ボーナスが宗主国に付ける内側のModifierを、宗主国の条件を外して指導者Traitから直接付けた。**Traitから直接付けても動くことを実機で確認した**(2026-10-05)。文明能力・指導者能力とも、産出・ポイント・遺物・説明文の表示まで動作確認済み
- **固有建造物「寄席」(`BUILDING_REGLOSS_JUUFUUTEI_YOSE`、円形闘技場の置換)**: バニラの円形闘技場の行をコピーして`Name`・`Description`・`TraitType`を足し、`Building_GreatWorks`を`GREATWORKSLOT_PALACE`2つ、`Building_GreatPersonPoints`を大芸術家1、`Building_YieldChanges`を文化力+2にした(コスト150・維持費1・市民スロット1はバニラのまま、暫定)。専用Trait・`BuildingReplaces`・`Config.xml`の`PlayerItems`・アイコン(円形闘技場のアイコンの別名)も足した。Base Schemaの列だけで組んだ。実機で、寄席を建てられること・大芸術家ポイントが想定どおり出ること・寄席の後に考古博物館を建てられること(置換した建物が円形闘技場の代わりとして前提を満たすこと)を確認した(2026-10-05)。**3Dモデル(Buildings.artdef/Landmarks.artdef)は未対応**: 劇場広場の見た目は「円形闘技場+美術館」等の建物の組み合わせごとのランドマークで定義されており(`Base/ArtDefs/Landmarks.artdef`)、置換した建物が入るかは未確認
- **学芸員(`UNIT_REGLOSS_JUUFUUTEI_CURATOR`)**: バニラの考古学者の行をコピーして`BaseMoves`・`Cost`・`Name`・`Description`・`TraitType`だけ変えた。`TypeTags`は`CLASS_LANDCIVILIAN`・`CLASS_ARCHAEOLOGIST`、`Unit_BuildingPrereqs`は考古博物館(`NumSupported=1`)。Base Schemaの列だけで組み、拡張パック限定の列(`CanEarnExperience`・`CanFormMilitaryFormation`)は入れていない。`UnitAiInfos`はバニラの考古学者にも無いので足していない。実機で購入・発掘・秘宝の傑作登録・移動力+2・コスト50%が動くことを確認した(2026-10-04)
- **実機の罠: FireTunerで直接出したユニットは拠点都市(Home City)が無い。** 発掘した秘宝が傑作として登録されず、2回目の発掘もできなくなる。置換ユニットの欠陥ではなく出し方の違いだった。考古博物館のある都市で購入(または生産)すること
- **実機の罠: 固有ユニットは、見た目が置換元と同じでも`ArtDefs/Units.artdef`に専用の要素が要る。** 無いと汎用モデルになった(学芸員は労働者のような見た目、うには戦士系)。バニラの考古学者・斥候の要素を複製して`m_Name`だけ変え、`.dep`の`Units`コンシューマの`ArtDefDependencyPaths`と`.modinfo`の`Files`に登録した。手順は`.claude/skills/add-unique-content/SKILL.md`。`.dep`は手で2行(`Civilizations.artdef`・`Units.artdef`)足してあるので、`gen-dep`で作り直すと消える
- **歴史的瞬間の挿絵(うに)**: フラットな色のイラストが公式の挿絵の横でカラフルすぎたので、`gen-moment-illustration`に`cutout-sepia`モード(公式の最も暗い茶から淡いクリーム色の2色)を足して作り直した。方式と不採用だった方法は`make-moment-illustration` Skill
