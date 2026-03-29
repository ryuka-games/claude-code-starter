---
date: 2026-03-29
source: "リサーチ（文章と図解の使い分け）"
tags: [writing, visual-design, cognitive-load]
related:
  - "[わかりやすい文章の原則](025-clear-writing-principles.md)"
  - "[ドキュメント構成](021-document-structure-best-practices.md)"
---

# 文章と図解の使い分け — 情報の性質でフォーマットを選ぶ

> **TL;DR**: 「文章が多いから図にしろ」ではなく「この情報は何か」で最適フォーマットが決まる。概念は文章、構造は図、比較は表、手順はフローチャート。Mayerの研究で文章+図の組み合わせが単独より学習効果が高いと実証されている。

## 情報の性質ごとの最適フォーマット

| 情報の性質 | 最適フォーマット | 理由 |
|---|---|---|
| 概念・定義・理由 | 文章 | 論理的展開、ニュアンスの表現に強い |
| 構造・関係・配置 | 図（ダイアグラム） | 空間的に情報が集まり推論コストが下がる |
| 手順・フロー | 番号リスト or フローチャート | 線形処理に適合 |
| 比較・選択肢 | 表 | 横断スキャンが容易 |
| 数値トレンド | グラフ | パターン認識が直感的 |
| before/after | コードブロック並置 | worked example効果で説明より深く理解される |
| 1文で言い切れる | 文章のまま | 図は不要 |

## Mayerのマルチメディア学習原則（重要なもの）

- **マルチメディア原則**: テキスト+図 > テキストだけ
- **空間近接原則**: 関連するテキストと図は近くに配置
- **一貫性原則**: 無関係な装飾は認知負荷を上げる。削除
- **セグメンティング原則**: 長い説明を分割して読者がペースを制御できるように

## 認知負荷を下げる設計

| 負荷 | 対策 |
|---|---|
| 外在的（提示方法の悪さ） | 無関係な情報を削除、関連情報を近接配置 |
| 内在的（内容の難しさ） | 前提知識を先に提示、チャンク化 |
| 有効的（スキーマ構築） | 適切な例示、比較・対照 |

## Sources

- [Larkin & Simon 1987](https://www.semanticscholar.org/paper/Why-a-Diagram-is-(Sometimes)-Worth-Ten-Thousand-Larkin-Simon/b7bdd9331ed1ecbc931ccaf50c091cd0bb8b71b7)
- [Mayer's 12 Principles](https://waterbearlearning.com/mayers-principles-multimedia-learning/)
- [Worked-example effect](https://en.wikipedia.org/wiki/Worked-example_effect)
- [Information Mapping](https://ivacheung.com/2012/11/introduction-to-information-mapping/)
