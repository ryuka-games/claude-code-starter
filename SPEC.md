# SPEC: /review スキル

Status: approved
Created: 2026-02-11

## 概要（What & Why）

コード変更に対する構造化されたレビューを実行する `/review` スキルを作成する。開発フロー（調査→仕様→開発→**レビュー**→テスト）のレビューフェーズを担い、人間のレビュアーが見落としやすいバグ・セキュリティリスク・設計上の問題を検出する。

## ユーザーストーリー

- **P1** (MVP): As a 開発者, I want `/review` で現在の変更をレビューしてもらう so that マージ前に問題を発見できる
  - Given git diffに変更がある, When `/review` を実行, Then 問題点と改善案がレポートされる

- **P1** (MVP): As a 開発者, I want SPEC.mdと照合したレビューを受ける so that 仕様との乖離を検出できる
  - Given SPEC.mdが存在する, When `/review` を実行, Then 仕様の要件が満たされているか確認される

- **P2** (次フェーズ): As a 開発者, I want 特定ファイルだけをレビュー対象にする so that 大きな変更でも焦点を絞れる
  - Given 複数ファイルが変更されている, When `/review src/auth/` を実行, Then 指定パスの変更のみレビューされる

- **P3** (将来): As a チームリーダー, I want レビュー結果をPRコメントとして投稿する so that GitHub上でレビュー記録が残る

## 要件（Functional Requirements）

- FR-001: 引数なしなら `git diff` (staged + unstaged)、コミット指定時（例: `HEAD~3`）は指定範囲の変更を分析する
- FR-002: バグ・エッジケース、セキュリティリスク、パフォーマンス問題、既存パターンとの整合性の4観点でレビューする
- FR-003: SPEC.mdが存在する場合、仕様の要件(FR-xxx)と変更内容を照合する
- FR-004: 問題ごとに重要度（critical / warning / suggestion）を付与する
- FR-005: 問題には具体的な修正案を含める
- FR-006: レビュー結果を画面に表示し、同時にREVIEW.mdに書き出す

## 非ゴール（Non-Goals）

- NG-001: 自動修正はしない（レビュー結果を報告するのみ。修正はユーザーが判断）
- NG-002: CI/CDパイプラインへの統合はスコープ外
- NG-003: コードスタイル・フォーマットのチェック（linter/formatterの役割）

## 制約・前提

- テンプレートのスキルとして言語非依存であること
- メインコンテキストで実行（`context: fork` なし）— レビュー結果を見て対話で修正するため
- git管理下のプロジェクトであること

## [NEEDS CLARIFICATION]

- [x] NC-001: → 引数なしなら `git diff`（作業中の変更）、コミット指定時は過去コミットも対象
- [x] NC-002: → SPEC.md照合はP1に含める（あれば自動照合、なければスキップ）
- [x] NC-003: → 画面表示 + REVIEW.mdファイルに書き出し（両方）

## 進化方針

**MVP（今回）**: 1パスで全観点（セキュリティ・パフォーマンス・コード品質・設計）をレビュー。

**将来（Agent Teams調査後）**: 観点別エージェントに分離し、`/review` がオーケストレーターとして統合する構成に進化。
```
/review（オーケストレーター）
  ├→ security-reviewer agent
  ├→ performance-reviewer agent
  └→ code-quality agent
  → 結果を統合してレポート
```
1パスで弱い観点が判明してから分離を判断する。Agent Teamsの調査が前提。

## 成功基準（Success Criteria）

- SC-001: `/review` 実行で変更内容のレビューレポートが出力される
- SC-002: レポートに重要度ラベル（critical/warning/suggestion）が含まれる
- SC-003: SPEC.md存在時に仕様との照合結果が含まれる
