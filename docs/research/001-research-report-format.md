# Research Report: AIリサーチレポートの出力フォーマットとベストプラクティス

## 1. Executive Summary

AI/LLMによるリサーチ機能は急速に発展しており、ChatGPT Deep Research、Gemini Deep Research、Perplexity Pages、Claude Code Skills等で異なるアプローチが採用されている。共通するベストプラクティスは以下の通り:

- **Executive Summaryだけで意思決定できる構成**にする（本文は裏付け）
- **調査種類ごとにフォーマットを変える**のではなく、共通骨格+種類別セクションで対応する
- **1調査=1ファイル**が原則。100行以内を目安に、テーブルで密度を上げる
- **信頼度ラベル**（verified/unverified/inferred）は必須。AIレポートの最大の弱点はハルシネーション

## 2. Findings

### 2.1 類似リサーチスキル/ツールの比較

| ツール/スキル | フォーマット | 特徴 | Confidence |
|---|---|---|:---:|
| **ChatGPT Deep Research** | 5-50ページ、目次付き、インライン引用 | 全文フォーマットされたレポート。PDF/DOCX出力。学術論文寄り | verified |
| **Gemini Deep Research** | 2000-3000語、H1/H2/H3構造、Works Cited | 研究計画をユーザーが編集可能。チャート自動生成。テーブルは8列以下推奨 | verified |
| **Perplexity Deep Research** | 5-15ページ、太字キーファクト、インラインリンク | Executive Summary + Key Insights + Timeline + Recommendations。Pagesで共有可能なドキュメントに変換 | verified |
| **daymade/deep-research** (Claude Code Skill) | 9ステップのパイプライン、3並列ドラフト→UNION merge | ソース品質をA/B/Cティアで評価。エビデンステーブル必須。最も構造化されたアプローチ | verified |
| **Weizhena/Deep-Research-skills** (Claude Code Skill) | 3フェーズ（Outline→Deep Research→Report）、report.md出力 | human-in-the-loopでアウトライン編集可能。学術/技術/市場/DD用途別対応 | verified |
| **levnikolaevich/claude-code-skills** | ADR + ガイド + マニュアル出力 | 101スキルのフルワークフロー。リサーチはln-001/002で標準化・ベストプラクティスを別々に調査 | verified |
| **自プロジェクト /research** | NNN-slug.md、Executive Summary + Findings(テーブル) + Recommendations + Sources | subagent並列、信頼度カラム、100行以内。軽量だが十分 | verified |

### 2.2 レポート構成パターンの分類

| パターン | 代表例 | 向いている用途 | 長さ目安 |
|---|---|---|---|
| **Academic（学術型）** | ChatGPT Deep Research | 文献レビュー、政策分析 | 5-50ページ |
| **Executive Briefing（要約型）** | Perplexity、Gartner | 意思決定支援、経営報告 | 1-3ページ |
| **Comparison Matrix（比較型）** | Gartner Magic Quadrant/Critical Capabilities | 技術選定、競合分析 | テーブル中心 |
| **Narrative（物語型）** | Amazon 6-Pager | 戦略提案、新規事業案 | 6ページ以内 |
| **Evidence-Based（証拠型）** | daymade/deep-research | 厳密な調査、監査 | 可変（エビデンステーブル重視） |

**所感**: Claude Code用途（開発者が素早く判断したい）には**Executive Briefing + Comparison Matrix**のハイブリッドが最適。Academic型は長すぎ、Narrative型はAIには不向き。

### 2.3 スキャナビリティ（読み飛ばしやすさ）のテクニック

| テクニック | 効果 | Confidence |
|---|---|:---:|
| Executive Summaryを3-5行に限定し、結論とアクションのみ記載 | ここだけ読めば判断可能 | verified |
| テーブルで情報密度を上げる（散文を最小化） | 目が止まりやすく、比較しやすい | verified |
| 見出しに「何がわかるか」を書く（機能名ではなく） | 「2. Findings」より「2. 候補3つの比較結果」 | inferred |
| 太字で結論を先に書く（各段落の冒頭） | スキャン時に太字だけ拾えば概要がわかる | verified |
| テーブルは8列以下（Geminiの知見） | 横スクロールなしで読める | verified |
| 信頼度カラムをつける | 「これは確かか？」を即座に判断可能 | verified |
| 短い段落（2-4文）+ 空白行 | 視覚的な圧迫を軽減 | verified |

### 2.4 ファイル分割 vs 1ファイル

| 観点 | 1ファイル | 分割 |
|---|---|---|
| **検索性** | grepで一発 | ディレクトリ構造で把握 |
| **メンテナンス** | 長くなると更新箇所を探しにくい | 1ファイルの責務が明確 |
| **コンテキスト効率** | 1 readで全部読める | 必要なファイルだけ読める |
| **AI向き** | 100行以下なら1ファイルが圧倒的に楽 | 複数トピックの大規模調査時 |

**結論**: 1調査=1ファイルが原則。分割するのは以下の場合のみ:
- 1ファイルが200行を超える場合
- 調査目的が明確に独立している場合（例: 技術選定と市場規模は別調査）
- 段階的に調査が進む場合（Phase 1 → Phase 2のように）

### 2.5 技術調査と市場調査の混在問題

| 調査種類 | 固有のセクション | 共通骨格との関係 |
|---|---|---|
| **市場/競合** | 市場規模(TAM/SAM)、競合マップ、SWOT、トレンド | Executive Summary + Findingsテーブル + Recommendations は共通 |
| **技術選定** | 候補比較表、Community health、PoC結果 | 同上。Findingsの中に比較表を入れる |
| **コードベース/影響** | 影響範囲、呼び出し関係、blast radius | 同上。Findingsをコード参照付きにする |
| **設計要件** | ユースケース、制約条件、トレードオフ | 同上。Recommendationsが設計判断になる |

**結論**: フォーマットを種類ごとに完全に変える必要はない。**共通骨格（Executive Summary → Findings → Recommendations → Sources）を維持し、Findingsセクションの中身を種類に応じて変える**のがベスト。これにより:
- 読む側は「どこに何があるか」を毎回学び直さなくてよい
- 書く側（AI）もテンプレートが1つで済む
- 種類判定ミスのリスクがなくなる

## 3. Recommendations

| # | What to change | How to change it | Why |
|---|---|---|---|
| 1 | Executive Summaryの書き方を強化 | 「結論→推奨アクション→根拠1行」の3要素を必須にする。3-5行の制約を維持 | 現状は「3-5行」のみで、何を書くかが曖昧。読む側が最も重要視するセクション |
| 2 | Findingsセクションを種類別テンプレート化 | SKILL.md内に種類別のFindings構成ガイドを追加（Market: 競合テーブル+トレンド、Tech: 候補比較表+community health、Codebase: 影響範囲テーブル） | 現状は「Structure by sub-topic using tables」のみで、何をテーブルにするかが調査種類によって異なる |
| 3 | レポート長の目安を明記 | 「Executive Summary: 3-5行、Findings: テーブル中心で50-80行、Recommendations: 3-5行、全体100行以内」をSKILL.mdに追記 | 現状の「shorter is better」は曖昧。daymadeの9ステップパイプラインのような過剰さを避けつつ、密度の指針を与える |
| 4 | 見出しを内容ベースにする指示を追加 | 「見出しは調査内容を反映する名前にする（例: '2. Findings' → '2. 候補フレームワーク3つの比較'）」 | 汎用見出しだとスキャン時に中身がわからない |
| 5 | 信頼度システムを3段階のまま維持 | 変更不要。daymadeのA/B/Cティアは過剰。verified/unverified/inferredで十分 | 3段階は読む側の認知負荷が低く、書く側も迷わない |

## 4. Next Steps

- /research SKILL.md に上記Recommendationsを反映する
- 実際に改善版で1本レポートを書いてみて、読みやすさを検証する

## 5. Sources

- [anthropics/skills (GitHub)](https://github.com/anthropics/skills) - Anthropic公式スキルリポジトリ
- [daymade/claude-code-skills (GitHub)](https://github.com/daymade/claude-code-skills) - deep-researchスキル含む37スキル
- [Weizhena/Deep-Research-skills (GitHub)](https://github.com/Weizhena/Deep-Research-skills) - 3フェーズリサーチスキル
- [levnikolaevich/claude-code-skills (GitHub)](https://github.com/levnikolaevich/claude-code-skills) - 101スキルのフルワークフロー
- [travisvn/awesome-claude-skills (GitHub)](https://github.com/travisvn/awesome-claude-skills) - Claude Codeスキルキュレーション
- [Gemini Deep Research (Google)](https://ai.google.dev/gemini-api/docs/deep-research) - Gemini Deep Research公式ドキュメント
- [ChatGPT Deep Research FAQ (OpenAI)](https://help.openai.com/en/articles/10500283-deep-research-faq) - ChatGPT Deep Research FAQ
- [Perplexity Pages](https://www.perplexity.ai/hub/blog/perplexity-pages) - Perplexity Pagesブログ
- [Google Gemini for Research Reports (DataStudios)](https://www.datastudios.org/post/google-gemini-for-research-reports-structure-citations-and-output-formats) - Geminiレポートフォーマット解説
- [Amazon 6-Pager Template](https://www.sixpagermemo.com/blog/amazon-six-pager-template) - Amazon 6ページメモ形式
- [Gartner Critical Capabilities Methodology](https://www.gartner.com/en/research/methodologies/research-methodologies-gartner-critical-capabilities) - Gartner評価手法
- [GitBook Documentation Structure Tips](https://gitbook.com/docs/guides/docs-best-practices/documentation-structure-tips) - ドキュメント構造のベストプラクティス
