---
date: 2026-03-28
source: "自分のアイデア（ナレッジ管理設計の議論中に発想）"
tags: [visualization, knowledge-management, graph-view]
related:
  - ../decisions/knowledge-management-structure.md
  - qmd-as-search-layer.md
---

# ナレッジベースの上にObsidian的グラフビューを載せたい

> **TL;DR**: データ層（マークダウン+frontmatter）と表示層（グラフビュー）を分離。ツール非依存で、specレビュー・plan管理・ナレッジグラフを同じデータ層に載せる。

## なぜ可視化が欲しいか

specのMarkdownレビューだと要件の見落としが起きやすい。Given/When/Then、要件一覧、エッジケースを人間が見やすく表示したい。ファイル間の関連性もテキストだけでは把握しづらくなってきた。

## データ層はほぼ揃っている

4フォルダ（research/decisions/inbox/ideas）のマークダウンにfrontmatter（date/source/tags）が入っている。**ファイル間のリンク（related）は導入し始めたばかりで、まだ少ない。** タグとリンクが揃えばグラフのノードとエッジになる。

## 可視化で見たいもの

| 見たいもの | データソース | 優先度 |
|---|---|---|
| specのビジュアルレビュー | specs/features/配下のGiven/When/Then | 高（レビュー見落とし防止） |
| ナレッジのグラフビュー | ファイル間のリンク+タグの共起 | 中 |
| plan/tasksの進捗管理 | plan.md + タスクのステータス | 低 |

## 次のアクション

- まずObsidianでdocs/をVaultとして開いてグラフビューを試す（最小コスト）
- 不足があれば自作Webアプリを検討
- MEMORYの「グラフィカル管理アプリ」構想（`memory/knowledge-management-direction.md`）と合流
