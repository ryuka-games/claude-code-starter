# Boris Cherny's Claude Code Tips（Claude Code創設者による公式Tips）

> Boris Cherny（Claude Code創設者）がClaude Codeチームから集めた実践的Tips。
> Xで話題になったポスト + 公式ドキュメントの補足情報をまとめたもの。
>
> 「正しい使い方は一つじゃない。自分に合うやり方を実験して見つけろ」

---

## 1. 並列作業こそ最大の生産性向上

**チームの一番のおすすめ: git worktreeで3〜5セッションを同時に走らせる。**

スクショではworktreeを`.claude/worktrees/`配下に作成し、それぞれ独立したClaudeセッションを起動している:

```bash
$ git worktree add .claude/worktrees/my-worktree origin/main
$ cd .claude/worktrees/my-worktree && claude
```

### チームの運用パターン

- worktreeに名前をつけてシェルエイリアス（`za`, `zb`, `zc`）で一発切替する人も
- 「分析専用」worktreeを用意して、ログ読みやBigQueryだけやらせている人も
- Boris自身はworktreeではなく複数のgit checkoutを使っている
- Claude Desktopアプリには@amorriscodeがworktreeのネイティブサポートを組み込んだ

### 公式ドキュメント補足

- 各worktreeは独立したファイル状態を持つ（Claudeインスタンス同士が干渉しない）
- Gitの履歴とリモート接続は全worktreeで共有
- 長時間タスクをあるworktreeで走らせつつ、別のworktreeで開発を続けられる
- 新しいworktreeではプロジェクトの環境セットアップ（`npm install`等）が必要
- 自動協調が必要な場合は[agent teams](https://code.claude.com/docs/en/agent-teams)を参照

> 参考: https://code.claude.com/docs/en/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees

---

## 2. 複雑なタスクは必ずプランモードから始める

**計画にエネルギーを注げば、Claudeが1-shotで実装できる。**

スクショではプランモードが有効（`plan mode on (shift+Tab to cycle)`）になっている。

### チームの運用パターン

- ある人は「1つ目のClaudeに計画を書かせ、2つ目のClaudeにスタッフエンジニアとしてレビューさせる」
- 何かがうまくいかなくなった瞬間、**すぐプランモードに戻って再計画する**。無理に押し通さない
- 実装だけでなく**検証ステップでもプランモードを使う**よう明示的に指示する

### プランモードの入り方

| 方法 | コマンド |
|------|---------|
| セッション中 | `Shift+Tab` でモード切替（Normal → Auto-Accept → Plan） |
| 新規セッション | `claude --permission-mode plan` |
| ヘッドレス | `claude --permission-mode plan -p "分析して"` |
| 直接コマンド | `/plan` |

### 公式ドキュメント補足

- プランモードでは`AskUserQuestion`ツールで要件を収集・明確化してから計画を提示
- `Ctrl+G` で計画をデフォルトテキストエディタで直接編集可能
- 設定でデフォルトにもできる: `{"permissions": {"defaultMode": "plan"}}`

---

## 3. CLAUDE.mdに投資する

**修正するたびに「CLAUDE.mdを更新して同じミスを繰り返さないようにして」と言う。**
Claudeは自分自身のルールを書くのが驚くほど上手い。

スクショではMemory filesとして `~/.claude/CLAUDE.md: 76 tokens` と `CLAUDE.md: 4k tokens` が表示されている。

### チームの運用パターン

- 時間をかけてCLAUDE.mdを**容赦なく編集**し続ける。Claudeのミス率が目に見えて下がるまで反復する
- あるエンジニアは「タスク/プロジェクトごとにnotesディレクトリを管理させ、PR後に毎回更新させている。CLAUDE.mdからそれを参照」

### 公式ドキュメント補足

**書くべきもの:**
- Claudeが推測できないBash コマンド（`npm run build`, `cargo build`）
- デフォルトと異なるコードスタイル規約
- テスト指示とテストランナー
- リポジトリのエチケット（ブランチ命名規則等）
- プロジェクト固有のアーキテクチャ判断
- 開発環境の癖

**書くべきでないもの:**
- Claudeがコードを読めばわかること
- 言語の標準的な慣習
- 長大なAPIドキュメント（リンクで代替）
- 「きれいなコードを書く」等の自明な指示

**ゴールデンルール:** 各行について「これを消したらClaudeがミスするか？」と問う。NOなら削除。

---

## 4. 自作Skillをgitにコミットして全プロジェクトで再利用

**1日に2回以上やることは、Skillかコマンドにする。**

### チームの実例

- `/techdebt` スラッシュコマンドを作り、毎セッション終了時に実行して重複コードを発見・削除
- 7日分のSlack、Google Drive、Asana、GitHubを1つのコンテキストダンプに統合するスラッシュコマンド
- dbtモデルの作成・レビュー・テストを行うanalytics-engineerスタイルのエージェント

### Skill作成方法（公式ドキュメント補足）

```bash
mkdir -p .claude/skills/my-skill
```

`SKILL.md` をYAMLフロントマター付きで作成:

```yaml
---
name: my-skill
description: いつ使うかの説明（Claudeの自動起動判定にも使われる）
---

指示内容をここに記述...
```

**格納場所:**

| 場所 | スコープ |
|------|---------|
| `.claude/skills/` | プロジェクト（チーム共有、git管理） |
| `~/.claude/skills/` | 全プロジェクト（個人） |

**重要なフロントマターオプション:**

| フィールド | 説明 |
|-----------|------|
| `disable-model-invocation: true` | 手動起動のみ（`/deploy`のような副作用あるコマンド向け） |
| `user-invocable: false` | Claude専用（背景知識として自動適用） |
| `context: fork` | 別コンテキストのサブエージェントで実行 |
| `allowed-tools` | 使えるツールを制限 |
| `argument-hint` | 補完ヒント: `"[issue-number]"` |

**引数の使い方:**
```yaml
---
name: fix-issue
description: GitHub Issueを修正する
---
GitHub Issue $ARGUMENTS を修正: ...
```
→ `/fix-issue 1234` で `$ARGUMENTS` が `1234` に置換される

**動的コンテキスト注入（`!`command``）:**
```yaml
- PR diff: !`gh pr diff`
- 変更ファイル: !`gh pr diff --name-only`
```
→ シェルコマンドが事前実行され、出力がスキルに注入される

> 参考: https://code.claude.com/docs/en/skills

---

## 5. Claudeはほとんどのバグを自力で直す

**Slack MCPを有効にして、バグスレッドのURLを貼って「fix」と言うだけ。コンテキスト切替ゼロ。**

スクショでは `fix this https://ant.slack.com/archives/...` と入力すると、Claudeが `slack - search_public (MCP)` を使ってSlackチャンネルを検索し、自動的にバグ修正に取り掛かっている。

### チームの運用パターン

- 「CIの失敗テストを直して」と言うだけでOK。やり方をマイクロマネジメントしない
- dockerログをClaudeに見せて分散システムのトラブルシューティング — 意外と有能

---

## 6. プロンプティングをレベルアップ

### a. Claudeに挑ませる

- 「この変更を徹底的にレビューして、テストに合格するまでPRを作らないで」
- 「これが動くことを証明して」→ mainとfeatureブランチの振る舞いをdiffさせる

### b. イマイチな修正の後

- 「今わかっていることを全部踏まえて、これを捨てて洗練されたソリューションを実装して」

### c. 曖昧さを減らす

- 作業を渡す前に詳細なスペックを書く。具体的であるほど出力の質が上がる

### 公式ドキュメント補足: 効果的なプロンプトの原則

- **具体的にスコープを絞る**: 「authのバグ直して」→「メアドに+が含まれるとログイン失敗するバグを修正」
- **検証手段を与える**: テストを走らせる、スクショで比較させる等
- **`@`でファイルを直接参照**: `@src/api/users.ts` でコンテキストに含める
- **既存パターンを参照させる**: 「HotDogWidget.phpを参考に同じパターンでカレンダーウィジェットを実装して」
- **解決策でなく症状を伝える**: 「Cacheクラス削除して」→「パフォーマンス低下の報告がある。昨日更新したCacheクラスに問題があるか調べて」

---

## 7. ターミナル＆環境セットアップ

**チームのお気に入りはGhostty。** 同期レンダリング、24ビットカラー、proper Unicode対応。

スクショではターミナルにタブ1〜4が番号付き＋色分け（タブ2に青いドット）で表示されている。各タブで異なるClaudeセッションが動いている。

### チームの運用パターン

- `/statusline` でステータスバーをカスタマイズ — コンテキスト使用量と現在のgitブランチを常時表示
- ターミナルタブを**色分け＋名前付け**（tmux使用者も多い）— 1タブ = 1タスク/1 worktree
- **音声入力を使う。** タイピングの3倍速で話せるし、プロンプトがはるかに詳細になる（macOSなら`fn`キー2回押し）

### 公式ドキュメント補足

- [カスタムステータスライン](https://code.claude.com/docs/en/statusline)でモデル、作業ディレクトリ、gitブランチ等を表示可能
- Shift+Enterの改行入力: iTerm2, WezTerm, Ghostty, Kittyはそのまま使える。VS Code等は`/terminal-setup`で設定
- 大きな入力はファイル経由で渡す方がベター（VS Codeターミナルは長い貼り付けが切り詰められがち）
- `/vim` でVimキーバインドを有効化可能

> 参考: https://code.claude.com/docs/en/terminal-config

---

## 8. サブエージェントを使い倒す

スクショでは「use 5 subagents to explore the codebase」と指示すると、5つのExploreエージェントが並列で起動:
- Explore entry points and startup
- Explore React components structure
- Explore tools implementation
- Explore state management
- Explore testing infrastructure

それぞれが別の観点でコードベースを探索している。

### チームの運用パターン

**a.** リクエストに「use subagents」を追加するだけで、Claudeが問題にもっと計算リソースを投入する

**b.** 個別タスクをサブエージェントにオフロードして、メインエージェントのコンテキストウィンドウをクリーンに保つ

**c.** PermissionRequestフックでOpus 4.5にルーティング — 攻撃をスキャンして安全なものだけ自動承認させる

### 公式ドキュメント補足: PermissionRequestフック

PermissionRequestフックは権限ダイアログが表示されるタイミングで発火。`hookSpecificOutput`で自動的にallow/denyできる:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow",
      "updatedInput": {
        "command": "npm run lint"
      }
    }
  }
}
```

- `behavior: "allow"` で権限を付与、`"deny"` で拒否
- `updatedInput` でツールの入力パラメータを変更して承認することも可能
- `updatedPermissions` で「常に許可」ルールを適用することもできる

これをOpus等のスマートなモデルに判断させる（`type: "prompt"` or `type: "agent"`フック）ことで、安全な操作だけ自動承認しつつ危険な操作はブロックできる。

> 参考: https://code.claude.com/docs/en/hooks#permissionrequest

---

## 9. データ＆アナリティクスにClaude Codeを使う

- Claude Codeに`bq` CLIを使わせてメトリクスをその場で取得・分析
- BigQuery Skillをコードベースにチェックインして、チーム全員がClaude Code内で直接アナリティクスクエリを実行
- Boris個人は**6ヶ月以上SQLを1行も書いていない**
- CLI、MCP、またはAPIがあるデータベースなら何でも同じことができる

---

## 10. Claudeで学習する

**a.** `/config` で「Explanatory」や「Learning」出力スタイルを有効にすると、変更の**理由（why）**を説明してくれる

**b.** 馴染みのないコードを説明するビジュアルHTMLプレゼンテーションを生成させる — 意外と良いスライドを作る

**c.** 新しいプロトコルやコードベースのASCII図を描かせて理解を深める

**d.** 間隔反復学習Skillを作る: 自分の理解を説明 → Claudeがフォローアップ質問 → ギャップを埋める → 結果を保存

---

## まとめ: 特に刺さるポイント

| Tip | なぜ強いか | 導入難易度 |
|-----|----------|:---:|
| worktree 3〜5並列 | 待ち時間ゼロ。1つが考え中でも他で作業できる | 低 |
| 「CLAUDE.md更新して」の習慣化 | 学習ループが自動で回る。時間が経つほど賢くなる | 低 |
| プランモードで計画→即実装 | 手戻りが激減。1-shot実装率が跳ね上がる | 低 |
| Slack URL貼って「fix」 | コンテキスト切替コストがほぼゼロになる | 中（MCP設定が必要） |
| 自作Skillをgit管理 | チーム全員の反復作業を自動化 | 中 |
| 「use subagents」の一言 | 探索と実装を分離。コンテキスト汚染を防ぐ | 低 |
| 音声入力 | プロンプトの情報量が劇的に増える | 低 |
| PermissionRequestフック | 安全な操作を自動承認、危険をブロック | 高 |
| BigQuery/DB Skill | SQL不要でデータ分析 | 中 |
