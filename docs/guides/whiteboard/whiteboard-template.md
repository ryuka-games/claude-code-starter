# ホワイトボード テンプレート解説

> **注意**: AI向けの操作テンプレートは `.claude/skills/agent-teams/whiteboard-template.md` に移動しました。
> このファイルは人向けの解説です。

## WHITEBOARD.md の構造

```markdown
# WHITEBOARD

## ルール
- **Goal**: 達成すべきこと
- **関係者**: 役割・エージェント名・担当・依存関係の表
- **接点（Connections）**: 役割間で影響し合う領域

---

## 掲示板
- [役割] 事実や発見
- [決定] 議論の結論（topic-XX）
- [PM] Task N 完了（担当者）
- [変更] 文言: "xxx" → "yyy"
```

### 掲示板に書くもの

- 技術的制約
- specにない前提
- 手戻りにつながる情報
- 議論で決定した事項
- タスク完了状況（コンテキスト圧縮対策）
- 文言変更

**「決定事項」セクションを別に作らない**。事実と決定は掲示板に混ぜて書く。

## 議論ファイルの構造

```
discussions/
  topic-01-icon-selection.md
  topic-02-badge-placement.md
```

### トピックのライフサイクル

1. 問いを立てる → `discussions/topic-XX-xxx.md` を作成
2. 各メンバーが自分の言葉で追記
3. 決定 → トピックファイルに `## 決定` セクション追記
4. WHITEBOARD.md掲示板に1行で転記
5. 担当者がspec・コードに反映

### いつ作るか

- specにNC（未確定事項）があるとき
- メンバー間で方針が分かれたとき
- レビューで意見が分かれたとき
- ユーザー向け文言の統一が必要なとき

全員一致で即決なら掲示板に直接書けばOK。

## 進化の経緯

1. **掲示板のみ**（step-guide）→ 技術制約の事前共有で手戻り減
2. **掲示板 + DISCUSSIONS.md**（markdown-export）→ PMが作成せず失敗。トリガーの明示が必要と判明
3. **掲示板 + DISCUSSIONS.md機能**（node-detail）→ 6トピック記録、FEの修正指示無視3-4回→1回に改善
4. **掲示板 + discussions/（トピック単位ファイル）**（session-list）→ 各メンバーが直接書き込み可能に
5. **skill化 + 知見4層構造**（node-search）→ チーム運用ルールの永続化
