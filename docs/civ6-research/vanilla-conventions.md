# Civ6本体の慣習・詳細仕様(ゲーム本体のデータで確認したもの)

> `unique-content-patterns.md`等はWiki要約(未検証)だが、このファイルは**ゲーム本体のデータ(`Base`・`DLC`配下のXML)を直接読んで確認した事実**だけを書く。このModの設計判断(なぜそうしたか)は`docs/design.md`、ここは「公式がどうなっているか」。
> ゲーム本体の場所: `C:\Program Files (x86)\Steam\steamapps\common\Sid Meier's Civilization VI\`

## 固有区域の建設コストは置換元の半額

- 確認日: 2026-10-01。`Base/Assets/Gameplay/Data/Districts.xml`と`DLC/*/Data/*Districts*.xml`の`DistrictReplaces`全ペアのコストを突き合わせた。固有区域18件すべてが置換元のちょうど半額
- 一般の区域は54(水道橋のみ36)、固有区域は27(浴場のみ18)
- 水上ストリートカーニバル(コパカバーナ、ウォーターパーク置換)も54→27。ウォーターパークを置き換える区域の前例
- 由来: 沙花叉クロヱの固有区域がウォーターパークのバニラ値54を写したままリリースされ、利用者から「固有区域は慣習的に半額では」と指摘された。置換元の値を写すときは、固有要素の慣習を先に確認すること
- 未確認: 固有建造物・固有ユニット・固有改善にも同様の「安い」慣習があるか(今回は区域のみ確認した)

## 固有区域の説明文に「安価に建設できる」と書くか

- 確認日: 2026-10-01。`tools/loc-lookup`で固有区域16件の`LOC_DISTRICT_*_DESCRIPTION`(ja/en/zh_Hans/zh_Hant)を確認した
- 半額(27)の12件は、全言語で「置換元に取ってかわる」と同じ文の中で安価さに触れている。日本語の定型は「〜に取ってかわり、より安価に建設できる。」(アクロポリス・浴場・ハンザ・ラヴラ・ヒッポドローム・オッピドゥム・王立海軍造船所・観測所)。コトンは「建設コストも港より低い」、ムバンザは「より初期の段階から、より安価に建設できる」、ベトナムのタインは他の特徴の列挙の中に「より安価に建設できる」
- 例外は記載なし: 水上ストリートカーニバル(27)・イカンダ(27)・ソウォン(27)・スグバ(27、この区域は説明に書く別の特徴が多い)は、半額でも説明文に安さが書かれていない。ストリートカーニバル(陸の方)は「より安価に建設できる」を書いている。つまり公式でも統一されておらず、書くのが多数派だが必須ではない

## 置換した区域は元の区域の設定を自動では引き継がない

- 確認日: 2026-10-01(ゲーム本体のXMLを読んだもので、実機での挙動は未確認)。`DistrictReplaces`は「置換元の代わりに建てる」という対応だけで、置換元に付いた排他(`MutuallyExclusiveDistricts`)や、他の区域が置換元から得る隣接ボーナス(`District_Adjacencies`)は新しい区域に付かない。公式は固有区域ごとに個別の行を書いている
- 排他の例: ヒッポドローム(総合娯楽施設置換)は`DISTRICT_WATER_ENTERTAINMENT_COMPLEX`との排他を両方向で書いている(`DLC/Byzantium_Gaul/Data/Byzantium_Gaul_Expansion1.xml`)。ブラジルの水上ストリートカーニバル(コパカバーナ、ウォーターパーク置換)は、陸のストリートカーニバルとの排他だけを両方向で書き、総合娯楽施設との排他行は無い(`DLC/Expansion1/Data/Expansion1_Districts.xml`の12〜16行目)。置換元が総合娯楽施設と排他でも、書かなければ置換先は共存できる
- 隣接ボーナスの例: ウォーターパークに隣接した劇場広場・アクロポリスの文化力+2は`WaterPark_Culture`(`AdjacentDistrict`=ウォーターパーク)。コパカバーナ用には`Copacabana_Culture`が別に書かれていて、登録先は劇場広場のみ(`DLC/Expansion2/Data/Expansion2_Districts.xml`の74〜93行目)

## 文化爆弾が他国の領土を奪うかは`CaptureOwnedTerritory`で決まる

- 確認日: 2026-10-04。文化爆弾のModifier(`MODIFIER_ALL_PLAYERS_ADD_CULTURE_BOMB_TRIGGER`、`EFFECT_ADD_CULTURE_BOMB_TRIGGER`)の引数`CaptureOwnedTerritory`が、他国の領土のタイルも奪うかを切り替える。`False`なら中立タイルだけ。`True`なら他国の領土も奪う
- バニラで`CaptureOwnedTerritory`を書いているのは、ベトナムDLCの保護区(`MAJOR_PLAYERS_ACTIVATE_PRESERVE_CULTURE_BOMB`、`DLC/KublaiKhan_Vietnam/Data/KublaiKhan_Vietnam_Districts.xml`)とガリアの鉱山(`GAUL_MINE_CULTURE_BOMB`、`DLC/Byzantium_Gaul/Data/Byzantium_Gaul_Civilizations.xml`)の2か所だけで、どちらも`False`。引数を書かない文化爆弾(ポーランドの黄金の自由など)は、他国の領土を奪う(引数省略時の既定)と見られる
- 保護区の説明文は、en_US・zh_Hans_CN・zh_Hant_HKでは「中立」(neutral)と明記しているが、ja_JPだけ「隣接タイルで文化爆弾が発動し」と「中立」を省いている。挙動は他言語と同じ(中立タイルのみ)
- 実機で`True`を明示すれば、他国の領土を奪えることを確認した(下の`docs/implementation-notes.md`参照)

## ウォーターパーク・水族館のバニラ仕様(嵐の訪れ)

- ウォーターパーク: 沿岸タイルかつ陸地隣接(`Coast="true"`/`AdjacentToLand="true"`)、礁には不可、総合娯楽施設と同じ都市に共存不可(`MutuallyExclusiveDistricts`)、人口による区域数上限の対象。快適性+1・アピール+1。劇場広場とアクロポリスがウォーターパーク隣接で文化力+2の隣接ボーナスを得る
- 水族館(`BUILDING_AQUARIUM`): 快適性+1(9タイル以内の都心に及ぶ)、この都市の沿岸資源・沈没船・礁タイル1つにつき科学力+1。後者は`BUILDING_AQUARIUM`に付いたModifierで、ウォーターパーク(区域)側の効果ではない。バニラは科学寄りで文化/音楽とは無関係
- 文明の興亡で追加された区域・施設なので、Standardルールセットには存在しない。`.modinfo`の`Dependencies`で拡張を要求しても、そのルールセットでゲームを始めればModは読み込まれ、置換元が無いまま`DistrictReplaces`等が外部キー制約違反になって起動不能になる(`add-unique-content` Skillの落とし穴3)。文明の興亡のルールセットは水族館のコスト(445、嵐の訪れの`Update`前)なども違う

### 施設の解禁段階

| 段階 | 総合娯楽施設 | ウォーターパーク |
|---|---|---|
| 区域 | 遊びと娯楽(古典時代) | 博物学(産業時代) |
| 1段目 | 闘技場: 遊びと娯楽 | フェリス式観覧車: 博物学 |
| 2段目 | 動物園: 博物学 | 水族館: 博物学(観覧車が前提) |
| 3段目 | スタジアム: プロスポーツ | 水泳施設: プロスポーツ(水族館が前提) |

2・3段目はもともと同時期で、ずれているのは区域と1段目(観覧車)だけ。区域の解禁(`PrereqCivic`)は区域の定義で変えられるが、施設の解禁・前提施設(`BuildingPrereqs`)は建造物側の定義なので、区域の定義からは変えられない(直接書き換えると全プレイヤーに影響する)。区域だけ前倒しすると、施設は元の解禁まで建たない。

## 施設の効果を変えるのにUB化(固有建造物)は必須か

- UB不要(Trait/UD側のModifierで施設を指定して上乗せできる): 傑作スロット追加(`MODIFIER_PLAYER_CITIES_ADJUST_EXTRA_GREAT_WORK_SLOTS`)、産出の加算(`MODIFIER_PLAYER_CITIES_ADJUST_BUILDING_YIELD_CHANGE`)/%増加(`..._BUILDING_YIELD_MODIFIER`)、生産力・購入コスト(`..._BUILDING_PRODUCTION`/`..._BUILDING_PURCHASE_COST`)、住宅(`..._BUILDING_HOUSING`)、区域単位の快適性(`MODIFIER_PLAYER_DISTRICTS_ADJUST_EXTRA_ENTERTAINMENT`)。いずれもゲーム本体の`Modifiers.xml`に実在する
- UB必須(施設そのものの定義): 解禁の社会制度、前提施設(「観覧車の後」を外す等)、基本コスト・維持費・快適性の範囲、施設の固有名
- UB無しの欠点: 上乗せ効果は施設のツールチップに出ない(上乗せ分は文明能力の説明文に書くしかない)
- 置き換え施設で元の効果を外した前例: 温泉(ハンガリー、動物園置換。熱帯雨林・湿原からの科学力を外して快適性・生産力・観光力に差し替え)、マラエ(マオリ、円形闘技場の文化力・書物スロット・大著作家ポイントを全部外す)、HOLOLIVE系ではセイレーンの岩礁(灯台の沿岸食料・住宅・経験値を外して音楽スロット等)、Hakos BaelzのImprovisation Theater(円形闘技場の書物スロットを外す)など

## 深海は仕様上の除外ではない

- 深海が「ありとあらゆるボーナスの対象外」に見えるのは仕様上の除外ではなく、バニラのボーナスの条件が浅瀬しか指定していないだけ(例: 灯台の沿岸食料+1`LIGHTHOUSE_COAST_FOOD`は`REQUIREMENT_PLOT_TERRAIN_TYPE_MATCHES`で`TERRAIN_COAST`のみ)。条件に`TERRAIN_OCEAN`を入れれば深海も普通に対象になる。地形の素の産出は沿岸=食料1+ゴールド1、深海=食料1のみ(`Terrains.xml`)

## 傑作スロットを増やす文明能力の公式の前例

- コンゴ(ンキシ、宮殿の傑作スロット+4、`TRAIT_EXTRA_PALACE_SLOTS`)、イングランド(考古博物館の秘宝スロット倍増、`TRAIT_DOUBLE_ARCHAEOLOGY_SLOTS`)。いずれも`MODIFIER_PLAYER_CITIES_ADJUST_EXTRA_GREAT_WORK_SLOTS`で、引数に建造物・スロット種類・数を指定するだけ

## 傑作・博物館まわりの仕様(2026-10-04、儒烏風亭らでんの設計時に確認)

### 傑作の種類とベース観光力

`GreatWorks.xml`の`GreatWorkObjectTypes`は8種。各傑作の基礎観光力(`Tourism`)は、出現パターンから読み取った代表値(全行の値は未検査)。

| 種類 | タグ | 個数(Base) | 基礎観光力 |
| --- | --- | --- | --- |
| 彫刻 | `GREATWORKOBJECT_SCULPTURE` | 17 | 2 |
| 肖像画 | `GREATWORKOBJECT_PORTRAIT` | 19 | 2 |
| 風景画 | `GREATWORKOBJECT_LANDSCAPE` | 21 | 2 |
| 宗教画 | `GREATWORKOBJECT_RELIGIOUS` | 16 | 2 |
| 書物 | `GREATWORKOBJECT_WRITING` | 54 | 4 |
| 音楽 | `GREATWORKOBJECT_MUSIC` | 35 | 4 |
| 遺物 | `GREATWORKOBJECT_RELIC` | 27 | **8** |
| 秘宝 | `GREATWORKOBJECT_ARTIFACT` | 27 | 3 |

- 大芸術家(`GREAT_PERSON_CLASS_ARTIST`、区域は劇場広場)が作る傑作は、個人ごとに彫刻・肖像画・風景画・宗教画のいずれか(例: ドナテッロは彫刻、クリムトは肖像画と風景画、エル・グレコは風景画と宗教画)。書物は大著述家、音楽は大音楽家。**遺物・秘宝は大芸術家が作らない**
- 大著述家は26人中25人が傑作(書物)を2つずつ持つ(1人だけ1つ)
- 観光力を傑作1つに**固定値で足す**Modifierは無い。倍率の`MODIFIER_PLAYER_ADJUST_GREAT_WORK_OBJECT_TOURISM`(`EFFECT_ADJUST_GREAT_WORK_OBJECT_TOURISM_MODIFIER`、引数`Amount`)だけ。基礎観光力の差で、倍率の効きは種類ごとに大きく変わる(遺物8・秘宝3・美術2)
- 傑作1つあたりの産出: `MODIFIER_PLAYER_CITIES_ADJUST_GREATWORK_YIELD`(`GreatWorkObjectType`・`YieldType`・`YieldChange`。コンゴ「ンキシ」の実例)

### 遺物・秘宝の入手経路(ゲーム本体のデータで確認できた範囲)

- 遺物: 部族の村(`GOODYHUT_ONE_RELIC`、`MODIFIER_PLAYER_GRANT_RELIC`)、偉人ジャンヌ・ダルク(同Modifier)、緊急事態(宗教、`MODIFIER_EMERGENCY_PLAYERS_GRANT_RELIC`)、自然遺産(`MODIFIER_PLAYER_ADJUST_NATURAL_WONDER_RELIC`)、ユニット死亡時(`MODIFIER_PLAYER_UNIT_ADJUST_RELIC_UPON_DEATH`)
- 秘宝: 考古学者の発掘、海洋遺物(`CIVIC_EXTRACT_SEA_ARTIFACTS`)
- 入手経路の網羅は未確認

### 傑作スロットの種類と、建物ごとの割り当て

- スロット種別: `GREATWORKSLOT_ART`・`_ARTIFACT`・`_CATHEDRAL`・`_MUSIC`・`_PALACE`・`_RELIC`・`_WRITING`(`GreatWorks.xml`)
- **宮殿タイプ(`GREATWORKSLOT_PALACE`)は秘宝以外の7種(彫刻・肖像画・風景画・宗教画・書物・音楽・遺物)を置ける**(`GreatWork_ValidSubTypes`)。宮殿は1スロット。宮殿以外でこのタイプを持つ建物: 国立歴史博物館(`BUILDING_GOV_CULTURE`、4スロット)、アパダーナ(`BUILDING_APADANA`、2)、エチオピアDLCのオベリスク(1)
- **テーマ化(セットボーナス)の設定列(`Theming*`)は、美術館と考古博物館の行にだけある**(宮殿の行には無い)。美術館は同じ種類・別々の芸術家、考古博物館は同じ時代・別々の文明の組み合わせ。スロット数を増やすとテーマ化の条件が変わる
- 遺物スロット: 神殿1、スタヴ教会1、モン・サン・ミシェル2。秘宝スロット: 考古博物館3
- 美術館(`BUILDING_MUSEUM_ART`)と考古博物館(`BUILDING_MUSEUM_ARTIFACT`): ともに解禁はヒューマニズム、前提は円形闘技場、購入290ゴールド・維持費2。**`MutuallyExclusiveBuildings`表に双方向で登録されており、同じ都市にはどちらか片方しか建てられない**(建造物タイプ単位のデータ)。放送センター・映画スタジオの前提は、どちらでも可(2行とも登録)
- 美術館・考古博物館とも、大著述家1・大芸術家2のポイント(`Building_GreatPersonPoints`)
- 秘宝は、満杯の考古博物館同士でしか入れ替えられない(`LOC_GREAT_WORKS_ARTIFACT_LOCKED_FROM_MOVE`)

### 美術の移動ロック(10ターン)

- `GlobalParameters.xml`の`GREATWORK_ART_LOCK_TIME`=10。全プレイヤー共通。`GreatWorksOverview.lua`(UI側のLua)が参照し、**彫刻・風景画・肖像画・宗教画の4種だけ**を、記録されたターンから10ターン移動不可にする。遺物・書物・音楽には無い
- 特定の文明だけ解除する手段は、Modifier/Requirementには見当たらない。値を0にするとグローバルで他文明・AIにも効く。UI Luaの差し替えは他Modと衝突しやすい。ゲーム本体側(DLL)でも強制しているかは未確認

### 偉人ポイントを産む建物・区域

- 劇場広場(`DISTRICT_THEATER`)は区域自体が大著述家・大芸術家・大音楽家のポイントを1つずつ持つ(`District_GreatPersonPoints`。ギリシャの`DISTRICT_ACROPOLIS`も同じ3行)
- 円形闘技場(`BUILDING_AMPHITHEATER`)は大著述家1(`Building_GreatPersonPoints`)、コスト150・維持費1・文化力+2・書物スロット2。拡張パックで書き換える行は見つからなかった
- パンテオン「神の光」(`BELIEF_DIVINE_SPARK`): バニラは聖地(預言者)・キャンパス(科学者)・劇場広場(著述家)の区域から偉人ポイント+1。**嵐の訪れ(Expansion2)では、劇場広場側が「円形闘技場のある都市」の条件(`REQUIREMENT_CITY_HAS_BUILDING`、`BuildingType=BUILDING_AMPHITHEATER`)の著述家ポイント+1に変わる**。増えるのは著述家で、芸術家ではない
- 国立歴史博物館の効果`GOV_EXTRA_AMPHITHEATER_SLOTS`は`BuildingType=BUILDING_AMPHITHEATER`を指定して円形闘技場にスロットを足す(`Expansion1_Buildings.xml`)
- 円形闘技場の固有建造物による置換では、マオリの「マラエ」(`BUILDING_MARAE`)が前例(コスト150のまま、元の効果を外して差し替え)。**置換した建物が、元の建物を条件にする効果(神の光・国立歴史博物館・博物館の前提)を満たすかは未確認**

### 購入コストのModifier

- 建造物: `MODIFIER_PLAYER_CITIES_ADJUST_BUILDING_PURCHASE_COST`(`EFFECT_ADJUST_BUILDING_PURCHASE_COST`、引数`BuildingType`・`Amount`)。小都市国家ヴァレッタの城(`Amount=50`)・星形要塞の割引が実例。Amountが割引率かは名前(`CHEAPER`)からの推測で未確認
- ユニット: `MODIFIER_PLAYER_CITIES_ADJUST_UNIT_PURCHASE_COST`(引数`UnitType`・`Amount`)、生産コストは`MODIFIER_PLAYER_CITIES_ADJUST_UNIT_PRODUCTION`(同)
- 偉人のゴールド購入(パトロネージ): `MODIFIER_PLAYER_ADJUST_GREAT_PERSON_PATRONAGE_DISCOUNT_PERCENT`(引数`Amount`・`YieldType`のみ)。民主主義の`DEMOCRACY_PATRONAGE_GOLD_DISCOUNT`(ゴールド、50)、神託所の`ORACLE_PATRONAGE_FAITH_DISCOUNT`(信仰、25)が実例。**偉人の分類を指定する引数が無く、全ての偉人に効く**。他の割引との重なり方(加算か乗算か)は未確認
- ユニットの購入額はゲームがコストから自動計算する。観測値: 生産コスト300(学芸員の暫定値)で1200ゴールド(1生産力あたり4)。`GlobalParameters.xml`に`GOLD_PURCHASE_MULTIPLIER`=2・`PURCHASE_DIVISOR`=5がある。バニラの考古学者(400)の購入額との比較は未確認

### 考古学者(`UNIT_ARCHAEOLOGIST`)

- コスト400(生産力)、ゴールド購入可、解禁は社会制度「博物学」(`CIVIC_NATURAL_HISTORY`)。`ExtractsArtifacts="true"`、`CLASS_ARCHAEOLOGIST`・`CLASS_LANDCIVILIAN`タグ、特殊能力`ABILITY_ARCHAEOLOGIST_ENTER_FOREIGN_LANDS`(タグ経由で付与)、発掘動作`UNITOPERATION_EXCAVATE`
- 考古博物館1つにつき1人の支援枠(`Unit_BuildingPrereqs`の`NumSupported="1"`)。イングランドの「大英博物館」は秘宝スロットを3→6にして2人まで支援
- ユニットの旗に「拠点都市(Home City)」と「持っている秘宝(Artifact)」が出る(`UnitFlagManager.lua`)。考古学者は拠点都市に結びついている
- ゲーム本体のLuaに`UNIT_ARCHAEOLOGIST`の直書きは見つからない(参照はXML・テキストのみ)

### 固有ユニットのコストと移動力の前例

固有ユニット41件(Base+DLC)を置換元と比較(2026-10-04): 置換元と同コスト28・割高9・割安4〜5。割安の例は、ズールのインピ125(置換元の63%)、朝鮮のファチャ250(76%)、オスマンのバーバリー・コルセア240(86%)、ドイツのUボート430(90%)、スレイマンのイェニチェリ120(50%)。移動力が増えるのは5件で、増分は+1が4件・+2が1件(アメリカのP-51、8→10)。

### 公式の前例: コンゴ「ンキシ」と都市国家キャンディ

- コンゴの文明能力「ンキシ」(`TRAIT_CIVILIZATION_NKISI`): 彫刻・遺物・秘宝それぞれに食料+2・生産力+2・信仰力+1・ゴールド+4(`MODIFIER_PLAYER_CITIES_ADJUST_GREATWORK_YIELD`)。説明文にはこのほか、大著述家・大芸術家・大音楽家・大商人ポイント+50%、宮殿の傑作スロット5つも入る
- 都市国家キャンディ(宗教系、`LEADER_MINOR_CIV_KANDY`)の宗主国ボーナス: 新しい自然遺産を発見するたびに遺物を獲得し、すべての遺物から信仰力+50%。`Leaders.xml`の`MINOR_CIV_KANDY_UNIQUE_INFLUENCE_GRANT_BONUS`(`MODIFIER_ALL_PLAYERS_ATTACH_MODIFIER`、条件`PLAYER_IS_SUZERAIN`)が、内側の`MINOR_CIV_KANDY_GRANT_RELIC_BONUS`(`MODIFIER_PLAYER_ADJUST_NATURAL_WONDER_RELIC`、`Amount=1`)を付与する2段構成。信仰力+50%は別の`MINOR_CIV_KANDY_BETTER_RELIC_BONUS`(`MODIFIER_PLAYER_CITIES_ADJUST_GREATWORK_YIELD`)。**内側のModifierを、宗主国の条件を外して指導者のTraitから直接付ける流用は、実機で動いた**(2026-10-05、儒烏風亭らでんの「芸術への渇望」)
- 自然遺産の「発見」: ゲームは「自分の文明として初めて発見」(`MOMENT_FIND_NATURAL_WONDER`、時代スコア+1)と「世界で初めて発見」(`MOMENT_FIND_NATURAL_WONDER_FIRST_IN_WORLD`、+3)を別に扱い、発見のイベント`NaturalWonderRevealed`も最後の引数`wasFirstToFind`で区別する。他の文明に先に見つけられていても、自分が初めて見つければ発見として扱われる。遺物を与える効果(`EFFECT_ADJUST_NATURAL_WONDER_RELIC`)の判定そのものはゲーム本体のプログラム側で読めず、他の文明に先に発見された遺産でも遺物が入るかは未確認(状況証拠は入る側)。斥候以外(地図の交換・視界の共有)の発見でも成立するかも未確認

### 所持ゴールドを条件にする手段は無い

- Civilization VI Modding Companion 2.0の`Requirements`タブ(約600行)に、所持ゴールドの残高を見るRequirementは無い。ゴールド絡みは他プレイヤーとの比較(`REQUIREMENT_PLAYER_INCOME_LEAD`・`REQUIREMENT_PLAYER_YIELD_LEAD`)だけ。プレイヤー単位のプロパティを読むRequirementも無い(あるのは`REQUIREMENT_PLOT_PROPERTY_MATCHES`だけ。`EFFECT_ASSIGN_PLAYER_PROPERTY`は存在するが読み取り側が無い)
- ゲーム本体のLuaに実例があるAPI: `pPlayer:GetTreasury():GetGoldBalance()`、`ChangeGoldBalance`、`GameEvents.PlayerTurnStarted`、`pCity:AttachModifierByID`、`pPlayer:SetProperty`。**Modifierを後から外すAPIは確認できていない**
- 購入額・維持費に関わる他のModifier: `MODIFIER_PLAYER_MULTIPLY_TREASURY`(`Buildings.xml`に使用例)、`MODIFIER_PLAYER_ADJUST_GOLD_INTEREST_PERCENT`(符号は未検証)、`MODIFIER_PLAYER_CITIES_ADJUST_BUILDING_YIELD_CHANGE`(建物ごとの産出の増減)
