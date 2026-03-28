# ドキュメント構成のベストプラクティス — /noteスキルの出力品質向上

## Summary

**結論**: 逆ピラミッド（結論先）+ 内容を語る見出し + テーブル活用の3つが最重要。79%のユーザーは流し読みする
**推奨アクション**: /noteスキルにTL;DR出力と見出しルールを追加
**根拠**: NN/gのアイトラッキング研究、LLMの情報取得精度データ、認知科学のチャンキング理論

## 最重要の3原則

### 1. 逆ピラミッド（結論を先に）

79%のユーザーは新しいページをスキャンし、16%のみが全文を読む（NN/g調査）。冒頭にTL;DR（1-3行の要約）を置く。

### 2. 見出しは内容を語る

「詳細」ではなく「Playwright vs Cypressの比較結果」。LLMもheadingで文脈を判断するため検索精度に直結。

### 3. テーブルが最強のフォーマット

LLMの情報取得精度が最も高い（Markdown-KV形式で60.7%、CSVより16ポイント高い）。人間のスキャンにも最適。

## ノート構成テンプレート

```markdown
# [完全なフレーズのタイトル — 結論を含む]

> **TL;DR**: 1-3行の要約。これだけ読めば要点がわかる。

## [内容を語る見出し]

（2-4段落。テーブル/リスト積極使用）
```

## アンチパターン

| アンチパターン | 対策 |
|---|---|
| テキストの壁 | 2-4文で段落区切り。リスト・テーブルに変換 |
| 見出しが無味乾燥（「詳細」「その他」） | 内容を語る見出しにする |
| 4階層超の見出し | H4以上が必要なら文書を分割 |
| 冗長な前置き | 逆ピラミッドで結論先 |
| 古い情報の放置 | 更新日記載 + 定期レビュー |

## Sources

- [NN/g: How Users Read on the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/)
- [Improving Agents: Best Table Format for LLMs](https://www.improvingagents.com/blog/best-input-data-format-for-llms)
- [Andy Matuschak: Evergreen note titles are like APIs](https://notes.andymatuschak.org/Evergreen_note_titles_are_like_APIs)
- [Miller's Law - Laws of UX](https://lawsofux.com/millers-law/)
