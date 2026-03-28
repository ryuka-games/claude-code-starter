# 反証エージェント（Devil's Advocate）— パターン・効果・限界・組み込み方

## Summary

**結論**: 反証エージェントはspec後に1回噛ませるのが最もROIが高い。ただし同一モデルの自己修正は効果が薄く、情報非対称の設計と偽陽性フィルタが必須
**推奨アクション**: 独立スキル `/challenge` として設計。specとplanの両方に使えるようにする。常駐ではなく呼ばれた時だけ動く設計
**根拠**: 要件段階の誤りは下流で10倍に増幅される。1-2回の反証が最適で、3回以上は逓減が激しい

## 反証エージェントとは何か

**グループ意思決定において、提案に対する批判者の役割を意図的に設ける手法。** 起源はカトリック教会の列聖審査。経営学にはSchwenk（1984）が持ち込み、集団思考（groupthink）を防ぐ技法として体系化された。

LLMの文脈では、Generatorの出力をCriticが攻撃し、弱点を炙り出すパターンとして実装される。

## 実装パターン

| パターン | 構造 | 用途 | 出典 |
|---|---|---|---|
| **Generator-Critic** | 生成→批評→修正ループ | コード生成、コンプライアンス | Google ADK |
| **Multi-Agent Debate (MAD)** | 複数LLMが互いの推論を批判 | 推論・事実確認 | Du et al. 2023 |
| **DEBATE** | Commander + Scorer + Critic | NLG評価のバイアス是正 | ACL 2024 |
| **情報非対称Critic** | Criticに成果物のみ渡し、意図は渡さない | spec/コードレビュー | BMAD Method |
| **異モデル討論** | 異なるモデルが独立レビュー→相互批判 | コードレビュー | Milvus, alecnielsen |

## 定量的な効果

| 手法 | 指標 | 改善幅 | 信頼度 |
|---|---|---|---|
| MAD (Multi-Agent Debate) | 数学・推論の精度 | +4〜6%（絶対値） | verified |
| MAD | 事実誤り | 30%以上削減 | verified |
| DEBATE (ACL 2024) | NLG評価 (SummEval, TopicalChat) | SOTA超え | verified |
| Anthropic Code Review | 実質的レビューコメント率 | 16% → 54% | verified |
| Milvus 5モデル討論 | バグ検出率 | 53% → 80% | verified |
| MAD 要件分類 (RE 2025) | F1スコア | 0.726 → 0.841 | unverified |

**1回目の反証は明確なROIがある。2回目も有効。3回目以降は急激に逓減する。**

## 同一モデルの限界（最重要）

**同一モデルの自己修正（intrinsic self-correction）は機能しない。** Huang et al. (ICLR 2024) が示した根本的限界:

- 外部フィードバックなしでは、LLMの出力を自分で修正してもパフォーマンスは改善しない、場合によっては悪化する
- 同一モデル同士のDebateは「self-consistency（多数決）」と効果が変わらない（ICLR 2025）
- 同一モデルの複数インスタンスは、ペルソナを変えても同質的な思考プロセスに陥る（Mental Set問題）

**対策**: 異なるモデルを使う、または異なる推論手法を明示的に割り当てる。外部の客観的検証（テスト実行、lint等）と組み合わせると効果が出る。

## 失敗パターン

| 失敗 | 原因 | 対策 |
|---|---|---|
| **無限レビューサイクル** | 「最低3件見つけろ」等のクオータ。良質なコードでもnitpickを捻り出す | 最低発見数を設けない。Severity閾値で打ち切り |
| **正しい回答の覆し** | Debateプロセスがノイズを導入し、元々正しかった回答を覆す | 最大ラウンド数（1-2回）をハードキャップ |
| **迎合性（Sycophancy）** | エージェントが簡単に意見を変え、多数派に同調 | Response Anonymization（エージェントIDを除去） |
| **大規模diffでの破綻** | コンテキスト圧迫でスタイル指摘にフォールバック | 500行以下に分割 |

BMAD Method Issue #1332が象徴的。最低発見数の強制 → 無限ループ → 開発者疲労。**「問題を見つけろ」ではなく「この仕様を壊してみろ」のフレーミングが正解。**

## 効く条件・効かない条件

### 効く

1. **外部フィードバックと組み合わせる**: テスト実行結果、型チェック、lint等の客観的検証
2. **異なるモデル/推論手法を使う**: 同一モデル同士では効果が薄い
3. **情報非対称を設計する**: Criticに実装意図を渡さず、成果物のみで判断させる
4. **人間が最終判断する**: 議論を深める触媒として機能

### 効かない

1. **同一モデルのintrinsic self-correction**: 外部フィードバックなしでは改善しないか悪化
2. **同質なエージェント同士のDebate**: self-consistencyと変わらない。コストだけ増える
3. **最低発見数クオータ**: 無限ループと偽陽性の温床
4. **3回以上のラウンド**: 収穫逓減が激しく、計算コストに見合わない

## 開発フローへの組み込み: どのフェーズが効果的か

| フェーズ | 効果 | 根拠 |
|---|---|---|
| **spec（仕様書）後** | **最高** | 要件の誤りは下流で増幅。RE 2025でF1が0.726→0.841 |
| plan（設計）後 | 中 | 設計の矛盾は実装で手戻り。ただしspecが正しければ影響は限定的 |
| コードレビュー | 高 | Anthropic: 16%→54%、Milvus: 53%→80%。実績豊富 |
| Agent Teams内常駐 | **低（リスクあり）** | BMAD #1332の失敗パターン。常駐は無限ループの温床 |

## 独立スキル vs 既存フロー組み込み

**独立スキルが推奨される条件（今回のフローに該当）:**
- レビュー対象がspec、plan、コードと多岐にわたる
- 情報非対称を保ちたい（同一コンテキスト内だとCriticが自分の出力を弁護する）
- 必要な時だけ呼びたい（常駐は無限ループリスク）

## Recommendations

| # | What | How | Why |
|---|------|-----|-----|
| 1 | 独立スキル `/challenge` を作る | specまたはplanのパスを受け取り、反証を返す | specにもplanにも使える柔軟性。常駐リスク回避 |
| 2 | 情報非対称を設計する | Criticにはspec/plan本体のみ渡す。作成時の議論経緯や実装コードは渡さない | BMAD方式。自己弁護のエコーチャンバーを防ぐ |
| 3 | 最低発見数を設けない | 「壊してみろ」のフレーミング。見つからなければ「問題なし」でOK | BMAD #1332の教訓。クオータは無限ループの温床 |
| 4 | 1回が基本、最大2回 | 反証→修正→再反証で打ち切り | 3回以上は逓減が激しい |
| 5 | 偽陽性フィルタを入れる | 見つけた問題を「本当に問題か」再検証するステップ | Anthropic Code Reviewの成功要因 |
| 6 | 同一モデルの限界を認識する | 可能なら異モデル。不可能なら異なる推論アプローチを指示 | ICLR 2024/2025の知見 |

## Sources

- [Schwenk 1984 - Devil's Advocacy in Management](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-6486.1984.tb00229.x)
- [DEBATE - ACL 2024](https://aclanthology.org/2024.findings-acl.112/) — verified
- [BMAD Method - Adversarial Review](https://docs.bmad-method.org/explanation/adversarial-review/) — verified
- [Anthropic Code Review](https://claude.com/blog/code-review)
- [Milvus AI Code Review Arena](https://milvus.io/blog/ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md)
- [Huang et al. - LLMs Cannot Self-Correct Reasoning Yet (ICLR 2024)](https://arxiv.org/abs/2310.01798)
- [MAD Performance Analysis (ICLR 2025)](https://d2jud02ci9yv69.cloudfront.net/2025-04-28-mad-159/blog/mad/)
- [BMAD Issue #1332](https://github.com/bmad-code-org/BMAD-METHOD/issues/1332)
- [MAD for Requirements Engineering (RE 2025)](https://arxiv.org/abs/2507.05981)
- [Talk Isn't Always Cheap - MAD Failure Modes](https://arxiv.org/abs/2509.05396)
- [LLM-Powered Devil's Advocate (IUI 2024)](https://dl.acm.org/doi/10.1145/3640543.3645199)
- [ASDLC.io - Adversarial Code Review](https://asdlc.io/patterns/adversarial-code-review/)
- [alecnielsen/adversarial-review](https://github.com/alecnielsen/adversarial-review)
