---
name: spec
description: "Spec-Driven Development: Generate a specification (WHAT/WHY only)"
disable-model-invocation: true
argument-hint: "[feature or version description, with optional references to docs/research/ or #issue]"
---

Generate a specification for: $ARGUMENTS

## 実行方法

**サブエージェント（Task tool）で実行する。** メインのコンテキストを消費しないため。

### Step 1: サブエージェントでspec作成

Task toolで以下のプロンプトを渡す:

```
`.claude/skills/spec/spec-agent.md` を読み、その指示に従って以下のspecを作成せよ:

$ARGUMENTS

spec.mdを書き出したら、ファイルパスと概要（1-2文）を返せ。
NCがあればNC一覧も返せ。
```

### Step 2: NC（未確定事項）の処理

サブエージェントが返したspec.mdを読み、`[NEEDS CLARIFICATION]` セクションがあればユーザーに提示する。

**各NCについて選択肢を提示:**

- A) / B) / C) — 具体的な選択肢（トレードオフ付き）
- **「スキップ（NCとして残す）」** — 未決定のまま次に進む

「全部スキップ」の選択肢も提示する。

**ユーザーの回答に応じた処理:**
1. **選択肢を選んだ** → Spec本文に反映してNCを消す
2. **スキップ** → NCをspecに残したまま次に進む
3. **全部スキップ** → 全NCを残したまま次に進む

NCが残っている場合、`[NEEDS CLARIFICATION]` セクションはspecに残る。NCの解決方法は後続のステップに委ねる。

### Step 3: Approve & Decompose（バージョンspecの場合）

ユーザーがバージョンspecを承認（`Status: approved`）したら:

1. **バージョンspecを凍結** — Status: approved に変更。以後変更しない
2. **機能specに分解** — 「機能分解」セクションの各機能について `specs/features/<feature-name>/spec.md` を生成（これもサブエージェントで実行してよい）
3. **既存の機能specがある場合** — 新バージョンの変更を既存specに反映（上書きではなく更新）
4. **各機能specのSourceフィールド** — どのバージョンspecから生成されたか記録

分解後、ユーザーに機能specの一覧を提示して確認を求める。

**機能specの場合はこのステップをスキップ。**

/specはここで完了。plan/tasksは別の関心事。
