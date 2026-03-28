# Research Report: spec-based E2E — BDD/Given/When/ThenからE2Eシナリオを生成する手法

## 1. Executive Summary

**結論**: BDD/Gherkinフレームワーク（Cucumber, SpecFlow）は衰退期にあり、E2E生成の中間層としては不要。**spec（Given/When/Then） → LLM直接変換 → Playwrightテストコード**が2025-2026年の最適解。/test-itの設計原則（実装非参照、specカバレッジ基準、Khorikov最長正のパス）はSTにもそのまま適用可能だが、E2E特有の課題（ブラウザ状態、セレクタ脆弱性、実行速度）への対処が追加で必要。

**推奨アクション**: /test-st スキルを /test-it と同じアーキテクチャで設計し、Playwright MCP + Playwright Agents（v1.56）をテスト実行基盤にする。Gherkin層は挟まない。

**根拠**: 産業事例（AutoUAT/Test Flow）でuser story → Gherkin → Cypressの成功率92%。ただしGherkin層は中間成果物であり、LLMがspec → テストコードを直接生成できる今、ステップ定義のメンテナンスコスト（開発工数の3倍という報告あり）を払う理由がない。

## 2. BDD/Gherkinの現状評価（2024-2025）

### 2.1 ツールの生死

| ツール | ステータス | 備考 | Confidence |
|---|---|---|:---:|
| **SpecFlow** | EOL（2024末） | Tricentisが開発終了。後継はReqnroll（OSSフォーク、5000+プロジェクト） | verified |
| **Cucumber** | 維持だが停滞 | SmartBearが手放した。コミュニティ主導に | verified |
| **playwright-bdd** | 活発（56K DL/週） | Playwright本体（12.6M DL/週）の0.4%。ニッチ | verified |
| **@cucumber/playwright** | 公式統合パッケージ | Cucumber公式がPlaywright対応を追加 | verified |
| **Reqnroll** | 活発 | SpecFlowのOSSフォーク。.NETエコシステム | verified |

### 2.2 BDDへの批判と課題

| 批判 | 内容 | 出典 | Confidence |
|---|---|---|:---:|
| **ステップ定義のメンテナンスコスト** | 金融企業で開発工数の3倍がGherkinテスト維持に消費され、最終的に放棄 | Zhimin Zhan (AgileWay) | verified |
| **3層の抽象化オーバーヘッド** | Feature → Step Definition → Page Object。RSpec等は2層で済む | AgileWay / Cucumber創設者Aslak Hellesoy自身の警告 | verified |
| **ビジネス側は読まない** | BA/PMがGherkinを書く・読むケースは稀。理想と現実のギャップ | Automation Panda, testRigor | verified |
| **BDDは「死にかけ」か** | Automation Panda (Andy Knight) は「死んではいない」が進化が必要と主張 | Automation Panda (2025/03) | verified |
| **SpecFlow/Cucumber「死亡」宣言** | testRigorが明確に「died」と宣言。AI自然言語テストで代替可能と主張 | testRigor Blog | verified |

**要点**: Gherkinの価値は「人間が読める仕様」だったが、LLMがspecを直接理解できる今、中間翻訳層としてのGherkinの存在意義は薄い。

## 3. Gherkin vs コードベースE2E: トレードオフ

| 観点 | Gherkin (BDD) | コードベース (Playwright直書き) | LLM直接生成 |
|---|---|---|---|
| **可読性（非技術者）** | 高い | 低い | 中（コメント次第） |
| **メンテナンスコスト** | 高い（3層管理） | 中（1層） | 低い（再生成可能） |
| **実行速度** | 遅い（Gherkinパース） | 速い | 速い |
| **セットアップ複雑度** | 高い | 低い | 低い |
| **AI親和性** | 中（Gherkin生成は容易だがstep定義が必要） | 高い | 最高 |
| **Living Documentation** | 強み | なし | spec.md自体がLiving Doc |
| **向いている場面** | BA/PM参加の受入テスト | 開発者主導のE2E | spec駆動のAI開発 |

**判定**: spec.mdがGiven/When/Then形式で書かれている場合、Gherkin層を挟む意味がない。spec.md自体がLiving Documentであり、LLMがそこから直接テストコードを生成できる。

## 4. spec → E2Eテスト自動生成の実例

### 4.1 産業事例

| 事例 | パイプライン | 成功率 | 特徴 | Confidence |
|---|---|---|---|:---:|
| **AutoUAT + Test Flow** (AST 2025) | User Story → Gherkin(GPT-4) → Cypress(TypeScript) | 95%シナリオ受理、92%スクリプト有用 | BMW/自動車産業。コスト平均0.12EUR/テスト | verified |
| **GenIA-E2ETest** (arXiv 2025) | 自然言語 → JSON → Robot Framework | 82%精度、85%再現率 | 3段階プロンプトチェーン。修正率中央値6% | verified |
| **doubleslash (独)** | 要件 → Gherkin(中間形式) → Cucumber/TypeScript | GPT-4o+Claude 3.5で45%初回成功 | Gherkinを中間表現として使用 | verified |
| **Playwright Agents** (v1.56) | ブラウザ探索 → Markdownプラン → .spec.ts | N/A（公式機能） | Planner/Generator/HealerのMCPベース3段階 | verified |

### 4.2 Playwright Agents（v1.56, 2025年10月）

Playwright v1.56で導入された3つのAIエージェント:

| エージェント | 役割 | 入力 | 出力 |
|---|---|---|---|
| **Planner** | アプリ探索、テストプラン作成 | URL + シード指示（カスタムspec可） | Markdownテストプラン |
| **Generator** | プランからテストコード生成 | Markdownプラン + 実アプリDOM | .spec.tsファイル |
| **Healer** | 壊れたテストを自動修復 | 失敗テスト + ページスナップショット | 修正済みテストコード |

**注目点**: Plannerにカスタム仕様（user story等）をシードとして渡せる。つまりspec.mdのGiven/When/Thenをシードにして、Plannerに探索させ、Generatorでコード化する流れが可能。MCP経由でClaude Codeと統合可能。

### 4.3 AutoUAT/Test Flow パイプライン詳細

AST 2025（IEEE）で発表された産業事例。/test-itアプローチとの類似点が多い:

- **仕様ベース**: User StoryからGherkinシナリオを生成（実装コード非参照）
- **2段階分離**: シナリオ生成（AutoUAT）とスクリプト生成（Test Flow）を分離
- **HTML参照**: Test FlowはDOM構造（HTML）のみ参照し、ソースコードは見ない
- **data-test-id活用**: セレクタにdata-test-id属性を使用（安定性向上）

## 5. /test-itアプローチのST（システムテスト/E2E）適用可能性

### 5.1 設計原則の移植性

| /test-itの原則 | ITでの適用 | STへの適用 | 追加考慮事項 |
|---|---|---|---|
| **実装非参照（カンニング防止）** | src/を読まない | src/を読まない。**DOMは参照OK**（AutoUAT方式） | E2EではUI要素特定にDOM/a11yツリー必要 |
| **specカバレッジ基準** | US/ECの全数カバレッジ照合 | 同じ。ただしE2Eは**主要フローに絞る** | E2Eは実行コスト高い。テストピラミッド比率5-10% |
| **Khorikov最長正のパス** | 1テストで全結合ポイント通過 | 1テストで主要ユーザーフロー全体を通過 | E2Eでは「ユーザージャーニー」が最長パスになる |
| **モック境界（Managed/Unmanaged）** | HTTPはMSWモック、storeは実物 | **全てを実物で**（E2Eの本質） | 外部サービスのみモック（決済等） |
| **specと実装の乖離 = バグ** | テスト側を直さず報告 | 同じ原則がそのまま適用 | E2Eで発見されるバグはより深刻 |

### 5.2 ST特有の追加課題

| 課題 | 対策案 | Confidence |
|---|---|:---:|
| **セレクタ脆弱性** | data-testid必須 + Playwright Healer自動修復 | verified |
| **実行速度（IT: ms、ST: 秒〜分）** | 主要フロー厳選（Khorikov原則で3-5シナリオ） | verified |
| **ブラウザ状態管理** | 認証状態のstorageState再利用 | verified |
| **フレイキーテスト** | Playwright auto-wait + retry。Healer agent | verified |
| **環境依存** | Docker化 or Playwright MCP経由でリモート実行 | inferred |

### 5.3 提案: /test-stスキルのアーキテクチャ

```
入力: spec.md (Given/When/Then) + plan.md (結合ポイント)
                    |
        [LLM直接変換 — Gherkin層なし]
                    |
        E2Eテストコード (.e2e.test.ts)
                    |
        Playwright MCP で実行
                    |
        失敗時: Healer agent で自動修復
                    |
        結果レポート (specカバレッジ照合)
```

/test-itとの差分:
- テストランナー: Vitest/Jest → **Playwright Test**
- モック境界: MSW → **実アプリ（外部サービスのみモック）**
- DOM参照: 不要 → **許可（a11yツリー/data-testid）**
- 命名: `*.integration.test.ts` → **`*.e2e.test.ts`**
- 実行: インプロセス → **ブラウザ（Playwright MCP）**

## 6. 批判的レビュー

| 主張 | 反論/リスク |
|---|---|
| 「Gherkin層は不要」 | BA/PMが仕様レビューに参加する組織ではGherkinの可読性に価値あり。ただしspec.mdが同等の可読性を提供できれば不要 |
| 「LLM直接生成で十分」 | 初回成功率45-60%（doubleslash, GenIA-E2ETest）。人間のレビュー・修正は必須 |
| 「/test-itと同じ設計でSTに適用可能」 | ITは数ms、STは数秒〜分。実行コストの桁違いにより、テストケース数の管理がより重要 |
| 「Playwright Agents で解決」 | v1.56は2025年10月リリースで新しい。エコシステムの成熟度に注意 |
| 「AutoUATの92%成功率」 | 単一企業（自動車）の13 user storyが対象。汎用性は未検証 |

## 7. Recommendations

| # | 推奨事項 | 理由 |
|---|---|---|
| 1 | **/test-stスキルを/test-itと同一アーキテクチャで設計** | 設計原則（実装非参照、specカバレッジ、Khorikov）はE2Eにそのまま適用可能 |
| 2 | **Gherkin層は挟まない。spec.md → Playwrightテストの直接生成** | ステップ定義メンテナンスのコスト（3倍報告）を回避。LLMがspecを直接理解可能 |
| 3 | **Playwright MCP + Agents (Planner/Generator/Healer) を実行基盤に** | MCP経由でClaude Codeと統合。Healerで自動修復 |
| 4 | **E2Eテストは主要ユーザージャーニー3-5本に絞る** | テストピラミッドの5-10%。Khorikovの最長正のパスで効率化 |
| 5 | **data-testid属性の規約をspec/planに含める** | E2Eの最大の脆弱性はセレクタ。AutoUAT事例でも有効性確認済み |

## 8. Sources

- [Is BDD Dying? - Automation Panda (2025/03)](https://automationpanda.com/2025/03/06/is-bdd-dying/)
- [Why Gherkin Always Failed with UI Test Automation - AgileWay (Zhimin Zhan)](https://dev.to/zhiminzhan/why-gherkin-cucumber-specflow-always-failed-with-ui-test-automation-29jc)
- [Why Cucumber and SpecFlow Died - testRigor](https://testrigor.com/blog/why-cucumber-and-specflow-died/)
- [Acceptance Test Generation with LLMs: Industrial Case Study (AST 2025)](https://arxiv.org/html/2504.07244v1)
- [GenIA-E2ETest: Generative AI-Based E2E Test Automation (arXiv 2025)](https://arxiv.org/html/2510.01024v1)
- [Playwright Test Agents - 公式ドキュメント](https://playwright.dev/docs/test-agents)
- [Playwright Agents: Planner, Generator, Healer in Action - DEV Community](https://dev.to/playwright/playwright-agents-planner-generator-and-healer-in-action-5ajh)
- [Write automated tests with Claude Code using Playwright Agents - Shipyard](https://shipyard.build/blog/playwright-agents-claude-code/)
- [playwright-bdd - npm](https://www.npmjs.com/package/playwright-bdd)
- [From SpecFlow to Reqnroll - Reqnroll公式](https://reqnroll.net/news/2024/02/from-specflow-to-reqnroll-why-and-how/)
- [E2E test generation using LLMs - doubleslash](https://blog.doubleslash.de/en/developer-blog/e2e-testerzeugung-mittels-llms-im-frontendbereich)
- [Modern E2E Testing with Cucumber, Playwright & Typescript - Medium](https://medium.com/@english87/modern-e2e-testing-with-cucumber-playwright-typescript-7a7ab6cd3d54)
- [Playwright MCP Server - GitHub](https://github.com/executeautomation/mcp-playwright)
- [Khorikov - Unit Testing Principles, Practices, and Patterns - Manning](https://www.manning.com/books/unit-testing)
