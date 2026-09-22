# civ6mod-hololive-regloss 設計メモ

> ideaリポジトリでの構想段階を経ず、会話から直接kickoffしたプロジェクト。ideas/には要約は書かず、この台帳(`ideas/projects.md`)からこのファイルへ直接リンクする。

> **README.mdとの役割分担(2026-09-23)**: 「今何が実装済み/実機確認済みか」という現状ステータスは[README.md](../README.md)だけが正とする。このファイルには**なぜその設計・実装にしたか**(判断の理由、検討した代替案、実機で踏んだ罠)だけを書き、生存期間の短い「現状フラグ」はここに書かない。過去の実機確認イベント自体(「2026-09-21に◯◯を実機確認した」等)は日付付きの経過記録として残してよい(これは書いた時点で凍結された過去の事実であり、後から古くなって嘘になることがないため)。

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
- `XML/Colors.xml` — Colors/PlayerColors
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

**2026-09-21、ローディング画面(新規ゲーム開始時)にも一条莉々華の立ち絵・背景を実装、実機確認済み**(本人評価「パーフェクト。素晴らしい」)。`LoadingInfo`テーブル(`XML/Leaders.xml`)に`ForegroundImage="LEADER_REGLOSS_ICHIJOU_RIRIKA_NEUTRAL"`/`BackgroundImage="LEADER_REGLOSS_ICHIJOU_RIRIKA_BACKGROUND"`の行を追加。civ6wiki.infoの画像名(`hogehoge_LoadingInfo_*`)・XLP名(`UILeaders.xlp`)は実在せず架空だったと判明したため、ゲーム本体の`LoadScreen.lua`/DBスキーマ/公式DLC実データを直接読んで裏取りした(詳細は`.claude/skills/make-fallback-portrait/references/fallback-and-loading-schema.md`)。**背景画像はキャラクターを描き込む必要がない**(`LoadScreen.xml`上、背景とポートレートは完全に別レイヤーで重ねられる仕組みのため)ことが分かり、`Art/Source/wallpaper-broadcast-night.webp`(環境イラスト、キャラなし)を中央クロップして使用。ポートレート側は`FALLBACK_NEUTRAL_*`と全く同じ加工(膝下クロップ+上部余白+下部フェード)が高さ1024向けにそのまま使い回せた。

`Art/Source/`には他に、絵師(X上で公開)からのアイコン加工元画像(`ichijou-corporation-logo1〜3.jpg`、複数パターンが1枚にまとまっており切り出しが必要だった)、`ichijou-ririka-stand.webp`(2000x2000、全身立ち絵)、他の壁紙素材数点(`wallpaper-broadcast-daytime.webp`等)が置いてある。`wallpaper-broadcast-daytime.webp`は2026-09-23時点で未使用。

現状の実装・実機確認ステータス、残タスクは[README.md](../README.md)を参照(このファイルには載せない、上記「役割分担」参照)。
