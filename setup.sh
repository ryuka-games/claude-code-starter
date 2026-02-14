#!/bin/bash
set -e

# Claude Code スターターキット セットアップスクリプト
# template/ の内容を対象プロジェクトにコピーする

TARGET_DIR="${1:-.}"

if [ "$TARGET_DIR" = "." ]; then
  echo "使い方: ./setup.sh <プロジェクトのパス>"
  echo "例:     ./setup.sh ~/projects/my-app"
  exit 1
fi

if [ ! -d "$TARGET_DIR" ]; then
  echo "エラー: $TARGET_DIR が見つかりません"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATE_DIR="$SCRIPT_DIR/template"

# .claude/ ディレクトリをコピー
echo ">>> .claude/ をコピー中..."
cp -r "$TEMPLATE_DIR/.claude" "$TARGET_DIR/"

# .gitignore に追記
if [ -f "$TARGET_DIR/.gitignore" ]; then
  echo "" >> "$TARGET_DIR/.gitignore"
  cat "$TEMPLATE_DIR/.gitignore.append" >> "$TARGET_DIR/.gitignore"
  echo ">>> .gitignore に追記しました"
else
  cp "$TEMPLATE_DIR/.gitignore.append" "$TARGET_DIR/.gitignore"
  echo ">>> .gitignore を作成しました"
fi

# サンプルファイルをコピー
cp "$TEMPLATE_DIR/CLAUDE.local.md.example" "$TARGET_DIR/"
echo ">>> サンプルファイルをコピーしました"

echo ""
echo "=== セットアップ完了 ==="
echo ""
echo "次にやること:"
echo "  1. .claude/CLAUDE.md の Build & Test Commands を埋める"
echo "  2. 必要なら CLAUDE.local.md.example → CLAUDE.local.md にリネームして個人設定を追加"
echo "  3. gh CLI をインストールしておく (https://cli.github.com/)"
echo "  4. あとは使いながら育てる: ミスしたら「CLAUDE.mdを更新して同じミスを繰り返すな」"
