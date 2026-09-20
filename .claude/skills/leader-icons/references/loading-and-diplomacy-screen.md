# ローディング画面・外交交渉画面・クレオパトラ対策(civ6wiki.info要約)

出典: `https://civ6wiki.info/?MOD/作成方法/新文明・指導者/ローディング画面・リザルト`、`.../勝手に出てくるクレオパトラを消す方法`(著者yosxpeee、2017〜2020年執筆、SDKサンプル`LEADER_JASPER_KITTY`を素材にした写経チュートリアル)。**このリポジトリで実機確認した事実ではない**ので、`icon-blp-pipeline.md`の実機検証結果と矛盾したらそちらを優先する。

## 必要な画像とtex

- 必要な画像6種(`hogehoge_LoadingInfo_Background`1920x960、`hogehoge_LoadingInfo_Foreground`888x1024、`hogehoge_DiplomacyInfo_Background`1920x960、`PORTRAIT_hogehoge`328x646、`FALLBACK_NEUTRAL_hogehoge`888x1024、`LEADER_hogehoge_NEUTRAL`888x1024)は全て非圧縮/ABGR8
  - ⚠️**「ミップマップなし」は誤り(2026-09-20、公式SDK Assetsの実物DDSで訂正済み)**。`Sid Meier's Civilization VI SDK Assets\Civ6\DLC\Expansion1\pantry\Textures\FALLBACK_NEUTRAL_*.dds`/`LEADER_*_NEUTRAL.dds`をDDSヘッダーレベルで直接調べたところ、全リーダー例外なく**バッジアイコンと同じフルミップチェーン(1x1まで、mipmapcount=11)**を持っていた。`.tex`の`m_NumMipMaps`は最上位レベルを含まない値(10)。下の「クレオパトラ対策の実装」節に詳細
  - ⚠️**サイズも「888x1024固定」ではなく「高さ固定・幅はキャラの見た目に応じて可変」が実態**。`FALLBACK_NEUTRAL_*.dds`は高さ1080固定(幅418〜816でキャラごとに違う)、`LEADER_*_NEUTRAL.dds`は高さ1024固定(幅427〜767)。ページ本文にも「画像のサイズが上記と異なる場合でも、ある程度は自動的に調整されて表示されるので問題ない」と明記されている(AI要約がこの一文を拾い損ねていたため、2026-09-21に生テキストを直接読んで発覚)
- `PORTRAIT_*`/`FALLBACK_NEUTRAL_*`/`LEADER_*_NEUTRAL`の3つは`.tex`が必要(既存`.tex`をコピーして`m_Height`/`m_Width`/`m_NumMipMaps`/`m_DataFiles`/`m_Name`のみ書き換え)。`LeaderFallbacks.xlp`と`UILeaders.xlp`にもEntry追加が要る
- ModBuddyでArtdef/texファイルのBuild Actionが`None`のままだとビルドに含まれない。ソリューションエクスプローラーでProperties→Advanced→Build Actionを`Content`(xml/sql)または`XLP`(dds/tex/xlp)に設定する

## クレオパトラ対策

**敵として出会った時/自分を選択した時にクレオパトラが勝手に出る原因は`Leaders.artdef`が未設定でデフォルトにフォールバックしているため。** 対処は`Leaders.artdef`の該当リーダーブロック内、アニメーション参照(`m_EntryName="ART_LEADER_THEO"`のような`Leader`クラスの`BLPEntryValue`)をコメントアウト/削除し、`m_EntryName`を空文字にする。

## xmlでの登録

- `LoadingInfo`/`DiplomacyInfo`の`Row`をどこかのxmlに追加(新規でも既存への混在でもよい)。`LeaderText`が不要なら削除、`PlayDawnOfManAudio="0"`でナレーション音声オフ
- **ローディング画面で指導者名の下に生の定義名がそのまま出る場合は、`LoadingInfo`の`LeaderText`に対応するテキストが未定義なのが原因**(テキストを用意するか`LeaderText`属性ごと削除)

## 英語圏ガイド(Sailor Cat's Modding Tutorial)との差分・要検証点

出典: `https://steamcommunity.com/sharedfiles/filedetails/?id=2420858843`(詳細は`icon-blp-pipeline.md`の同名セクション参照)。civ6wiki.infoとは数値が食い違う箇所があり、**どちらも実機検証していないので、実装前に実物のバニラ/他Modファイルで裏取りすること**:

- **外交交渉背景は単一画像ではなく`_1`〜`_4`のレイヤー合成**という説明になっている: `LeaderType_1.png`(背景アート)を最下層に、`LeaderType_4.png`(SDKアセットフォルダにある定型の額縁フレーム、着色されることが多い)を最上層に重ねる。サイズは**1920x1010**(このファイル冒頭の「1920x960」と数値が異なる)。さらに`_2`/`_3`を使うキャラは背景と額縁の間に小物・パララックス層を追加できるとの記述もある。civ6wiki.info側の「`hogehoge_DiplomacyInfo_Background`(1920x960)一枚絵」という説明とモデルが違うので、**どちらが現行バージョンの実態か未確定**
- **Leader Fallbackポートレートのサイズが825x1024と書かれている**(このファイル冒頭の「888x1024」と食い違う)。キャンバス自体のサイズなのか、888x1024キャンバス内に825x1024で配置するという意味なのか原文からは判別できない
- ローディング背景を自作せず、既存リーダーの背景を`LoadingInfo.BackgroundImage`に指定して使い回す(例: `LEADER_GORGO_BACKGROUND`)手抜き手段への言及があり、これはこのファイルの記述と一致する

## 参照元URL

- `.../新文明・指導者/ローディング画面・リザルト`
- `.../新文明・指導者/勝手に出てくるクレオパトラを消す方法`
- `https://steamcommunity.com/sharedfiles/filedetails/?id=2420858843`(Sailor Cat's Modding Tutorial、英語)

## クレオパトラ対策の実装(2026-09-20〜21、実機確認済み: 外交交渉画面でクレオパトラが消え莉々華の立ち絵が表示されることを確認)

外交交渉画面で一条莉々華がクレオパトラのモデルになる不具合の対策として、まず`Leaders.artdef`(3Dモデル参照)を空文字にする実装を先に入れたが、**実機で試したところクレオパトラは消えなかった**(エラーは無し)。`ArtDef.log`(`%LOCALAPPDATA%\Firaxis Games\Sid Meier's Civilization VI\Logs\`)を見ると`Unable to resolve Package 'LeaderFallbacks' from Project 'Hololive ReGLOSS'`という別の未解決エラーが出ており、これが真因だった: 3Dモデルとフォールバック用ポートレート(`LeaderFallback`)の**両方**が無いと、エンジンが行き場を失って最終手段(クレオパトラ)に落ちる。`Leaders.artdef`を空にするだけでは不十分で、フォールバックポートレート画像を実際に用意する必要がある。

### 裏取りの経緯

1. 実働Mod「Hololive 4th Generation」の`FallbackLeaders.artdef`を見て、リーダーごとに`Animations`→`DEFAULT`という単一状態だけを登録していること(civ6wiki.info/GSLeaderTemplateが挙げる7表情フルセットは必須ではない)を確認
2. サイズについてはwikiとGSLeaderTemplateの実物DDSで数値が食い違っていたため(888x1024 vs 569x1024等)、civ6wiki.infoの生テキストを直接読み(`research-mod` Skill 4節の手順)、「サイズは目安で自動調整される」という記述を発見
3. **さらに確実な裏取りとして、ローカルにインストール済みの`Sid Meier's Civilization VI SDK Assets`(公式Development Assets、AppID 597260)の`Civ6\DLC\Expansion1\pantry\`配下にある実際のバニラリーダー(Robert the Bruce、Poundmaker等)の`FallbackLeaders.artdef`/`Leaders.artdef`/`.tex`/`.dds`を直接読んだ**。civ6wiki.infoよりファンメイドテンプレートよりも確実な一次情報

### 確定した事実(公式データで裏取り済み)

- **`FallbackLeaders.artdef`は「DEFAULT」1状態のみで公式データも十分**(`LEADER_ROBERT_THE_BRUCE`/`LEADER_POUNDMAKER`等いずれも`Animations`コレクションに`DEFAULT`エントリ1つだけ)。`m_XLPClass="LeaderFallback"`、`m_ParamName="BLP Entry"`、`m_LibraryName="LeaderFallback"`
- **`Leaders.artdef`の`Leader_Background_BLP_Entry`も公式データは空文字のまま**(Robert the Bruceで確認)。うちの実装(全フィールド空)は公式と同じ形で問題ない
- **`FALLBACK_NEUTRAL_*.dds`は高さ1080固定・幅はキャラのシルエットに応じて可変(418〜816の実例)、フルミップチェーン(mipmapcount=11、.texの`m_NumMipMaps`は10)**。`LEADER_*_NEUTRAL.dds`は高さ1024固定・幅427〜767、こちらも別の未解決の用途(`Leaders.artdef`の`Leader_Background_BLP_Entry`ではない、`FallbackLeaders.artdef`でもない、おそらく`UILeaders.xlp`経由のロード画面/選択画面用)なので、クレオパトラ対策そのものには`FALLBACK_NEUTRAL_*`だけあれば十分と判断した
- `.tex`の`m_ClassName`は`"Leader_Fallback"`、`m_Tags`は`Leader_Fallback`/`Leader`/`Fallback`
- XLPの`m_ClassName`は`"LeaderFallback"`、`m_PackageName`は公式が`"LeaderFallbackImages"`(Hololive 4th Generationは独自に`"LeaderFallbacks"`と命名しているが、パッケージ名はMod側で自由に決めてよい値なのでどちらでも動くはず、うちは公式の命名に合わせた)
- ビルド後の出力は`Platforms/{Windows,MacOS}/BLPs/LeaderFallbackImages.blp`(UIサブフォルダではなくBLPs直下。Hololive 4th Generationの実物`LeaderFallbacks.blp`の配置と同じ階層)
- **`Leaders.artdef`と違い、`FallbackLeaders.artdef`は実際のピクセルデータを持つのでModBuddyでのBLPコンパイルが必要**(バッジアイコンと同じ重いパイプライン)

### 本Mod側の実装(実機確認済み)

- `Art/Source/ichijou-ririka-stand.webp`(全身立ち絵、2000x2000、透過あり。**このSourceファイル自体は一切加工・上書きしない**)を元に、`tools/png2dds/gen-leader-fallback.ts`(新規、`sharp`パッケージを追加)で一括生成:
  1. 透明余白をトリム
  2. **膝下でクロップ**(トリム後の全身高さの下25%をカット。`KNEE_CROP_FRACTION`)。公式および他言語版Hololive Mod(EN/ID)は全身ではなく膝のちょい下までしか描いておらず、それに合わせた(本人の実機比較による指摘、2026-09-21)
  3. 高さ1080にリサイズ(幅は444、公式`FALLBACK_NEUTRAL_*`の「高さ固定・幅可変」慣習に合わせた)
  4. **上部に10%の透明マージンを追加**(`TOP_MARGIN_FRACTION`、`leader-fallback-compositing.ts`の`padTopMargin`)
  5. **下端に向けてRGBを黒へ線形フェード**(高さの75%地点から開始、アルファは不変。`applyBottomFade`)。3〜4は公式DDSのピクセルデータを直接解析して数値を実測した上での再現(下記「わかったこと」参照)
  6. DDS化(フルミップチェーン、`png2dds.ts`の正方形限定チェックを撤廃して対応)→`.tex`(公式`FALLBACK_NEUTRAL_ROBERT_THE_BRUCE.tex`をコピーして幅/高さ/ミップ数を差し替え)→XLP→`FallbackLeaders.artdef`(`tools/IconBuild/ArtDefs/`と本体`ArtDefs/`の両方に出力)
- `tools/IconBuild/RegLoss_IconBuild.civ6proj`/`.Art.xml`に新規ファイルを登録。**`.Art.xml`の`LeaderFallback`ライブラリに元々あった`<Element text="LeaderFallbacks"/>`という宙に浮いた(実体の無い)パッケージ参照を発見し、正しい`LeaderFallbackImages.blp`に修正した。これが冒頭の`ArtDef.log`エラーの直接の原因だった**
- `civ6mod-hololive-regloss.dep`/`.modinfo`を本体側も同様に更新(`Leaders.artdef`の時と同じ手順を踏襲、`tools/png2dds/gen-dep.ts`で再生成した出力と手動編集が一致することを確認済み)

### 上部余白・下部フェードの実測値(公式5リーダーのDDSピクセルを直接解析、2026-09-21)

`FALLBACK_NEUTRAL_*.dds`のRGBA生データを読み、行ごとの不透明率・平均輝度を計測した(`ArtDef.log`同様、AI要約やwiki値を鵜呑みにせず実物ピクセルで裏取り):

- **上部の透明マージン**: Robert the Bruce 10.0%、Shaka 9.5%、Poundmaker 15.2%、Seondeok 5.0%、Tamar 9.2%(いずれもキャラ高さに対する割合)。エンジン側の自動処理ではなく**画像データに焼き込まれている**
- **下部の黒フェード**: アルファ値はほぼ不透明(232〜244)のまま変化せず、**RGB値だけが下端に向かって滑らかに黒(0に近い値)へ減衰**する(透過フェードではない)。フェード開始点はキャラ高さの下から20〜28%あたり(平均約21%)。エンジン側の自動処理ではなく**画像データに焼き込まれている**(Hololive EN/IDのMod作者が2D立ち絵でこれを再現できているのも、自前で加工しているためと考えられる)
- 膝下クロップの位置(トリム後の全身画像の下2〜3割をカット)は本人の目視比較による指定で、上記2点のような実測値ではない

### 実機確認結果(2026-09-21)

上記手順(ModBuddyビルド→`LeaderFallbackImages.blp`をWindows/MacOS両方コピー→新規ゲーム開始)を実施し、**外交交渉画面でクレオパトラが消え、莉々華のフォールバック静止画(膝下クロップ+上部余白+下部フェード適用済み)が公式に近い見た目で表示されることを実機確認した(本人評価「パーフェクト最高だ」)。** `FALLBACK_NEUTRAL_*`(`LeaderFallback`ライブラリ)1枚だけで、`Leaders.artdef`(3Dモデル)を空にする対策と合わせてクレオパトラ問題は解消する。

### 未着手のまま残っている別領域(クレオパトラ対策とは無関係)

- **ローディング画面**(`hogehoge_LoadingInfo_Background`/`hogehoge_LoadingInfo_Foreground`、`LoadingInfo`テーブルへのXML登録)。実機確認済みなのは外交交渉画面のフォールバックだけで、ローディング画面には莉々華の絵が出ない(2026-09-21確認、バグではなく単に未実装)
- 外交交渉画面の背景(`hogehoge_DiplomacyInfo_Background`または`_1`〜`_4`のレイヤー合成、22行目以降の「英語圏ガイドとの差分」節参照)
- リーダー選択画面の全身ポートレート(`PORTRAIT_hogehoge`、`UILeaders.xlp`経由)
- これらは今回と独立した作業なので、着手する際はこのファイルの該当節(未検証)から着手すること
