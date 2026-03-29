---
date: 2026-03-29
source: "自分の判断（spec readinessリサーチ後）"
tags: [checker, spec-readiness, workflow]
related:
  - "[ナレッジ管理の設計](knowledge-management-structure.md)"
---

# spec準備完了チェックはVET3問で軽く行う

> **TL;DR**: /checkerスキルで「誰の問題か（Value）」「開発者が判断できるか（Estimable）」「テスト可能か（Testable）」の3問だけチェック。Go/No-Goではなく足りないものリストを返す。使いたいときだけ使う。

## VETチェック3問

| # | 質問 | 視点 |
|---|---|---|
| 1 | 誰のどんな問題を解決するか明確か？ | ビジネス（Value） |
| 2 | 開発者がアーキテクチャ判断できる程度に明確か？ | 技術（Estimable） |
| 3 | テスト可能な受け入れ基準が書けるか？ | QA（Testable） |

Three Amigosの3視点（Business/Dev/QA）とINVESTのVETに対応。

## なぜ3問に絞ったか

**DoRはアンチパターンになりうる。** 厳格なDoRはステージゲートになり進行を阻害する。チェックボックスを埋めること自体が目的化する。IEEE品質属性やINVEST6基準を全部チェックすると重すぎて使われなくなる。

## Go/No-Goではなく足りないものリスト

「通過/不通過」のバイナリ判定はしない。足りないものを具体的にリストする:
- 「ユーザーの課題が明確でない。docs/inbox/の打合せメモを確認するか、ユーザーインタビューが必要」
- 「技術制約が不明。ARCHITECTURE.mdを確認するか、PoC実施が必要」

## 独立スキルで任意実行

specの前に強制しない。使いたいときだけ`/checker`で実行。とりあえずspecに渡してみて足りなかったら追加する、でもOK。
