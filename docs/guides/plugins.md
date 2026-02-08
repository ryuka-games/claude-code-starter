# プラグインガイド

> スキル・エージェント・hooks・MCPサーバーをまとめて配布する仕組み。Claude Code v1.0.33+。

## 早見表

| やりたいこと | 方法 | 詳細 |
|---|---|:---:|
| 既存プラグインを使いたい | `/plugin` で検索・インストール | [>>](#プラグインを使う) |
| スキルをプラグイン化して配布したい | `.claude-plugin/plugin.json` を作成 | [>>](#プラグインを作る) |
| 既存の .claude/ 設定をプラグインに変換したい | ディレクトリ構造を変更 | [>>](#既存設定をプラグインに変換) |

## Standalone vs Plugin

| アプローチ | スキル名 | 適している場面 |
|-----------|---------|--------------|
| **Standalone** (`.claude/` ディレクトリ) | `/hello` | 個人ワークフロー、プロジェクト固有、実験 |
| **Plugin** (`.claude-plugin/plugin.json`) | `/my-plugin:hello` | チーム共有、コミュニティ配布、複数プロジェクト共通 |

Boris思想: まず `.claude/` で試す → 共有したくなったらプラグインに変換。

## プラグインを使う

```bash
# マーケットプレイスからインストール
/plugin

# ローカルプラグインを読み込んでテスト
claude --plugin-dir ./my-plugin
```

## プラグインを作る

### 1. ディレクトリ構造

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json       # マニフェスト（ここだけ .claude-plugin/ 内）
├── commands/              # スラッシュコマンド
│   └── hello/
│       └── SKILL.md
├── skills/                # エージェントスキル
│   └── code-review/
│       └── SKILL.md
├── agents/                # サブエージェント
├── hooks/
│   └── hooks.json         # Hook定義
├── .mcp.json              # MCPサーバー設定
└── .lsp.json              # LSPサーバー設定（オプション）
```

**注意**: `commands/`, `agents/`, `skills/`, `hooks/` はプラグインルートに置く。`.claude-plugin/` の中に入れない。

### 2. マニフェスト

`.claude-plugin/plugin.json`:
```json
{
  "name": "my-plugin",
  "description": "プラグインの説明",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  }
}
```

`name` がスキルの名前空間になる（例: `/my-plugin:hello`）。

### 3. テスト

```bash
# ローカルで読み込んでテスト
claude --plugin-dir ./my-plugin

# 複数プラグインを同時にテスト
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two
```

## 既存設定をプラグインに変換

```bash
# 1. プラグインディレクトリを作成
mkdir -p my-plugin/.claude-plugin

# 2. マニフェストを作成
echo '{"name": "my-plugin", "description": "Migrated config", "version": "1.0.0"}' \
  > my-plugin/.claude-plugin/plugin.json

# 3. 既存ファイルをコピー
cp -r .claude/commands my-plugin/
cp -r .claude/agents my-plugin/
cp -r .claude/skills my-plugin/
```

Hooksは `.claude/settings.json` から `hooks/hooks.json` に移動する（フォーマットは同じ）。

## 出典

- [Plugins 公式ドキュメント](https://code.claude.com/docs/en/plugins)
- [Plugin Reference](https://code.claude.com/docs/en/plugins-reference)
- [Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
