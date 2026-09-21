---
name: add-unique-content
description: Civ6 Modで固有ユニット/区域/施設/建造物(UU/UD/UI/UB)を追加する時に使う。「ユニークユニットを追加する」「固有区域を作る」「固有施設・改善を実装する」「固有建造物を実装する」と言われたとき、または`UnitReplaces`/`DistrictReplaces`等の置換要素を新規に書く場面で使う。bootstrap-leaderで指導者が選択画面に出るところまで終わった後に使う。
---

# 固有ユニット・区域・施設・建造物(UU/UD/UI/UB)の実装

一条莉々華Mod(civ6mod-hololive-regloss)で着手済み(UU「社員」、労働者UNIT_BUILDER置換、2026-09-22実機確認)。UD/UI/UBは依然未検証(civ6wiki.infoの未検証要約しか材料が無いため)なので、それらに着手するときは`docs/civ6-research/unique-content-patterns.md`(civ6wiki.info要約、2017〜2022年執筆、SDKサンプル`LEADER_JASPER_KITTY`/`CIVILIZATION_FELINE`を素材にした写経チュートリアル)を先に読むこと。実装しながら食い違いが見つかったら実機での挙動を優先し、**確認できたパターンをこのSKILL.mdに直接書き足していく**(このSkillは着手後、`make-fallback-portrait`のような実機確認済みの「作る手順」Skillへ育てていく前提)。`bootstrap-leader`/`make-leader-icons`双方とも整合を取ること。

## 要点だけ先に(UD/UI/UBは未検証)

UU(ユニット)/UD(区域)/UI(地形改善)/UB(建造物)は全て同じ8手順(性能定義→Trait紐付け→Config登録→テキスト→Property登録→アイコン→Artdef→ビルド)。既存のバニラ要素をコピーして値を差し替えるのが基本で、ゼロから書き起こさない。詳細は`docs/civ6-research/unique-content-patterns.md`。

## UU実装で実機確認済みの落とし穴(2026-09-22、UU「社員」実装時)

いずれも「一見動きそうに見えて、実機でしか気づけない」種類の不具合だったので、次にUUを作るときは着手前に目を通すこと。

1. **UU専用のTraitTypeを新設すること。文明本体のTraitTypeを使い回すと文明能力の表示が消える。** UnitsテーブルのRowに`TraitType`属性でUUを文明に紐づけるが、ここに文明本体のTrait(Modifier群を持つ既存のCivilizationTrait)をそのまま指定すると、ローディング画面・外交交渉画面のプレイヤー情報パネルから**Civilization Ability(文明能力)の項目自体が丸ごと消える**不具合を実機で確認した。バニラは全UU(`UNIT_GREEK_HOPLITE`等、80件近く実機ファイルで確認)で例外なく`TRAIT_CIVILIZATION_UNIT_<UU名>`という専用の別Traitを新設し、`Types`(`Kind="KIND_TRAIT"`)→`Traits`(`Name`のみ、`Description`は無し)→`CivilizationTraits`(同じCivilizationTypeに文明本体Traitと並べてもう1行追加)の3テーブルに登録している。これに倣うこと。
2. **Config.xmlのPlayerItems登録を忘れない。Units.xml側の実装だけでは選択画面の固有要素一覧に出てこない。** `UnitReplaces`等でゲームプレイ側を実装しても、文明選択画面/ローディング画面の「この文明の固有要素」アイコン一覧には自動的に反映されない。別途`Config.xml`(`.modinfo`の`FrontEndActions`側)に`PlayerItems`テーブルを登録する必要がある。`Domain`列でルールセットごと(`Players:StandardPlayers`/`Players:Expansion1_Players`/`Players:Expansion2_Players`)に行が要る(`Players`テーブルの既存パターンと同じ)。列は`CivilizationType`/`LeaderType`/`Type`(UnitType等)/`Icon`/`Name`/`Description`/`SortIndex`。スキーマ・実例はDLC `GreatBuilders/Data/GreatBuilders_ConfigData_Byzantium.xml`の`PlayerItems`で確認済み。
3. **拡張パック限定のスキーマ拡張列を、Modの依存関係だけを根拠に安易に使わない。** `.modinfo`の`<Dependencies>`がGathering Storm等を要求していても、それは「実際にプレイ中の全ゲームでその拡張のルールが有効」を意味しない(Standard/Rise and Fallルールでもこのモッドはロードされる)。拡張限定のスキーマ拡張列(例: `CanFormMilitaryFormation`、`Expansion2_Schema.sql`由来。`01_GameplaySchema.sql`のBase列かどうかは`Schema/*.sql`のCREATE TABLE文で確認できる)をUnits本体行に含めると、非対応ルールセットで`table Units has no column named ...`のエラーとともにUnitsのINSERT自体が失敗し、`UnitAiInfos`等の外部キー参照が連鎖的に壊れて**ゲームが起動不能になる**。バニラと完全一致させたい誘惑があっても、Base Schemaの列だけで組む方が安全。
4. **民生ユニット(Builder/Settler/Trader/Missionary)を置換するUUの公式前例はバニラ・全DLCに一件も存在しない**(2026-09-22、実機ファイル全数検索で確認)。実装自体はスキーマ上可能だが、前例が無い分、置換元に紐づく`TypeTags`(例: `CLASS_LANDCIVILIAN`/`CLASS_BUILDER`)・`UnitAiInfos`(例: `UNITAI_BUILD`)等の補助テーブル行を漏れなく一式コピーする必要がある。
5. **`BuildCharges`/`CostProgressionModel`はUnitsテーブルの単純な列で、Modifier/GameEffectは不要。** `CostProgressionModel`を省略するとスキーマ上のデフォルト`NO_COST_PROGRESSION`になり、同じユニットを何体作ってもコストが上がらない(バニラBuilderは`COST_PROGRESSION_PREVIOUS_COPIES`で複数体生産ごとにコストが上昇する挙動を持つ)。

⚠️ **UB(ユニーク建造物)は2つの既知の罠がある(いずれも未検証、wiki記載のまま)**:
1. Wiki記載のBuildings/Landmarks artdefサンプルは2017年当時のものであり、その後のアップデートで仕様変更が入ったため現在は動作しない、と著者自身が明記している。Artdefが必要になったら、Wikiのサンプルを写経せずSteam Workshopの実働Modを解析すること(`research-mod` Skillの優先順位2〜3節と同じ結論)
2. SDKサンプル同梱の`BUILDING_LITTER_BOX`(ユニーク建造物)は、これがある都市が陥落する(占領/被占領いずれも)と**Civ6が強制終了する**既知の不具合があり、著者は自作の改変建造物でも同じ事象を確認したと報告している。回避策はモニュメント等の**文明非依存の共通建造物の置換**として実装すること(文明固有のユニーク建造物にしない)

アイコンの新規作成が必要な場合は`make-leader-icons` Skillを使う。既存アイコンの使い回しで済ませる場合の手順は`docs/civ6-research/unique-content-patterns.md`に書いてある。

**断片情報から仮説を積み上げがちな調査が必要になったら、先に`research-mod` Skillに従って一次情報を洗うこと。**
