---
name: test-it
description: "Generate and run integration tests for a feature based on its spec and plan. Use when the user wants to create integration tests after Agent Teams completes and features/ specs are up to date."
disable-model-invocation: true
argument-hint: "[feature name or path to feature spec]"
---

Generate and run integration tests for: $ARGUMENTS

## 実行方法

**サブエージェント（Task tool）で実行する。** メインのコンテキストを消費しないため。

### Step 1: サブエージェントでIT生成・実行

Task toolで以下のプロンプトを渡す:

```
`.claude/skills/test-it/test-it-agent.md` を読み、その指示に従って以下のfeatureのITを作成・実行せよ:

$ARGUMENTS

結果サマリー（生成したテストファイル、実行結果、失敗があればその内容）を返せ。
```

### Step 2: 結果をユーザーに提示

サブエージェントが返した結果をもとに:
- 生成したテストファイルのパス一覧を提示
- テスト実行結果（pass/fail）を提示
- 失敗がある場合、原因の概要と修正方針を提示
- ファイルパスを提示してユーザーにレビューを促す
