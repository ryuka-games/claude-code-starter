# Research Report: ホワイトボードパターンと共有メンタルモデル — Agent Teamsの協調品質を上げる設計

## 1. Executive Summary

**Agent Teamsの最大の弱点は「各エージェントが独立コンテキストを持ち、他のエージェントの発見を知らない」こと。** ホワイトボードパターン（共有Markdownファイルを1枚置くだけ）で、相互参照・横断的洞察・用語統一が実現できる。これは1970年代の音声認識AI（HEARSAY-II）から続くBlackboard Architectureの現代版であり、チーム心理学の「共有メンタルモデル」理論とも合致する。導入コストはほぼゼロ（テンプレート1枚）で、既存の起動プロンプトに組み込むだけで効果が出る。

## 2. ホワイトボードパターン（Blackboard Architecture）

### 2.1 歴史と定義

| 年代 | 出来事 | 意義 | Confidence |
|---|---|---|:---:|
| 1971-76 | HEARSAY-II（CMU） | 最初のBlackboardシステム。音声認識で10以上の知識源が共有データ構造上で協調 | verified |
| 1980年代 | BB1（Barbara Hayes-Roth） | メタ制御機構の追加。Blackboardが問題解決だけでなく制御戦略も共有 | verified |
| 1986 | H. Penny Nii の論文（AI Magazine, Part 1 & 2） | Blackboard Architectureの体系化。3構成要素（知識源・黒板・制御ユニット）を定義 | verified |
| 2025 | LbMAS（arxiv 2507.01701） | LLMマルチエージェントでBlackboard初実装。MMLU 85.35%、CoT比+4.33%、トークン消費量も削減 | verified |
| 2025 | Happy Elements社の実践 | Claude Code Agent Teamsでの「ホワイトボードパターン」として実用化 | verified |

**Blackboard Architectureの3構成要素:**

| 構成要素 | 古典的定義 | Agent Teamsでの対応 |
|---|---|---|
| **Knowledge Sources（知識源）** | 独立した専門モジュール | 各エージェント（PM, FE, QA等） |
| **Blackboard（黒板）** | 全体の共有データベース。部分解を蓄積 | 共有Markdownファイル（`WHITEBOARD.md`） |
| **Control Unit（制御）** | 次に実行する知識源を選択 | Team Lead（PM）が調整 |

### 2.2 LLMマルチエージェントでの学術的検証

arxiv 2507.01701（LbMAS）の実験結果:

| ベンチマーク | LbMAS | Chain-of-Thought | 差分 | Confidence |
|---|---|---|---|:---:|
| MMLU | 85.35% | 81.02% | +4.33% | verified |
| GPQA-Diamond | 54.04% | — | 最高性能 | verified |
| MATH | 72.60% | — | 静的MAS比+5.02% | verified |
| トークン消費 | 4.7M | — | AFlow比71%削減 | verified |

**なぜBlackboardがトークン効率に優れるか:** 従来のエージェント個別メモリを廃止し、Blackboardを統一メモリとして機能させることで重複を排除。さらにCleanerエージェントが冗長メッセージを自動削除する。

### 2.3 Claude Code Agent Teamsでの実践（Happy Elements社）

Happy Elements社の記事による比較実験:

| 観点 | デフォルト構成 | ホワイトボード導入後 | Confidence |
|---|---|---|:---:|
| 相互参照 | なし（2つの独立レポート） | Agent Bが先行Agent Aの発見を明示的に参照・検証 | verified |
| 横断的洞察 | 0件 | 4件出現 | verified |
| 用語統一 | 各自独自の用語 | Agent Aの用語をBが継承 | verified |
| 検証行動 | なし | Agent Aの予測を4件中4件検証 | verified |
| 成果物 | 2つの独立レポート | 1つの統合分析 | verified |

**3つの重要要素:** ゴール明示、接続点の可視化、構造化された書き込み欄。

## 3. 共有メンタルモデル（Shared Mental Model）

### 3.1 理論的背景

| 概念 | 定義 | 出典 | Confidence |
|---|---|---|:---:|
| **Shared Mental Model** | チームメンバーが共有する、タスク・チーム・環境に関する心的表象 | Cannon-Bowers, Salas & Converse (1993) | verified |
| **暗黙的協調（Implicit Coordination）** | 明示的なコミュニケーションなしにチームメンバーが協調行動を取れること。SMMの主要な効果 | Rico et al. (2008) | verified |
| **4つのメンタルモデル** | Equipment Model, Task Model, Team Interaction Model, Team Model | Cannon-Bowers et al. (1993) | verified |

**SMMがパフォーマンスに与える影響:** チームメンバーが類似したメンタルモデルを持つと、タスク負荷が高い期間にコミュニケーションオーバーヘッドを削減しながら協調行動を維持できる。これが「暗黙的協調」の本質。

### 3.2 AIエージェントチームへの応用

| 人間チームのSMM | Agent TeamsでのSMM | 実現手段 |
|---|---|---|
| タスクモデル（何をするか） | ゴール・スコープの共有 | WHITEBOARD.mdの`## Goal`セクション |
| チームモデル（誰が何を担当するか） | 役割分担と依存関係の理解 | `## Team Structure`と`## How Our Work Connects` |
| 装備モデル（ツール・環境の理解） | コードベース・アーキテクチャの共有理解 | CLAUDE.md + ARCHITECTURE.md |
| チーム相互作用モデル（コミュニケーションの仕方） | メッセージングの規約 | 起動プロンプトのルールセクション |

### 3.3 ホワイトボードとSMMの関係

**ホワイトボードはSMMを「外在化」する装置。** 人間チームではSMMは各メンバーの頭の中にあるが、AIエージェントは独立コンテキストを持つためSMMが自然発生しない。ホワイトボードファイルが「共有された脳」として機能し、以下を実現する:

- **ゴールの整合性**: 全員が同じ問いに答えようとする
- **知識の伝播**: 先行エージェントの発見が後続エージェントの前提になる
- **用語の統一**: 最初に使われた用語が継承される
- **検証行動の促進**: 他者の仮説を確認・反証する動機が生まれる

## 4. 実践的な導入方法

### 4.1 ホワイトボードテンプレート

```markdown
# Whiteboard: {トピック}

## Goal
{チームが最終的に答えるべき問い}

## Team Structure
- Agent A: {担当領域}
- Agent B: {担当領域}

## How Our Work Connects
{2人の仕事の接続点を明示。例: 「Aのパフォーマンス分析結果がBのアーキテクチャ提案の制約になる」}

## Key Questions
1. {両方の視点が必要な問い}
2. {両方の視点が必要な問い}
3. {両方の視点が必要な問い}

---

## Agent A Findings
（Agent A: ここに書く）

## Agent B Findings
（Agent B: ここに書く）

## Cross-Cutting Observations
（どちらでも: 横断的な観察を書く）
```

### 4.2 既存の起動プロンプトへの組み込み方

現在のAgent Teams起動プロンプト（`docs/guides/agent-teams.md`）に追加すべき要素:

**Step 1: ホワイトボードファイルの作成指示をワークフローの冒頭に追加**

```
### Phase 0: ホワイトボード作成（PM実行）
- `WHITEBOARD.md` をプロジェクトルートに作成する
- 以下を記入:
  - Goal: このスプリントで達成すべきこと（spec/planから抽出）
  - Team Structure: 各メンバーの担当領域
  - How Our Work Connects: メンバー間の依存関係と接続点
  - Key Questions: 複数メンバーの視点が必要な未解決の問い
- 全メンバーにWHITEBOARD.mdを最初に読むよう指示する
```

**Step 2: 各メンバーへの書き込みルールを追加**

```
## ホワイトボードルール
- 作業開始前にWHITEBOARD.mdを読む
- 重要な発見・判断はWHITEBOARD.mdの自分のセクションに書く
- 他メンバーのセクションは読むが編集しない
- 横断的な気づきは「Cross-Cutting Observations」に書く
- PMは定期的にホワイトボードを確認し、接続点が見落とされていれば指摘する
```

### 4.3 使い分けガイド

| シナリオ | ホワイトボード | 理由 |
|---|---|---|
| 並列調査（仮説検証） | **必要** | 先行発見が後続の調査方向を変える |
| 並列レビュー（観点分割） | **推奨** | ゴール共有で重複を防ぐ |
| クロスレイヤー開発（FE+BE+QA） | **推奨** | API契約やデータフローの合意を可視化 |
| 完全に独立した並行作業 | **不要** | 接続点がないならオーバーヘッドになる |
| 3人以上の大チーム | **構造変更が必要** | セクション増加でファイルが肥大化。ドメイン別にファイルを分割するか検討 |

### 4.4 フォーマット設計の指針

**何を書かせるか:**

| 書くべき内容 | 書かない方がいい内容 |
|---|---|
| 結論・判断とその根拠 | 作業ログ・詳細手順 |
| 他メンバーへの影響がある発見 | 自分だけで完結する中間結果 |
| 未解決の問い・懸念 | 解決済みの既知情報 |
| API契約・データ形式の合意 | コードスニペット（長いもの） |
| 用語の定義 | 一般的な技術用語の説明 |

### 4.5 既知の課題と制限

| 課題 | 影響 | 対策 | Confidence |
|---|---|---|:---:|
| 同時書き込みの競合 | 2エージェントが同時にWHITEBOARD.mdを編集すると上書き事故 | 逐次実行にする、またはセクション単位でファイルを分割 | verified |
| ファイル肥大化 | 3人以上で書くとファイルが長くなり、読むコストが増大 | 2人チーム推奨。大チームではドメイン別に分割 | verified |
| 書き込み品質のばらつき | エージェントが冗長な内容を書く、または書き忘れる | プロンプトで「結論と根拠のみ」「作業開始前に必ず読む」を明示 | inferred |
| リーダーの負荷増 | ホワイトボードのファシリテーションが増える | Delegate Mode + 「接続点の指摘」に集中させる | inferred |
| 3人以上での効果未検証 | Happy Elements社の検証は2人チーム限定 | 大規模チームでの検証が必要。planning-with-teamsプラグインは3ファイル分散で対応 | unverified |

## 5. 関連アプローチとの比較

| アプローチ | 仕組み | 強み | 弱み |
|---|---|---|---|
| **ホワイトボード（本稿）** | 共有Markdown 1枚 | 導入コストゼロ、即効性 | 同時書き込み競合、3人以上で肥大化 |
| **planning-with-teams** | 3ファイル分散（plan/findings/progress） | 役割分離が明確、ログが残る | ファイル管理が増える |
| **SendMessageのみ** | エージェント間直接メッセージ | 標準機能、追加設定不要 | 全体像が可視化されない、後続が先行を知らない |
| **CLAUDE.md + ARCHITECTURE.md** | プロジェクト固有の共有コンテキスト | セッション開始時に全員が読む | 静的（実行中に更新されない） |
| **LbMAS（学術）** | 公開/私有空間を持つ構造化Blackboard + Cleanerエージェント | トークン効率、スケーラビリティ | Claude Code Agent Teamsでは未実装 |

## 6. Recommendations

| # | 何を変えるか | どう変えるか | なぜ |
|---|---|---|---|
| 1 | Agent Teams起動プロンプトにPhase 0（ホワイトボード作成）を追加 | `docs/guides/agent-teams.md`の「ワークフロー」セクション冒頭に、PMがWHITEBOARD.mdを作成するステップを挿入 | 現状は各エージェントが独立コンテキストで動くため、横断的洞察が生まれない。ファイル1枚で劇的に改善できる |
| 2 | ホワイトボードテンプレートをskillsに追加 | `template/.claude/skills/`にホワイトボード作成のスキルまたはテンプレートを配置 | 毎回手書きだと品質がばらつく。テンプレート化で安定した効果 |
| 3 | 2人チームの調査タスクから導入開始 | コード変更を伴わないリサーチ・レビュータスクで試す | Happy Elements社の検証結果が2人チーム。低リスクで効果を確認してから拡大 |
| 4 | 3人以上のチームではファイル分割を検討 | ドメイン別にWHITEBOARD-{domain}.mdを分けるか、planning-with-teams方式を採用 | 同時書き込み競合と肥大化のリスク |

## 7. Sources

- [Happy Elements社: Agent Teamsのホワイトボードパターン](https://zenn.dev/happy_elements/articles/da2dda3618425c) — Claude Code Agent Teamsでのホワイトボードパターン実践記事
- [Nii (1986): Blackboard Systems Part 1](https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/537) — Blackboard Architectureの体系化論文
- [LbMAS: Exploring Advanced LLM Multi-Agent Systems Based on Blackboard Architecture](https://arxiv.org/abs/2507.01701) — LLMマルチエージェントでのBlackboard初実装
- [LLM-Based Multi-Agent Blackboard System for Information Discovery](https://arxiv.org/abs/2510.01285) — データサイエンス領域でのBlackboard応用
- [Blackboard System (Grokipedia)](https://grokipedia.com/page/Blackboard_system) — Blackboard Architectureの包括的解説
- [Cannon-Bowers, Salas & Converse (1993): Shared mental models in expert team decision making](https://psycnet.apa.org/record/1993-98047-012) — SMMの基礎理論
- [Andrews et al. (2022): The role of shared mental models in human-AI teams](https://www.tandfonline.com/doi/full/10.1080/1463922X.2022.2061080) — Human-AIチームでのSMM理論レビュー
- [planning-with-teams (GitHub)](https://github.com/OthmanAdi/planning-with-teams) — 3ファイル分散型の共有計画プラグイン
- [Claude Code Agent Teams 公式ドキュメント](https://code.claude.com/docs/en/agent-teams) — Agent Teams公式ガイド
- [Agent Teams Best Practices](https://claudefa.st/blog/guide/agents/agent-teams-best-practices) — Agent Teamsベストプラクティスガイド
