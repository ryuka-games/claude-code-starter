# 既存のレビュースキル・ツール調査 — /reviewスキル設計のために

## Summary

**結論**: Anthropic公式は4エージェント並列（CLAUDE.mdコンプライアンス×2 + バグ検出 + ロジック・セキュリティ）。コミュニティは9並列エージェントまで存在。共通する設計原則は「何をフラグしないかの定義が品質を決める」
**推奨アクション**: 公式の4エージェント構造をベースに、specとの照合を追加する。/challengeと同じ並列サブエージェント+偽陽性フィルタのパターンを適用
**根拠**: 偽陽性率1%未満を実現している公式の「HIGH SIGNAL原則」が最も重要な設計判断

## Anthropic公式: 2つのレビュー機能

### Code Review（マネージドサービス）

REVIEW.mdをリポジトリルートに置くだけで自動検出。PRに対してマルチエージェントが並列レビュー。

| 項目 | 詳細 |
|---|---|
| コスト | $15-25/PR |
| 偽陽性率 | 1%未満 |
| 大PR (1000行+) | 84%で問題発見、平均7.5件 |
| 小PR (50行未満) | 31%で問題発見、平均0.5件 |
| レビュー時間 | 約20分 |

### /code-review プラグイン（Boris Cherny作）

**9ステップ、4エージェント並列:**
1. バリデーション（Haiku）
2. CLAUDE.md検出（Haiku）
3. PRサマリー（Sonnet）
4. **4エージェント並列:**
   - Agent 1&2（Sonnet）: CLAUDE.mdコンプライアンス（冗長性のため2つ）
   - Agent 3（Opus）: バグ検出（diffのみ）
   - Agent 4（Opus）: ロジック・セキュリティ
5. 検証サブエージェント（各issueをOpusが独立検証）
6. フィルタリング
7-9. 出力・コメント投稿

**HIGH SIGNAL原則（最重要）:**
- フラグする: コンパイル失敗、確実に間違った結果、明確なCLAUDE.md違反
- **フラグしない: スタイル、潜在的問題、主観的提案、偽陽性**
- 信頼度80以上のみ報告

## BMAD Method: 3層並列レビュー

| レビュアー | 入力 | 目的 |
|---|---|---|
| Blind Hunter | diffのみ（コンテキストなし） | 情報非対称で先入観なし |
| Edge Case Hunter | diff + プロジェクト読み取り | エッジケース特化 |
| Acceptance Auditor | diff + spec + コンテキスト | 受入基準照合 |

Triageで4分類: decision_needed / patch / defer / dismiss

## コミュニティの注目実装

### awesome-skills/code-review-skill
4フェーズ（Context→High-Level→Line-by-Line→Summary）。9,500行の言語別ガイド。Progressive Loading。

### HAMY.xyz: 9並列サブエージェント
Test Runner / Linter / Code Reviewer / Security / Quality / Test Quality / Performance / Dependency / Simplification。約75%の提案が有用。

### levnikolaevich: マルチモデルDebate
OpenAI Codex + Google Geminiを並列起動。Debate protocolで90%閾値のCritical Verification。

### hamelsmu/claude-review-loop
Stop hookでClaude Code終了を阻止し、Codexによる独立レビューを強制。テックスタックに応じて条件起動。

### Trail of Bits Security Skills
40以上のセキュリティ特化プラグイン。differential-review、fp-check（偽陽性検証ゲート）、variant-analysis。

## 偽陽性対策の3アプローチ

| アプローチ | 採用先 | 仕組み |
|---|---|---|
| 信頼度スコアリング | Anthropic公式 | 0-100スコア、80以上のみ報告 |
| 検証サブエージェント | Anthropic公式 | 発見ごとに別エージェントが再検証 |
| 情報の非対称性 | BMAD Method | Blind Hunterはコンテキストなしで分析 |

## 「何をフラグしないか」が品質を決める

Anthropic公式で最も力を入れているのはフラグしないリスト:
- コードスタイルや品質の懸念
- 特定の入力/状態に依存する潜在的問題
- 主観的な提案や改善
- 偽陽性
- リンターが捕まえる問題

**これが1%未満の偽陽性率の鍵。**

## /reviewスキル設計への示唆

| # | 示唆 | 根拠 |
|---|---|---|
| 1 | HIGH SIGNAL原則を最初に定義する | 「フラグしない」リストが偽陽性率を決める |
| 2 | specとの照合を入れる（公式にない独自価値） | Anthropic公式はspec照合しない。/challengeでspec品質は確認済み前提で、実装がspecに沿っているかをレビュー |
| 3 | /challengeと同じ並列サブエージェント構造 | 設計・セキュリティ・命名/可読性・specとの整合を並列で |
| 4 | 偽陽性フィルタは検証サブエージェント方式 | Anthropic公式が実証済み |
| 5 | REVIEW.mdでプロジェクト固有ルールをカスタマイズ | 公式と同じ。Always check / Style / Skip |
| 6 | 信頼度スコア80以上のみ報告 | 公式のHIGH SIGNAL原則 |

## Sources

- [Anthropic Code Review docs](https://code.claude.com/docs/en/code-review)
- [Anthropic Code Review blog](https://claude.com/blog/code-review)
- [Boris Cherny /code-review plugin](https://github.com/anthropics/claude-code/blob/main/plugins/code-review/commands/code-review.md)
- [Anthropic security-review Action](https://github.com/anthropics/claude-code-security-review)
- [awesome-skills/code-review-skill](https://github.com/awesome-skills/code-review-skill)
- [BMAD Method](https://docs.bmad-method.org/explanation/adversarial-review/)
- [HAMY.xyz 9 parallel agents](https://hamy.xyz/blog/2026-02_code-reviews-claude-subagents)
- [hamelsmu/claude-review-loop](https://github.com/hamelsmu/claude-review-loop)
- [levnikolaevich/claude-code-skills](https://github.com/levnikolaevich/claude-code-skills)
- [Trail of Bits skills](https://github.com/trailofbits/skills)
- [38 Issues Showdown](https://dev.to/terence/38-issues-showdown-between-bugbot-copilot-and-claude-2o7e)
- [baz-scm/awesome-reviewers](https://github.com/baz-scm/awesome-reviewers)
