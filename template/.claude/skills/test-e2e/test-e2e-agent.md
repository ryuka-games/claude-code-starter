## Test-E2E Agent Instructions

specのGiven/When/Thenとページマップ（画面探索結果）をもとに、feature単位のE2Eテスト（Playwright）を生成・実行する。
spec.md + page-map.md が入力。Playwrightテストファイルが出力。

## Why E2E Tests Matter

E2Eテストはシステム全体をユーザー視点で検証する。ITがモジュール間の接続を検証するのに対し、E2Eは「ユーザーが実際に操作したときに正しく動くか」を保証する。ブラウザレンダリング、ルーティング、API通信、状態管理が全て正しく連携しているかを検証する唯一の手段。

## E2Eのスコープ: 煙テスト（Smoke Test）

E2Eは壊れやすく、メンテコストが高い。全USをE2Eでカバーしようとするとテストスイートが脆くなり、信頼を失って無視されるようになる。

**E2Eでやること:**
- クリティカルなユーザーフロー（「これが壊れたらサービスが使えない」レベル）
- 複数画面を跨ぐメインの操作フロー
- ルーティング・画面遷移が正しく動くか

**ITに任せること（E2Eではやらない）:**
- Edge Case（バリデーション、境界値、エラーケース）
- モジュール間のデータ受け渡しの正しさ
- 個別のビジネスロジック
- 状態管理のエッジケース

## Step 0: Resolve Spec Path

入力がchanges/ specの場合、対象のfeature specに解決する:
- `specs/changes/<change>/spec.md` が渡された場合 → change specを読み、対象featureを特定 → `specs/features/<feature>/spec.md` に対してE2Eを生成する
- `specs/features/<feature>/spec.md` が渡された場合 → そのまま使う

**E2Eは常にfeature spec（機能の現在の姿）に対して生成する。** change specは差分定義であり、直接テストの入力にはしない。

## Step 1: Gather Context

以下を読み込む:

- **spec.md** — `specs/features/<feature>/spec.md` のGiven/When/Then（User StoryとEdge Case）がテストシナリオの定義
- **page-map.md** — `tests/e2e/<feature>/page-map.md` の画面構造、セレクタ情報、**既知の制約**セクション（探索で判明した罠・回避策）
- **ARCHITECTURE.md** — 技術スタック、認証方式、データストア種別、外部API一覧。セットアップ/クリーンアップの設計に使う
- **CLAUDE.md / CLAUDE.local.md** — テスト関連の規約（テストフレームワーク、命名規則等）
- **既存E2Eテスト** — `tests/e2e/` ディレクトリの構造と既存パターンを確認
- **playwright.config.ts** — Playwrightの設定（baseURL、timeout等）

**読んではいけないもの:**
- FE/BEの実装コード（`src/`等）は読まない。spec、ページマップ、ARCHITECTURE.mdだけを根拠にテストを書く

実装コードを見ない理由: ITスキル(/test-it)と同じ。AIが実装を見てしまうとバグも含めて「正しい」と判断する（トートロジカルテスト）。specの期待動作とページマップのセレクタだけを根拠にすることで、実装がspecと乖離していればテストが落ちる。

## Step 2: Generate E2E Tests

### テストシナリオの導出

1. **SKILL.mdのStep 1-1で選定されたクリティカルパスのUSのみを対象にする** — Edge CaseはITの役割。E2Eでは扱わない
2. **選定されたUSをユーザーフローに変換する** — Given（初期状態）→ When（操作）→ Then（期待結果）をブラウザ操作に翻訳
3. **最長の正のパス（longest positive path）を1つ選ぶ** — できるだけ多くのUSを1テストで直列に通す
4. 1つのパスで全USを通過できない場合のみ、追加テストを書く
5. **カバレッジ照合**: テスト生成後、選定された全USが少なくとも1つのテストでカバーされているか照合する

### セレクタの選び方

page-map.mdのセレクタを使う。優先順位:

1. `data-testid` — 最も安定。UIリファクタに強い
2. `getByRole` + `name` — アクセシビリティベース。セマンティック
3. `getByLabel` — フォーム要素向け
4. `getByText` — 表示テキストベース。テキスト変更に弱いので最終手段

CSSセレクタ（`.class-name`）やXPathは使わない。

### テスト環境のセットアップ/クリーンアップ

ARCHITECTURE.mdの情報をもとに、テストに必要なセットアップ・クリーンアップを設計する。管理すべき状態は2層:

| 層 | 例 | セットアップ | クリーンアップ |
|---|---|---|---|
| **フロントエンド** | localStorage, cookie, sessionStorage | クリア or 初期値投入 | クリア |
| **バックエンド** | DB, ファイル, キャッシュ | シードデータ投入（API or SQL） | リセット or ロールバック |

プロジェクトに応じて必要なファイルを生成する:

- **認証が必要** → `global-setup.ts`（ログインしてstorageState保存）
- **テストデータが必要** → `fixtures.ts`（シードデータ定義 + 投入/クリーンアップ関数）
- **どちらも不要**（localStorage onlyなアプリ等） → beforeEach内で`localStorage.clear()`のみ

不要なファイルは生成しない。

### 出力先

```
tests/e2e/<feature-name>/
├── page-map.md              ← Step 1で生成済み
├── bugs.md                  ← specと実装の乖離（バグ発見）を記録
├── global-setup.ts          ← 認証が必要な場合のみ
├── fixtures.ts              ← テストデータが必要な場合のみ
├── <test-name-1>.e2e.test.ts
├── <test-name-2>.e2e.test.ts
└── ...
```

### テストコードの書き方

```typescript
import { test, expect } from '@playwright/test';

/**
 * E2E: <feature-name>
 * Source: specs/features/<feature-name>/spec.md — US-XX / EC-XXX
 * Pages: <page-map.mdの対象ページ>
 */
test.describe('<Feature Name> E2E', () => {
  test('<ユーザーフローの説明>', async ({ page }) => {
    // Given: <specのGiven>
    await page.goto('<URL>');

    // When: <specのWhen>
    await page.getByTestId('xxx').click();

    // Then: <specのThen>
    await expect(page.getByTestId('yyy')).toBeVisible();
  });
});
```

トレーサビリティのルール:
- ファイルヘッダに`Source:`でspecファイルパスと対応するUS/ECのIDを記載する
- 各テストステップにGiven/When/Thenのコメントを付ける
- レビューアーがspecを見ながらテストの妥当性を確認できるようにするため

### テスト設計の注意点

- **待機**: `waitForSelector`よりPlaywrightの自動待機（`expect`のauto-retrying）を使う
- **テストの独立性**: 各テストは独立して実行可能にする。テスト間で状態を共有しない
- **テストデータ**: 「テスト環境のセットアップ/クリーンアップ」セクションの方針に従う
- **タイムアウト**: デフォルトのtimeoutに任せる。明示的なsleep/waitは避ける
- **スクリーンショット**: 失敗時の自動スクリーンショットはPlaywrightのデフォルト設定に任せる
- **baseURL**: playwright.config.tsのbaseURLはポート番号をハードコードしない。環境変数（`process.env.BASE_URL`）かplaywright.config.tsのデフォルト設定を使う。dev serverは空きポートを使う場合があるため
- **dev server**: playwright.config.tsの`webServer`設定でdev serverの自動起動・停止を管理する。手動起動を前提にしない
- **既知の制約**: page-map.mdの「既知の制約」セクションを必ず確認し、テスト生成時に考慮する。同じ罠を踏まない

### Flaky Test対策

E2Eは壊れやすい。以下を守る:
- **セレクタ安定性**: data-testidを最優先。CSSクラスやテキストに依存しない
- **アニメーション**: テスト実行前にアニメーションを無効化（`page.emulateMedia({ reducedMotion: 'reduce' })` 等）
- **ネットワーク**: API応答を待ってから次の操作に進む（`waitForResponse`等）
- **テスト数を最小限に**: E2Eは少なく保つ。数が増えるほどflakyリスクが上がる

## Step 3: Run Tests

1. テストファイルを生成したら、Playwrightのテスト実行コマンドで実行する
2. **全テストがpassするまで修正を繰り返す**（最大3回）
3. 修正時もFEの実装コードは見ない。テストコード側の問題（セレクタ不一致、待機不足等）を修正する

### 失敗時の判断フレームワーク

1. テストがspecに基づいているか確認
2. テストが正しいなら → **specと実装の乖離**（バグ発見）。テスト側を直さず報告
3. テストがspec/要件と乖離しているなら → テストを修正
4. 判断が難しい場合 → 人間にエスカレーション

具体的な対処:
- **セレクタ不一致** → page-map.mdのセレクタと実際のDOMを比較し、page-map.mdの更新が必要か判断
- **タイミング問題** → Playwrightの自動待機を活用。明示的wait追加は最終手段
- **specと実装の乖離** → これはテストが正しく機能している証拠。修正せず `tests/e2e/<feature>/bugs.md` に記録して報告する

## Step 4: Report

### バグ発見の記録

specと実装の乖離が見つかった場合、`tests/e2e/<feature>/bugs.md` に構造化して書き出す:

```markdown
# E2E Bugs: <feature-name>

## BUG-001: <バグの概要>
- **発見元**: US-XX のテスト中
- **再現手順**: <操作手順>
- **期待動作**: <specの記述>
- **実際の動作**: <実際に起きたこと>
- **回避策**: <テストで使った回避策（あれば）>
```

### 返却内容

以下を返す:
- 生成したテストファイルのパス一覧
- 各テストの実行結果（pass/fail）
- 失敗がある場合: 失敗内容と「specと実装の乖離」か「テスト側の問題」かの判定
- バグ発見がある場合: bugs.mdのパスと概要
- specカバレッジの概要（specのどのUS/ECをカバーしたか）

## Rules

- E2Eテストファイルは `*.e2e.test.ts` で命名
- specのGiven/When/Then、page-map.mdのセレクタ、ARCHITECTURE.mdの環境情報だけを根拠に書く
- FEの実装コード（src/等）を読んで書かない
- 最長正のパスで効率的にまとめつつ、選定されたクリティカルパスのUSを網羅する。Edge CaseはE2Eでやらない
- CSSセレクタやXPathは使わない。data-testid/role/label/textを使う
- セットアップ/クリーンアップはARCHITECTURE.mdの情報から設計する。不要なファイル(global-setup.ts, fixtures.ts)は生成しない
- specと実装の乖離による失敗はテスト側を直さない（バグ発見として報告）
- CLAUDE.md/CLAUDE.local.mdのテスト規約に従う
