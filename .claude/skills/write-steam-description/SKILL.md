---
name: write-steam-description
description: Civ6 Mod本体のSteam Workshop掲載ページ用の紹介文(日本語・英語)を書く/更新する。「Steam説明文を更新して」「Steamの紹介文に新しいリーダーを追加して」「Workshopページの説明を書いて」「Steam向けの説明文を書きたい」と言われたときに必ず使う。本人から明示的に依頼されたときだけ発動し、他Skill(add-unique-content等)の完了を検知して自動的に割り込むことはしない。
---

# write-steam-description

Steam Workshopの掲載ページに載せる紹介文(日本語・英語)を更新する。

## ソース・オブ・トゥルース

`docs/steam-description/ja.md`・`docs/steam-description/en.md`がこの説明文の正本。Steam Workshopの編集画面には直接書き込む手段がない(APIも自動操作もない)ため、このSkillの作業範囲は上記ファイルの更新までで、そこから先(Steam側へのコピペ)は本人が手動で行う。更新後は「Steam側にもコピペしてください」と一言添えること。

## 核心: 新しい文章を創作しない、LOCテキストからほぼ逐語転記する

実際に一条莉々華のセクションと`Text/ja_JP/Text.xml`・`Text/en_US/Text.xml`の該当LOCタグを比較すると、Steam説明文はゲーム内テキストの言い換えではなく、`[ICON_Xxx]`タグを取り除いただけのほぼ逐語転記だと分かる。つまり新規リーダーのセクションを書くときも、独自に説明文を考える必要はなく、対応するLOCタグの値を拾って組み立てるだけでよい。

新規リーダー(文明タグ`<CIV>`・指導者タグ`<LEADER>`・ユニークユニット等のタグ`<UNIT>`)を追加する場合、`Text/ja_JP/Text.xml`(日本語版セクション用)・`Text/en_US/Text.xml`(英語版セクション用)からそれぞれ以下を引用する:

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

## フォーマット

`docs/steam-description/ja.md`・`en.md`にある一条莉々華のセクションをテンプレートとして扱う。新規リーダーのセクションも同じ構成を踏襲する:

1. `【リーダー名(文明名)】` / `[Leader Name (Civilization Name)]` 見出し
2. 文明固有能力
3. 指導者固有能力(通常時)
4. 指導者固有能力(独占・大企業モード時、あれば)
5. ユニークアジェンダ
6. ユニークユニット/区域/施設/建造物(複数あれば全て)

日本語版は`【】`見出し、英語版は`[]`見出しの体裁をそれぞれ維持する。

## その他、リーダー追加のたびに見直す箇所

- 冒頭の`【開発中です】`/`[Work in Progress]`: 実装済みリーダーの一覧を更新する。
- 全ReGLOSSメンバーの実装が完了したら、末尾の「今後、ReGLOSSの他メンバーも...」/"More ReGLOSS members..."の一文を削除する。
- `【対応言語】`/`[Language]`は`add-language` Skillで新しい言語を追加したときだけ更新対象。通常のリーダー追加では触らない。
- `【バランスについて】`/`[Balance Note]`は基本的に固定文なので、方針変更の指示がない限り触らない。

日本語版と英語版は常に同じ構成・同じセクション数を保つこと。片方だけ更新して終わらせず、両言語をまとめて更新する。
