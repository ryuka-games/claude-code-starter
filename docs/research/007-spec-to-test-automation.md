# Research Report: 仕様書（spec）からテストコードを自動生成するアプローチ

## 1. Executive Summary

spec→テスト自動生成は2025-2026年で実用段階に入った。**Tessl（spec-as-source）**、**Kiro（AWS）**、**GitHub Spec Kit**の3ツールが先頭を走り、Martin Fowlerが「SDDレベルの自動化を目指す唯一のツール」としてTesslを評価している。Given/When/Then形式はAIとの親和性が高く、テストコードへの機械的変換が可能。トレーサビリティは`// Trace(SPEC:REQ-XXX)`コメントパターンが業界標準。テストケース数の最適化にはペアワイズテスト（バグの70-80%は2パラメータの組み合わせ）が有効。

## 2. Findings

### 2.1 spec→テスト自動生成ツール

| ツール | アプローチ | 特徴 | Confidence |
|---|---|---|:---:|
| **Tessl** | spec-as-source。`[@test]`でspec↔テスト紐付け | Spec Registryに10,000+のpre-built specs。Martin Fowler評価 | verified |
| **Kiro (AWS)** | 自然言語→構造化spec→テスト→コード | EARS形式の要件からプロパティベーステスト。100回ランダム入力 | verified |
| **GitHub Spec Kit** | spec→plan→tasks 3フェーズ | Claude Code, Copilot, Gemini CLI対応。TDD統合 | verified |
| **Gauge (ThoughtWorks)** | Markdown自由形式でテスト仕様記述 | Given/When/Then制約なし。多言語対応。並列実行 | verified |
| **Concordion** | HTML/Markdown仕様に計装コマンド埋込 | 実行結果がLiving Documentation。JUnit/NUnit統合 | verified |
| **Pact** | Consumer-Driven Contract Testing | コンシューマテスト実行時にコントラクト自動生成 | verified |

### 2.2 Markdown仕様書→テスト生成のAI活用事例

| 事例 | 内容 | Confidence |
|---|---|:---:|
| **ACL 2025論文** | システムレベル要件からテスト仕様をLLMで多段階生成。マルチエージェント | verified |
| **富士通 TestSpecGen** | 設計書+テスト計画書→テスト項目生成。MLSE夏合宿2025で優秀発表賞 | verified |
| **LIFULL** | 仕様書→テスト観点抽出→テストケース生成。使うほど賢くなる仕組み | verified |
| **TIS/Fintan** | 生成AIで仕様書→テスト仕様書変換 | verified |

GitHubがMarkdownを「AIのプログラミング言語」として位置づけている。spec→AI Codingエージェントの流れが業界トレンド。

### 2.3 Given/When/Then → TypeScriptテストの変換パターン

| パターン | 説明 | 成熟度 |
|---|---|---|
| **Cucumber + Playwright + TS** | Gherkin→Step Definitions→Playwright実行。最も成熟 | 安定 |
| **Gauge + TypeScript** | Markdown自由形式。Given/When/Then制約なし | 安定 |
| **LLMによる直接変換** | Markdown spec→Vitest/Jestテストコード直接生成 | 実用段階 |
| **Concordionスタイル** | 仕様書内にインストルメンテーション埋込→フィクスチャ経由実行 | 安定 |

AI文脈では**パターン3（LLM直接変換）が最も効率的**。Cucumber等のBDDフレームワーク層を挟まず、spec→テストコードを直接生成。

### 2.4 結合ポイントのドキュメント化プラクティス

| アプローチ | テスト設計への活用 | Confidence |
|---|---|:---:|
| **OpenAPI spec** | リクエスト/レスポンスのスキーマ検証テスト自動生成 | verified |
| **Pact contract** | コンシューマ期待値 vs プロバイダ実装の整合性テスト | verified |
| **シーケンス図** | 正常系/異常系のフロー網羅テスト | verified |
| **結合ポイントマトリクス** | テスト優先度付け（結合数の多いサービスを重点的に） | verified |
| **チェーン分割** | サービス間を小さなチェーンごとに検証 | verified |

### 2.5 specとテストのトレーサビリティ

| 方法 | 特徴 | 推奨度 |
|---|---|---|
| **コード内コメント** `// Trace(SPEC:REQ-XXX)` | 侵襲的だが直接的。YAKINDU等でサポート | 高 |
| **テストメタデータ/タグ** `describe('REQ-001: ...')` | テスト名に要件IDを含める | 高 |
| **Tessl `[@test]`** | specファイル側からテストファイルを紐付け | 中（ツール依存） |
| **要件トレーサビリティマトリクス（RTM）** | 外部ファイルで対応表を管理 | 中（管理コスト） |

### 2.6 テストケース数の最適化

| 知見 | 内容 | Confidence |
|---|---|:---:|
| **テストピラミッド比率** | UT 70-80% / IT 15-20% / E2E 5-10% | verified |
| **ペアワイズテスト** | バグの70-80%は2パラメータの組み合わせで発生。テストスイートを85-95%削減可能 | verified |
| **Martin Fowler警告** | 「全部書いてから実装」は危険。spec反復改善が必要 | verified |
| **バグ発見コスト差** | UT=$1 / IT=$10 / E2E=$100 / 本番=$1,000+ | verified |

## 3. Recommendations

| # | 推奨事項 | 理由 |
|---|---|---|
| 1 | LLM直接変換（spec→Vitestテスト）が最も効率的 | BDDフレームワーク層のオーバーヘッドなし |
| 2 | テストコード内に`// Source: specs/features/<feature>/spec.md`でトレーサビリティ確保 | IBM「70%破棄」は意図が見えないAIテストの問題 |
| 3 | 結合ポイントはplan.mdにマトリクス形式で記述 | テスト優先度付けの根拠になる |
| 4 | テストケース数は「最長正のパス+異常系」で1-3件 | ペアワイズの知見+Palantir「少数精鋭」 |
| 5 | specは反復的に改善する（living document） | Martin Fowlerの警告。write-onceは危険 |

## 4. Sources

- [Martin Fowler - SDD 3 Tools (Kiro, spec-kit, Tessl)](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [Kiro Docs - Specs](https://kiro.dev/docs/specs/)
- [GitHub spec-kit](https://github.com/github/spec-kit)
- [GitHub Blog - Spec-driven development with Markdown](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-using-markdown-as-a-programming-language-when-building-with-ai/)
- [Tessl Docs - Concepts](https://docs.tessl.io/introduction-to-tessl/concepts)
- [Gauge公式](https://gauge.org/)
- [Concordion公式](https://concordion.org/index.html)
- [Pact Docs](https://docs.pact.io/)
- [Martin Fowler - Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html)
- [Martin Fowler - Given When Then](https://martinfowler.com/bliki/GivenWhenThen.html)
- [ACL 2025 - Multi-Step Generation of Test Specifications](https://aclanthology.org/2025.acl-industry.11.pdf)
- [富士通研究所 - テスト仕様書生成技術](https://blog.fltech.dev/entry/2025/10/29/testspecgen-ja)
- [LIFULL - テスト観点抽出AIエージェント](https://www.lifull.blog/entry/2025/12/20/120000)
- [Fintan - テスト仕様書作成の自動化](https://fintan.jp/page/15459/)
- [TestRail - Pairwise Testing](https://www.testrail.com/blog/pairwise-testing/)
- [BrowserStack - Test Case Reduction](https://www.browserstack.com/guide/test-case-reduction-and-techniques)
- [QA Madness - Integration Testing Best Practices](https://www.qamadness.com/best-practices-for-integration-testing/)
- [TestRail - Requirements Traceability Matrix](https://www.testrail.com/blog/requirements-traceability-matrix/)
- [itemis - Traceability](https://blogs.itemis.com/en/traceability-a-generic-way-to-link-requirements-and-test-cases)
- [Augment Code - Spec-Driven Development](https://www.augmentcode.com/guides/what-is-spec-driven-development)
- [Addy Osmani - How to write a good spec for AI agents](https://addyosmani.com/blog/good-spec/)
