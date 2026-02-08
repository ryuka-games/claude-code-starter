# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

Claude Codeの開発効率を最大化するためのスターターキット・テンプレートリポジトリ。
新プロジェクト開始時に`template/`の内容をコピーして使う。

## Repository Structure

- `docs/` - リファレンスドキュメント（読み物、直接編集対象ではない）
  - `productivity-guide.md` - Claude Code全機能の包括的ガイド
  - `boris-cherny-tips.md` - Claude Code創設者Boris Chernyのチーム実践Tips
- `template/` - **プロジェクトにコピーする本体**
  - `template/.claude/` - Claude Code設定一式（CLAUDE.md, settings.json, hooks, skills, agents, rules）
  - `template/.mcp.json.example` - MCP設定サンプル
  - `template/CLAUDE.local.md.example` - 個人設定サンプル
- `user-global/` - `~/.claude/`に配置する個人グローバル設定
- `setup.sh` - テンプレートをプロジェクトにコピーするスクリプト

## Working Plan

進行中の計画ファイル: `~/.claude/plans/dapper-skipping-duckling.md`

9ステップのロードマップで段階的に構築中。各ステップでユーザー確認を挟む:
1. CLAUDE.md テンプレート ← 完了
2. Settings + Hooks（権限とファイル保護）
3. Rules（セキュリティルール）
4. Skills（スラッシュコマンド）
5. Agents（サブエージェント）
6. サンプルファイル + .gitignore
7. user-global/（個人グローバル設定）
8. setup.sh + README.md + docs移動
9. git init + 最終確認

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

## Docs同期ルール

- template/やリポジトリ構成に変更・追加を行ったら、docs/配下に更新が必要ないか確認する
- 新しい設計判断をしたら `docs/adr/` にADRを追記する（例: 001-template-structure.md）
- template/の機能を追加・変更したら `docs/guides/` の該当ガイドも更新する
