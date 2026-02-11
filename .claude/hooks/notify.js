#!/usr/bin/env node
// Notification hook: Send OS notification on Stop / PermissionRequest events
const { exec } = require("child_process");
const os = require("os");

let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    const title = "Claude Code";

    // Determine message based on hook event context
    let message;
    if (data.tool_name) {
      // PermissionRequest: tool_name is present
      message = `承認待ち: ${data.tool_name}`;
    } else {
      // Stop: response complete
      message = "回答が完了しました";
    }

    const platform = os.platform();
    let cmd;

    if (platform === "win32") {
      // Windows: PowerShell balloon notification
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
      // macOS: osascript notification
      cmd = `osascript -e 'display notification "${message}" with title "${title}"'`;
    } else {
      // Linux: notify-send
      cmd = `notify-send "${title}" "${message}"`;
    }

    exec(cmd, () => process.exit(0));
  } catch {
    process.exit(0);
  }
});
