# バッジアイコンの正しい作り方(ModBuddyビルド必須)

SKILL.md 4節に書いていた「バッジアイコンはPNG直置きで動く、ModBuddy不要」は**裏取りできておらず誤りだった**。PNG直置き・DDS直置き・`.tex`手書きだけ追加、を順に試したが全部「？」フォールバックのまま、エラーログも一切出ないまま静かに失敗した。**結論: ModBuddyでの実ビルド(コンパイルして`.blp`を生成)が必須で、ローズファイル直置きのショートカットは無い。** 正しい手順は`https://civ6wiki.info/?MOD/作成方法/新文明・指導者/指導者アイコンの作り方`および`.../文明アイコン`ページに実践記録がある(`civ6-mod-research` Skill参照)。

## 誤りだった根拠(実機調査)

`Documents/My Games/Sid Meier's Civilization VI/Mods/`配下の実働Mod(HktkNban/Neox氏系のHololive 1st〜5th Generation、Hololive GAMERS、Uruha Rushia、計7Mod)を全部調べたところ、例外なく`Platforms/{Windows,MacOS}/BLPs/UI/Icons.blp`(ModBuddyコンパイル済みバイナリ)を持ち、loose png/ddsは1つも無かった。`IconTextureAtlases`の`Filename`属性(例: `ICON_CIV_AKAI_HEART_128.dds`)は実ファイルパスではなく、**XLP内のEntryID(シンボル名)**を指しているだけで、実体ピクセルは`.blp`の中にある。

ログでの見え方: `%LOCALAPPDATA%\Firaxis Games\Sid Meier's Civilization VI\Logs\`の`Modding.log`(`UpdateIcons - Loading ...`は出る=XMLは読めている)、`Database.log`(NOT NULL/UNIQUE等のエラー無し=DBインサートは成功している)、`UserInterface.log`(他Modの壊れたアイコンは`[DataError] IconManager is unable to find the icon "..."`と出るのに、こちらは該当ログ行自体が皆無)——**DB登録は成功しているのにUI層への問い合わせ痕跡が一切無い**まま「？」になる。このパターンはmodinfoスキーマ問題(`leader-bootstrap/SKILL.md` 2節)と類似するので混同注意。

## 正しい手順(civ6wiki.infoで確認済み)

文明アイコン(22,30,32,36,44,45,48,50,64,80,128,256px)・指導者アイコン(32,45,48,50,55,64,80,256px)共通:

1. **元画像を用意**: 一番大きいサイズ(文明256/指導者256)を作り、そこから縮小して各サイズを作る。フォーマットは**dds(無圧縮/ABGR8/ミップマップあり)**。GIMPのDDSプラグイン等で変換する
   - ※ポートレート/ローディング背景等(`PORTRAIT_*`/`*_LoadingInfo_*`等、888x1024や1920x960サイズ)は同じABGR8無圧縮でも**ミップマップなし**。対象によって違うので混同しない
   - 圧縮形式(DXT1等)やABGR8以外の色形式で作ると読み込まれない/表示がバグる。ビルド失敗時は`cooker.log`に`UIErrorTexture`等のエラーが出る
2. **`.tex`ファイルはゼロから書かない。実物をコピーして2箇所だけ書き換える**: Development Assets(Steam AppID `597260`)の`Sid Meier's Civilization VI SDK Assets\pantry\Textures\`から、既存文明/指導者の`.tex`(例: モンテスマの指導者アイコン`Montezuma*.tex`)をコピーし、サイズごとに以下2箇所だけ変更:
   - `<m_DataFiles><Element><m_RelativePath text="..."/>` → 自分のddsファイル名
   - `<m_Name text="..."/>` → ddsファイル名から拡張子を除いたもの
   `.tex`は普通のテキストエディタで開けるプレーンXML。AssetEditorのGUIで新規Textureアセットを作る必要はない
3. **XLPも実物をコピーして書き換える**: コピー元は`Sid Meier's Civilization VI SDK Assets\pantry\XLPs\Icons.xlp`(全アイコンが1ファイルに入っているので該当キャラの`<Element>`だけ抜き出す)。変更箇所:
   - `m_PackageName`の`text`: `UI/`の後ろを任意の名前に(例: `UI/RegLoss_Icons`)
   - 各`<Element>`の`m_EntryID`/`m_ObjectName`: どちらもddsファイル名(拡張子抜き)と同じにする
   ファイル名は`m_PackageName`の`text`と同じにして`XLPs`フォルダへ保存
4. **`Mod.Art.xml`(Game Art Specification)の`UITexture`ライブラリに追記**:
   ```xml
   <Element>
     <libraryName text="UITexture"/>
     <relativePackagePaths>
       <Element text="UILeaders"/>
       <Element text="UI/RegLoss_Icons.blp"/> <!-- ★ビルド後に出来上がるblpパス。まだ存在しなくてもこの形式で書く -->
     </relativePackagePaths>
   </Element>
   ```
5. dds/tex/xlpをModBuddyプロジェクトのTextures/XLPsフォルダへ登録(Solution Explorerに追加)
6. `Icons.xml`の`IconTextureAtlases`/`IconDefinitions`は今まで通りの書き方でよい(`Filename`はddsファイル名のまま)
7. **ModBuddyでビルド**。成功すると`Platforms/{Windows,MacOS}/BLPs/{SHARED_DATA,UI}/[m_PackageNameから決まる名前].blp`が生成される。**出力先はプロジェクトのソースフォルダではなく`Documents/My Games/Sid Meier's Civilization VI/Mods/<.civ6projのName>/`**(ModBuddyがローカルテスト用に直接デプロイする場所)。`.blp`はここからコピーして本体Modへ持っていく
8. ビルドが失敗したら**`cooker.log`**(MOD開発環境フォルダ直下)を見る。大半は`.tex`内のdds名指定ミス

## ModBuddyはOSSではない

Firaxis製の閉鎖ソースツール。Visual Studio 2013ベースのIDEとして無料配布されている(Steam「Sid Meier's Civilization VI Development Tools」, AppID `404350`)。`.blp`フォーマット自体もFiraxis独自バイナリで、コミュニティによる完全な逆コンパイラ/エンコーダは存在しない。「コンパイル部分だけ抜き出す」ことはできないが、ビルドの実体は`ModBuddy/Extensions/Application/Civ6.Tasks.dll`という独自MSBuildタスクなので、理論上はVSのGUIを開かずmsbuild.exeから`.civ6proj`を直接ビルドできる可能性がある(未検証)。

**AssetEditor(`AssetModTools/AssetEditor/AssetEditor.exe`)は単体起動できない**(引数エラーになる)。ModBuddyでソリューションを開いた状態からメニュー経由(`Shell ArtTools`拡張が提供する「Launch Asset Editor」的なコマンド、`requiresOpenSolution`)で呼び出す必要がある。ただし上記の「実物`.tex`/`.xlp`をコピーして2箇所書き換える」方式ならAssetEditorのGUI操作自体が不要なので、この起動問題は回避できる。

Development Assets(AppID `597260`, 7GB/展開27GB)は上記2-3節のコピー元として**必須**(先送りにできない)。

## 実機で最終確認できた完全な手順(2026-09-19、リーダー選択画面のバッジアイコン表示まで確認済み)

上記1〜8節の手順に加えて、**`.dep`ファイルが実在し`<Files>`に列挙されていないと`Modding.log`に`ERROR: Invalid file reference in action, did you forgot to add it in <Files>? - xxx.dep`が出て、UpdateArtアクションごと無視される**(ModBuddyでBuildしても`.dep`が自動生成されないケースがあった、原因不明・未解決)。`.dep`(`AssetObjects..GameDependencyData`)は`Mod.Art.xml`(`AssetObjects::GameArtSpecification`)のタグ名をPascalCaseに機械的に変換しただけの中身だと実物ファイル同士の比較で確認できた:

- `<id>`→`<ID>`、`<requiredGameArtIDs>`→`<RequiredGameArtIDs>`(順序はID直後に来る。Art.xmlでは最後にあるので並べ替えが必要)
- `<artConsumers>`→`<SystemDependencies>`(子要素も`consumerName`→`ConsumerName`等とPascalCase化)
- `<gameLibraries>`→`<LibraryDependencies>`(`libraryName`→`LibraryName`、`relativePackagePaths`→`PackageDependencies`)
- 上記2つの間に`<ArtDefDependencies>`という、Art.xmlには無いセクションが追加される(ArtDef同士の依存関係グラフ。自前のArtDefを持たないなら空`<ArtDefDependencies/>`でよい)

この変換をやってくれるのが`tools/png2dds/gen-dep.ts`(`npm run gen-dep -- <Mod.Art.xml> <out.dep>`、実行にはTypeScript即時実行ツール`tsx`を使う。`tools/png2dds/`で`npm install`済みであること)。ModBuddyのビルドが`.dep`を生成してくれない場合はこれで自作し、`.modinfo`の`<Files>`に追加すればよい。

civ6mod-hololive-regloss本体での実際の配線:
- リポジトリ直下に`civ6mod-hololive-regloss.dep`(gen-dep.jsで生成、`Hololive ReGLOSS`名義・本体のGuidに書き換え済み)
- `Platforms/{Windows,MacOS}/BLPs/UI/RegLoss_Icons.blp`(`tools/IconBuild`をModBuddyでビルドして生成)
- `.modinfo`の`FrontEndActions`/`InGameActions`双方に`<UpdateArt><File>civ6mod-hololive-regloss.dep</File></UpdateArt>`
- `<Files>`に`.dep`と両プラットフォームの`.blp`を列挙

アイコン画像自体のビルドパイプライン(`tools/IconBuild/`)は本体Modとは別のModBuddyプロジェクトとして分離してあり、本体の`.modinfo`(動作実績のあるスキーマ)をModBuddyに触らせないための隔離。`tools/png2dds/`の各スクリプト(`npm run build-icons`→DDS生成、`npm run gen-tex`→実物`.tex`テンプレート複製、`npm run gen-xlp`→XLP生成、`npm run gen-dep --`→`.dep`生成。いずれもTypeScript+`tsx`製、初回は`tools/png2dds/`で`npm install`が必要)を順に実行→ModBuddyで`tools/IconBuild/RegLoss_IconBuild.civ6sln`を開いてBuild→`Documents/My Games/.../Mods/RegLoss_IconBuild/`に出力された`.blp`を本体にコピー、が一連の再生成手順。アイコン画像を差し替える際はこの流れを繰り返す。

ビルド確認用に`Documents/My Games/.../Mods/RegLoss_IconBuild/`が独立した空Modとして残るが、これは単なるModBuddyのローカルデプロイ先(Civ6が起動時に毎回スキャンするだけの場所)なので、ModBuddy側で何か「登録解除」する必要はなく、フォルダを直接削除するだけでMod一覧から消える。

## civ6wiki.info記載の手順との照合

`https://civ6wiki.info/?MOD/作成方法/新文明・指導者/指導者アイコンの作り方`および`.../文明アイコン`(2020年執筆)は、上記の実機検証結果と手順の骨格(dds用意→tex流用→xlp記述→Mod.Art.xml登録→xmlでIconTextureAtlases/IconDefinitions→ビルド)は一致する。ただし以下の差分・追加情報がある:

- **指導者アイコンのサイズ一覧が古い**: wikiは256,80,64,55,50,45,32の7サイズのみを挙げているが、`48`が抜けている。本リポジトリの実際の`Art/Icons/Icons.xml`(および実働Mod群)では`48`込みの8サイズが必須。おそらく執筆時点(2020年)以降のDLC/GSアップデートで追加されたサイズと思われるので、**wikiのサイズ一覧より本ファイル冒頭の8サイズを優先すること**
- **texファイルのコピー元は指導者用/文明用で別々のバニラサンプルを使う**: 指導者アイコンは`Montezuma*.tex`、文明アイコンは`CivAztec*.tex`(いずれもモンテスマ/アステカ)。本質的にはどの文明/指導者のtexでも構わないが、著者は同一指導者のペアで統一している
- **文明アイコンの45x45サイズだけ見た目の仕様が違う**: wiki本文にも明記されている(「他のサイズは白と透過だけで描かれていますが、45x45のものだけ色が付いています」)。バニラでは45x45以外が白抜き+透過のシルエットで、45x45だけ着色されたフルカラーになっている(社会制度ツリー等での使用箇所が異なるためと推測)。**ただしwikiは「そう作れ」という事実だけを書いており、理由(なぜ白+透過である必要があるか)にも、フルカラー素材から白+透過シルエットへの変換手順にも触れていない**。この2点はこのファイル自体を実際に踏み抜いて解決した内容なので、次節「白シルエット化の実装」を参照
- xlpの`m_PackageName`は指導者用・文明用アイコンをまとめて1つのパッケージ(例: `UI/hogehoge_Icons`)にする運用で書かれている。本リポジトリの`RegLoss_Icons`も同じ「1パッケージにまとめる」方式

## 英語圏ガイド(Sailor Cat's Modding Tutorial)との照合

出典: `https://steamcommunity.com/sharedfiles/filedetails/?id=2420858843`(Steamガイド本体。CivFanaticsフォーラムの`https://forums.civfanatics.com/threads/making-and-implementing-icons-and-leader-images.668308/`は概要のみでSteamへのリンクのため、本文取得にはSteam側を直接curlする必要があった)。civ6wiki.infoとは別系統の英語チュートリアルで、**AssetEditorのGUI操作を正面から使う手順**を書いている点が本ファイル2〜3節(実物`.tex`/`.xlp`をテキストエディタでコピー編集するショートカット)と対照的。**このリポジトリで実機確認した内容ではない**ので、既存の実機検証結果と食い違う点は鵜呑みにせず「要検証」として扱う。

- **「.pngだけでよく、.dds/.texを手書きする必要はない」との記述**: 原文 "Don't worry about saving as .dds. You don't need to anymore, so it isn't worth the effort. .png only." — AssetEditorでXLPを開き、Entriesパネルの「Add Source File」でPNGを直接選択→Exporting Classを`UserInterface`に設定→Import、という操作をすると内部でdds変換+`.tex`相当の処理までやってくれる、という趣旨。本文中に`.tex`ファイルを手で書く工程が一度も出てこない。**本プロジェクトの実機検証(PNG直置き/DDS直置きが効かず「？」フォールバックになった経緯、本ファイル冒頭)と一見矛盾する**が、それは「ローズファイル直置き」(XMLに書くだけでビルド通さない)を試した話で、こちらは「AssetEditorのImportボタンを押してビルドする」話なので厳密には別の手順。**乗り換える前に、このAssetEditor Import経由の手順を小さく検証してから判断すること**(現状の`tools/png2dds`パイプラインは実際にリーダー選択画面まで動作確認済みなので、置き換えは実証してから)
- **`UserInterface.artdef`トリック**: Artdefを消費する他要素(Leader等)を持たないアイコン専用プロジェクトでもModBuddyがBLPを生成してくれない問題への対処として、以下のartdefを追加する方法が載っている。本プロジェクトが`tools/IconBuild`をわざわざ別ModBuddyプロジェクトに分離している理由(9行目)への、より簡単な代替になる可能性がある(未検証):
  ```xml
  <AssetObjects::ArtDefSet>
      <m_Version><major>3</major><minor>0</minor><build>215</build><revision>207</revision></m_Version>
      <m_TemplateName text="UserInterfaceBLPs"/>
      <m_RootCollections/>
      <m_BLPReferences>
          <Element>
              <xlpFile text="Atlas.xlp"/>
              <blpPackage text="Project Name Here.blp"/>
              <xlpClass text="UITexture"/>
          </Element>
      </m_BLPReferences>
  </AssetObjects::ArtDefSet>
  ```
- **`CivilizationIcon`/`CivilizationAbilityIcon`は「白+透過(アルファ画像)」と明記**(Config节: "The alpha image of your civilization's icon (white with transparent background)")。これは本ファイル末尾の未解決色バグ調査で辿り着いた`SetColor`着色の仕組み(白+透過→ゲーム側でプレイヤーカラーを掛け合わせる)を、別系統の情報源からも裏付ける内容。ただし本プロジェクトでは白シルエット化を試して別の不具合(オレンジ/紺色化)が出て撤回済みなので、「白+透過が仕様として正しい」ことと「うちの未解決バグの原因」は別問題として扱うこと
- **Leader Portrait Iconsのサイズ一覧も48が抜けている**(256, 80, 64, 55, 50, 45, 32の7サイズ)。civ6wiki.infoと同じ抜け方なので、**本ファイル冒頭の8サイズ(48込み)を優先する**という既存の結論をそのまま維持してよい
- **thecrazyscot's "Mod Art Generator"というArt.xml自動生成ツールへの言及**(CivFanaticsフォーラム内、URL自体は本文に埋め込みリンクのみで直接は取得していない)。`tools/png2dds/gen-dep.ts`相当の作業を自動化する第三者ツールの可能性があるが、存在の言及を確認しただけで中身は未調査
- **DiplomacyInfoテーブルへの直接INSERTは非推奨**("Remove any inserts into the DiplomacyInfo table. Some civilization and leader guides use this, and it conflicts with this guide.")。複数の英語ガイドを組み合わせて実装する場合はテーブルの重複INSERTに注意、という一般的な注意喚起

## 【試して撤回した】白シルエット化(2026-09-19〜20実機検証、最終的にフルカラー1本に戻した)

一時期、文明アイコンを45px以外だけ「白+透過のシルエット」化する実装を入れたが、後述の未解決問題(リーダー選択画面の能力アイコンが不安定)が出たため**最終的に全サイズフルカラー1枚(`ichijou-corporation-logo-circle.png`)に戻した**。現在の`tools/png2dds/gen-icon-sources.ts`はフルカラーのみで、白シルエット化コード(`toWhiteSilhouette`)は削除済み。ただし調査で分かった技術的知見(`SetColor`の着色メカニズム、DDS直接検証の方法、GIMPでの変換手順)は将来別のReGLOSSメンバーで再度必要になる可能性があるため、以下に経緯ごと残す。

### 分かった仕組み(SetColor着色、2026-09-19実機検証)

文明アイコンを「白+透過のシルエット」で作る必要がある**理由**は、ゲーム側UI Luaが実行時に`:SetColor(プレイヤーカラー)`でRGBを掛け合わせて着色するから。素材が既にフルカラーだと二重に色が乗って破綻する(プレイヤーカラーによっては背景に同化してほぼ見えなくなる)。この仕組みはwikiに書かれておらず、Civ6本体の`Base/Assets/UI/Instances/LeaderIcon.lua`と`Instances/CivilizationIcon.lua`を実際に読んで確認した:

```lua
-- LeaderIcon.lua (外交パネル/プレイヤーリスト等で使用)
self.Controls.CivIcon:SetIcon("ICON_"..pPlayerConfig:GetCivilizationTypeName());
...
local backColor, frontColor = UI.GetPlayerColors( playerID ); -- (Primary, Secondary)の順
self.Controls.CivIndicator:SetColor(backColor);   -- 円形の背景をプレイヤーカラーで着色
self.Controls.CivIcon:SetColor(frontColor);        -- アイコン本体をセカンダリカラーで着色
```

`Instances/CivilizationIcon.lua`(ランキング画面・交易画面・エスピオナージ画面等の汎用文明バッジ)、`Menus/InGameTopOptionsMenu.lua`(ESCメニュー上部)も同じ`SetColor(secondaryColor)`パターン。45x45だけは技術・社会制度ツリーで生のまま(着色なし)表示されるため、この45pxだけフルカラーのままにする。

**裏取り**: バニラの`Sid Meier's Civilization VI SDK Assets\Civ6\pantry\Textures\CivAztec22.dds`/`CivAztec32.dds`をDDSバイナリレベルで直接読むと、全不透明ピクセルのRGBが`(255,255,255)`固定でアルファだけが形状を表現していた。`CivAztec45.dds`だけはRGBに実際の色(濃紺系)が入っていた。DDSは128バイトヘッダ+ABGR8生ピクセル(`tools/png2dds/png2dds.ts`のコメント参照)なので、Node.jsで`readFileSync`して128バイト目以降を読むだけで検証できる。

### ハマった実例: フルカラーの円形ロゴ素材を単純に白色化すると破綻する

一条コーポレーションのロゴ(`Art/Source/ichijou-corporation-logo-circle.png`)は、円の内側が最初から**全ピクセル不透明**(アルファは円形マスクのみを表現し、ロゴの形自体はRGBの色コントラストで表現)という作りだった。ここで「既存のアルファを維持したままRGBだけ白に強制する」という素朴な実装(`toWhiteSilhouette`: 全ピクセルのRGBを255に上書き、アルファは無変更)を書くと、円全体が単なる白い(またはプレイヤーカラーで塗られた)円になり、ロゴの意匠が完全に消えた(外交パネルでは黒、文明選択画面では白一色の円として症状が出た)。

**正しい変換**は「アルファチャンネル自体を作り直す」こと: 白背景(このロゴはグラデーション背景+白抜きではなく、白背景+色付きロゴという配色だった。配色の思い込みで判断せず、`civ6wiki.info`のブランドガイドライン画像等の一次資料で実際の配色を確認すること)を透明に、色が付いている部分(ロゴ本体)を不透明にする。GIMP 3.2での手順:

1. レイヤー → 透明部分 → アルファチャンネルの追加
2. 色 → 色域を透明に(Color to Alpha)、対象色を白(#FFFFFF)に指定してOK
   - 白に近いほど透明、彩度が高いほど不透明になる。境界のアンチエイリアスも自動でぼける
3. **元の配色が淡い(白に近い)場合、アルファの最大値が255まで伸びず薄くなることがある**(このロゴは最大90/255だった)。色 → レベル → チャンネルを「アルファ」にして、入力の白側スライダーを実際の最大値まで下げて255まで伸ばす
4. 書き出したRGBの正確さは気にしなくてよい(後段パイプラインの`toWhiteSilhouette`がどのみちRGBを白に上書きする)。**アルファの形だけ**が最終的な見た目を決める

### 検証方法(かき捨てスクリプトの作り方)

手直しした元画像が正しいか確認するには、実際にゲーム内のレイヤー構造(`CivIndicator`にプレイヤーカラーPrimary、`CivIcon`にSecondary、RGB強制白)を模した合成プレビューを作ると一目で分かる。pngjsで読み込み、`alpha/255`をカバレッジとして「255(白) * coverage + backingColor * (1 - coverage)」を各チャンネルで計算し、円形のプレイヤーカラー背景に合成したPNGを書き出して`Read`ツールで見る、というのが最短。透過そのものを見たいだけなら暗い背景に合成するだけでも十分(`Read`ツールは透過PNGを白背景で表示するため、素の透過確認には使えない)。このスクリプトは特定のロゴ専用の彩度ヒューリスティックを含めずに保つこと(将来の他ReGLOSSメンバーの文明アイコンにも使い回せるよう、アルファチャンネルを検証するだけの汎用ツールに留める)。

### 円の外側は数学的に正確な円形マスクでアルファ化する(これは撤回後も有効な知見)

文明アイコンは(白シルエット化していた頃の45px版に限らず、今の全サイズフルカラー版でも)**バニラ/他Modの指導者・文明バッジと並んだときに見た目が揃っている必要がある**(文明選択画面のドロップダウン等、公式文明・他Mod文明のバッジと横に並ぶ)。GIMPで手動マスクした円は縁がガタつきやすく、単体で見ている分には気づかないが、他の綺麗な円形バッジと並べると一目瞭然に「浮いて」見える。指導者ポートレートに使っている`maskToInscribedCircle`(中心からの距離で半径判定、境界は半ピクセルでフェード)を文明アイコン側にも適用して解決した(`gen-icon-sources.ts`の`clipToCircle: true`)。

## 未解決問題: リーダー選択画面の能力アイコン色/パウズメニューの黒表示(2026-09-20時点)

文明アイコン(`ICON_CIVILIZATION_REGLOSS_ICHIJOU`)が、ゲーム側で`SetColor`により着色される場面で症状が変わる。ソース素材の作り方を変えても解決しておらず、**原因未特定のまま**。次にこの領域を触るセッションは、以下の再現条件と切り分け済み事項を先に読んでから調査すること(同じ道を辿り直さないため)。

### 症状(ソース素材のパターンごと)

- **白シルエット版(45px以外を`toWhiteSilhouette`で白+透過化)**: リーダー選択画面の文明能力アイコンとパウズメニューのバッジが、**うちのピンクではなく常にオレンジ/紺色系になる**
- **フルカラー版(全サイズ`ichijou-corporation-logo-circle.png`)**: リーダー選択画面の文明能力アイコンの色が変(フィルターがかかったような発色)。パウズメニューは真っ黒

どちらのパターンでも「外交パネル/プレイヤーリストのバッジ」「文明選択画面のバッジ(45px)」は正常。**リーダー選択画面の能力アイコンとパウズメニューの2箇所だけ**が問題を起こす。

**重要な手がかり**: 白シルエット版で出る「オレンジ/紺色」は、バニラの`Base/Assets/UI/Colors/PlayerColors.xml`に実在する汎用色プール(`Usage="Major"`)の`PLAYERCOLOR_ORANGE`(オレンジ+白)・`PLAYERCOLOR_DARK_BLUE`(紺+白)と一致する。うちの`PlayerColors`エントリ(`LEADER_REGLOSS_ICHIJOU_RIRIKA`、ピンク+白)ではない。**つまりこの2箇所は、そもそもうちの`PlayerColors`エントリを見ておらず、プレイヤー枠に自動割り当てされる汎用色プールから色を取っている**可能性が高い。フルカラー版で見える「フィルターがかかったような色」「黒」も、同じ汎用色による着色(オレンジ/紺をフルカラー画像に掛け合わせた結果、パウズメニューでは暗い色同士の掛け合わせでほぼ黒に見えている)である可能性がある。

**Civ6/Jersey System側の一般的な制限ではなく、本Mod固有の問題と確定**: インストール済みの他Hololive Mod(湊あくあ等)は、この2箇所(パウズメニュー/能力パネル)でもキャラのイメージカラーに近い固定のPrimary/Secondaryで正しく着色されている(2026-09-20、本人による目視確認)。つまり「Jersey System自体が全Modで壊れている」わけではなく、**うちの`PlayerColors`エントリだけが解決に失敗している**。原因不明のまま次に持ち越す場合、Discordのmod制作者コミュニティ等で他の実装者に聞く際もこの前提(他Modは正常、うちだけ異常)で質問すること。

### 切り分け済み(原因ではないと確認できたこと)

- **文明アイコンのサイズ一覧の過不足** ではない(本ファイル冒頭の12/8サイズは正しい)
- **`PlayerColors`にAlt1〜Alt3(Gathering Stormの「Jersey System」、同じ文明が複数プレイヤーで重複した際の代替色。未設定だと一部UIで色解決が失敗するとされる既知の仕様)を追加しても直らない**。追加自体はGitHub公開されている完成度の高い指導者Mod2本(`KevinLiuxy/Senren-Banka-Murasame-Civilization-6`、`dwughjsd/LandsolYuni_civ6mod`)と比較して構造的な差分なし(どちらもAlt1〜3を設定し、`Config.xml`相当に`PlayerColor`列を明示していない、という同じパターン)
- **Alt1〜3を属性(`<Row Type="..." Alt1PrimaryColor="..."/>`)ではなく子要素(`<Row><Type>...</Type><Alt1PrimaryColor>...</Alt1PrimaryColor></Row>`)で書いても直らない**。DLC本体(`Expansion2_PlayerColors.xml`)や他Modの実例は子要素形式だったため試したが、症状(オレンジ/紺色)は変わらなかった
- **`Config.xml`のPlayersテーブルに`PlayerColor`列を明示追加しても直らない**(このテーブルはフロントエンド選択画面専用で、実ゲーム内のプレイヤーカラー解決とは別経路の可能性がある)
- **Mod競合ではない**: 他のHololive Mod群を全部無効化し、本Mod単体(+依存先のGathering Storm)の新規ゲームでもパウズメニューは黒いまま
- **ゲーム開始直後のタイミング問題でもなさそう**: 他Mod(フルカラーのみの素材)は新規ゲーム開始直後からパウズメニューで正しく表示される(「1パターン固定」=着色されず素材そのままの色で表示されている可能性が高い)ため、うちだけがタイミングで遅延して直る、という仮説は他Modとの比較で弱い
- **アイコン名前解決の失敗ではない**: `UserInterface.log`に`IconManager is unable to find the icon`のようなエラーは一切出ていない。`Database.log`に`[ColorManager] ERROR: UNIQUE constraint failed: Colors.Type`(`COLOR_UNKNOWN`関連)が出るが、`.modinfo`のFrontEnd/InGame両アクションへの`Colors.xml`二重登録は他の`Config`/`Icons`/`Art`アクションとも共通する正常な構成で、このエラー自体もうちの`Colors.xml`の内容とは直接一致しない(原因不明のノイズの可能性が高い)
- **`InGameTopOptionsMenu.lua`(パウズメニュー)のロジック自体は`Base/Assets/UI/Menus/InGameTopOptionsMenu.lua`が実行されている**(Expansion2の`UI/Replacements/Expansion1_InGameTopOptionsMenu.lua`は`CivIcon`/`RefreshIconData`/`PlayerColor`に一切触れていないため上書きされていない)。このコードは`UI.GetPlayerColors(m_pPlayer:GetID())`で色を取得し`Controls.CivIcon:SetColor(m_secondaryColor)`を呼ぶだけの単純な作りで、外交パネル(`LeaderIcon.lua`)と全く同じ関数呼び出しパターンだが、外交パネルは正常でパウズメニューだけ黒くなる。メニューを開くたび(`SetupButtons()`経由)に毎回再計算される作りなので、初回ロード時の一度きりの初期化不良でもない

### 未検証の残った方向性

- **なぜ「Major」汎用色プールが使われるのか**が次に追うべき本丸。`UI.GetPlayerColorValues(info.PlayerColor, info.PlayerColorIndex or 0)`(`PlayerSetupLogic.lua`851行目)や`UI.GetPlayerColors(m_pPlayer:GetID())`(`InGameTopOptionsMenu.lua`)が、うちの`PlayerColors.Type="LEADER_REGLOSS_ICHIJOU_RIRIKA"`エントリを見つけられず、Civ6標準のフォールバック(プレイヤー枠の並び順等でMajor色プールから自動割り当て)に落ちている可能性が高い。一方で全く同じ`UI.GetPlayerColors(playerID)`を使う外交パネル(`LeaderIcon.lua`)は正常にピンクを表示するので、**同じ関数でも呼び出し元によって解決結果が違う**(playerIDの解決タイミングか、Civilizations/Leadersテーブル側の何らかの登録漏れが影響している可能性)
- パウズメニューのLuaに一時的なデバッグ用の上書き(`UI/Replacements/`相当の仕組みで`RefreshIconData`を再定義し、`m_primaryColor`/`m_secondaryColor`の実際の値を`print()`でLua.logに出力する)を仕込み、実際に何が返ってきているかを直接観測する。Civ6のUI Context上書きの仕組み自体をこのリポジトリでまだ使ったことがないため、そこから調べる必要がある
- リーダー選択画面の能力アイコン(`PlayerSetupLogic.lua`849行目、`civAbility.Icon:SetIcon(info.CivilizationIcon)`)は`info.CivilizationAbilityIcon`ではなく`info.CivilizationIcon`(通常の文明バッジ)を見ている、という点は特定済み
