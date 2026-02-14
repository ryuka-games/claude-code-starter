---
name: spec
description: "Spec-Driven Development: Generate a specification with plan and tasks"
disable-model-invocation: true
argument-hint: "[feature description, with optional references to RESEARCH.md or #issue]"
---

Generate a specification for: $ARGUMENTS

This skill follows Spec-Driven Development (SDD) principles inspired by GitHub Spec Kit.
Output is stored in `specs/<feature-name>/` directory.
- `spec.md` — WHAT/WHY (Step 1-2)
- `plan.md` — HOW (Step 3)
- `tasks.md` — 実行単位 + 進捗管理 (Step 4)

Sections: Specify → Clarify → Plan → Tasks.

## Step 1: Specify (WHAT & WHY)

First, gather relevant context:
- RESEARCH.md or research files referenced → read and extract key findings
- Issue numbers (#123) referenced → `gh issue view` for details
- Existing codebase relevant → Glob/Grep/Read for current structure
- CLAUDE.md/CLAUDE.local.md → project conventions (= Constitution)

Then write the specification. Focus strictly on WHAT and WHY — never HOW.

Output path: `specs/<feature-name>/spec.md` (kebab-case, e.g., `specs/auth/spec.md`, `specs/payment-integration/spec.md`)

```markdown
# SPEC: [Feature Name]

Status: draft
Created: YYYY-MM-DD

## 概要（What & Why）

1-3文で「何を」「なぜ」作るかを説明する。

## ユーザーストーリー

優先度付きで記述する。各ストーリーに受入条件（Given/When/Then）を含める。

- **P1** (MVP):
  - As a [role], I want [action] so that [value]
  - Given [context], When [action], Then [expected result]
- **P2** (次フェーズ): ...
- **P3** (将来): ...

### エッジケース

- EC-001: ...

## 要件（Functional Requirements）

MUST形式でテスト可能に書く。

- FR-001: The system MUST ...
- FR-002: The system MUST ...

## 非ゴール（Non-Goals）

スコープ外を明示する。これがないとAIが勝手にスコープを拡大する。

- NG-001: ...
- NG-002: ...

## 制約・前提

技術制約、パフォーマンス要件、依存関係、互換性要件など。

## 成功基準（Success Criteria）

技術非依存の測定可能な完了条件。

- SC-001: ...
- SC-002: ...
```

## Step 2: Clarify

Specifyの出力を以下の観点で体系的にスキャンし、曖昧な箇所を検出する。

**スキャン観点:**
1. スコープ境界 — 含む/含まないが曖昧な要件
2. セキュリティ・プライバシー — 認証/認可、データ保護の未定義
3. UX — ユーザーフローの分岐、エラー時の挙動
4. データ — 入力形式、バリデーション、永続化の未定義
5. 外部依存 — API、サービス、ライブラリの制約

検出した曖昧箇所は `[NEEDS CLARIFICATION]` セクションに記載する。

```markdown
## [NEEDS CLARIFICATION]

最大3つ。各項目に選択肢を提示する。

- [ ] NC-001: [質問]
  - A) [選択肢A] — [トレードオフ]
  - B) [選択肢B] — [トレードオフ]
  - C) [選択肢C] — [トレードオフ]

- [ ] NC-002: ...
```

**ユーザーに質問し、回答を受けたらSpec本文に反映してNCを消す。**
全NCが解消されるまでStep 3に進まない。

## Step 3: Plan (HOW)

ユーザーがSpecを承認（`Status: approved`）した後、技術的な実装計画を別ファイルに書く。
**Specが承認されるまでこのステップに進まないこと。**

Output path: `specs/<feature-name>/plan.md`

```markdown
# PLAN: [Feature Name]

### 技術スタック

- [使用する技術・ライブラリとその理由]

### プロジェクト構造

- [新規/変更ファイルの一覧と役割]

### 依存関係

- [実装順序に影響する依存関係]

### CLAUDE.md適合チェック

- [ ] プロジェクト規約に違反していないか
- [ ] 既存パターンと整合しているか
```

## Step 4: Tasks

Planをもとに実行可能なタスクに分解する。

Output path: `specs/<feature-name>/tasks.md`

```markdown
# TASKS: [Feature Name]

### Phase 1: セットアップ
- [ ] Task 1: ...

### Phase 2: 基盤（全User Storyの前提）
- [ ] Task 2: ...
- [ ] Task 3: ...

### Phase 3: User Story実装（P1）
- [ ] [P] Task 4: ... (User Story 1)
- [ ] [P] Task 5: ... (User Story 2)

### Phase 4: User Story実装（P2）
- [ ] Task 6: ...

### Phase N: 仕上げ
- [ ] Task N: ...
```

**`[P]` マーカー**: 並列実行可能なタスク。worktreeで同時に進められる。
**Phase順序**: Phase 2完了まで後続はブロック。同Phase内の`[P]`タスクは並列可。

## Workflow

```
/spec "機能説明"
  → specs/<feature-name>/ ディレクトリ作成
  → Step 1-2: spec.md生成（Specify + Clarify）
  → ユーザー承認待ち（Status: approved）
  → Step 3: plan.md生成（Plan）
  → Step 4: tasks.md生成（Tasks）
  → 実装開始（Claude Code or worktree並列）
```

## Rules

- WHAT/WHY (Spec) と HOW (Plan) を明確に分離する。Specセクションに実装詳細を書かない
- Non-Goals section is mandatory. Empty Non-Goals = ask the user what's out of scope
- Maximum 3 NEEDS CLARIFICATION items. If more are needed, the input is too vague — ask the user for more context first
- 各NEEDS CLARIFICATIONには選択肢（A/B/C）を必ず提示する
- User Stories must have priority labels (P1/P2/P3) to enable MVP scoping
- If `specs/<feature-name>/` already exists, ask the user: overwrite or choose a different name?
- Keep it concise. Spec is 1-2 pages. Plan is 1 page. Tasks is 1 page. Total max 4 pages
- CLAUDE.md/CLAUDE.local.mdのプロジェクト規約をConstitution（判断基準）として参照する
- Plan/Tasksはユーザーが不要と言えばスキップできる
