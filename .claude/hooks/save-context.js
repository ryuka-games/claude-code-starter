#!/usr/bin/env node
// PreCompact hook: Save recent transcript before context compaction
const fs = require("fs");
const path = require("path");

let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    const transcript = data.transcript_path;
    const cwd = data.cwd;

    if (!transcript || !fs.existsSync(transcript)) process.exit(0);

    const snapshot = path.join(cwd, ".claude", "CONTEXT-SNAPSHOT.jsonl");

    // Save last 200 lines of transcript (raw JSONL)
    const content = fs.readFileSync(transcript, "utf8");
    const lines = content.split("\n").filter((l) => l.trim());
    const tail = lines.slice(-200).join("\n");

    fs.mkdirSync(path.dirname(snapshot), { recursive: true });
    fs.writeFileSync(snapshot, tail);
  } catch {
    // Silent failure — never block compaction
    process.exit(0);
  }
});
