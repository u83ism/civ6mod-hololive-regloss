# ローディング画面・外交交渉画面・クレオパトラ対策(civ6wiki.info要約)

出典: `https://civ6wiki.info/?MOD/作成方法/新文明・指導者/ローディング画面・リザルト`、`.../勝手に出てくるクレオパトラを消す方法`(著者yosxpeee、2017〜2020年執筆、SDKサンプル`LEADER_JASPER_KITTY`を素材にした写経チュートリアル)。**このリポジトリで実機確認した事実ではない**ので、`icon-blp-pipeline.md`の実機検証結果と矛盾したらそちらを優先する。

## 必要な画像とtex

- 必要な画像6種(`hogehoge_LoadingInfo_Background`1920x960、`hogehoge_LoadingInfo_Foreground`888x1024、`hogehoge_DiplomacyInfo_Background`1920x960、`PORTRAIT_hogehoge`328x646、`FALLBACK_NEUTRAL_hogehoge`888x1024、`LEADER_hogehoge_NEUTRAL`888x1024)は全て非圧縮/ABGR8、**ミップマップなし**(バッジアイコンとは異なりミップマップ無しな点に注意)
- `PORTRAIT_*`/`FALLBACK_NEUTRAL_*`/`LEADER_*_NEUTRAL`の3つは`.tex`が必要(既存`.tex`をコピーして`m_Height`/`m_Width`/`m_NumMipMaps`/`m_DataFiles`/`m_Name`のみ書き換え)。`LeaderFallbacks.xlp`と`UILeaders.xlp`にもEntry追加が要る
- ModBuddyでArtdef/texファイルのBuild Actionが`None`のままだとビルドに含まれない。ソリューションエクスプローラーでProperties→Advanced→Build Actionを`Content`(xml/sql)または`XLP`(dds/tex/xlp)に設定する

## クレオパトラ対策

**敵として出会った時/自分を選択した時にクレオパトラが勝手に出る原因は`Leaders.artdef`が未設定でデフォルトにフォールバックしているため。** 対処は`Leaders.artdef`の該当リーダーブロック内、アニメーション参照(`m_EntryName="ART_LEADER_THEO"`のような`Leader`クラスの`BLPEntryValue`)をコメントアウト/削除し、`m_EntryName`を空文字にする。

## xmlでの登録

- `LoadingInfo`/`DiplomacyInfo`の`Row`をどこかのxmlに追加(新規でも既存への混在でもよい)。`LeaderText`が不要なら削除、`PlayDawnOfManAudio="0"`でナレーション音声オフ
- **ローディング画面で指導者名の下に生の定義名がそのまま出る場合は、`LoadingInfo`の`LeaderText`に対応するテキストが未定義なのが原因**(テキストを用意するか`LeaderText`属性ごと削除)

## 参照元URL

- `.../新文明・指導者/ローディング画面・リザルト`
- `.../新文明・指導者/勝手に出てくるクレオパトラを消す方法`
