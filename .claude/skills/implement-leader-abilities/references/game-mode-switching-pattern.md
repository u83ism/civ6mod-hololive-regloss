# ゲームモードの有無で能力を切り替える(実機確認済みパターン)

`.modinfo`の`ActionCriteria`に`ConfigurationValueMatches`(`Group=Game`/`ConfigurationId=GAMEMODE_XXX`/`Value=1`)を使うと、特定のゲームモードがON時だけ追加XMLを読み込める(2026-09-20実機ファイルで確認、`DLC/KublaiKhan_Vietnam/KublaiKhan_Vietnam.modinfo`の`Monopolies_Mode`クライテリア)。この基準でTraitのName/Description/効果をモードごとに切り替える方法は、公式データで少なくとも2パターン確認できる。**どちらを使うかは「指導者Traitか文明Traitか」ではなく、名前自体が変わるかどうかで選ぶ**:

## パターンA: 名前ごと別のTraitTypeに切り替える(ギルガメシュ/シュメール指導者能力方式)

英雄と伝説モード(`GAMEMODE_HEROES`)ON時、ギルガメシュの指導者固有能力は名前ごと完全に別物になる(`DLC/Babylon/Data/Babylon_Heroes_MODE.xml`、2026-09-20実機ファイルで確認):

```xml
<Types>
	<Row Type="TRAIT_LEADER_GILGAMESH_HEROES" Kind="KIND_TRAIT"/>
</Types>
<Traits>
	<Delete TraitType="TRAIT_LEADER_ADVENTURES_ENKIDU"/>
	<Row TraitType="TRAIT_LEADER_GILGAMESH_HEROES" Name="..." Description="..."/>
</Traits>
<LeaderTraits>
	<Row LeaderType="LEADER_GILGAMESH" TraitType="TRAIT_LEADER_GILGAMESH_HEROES"/>
</LeaderTraits>
```

既定TraitTypeを`Delete`し、別TraitTypeを新規定義して`LeaderTraits`で付け替える。既定行の`Delete`により、紐づく`LeaderTraits`/`TraitModifiers`等は外部キーのカスケードで自動的に削除される想定(実例でも明示的な`LeaderTraits`側の`Delete`は書かれていない)。効果(Modifier)がモードごとに丸ごと変わる/相互排他な場合はこちらが自然(`TraitModifiers`はTraitType単位で紐づくため)。civ6mod-hololive-regloss本体の実例は`XML/Leaders.xml`+`XML/Leaders_Monopolies.xml`(`TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA`、独占/大企業モード)を参照。

## パターンB: 同じTraitTypeのまま中身だけ差し替える(シュメール文明能力方式)

蛮族一族モード(`GAMEMODE_BARBARIAN_CLANS`)ON時、シュメールの文明能力「伝説の勇者」(`TRAIT_CIVILIZATION_FIRST_CIVILIZATION`)は名前はそのままDescriptionだけ差し替わる(`DLC/BarbarianClansMode/Data/BarbarianClansMode_GameplayData.xml`、2026-09-20実機ファイルで確認、本人指摘で発見):

```xml
<Traits>
	<Update>
		<Where TraitType="TRAIT_CIVILIZATION_FIRST_CIVILIZATION"/>
		<Set>
			<Description>LOC_TRAIT_CIVILIZATION_FIRST_CIVILIZATION_CLANS_MODE_DESCRIPTION</Description>
		</Set>
	</Update>
</Traits>
```

`<Update><Where/><Set>`はSQLのUPDATE文に相当し、TraitType(≒主キー)は変えずに任意の列(Description、理屈上はNameも)だけ別のLOCキーに差し替えられる。Types/LeaderTraitsの追加やDeleteが不要な分、パターンAより軽量。**名前自体は変えず、説明文や細部の効果だけモードで調整したい場合に向く。**

**使い分けの基準**: 名前が変わるならパターンA、名前が同じで中身だけ変わるならパターンB。civ6mod-hololive-regloss本体の指導者固有能力(モードOFF「推し事お疲れ様でした～」/ON「大天才」)は名前ごと変わるためパターンAを採用(2026-09-20、パターンB案も検討した上でギルガメシュ方式の現状維持を本人が選択)。
