# 外交交渉画面の背景・リーダー選択画面の全身ポートレート(いずれも確定、未実機確認)

> このファイルは`.claude/skills/leader-icons/references/loading-and-diplomacy-screen.md`から移動・整理した。**Skillの行動指示ではなく、civ6wiki.info(2017〜2020年執筆)およびSailor Cat's Modding Tutorial(英語)の要約+2026-09-23の一次情報裏取り結果**であるため、実機確認済みの行動指示を書く`.claude/skills/`ではなく`docs/civ6-research/`に置く。**両方とも2026-09-23にXML実装まで完了したが、実機(次回プレイテスト)での見た目確認はまだ**。実機確認が取れたら、確認済みの事実として`make-fallback-portrait` Skill(`references/fallback-and-loading-schema.md`)に書き足すこと(2026-09-23時点で`tools/png2dds/`配下は別セッションがリファクタ中のため、このタイミングでは見送った)。
>
> **教訓**: 同じ調査で`LoadingInfo`のForegroundImage/BackgroundImage画像名・XLP名に関するwiki記載(`hogehoge_LoadingInfo_*`/`UILeaders.xlp`)が架空だったと判明済み(実際は`<LeaderType>_NEUTRAL`/`<LeaderType>_BACKGROUND`、`UI_Leaders.xlp`。詳細は`.claude/skills/make-fallback-portrait/references/fallback-and-loading-schema.md`)。**外交交渉画面の背景・全身ポートレートともこの教訓どおりwiki記載が不正確だったため、2026-09-23にゲーム本体のLua/DBスキーマ/公式DLC実データで裏取りし直し、下記の通り確定した**。

## 外交交渉画面の背景(確定、2026-09-23)

civ6wiki.info(`hogehoge_DiplomacyInfo_Background`単一画像1920x960)ともSailor Cat's Modding Tutorial(`_1`〜`_4`のレイヤー合成、1920x1010)とも異なり、実際にはゲーム本体のコード上両方の仕組みが共存している。ローカルにインストール済みの本体・DLCファイルを直接読んで確認した(`research-mod` Skill 1節の優先順位どおり一次情報で裏取り):

- **スキーマ**(`Base/Assets/Gameplay/Data/Schema/01_GameplaySchema.sql`): `DiplomacyInfo`テーブルは`Type`(PK、LeaderType文字列)と`BackgroundImage`の2列のみ
- **解決ロジック**(`Base/Assets/UI/LeaderScene.lua`の`GenerateLayers()`、実コードを直接読んで確認): `GameInfo.DiplomacyInfo[leaderName].BackgroundImage`が設定されていれば、そのテクスチャ1枚だけを背景として使う。**未設定の場合は`Leaders.SceneLayers`の枚数だけ`<LeaderType(LEADER_プレフィックス除去)>_1`,`_2`...のパララックス層画像を探しにいく。さらに`SceneLayers`が0(=列自体を設定していない場合のデフォルト)だと`CLEOPATRA_1`〜`_4`にフォールバックする**(本Modはこの状態だった。外交交渉画面で違和感なく見えていた「汎用背景」の正体はクレオパトラの交渉背景)
- **公式DLCの実装例**(`DLC/PolandScenario/Data/PolandScenario_DiplomacyInfo.xml`、`DLC/NubiaScenario/Data/NubiaScenario_DiplomacyInfo.xml`): `<DiplomacyInfo><Row Type="LEADER_X" BackgroundImage="任意のテクスチャ名"/></DiplomacyInfo>`という単純なINSERTで動作している。Nubiaの例では`NILE.dds`という同一テクスチャを6人のリーダーで使い回しており、**既存テクスチャの流用は公式にサポートされたパターン**
- **本Mod側の実装**: 新規アート・ArtDef・XLPは一切不要。ローディング画面用に生成済みの`LEADER_REGLOSS_ICHIJOU_RIRIKA_BACKGROUND`(既にBLPとして本体に組み込み済み、グローバルに名前解決できる)を`XML/Leaders.xml`の`DiplomacyInfo`テーブルにそのまま登録するだけで済む(詳細は`XML/Leaders.xml`のコメント参照)。**未実機確認**(次回プレイテストで外交交渉画面に反映されるか確認すること)

## リーダー選択画面の全身ポートレート(確定、2026-09-23)

civ6wiki.info(`PORTRAIT_hogehoge.dds`、328x646)ともSailor Cat's Modding Tutorial(825x1024)とも異なり、**そのような専用アセット名は実在しなかった**(`LoadingInfo`の前例と同じくwikiの記載が架空)。ローカルにインストール済みの本体・DLCファイルを直接読んで確認した:

- **実際の呼び名・場所は「Leader Placard」**。ゲーム設定(Advanced Setup)画面でリーダーを選んだ際に表示される全身ポートレート+背景のツールチップで、マルチプレイのStaging Roomでも同じ仕組みを使う(`Base/Assets/UI/FrontEnd/AdvancedSetup.xml`の`Instance Name="LeaderPlacard"`、`.lua`側は`PlayerSetupLogic.lua`)
- **データソースはConfig.xmlの`Players`テーブルの`Portrait`/`PortraitBackground`列**(`PlayerSetupLogic.lua`の`SELECT ... Portrait, PortraitBackground ... from Players`および該当ロジック、実コードを直接読んで確認)
- **未設定時のフォールバックも`LoadingInfo`と同じ命名規則**: `info.Portrait`が無ければ`info.LeaderType .. "_NEUTRAL"`、`info.PortraitBackground`が無ければ`info.LeaderType .. "_BACKGROUND"`を使う(`PlayerSetupLogic.lua`該当箇所)
- **公式DLCの実装例は例外なく明示設定**(`Babylon_ConfigData.xml`、`Byzantium_Gaul_ConfigData.xml`、`Ethiopia_ConfigData.xml`、`Expansion1_Players.xml`等、調べた全リーダー行で確認): `Portrait="LEADER_X_NEUTRAL" PortraitBackground="LEADER_X_BACKGROUND"`。つまり**ローディング画面(`LoadingInfo`)と全く同じ2枚のテクスチャをそのまま使い回すのが公式の標準パターン**であり、別途「全身ポートレート専用」の画像を作る必要は無い
- **サイズ・レイアウト**: `LeaderPlacard`のプレースホルダーは幅340px固定枠、`LeaderImage`は`StretchMode="UniformToFill"`で`Size="parent,670"`(縦670をアスペクト比維持のままクロップ表示)、`LeaderBG`は`StretchMode="None"`(等倍配置)。ローディング画面用に生成済みの高さ1024固定・膝下クロップ済み`LEADER_*_NEUTRAL`をそのまま流し込む前提の実装になっている
- **本Mod側の実装**: `XML/Config.xml`の`Players`テーブル3行(Standard/Expansion1/Expansion2)の`Portrait`/`PortraitBackground`を、これまでのダミー文字列(`IMG_LEADER_REGLOSS_ICHIJOU_RIRIKA_FOREGROUND`/`_BACKGROUND`、実体が存在せず空表示の原因だった)から`LEADER_REGLOSS_ICHIJOU_RIRIKA_NEUTRAL`/`LEADER_REGLOSS_ICHIJOU_RIRIKA_BACKGROUND`(ローディング画面用に生成済み、新規アート不要)に差し替えた。新規アート・ArtDef・XLPは一切不要。**未実機確認**(次回プレイテストでゲーム設定画面のリーダー選択時に全身ポートレートが表示されるか確認すること)

## その他、Sailor Cat's Modding Tutorialからの言及(未検証)

- ローディング背景を自作せず、既存リーダーの背景を`LoadingInfo.BackgroundImage`に指定して使い回す(例: `LEADER_GORGO_BACKGROUND`)手抜き手段への言及がある(これは実際に検証済みの`LoadingInfo`テーブルの`BackgroundImage`属性の仕組み上、動作しても不思議ではない)
- 「DiplomacyInfoテーブルへの直接INSERTは非推奨」という記載があったが、**上記の通り公式DLC自体がこのテーブルに素直にINSERTしており矛盾する**。おそらく「複数の英語ガイドを組み合わせて同じ行を重複INSERTすると衝突する」という限定的な注意で、単独でのINSERT自体を避けるべき根拠にはならない

## 参照元URL

- `.../新文明・指導者/ローディング画面・リザルト`(civ6wiki.info)
- `https://steamcommunity.com/sharedfiles/filedetails/?id=2420858843`(Sailor Cat's Modding Tutorial、英語)
