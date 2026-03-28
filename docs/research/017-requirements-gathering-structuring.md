# 要件の収集・整理・構造化 — specに渡すまでのプロセス

## Summary

**結論**: /researchと/specの間に「要件の収集・整理」のプロセスが抜けている。Refinement Funnel（3段階の成熟度）+ Obsidian的なタグ・リンク管理で解決できる
**推奨アクション**: マークダウン+frontmatter（タグ・ソース・成熟度）のフラット構造で要件を管理するスキルを検討
**根拠**: Spec-KitもKiroも「1セッションでspec完成」が前提。時間をまたぐ要件の蓄積・整理に対応していない

## 課題（ユーザーの声）

1. **リサーチすると結構な量が取得される**: 調査結果が溜まっていくが、どれが最新でどれが使えるかわからなくなる
2. **今日調べて、人に見せて、いろいろ言われて、また調査して**: 時間をまたいでインプットが蓄積する。打合せでの指摘やフィードバックが会話の中で消える
3. **複数の要件が1つのドキュメントに混ざる**: いろいろな観点が混在して整理できない
4. **分けて書くとどこに何があるかわからなくなる**: フォルダ分けしすぎると逆に探せない
5. **結果、全部specスキルに渡してもよくわかんない状態になる**: 人間自身が全体像を把握できていないまま/specに渡すことになる

## ユーザーの提案

1. **マークダウンは確定**: AIベースで使う+人が読みやすい。これは変えない
2. **フォルダ分けは最低限にする**: フォルダ分けしすぎると逆にどこに何があるかわからなくなる。最低限にしないといけない
3. **タグ付けで分類する**: フォルダの代わりにタグで管理。AIが自動でタグをつける
4. **リンクで関連性を持たせる**: ファイル間を関連リンクで繋ぐ
5. **検索でヒットすれば探せる**: タグ+grepで最悪探せる状態にする。AI使ってタグ付け・検索できればうまくいく
6. **Obsidianがやってるような感じ**: フォルダ階層ではなく、フラットなファイル群をタグとリンクで繋ぐ

## ユーザーの理想像

**入口が違っても出口が同じ**仕組み:

```
リサーチ結果 → スキルでタグ付け+分解 → ドキュメントフォルダに蓄積
打合せ議事録 → 同じスキルでタグ付け+分解 → 同じフォルダに蓄積
アイデアメモ → 同じスキルでタグ付け+分解 → 同じフォルダに蓄積
                                                    ↓
                                          検索・タグで人もAIも探せる
                                          「なぜこう決めた？」も辿れる
                                                    ↓
                                              /spec に渡す
```

- リサーチだろうが議事録だろうがアイデアメモだろうが、**同じスキルを通すと同じフォーマット・同じタグ体系**でフォルダに入る
- AIがタグ付けと適切な粒度への分解を担当
- 人間もAIも検索で探せる状態にする
- 「この時なぜこんなことを言ったのか」も辿れる

### 未解決の課題

- **肥大化**: ドキュメントが溜まりすぎたらどうするか。アーカイブ？要約？
- **整理**: 古い情報と新しい情報の鮮度管理。矛盾する情報が入ったときの扱い
- **粒度**: どのくらいの粒度で分解するのが最適か。細かすぎるとファイル数が爆発、粗すぎると混在する

## 核心の知見: Refinement Funnel

```
Level 1: Unknown（生の情報）
  ↓ 整理・クラスタリング・判断
Level 2: Almost Known（機能単位に整理、優先度付き、NCが残ってる）
  ↓ NCの解決・合意
Level 3: Known（specに渡せる状態）
```

今のフローはLevel 1→Level 3に飛んでいる。Level 2が抜けている。

## ユーザーのアイデア: Obsidian的管理

- **マークダウン**: 確定。AIも人間も読みやすい、git管理可能
- **フォルダは最低限**: 分類しすぎない。フォルダの代わりにタグで管理
- **タグ付け**: AIが自動でつける。検索でヒットすればOK
- **リンク**: ファイル間の関連性を持たせる
- **検索**: タグ+grepで探せる状態にする

## 既存ツール・手法の調査結果

### Spec-Driven Development 3ツールの比較

| | Spec-Kit | Kiro | 提案アプローチ |
|---|---|---|---|
| 入力 | 1回のプロンプト | 1回の対話 | 複数ソース × 時間経過 |
| 情報蓄積 | なし（specが起点） | なし | inbox + 構造化ファイル |
| 判断記録 | なし | なし | Decision Log |
| 要件の成熟度 | 2段階 | 暗黙 | 3段階（L1/L2/L3） |
| 時間軸 | 1セッション | 1セッション | 日〜週をまたぐ |

**核心的な差異**: 既存ツールは「1回のセッションでspecを書き上げる」前提。現実は時間をまたぐ。

### 要件構造化の主な手法

| 手法 | 概要 | 使えそうな場面 |
|---|---|---|
| MoSCoW | Must/Should/Could/Won't の4分類 | 優先順位付け。specのP1/P2/P3と親和性高い |
| EARS | When/While/Where/If構文で要件を書く | 曖昧な要件を検出して書き直す |
| User Story Mapping | 行動フロー×優先度の2次元マップ | 機能間の関係と順序を俯瞰 |
| Requirements Triage | 対応すべき/放置OK/不可能の3分類 | 要件が溢れたときのフィルタ |
| Decision Log | なぜこう決めたかを記録 | 判断の経緯を残す。adr/と同じ構造 |

### 偽陽性の観点: AIの要件整理で注意すべき点

- AIは「要件を追加する」方向に偏る。削る判断は人間がすべき
- AIに逆質問させる（NC検出）は既に/specで実証済み。収集段階でも使える
- 「計画を先にやることで、AIと同じ認識に立ち、無駄なサイクルを防ぐ」（Addy Osmani）

## 設計の方向性

### ファイル構造案（Obsidian的 + Refinement Funnel）

```
requirements/
  inbox.md              ← 生の情報を追記（Level 1）
  features/
    search.md           ← 機能単位に整理（Level 2）
    auth.md
  decisions/
    RDR-001-search-scope.md  ← 判断記録
```

### frontmatter案

```yaml
---
title: 検索機能
tags: [search, v1, must-have]
maturity: L2  # L1(unknown) / L2(almost-known) / L3(known=spec ready)
sources:
  - research/005-search-tech.md
  - meeting-0325
related:
  - auth.md  # 検索結果のアクセス制御に影響
priority: must-have  # must/should/could/wont
nc:
  - 検索結果の並び順
  - 表示件数の上限
---
```

### ゲート（チェックポイント）

**Gate 1（inbox → features/）**:
- 情報が1つの機能について2ソース以上集まった
- 明確な要望・制約が含まれている

**Gate 2（features/ → /spec）**:
- Must Haveが明確
- NCがspecで解決できるレベルに絞られている
- ステークホルダーの合意がある（or 判断記録がある）

## Sources

- [Refinement Funnel (Scrum.org)](https://www.scrum.org/resources/blog/refinement-funnel)
- [Martin Fowler - Understanding SDD](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [GitHub Spec-Kit](https://github.com/github/spec-kit)
- [Kiro Specs Documentation](https://kiro.dev/docs/specs/)
- [EARS Official Guide](https://alistairmavin.com/ears/)
- [MoSCoW Prioritization](https://hypersense-software.com/blog/2024/12/03/moscow-prioritization-guide/)
- [MADR (GitHub)](https://github.com/adr/madr)
- [Addy Osmani - AI coding workflow 2026](https://addyosmani.com/blog/ai-coding-workflow/)
- [AI for Requirements Engineering (arXiv)](https://arxiv.org/html/2511.01324v1)
