---
name: leader-unique-content
description: Civ6 Modで固有ユニット/区域/施設/建造物(UU/UD/UI/UB)を追加する時に使う。「ユニークユニットを追加する」「固有区域を作る」「固有施設・改善を実装する」「固有建造物を実装する」と言われたとき、または`UnitReplaces`/`DistrictReplaces`等の置換要素を新規に書く場面で使う。leader-bootstrapで指導者が選択画面に出るところまで終わった後に使う。
---

# 固有ユニット・区域・施設・建造物(UU/UD/UI/UB)の実装

一条莉々華Mod(civ6mod-hololive-regloss)ではまだ未着手の領域。着手時は`references/unique-content-patterns.md`(civ6wiki.info要約、2017〜2022年執筆、SDKサンプル`LEADER_JASPER_KITTY`/`CIVILIZATION_FELINE`を素材にした写経チュートリアル)を先に読むこと。**このリポジトリで実機確認した事実ではない**ので、実装しながら食い違いが見つかったら実機での挙動を優先し、このSKILLと`leader-bootstrap`/`leader-icons`双方に確認済み事実として書き足すこと。

## 要点だけ先に

UU(ユニット)/UD(区域)/UI(地形改善)/UB(建造物)は全て同じ8手順(性能定義→Trait紐付け→Config登録→テキスト→Property登録→アイコン→Artdef→ビルド)。既存のバニラ要素をコピーして値を差し替えるのが基本で、ゼロから書き起こさない。詳細は`references/unique-content-patterns.md`。

⚠️ **UB(ユニーク建造物)は2つの既知の罠がある**:
1. Wiki記載のBuildings/Landmarks artdefサンプルは2017年当時のものであり、その後のアップデートで仕様変更が入ったため現在は動作しない、と著者自身が明記している。Artdefが必要になったら、Wikiのサンプルを写経せずSteam Workshopの実働Modを解析すること(`research-mod` Skillの優先順位2〜3節と同じ結論)
2. SDKサンプル同梱の`BUILDING_LITTER_BOX`(ユニーク建造物)は、これがある都市が陥落する(占領/被占領いずれも)と**Civ6が強制終了する**既知の不具合があり、著者は自作の改変建造物でも同じ事象を確認したと報告している。回避策はモニュメント等の**文明非依存の共通建造物の置換**として実装すること(文明固有のユニーク建造物にしない)

アイコンの新規作成が必要な場合は`leader-icons` Skillの`references/icon-blp-pipeline.md`(BLPパイプライン)を使う。既存アイコンの使い回しで済ませる場合の手順は本SKILLの`references/unique-content-patterns.md`に書いてある。

**断片情報から仮説を積み上げがちな調査が必要になったら、先に`research-mod` Skillに従って一次情報を洗うこと。**
