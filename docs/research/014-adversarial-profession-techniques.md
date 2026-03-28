# 「壊すプロ」6職業の反証テクニック — challenge スキルへの転用

## Summary

**結論**: 6職業に共通する10の反証原則を抽出。challenge-agent.mdの各観点に具体的テクニックとして組み込める
**推奨アクション**: V1-V5の各観点に、職業由来の具体的チェック手法を追加する
**根拠**: 抽象的な「矛盾を探せ」より、「1事実ずつ固定して逃げ道を塞げ」（検事）のような具体的手法のほうがLLMの推論を分岐させやすい

## 6職業の横断的まとめ: 転用できる共通原則

| # | 原則 | 元の職業 | レビューへの転用 |
|---|---|---|---|
| 1 | **1質問1事実で逃げ道を塞ぐ** | 検事 | 1指摘1論点。複数まとめない |
| 2 | **Commit-Credit-Confront** | 検事 | 主張を固定→前提を認めさせ→矛盾を突く |
| 3 | **独立再検証** | FDA・監査法人 | 主張を鵜呑みにせず自分で再計算 |
| 4 | **予測不能な手続** | 監査法人 | 毎回異なる観点を選びパターン化を避ける |
| 5 | **Attack Surface列挙** | ペンテスター | すべてのインターフェース・入力を洗い出す |
| 6 | **一貫性ヒューリスティクス** | QA | 「何と一致すべきか」を列挙し不一致を探す |
| 7 | **Alternative Explanation** | 査読者 | 仕様の別解釈を常に考える |
| 8 | **Never/Always破り** | QA | 「常に」「絶対に」を見つけたら壊すシナリオを考える |
| 9 | **Follow the Money** | 監査法人 | データフローを端から端まで追跡 |
| 10 | **サブグループ解析** | FDA | 全体OKでも特定条件で壊れないか |

## 各観点への転用マッピング

| 観点 | 転用するテクニック | 元の職業 |
|---|---|---|
| V1 ユーザー視点 | Alternative Explanation（別解釈）、FEW HICCUPPS（一貫性オラクル） | 査読者、QA |
| V2 一貫性・矛盾 | Commit-Credit-Confront、Figure-Text Consistency | 検事、査読者 |
| V3 なぜなぜ分析 | HARKing検出、再現性チェック、Fraud Triangle | 査読者、監査法人 |
| V4 実現可能性 | 独立再検証、サブグループ解析、Never/Always破り | FDA、QA |
| V5 安全性・プライバシー | Attack Surface列挙、Follow the Money、Management Override | ペンテスター、監査法人 |

## 職業別の詳細

### 1. 検事 — 矛盾を突く反対尋問

**核心テクニック: Commit-Credit-Confront（弾劾の3C）**
1. Commit: 証言（主張）を繰り返させ固定する
2. Credit: 過去の供述の信頼性を認めさせる
3. Confront: 現在と過去の矛盾を突きつける

**One Fact Per Question**: 1質問に1事実。曖昧さや回避を不可能にする
**Looping**: 認めた事実を次の質問に埋め込み、後退を防ぐ
**Chapter Method**: 反対尋問を章立てで構成。各章が1つの論点を証明する

転用: 仕様書内の「Aセクションでこう書いてある」→「Bセクションの前提はこう」→「AとBは矛盾する」

### 2. 監査法人 — 財務報告を疑う

**核心テクニック: Fraud Triangle（不正の三角形）**
- 動機（Incentive）: 手抜きの動機がある箇所
- 機会（Opportunity）: 品質チェックが薄い箇所
- 正当化（Rationalization）: 「これで十分」と思い込みやすい箇所

**Benford's Law**: データ分布の偏りを検出
**予測不能な手続**: 毎回異なるアプローチで監査
**Follow the Money**: 取引を源泉から最終地点まで追跡
**Management Override**: 管理者権限のバイパスを重点チェック

転用: データフローを端から端まで追跡し、途中の迂回・操作・隠蔽を探す

### 3. ペネトレーションテスター — 攻撃面の列挙

**核心テクニック: Attack Surface列挙**
偵察→列挙→脆弱性分析→攻撃の段階的深堀り

**OWASP WSTG 12カテゴリ**: 情報収集、設定管理、ID管理、認証、認可、セッション、入力検証、エラー処理、暗号、ビジネスロジック、クライアント側、API
**MITRE ATT&CK**: 攻撃者の戦術・技術・手順のフレームワーク

転用: すべてのインターフェース・入力を洗い出し、それぞれに「何が壊せるか」を考える

### 4. 査読者 — 論文の穴を見つける

**核心テクニック: Alternative Explanation（代替仮説）**
著者の結論以外に、データを説明できる仮説はないか

**HARKing検出**: 結果を見てから仮説を作っていないか
**再現性チェック**: この記述だけで別の人が同じことをできるか
**Figure-Text Consistency**: 図の数値と本文の数値が一致するか
**Cherry Picking検出**: 都合の良い結果だけ報告していないか

転用: 仕様の別解釈を常に考える。「この文言を別の人が読んだら違う理解をしないか」

### 5. QA/テスター — 欠陥発見の体系的手法

**核心テクニック: FEW HICCUPPS（一貫性オラクル）**
「何と一致すべきか」で不一致を検出:
- History: 過去バージョンと一貫しているか
- Claims: 仕様の主張と一致しているか
- User Expectations: ユーザーの期待と一致しているか
- Purpose: 製品の目的に合致しているか
- Product: 製品内の他部分と一致しているか

**SFDPOT**: Structure, Function, Data, Platform, Operations, Timeの6次元
**Never/Always破り**: 「常に」「絶対に」を見つけたら壊すシナリオを考える
**境界値分析**: 数値制限の境界で何が起こるか

転用: 仕様中の「常に」「必ず」を見つけて壊す。数値制限があれば境界をチェック

### 6. FDA審査官 — 安全性を疑う

**核心テクニック: 独立再検証**
申請企業の分析を独立して再計算。結果が一致しなければ問題あり

**2つの試験原則**: 1つの証拠だけでOKにしない
**施設間比較**: 特定の環境だけで好結果が出ていないか
**サブグループ解析**: 全体OKでも特定条件で壊れないか
**欠損データの扱い**: 脱落データが都合よく除外されていないか

転用: 「この主張、別の環境でも成り立つか」「特定条件でだけ壊れないか」

## Sources

- [Cross-examination and the three C's (Holland & Knight)](https://www.hklaw.com/files/Uploads/Documents/Articles/DanSmall/cross_examination_three_Cs.pdf)
- [Chapter Method of Cross (Missouri Public Defender)](https://publicdefender.mo.gov/wp-content/uploads/2019/07/04.-LSP-Lecture-Chapter-2.pdf)
- [SAS 99 Fraud Risk Assessment (LegalClarity)](https://legalclarity.org/what-are-the-fraud-risk-assessment-procedures-under-sas-99/)
- [Using Benford's Law (Journal of Accountancy)](https://www.journalofaccountancy.com/issues/2022/sep/using-benfords-law-reveal-journal-entry-irregularities/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/)
- [Ten common statistical mistakes (eLife)](https://elifesciences.org/articles/48175)
- [Heuristics and Oracles (AST)](https://associationforsoftwaretesting.org/2016/04/12/heuristics-oracles/)
- [SFDPOT Heuristics (Xray Blog)](https://www.getxray.app/blog/useful-heuristics-for-effective-exploratory-testing-xray-blog)
- [FDA Drug Review Process](https://www.fda.gov/drugs/information-consumers-and-patients-drugs/fdas-drug-review-process-ensuring-drugs-are-safe-and-effective)
- [Pharmacovigilance Signal Detection (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3857139/)
