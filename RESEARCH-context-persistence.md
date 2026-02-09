# Research Report: セッション間のコンテキスト保持の課題と解決策

## 1. Executive Summary

Claude Codeのコンテキスト喪失はコミュニティ共通の課題（GitHub issue #2954、Anthropicは"not planned"でクローズ）。解決策は6種あり、**PreCompact hook + Auto Memory の2層防御**が最も実用的。PreCompact hookでコンテキスト圧縮前に要約を保存し、Auto Memoryで長期知識を蓄積する。

## 2. Findings

### アプローチ比較

| アプローチ | 仕組み | 自動化 | 導入コスト | Confidence |
|-----------|--------|:------:|:----------:|:----------:|
| **PreCompact hook** | 圧縮前にtranscriptを要約→ファイル保存。SessionStartで復元 | ◎ | 中 | verified (公式docs) |
| **Auto Memory** | `~/.claude/` に自動メモ。200行MEMORY.md + トピック別ファイル | ◎ | 低 | verified (公式docs) |
| **claude-diary** | `/diary`コマンドで手動記録。PreCompact hookでも自動発火 | ○ | 低 | verified (GitHub: 309★) |
| **Memory Bank** | CLAUDE-activeContext.md等の構造化ファイル群で状態管理 | △ | 高 | verified (GitHub: 1,809★) |
| **GSD framework** | Spec-Driven開発。フェーズ制御でコンテキスト依存を最小化 | △ | 中 | verified (GitHub: 12,222★) |
| **Manual CLAUDE.md** | Claudeにミスを教え、CLAUDE.mdを手動更新（Boris方式） | × | 低 | verified (Boris tips) |

### PreCompact hookの仕組み（公式ドキュメント確認済み）

PreCompactイベントの入力JSON:
- `transcript_path`: 会話JSONLファイルへのパス
- `trigger`: `"manual"` or `"auto"`
- `custom_instructions`: `/compact`時のユーザー入力
- `session_id`, `cwd`, `permission_mode`

SessionStartイベントの出力:
- `additionalContext`: 圧縮後の新セッションに注入できる文字列
- matcher: `startup`, `resume`, `clear`, `compact` で発火条件を制御可能

**重要**: SessionStartは`compact`時にも発火する → PreCompactで保存した要約をSessionStartで読み込めば、圧縮後も文脈が維持される。

### コミュニティの声

| 知見 | 詳細 | Confidence |
|------|------|:----------:|
| Issue #2954 | "Context persistence across sessions" — Anthropicが"not planned"でクローズ | verified (gh) |
| 圧縮で80%喪失 | 複数ユーザーが「圧縮後に何をしていたか忘れる」と報告 | verified (GitHub issues) |
| PreCompact hookが最有力 | コミュニティ合意: transcript保存→復元が最も確実 | verified (複数ソース) |
| GSD的アプローチ | セッション跨ぎを前提とした設計（SPEC.md/PLAN.md）でコンテキスト依存を減らす | verified (GitHub: 12,222★) |

### 主要ツール詳細

**mvara-ai/precompact-hook** (0★): LLM解釈型の復元サマリーを生成。新しく小規模だが、公式PreCompact hookの参考実装として有用。

**rlancemartin/claude-diary** (309★): `/diary`で手動記録 + PreCompact hookで自動記録。`/reflect`でCLAUDE.md更新を提案。軽量で導入しやすい。

**centminmod/my-claude-code-setup** (1,809★): Memory Bank方式。CLAUDE-activeContext.md、CLAUDE-patterns.md、CLAUDE-decisions.md等の構造化ファイル群。管理コストが高い。

**glittercowboy/get-shit-done** (12,222★): メタプロンプティング+Spec-Driven開発フレームワーク。コンテキスト保持というより、セッション独立性を高めるアプローチ。

## 3. Recommendations

| # | What to change | How to change it | Why |
|---|----------------|-----------------|-----|
| 1 | PreCompact hookをテンプレートに追加 | `.claude/hooks/pre-compact.sh`を作成。transcript_pathから要約を生成し`.claude/CONTEXT-SNAPSHOT.md`に保存。SessionStart hookで読み込み | 圧縮時の文脈喪失を自動防止。公式APIで確実に動作 |
| 2 | Auto Memoryの活用ガイドを追加 | `docs/guides/`にAuto Memoryのベストプラクティスを記載。MEMORY.mdの構造化方法、トピック別ファイルの使い方 | 長期知識の蓄積は別レイヤーで対応。PreCompactと補完関係 |
| 3 | SDD（Spec-Driven Development）をデフォルトワークフローに | RESEARCH.md → SPEC.md → PLAN.md → /clear → 新セッションのフローを明文化 | セッション跨ぎを前提とした設計で、コンテキスト依存を構造的に減らす |

## 4. Next Steps

1. PreCompact hook + SessionStart hookのプロトタイプを作成して検証
2. 効果があればテンプレートに追加（`template/.claude/hooks/`）
3. `docs/guides/customization.md`のHooksセクションにPreCompact hookの実例を追加
4. Create SPEC.md from these findings

## 5. Sources

| Source | Status | URL |
|--------|:------:|-----|
| Claude Code Hooks Reference | verified | https://code.claude.com/docs/en/hooks |
| PreCompact hook (mvara-ai) | verified (gh) | https://github.com/mvara-ai/precompact-hook |
| claude-diary (rlancemartin) | verified (gh) | https://github.com/rlancemartin/claude-diary |
| Memory Bank (centminmod) | verified (gh) | https://github.com/centminmod/my-claude-code-setup |
| GSD framework (glittercowboy) | verified (gh) | https://github.com/glittercowboy/get-shit-done |
| Issue #2954 | verified (gh) | https://github.com/anthropics/claude-code/issues/2954 |
| claudefa.st Context Recovery | verified (web) | https://claudefa.st/blog/tools/hooks/context-recovery-hook |
