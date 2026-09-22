# civ6mod-hololive-regloss

Civilization VI の新規文明追加Mod。hololive ReGLOSSをモチーフにした文明を実装する。詳細な設計・調査メモは`docs/design.md`を参照。

- リポジトリの主体はXML/LuaによるCiv6 Mod定義。`tools/`配下のみTypeScript/Node.jsのビルドスクリプト(画像→DDS変換、XLP/`.tex`/`.dep`生成等)。
- `tools/`配下のTypeScript/Node.jsコードを書く/触るときは`.claude/rules/`のコーディング規約に従う。
- Civ6 Modding固有の知識・手順は`.claude/skills/`を参照。`bootstrap-mod`→`bootstrap-leader`→(`make-leader-icons`/`make-fallback-portrait`/`implement-leader-abilities`/`add-unique-content`)の順で使う。日本語のゲーム内テキスト(`_NAME`/`_DESCRIPTION`等)を書くときは各実装Skillと合わせて`write-official-jp-text-style`も使う(他言語は言語別の同種Skillとして`write-official-en-text-style`(英語)/`write-official-zh-text-style`(中国語簡体字/繁体字)も存在する。2026-09-22時点でJP/EN/ZH版のみ)。言語を新規追加するときは`add-language`を使う。バッジアイコン(`ICON_*`)を作る/差し替えるときは`make-leader-icons`、外交交渉画面のフォールバック静止画(`FALLBACK_NEUTRAL_*`)やローディング画面のポートレート/背景(`LEADER_*_NEUTRAL`/`LEADER_*_BACKGROUND`)をキャラ元絵から作る/差し替えるときは`make-fallback-portrait`を使う。**Skillは実機/一次情報で裏付けられた行動指示だけを書く場所であり、civ6wiki.info等の未検証な下調べメモは`docs/civ6-research/`に置く**(着手して実機確認できたら該当Skillへ確認済み事実として書き足す)。**Civ6 Mod制作に関する調べ物(仕様・数値・「なんで動かないか」等)に入ると分かった時点で、詰まる前・仮説を立てる前に真っ先に`research-mod` Skillを発動する**(「詰まったら調べる」ではなく「調べ物イコール即Skill」)。
