# Project Instructions

<!--
  使い方:
  1. このファイルをプロジェクトの .claude/CLAUDE.md に配置する
  2. Build & Test Commands を埋める（これが一番重要）
  3. あとはClaudeを使いながら育てる:
     - Claudeがミスしたら修正後に「CLAUDE.mdを更新して同じミスを繰り返すな」と言う
     - 定期的に見直して不要なルールを削る

  ゴールデンルール: 各行について「これを消したらClaudeがミスするか？」と問う。NOなら削除。
-->

## Build & Test Commands

- Install: `TODO`
- Build: `TODO`
- Test (single): `TODO`
- Test (all): `TODO`
- Lint: `TODO`

変更後はテストを実行し、passを確認してから完了を報告すること。

## Tasks

- セッション開始時に `tasks/todo.md` を読み、現在のタスク状況を把握する
- タスク完了時に `tasks/todo.md` のチェックを更新する
- ユーザーに修正された場合、そのパターンを `tasks/lessons.md` に記録する

## コア原則

- **シンプル第一**：すべての変更をできる限りシンプルにする。影響するコードを最小限にする。
- **手を抜かない**：根本原因を見つける。一時的な修正は避ける。シニアエンジニアの水準を保つ。
- **影響を最小化する**：変更は必要な箇所のみにとどめる。バグを新たに引き込まない。

## ドキュメント構成

```
docs/
  research/    → 調べて得た情報（育てる型）
  decisions/   → 決めたこと+理由（育てる型）
  inbox/       → 外部から来た情報（記録型）
  ideas/       → 自分の思考・アイデア（育てる型）
  logs/        → 日報・作業ログ（蓄積型）
tasks/
  todo.md      → やるべきこと（セッション跨ぎ）
  lessons.md   → ミスパターンの学習記録
```
