#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const targetDir = process.argv[2];

if (!targetDir) {
  console.log("使い方: node setup.js <プロジェクトのパス>");
  console.log("例:     node setup.js C:\\Users\\you\\projects\\my-app");
  process.exit(1);
}

const resolved = path.resolve(targetDir);
if (!fs.existsSync(resolved)) {
  console.log(`エラー: ${resolved} が見つかりません`);
  process.exit(1);
}

const templateDir = path.join(__dirname, "template");

// .claude/ ディレクトリを再帰コピー
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log(">>> .claude/ をコピー中...");
copyDir(path.join(templateDir, ".claude"), path.join(resolved, ".claude"));

// .gitignore に追記
const appendFile = path.join(templateDir, ".gitignore.append");
const targetGitignore = path.join(resolved, ".gitignore");
const appendContent = fs.readFileSync(appendFile, "utf-8");

if (fs.existsSync(targetGitignore)) {
  fs.appendFileSync(targetGitignore, "\n" + appendContent);
  console.log(">>> .gitignore に追記しました");
} else {
  fs.writeFileSync(targetGitignore, appendContent);
  console.log(">>> .gitignore を作成しました");
}

// サンプルファイルをコピー
fs.copyFileSync(
  path.join(templateDir, "CLAUDE.local.md.example"),
  path.join(resolved, "CLAUDE.local.md.example")
);
console.log(">>> サンプルファイルをコピーしました");

console.log("");
console.log("=== セットアップ完了 ===");
console.log("");
console.log("次にやること:");
console.log("  1. .claude/CLAUDE.md の Build & Test Commands を埋める");
console.log("  2. 必要なら CLAUDE.local.md.example → CLAUDE.local.md にリネームして個人設定を追加");
console.log("  3. gh CLI をインストールしておく (https://cli.github.com/)");
console.log("  4. あとは使いながら育てる: ミスしたら「CLAUDE.mdを更新して同じミスを繰り返すな」");
