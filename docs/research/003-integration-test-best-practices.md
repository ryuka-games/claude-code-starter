# 調査レポート: 結合テスト（Integration Test）のベストプラクティス

調査日: 2026-03-09

---

## 目次

| 調査 | 内容 |
|------|------|
| [調査1](#調査1-一般的なitのベストプラクティス) | 一般的なITのベストプラクティス |
| [調査2](#調査2-aiエージェントでitを書く場合のベストプラクティス) | AIエージェントでITを書く場合のベストプラクティス |
| [調査3](#調査3-フロントエンドreactnextjsでのit) | フロントエンド（React/Next.js）でのIT |
| [チェックリスト](#itで何をテストすべきかチェックリスト案) | ITで何をテストすべきかチェックリスト案 |

---

## 調査1: 一般的なITのベストプラクティス

### 1-1. Integration Testで何をテストすべきか（何をUTでやらないか）

**ITでテストすべきもの:**
- コンポーネント間の接続・通信が正しく動くか（APIの呼び出し、DBアクセス、メッセージキュー）
- 複数モジュールを組み合わせた際のデータフロー
- 外部サービスとの連携（実際の接続 or テストダブル経由）
- 設定ファイル・環境変数が正しく読み込まれるか
- データベースのマイグレーション・スキーマが実際に機能するか
- 認証・認可の実際のフロー

**UTに留めるべきもの:**
- 単一関数/メソッドのロジック（分岐、計算、バリデーション）
- エッジケース・境界値のテスト
- 純粋関数のテスト（副作用のない変換処理）

**Kent Beckの原則:** 「自分が所有していないものはテストするな。ただし、それを正しく使っていることをテストせよ」
— つまりITでは「外部依存との接続が正しいか」を検証する。

**出典:**
- [Martin Fowler - bliki: Integration Test](https://martinfowler.com/bliki/IntegrationTest.html)
- [Kent Beck - Programmer Test Principles](https://medium.com/@kentbeck_7670/programmer-test-principles-d01c064d7934)

### 1-2. ITの設計原則・パターン

#### テストの粒度: Narrow IT vs Broad IT（Martin Fowler）

| 種類 | 範囲 | 特徴 |
|------|------|------|
| **Narrow IT** | 1つの統合ポイントだけテスト。外部サービスはテストダブルで置換 | 高速、独立、推論しやすい |
| **Broad IT** | 複数の統合ポイントをまとめてテスト。実際のサービスを使う | 遅い、壊れやすいが忠実度が高い |

Fowlerの推奨: **Narrow ITとコントラクトテストの組み合わせ**が最も効果的。Broad ITの信頼性をNarrow ITの速度で実現できる。

#### Googleのテストサイズ分類

Googleは「Unit/Integration」ではなく**サイズ**で分類する:

| サイズ | 制約 |
|--------|------|
| **Small** | 単一プロセス、単一スレッド、I/O禁止 |
| **Medium** | 複数プロセス可、localhost内 |
| **Large** | 複数マシンにまたがれる |

**メリット:** 曖昧な「結合テスト」という用語を避け、実行環境の制約で明確に分類できる。

#### Kent C. Doddsの「Testing Trophy」

従来のテストピラミッド（UTが最多）に対して、Doddsは**テスティングトロフィー**を提唱:

```
      E2E（少数）
    Integration（最多）← ここが最大
   Unit（中程度）
  Static Analysis（基盤）
```

格言: **「Write tests. Not too many. Mostly integration.」**

理由: ITはUTとE2Eの中間にあり、書きやすさ・実行速度・信頼度のバランスが最も良い。「テストがソフトウェアの実際の使い方に近いほど、より大きな信頼を与える」

**出典:**
- [Martin Fowler - The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Software Engineering at Google - Ch.11-13](https://abseil.io/resources/swe-book/html/ch11.html)
- [Kent C. Dodds - Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)
- [Kent C. Dodds - The Testing Trophy and Testing Classifications](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

### 1-3. 「良いITとは何か」の定義・基準

Kent Beckの「Test Desiderata」（テストに求める性質）をITに適用:

| 性質 | IT での意味 |
|------|------------|
| **Isolated（独立）** | 他のテストの結果に影響されない。テスト間で状態を共有しない |
| **Composable（合成可能）** | 任意の順序・組み合わせで実行できる |
| **Deterministic（決定的）** | 同じ入力なら常に同じ結果。フレーキーにならない |
| **Fast（高速）** | フィードバックが速い。Narrow ITで実現 |
| **Writable（書きやすい）** | セットアップが複雑すぎない |
| **Readable（読みやすい）** | テストを読めば仕様がわかる |
| **Behavioral（振る舞いベース）** | 実装の詳細ではなく契約・振る舞いをテスト |

Googleの原則: **「変わらないテストを目指し、公開APIを通じてテストし、状態をテストせよ（インタラクションではなく）」**

**出典:**
- [Kent Beck - Test Desiderata](https://medium.com/@kentbeck_7670/test-desiderata-94150638a4b3)
- [Software Engineering at Google - Unit Testing](https://abseil.io/resources/swe-book/html/ch12.html)

### 1-4. ITのアンチパターン

Kostis KapelonisのCodepipesブログとGoogle Testing Blogから:

| アンチパターン | 説明 | 対策 |
|---------------|------|------|
| **UTなしでITだけ** | バグの特定が困難。デバッグに時間がかかる | UTで基盤を固めた上でITを書く |
| **ITなしでUTだけ** | モジュール単体は動くが接続すると壊れる | 統合ポイントごとにNarrow ITを書く |
| **間違った種類のテスト** | UTで書くべきものをITで書く（逆も） | テストの目的を明確にし、適切なレベルで書く |
| **Hermetic環境の不備** | テスト環境が共有で干渉する | テストごとに独立した環境を用意 |
| **マージ前にIT未実行** | 統合バグがmainに入る | CI/CDでマージ前にIT必須にする |
| **本番システムへの接続** | テストが不安定、遅い、外部障害で壊れる | テスト専用インスタンスかテストダブルを使う |
| **フレーキーテストの放置** | テスト結果を誰も信頼しなくなる | フレーキーテストは即修正 or quarantine |
| **E2Eテストへの過度な依存** | 遅い、壊れやすい、原因特定が困難 | ITで十分な範囲をカバーし、E2Eは最小限 |

**出典:**
- [Codepipes Blog - Software Testing Anti-patterns](https://blog.codepipes.com/testing/software-testing-antipatterns.html)
- [Google Testing Blog - Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)

### 1-5. テストファイルの構成・命名規則

#### ディレクトリ構成パターン

**パターンA: トップレベル分離型（推奨: バックエンド/大規模プロジェクト）**
```
project/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   └── user/
├── tests/
│   ├── unit/
│   │   ├── auth/
│   │   └── user/
│   ├── integration/
│   │   ├── auth-user.test.ts     ← モジュール間の結合
│   │   ├── auth-db.test.ts       ← 外部依存との結合
│   │   └── api-routes.test.ts    ← APIルートの結合
│   └── e2e/
```

**パターンB: コロケーション型（推奨: フロントエンド/React）**
```
src/
├── features/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.test.tsx        ← UT
│   │   ├── AuthFlow.integration.test.tsx  ← IT
│   │   └── useAuth.ts
│   └── dashboard/
│       ├── Dashboard.tsx
│       └── Dashboard.integration.test.tsx
```

#### 命名規則

| 言語/FW | UT命名 | IT命名 |
|---------|--------|--------|
| JavaScript/TS | `*.test.ts`, `*.spec.ts` | `*.integration.test.ts`, `*.int.test.ts` |
| Java | `*Test.java` | `*IT.java`, `*IntegrationTest.java` |
| Python | `test_*.py` | `test_*_integration.py` |
| Go | `*_test.go` | `*_integration_test.go` + build tag |

**重要:** UTとITは**名前で明確に区別**し、CIで個別実行できるようにする。

**出典:**
- [pytest - Good Integration Practices](https://docs.pytest.org/en/stable/explanation/goodpractices.html)
- [Corey Cleary - Where to put your tests in a Node project structure](https://www.coreycleary.me/where-to-put-your-tests-in-a-node-project-structure)

---

## 調査2: AIエージェントでITを書く場合のベストプラクティス

### 2-1. AIにITを書かせている事例

#### Claude Code + TDD
- Steve Kinney、Alex Op等が Claude Code で TDD ワークフローを実践
- 核心: **「テストを先に書け、実装はまだ書くな」と明示的に指示する必要がある**
- Claude は自然に実装→テストの順で書こうとするため、TDDには明示的プロンプトが必須

#### マルチエージェントアプローチ
- **テスト専任エージェント**と**実装専任エージェント**を分離
- テスト専任は実装を知らない状態でテストを書く → カンニング問題の回避
- 実装専任は失敗するテストだけを見て実装する

**出典:**
- [Steve Kinney - Test-Driven Development with Claude Code](https://stevekinney.com/courses/ai-development/test-driven-development-with-claude)
- [Alex Op - Forcing Claude Code to TDD](https://alexop.dev/posts/custom-tdd-workflow-claude-code-vue/)
- [AI Hero - My Skill Makes Claude Code GREAT At TDD](https://www.aihero.dev/skill-test-driven-development-claude-code)

### 2-2. AIにITを書かせるときのプロンプト設計

#### 良いプロンプトの原則

**悪い例:**
```
テストを追加して
```

**良い例:**
```
tests/integration/auth-api.test.ts に結合テストを書いて。
以下の観点をカバーすること:
- ログインAPI → セッション作成 → ダッシュボードアクセスのフロー
- 無効なトークンで401が返ること
- mockは使わず、テスト用DBを使うこと
仕様は spec.md の「認証フロー」セクションを参照。
```

**ポイント:**
1. **ファイルパスを指定** — どこに書くか曖昧にしない
2. **テスト観点を列挙** — AIに「何をテストするか」を考えさせない
3. **制約を明示** — mock使用の可否、テスト対象の範囲
4. **仕様への参照** — 実装ではなく仕様を根拠にさせる

### 2-3. specからITの観点を自動抽出する手法

#### 学術的アプローチ
- **SAGE（Specification-Aware Grammar Extraction）**: LLMを使って仕様書からテストケースの文法を自動抽出するフレームワーク（IEEE）
- **REDAST（Requirements-Driven Automated Software Testing）**: 要件定義書を入力としてテスト成果物を自動生成
- **OpenAPI → テストケース**: OpenAPI定義をメタモデルとして表現し、TestSuiteメタモデルに変換

#### 実用的アプローチ（AIエージェント向け）
1. spec.md から「受け入れ条件（AC）」を抽出
2. ACをテストケースの骨格（describe/it）に変換
3. 各テストケースに必要なセットアップ・アサーションを生成

```
spec.md の受け入れ条件を読み、各ACに対応する結合テストの
テストケース一覧（describe/it構造のみ、実装なし）を出力せよ。
```

**出典:**
- [IEEE DataPort - SAGE](https://ieee-dataport.org/documents/sage-specification-aware-grammar-extraction-automated-test-case-generation-llms)
- [On Test Automation - Generating automated tests from specifications](https://www.ontestautomation.com/generating-automated-tests-from-specifications/)

### 2-4. AIが書くITの品質をどう担保するか

| 手法 | 説明 |
|------|------|
| **Mutation Testing** | テスト対象コードに意図的にバグを入れ、テストが検知できるか確認。AIが書いたテストの「本当の検知力」を測定 |
| **カバレッジ + 手動レビュー** | カバレッジだけでは不十分（100%でもバグを見逃す）。重要なテストケースは人がレビュー |
| **テストの独立実行** | 他のテストに依存していないか確認。順序を変えても通るか |
| **フレーキーチェック** | 同じテストを複数回実行して安定性を確認 |
| **仕様との突合** | テストケースがspec/ACと1:1で対応しているか確認 |

### 2-5. 「カンニング問題」への対策

#### 問題の本質

David Adamo Jr.の指摘: 「AIにテストを書かせると、AIはまず対象コードを分析し、現在の実装に合致するテストを生成する。**テストは実装を検証するのであって、意図を検証しない。** コードにバグがあれば、テストはそのバグを忠実に反映する。」

Swizec Tellerの補足: 「AIがコードからテストを導出したので、Beyonceルール（壊れたら検知できる）すら適用できない。その文字列変換が間違っていて、プログラマーの意図と違ったら？ 永遠にわからない。バグが両方の場所に存在する。」

#### 対策一覧

| 対策 | 具体的な方法 | 効果 |
|------|-------------|------|
| **仕様先行** | specを先に書き、AIにはspecだけを見せてテストを書かせる。実装コードを参照させない | 最も効果的。意図ベースのテストになる |
| **エージェント分離** | テスト担当と実装担当を別エージェントにする。テスト担当は実装を見ない | マルチエージェント環境で実現可能 |
| **TDD強制** | 「実装はまだ書くな。テストだけ書け」と明示指示。テストが失敗することを確認してから実装 | Red-Green-Refactorの原則を守れる |
| **コメント/意図の明記** | コード中にコメントで意図を書き、AIにコメントからテストを書かせる（Swizecの発見: AIはコメントの意図を読んで正しくテストを書けた） | 既存コードへの後付けITに有効 |
| **人間レビュー** | AIが書いたテストの「期待値」が仕様と一致しているか人が確認 | 最低限のセーフティネット |

**出典:**
- [David Adamo Jr. - AI-Generated Tests are Lying to You](https://davidadamojr.com/ai-generated-tests-are-lying-to-you/)
- [Swizec Teller - Why you shouldn't use AI to write your tests](https://swizec.com/blog/why-you-shouldnt-use-ai-to-write-your-tests/)
- [Swizec Teller - AI writes good tests, actually](https://swizec.com/blog/ai-writes-good-tests-actually/)

---

## 調査3: フロントエンド（React/Next.js）でのIT

### 3-1. コンポーネント結合テストのやり方

#### ツールスタック

| ツール | 役割 |
|--------|------|
| **Vitest** | テストランナー（Jest互換、ESM対応、並列実行で高速） |
| **React Testing Library (RTL)** | DOM操作・アサーション（ユーザー視点でテスト） |
| **@testing-library/user-event** | ユーザー操作のシミュレーション（fireEventより忠実） |
| **MSW (Mock Service Worker)** | API通信のモック（ネットワークレベルで傍受） |
| **happy-dom / jsdom** | ブラウザ環境のシミュレーション |

#### Vitest + Next.js のセットアップ

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
})
```

#### コンポーネント結合テストの例

```tsx
// LoginFlow.integration.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'
import { Dashboard } from '../dashboard/Dashboard'
import { AppProviders } from '../providers/AppProviders'

describe('ログインフロー', () => {
  it('正しい資格情報でログインするとダッシュボードが表示される', async () => {
    const user = userEvent.setup()
    render(
      <AppProviders>
        <LoginForm />
        <Dashboard />
      </AppProviders>
    )

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com')
    await user.type(screen.getByLabelText('パスワード'), 'password123')
    await user.click(screen.getByRole('button', { name: 'ログイン' }))

    expect(await screen.findByText('ダッシュボード')).toBeInTheDocument()
  })
})
```

**ポイント:**
- `userEvent.setup()` をrenderの前に呼ぶ
- `fireEvent` ではなく `userEvent` を使う（より忠実なイベントシミュレーション）
- Providerで複数コンポーネントをラップし、実際のアプリに近い状態でテスト

**出典:**
- [Next.js - Testing: Vitest](https://nextjs.org/docs/app/guides/testing/vitest)
- [Testing Library - userEvent Introduction](https://testing-library.com/docs/user-event/intro/)
- [Frontend Engineering - Integration testing in React](https://www.frontendeng.dev/blog/10-integration-testing-in-react)

### 3-2. UIコンポーネント間の連携テスト

RTLの哲学: **「テストがソフトウェアの使い方に近いほど、より大きな信頼を得られる」**

#### テスト対象のパターン

| パターン | テスト内容 | 例 |
|----------|----------|-----|
| **親子コンポーネント連携** | propsの伝播、コールバックの呼び出し | フォーム → バリデーション表示 |
| **兄弟コンポーネント連携** | 共通の親/storeを介した連携 | フィルター → リスト表示 |
| **ページレベル連携** | ルーティング、レイアウト、複数機能の統合 | ログイン → リダイレクト → ダッシュボード |
| **モーダル/ダイアログ** | 開閉、フォーム送信、確認フロー | 削除確認ダイアログ → 削除実行 |

#### 推奨: 1機能あたり1-3件のIT

Kent C. Doddsの推奨に従い、主要な機能やユーザーフローごとに最低1-3件の結合テストを書く。

**出典:**
- [Kent C. Dodds - The Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [FreeCodeCamp - How to Test User Interactions](https://www.freecodecamp.org/news/how-to-test-user-interactions-in-react/)

### 3-3. 状態管理（store）とUIの結合テスト

#### 原則: 実際のstoreを使う

Redux公式の推奨: 「テストでは実際のstoreを使い、コンポーネントからディスパッチして状態変更がUIに反映されることをテストせよ」

```tsx
// CartFlow.integration.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { cartSlice } from './cartSlice'
import { ProductCard } from './ProductCard'
import { CartSummary } from './CartSummary'

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({ reducer: { cart: cartSlice.reducer } })
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('カート機能', () => {
  it('商品追加するとカートに反映される', async () => {
    const user = userEvent.setup()
    renderWithStore(
      <>
        <ProductCard id="1" name="商品A" price={1000} />
        <CartSummary />
      </>
    )

    await user.click(screen.getByRole('button', { name: 'カートに追加' }))

    expect(screen.getByText('1件の商品')).toBeInTheDocument()
    expect(screen.getByText('¥1,000')).toBeInTheDocument()
  })
})
```

**ポイント:**
- テストごとに新しいstoreを作成（テスト間の状態共有を防ぐ）
- モックstoreは使わず、実際のreducerを使う
- UIの操作 → store変更 → UI反映の全体フローをテスト

**出典:**
- [Redux - Writing Tests](https://redux.js.org/usage/writing-tests)

### 3-4. API呼び出しとUIの結合テスト（MSW）

#### MSWの利点

- **ネットワークレベルで傍受**: fetch, axios, XMLHttpRequest すべて対応
- **アプリケーションコード変更不要**: テストのためにコードを変更する必要がない
- **環境横断で再利用可能**: UT、IT、E2E、Storybook で同じモック定義を使える
- **リアルなレスポンス**: 実際のHTTPレスポンスと同じ構造

#### セットアップ

```ts
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json()
    if (email === 'test@example.com' && password === 'valid') {
      return HttpResponse.json({ user: { id: '1', name: 'Test User' } })
    }
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }),

  http.get('/api/dashboard', () => {
    return HttpResponse.json({ stats: { users: 100, revenue: 50000 } })
  }),
]

// tests/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'
export const server = setupServer(...handlers)

// tests/setup.ts
import { server } from './mocks/server'
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

#### テスト例

```tsx
// AuthDashboard.integration.test.tsx
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

describe('認証 → ダッシュボード フロー', () => {
  it('ログイン成功後にダッシュボードデータが表示される', async () => {
    const user = userEvent.setup()
    render(<App />, { wrapper: AppProviders })

    // ログイン操作
    await user.type(screen.getByLabelText('Email'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'valid')
    await user.click(screen.getByRole('button', { name: 'ログイン' }))

    // ダッシュボードの表示確認
    expect(await screen.findByText('100')).toBeInTheDocument() // users
    expect(screen.getByText('¥50,000')).toBeInTheDocument() // revenue
  })

  it('API エラー時にエラーメッセージが表示される', async () => {
    // テスト固有のハンドラーで上書き
    server.use(
      http.get('/api/dashboard', () => {
        return HttpResponse.json({ error: 'Server Error' }, { status: 500 })
      })
    )

    const user = userEvent.setup()
    render(<App />, { wrapper: AppProviders })

    // ログイン後にエラー表示を確認
    // ...
    expect(await screen.findByText('エラーが発生しました')).toBeInTheDocument()
  })
})
```

**ポイント:**
- `server.use()` でテスト固有のレスポンスを上書きできる（エラーケース等）
- `afterEach(() => server.resetHandlers())` で上書きをリセット
- `findBy*` で非同期のUI更新を待つ

**出典:**
- [MSW - Mock Service Worker](https://mswjs.io/)
- [MSW - Quick Start](https://mswjs.io/docs/quick-start/)
- [Medium - Testing React Applications with Testing Library, MSW, and Vitest](https://medium.com/front-end-weekly/testing-react-applications-the-easy-way-with-testing-library-msw-and-vitest-using-a-sample-932916433203)

---

## ITで何をテストすべきかチェックリスト案

### A. バックエンド IT チェックリスト

- [ ] **API エンドポイント** — リクエスト → レスポンスの正常系・異常系
- [ ] **DB 操作** — CRUD操作が実際のDB（テスト用）で動くか
- [ ] **認証・認可フロー** — ログイン → トークン取得 → 保護リソースアクセス
- [ ] **外部サービス連携** — API呼び出し、Webhook受信（テストダブル使用）
- [ ] **ミドルウェア連携** — エラーハンドリング、ログ、バリデーションの連鎖
- [ ] **設定・環境変数** — 異なる設定での動作確認
- [ ] **データ整合性** — トランザクション、並行アクセス、リレーション

### B. フロントエンド IT チェックリスト

- [ ] **ユーザーフロー** — 主要なユーザー操作シナリオ（ログイン、購入、検索等）
- [ ] **コンポーネント間連携** — 親子/兄弟コンポーネントのデータ受け渡し
- [ ] **状態管理 ↔ UI** — storeの変更がUIに正しく反映されるか
- [ ] **API ↔ UI** — API成功/失敗/ローディング状態がUIに正しく反映されるか
- [ ] **フォームフロー** — 入力 → バリデーション → 送信 → 結果表示
- [ ] **ルーティング連携** — ナビゲーション → ページ遷移 → パラメータ受け渡し
- [ ] **エラーバウンダリ** — エラー発生時のフォールバックUI表示

### C. AIエージェントにITを書かせるときのチェックリスト

- [ ] **spec/仕様を入力として渡した** — 実装コードではなく仕様から書かせた
- [ ] **テスト観点を人が指定した** — AIに「何をテストするか」を丸投げしていない
- [ ] **カンニング対策を実施した** — テスト専任エージェント分離 or TDD強制 or spec先行
- [ ] **期待値を人が確認した** — AIが設定した期待値が仕様と一致しているか
- [ ] **テストが失敗することを確認した** — 実装前にテストがRedであることを検証
- [ ] **テストの独立性を確認した** — 他のテストと順序に依存していないか
- [ ] **フレーキーでないことを確認した** — 複数回実行しても安定しているか

---

## 参考文献一覧

### 権威ある情報源
- [Martin Fowler - bliki: Integration Test](https://martinfowler.com/bliki/IntegrationTest.html)
- [Martin Fowler - The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Martin Fowler - Testing Strategies in a Microservice Architecture](https://martinfowler.com/articles/microservice-testing/)
- [Martin Fowler - On the Diverse And Fantastical Shapes of Testing](https://martinfowler.com/articles/2021-test-shapes.html)
- [Software Engineering at Google - Testing Overview (Ch.11)](https://abseil.io/resources/swe-book/html/ch11.html)
- [Software Engineering at Google - Unit Testing (Ch.12)](https://abseil.io/resources/swe-book/html/ch12.html)
- [Google Testing Blog - Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
- [Kent Beck - Test Desiderata](https://medium.com/@kentbeck_7670/test-desiderata-94150638a4b3)
- [Kent Beck - Programmer Test Principles](https://medium.com/@kentbeck_7670/programmer-test-principles-d01c064d7934)
- [Kent C. Dodds - Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)
- [Kent C. Dodds - The Testing Trophy and Testing Classifications](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

### アンチパターン・品質
- [Codepipes Blog - Software Testing Anti-patterns](https://blog.codepipes.com/testing/software-testing-antipatterns.html)
- [David Adamo Jr. - AI-Generated Tests are Lying to You](https://davidadamojr.com/ai-generated-tests-are-lying-to-you/)
- [Swizec Teller - Why you shouldn't use AI to write your tests](https://swizec.com/blog/why-you-shouldnt-use-ai-to-write-your-tests/)
- [Swizec Teller - AI writes good tests, actually](https://swizec.com/blog/ai-writes-good-tests-actually/)

### AI + テスト
- [Steve Kinney - Test-Driven Development with Claude Code](https://stevekinney.com/courses/ai-development/test-driven-development-with-claude)
- [AI Hero - My Skill Makes Claude Code GREAT At TDD](https://www.aihero.dev/skill-test-driven-development-claude-code)
- [Alex Op - Forcing Claude Code to TDD](https://alexop.dev/posts/custom-tdd-workflow-claude-code-vue/)
- [Claude Code Ultimate Guide - TDD with Claude](https://github.com/FlorianBruniaux/claude-code-ultimate-guide/blob/main/guide/workflows/tdd-with-claude.md)
- [IEEE DataPort - SAGE: Specification-Aware Grammar Extraction](https://ieee-dataport.org/documents/sage-specification-aware-grammar-extraction-automated-test-case-generation-llms)

### フロントエンドテスト
- [Next.js - Testing: Vitest](https://nextjs.org/docs/app/guides/testing/vitest)
- [MSW - Mock Service Worker](https://mswjs.io/)
- [Redux - Writing Tests](https://redux.js.org/usage/writing-tests)
- [Testing Library - userEvent Introduction](https://testing-library.com/docs/user-event/intro/)
- [Frontend Engineering - Integration testing in React](https://www.frontendeng.dev/blog/10-integration-testing-in-react)
