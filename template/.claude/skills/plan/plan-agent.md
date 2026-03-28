## Plan Agent Instructions

specのWHAT/WHYをもとに、HOW（実装計画）と作業分解（tasks）を作成する。
spec.mdが入力。plan.md + tasks.md + ARCHITECTURE.md（必要時）が出力。

## Step 1: Gather Context

以下を読み込む:

- **spec.md** — 引数で指定された機能specまたはバージョンspec
- **ARCHITECTURE.md** — あれば読んでアーキテクチャ原則に従う
- **CLAUDE.md / CLAUDE.local.md** — プロジェクト規約
- **既存コード** — Glob/Grep/Readで現在の構造を確認
- **specs/features/** — 他の機能specとの依存関係を確認
- **specの `[NEEDS CLARIFICATION]`** — NCが残っている場合、依存関係セクションに記載する（「NC-001の決定次第でTask Xの方針が変わる」等）

## Step 2: Plan (HOW)

技術的な実装計画を作成する。

Output path: `specs/features/<feature-name>/plan.md`

```markdown
# PLAN: [Feature Name]

## 技術スタック

- [使用する技術・ライブラリとその理由]

## プロジェクト構造

```
[新規/変更ファイルの一覧と役割をツリー表示]
```

## 設計方針

- [主要な設計判断とその理由]
- [データフロー、状態管理、コンポーネント分割等]

## 依存関係

- [実装順序に影響する依存関係]
- [外部ライブラリ、他の機能specとの関係]

## 結合ポイント

モジュール間の接続箇所。QAがITを書くときの参照先。

- [コンポーネントA] → [コンポーネントB] → [外部依存]: フローの説明
- 例: LoginForm → useAuth → /api/login: 認証フロー

## CLAUDE.md適合チェック

- [ ] プロジェクト規約に違反していないか
- [ ] 既存パターンと整合しているか
```

## Step 3: Tasks

Planをもとに実行可能なタスクに分解する。

Output path: `specs/features/<feature-name>/tasks.md`

```markdown
# TASKS: [Feature Name]

### Phase 1: セットアップ
- [ ] Task 1: ...

### Phase 2: 基盤（全User Storyの前提）
- [ ] Task 2: ...

### Phase 3: User Story実装（P1）
- [ ] [P] Task 4: ... (User Story 1)
- [ ] [P] Task 5: ... (User Story 2)

### Phase N: 仕上げ
- [ ] Task N: ...

### Phase N+1: features/反映（changeの場合のみ）
- [ ] Task N+1: 影響先のfeatures/各spec.mdにchangeの内容を反映する

### Phase N+2: 振り返り
- [ ] Task N+2: 振り返りを実施し、retro.mdに記録（良かった点・問題点・次回の改善案）
```

**changeの場合**: specが `specs/changes/` にある場合、振り返り前に影響先の `specs/features/` へ反映するPhaseを含める。

**`[P]` マーカー**: 並列実行可能なタスク。worktreeで同時に進められる。
**Phase順序**: Phase 2完了まで後続はブロック。同Phase内の`[P]`タスクは並列可。
**共有インフラ**: トースト・通知等の共有基盤は、それを使うタスクより前のPhaseに配置する（推奨ではなくブロック依存として明示）。

## Step 4: ARCHITECTURE.md（必要時）

planの内容に基づいて、プロジェクトルートの `ARCHITECTURE.md` を作成または更新する。

**新規作成の場合:**

```markdown
# Architecture

## システム構成

[Mermaid図: サービス間の接続]

## 技術スタック

- [FE/BE/DB/インフラ等]

## コードアーキテクチャ

- [採用パターン: Clean Architecture, DDD等]
- [レイヤー構成と依存の方向]
```

**既存の場合:**
- planの内容と矛盾がないか確認
- 新しいサービスや技術が追加される場合のみ更新

**ARCHITECTURE.mdが不要な場合（小規模プロジェクト等）はスキップ。**

## Rules

- specが承認済み（Status: approved or draft）であること
- HOWに集中する。WHAT/WHYはspecの責務。planで要件を変えない
- ARCHITECTURE.mdがあればそのアーキテクチャ原則に従う
- Keep it concise. Plan is 1 page. Tasks is 1 page
- タスクの粒度: 1タスク = 数時間〜1日で完了できる単位
- CLAUDE.md/CLAUDE.local.mdのプロジェクト規約をConstitution（判断基準）として参照する
