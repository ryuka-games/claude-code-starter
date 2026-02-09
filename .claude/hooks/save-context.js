#!/usr/bin/env node
// PreCompact hook: Extract meaningful content from transcript before compaction
const fs = require("fs");
const path = require("path");

function extractEntry(line) {
  try {
    const data = JSON.parse(line);
    if (!data.message || !data.message.content) return null;

    const role = data.type; // "assistant" or "user"
    const content = data.message.content;

    if (role === "user") {
      // Skip tool results — only capture actual user input
      if (data.toolUseResult) return null;

      const texts = [];
      if (typeof content === "string") {
        texts.push(content);
      } else if (Array.isArray(content)) {
        for (const item of content) {
          if (typeof item === "string") texts.push(item);
          else if (item.type === "text" && item.text) texts.push(item.text);
          // Skip tool_result items
        }
      }
      if (texts.length === 0) return null;
      return `[User] ${texts.join("\n")}`;
    }

    if (role === "assistant") {
      const parts = [];
      if (!Array.isArray(content)) return null;

      for (const item of content) {
        if (item.type === "text" && item.text) {
          parts.push(item.text);
        } else if (item.type === "tool_use" && item.name) {
          // Capture tool name + brief context, skip full input
          const brief = item.input?.description || item.input?.command?.slice(0, 80) || "";
          parts.push(`[Tool: ${item.name}]${brief ? " " + brief : ""}`);
        }
        // Skip thinking blocks and signatures
      }
      if (parts.length === 0) return null;
      return `[Assistant] ${parts.join("\n")}`;
    }
  } catch {
    return null;
  }
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

    // Read last 200 lines of transcript
    const raw = fs.readFileSync(transcript, "utf8");
    const lines = raw.split("\n").filter((l) => l.trim());
    const tail = lines.slice(-200);

    // Extract meaningful content
    const entries = [];
    for (const line of tail) {
      const entry = extractEntry(line);
      if (entry) entries.push(entry);
    }

    // Truncate to 20KB to stay within reasonable injection size
    let output = entries.join("\n\n");
    if (output.length > 20000) {
      output = output.slice(-20000);
      // Find first complete entry boundary
      const idx = output.indexOf("\n\n[");
      if (idx > 0) output = output.slice(idx + 2);
    }

    fs.mkdirSync(path.dirname(snapshot), { recursive: true });
    fs.writeFileSync(snapshot, output);
  } catch {
    // Silent failure — never block compaction
    process.exit(0);
  }
});
