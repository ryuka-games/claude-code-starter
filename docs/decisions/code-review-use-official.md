---
date: 2026-03-28
source: "自分の判断（公式プラグイン調査後）"
tags: [code-review, plugin, workflow]
related:
  - "[qmdの仕組みと活かし方](../ideas/qmd-as-search-layer.md)"
---

# コードレビューは公式プラグインに任せる

> **TL;DR**: Boris Cherny作の公式/code-reviewプラグインが4エージェント並列+検証サブエージェントで偽陽性率1%未満。自作する必要がない。specとの照合が必要になったらREVIEW.mdで対応。

## なぜ自作しないか

| 観点 | 公式 | 自作 |
|---|---|---|
| アーキテクチャ | 4エージェント並列+検証サブエージェント | 1から設計 |
| 偽陽性率 | 1%未満 | 未知 |
| モデル最適化 | Haiku/Sonnet/Opusの使い分け済み | 手動選定 |
| メンテナンス | Anthropicが保守 | 自分で保守 |

## 足りない部分と対処

公式はdiffベースでspecを参照しない。「この実装はspecの意図に沿ってるか」は見ない。

→ 必要になったらREVIEW.mdにspec照合ルールを書く。それでも足りなければ補完スキルを検討。

## インストール方法

```
/plugin install code-review@claude-plugins-official
/code-review:code-review          # ターミナルに出力
/code-review:code-review --comment  # PRにインラインコメント
```
