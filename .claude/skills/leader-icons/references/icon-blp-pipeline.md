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

この変換をやってくれるのが`tools/png2dds/gen-dep.js`(`node gen-dep.js <Mod.Art.xml> <out.dep>`)。ModBuddyのビルドが`.dep`を生成してくれない場合はこれで自作し、`.modinfo`の`<Files>`に追加すればよい。

civ6mod-hololive-regloss本体での実際の配線:
- リポジトリ直下に`civ6mod-hololive-regloss.dep`(gen-dep.jsで生成、`Hololive ReGLOSS`名義・本体のGuidに書き換え済み)
- `Platforms/{Windows,MacOS}/BLPs/UI/RegLoss_Icons.blp`(`tools/IconBuild`をModBuddyでビルドして生成)
- `.modinfo`の`FrontEndActions`/`InGameActions`双方に`<UpdateArt><File>civ6mod-hololive-regloss.dep</File></UpdateArt>`
- `<Files>`に`.dep`と両プラットフォームの`.blp`を列挙

アイコン画像自体のビルドパイプライン(`tools/IconBuild/`)は本体Modとは別のModBuddyプロジェクトとして分離してあり、本体の`.modinfo`(動作実績のあるスキーマ)をModBuddyに触らせないための隔離。`tools/png2dds/`の各スクリプト(`build-icons.js`→DDS生成、`gen-tex.js`→実物`.tex`テンプレート複製、`gen-xlp.js`→XLP生成、`gen-dep.js`→`.dep`生成)を順に実行→ModBuddyで`tools/IconBuild/RegLoss_IconBuild.civ6sln`を開いてBuild→`Documents/My Games/.../Mods/RegLoss_IconBuild/`に出力された`.blp`を本体にコピー、が一連の再生成手順。アイコン画像を差し替える際はこの流れを繰り返す。

ビルド確認用に`Documents/My Games/.../Mods/RegLoss_IconBuild/`が独立した空Modとして残るが、これは単なるModBuddyのローカルデプロイ先(Civ6が起動時に毎回スキャンするだけの場所)なので、ModBuddy側で何か「登録解除」する必要はなく、フォルダを直接削除するだけでMod一覧から消える。

## civ6wiki.info記載の手順との照合

`https://civ6wiki.info/?MOD/作成方法/新文明・指導者/指導者アイコンの作り方`および`.../文明アイコン`(2020年執筆)は、上記の実機検証結果と手順の骨格(dds用意→tex流用→xlp記述→Mod.Art.xml登録→xmlでIconTextureAtlases/IconDefinitions→ビルド)は一致する。ただし以下の差分・追加情報がある:

- **指導者アイコンのサイズ一覧が古い**: wikiは256,80,64,55,50,45,32の7サイズのみを挙げているが、`48`が抜けている。本リポジトリの実際の`Art/Icons/Icons.xml`(および実働Mod群)では`48`込みの8サイズが必須。おそらく執筆時点(2020年)以降のDLC/GSアップデートで追加されたサイズと思われるので、**wikiのサイズ一覧より本ファイル冒頭の8サイズを優先すること**
- **texファイルのコピー元は指導者用/文明用で別々のバニラサンプルを使う**: 指導者アイコンは`Montezuma*.tex`、文明アイコンは`CivAztec*.tex`(いずれもモンテスマ/アステカ)。本質的にはどの文明/指導者のtexでも構わないが、著者は同一指導者のペアで統一している
- **文明アイコンの45x45サイズだけ見た目の仕様が違う**: バニラでは他サイズが白抜き+透過のシルエットなのに対し、45x45だけ着色されたフルカラーになっている(社会制度ツリー等での使用箇所が異なるためと推測)。文明アイコン一式を作る際はこの1サイズだけ別デザインが必要になる点に注意
- xlpの`m_PackageName`は指導者用・文明用アイコンをまとめて1つのパッケージ(例: `UI/hogehoge_Icons`)にする運用で書かれている。本リポジトリの`RegLoss_Icons`も同じ「1パッケージにまとめる」方式
