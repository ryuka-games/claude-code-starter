# Research Report: AI x E2E/STの現状 — ツール、事例、Playwright MCPの位置づけ

## 1. Executive Summary

- **結論**: Playwright MCPはClaude Codeとの統合が最も成熟しており、「探索→テスト生成」の2段階アプローチに適しているが、**トークン消費（1操作114Kトークン）とコンテキスト汚染が実用上の最大のボトルネック**。2026年初頭にPlaywright CLIが登場し、トークン4分の1で同等の操作が可能に
- **推奨アクション**: STフェーズはPlaywright MCP（探索）→ Playwright CLI（テスト実行・デバッグ）の併用から始める。商用ツール導入は規模拡大後に検討
- **根拠**: MicrosoftのAzure DevOpsチーム自身がMCP+AI生成で手動テストの自動化に成功。一方、商用ツール（QA Wolf等）は年間$90K〜のコストで、個人〜小規模チームには過剰

## 2. Playwright MCP: 機能・制約・Claude Code統合

### 2.1 アーキテクチャと動作原理

| 項目 | 内容 | 信頼度 |
|---|---|:---:|
| **動作方式** | アクセシビリティツリー（スクリーンリーダーと同じ構造化データ）でページを認識。スクリーンショット不要 | verified |
| **提供ツール数** | 25+（navigate, click, fill, type, snapshot, console_messages, network等） | verified |
| **Visionモード** | `--caps vision`で画像ベース操作も可能（デフォルトはOFF） | verified |
| **コード生成** | 操作履歴からTypeScriptのPlaywrightテストコードを出力可能 | verified |
| **認証状態の保持** | `--storage-state`でcookies/localStorageをファイルから読み込み | verified |
| **ブラウザ選択** | Chrome, Firefox, WebKit, Edge対応。`--headless`でヘッドレス実行可 | verified |

### 2.2 Claude Codeとの統合

**セットアップ**: `claude mcp add playwright npx @playwright/mcp@latest` の1コマンドで完了。`~/.claude.json`に永続化される。

**主要ワークフロー**:
1. **Self-QA**: コード変更後にlocalhostを開いて動作確認させる
2. **探索テスト**: 「このサイトを探索してバグを見つけて」と自然言語で指示
3. **テスト生成**: 探索結果に基づきPlaywrightテストコードを生成

**実例** (Debbie O'Brienの記事): AIエージェントがサイトを自律探索し、検索で「Star Wars」を入力したら「Kill」が返る実際のバグを発見。60行超のテストを初回実行で合格する品質で生成した。

### 2.3 制約と実務上の課題

| 制約 | 影響度 | 詳細 | 信頼度 |
|---|:---:|---|:---:|
| **トークン消費** | **致命的** | 1操作あたり約114Kトークン。12ステップ後にコンテキストに90K+の古いスナップショットが蓄積し、モデルの判断精度が劣化 | verified |
| **Shadow DOM非対応** | 高 | Web Components/Lit使用アプリではアクセシビリティツリーが要素を見落とす | verified |
| **セルフヒーリング非実装** | 高 | セレクタ自動修復は組み込まれていない。自前実装には1〜2名のエンジニアが1四半期必要 | verified |
| **テスト失敗時のデバッグ困難** | 中 | 探索には使えるが、失敗テストの原因特定にはMCPのツールを効果的に使えず、スクリーンショットやログに頼る | verified |
| **ラベル不足要素** | 中 | DOMのアクセシビリティラベルが不十分な要素は操作できず、「もう1つのボタンをクリックして」的なやり取りが発生 | verified |
| **ステートレス** | 中 | MCPサーバーはリクエストごとにリセット。前の操作の文脈を自動保持しない | verified |

### 2.4 Playwright CLI — トークン問題の解決策（2026年初頭〜）

| 比較項目 | Playwright MCP | Playwright CLI |
|---|---|---|
| **トークン消費** | 約114,000/操作 | 約27,000/操作（**4倍効率的**） |
| **スナップショット保存** | コンテキストウィンドウ内 | ディスク上のYAMLファイル |
| **要素参照** | フルアクセシビリティツリー | コンパクトなID参照（e21, e35等） |
| **長時間セッション** | 15操作後に劣化 | 50操作以上安定 |
| **向いている用途** | 探索、アドホックなインタラクション | テスト実行、デバッグ、長いフロー |

**所感**: MCPとCLIは排他ではなく補完関係。**探索フェーズはMCP、テスト実行・デバッグはCLI**が現時点の最適解。

## 3. AI E2Eテストツール全体像

### 3.1 ツール分類と比較

| ツール | アプローチ | 特徴 | 価格帯 | 向いているチーム | 信頼度 |
|---|---|---|---|---|:---:|
| **Playwright MCP/CLI** | OSS / DIY | Claude Code直接統合、アクセシビリティツリー | 無料（トークンコスト） | 個人〜小規模、技術力あり | verified |
| **Octomind** | AI生成+自動修復 | Playwrightベース、自然言語/MCP/録画からテスト生成。自動修復で保守83%削減事例 | 商用（要問合せ） | 中規模〜、QA専任なし | verified |
| **Momentic** | AI生成+セルフヒーリング | YAML管理、低コード、セルフヒーリングロケータ。Notion/Webflow等が採用。$15M調達済 | 商用（要問合せ） | 中規模〜、非エンジニアも利用 | verified |
| **Meticulous** | セッションリプレイ型 | ユーザーセッション録画→自動リプレイ差分検出。バックエンドは自動モック。テスト記述不要 | 商用（Vercel統合あり） | フロントエンド中心チーム | verified |
| **QA Wolf** | AI+人間ハイブリッド | 80%カバレッジを4ヶ月で達成。ゼロフレーク保証。専任QAエンジニアが付く | 年間$90K〜（中央値） | 大規模、QAを外部委託したい | verified |
| **testRigor** | 自然言語テスト | 完全ノーコード、平文英語でクロスシステムE2Eテスト。Web/モバイル/SAP/Salesforce対応 | 商用（要問合せ） | 非エンジニアQA担当者 | verified |
| **Bug0** | 動画→テスト変換 | 画面録画からPlaywrightテスト自動生成。セレクタ自動修復 | $250/月〜 | 小〜中規模 | verified |
| **Checksum** | セッション分析型 | ユーザーセッション分析→Playwright/Cypressテスト自動生成・自動保守 | 商用（要問合せ） | CI/CD重視チーム | verified |

### 3.2 アプローチの分類

```
┌─────────────────────────────────────────────────┐
│              AI E2Eテストのアプローチ               │
├────────────┬──────────────┬──────────────────────┤
│  DIY型     │  AI生成型     │  フルサービス型        │
│ (自分で構築) │ (ツールが生成) │ (人間+AIのハイブリッド) │
├────────────┼──────────────┼──────────────────────┤
│ Playwright │ Octomind     │ QA Wolf              │
│ MCP/CLI    │ Momentic     │                      │
│            │ Bug0         │                      │
│            │ Checksum     │                      │
│            │ testRigor    │                      │
├────────────┼──────────────┼──────────────────────┤
│ コスト: 低  │ コスト: 中    │ コスト: 高             │
│ 柔軟性: 高  │ 柔軟性: 中    │ 柔軟性: 低             │
│ 保守負荷: 高│ 保守負荷: 低  │ 保守負荷: なし          │
└────────────┴──────────────┴──────────────────────┘
```

## 4. AIがE2Eテストを書くときの課題

### 4.1 技術的課題

| 課題 | 深刻度 | 現状の対策 | 信頼度 |
|---|:---:|---|:---:|
| **セレクタの不安定性** | 高 | アクセシビリティツリーベースのセレクタ（role-based locator）が最も安定。CSS/XPathセレクタは脆弱 | verified |
| **Flaky Tests** | 高 | 商用ツールはセルフヒーリング（90-95%の自動修復率）で対処。DIYでは自前実装が必要 | verified |
| **コンテキスト消失** | 高 | MCPでは12操作後にモデルの精度劣化。CLIのディスクベース方式で大幅改善 | verified |
| **テスト失敗のデバッグ** | 中 | AIは「テストを書く」のは得意だが「失敗したテストを直す」のは苦手。人間の介入が必要 | verified |
| **動的コンテンツ** | 中 | タイミング問題、非同期ロード、アニメーション。AIが適切なwaitを入れるのは不安定 | inferred |
| **テストデータ管理** | 中 | AIはテスト用データのセットアップ・クリーンアップの設計が苦手 | inferred |

### 4.2 組織的課題

| 課題 | 詳細 | 信頼度 |
|---|---|:---:|
| **ROI未定義のまま導入** | MIT調査: AI導入プロジェクトの95%が測定可能なP&Lインパクトを出せていない | verified |
| **過剰な期待** | 「5分でテスト完成」は幻想。現実は1フローあたり30-60分の反復作業 | verified |
| **データ不足** | 新規プロジェクトはAI学習用の過去データが不足。規制産業では本番データの利用制約あり | verified |
| **セキュリティ懸念** | Playwright MCPで取得したページ内容・フォームデータは全てAPI経由で外部送信される | verified |

## 5. 手動探索→自動化の2段階アプローチ

### 5.1 Microsoftの成功事例（Azure DevOps）

**課題**: スプリントごとに全テストスイートを手動実行する反復作業がボトルネック。

**アプローチ**:
1. Azure DevOps MCPサーバーからテストケースを取得
2. GitHub Copilotに自然言語でPlaywrightテストを生成させる
3. 「テストケース取得」→「スクリプト生成」の2段階プロンプトが1段階より安定

**結果**: 手動作業の大幅削減、テスト信頼性向上、リリースサイクル短縮。「平文英語でテストを説明し、実行可能なスクリプトを得る体験は魔法のようだった」とチームが報告。

### 5.2 推奨する2段階ワークフロー（このプロジェクト向け）

```
Phase 1: 手動探索（Playwright MCP）
├── Claude CodeにPlaywright MCPでアプリを探索させる
├── 主要ユーザーフローを自然言語で確認
├── バグ・エッジケースの発見
└── 出力: 探索レポート + 発見したバグのリスト

Phase 2: テスト自動化（Playwright CLI推奨）
├── Phase 1の結果をもとにテストコード生成
├── role-basedロケータ（getByRole, getByLabel等）を使用
├── 人間がレビュー → セレクタ安定性・アサーション強度を確認
└── 出力: CI/CDに組み込み可能なPlaywrightテストスイート
```

**重要な注意点**:
- AIが生成したテストは「スキャフォールド」として扱う。本番品質には人間のレビューが必須
- 安定した高信頼テストは静的なPlaywright specとして維持。AIエージェントループはflaky tests・新機能・UI変更が頻繁な領域に限定

## 6. Recommendations

| # | 推奨事項 | 理由 |
|---|---|---|
| 1 | **まずPlaywright MCP + Claude Codeで探索的STを開始** | セットアップが1コマンド、追加コスト不要、既存のClaude Code環境にそのまま統合できる |
| 2 | **テスト実行・デバッグにはPlaywright CLIの採用を検討** | トークン4倍効率化、長時間セッションの安定性。MCP併用で探索とテスト実行を分担 |
| 3 | **Shadow DOMを使うアプリの場合は代替MCPサーバーも検討** | Microsoftの公式MCPはShadow DOM内要素を見落とす既知の制約あり |
| 4 | **商用ツールの導入はテスト数50+になってから判断** | 小規模段階ではDIYの方がコスト効率・学習効果が高い。規模拡大時にOctomindやMomentic等を検討 |
| 5 | **セキュリティ: 開発環境+テストデータのみでPlaywright MCPを使用** | ページ内容が全てAnthropicのAPIに送信されるため、本番データの使用は避ける |

## 7. Sources

### Playwright MCP 公式・技術情報
- [microsoft/playwright-mcp (GitHub)](https://github.com/microsoft/playwright-mcp) - 公式リポジトリ、ツール一覧・設定オプション
- [Playwright CLI: Token-Efficient Alternative](https://testcollab.com/blog/playwright-cli) - MCP vs CLI比較
- [Playwright MCP Burns 114K Tokens (Medium)](https://scrolltest.medium.com/playwright-mcp-burns-114k-tokens-per-test-the-new-cli-uses-27k-heres-when-to-use-each-65dabeaac7a0) - トークン消費ベンチマーク
- [6 Most Popular Playwright MCP Servers (Bug0)](https://bug0.com/blog/playwright-mcp-servers-ai-testing) - MCPサーバー比較

### Claude Code統合・実事例
- [How to Use Playwright MCP Server with Claude Code (Builder.io)](https://www.builder.io/blog/playwright-mcp-server-claude-code) - セットアップ・ワークフロー解説
- [Letting Playwright MCP Explore Your Site (DEV Community)](https://dev.to/debs_obrien/letting-playwright-mcp-explore-your-site-and-write-your-tests-mf1) - 探索→テスト生成の実例
- [Building an AI QA Engineer with Claude Code (alexop.dev)](https://alexop.dev/posts/building_ai_qa_engineer_claude_code_playwright/) - 実践報告

### AI E2Eテストツール
- [The 12 Best AI Testing Tools in 2026 (QA Wolf)](https://www.qawolf.com/blog/the-12-best-ai-testing-tools-in-2026) - ツール比較
- [Octomind: Automated E2E Testing](https://octomind.dev/) - AI生成+自動修復
- [Momentic: AI-Native Testing Platform](https://momentic.ai/) - セルフヒーリング
- [Meticulous: Automated Frontend Testing](https://www.meticulous.ai/) - セッションリプレイ型
- [QA Wolf: 80% Coverage in 4 Months](https://www.qawolf.com/) - AI+人間ハイブリッド

### 事例・課題
- [Azure DevOps MCP + Playwright Success Story (Microsoft)](https://devblogs.microsoft.com/devops/from-manual-testing-to-ai-generated-automation-our-azure-devops-mcp-playwright-success-story/) - Microsoftの2段階アプローチ成功事例
- [Playwright MCP Changes Build vs Buy (Bug0)](https://bug0.com/blog/playwright-mcp-changes-ai-testing-2026) - 商用ツールとの比較分析
- [State of Playwright AI Ecosystem in 2026 (Currents)](https://currents.dev/posts/state-of-playwright-ai-ecosystem-in-2026) - エコシステム全体像
- [Big SaaS Cuts Test Maintenance by 83% (Octomind)](https://octomind.dev/case-studies/big-saas-cut-test-maintenance-by-83-percent) - 自動修復の効果
