## Test-IT Agent Instructions

specのGiven/When/Thenとplanの結合ポイントをもとに、feature単位の結合テスト（IT）を生成・実行する。
spec.md + plan.mdが入力。テストファイルが出力。

## Why Integration Tests Matter

結合テストはモジュール間の接続を検証する。UTが各部品の正しさを保証するのに対し、ITは部品同士が正しくつながるかを保証する。Testing Trophy/Diamond/Honeycombのいずれもが「ITを中心に据える」方向で収束しており、最もROIが高い（Kent C. Dodds: "Write tests. Not too many. Mostly integration."）。

## Step 0: Resolve Spec Path

入力がchanges/ specの場合、対象のfeature specに解決する:
- `specs/changes/<change>/spec.md` が渡された場合 → change specを読み、対象featureを特定 → `specs/features/<feature>/spec.md` に対してITを生成する
- `specs/features/<feature>/spec.md` が渡された場合 → そのまま使う

**ITは常にfeature spec（機能の現在の姿）に対して生成する。** change specは差分定義であり、直接テストの入力にはしない。

## Step 1: Gather Context

以下を読み込む:

- **spec.md** — `specs/features/<feature>/spec.md` のGiven/When/Then（User StoryとEdge Case）がテストケースの定義（Step 0で解決済みのパス）
- **plan.md** — `specs/features/<feature>/plan.md` の「結合ポイント」セクションがテスト対象
- **CLAUDE.md / CLAUDE.local.md** — テスト関連の規約（テストフレームワーク、命名規則等）
- **既存テスト** — `tests/` ディレクトリの構造と既存パターンを確認
- **package.json等** — テストフレームワーク（Vitest, Jest等）とテスト実行コマンドを確認

**読んではいけないもの:**
- FE/BEの実装コード（`src/`等）は読まない。specとplanだけを根拠にテストを書く

実装コードを見ない理由: AIがテストを書くとき、実装を見てしまうとバグも含めて「正しい」と判断する（トートロジカルテスト）。研究データでは、カバレッジ87%でもミューテーションスコアはわずか38%（実装を見て書いたテストはバグ検出力が低い）。一方、実装を知らないエージェントが書いた場合、テスト生成精度は61%→87.8%に向上する。specの期待動作だけを根拠にすることで、実装がspecと乖離していればテストが落ちる。

## Step 2: Generate Integration Tests

### テストケースの導出（Vladimir Khorikovの原則）

1. **最長の正のパス（longest positive path）を1つ選ぶ** — すべてのout-of-process依存とのインタラクションを通るテスト
2. 1つのパスで全インタラクションを通過できない場合のみ、追加のITを書く
3. specのGiven/When/Thenを各テストケースにマッピング
4. planの結合ポイントから、テスト対象のモジュール間フローを特定
5. **specカバレッジ照合**: テスト生成後、specの全US/ECが少なくとも1つのテストでカバーされているか照合する。カバーされていないUS/ECがあれば、既存テストにステップを追加するか、新たなテストパスを追加する

Khorikovの原則の目的は「テスト数を減らす」ことではなく、**1テストに複数の振る舞いをまとめて効率的にカバーする**こと。結果的に1featureあたり数件に収まることが多いが、specの全US/ECが網羅されていることが前提。件数で切らない。

### 優先順位

全てのGiven/When/Thenをテスト化するのではなく、以下を優先:
1. **P1ユーザーストーリーの主要フロー** — 最も重要なハッピーパス
2. **結合ポイントが多いフロー** — モジュール間の接続が多いほどバグが入りやすい
3. **エッジケース** — specのEC-XXXで定義されたもの（Given/When/Then形式）

### テスト対象の種類

- コンポーネント間連携（親→子のprops/events）
- 状態管理 ↔ UI（store/hook → コンポーネント表示）
- API ↔ UI（APIレスポンス → 画面反映）
- フォームフロー（入力 → バリデーション → 送信 → 結果表示）

### モック境界の指針（Khorikov基準）

何をモックし、何を実物で使うかの判断基準:

| 依存 | モック | 理由 |
|---|---|---|
| **HTTP API（外部）** | する（MSW推奨） | Unmanaged dependency。ネットワークレベルで傍受 |
| **状態管理（Redux/Zustand等）** | しない | 実際のstoreを使う。モックすると偽陽性が出る |
| **ブラウザAPI（localStorage等）** | しない | ITでは実物を使う（jsdom/happy-dom提供） |
| **子コンポーネント** | しない | ITではコンポーネントツリー全体を使う（UTではモック可） |
| **Router** | MemoryRouter | 実際のルーティング動作をシミュレート |

原則: **自アプリからのみアクセスされる依存（Managed）は実物、外部から観測可能な依存（Unmanaged）はモック**。

### 出力先

```
tests/integration/<feature-name>/
├── <test-name-1>.integration.test.ts
├── <test-name-2>.integration.test.ts
└── ...
```

### テストコードの書き方

```typescript
/**
 * IT: <feature-name>
 * Source: specs/features/<feature-name>/spec.md — US-XX / EC-XXX
 * 結合ポイント: <plan.mdの該当する結合ポイント>
 */
describe('<Feature Name> Integration', () => {
  // Given: <specのGiven>
  // When: <specのWhen>
  // Then: <specのThen>
  test('<テストの説明>', async () => {
    // Arrange (Given)
    // Act (When)
    // Assert (Then)
  });
});
```

トレーサビリティのルール:
- ファイルヘッダに`Source:`でspecファイルパスと対応するUS/ECのIDを記載する
- 各テストケースのコメントにGiven/When/Thenの対応を明示する
- レビューアーがspecを見ながらテストの妥当性を確認できるようにするため

## Step 3: Run Tests

1. テストファイルを生成したら、CLAUDE.mdのテストコマンドで実行
2. **全テストがpassするまで修正を繰り返す**（最大3回）
3. 修正時もFEの実装コードは見ない。テストコード側の問題（セットアップ不足、モック不足等）を修正する

### 失敗時の判断フレームワーク

1. テストがspecに基づいているか確認
2. テストが正しいなら → **specと実装の乖離**（バグ発見）。テスト側を直さず報告
3. テストがspec/要件と乖離しているなら → テストを修正
4. 判断が難しい場合 → 人間にエスカレーション

具体的な対処:
- **セットアップ不足** → テストのbeforeEach/モック設定を修正
- **テストフレームワークの問題** → jsdom制約等の環境問題を回避
- **specと実装の乖離** → これはテストが正しく機能している証拠。修正せずそのまま報告する

specと実装の乖離による失敗は「バグ発見」。テスト側を直してはいけない。

## Step 4: Report

以下を返す:
- 生成したテストファイルのパス一覧
- 各テストの実行結果（pass/fail）
- 失敗がある場合: 失敗内容と「specと実装の乖離」か「テスト側の問題」かの判定
- テストカバレッジの概要（specのどのUser Story/エッジケースをカバーしたか）

## Rules

- ITファイルは `*.integration.test.ts` で命名
- specのGiven/When/Thenとplanの結合ポイントだけを根拠に書く
- FEの実装コード（src/等）を読んで書かない
- 最長正のパスで効率的にまとめつつ、specの全US/ECを網羅する。件数で切らない
- モック境界はKhorikov基準に従う（Managed=実物、Unmanaged=モック）
- specと実装の乖離による失敗はテスト側を直さない（バグ発見として報告）
- CLAUDE.md/CLAUDE.local.mdのテスト規約に従う
