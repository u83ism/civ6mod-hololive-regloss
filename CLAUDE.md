# civ6mod-hololive-regloss

Civilization VI の新規文明追加Mod。hololive ReGLOSSをモチーフにした文明を実装する。詳細な設計・調査メモは`docs/design.md`を参照。

- リポジトリの主体はXML/LuaによるCiv6 Mod定義。`tools/`配下のみTypeScript/Node.jsのビルドスクリプト(画像→DDS変換、XLP/`.tex`/`.dep`生成等)。
- `tools/`配下のTypeScript/Node.jsコードを書く/触るときは`.claude/rules/`のコーディング規約に従う。
- Civ6 Modding固有の知識・手順は`.claude/skills/`を参照。`mod-bootstrap`→`leader-bootstrap`→(`leader-icons`/`leader-abilities`/`leader-unique-content`)の順で使う。ゲーム内テキスト(`_NAME`/`_DESCRIPTION`等)を書くときは各実装Skillと合わせて`write-official-style-text`も使う。外交交渉画面のフォールバック静止画(`FALLBACK_NEUTRAL_*`)をキャラ元絵から作る/差し替えるときは`leader-icons`と合わせて`make-fallback-portrait`を使う。**Civ6 Mod制作に関する調べ物(仕様・数値・「なんで動かないか」等)に入ると分かった時点で、詰まる前・仮説を立てる前に真っ先に`research-mod` Skillを発動する**(「詰まったら調べる」ではなく「調べ物イコール即Skill」)。
