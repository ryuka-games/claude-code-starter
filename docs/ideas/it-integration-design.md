# IT（結合テスト）設計

## 方針: ITはAgent Teamsの外、feature単位で実行

```
/spec → /plan → /agent-teams（UT + 実装 + features/反映）
                      ↓
               人が確認
                      ↓
              /test-it（feature単位でIT生成・実行）
                      ↓
               将来: /test-st（ST/E2E、Playwright）
```

- **IT**: Agent Teams完了後に `/test-it` スキルでfeature単位に実行
- **ST/E2E**: 将来の別フェーズ（Playwright MCP連携、未実装）

## なぜAgent Teamsの外か

- features/がSSOT。ITはSSOTの仕様を検証すべき
- changeは一時的な作業場。そこでITを書いてもfeatures/反映後の状態は検証できない
- feature単位のITがあれば、次のchangeでも回帰テストとして再利用できる

## IT vs ST の違い

| | IT（結合テスト） | ST（シナリオテスト） |
|---|---|---|
| スコープ | 1つのfeature内 | feature横断 |
| 検証対象 | モジュール間の接続 | ユーザーシナリオ全体 |
| 例 | 検索フォーム→API→結果表示 | ログイン→検索→エクスポート |
| 配置 | `tests/integration/<feature>/` | 別途検討 |

## /test-it スキルの設計

### 入力
- `specs/features/<feature>/spec.md` → Given/When/Then（テストケース定義を兼ねる）
- `specs/features/<feature>/plan.md` → 結合ポイント（モジュール間の接続箇所）

### 出力
- `tests/integration/<feature>/*.integration.test.ts`

### テストケース定義ファイル（it-cases.md）は作らない
- specのGiven/When/Thenがテストケース定義を兼ねる
- 中間のMarkdownは管理コストが増えるだけ

### テストファイルの配置: トップレベル分離型
- `tests/integration/<feature>/` に配置
- UTはソース横（コロケーション）、ITはトップレベル分離のハイブリッドが業界標準
- AIにパスを明確に指定できる、カンニング防止に有利、CI選択実行が容易

## 変更済みファイル

### plan-agent.md
- plan.mdフォーマットに「結合ポイント」セクション追加
- /test-it がITを書くときの参照先になる

### tasks.md / team-rules.md / SKILL.md
- IT関連の記述は戻した（ITはAgent Teamsの外でやるため）

## ITのルール（/test-it スキルに組み込む予定）

- ITファイルは `*.integration.test.ts` で命名
- specのGiven/When/Thenとplanの結合ポイントを根拠に書く
- FEの実装コードを見て書かない（カンニング防止）
- 1機能あたり1-3件が目安
- テスト対象: コンポーネント間連携、状態管理↔UI、API↔UI、フォームフロー

## カンニング対策

- specを見てITを書く（実装コードではなく）
- トップレベル分離型で実装ディレクトリから物理的に離す
- 将来的にはエージェント分離も検討（テスト専任エージェント）

## 根拠となる調査

- Kent C. Dodds: 「Write tests. Not too many. Mostly integration.」
- Martin Fowler: Narrow IT + コントラクトテスト
- Rust: UTはソース横、ITは`tests/`（言語レベルでハイブリッドを体現）
- AI生成テストにはトップレベル分離型が推奨（パス指定の明確さ、カンニング防止）
- 詳細: `docs/research/003-integration-test-best-practices.md`, `docs/research/004-integration-test-file-placement.md`

## 未解決・今後の課題

- [ ] /test-it スキルの実装
- [ ] sokraで実際に回して検証する
- [ ] ITの粒度は適切か（1-3件で足りるか）
- [ ] ITの実行環境（jsdomの制約で動かないケースがあるか）
- [ ] ST/E2Eフェーズのスキル設計（Playwright MCP連携）
- [ ] changes/の場合、影響を受けたfeature全てのITを再実行するか
