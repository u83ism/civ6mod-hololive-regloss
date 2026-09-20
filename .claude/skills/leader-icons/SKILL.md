---
name: leader-icons
description: Civ6 Modで指導者/文明のバッジアイコン・ポートレート・ローディング/外交交渉画面などのArt/BLPパイプラインを実装・デバッグする時に使う。「アイコンを作る」「ポートレートが表示されない」「選択画面が？のまま」「BLPをビルドする」「XLP/Artdef/.texを書く」「クレオパトラが出る」と言われたとき、または`Icons.xml`・`.tex`・`.xlp`・`.artdef`・`.dep`を新規に書く/実機デバッグする場面で使う。leader-bootstrapで指導者が選択画面に出るところまで終わった後、または並行して使う独立作業。
---

# アイコン・ポートレートのArt/BLPパイプライン

一条莉々華Mod(civ6mod-hololive-regloss)の実装で確立した、Civ6の閉鎖的なArt Pipeline(ModBuddy/AssetEditor/BLPコンパイル)を突破する手順。**ここに書く内容はすべて実機で確認済みの事実**。

Civ/Leaderの選択画面自体は`leader-bootstrap` Skillの範囲で(アイコンが未着手の「？」フォールバックのままでも)動作するようになる。アイコン/ポートレートの実装はそこから独立して進められる別作業だが、**GUIツール(ModBuddy/AssetEditor)を介した手作業が多く工数が重いので、着手前に本Skillの内容を一通り読んでから始めること**。

**断片情報から仮説を積み上げがちな調査が必要になったら、先に`research-mod` Skillに従って一次情報を洗うこと。**

## バッジアイコン(CivilizationIcon/LeaderIcon等)・ポートレートの実装

`references/icon-blp-pipeline.md`に実機検証済みの完全な手順(dds用意→tex流用→xlp記述→Mod.Art.xml登録→`.dep`ファイル→ModBuddyビルド)を書いてある。要点だけ書くと:

- **PNG直置きでは動かない(実機確認済み)。ModBuddy必須。** `IconTextureAtlases`の`Filename`は実ファイルパスではなく、ModBuddyのAssetEditorで作る**XLP(UITextureクラス)のEntryID**を指しており、実体ピクセルはModBuddyビルドで生成される`.blp`の中にしか無い
- 文明アイコン: 22, 30, 32, 36, 44, 45, 48, 50, 64, 80, 128, 256 px。指導者アイコン: 32, 45, 48, 50, 55, 64, 80, 256 px
- `.dep`ファイル(`AssetObjects..GameDependencyData`)が実在し`.modinfo`の`<Files>`に列挙されていないと、`UpdateArt`アクションごと無視される。ModBuddyが自動生成しないケースがあったため、`tools/png2dds/gen-dep.ts`(`npm run gen-dep --`)で`Mod.Art.xml`から機械的に生成する運用にしている
- リーダー選択画面の全身ポートレート(`Portrait`/`PortraitBackground`)もバッジアイコンと同じくArtDef+XLP+ModBuddyコンパイルが必要。PNG直置きの簡易ルートは無い

本体Modの`.modinfo`(動作実績のある一段階古いスキーマ)をModBuddyに触らせないため、アイコン画像のビルドパイプライン(`tools/IconBuild/`)は本体Modとは別のModBuddyプロジェクトとして分離してある。再生成手順(`tools/png2dds/`の各スクリプト→ModBuddyでビルド→`.blp`を本体にコピー)も`references/icon-blp-pipeline.md`に書いてある。

## ローディング画面・外交交渉画面・クレオパトラ対策

**外交交渉画面のクレオパトラ対策・ローディング画面ともに実機確認済み(2026-09-21)**。

- クレオパトラ対策: `Leaders.artdef`(3Dモデル参照を空文字に)と`FallbackLeaders.artdef`(`FALLBACK_NEUTRAL_*`フォールバック静止画、`LeaderFallback`ライブラリ)の両方が揃って初めて解消することを確認した
- ローディング画面: `LoadingInfo`テーブル(`XML/Leaders.xml`)+`<LeaderType>_NEUTRAL`(ポートレート)/`<LeaderType>_BACKGROUND`(背景、キャラなしでよい)の2枚。civ6wiki.infoの画像名(`hogehoge_LoadingInfo_*`)・XLP名(`UILeaders.xlp`)は架空だったと判明、`LoadScreen.lua`と公式DLC実データで裏取り済み

手順・スキーマの詳細と、公式データ(SDK Assets実物ファイル・ゲーム本体のスキーマSQL/Lua/XML)で裏取りした確定事項は`references/loading-and-diplomacy-screen.md`。**サイズ・ミップマップ有無・画像/XLP名に関するciv6wiki.infoの記述は複数箇所で誤りだったことが判明済み**(詳細は同ファイル)。

**未着手のまま**: 外交交渉画面の背景、リーダー選択画面の全身ポートレート(`PORTRAIT_*`、名称含め未検証)。`references/loading-and-diplomacy-screen.md`末尾に着手時の注意点をまとめてある。
