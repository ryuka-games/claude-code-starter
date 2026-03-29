# AI開発ワークフロー

## フロー全体像

```
/note(蓄積) → /checker(任意) → /spec → /challenge → /plan → /agent-teams → /test-it → /test-e2e → 人(モンキーテスト)
  ↑ /research                      ↑
                                /red-team
```

## 各スキルの役割

| スキル | 何をするか | 入力 | 出力 |
|--------|-----------|------|------|
| `/note` | 情報をドキュメントとして整理・蓄積 | テキスト, ファイルパス, or 対話 | `docs/`配下の5フォルダ |
| `/research` | トピックを調査してレポートを作成 | トピック or 質問 | `docs/research/NNN-slug.md` |
| `/checker` | specに渡す情報が揃っているかVETチェック | 機能名 or 説明 | ギャップレポート |
| `/spec` | 仕様書を対話で練り上げる | 機能説明 | `specs/features/<feature>/spec.md` |
| `/challenge` | 仕様・設計・記事を多角的に反証する | ファイルパス | `CHALLENGE.md` |
| `/red-team` | 悪意ある視点で仕様を攻撃する | ファイルパス | `RED-TEAM.md` |
| `/plan` | 仕様からタスク分割・実装計画を作成 | spec.mdのパス | `plan.md` |
| `/agent-teams` | 複数AIエージェントでチーム開発 | plan.md | 実装コード |
| `/test-it` | specベースで結合テストを生成・実行 | feature名 or specパス | テストファイル + 結果 |
| `/test-e2e` | specベースでE2E煙テストを生成・実行 | feature名 or specパス | Playwrightテスト + 結果 |

## 補助スキル

| スキル | 何をするか |
|--------|-----------|
| `/whiteboard` | セッション跨ぎの知見共有・議論ボード |
| `/fix-issue` | GitHub Issueを修正 |
| `/article` | Zenn記事のドラフト作成・レビュー |

## コードレビュー

公式プラグインを使用:

```
/plugin install code-review@claude-plugins-official
/code-review:code-review          # ターミナルに出力
/code-review:code-review --comment  # PRにインラインコメント投稿
```

プロジェクト固有のルールは `REVIEW.md` をリポジトリルートに配置。

## フローの使い方

### 新機能を作る

```
1. /note で打合せメモ、アイデア、調査結果を蓄積
2. /research で技術調査（必要なら）→ 結果を /note でドキュメント化
3. /checker でspecに渡す情報が揃ってるか確認（任意）
4. /spec で仕様を作成
5. /challenge で仕様の穴を反証
6. /red-team でユーザー向け機能の悪用を検証（必要なら）
7. /plan で実装計画を作成
8. /agent-teams で実装
9. /test-it で結合テスト
10. /test-e2e でE2E煙テスト（必要なら）
11. /code-review:code-review でPRレビュー
12. 人がモンキーテスト
```

### 既存機能を変更する

```
1. /spec で changes/ spec を作成
2. /challenge で変更仕様を反証
3. /plan で実装計画
4. /agent-teams で実装（PMの完了報告に再テスト対象を含める）
5. /test-it で該当featureの結合テスト再実行
6. /code-review:code-review でPRレビュー
```

### テストでバグが見つかったら

```
1. バグを修正
2. /test-it で再テスト（修正が他の箇所に影響していないか確認）
3. 必要なら /test-e2e も再実行
4. 全pass確認後、/code-review:code-review でPRレビュー
```

### 記事を書く

```
1. /article [テーマ] でドラフト作成
2. /article [ファイルパス] でレビュー
3. 修正 → 公開予約
```

## 各スキルの設計原則

- **specが真実の源泉**: 全てのテスト・レビューはspecを基準にする
- **カンニング防止**: テスト生成時にsrc/（実装コード）を見せない
- **情報非対称**: /challenge, /red-teamのサブエージェントには成果物のみ渡し、作成経緯は渡さない
- **並列サブエージェント**: 観点/攻撃者ごとに独立コンテキストでMental Setを回避
- **retroパターン**: 実行→振り返り→同じ問題が2回出たらスキル本体に昇格
- **最小限から育てる**: Boris Cherny哲学。使いながらClaude自身に育てさせる
