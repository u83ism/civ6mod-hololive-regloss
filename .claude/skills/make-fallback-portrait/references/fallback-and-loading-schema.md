# Civ6側の仕様・裏取り根拠(FALLBACK_NEUTRAL_* / LEADER_*_NEUTRAL / LEADER_*_BACKGROUND)

このSkill(`make-fallback-portrait`)が生成する3種の静止画が、Civ6側でどう定義・消費されているかの裏取り根拠。**実機確認済み**(2026-09-20〜21、外交交渉画面・ローディング画面ともに実機確認済み)。制作手順そのものはSKILL.md本文を参照、ここはその裏付け。

## 外交交渉画面のクレオパトラ対策(`FALLBACK_NEUTRAL_*`)

外交交渉画面で一条莉々華がクレオパトラのモデルになる不具合の対策として、まず`Leaders.artdef`(3Dモデル参照)を空文字にする実装を先に入れたが、**実機で試したところクレオパトラは消えなかった**(エラーは無し)。`ArtDef.log`(`%LOCALAPPDATA%\Firaxis Games\Sid Meier's Civilization VI\Logs\`)を見ると`Unable to resolve Package 'LeaderFallbacks' from Project 'Hololive ReGLOSS'`という別の未解決エラーが出ており、これが真因だった: 3Dモデルとフォールバック用ポートレート(`LeaderFallback`)の**両方**が無いと、エンジンが行き場を失って最終手段(クレオパトラ)に落ちる。`Leaders.artdef`を空にするだけでは不十分で、フォールバックポートレート画像を実際に用意する必要がある。

### 裏取りの経緯

1. 実働Mod「Hololive 4th Generation」の`FallbackLeaders.artdef`を見て、リーダーごとに`Animations`→`DEFAULT`という単一状態だけを登録していること(civ6wiki.info/GSLeaderTemplateが挙げる7表情フルセットは必須ではない)を確認
2. サイズについてはciv6wiki.infoとGSLeaderTemplateの実物DDSで数値が食い違っていたため(888x1024 vs 569x1024等)、civ6wiki.infoの生テキストを直接読み(`research-mod` Skill 4節の手順)、「サイズは目安で自動調整される」という記述を発見
3. **さらに確実な裏取りとして、ローカルにインストール済みの`Sid Meier's Civilization VI SDK Assets`(公式Development Assets、AppID 597260)の`Civ6\DLC\Expansion1\pantry\`配下にある実際のバニラリーダー(Robert the Bruce、Poundmaker等)の`FallbackLeaders.artdef`/`Leaders.artdef`/`.tex`/`.dds`を直接読んだ**。civ6wiki.infoよりファンメイドテンプレートよりも確実な一次情報

### 確定した事実

- **`FallbackLeaders.artdef`は「DEFAULT」1状態のみで公式データも十分**(`LEADER_ROBERT_THE_BRUCE`/`LEADER_POUNDMAKER`等いずれも`Animations`コレクションに`DEFAULT`エントリ1つだけ)。`m_XLPClass="LeaderFallback"`、`m_ParamName="BLP Entry"`、`m_LibraryName="LeaderFallback"`
- **`Leaders.artdef`の`Leader_Background_BLP_Entry`も公式データは空文字のまま**(Robert the Bruceで確認)。全フィールド空の実装は公式と同じ形で問題ない
- **`FALLBACK_NEUTRAL_*.dds`は高さ1080固定・幅はキャラのシルエットに応じて可変(418〜816の実例)、フルミップチェーン(mipmapcount=11、.texの`m_NumMipMaps`は10)**。`LEADER_*_NEUTRAL.dds`は高さ1024固定・幅427〜767で、用途はローディング画面のポートレート(下記参照)。クレオパトラ対策そのものには`FALLBACK_NEUTRAL_*`だけあれば十分
- `.tex`の`m_ClassName`は`"Leader_Fallback"`、`m_Tags`は`Leader_Fallback`/`Leader`/`Fallback`
- XLPの`m_ClassName`は`"LeaderFallback"`、`m_PackageName`は公式が`"LeaderFallbackImages"`(Hololive 4th Generationは独自に`"LeaderFallbacks"`と命名しているが、パッケージ名はMod側で自由に決めてよい値なのでどちらでも動くはず、本Modは公式の命名に合わせた)
- ビルド後の出力は`Platforms/{Windows,MacOS}/BLPs/LeaderFallbackImages.blp`(UIサブフォルダではなくBLPs直下。Hololive 4th Generationの実物`LeaderFallbacks.blp`の配置と同じ階層)
- **`Leaders.artdef`と違い、`FallbackLeaders.artdef`は実際のピクセルデータを持つのでModBuddyでのBLPコンパイルが必要**(バッジアイコンと同じ重いパイプライン)

### 上部余白・下部フェードの実測値(公式5リーダーのDDSピクセルを直接解析、2026-09-21)

`FALLBACK_NEUTRAL_*.dds`のRGBA生データを読み、行ごとの不透明率・平均輝度を計測した(`ArtDef.log`同様、AI要約やwiki値を鵜呑みにせず実物ピクセルで裏取り):

- **上部の透明マージン**: Robert the Bruce 10.0%、Shaka 9.5%、Poundmaker 15.2%、Seondeok 5.0%、Tamar 9.2%(いずれもキャラ高さに対する割合)。エンジン側の自動処理ではなく**画像データに焼き込まれている**
- **下部の黒フェード**: アルファ値はほぼ不透明(232〜244)のまま変化せず、**RGB値だけが下端に向かって滑らかに黒(0に近い値)へ減衰**する(透過フェードではない)。フェード開始点はキャラ高さの下から20〜28%あたり(平均約21%)。エンジン側の自動処理ではなく**画像データに焼き込まれている**(Hololive EN/IDのMod作者が2D立ち絵でこれを再現できているのも、自前で加工しているためと考えられる)
- 膝下クロップの位置(トリム後の全身画像の下2〜3割をカット)は本人の目視比較による指定で、上記2点のような実測値ではない

### 実機確認結果(2026-09-21)

ModBuddyビルド→`LeaderFallbackImages.blp`をWindows/MacOS両方コピー→新規ゲーム開始、を実施し、**外交交渉画面でクレオパトラが消え、莉々華のフォールバック静止画(膝下クロップ+上部余白+下部フェード適用済み)が公式に近い見た目で表示されることを実機確認した(本人評価「パーフェクト最高だ」)。** `FALLBACK_NEUTRAL_*`(`LeaderFallback`ライブラリ)1枚だけで、`Leaders.artdef`(3Dモデル)を空にする対策と合わせてクレオパトラ問題は解消する。

## ローディング画面(`LEADER_*_NEUTRAL`/`LEADER_*_BACKGROUND`)

**civ6wiki.infoの命名(`hogehoge_LoadingInfo_Background`/`hogehoge_LoadingInfo_Foreground`、`UILeaders.xlp`)は実在せず架空だった。** 公式ゲーム本体(`Sid Meier's Civilization VI/Base/Assets/`、SDK AssetsではなくインストールされたBase本体)のDBスキーマSQL・`LoadScreen.lua`・実際の公式DLC XML(`Expansion1_LoadingInfo.xml`)・XLPを直接読んで裏取りした、正しい実態は以下。

### 確定した事実

- **`LoadingInfo`テーブル**(`01_GameplaySchema.sql`で確認): `LeaderType`(PK)/`ForegroundImage`/`BackgroundImage`/`EraText`/`LeaderText`/`PlayDawnOfManAudio`/`DawnOfManLeaderId`/`DawnOfManEraId`。この列名自体はwiki記載通り正しい
- **実際の画像命名は`<LeaderType>_NEUTRAL`(前景ポートレート)/`<LeaderType>_BACKGROUND`(背景)**。`LoadScreen.lua`のコードに直接ハードコードされている: `LoadingInfo`行が無い、または`ForegroundImage`/`BackgroundImage`が未指定の場合、`leaderType .. "_NEUTRAL"`/`leaderType .. "_BACKGROUND"`にフォールバックする仕組みで、公式DLCの実データ(`Expansion1_LoadingInfo.xml`)もこの命名をそのまま明示的に使っている:
  ```xml
  <Row LeaderType="LEADER_ROBERT_THE_BRUCE" ForegroundImage="LEADER_ROBERT_THE_BRUCE_NEUTRAL" BackgroundImage="LEADER_ROBERT_THE_BRUCE_BACKGROUND"/>
  ```
- **背景とポートレートは完全に別レイヤー**。`LoadScreen.xml`は`BackgroundImage`(`Image`コントロール)の子として`Portrait`という別の`Image`コントロールをネストしており、Lua側も`Controls.BackgroundImage:SetTexture(...)`/`Controls.Portrait:SetTexture(...)`を独立して呼んでいる。**背景画像自体にキャラクターを描き込む必要はない**(環境イラストだけでよい)
- **`<LeaderType>_BACKGROUND.dds`は1920×960固定(全リーダー共通)、フルミップチェーン(mipmapcount=11)**。`.tex`の`m_ClassName`は`"UserInterface"`(`FALLBACK_NEUTRAL_*`の`"Leader_Fallback"`とは異なる)
- **`<LeaderType>_NEUTRAL.dds`は`FALLBACK_NEUTRAL_*`と全く同じ「高さ固定・幅可変・上部余白+下部黒フェードが焼き込み」パターン**(高さ1024固定、実測でRobert the Bruceの上部余白10.7%・下部フェード開始74.6%地点を確認、外交交渉画面の`FALLBACK_NEUTRAL_*`の実測値とほぼ一致)
- **どちらも`ArtDef`不要**。バッジアイコンと同じ`UITexture`クラスのXLPで直接登録する(`Leaders.artdef`/`FallbackLeaders.artdef`のような専用artdefを介さない)。実際の登録XLPは`Shell_Loading.xlp`(背景、パッケージ`UI/Shell_Loading`)と`UI_Leaders.xlp`(ポートレート、パッケージ`UI/UI_Leaders`、**wikiの`UILeaders.xlp`はアンダースコア無しで実在しない**)

### 本Mod側の実装

- 背景(`LEADER_REGLOSS_ICHIJOU_RIRIKA_BACKGROUND`): `Art/Source/wallpaper-broadcast-night.webp`(3840x2160、キャラなしの環境イラスト)を`tools/png2dds/gen-loading-background.ts`で中央クロップ+1920x960にリサイズして生成。キャラを乗せる必要が無いと分かったので画像加工はこれだけで完結
- ポートレート(`LEADER_REGLOSS_ICHIJOU_RIRIKA_NEUTRAL`): `tools/png2dds/gen-loading-portrait.ts`で`gen-leader-fallback.ts`と同じ元絵・同じ加工(膝下クロップ・上部余白・下部フェード、`leader-fallback-compositing.ts`を共有)を高さ1024向けに適用して生成
- 両方とも`ArtDef`不要、`UITexture`クラスのXLP(`RegLoss_Loading.xlp`/`RegLoss_LoadingPortrait.xlp`、公式の`Shell_Loading`/`UI_Leaders`とは別名の自前パッケージ)で登録。`tools/IconBuild`の`.civ6proj`/`.Art.xml`(`UITexture`ライブラリの`relativePackagePaths`に追加)、本体の`.dep`/`.modinfo`も同様に配線
- `XML/Leaders.xml`に`LoadingInfo`の`Row`を追加(`ForegroundImage="LEADER_REGLOSS_ICHIJOU_RIRIKA_NEUTRAL"` `BackgroundImage="LEADER_REGLOSS_ICHIJOU_RIRIKA_BACKGROUND"`)
- ModBuddyビルド→`RegLoss_Loading.blp`/`RegLoss_LoadingPortrait.blp`(どちらも`Platforms/{Windows,MacOS}/BLPs/UI/`)を本体にコピー→実機で新規ゲーム開始のローディング画面に莉々華が表示されることを確認(本人評価「パーフェクト。素晴らしい」)

## 未着手のまま残っている別領域(このSkillのスコープ外)

- 外交交渉画面の背景・リーダー選択画面の全身ポートレート(`PORTRAIT_*`)は未検証。着手前に`docs/civ6-research/diplomacy-background-and-leader-select-portrait.md`を読み、上記と同じ手順(公式データで裏取り)を踏むこと。**wiki記載の画像名がそのまま架空だった前例が2件(`LoadingInfo`関連)あるので、この2つも名前から疑ってかかること**
