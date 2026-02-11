# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

Claude Codeの開発効率を最大化するためのスターターキット・テンプレートリポジトリ。
新プロジェクト開始時に`template/`の内容をコピーして使う。

## Repository Structure

- `docs/` - リファレンスドキュメント
  - `productivity-guide.md` - Claude Code全機能の包括的ガイド
  - `boris-cherny-tips.md` - Claude Code創設者Boris Chernyのチーム実践Tips
  - `adr/` - Architecture Decision Records（設計判断の記録）
  - `guides/` - 使い方ガイド（プロンプトチートシート、カスタマイズガイド）
- `template/` - **プロジェクトにコピーする本体**
  - `template/.claude/` - Claude Code設定一式（CLAUDE.md, settings.json, skills）
  - `template/.mcp.json.example` - MCP設定サンプル
  - `template/CLAUDE.local.md.example` - 個人設定サンプル
- `setup.sh` - テンプレートをプロジェクトにコピーするスクリプト

## Working Plan

テンプレート基盤完成済み（CLAUDE.md, settings, skills, hooks, docs）。コンテキスト永続化hookもテンプレートに組み込み済み。

## Conventions

- ユーザーは日本語でコミュニケーション。ドキュメントも日本語で書く
- `template/`内のファイルは言語非依存（特定のフレームワークに依存しない）
- テンプレートファイルにはTODOプレースホルダーを使い、ユーザーが埋める形にする
- 既存ドキュメント（`docs/`）の内容を参照してtemplate作成に活用する

## ドキュメント作成ルール

- 長いドキュメントには冒頭に早見表（サマリーテーブル）を置き、アンカーリンクで詳細へジャンプできるようにする
- 「場面 → 何をする → 結果」のように読者の状況起点で書く。機能起点で書かない
- 初稿を出す前に「この資料を初見の人がパッと見て目的の情報を見つけられるか？」を自問する
- Claudeが元々知っている自明な内容（一般的なセキュリティプラクティス等）をテンプレートにデフォルト値として入れない
- Boris Chernyの思想に従う: テンプレートは最小限にし、使いながらClaude自身に育てさせる設計にする

## 記事ネタ自動キャプチャ

作業中に以下に該当する内容が出てきたら、聞かずに `docs/articles/` にドラフトまたはネタメモを出力する:

- **共通の困りごとを解決した** — 例: コンテキスト消失、通知がない等
- **試行錯誤の結果うまくいった** — 例: hookの設計、スキルの作り方
- **設計判断で面白い議論があった** — 例: テンプレートに入れる/入れないの判断基準
- **他の人が再利用できるコード・設定** — 例: クロスプラットフォーム対応のhook

出力ルール:
- **Zenn記事ネタ**（深い内容、手順、設計判断）→ `docs/articles/XXX-slug.md` に新規作成。このメモだけで記事が書けるレベルで書く（タイトル、Tags、問題→解決→理由、コード例）。
- **Xポストネタ**（短いTips、発見、一言で伝わる）→ `docs/articles/x-posts.md` に追記。1ネタ3行以内。
- 既存記事への追記になるなら既存ファイルに追記
- `docs/articles/INDEX.md` の記事一覧またはネタストックに追加

## Docs同期ルール

- template/やリポジトリ構成に変更・追加を行ったら、docs/配下に更新が必要ないか確認する
- 新しい設計判断をしたら `docs/adr/` にADRを追記する（例: 001-template-structure.md）
- template/の機能を追加・変更したら `docs/guides/` の該当ガイドも更新する
