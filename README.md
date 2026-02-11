# Claude Code スターターキット

新プロジェクトに Claude Code の設定一式を導入するテンプレート。

## クイックスタート

```bash
# 1. このリポジトリをクローン
git clone https://github.com/ryuka-games/claude-code-starter.git claude-starter

# 2. セットアップスクリプトを実行
cd claude-starter
./setup.sh ~/projects/my-app

# 3. CLAUDE.md のビルドコマンドを埋める
# あとは使いながら育てる
```

## コピーされるもの

| ファイル | 内容 |
|---------|------|
| `.claude/CLAUDE.md` | プロジェクト設定テンプレート。まずビルドコマンドだけ埋める |
| `.claude/settings.json` | 安全なgitコマンドの自動承認 + hook設定 |
| `.claude/hooks/` | コンテキスト永続化 + 回答完了/承認待ち通知 |
| `.claude/skills/fix-issue/` | `/fix-issue 1234` でGitHub Issueを修正するスキル |
| `.claude/skills/research/` | `/research [トピック]` で構造化された調査レポートを作成 |
| `.claude/skills/spec/` | `/spec [機能説明]` で仕様書(SPEC.md)を生成。対話で練り上げる |
| `.mcp.json.example` | MCP接続設定のサンプル |
| `CLAUDE.local.md.example` | 個人設定のサンプル（git管理外） |

## 育て方

このテンプレートは最小限の状態で始まる（[Boris Cherny Philosophy](docs/boris-cherny-tips.md)）。

1. **Claudeがミスしたら** → 修正後に「CLAUDE.mdを更新して同じミスを繰り返すな」と言う
2. **CLAUDE.mdが長くなってきたら** → 「CLAUDE.mdを見直して。不要なルールや重複を整理して」
3. **rules/skills/agentsを追加したくなったら** → [カスタマイズガイド](docs/guides/customization.md)を見て追加する

## ドキュメント

| ファイル | 内容 |
|---------|------|
| [プロンプト チートシート](docs/guides/prompt-cheatsheet.md) | 場面別の効果的なプロンプト集 |
| [カスタマイズガイド](docs/guides/customization.md) | hooks/rules/skills/agentsの追加方法 |
| [調査ベストプラクティス](docs/guides/research-best-practices.md) | AI調査の方法論とSDD（Spec-Driven Development） |
| [Boris Cherny Tips](docs/boris-cherny-tips.md) | Claude Code創設者のチーム実践Tips |
| [生産性ガイド](docs/productivity-guide.md) | Claude Code全機能の包括的リファレンス |
| [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | スキル・フック・プラグイン等のコミュニティリソース集 |
