# ナレッジ管理のフォルダ分け・分類法の調査

## Summary

**結論**: フォルダ4つが認知科学的に最適。提案の4分類は方向性OK、ただし「notes」→「ideas」、「meetings」→「inbox」に改名すべき
**推奨アクション**: research / decisions / inbox / ideas の4フォルダ + タグを第二軸で横断
**根拠**: Miller's Law（7±2）、Hick's Law、PARA/ACE/Zettelkasten全てが4-5カテゴリに収束

## 主要な分類法の比較

| 分類法 | フォルダ数 | 原則 |
|---|---|---|
| PARA | 4 | 「何についてか」ではなく「何をするか」で分類 |
| Zettelkasten | 0（フラット） | フォルダ分類を拒否。リンクで構造を作る |
| Johnny Decimal | 最大10 | 数値プレフィックスで固定位置 |
| ACE | 3+2 | 知識・時間・行動の3ヘッドスペース |
| GTD | 1+43 | 「次にどうするか」で分岐 |

## 認知科学の知見: フォルダ数の最適値

| フォルダ数 | 評価 |
|---|---|
| 2-3 | やや少ない。成長時に構造破壊が起きやすい |
| **4-5** | **最適ゾーン。ほぼ全ての分類法がこの範囲** |
| 6-7 | 許容範囲。全部覚えていられるか要注意 |
| 8+ | 多すぎ。「どこに入れるか」の迷いが発生 |

## 提案4分類の問題点と改善

### 問題1: 「notes」が曖昧

アイデア、草稿、TODO、日記、全部がnotesに入る。成長すると雑多になる。

→ **「ideas」に改名**。「自分の思考・アイデア」と意図が明確になる

### 問題2: 「meetings」が狭い

Slackフィードバック、メール指摘、チャットでの要望はmeetingsじゃない。「人から来た情報」全般をカバーしない。

→ **「inbox」に改名**。外部から来た未整理情報全般を受け入れる

### 改良後の4分類

```
docs/
  research/    → 調べて得た情報（外部情報のインプット）
  decisions/   → 決めたこと+理由（ADR含む）
  inbox/       → 外部から来た情報（打合せ、フィードバック、指摘）
  ideas/       → 自分の思考・アイデア
```

分類基準:
- research: **AIが調べた**こと
- decisions: **決まった**こと
- inbox: **人から来た**こと
- ideas: **自分で考えた**こと

## フラット vs 階層: マークダウン+Gitの結論

**フォルダを第一軸（浅く少なく）、タグを第二軸（横断的）のハイブリッドがベスト。**

理由:
- GitHubのWebインターフェースでフォルダがそのままナビゲーションになる
- タグはfrontmatterに書けるが、GitHub上でフィルタリングできない
- CIやスクリプトでフォルダベースの処理が容易
- 1ノートに複数タグで横断的に紐付け可能

## 職業別の適合性

| 職業 | 問題 | 対処 |
|---|---|---|
| ライター | 作品の草稿が分類に収まらない | ideasに入れるか、プロジェクトフォルダ側で管理 |
| 研究者 | 文献メモがresearchとinboxの中間 | researchに統一。ソースが論文か人かはタグで区別 |
| デザイナー | ビジュアル参照がresearchでもideasでもない | researchに入れる。ビジュアルもリサーチの一種 |
| ゲーム開発 | GDDが横断的 | decisionsに設計判断、ideasにアイデア。分けて管理 |

完璧ではないが、4つの分類で大体カバーできる。足りなければプロジェクト固有のフォルダを1つ追加する余地がある（5つまでは最適ゾーン内）。

## LATCH理論: 情報の整理法は5つしかない

Richard Saul Wurman（1989）:
- **L**ocation（場所）
- **A**lphabet（アルファベット順）
- **T**ime（時間）
- **C**ategory（カテゴリ）
- **H**ierarchy（序列）

提案4分類は**Category軸**。テーマ別の横断はタグで**Category軸の第二レイヤー**。時間は**ファイル名のYYYY-MM-DDプレフィックスかfrontmatterのdate**で対応。

## Sources

- [PARA Method - Forte Labs](https://fortelabs.com/blog/para/)
- [Zettelkasten Introduction](https://zettelkasten.de/introduction/)
- [Johnny.Decimal](https://johnnydecimal.com/)
- [ACE Folder Framework - LYT](https://blog.linkingyourthinking.com/notes/ace-folder-framework)
- [LATCH - The Design Gym](https://www.thedesigngym.com/organizing-information-l-a-t-c-h/)
- [Miller's Law - Laws of UX](https://lawsofux.com/millers-law/)
- [Hick's Law - Laws of UX](https://lawsofux.com/hicks-law/)
- [How I use Obsidian - Steph Ango](https://stephango.com/vault)
- [Obsidian 初期フォルダは4つでOK](https://pouhon.net/obsidian-folders/7244/)
