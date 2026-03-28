# Research Report: 結合テスト（IT）最新ベストプラクティス（2024-2025）

## 1. Executive Summary

2024-2025年のフロントエンドITは**Vitest + React Testing Library + MSWが黄金スタック**として定着。テスト戦略モデルはTesting Pyramid/Trophy/Diamond/Honeycombのいずれも「ITを中心に据える」方向で収束している。モック境界はVladimir Khorikovの「Managed=実物、Unmanaged=モック」が業界標準化。ファイル配置は**UT=コロケーション、IT=トップレベル分離のハイブリッド型**がコンセンサス。Palantirの100万行TypeScript経験から「ITは少数精鋭、50%超の手動テストカバレッジは過剰投資」の教訓が広まっている。

## 2. Findings

### 2.1 フロントエンドITの主流ツールスタック

| ツール | 役割 | 変遷 | Confidence |
|---|---|---|:---:|
| **Vitest + RTL** | コンポーネント/結合テスト | Jest→Vitest移行加速。ESMネイティブ、並列実行 | verified |
| **MSW v2** | APIモック | ネットワークレベル傍受。UT/IT/E2E/Storybookで同一定義再利用 | verified |
| **Playwright** | E2E+実験的コンポーネントテスト | CT依然experimental。React 18のみ対応 | verified |
| **Storybook 8.4 + Test Addon** | コンポーネントテスト+ビジュアルテスト | Vitest統合、ブラウザ内実行、タイムトラベルデバッガー | verified |

### 2.2 テスト戦略モデルの比較

| モデル | 提唱者 | ITの位置づけ | 適するプロジェクト | Confidence |
|---|---|---|---|:---:|
| **Testing Pyramid** | Mike Cohn | 少数〜中程度。UTが最多 | バックエンド、大規模 | verified |
| **Testing Trophy** | Kent C. Dodds | **最多層**。「Mostly integration」 | フロントエンド（React等） | verified |
| **Testing Diamond** | 複数 | **中心**。UT/E2Eは最小限 | マイクロサービス | verified |
| **Testing Honeycomb** | Spotify等 | **中心**。7次元で多面的評価 | マイクロサービス | verified |
| **Testing Crab** | web.dev | ビジュアルテスト重視 | UIヘビーなWebアプリ | verified |

どのモデルも「ITを増やす」方向で収束している。

### 2.3 1 featureあたりのIT件数

| 指針 | 内容 | Confidence |
|---|---|:---:|
| **Vladimir Khorikov** | 最長の正のパスを1つ選び、全out-of-process依存を通るテスト。足りなければ追加。理想は**1-3件** | verified |
| **Palantir** | 複雑なロジックにUT、キーパートにIT（少数）、主要フロー確認にE2E（数件）。50%超カバレッジは過剰 | verified |
| **カバレッジ目安** | UT 90% / IT 80% / ST 70%。ただし数値より「クリティカルパス網羅」が重要 | verified |

### 2.4 モック境界の指針（Khorikov基準）

| 依存の種類 | 定義 | モック | 例 | Confidence |
|---|---|---|---|:---:|
| **Managed dependency** | 自アプリからのみアクセス。外部から観測不可 | **しない（実物）** | アプリケーションDB | verified |
| **Unmanaged dependency** | 外部から観測可能 | **する** | SMTP、外部API、決済API | verified |

**フロントエンド固有:**

| 境界 | モック | 推奨 | Confidence |
|---|---|---|:---:|
| **HTTP API** | はい | MSW v2 | verified |
| **ブラウザAPI（localStorage等）** | ITでは実物 | jsdom/happy-dom | verified |
| **状態管理（Redux/Zustand）** | しない | 実際のstore | verified |
| **子コンポーネント** | UTではモック、ITでは実物 | — | verified |
| **Router** | MemoryRouterを使う | react-router | verified |

### 2.5 テストファイル配置（2024-2025コンセンサス）

| テスト種別 | 推奨配置 | 根拠 | Confidence |
|---|---|---|:---:|
| **UT** | コロケーション（ソース横`.test.ts`） | Kent C. Dodds「関連ファイルは近くに」 | verified |
| **IT** | トップレベル分離型（`tests/integration/`） | 複数モジュール横断。CIでの選択実行容易 | verified |
| **E2E** | プロジェクトルート（`e2e/`） | プロジェクトを超える範囲をカバー | verified |

命名規則で区別: `*.test.ts`=UT、`*.integration.test.ts`=IT

### 2.6 AI + BDDの融合（新潮流）

| 動き | 内容 | Confidence |
|---|---|:---:|
| **AIによるGherkin自動生成** | ユーザーストーリー→Gherkinシナリオ自動生成。BDDが「出力フォーマット」に | verified |
| **Spec-Driven Development** | specが単なるドキュメントではなく検証ゲートとして機能する設計 | verified |
| **describe/itの仕様的命名** | Cucumber不要で`it('正しい資格情報でログインするとダッシュボードが表示される')`で十分なケースも | verified |

### 2.7 Palantirの教訓（100万行超TypeScript）

| 教訓 | 内容 | Confidence |
|---|---|:---:|
| ロジックはUIから抽出 | コンポーネントテストは脆い（DOM変更で壊れる）。ユーティリティ関数に抽出してテスト | verified |
| 境界選びが最重要 | 「小さすぎず複雑さをカバーでき、モックする面が安定したAPI線に沿っている」 | verified |
| 50%超は過剰投資 | フロントエンドの手動テストカバレッジ50%超は速度を落とす | verified |

## 3. Recommendations

| # | 推奨事項 | 理由 |
|---|---|---|
| 1 | Vitest + RTL + MSW v2をIT標準スタックとする | 業界コンセンサス。ESMネイティブ、モック統一 |
| 2 | モック境界はKhorikov基準: HTTP API=MSWモック、状態管理=実物 | フロントエンドIT品質と保守性のバランス |
| 3 | ITは少数精鋭（1-3件/feature）。クリティカルパス優先 | Palantir+Khorikovの知見 |
| 4 | UT=コロケーション、IT=`tests/integration/`、E2E=`e2e/` | 業界コンセンサスのハイブリッド型 |
| 5 | ロジックはUIコンポーネントから抽出してテスト | DOM依存テストは脆い。API面を安定させる |

## 4. Sources

- [Vladimir Khorikov - When to Mock](https://enterprisecraftsmanship.com/posts/when-to-mock/)
- [Vladimir Khorikov - Unmanaged Dependencies](https://khorikov.org/posts/2021-11-29-unmanaged-dependencies-explained/)
- [Palantir Frontend Testing Lessons](https://www.meticulous.ai/blog/lessons-from-a-decade)
- [Kent C. Dodds - Write tests](https://kentcdodds.com/blog/write-tests)
- [Kent C. Dodds - Colocation](https://kentcdodds.com/blog/colocation)
- [web.dev - Testing Strategies](https://web.dev/articles/ta-strategies)
- [GitLab Frontend Testing Standards](https://docs.gitlab.com/development/testing_guide/frontend_testing/)
- [MSW - Mock Service Worker](https://mswjs.io/)
- [Redux - Writing Tests](https://redux.js.org/usage/writing-tests)
- [Storybook 8.4 Component Testing](https://alternativeto.net/news/2024/11/storybook-8-4-launches-with-component-testing-svelte-5-support-improved-tagging-and-more/)
- [Storybook Test Addon](https://storybook.js.org/docs/8/writing-tests/test-addon)
- [Playwright Component Testing](https://playwright.dev/docs/test-components)
- [Next.js Testing Guide - Vitest](https://nextjs.org/docs/app/guides/testing/vitest)
- [Augment Code - Spec-Driven Development](https://www.augmentcode.com/guides/what-is-spec-driven-development)
- [Cucumber.io - Gherkin](https://cucumber.io/docs/gherkin/)
- [Martin Fowler - Given When Then](https://martinfowler.com/bliki/GivenWhenThen.html)
