# Research Report: Claude Code スターターキット改善点調査 (v3)

## 1. Executive Summary

テンプレートのBoris思想準拠・最小構成は正しい方向。主要な改善点は3つ:
(1) `docs/guides/customization.md` の公式機能情報が古い（Skills 10フィールド、Agent 12フィールド、Hook 14イベント・3タイプに拡大済み）、
(2) Plugin Systemが公式化されているがガイドなし、
(3) テンプレートCLAUDE.mdに「テストで検証せよ」の1行がない（公式 #1 推奨）。

## 2. Findings

### 公式機能の差分（WebFetchで全ページ確認済み）

| 機能 | 公式の現状 | 自リポの状況 | Confidence |
|------|-----------|-------------|:----------:|
| SKILL.md frontmatter | 10フィールド（`context: fork`, `agent`, `model`, `hooks`, `allowed-tools`等） | カスタマイズガイドに未記載 | verified |
| Agent frontmatter | 12フィールド（`memory`, `skills`, `hooks`, `maxTurns`, `mcpServers`, `permissionMode`等） | カスタマイズガイドに未記載 | verified |
| Hook events | 14種（`SessionStart/End`, `PreCompact`, `TeammateIdle`, `TaskCompleted`等） | ガイドは旧情報 | verified |
| Hook types | 3種（`command`, `prompt`, `agent`） | ガイドは`command`のみ | verified |
| `.claude/rules/` | パス指定対応。サブディレクトリ・symlink対応 | ガイドに記載済み。テンプレートに未含 | verified |
| `@path/to/file` imports | 公式対応。再帰5階層まで | ガイドに未記載 | verified |
| Plugin System | 公式対応。v1.0.33+。`.claude-plugin/plugin.json` | 未対応 | verified |
| Auto Memory | `~/.claude/projects/<project>/memory/` に自動保存 | テンプレート対応不要（組み込み） | verified |
| 検証 = #1レバレッジ | best-practicesで明記 | Build & Testコマンドはあるが強調不足 | verified |

### 競合リポジトリ（gh repo viewで存在・star数確認済み）

| リポジトリ | Stars | 特徴 | 自リポとの関係 |
|-----------|------:|------|--------------|
| [everything-claude-code](https://github.com/affaan-m/everything-claude-code) | 41,965 | 最大主義。数十agents/skills/rules | 対極のアプローチ |
| [wshobson/agents](https://github.com/wshobson/agents) | 28,069 | マルチエージェントオーケストレーション | 機能特化。競合ではない |
| [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | 23,102 | キュレーションリスト9カテゴリ | リンク集。READMEからリンクすべき |
| [claude-code-templates](https://github.com/davila7/claude-code-templates) | 19,715 | CLI + 600+ agents/200+ commands | ツール型。思想が異なる |
| [zbruhnke/claude-code-starter](https://github.com/zbruhnke/claude-code-starter) | 12 | 6言語プリセット、setup.sh導入 | 構成が最も近い。量重視 |

### 自リポの強み（変えない）

Boris思想準拠の最小テンプレート / template・docs分離 / ADR / SDD / 日本語ファースト

## 3. Recommendations

| # | What to change | How to change it | Why |
|---|----------------|-----------------|-----|
| 1 | `template/.claude/CLAUDE.md` | Build & Testセクションに「変更後はテストを実行し、passを確認してから完了を報告すること」を1行追加 | 公式 #1 レバレッジポイント。1行で対応可能 |
| 2 | `docs/guides/customization.md` Skills | SKILL.md frontmatter全10フィールドの表を追加。`context: fork` + `agent` の使用例を追記 | 現ガイドにフィールド一覧なし。ユーザーが高度なスキルを作れない |
| 3 | `docs/guides/customization.md` Agents | Agent frontmatter全12フィールドの表を追加。`memory`, `permissionMode` の使用例を追記 | 同上 |
| 4 | `docs/guides/customization.md` Hooks | 14イベント一覧表を追加。`prompt`/`agent`タイプの例を追記 | 現ガイドは旧情報。promptタイプ（LLM評価）は特に有用 |
| 5 | `docs/guides/customization.md` | `@path/to/file` imports セクションを追加 | 公式対応済みの重要機能がガイドにない |
| 6 | `README.md` | ドキュメントテーブルに [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) を追加 | 23k starsの定番リソース。ユーザーの発見性向上 |
| 7 | `docs/guides/plugins.md` | 新規作成。Plugin Systemの概要・作り方・導入方法 | v1.0.33+で公式化。スキル配布の新標準 |

## 4. Next Steps

1. #1（テンプレート1行追加）→ 最小工数・最大効果
2. #2-5（カスタマイズガイド更新）→ 最もボリュームあり。公式ドキュメントから転記が主
3. #6（READMEリンク追加）→ 1行
4. #7（pluginsガイド）→ 新規ファイル作成
5. 完了後、create SPEC.md from these findings

## 5. Sources

| Source | Status | URL |
|--------|:------:|-----|
| Claude Code Best Practices | verified | https://code.claude.com/docs/en/best-practices |
| Claude Code Skills | verified | https://code.claude.com/docs/en/skills |
| Claude Code Sub-agents | verified | https://code.claude.com/docs/en/sub-agents |
| Claude Code Hooks | verified | https://code.claude.com/docs/en/hooks |
| Claude Code Memory | verified | https://code.claude.com/docs/en/memory |
| Claude Code Plugins | verified | https://code.claude.com/docs/en/plugins |
| everything-claude-code | verified (gh) | https://github.com/affaan-m/everything-claude-code |
| awesome-claude-code | verified (gh) | https://github.com/hesreallyhim/awesome-claude-code |
| claude-code-templates | verified (gh) | https://github.com/davila7/claude-code-templates |
| wshobson/agents | verified (gh) | https://github.com/wshobson/agents |
