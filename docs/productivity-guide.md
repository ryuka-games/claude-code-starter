# Claude Code 開発効率化ガイド

> Claude Codeのポテンシャルを最大限に引き出すための実践的リファレンス

---

## 目次

1. [CLAUDE.md - プロジェクトの記憶](#1-claudemd---プロジェクトの記憶)
2. [Hooks - 自動化ワークフロー](#2-hooks---自動化ワークフロー)
3. [MCP Servers - 外部ツール連携](#3-mcp-servers---外部ツール連携)
4. [Settings & Permissions - 権限制御](#4-settings--permissions---権限制御)
5. [ワークフロー & 生産性Tips](#5-ワークフロー--生産性tips)
6. [Advanced Patterns - 上級テクニック](#6-advanced-patterns---上級テクニック)
7. [CLI フラグ & ヘッドレス自動化](#7-cli-フラグ--ヘッドレス自動化)

---

## 1. CLAUDE.md - プロジェクトの記憶

CLAUDE.mdはClaude Codeへの永続的な指示書。セッションをまたいで有効。

### ファイル階層（優先度順）

| 種類 | 場所 | 共有 | 用途 |
|------|------|------|------|
| マネージド | `C:\Program Files\ClaudeCode\CLAUDE.md` | 全ユーザー | 組織ポリシー |
| プロジェクト | `./CLAUDE.md` or `./.claude/CLAUDE.md` | チーム(git) | チーム共有ルール |
| プロジェクトルール | `./.claude/rules/*.md` | チーム(git) | トピック別ルール |
| ユーザー | `~/.claude/CLAUDE.md` | 自分のみ | 個人の好み(全プロジェクト) |
| ローカル | `./CLAUDE.local.md` | 自分のみ | 個人のプロジェクト設定 |
| 自動メモリ | `~/.claude/projects/<project>/memory/` | 自分のみ | Claudeの自動学習 |

### 始め方

```
/init
```

これで`.claude/CLAUDE.md`のテンプレートが生成される。

### 効果的なCLAUDE.mdの例

```markdown
# Project Instructions

## 技術スタック
- Node.js + Bun パッケージマネージャ
- TypeScript strict mode
- React (フロントエンド)
- PostgreSQL (データベース)

## ビルド & テストコマンド
- ビルド: `bun run build`
- テスト: `bun test --coverage`
- リント: `bun run lint:fix`
- 開発サーバー: `bun run dev`

## コーディング規約
- インデント: 2スペース
- 関数名: camelCase
- コンポーネント: PascalCase
- exportされた関数にはJSDocコメント必須

## アーキテクチャ
- 状態管理: Context API（Reduxは使わない）
- コンポーネント: `src/components/`
- ユーティリティ: `src/utils/`
- API呼び出し: `src/api/`

## セキュリティ
- .envファイルはコミット禁止
- ユーザー入力はクライアント・サーバー両方でバリデーション
- SQLは必ずパラメータ化クエリ

## よく使うパス
- 認証: `src/middleware/auth.ts`
- エラーハンドリング: `src/utils/api-error.ts`
- DB接続: `src/lib/db.ts`
```

### モジュラールール（.claude/rules/）

大きなプロジェクトでは、トピック別にルールファイルを分割できる:

```
.claude/
├── CLAUDE.md
└── rules/
    ├── code-style.md    # コーディングスタイル
    ├── testing.md       # テスト規約
    ├── api-design.md    # API設計基準
    └── security.md      # セキュリティ要件
```

`paths`フロントマターで特定のファイルパターンにのみ適用:

```markdown
---
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
---

# テスト規約
- 全モジュールにユニットテスト必須
- カバレッジ目標: 80%以上
- Jest + @testing-library/react を使用
```

### CLAUDE.mdからの外部ファイル参照

```markdown
# プロジェクト概要
@README を参照

# アーキテクチャ
@docs/architecture.md を参照

# 利用可能なnpmコマンド
@package.json を参照
```

### 自動メモリ

Claudeが自動的に学習した内容を記録する:

```
/memory     # メモリファイルを確認・編集
```

手動で記憶させることも可能:
```
> APIキーはAWS Secrets Managerに格納されていることを覚えて
> このプロジェクトはpnpmを使っていることをメモリに保存して
```

### ベストプラクティス

**書くべきもの:**
- Claudeが推測できないビルド/テストコマンド（`npm run build`, `cargo test`等）
- デフォルトと異なるコードスタイル規約
- プロジェクト固有のアーキテクチャ判断
- 開発環境の癖（必要な環境変数、前提条件）
- よくあるハマりポイント（非自明な挙動）

**書くべきでないもの:**
- Claudeがコードを読めばわかること（冗長）
- 言語の標準的な慣習（Claudeは知っている）
- 長大なAPIドキュメント（リンクで代替）
- 頻繁に変わる情報（陳腐化する）
- 「きれいなコードを書く」等の自明な指示

**ゴールデンルール:** 各行について「これを消したらClaudeがミスするか？」と問う。NOなら削除。

**その他のTips:**
- **具体的に書く**: 「コード整形する」→「2スペースインデント、Prettierを使用」
- **構造化**: 見出し＋箇条書きで整理
- **コマンドを目立たせる**: ビルド/テスト/デプロイコマンドを上部に配置
- **定期的に更新**: プロジェクトの進化に合わせてメンテナンス
- **簡潔に**: 自動メモリは先頭200行のみ読み込まれる
- **重要ルールは強調**: 「IMPORTANT」「YOU MUST」で本当に重要なルールを目立たせる
- **gitで管理**: チームが貢献できるようにバージョン管理する

---

## 2. Hooks - 自動化ワークフロー

Hooksはライフサイクルイベントに応じて実行されるシェルコマンド。ルールの強制、タスクの自動化に使う。

### 利用可能なイベント

| イベント | 発火タイミング | ブロック可能 | マッチャー対象 | 用途 |
|----------|---------------|:---:|---------------|------|
| `SessionStart` | セッション開始/再開時 | - | startup/resume/clear/compact | 環境セットアップ、コンテキスト注入 |
| `UserPromptSubmit` | プロンプト処理前 | Yes | なし | 入力のバリデーション/拡張 |
| `PreToolUse` | ツール実行前 | Yes | ツール名 | コマンドの事前検証 |
| `PermissionRequest` | 権限ダイアログ表示時 | Yes | ツール名 | 安全な操作の自動承認 |
| `PostToolUse` | ツール成功後 | - | ツール名 | 自動フォーマット、リント |
| `PostToolUseFailure` | ツール失敗後 | - | ツール名 | リトライ、エラー回復 |
| `Notification` | 注意が必要な時 | - | 通知タイプ | デスクトップ通知 |
| `SubagentStart` | サブエージェント生成時 | - | エージェント型名 | サブエージェントのセットアップ |
| `SubagentStop` | サブエージェント完了時 | Yes | エージェント型名 | クリーンアップ・出力検証 |
| `Stop` | 応答完了時 | Yes | なし | 完了前の検証 |
| `TeammateIdle` | チームメイトがidle化前 | Yes | なし | チーム間品質ゲート |
| `TaskCompleted` | タスク完了マーク時 | Yes | なし | 完了基準の強制 |
| `PreCompact` | コンテキスト圧縮前 | - | manual/auto | 重要な状態の保存 |
| `SessionEnd` | セッション終了時 | - | clear/logout/etc. | クリーンアップ、ログ |

### 設定場所

| 場所 | スコープ | 共有 |
|------|---------|------|
| `~/.claude/settings.json` | 全プロジェクト | 自分のみ |
| `.claude/settings.json` | プロジェクト | チーム(git) |
| `.claude/settings.local.json` | プロジェクト | 自分のみ |

### Hook入出力

**入力** (stdinからJSON):
```json
{
  "session_id": "abc123",
  "cwd": "/path/to/project",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": { "command": "npm test" }
}
```

**出力**:
- Exit code 0: アクション許可
- Exit code 2: アクションをブロック（stderrがClaudeへのフィードバックに）
- その他: アクション続行（stderrはログのみ）

### 実践例

#### 例1: ファイル編集後に自動フォーマット

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

#### 例2: 保護ファイルへの編集をブロック

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/protect-files.sh"
          }
        ]
      }
    ]
  }
}
```

`.claude/hooks/protect-files.sh`:
```bash
#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

PROTECTED=(".env" "package-lock.json" ".git/")
for pattern in "${PROTECTED[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Blocked: $FILE_PATH is protected" >&2
    exit 2
  fi
done
exit 0
```

#### 例3: デスクトップ通知

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "powershell.exe -Command \"[System.Windows.Forms.MessageBox]::Show('Claude Code needs attention')\""
          }
        ]
      }
    ]
  }
}
```

#### 例4: コンテキスト圧縮後にリマインダー注入

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Reminder: bunを使うこと。コミット前にbun testを実行。'"
          }
        ]
      }
    ]
  }
}
```

#### 例5: プロンプトベースのHook（AI判断）

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "全てのタスクが完了したか確認。未完了なら理由を返す。"
          }
        ]
      }
    ]
  }
}
```

#### 例6: 非同期Hook（バックグラウンドでテスト実行）

ファイル変更後にバックグラウンドでテストを走らせる:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/run-tests-async.sh",
            "async": true,
            "timeout": 300
          }
        ]
      }
    ]
  }
}
```

結果は次のターンで`systemMessage`として配信される。

#### 例7: Bashコマンドのログ記録

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.command' >> ~/.claude/command-log.txt"
          }
        ]
      }
    ]
  }
}
```

#### 例8: セッション開始時の環境変数設定

```bash
#!/bin/bash
if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo 'export NODE_ENV=development' >> "$CLAUDE_ENV_FILE"
  echo 'export PATH="$PATH:./node_modules/.bin"' >> "$CLAUDE_ENV_FILE"
fi
exit 0
```

### Hook構造化JSON出力

exit code 0で返すJSON構造:

```json
{
  "continue": true,
  "decision": "block",
  "reason": "説明",
  "systemMessage": "ユーザーに表示するメッセージ",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow|deny|ask",
    "permissionDecisionReason": "理由"
  }
}
```

### 注意: Stopフックの無限ループ防止

Stopフック内でClaudeに追加作業をさせると、再度Stopが発火する。`stop_hook_active`をチェック:

```bash
#!/bin/bash
INPUT=$(cat)
if [ "$(echo "$INPUT" | jq -r '.stop_hook_active')" = "true" ]; then
  exit 0  # 再帰を防止
fi
# 通常の検証処理...
```

### Hookの対話的設定

```
/hooks
```

GUI形式でHookの追加・編集・テストが可能。

---

## 3. MCP Servers - 外部ツール連携

MCP (Model Context Protocol) はClaude Codeを外部ツール・データに接続する標準プロトコル。

### MCPでできること

- イシュートラッカー連携（GitHub Issues, JIRA）
- DB直接クエリ（PostgreSQL, MongoDB）
- エラー監視（Sentry）
- Web自動テスト（Playwright）
- コミュニケーション（Slack）
- デザイン（Figma）

### インストール方法

#### HTTP接続（推奨）

```bash
claude mcp add --transport http stripe https://mcp.stripe.com
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```

#### ローカルStdio接続

```bash
# NPMパッケージ
claude mcp add --transport stdio airtable \
  --env AIRTABLE_API_KEY=YOUR_KEY \
  -- npx -y airtable-mcp-server

# Python
claude mcp add --transport stdio my-db \
  -- python /path/to/db-server.py
```

### スコープ

| スコープ | 場所 | 用途 |
|---------|------|------|
| Local | `.claude.json` | 個人のプロジェクト用 |
| Project | `.mcp.json` | チーム共有(git管理) |
| User | `~/.claude.json` | 全プロジェクト共通 |

```bash
claude mcp add --scope project --transport http sentry https://mcp.sentry.dev/mcp
claude mcp add --scope user --transport http hubspot https://mcp.hubspot.com/anthropic
```

### 人気MCP Servers

#### GitHub

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
/mcp  # 認証
```

使用例: 「PR #456をレビューして」「新しいissueを作成して」

#### PostgreSQL

```bash
claude mcp add --transport stdio db \
  -- npx -y @bytebase/dbhub \
  --dsn "postgresql://user:pass@localhost:5432/mydb"
```

使用例: 「今月の売上合計は？」「ordersテーブルのスキーマを見せて」

#### Sentry

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
/mcp  # 認証
```

使用例: 「過去24時間で最も多いエラーは？」

#### Playwright（Web自動テスト）

```bash
claude mcp add --transport stdio playwright \
  -- npx -y @playwright/mcp@latest
```

使用例: 「ログインフローが動くかテストして」「モバイル表示のスクショ撮って」

### .mcp.json（チーム共有設定）

プロジェクトルートに配置:

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "database": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@bytebase/dbhub"],
      "env": {
        "DB_HOST": "${DB_HOST:-localhost}"
      }
    }
  }
}
```

### MCP管理コマンド

```bash
claude mcp list          # 一覧表示
claude mcp get github    # 詳細表示
claude mcp remove github # 削除
/mcp                     # 対話的管理UI
```

---

## 4. Settings & Permissions - 権限制御

### 設定ファイルの優先度（高→低）

1. **Managed** - `managed-settings.json`（管理者がデプロイ）
2. **コマンドライン引数** - 一時的なセッションオーバーライド
3. **Local** - `.claude/settings.local.json`（個人・プロジェクト別）
4. **Project** - `.claude/settings.json`（チーム共有）
5. **User** - `~/.claude/settings.json`（個人・全プロジェクト）

### パーミッションモード

| モード | 動作 |
|--------|------|
| `default` | 標準: 初回使用時に許可を求める |
| `acceptEdits` | ファイル編集を自動承認 |
| `plan` | 読み取り専用（分析のみ、変更なし） |
| `bypassPermissions` | 全プロンプトスキップ（コンテナ内限定） |

### パーミッションルール例

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git *)",
      "Read",
      "Glob",
      "Grep",
      "WebFetch"
    ],
    "deny": [
      "Bash(curl *)",
      "Bash(rm -rf *)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  }
}
```

### おすすめ設定パターン

#### 開発用（安全なコマンドを自動承認）

```json
{
  "permissions": {
    "defaultMode": "default",
    "allow": [
      "Bash(npm run *)",
      "Bash(npm install)",
      "Bash(npm test)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git add *)",
      "Read",
      "Glob",
      "Grep"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Read(./.env*)",
      "Read(./secrets/**)"
    ]
  }
}
```

#### CI/CD用

```json
{
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Bash(npm run *)",
      "Bash(npm test)",
      "Bash(git commit *)",
      "Bash(git push)",
      "Read",
      "Edit",
      "Write"
    ]
  }
}
```

### 対話的権限管理

```
/permissions
```

---

## 5. ワークフロー & 生産性Tips

### スラッシュコマンド一覧

| コマンド | 用途 |
|---------|------|
| `/init` | CLAUDE.mdの初期化 |
| `/memory` | メモリファイルの編集 |
| `/commit` | gitコミット作成 |
| `/commit-push-pr` | コミット→プッシュ→PR作成 |
| `/review` | コードレビュー |
| `/mcp` | MCPサーバー管理 |
| `/hooks` | Hook設定 |
| `/permissions` | 権限管理 |
| `/model` | モデル切り替え |
| `/plan` | プランモードに入る |
| `/compact` | コンテキスト圧縮 |
| `/resume` | セッション再開 |
| `/rename` | セッション名変更 |
| `/rewind` | 前の状態に巻き戻し |
| `/cost` | トークン使用量表示 |
| `/context` | コンテキスト使用量の可視化 |
| `/vim` | vimモード有効化 |

### キーボードショートカット

| ショートカット | アクション |
|---------------|-----------|
| `Escape` | 入力キャンセル |
| `Tab` | 補完を受け入れ |
| `Ctrl+C` | 現在の操作を中断 |
| `Ctrl+D` | Claude Code終了 |
| `Ctrl+G` | 外部エディタで開く |
| `Ctrl+R` | 履歴検索 |
| `Ctrl+V` | クリップボードから画像を貼り付け |
| `Shift+Tab` | パーミッションモード切替 |
| `Alt+P` | モデル切り替え |
| `Alt+T` | 拡張思考のオン/オフ |
| `Esc` `Esc` | 巻き戻し/要約 |
| `!` (行頭) | Bashモード（直接コマンド実行） |
| `@` | ファイル参照の補完 |

### プランモード活用法

コードを変更せずに分析・計画:

```bash
# プランモードで起動
claude --permission-mode plan

# セッション中に切り替え
# Shift+Tab でモード切替

# 直接コマンド
/plan
```

プランモードでは:
- 全ファイルの読み取り・分析OK
- 検索・grep OK
- ファイルの変更・コマンド実行は不可

#### プランモード実践パターン: OAuth導入の例

```
# Step 1 - 探索（プランモード）
> /src/auth を読んでセッション管理とログインの仕組みを理解して

# Step 2 - 計画（プランモード）
> Google OAuthを追加したい。どのファイルを変更する必要がある？
> セッションフローは？詳細な計画を作成して

# Step 3 - 実装（Shift+Tabでモード切替）
> 計画に基づいてOAuthフローを実装して。テストも書いて実行

# Step 4 - コミット
> /commit-push-pr
```

#### インタビューワークフロー（大規模機能向け）

```
[機能の簡単な説明]を作りたい。
AskUserQuestionツールを使って詳しくインタビューして。

技術的な実装、UI/UX、エッジケース、懸念点、トレードオフについて聞いて。
自明な質問はしないで、見落としがちな難しい部分を掘り下げて。

全てカバーしたらSPEC.mdに完全な仕様書を書いて。
```

→ その後、新しいセッションでクリーンなコンテキストから実装開始。

### 効果的なプロンプトの書き方

#### 基本原則

```
❌ 「authのバグを直して」
✅ 「メールアドレスに+が含まれるとログインに失敗するバグを修正して」

❌ 「このコードをリファクタリングして」
✅ 「@src/utils/auth.js の非推奨APIを最新パターンに更新して。後方互換性は維持」

❌ 「Strategyパターンを使って、インターフェースと具象クラスとファクトリを…」
✅ 「このコントローラの結合度を下げてテスタビリティを改善して」
```

#### `@`でファイルを直接参照

```
> @src/api/users.ts と @src/api/posts.ts のパターンを比較して
> 同じパターンを @src/api/products.ts に適用して
```

- 複数ファイル同時参照OK
- ディレクトリも指定可能（構造のみ表示）: `@src/components`

#### 検証手段を与える

```
レート制限を実装して。テストで検証:
- 制限以下のリクエストは通過
- 制限超過で429を返す
- レート制限が正しくリセットされる
テストを実行して失敗があれば修正して。
```

#### 症状を伝える（解決策を指定しない）

```
❌ 「Cacheクラスを削除して」
✅ 「ユーザーからパフォーマンス低下の報告。昨日Cacheクラスを更新した。
   旧バージョンと比較して問題があれば修正案を提示して」
```

#### 画像の活用

`Ctrl+V`でスクリーンショットやデザインモックアップを貼り付け可能:
```
[デザイン画像を貼り付け]
このデザインに合うCSSを実装して。結果のスクショを撮って比較して。
```

### バックグラウンドタスク

`Ctrl+B` で実行中のコマンドをバックグラウンドに移動:
- 長時間のビルド、テスト、パッケージインストール等に有効
- バックグラウンドタスクにはIDが割り振られる
- 結果は後で確認可能

### セッション管理

```bash
# セッションに名前をつける
/rename auth-refactor

# 名前で再開
claude --resume auth-refactor

# 直前のセッションを継続
claude --continue

# セッション一覧から選択
claude --resume
```

### Git ワークフロー

```
# ワンコマンドでコミット → プッシュ → PR
/commit-push-pr

# ステップバイステップ
> 変更内容を要約して
> PRを作成して
```

**git worktreeで並列作業:**
```bash
# 機能Aの作業ディレクトリ
git worktree add ../project-feature-a -b feature-a
cd ../project-feature-a && claude

# バグ修正（別コンテキスト）
git worktree add ../project-bugfix -b bugfix
cd ../project-bugfix && claude
```

---

## 6. Advanced Patterns - 上級テクニック

### カスタムサブエージェント

```
/agents
```

「Create new agent」→ スコープ選択 → 設定

#### サブエージェント定義ファイル例

`.claude/agents/code-reviewer.md`:

```yaml
---
name: code-reviewer
description: コード品質とセキュリティのレビュー
tools: Read, Grep, Glob, Bash
model: sonnet
---

あなたはシニアコードレビュアーです。

レビュー手順:
1. `git diff` で変更箇所を確認
2. コードの明確さ、命名、重複をチェック
3. セキュリティ問題の検出
4. エラーハンドリングの確認
5. テストカバレッジの検証

フィードバック形式:
- 🔴 Critical（必ず修正）
- 🟡 Warning（修正推奨）
- 🟢 Suggestion（検討）
```

### CI/CD統合

#### GitHub Actions

```yaml
name: Claude Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: anthropics/claude-code-action@v1
        with:
          api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "このPRをセキュリティ面でレビューしてください"
```

### カスタムSkill（自作スラッシュコマンド）

`.claude/skills/`にSkillを定義して、独自の`/command`を作成できる。

#### Skill作成手順

```bash
# 1. ディレクトリ作成
mkdir -p .claude/skills/my-command

# 2. SKILL.md作成
```

```yaml
# .claude/skills/my-command/SKILL.md
---
name: my-command
description: コマンドの説明（Claudeが自動起動の判断に使う）
---

Claudeへの指示をここに記述...
```

```
# 3. 使用
/my-command
```

#### Skill格納場所

| 場所 | スコープ |
|------|---------|
| `.claude/skills/` | プロジェクト（チーム共有、git管理） |
| `~/.claude/skills/` | 全プロジェクト（個人） |

#### Skill設定オプション（フロントマター）

| フィールド | 説明 |
|-----------|------|
| `name` | コマンド名（小文字、ハイフン区切り） |
| `description` | 用途の説明（自動起動判定にも使われる） |
| `disable-model-invocation` | `true`で手動起動のみ（Claudeが勝手に呼ばない） |
| `user-invocable` | `false`でClaude専用（ユーザーは呼べない） |
| `allowed-tools` | 使えるツールを制限: `"Read, Grep, Bash"` |
| `model` | モデル指定: `sonnet`, `opus`, `haiku` |
| `context: fork` | 別コンテキストのサブエージェントで実行 |
| `agent` | サブエージェント型: `Explore`, `Plan` |
| `argument-hint` | 補完ヒント: `"[issue-number]"` |

#### 実践例

**コードレビューSkill:**
```yaml
# .claude/skills/review/SKILL.md
---
name: review
description: コード品質とセキュリティのレビュー
disable-model-invocation: true
---

@$0 をレビュー:
- 可読性と明確さ
- パフォーマンス問題
- セキュリティ脆弱性
- エッジケースとエラーハンドリング
```

使用: `/review src/auth.ts`

**GitHub Issue修正Skill:**
```yaml
# .claude/skills/fix-issue/SKILL.md
---
name: fix-issue
description: GitHub Issueを修正する
disable-model-invocation: true
argument-hint: "[issue-number]"
---

GitHub Issue $ARGUMENTS を修正:

1. `gh issue view $ARGUMENTS` でIssue詳細を取得
2. 問題を理解
3. 関連ファイルを検索
4. 修正を実装
5. テストを書いて実行
6. リント・型チェック通過を確認
7. コミット＆PR作成
```

使用: `/fix-issue 1234`

**PR要約Skill（動的コンテキスト）:**
```yaml
# .claude/skills/pr-summary/SKILL.md
---
name: pr-summary
description: PRの変更を要約
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## PRコンテキスト
- PR diff: !`gh pr diff`
- PRコメント: !`gh pr view --comments`
- 変更ファイル: !`gh pr diff --name-only`

## タスク
このPRを要約して...
```

`!`command``で事前にシェルコマンドを実行し、結果をコンテキストに注入できる。

**自動起動Skill（API規約）:**
```yaml
# .claude/skills/api-conventions/SKILL.md
---
name: api-conventions
description: APIエンドポイント実装時のREST設計規約
user-invocable: false
---

APIエンドポイント実装時:
- URLパスはkebab-case
- JSONプロパティはcamelCase
- リスト系は必ずページネーション付き
- バージョンはURLパスに: /v1/users
```

`user-invocable: false`でClaudeが自動的に適用（手動呼び出し不可）。

### 拡張思考（Extended Thinking）

複雑な問題でClaudeに深く考えさせる:

- `Alt+T` でオン/オフ切替
- Opus 4.6で最も効果的
- アーキテクチャ設計、複雑なバグ、トレードオフ評価に最適

```bash
# 思考トークンの上限設定
export MAX_THINKING_TOKENS=50000
```

---

## 7. CLI フラグ & ヘッドレス自動化

### 基本

```bash
claude -p "クエリ"                    # 実行して終了
claude -p "続き" --continue            # 前回の会話を継続
claude -p "作業" --resume session-id   # 特定セッションを再開
```

### 出力フォーマット

```bash
claude -p "要約" --output-format text        # テキストのみ
claude -p "要約" --output-format json        # JSONメタデータ付き
claude -p "一覧" --output-format json | jq -r '.result'  # 結果だけ抽出
```

### パーミッション制御

```bash
claude -p "修正" --allowedTools "Read,Edit,Bash"
claude -p "分析" --disallowedTools "Write,Bash(curl *)"
claude -p "計画" --permission-mode plan
```

### スクリプト連携

```bash
# CIでのコードレビュー
claude -p "変更をレビュー" \
  --allowedTools "Read,Grep,Bash(git diff *)" \
  --output-format json | jq -r '.result'

# エラーログの分析
cat error.log | claude -p "このエラーを説明して修正案を出して"

# コスト制限付き実行
claude -p "監査" --max-budget-usd 5.00

# ターン数制限
claude -p "修正" --max-turns 3
```

---

## クイックスタート チェックリスト

### まず最初にやること

- [ ] `/init` でCLAUDE.mdを作成
- [ ] プロジェクトのビルド/テストコマンドをCLAUDE.mdに記載
- [ ] コーディング規約をCLAUDE.mdに記載

### 効率化 第1段階

- [ ] よく使うコマンドのパーミッションを自動承認に設定
- [ ] PostToolUseフックで自動フォーマット設定
- [ ] .envなどの保護ファイルをdenyルールに追加

### 効率化 第2段階

- [ ] GitHub MCP Serverを接続してPR/Issue操作
- [ ] DB用MCP Serverでデータ直接クエリ
- [ ] Playwright MCPでE2Eテスト自動化

### 効率化 第3段階

- [ ] カスタムサブエージェントを作成（レビュアー、テスター等）
- [ ] CI/CDにClaude Codeを統合
- [ ] git worktreeで並列タスク実行

---

## 設定ファイル早見表

| ファイル | 場所 | 用途 |
|---------|------|------|
| `CLAUDE.md` | プロジェクトルート or `.claude/` | チーム共有の指示 |
| `CLAUDE.local.md` | プロジェクトルート | 個人の指示 |
| `.claude/settings.json` | `.claude/` | チーム共有設定 |
| `.claude/settings.local.json` | `.claude/` | 個人設定 |
| `.claude/rules/*.md` | `.claude/rules/` | トピック別ルール |
| `.claude/agents/*.md` | `.claude/agents/` | カスタムエージェント |
| `.claude/hooks/*.sh` | `.claude/hooks/` | Hookスクリプト |
| `.claude/skills/*/SKILL.md` | `.claude/skills/` | カスタムスラッシュコマンド |
| `.mcp.json` | プロジェクトルート | チーム共有MCP設定 |
| `~/.claude/settings.json` | ホーム | ユーザー全体設定 |
| `~/.claude/CLAUDE.md` | ホーム | ユーザー全体の指示 |
| `~/.claude/keybindings.json` | ホーム | キーバインド設定 |
