# Research Report: インディーゲーム向けAIコード支援ツールの市場比較

## 1. Executive Summary

ゲーム開発向けAIツールは**MCP（Model Context Protocol）の登場でエンジン統合が均一化**しつつあり、ツール選定の決め手は「エンジン対応」から「料金・ワークフロー・エージェント能力」に移行している。Unity開発者はCopilot（Visual Studio統合）、Godot開発者はCursor/Claude Code（MCP + CLI）、コスト重視ならCline（BYOK無料）が現時点の最適解。ただしGDScriptのAI支援品質は全ツール共通の弱点。

## 2. Findings

### ツール比較（価格は公式サイトで確認済み）

| ツール | 形態 | 個人Pro価格 | C# | C++ | GDScript | エージェント | MCP | Confidence |
|--------|------|:----------:|:---:|:---:|:--------:|:----------:|:---:|:----------:|
| GitHub Copilot | IDE拡張 | $10/mo | ◎ | ◎ | △ | ○ Agent Mode | ○ | verified |
| Cursor | IDE (VSCode fork) | $20/mo | ◎ | ◎ | △ | ◎ Composer/Background | ○ | verified |
| Claude Code | CLI + IDE拡張 | $20/mo | ○ | ○ | △ | ◎ Agentic loop | ◎ | verified |
| Windsurf | IDE (VSCode fork) | $15/mo | ○ | ○ | △ | ○ Cascade | ○ | verified |
| Cline | VSCode拡張 (OSS) | 無料 (API実費) | ○ | ○ | △ | ○ Plan/Act | ○ | verified |

◎=強い ○=対応 △=限定的（訓練データ不足）

### 価格詳細（全て公式サイトで確認済み）

| ツール | 無料枠 | Pro | パワーユーザー | チーム |
|--------|--------|-----|:-------------:|--------|
| Copilot | 2,000補完 + 50 premium/mo | $10/mo (300 req) | $39/mo (1,500 req) | $19/user/mo |
| Cursor | 50 premium req/mo | $20/mo | $60-200/mo | $40/user/mo |
| Claude Code | なし（Free版に限定的） | $20/mo | $100-200/mo | $25-125/seat/mo |
| Windsurf | 25 credits/mo | $15/mo (500 credits) | — | $30/user/mo |
| Cline | 全機能無料 | API実費のみ (~$50-150/mo) | 同左 | $20/mo (Q1 2026後) |

### エンジン別MCP統合（GitHub確認済み）

| エンジン | MCPプロジェクト | Stars | 対応ツール | Confidence |
|---------|---------------|------:|-----------|:----------:|
| Unity | [mcp-unity](https://github.com/CoderGamester/mcp-unity) | 1,300 | Cursor, Claude Code, Windsurf | verified (gh) |
| Unreal | [unreal-mcp](https://github.com/chongdashu/unreal-mcp) | — | Cursor, Claude Code | unverified |
| Godot | [godot-mcp](https://github.com/Coding-Solo/godot-mcp) | — | Cursor, Claude Code | unverified |

### ゲーム開発コミュニティの声

| 知見 | 詳細 | Confidence |
|------|------|:----------:|
| GDScriptのAI支援が最弱 | 訓練データにGDScript 1と2が混在。全ツール共通の問題 | verified (複数ソース) |
| Unity APIの非推奨提案 | CopilotがUnityの古いAPIを提案する問題が報告済み | verified (Unity Forum) |
| ゲーム業界の52%がAIに否定的 | GDC 2026調査。プログラマーは59%が否定的 | verified (GDC survey) |
| MCP統合が解決策として浮上 | AI にリアルタイムのプロジェクトコンテキストを与える | verified (GitHub repos) |
| Vibe codingは小規模ゲームで有効 | 50K行超のプロジェクトではデバッグ時間が41%増という報告 | inferred (単一調査) |

### 市場動向

| 指標 | データ | Confidence |
|------|--------|:----------:|
| Copilot市場シェア | ~42% | unverified (CB Insights引用) |
| Cursor評価額 | $29.3B (2025年11月) | verified (CNBC) |
| Copilotユーザー数 | 2,000万+ (2025年7月) | verified (TechCrunch) |
| AI開発ツール市場 | $4.7B-$7.4B (2025年推定) | unverified (調査会社で2倍の差) |

## 3. Recommendations

| # | What to change | How to change it | Why |
|---|----------------|-----------------|-----|
| 1 | ゲーム開発でのツール選定 | **Unity**: Copilot ($10/mo) + MCP Unity。**Godot**: Cursor ($20/mo) or Claude Code ($20/mo) + MCP Godot。**コスト最優先**: Cline (無料 + API実費) | エンジンごとに最適解が異なる。MCPが共通基盤になりつつある |
| 2 | GDScript対策 | MCP Godotサーバーで公式ドキュメントをコンテキストに注入。[godot-copilot](https://github.com/minosvasilias/godot-copilot) のzero-shot説明アプローチも有効 | 全ツール共通の弱点。ツール側の改善を待つより補助策を取る |
| 3 | Claude Codeをゲーム開発で使う場合 | MCP接続（mcp-unity/godot/unreal）を設定。ビルドコマンドをCLAUDE.mdに記載。テスト実行で検証 | CLIベースのため、補完はないがエージェント的な大規模作業（リファクタ、機能実装）に強い |

## 4. Next Steps

1. 実際に使うエンジンを決めてから、対応するMCPサーバーを設定
2. テンプレートに `mcp-unity` / `mcp-godot` の設定例を `.mcp.json.example` に追加検討
3. GDScript対策のベストプラクティスを調査（別の /research トピック候補）
4. Create SPEC.md from these findings

## 5. Sources

| Source | Status | URL |
|--------|:------:|-----|
| Cursor Pricing | verified | https://cursor.com/pricing |
| GitHub Copilot Plans | verified | https://github.com/features/copilot/plans |
| Claude Pricing | verified | https://claude.com/pricing |
| Windsurf Pricing | verified | https://windsurf.com/pricing |
| Cline | verified | https://cline.bot/pricing |
| mcp-unity | verified (gh) | https://github.com/CoderGamester/mcp-unity |
| GDC 2026 Survey | verified | https://www.gamedeveloper.com/business/one-third-of-game-workers-use-generative-ai-but-half-think-it-s-bad-for-the-industry |
| JetBrains Game Dev Report | verified | https://blog.jetbrains.com/dotnet/2026/01/29/game-dev-in-2025-excerpts-from-the-state-of-game-development-report/ |
| Unity Forum (deprecated APIs) | verified | https://discussions.unity.com/t/github-copilot-uses-outdated-codes-for-unity-how-can-i-fix-it/1647764 |
| Godot AI scripting discussion | verified | https://forum.godotengine.org/t/opinions-on-using-ai-for-scripting/125613 |
| Cursor $29.3B valuation | verified | https://www.cnbc.com/2025/11/13/cursor-ai-startup-funding-round-valuation.html |
