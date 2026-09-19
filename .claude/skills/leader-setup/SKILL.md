---
name: leader-setup
description: Civ6 Modリポジトリ内でCivilization/Leader/Trait本体を実装・デバッグする時に使う。「指導者を実装する」「Config.xmlを書く」「Traitを追加する」「MODが有効化されるのにリーダー選択画面に出てこない」「NOT NULL constraint」「Civ6 modが読み込まれない・反映されない」と言われたとき、または`.modinfo`・`Leaders.xml`・`Civilizations.xml`・`Config.xml`を新規に書く/実機テストする場面で必ず使うこと。mod-setup skillの後段にあたる。
---

# 指導者・文明の実装とデバッグ

一条莉々華Mod(civ6mod-hololive-regloss)の実装で、動くまでに大量の試行錯誤が必要だった。ここに書く内容はすべて**実機で確認済みの事実**。同じ回り道を繰り返さないために、まずここを読んでから書き始めること。

## 1. 命名規則

Neox/Keniisu氏系(HoloEN/HoloID)の実働Modに合わせ、パック名でスコープしたID + テーマ名の文明IDを使う(HktkNban氏系はキャラ名をそのまま文明IDにしているが、文明名をキャラと別ブランドにしたい場合はNeox系の方が合う):

```
CIVILIZATION_REGLOSS_<テーマ名>       (表示名は別途LOCで自由に付けられる)
LEADER_REGLOSS_<キャラ名ローマ字>
TRAIT_LEADER_REGLOSS_<キャラ名ローマ字>
```

ローマ字は本人の公式表記(hololive公式サイト・本人X)を優先するが、他作者Modのように読みやすさ優先で意訳しても構わない(例: 赤井はあとを`AKAI_HEART`にしている前例がある)。

## 2. modinfoのスキーマは絶対にこの形式を使う

`mod-setup` Skillの`template.modinfo`をそのまま使う。**`<ActionGroups><ActionGroup scope="game/shell" criteria="...">`形式は使わないこと。** これはFiraxis公式DLCが使っている一見「新しい・正しそう」な形式だが、実機で試したところ**MODが有効化リストに載り、Mod名解決も正常に動くのに、`<UpdateDatabase>`等の中身が一切トリガーされず、エラーも警告も一切出ない**という壊れ方をした。原因は特定できなかった(GUID差し替え・依存関係追加・ジャンクション排除など複数の仮説を潰したが再現条件は不明)。

動作確認が取れているのは、HktkNban氏・Neox氏の実働Modが両方使っている一段階古い形式: `<ActionCriteria />`(空)+ `<FrontEndActions>`/`<InGameActions>`の直下にアクションを並べる形式。理由が分からなくても、**動作実績のある構造を丸ごと踏襲する**のが最短ルート。

## 3. Config.xmlの`Players`テーブルはほぼ全列NOT NULL

これも試行錯誤で1個ずつ発覚した。Art(Icon/Portrait)が未着手でも、以下の項目**全部**に仮の文字列(実体が無くても良い、表示が空になるだけ)を入れないと、`Database.log`に`NOT NULL constraint failed`が出て**その項目だけ**Playersテーブルへの登録が丸ごと失敗する:

- `CivilizationIcon` / `LeaderIcon`
- `CivilizationAbilityIcon` / `LeaderAbilityIcon`
- `CivilizationAbilityName` / `CivilizationAbilityDescription`(文明固有Traitが未設計でもプレースホルダーLOCキーを用意する)
- `Portrait` / `PortraitBackground`

`assets/Config.xml.template`に全項目埋め済みのテンプレートを置いてあるので、これをコピーして`{{...}}`を置換するだけでこの罠を全部回避できる。`Domain`は`Players:StandardPlayers` / `Players:Expansion1_Players` / `Players:Expansion2_Players`の3つとも登録する(プレイ中のルールセットによって参照先が変わるため)。

## 4. Icon/Portraitのお作法

- **バッジアイコン(Config.xmlの`CivilizationIcon`/`LeaderIcon`等)**: ModBuddy不要。PNGを直接置くだけで動く(DDS変換は現在不要というのがコミュニティの共通見解で、HoloENも実際にPNG参照)。透過PNG、正方形、以下のサイズを用意する:
  - 文明アイコン: 22, 30, 32, 36, 44, 45, 48, 50, 64, 80, 128, 256 px
  - 指導者アイコン: 32, 45, 48, 50, 55, 64, 80, 256 px
  - `IconTextureAtlases`(サイズ毎にFilename指定)+`IconDefinitions`(Index="0")で登録する。実例は`Art/Icons/Icons.xml`(civ6mod-hololive-regloss本体)を参照
- **リーダー選択画面の全身ポートレート(`Portrait`/`PortraitBackground`が指す`IMG_LEADER_..._FOREGROUND/BACKGROUND`)**: 調べた範囲では`ArtDef`+`XLP`(テクスチャアトラス索引)+ModBuddyのAsset Manager経由のコンパイルが必要で、PNG直置きの簡易ルートが見つかっていない。ModBuddyの日本語エンコーディング問題はテキスト・ローカライズファイル絡みなので、**Art資産のコンパイルだけModBuddyを使い、Gameplay/Textデータは手書きのまま**という切り分けも検討の余地あり(未検証)

## 5. 実機デバッグの手順

1. **ログを有効化する**(デフォルト無効): `%LOCALAPPDATA%\Firaxis Games\Sid Meier's Civilization VI\AppOptions.txt`に`LoggingEnabled 1`と書く
2. **ログの出力先は`%LOCALAPPDATA%\Firaxis Games\Sid Meier's Civilization VI\Logs\`**。`Documents\My Games\Sid Meier's Civilization VI\Logs`ではない(READMEや一般的な解説記事はこちらを指していることが多いので注意)
3. **`Modding.log`と`Database.log`の両方を見る。片方にしか出ないエラーがある**:
   - `Modding.log`: どのファイルがいつ読み込まれたか(`UpdateDatabase - Loading ...`、`ModdingUpdateConfigurationDatabase - Loading ...`等)。ここに自分のファイルへの言及が一切無ければ、そもそも適用処理がトリガーされていない(→ 2節のmodinfoスキーマ問題を疑う)
   - `Database.log`: 実際のINSERT/制約エラー(`ERROR: NOT NULL constraint failed: ...`、`ERROR: UNIQUE constraint failed: ...`)。**MODは有効化リストに載るが中身が一切適用されないのに、Modding.logにもDatabase.logにもエラーが出ないケースがある**ことも確認しており、その場合は本当にmodinfoスキーマ(2節)を疑うしかない
4. **症状別の当たりを付ける**:
   - Mod一覧で名前が生LOCキー表示・「(互換性なし)」表示 → `Properties.CompatibleVersions`未設定、または名前をLOCキーにしているのにModinfoトップレベルの`<LocalizedText>`が無い(いっそ`Properties.Name`をリテラル文字列にする方が単純)
   - MODは有効化されるのに指導者選択画面に出ない・`Modding.log`に自分のファイルへの言及が皆無 → 2節のmodinfoスキーマ問題
   - `Database.log`に`NOT NULL constraint failed: Players.X` → `Config.xml`にXフィールドの仮値を追加(3節)。1つ直すとまた次のフィールドで同じエラーが出ることが多いので、`assets/Config.xml.template`を最初から使う方が早い
   - `Database.log`に`UNIQUE constraint failed: LocalizedText...`または`Colors.Type` → 同じText.xml/Colors.xmlを複数箇所(modinfoトップレベルの`<LocalizedText>`と`FrontEndActions`/`InGameActions`の`<UpdateText>`/`<UpdateColors>`)から重複参照していないか確認。XMLのINSERT操作はINSERT OR REPLACEではなく素朴なINSERTなので、同じ(Language,Tag)や同じColor Typeを2回読み込むと2回目が失敗する
5. **変更を加えたら必ずゲームを完全終了→再起動する。** ローカルテストは`mod-setup`Skillの通りジャンクション運用でよい(ジャンクション自体は動作確認済みで無罪。ただしリポジトリ内に`.modinfo`拡張子のファイルを迷子で残すとジャンクション経由で誤って別Modとして読み込まれるので、詳細は`mod-setup`Skill手順6を参照)。Mod一覧画面への再入場だけでは変更が反映されないことがあるので、**modinfoやファイル追加を変更したら必ずゲームを完全終了→再起動**する

## 6. 参考実装パターン: 資源クラス別の産出量ボーナス

「所有する資源の数に応じてゴールド等を加算する」系のTraitを作る場合、`MODIFIER_PLAYER_CITIES_ADJUST_RESOURCE_YIELD_BY_COUNT`(エチオピア文明が使用)は資源クラス(ボーナス/戦略/高級)で絞り込めない(SubjectがCity単位でありPlot単位ではないため)。代わりにFiraxis公式の信仰"Religious Idols"と同じ構造を使う:

```
外側: MODIFIER_ALL_CITIES_ATTACH_MODIFIER (Subject=City) が内側のModifierを自国の全都市に付与
内側: MODIFIER_CITY_PLOT_YIELDS_ADJUST_PLOT_YIELD (Subject=Plot)
      + SubjectRequirementSetId で REQUIREMENT_PLOT_RESOURCE_CLASS_TYPE_MATCHES を使い、
        ResourceClassType引数(RESOURCECLASS_BONUS/STRATEGIC/LUXURY)で絞り込む
```

これは完全にベースゲームの仕組みだけで完結し、拡張パック依存が無い。実例は`XML/Leaders.xml`(civ6mod-hololive-regloss本体)を参照。
