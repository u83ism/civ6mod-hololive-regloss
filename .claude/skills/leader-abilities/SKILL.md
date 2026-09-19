---
name: leader-abilities
description: Civ6 Modで文明能力/指導者能力(Trait)の効果を実装する時に使う。「文明能力を実装する」「指導者特性の効果を書く」「Modifierの書き方」「AIの好みを設定する」「文明カラーを設定する」「能力の説明文を書く」「多言語化する」と言われたとき、または`Traits`/`Modifiers`/`Requirements`系のXMLを新規に書く/`_NAME`・`_DESCRIPTION`のテキストを書く場面で使う。leader-bootstrapで指導者が選択画面に出るところまで終わった後に使う。
---

# 文明能力・指導者能力(Trait)の実装

一条莉々華Mod(civ6mod-hololive-regloss)の実装で確立したパターン集。

## 実機確認済みパターン: 資源クラス別の産出量ボーナス

「所有する資源の数に応じてゴールド等を加算する」系のTraitを作る場合、`MODIFIER_PLAYER_CITIES_ADJUST_RESOURCE_YIELD_BY_COUNT`(エチオピア文明が使用)は資源クラス(ボーナス/戦略/高級)で絞り込めない(SubjectがCity単位でありPlot単位ではないため)。代わりにFiraxis公式の信仰"Religious Idols"と同じ構造を使う:

```
外側: MODIFIER_ALL_CITIES_ATTACH_MODIFIER (Subject=City) が内側のModifierを自国の全都市に付与
内側: MODIFIER_CITY_PLOT_YIELDS_ADJUST_PLOT_YIELD (Subject=Plot)
      + SubjectRequirementSetId で REQUIREMENT_PLOT_RESOURCE_CLASS_TYPE_MATCHES を使い、
        ResourceClassType引数(RESOURCECLASS_BONUS/STRATEGIC/LUXURY)で絞り込む
```

これは完全にベースゲームの仕組みだけで完結し、拡張パック依存が無い。実例は`XML/Leaders.xml`(civ6mod-hololive-regloss本体)を参照。

## 文明能力/指導者能力の説明文を書くときのスタイル

新しいTraitの説明文(`_NAME`/`_DESCRIPTION`)を日本語で書く前に、`references/ability-text-style.md`を読むこと。公式Trait説明文422件(バニラ〜Leader Pass、全DLC)をen_US/ja_JP対訳でリリース時期別に調査した結果、**半角/全角のルール、`[ICON_XXX] 効果+数値`の詰め方、鉤括弧「」を付ける固有名詞の範囲**などは時期を問わずほぼ完全に一貫している(逸脱は単発のtypoのみ)。似た効果の公式Traitを探してテンプレとして数値だけ差し替えるのが最短ルートで、これは公式自身も`_EXPANSION1`/`_EXPANSION2`サフィックス違いのTraitで多用している手法。

## civ6wiki.info要約: Trait/Modifierの基本構造、文明カラー・AIの好み、多言語化

まだ着手していないTrait実装パターンに手を付けるときは、先に`references/trait-and-identity-patterns.md`を読むこと。文明特性・指導者特性のXML構造(`TraitModifiers`→`Modifiers`→`ModifierArguments`、地形条件の`RequirementSets`系)、文明カラー(`Colors`/`PlayerColors`)、AIの好み(`AiListTypes`/`AiLists`/`AiFavoredItems`)、多言語対応(`LocalizedText`への変換手順)、Civilopedia/都市名ランダム化などの細部調整をciv6wiki.info(2017〜2020年執筆、SDKサンプルを素材にした写経チュートリアル)から要約してある。**このリポジトリで実機確認した事実ではない**ので、上記2節の実機確認済みパターンと矛盾したらそちらを優先する。

**断片情報から仮説を積み上げがちな調査が必要になったら、先に`civ6-mod-research` Skillに従って一次情報を洗うこと。**
