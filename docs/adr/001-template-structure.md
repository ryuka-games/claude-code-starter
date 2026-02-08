# ADR-001: テンプレートリポジトリの基本構成

## ステータス
承認済み

## コンテキスト
Claude Codeの開発効率を最大化するための設定一式を、新プロジェクトに簡単にコピーできる形で提供したい。

## 決定

### ディレクトリ構成
- `template/` - プロジェクトにコピーする本体。`.claude/`配下にCLAUDE.md、settings、hooks、skills、agents、rulesを格納
- `docs/` - リファレンスドキュメント、ADR、ガイド
- `user-global/` - `~/.claude/`に配置する個人グローバル設定
- `setup.sh` - コピー用スクリプト

### 言語非依存
template/内のファイルは特定の言語やフレームワークに依存しない。TODOプレースホルダーでユーザーがカスタマイズする。

### CLAUDE.mdテンプレートの設計方針
- Boris Chernyの「消したらClaudeがミスするか？NOなら削除」ルールを冒頭に記載
- Claudeが推測できない情報（ビルドコマンド、特殊な規約）にフォーカス
- セクション: Tech Stack, Build & Test Commands, Code Style, Architecture, Git Workflow, Gotchas, Security

## 理由
- テンプレートリポジトリ方式により、`setup.sh`一発で新プロジェクトにClaude Code設定を導入できる
- 言語非依存にすることで、どのプロジェクトでも使える汎用性を確保
- docs/とtemplate/を分離することで、ドキュメントがテンプレートに混入しない
