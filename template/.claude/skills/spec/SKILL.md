---
name: spec
description: "Spec-Driven Development: Generate a specification (WHAT/WHY only)"
disable-model-invocation: true
argument-hint: "[feature or version description, with optional references to docs/research/ or #issue]"
---

Generate a specification for: $ARGUMENTS

This skill follows Spec-Driven Development (SDD) principles inspired by GitHub Spec Kit.

## Spec Structure: Versions + Features

Specs are organized in two layers:

```
specs/
├── versions/              # 歴史（いつ何を決めたか）— 承認後は変更しない
│   ├── v1/spec.md         # プロダクト初版の全体仕様
│   └── v2/spec.md         # v2で何を変えるか（delta）
└── features/              # 最新の真実（今どうなってるか）— 常に最新を反映
    ├── canvas-ui/
    │   └── spec.md
    └── export/
        └── spec.md
```

- **Version spec** = 「この世代で何をやるか」の全体方針。承認後は歴史として凍結
- **Feature spec** = 各機能の「現在の仕様」。バージョンspec承認のたびに更新される

## Step 0: Determine spec type (MANDATORY)

入力を分析し、バージョンspecか機能specかを判定する。

**バージョンspecの場合:**
- 入力に "v1", "v2", "初版", "全体" 等が含まれる
- プロダクト全体のリリース計画を定義する
- 出力先: `specs/versions/<version>/spec.md`

**機能specの場合:**
- 特定の機能について書く（"認証", "エクスポート", "AI連携" 等）
- `specs/features/` に既存specがあれば確認し、上書きか新規か判断
- 出力先: `specs/features/<feature-name>/spec.md`

**判定に迷ったらユーザーに確認する。**

既存の `specs/` ディレクトリを確認し、関連する過去のspecがあればリンク・参照する。

## Step 1: Specify (WHAT & WHY)

First, gather relevant context:
- `docs/research/` or research files referenced → read and extract key findings
- Issue numbers (#123) referenced → `gh issue view` for details
- Existing codebase relevant → Glob/Grep/Read for current structure
- CLAUDE.md/CLAUDE.local.md → project conventions (= Constitution)
- `specs/versions/` の既存バージョンspec → 過去の決定事項を確認
- `specs/features/` の既存機能spec → 現状の仕様を確認

Then write the specification. Focus strictly on WHAT and WHY — never HOW.

### バージョンspecのフォーマット

Output path: `specs/versions/<version>/spec.md`

```markdown
# SPEC: [Product Name] [Version]

Status: draft
Created: YYYY-MM-DD

## 概要（What & Why）

1-3文で「このバージョンで何を」「なぜ」作るかを説明する。
v2以降は前バージョンからの差分（delta）を明示する。

## ユーザーストーリー

優先度付きで記述する。各ストーリーに受入条件（Given/When/Then）を含める。

### P1（MVP）
- **US-01: [ストーリー名]**
  - As a [role], I want [action] so that [value]
  - Given [context], When [action], Then [expected result]

### P2（次フェーズ）: ...
### P3（将来）: ...

### エッジケース
- EC-001: ...

## 要件（Functional Requirements）

MUST形式でテスト可能に書く。

- FR-001: The system MUST ...

## 非ゴール（Non-Goals）

スコープ外を明示する。これがないとAIが勝手にスコープを拡大する。

- NG-001: ...

## 制約・前提

技術制約、パフォーマンス要件、依存関係、互換性要件など。

## 成功基準（Success Criteria）

技術非依存の測定可能な完了条件。

- SC-001: ...

## 機能分解（Feature Breakdown）

承認後に `specs/features/` に分解する機能の一覧。
各機能の粒度: 1機能 = 1人が1-2週間で実装できる単位。

- [ ] feature-name-1: 概要（→ specs/features/feature-name-1/）
- [ ] feature-name-2: 概要（→ specs/features/feature-name-2/）
```

### 機能specのフォーマット

Output path: `specs/features/<feature-name>/spec.md`

```markdown
# SPEC: [Feature Name]

Status: draft
Created: YYYY-MM-DD
Source: specs/versions/<version>/spec.md

## 概要（What & Why）

1-3文で「何を」「なぜ」作るかを説明する。

## ユーザーストーリー

この機能に関連するストーリーのみ。バージョンspecから抽出。

- **US-XX: ...**
  - Given/When/Then

### エッジケース
- EC-001: ...

## 要件（Functional Requirements）

- FR-001: ...

## 非ゴール（Non-Goals）

- NG-001: ...

## 制約・前提

## 成功基準（Success Criteria）

- SC-001: ...
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
```

**ユーザーに質問し、回答を受けたらSpec本文に反映してNCを消す。**
全NCが解消されるまでStep 3に進まない。

## Step 3: Approve & Decompose (バージョンspecの場合)

ユーザーがバージョンspecを承認（`Status: approved`）したら:

1. **バージョンspecを凍結** — Status: approved に変更。以後変更しない
2. **機能specに分解** — 「機能分解」セクションの各機能について `specs/features/<feature-name>/spec.md` を生成
3. **既存の機能specがある場合** — 新バージョンの変更を既存specに反映（上書きではなく更新）
4. **各機能specのSourceフィールド** — どのバージョンspecから生成されたか記録

分解後、ユーザーに機能specの一覧を提示して確認を求める。

**機能specの場合はこのステップをスキップ。**

/specはここで完了。plan/tasksは別の関心事（Agent Teamsに任せるか、個別に依頼する）。

## Workflow

### 新規プロジェクト（バージョンspec）

```
/spec "Product v1 の仕様策定"
  → specs/versions/v1/spec.md 生成（Step 1-2: Specify + Clarify）
  → ユーザー承認待ち
  → Step 3: 機能specに分解（specs/features/*/spec.md）
  → 完了（plan/tasksはAgent Teamsか個別依頼で）
```

### 機能追加・変更（機能spec）

```
/spec "認証機能の追加"
  → specs/features/auth/spec.md 生成（Step 1-2）
  → ユーザー承認待ち
  → 完了（plan/tasksはAgent Teamsか個別依頼で）
```

### 次バージョン（バージョンspec delta）

```
/spec "Product v2 の仕様策定"
  → specs/versions/v2/spec.md 生成（v1からの差分を明示）
  → ユーザー承認待ち
  → Step 3: 既存の機能specを更新 + 新機能specを追加
  → 完了（plan/tasksはAgent Teamsか個別依頼で）
```

## Rules

- Specには WHAT/WHY のみ。HOW（実装詳細）は書かない
- Non-Goals section is mandatory. Empty Non-Goals = ask the user what's out of scope
- Maximum 3 NEEDS CLARIFICATION items. If more are needed, the input is too vague — ask the user for more context first
- 各NEEDS CLARIFICATIONには選択肢（A/B/C）を必ず提示する
- User Stories must have priority labels (P1/P2/P3) to enable MVP scoping
- バージョンspecの「機能分解」は必須。分解できないなら粒度が粗すぎるか細かすぎる
- 機能specの粒度: 1機能 = 1人が1-2週間で実装できる単位。迷ったらユーザーに確認
- 承認済みバージョンspecは変更しない（歴史として凍結。ADRと同じ扱い）
- 機能specは常に最新の状態を反映する（living document）
- 実装中にspecと実際が乖離したら、機能specだけ更新する。バージョンspecは触らない
- Keep it concise. Spec is 1-2 pages
- CLAUDE.md/CLAUDE.local.mdのプロジェクト規約をConstitution（判断基準）として参照する
