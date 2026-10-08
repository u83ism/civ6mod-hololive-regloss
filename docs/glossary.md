# 用語表(Mod固有名詞・多言語対訳)

多言語展開の前に決める、このMod固有の名詞の各言語表記。翻訳のたびに揺れないよう、ここを正とする。ゲーム本体の用語(Yield名・建造物名等)は`.claude/rules/game-terms.md`に従い公式訳を引く。方針は`.claude/rules/localization-order.md`(他言語対応は本人の指示を受けてから、最初にここで表記を決める)。

## 確定

> 2026-10-04、このファイルの新設時に、既に`Text/<lang>/Text.xml`へ入っていた表記をそのまま転記した。**各言語の表記を本人が個別に確認・決定した記録ではない**ので、「根拠」欄はLOCタグ(転記元)だけを書いている。決定の経緯が分かるものは今後ここに足す。

| 概念 | ja_JP | en_US | zh_Hans_CN | zh_Hant_HK | 転記元のLOCタグ |
|---|---|---|---|---|---|
| 文明名 | 一条コーポレーション | Ichijou Corporation | 一条公司 | 一條公司 | `LOC_CIVILIZATION_REGLOSS_ICHIJOU_NAME` |
| 指導者名 | 一条莉々華 | Ichijou Ririka | 一条莉莉华 | 一條莉莉華 | `LOC_LEADER_REGLOSS_ICHIJOU_RIRIKA_NAME` |
| 文明能力 | 秘書見習い達の奮闘 | The Trainee Secretaries' Hustle | 见习秘书们的奋斗 | 見習秘書們的奮鬥 | `LOC_TRAIT_CIVILIZATION_REGLOSS_ICHIJOU_NAME` |
| 指導者能力(独占・大企業モードOFF) | 推し事お疲れさまでした〜 | Good Work on Your Oshi Activities~ | 追星辛苦了～ | 追星辛苦了～ | `LOC_TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA_NAME` |
| 指導者能力(独占・大企業モードON) | 大天才 | Great Genius | 大天才 | 大天才 | `LOC_TRAIT_LEADER_REGLOSS_ICHIJOU_RIRIKA_MONOPOLIES_NAME` |
| ユニークアジェンダ | KPG | KPG | KPG | KPG | `LOC_AGENDA_REGLOSS_ICHIJOU_RIRIKA_NAME` |
| 固有ユニット | うに | Uni | 海胆 | 海膽 | `LOC_UNIT_REGLOSS_ICHIJOU_UNI_NAME` |
| らでん: 文明名 | 儒烏風亭一門 | House of Juufuutei | 儒乌风亭一门 | 儒烏風亭一門 | `LOC_CIVILIZATION_REGLOSS_JUUFUUTEI_NAME` |
| らでん: 文明の形容詞 | 儒烏風亭 | Juufuutei | 儒乌风亭 | 儒烏風亭 | `LOC_CIVILIZATION_REGLOSS_JUUFUUTEI_ADJECTIVE` |
| らでん: 指導者名 | 儒烏風亭らでん | Juufuutei Raden | 儒乌风亭拉电 | 儒烏風亭拉電 | `LOC_LEADER_REGLOSS_JUUFUUTEI_RADEN_NAME` |
| らでん: 文明能力 | 芸術に満たされて | Filled with Art | 沉浸于艺术 | 沉浸於藝術 | `LOC_TRAIT_CIVILIZATION_REGLOSS_JUUFUUTEI_NAME` |
| らでん: 指導者能力 | 芸術への渇望 | A Thirst for Art | 对艺术的渴望 | 對藝術的渴望 | `LOC_TRAIT_LEADER_REGLOSS_JUUFUUTEI_RADEN_NAME` |
| らでん: 固有ユニット | 学芸員 | Curator | 策展人 | 策展人 | `LOC_UNIT_REGLOSS_JUUFUUTEI_CURATOR_NAME` |
| らでん: 固有建造物 | 寄席 | Yose Hall | 寄席 | 寄席 | `LOC_BUILDING_REGLOSS_JUUFUUTEI_YOSE_NAME` |

## 未確定

- ReGLOSSの他メンバー(火威青・音乃瀬奏・轟はじめ)の名前・能力名: 実装に着手し、本人が他言語対応を指示した時点で各言語の表記を決める。

## らでんの補足(2026-10-07)

- 上のらでんの行は、他言語対応の指示を受けてAIが案を出し、本人が「AI案で進める」と選んだもの。個別の語は本人が一つずつ確認したわけではない。**「儒烏風亭拉电/拉電」(らでんは仮名のため音写)、「学芸員=策展人」(curatorに合わせて、AI案の「馆员」から変えた)は特に要確認**
- 都市名(首都+26): 公式訳があるもの(京都・大阪・神戸・広島・福岡・横浜・青森・松本・高松)はCiv6本体の訳、無いものは通用のローマ字(en)・日本語の漢字(zh、簡体/繁体の字形のみ変換)。豊島は「てしま」(直島の隣の美術館の島)と解釈しTeshimaとした(**本人未確認**)。竹橋はTakebashi
- 口癖「ああぁぁぁいいい」「〜まあす」「こちらでん」「さようならでん」は、語尾「ラデン」の掛け言葉を各言語に残す形で書いた(意味のある語は訳し、鳴き声・掛け言葉は音を残す)
