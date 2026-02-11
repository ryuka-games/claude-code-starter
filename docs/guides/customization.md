# カスタマイズガイド

> テンプレートは最小限で始まる。必要になったら、このガイドを見て追加する。

## 早見表

| やりたいこと | 追加するもの | 詳細 |
|---|---|:---:|
| セキュリティルールを強制したい | `.claude/rules/security.md` | [>>](#rules-を追加する) |
| 特定ファイルだけにルールを適用したい | `.claude/rules/*.md` (paths指定) | [>>](#特定ファイルだけに適用する) |
| CLAUDE.mdを分割・参照したい | `@path/to/file` imports | [>>](#imports-でファイルを参照する) |
| 危険なファイル編集をブロックしたい | hooks (PreToolUse) | [>>](#hooks-を追加する) |
| AIでコードを自動評価したい | hooks (prompt/agent タイプ) | [>>](#hookタイプ) |
| コンテキスト圧縮で文脈を失いたくない | hooks (PreCompact + SessionStart) | [>>](#例-コンテキスト圧縮時に作業文脈を保存復元する) |
| 繰り返す作業を自動化したい | `.claude/skills/*/SKILL.md` | [>>](#skills-を追加する) |
| スキルをサブエージェントで実行したい | SKILL.md に `context: fork` | [>>](#skill-frontmatter-フィールド一覧) |
| 専門的なレビューを自動化したい | `.claude/agents/*.md` | [>>](#agents-を追加する) |
| スキルやhooksをまとめて配布したい | Plugin System | [>>](./plugins.md) |

---

## Rules を追加する

`.claude/rules/*.md` に置いたMarkdownファイルは、毎セッション自動で読み込まれる。サブディレクトリも再帰的に読み込まれる。

```
.claude/rules/
├── security.md      # セキュリティルール
├── testing.md       # テストの書き方
├── frontend/
│   └── react.md     # React固有のルール
└── backend/
    └── api.md       # API設計規約
```

### 例: security.md

```markdown
# Security Rules

- .envファイルは絶対にコミットしない
- ユーザー入力は必ずバリデーションする
- SQLは必ずパラメータ化クエリを使う
```

### 特定ファイルだけに適用する

YAML frontmatterの `paths` フィールドでglobパターンを指定する。

```markdown
---
paths:
  - "src/api/**/*.ts"
  - "src/api/**/*.tsx"
---

# API Rules

- すべてのエンドポイントに入力バリデーションを含める
- 標準エラーレスポンス形式を使う
```

`paths` がないルールは全ファイルに適用される。

---

## Imports でファイルを参照する

CLAUDE.mdから別ファイルを `@path/to/file` 構文で参照できる。長いCLAUDE.mdを分割するのに有用。

```markdown
# Project Instructions

プロジェクト概要は @README.md を参照。
npm コマンドは @package.json を参照。

## 追加ルール
- git ワークフロー @docs/git-instructions.md
```

- 相対パスはCLAUDE.mdからの相対位置で解決
- 再帰的に5階層まで参照可能
- コードブロック内の `@` は無視される
- 初回読み込み時に承認ダイアログが表示される

---

## Hooks を追加する

Hooksは特定のタイミングで自動実行される処理。`.claude/settings.json` に設定する。CLAUDE.mdのルールは「助言」だが、Hooksは「強制」。

### Hookイベント一覧

| イベント | タイミング |
|---------|-----------|
| `SessionStart` | セッション開始・再開時 |
| `SessionEnd` | セッション終了時 |
| `UserPromptSubmit` | ユーザーがプロンプト送信後、処理前 |
| `PreToolUse` | ツール実行前（ブロック可能） |
| `PostToolUse` | ツール実行成功後 |
| `PostToolUseFailure` | ツール実行失敗後 |
| `PermissionRequest` | 権限ダイアログ表示時 |
| `Notification` | Claude Codeが通知を送信時 |
| `SubagentStart` | サブエージェント起動時 |
| `SubagentStop` | サブエージェント終了時 |
| `Stop` | Claudeの応答完了時 |
| `TeammateIdle` | Agent Teamsのチームメイトがアイドルになる時 |
| `TaskCompleted` | タスクが完了マークされる時 |
| `PreCompact` | コンテキスト圧縮前 |

### Hookタイプ

| タイプ | 説明 | 用途 |
|--------|------|------|
| `command` | シェルコマンドを実行。stdinにJSON入力、exit codeで制御 | ファイル保護、フォーマット、通知 |
| `prompt` | LLM（デフォルトHaiku）で単発評価。`{"ok": true/false, "reason": "..."}` を返す | コード品質チェック、セキュリティ評価 |
| `agent` | サブエージェントを起動（Read/Grep/Glob使用可、最大50ターン） | 複雑な検証、多段階チェック |

exit code: 0=成功、2=ブロック（処理中断）、その他=非ブロッキングエラー。

### 例: .envファイルの編集をブロック（commandタイプ）

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
        "hooks": [{ "type": "command", "command": "bash .claude/hooks/protect-files.sh" }]
      }
    ]
  }
}
```

### 例: コード品質をLLMで自動評価（promptタイプ）

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{
          "type": "prompt",
          "prompt": "Review this code change for security issues. Return ok=false if you find any vulnerabilities."
        }]
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

### 例: コンテキスト圧縮時に作業文脈を保存・復元する

コンテキスト圧縮（compact）で直前の作業文脈が失われる問題を、PreCompact + SessionStartの2つのhookで解決する。

**仕組み:**
1. 圧縮前（PreCompact）→ transcriptから会話内容を抽出して保存
2. 圧縮後のセッション開始（SessionStart, matcher: compact）→ 保存した内容を注入 → ファイル削除

**`.claude/hooks/save-context.js`**（保存側）:
```javascript
#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function extractEntry(line) {
  try {
    const data = JSON.parse(line);
    if (!data.message || !data.message.content) return null;
    const role = data.type;
    const content = data.message.content;

    if (role === "user") {
      if (data.toolUseResult) return null; // tool結果はスキップ
      const texts = [];
      if (typeof content === "string") texts.push(content);
      else if (Array.isArray(content)) {
        for (const item of content) {
          if (typeof item === "string") texts.push(item);
          else if (item.type === "text" && item.text) texts.push(item.text);
        }
      }
      return texts.length ? `[User] ${texts.join("\n")}` : null;
    }

    if (role === "assistant") {
      const parts = [];
      if (!Array.isArray(content)) return null;
      for (const item of content) {
        if (item.type === "text" && item.text) parts.push(item.text);
        else if (item.type === "tool_use" && item.name) {
          const brief = item.input?.description || item.input?.command?.slice(0, 80) || "";
          parts.push(`[Tool: ${item.name}]${brief ? " " + brief : ""}`);
        }
        // thinking blocks, signatures はスキップ
      }
      return parts.length ? `[Assistant] ${parts.join("\n")}` : null;
    }
  } catch { return null; }
  return null;
}

let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    const transcript = data.transcript_path;
    const cwd = data.cwd;
    if (!transcript || !fs.existsSync(transcript)) process.exit(0);

    const snapshot = path.join(cwd, ".claude", "CONTEXT-SNAPSHOT.md");
    const raw = fs.readFileSync(transcript, "utf8");
    const lines = raw.split("\n").filter((l) => l.trim());
    const tail = lines.slice(-200);

    const entries = [];
    for (const line of tail) {
      const entry = extractEntry(line);
      if (entry) entries.push(entry);
    }

    let output = entries.join("\n\n");
    if (output.length > 20000) {
      output = output.slice(-20000);
      const idx = output.indexOf("\n\n[");
      if (idx > 0) output = output.slice(idx + 2);
    }

    fs.mkdirSync(path.dirname(snapshot), { recursive: true });
    fs.writeFileSync(snapshot, output);
  } catch { process.exit(0); }
});
```

**`.claude/hooks/restore-context.js`**（復元側）:
```javascript
#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    if (data.source !== "compact") process.exit(0);

    const snapshot = path.join(data.cwd, ".claude", "CONTEXT-SNAPSHOT.md");
    if (!fs.existsSync(snapshot)) process.exit(0);

    const content = fs.readFileSync(snapshot, "utf8").slice(0, 20000);
    fs.unlinkSync(snapshot); // 読み取り後に削除

    const output = {
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: [
          "## Context from before compaction\n",
          "Below is the recent transcript before context was compacted.",
          "Use this to maintain continuity of the current task:\n",
          content,
        ].join("\n"),
      },
    };
    console.log(JSON.stringify(output));
  } catch { process.exit(0); }
});
```

**`.claude/settings.json`**:
```json
{
  "hooks": {
    "PreCompact": [
      { "hooks": [{ "type": "command", "command": "node .claude/hooks/save-context.js" }] }
    ],
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [{ "type": "command", "command": "node .claude/hooks/restore-context.js" }]
      }
    ]
  }
}
```

**ポイント:**
- Node.jsなのでWindows/Mac/Linux共通で動く
- transcript JSONLからthinking block・signature・tool結果を除去し、会話の本質だけ抽出
- 20KB上限で注入サイズを制御
- 復元後にスナップショットを自動削除（ファイルが残らない）
- `.gitignore` に `CONTEXT-SNAPSHOT.md` を追加しておく

---

## Skills を追加する

`.claude/skills/*/SKILL.md` でスラッシュコマンドを作る。

### Skill Frontmatter フィールド一覧

| フィールド | 必須 | 説明 |
|-----------|:----:|------|
| `name` | — | 表示名。省略時はディレクトリ名 |
| `description` | 推奨 | スキルの説明。Claudeが自動起動の判断に使用 |
| `argument-hint` | — | 補完時に表示されるヒント（例: `[issue-number]`） |
| `disable-model-invocation` | — | `true` でClaude自動起動を無効化。副作用があるスキルに推奨 |
| `user-invocable` | — | `false` で `/` メニューから非表示 |
| `allowed-tools` | — | スキル実行中に許可なしで使えるツール |
| `model` | — | スキル実行時に使用するモデル |
| `context` | — | `fork` でサブエージェントコンテキストで実行 |
| `agent` | — | `context: fork` 時のサブエージェントタイプ |
| `hooks` | — | スキルのライフサイクルにスコープされたhooks |

引数は `$ARGUMENTS`（全体）、`$ARGUMENTS[0]`（分割）、`${CLAUDE_SESSION_ID}` で参照可能。

### 例: /review（コードレビュー）

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

### 例: サブエージェントで実行するスキル（context: fork）

```markdown
---
name: deep-analyze
description: コードベースを深く分析する
context: fork
agent: general-purpose
model: opus
---

プロジェクト全体を分析して以下をレポートする:
1. アーキテクチャの概要
2. 主要な依存関係
3. 改善が必要な箇所
```

`context: fork` を使うとメインのコンテキストウィンドウを消費せずに調査できる。

### /research を強化する: Deep Research Skill

テンプレートの `/research` は意図的にシンプル（約65行）。本格的な調査パイプラインが必要になったら、外部スキルへの置き換えを検討する。

**[199-biotechnologies/claude-deep-research-skill](https://github.com/199-biotechnologies/claude-deep-research-skill)**

| 項目 | 内容 |
|------|------|
| フェーズ | 8段階（SCOPE→PLAN→RETRIEVE→TRIANGULATE→OUTLINE→CRITIQUE→REFINE→PACKAGE） |
| 実行モード | Quick / Standard / Deep / UltraDeep |
| 出力形式 | Markdown / HTML / PDF の3形式同時出力 |
| サイズ | SKILL.md 約33KB |

**導入方法:**
```bash
# テンプレートの /research を置き換える
rm -rf .claude/skills/research/
git clone https://github.com/199-biotechnologies/claude-deep-research-skill.git
cp -r claude-deep-research-skill/.claude/skills/deep-research .claude/skills/
```

**注意点:**
- SKILL.mdが大きいため、スキル呼び出し時のコンテキスト消費が多い
- subagentを多数生成するため、実行時間とAPI消費が増える
- まずテンプレートの `/research` で運用し、不足を感じてから導入するのがBoris思想に沿う

---

## Agents を追加する

`.claude/agents/*.md` で専門的なサブエージェントを定義する。メインのClaudeが必要に応じて起動する。

### Agent Frontmatter フィールド一覧

| フィールド | 必須 | 説明 |
|-----------|:----:|------|
| `name` | ○ | 一意の識別子（小文字+ハイフン） |
| `description` | ○ | いつこのエージェントに委譲すべきかの説明 |
| `tools` | — | 使用可能なツール。省略時は全ツール継承 |
| `disallowedTools` | — | 使用禁止ツール |
| `model` | — | `sonnet`, `opus`, `haiku`, `inherit`。デフォルト: `inherit` |
| `permissionMode` | — | `default`, `acceptEdits`, `delegate`, `dontAsk`, `bypassPermissions`, `plan` |
| `maxTurns` | — | 最大ターン数 |
| `skills` | — | 起動時にプリロードするスキル |
| `mcpServers` | — | 使用可能なMCPサーバー |
| `hooks` | — | エージェントにスコープされたhooks |
| `memory` | — | 永続メモリのスコープ: `user`, `project`, `local` |

### 例: セキュリティレビュアー

```markdown
---
name: security-reviewer
description: セキュリティ脆弱性をレビューする
tools: Read, Grep, Glob
model: opus
maxTurns: 20
---

セキュリティエンジニアとしてコードをレビューする:
- インジェクション脆弱性（SQL, XSS, コマンドインジェクション）
- 認証・認可の不備
- コード内のシークレットや認証情報
- 安全でないデータ処理

具体的な行番号と修正案を提示すること。
```

使い方: `セキュリティレビュアーのサブエージェントを使ってこのコードをレビューして`

### 例: 読み取り専用の調査エージェント

```markdown
---
name: investigator
description: コードベースを調査して報告する
tools: Read, Grep, Glob
permissionMode: plan
memory: project
---

コードベースを調査し、結果をテキストで報告する。ファイルの変更は行わない。
```

`permissionMode: plan` で読み取り専用に制限。`memory: project` で調査結果をセッション間で記憶。

---

## 出典

- [Skills 公式ドキュメント](https://code.claude.com/docs/en/skills)
- [Hooks 公式ドキュメント](https://code.claude.com/docs/en/hooks)
- [Subagents 公式ドキュメント](https://code.claude.com/docs/en/sub-agents)
- [Memory 公式ドキュメント](https://code.claude.com/docs/en/memory)
- [Plugins 公式ドキュメント](https://code.claude.com/docs/en/plugins)
- [Settings 公式ドキュメント](https://code.claude.com/docs/en/settings)
