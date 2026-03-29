---
date: 2026-03-29
source: "リサーチ（わかりやすい文章術）"
tags: [writing, article-skill, abstraction]
related:
  - "[ドキュメント構成](021-document-structure-best-practices.md)"
---

# わかりやすい文章の原則 — AI生成テキストの典型的問題と対策

> **TL;DR**: AIは具体を抽象に置き換えてしまう（抽象のはしご問題）。具体→抽象の順で書く。抽象だけで終わらない。旧情報→新情報の順序で文を繋ぐ。

## 抽象のはしご（S.I. ハヤカワ, 1939）

具体的な事実を抽象化するほど意味が薄くなる:
- 「Slackでフィードバックをもらう」（具体・下段）
- 「人から来る情報」（抽象・上段）← 読者は「何のこと？」

ルール: 具体を先に書いてから抽象。抽象だけで終わらない。

## Google Technical Writing + Plain Language

- 1文1アイデア
- 能動態（「誰が何をするか」を主語に）
- 「抽象語より具体語を優先する」（H.W. Fowler, 1906）

## 文と文の接続: 旧情報→新情報

文の最初に「読者が既に知っていること」、文末に「新しい情報」。これで繋がりが自然になる。

## AI文章の典型的問題

| 問題 | 対策 |
|---|---|
| 具体→抽象に勝手に飛ばす | 具体例を先に、抽象は後に |
| 名詞化が多い（「実装する」→「実装の実行」） | 動詞に戻す |
| 指示語が不明確（「これ」が何かわからない） | 「この不整合」のように名詞をつける |
| 末尾の「重要性を強調して」で締める | 削除するか具体的内容に置き換え |
| 形式的な対比（Not only...but...） | 対比が事実として成立するか確認 |

## Sources

- [抽象のはしご - Toolshero](https://www.toolshero.com/communication-methods/ladder-of-abstraction/)
- [Google Technical Writing One](https://developers.google.com/tech-writing/one)
- [Plain Language Guidelines](https://plainlanguage.gov/guidelines/)
- [旧情報→新情報 - Yale](https://poorvucenter.yale.edu/sites/default/files/2024-12/Coherence%20and%20Flow%20From%20Old%20to%20New%20Information%20GWL%20Handout.pdf)
- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
