# AIナレッジマネジメントの既存事例 — 既にやっている人たち

## Summary

**結論**: Claude Code + Obsidian周辺のナレッジ管理は急速にエコシステム化している。ただし既存事例の多くは「セッション記録」が中心で、「プロジェクト知見の構造化（リサーチ・議事録・フィードバックの統合）」は手薄
**推奨アクション**: 既存事例を参考にしつつ、「未来のために整理する」方向で差別化する
**根拠**: driller氏、YOUTRUST、エムスリー等の事例は「過去を記録する」。構想は「specに渡せる状態にする」という目的が異なる

## Claude Codeでナレッジ管理をやっている事例

### driller氏: `.claude/`に知見ファイル群

- `context.md`（技術スタック）、`project-knowledge.md`（設計理由）、`project-improvements.md`（試行錯誤）、`debug-log.md`（問題と解決）
- `/learnings` コマンドで発見時に即座に適切なファイルへ自動整理
- 「新メンバーのオンボーディング時間が半減」

Source: [Claude Codeで効率的に開発するための知見管理](https://zenn.dev/driller/articles/2a23ef94f1d603)

### exwzd氏: Hooks + Skills で作業活動の自動記録・可視化

- `UserPromptSubmit`/`Stop`イベントでプロンプト送信・完了時刻を記録
- JSONL形式で蓄積、17種類のカテゴリに自動分類
- `/activity`コマンドでmatplotlibグラフ生成

Source: [Claude Codeの Hooks と Skills で自分の作業活動を可視化する](https://zenn.dev/exwzd/articles/20260123_activity_tracker)

### delphinus氏: Claude Code会話の全自動Obsidian記録

- Go製CLIツールで4イベントを捕捉→Obsidian Vaultに自動記録
- YAMLフロントマター付きMarkdown、セッション間のWikiリンク自動生成
- iCloud Driveで複数Mac間共有

Source: [Claude Code の会話を全自動で Obsidian に記録する](https://qiita.com/delphinus/items/9325c8dd750c85bac944)

### claude-mem: 自動コンテキストキャプチャプラグイン

- セッション中の全ツール操作を自動キャプチャ→セマンティック圧縮→SQLite保存
- 次回セッション開始時に関連コンテキスト自動注入
- 手動管理の約10倍のトークン効率

Source: [GitHub: thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)

## Obsidian × AI の連携事例

### YOUTRUST: Claude Code × Obsidianでナレッジベース開発環境

- Tactiq(音声文字起こし) → Google Drive → Obsidian の自動化フロー
- **議事録作成時間66%削減、開発コントリビューション2.5倍**
- 情報検索時間: 5-10分 → 30秒以内（90%削減）

Source: [Claude Code x Obsidianで作るナレッジベース開発環境](https://tech.youtrust.co.jp/entry/2025/06/27/111829)

### エムスリー: Obsidian + Claude で「先週何したっけ？」をゼロに

- デイリーノートをハブに各種活動へのリンク集約
- thinoプラグインで短形式の思考記録を即キャプチャ
- Claudeが過去ノート群から週次振り返りの重要ポイントを自動抽出

Source: [「先週何したっけ？」をゼロに：Obsidian + Claude Codeを業務アシスタントに](https://www.m3tech.blog/entry/2025/06/29/110000)

### i3DESIGN: Obsidian × Claude Code × MCP

- MCPでClaude CodeがObsidianノートに直接アクセス
- 「問題発生→過去メモを自動分析→プロジェクト固有の最適解」のフロー

Source: [Obsidian x Claude Code x MCPで変わる開発フロー](https://tech.i3design.jp/obsidian-claudecode-1/)

### Obsidian CLI によるAIエージェントのナレッジベース化

- Obsidian v1.12.4のCLI機能でAIがVaultを外部記憶として利用
- `obsidian search:context`で前後文脈付き検索
- 複数AIツール間でナレッジベースを共有

Source: [Claude CodeからObsidian CLIを操作する](https://qiita.com/ProgrammingForEver/items/e78d656b8aac45296709)

## コードベースの可視化ツール

### Understand-Anything

- 5エージェントパイプラインでコードベースを解析→インタラクティブなナレッジグラフ生成
- ファジー検索・セマンティック検索、依存関係順ガイドツアー

Source: [GitHub: Lum1104/Understand-Anything](https://github.com/Lum1104/Understand-Anything)

### CocoIndex: マークダウン→ナレッジグラフ自動構築

- 議事録マークダウンをLLMで解析→構造化データ（参加者、タスク、決定事項）→Neo4jグラフ
- Google Driveからの自動取得・増分更新

Source: [Building a Knowledge Graph from Meeting Notes](https://cocoindex.io/blogs/meeting-notes-graph)

## Obsidian AIプラグイン（自動タグ付け・リンク・検索）

| プラグイン | 機能 |
|---|---|
| **AI Tagger Universe** | LLMで内容分析→関連タグ自動提案 |
| **Metadata Auto Classifier** | GPTでフロントマターフィールド自動生成 |
| **Automatic Linker** | プレーンテキストの参照を保存時にwikiリンクに自動変換 |
| **Smart Connections** | AI embeddingsで意味的に関連するノートを表示 |
| **Smart Composer** | Vault対応AI編集。@ファイル名で文脈指定 |

## マークダウンベースのナレッジ管理ツール（Obsidian以外）

| ツール | 特徴 |
|---|---|
| **Foam** (VS Code) | Roam Research風。wikilink、バックリンク、グラフ可視化。無料OSS |
| **MindForger** | AI Wingman機能でLLMによるノート展開。自動リンク。OSS |
| **HackMD** | リアルタイム共同編集。AI直接統合 |

## 開発ワークフローにおけるナレッジ管理（ADR以外）

| 手法 | 概要 | 採用先 |
|---|---|---|
| **RFC** | プロジェクト開始前にRFC文書を作成しチーム横断レビュー | Uber, Spotify, Google |
| **Decision Log** | ADRより軽量。マークダウンテーブルで判断記録 | Microsoft推奨 |
| **議事録→ナレッジグラフ** | LLMで構造化データ抽出→Neo4j保存 | CocoIndex |
| **Log4brains** | ADRをgitリポジトリ内で管理→静的サイト自動生成 | OSS |

## AIによる自動タグ付け・分類の精度

- エンタープライズ向け: **手動カテゴリ分類時間60%削減、精度35%向上**
- 技術ドキュメント分類: **92%以上の精度**
- 検索時間: **85%削減**

Source: [Enterprise Knowledge - LLMs for Auto-tagging](https://enterprise-knowledge.com/how-to-leverage-llms-for-auto-tagging-content-enrichment/)

## 既存事例との差別化ポイント

| | 既存事例の多く | 構想 |
|---|---|---|
| 目的 | 過去を記録する | 未来のために整理する（specに渡せる状態にする） |
| 対象 | セッションログ、会話記録 | リサーチ・議事録・フィードバックの統合 |
| 出口 | 検索・振り返り | /specへの構造化インプット |
| 時間軸 | セッション単位 | 日〜週をまたぐ蓄積 |

## Sources

- [driller - Claude Code知見管理](https://zenn.dev/driller/articles/2a23ef94f1d603)
- [exwzd - 作業活動可視化](https://zenn.dev/exwzd/articles/20260123_activity_tracker)
- [delphinus - Obsidian全自動記録](https://qiita.com/delphinus/items/9325c8dd750c85bac944)
- [claude-mem](https://github.com/thedotmack/claude-mem)
- [YOUTRUST - ナレッジベース開発環境](https://tech.youtrust.co.jp/entry/2025/06/27/111829)
- [エムスリー - Obsidian+Claude](https://www.m3tech.blog/entry/2025/06/29/110000)
- [i3DESIGN - Obsidian×MCP](https://tech.i3design.jp/obsidian-claudecode-1/)
- [Obsidian CLI活用](https://qiita.com/ProgrammingForEver/items/e78d656b8aac45296709)
- [Understand-Anything](https://github.com/Lum1104/Understand-Anything)
- [CocoIndex](https://cocoindex.io/blogs/meeting-notes-graph)
- [Smart Connections](https://github.com/brianpetro/obsidian-smart-connections)
- [Foam](https://github.com/foambubble/foam)
- [Enterprise Knowledge - Auto-tagging](https://enterprise-knowledge.com/how-to-leverage-llms-for-auto-tagging-content-enrichment/)
