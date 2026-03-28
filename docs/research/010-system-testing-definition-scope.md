# Research Report: システムテスト（ST）の定義・範囲・テスト戦略モデルでの位置づけ

## 1. Executive Summary

**結論**: STとE2Eは同義ではない。ISTQBの定義では**STは単一システムの要件検証**、**E2Eは複数システム横断のワークフロー検証**。ただしフロントエンド文脈ではこの区別が曖昧化しており、Testing Trophy/Diamond/Honeycombのいずれも「ST」という層を持たず、E2E層がSTの役割を吸収している。2024-2025年のトレンドはPlaywright + Vitest Browser Modeによるコンポーネントテストの台頭で、**従来のST領域はITの上位層（コンポーネントテスト）とE2Eに分解される方向**。

**推奨アクション**: `/test-it`のIT定義を維持しつつ、ST相当の検証はPlaywright E2Eとして別スキル化を検討する。ISTQBの4層モデルに固執せず、Testing Trophyの3層（Unit/Integration/E2E）をベースにする。

**根拠**: Kent C. Dodds, Martin Fowler, Spotifyいずれも「テスト分類の用語定義より、テストが何を検証するかが重要」と述べている。STという中間層を設けるより、ITとE2Eの役割分担を明確にする方が実践的。

## 2. STの標準的定義（ISTQB / IEEE）

### 2.1 ISTQBの定義と位置づけ

| 項目 | 内容 | Confidence |
|---|---|:---:|
| **定義** | 「統合されたシステムが指定された要件を満たすことを検証するテスト」 | verified |
| **テストレベル** | 4段階の3番目: コンポーネント → 結合 → **システム** → 受入 | verified |
| **テスト対象** | 完全なシステム、サブシステム、DB、インフラ、API | verified |
| **テスト環境** | 本番環境に近い環境が必須（ソフト+ハードの両面） | verified |
| **目的** | リスク低減。個別コンポーネントが正常でも、統合時の問題を検出する | verified |
| **テスト種別** | 機能テスト + 非機能テスト（性能、セキュリティ、互換性等） | verified |

ISTQBのCTFL v4.0シラバスでは、STは「開発プロジェクトまたは製品のスコープで定義された、システム/製品全体の振る舞い」に関わるとされる。

### 2.2 IEEE/ISO標準

| 標準 | STに関する規定 | Confidence |
|---|---|:---:|
| **IEEE 829-2008** | テストドキュメント8段階のうちSTフェーズの文書形式を規定 | verified |
| **ISO/IEC/IEEE 29119** | テスト全般の語彙・プロセス・文書・技法を国際標準化。IEEE 829を包含 | verified |

## 3. ST vs E2E vs IT の境界

### 3.1 スコープの違い

| テスト種別 | スコープ | 何を検証するか | 外部依存 | 実行タイミング |
|---|---|---|---|---|
| **IT（結合テスト）** | 複数モジュール間のインターフェース | モジュール間の接続・データ受け渡し | モック | 開発中〜早期 |
| **ST（システムテスト）** | **単一の完全なシステム** | 要件充足、機能+非機能 | 制御された環境 | IT完了後 |
| **E2E** | **複数システム横断** | ユーザーワークフロー全体 | 実際の外部システム | リリース前 |

### 3.2 よくある混同と実態

**「STとE2Eは同じ」は不正確。** ただし実務上の混同には理由がある。

| 混同パターン | 実態 | Confidence |
|---|---|:---:|
| 「E2E = ST」と扱うチーム | フロントエンドでは単一システム内のE2Eテスト（Cypress/Playwright）がST相当になることが多い | verified |
| 「IT = コンポーネント間テスト」と「IT = API結合テスト」の混在 | ISTQBでは「コンポーネント結合テスト」と「システム結合テスト」を区別している | verified |
| Testing TrophyにST層がない | Kent C. Doddsの分類はStatic/Unit/Integration/E2Eの4層。STは明示的に存在しない | verified |

**Martin Fowlerの指摘**: 「テストカテゴリについて議論する際は、相手がその言葉で何を意味しているかを掘り下げよ」。**用語の定義争いより、テストが何を検証するかに集中すべき。**

### 3.3 実務上の境界線

| 検証内容 | IT | ST相当 | E2E |
|---|---|---|---|
| APIレスポンスの正しさ | **○** | | |
| 画面遷移フロー | | **○** | |
| 認証→操作→結果確認の一連の流れ | | **○** | |
| 外部決済APIとの連携 | | | **○** |
| 複数マイクロサービス横断のワークフロー | | | **○** |
| 性能・負荷テスト | | **○** | |

## 4. テスト戦略モデルでのSTの位置づけ

### 4.1 モデル比較

| モデル | 提唱者/年 | 層構成 | STの扱い | 適する文脈 | Confidence |
|---|---|---|---|---|:---:|
| **Testing Pyramid** | Mike Cohn, 2009 | Unit > Service > UI | Service層にST含む | バックエンド、モノリス | verified |
| **Testing Trophy** | Kent C. Dodds, 2018 | Static / Unit / **Integration** / E2E | **STは存在しない。** E2E層がST+E2Eを兼ねる | フロントエンド（React等） | verified |
| **Testing Diamond** | 複数, 2020s | Unit / **Integration（最大）** / E2E | ITの上位層がST相当 | API駆動のサービス | verified |
| **Testing Honeycomb** | Spotify, 2018 | Impl Detail / **Integration** / Integrated | **STは存在しない。** Integration=サービス間テスト | マイクロサービス | verified |

### 4.2 各モデルの詳細

**Testing Trophy（Kent C. Dodds）**
- 哲学: 「テストがソフトウェアの使われ方に似ているほど、信頼性が高まる」
- E2E層: 「モックを全く（あるいはできるだけ少なく）使わずにシステムが正しく機能することを確認する」。これはISTQBのST定義に近い
- **ITが最大の層**。「Write tests. Not too many. Mostly integration.」（Guillermo Rauch）

**Testing Honeycomb（Spotify）**
- 3層: Implementation Detail Tests（少数）→ **Integration Tests（中心）** → Integrated Tests（最小、理想はゼロ）
- 「マイクロサービスにおける最大の複雑性はサービス内部ではなく、他サービスとの相互作用にある」
- Integrated Tests = 「他システムの正しさに依存して成否が決まるテスト」で、これがE2E/ST相当

**Testing Diamond**
- Pyramidの進化形。Unit層を縮小し、Integration層を拡大
- 2つのIntegration層に分割: 「ユニットテストには大きすぎる」コンポーネントテスト層 + 「API受信データ等の」システム結合テスト層
- 後者がST相当

### 4.3 収束する方向性

**全モデルに共通する傾向:**
1. **ITを中心に据える**（Pyramid以外のすべてのモデル）
2. **STという独立した層を設けない**（Trophy, Honeycomb, Diamond）
3. **E2Eは少数精鋭**（全モデル共通）
4. **用語より検証対象に注目**（Fowler, Dodds）

## 5. 2024-2025年のSTトレンド

### 5.1 フロントエンドでのST領域の変化

| トレンド | 内容 | Confidence |
|---|---|:---:|
| **Vitest Browser Mode安定化** | v4.0でstable。実ブラウザでコンポーネントテスト実行。従来のST領域をカバー | verified |
| **Playwright優勢** | Cypressを週間DL数で逆転。クロスブラウザ+マルチタブ+マルチオリジン対応 | verified |
| **コンポーネントテストの台頭** | Unit < **Component Test** < E2E。ITとSTの間を埋める層として定着 | verified |
| **Shift-Left** | STフェーズの検証をIT段階に前倒し。開発者がPlaywrightで書く | verified |
| **AIテスト生成** | 回帰テスト自動生成、視覚的回帰テスト。ただしST固有の非機能テストはまだ人間依存 | verified |

### 5.2 STで何を検証すべきか（ITとの役割分担）

| 検証カテゴリ | IT（/test-itの範囲） | ST/E2E（将来スキルの範囲） |
|---|---|---|
| **ビジネスロジック** | ○ モジュール結合の正しさ | |
| **ユーザーフロー** | △ 部分的（RTL） | **○ 画面遷移含む完全フロー** |
| **クロスブラウザ** | × | **○ Playwright** |
| **非機能（性能）** | × | **○ Lighthouse/k6** |
| **非機能（セキュリティ）** | × | **○ OWASP ZAP等** |
| **外部システム連携** | × （MSWでモック） | **○ 実API** |
| **視覚的回帰** | × | **○ Playwright screenshot** |
| **アクセシビリティ** | △ axe-core | **○ 実ブラウザで検証** |

## 6. 批判的レビュー

| 論点 | 検証結果 |
|---|---|
| 「STは不要」は言い過ぎか？ | **部分的に正しい。** フロントエンドではITとE2Eで十分カバーできる。ただし非機能テスト（性能、セキュリティ）はE2Eとも異なる専門領域で、STの枠組みが有用 |
| ISTQBの4層モデルは時代遅れか？ | **文脈依存。** エンタープライズ・規制産業では依然有効。フロントエンド/マイクロサービスでは3層（Unit/IT/E2E）が実践的 |
| Testing Trophyは万能か？ | **No。** フロントエンド単一コードベース向け。マイクロサービスにはHoneycomb、バックエンドモノリスにはPyramidがそれぞれ適切 |
| コンポーネントテスト = ST か？ | **No。** コンポーネントテストはITの上位層であり、システム全体の要件検証（ST）とは異なる。ただしSTの一部の役割を果たす |

## 7. Recommendations

| # | 推奨事項 | 理由 |
|---|---|---|
| 1 | `/test-it`のIT定義はそのまま維持。STという層は設けない | フロントエンド文脈ではTesting Trophyの3層モデルが最適。STは概念として理解しつつ、実装上はITとE2Eに分解する |
| 2 | ST相当の検証はPlaywright E2Eスキル（`/e2e`等）として将来別途設計 | ユーザーフロー全体、クロスブラウザ、視覚回帰はITの範囲外。Playwright MCPが前提 |
| 3 | 非機能テスト（性能・セキュリティ）は専用ツールで別管理 | Lighthouse/k6/OWASP ZAPは独自の実行環境が必要。テストスキルに混ぜると責務が肥大化する |
| 4 | テスト戦略の説明にはISTQB用語ではなくTrophy用語を使う | チームの共通言語として「Unit/Integration/E2E」の3層が最も誤解が少ない |

## 8. Sources

- [ISTQB Glossary - System Testing](https://istqb-glossary.page/system-testing/)
- [ISTQB CTFL Syllabus v4.0.1](https://istqb.org/sdm_downloads/istqb-certified-tester-foundation-level-syllabus-v4-0/)
- [Kent C. Dodds - The Testing Trophy and Testing Classifications](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Kent C. Dodds - Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)
- [Kent C. Dodds - Static vs Unit vs Integration vs E2E Testing](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests)
- [Martin Fowler - On the Diverse And Fantastical Shapes of Testing](https://martinfowler.com/articles/2021-test-shapes.html)
- [Spotify Engineering - Testing of Microservices](https://engineering.atspotify.com/2018/01/testing-of-microservices)
- [web.dev - Pyramid or Crab? Find a testing strategy that fits](https://web.dev/articles/ta-strategies)
- [Microsoft Engineering Playbook - Unit vs Integration vs System vs E2E Testing](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/e2e-testing/testing-comparison/)
- [GeeksforGeeks - Difference between System Testing and End-to-end Testing](https://www.geeksforgeeks.org/software-engineering/difference-between-system-testing-and-end-to-end-testing/)
- [Crispy Engineering - Why test diamond model makes sense](https://www.crispy-engineering.com/p/why-test-diamond-model-makes-sense)
- [ToolsQA - System Testing (ISTQB)](https://toolsqa.com/software-testing/istqb/system-testing/)
- [ISO/IEC/IEEE 29119 Software Testing Standard](https://softwaretestingstandard.org/)
