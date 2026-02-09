#!/usr/bin/env node
// SessionStart hook (compact): Restore context from snapshot after compaction
const fs = require("fs");
const path = require("path");

let input = "";
process.stdin.on("data", (d) => (input += d));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);

    // Only restore on compact (not startup/resume/clear)
    if (data.source !== "compact") process.exit(0);

    const snapshot = path.join(data.cwd, ".claude", "CONTEXT-SNAPSHOT.jsonl");
    if (!fs.existsSync(snapshot)) process.exit(0);

    // Read snapshot, limit to 20KB
    const content = fs.readFileSync(snapshot, "utf8").slice(0, 20000);

    // Clean up after reading
    fs.unlinkSync(snapshot);

    const output = {
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: [
          "## Context from before compaction",
          "",
          "Below is the recent transcript before context was compacted.",
          "Use this to maintain continuity of the current task:",
          "",
          content,
        ].join("\n"),
      },
    };

    console.log(JSON.stringify(output));
  } catch {
    // Silent failure — never block session start
    process.exit(0);
  }
});
