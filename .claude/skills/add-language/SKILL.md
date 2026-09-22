---
name: add-language
description: Civ6 Modに新しい言語(中国語簡体字/繁体字等)のローカライズを追加する時に使う。「中国語対応する」「言語を追加する」「多言語対応を増やす」と言われたとき、または`Text/<lang>/`ディレクトリを新規に作る場面で使う。2026-09-22、中国語(zh_Hans_CN/zh_Hant_HK)対応で確立した手順。日本語テキストの文体自体は対象外(`write-official-jp-text-style` Skillを使うこと。他言語版の文体Skillは今後言語ごとに追加していく想定)。
---

# Civ6 Modに新しい言語を追加する

## 1. Language属性の正確な値を確認する

推測せず、必ずCiv6本体の実機ファイルで確認する。`Base/Assets/Text/`直下に`Vanilla_<lang>.xml`が言語ごとに並んでいる(`en_US`だけ`Text/en_US/`という別ディレクトリ構成):

```
Vanilla_de_DE.xml  Vanilla_es_ES.xml  Vanilla_fr_FR.xml  Vanilla_it_IT.xml
Vanilla_ja_JP.xml  Vanilla_ko_KR.xml  Vanilla_pl_PL.xml  Vanilla_pt_BR.xml
Vanilla_ru_RU.xml  Vanilla_zh_Hans_CN.xml  Vanilla_zh_Hant_HK.xml
```

**中国語の繁体字は`zh_Hant_HK`(香港)のみ存在する。`zh_Hant_TW`(台湾)は無い**(2026-09-22確認)。つまり台湾のプレイヤーも`zh_Hant_HK`で表示される。

これらのファイルは`<Replace Tag="..." Language="...">`形式(バニラ側の上書き)。自Modの新規LOCキーは`<Row Tag="..." Language="...">`でよい(`en_US`/`ja_JP`と同じ形式)。

## 2. ファイル構成とmodinfo登録

`Text/<lang>/Text.xml`を作り、既存の`en_US`/`ja_JP`と同じ全キーを1:1で用意する。`.modinfo`は3箇所に追記が要る(既存の`en_US`/`ja_JP`の行の隣に足すだけ):

- `FrontEndActions`→`UpdateText`の`<File>`
- `InGameActions`→`UpdateText`の`<File>`
- トップレベルの`<Files>`

## 3. ゲーム用語は一次資料で正式訳を確認してから訳す

Civ6の用語(Yield名・建造物名・資源クラス名・ゲームモード固有語など)は先に公式訳を確認し、フレーバーテキスト(外交台詞等)だけ自分で訳す。確認先:

- バニラ語彙: `Base/Assets/Text/Vanilla_<lang>.xml`(例: `LOC_YIELD_GOLD_NAME`、`LOC_BUILDING_MARKET_NAME`)
- DLC固有の語彙(モード名・改善名等): 各DLCの`Text/<DLCName>_Translations_Text*.xml`(統合ファイル、`<Replace Tag="..." Language="...">`で全言語まとまっている)。例: 独占/大企業モードなら`DLC/KublaiKhan_Vietnam/Text/KublaiKhan_Vietnam_Translations_Text_MODE.xml`

grepでタグ名指定して該当行だけ読む(ファイル全体は読まない)。確認した用語は`idea`リポジトリの`用語対訳/<ゲーム名>-用語対訳.csv`(`map-terms` Skill管轄)に追記して再利用する。**本人から許可を得た場合のみ、そのCSVのカラム自体(例: 簡体字名/繁體字名列の追加)を拡張してよい。**

## 4. 同じ文字体系でも地域で語彙自体が違うことがある(要注意)

簡体字/繁体字は字体(文字の形)だけの違いではなく、**同じ概念に別の単語を使っているケースが実在する**。2026-09-22、独占/大企業モードの語彙で確認:

| 概念 | 簡体字(zh_Hans_CN) | 繁体字(zh_Hant_HK) |
|---|---|---|
| Corporation(改善) | 公司 | 企業 |
| Industry(改善) | 行业 | 工業 |
| Monopoly | 垄断 | 獨佔 |
| Warmonger | 好战者 | 好戰份子 |

一方、Yield名(金币/金幣、文化值/文化值等)や建造物名(市场/市場等)は字体変換だけで済むケースも多い。**「同じ言語系統だから片方を機械変換すればもう片方も正しい」と思い込まず、語ごとに実機ファイルで両方を確認すること。**

## 5. 句読点・引用符も地域の実機データで確認する

自分の直感(や日本語の感覚)で句読点を選ばない。2026-09-22、簡体字/繁体字で以下の違いを実機ファイルで確認:

- 読点: 両方とも全角(`，`)が標準。半角`,`をそのまま使わない
- 引用符: 簡体字はカーブ引用符`" "`、繁体字は鉤括弧`「」`(日本語と同じ見た目だが独立に確認する)

確認方法: `grep -c "「" Vanilla_zh_Hant_HK.xml`のように候補の記号を実機ファイルで数えて多数派を採用する。

## 6. 簡体字→繁体字の機械変換ツールを使う場合の注意

`opencc-js`(npm)等で簡体字原稿を繁体字へ一次変換すると、字体変換と一部の一般語彙変換はできるが、**上記4節のようなゲーム固有語の語彙差までは変換されない**(ツールはCiv6の用語集を知らない)。機械変換後は必ず4-5節の確認結果で手動パッチすること。

**既知の変換バグ(2026-09-22、opencc-js `cn2hk`で確認)**: 「言う/说」の変換が正しい繁体字「說」ではなく日本語の字体「説」になることがある。機械変換の出力をそのまま信用せず、疑わしい常用字は実機の`Vanilla_zh_Hant_HK.xml`で正しい字形をgrep確認すること。

## 7. 完了確認

追加した言語ファイルが既存言語と1:1対応しているか、タグ集合の完全一致で確認する:

```bash
for f in en_US ja_JP <新言語>; do
  grep -oE 'Tag="[A-Z0-9_]+"' Text/$f/Text.xml | sort > /tmp/tags_$f.txt
done
diff /tmp/tags_en_US.txt /tmp/tags_<新言語>.txt   # 差分が無ければOK
```

XMLの整形式チェックは`xmllint`が無い環境ではPowerShellの`[xml]`キャストで代用できる:

```powershell
[xml](Get-Content -Raw -Encoding UTF8 <path>) | Out-Null
```
