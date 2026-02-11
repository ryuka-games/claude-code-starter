# Claude Codeの回答完了と承認待ちをOS通知で受け取る

> Claude Codeが長いタスクを実行中、別の作業をしていて完了に気づかない。承認待ちでClaudeがブロックされてるのに気づかず時間を無駄にする。hookで解決する。

## Tags

`Claude Code` `hook` `通知` `Stop` `PermissionRequest` `Tips`

## 問題: 気づけない2つの瞬間

Claude Codeを使っていると、2つの「気づけない瞬間」がある:

1. **回答完了** — 長い実装やリサーチが終わったのに、別タブで作業してて気づかない
2. **承認待ち** — Claudeがファイル変更の承認を待ってブロックしてるのに、気づかない

特に2番目は深刻。Claudeは承認が来るまで何もできず、ただ待っている。

## 解決: 1つのスクリプトで両方対応

`Stop`イベントと`PermissionRequest`イベントに同じ通知スクリプトをフックする。

### notify.js

```javascript
#!/usr/bin/env node
const { exec } = require("child_process");
const os = require("os");

let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    const title = "Claude Code";

    let message;
    if (data.tool_name) {
      message = `承認待ち: ${data.tool_name}`;
    } else {
      message = "回答が完了しました";
    }

    const platform = os.platform();
    let cmd;

    if (platform === "win32") {
      const escaped = message.replace(/'/g, "''");
      const ps = [
        "Add-Type -AssemblyName System.Windows.Forms",
        "$n = New-Object System.Windows.Forms.NotifyIcon",
        "$n.Icon = [System.Drawing.SystemIcons]::Information",
        "$n.Visible = $true",
        `$n.BalloonTipTitle = '${title}'`,
        `$n.BalloonTipText = '${escaped}'`,
        "$n.ShowBalloonTip(5000)",
        "Start-Sleep 1",
        "$n.Dispose()",
      ].join("; ");
      cmd = `powershell -NoProfile -Command "& {${ps}}"`;
    } else if (platform === "darwin") {
      cmd = `osascript -e 'display notification "${message}" with title "${title}"'`;
    } else {
      cmd = `notify-send "${title}" "${message}"`;
    }

    exec(cmd, () => process.exit(0));
  } catch {
    process.exit(0);
  }
});
```

### settings.json

```json
{
  "hooks": {
    "Stop": [
      { "hooks": [{ "type": "command", "command": "node .claude/hooks/notify.js" }] }
    ],
    "PermissionRequest": [
      { "hooks": [{ "type": "command", "command": "node .claude/hooks/notify.js" }] }
    ]
  }
}
```

## プロジェクト単位 vs ユーザー単位

このhookはプロジェクトに依存しない。全プロジェクトで使いたければユーザーレベルの設定に移せる。

| レベル | 設定場所 | スクリプト場所 |
|--------|---------|--------------|
| プロジェクト | `.claude/settings.json` | `.claude/hooks/notify.js` |
| ユーザー | `~/.claude/settings.json` | `~/.claude/hooks/notify.js` |

ユーザーレベルの場合、hookコマンドのパス指定に注意:
- Windows: `node "%USERPROFILE%/.claude/hooks/notify.js"`
- Mac/Linux: `node ~/.claude/hooks/notify.js`

hookスクリプト内の `data.cwd` は常に現在のプロジェクトパスを指すため、出力がグローバルに影響することはない。

## イベントの判別ロジック

`Stop`と`PermissionRequest`で同じスクリプトを使っている。どちらのイベントか判別するのは入力JSONの `tool_name` フィールド:

- `tool_name` あり → `PermissionRequest`（承認待ち）
- `tool_name` なし → `Stop`（回答完了）

## まとめ

- `Stop` + `PermissionRequest` hookでOS通知を飛ばせる
- 1つのNode.jsスクリプトでWindows/Mac/Linux対応
- プロジェクト単位でもユーザー単位でも設定可能
- コードは[claude-code-starter](https://github.com/ryuka-games/claude-code-starter)に含まれている
