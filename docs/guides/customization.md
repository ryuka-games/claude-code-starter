# カスタマイズガイド

> テンプレートは最小限で始まる。必要になったら、このガイドを見て追加する。

## 早見表

| やりたいこと | 追加するもの | 詳細 |
|---|---|:---:|
| セキュリティルールを強制したい | `.claude/rules/security.md` | [>>](#rules-を追加する) |
| 危険なファイル編集をブロックしたい | hooks (PreToolUse) | [>>](#hooks-を追加する) |
| 繰り返す作業を自動化したい | `.claude/skills/*/SKILL.md` | [>>](#skills-を追加する) |
| 専門的なレビューを自動化したい | `.claude/agents/*.md` | [>>](#agents-を追加する) |

---

## Rules を追加する

`.claude/rules/*.md` に置いたMarkdownファイルは、毎セッション自動で読み込まれる。

```
.claude/rules/
├── security.md      # セキュリティルール
├── testing.md       # テストの書き方
└── api-design.md    # API設計規約
```

### 例: security.md

```markdown
# Security Rules

- .envファイルは絶対にコミットしない
- ユーザー入力は必ずバリデーションする
- SQLは必ずパラメータ化クエリを使う
```

### 特定ファイルだけに適用する

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Rules

- すべてのエンドポイントに入力バリデーションを含める
- 標準エラーレスポンス形式を使う
```

---

## Hooks を追加する

Hooksは特定のタイミングで自動実行されるスクリプト。`.claude/settings.json` に設定する。

### 例: .envファイルの編集をブロック

`.claude/hooks/protect-files.sh`:
```bash
#!/bin/bash
# PreToolUse (Edit, Write) で発火
FILE_PATH=$(echo "$TOOL_INPUT" | jq -r '.file_path // empty')
if [[ "$FILE_PATH" == *.env* ]]; then
  echo "エラー: .envファイルは編集できません" >&2
  exit 2
fi
```

`.claude/settings.json` に追加:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "bash .claude/hooks/protect-files.sh"
      }
    ]
  }
}
```

### 例: 完了通知

`.claude/hooks/notify.sh`:
```bash
#!/bin/bash
# macOS
osascript -e 'display notification "タスク完了" with title "Claude Code"'
# Linux: notify-send "Claude Code" "タスク完了"
# Windows (PowerShell): [System.Windows.MessageBox]::Show("タスク完了")
```

---

## Skills を追加する

`.claude/skills/*/SKILL.md` でスラッシュコマンドを作る。

### 例: /review（コードレビュー）

```
.claude/skills/review/SKILL.md
```

```markdown
---
name: review
description: コードレビューを実行する
disable-model-invocation: true
---

現在の変更をレビューする。

1. `git diff` で変更内容を確認
2. 以下の観点でレビュー:
   - バグやエッジケース
   - セキュリティリスク
   - パフォーマンス問題
   - 既存パターンとの整合性
3. 問題があれば修正案を提示
```

### 例: /techdebt（技術的負債の検出）

```markdown
---
name: techdebt
description: 技術的負債を検出する
disable-model-invocation: true
---

コードベースをスキャンして技術的負債を検出する。

1. TODO/FIXME/HACK コメントを検索
2. 重複コードを検出
3. 非推奨APIの使用を検出
4. 結果をまとめて改善案を提示
```

### 例: /sync（外部ツール一括取得）

```markdown
---
name: sync
description: 外部ツールから最近の情報を一括取得
disable-model-invocation: true
---

直近7日間の情報を各ツールから取得してまとめる。

1. GitHub: `gh` CLIで最近のIssue/PRを取得
2. Slack: MCP経由で関連チャンネルの最新メッセージを取得
3. 結果を要約して現状レポートを作成

注意: 使うツールに合わせてカスタマイズすること。
```

---

## Agents を追加する

`.claude/agents/*.md` で専門的なサブエージェントを定義する。メインのClaudeが必要に応じて起動する。

### 例: セキュリティレビュアー

```markdown
---
name: security-reviewer
description: セキュリティ脆弱性をレビューする
tools: Read, Grep, Glob, Bash
model: opus
---

セキュリティエンジニアとしてコードをレビューする:
- インジェクション脆弱性（SQL, XSS, コマンドインジェクション）
- 認証・認可の不備
- コード内のシークレットや認証情報
- 安全でないデータ処理

具体的な行番号と修正案を提示すること。
```

使い方: `セキュリティレビュアーのサブエージェントを使ってこのコードをレビューして`

---

## 出典

- [Skills 公式ドキュメント](https://code.claude.com/docs/en/skills)
- [Hooks 公式ドキュメント](https://code.claude.com/docs/en/hooks-guide)
- [Subagents 公式ドキュメント](https://code.claude.com/docs/en/sub-agents)
- [Settings 公式ドキュメント](https://code.claude.com/docs/en/settings)
