---
name: make-fallback-portrait
description: Civ6 Modで外交交渉画面のフォールバック静止画(ゲーム内識別名`FALLBACK_NEUTRAL_*`、`FallbackLeaders.artdef`経由の`LeaderFallback`ライブラリ)を、キャラクター元絵から実際に生成する時に使う。「フォールバックポートレートを作る」「FALLBACK_NEUTRALを作る/差し替える」「外交画面用の立ち絵を用意する」「膝下トリミング」「上部余白・下部フェードを付ける/調整する」と言われたとき、または`tools/png2dds/gen-leader-fallback.ts`を新規に書く/パラメータ調整する場面で使う。**`PORTRAIT_*`(リーダー選択画面の全身ポートレート)や`LEADER_*_NEUTRAL`(用途不明、いずれも未実装)は対象外**、バッジアイコン(`ICON_*`)もスコープ外(そちらは`leader-icons` Skill)。Civ6側の`FallbackLeaders.artdef`スキーマ・実機裏取りの詳細は`leader-icons` Skillの`references/loading-and-diplomacy-screen.md`を参照(本Skillは「作る手順」、そちらは「Civ6側の仕様・裏取り根拠」の置き場)。
---

# FALLBACK_NEUTRAL_*(外交交渉画面のフォールバック静止画)の制作手順

一条莉々華Mod(civ6mod-hololive-regloss)で確立した、キャラクター元絵から`FALLBACK_NEUTRAL_*`(Civ6の外交交渉画面で3Dモデルの代わりに表示される静止画)を作る一連の手順。**ここに書く内容はすべて実機で確認済みの事実**(2026-09-21、莉々華で実装・実機確認済み)。

このMod自体がまだクレオパトラのプレースホルダーになっている等の根本原因調査は`leader-icons` Skillの範囲。本Skillは「元絵とキャラ名さえあれば、その先の画像加工〜ファイル生成をどう自動化するか」という制作ワークフローに専心する。

## 1. 前提: 元絵の要件

- `Art/Source/`配下に、**全身立ち絵・透過背景(アルファチャンネルあり)**の画像を置く(頭から膝下より先まで描かれていること。膝から下は後述の膝下クロップでどのみち切り落とすので、足先まで描かれていて構わない)
- フォーマットは問わない(webp/png等。`sharp`パッケージでデコードするので大抵の形式が読める)
- **この元絵ファイル自体は生成パイプラインが一切書き換えない**(読み込み専用)。加工結果は別ファイルに出力する

## 2. パイプラインの中身(`tools/png2dds/gen-leader-fallback.ts`)

`tools/png2dds`ディレクトリで`npm run gen-leader-fallback`を実行すると、以下を一括生成する:

1. **透明余白のトリム**(`sharp().trim()`)
2. **膝下クロップ**(`KNEE_CROP_FRACTION`、既定0.25): トリム後の全身高さの下25%をカットし、膝のちょい下までにする。公式リーダーおよび他言語版Hololive Mod(EN/ID)は全身ではなくこの高さまでしか描いていないため、それに合わせている
3. **高さ1080にリサイズ**(`LEADER_FALLBACK_HEIGHT`)。公式`FALLBACK_NEUTRAL_*.dds`は全リーダー高さ1080固定・幅はキャラのシルエットに応じて可変、という実測結果に合わせている(詳細根拠は`leader-icons`Skillの参考資料)
4. **上部に透明マージンを追加**(`TOP_MARGIN_FRACTION`、既定0.10): 公式データの実測(5〜15%、平均10%)に基づく。キャラを画像下端に詰め、上に余白を作る(`leader-fallback-compositing.ts`の`padTopMargin`)
5. **下端に向けてRGBを黒へ線形フェード**(`BOTTOM_FADE_START_FRACTION`、既定0.75=高さの下から25%地点からフェード開始): アルファは不変(公式データもほぼ不透明のまま)、色だけを黒へブレンドする(`applyBottomFade`)。**透過フェードではない**点に注意
6. DDS化(フルミップチェーン、`convertPngToDds`)→`.tex`(公式`FALLBACK_NEUTRAL_ROBERT_THE_BRUCE.tex`をコピーして幅/高さ/ミップ数を差し替え)→`.xlp`→`FallbackLeaders.artdef`(`tools/IconBuild/ArtDefs/`と本体Modの`ArtDefs/`の両方に出力)

生成物の出力先:

| 種別 | パス |
| --- | --- |
| 中間PNG(確認用) | `Art/Icons/FALLBACK_NEUTRAL_<LEADER_NAME>.png` |
| DDS/tex | `tools/IconBuild/Textures/` |
| XLP | `tools/IconBuild/XLPs/LeaderFallbackImages.xlp` |
| ArtDef(ビルド用+本体Mod用) | `tools/IconBuild/ArtDefs/FallbackLeaders.artdef`と`ArtDefs/FallbackLeaders.artdef`(本体Modルート) |

## 3. パラメータの調整とプレビュー(ModBuddy再ビルド前に確認する)

`KNEE_CROP_FRACTION`/`TOP_MARGIN_FRACTION`/`BOTTOM_FADE_START_FRACTION`はキャラの体型・ポーズによって微調整が要る(実測値は目安であって、他キャラでもそのまま通用する保証はない)。**ModBuddyビルド→コピー→実機確認は工数が重いので、その前に画像だけで見た目を確認すること**:

1. `npm run gen-leader-fallback`でPNGを再生成
2. `npm run preview-fallback-dark-bg -- FALLBACK_NEUTRAL_<LEADER_NAME>.png`で、外交交渉画面に近いダーク背景に合成したプレビューPNG(`Art/Icons/FALLBACK_NEUTRAL_<LEADER_NAME>_preview-dark-bg.png`)を生成する。**PNGをそのまま見ると透過部分が白背景に合成されてしまい、下部フェード(色だけ黒に落ちる・透過はしない)が正しく見えない**ため、このプレビューが必須
3. `Read`ツール等でプレビューPNGを見て、余白・膝下位置・フェードの見え方を確認。ズレていたら定数を書き換えて1に戻る
4. 良ければプレビューPNG(`*_preview-dark-bg.png`)を削除してから次へ進む(確認用の使い捨てファイルなので、コミットに含めない)

## 4. ModBuddyビルド〜実機反映(初回配線後は毎回この手順でよい)

画像の中身(元絵・パラメータ)を差し替えるだけなら、以下の手順の繰り返しで済む(`.dep`/`.modinfo`/`Art.xml`等の配線は初回のみ、5節参照):

1. `npm run gen-leader-fallback`(2〜3節で調整済みの状態で最終生成)
2. `tools/IconBuild/RegLoss_IconBuild.civ6sln`をModBuddyで開いてビルド
3. `Documents/My Games/Sid Meier's Civilization VI/Mods/RegLoss_IconBuild/Platforms/{Windows,MacOS}/BLPs/LeaderFallbackImages.blp`を本体Modの同パス(`Platforms/{Windows,MacOS}/BLPs/`)にコピー
4. 実機で新規ゲームを開始し、外交交渉画面で確認

## 5. 初回のみ: Mod側の配線(新規リーダーで初めて導入する場合)

画像生成スクリプト自体は自動でファイルを作るが、以下はスクリプトの範囲外で1回だけ手動配線が要る(詳細根拠・実際の変更箇所は`leader-icons`Skillの参考資料を参照):

- `tools/IconBuild/RegLoss_IconBuild.civ6proj`にDDS/tex/XLP/ArtDefを`Content`として登録
- `tools/IconBuild/RegLoss_IconBuild.Art.xml`の`LeaderFallback`コンシューマ(`relativeArtDefPaths`)とライブラリ(`relativePackagePaths`)を配線
- 本体Modの`civ6mod-hololive-regloss.dep`/`.modinfo`を同様に配線(`tools/png2dds/gen-dep.ts`で`.dep`の`ArtDefDependencies`は再生成できる)

## 6. 別のReGLOSSメンバー(姉妹リポジトリ)で使う場合

`gen-leader-fallback.ts`はこのMod(莉々華)専用にキャラ名・元絵ファイル名がハードコードされている(`OUR_NAME`/`LEADER_TYPE`/`sourcePath`等の定数)。汎用ライブラリ化はしていないので、姉妹リポジトリでは本ファイルと`leader-fallback-compositing.ts`/`preview-fallback-dark-bg.ts`をコピーし、該当キャラ用に定数を書き換えて使うこと。
