---
name: spec
description: Generate a specification document (SPEC.md) for a feature or project
disable-model-invocation: true
argument-hint: "[feature description, with optional references to RESEARCH.md or #issue]"
---

Generate a specification for: $ARGUMENTS

## Step 1: Gather context

Before writing, collect relevant information:

- **If RESEARCH.md or other research files are referenced**: Read them and extract key findings
- **If Issue numbers (#123) are referenced**: Use `gh issue view` to read the issue details
- **If an existing codebase is relevant**: Use Glob/Grep/Read to understand current code structure
- **If none of the above**: Work from the user's description alone

## Step 2: Generate SPEC.md draft

Write SPEC.md using the format below. Focus on WHAT and WHY — never write HOW (implementation details belong in the plan/coding phase).

```markdown
# SPEC: [Feature Name]

Status: draft
Created: YYYY-MM-DD

## 概要（What & Why）

1-3文で「何を」「なぜ」作るかを説明する。

## ユーザーストーリー

優先度付きで記述する。

- **P1** (MVP): As a [role], I want [action] so that [value]
  - Given [context], When [action], Then [expected result]
- **P2** (次フェーズ): ...
- **P3** (将来): ...

## 要件（Functional Requirements）

- FR-001: ...
- FR-002: ...
- FR-003: ...

## 非ゴール（Non-Goals）

スコープ外を明示する。これがないとAIが勝手にスコープを拡大する。

- NG-001: ...
- NG-002: ...

## 制約・前提

技術制約、パフォーマンス要件、依存関係、互換性要件など。

## [NEEDS CLARIFICATION]

未決事項を明示する。最大3つ。多すぎは情報不足の兆候。

- [ ] NC-001: ...
- [ ] NC-002: ...

## 成功基準（Success Criteria）

測定可能な完了条件。

- SC-001: ...
- SC-002: ...
```

## Step 3: Present and iterate

After generating the draft:

1. SPEC.mdに書き出す
2. `[NEEDS CLARIFICATION]` がある場合はユーザーに質問する
3. ユーザーのフィードバックを待つ — 追加要件、方向修正、スコープ変更など
4. フィードバックを反映してSPEC.mdを更新する
5. ユーザーが承認したら `Status: approved` に変更する

## Rules

- WHAT and WHY only. Never include implementation details (DB schema, API design, code structure) in the spec
- Non-Goals section is mandatory. Empty Non-Goals = ask the user what's out of scope
- Maximum 3 NEEDS CLARIFICATION items. If more are needed, the input is too vague — ask the user for more context first
- If SPEC.md already exists, ask the user: overwrite or create SPEC-[name].md?
- Keep it concise. A good spec is 1-2 pages, not 10
- User Stories must have priority labels (P1/P2/P3) to enable MVP scoping
