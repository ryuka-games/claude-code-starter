# Claude Codeのコンテキスト消失をhookで自動復元する

> Claude Codeで長時間作業していると避けられない「コンテキスト圧縮」。直前まで話していた文脈が消えて「何の話でしたっけ？」状態になるのを、hookで自動的に解決する方法。

## Tags

`Claude Code` `hook` `PreCompact` `SessionStart` `生産性`

## 問題: compactで文脈が消える

Claude Codeはコンテキストウィンドウに限りがある。長い会話を続けると自動的に「圧縮（compact）」が走り、古いやり取りが要約される。

問題は、この圧縮で**直前の作業文脈が大幅に失われる**こと。

- 「さっき話したあの設計方針、覚えてる？」→ 覚えてない
- 「次にやるべきことは？」→ 的外れな提案
- 作業の連続性が途切れて、毎回説明し直す羽目に

これはClaude Codeユーザー共通の悩みで、GitHubのissue（#15923, #17237）にも多数報告されている。

## 解決策: PreCompact + SessionStart hookの組み合わせ

Claude Codeのhookシステムを使って、圧縮前後に自動的に文脈を保存・復元する。

```
圧縮前（PreCompact）
  → transcriptから会話内容を抽出してファイルに保存

圧縮後（SessionStart, matcher: "compact"）
  → 保存した内容をコンテキストに注入 → ファイル削除
```

### 保存側: save-context.js

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
      if (data.toolUseResult) return null;
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

**ポイント:**
- transcriptのJSONLをパースして、**thinking block・signature・tool結果を除去**
- ユーザーの発言とClaudeのテキスト応答だけを抽出
- 20KB上限で注入サイズを制御

### 復元側: restore-context.js

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
    fs.unlinkSync(snapshot); // 読み取り後に自動削除

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

### settings.json

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

## なぜraw JSONLの保存ではダメなのか

最初はtranscriptをそのまま保存していたが、JSONLにはノイズが大量に含まれている:

- **thinking block** — Claudeの内部思考（数千トークン）
- **signature** — 暗号署名データ
- **tool results** — ファイル内容やコマンド出力（巨大）

20KBの注入枠をこれらで埋めてしまうと、肝心の会話内容がほとんど入らない。パースして必要な部分だけ抽出することで、実質的に復元できる文脈量が数倍になる。

## クロスプラットフォーム対応のポイント

- **Node.js** を使う（bash + jqだとWindowsで動かない）
- **path.join** でパス結合（OS間のセパレータ差を吸収）
- **相対パス** でhookコマンドを書く（`$CLAUDE_PROJECT_DIR` はWindowsで展開されない）
- **fs モジュール** のみ使用（外部依存ゼロ）

## 多層防御としてのコンテキスト管理

このhookは「直前の文脈」を救うものだが、プロジェクト全体のコンテキスト管理は多層で考えるべき:

| 層 | 仕組み | 保持するもの |
|---|---|---|
| CLAUDE.md Working Plan | 手動更新 | プロジェクトの大枠・方針 |
| PreCompact hook | 自動 | 直前の作業文脈 |
| Auto Memory | 自動 | プロジェクトレベルの学び |

どれか一つで完璧にはならない。組み合わせて使う。

## まとめ

- コンテキスト圧縮時の文脈消失はPreCompact + SessionStart hookで自動復元できる
- JSONLをパースしてノイズ除去することで、限られた注入枠を有効活用する
- Node.jsで書けばWindows/Mac/Linux共通で動く
- コードは[claude-code-starter](https://github.com/ryuka-games/claude-code-starter)のテンプレートに含まれている
