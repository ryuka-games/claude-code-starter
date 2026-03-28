# 「追記 vs 新規ファイル」の設計判断

## Summary

**結論**: デフォルトは追記。200行超 or 独立サブテーマ発生 or 頻繁参照で分割。分割時はSummary Style（元ファイルに要約を残す）
**推奨アクション**: 同テーマの情報は既存ファイルに追記。ファイル名は内容ベースのslug（日付プレフィックス不要）
**根拠**: Zettelkasten/Evergreen Notes/Obsidian5年実践/認知科学/Wikipedia/LLMのLost in the Middle問題が一貫してこの方向を支持

## 分割トリガー（1つ以上満たしたら分割）

| # | 条件 | 根拠 |
|---|---|---|
| 1 | 200行を超えた | CLAUDE.md推奨 + LLMのLost in the Middle問題 |
| 2 | 明確に独立したサブテーマが生まれた | Zettelkasten/Evergreen Notesのseparation of concerns |
| 3 | 他のファイルから頻繁に参照される部分がある | 参照ターゲットは独立ファイルのほうが精度が高い |

## 追記を維持する条件

| # | 条件 | 根拠 |
|---|---|---|
| 1 | 同一テーマの情報が時系列で追加される | Obsidian 5年実践。思考の一貫性 |
| 2 | 追記後も200行以下 | 閾値以下なら分割のメリットがコストを上回らない |
| 3 | 分割すると空っぽなファイルが生まれる | Wikipedia「短すぎる内容は独立させない」 |

## 分割時のパターン: Summary Style

```
分割前: search-requirements.md (250行)

分割後:
  search-requirements.md (80行) ← 要約+リンクを残す
  search-tech-constraints.md (120行) ← 詳細を子ファイルに
```

元ファイルを読むだけで全体像がわかる。詳細が必要なときだけ子ファイルを読む。

## ファイル名ルール

- **内容ベースのslug**: `search-requirements.md`
- **日付プレフィックス不要**: 追記が基本だから日付でファイルを分ける必要がない。日付はfrontmatterのdateに入れる

## 各理論の立場

| 理論 | 追記支持 | 分割支持 |
|---|---|---|
| Zettelkasten | | 「原則であって法則ではない。コンパスとして使え」 |
| Obsidian 5年実践 | 「思考の一貫性が保てる」 | ハイブリッド推奨 |
| Evergreen Notes | 「ノートは育てるもの」 | 「separation of concerns」 |
| 認知科学 | | セグメンテーションが認知負荷を下げる |
| Wikipedia | | 8,000語超で分割検討 |
| LLM | | 200行以下/ファイル。Lost in the Middle問題 |

## Sources

- [Zettelkasten Atomicity Guide](https://zettelkasten.de/atomicity/guide/)
- [Evergreen Notes (Andy Matuschak)](https://notes.andymatuschak.org/Evergreen_notes)
- [Obsidian 5-Year Reflections](https://forum.obsidian.md/t/long-notes-or-short-notes-my-5-year-reflections/102138)
- [Wikipedia:Article size](https://en.wikipedia.org/wiki/Wikipedia:Article_size)
- [Lost in the Middle (Stanford/MIT)](https://arxiv.org/abs/2307.03172)
- [CLAUDE.md Best Practices](https://code.claude.com/docs/en/best-practices)
