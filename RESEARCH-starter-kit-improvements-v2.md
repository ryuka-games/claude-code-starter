# Research Report: Claude Code スターターキット改善点調査 (v2)

## 1. Executive Summary

テンプレート基盤は良好だが、公式機能の進化に対して3つのギャップがある:
(1) `.claude/rules/` のパス指定ルールが未対応、(2) Plugin Systemの案内がない、(3) 公式の#1推奨「検証手段を与える」がテンプレートに未反映。
いずれもBoris思想を崩さず小さな変更で対応可能。

## 2. Findings

### 公式機能との差分（一次ソースで確認済み）

| 機能 | 公式状況 | 自リポジトリ | 確信度 |
|------|---------|-------------|:------:|
| `.claude/rules/` パス指定ルール | 公式対応（code.claude.com/docs/en/memory） | テンプレートに未含、ガイドに記載あり | 確認済み |
| `@path/to/file` imports | 公式対応（同上） | ガイドに未記載 | 確認済み |
| Plugin System | 公式対応（code.claude.com/docs/en/plugins） | 未対応 | 確認済み |
| SKILL.md新フィールド（`context: fork`, `agent`, `model`, `hooks`） | 公式対応（code.claude.com/docs/en/skills） | カスタマイズガイドに未記載 | 確認済み |
| Agent新フィールド（`memory`, `skills`, `hooks`, `maxTurns`, `mcpServers`） | 公式対応（code.claude.com/docs/en/sub-agents） | カスタマイズガイドに未記載 | 確認済み |
| Hook新イベント（`TeammateIdle`, `TaskCompleted`, `PreCompact`等14種） | 公式対応（code.claude.com/docs/en/hooks） | カスタマイズガイドは旧情報 | 確認済み |
| 「検証手段を与えるのが最大のレバレッジ」 | best-practicesページで明記 | Build & Testコマンドはあるが強調不足 | 確認済み |

### 類似リポジトリとの比較（GitHub検証済み）

| リポジトリ | Stars | 特徴 | 自リポとの差 |
|-----------|------:|------|------------|
| [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | 23,100 | キュレーションリスト9カテゴリ | リンク集。競合ではない |
| [claude-code-templates](https://github.com/davila7/claude-code-templates) | 19,712 | CLI+100+テンプレート | ツール型。思想が異なる |
| [zbruhnke/claude-code-starter](https://github.com/zbruhnke/claude-code-starter) | 12 | 6言語プリセット、skills 11/agents 6/rules 7/hooks 11 | 構成が最も近い競合。量は多いがBoris思想ではない |
| [claude-md-templates](https://github.com/abhishekray07/claude-md-templates) | 未検証 | 3階層CLAUDE.md、15行以下推奨 | Boris思想に近い。ただしスキルなし |

### 自リポジトリの強み（変えるべきでない部分）

- Boris思想準拠の最小テンプレート（TODOプレースホルダー）
- template/ と docs/ の明確な分離
- ADR（設計判断記録）— 他リポにほぼない
- SDD（RESEARCH.md → SPEC.md → PLAN.md）パイプライン
- 日本語ファースト

## 3. Recommendations

### 優先度高

| # | 何を | どう変えるか | なぜ |
|---|------|------------|------|
| 1 | `docs/guides/customization.md` | Skills/Agents/Hooksセクションを公式ドキュメント最新版に合わせて更新。新フィールド（SKILL: `context`, `agent`, `hooks` / Agent: `memory`, `skills`, `maxTurns` / Hook: 14イベント、`prompt`/`agent`タイプ）を追記 | 現在の情報が古い。ユーザーが最新機能を知らずに使えない |
| 2 | `docs/guides/customization.md` | `@path/to/file` imports構文の説明を追加（Rulesセクションの近くに） | 公式対応済みだがガイドに未記載 |
| 3 | `template/.claude/CLAUDE.md` | Build & Testセクションのコメントに「テストを実行して結果を確認してから完了を報告すること」を1行追加 | 公式best-practicesの#1レバレッジポイント。1行で対応可能 |

### 優先度中

| # | 何を | どう変えるか | なぜ |
|---|------|------------|------|
| 4 | `docs/guides/` | `plugins.md` を新規作成。Plugin Systemの概要・作り方・導入方法を記載 | 公式機能として確立済み。スキル配布の新標準になりつつある |
| 5 | `README.md` | ドキュメントテーブルに [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) へのリンクを追加 | 23.1k starsの定番リソース。ユーザーの発見性向上 |

### 優先度低

| # | 何を | どう変えるか | なぜ |
|---|------|------------|------|
| 6 | `docs/productivity-guide.md` | 1,134行と長大。ガイド群との重複を整理するか、「包括的リファレンス」と位置づけを明確化 | 現状でも使えるが、メンテナンスコストが高い |

## 4. Next Steps

1. 優先度高 #1-3 から着手（最もインパクト大、作業量小）
2. #4 Plugin Systemガイドは調査しながら作成
3. 完了後、create SPEC.md from these findings

## 5. Sources

- [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices) — 確認済み
- [Claude Code Memory](https://code.claude.com/docs/en/memory) — 確認済み（rules/, @imports記載）
- [Claude Code Skills](https://code.claude.com/docs/en/skills) — 確認済み（新フィールド記載）
- [Claude Code Hooks](https://code.claude.com/docs/en/hooks) — 確認済み（14イベント記載）
- [Claude Code Sub-agents](https://code.claude.com/docs/en/sub-agents) — 確認済み（新フィールド記載）
- [Claude Code Plugins](https://code.claude.com/docs/en/plugins) — 確認済み（公式プラグインシステム）
- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) — GitHub確認済み (23,100 stars)
- [claude-code-templates](https://github.com/davila7/claude-code-templates) — GitHub確認済み (19,712 stars)
- [zbruhnke/claude-code-starter](https://github.com/zbruhnke/claude-code-starter) — GitHub確認済み (12 stars)
