# コードレビューの目的・タイミング — /reviewスキル設計のために

## Summary

**結論**: レビューの主目的はバグ発見ではなく保守性・設計品質（コメントの75%が保守性関連）。テスト通過後に配置し、テストで見つけられない問題に集中させる
**推奨アクション**: /agent-teams → CI(UT+IT) → /review → /test-e2e の順。レビューはテスト後、E2E前
**根拠**: テストが落ちるコードをレビューするのは時間の無駄。テストが通っているからこそ「テストでは見つけられない問題」にレビューが集中できる

## レビューの本質: バグ発見ではなく保守性

**レビューコメントの75%は機能バグではなく保守性・進化可能性に関するもの。** Mantyla & Lassenius、Beller et al. (2014) の研究で一貫して示されている。

Googleのレビュー優先度: **設計 > 機能 > 複雑さ > テスト > 命名 > コメント > スタイル > ドキュメント**

## レビュー vs テスト: 何をどっちで見つけるか

| 観点 | レビューが得意 | テストが得意 |
|------|---------------|-------------|
| 設計・アーキテクチャ | クラス分割、責務配置、over-engineering | — |
| 命名・可読性 | 変数名の意図との乖離 | — |
| セキュリティ設計 | 認証フロー設計、secrets管理 | 既知パターン(SQLi, XSS) |
| ロジックバグ | 複雑な条件分岐 | 境界値、エッジケース |
| パフォーマンス | N+1、不要な計算 | 負荷テスト |
| 回帰 | — | リグレッションテスト |

**単一手法の最高検出率は68%。組み合わせが本質。**

## 推奨タイミング

```
/agent-teams (実装)
  ↓
CI: lint + format + 型チェック + UT + IT
  ↓
/review (AIコードレビュー) ← テストpass後
  ↓
/test-e2e
  ↓
人間の最終確認
```

テスト後にレビューを置く理由:
- テストが落ちるコードをレビューするのは時間の無駄
- テストが通っているからこそ「テストでは見つけられない問題」に集中できる
- レビューで構造的問題が見つかっても、E2E前なら手戻りが軽い

## AI生成コードにはレビューが特に重要

Addy Osmaniのデータ:
- AI生成コードのロジックエラーは人間の75%多い
- AI生成コードの約45%にセキュリティ欠陥
- XSS脆弱性は2.74倍多い
- 開発者の71%がAI生成コードを人間レビューなしにマージしない

## テスト自動化済み環境でレビューが見るべき6領域

1. **設計の妥当性**: specの意図がコードに正しく反映されているか
2. **セキュリティの設計面**: 認証フロー、secrets管理、権限設計
3. **命名と抽象化の質**: AIは動くコードを書くが命名や抽象化の質が低い
4. **specとの整合性**: テストpassでもspecの意図を曲解している可能性
5. **保守性・進化可能性**: 将来の変更を阻害する構造になっていないか
6. **不要な複雑さ**: AIは不必要に複雑なコードを生成しがち

## レビュー疲れ対策

- 400 LOCを超えると検出力が急落
- 60-90分を超えると検出力が急落
- PRを200 LOC以下にすると40%多くコードを出荷
- AIで低次の問題をフィルタし、人間は設計・ロジックに集中

## AIコードレビューツール比較（38 Issues Showdown）

| ツール | 初回検出率 | 3パス後 | 特徴 |
|---|---|---|---|
| GitHub Copilot | 89% (34/38) | 38/38 | インラインコメント+コード提案 |
| Anthropic Claude | 84% (32/38) | 38/38 | 重要度タグ+マージ判断 |
| Cursor BugBot | 76% (29/38) | 35/38 | 8並列パス+多数決 |

## /reviewスキルへの設計示唆

| # | 示唆 | 根拠 |
|---|---|---|
| 1 | 多角的な視点（複数観点で並列） | Anthropicのマルチエージェント、BugBotの8パス |
| 2 | specへの参照を渡す | テストpass≠spec準拠。意図の曲解を検出 |
| 3 | 重要度ランク | CRITICAL/HIGH/MEDIUM/LOW |
| 4 | マージ判断の明示 | 「DO NOT MERGE」/「APPROVED」 |
| 5 | 偽陽性フィルタ | /challengeと同じパターン |
| 6 | テストで見つかる問題にはコメントしない | レビューの守備範囲を明確に |

## Sources

- [Google eng-practices: What to look for](https://google.github.io/eng-practices/review/reviewer/looking-for.html)
- [38 Issues Showdown (DEV Community)](https://dev.to/terence/38-issues-showdown-between-bugbot-copilot-and-claude-2o7e)
- [SmartBear Cisco Case Study](https://static0.smartbear.co/support/media/resources/cc/book/code-review-cisco-case-study.pdf)
- [Code Review in the Age of AI (Addy Osmani)](https://addyo.substack.com/p/code-review-in-the-age-of-ai)
- [Anthropic Code Review](https://claude.com/blog/code-review)
- [Building BugBot (Cursor)](https://cursor.com/blog/building-bugbot)
- [60M Copilot Code Reviews (GitHub)](https://github.blog/ai-and-ml/github-copilot/60-million-copilot-code-reviews-and-counting/)
