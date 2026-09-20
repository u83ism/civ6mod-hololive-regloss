---
name: leader-abilities
description: Civ6 Modで文明能力/指導者能力(Trait)の効果を実装する時に使う。「文明能力を実装する」「指導者特性の効果を書く」「Modifierの書き方」「AIの好みを設定する」「文明カラーを設定する」「能力の説明文を書く」「多言語化する」と言われたとき、または`Traits`/`Modifiers`/`Requirements`系のXMLを新規に書く/`_NAME`・`_DESCRIPTION`のテキストを書く場面で使う。leader-bootstrapで指導者が選択画面に出るところまで終わった後に使う。
---

# 文明能力・指導者能力(Trait)の実装

一条莉々華Mod(civ6mod-hololive-regloss)の実装で確立したパターン集。

## 実機確認済みパターン: 資源クラス別の産出量ボーナス

「所有する資源の数に応じてゴールド等を加算する」系のTraitを作る場合、`MODIFIER_PLAYER_CITIES_ADJUST_RESOURCE_YIELD_BY_COUNT`(エチオピア文明が使用)は資源クラス(ボーナス/戦略/高級)で絞り込めない(SubjectがCity単位でありPlot単位ではないため)。代わりにFiraxis公式の信仰"Religious Idols"と似た構造を使うが、**外側ModifierTypeはReligious Idolsそのまま(`MODIFIER_ALL_CITIES_ATTACH_MODIFIER`)を流用してはいけない**:

```
外側: MODIFIER_PLAYER_CITIES_ATTACH_MODIFIER (Subject=City) が内側のModifierを自国の全都市にのみ付与
内側: MODIFIER_CITY_PLOT_YIELDS_ADJUST_PLOT_YIELD (Subject=Plot)
      + SubjectRequirementSetId で REQUIREMENT_PLOT_IMPROVED_RESOURCE_CLASS_TYPE_MATCHES を使い、
        ResourceClassType引数(RESOURCECLASS_BONUS/STRATEGIC/LUXURY)で絞り込む
        (資源クラス一致+正しい改善が建っていることを1つで判定する。単なるREQUIREMENT_PLOT_RESOURCE_CLASS_TYPE_MATCHESだと
        未改善・未発見のタイルにも一見空き地なのに効果が出てしまうので使わないこと)
```

**罠1(2026-09-20実機バグ報告で発覚・修正済み)**: Religious Idols本体(`Base/Assets/Gameplay/Data/Beliefs.xml`)は外側ModifierTypeに`MODIFIER_ALL_CITIES_ATTACH_MODIFIER`(`CollectionType=COLLECTION_ALL_CITIES`、Base/Assets/Gameplay/Data/Modifiers.xml)を使っている。これは名前に反して**ゲーム内の全プレイヤーの全都市が対象**で、Owner絞り込みは一切暗黙で行われない。信仰ベリーフはそもそも「そのベリーフの宗教が多数派の都市ならどの文明でも効く」のが仕様なので絞り込み無しで正しいが、**文明固有Trait(自国限定であるべき)にそのまま流用すると敵文明の都市にも波及するバグになる**。自国の都市だけに絞るには、代わりに`MODIFIER_PLAYER_CITIES_ATTACH_MODIFIER`(`CollectionType=COLLECTION_PLAYER_CITIES`)を使う。この使い分けは公式データでも確認できる(Toqui/Mapuche文明トレイト、`DLC/Expansion1/Data/Expansion1_Civilizations_Major.xml`がこちらを使用)。

**罠2(同日発覚、2段階で修正)**: `REQUIREMENT_PLOT_RESOURCE_CLASS_TYPE_MATCHES`は資源クラスの一致しか見ておらず、「改善(施設)を建てて開発しないと効果が出ない」ようにしたくても、未改善・未発見のタイル(一見空き地)にも効果が出てしまう。当初は戦略資源限定で`REQUIREMENT_PLOT_RESOURCE_VISIBLE`(公式の`PLOT_HAS_STRATEGIC_MINE_REQUIREMENTS`に準拠、可視性のみ判定)を追加したが、その後「未開発タイルには一切効果を出したくない(施設そのものにボーナスをつけたくもない)」という要望を受けて`REQUIREMENT_PLOT_IMPROVED_RESOURCE_CLASS_TYPE_MATCHES`(資源クラス一致+改善済みを1つで判定、Catherine de Medici指導者固有能力`RESOURCECLASS_LUXURY`・Gathering Storm信仰"Work Ethic"`RESOURCECLASS_STRATEGIC`で実例確認)へ置き換えた。改善済みなら発見済みでもあるため可視性チェックは不要になり削除した(Gathering Stormの`PLOT_HAS_STRATEGIC_IMPROVED_REQUIREMENTS`もこのRequirement単体で構成)。**資源クラスとの一致が前提条件として残るため、無関係な地形に改善を建てただけ(例: 資源なし丘陵+鉱山)では発火しない。**

**要実機確認(2026-09-20時点未検証)**: `REQUIREMENT_PLOT_IMPROVED_RESOURCE_CLASS_TYPE_MATCHES`のデータ上の使用例は2件ともDLC/拡張パック関連ファイルにしかなく、`RESOURCECLASS_BONUS`での使用例も見つかっていない(`RESOURCECLASS_STRATEGIC`/`RESOURCECLASS_LUXURY`のみ確認)。Catherine de Mediciの`.modinfo`は拡張パック無しのロースター(`Players:StandardPlayers`)でも読み込まれる条件になっており、Requirement自体は拡張パック限定ではない可能性が高いが未確定。実機で「拡張パック無しでもエラー無く3クラスとも発動するか」をDatabase.logで確認すること。

**「改善済み」の実機挙動、2パターン確認(2026-09-20)**: 資源タイルの上に何が建っているかで判定が分かれる。
- **都市中心(City Center)の下の資源 → 改善済み扱いにならない**(ボーナス不発火、実機確認済み)。資源タイルに直接都市を建てると資源へのアクセス自体は維持される(Civ6の既知の仕様)が、それとは別に本Requirementの「改善済み」は満たさない
- **区域(District、少なくとも産業区域`DISTRICT_INDUSTRIAL_ZONE`で確認)の下の資源 → 改善済み扱いになる**(ボーナス発火、実機確認済み)

どちらも`Improvement`ではなく`District`という点は同じだが結果が違うため、「`Improvement`オブジェクトの有無」だけでは説明できない(都市中心だけ特別扱いされている可能性が高い)。産業区域以外の区域でも同様かは未検証。カトリーヌ・ド・メディシスの能力も同じRequirementTypeを使うため理屈上は同じ挙動になるはずだが、そちらでの実機確認はしていない。

これは完全にベースゲームの仕組みだけで完結し、拡張パック依存が無い。実例は`XML/Civilizations.xml`(civ6mod-hololive-regloss本体、`TRAIT_CIVILIZATION_REGLOSS_ICHIJOU`)を参照。当初は`XML/Leaders.xml`のLeaderTraitとして実装していたが、2026-09-19にCivilizationTraitへ移設した。

## 実機確認済みパターン: ユニークアジェンダ(HistoricalAgenda)の好み/嫌い

カスタムAgendaで好み/嫌いを実装する場合、バニラの専用ハードコードModifierType(例: `MODIFIER_PLAYER_DIPLOMACY_AGENDA_SHORT_LIFE_GLORY`)はModから新規追加できない。代わりに汎用の`MODIFIER_PLAYER_DIPLOMACY_SIMPLE_MODIFIER`を使う。共通構造(1vs1決闘モードで実機動作確認済み、2026-09-20、`AGENDA_REGLOSS_ICHIJOU_RIRIKA`):

```
Agendas → AgendaTraits → HistoricalAgendas でLeaderTypeにAgendaTypeを紐付け
TraitModifiers で TraitType(Agenda側)→ModifierId
Modifiers: ModifierType=MODIFIER_PLAYER_DIPLOMACY_SIMPLE_MODIFIER
           + OwnerRequirementSetId=ON_TURN_STARTED(毎ターン再評価。バニラのAgenda系Modifier共通の定型)
           + SubjectRequirementSetId で対象を絞り込む(下記2パターン参照)
ModifierArguments: InitialValue(好み=正の値、嫌い=負の値)/StatementKey(外交台詞のLOCキー)/
                    SimpleModifierDescription(Opinion内訳の理由テキストのLOCキー)
```

`SubjectRequirementSetId`は「何を好み/嫌うか」で2系統ある。**両方とも「対象の一般的な状態」ではなく「Owner(このAgendaを持つ文明)との関係」または「対象単体の状態」のどちらを見るかが変わるので、意図に合わせて選ぶこと**:

- **莉々華自身との戦争状態だけを見る**(`REQUIREMENT_PLAYER_AT_WAR_AND_HAS_MET`、Owner-Subjectのペア単位): 好み側はバニラの既存RequirementSet「`PLAYER_IS_KNOWN_MAJOR_CIV_AT_WAR`」をそのまま再利用可能(中身はInverse=trueの`REQUIREMENT_PLAYER_AT_WAR_AND_HAS_MET`を含み、実質「既知の大国・`REQUIRES_MET_10_TURNS_AGO`(10ターン以上前に接触済み)・自分と戦争状態にない」の意)。ただしこの組み合わせ自体はバニラでは`AGENDA_MODIFIER_NEVER_AT_WAR`としてコメントアウトされたまま未出荷(死んだデータ)。**都市国家への攻撃や他文明同士の戦争はここではノーカン**(Owner自身と交戦しているかどうかしか見ない)
- **一般的な好戦性(都市国家攻撃含む)を見る**(`REQUIREMENT_PLAYER_IS_NOT_WARMONGER`、対象単体のWarmongerペナルティ状態): アレクサンドロス3世の本物の`AGENDA_SHORT_LIFE_GLORY`(「マケドニア以外の大国と戦争状態にある文明を好む」)もこちらの精神に近い(ただし実体は専用ハードコード)。好み側はバニラの既存RequirementSet「`PLAYER_NOT_WARMONGER_SUBJECT`」を再利用可能(`TRAIT_AGENDA_PEACEKEEPER`というRandom Agendaで実際に使われている生きたデータ)。嫌い側の対になる`PLAYER_IS_WARMONGER_SUBJECT`はバニラの`AGENDA_MODIFIER_WARMONGER`が参照しているのにRequirementSetRequirementsの定義が丸ごと存在しない(2026-09-20確認、Expansion1/2にも無い、バニラ側の未完成データの疑い)ため、中身を信用せず自前でInverse版を定義する必要がある

どちらのパターンでも、嫌い側(Inverseを外した対になるRequirementSet)は自前で定義することになる場合が多い。実例は`XML/Leaders.xml`を参照(現行実装はWarmonger方式)。

**罠(必須)**: 上記の`ModifierArguments`だけでは、Opinion内訳の理由テキストが「理由不明」にフォールバックする。`ModifierStrings`に`Context="Sample"`・`Text="LOC_TOOLTIP_SAMPLE_DIPLOMACY_ALL"`(実体は`{diplomaticReason}`というプレースホルダー)の行を**各ModifierIdごとに追加**しないと、`SimpleModifierDescription`の値自体はDB上に存在してもUIが表示できない。バニラの全Agenda系Modifierはこの行を必ずセットで持っているので、DIPLOMACY_MODIFIER系のModifierを書くときは`TraitModifiers`/`Modifiers`/`ModifierArguments`に加えて`ModifierStrings`も忘れずに書くこと(2026-09-20実機で確認・修正済み)。

自分自身(Owner)は`REQUIRES_MAJOR_CIV_OPPONENT`を満たせないため、Subject候補には数えられるがカウントには入らない(1vs1なら「対象1件」が自動的に相手プレイヤーになる)。**このAgendaはAIが操作している時だけ機能する**(人間が操作する文明自身のAgendaは、他者からの評価に一切使われない。外交画面の「相手が自分をどう思っているか」は常に相手側=AIのDiplomaticAIが自分のAgendaを使って計算するもので、人間側のAgendaが誰かの意見として表示される画面は存在しない)。

デバッグにはFireTuner(`leader-bootstrap/references/firetuner.md`参照)の`Diplomacy.ltp`パネルが有効。`GameEffects.GetModifiers()`でModifierインスタンスのOwner/Subject数(`# Subjects/Tracked`)/Activeを直接見られるので、Opinion画面に反映される前に「そもそも発火しているか」を切り分けられる。

## 文明能力/指導者能力の説明文を書くときのスタイル

新しいTraitの説明文(`_NAME`/`_DESCRIPTION`)を日本語で書く前に、`references/ability-text-style.md`を読むこと。公式Trait説明文422件(バニラ〜Leader Pass、全DLC)をen_US/ja_JP対訳でリリース時期別に調査した結果、**半角/全角のルール、`[ICON_XXX] 効果+数値`の詰め方、鉤括弧「」を付ける固有名詞の範囲**などは時期を問わずほぼ完全に一貫している(逸脱は単発のtypoのみ)。似た効果の公式Traitを探してテンプレとして数値だけ差し替えるのが最短ルートで、これは公式自身も`_EXPANSION1`/`_EXPANSION2`サフィックス違いのTraitで多用している手法。

## civ6wiki.info要約: Trait/Modifierの基本構造、文明カラー・AIの好み、多言語化

まだ着手していないTrait実装パターンに手を付けるときは、先に`references/trait-and-identity-patterns.md`を読むこと。文明特性・指導者特性のXML構造(`TraitModifiers`→`Modifiers`→`ModifierArguments`、地形条件の`RequirementSets`系)、文明カラー(`Colors`/`PlayerColors`)、AIの好み(`AiListTypes`/`AiLists`/`AiFavoredItems`)、多言語対応(`LocalizedText`への変換手順)、Civilopedia/都市名ランダム化などの細部調整をciv6wiki.info(2017〜2020年執筆、SDKサンプルを素材にした写経チュートリアル)から要約してある。**このリポジトリで実機確認した事実ではない**ので、上記2節の実機確認済みパターンと矛盾したらそちらを優先する。

**断片情報から仮説を積み上げがちな調査が必要になったら、先に`civ6-mod-research` Skillに従って一次情報を洗うこと。**
