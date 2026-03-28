---
name: plan
description: "Create implementation plan and tasks from a spec"
disable-model-invocation: true
argument-hint: "[feature name or path to spec.md]"
---

Create an implementation plan for: $ARGUMENTS

## 実行方法

**サブエージェント（Task tool）で実行する。** メインのコンテキストを消費しないため。

### Step 1: サブエージェントでplan + tasks作成

Task toolで以下のプロンプトを渡す:

```
`.claude/skills/plan/plan-agent.md` を読み、その指示に従って以下のplan + tasksを作成せよ:

$ARGUMENTS

plan.md, tasks.md, ARCHITECTURE.md（作成/更新した場合）のファイルパスと概要を返せ。
```

### Step 2: ユーザーに提示

サブエージェントが返した結果をもとに:
- plan.md の概要（技術スタック、設計方針の要約）を提示
- tasks.md のPhase構成とタスク数を提示
- ARCHITECTURE.md を作成/更新した場合はその旨を報告
- ファイルパスを提示してユーザーにレビューを促す
