# ファイル名の命名規則ベストプラクティス

## Summary

**結論**: 今の暗黙ルール「小文字、ハイフン区切り、英語」はGitHubのデファクトスタンダード。変更不要、明文化するだけ
**推奨アクション**: /noteスキルのファイル名ルールに5項目を明文化
**根拠**: MADR ADR-0005、GitHub/Hugo/Jekyll慣習、CLI検索ツールとの親和性、日本語ファイル名のクロスプラットフォーム問題

## ルール（5項目）

| ルール | 理由 |
|---|---|
| 小文字のみ（kebab-case） | GitHub標準、URL親和性 |
| ハイフン区切り | ripgrepで単語境界マッチが効く（検索の2つ目のインデックス） |
| 英語 | 日本語はNFD/NFC問題あり。日本語はH1タイトルに書く |
| 50-80文字目安 | CLIで一覧表示が読める長さ |
| 内容がわかる名前 | ファイル名だけで内容が推測できる |

## 日本語ファイル名を避ける理由

- macOS（NFD）とWindows/Linux（NFC）で正規化が違い、gitが誤検出する
- CLIでTab補完にIME切り替えが必要
- URLエンコードで長くなる（`%E3%83%95%E3%82%A1...`）
- 解決策: 英語ファイル名 + frontmatterやH1に日本語

## Sources

- [MADR ADR-0005: Use Dashes in Filenames](https://adr.github.io/madr/decisions/0005-use-dashes-in-filenames.html)
- [Harvard Library: File Naming Best Practices](https://guides.library.harvard.edu/c.php?g=1033502&p=7496710)
- [Evergreen note titles are like APIs](https://notes.andymatuschak.org/Evergreen_note_titles_are_like_APIs)
