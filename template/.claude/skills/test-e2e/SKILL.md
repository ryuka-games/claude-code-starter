---
name: test-e2e
description: "Generate and run E2E tests for a feature using Playwright. Explores the app with Playwright MCP, then generates spec-based test code. Use after implementation is complete and the app is running."
disable-model-invocation: true
argument-hint: "[feature name or path to feature spec]"
---

Generate and run E2E tests for: $ARGUMENTS

## 前提条件

- Playwright MCPが設定済みであること
- **ブラウザプロセスの確認**: 前セッションのブラウザが残っているとMCPが競合する。探索開始前に既存のブラウザプロセスが残っていないか確認し、残っていれば閉じてから開始する

### Playwrightセットアップ確認

`playwright.config.ts` が存在するか確認する。存在しない場合は以下で初期セットアップする:

1. `npm init playwright@latest` を実行（または `pnpm create playwright`）
2. playwright.config.ts を以下の方針で設定:
   - `baseURL`: 環境変数 `process.env.BASE_URL || 'http://localhost:5173'` を使う。ポート番号ハードコード禁止
   - `webServer`: dev serverの自動起動・停止を設定する。Playwrightがテスト実行前にdev serverを起動し、終了後に停止する
   - `reporter`: `[['html', { open: 'never' }]]` でHTMLレポートを生成（CI連携用）
3. 設定例:
```typescript
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
  },
  webServer: {
    command: 'npm run dev',  // CLAUDE.mdのdev serverコマンドに合わせる
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  reporter: [['html', { open: 'never' }]],
});
```

`webServer`設定により「アプリが起動済みであること」の前提条件は不要になる。Playwrightが自動管理する。

## Step 1: ページ探索と環境把握（メインコンテキストで実行）

Playwright MCPを使ってアプリを操作し、テスト対象のページ構造と環境情報を把握する。

### 1-1: specとARCHITECTURE.mdを読む

以下を読み込む:

- `specs/features/<feature>/spec.md` — テスト対象のUser Story（US）を把握
- `ARCHITECTURE.md` — 技術スタック、認証方式、データストア、外部APIを把握

**E2Eではspecの全US/ECをカバーしない。** 以下の基準でクリティカルパス（smoke test対象）を選定する:

- **これが壊れたらサービスが使えない**レベルのP1ユーザーフロー
- 複数画面を跨ぐメインの操作フロー
- Edge Case（EC）はITの役割。E2Eではやらない

選定したUSと、ARCHITECTURE.mdから判断した環境情報（認証方式、データストア種別、外部API有無）をユーザーに提示し、合意を得てから探索に進む。

### 1-2: 操作チェックリストを作成して探索する

選定したUSごとにGiven/When/Thenを「操作チェックリスト」に変換し、MCPで1つずつ実際に通す:

1. 選定した各USのGiven/When/Thenをリスト化する
2. 各項目について:
   a. 対象画面に遷移する
   b. `take_snapshot` でDOM/a11yツリーを取得する
   c. テスト対象の要素を特定する（data-testid, aria-label, role等）
   d. **When（操作）をMCPで実際に実行する** — クリック、キーボード操作、フォーム入力等をスキップせず全部やる
   e. **Then（期待結果）が実際に起きるか確認する**
3. 探索段階でバグ・制約を発見したら記録する（page-mapの「既知の制約」セクションに反映）

操作チェックリストの例:
```
□ US-01: Given ダッシュボード表示 → When 新規作成クリック → Then ダイアログ表示
□ US-02: Given ダイアログ表示 → When タイトル入力+保存 → Then 一覧に追加
□ US-05: Given アイテム選択 → When 削除クリック → Then 一覧から消える
```

### 1-3: ページマップを書き出す

探索結果を以下の形式でファイルに書き出す:

```
tests/e2e/<feature-name>/page-map.md
```

フォーマット:

```markdown
# Page Map: <feature-name>

## ページ: <URL or route>

### 操作可能な要素
- `[data-testid="xxx"]` — 説明（ボタン、入力欄等）
- `getByRole('button', { name: 'xxx' })` — 説明
- `getByLabel('xxx')` — 説明

### 画面の状態変化
- <操作> → <結果の表示変化>

## ページ: <URL or route>
...

## 既知の制約

探索中に発見した、テスト生成時に考慮すべき制約・罠を記録する:
- 例: 「Deleteキーでクラッシュするため、UIの削除ボタンを使う」
- 例: 「ノードはuidでクリックするとタイムアウト。data-testidを使う」
- 例: 「アニメーション完了前に次の操作をするとflakyになる」
```

**ルール:**
- src/の実装コードは読まない。画面から見えるものだけを記録する
- セレクタはPlaywrightの推奨優先順位に従う: data-testid > role > label > CSS
- ユーザーが見えるテキスト、状態変化、エラーメッセージも記録する

### 1-4: page-mapの鮮度管理

page-map.mdはUI変更で古くなる。以下の場合はStep 1-2から再実行する:
- `/agent-teams`でUI変更を含むfeatureを実装した後
- E2Eテストがセレクタ不一致で失敗したとき

## Step 2: テスト生成（Task toolで実行）

ページマップが完成したら、Task toolでテスト生成サブエージェントを起動する。

```
`.claude/skills/test-e2e/test-e2e-agent.md` を読み、その指示に従って以下のfeatureのE2Eテストを作成・実行せよ:

Feature: $ARGUMENTS
Page map: tests/e2e/<feature-name>/page-map.md

結果サマリー（生成したテストファイル、実行結果、失敗があればその内容）を返せ。
```

## Step 3: 結果をユーザーに提示

サブエージェントが返した結果をもとに:
- 生成したテストファイルのパス一覧を提示
- テスト実行結果（pass/fail）を提示
- 失敗がある場合: 原因の概要と「specと実装の乖離」か「テスト側の問題」かの判定
- バグ発見がある場合: bugs.mdのパスと概要
- specカバレッジ（どのUS/ECがカバーされたか）を提示
- ファイルパスを提示してユーザーにレビューを促す

## Step 4: Retro（振り返り）

テスト実行後、`tests/e2e/<feature-name>/retro.md` に振り返りを書き出す:

```markdown
# E2E Retro: <feature-name>
Date: YYYY-MM-DD

## 発見したバグ
- <バグの概要と原因>

## 既知の制約
- <探索・テスト中に判明した制約・罠>

## スキル改善メモ
- <次回以降に改善すべきスキルの問題点>
```

### retroの活用

- **次回の同feature E2E実行時** → retro.mdを読んで既知の制約を把握。同じ罠を踏まない
- **スキル本体の改善時** → 複数featureのretro.mdを横断して共通パターンを抽出し、スキルのルールに昇格させる

page-mapは「画面の今の状態」、retroは「やってみて分かったこと」。この2つが揃って次回の入力品質が上がる。

### retroからスキルへの昇格基準

同じ問題が**2回以上のretroで出現したら**、スキル本体のルールに追加する:
- 探索の手順に関すること → SKILL.mdに追加
- テスト生成のルール → test-e2e-agent.mdに追加
- page-mapのフォーマット → SKILL.mdのテンプレートに追加
