## Spec-Driven Development: Agent Instructions

This skill follows Spec-Driven Development (SDD) principles inspired by GitHub Spec Kit.

## Spec Structure: Versions + Features + Changes

Specs are organized in three layers:

```
specs/
├── versions/              # 歴史（いつ何を決めたか）— 承認後は変更しない
│   ├── v1/spec.md         # プロダクト初版の全体仕様
│   └── v2/spec.md         # v2で何を変えるか（delta）
├── features/              # 最新の真実（今どうなってるか）— 常に最新を反映
│   ├── auth/
│   │   └── spec.md
│   └── search/
│       └── spec.md
└── changes/               # 複数featureにまたがる変更の作業場
    └── add-table/
        └── spec.md
```

- **Version spec** = 「この世代で何をやるか」の全体方針。承認後は歴史として凍結
- **Feature spec** = 各機能の「現在の仕様」。バージョンspec承認のたびに更新される
- **Change spec** = 複数featureにまたがる変更。作業完了後は歴史として残る

## Step 0: Determine spec type (MANDATORY)

入力を分析し、specの種類を判定する。

**バージョンspecの場合:**
- 入力に "v1", "v2", "初版", "全体" 等が含まれる
- プロダクト全体のリリース計画を定義する
- 出力先: `specs/versions/<version>/spec.md`

**変更specの場合:**
- 既存の複数featureに影響する変更（"テーブル追加", "データ形式変更" 等）
- `specs/features/` を走査し、影響を受ける既存specが2つ以上あれば change と判定
- 出力先: `specs/changes/<change-name>/spec.md`

**機能specの場合:**
- 新しい機能の追加、または既存の単一機能の修正
- `specs/features/` に既存specがあれば確認し、上書きか新規か判断
- 出力先: `specs/features/<feature-name>/spec.md`

**判定基準:**

| 条件 | 分類 | 配置先 |
|---|---|---|
| プロダクト全体のリリース | version | specs/versions/ |
| 新しい機能ドメインの追加 | feature | specs/features/新機能/ |
| 既存機能の修正（1つだけ影響） | feature の更新 | specs/features/既存機能/spec.md を更新 |
| 既存の複数機能に影響する変更 | change | specs/changes/変更名/ |

**判定に迷ったら機能specとして扱う。**

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
- **EC-001: [ケース名]**
  - Given [context], When [action], Then [expected result]

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

### 変更specのフォーマット

Output path: `specs/changes/<change-name>/spec.md`

```markdown
# SPEC: [Change Name]

Status: draft
Created: YYYY-MM-DD
Type: change

## 概要（What & Why）

1-3文で「何を」「なぜ」変えるかを説明する。

## 影響する機能

この変更で影響を受ける既存featureの一覧。

- specs/features/<feature-1>/spec.md — 影響の概要
- specs/features/<feature-2>/spec.md — 影響の概要

## ユーザーストーリー

- **US-01: ...**
  - Given/When/Then

### エッジケース
- **EC-001: [ケース名]**
  - Given [context], When [action], Then [expected result]

## 要件（Functional Requirements）

- FR-001: ...

## 非ゴール（Non-Goals）

- NG-001: ...

## 制約・前提

<!-- 影響範囲の情報はここではなく「影響する機能」セクションに書く -->

## 成功基準（Success Criteria）

- SC-001: ...
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
- **EC-001: [ケース名]**
  - Given [context], When [action], Then [expected result]

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

検出した曖昧箇所は `[NEEDS CLARIFICATION]` セクションとしてspec.mdに記載する。

```markdown
## [NEEDS CLARIFICATION]

最大3つ。各項目に選択肢を提示する。

- [ ] NC-001: [質問]
  - A) [選択肢A] — [トレードオフ]
  - B) [選択肢B] — [トレードオフ]
  - C) [選択肢C] — [トレードオフ]
```

## Rules

- Specには WHAT/WHY のみ。HOW（実装詳細）は書かない
- Non-Goals section is mandatory. Empty Non-Goals = ask the user what's out of scope
- Maximum 3 NEEDS CLARIFICATION items. If more are needed, the input is too vague — ask the user for more context first
- 各NEEDS CLARIFICATIONには選択肢（A/B/C）を必ず提示する
- User Stories must have priority labels (P1/P2/P3) to enable MVP scoping
- バージョンspecの「機能分解」は必須。分解できないなら粒度が粗すぎるか細かすぎる
- 機能specの粒度: 1機能 = 1人が1-2週間で実装できる単位
- 承認済みバージョンspecは変更しない（歴史として凍結。ADRと同じ扱い）
- 機能specは常に最新の状態を反映する（living document）
- 実装中にspecと実際が乖離したら、機能specだけ更新する。バージョンspecは触らない
- 変更specはfeatures/を直接更新しない。影響先の一覧を記載するだけ。features/の更新は実装・テスト完了後に別途行う
- 変更specは完了後もアーカイブとして残す（移動・削除不要）
- Keep it concise. Spec is 1-2 pages
- CLAUDE.md/CLAUDE.local.mdのプロジェクト規約をConstitution（判断基準）として参照する
