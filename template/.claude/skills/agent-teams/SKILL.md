---
name: agent-teams
description: "Run Agent Teams development cycle for a feature. Spawns PM + Designer + UI/UX + FE + QA team."
argument-hint: "[feature name]"
---

Run Agent Teams for: $ARGUMENTS

## Step 1: Gather Context

以下を読み込む:

- `specs/features/<feature>/spec.md` — 機能仕様
- `specs/features/<feature>/plan.md` — 実装計画
- `specs/features/<feature>/tasks.md` — タスク分解
- `ARCHITECTURE.md` — あれば。アーキテクチャ原則に従う
- `CLAUDE.md` / `CLAUDE.local.md` — プロジェクト規約
- 直近の `specs/features/*/retro.md` — 前回の振り返り。学びを今回に活かす

## Step 2: Team Setup

4名のteammateを生成する:

1. **デザイナー**（Sonnet） — 色、フォント、余白、視覚的バランスを担当。コード変更はしない。
2. **UI/UX**（Sonnet） — 操作性、ユーザーフロー、フィードバック設計を担当。コード変更はしない。
3. **FEエンジニア**（Opus） — 唯一の実装担当。技術的に実現不可能な提案は理由とともに代替案を返す。
4. **QA**（Sonnet） — テスト作成と動作確認を担当。テストコードのみ変更可。

**全メンバー共通**: 作業開始前にWHITEBOARD.mdを読むこと。他メンバーの作業に影響する発見はPMに報告すること。

## Step 3: Phase 0 — ホワイトボード準備

`.claude/skills/whiteboard/template.md` を読み、テンプレートに従ってspecフォルダ内に以下を作成する:
- **WHITEBOARD.md** — Goal、Team（エージェント名を含む）、接点（Connections）、掲示板
- **discussions/** — specにNC（未確定事項）があれば、トピックファイルを事前作成

作成手順:
- Goalにspecの目的を記入
- Teamにチーム構成・エージェント名（recipient名）・依存関係を記入
- 接点（Connections）に役割間で影響し合う領域を記入
- 既知の技術制約を掲示板に事前記載（デザイン方針策定前に共有）
- specにNC（未確定事項）があれば、discussions/にトピックファイルを作成しDesigner/UI/UXに提案依頼

Phase 0完了まで実装に入らないこと。

## Step 4: Phase 1 — 実装サイクル

- spec, plan, tasks, ARCHITECTURE.md, WHITEBOARD.md を全員で読む
- tasksに従ってFEが実装 → デザイナー・UI/UXがレビュー → QAがテスト → FEが修正
- このサイクルを全タスク完了まで繰り返す
- 完了したら最終成果物をユーザーに報告
- チーム運用の詳細ルールは [team-rules.md](team-rules.md) を参照

## Step 5: Phase 2 — 振り返り

- PM（あなた）が各メンバーに聞く:「今回うまくいったこと、うまくいかなかったこと、次回の改善案」（実装だけでなくコミュニケーション・情報共有についても振り返る）
- 結果を `retro.md` に記録する（プロジェクト固有の学びとテンプレート改善の提案を分けて記載）
- **知見の抽出と配置**:
  - 最重要ルール → `CLAUDE.md` に追記（200行以内をキープ）
  - 詳細ルール・特定技術領域のルール → `.claude/rules/` に追記
  - 環境の事実・技術的制約 → `ARCHITECTURE.md` に追記
  - チーム運用ルール → この skill の `team-rules.md` に組み込む提案として retro に記録
  - 機能固有の決定 → そのままspec内WHITEBOARD.mdに残す
- **ルールの整理**: `CLAUDE.md`、`.claude/rules/`、`team-rules.md` に不要・重複・古くなったルールがないか確認し、あれば削除を提案。CLAUDE.mdが200行を超えていたら詳細ルールを`.claude/rules/`に移動

## PM完了チェック（シャットダウン前に必ず確認）

- [ ] WHITEBOARD.mdが作成され、Goal・Team（エージェント名含む）が記入されているか
- [ ] 全タスクの成果物が実際に存在するか確認（ステータスだけ見ない）
- [ ] Phase 2: 振り返りを実行したか
- [ ] retro.mdが書かれたか
- [ ] 知見の抽出と配置を行ったか
- [ ] discussions/ のトピックファイルに全て `## 決定` セクションがあるか
- [ ] spec.mdが最終状態に更新されているか（NC決定の反映 + 実装中の仕様変更）
