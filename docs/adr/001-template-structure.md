# ADR-001: テンプレートリポジトリの基本構成

## ステータス
承認済み

## コンテキスト
Claude Codeの開発効率を最大化するための設定一式を、新プロジェクトに簡単にコピーできる形で提供したい。

## 決定

### ディレクトリ構成
- `template/` - プロジェクトにコピーする本体。`.claude/`配下にCLAUDE.md、settings、skillsを格納
- `docs/` - リファレンスドキュメント、ADR、ガイド
- `setup.sh` - コピー用スクリプト

### 言語非依存
template/内のファイルは特定の言語やフレームワークに依存しない。TODOプレースホルダーでユーザーがカスタマイズする。

### CLAUDE.mdテンプレートの設計方針（Boris Cherny Philosophy）
- 最小限で始めて使いながら育てる。「とりあえず入れておく」はやらない
- Build & Test Commands のみ。他のセクションは必要になったらClaude自身に追加させる
- 「消したらClaudeがミスするか？NOなら削除」ルールを冒頭に記載
- rules/agentsは初期テンプレートに含めない（必要時にcustomization.mdを参照して追加）

### コンテキスト永続化hook（2025-02追加）
- PreCompact + SessionStartのhookペアをテンプレートに含める
- 理由: コンテキスト圧縮時の文脈喪失は全ユーザー共通の問題（コミュニティ調査で確認）。Boris基準「消したらClaudeがミスするか？」→ YESに該当
- Node.jsスクリプトでクロスプラットフォーム対応（bash+jq依存を回避）
- transcript JSONLをパースして構造化抽出（thinking block・signature除去）
- 復元後にスナップショットを自動削除（ファイルが残らない設計）

## 理由
- テンプレートリポジトリ方式により、`setup.sh`一発で新プロジェクトにClaude Code設定を導入できる
- 言語非依存にすることで、どのプロジェクトでも使える汎用性を確保
- docs/とtemplate/を分離することで、ドキュメントがテンプレートに混入しない
