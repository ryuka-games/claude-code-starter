# Research Report: Claude Code スターターキット改善点調査

## 1. Executive Summary

現在のテンプレートはBoris Cherny思想に沿った最小構成で、基盤としては良好。しかし、コミュニティの類似リポジトリや公式ドキュメントの最新情報と比較すると、以下の改善機会がある:

- **Plugin System**: 2025年12月に公式プラグインエコシステムが登場。スキル・フック・エージェントをバンドルして配布する仕組み
- **Rules ディレクトリ**: `.claude/rules/*.md` によるモジュラーなルール管理（パス指定対応）が標準化
- **CLAUDE.md imports**: `@path/to/file` 構文でファイル分割・参照が可能に
- **検証ワークフロー不足**: Boris/公式の「#1レバレッジポイント = Claudeに検証手段を与えること」がテンプレートに未反映
- **コミュニティとの差別化**: 日本語対応・Boris思想準拠は独自性あり。ただし41.9k starの大型リポジトリが存在する中で、「最小だが成長できる」という価値提案をより明確にできる

## 2. Background & Objectives

### 調査背景
claude-code-starterリポジトリのテンプレート基盤（Steps 0-6）が完成し、/researchスキルも追加済み。次フェーズとしてワークフロー構築を進める前に、現状の改善点を洗い出す。

### 調査目的
1. 類似リポジトリとの比較で自リポジトリの強み・弱みを特定
2. Claude Code最新機能でテンプレートに反映すべきものを特定
3. Boris思想を維持しつつ改善できるポイントを特定

## 3. Findings

### 3.1 コミュニティの類似リポジトリ

| リポジトリ | Stars | 特徴 | Boris適合度 |
|-----------|-------|------|:-----------:|
| [everything-claude-code](https://github.com/affaan-m/everything-claude-code) | 41.9k | 数十のagents/skills/rules。最大主義 | 低 |
| [claude-code-templates](https://github.com/davila7/claude-code-templates) | 19.7k | CLI+Web UI。100+テンプレート | 低 |
| [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | 23.1k | キュレーションリスト。9カテゴリ | - |
| [claude-code-showcase](https://github.com/ChrisWiles/claude-code-showcase) | - | GitHub Actions連携。JIRA/Slack統合 | 中 |
| [claude-md-templates](https://github.com/abhishekray07/claude-md-templates) | - | 3階層CLAUDE.md。15行以下推奨 | 高 |
| [claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery) | - | 全13フックイベント網羅 | 高 |
| [jarrodwatts/claude-code-config](https://github.com/jarrodwatts/claude-code-config) | - | パス指定ルール。/interviewスキル | 中 |

### 3.2 自リポジトリの強み

1. **Boris思想に忠実な最小テンプレート** — TODOプレースホルダーで「育てる」設計
2. **template/ と docs/ の分離** — コピーするものと参考資料が明確
3. **ADR（設計判断記録）** — 他リポジトリにほぼない
4. **日本語ファースト** — 英語圏以外のニーズに対応
5. **SDD（Spec-Driven Development）パイプライン** — RESEARCH.md → SPEC.md → PLAN.md

### 3.3 自リポジトリの弱み / 改善機会

| 項目 | 現状 | 改善案 | Boris適合度 |
|------|------|--------|:-----------:|
| 検証ワークフロー | なし | CLAUDE.mdテンプレートに「テスト実行で検証する」を追記 | 高（Boris #1推奨） |
| Rules ディレクトリ | なし | `.claude/rules/` をテンプレートに含める（空ディレクトリ or README） | 高 |
| CLAUDE.md imports | 未対応 | `@path/to/file` 構文をガイドに記載 | 高 |
| Plugin System | 未対応 | docs/に説明追加。テンプレートへの影響は最小 | 中 |
| Hooks | なし | Boris思想的には「必要になったら追加」だが、ガイドの更新は必要 | 中 |
| 自己改善指示 | CLAUDE.mdコメントにあるが弱い | テンプレートCLAUDE.mdに明示的な自己改善セクション | 高 |

### 3.4 Claude Code最新機能（2025末〜2026年）

#### テンプレートに反映すべき

| 機能 | 影響 | 対応 |
|------|------|------|
| `.claude/rules/` ディレクトリ | パス指定のモジュラールール | テンプレートに構造追加 |
| `@path/to/file` imports | CLAUDE.md分割 | ガイドに記載 |
| SKILL.md新フィールド (`context: fork`, `agent`, `model`) | スキル高度化 | カスタマイズガイドに追記 |
| Agent新フィールド (`memory`, `skills`, `hooks`, `maxTurns`) | エージェント高度化 | カスタマイズガイドに追記 |
| Plugin System | スキル配布の新標準 | docs/に新ガイド追加 |
| `$ARGUMENTS[N]` 構文変更 | 破壊的変更 | fix-issue/researchスキルは影響なし |

#### 認識しておくべき（テンプレート変更は不要）

| 機能 | 内容 |
|------|------|
| Auto Memory | `~/.claude/projects/<project>/memory/` に自動保存。テンプレート不要 |
| Task Management | TaskCreate/TaskUpdate等。組み込み機能 |
| Agent Teams | 実験的。テンプレートから起動不可 |
| npm install非推奨 | `claude install` に移行 |
| Keybindings | `/keybindings` で設定。テンプレート不要 |

### 3.5 公式ベストプラクティスとの比較

| 公式推奨 | 自リポジトリの状況 | ギャップ |
|---------|-------------------|---------|
| 「Claudeに検証手段を与えるのが最大のレバレッジ」 | テンプレートにBuild & Testコマンドあり | テストで検証する文化をもっと強調すべき |
| CLAUDE.mdは短く、人間が読める形に | 最小テンプレート。OK | なし |
| Skillsはドメイン知識のオンデマンド読み込み | fix-issue + research。OK | なし |
| `/clear` でタスク間をリセット | チートシートに記載済み | なし |
| Hooksは「助言ではなく強制」 | テンプレートにHooksなし | ガイドには記載済み。Boris思想的にOK |
| Rules で CLAUDE.md をモジュラー化 | 未対応 | rules/ ディレクトリの追加を検討 |

## 4. Comparison Table

### ポジショニング比較

| 特性 | 自リポジトリ | everything-claude-code | claude-md-templates |
|------|:----------:|:---------------------:|:-------------------:|
| 初期テンプレートサイズ | 最小 | 最大 | 最小 |
| スキル数 | 2 | 10+ | 0 |
| ドキュメント量 | 多い | 少ない | 少ない |
| Boris思想適合 | 高 | 低 | 高 |
| 成長ガイド | あり | なし | 一部 |
| 日本語対応 | 完全 | なし | なし |
| SDD対応 | あり | なし | なし |
| Plugin対応 | なし | なし | なし |
| Rules対応 | なし | あり | なし |
| ADR | あり | なし | なし |

## 5. Recommendations

### 優先度高（Boris思想に沿い、効果が高い）

1. **CLAUDE.mdテンプレートに検証セクション追加**
   - 「テストを実行してから完了を宣言する」をテンプレートに追記
   - Boris/公式の#1レバレッジポイント

2. **カスタマイズガイドを最新機能で更新**
   - SKILL.md新フィールド（`context: fork`, `agent`, `model`）
   - Agent新フィールド（`memory`, `skills`, `hooks`, `maxTurns`）
   - Hook新タイプ（`prompt`, `agent`）と新イベント
   - `@path/to/file` imports

3. **setup.shのnpm非推奨警告**
   - README/setup.shで `claude install` を案内

### 優先度中（余裕があれば）

4. **Plugin Systemのガイド追加**
   - `docs/guides/plugins.md` として新ガイド
   - 公式プラグインの使い方と自作方法

5. **Rules ディレクトリの紹介をカスタマイズガイドで強化**
   - パス指定ルールのパターンはすでに記載済みだが、最新の正式機能として強調

6. **awesome-claude-codeへのリンク追加**
   - README.mdのドキュメントセクションに外部リソースとして

### 優先度低（将来検討）

7. **サンプルプロジェクト**
   - テンプレートを適用した実プロジェクト例（before/after）
   - 現状はsetup.shとREADMEで十分とも言える

8. **スキル命名規則の統一**
   - fix-issue（ハイフン）vs techdebt（なし）の混在
   - 軽微な問題。実害なし

## 6. Next Steps

1. 優先度高の3項目から着手
2. カスタマイズガイドの最新機能更新が最もボリュームあり
3. CLAUDE.mdテンプレートの検証セクション追加は小さい変更で効果大
4. 上記完了後、create SPEC.md from these findings

## 7. Sources

### 類似リポジトリ
- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) - 23.1k stars
- [everything-claude-code](https://github.com/affaan-m/everything-claude-code) - 41.9k stars
- [claude-code-templates](https://github.com/davila7/claude-code-templates) - 19.7k stars
- [claude-code-showcase](https://github.com/ChrisWiles/claude-code-showcase)
- [claude-md-templates](https://github.com/abhishekray07/claude-md-templates)
- [claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery)
- [jarrodwatts/claude-code-config](https://github.com/jarrodwatts/claude-code-config)
- [serpro69/claude-starter-kit](https://github.com/serpro69/claude-starter-kit)
- [alexeykrol/claude-code-starter](https://github.com/alexeykrol/claude-code-starter)

### 公式ドキュメント
- [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices)
- [Claude Code Skills](https://code.claude.com/docs/en/skills)
- [Claude Code Hooks](https://code.claude.com/docs/en/hooks)
- [Claude Code Subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code Memory](https://code.claude.com/docs/en/memory)
- [Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams)
- [Claude Code CLI Reference](https://code.claude.com/docs/en/cli-reference)
- [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)

### 記事・ブログ
- [Boris Cherny Workflow - Karo Zieminski](https://karozieminski.substack.com/p/boris-cherny-claude-code-workflow)
- [How Boris Uses Claude Code - Paddo](https://paddo.dev/blog/how-boris-uses-claude-code/)
- [Lean Claude Code for Production - Nizar](https://nizar.se/lean-claude-code-for-production/)
- [Complete Guide to CLAUDE.md - Builder.io](https://www.builder.io/blog/claude-md-guide)
- [CLAUDE.md Best Practices - Arize](https://arize.com/blog/claude-md-best-practices-learned-from-optimizing-claude-code-with-prompt-learning/)
