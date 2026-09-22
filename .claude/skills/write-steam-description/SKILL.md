---
name: write-steam-description
description: Civ6 Mod本体のSteam Workshop掲載ページ用の紹介文(日本語・英語)を書く/更新する。「Steam説明文を更新して」「Steamの紹介文に新しいリーダーを追加して」「Workshopページの説明を書いて」「Steam向けの説明文を書きたい」と言われたときに必ず使う。本人から明示的に依頼されたときだけ発動し、他Skill(add-unique-content等)の完了を検知して自動的に割り込むことはしない。
---

# write-steam-description

Steam Workshopの掲載ページに載せる紹介文(日本語・英語)を更新する。

## ソース・オブ・トゥルースは`ja.md`、`en.md`はその翻訳

`docs/steam-description/ja.md`が正本。`en.md`は独立に書かず、`ja.md`を翻訳したテンプレートとして扱う。更新の順番は必ず「`ja.md`を更新 → その差分だけを`en.md`に翻訳反映」。`en.md`だけを単独で書き換えない(2つのファイルを別々の判断で編集すると内容が食い違っていく)。

Steam Workshopの編集画面には直接書き込む手段がない(APIも自動操作もない)ため、このSkillの作業範囲は上記ファイルの更新までで、そこから先(Steam側へのコピペ)は本人が手動で行う。更新後は「Steam側にもコピペしてください」と一言添えること。

なお、この2ファイルの更新は現時点では手作業(Claudeが直接編集)ベースで行う。将来リーダー数が増えて転記量が無視できなくなったら、LOCタグの抽出だけを機械化する軽量スクリプトの追加を検討する(セクションの組み立てや隠し効果注記の判断はリーダーごとに特殊事情があり自動化しにくいため、あくまで抽出だけを機械化する想定)。

## ステップ1: `ja.md`を更新する — 新しい文章を創作せず、LOCテキストからほぼ逐語転記する

実際に一条莉々華のセクションと`Text/ja_JP/Text.xml`の該当LOCタグを比較すると、Steam説明文はゲーム内テキストの言い換えではなく、`[ICON_Xxx]`タグを取り除いただけのほぼ逐語転記だと分かる。つまり新規リーダーのセクションを書くときも、独自に説明文を考える必要はなく、対応するLOCタグの値を拾って組み立てるだけでよい。

新規リーダー(文明タグ`<CIV>`・指導者タグ`<LEADER>`・ユニークユニット等のタグ`<UNIT>`)を追加する場合、`Text/ja_JP/Text.xml`から以下を引用する:

| Steam説明文の要素 | 対応するLOCタグ |
|---|---|
| 文明固有能力の名前・説明 | `LOC_TRAIT_CIVILIZATION_<CIV>_NAME` / `_DESCRIPTION` |
| 指導者固有能力(通常時)の名前・説明 | `LOC_TRAIT_LEADER_<LEADER>_NAME` / `_DESCRIPTION` |
| 指導者固有能力(独占・大企業モード時)の名前・説明(該当する能力がある場合のみ) | `LOC_TRAIT_LEADER_<LEADER>_MONOPOLIES_NAME` / `_DESCRIPTION` |
| ユニークアジェンダの名前・説明 | `LOC_AGENDA_<LEADER>_NAME` / `_DESCRIPTION` |
| ユニークユニット/区域/施設/建造物の名前・副題・説明 | ユニットなら`LOC_UNIT_<UNIT>_NAME`(区域/施設/建造物なら`LOC_DISTRICT_*`/`LOC_IMPROVEMENT_*`/`LOC_BUILDING_*`)、副題は`LOC_TRAIT_CIVILIZATION_UNIT_<UNIT>_NAME`等、説明は対応する`_DESCRIPTION` |

転記時のルール:
- `[ICON_Xxx]`タグと、それに伴う前後の余分なスペースを削除する。
- タグを削除すると文がぶつ切りになる箇所(例: 「ボーナス資源は+3」で言い切ると不自然な場合に「追加で得る」を補うなど)は、事実関係・数値を一切変えない範囲でのみ、最小限の言い換えをしてよい。数値や効果の対象を変更してはならない。
- アジェンダの隠し効果(不平の減衰速度倍加など、LOCテキストには書かれていないゲームメカニクス上の注記)がある場合は、実装時のXML(`Agendas.xml`等、`implement-leader-abilities` Skillの知識)を確認し、一条莉々華セクションと同じ書き方(丸括弧で「隠し効果、〜と同じ仕組み」と注記)で追記する。存在しないことを確認せずに省略しない。

## ステップ2: `en.md`に翻訳反映する

`ja.md`で変更した箇所だけを英語に翻訳して`en.md`に反映する。ゼロから英作文せず、以下を使う:

- **能力名・アジェンダ名・ユニット名などの固有名詞**は、`Text/en_US/Text.xml`に既に公式ローカライズ済みの英語(`LOC_TRAIT_CIVILIZATION_<CIV>_NAME`等の`en_US`版)が存在するので、翻訳し直さずそれをそのまま使う。ここを独自に意訳すると、ゲーム内表示とSteamページで名前が食い違ってプレイヤーを混乱させる。
- **説明文の地の文**は`ja.md`の記述を翻訳する。`Text/en_US/Text.xml`の対応する`_DESCRIPTION`(`[ICON_Xxx]`を除いたもの)が既に自然な英訳として存在するので、内容が一致するかの裏取りに使ってよい(このSkillの対象は公式ローカライズ文体ではなくWorkshopページのくだけた紹介文なので、`write-official-en-text-style` Skillの対象外)。
- **開発中です/対応言語/バランスについて等の自由記述部分**(LOCタグに存在しない、Workshopページ固有の文章)は、`en.md`の既存の訳文をテンプレートとして使い回す。意味が変わった差分だけを訳し直し、変わっていない文をゼロから再翻訳しない。

## フォーマット: プレースホルダーに沿って埋める

新規リーダーのセクションは、一条莉々華の例をなんとなく真似るのではなく、以下のプレースホルダーテンプレートの`<>`部分を対応するLOCタグの値(ステップ1の表を参照)で機械的に埋める形で書く。空白・改行・括弧の位置もテンプレート通りに揃える(JP/ENで括弧前のスペースの有無が違う点に注意)。

**日本語版(`ja.md`)**:

```
【<指導者名>(<文明名>)】

文明固有能力「<文明固有能力の名前>」
<文明固有能力の説明>

指導者固有能力(通常時)「<指導者固有能力(通常時)の名前>」
<指導者固有能力(通常時)の説明>

指導者固有能力(独占・大企業モード時)「<指導者固有能力(独占・大企業モード時)の名前>」
<指導者固有能力(独占・大企業モード時)の説明>

ユニークアジェンダ「<アジェンダ名>」
<アジェンダの説明>
(隠し効果があれば、丸括弧で追記)

ユニークユニット「<ユニット名>」(<ユニットの副題>)
<ユニットの説明>
```

**英語版(`en.md`)**: 見出し・ラベルが変わり、`(`の前に半角スペースが入る点がJP版と違う。

```
[<Leader Name> (<Civilization Name>)]

Civilization Ability: <Civilization ability name>
<Civilization ability description>

Leader Ability (default): <Leader ability (default) name>
<Leader ability (default) description>

Leader Ability (Monopolies & Corporations mode): <Leader ability (Monopolies) name>
<Leader ability (Monopolies) description>

Agenda: <Agenda name>
<Agenda description>
(Hidden effect note in parentheses, if any)

Unique Unit: <Unit name> (<Unit subtitle>)
<Unit description>
```

指導者固有能力(独占・大企業モード時)がいないリーダーはそのブロックごと省略する。UD/UI/UBがあれば「ユニークユニット」/`Unique Unit:`のブロックを`ユニークアジェンダ`ブロックの後に必要な数だけ追加する(区域は「固有区域」/`Unique District:`、施設は「固有施設」/`Unique Improvement:`、建造物は「固有建造物」/`Unique Building:`)。

## その他、リーダー追加のたびに見直す箇所

- 冒頭の`【開発中です】`/`[Work in Progress]`: 実装済みリーダーの一覧を更新する。
- 全ReGLOSSメンバーの実装が完了したら、末尾の「今後、ReGLOSSの他メンバーも...」/"More ReGLOSS members..."の一文を削除する。
- `【対応言語】`/`[Language]`は`add-language` Skillで新しい言語を追加したときだけ更新対象。通常のリーダー追加では触らない。
- `【バランスについて】`/`[Balance Note]`は基本的に固定文なので、方針変更の指示がない限り触らない。

日本語版と英語版は常に同じ構成・同じセクション数を保つこと。片方だけ更新して終わらせず、両言語をまとめて更新する。
