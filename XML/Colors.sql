-- 2026-09-23実験→確定: XML/Colors.xmlのPlayerColors登録が実行時に解決できず
-- (docs/civ6-icon-color-bug-investigation.md参照)、パウズメニュー・リーダー選択画面の
-- 能力アイコン・ゲーム中の文明アイコンがUsage="Major"の汎用プール色にフォールバックする
-- バグがあった。姉妹Mod(civ6mod-hololive-holox)でXML→SQL形式への切り替えのみで
-- 解決したことを実機確認したため、こちらも同じ形式に切り替える。
-- 儒烏風亭らでん配色: 公式サイトのタレント背景色#1c5e4f(wiki記載)+白。
-- 一条コーポレーション/莉々華配色。Alt1〜3は不要と確認済み(Hololive公式Mod調査・実機検証済み)。
INSERT OR REPLACE INTO Colors
		(Type, Color)
	VALUES
		('COLOR_PLAYER_REGLOSS_ICHIJOU_RIRIKA_PRIMARY', '238,85,139,255'),
		('COLOR_PLAYER_REGLOSS_ICHIJOU_RIRIKA_SECONDARY', '255,255,255,255'),
		('COLOR_PLAYER_REGLOSS_JUUFUUTEI_RADEN_PRIMARY', '28,94,79,255'),
		('COLOR_PLAYER_REGLOSS_JUUFUUTEI_RADEN_SECONDARY', '255,255,255,255');

INSERT OR REPLACE INTO PlayerColors
		(Type, Usage, PrimaryColor, SecondaryColor)
	VALUES
		('LEADER_REGLOSS_ICHIJOU_RIRIKA', 'Unique', 'COLOR_PLAYER_REGLOSS_ICHIJOU_RIRIKA_PRIMARY', 'COLOR_PLAYER_REGLOSS_ICHIJOU_RIRIKA_SECONDARY'),
		('LEADER_REGLOSS_JUUFUUTEI_RADEN', 'Unique', 'COLOR_PLAYER_REGLOSS_JUUFUUTEI_RADEN_PRIMARY', 'COLOR_PLAYER_REGLOSS_JUUFUUTEI_RADEN_SECONDARY');
