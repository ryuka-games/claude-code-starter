---
name: whiteboard
description: "Set up WHITEBOARD.md and discussions/ for a feature to track discoveries and decisions"
argument-hint: "[feature name]"
---

Set up whiteboard for: $ARGUMENTS

## Overview

機能のspecフォルダ内にWHITEBOARD.md（掲示板）とdiscussions/（議論ファイル）を作成する。
発見・決定の記録と、意思決定の経緯を残すための仕組み。

1エージェントでもAgent Teamsでも使える。セッション跨ぎでも文脈が失われない。

## Step 1: Gather Context

以下を読み込む:

- `specs/features/<feature>/spec.md` — 機能仕様
- `ARCHITECTURE.md` — あれば。技術制約を掲示板に転記するため
- `CLAUDE.md` — プロジェクト規約

## Step 2: Create Files

[template.md](template.md) を読み、テンプレートに従って作成する:

- `specs/features/<feature>/WHITEBOARD.md`
- `specs/features/<feature>/discussions/` （specにNC（未確定事項）があればトピックファイルも作成）

## Step 3: Populate

- Goalにspecの目的を記入
- 関係者を記入（1エージェントなら自分だけでOK）
- 接点（Connections）に役割間で影響し合う領域を記入（あれば）
- 既知の技術制約をARCHITECTURE.mdや既存コードから掲示板に転記
- specにNC（未確定事項）があれば、discussions/にトピックファイルを作成

## Rules

- 作業中に発見した事実・制約は掲示板に追記する
- 判断が必要な場面ではdiscussions/にトピックを立てる
- 決定したらトピックファイルに `## 決定` セクションを追記し、掲示板にも1行で転記する
- 詳細なルールは [template.md](template.md) を参照
