# 調査レポート: 結合テスト（IT）ファイル配置のベストプラクティス

調査日: 2026-03-10

---

## 目次

| セクション | 内容 |
|-----------|------|
| [調査1](#調査1-itテストファイルの配置パターン) | ITテストファイルの配置パターン（3パターン比較） |
| [調査2](#調査2-テストケース定義とテストコードの分離) | テストケース定義とテストコードの分離 |
| [調査3](#調査3-feature単位でitを管理するパターン) | feature単位でITを管理するパターン |
| [調査4](#調査4-aiエージェントがitを生成する場合の配置) | AIエージェントがITを生成する場合の配置 |
| [総合推奨](#総合推奨) | 推奨パターンまとめ |

---

## 調査1: ITテストファイルの配置パターン

### 3パターンの比較表

| 観点 | パターンA: トップレベル分離型 | パターンB: コロケーション型 | パターンC: 仕様ディレクトリ型 |
|------|---------------------------|------------------------|--------------------------|
| **構造** | `tests/integration/<feature>/` | `src/features/<feature>/*.integration.test.ts` | `specs/<feature>/` にテストケース定義 |
| **採用事例** | NestJS, pytest, Go, Java (Maven/Gradle) | React (Kent C. Dodds推奨), Rust (unit), Feature-Sliced Design | Cucumber/Gherkin (BDD), Testspace |
| **発見しやすさ** | テストだけ一覧しやすい | 関連コードとテストが隣接 | 仕様とテストの対応が明確 |
| **リファクタリング時** | テスト側のパス変更を忘れやすい | ソースと一緒に移動される | 仕様・テスト・実装の3箇所を変更 |
| **CIでの選択実行** | ディレクトリ指定で簡単 | glob (`**/*.integration.test.ts`) で可能 | 仕様ファイルからテストコードへの変換が必要 |
| **ファイル数増加時** | テストディレクトリが大きくなる | ソースディレクトリが大きくなる | 管理ファイルが3倍に |
| **適するプロジェクト規模** | 中〜大規模 | 小〜中規模 | BDD採用チーム、非エンジニアが仕様を書く場合 |

### パターンA: トップレベル分離型

```
project/
├── src/
│   ├── auth/
│   ├── user/
│   └── order/
├── tests/
│   ├── unit/
│   │   ├── auth/
│   │   └── user/
│   ├── integration/
│   │   ├── auth-user.test.ts      ← モジュール間の結合
│   │   ├── auth-db.test.ts        ← 外部依存との結合
│   │   └── order-payment.test.ts  ← サービス間の結合
│   └── e2e/
│       └── checkout-flow.test.ts
```

**採用している有名プロジェクト・フレームワーク:**
- **NestJS**: `test/` ディレクトリにe2eテストを配置（公式CLIがデフォルトで生成）。ユニットテストは `.spec.ts` でソース横、e2e/ITは `test/*.e2e-spec.ts`
- **pytest (Python)**: `tests/unit/` と `tests/integration/` を分離し、各ディレクトリに `conftest.py` を置く。`pytest tests/integration/` で選択実行が可能
- **Go (golang-standards/project-layout)**: `/test` ディレクトリにITとシステムテストを配置。ユニットテストは `*_test.go` でソース横。ビルドタグで分離
- **Java (Maven)**: `src/test/java/` 配下にユニットテストとITを配置。Maven Failsafe プラグインが `*IT.java` を自動検出

**メリット:**
- テスト種別ごとの実行が容易（`pytest tests/integration/`, `jest --testPathPattern=tests/integration`）
- テストコードとプロダクションコードの明確な境界
- テスト用のフィクスチャ・ヘルパーを共有しやすい
- 大規模プロジェクトでの見通しが良い

**デメリット:**
- ソースのディレクトリ構造をテスト側にミラーする必要がある
- リファクタリングでファイルを移動すると、テスト側のパス修正を忘れやすい
- テストとソースの距離が遠く、「このモジュールにテストがあるか」が見えにくい

**出典:**
- [pytest - Good Integration Practices](https://docs.pytest.org/en/stable/explanation/goodpractices.html)
- [golang-standards/project-layout - Test Directory](https://github.com/golang-standards/project-layout/blob/master/test/README.md)
- [NestJS - Unit and E2E testing](https://dev.to/grocstock/nestjs-unit-and-e2e-testing-7pb)
- [Ben Johnson - Structuring Tests in Go](https://medium.com/@benbjohnson/structuring-tests-in-go-46ddee7a25c)

### パターンB: コロケーション型

```
src/
├── features/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.test.tsx              ← UT（コロケーション）
│   │   ├── AuthFlow.integration.test.tsx   ← IT（コロケーション）
│   │   └── useAuth.ts
│   └── order/
│       ├── OrderForm.tsx
│       ├── OrderForm.test.tsx
│       ├── CheckoutFlow.integration.test.tsx
│       └── useOrder.ts
```

**採用している有名プロジェクト・フレームワーク:**
- **React / Kent C. Dodds**: 「Place code as close to where it's relevant as possible」の原則。テストもソースの隣に置く
- **Feature-Sliced Design (FSD)**: 「tests and stories colocated beside the file they test」が公式推奨
- **Rust**: ユニットテストは同一ファイル内の `#[cfg(test)]` モジュール（究極のコロケーション）。ITは `tests/` ディレクトリに分離
- **Airbnb JavaScript**: [Issue #1485](https://github.com/airbnb/javascript/issues/1485) でコロケーションの議論。`__tests__/` ディレクトリをソース横に配置するパターンを採用

**メリット:**
- 「このモジュールにテストがあるか」が一目でわかる
- リファクタリング時にソースとテストが一緒に移動される
- 新しいメンバーがモジュールを理解する際にテストを参考にできる
- テストがない箇所を発見しやすい

**デメリット:**
- ソースディレクトリにテストファイルが混在し、ファイル数が増える
- ITはモジュール横断のため、どのモジュールのディレクトリに置くか迷う
- ビルドツールの設定でテストファイルを除外する必要がある
- 大規模プロジェクトではディレクトリが肥大化

**コロケーションの限界（ITの場合）:**
Kent C. Doddsはユニットテストのコロケーションを強く推奨しているが、ITは複数モジュールをまたぐため、「どのモジュールに置くか」が自明でない。実用的な解決策:
- **主要モジュール側に置く**: AuthとUserの結合テストなら、主導権を持つAuth側に配置
- **ハイブリッド型**: UTはコロケーション、ITはトップレベル分離型の組み合わせ

**出典:**
- [Kent C. Dodds - Colocation](https://kentcdodds.com/blog/colocation)
- [Feature-Sliced Design - Integration aspects](https://feature-sliced.design/docs/about/promote/integration)
- [Mario Dias - Colocation of Tests: A Cross-Language Perspective](https://itsmariodias.medium.com/colocation-of-tests-a-cross-language-perspective-982e75c872d8)
- [Airbnb JavaScript - Colocation of tests](https://github.com/airbnb/javascript/issues/1485)

### パターンC: 仕様ディレクトリ型

```
project/
├── specs/               ← テストケース定義（Markdown）
│   ├── auth/
│   │   ├── login.md     ← Given/When/Then形式のシナリオ
│   │   └── signup.md
│   └── order/
│       └── checkout.md
├── features/            ← Gherkin .feature ファイル
│   ├── auth/
│   │   └── login.feature
│   └── order/
│       └── checkout.feature
├── step_definitions/    ← テストコード（ステップ定義）
│   ├── auth_steps.ts
│   └── order_steps.ts
├── src/
│   └── ...
```

**採用している有名プロジェクト・フレームワーク:**
- **Cucumber / Gherkin (BDD)**: `.feature` ファイルに自然言語で仕様を記述し、`step_definitions/` にコードを配置。Maven標準では `src/test/resources/features/`
- **Testspace**: `specs/` フォルダにMarkdownでテスト仕様を記述。`.testspace.yml` で設定
- **Serenity BDD**: Cucumber + Screenplay パターンで仕様とコードを分離

**メリット:**
- 仕様とテストコードが明確に分離され、非エンジニアも仕様を読める
- 仕様変更 → テスト変更の追跡が容易
- 仕様がリビングドキュメント（常に最新の振る舞いを反映）として機能

**デメリット:**
- 仕様ファイル、ステップ定義、テストコードの3箇所を管理する必要がある
- ステップ定義の重複・命名管理が煩雑になりがち
- 学習コストが高い（Gherkin構文、BDDのワークフロー）
- 小規模プロジェクトではオーバーヘッドが大きい

**出典:**
- [Cucumber - Step Organization](https://cucumber.io/docs/gherkin/step-organization/)
- [Testspace - Specification](https://help.testspace.com/manual/implementation-spec)
- [Serenity BDD - Getting Started with Cucumber](https://serenity-bdd.github.io/docs/tutorials/cucumber-screenplay)

---

## 調査2: テストケース定義とテストコードの分離

### テストケース定義を別ファイルで管理している事例

| ツール/アプローチ | 定義形式 | テストコードとの関係 | 採用規模 |
|----------------|---------|-------------------|---------|
| **Cucumber/Gherkin** | `.feature` (自然言語) | Step Definitionsが橋渡し | 広く採用（エンタープライズBDD） |
| **Testspace** | `.md` (Markdown) | リポジトリ内 `specs/` に配置、テスト結果と連携 | 中規模（SaaS型テスト管理） |
| **Testomat.io** | Markdown エディタ | テスト管理SaaSとコードを同期 | テスト管理SaaSユーザー |
| **NVIDIA HEPH** | PDF/RST/HTML（要件仕様書） | LLMがテスト仕様とコードを自動生成 | NVIDIA社内（DriveOS） |
| **OpenAPI → テスト** | OpenAPI YAML/JSON | メタモデル変換でテストスイート生成 | API中心のプロジェクト |

### テストコードだけで十分か？

**テストコードだけで十分なケース:**
- チームが少人数で技術者のみ
- テストコードが十分に読みやすい（`describe`/`it` が仕様の役割を果たす）
- 変更頻度が高く、仕様書メンテナンスのコストが見合わない

**テストケース定義を分けるべきケース:**
- 非エンジニア（PM、QA、ビジネス側）がテストケースをレビューする必要がある
- 規制やコンプライアンスでテスト仕様書が必要
- 複数チーム/言語でテストケースを共有する（仕様は共通、実装は言語別）
- AIエージェントに仕様からテストを生成させるワークフロー

### 仕様書（spec）からテストコードを直接生成するアプローチ

| アプローチ | 仕組み | 事例 |
|-----------|-------|------|
| **BDD (Cucumber)** | `.feature` → Step Definitions → テスト実行 | Cucumberエコシステム全体 |
| **NVIDIA HEPH** | 要件仕様書 → LLMエージェント → テスト仕様 + テストコード | NVIDIA DriveOS |
| **SAGE** | 仕様書 → LLMで文法抽出 → テストケース自動生成 | 学術（IEEE） |
| **REDAST** | 要件定義書 → テスト成果物自動生成 | 学術 |
| **OpenAPI変換** | OpenAPI定義 → テストスイートメタモデルへ変換 | API テスト自動化 |
| **AI + spec.md** | spec.md の AC → LLM → describe/it構造 → テストコード | Claude Code等のAI開発ワークフロー |

**実用的な知見:**
NVIDIAのHEPHフレームワークは、仕様書からテストコードへの自動変換パイプラインの最も進んだ事例。SWADs（ソフトウェアアーキテクチャ文書）やICDs（インターフェース制御文書）を入力とし、テスト仕様とテスト実装の両方を出力する。テストカバレッジデータをフィードバックループで再度モデルに投入し、テスト品質を向上させる。

**出典:**
- [NVIDIA - Building AI Agents to Automate Software Test Case Creation](https://developer.nvidia.com/blog/building-ai-agents-to-automate-software-test-case-creation/)
- [HEPH: NVIDIA's AI Framework Revolutionizing Software Test Automation](https://talent500.com/blog/nvidia-heph-ai-software-testing-automation/)
- [Testspace - Specification](https://help.testspace.com/manual/implementation-spec)
- [Markdown for Test Cases in Modern Teams](https://dev.to/anil_kumar_f3d8beb7650bf1/markdown-for-test-cases-in-modern-teams-1m71)

---

## 調査3: feature単位でITを管理するパターン

### feature単位でテストを整理しているプロジェクト・フレームワーク

| プロジェクト/FW | テスト整理方法 |
|---------------|--------------|
| **NestJS** | モジュール単位（auth, user, order）で `.spec.ts`（UT）と `.e2e-spec.ts`（IT/E2E）を整理 |
| **Feature-Sliced Design** | レイヤー（features, entities, shared）× スライス（auth, order）でテストをコロケーション |
| **Home Assistant** | `tests/components/<integration_name>/` にIT用テストファイルを配置 |
| **Nx (Nrwl)** | モノレポ内のプロジェクト/ライブラリ単位でテストを管理。`project.json` でテストコマンドを定義 |
| **Turborepo** | パッケージ単位でテスト。`packages/<name>/tests/` で独立して実行可能 |
| **Go (標準)** | パッケージ = feature単位。パッケージ内 `*_test.go` + `testdata/` |

### モノレポでのテスト配置

**Nx/Turborepo 型モノレポの構造:**

```
monorepo/
├── packages/
│   ├── auth/
│   │   ├── src/
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   └── package.json
│   ├── user/
│   │   ├── src/
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   └── package.json
│   └── shared/
├── apps/
│   ├── web/
│   │   └── tests/
│   │       ├── integration/   ← アプリレベルのIT
│   │       └── e2e/
│   └── api/
└── tests/
    └── cross-package/         ← パッケージ横断のIT
```

**モノレポITのポイント:**
- パッケージ内のITはそのパッケージの `tests/integration/` に配置
- パッケージ横断のITはルートの `tests/cross-package/` に配置
- CI/CDではAffected（変更影響範囲）のテストのみ実行して高速化
- 「変更したサービスとその依存先のUT、IT、コントラクトテストだけ実行」が効率的

**出典:**
- [Feature-Sliced Design - Monorepo Architecture](https://feature-sliced.design/blog/frontend-monorepo-explained)
- [Turborepo Discussion - How to place tests in a monorepo](https://github.com/vercel/turborepo/discussions/2320)
- [Home Assistant - Integration tests file structure](https://developers.home-assistant.io/docs/creating_integration_tests_file_structure/)
- [Nx - E2E tests colocation](https://github.com/nrwl/nx/issues/4013)

---

## 調査4: AIエージェントがITを生成する場合の配置

### AI/LLMがテストを生成するときの配置パターン

| アプローチ | 出力先 | 理由 |
|-----------|-------|------|
| **既存ディレクトリに追従** | `tests/integration/<feature>/` | プロジェクトの既存規約に合わせる。最も安全で保守的 |
| **spec横に生成** | `specs/<feature>/*.test.ts` | spec → テストの対応が明確。NVIDIA HEPHのアプローチに近い |
| **コロケーション** | `src/features/<feature>/*.integration.test.ts` | コードとの近さを重視。Kent C. Dodds流 |
| **一時ディレクトリ → 手動配置** | `generated/tests/` → 人がレビューして移動 | 生成品質が不安定な場合のセーフティネット |

### spec → テストコード直接生成の事例

#### NVIDIA HEPH のパイプライン

```
[入力]                    [処理]                     [出力]
要件仕様書 (SWAD/ICD) → データ準備（インデックス化） → テスト仕様書
テスト例                → LLMエージェント群          → テストコード
                       → カバレッジフィードバック    → 改善されたテスト
```

- 入力: PDF, RST, HTML の要件仕様書 + 既存テスト例
- 処理: 各ステップに専用LLMエージェント（仕様抽出、トレーサビリティ、コード生成）
- 出力: テスト仕様書（何をテストするかの定義）+ テストコード実装
- 試用結果: チームが10週間分の開発時間を削減

#### AIエージェント開発での推奨フロー

```
1. spec.md を作成（人間 or /spec スキル）
   ├── 受け入れ条件（AC）を明記
   └── 各ACにテスト可能な条件を含める

2. spec.md からテストケース一覧を生成（AIエージェント）
   ├── describe/it 構造のみ（実装なし）
   └── 出力先: tests/integration/<feature>/

3. テストケースにテストコードを実装（AIエージェント）
   ├── specのACを根拠に、実装コードは参照しない
   └── Red状態（失敗する）であることを確認

4. 実装コード作成（AIエージェント or 人間）
   └── テストがGreenになることを確認
```

### AIエージェント環境での推奨配置

**推奨: トップレベル分離型 + spec参照**

```
project/
├── spec.md                      ← 仕様（AIの入力源）
├── src/
│   └── features/
│       ├── auth/
│       └── order/
├── tests/
│   ├── integration/
│   │   ├── auth/
│   │   │   ├── login-flow.test.ts       ← specのACから生成
│   │   │   └── token-refresh.test.ts
│   │   └── order/
│   │       └── checkout-flow.test.ts
│   └── unit/
│       ├── auth/
│       └── order/
```

**理由:**
1. **AIがパスを明確に指定できる**: 「`tests/integration/auth/` にテストを書け」と指示可能
2. **specとの対応が追跡しやすい**: specのAC → テストケース → テストコードのトレーサビリティ
3. **CIで選択実行が容易**: `jest --testPathPattern=tests/integration` で一発
4. **カンニング防止**: テストディレクトリが実装ディレクトリから分離されている方が、AIに「specだけ見てテストを書け」と指示しやすい

**出典:**
- [NVIDIA - Building AI Agents to Automate Software Test Case Creation](https://developer.nvidia.com/blog/building-ai-agents-to-automate-software-test-case-creation/)
- [HEPH: NVIDIA's AI Framework Revolutionizing Software Test Automation](https://talent500.com/blog/nvidia-heph-ai-software-testing-automation/)
- [FrugalTesting - LLM-Powered Test Case Generation](https://www.frugaltesting.com/blog/llm-powered-test-case-generation-enhancing-coverage-and-efficiency)

---

## 総合推奨

### 意思決定フローチャート

```
AIエージェントがテストを生成する？
├── Yes → トップレベル分離型（パターンA）
│         理由: パス指定が明確、spec参照がしやすい、カンニング防止
│
└── No → チーム構成は？
         ├── 技術者のみ → ハイブリッド型
         │   UTはコロケーション（パターンB）、ITは分離型（パターンA）
         │
         └── 非エンジニアも参加 → 仕様ディレクトリ型（パターンC）
             BDD/Gherkin or Markdown仕様 + テストコード
```

### テストケース定義の分離について

```
テストケース定義を分けるべきか？
├── 非エンジニアがテストケースをレビューする → 分ける（Markdown or Gherkin）
├── 規制/コンプライアンス要件がある → 分ける
├── AIにspecからテストを生成させるワークフロー → 分ける（specのACがテストケース定義を兼ねる）
└── 上記に該当しない → テストコード内の describe/it で十分
```

### パターン別推奨表

| 状況 | 推奨パターン | 理由 |
|------|------------|------|
| バックエンドAPI開発 | A（トップレベル分離型） | CIでの選択実行、テスト種別の明確な分離 |
| フロントエンドReact/Next.js | B（UT: コロケーション）+ A（IT: 分離） | UTは近くに、ITは複数コンポーネント横断なので分離 |
| モノレポ | A（パッケージ内に `tests/`）+ ルート `tests/cross-package/` | パッケージ自律性 + 横断テスト |
| AIエージェント開発フロー | A（トップレベル分離型） | パス指定の明確さ、spec参照、カンニング防止 |
| BDD/非エンジニア参加 | C（仕様ディレクトリ型） | 仕様の可読性、リビングドキュメント |
| 小規模プロジェクト | B（コロケーション） | シンプル、発見しやすい |

---

## 参考文献一覧

### テスト配置・構造
- [Kent C. Dodds - Colocation](https://kentcdodds.com/blog/colocation)
- [pytest - Good Integration Practices](https://docs.pytest.org/en/stable/explanation/goodpractices.html)
- [golang-standards/project-layout - Test Directory](https://github.com/golang-standards/project-layout/blob/master/test/README.md)
- [Corey Cleary - Where to put your tests in a Node project structure](https://www.coreycleary.me/where-to-put-your-tests-in-a-node-project-structure)
- [Mario Dias - Colocation of Tests: A Cross-Language Perspective](https://itsmariodias.medium.com/colocation-of-tests-a-cross-language-perspective-982e75c872d8)
- [Home Assistant - Integration tests file structure](https://developers.home-assistant.io/docs/creating_integration_tests_file_structure/)

### テスト戦略・理論
- [Martin Fowler - The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Martin Fowler - Testing Strategies in a Microservice Architecture](https://martinfowler.com/articles/microservice-testing/)
- [Thoughtworks - Guidelines for Structuring Automated Tests](https://www.thoughtworks.com/insights/blog/guidelines-structuring-automated-tests)
- [Software Engineering at Google - Testing Overview (Ch.11)](https://abseil.io/resources/swe-book/html/ch11.html)
- [Software Engineering at Google - Larger Testing (Ch.14)](https://abseil.io/resources/swe-book/html/ch14.html)
- [Kent C. Dodds - Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)

### BDD・仕様駆動テスト
- [Cucumber - Step Organization](https://cucumber.io/docs/gherkin/step-organization/)
- [Testspace - Specification](https://help.testspace.com/manual/implementation-spec)
- [Markdown for Test Cases in Modern Teams](https://dev.to/anil_kumar_f3d8beb7650bf1/markdown-for-test-cases-in-modern-teams-1m71)
- [Serenity BDD - Getting Started with Cucumber](https://serenity-bdd.github.io/docs/tutorials/cucumber-screenplay)

### AI・LLMによるテスト生成
- [NVIDIA - Building AI Agents to Automate Software Test Case Creation](https://developer.nvidia.com/blog/building-ai-agents-to-automate-software-test-case-creation/)
- [HEPH: NVIDIA's AI Framework Revolutionizing Software Test Automation](https://talent500.com/blog/nvidia-heph-ai-software-testing-automation/)
- [FrugalTesting - LLM-Powered Test Case Generation](https://www.frugaltesting.com/blog/llm-powered-test-case-generation-enhancing-coverage-and-efficiency)
- [FrugalTesting - Mastering Test Automation with LLMs](https://www.frugaltesting.com/blog/mastering-test-automation-with-llms-a-step-by-step-approach)

### モノレポ・Feature Architecture
- [Feature-Sliced Design - Monorepo Architecture](https://feature-sliced.design/blog/frontend-monorepo-explained)
- [Turborepo Discussion - How to place tests in a monorepo](https://github.com/vercel/turborepo/discussions/2320)
- [Nx - E2E tests colocation](https://github.com/nrwl/nx/issues/4013)

### フレームワーク固有
- [NestJS - Unit and E2E testing](https://dev.to/grocstock/nestjs-unit-and-e2e-testing-7pb)
- [testing-nestjs - Comprehensive NestJS testing examples](https://github.com/jmcdo29/testing-nestjs)
- [Ben Johnson - Structuring Tests in Go](https://medium.com/@benbjohnson/structuring-tests-in-go-46ddee7a25c)
- [5 Best Practices For Organizing Tests - Pytest with Eric](https://pytest-with-eric.com/pytest-best-practices/pytest-organize-tests/)
