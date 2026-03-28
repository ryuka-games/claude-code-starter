# AIエージェントの「経過の可視化」に対するニーズ調査レポート

調査日: 2026-02-22

---

## サマリー

| 観点 | 結論 |
|------|------|
| [1. 意思決定の透明性ニーズ](#1-意思決定プロセスの透明性可視化に関するニーズ) | 非常に強い。PwC調査で経営層の2/3がAIへの信頼が低〜中程度。「経緯が見えない＝信頼できない」は共通認識 |
| [2. マルチエージェント可視化ツール](#2-マルチエージェント協調の可視化ツールアプローチ) | 急速に整備中。LangSmith, Langfuse, AgentOps, CrewAI等がトレーシング基盤を提供。OpenTelemetryが標準化を牽引 |
| [3. 「経緯を見たい」の声](#3-経緯を見たいという声事例) | 広く存在。@ITの「見えなさが気持ち悪い」記事、Zennの「見えない不具合」記事など具体的な声が多い |
| [4. AI開発ツールへの不満](#4-ai開発ツールでの経過可視化に対するユーザーの声) | Cursorは「14ファイル変更の意図不明」、Devinは「セッションリプレイ」で先行。Claude Codeは途中経過表示あるが課題も |
| [5. Human-in-the-loop実践](#5-human-in-the-loopの実践例) | LangGraphのinterrupt()が技術標準に。UXパターンとして6つの設計原則が確立されつつある |

---

## 1. 意思決定プロセスの透明性・可視化に関するニーズ

### ニーズの強さ

AIエージェントの意思決定プロセスの透明性に対するニーズは**極めて強い**。以下の調査データがこれを裏付ける。

**定量データ:**
- PwC調査: 経営層の**約2/3**がAIへの信頼は「低〜中程度」と回答
- 91%の経営層が「従業員はAIを過信している」と認識
- **半数未満**がガードレール付きでもエージェントの自律的意思決定を信頼
- わずか**8%**がエージェントに完全な自律性を与えることに快適さを感じる
- 63%が「エージェントは予想より多くの人間の監視が必要」と回答
- RAND 2025年調査: AIエージェントプロジェクトの**80-90%**が本番環境で失敗

**根本的なジレンマ:**
> エージェントが十分な価値を提供するには意思決定の自律性が必要だが、多くのAI専門家はエージェントをブラックボックスと見なしており、その行動の背後にある推論は導入組織には見えない。 — [CIO.com](https://www.cio.com/article/4087765/agentic-ai-has-big-trust-issues.html)

### 規制面からの圧力

- EU AI Act、NIST AI Risk Management Frameworkが高リスクAIシステムの説明可能性を要求
- GDPR、HIPAAが「AIがどうデータを処理・利用したか」の透明性を求める
- 監査人に「なぜこの判断をしたか」を問われた時、推論パス全体をリプレイできる必要がある

### 企業の関心

- IBM: 2026年のオブザーバビリティはガバナンス・リスク・コンプライアンスツールと統合される方向
- PwC Japan: AIエージェントのガバナンス枠組みの構築が重要テーマ
- 日本では「AIエージェント元年」（2025年）を経て、行動ログの監査や「シャドーAI」防止が実務課題に

**Sources:**
- [PwC - Observability is the key ingredient in making AI work](https://www.pwc.com/us/en/tech-effect/ai-analytics/ai-observability.html)
- [CIO - Agentic AI has big trust issues](https://www.cio.com/article/4087765/agentic-ai-has-big-trust-issues.html)
- [Token Security - Transparency and Explainability in Agentic AI](https://www.token.security/blog/transparency-and-explainability-in-agentic-ai-decision-making)

---

## 2. マルチエージェント協調の可視化ツール・アプローチ

### 主要プラットフォーム一覧

| ツール | 特徴 | 形態 |
|--------|------|------|
| **LangSmith** | ネスト表示でエージェントチェーン全体を可視化。オーバーヘッドほぼゼロ | 商用 |
| **Langfuse** | OSS＋クラウド。エージェントグラフ機能でマルチエージェントの相互作用を表示 | OSS / $29/月〜 |
| **AgentOps** | OpenTelemetry標準準拠。エージェントの判断・ツール使用・推論チェーンを追跡 | OSS |
| **Arize Phoenix** | MLOps基盤からエージェント観測に拡張。OTEL対応 | 商用 |
| **CrewAI AMP** | マルチエージェント専用。タスク実行タイムライン・ロール実行チェーンを表示 | 商用 |
| **Maxim AI** | E2Eプラットフォーム。プレリリーステスト→本番監視の統合ワークフロー | 商用（2025〜） |

### トレーシングの技術標準: OpenTelemetry

OpenTelemetryがエージェント観測の**事実上の標準**になりつつある。

- **AG2**: 2026年2月にOpenTelemetryトレーシングを組み込み。全会話・エージェントターン・LLM呼び出し・ツール実行を構造化スパンとして記録
- **AgentOps**: OTel準拠のデータをエクスポート。ベンダーロックイン回避
- **OpenTelemetry公式ブログ**: 2025年にAIエージェント観測のベストプラクティスを公開

### マルチエージェント特有の可視化

単一エージェントと異なり、マルチエージェントでは以下の追加情報が必要:

1. **エージェント間通信マップ**: どのエージェントがどのエージェントにタスクを委譲したか
2. **ステート遷移履歴**: 各エージェントのメモリ・コンテキスト・環境の変化
3. **ステップごとのアクションログ**: 全判断・ツール呼び出し・応答の時系列記録

**業界状況:**
- 89%の組織がエージェントに何らかのオブザーバビリティを導入済み
- 品質問題が本番環境の最大の障壁（32%）

**Sources:**
- [LangSmith Observability](https://www.langchain.com/langsmith/observability)
- [Langfuse Agent Graphs](https://langfuse.com/docs/observability/features/agent-graphs)
- [AG2 OpenTelemetry Tracing](https://docs.ag2.ai/latest/docs/blog/2026/02/08/AG2-OpenTelemetry-Tracing/)
- [OpenTelemetry - AI Agent Observability](https://opentelemetry.io/blog/2025/ai-agent-observability/)
- [CrewAI Tracing](https://docs.crewai.com/en/observability/tracing)
- [AgentOps GitHub](https://github.com/AgentOps-AI/agentops-ts)

---

## 3. 「経緯を見たい」という声・事例

### @IT: 「AIエージェントの見えなさが気持ち悪い」

@IT（2026年1月）の記事が、日本語圏でこのテーマを最も直接的に扱っている。

> AIエージェントの動きは、見えるようで見えません。何か頼んだとして、うまく動いた場合も、失敗した場合も、理由が分からないのです。この曖昧さが、日々使っている私にとってはどうにも気持ち悪い。

**具体的な指摘:**
1. **ログが残らない**: 画面に一瞬ステップが見えるが、後から追跡可能な形では残されない
2. **判断の不透明さ**: 「Deep Research」の作業ステップを見ても、どの情報を読み、どう判断し、なぜその行動を選んだか見えない
3. **内部推論とUI表示の乖離**: 画面上の説明用ステップは、実際の内部推論そのものではない

### Zenn: 「API正常でも起きる見えない不具合」

Zenn（tokium_dev）の記事が開発者視点の問題を具体化。

**事例1: 存在しないデータの補完**
AIが「3つ提案して」という要望を満たすため、APIレスポンスに含まれない新幹線を作り出した。HTTPステータスは200。

**事例2: パラメータ抽出の不安定性**
同じ入力「東京タワー」でも、ある時はそのまま、ある時は駅名に変換される。

**事例3: ツール未実行の静かな失敗**
AIが一般知識で対応可能と判断し、必要なAPI呼び出しを行わない。エラーログには何も残らない。

### コミュニティの声

**Reddit/HN共通テーマ:**
- 「AIエージェント」と銘打った製品の大半は、チャットボットインターフェースを持つ自動化ワークフローに過ぎない
- 開発者の不満は「能力」ではなく「予測可能性」— 何が起きているか分からないことへの不安
- 「Cursor: pay more, get less, and don't ask how it works」というスレッドが共感を集めている
- AIの「推論過程を見たい」は、研究者・開発者・一般ユーザー全てに共通するニーズ

**Sources:**
- [@IT - AIエージェントの「見えなさ」が気持ち悪い](https://atmarkit.itmedia.co.jp/ait/articles/2601/06/news005.html)
- [Zenn - AIエージェントに観測性が必須な理由](https://zenn.dev/tokium_dev/articles/a0f6f46c6c2e96)
- [IBM - Why observability is essential for AI agents](https://www.ibm.com/think/insights/ai-agent-observability)

---

## 4. AI開発ツールでの経過可視化に対するユーザーの声

### Cursor

**不満点:**
- Agent modeで「14ファイル変更されたdiffを見たら半分間違っていた」
- 「モジュールのリファクタリングを頼んだら、会議から戻ると30ファイル以上が変更されていた」
- 「なぜ他のファイルも変えたのか？ なぜコアロジックが違うのか？」という疑問
- エージェントが「熱心だが信頼性の低いインターン」のように振る舞う

**対処として推奨されている方法:**
- Plan Mode → Ask Mode → Agent Modeの段階的使い分け
- テストスイートを走らせて自己修正させる（ただし各ステップの理解は困難）

### Devin

**先行する可視化機能:**
- **セッションリプレイ（タイムラプス）**: セッション全体を再生可能。コマンド・ファイルdiff・ブラウザタブの全操作を記録
- **Session Insights**: セッション完了後に自動分析。パターン・課題・改善機会を特定
- **PR + 監査ログ**: タスク完了時にPull Requestと全作業の監査ログを自動作成
- **メモリ層**: コードベースのベクトル化スナップショット＋フルリプレイタイムライン

**課題:**
- 作業がバックグラウンドで進むため、リアルタイムの介入が難しい
- フィードバックはバッチ的（チェックポイント）で、連続的ではない

### Claude Code

**現状の可視化:**
- CLI上でリアルタイムに思考・アクションが表示される
- Agent Teamsではリードのターミナルでチームメイト一覧と作業内容を確認可能
- split-paneモードで各チームメイトの作業を個別に監視
- タスクリストで pending → in_progress → completed の進捗追跡
- 各ペインにクリックして直接介入可能

**課題・要望（推測を含む）:**
- ログが永続化されない（画面表示のみ）— セッション終了後の振り返りが困難
- Agent Teams間の通信内容を俯瞰するビューがない
- 作業完了後の「何が起きたか」サマリーがない
- Devinのようなセッションリプレイ機能がない

### ツール間比較の構造

```
リアルタイム性     ← Cursor（目の前でコード変更）
                  ← Claude Code（CLI上で逐次表示）
                  ← Devin（バッチ的フィードバック）

事後追跡性         ← Devin（リプレイ＋監査ログ）が最も充実
                  ← Cursor（diff表示のみ）
                  ← Claude Code（ログ永続化が課題）
```

**Sources:**
- [Cursor Agent Mode Tips](https://eastondev.com/blog/en/posts/dev/20260114-cursor-agent-tips/)
- [Devin Session Insights](https://docs.devin.ai/product-guides/session-insights)
- [Claude Code Agent Teams Docs](https://code.claude.com/docs/en/agent-teams)
- [Claude Code vs Cursor](https://codeaholicguy.com/2026/01/10/claude-code-vs-cursor/)

---

## 5. Human-in-the-loopの実践例

### 技術フレームワーク

**LangGraph（事実上の標準）:**

```
interrupt_before / interrupt_after  → 静的中断（特定ノードの前後で停止）
interrupt()関数                     → 動的中断（ノード内から条件付きで停止）
```

- チェックポインタでグラフ状態を永続化 → 中断しても状態を保持
- PostgresSaverで本番グレードの永続化
- LangGraph 1.0（2025年10月）で「耐久実行・ストリーミング・人間の監視・メモリ管理」が本番対応に

**Amazon Bedrock Agents:**
- エージェント実行中に確認ステップを挿入
- ユーザーの承認/拒否で処理を分岐

**Zapier:**
- ワークフロー内に「Human Decision」ステップを配置
- 指定された人に承認リクエストを送信

### UXデザインパターン（6つの原則）

Smashing Magazine（2026年2月）が提唱する、Agentic AIのUX設計パターン:

| パターン | 説明 | 効果 |
|----------|------|------|
| **Intent Preview** | 実行前に「何をするか」を明示 | インフォームドコンセント |
| **Autonomy Dial** | 「提案のみ」〜「完全自動」を段階的に設定 | リスク許容度に応じた信頼構築 |
| **Explainable Rationale** | 「なぜそうしたか」を説明 | 判断が論理的に見える |
| **Confidence Signal** | 確信度をパーセンテージ等で表示 | オートメーション偏向の防止 |
| **Action Audit & Undo** | 全行動をログ＋ワンクリック取消 | 心理的安全性 |
| **Escalation Pathway** | 曖昧な場合は推測せずユーザーに確認 | 不確実な状況での信頼強化 |

核心原則:
> **「システムの自律性が高まるほど、その推論はより可視的でなければならない」**

### 実践事例

1. **HR（PTO申請）**: 従業員がリクエストを送信前にレビュー・編集可能
2. **契約レビュー**: AIが条項に不確かな場合は弁護士にフラグ
3. **医療画像診断**: 異常を検出したら放射線科医に委ねる
4. **特許検索**: エージェントが人間のフィードバックで検索方向を修正
5. **カスタマーサポート**: 2025年調査で、明確なエスカレーショントリガー設定により対応時間が36.5%削減

### 介入トリガーの設計

- 信頼度スコアが閾値以下
- 高リスク操作の検出
- エスカレーション頻度の健全範囲: 全タスクの5-15%
- オーバーライドレイテンシ（ユーザーが介入できるまでの時間）の測定

**Sources:**
- [LangChain - Human-in-the-loop](https://docs.langchain.com/oss/python/langchain/human-in-the-loop)
- [Smashing Magazine - Designing For Agentic AI](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/)
- [Permit.io - Human-in-the-Loop for AI Agents](https://www.permit.io/blog/human-in-the-loop-for-ai-agents-best-practices-frameworks-use-cases-and-demo)
- [IBM - Human in the loop tutorial](https://www.ibm.com/think/tutorials/human-in-the-loop-ai-agent-langraph-watsonx-ai)

---

## 総合考察

### 「経過の可視化」は3層のニーズ

```
Layer 3: 事後追跡（監査・振り返り・学習）
  └ セッションリプレイ、監査ログ、パターン分析

Layer 2: リアルタイム監視（進捗把握・異常検知）
  └ ステップ表示、エージェント間通信、ステータス追跡

Layer 1: 判断根拠の理解（信頼構築・意思決定支援）
  └ なぜその行動を選んだか、何を考えたか、確信度
```

現状のツールはLayer 2（リアルタイム表示）は部分的にカバーしているが、Layer 1（判断根拠）とLayer 3（事後追跡）は不十分。

### 「経過の可視化」が求められる3つの文脈

1. **開発者文脈**: デバッグ・品質保証のために、AIの判断パスを追跡したい
2. **ユーザー文脈**: 結果を信頼するために、なぜその結論に至ったか知りたい
3. **組織文脈**: コンプライアンス・監査のために、全判断の証跡を残したい

### Claude Code Agent Teamsへの示唆

現在のAgent Teamsは「リアルタイムのターミナル表示」と「タスクリスト」で最低限の可視性を提供しているが、以下の強化が考えられる:

1. **議論ログの永続化**: エージェント間の会話をMarkdownや構造化ログとして保存
2. **判断根拠の明示**: 各エージェントが「なぜこのアプローチを選んだか」を記録
3. **セッションサマリー**: 完了後に「何が議論され、何が決まり、何が実装されたか」を自動生成
4. **介入ポイントの設計**: 重要な設計判断の前にリードが確認できるチェックポイント
5. **差分の追跡性**: どのエージェントがどのファイルをなぜ変更したかの追跡
