# civ6mod-hololive-regloss

Civilization VI の新規文明追加Mod。hololive ReGLOSSをモチーフにした文明を実装する。詳細な設計・調査メモは`docs/design.md`を参照。

- リポジトリの主体はXML/LuaによるCiv6 Mod定義。`tools/`配下のみTypeScript/Node.jsのビルドスクリプト(画像→DDS変換、XLP/`.tex`/`.dep`生成等)。
- `tools/`配下のTypeScript/Node.jsコードを書く/触るときは`.claude/rules/`のコーディング規約に従う。
- Civ6 Modding固有の知識・手順は`.claude/skills/`を参照。`mod-bootstrap`→`leader-bootstrap`→(`leader-icons`/`leader-abilities`/`leader-unique-content`)の順で使う。断片情報から仮説を積み上げがちな調査が必要になったら先に`civ6-mod-research` Skillに従う。
