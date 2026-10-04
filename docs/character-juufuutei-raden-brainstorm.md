# 儒烏風亭らでん ブレインストーミング資料

> 目的: 儒烏風亭らでんの指導者設計(`docs/design.md`の「儒烏風亭らでん」節)のための素材集。**決定事項ではない**。AIの提案は「案」と明記する(`.claude/rules/documentation.md`)。
> 取得日: 2026-10-04。キャラクター側は非公式wiki(ホロライブ非公式wiki「儒烏風亭らでん」、最終更新2026-09-08)をcurlで生HTML取得しEUC-JPからデコードして読んだ(要約ツール不使用)。Civ6側はインストール済みゲーム本体の`Base/Assets/Gameplay/Data/*.xml`を直接読んだ。
> wikiは非公式で更新日付き・編集可能な二次情報。公式情報は「公式紹介文」として引用されている部分のみ公式由来。

## 1. 本人から出ている方針(2026-10-04)

- 文化勝利狙い(当然)
- 金欠キャラなので、金と引き換えに強烈なバフ
- 全般バフではなく、**大芸術家が生産するカテゴリ+遺物+秘宝**に絞る案(物)
- 書物は対象に入れない(本人: 「書物まで入れるとちょっと幅が広がりすぎる」、2026-10-04)
- ポムポムプリン等の版権要素は入れない(本人、2026-10-04)
- 産出は**傑作1つにつき食料+2・生産力+2・信仰力+2**(本人、2026-10-04)。対象は上記の絞り込み(美術4種+遺物+秘宝)。ゴールドは含めない(コンゴ「ンキシ」のゴールド+4・信仰力+1とは別の振り方。ゴールドを入れないのは本人の明言ではなく、本人の産出指定に含まれていないという事実のみ)
- 購入割引を半額にするのは「なんか違う」(本人、2026-10-04)。代わりに**芸術によるバフ自体を強烈にする**方向(本人)。購入割引を全く入れないかは未確定
- **傑作の文化力+2を採用**(本人、2026-10-04)。これで産出は**傑作1つにつき食料+2・生産力+2・信仰力+2・文化力+2の4種**(コンゴ「ンキシ」も産出4種なので揃える)。**観光力のバフは入れない**(本人: 怖い)。これ以上は新しい効果を足さず、数値の調整だけにする(本人: UI上はみ出るかもしれないため)。らでんは音楽と関係しないため、holoxの沙花叉クロヱ(傑作(音楽)の文化力+2・観光力+50%)をそのままの基準にはしない
- **金欠を明示的なコストとして作らない**(本人、2026-10-04: 「金欠要素というより、自然と金欠になっていくメカニズムを作った」ので、コスト設計の課題は解決済み)。強い芸術バフに引かれて、美術館・考古学博物館(各290)、考古学者(400)、大芸術家のゴールド購入にゴールドを注ぎ込む流れ自体が金欠の仕組みになる。上の「コスト案」「残高条件」の節は、採用しなかった検討記録として残す
- **美術館・考古学博物館のスロットは増やさない**(本人、2026-10-04: セットボーナス(テーマ化)があるため)。代わりに**宮殿と同じ種類のスロット(`GREATWORKSLOT_PALACE`、秘宝以外なら何でも置ける)を増やす**(本人: 「なんでもおけるスロットなら序盤でも置ける」)。置き場所は**固有建造物「寄席」(円形劇場の置換)**(本人: 「UBのつもり」)。円形劇場の書物スロットの代わりに宮殿タイプのスロットを持たせ、大著述家ポイントの代わりに**大芸術家ポイントを加算**する方向(本人)。**スロットは2つ**(本人、2026-10-04。当初は「万能スロットだし1つでいい」としたが、劇場広場の区域が大著述家ポイントを持ち続けるため大著述家が生まれる可能性があり、その書物の置き場が足りなくなるので2つに変更。元の書物スロット数と同じ)。大芸術家ポイントは**円形劇場の大著述家ポイントと同じ点数に合わせる**(本人、2026-10-04。データ上の点数は1で、本人の記憶の2とは食い違う。下の4b章参照)
- **指導者能力は大芸術家ポイントの増加**(本人、2026-10-04)。**+2**(本人: 「大芸術家ポイント+2でいいでしょう」)。ホロライブModの前例は「異界のラッパー」の大音楽家ポイント+2。形(全体に毎ターン加算か、区域単位か)は`MODIFIER_PLAYER_ADJUST_GREAT_PERSON_POINTS`(`Amount`・`GreatPersonClassType`)なら全体加算の想定。**案4(自然遺産を発見するたびに遺物を獲得)も採用**(本人。置き場所は**指導者能力**に決定(本人OK、2026-10-04。ンキシ相当の産出4種は文明能力、大芸術家ポイント+2と案4は指導者能力))
- 美術館と考古学博物館は**どちらかを軸にせず、両方を主役にする**(本人、2026-10-04)。両方の主役化の実現方法は3章「美術館と考古学博物館の排他」参照

## 2. キャラクター素材(wiki記載)

### 公式紹介文(wiki引用)

> 「ちょいと一席付き合ってみませんか？」伝統と革新に身を包み、落語家に浪漫を抱くおばあちゃん子。新旧和洋を問わず文化・芸能を愛しており、**美術館通いの結果、金欠気味の日々を過ごしている。決してお酒の買いすぎが原因ではない。** 落語と出会ってからはより話すことが好きになり、噺作りにも挑戦中。

### 基本プロフィール

| 項目 | 内容 |
| --- | --- |
| 読み | じゅうふうてい らでん |
| 所属 | ReGLOSS(hololive DEV_IS) |
| 出身 | 福岡県(wiki本文より。鹿児島にも住んでいた。祖母は鹿児島方面出身) |
| 誕生日/初配信 | 2月4日 / 2023年9月10日 |
| 資格・経歴 | **学芸員の国家資格**、美術館でのアルバイト・ボランティア解説員経験、一時期は現代アートのアーティスト、元々は写真、塾講師3年、居酒屋バイト、モデルのバイト。落語は修行中(前座見習い) |
| 自己紹介 | 「ReGLOSSは神出鬼没のミュージアムプリンセス担当、儒烏風亭一門は前座見習い」(2025年秋〜冬から。旧: 賑やかし・ネタ枠担当) |
| コールアンドレスポンス | (先)神出鬼没のミュージアムプリンセスといえばっ?(後)らでんっ!! |
| 好きな噺 | 転失気、芝浜、青菜 |
| 好きなもの | 日本酒(アルコールは大体好き)、キノコ類、そば、プリン、読書、旅行、美術館巡り、演劇・能、ポムポムプリン(自宅に大小合わせて約90体)、次元大介 |
| 苦手 | 歌(苦手意識)、生クリーム、絶叫系・乗り物酔い、血圧測定。**ゲームは最弱クラス**(3D酔いもあり) |
| 初配信 | 能面をかぶったまま、30分中28分を酒・たばこ・くしゃみ・大和絵で使い切った |
| 自称 | 「酒カス・ヤニカス・スロカスのカスの大三元」(活動初期)。のちに実は常識人・知識人として定着 |

### 文化・芸術まわりの実績(Civ6テーマに直結しそうなもの)

- 美術館の実務に詳しい。どうぶつの森のつねきち(美術品の鑑定)をカンニングなしでほぼ全て成功させた
- 複数の美術館公式とのコラボ・案件配信。美術館の公式アカウントがファンに混じりコメントやスパチャを飛ばす
- 2024-07 箱根ガラスの森美術館 特別企画展「香りの装い」音声ガイド
- 2026-05-20 **ロンドン ナショナル・ギャラリー**とのコラボ《儒烏風亭らでんの瞳に映る世界の名画 —— A Shared Art Journey》(グッズ予約・音声ガイド動画)
- 2025-06-13 京都大学「メディア文化学」特別講義(大学で講義した最初のホロメン)
- 2025-12-30 オリジナルソング「JAPANの美術史♪お・ぼ・え・ま・SHOW！」、2026-02-05「出囃子ジャポニズム」、2025-08「落噺」
- 2025-12-20 歌ってみた「ピ ピカソ」
- 2026-08-25 Forbes JAPAN 30 UNDER 30 2026 選出
- 予定: 2026-10-06〜11-29 京都国立博物館 特別展「源氏物語 王朝のかがやき」スペシャルサポーター、2027-01-19〜03-14 東京国立博物館(同展)+コラボ
- ゲーム「ピクロス 儒烏風亭らでんがご案内！ピクセルミュージアム」(2025-06-05リリース、DLC『箱根探訪編』予定)
- 「書庫らでん」(推薦図書の感想コーナー)、人文系アカデミックな本を多く紹介
- 学術系VTuberとの交流が多い。ときのそら(音大卒)と「そらでん」(美術館・観劇・旅行)
- 注: wikiに明記は無いが、**金欠と美術館通い・お酒がセット**で語られている(公式紹介文)

### ネタ・モチーフ候補

- **まいたけダンス**(2024-05-29、ネットミーム化、1000万再生超、キノコ曲シリーズ)
- 能面、出囃子、大和絵、噺(落語)、前座見習い、「一席」「おあとがよろしいようで」系の語り(※「おあとが〜」はwikiに記載なし、一般知識)
- ~~ポムポムプリン~~(版権要素のため使わないと本人が決定)
- 「らでんの旅ぷらん」(2026-09-11リリース曲)、旅行好き
- デザイン: カオミン、Live2D: けっふぃー。公式サイトの背景色 `#1c5e4f`、`#3c7c71`(ホロジュール外枠色)=深い緑。推しマーク🐚(wiki表記。環境依存文字)

### 注意(方針メモ)

- 現状のwiki記載の範囲に「大芸術家」「傑作」を連想させる具体的な発言は無い(Civ6との対応づけは全てAIの案)
- 実装時の表記は`.claude/rules/character-names.md`に従い、`Text/ja_JP/Text.xml`の確定表記を確認してから書く

## 3. Civ6側の事実(ゲーム本体のXMLで確認)

### 傑作(Great Work)の種類とベース観光力

`Base/Assets/Gameplay/Data/GreatWorks.xml`。`GreatWorkObjectTypes`は8種、各傑作のベース`Tourism`は以下(同ファイルの`<GreatWorks>`を集計)。

| 種類 | タグ | 個数 | ベース観光力 |
| --- | --- | --- | --- |
| 彫刻 | `GREATWORKOBJECT_SCULPTURE` | 17 | 2 |
| 肖像画 | `GREATWORKOBJECT_PORTRAIT` | 19 | 2 |
| 風景画 | `GREATWORKOBJECT_LANDSCAPE` | 21 | 2 |
| 宗教画 | `GREATWORKOBJECT_RELIGIOUS` | 16 | 2 |
| 書物 | `GREATWORKOBJECT_WRITING` | 54 | 4 |
| 音楽 | `GREATWORKOBJECT_MUSIC` | 35 | 4 |
| 遺物 | `GREATWORKOBJECT_RELIC` | 27 | **8** |
| 秘宝 | `GREATWORKOBJECT_ARTIFACT` | 27 | 3 |

(個数は`GreatWorkObjectType`出現数のgrep結果で、Expansion等のDLCの傑作は含まない。観光力は一部、個別行で値が異なる可能性があり全行の値は未検査。上の表は出現パターンから読み取った代表値)

- 大芸術家(`GREAT_PERSON_CLASS_ARTIST`、区域は劇場広場`DISTRICT_THEATER`)が作る傑作は、個人ごとに彫刻/肖像画/風景画/宗教画のいずれか(例: ドナテッロ=彫刻、クリムト=肖像画と風景画、エル・グレコ=風景画と宗教画)。書物は大著述家、音楽は大音楽家が担当
- **遺物・秘宝は大芸術家が作らない**。傑作の入手経路が別(下記)。「大芸術家が生産するカテゴリ+遺物+秘宝」は、美術4種(彫刻・肖像画・風景画・宗教画)+遺物+秘宝という対象指定になる

### 遺物・秘宝の入手経路(ゲーム本体のデータで確認できた範囲)

- 遺物: 蛮族の集落・部族村(`GOODYHUT_ONE_RELIC`、`MODIFIER_PLAYER_GRANT_RELIC`)、偉人ジャンヌ・ダルク(大将軍、同Modifier)、緊急事態(宗教、`MODIFIER_EMERGENCY_PLAYERS_GRANT_RELIC`)、自然遺産(`MODIFIER_PLAYER_ADJUST_NATURAL_WONDER_RELIC`)、ユニット死亡時(`MODIFIER_PLAYER_UNIT_ADJUST_RELIC_UPON_DEATH`)
- 秘宝: 考古学者による発掘(`BehaviorTrees.xml`に考古学者の挙動あり)、海洋遺物(`CIVIC_EXTRACT_SEA_ARTIFACTS`/`MODIFIER_PLAYER_UNIT_ADJUST_EXTRACT_SEA_ARTIFACTS`)
- **未確認**: 遺物・秘宝の全入手経路の網羅(スパイによる傑作の盗難は既存Mod説明文に「傑作を盗む」の記述あり)。研究時に`research-mod` Skillの優先順位で追加確認すること

### スロット(建造物側)

- 遺物スロット: 神殿1、スタヴ教会1、モン・サン・ミシェル2(`Buildings.xml`)
- 秘宝スロット: 考古学博物館3(`BUILDING_MUSEUM_ARTIFACT`、美術館`BUILDING_MUSEUM_ART`と同時に建てられない相互排他。`Buildings.xml`の`MutuallyExclusiveBuilding`)
- 傑作スロットを足す前例: コンゴ(宮殿+4)、イングランド(秘宝スロット倍増)。`MODIFIER_PLAYER_CITIES_ADJUST_EXTRA_GREAT_WORK_SLOTS`(`docs/civ6-research/vanilla-conventions.md`)

### 秘宝・遺物・彫刻で産出する既存の前例: コンゴ「ンキシ」

- `Base/Assets/Gameplay/Data/Civilizations.xml`の`TRAIT_CIVILIZATION_NKISI`(コンゴ)。`MODIFIER_PLAYER_CITIES_ADJUST_GREATWORK_YIELD`で、**彫刻・秘宝・遺物**それぞれに傑作1つあたり食料+2・生産力+2・ゴールド+4・信仰力+1(宮殿のスロット+4は別Modifier)
- **訂正(2026-10-04、`tools/loc-lookup`で公式説明文を確認)**: ンキシの実際の説明文は、上記の産出に加えて「大著述家・大芸術家・大音楽家・大商人ポイント+50%」「宮殿の傑作スロット5つ」も含む。産出4種(食料+2・生産力+2・信仰力+1・ゴールド+4)は説明文では1つの文にまとめて書かれ、日本語版では`[NEWLINE]`で改行されている。ゴールド+4は別行
- 肖像画・風景画・宗教画は対象外。つまり対象は「彫刻+秘宝+遺物」で、今回の「美術4種+遺物+秘宝」と大きく重なる。差別化(対象に絵画3種を足す、文化力・観光力に振る等)を設計時に意識する必要がある
- この種の産出はXMLのみで実装でき、前例が実在する。引数は`GreatWorkObjectType`/`YieldType`/`YieldChange`
- インストール済みのHolo JP 1〜5期生・るしあModの範囲では、秘宝・遺物の産出能力はXML/SQL内で見つからなかった(`ARTIFACT`のgrepで該当したのは外交台詞テキストのみ。遺物`RELIC`・大芸術家は未検索)
- バニラの他の秘宝関連: 大科学者メアリー・リーキー(秘宝の観光力・科学力)、イングランド(秘宝スロット倍増)

### 「ゴールドを払えばボーナス、無ければボーナス無し」の実現可能性(2026-10-04調査)

本人の希望: ゴールドを支払うとボーナスが出て、ゴールドが無いときはボーナスが付かない。

- **XMLだけでは条件にできない**: Civilization VI Modding Companion 2.0の`Requirements`タブ(約600行)に、所持ゴールド(残高)を見るRequirementは無い。ゴールド絡みは`REQUIREMENT_PLAYER_INCOME_LEAD`/`REQUIREMENT_PLAYER_YIELD_LEAD`(他プレイヤーとの比較)のみ。プレイヤー単位の`Property`を読むRequirementも無い(あるのは`REQUIREMENT_PLOT_PROPERTY_MATCHES`だけ)。`EFFECT_ADJUST_PLAYER_PROPERTY`/`EFFECT_ASSIGN_PLAYER_PROPERTY`は存在するが、読み取り側が無い
- **Luaで可能なこと(ゲーム本体のLuaに実例あり)**: `pPlayer:GetTreasury():GetGoldBalance()`(残高の取得)、`ChangeGoldBalance`(増減、`DLC/AustraliaScenario`)、`GameEvents.PlayerTurnStarted`(ターン開始フック)、`pCity:AttachModifierByID`(都市へのModifier付与、`DLC/BlackDeathScenario`)、`pPlayer:SetProperty`(`BlackDeathScenario`。ただしそのプロパティは本体内部が読むもので、XML側のRequirementから読む使い方ではない)
- **未確認**: Modifierを後から**外す**API、`AttachModifierByID`のプレイヤー単位での動作、`GetNumGreatWorks`相当(傑作数の取得、本体Luaでは見つからず)。実機(FireTuner、`bootstrap-leader/references/firetuner.md`)で確認が要る
- 実現方法の案:
  - 案X(Lua主体): ターン開始時に傑作数×Nのゴールドを引き、残高が足りた場合だけボーナスを成立させる。ボーナスの付与・撤去をModifierのattach/detachで行えるかが鍵
  - 案Y(XMLでボーナス常時ON+Luaでコストだけ徴収): ゴールドが無くてもボーナスが付くので、本人の希望(無ければ付かない)を満たさない
  - 案Z(固有建造物の維持費に寄せる): 固有の美術館/考古学博物館のゴールド維持費を重くし、ボーナスをその建物に紐付ける。XMLだけで済むが、「残高が無いとき」の挙動(維持費を払えない場合のバニラ側の処理)は未調査で、本人の希望そのものではない

### コスト案のバリエーション(AIの案、2026-10-04。Modifier名はゲーム本体のデータで存在確認済み、効果の引数・符号は未検証)

XMLのみで作れる(条件付き発動は不要):
- 購入コスト高: 建造物/ユニット/区画の購入コストを割増(`MODIFIER_PLAYER_CITIES_ADJUST_BUILDING_PURCHASE_COST`、`..._UNIT_PURCHASE_COST`、`..._PLOT_PURCHASE_COST`)。「ゴールドで買う」より「生産力で作る」ほうに誘導される
- 維持費・収入ダウン: ゴールド産出の割合ダウン、または特定の建造物(博物館等)に負のゴールド(`MODIFIER_PLAYER_CITIES_ADJUST_BUILDING_YIELD_CHANGE`、`..._BUILDING_YIELD_MODIFIER`)
- 所持金への作用: `MODIFIER_PLAYER_MULTIPLY_TREASURY`(`Buildings.xml`に使用例あり)、`MODIFIER_PLAYER_ADJUST_GOLD_INTEREST_PERCENT`(金利、符号は未検証)
- ゴールド以外のコスト: 他の産出(科学力・軍事ユニット生産力・戦闘力等)にペナルティを掛けて「分野を絞る代わりに」の形にする
- 傑作そのものの副作用: 傑作周辺の住宅・忠誠心(`MODIFIER_SINGLE_CITY_ADJUST_CITY_HOUSING_FROM_GREAT_WORKS`、`MODIFIER_PLAYER_CITIES_ADJUST_ADJUST_LOYALTY_FROM_GREAT_WORKS_CITIZENS`)の増減

Luaが要る(条件や状態に依存する):
- ターン開始時に傑作数に応じたゴールドを徴収、残高不足でボーナス停止(前節)
- 一定間隔でまとめて払う(「美術展の入場料」「月末に支払い」)
- ゴールドを払って遺物・秘宝・大芸術家ポイントを得る(`MODIFIER_PLAYER_GRANT_RELIC`の発動条件にコスト支払いを繋ぐ)
- ランダムに増減する(Wikiの「スロカス」ネタ。Luaで乱数)

キャラの設定に結びつけた案(Wiki記載の事実に基づく連想):
- 「酒カス」: 高級資源(ワイン等)を持っているとボーナスが増える/減る。資源関連のModifierは別途調査が必要
- 「美術館通い」: 劇場広場の建造物・考古学博物館の購入・維持に重めのコスト
- 「金欠」と「ゲームが苦手」(Wiki記載): 軍事面(戦闘力・ユニット生産)に弱点を持たせる

### 美術館・考古学博物館のゴールド購入(2026-10-04調査)

- バニラの時点で、`BUILDING_MUSEUM_ART`・`BUILDING_MUSEUM_ARTIFACT`はともに`PurchaseYield="YIELD_GOLD"`、コスト290、維持費2(`Buildings.xml`)。ゴールド購入は既に可能
- 建造物ごとに購入コストを個別に変える前例: `MODIFIER_PLAYER_CITIES_ADJUST_BUILDING_PURCHASE_COST`を、小都市国家ヴァレッタ(`Leaders.xml`)が城壁・城郭・星形要塞で別々のModifierとして使用。つまり**この2つの建物だけを対象にした割引(または割増)はXMLだけで作れる**。引数名(建造物の指定)は未確認
- 購入できるのは建物(スロット)であり、傑作そのものではない。ゴールドで傑作(遺物・秘宝・美術)を直接買う仕組みはバニラのModifierに見当たらない(Lua案の領域)

### 購入割引の実現(2026-10-04調査、引数はCompanion 2.0の`Effects`タブとバニラXMLで確認)

- **美術館・考古学博物館の購入割引**: `MODIFIER_PLAYER_CITIES_ADJUST_BUILDING_PURCHASE_COST`(`EFFECT_ADJUST_BUILDING_PURCHASE_COST`、対象クラス`CITIES`)。引数は`BuildingType`と`Amount`のみ。バニラ実例: ヴァレッタの`MINOR_CIV_VALLETTA_PURCHASE_CHEAPER_CASTLE_BONUS`(`BuildingType=BUILDING_CASTLE`、`Amount=50`)。建物ごとに1本ずつ、美術館と考古学博物館で計2本を書く。Amountが割引率(%)を意味するかは名前(`CHEAPER`)とヴァレッタの用途から推測しており、実機での確認が要る
- **大芸術家のゴールド購入(パトロネージ)の割引**: `MODIFIER_PLAYER_ADJUST_GREAT_PERSON_PATRONAGE_DISCOUNT_PERCENT`(`EFFECT_ADJUST_GREAT_PERSON_PATRONAGE_DISCOUNT_PERCENT`、対象クラス`PLAYERS`)。引数は`Amount`と`YieldType`のみ。バニラ実例: 民主主義`DEMOCRACY_PATRONAGE_GOLD_DISCOUNT`(`YIELD_GOLD`、`Amount=50`)、神託所`ORACLE_PATRONAGE_FAITH_DISCOUNT`(`YIELD_FAITH`、`Amount=25`)
- **制約**: パトロネージ割引に偉人の分類を指定する引数は無い。大芸術家だけに絞れず、**全ての偉人(大将軍・大科学者等)のゴールド購入が割引される**。大芸術家だけにしたい場合はLuaが要る可能性があるが、未調査
- 割引が加算か乗算か(民主主義等との重なり方)は未確認

### 考古学者(`UNIT_ARCHAEOLOGIST`)のコスト(2026-10-04調査)

- `Units.xml`: コスト400(生産力)、`PurchaseYield="YIELD_GOLD"`(ゴールドで購入可)、解禁は社会制度`CIVIC_NATURAL_HISTORY`。維持費の記載は同行に無し(未確認)
- 支援枠: 考古学博物館1つにつき1人(`Unit_BuildingPrereqs`の`NumSupported="1"`)。イングランドの「大英博物館」は秘宝スロットを3→6にして2人まで支援
- 割引の手段(どちらも引数は`UnitType`と`Amount`、Companion 2.0の`Effects`タブで確認): ゴールド購入は`MODIFIER_PLAYER_CITIES_ADJUST_UNIT_PURCHASE_COST`、生産コストは`MODIFIER_PLAYER_CITIES_ADJUST_UNIT_PRODUCTION`(どちらもModifier名は`Modifiers.xml`で存在確認済み)。Amountが割引率(%)かの符号・意味は未確認(実機で確認)
- ほぼ確認していないこと: 発掘に要る時間・手数(移動・発掘回数)を縮める手段、遺物・秘宝のスポット(発掘地)の増減

### 美術館と考古学博物館の排他

- `Buildings.xml`の`MutuallyExclusiveBuildings`表に、`BUILDING_MUSEUM_ART`↔`BUILDING_MUSEUM_ARTIFACT`が双方向の2行で登録されている。排他は**建造物タイプ単位のデータ**で、都市ごとに片方しか建てられない
- 両方とも前提は劇場広場の円形劇場(`BuildingPrerequisites`)で、放送センター・映画スタジオは「どちらでも可」(2行とも登録)
- 考古学博物館は考古学者の支援枠に必須(`Units.xml`の`UNIT_ARCHAEOLOGIST`の`PrereqBuilding`)
- 両方を主役にする実現方法(AIの案):
  - 案1: 都市ごとに片方を選ばせる前提で、能力を美術側・秘宝側の両方に掛ける。追加実装は不要。ただし1都市で両方は使えない
  - 案2: 固有建造物で片方を置換し、置換側に排他行を書かない(`add-unique-content`)。1都市に両方建てられるかは、**置換先タイプの排他をエンジンがどう扱うか未確認**(実機で要確認)。置換元のUBは相手側の排他行(`ARTIFACT`→`ART`)の影響を受けるかも未検証
  - 案3: 傑作スロットを増やす(`MODIFIER_PLAYER_CITIES_ADJUST_EXTRA_GREAT_WORK_SLOTS`)で、片方の建物でも両系統が活きるようにする

### 美術の移動ロック(10ターン)

- `Base/Assets/Gameplay/Data/GlobalParameters.xml`の`GREATWORK_ART_LOCK_TIME`=10(全プレイヤー共通のグローバル値)。`Base/Assets/UI/GreatWorksOverview.lua`が参照し、**彫刻・風景画・肖像画・宗教画の4種だけ**を、`GetTurnFromIndex`の記録ターンから10ターン移動不可にしている
- 遺物・書物・音楽にこのロックは無い。秘宝は別ルールで、満杯の考古学博物館同士でしか入れ替えられない(`LOC_GREAT_WORKS_ARTIFACT_LOCKED_FROM_MOVE`)
- 能力でらでんだけ外す手段は、XMLのModifier/Requirementには見当たらない。値を0にするとグローバルなので他文明・AIにも効く。UI Luaの差し替えは他Modと衝突しやすい。**ゲーム本体側(DLL)でも強制しているかは未確認**(読めたのはUI Luaのみ)

### 使えそうなModifier(名前は`Modifiers.xml`/各DLC Modifiersで存在確認済み。引数・DLC対応は未検証)

| やりたいこと | Modifier |
| --- | --- |
| 特定種類の傑作の観光力を増やす | `MODIFIER_PLAYER_ADJUST_GREAT_WORK_OBJECT_TOURISM` |
| 傑作1つあたりの産出(都市単位) | `MODIFIER_SINGLE_CITY_GRANT_YIELD_PER_GREAT_WORK`(大科学者で使用) |
| 傑作スロットを増やす | `MODIFIER_PLAYER_CITIES_ADJUST_EXTRA_GREAT_WORK_SLOTS` |
| 偉人ポイントを増やす | `MODIFIER_PLAYER_ADJUST_GREAT_PERSON_POINTS`、`..._PERCENT`、`MODIFIER_PLAYER_DISTRICTS_ADJUST_GREAT_PERSON_POINTS` |
| 偉人をゴールドで買う値引き | `MODIFIER_PLAYER_ADJUST_GREAT_PERSON_PATRONAGE_DISCOUNT_PERCENT`(建造物・政体に前例) |
| 遺物を直接付与 | `MODIFIER_PLAYER_GRANT_RELIC` |
| 秘宝発掘で時代スコア | `MODIFIER_PLAYER_ADJUST_PLAYER_ERA_SCORE_PER_ARTIFACT_EXTRACTED`(Expansion1) |
| 傑作周辺の都市の忠誠心・住宅・アイデンティティ | `MODIFIER_PLAYER_CITIES_ADJUST_ADJUST_LOYALTY_FROM_GREAT_WORKS_CITIZENS`ほか |
| 偉人獲得ごとの産出 | `MODIFIER_PLAYER_ADJUST_YIELD_MODIFIER_PER_EARNED_GREAT_PERSON` |

### 他のホロライブMod・公式の前例(`docs/civ6-research/existing-trait-catalog.md`より)

- 「魅惑のセレナーデ」: 音楽傑作に文化力+2・観光力+300%。固有施設「セイレーンの岩礁」
- 「異界のラッパー」: 大音楽家ポイント+2、音楽傑作に生産・科学・ゴールド+5、音楽傑作からの観光力+50%
- 「神眼の描き手」(Da Vinciの文脈): 新たな文明と遭遇で大量の大芸術家ポイント、スパイの傑作窃盗に補正
- 「社交的な芸術家」: 傑作に科学力+3、同盟国と交易中は倍
- 「魔界の天才バンパイア」: 傑作スロット多数の建造物は埋まると自動テーマ化
- バニラ: イングランドのヴィクトリア「大英博物館」(考古学博物館の秘宝3→6)、コンゴ「ンキシ」、スウェーデン「ノーベル賞」「北方のミネルヴァ」(自動テーマ化)
- 音楽・書物・秘宝のパターンは既に前例がある。**遺物+秘宝+美術4種を束ねて「芸術家系+遺品系」に絞る設計は、既存カタログに同型の前例が見当たらない**(カタログ全体を精読した結論ではなく、今回確認した範囲)

## 4. ブレスト: 設計の方向性(AIの案、本人未確認)

### 「金と引き換えにバフ」の形

- 案A(定常コスト): 傑作1つあたり毎ターンゴールド-N、または美術館/考古学博物館/劇場広場の維持費増。対象傑作に強い文化力・観光力。※傑作数に比例する負のゴールド直接Modifierは未調査(`MODIFIER_SINGLE_CITY_GRANT_YIELD_PER_GREAT_WORK`の産出にマイナス値を渡せるかが鍵)
- 案B(購入の割増): 偉人・傑作関連の購入コストをゴールドで支払う代わりに割引が大きい(`PATRONAGE_DISCOUNT_PERCENT`)。「借金してでも大芸術家を買う」形
- 案C(ゴールド→傑作の変換): 保有ゴールドを消費して遺物・秘宝を入手。`MODIFIER_PLAYER_GRANT_RELIC`の発動条件にゴールド消費を繋ぐにはLuaが必要になる可能性
- 案D(ゴールド産出を下げる代わりに、傑作由来の産出で補う): 全般の収入を下げ、傑作1つあたり文化・ゴールド等を返す(破綻を防ぐ)
- 案E(貯金が尽きるとデバフ): 低ゴールド時に傑作ボーナスが増える/減る条件(Requirementで所持ゴールドを見られるかは未調査)
- 注意: ゴールドがマイナスになった場合の挙動(ユニット解体・建造物閉鎖)がバニラにある。強烈なコストを設計するなら、破綻が自然な物語になるか、プレイ上のストレスになるかを見極める

### 「物」に絞る方向の素材

- 対象カテゴリ: 彫刻/肖像画/風景画/宗教画+遺物+秘宝。書物は本人が外すと決定。音楽は元々含まれていない(既存音楽Modとの差別化にもなる、AIの所見)
- 観光力ベース値は遺物8が突出(秘宝3、美術2)。遺物を主役にすると効率が高い。ただし遺物は入手経路が限られるため、「遺物を増やす手段」を能力側で用意する必要がある(集落・自然遺産等のModifierは存在するが、継続的な入手の仕組みはLuaが要りそう)
- 「学芸員」の軸: 美術館/考古学博物館の運営、テーマ化(傑作スロットが埋まると得られるテーマボーナス)との相性は良い
- 固有施設案(`add-unique-content`、UB/UD/UI): 美術館または考古学博物館の置換(固有建造物)、劇場広場の置換(固有区域)、改善(`UI`)として「能楽堂/寄席/小屋」等。名称・見た目は未検討。美術館と考古学博物館は排他なので、**どちらを置換するか**で遺物・秘宝・美術のどれが主役かが決まる
- 固有ユニット案: 「前座見習い」(落語の位階。wiki記載の自称)をモチーフにした大芸術家系ユニット、など(AIの連想。要検討)

### 名前・テーマの素材

- 文明名候補の方向(AIの連想、未確認): 寄席/一席/前座/出囃子/ミュージアムプリンセス/宵噺(2026-08発売のコラボ日本酒名)
- アジェンダ(AIの好み)の方向: 美術・文化・知識を好む。金欠・お酒・美術館通い。外交面では、先輩ホロメン(アキ・ローゼンタール最推し、ときのそら)等と絡めた台詞ネタ
- ゲームが苦手という設定と「Civ6」の組み合わせは、台詞(外交)でのネタにできる(例: 3D酔い・最弱)。要検討

## 4b. 固有要素の候補(2026-10-04、AIの案。本人は1〜3のうち「寄席」「学芸員」「指導者能力」を面白いと評価)

文明能力(産出4種×傑作6種)は決定済み。以下は追加する固有要素の検討で、**数値・設計は全て案**。

### 固有建造物「寄席」(円形劇場`BUILDING_AMPHITHEATER`の置換)
- **宮殿タイプのスロット(`GREATWORKSLOT_PALACE`)を宮殿以外の建物が持つバニラ前例**(`Building_GreatWorks`、2026-10-04確認): `BUILDING_GOV_CULTURE`(政府庁舎の文化建物、4スロット)、`BUILDING_APADANA`(ペルシア、2スロット)、`BUILDING_OLD_GOD_OBELISK`(Ethiopia DLC、1スロット)。宮殿の行は`NonUniquePersonYield=1`・`NonUniquePersonTourism=1`付き
- 解禁: 円形劇場は`CIVIC_DRAMA_POETRY`、美術館は`CIVIC_HUMANISM`(`Buildings.xml`)。演劇と詩は古典時代、人文主義はルネサンスの社会制度(ゲーム内の一般知識、データでは未確認)なので、寄席のほうが博物館より早く建つ
- バニラの円形劇場: コスト150、維持費1、文化力+2、書物スロット2、大著述家ポイント1(`Buildings.xml`)。美術館・考古学博物館の前提建物(`BuildingPrerequisites`)
- 前例: マオリの`BUILDING_MARAE`(`Expansion2_Buildings_Major.xml`、`BuildingReplaces`で円形劇場を置換、コスト150のまま、書物スロットなど元の効果を外して差し替え)
- 方針案: 書物スロットを外す(書物は対象外のため)。代わりに大芸術家ポイント(`Building_GreatPersonPoints`に`GREAT_PERSON_CLASS_ARTIST`を足す)や文化力の上乗せ。美術スロットを持たせる案もあるが、美術館以外の建物に美術スロット(`GREATWORKSLOT_ART`)を付けて動くかは未確認
- 未確認: 置換建造物が美術館・考古学博物館の前提を満たすか(マオリは普通に博物館を建てている想定だが、この調査では確認していない)

### 寄席の大芸術家ポイントの点数と、パンテオン「神の光」の影響(2026-10-04調査)

- **円形劇場の大著述家ポイントは1**(`Building_GreatPersonPoints`、`Base/.../Buildings.xml`。拡張パックで書き換える行は見つからなかった)。本人の記憶の「2」は、劇場広場の区域(`District_GreatPersonPoints`で著述家・芸術家・音楽家それぞれ1)と円形劇場(著述家1)を足した、劇場広場全体の著述家ポイント2だった可能性がある(AIの推測)。書物スロット数(2)・文化力(+2)とも一致する。点数を合わせるなら1点
- **劇場広場の区域自体も偉人ポイントを持つ**(`District_GreatPersonPoints`、`Districts.xml`、2026-10-04確認): `DISTRICT_THEATER`は大著述家・大芸術家・大音楽家それぞれ1(ギリシャの`DISTRICT_ACROPOLIS`も同じ3行)。寄席が円形劇場の著述家1を芸術家1に置き換えると、劇場広場の合計は著述家1(区域のみ)・芸術家2(区域1+寄席1)・音楽家1
- **パンテオン「神の光」(`BELIEF_DIVINE_SPARK`、ja_JP「神の光」)**:
  - バニラ: 聖地(預言者)・キャンパス(科学者)・劇場広場(著述家)の区域から偉人ポイント+1(区域単位、建物とは無関係)
  - 嵐の訪れ(Expansion2): 説明文が「聖地(預言者)、図書館のあるキャンパス(科学者)、円形闘技場のある劇場広場(著述家)」に変わり、劇場広場側は`DIVINE_SPARK_WRITER_MODIFIER`が`BUILDING_IS_AMPHITHEATER`(`REQUIREMENT_CITY_HAS_BUILDING`、`BuildingType=BUILDING_AMPHITHEATER`)を条件にした都市の著述家ポイント+1
  - **加算されるのは著述家ポイントで、芸術家ポイントではない**。寄席が大芸術家ポイントを産出しても、神の光で芸術家ポイントが増える相乗効果は無い
  - 寄席が円形劇場として数えられるか(神の光の+1著述家が、寄席の都市で発動するか)は**未確認**。発動しなければ神の光のその分が失われるだけで、発動すれば著述家ポイント+1が付く(どちらも実害は小さい)
- 同種の影響: 政府庁舎の文化建物の効果`GOV_EXTRA_AMPHITHEATER_SLOTS`は`BuildingType=BUILDING_AMPHITHEATER`を指定して円形劇場にスロットを足す(`Expansion1_Buildings.xml`)。寄席が置換元として数えられない場合、この追加スロットも寄席には入らない(未確認)

### 固有ユニット「学芸員」(考古学者`UNIT_ARCHAEOLOGIST`の置換)
- 元ネタ: Wikiの「学芸員の国家資格」。前に出た「考古学者が重い」への回答にもなる
- バニラの考古学者(`Units.xml`): コスト400、`ExtractsArtifacts="true"`、`CLASS_ARCHAEOLOGIST`/`CLASS_LANDCIVILIAN`タグ、特殊能力`ABILITY_ARCHAEOLOGIST_ENTER_FOREIGN_LANDS`はタグ経由で付与、考古学博物館1つにつき1人(`Unit_BuildingPrereqs`の`NumSupported="1"`)、発掘動作は`UNITOPERATION_EXCAVATE`
- ゲーム本体のLuaに`UNIT_ARCHAEOLOGIST`の直書きは見つからなかった(参照はXML/テキストのみ)
- **決定(本人、2026-10-04)**: 学芸員は**移動力+2**(考古学者のBaseMoves 4→6)と**コストの割引**を付ける(「歩くのが大変」)。割引率は未定
- 前例(全UU 41件のコストを置換元と比較、`Units.xml`+DLC、2026-10-04): 置換元と同コスト28・割高9・割安4〜5。割安の例: ズールのインピ125(置換元の63%)、朝鮮のファチャ250(76%)、オスマンのバーバリー・コルセア240(86%)、ドイツのUボート430(90%)、スレイマンのイェニチェリ120(50%)。つまり割安は少数派で、半額は最大級。移動力が増えるUUは5件で、増分は+1が4件・+2が1件(アメリカのP-51、10/8)。移動力+2は前例の上限
- 割引率の案(AIの案): 300(75%、ファチャ並)。購入割引を半額にしないという本人の感覚と揃えるなら75〜80%
- 方針案: 斥候の置換(うに、`UNIT_REGLOSS_ICHIJOU_UNI`)と同じく元ユニットの行をコピーして数値だけ変える。コスト・移動力・支援枠(`NumSupported`を2にする案)など
- **リスク**: バニラに考古学者を置換する文明は無く前例が見つからない。発掘が`ExtractsArtifacts`フラグで成立するかは推測。専用の`Unit_BuildingPrereqs`行が要る。実機で発掘できるか確認が必要

### 指導者能力(数値中心)
- 案1(本人が方針修正): 美術館・考古学博物館のスロット増は不採用(セットボーナスの条件が変わるため)。代わりに宮殿と同種のスロット(`GREATWORKSLOT_PALACE`)を増やす。バニラ実例: コンゴ`TRAIT_EXTRA_PALACE_SLOTS`(`BuildingType=BUILDING_PALACE`、`GreatWorkSlotType=GREATWORKSLOT_PALACE`)。宮殿の元のスロットは1、受け入れる種類は彫刻・肖像画・風景画・宗教画・書物・音楽・遺物(秘宝は不可)。テーマ化の列(`Theming*`)は美術館と考古学博物館の行にあり、宮殿の行には無い(`Buildings.xml`)(`MODIFIER_PLAYER_CITIES_ADJUST_EXTRA_GREAT_WORK_SLOTS`、建物・スロット種別・数を指定。どちらの建物を選んでも活きるので「両方主役」と整合。スロットが増えるほど文明能力の産出が増える)
- 案2: 大芸術家ポイントの増加(`MODIFIER_PLAYER_ADJUST_GREAT_PERSON_POINTS`、`GreatPersonClassType`で分類指定、または`MODIFIER_PLAYER_DISTRICTS_ADJUST_GREAT_PERSON_POINTS`で劇場広場に+N)
- 案3: 偉人を獲得するたびの強化(`MODIFIER_PLAYER_ADJUST_YIELD_MODIFIER_PER_EARNED_GREAT_PERSON`、効果の詳細は未確認)。大芸術家獲得時の社会制度ブーストは`MODIFIER_PLAYER_GRANT_BOOST_WITH_GREAT_PERSON`(引数`GreatPersonClass`/`TechBoost`/`OtherPlayers`、大図書館で使用、挙動は未確認)
- 案4(採用、2026-10-04): 旅行好きに寄せて自然遺産の発見で遺物。**元ネタは都市国家キャンディ(Kandy、`LEADER_MINOR_CIV_KANDY`、宗教系)の宗主国ボーナス**(キャンベラではない)。ja_JP公式説明: 「新しい自然遺産を発見するたびに遺物を獲得し、すべての遺物から信仰力+50%を得る」。実装は`Leaders.xml`の`MINOR_CIV_KANDY_UNIQUE_INFLUENCE_GRANT_BONUS`(`MODIFIER_ALL_PLAYERS_ATTACH_MODIFIER`、条件`PLAYER_IS_SUZERAIN`)が内側の`MINOR_CIV_KANDY_GRANT_RELIC_BONUS`(`MODIFIER_PLAYER_ADJUST_NATURAL_WONDER_RELIC`、`Amount=1`)を宗主国に付与する形。宗主国の条件を外して内側のModifier(同じ型・同じ引数)を指導者/文明のTraitModifiersに直接付ければ流用できる見込み(この方法の実機確認は未)。信仰力+50%の方は`MINOR_CIV_KANDY_BETTER_RELIC_BONUS`(`MODIFIER_PLAYER_CITIES_ADJUST_GREATWORK_YIELD`、遺物×信仰力)で、今回の産出4種と重複するので流用しない想定。遺物1つにつき文明能力の産出(食料+2・生産力+2・信仰力+2・文化力+2)が付くので、遺物の入手経路を増やす意味が大きい。元の記述: (`MODIFIER_PLAYER_ADJUST_NATURAL_WONDER_RELIC`、効果・引数は未確認)

## 5. 本人に確認したい点

1. 「金と引き換え」は**毎ターンの持続コスト**(案A/D)、**購入割引型**(案B)、**消費変換型**(案C)のどれが近いか。ゴールドが赤字になる遊びを許容するか
2. 美術館か考古学博物館のどちらを軸に置くか(排他関係)。遺物・秘宝・美術のどれを主役にするか
3. 遺物・秘宝の入手手段(Lua込み)をどこまで作り込むか
4. ~~書物・音楽の扱い~~ → 書物は外す(本人決定)。音楽は元々の絞り込み案(美術4種+遺物+秘宝)に含まれていない
5. ~~ポムポムプリン等の版権要素~~ → 入れない(本人決定)

## 出典

- ホロライブ非公式wiki「儒烏風亭らでん」: https://seesaawiki.jp/hololivetv/d/%bc%f4%b1%a8%c9%f7%c4%e2%a4%e9%a4%c7%a4%f3 (curl取得、EUC-JPデコード。wiki全文のうち、プロフィール・経歴・自己紹介・○○一覧・性格・美術・歌・ゲーム・ユニットまで精読。末尾の脚注と他メンバー向けのサイドバー部分は未精読)
- Civ6本体: `Base/Assets/Gameplay/Data/GreatWorks.xml`、`GreatPeople.xml`、`GreatPeople_Artists.xml`、`Buildings.xml`、`GoodyHuts.xml`、`Modifiers.xml`、`Civics.xml`、`DLC/Expansion1/Data/*`
- リポジトリ内: `docs/civ6-research/existing-trait-catalog.md`、`docs/civ6-research/vanilla-conventions.md`
