# ホワイトボード & 議論ボード

プロジェクトの共有メンタルモデルを外在化するための仕組み。

## 背景

- ホワイトボードは「共有メンタルモデル（SMM）の外在化装置」
- エージェントは独立コンテキストを持つためSMMが自然発生しない → ファイルで外に出す
- Happy Elements社の実験で効果を確認。議論ではなく「見ておいてね」の共有が起点
- 詳細: [Agent Teams ホワイトボードアプリ アイデア](../../ideas/agent-teams-whiteboard-app.md)

## 構造

specフォルダ内に配置する:

```
specs/features/{機能名}/
  WHITEBOARD.md          掲示板（最新の事実・決定の一覧）
  discussions/           トピック単位の議論ファイル
    topic-01-xxx.md
    topic-02-xxx.md
```

| ファイル | 役割 | 変更頻度 |
|---|---|---|
| `WHITEBOARD.md` ルール | Goal、関係者/チーム、接点（静的） | 最初に1回 |
| `WHITEBOARD.md` 掲示板 | 最新の事実・決定の一覧（日常の参照先） | 随時 |
| `discussions/topic-XX.md` | トピック単位の議論ログ（後から参照用） | 意見が分かれたとき |

### いつ使うか

- **Agent Teams**: `/agent-teams` スキルに組み込み済み。自動でWHITEBOARD.mdとdiscussions/が作成される
- **1エージェント**: 自分で発見を記録し、意思決定の経緯を残す。セッション跨ぎでも文脈が失われない

### 掲示板と議論ファイルの違い

| | 掲示板 | 議論ファイル |
|---|---|---|
| ファイル | `WHITEBOARD.md` | `discussions/topic-XX.md` |
| 目的 | 気づき・情報を共有する | 問いに対して考えて決める |
| 流れ | 追記のみ。議論は発生しない | トピック → 議論 → 決定 → 反映 |
| 例 | 「Safariは5MBまで」「既存アイコンは全部Lucide React」 | 「アイコンどうする？」→ 議論 → 決定 |

## 使い方

- **Agent Teams**: `/agent-teams [機能名]` で自動セットアップ（Phase 0でwhiteboardスキルのテンプレートを使用）
- **1エージェント**: `/whiteboard [機能名]` でWHITEBOARD.md + discussions/をセットアップ

## 知見の4層構造

retroで出た知見は性質によって配置先を分ける:

| 性質 | 配置先 |
|---|---|
| 常に従うルール | `CLAUDE.md` |
| 環境の事実・技術的制約 | `ARCHITECTURE.md` |
| チーム運用ルール | Agent Teams skill の `team-rules.md` |
| 機能固有の決定 | spec内 `WHITEBOARD.md` |
