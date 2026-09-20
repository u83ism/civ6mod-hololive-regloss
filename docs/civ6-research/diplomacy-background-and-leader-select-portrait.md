# 外交交渉画面の背景・リーダー選択画面の全身ポートレート(civ6wiki.info要約、未検証)

> このファイルは`.claude/skills/leader-icons/references/loading-and-diplomacy-screen.md`から移動・整理した。**Skillの行動指示ではなく、civ6wiki.info(2017〜2020年執筆)およびSailor Cat's Modding Tutorial(英語、未検証)の要約**であるため、実機確認済みの行動指示を書く`.claude/skills/`ではなく`docs/civ6-research/`に置く。着手して実機確認できたら、確認済みの事実として`make-fallback-portrait` Skillに書き足すこと。
>
> **教訓**: 同じ調査で`LoadingInfo`のForegroundImage/BackgroundImage画像名・XLP名に関するwiki記載(`hogehoge_LoadingInfo_*`/`UILeaders.xlp`)が架空だったと判明済み(実際は`<LeaderType>_NEUTRAL`/`<LeaderType>_BACKGROUND`、`UI_Leaders.xlp`。詳細は`.claude/skills/make-fallback-portrait/references/fallback-and-loading-schema.md`)。この節の画像名・XLP名もこの前例に倣い**着手前に公式データ(ゲーム本体のLua/DBスキーマ/公式DLC実データ)で裏取りし直すこと**。

## 外交交渉画面の背景

- civ6wiki.info: `hogehoge_DiplomacyInfo_Background`という単一画像(1920x960)
- Sailor Cat's Modding Tutorial(英語、`https://steamcommunity.com/sharedfiles/filedetails/?id=2420858843`): **単一画像ではなく`_1`〜`_4`のレイヤー合成**という説明になっている: `LeaderType_1.png`(背景アート)を最下層に、`LeaderType_4.png`(SDKアセットフォルダにある定型の額縁フレーム、着色されることが多い)を最上層に重ねる。サイズは**1920x1010**(civ6wiki.infoの「1920x960」と数値が異なる)。さらに`_2`/`_3`を使うキャラは背景と額縁の間に小物・パララックス層を追加できるとの記述もある
- **どちらが現行バージョンの実態か未確定**。どちらも実機検証していないので、実装前に実物のバニラ/他Modファイルで裏取りすること(`make-fallback-portrait`の`FALLBACK_NEUTRAL_*`/ローディング画面の調査と同じ手順、公式SDK Assetsの実物ファイル・ゲーム本体のLua/XMLを直接読むこと)

## リーダー選択画面の全身ポートレート(`PORTRAIT_*`)

- civ6wiki.info: `PORTRAIT_hogehoge.dds`、サイズ328x646
- Sailor Cat's Modding Tutorial: サイズが825x1024と書かれている(civ6wiki.infoの「328x646」と食い違う)。キャンバス自体のサイズなのか、888x1024キャンバス内に825x1024で配置するという意味なのか原文からは判別できない
- **名前・サイズとも未検証**。`LoadingInfo`の`<LeaderType>_NEUTRAL`/`_BACKGROUND`と同様に、実際の画像名・登録XLPが全く別物である可能性が高い。着手前に公式データ(`UI_Leaders.xlp`周辺、または`Config.xml`の`Icon`/`Portrait`列、`PlayerSetupLogic.lua`等)で実態を確認すること

## その他、Sailor Cat's Modding Tutorialからの言及(未検証)

- ローディング背景を自作せず、既存リーダーの背景を`LoadingInfo.BackgroundImage`に指定して使い回す(例: `LEADER_GORGO_BACKGROUND`)手抜き手段への言及がある(これは実際に検証済みの`LoadingInfo`テーブルの`BackgroundImage`属性の仕組み上、動作しても不思議ではない)
- **DiplomacyInfoテーブルへの直接INSERTは非推奨**("Remove any inserts into the DiplomacyInfo table. Some civilization and leader guides use this, and it conflicts with this guide.")。複数の英語ガイドを組み合わせて実装する場合はテーブルの重複INSERTに注意、という一般的な注意喚起

## 参照元URL

- `.../新文明・指導者/ローディング画面・リザルト`(civ6wiki.info)
- `https://steamcommunity.com/sharedfiles/filedetails/?id=2420858843`(Sailor Cat's Modding Tutorial、英語)
