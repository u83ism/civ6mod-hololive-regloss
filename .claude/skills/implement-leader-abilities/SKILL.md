---
name: implement-leader-abilities
description: Civ6 Modで文明能力/指導者能力(Trait)の効果を実装する時に使う。「文明能力を実装する」「指導者特性の効果を書く」「Modifierの書き方」「AIの好みを設定する」「文明カラーを設定する」「ゲームモードで能力を切り替える」と言われたとき、または`Traits`/`Modifiers`/`Requirements`系のXMLを新規に書く場面で使う。説明文(`_NAME`/`_DESCRIPTION`)の文体自体は`write-official-style-text` Skillの範囲(そちらを合わせて使うこと)。bootstrap-leaderで指導者が選択画面に出るところまで終わった後に使う。
---

# 文明能力・指導者能力(Trait)の実装

一条莉々華Mod(civ6mod-hololive-regloss)の実装で確立したパターン集。各パターンの詳細(実機ログ・罠の経緯・未検証事項)は`references/`配下の個別ファイルに置いてあるので、該当する実装に着手する前に読むこと。ここでは各パターンの要点だけを書く。

## 資源クラス別の産出量ボーナス

「所有する資源の数に応じてゴールド等を加算する」系のTraitは、エチオピア方式(`MODIFIER_PLAYER_CITIES_ADJUST_RESOURCE_YIELD_BY_COUNT`)では資源クラスで絞り込めない。代わりに`MODIFIER_PLAYER_CITIES_ATTACH_MODIFIER`(自国限定。信仰"Religious Idols"の`MODIFIER_ALL_CITIES_ATTACH_MODIFIER`をそのまま流用すると敵文明にも波及するバグになるので使わない)+`MODIFIER_CITY_PLOT_YIELDS_ADJUST_PLOT_YIELD`+`REQUIREMENT_PLOT_IMPROVED_RESOURCE_CLASS_TYPE_MATCHES`(資源クラス一致+改善済み判定を1つで行う)の組み合わせで実装する(実機確認済み、2026-09-20)。都市中心の下の資源は「改善済み」扱いにならない一方、区域(産業区域で確認)の下の資源はなる、という非対称な実機挙動も確認済み。

詳細は`references/resource-yield-bonus-pattern.md`を読むこと。実例は`XML/Civilizations.xml`(`TRAIT_CIVILIZATION_REGLOSS_ICHIJOU`)。

## ゲームモードの有無で能力を切り替える

`.modinfo`の`ActionCriteria`+`ConfigurationValueMatches`(`GAMEMODE_XXX`)でモードON時だけ追加XMLを読み込める(実機確認済み、2026-09-20)。Traitの切り替え方は名前が変わるか否かで選ぶ: **名前ごと変わるなら別TraitTypeへ`Delete`+付け替え**(ギルガメシュ/英雄と伝説モード方式)、**名前が同じで中身(Description等)だけ変わるなら`<Traits><Update><Where/><Set>`**(シュメール文明能力「伝説の勇者」/蛮族一族モード方式)。指導者Trait/文明Traitの違いでは決まらない点に注意。

詳細(XML例・使い分けの根拠)は`references/game-mode-switching-pattern.md`を読むこと。実例は`XML/Leaders.xml`+`XML/Leaders_Monopolies.xml`(`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA`、独占/大企業モード)。

## ユニークアジェンダ(HistoricalAgenda)の好み/嫌い

バニラの専用ハードコードModifierType(例: `MODIFIER_PLAYER_DIPLOMACY_AGENDA_SHORT_LIFE_GLORY`)はModから新規追加できないため、汎用`MODIFIER_PLAYER_DIPLOMACY_SIMPLE_MODIFIER`+`SubjectRequirementSetId`で好み/嫌いを組む(1vs1決闘モードで実機動作確認済み、2026-09-20)。`SubjectRequirementSetId`は「Owner自身との関係(例: `REQUIREMENT_PLAYER_AT_WAR_AND_HAS_MET`)」か「対象単体の一般的な状態(例: `REQUIREMENT_PLAYER_IS_NOT_WARMONGER`)」のどちらを見るかで挙動が変わるので、意図に合わせて選ぶこと。**罠(必須)**: `ModifierStrings`に`Context="Sample"`・`Text="LOC_TOOLTIP_SAMPLE_DIPLOMACY_ALL"`を各ModifierIdごとに追加しないと、Opinion内訳の理由テキストが「理由不明」にフォールバックする。

詳細(Requirementの使い分け・デバッグ手順)は`references/agenda-likes-dislikes-pattern.md`を読むこと。実例は`XML/Leaders.xml`。

## civ6wiki.info要約: Trait/Modifierの基本構造、文明カラー・AIの好み、多言語化(未検証)

まだ着手していないTrait実装パターンに手を付けるときは、先に`docs/civ6-research/trait-and-identity-patterns.md`を読むこと。文明特性・指導者特性のXML構造(`TraitModifiers`→`Modifiers`→`ModifierArguments`、地形条件の`RequirementSets`系)、文明カラー(`Colors`/`PlayerColors`)、AIの好み(`AiListTypes`/`AiLists`/`AiFavoredItems`)、多言語対応(`LocalizedText`への変換手順)、Civilopedia/都市名ランダム化などの細部調整をciv6wiki.info(2017〜2020年執筆、SDKサンプルを素材にした写経チュートリアル)から要約してある。**このリポジトリで実機確認した事実ではない**ので、上記の実機確認済みパターンと矛盾したらそちらを優先する。実機確認できたらこのSKILL.mdへ確認済みパターンとして書き足すこと。

## 説明文(`_NAME`/`_DESCRIPTION`)を書くときは

このSkillの範囲外。`write-official-style-text` Skillを使うこと(公式Trait説明文422件の文体調査に基づくスタイルガイド)。

**断片情報から仮説を積み上げがちな調査が必要になったら、先に`research-mod` Skillに従って一次情報を洗うこと。**
