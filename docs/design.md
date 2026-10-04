# civ6mod-hololive-regloss 設計メモ

> ideaリポジトリでの構想段階を経ず、会話から直接kickoffしたプロジェクト。ideas/には要約は書かず、この台帳(`ideas/projects.md`)からこのファイルへ直接リンクする。

> **役割分担(`.claude/rules/documentation.md`)**: 「今何が実装済み/実機確認済みか」という現状ステータスは[README.md](../README.md)だけが正。このファイルは**ゲームデザイン**(何をどういう狙いで作るか、判断の理由、検討した代替案)に集中し、Modifier・Lua・artdef・実機で踏んだ罠のような実装の詳細は[implementation-notes.md](implementation-notes.md)、Civ6本体の公式仕様・慣習は[civ6-research/vanilla-conventions.md](civ6-research/vanilla-conventions.md)に書く。生存期間の短い「現状フラグ」はここに書かない。過去の実機確認イベント自体(「2026-09-21に◯◯を実機確認した」等)は日付付きの経過記録として残してよい。

## 経緯

Civilization VIの新文明追加Modを作りたい。テーマはhololive ReGLOSSをモチーフにした文明。既に他作者Modの改変(SQLファイル編集)経験はある。1本目としてこのMod、以降複数Modの構想あり。

## Modding基礎知識・実装手順

Civ6 Modding全般の基礎知識(ファイル構造、modinfoの正しいスキーマ、Config.xmlの必須項目、Icon/Portraitの作法)と実機デバッグ手順は、**このMod系列共通のSkillとして`.claude/skills/bootstrap-mod`・`.claude/skills/bootstrap-leader`に切り出した**(次のReGLOSSメンバーMod立ち上げ時にフォルダごとコピーして使う想定)。このdesign.mdには一条莉々華固有の設計判断だけを書く。

- **Luaが必要になる境界**(Skillに含めていない一般知識): 「〜するたびに」のような条件トリガー型の挙動は、GameEvents(例: `GameEvents.CityCaptureComplete`、`SerialEventCityCreated`等)をフックする形でしか実装できない。Lua側から任意にゲーム内部を触れるわけではなく、**用意されたイベントに反応する形のみ**。実装したい能力が既存のGameEventsでカバーされているか先に確認するのが肝心

## 開発方針の決定事項

- **ModBuddyを避ける**: 日本語エンコーディングで文字化けが起きやすい(過去の他作者Mod改変経験より)。普段の編集はテキストエディタ(UTF-8固定)で行い、ModBuddyはSteam Workshop公開時・Art資産コンパイル時のみ使う想定
- **リポジトリはMod単位で分割**: 複数Mod構想があるが、Civ6のWorkshop配布単位(Mod=1パッケージ・固有ID・独立バージョニング)と、ideaリポジトリの既存運用(1アイデア=1実装リポジトリ)に合わせ、Mod単位でリポジトリを分ける方針。Lua共通処理の重複が実際に見えてきたら、その時点で共通ライブラリ化を検討する。**この「Mod単位」はReGLOSS以外の別Mod構想を指す分割単位であり、ReGLOSSメンバー同士の話ではない**(下記「指導者設計方針」参照)
- **バランスは意図的にやや強め(オーバーパワー気味)**: このMod単体で完結させるのではなく、HktkNban氏のHololive JP Mod(1〜5期生シリーズ)・Neox氏のHololive EN/ID Modと混ぜて同じセーブで使うことを前提にしている。素のバニラ文明と一対一で比較したときの数値バランスの良さより、他作者Mod群の文明と並べたときに埋もれない強さを優先する方針(2026-09-22、本人確認)

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

- Hololive系Modの慣習に従い、ReGLOSSメンバーは1人1指導者(1人1文明)としてバラバラに実装する(複数メンバーを1つの文明・1人の指導者にまとめることはしない)
- **ただしMod(リポジトリ)自体は分けない**: ReGLOSSメンバー全員をこの1本のMod(このリポジトリ)に順次追加していく方針。上記「開発方針の決定事項」の「Mod単位でリポジトリを分ける」はReGLOSS以外の別Mod構想向けの方針であり、ReGLOSSメンバー同士はこのMod内で1文明ずつ増えていく想定(2026-09-22、本人確認)
- 1人目は一条莉々華から着手。社長キャラ → 経済特化、その中でも資源(ボーナス/戦略/高級資源)に特化した指導者とする

### 一条莉々華
#### コンセプト
- 社長キャラなので経済特化
- 「独占と大企業」モードにフォーカスするが、ONとOFFで指導者能力が変わる
  - ONの場合は、特に産業がやや弱いので底上げと、作成するまでが大変でほとんど活きてない商品の作成コストを削減する
  - OFFの場合は交易をテーマに底上げ。
- ただし大企業はもちろん作業もが出現までやや時間がかかるので、資源ボーナスを増やすことで序盤を生き残れるようにしてある
- その他、資源探索に必要な強化型斥候をUUに、資源を改善するのに必要な労働者の使用回数に補正を入れることで足回りを強化

#### 文明固有能力「秘書見習い達の奮闘」

**資源クラス別ゴールドボーナス** — 通常の産出に加えて、所有する資源のうち改善(施設)を建てて開発済みのものの数に応じてゴールドを追加で得る(未改善タイルはボーナス無し):

| 資源クラス | 追加ゴールド(資源1つあたり) |
|---|---|
| ボーナス資源 | +3 |
| 戦略資源 | +4 |
| 高級資源 | +6 |

実装方式は「実装状況」節を参照(`MODIFIER_PLAYER_CITIES_ATTACH_MODIFIER`+`MODIFIER_CITY_PLOT_YIELDS_ADJUST_PLOT_YIELD`+`REQUIREMENT_PLOT_RESOURCE_CLASS_TYPE_MATCHES`の組み合わせ、ベースゲームのみで完結・Lua不要)。当初は指導者固有能力(LeaderTrait)として実装したが、2026-09-19に文明固有能力(CivilizationTrait)へ移設した。

#### 指導者固有能力「大天才」(独占/大企業モードON時、2026-09-21確定)

独占/大企業モード(`GAMEMODE_MONOPOLIES`)ON時の指導者固有能力(`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA_MONOPOLIES`、名前「大天才」)の中身。

- **「産業」改善+2文化力/+2科学力/+1ゴールド、「大企業」改善+4文化力/+4科学力/+2ゴールド**(文化力・科学力・ゴールドとも大企業は産業の2倍。2026-09-21、実機確認後のバランス調整で「文化力/科学力は大企業2倍」「ゴールド+1を追加」に変更し、2026-09-22にゴールドも大企業2倍(+2)に統一): 「産業」(`IMPROVEMENT_INDUSTRY`)は区域ではなく`Kind="KIND_IMPROVEMENT"`の改善(当初「産業区域」=`DISTRICT_INDUSTRIAL_ZONE`だと誤解していたが、本人指摘により2026-09-21に訂正)。同種の高級資源2つに改善(鉱山/採石場/プランテーション等)を作った後、労働者で創出でき、「経済学」研究後は大商人で上位互換の「大企業」(`IMPROVEMENT_CORPORATION`)にアップグレードできる。うちの資源特化Trait(`TRAIT_CIVILIZATION_REGLOSS_ICHIJOU`)と同じ`MODIFIER_PLAYER_CITIES_ATTACH_MODIFIER`→`MODIFIER_CITY_PLOT_YIELDS_ADJUST_PLOT_YIELD`構造で実装し、絞り込みは`REQUIREMENT_PLOT_IMPROVEMENT_TYPE_MATCHES`(引数`ImprovementType`、モノポリーMODE自身が実際に使っている`REQUIREMENT_CITY_GROWTH_INDUSTRY`で実例確認)。**罠(2026-09-21、実機で発覚)**: 数値を分けるため当初はImprovementTypeごとに独立したRequirementSet(産業専用/大企業専用)+Modifierペアに分けたが、大企業タイル単体のツールチップで文化力/科学力が+4ではなく+6(産業分+2+大企業分+4)になる不具合が実機で見つかった。原因は未確定(FireTunerでの裏取りは未実施)だが、Civ6のImprovementは一度建てるとImprovementType自体は変わらないパターンが多い(鉱山は技術で産出が上がってもずっと`IMPROVEMENT_MINE`のまま等)ことから、「大企業」にアップグレードしてもプロット内部の`ImprovementType`は`IMPROVEMENT_INDUSTRY`のままで別フラグ管理されており、`REQUIREMENT_PLOT_IMPROVEMENT_TYPE_MATCHES`が産業/大企業両方trueになっている可能性が高いと推測している。根本原因を確定させずに対処できるよう、「産業/大企業共通の基礎ボーナス(`REQUIREMENTSET_TEST_ANY`、文化力+2/科学力+2/ゴールド+1)」+「大企業限定の上乗せボーナス(文化力+2/科学力+2/ゴールド+1)」の2階建てに設計し直した。RequirementSetは1つのModifierの発火条件であり満たすRequirementの数だけ多重発火するわけではないため、大企業タイルで産業判定も同時にtrueになっていても基礎は1回しか発火せず、産業+2/+2/+1・大企業+4/+4/+2が常に保証される。いずれも既存の「産業」/「大企業」本来の食料/生産力/ゴールド増加(`Improvement_YieldChanges`テーブル、全文明共通)に追加で加算される(上書きではない、`EffectType=EFFECT_ADJUST_PLOT_YIELD`)。ゴールドの大企業上乗せ(`REGLOSS_ICHIJOU_RIRIKA_MONOPOLIES_ATTACH_CORPORATION_TOPUP_GOLD`)は2026-09-22追加、文化力/科学力の上乗せModifierと全く同じ構造(`REQSET_PLOT_CORPORATION_ONLY`)をゴールドにも複製しただけで、罠の再発無し
- **商品プロジェクトの生産力+100%**: `MODIFIER_PLAYER_CITIES_ADJUST_PROJECT_PRODUCTION`(`EFFECT_ADJUST_PROJECT_PRODUCTION`)を対象資源27種(標準ルールセット24種+文明勃興モード追加3種: 琥珀/オリーブ/亀。GranColombia_Maya限定の蜂蜜は対象外)の`ProjectType=PROJECT_CREATE_CORPORATION_PRODUCT_<資源>`ごとに複製。Cost値自体を減らす仕組みはゲーム全体に存在しない(`*_PROJECT*_COST`系のModifier/Effectは本体+全DLC検索で0件)ため、「コストを半減」の実体は生産力+100%(2倍速、実質ターン数半分)とした

詳細は「実装状況」節を参照。実装は`.claude/skills/implement-leader-abilities/SKILL.md`の「ゲームモードの有無で能力を切り替える」節・パターンAに従う。

#### 指導者固有能力「推し事お疲れ様でした～」(独占/大企業モードOFF時)

独占/大企業モードOFF時の指導者固有能力(`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA`、名前「推し事お疲れ様でした～」)。テーマは交易。

- **交易路容量の重複解除(+1)**: バニラは同じ都市に市場(`BUILDING_MARKET`)と灯台(`BUILDING_LIGHTHOUSE`)を両方建てても交易路容量は+1にしかならない(灯台側のボーナスが`REQUIRES_NO_MARKET`で市場と排他になっているため、`Expansion1_Buildings.xml`で確認済み)。この排他はそのままに、市場・灯台を両方持つ都市にだけ追加で+1を上乗せする専用Modifierを実装し、一条莉々華の都市だけ実質+2(他文明は従来通り+1)にした。建設順序に依存する抜け道が無いことをFireTunerで実機検証済み(2026-09-22)
- **交易路の産出量ボーナス**: 国内・国外問わず全ての交易路に食料/生産力/科学力/文化力+1ずつ(`MODIFIER_PLAYER_ADJUST_TRADE_ROUTE_YIELD`、政策カード"交易所"のゴールド加算と同じModifierType)

実装は`XML/Leaders.xml`の`REGLOSS_ICHIJOU_RIRIKA_UA_TRADE_*`系。容量ボーナスは都市単位の建物判定(`REQUIREMENT_CITY_HAS_BUILDING`)が要るため`MODIFIER_PLAYER_CITIES_ATTACH_MODIFIER`で自国都市にインナーModifierを配る構造(資源特化Trait・「大天才」と同じラッパー)、産出ボーナスはOwner=プレイヤー自身に直接効くためラッパー無しでTraitModifiersから直接アタッチ。

#### ユニークアジェンダ「KPG」

一条莉々華のユニークアジェンダ(`AGENDA_REGLOSS_ICHIJOU_RIRIKA`)。「好戦的でない文明を好み、好戦的な文明を嫌う」という一般的な好戦性ベースの判定。

- **判定方式の変遷**: 当初は「莉々華自身との戦争状態」のみを見る実装だったが、意図(都市国家攻撃も含めた一般的な好戦性を見たい)と食い違っていたため、実装当日(2026-09-20)中にWarmonger判定ベースに変更した
- **好み側**: バニラの`PLAYER_NOT_WARMONGER_SUBJECT`(`TRAIT_AGENDA_PEACEKEEPER`が実際に使っている生きたRequirementSet)を再利用
- **嫌い側**: 対になる`PLAYER_IS_WARMONGER_SUBJECT`はバニラの`AGENDA_MODIFIER_WARMONGER`が参照しているのに定義(RequirementSetRequirements)が丸ごと存在しない(バニラ側の未完成データの疑い)ため、自前でInverse版(`REGLOSS_ICHIJOU_RIRIKA_REQSET_IS_WARMONGER`)を定義した
- **Warmonger判定の実態**: `REQUIREMENT_PLAYER_IS_NOT_WARMONGER`は「交戦中かどうか」ではなく`WARMONGER_CITY_PERCENT_OF_DOW`等(`GlobalParameters.xml`)による**都市を占領/破壊した結果ベース**の判定。「宣戦した時点で即反応する」汎用の仕組みはバニラに存在しない。この仕様のまま維持することで確定(2026-09-20、本人確認)。正当な大義(Casus Belli)付きの戦争で都市を1つ占領/滅亡させてもWarmonger扱いにならないケースがあることも実機で確認済み(バニラの基準どおりで実装のバグではない)
- **任意の相手へのOpinion数値を直接動かす汎用効果は存在しない**(Opinionはアジェンダごとにハードコードされた専用ModifierType、例: `MODIFIER_PLAYER_DIPLOMACY_AGENDA_SHORT_LIFE_GLORY`)ため、好み/嫌いは汎用の`MODIFIER_PLAYER_DIPLOMACY_SIMPLE_MODIFIER`+`REQUIREMENT_PLAYER_IS_NOT_WARMONGER`(Inverse版含む)で組んでいる
- **不平(Grievance)減衰効果**: 「好み」判定の対象文明に対する不平の減衰を2倍速にする(`EFFECT_ADJUST_PLAYER_GRIEVANCE_DECAY`、`ModifierType=MODIFIER_PLAYER_ADJUST_GRIEVANCE_DECAY`、`Amount=100`、`CollectionType=COLLECTION_OWNER`。ゴルゴ`TRAIT_AGENDA_WITH_SHIELD`・アレクサンドロス3世`TRAIT_AGENDA_SHORT_LIFE_GLORY`(いずれもExpansion2)の実装が前例)。**2026-09-20に実機検証で効果の向きを確定**: `CollectionType=COLLECTION_OWNER`は「他文明が自分に対して持つGrievance」ではなく**「自分(Owner)自身が他文明に対して持つGrievance」の減衰**を早める効果。ゲーム的には「莉々華を攻撃しても、彼女の中の恨みが早く消えて関係修復しやすくなる」という、攻撃した側が得をする方向の効果になる(design時の想定とは逆だったので注意)
- **アジェンダ名は意図的に「KPG」**: 当初の指導者固有能力名から転用した「かわいい！ポジティブ！ジーニアス！」は文字数が長すぎてUI表示からはみ出るため、頭文字を取った「KPG」に短縮した(本人確認済み)

実装は`XML/Leaders.xml`の`Agendas`/`AgendaTraits`/`HistoricalAgendas`+`REGLOSS_ICHIJOU_RIRIKA_AGENDA_*`系Modifier(`ModifierStrings`のContext="Sample"行も必須、無いとOpinion内訳の理由が「理由不明」になる)。実機確認は2026-09-20、1vs1決闘モードでFireTunerの`Diplomacy.ltp`パネルによりOpinion内訳への反映を確認済み。

#### 固有ユニット「うに」

一条莉々華のペットのトイプードルという設定のUU(`UNIT_REGLOSS_ICHIJOU_UNI`)。斥候(`UNIT_SCOUT`)の置換。

- **性能**: 斥候の完全コピー+`BaseMoves`+1(3→4)のみ。移動力以外の変更は無し。見た目もScoutをそのまま流用し専用ArtDef/3Dモデルは追加しない。バニラの斥候置換UU`UNIT_CREE_OKIHTCITAW`(`Expansion1_Units_Major.xml`)を実例として踏襲した
- **専用TraitTypeが必要**: 文明本体の`TRAIT_CIVILIZATION_REGLOSS_ICHIJOU`をUU側にも使い回すと、ローディング画面/外交交渉画面のCivilization Ability表示が消える不具合が過去の別UU実装で判明済みのため、バニラの全UUと同じく`TRAIT_CIVILIZATION_UNIT_REGLOSS_ICHIJOU_UNI`という専用Traitを新設して紐付けている
- **時代スコアポップアップ用の専用イラスト**: 初めて「うに」を生産した時のHistoric Moment(`MOMENT_UNIT_CREATED_FIRST_UNIQUE`)用に、DLC Expansion1のMomentIllustrations実例(`Moment_UniqueUnit_Cree.dds`等)と同じ規格(456x332、非圧縮RGBA)で専用画像`Moment_UniqueUnit_ReglossIchijou_Uni.dds`を用意した。未登録の場合は汎用フォールバック画像になる。`tools/png2dds/gen-moment-illustration.ts`で生成し、ModBuddyでビルドした`UI/RegLoss_Moments.blp`に含まれる
- **文明選択画面/ローディング画面の固有要素アイコン一覧**: `Units.xml`側の実装だけでは自動反映されないため、`XML/Config.xml`の`PlayerItems`テーブルにも別途登録が必要(スキーマ実例: DLC `GreatBuilders/Data/GreatBuilders_ConfigData_Byzantium.xml`)。見た目はScoutのアイコンをそのまま流用(`Art/Icons/Icons.xml`でScoutと同じAtlas/Indexをエイリアス登録した`ICON_UNIT_REGLOSS_ICHIJOU_UNI`を指定)

実装は`XML/Units.xml`(`Units`/`UnitReplaces`/`Traits`/`CivilizationTraits`/`MomentIllustrations`)+`XML/Config.xml`の`PlayerItems`。

### 火威青
#### コンセプト
(未着手)

### 音乃瀬奏
#### コンセプト
- 流石に音楽キャラ？

### 儒烏風亭らでん
#### コンセプト
- やはり文化人キャラを活かして文化系指導者にしたい
- ただパッと差別化要素が思いつかない……


### 轟はじめ
#### コンセプト
- ダンス得意なので音楽と戦闘絡める？ちょっと厳しいか



## 基礎情報(2026-09-19確定)

インストール済みの他作者Hololive Mod群(HktkNban氏のJP1〜5期生シリーズ、Neox氏のHoloEN/HoloID。HoloEN側は`SpecialThanks`にKeniisu氏の名前があり協力者と思われるが、`Authors`は一貫してNeox/Neox969)の命名規則を実機ファイルで調査し、Neox系(パック名でスコープしたID、文明IDはキャラ名でなくテーマ名)をベースに採用した。

```
CIVILIZATION_REGLOSS_ICHIJOU        (表示名: 一条コーポレーション)
LEADER_REGLOSS_ICHIJOU_RIRIKA       (一条莉々華, 公式表記 "Ichijou Ririka" を採用)
TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA
AGENDA_REGLOSS_ICHIJOU_RIRIKA        (ユニークアジェンダ本体)
TRAIT_AGENDA_REGLOSS_ICHIJOU_RIRIKA  (アジェンダ紐付け用Trait)
```

カラー: Primary `#ee558b`(238,85,139) / Secondary 白(255,255,255,255)。

## 実装の仕組み・実機デバッグ記録

[implementation-notes.md](implementation-notes.md)に移した(Modifier・Lua・artdef・実機で踏んだ罠など、実装の詳細はそちら)。現状の実装・実機確認ステータス、残タスクは[README.md](../README.md)を参照(このファイルには載せない、上記「役割分担」参照)。
