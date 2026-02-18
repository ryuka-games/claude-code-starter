# 開発ワークフロー

> spec駆動 + Agent Teamsによる開発フローの全体像。

## 全体フロー

```
リサーチ（/research）— 必要に応じて
    ↓
バージョンspec（/spec）— プロダクト全体の方針
    ↓ 承認
機能分解 → 機能spec A, B, C...
    ↓
各機能ごとに /plan → plan + tasks + ARCHITECTURE.md
    ↓
★ 人がplanをレビュー
    ↓
Agent Teams → 実装 + レビュー + 改善 + 振り返り
    ↓
★ 人が最終確認
```

## 各ステップ詳細

### 1. リサーチ（任意）

| | |
|---|---|
| ツール | `/research [トピック]` |
| いつ | 技術選定や未知の領域がある時 |
| 成果物 | `docs/research/` にレポート |

知ってることだけで作れるならスキップ。

### 2. バージョンspec

| | |
|---|---|
| ツール | `/spec [バージョン名]` |
| 誰が | 人 + Claude 1on1 |
| 成果物 | `specs/versions/vX/spec.md` |

プロダクト全体の方針を決める。WHAT/WHYだけ。承認後に**凍結**（変更しない）。

承認後、「機能分解」セクションをもとに機能specに分解される。

### 3. 機能spec

| | |
|---|---|
| ツール | `/spec [機能名]` |
| 誰が | 人 + Claude 1on1 |
| 成果物 | `specs/features/[機能名]/spec.md` |

各機能のWHAT/WHYを定義。**living document**（実装中にずれたら更新する）。

デザインリファレンス（色合い、参考UIなど）があればここの「制約・前提」に書く。

### 4. Plan + Tasks

| | |
|---|---|
| ツール | `/plan [機能名]` |
| 誰が | 人 + Claude 1on1 |
| 成果物 | `plan.md` + `tasks.md` + `ARCHITECTURE.md`（必要時） |

specのWHAT/WHYをもとにHOW（技術スタック、構造、設計方針）と作業分解を作成。
ARCHITECTURE.mdはプロジェクト初回時に新規作成、以降は必要に応じて更新。

### 5. Agent Teams（機能ごと）

| | |
|---|---|
| ツール | Agent Teams起動プロンプト（[詳細](agent-teams.md#開発チーム-テンプレート)） |
| 誰が | チーム（PM + デザイナー + UI/UX + FE + QA） |
| 入力 | spec + plan + tasks + ARCHITECTURE.md |

```
Agent Teams起動（spec + plan + tasks + 前回の振り返りを渡す）
    ↓
Phase 1: tasksに基づいて実装 → レビュー → 改善（自律）
    ↓
Phase 2: 振り返り（PMが主導、学びを記録）
    ↓
★ 人が最終確認
```

★ = 人のチェックポイント

### 6. フィードバックループ

| 問題 | 戻り先 |
|---|---|
| 実装結果がspecと違う | 機能specを更新して再度Agent Teams |
| planの技術判断が合わない | /planからやり直し |
| 機能の方向性自体が違う | 機能specからやり直し |
| プロダクト全体の方針転換 | 新しいバージョンspec（v2）を作成 |

バージョンspecには戻らない（凍結済み）。方針が変わったら新しいバージョンを作る。

## 人の関与ポイントまとめ

| タイミング | やること |
|---|---|
| リサーチ後 | 結果を見て方針を決める |
| バージョンspec | Claudeと対話してWHAT/WHYを定義 |
| 機能spec | Claudeと対話してWHAT/WHYを定義 |
| plan作成後 | plan + ARCHITECTURE.mdをレビュー |
| 最終確認 | 成果物を確認、次の機能へ |

specとplanレビュー以外はAgent Teamsに任せる。

## ソロ開発の場合

Agent Teamsを使わない場合も、同じスキルで進められる:

```
/spec → /plan → 自分で実装（普通のClaude Code）
```

## 複数機能の並列

機能specが独立していれば、複数のAgent Teamsセッションを同時に回せる（要worktree or 別ディレクトリ）。

```
機能spec A → /plan → Agent Teams セッション1（worktree A）
機能spec B → /plan → Agent Teams セッション2（worktree B）
機能spec C → /plan → Agent Teams セッション3（worktree C）
```

ただしAgent Teamsは1セッション1チームの制約があるため、機能ごとに別セッションが必要。

## 関連ドキュメント

- [Agent Teams ガイド](agent-teams.md) — チーム構成、起動プロンプト、ベストプラクティス
- [/spec スキル](../../template/.claude/skills/spec/SKILL.md) — spec作成の詳細フロー
- [/plan スキル](../../template/.claude/skills/plan/SKILL.md) — plan/tasks作成の詳細フロー
- [/research スキル](../../template/.claude/skills/research/SKILL.md) — リサーチの詳細フロー
