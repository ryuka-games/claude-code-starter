---
name: checker
description: "Check if gathered information is ready for /spec. Runs a lightweight VET check (Value, Estimable, Testable) and returns a gap list. Use before writing a spec when you want to verify readiness, or when the user says 'is this enough for a spec?', 'what am I missing?', 'ready to spec?'."
argument-hint: "[feature name or description]"
---

Check spec readiness for: $ARGUMENTS

## Step 1: 関連ドキュメントを収集する

引数の機能名・説明をもとに、`docs/`配下から関連するドキュメントを探す:

- `docs/research/` — 調査結果
- `docs/decisions/` — 設計判断
- `docs/inbox/` — 打合せメモ、フィードバック
- `docs/ideas/` — アイデア
- `docs/logs/` — 作業ログ

ファイル名、frontmatterのtags、本文を検索して関連ドキュメントを収集する。ARCHITECTURE.mdも読む。

見つかったドキュメントの一覧をユーザーに提示する。

## Step 2: VETチェック（3問）

収集したドキュメントを読み、以下の3問を判定する:

### V: Value（誰のどんな問題を解決するか明確か？）

- ターゲットユーザーが特定されているか
- 解決すべき課題・ペインポイントが具体的か
- 「なぜこの機能が必要か」の背景があるか

### E: Estimable（開発者がアーキテクチャ判断できる程度に明確か？）

- 技術スタック・制約が把握されているか
- 主要な画面・API・データモデルの方向性があるか
- 外部依存（サードパーティAPI等）が特定されているか

### T: Testable（テスト可能な受け入れ基準が書けるか？）

- 主要なユーザーフローが想像できるか
- 「完了」の定義がYes/Noで判定可能か
- エッジケースの洗い出しに必要な情報があるか

## Step 3: 結果を報告する

各項目をgreen/yellow/redで判定し、足りないものリストを出す。

```markdown
## Spec Readiness Report: [機能名]

### 判定

| 観点 | 状態 | 概要 |
|---|---|---|
| Value | 🟢/🟡/🔴 | [1行で状況を説明] |
| Estimable | 🟢/🟡/🔴 | [1行で状況を説明] |
| Testable | 🟢/🟡/🔴 | [1行で状況を説明] |

### 足りないもの（ギャップ）

- [ ] [具体的に何が足りないか。調べるべきか、聞くべきか]
- [ ] ...

### 参照したドキュメント

- [ファイルパスの一覧]
```

## Rules

- **Go/No-Goゲートではない**。足りないものリストを提示するだけ。specに進むかどうかはユーザーが判断する
- **3問以外のチェックはしない**。軽量に保つ。重くすると使われなくなる
- **「足りない」と判定した項目には具体的な次のアクションを提案する**。「〇〇を調べる」「〇〇に聞く」「/researchで調査する」等
- **AIの判定は参考情報**。AIがgreenと言っても抜けている可能性はある。最終判断は人間
