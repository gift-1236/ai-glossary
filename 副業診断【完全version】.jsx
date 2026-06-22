import { useState, useEffect, useRef } from "react";

// ★ LINEのURLをここだけ変えればOK ★
const LINE_URL = "https://lin.ee/XXXXXXXX";
const LINE_MESSAGE = "無料LINE登録で副業の始め方を完全解説！";

// ── QUESTIONS (30問) ─────────────────────────────────────────
const QUESTIONS = [
  // ── BLOCK 1: 性格・価値観 ──
  { id:1, block:"PERSONALITY", blockJa:"性格・価値観", question:"仕事で一番「楽しい」と感じる瞬間は？", options:[
    { label:"ゼロから何かを作り上げた時", scores:{creative:3,solo:1} },
    { label:"誰かの問題を解決してあげられた時", scores:{people:3,service:1} },
    { label:"データや数字が綺麗に揃った時", scores:{analytical:3,solo:1} },
    { label:"自分のアイデアが世に出た時", scores:{creative:2,social:2} },
  ]},
  { id:2, block:"PERSONALITY", blockJa:"性格・価値観", question:"あなたが一番大切にしている価値観は？", options:[
    { label:"自由・自分のペースで生きること", scores:{creative:2,digital:2} },
    { label:"成長・スキルを磨き続けること", scores:{analytical:2,technical:2} },
    { label:"貢献・誰かの役に立つこと", scores:{people:3,service:1} },
    { label:"安定・将来への安心感", scores:{steady:3,service:1} },
  ]},
  { id:3, block:"PERSONALITY", blockJa:"性格・価値観", question:"褒められると嬉しいのはどれ？", options:[
    { label:"「センスがいいね」", scores:{creative:3,digital:1} },
    { label:"「わかりやすく教えてくれる」", scores:{people:2,service:2} },
    { label:"「頼りになる」「仕事が丁寧」", scores:{steady:2,technical:2} },
    { label:"「頭の回転が速い」", scores:{analytical:3,knowledge:1} },
  ]},
  { id:4, block:"PERSONALITY", blockJa:"性格・価値観", question:"ストレス発散の方法は？", options:[
    { label:"ひとりで没頭できる趣味（ゲーム・読書・制作）", scores:{solo:3,creative:1} },
    { label:"友人や家族と話す・外食に行く", scores:{people:3,social:1} },
    { label:"運動・体を動かす", scores:{steady:2,service:1} },
    { label:"SNSを眺めたり情報収集する", scores:{digital:2,social:2} },
  ]},
  { id:5, block:"PERSONALITY", blockJa:"性格・価値観", question:"新しいことを始める時のスタイルは？", options:[
    { label:"全体像を把握してから動く", scores:{analytical:3,knowledge:1} },
    { label:"とにかく手を動かして覚える", scores:{technical:2,creative:2} },
    { label:"誰かに教えてもらいながら進める", scores:{people:2,service:1} },
    { label:"ネットで調べて自己流でやる", scores:{digital:2,solo:2} },
  ]},

  // ── BLOCK 2: スキル・強み ──
  { id:6, block:"SKILL", blockJa:"スキル・強み", question:"自分が一番得意だと思うことは？", options:[
    { label:"文章・言葉で表現すること", scores:{writing:3,creative:1} },
    { label:"人を引きつけ・動かすこと", scores:{people:3,social:2} },
    { label:"複雑な情報を整理・分析すること", scores:{analytical:3,knowledge:2} },
    { label:"手や技術で何かを作ること", scores:{technical:3,solo:1} },
  ]},
  { id:7, block:"SKILL", blockJa:"スキル・強み", question:"学校や職場でよく頼まれることは？", options:[
    { label:"デザイン・資料作り・見た目を整えること", scores:{creative:3,digital:1} },
    { label:"説明・プレゼン・人前で話すこと", scores:{people:2,social:2} },
    { label:"調査・データまとめ・レポート作成", scores:{analytical:2,knowledge:2} },
    { label:"企画・アイデア出し・新しい提案", scores:{creative:2,writing:1} },
  ]},
  { id:8, block:"SKILL", blockJa:"スキル・強み", question:"SNSやネットで自然とやっていることは？", options:[
    { label:"情報収集・リサーチが趣味レベル", scores:{analytical:2,knowledge:2} },
    { label:"発信・投稿・コメントが自然にできる", scores:{social:3,creative:1} },
    { label:"動画・画像・デザインをよく触る", scores:{creative:2,digital:2} },
    { label:"商品やサービスを調べて比較する", scores:{steady:1,analytical:2} },
  ]},
  { id:9, block:"SKILL", blockJa:"スキル・強み", question:"過去に「これ得意かも」と感じた経験は？", options:[
    { label:"何かを教えて相手が「わかった！」と言った時", scores:{people:3,service:2} },
    { label:"自分の作品や文章が誰かに評価された時", scores:{creative:3,writing:1} },
    { label:"調べ物や分析で周囲より早く答えを出した時", scores:{analytical:3,knowledge:1} },
    { label:"コツコツ積み上げて結果を出した時", scores:{steady:3,technical:1} },
  ]},
  { id:10, block:"SKILL", blockJa:"スキル・強み", question:"英語・プログラミング・デザインのうち、経験があるものは？", options:[
    { label:"プログラミング（少しでも触ったことがある）", scores:{technical:3,analytical:1} },
    { label:"デザイン（Canva・Figmaなど触ったことがある）", scores:{creative:3,digital:1} },
    { label:"英語（日常会話以上のレベル）", scores:{knowledge:2,people:1} },
    { label:"どれもほぼ未経験", scores:{steady:1,service:1} },
  ]},

  // ── BLOCK 3: お金・収入観 ──
  { id:11, block:"INCOME", blockJa:"お金・収入観", question:"収入に対して最も重視することは？", options:[
    { label:"少額でも今すぐ稼ぎたい", scores:{steady:2,service:2} },
    { label:"時間がかかっても高単価を狙いたい", scores:{technical:2,analytical:2} },
    { label:"寝ながら稼げる仕組みが欲しい", scores:{creative:2,digital:2} },
    { label:"やりがいと収入が両立できればいい", scores:{people:2,writing:1} },
  ]},
  { id:12, block:"INCOME", blockJa:"お金・収入観", question:"副業の最初の目標収入は？", options:[
    { label:"月1〜3万円（おこづかい程度）", scores:{steady:3,service:1} },
    { label:"月5〜10万円（生活費の足しに）", scores:{steady:2,technical:1} },
    { label:"月20〜50万円（本業と同水準に）", scores:{technical:2,creative:2} },
    { label:"月100万円以上（独立・起業レベル）", scores:{creative:2,analytical:2} },
  ]},
  { id:13, block:"INCOME", blockJa:"お金・収入観", question:"お金を稼ぐ上で一番ワクワクするのは？", options:[
    { label:"自分のコンテンツが売れ続ける仕組み", scores:{creative:2,digital:2} },
    { label:"スキルを活かして高単価案件を受ける", scores:{technical:2,analytical:2} },
    { label:"人に喜ばれて対価をもらう", scores:{people:3,service:2} },
    { label:"仕入れて売る・差益で稼ぐ", scores:{steady:2,digital:1} },
  ]},
  { id:14, block:"INCOME", blockJa:"お金・収入観", question:"リスクに対するスタンスは？", options:[
    { label:"リスクゼロで始めたい", scores:{steady:3,service:1} },
    { label:"少しリスクがあっても高リターンを狙う", scores:{creative:2,technical:2} },
    { label:"実績を作りながら徐々に投資する", scores:{analytical:2,knowledge:2} },
    { label:"最初から本気で投資・コミットする", scores:{technical:2,creative:1} },
  ]},
  { id:15, block:"INCOME", blockJa:"お金・収入観", question:"副業で稼いだお金の使い道は？", options:[
    { label:"さらなる副業・自己投資に再投資", scores:{analytical:2,technical:2} },
    { label:"生活の質を上げる・趣味に使う", scores:{creative:1,steady:2} },
    { label:"貯金・将来への備え", scores:{steady:3,service:1} },
    { label:"いずれ独立・起業の資金にする", scores:{creative:2,people:1} },
  ]},

  // ── BLOCK 4: 働き方・ライフスタイル ──
  { id:16, block:"LIFESTYLE", blockJa:"働き方・スタイル", question:"理想の作業スタイルは？", options:[
    { label:"ひとりで集中して黙々と", scores:{solo:3,analytical:1} },
    { label:"人と話しながらインタラクティブに", scores:{people:3,social:2} },
    { label:"自由に場所や時間を変えながら", scores:{creative:2,digital:2} },
    { label:"明確な目標とルールの中でコツコツ", scores:{steady:3,service:1} },
  ]},
  { id:17, block:"LIFESTYLE", blockJa:"働き方・スタイル", question:"副業に使える時間は週どれくらい？", options:[
    { label:"〜5時間（スキマ時間のみ）", scores:{steady:2,digital:1} },
    { label:"5〜15時間（週末＋平日少し）", scores:{creative:1,service:1} },
    { label:"15〜30時間（本気で時間を確保）", scores:{technical:2,analytical:1} },
    { label:"30時間以上（副業が本業レベル）", scores:{technical:2,people:1} },
  ]},
  { id:18, block:"LIFESTYLE", blockJa:"働き方・スタイル", question:"どこで副業をしたい？", options:[
    { label:"自宅でフルリモート完結したい", scores:{solo:3,digital:2} },
    { label:"カフェや外でも働けるといい", scores:{creative:2,digital:1} },
    { label:"対面でもOK・場所は気にしない", scores:{people:2,service:2} },
    { label:"とにかく自由な環境がいい", scores:{creative:2,solo:1} },
  ]},
  { id:19, block:"LIFESTYLE", blockJa:"働き方・スタイル", question:"本業との両立で一番不安なことは？", options:[
    { label:"体力・時間が足りなくなること", scores:{steady:2,service:1} },
    { label:"スキル不足で稼げないこと", scores:{technical:1,analytical:1} },
    { label:"続けられるか自信がないこと", scores:{steady:2,people:1} },
    { label:"何から始めればいいかわからないこと", scores:{creative:1,knowledge:1} },
  ]},
  { id:20, block:"LIFESTYLE", blockJa:"働き方・スタイル", question:"最もストレスを感じる状況は？", options:[
    { label:"延々と人と話し続けること", scores:{solo:2,analytical:1} },
    { label:"成果が見えない単調な繰り返し", scores:{creative:2,people:1} },
    { label:"厳しいルールや強い締め切りのプレッシャー", scores:{creative:1,digital:1} },
    { label:"収入が不安定で先が見えないこと", scores:{steady:2,service:1} },
  ]},

  // ── BLOCK 5: 興味・関心 ──
  { id:21, block:"INTEREST", blockJa:"興味・関心", question:"普段よく見るコンテンツ・情報は？", options:[
    { label:"ビジネス・投資・マネー系", scores:{analytical:2,knowledge:2} },
    { label:"エンタメ・ファッション・ライフスタイル", scores:{creative:2,social:2} },
    { label:"テクノロジー・AI・プログラミング", scores:{technical:3,analytical:1} },
    { label:"自己啓発・スキルアップ・資格", scores:{knowledge:2,steady:2} },
  ]},
  { id:22, block:"INTEREST", blockJa:"興味・関心", question:"興味のある業界や分野は？", options:[
    { label:"IT・Web・デジタル", scores:{technical:2,digital:2} },
    { label:"教育・コーチング・人材", scores:{people:3,service:2} },
    { label:"クリエイティブ・エンタメ・アート", scores:{creative:3,writing:1} },
    { label:"ビジネス・マーケティング・コンサル", scores:{analytical:2,knowledge:2} },
  ]},
  { id:23, block:"INTEREST", blockJa:"興味・関心", question:"無料でも学びたいと思えるジャンルは？", options:[
    { label:"デザイン・動画編集・写真", scores:{creative:3,digital:1} },
    { label:"プログラミング・データ分析", scores:{technical:3,analytical:1} },
    { label:"マーケティング・SNS運用・集客", scores:{social:2,digital:2} },
    { label:"コーチング・心理学・コミュニケーション", scores:{people:3,service:1} },
  ]},
  { id:24, block:"INTEREST", blockJa:"興味・関心", question:"もし時間とお金が無限にあったら何をする？", options:[
    { label:"世界中を旅しながら発信し続ける", scores:{creative:2,social:2} },
    { label:"自分のサービスやプロダクトを作る", scores:{technical:2,creative:2} },
    { label:"好きな人に好きなことを教える", scores:{people:3,service:1} },
    { label:"投資・資産運用・仕組みを作る", scores:{analytical:2,steady:2} },
  ]},
  { id:25, block:"INTEREST", blockJa:"興味・関心", question:"憧れる働き方・生き方に近いのは？", options:[
    { label:"フリーランスとして世界中どこでも仕事", scores:{technical:2,digital:2} },
    { label:"自分のメディアやコンテンツで影響力を持つ", scores:{creative:2,social:2} },
    { label:"専門家・先生として感謝される存在になる", scores:{people:3,service:2} },
    { label:"投資やビジネスオーナーとして不労所得を持つ", scores:{analytical:2,steady:2} },
  ]},

  // ── BLOCK 6: ビジョン・将来 ──
  { id:26, block:"VISION", blockJa:"ビジョン・将来", question:"3年後の理想の副業像は？", options:[
    { label:"本業を辞めて独立・フリーランス", scores:{technical:2,creative:2} },
    { label:"月5〜10万円の安定した副収入", scores:{steady:3,service:1} },
    { label:"自分のブランド・メディアを持つ", scores:{creative:2,social:2} },
    { label:"専門家として高単価案件を受ける", scores:{analytical:2,knowledge:2} },
  ]},
  { id:27, block:"VISION", blockJa:"ビジョン・将来", question:"副業を通して一番手に入れたいものは？", options:[
    { label:"時間と場所の自由", scores:{digital:3,solo:1} },
    { label:"自己表現・クリエイティブの場", scores:{creative:3,writing:1} },
    { label:"人とのつながり・感謝される体験", scores:{people:3,service:1} },
    { label:"専門性・スキルの証明", scores:{analytical:2,technical:2} },
  ]},
  { id:28, block:"VISION", blockJa:"ビジョン・将来", question:"副業で壁にぶつかった時にとる行動は？", options:[
    { label:"徹底的に調べて自力で解決する", scores:{analytical:2,solo:2} },
    { label:"コミュニティや仲間に相談する", scores:{people:2,social:2} },
    { label:"メンターやコーチを探して聞く", scores:{knowledge:2,service:1} },
    { label:"一旦立ち止まり別のアプローチを探す", scores:{creative:2,steady:1} },
  ]},
  { id:29, block:"VISION", blockJa:"ビジョン・将来", question:"副業を「成功した」と感じる基準は？", options:[
    { label:"毎月安定して収入が入ってくる", scores:{steady:3,service:1} },
    { label:"本業収入を超えた", scores:{technical:2,analytical:2} },
    { label:"ファンや感謝してくれる人ができた", scores:{people:2,creative:2} },
    { label:"自分のやりたいことで稼げている", scores:{creative:2,writing:2} },
  ]},
  { id:30, block:"VISION", blockJa:"ビジョン・将来", question:"今すぐ副業を始めるとしたら、最初にやることは？", options:[
    { label:"自分のスキルを棚卸しして整理する", scores:{analytical:2,knowledge:2} },
    { label:"SNSアカウントを開設して発信を始める", scores:{social:2,creative:2} },
    { label:"クラウドソーシングに登録して案件を探す", scores:{steady:2,service:2} },
    { label:"プログラミングやデザインの勉強を始める", scores:{technical:3,digital:1} },
  ]},
];

// ── RESULTS (12種類) ──────────────────────────────────────────
const RESULTS = [
  {
    id:"engineer", title:"フリーランスエンジニア", subtitle:"コードで高単価を狙う技術の専門家",
    icon:"⌨️", tag:"HIGH SKILL", tagColor:"#E8C97E", accentColor:"#E8C97E",
    incomeRange:"月5万〜150万円", timeline:"6〜12ヶ月", difficulty:5, remote:true,
    desc:"Web制作・アプリ開発・システム構築など、技術力を直接マネタイズする副業の最高峰。スキルさえあれば単価の天井がなく、AIを武器にすれば開発速度が10倍になる今が最大のチャンス。",
    detail:"クラウドソーシングで最初の案件を取り、実績とレビューを積み上げるのが王道。WordPressサイト制作は参入しやすく月3〜5万円からスタートできる。長期目標はReact・APIを使った高単価案件へのステップアップ。",
    strengths:["高単価・時給5,000円〜が現実的","フルリモート・完全自由なスケジュール","AIで生産性が爆発的に上がる"],
    weaknesses:["習得に時間と根気が必要","技術トレンドへの継続的な学習が必須"],
    steps:[
      {title:"HTML/CSS/JSの基礎を固める", desc:"Progateや書籍で2〜3ヶ月。毎日1時間でも継続が全て。"},
      {title:"架空案件でポートフォリオを3つ作る", desc:"架空でも本気で作れば実績ゼロの壁を突破できる。"},
      {title:"クラウドワークスで初案件を受注", desc:"最初は激安でOK。レビュー1つが次の単価を3倍にする。"},
    ],
    platforms:["クラウドワークス","ランサーズ","Upwork","GitHub","Vercel"],
    aiTools:[
      {name:"Claude", use:"コード設計・バグ解決・実装相談。複雑な要件も整理してくれる最高の相棒。", url:"https://claude.ai"},
      {name:"Cursor", use:"AIがリアルタイムでコードを補完。エディタ組み込みの開発革命ツール。", url:"https://cursor.sh"},
      {name:"v0 by Vercel", use:"UIをプロンプトで即生成。フロントエンド実装時間がほぼゼロに。", url:"https://v0.dev"},
      {name:"ChatGPT", use:"エラー解決・コード生成・学習サポート。「なぜ？」の説明が丁寧。", url:"https://chat.openai.com"},
    ],
    keys:["technical","analytical","solo","digital"],
  },
  {
    id:"creator", title:"SNS・動画クリエイター", subtitle:"発信力でファンを生み出す表現者",
    icon:"🎬", tag:"INFLUENCE", tagColor:"#F28B70", accentColor:"#F28B70",
    incomeRange:"月1万〜100万円", timeline:"3〜8ヶ月", difficulty:3, remote:true,
    desc:"TikTok・Instagram・YouTubeで自分のコンテンツを発信し、フォロワーをファンに変えて収益化する副業。ブランドとのコラボ・デジタル販売・投げ銭など複数の収益源を同時に持てるのが最大の強み。",
    detail:"最初の3ヶ月は「型」を作る期間と割り切ること。バズを狙うより継続が命。ショート動画は特に拡散力が高く、フォロワー1,000人を超えたタイミングでnote・デジタル販売を解禁するのが王道戦略。",
    strengths:["バズれば一気に収益が跳ね上がる","自己表現がそのままビジネスになる","資産として積み上がるコンテンツ"],
    weaknesses:["収益化まで時間がかかる","継続しないと数字が落ちる"],
    steps:[
      {title:"発信テーマを1つに絞る", desc:"「広く浅く」は伸びない。あなたの日常×得意を掛け合わせたテーマを。"},
      {title:"週3投稿を90日間続ける", desc:"最初の数字は気にしなくていい。90日で「型」さえ作れれば後は伸びる。"},
      {title:"1,000人でマネタイズ開始", desc:"noteデジタル販売・アフィリエイト・コラボDMを解禁するフェーズ。"},
    ],
    platforms:["TikTok","Instagram","YouTube","X (Twitter)","note"],
    aiTools:[
      {name:"CapCut", use:"動画編集・自動字幕・BGMがスマホ1台で完結。プロ品質が爆速で作れる。", url:"https://www.capcut.com"},
      {name:"Claude", use:"投稿の台本・キャプション・企画構成を秒速で生成。ネタ切れと無縁になる。", url:"https://claude.ai"},
      {name:"Canva", use:"サムネ・投稿デザインをテンプレで即完成。センスなしでもプロ品質に。", url:"https://www.canva.com"},
      {name:"Midjourney", use:"唯一無二のアイキャッチ画像を生成。ビジュアルで圧倒的差別化ができる。", url:"https://www.midjourney.com"},
    ],
    keys:["creative","social","digital","writing"],
  },
  {
    id:"writer", title:"Webライター・note作家", subtitle:"言葉で価値を届けるコンテンツクリエイター",
    icon:"✍️", tag:"BEGINNER OK", tagColor:"#7EC8A4", accentColor:"#7EC8A4",
    incomeRange:"月1万〜50万円", timeline:"1〜3ヶ月", difficulty:2, remote:true,
    desc:"クラウドソーシングでライティング案件を受注しながら、自分のブログやnoteでメディアを育てる副業。AIが普及した今こそ「人間の視点と体験」を持つライターの価値は上がっている。今日から始められる最速の副業。",
    detail:"最初は文字単価0.5〜1円でも、専門性を磨けば5〜10円へ。自分メディアを育てれば記事が資産になり寝ている間も収益を生む仕組みができる。経験・日常をそのまま書けるのが人間の強み。",
    strengths:["今日から始められる低い参入障壁","スキルが積み上がり資産化できる","場所・時間を完全に選ばない"],
    weaknesses:["最初の単価が低い","単価の天井を打破する工夫が必要"],
    steps:[
      {title:"クラウドワークスに登録して初案件を取る", desc:"プロフィールを丁寧に書くだけで応募数が変わる。最初の5本が全ての土台。"},
      {title:"得意ジャンルに1つ特化する", desc:"「副業・転職・健康・テック」など自分の経験に近いジャンルを選ぶと品質が上がる。"},
      {title:"noteで自分メディアを育てる", desc:"クライアントワークと並行して自分の言葉で発信。月1記事からでいい。"},
    ],
    platforms:["クラウドワークス","ランサーズ","note","WordPress","Substack"],
    aiTools:[
      {name:"Claude", use:"記事構成・リサーチ補助・表現の言い換え。文章品質が一気に引き上がる。", url:"https://claude.ai"},
      {name:"Perplexity", use:"最新情報の収集・一次ソース付きリサーチが高速。記事の信頼性が上がる。", url:"https://www.perplexity.ai"},
      {name:"ChatGPT", use:"タイトル・見出し案を大量生成。切り口を広げるブレストに最適。", url:"https://chat.openai.com"},
      {name:"Notion AI", use:"アイデア管理・記事構成・下書き作成を一元化。ライターの作業基地に最適。", url:"https://www.notion.so"},
    ],
    keys:["writing","creative","solo","knowledge"],
  },
  {
    id:"consultant", title:"フリーランスコンサル", subtitle:"知識と論理で高単価を狙う戦略家",
    icon:"📊", tag:"HIGH VALUE", tagColor:"#7EB8E8", accentColor:"#7EB8E8",
    incomeRange:"月10万〜200万円", timeline:"6〜18ヶ月", difficulty:5, remote:true,
    desc:"マーケティング・人事・財務・データ分析など、自分の本業スキルをそのまま副業に転換する最短ルート。1案件で数十万円が動く世界。SNSで専門家として発信することで案件が向こうからやってくる状態を目指す。",
    detail:"「コンサル」は知識を時間単位で売ること。本業で培ったスキルが最大の武器になる。Xやnoteで業界知見を発信し続けることで、3ヶ月で問い合わせが来るようになる人も多い。",
    strengths:["単価の天井がなく青天井","本業スキルをそのまま収益化","希少性が高くライバルが少ない"],
    weaknesses:["実績づくりに時間がかかる","専門性がないとスタートできない"],
    steps:[
      {title:"本業での専門領域を1つ言語化する", desc:"「〇〇業界のマーケティングに詳しい」を一言で言える状態にする。これが全ての起点。"},
      {title:"SNSで専門家として発信を始める", desc:"XやnoteでB界知見を発信。3ヶ月で問い合わせが来るようになる人も多い。"},
      {title:"ランサーズ・Bizseekで初案件を受注", desc:"最初は赤字でもいい。1つのレビューが単価交渉を劇的に変える。"},
    ],
    platforms:["ランサーズ","Bizseek","Visasq","X (Twitter)","LinkedIn"],
    aiTools:[
      {name:"Claude", use:"提案書・分析レポートの構成と文章化。複雑な内容も整理して言語化してくれる。", url:"https://claude.ai"},
      {name:"Gamma", use:"分析結果をプレゼン資料に秒速で変換。クライアント向け資料がみるみる完成。", url:"https://gamma.app"},
      {name:"Perplexity", use:"業界動向・競合情報のリサーチを高速化。一次ソース付きで信頼性も担保。", url:"https://www.perplexity.ai"},
      {name:"ChatGPT", use:"Pythonコード生成・データ分析補助。「このデータをグラフにして」で即実行。", url:"https://chat.openai.com"},
    ],
    keys:["analytical","knowledge","technical","steady"],
  },
  {
    id:"coach", title:"オンライン講師・コーチ", subtitle:"人の成長を支えて感謝で稼ぐ",
    icon:"🎓", tag:"PEOPLE FIRST", tagColor:"#C49FE8", accentColor:"#C49FE8",
    incomeRange:"月3万〜80万円", timeline:"1〜2ヶ月", difficulty:2, remote:true,
    desc:"自分の知識・経験・スキルを「教える」ことで収益化する副業。ストアカでレッスンを開いたり、Udemyで動画講座を販売したり、Zoomで1on1コーチングを提供する形が主流。リピーターが生まれると収入が自然に安定する。",
    detail:"「先生」として必要なのは完璧な知識より、相手より1歩先を歩いていること。プログラミング・英会話・副業・料理・整理整頓・ヨガまで、あなたの「当たり前」が誰かにとっては価値になる。",
    strengths:["低コストで今すぐ始められる","リピーターで収入が安定しやすい","人の変化が直接見えやりがいが大きい"],
    weaknesses:["時間を売る構造になりがち","受講者対応でエネルギーを使う"],
    steps:[
      {title:"教えられることを10個書き出す", desc:"「普通すぎる」と思っていることが宝。仕事・趣味・経験すべてが候補になる。"},
      {title:"ストアカで無料体験レッスンを開く", desc:"最初は0円でいい。受講者の生の声がコンテンツの精度を上げる最高の教材。"},
      {title:"Udemyで動画講座を作り受動収入へ", desc:"一度作ったコースが寝ている間も売れ続ける。コーチング+動画で収益を多層化。"},
    ],
    platforms:["ストアカ","Udemy","Coconala","Zoom","Teachable"],
    aiTools:[
      {name:"Claude", use:"カリキュラム設計・レッスン資料の構成を一発で作成。教材制作が爆速になる。", url:"https://claude.ai"},
      {name:"Gamma", use:"講座スライドをAIが自動生成。デザイン品質が上がり受講者満足度も向上。", url:"https://gamma.app"},
      {name:"Descript", use:"動画の文字起こし・編集をAIが自動化。撮影後の編集作業がほぼゼロになる。", url:"https://www.descript.com"},
      {name:"Notion AI", use:"受講者管理・コース設計・FAQ作成を一元管理。コーチの作業基地として最適。", url:"https://www.notion.so"},
    ],
    keys:["people","service","social","knowledge"],
  },
  {
    id:"marketer", title:"Webマーケター・広告運用", subtitle:"数字で成果を出すデジタル戦略家",
    icon:"📈", tag:"STRATEGIC", tagColor:"#F2C46D", accentColor:"#F2C46D",
    incomeRange:"月5万〜100万円", timeline:"3〜6ヶ月", difficulty:4, remote:true,
    desc:"Google・Meta広告の運用、SEO改善、SNSマーケティング支援など、中小企業のWeb集客を担うフリーランス副業。データを読んで仮説を立てPDCAを回す力があれば、成果報酬型で大きく稼げる。",
    detail:"企業のマーケ担当不在問題は深刻で「月5万円でWeb広告を任せられる人」は引く手数多。Google広告の認定資格を取ってポートフォリオを作れば、3ヶ月で最初の案件が取れる。",
    strengths:["需要が高く案件が豊富","成果報酬型で青天井の収益も","デジタルスキルが副業以外でも活きる"],
    weaknesses:["初期の学習コストが高い","広告費の損失リスクを理解する必要がある"],
    steps:[
      {title:"Google・Meta広告の基礎を学ぶ", desc:"両社の公式学習プラットフォームは無料。認定資格は取得するだけで信頼が上がる。"},
      {title:"自分のSNSや架空案件で実績を作る", desc:"「自分のInstagramで成果を出した」実績が最高のポートフォリオになる。"},
      {title:"ランサーズ・知人経由で初案件を受注", desc:"最初は格安でも、1つの成功事例が次の案件単価を大きく引き上げる。"},
    ],
    platforms:["ランサーズ","クラウドワークス","Wantedly","X (Twitter)","LinkedIn"],
    aiTools:[
      {name:"ChatGPT", use:"広告コピー・LP文章の生成とA/Bテスト案の作成。クリエイティブ量産に最適。", url:"https://chat.openai.com"},
      {name:"Claude", use:"マーケティング戦略の立案・レポート文章化・競合分析の整理に強い。", url:"https://claude.ai"},
      {name:"Perplexity", use:"業界トレンド・競合リサーチを高速化。一次ソース付きで信頼性のある情報を収集。", url:"https://www.perplexity.ai"},
      {name:"Canva", use:"広告バナー・SNS投稿・提案資料をテンプレで即完成。デザイン時間をゼロに。", url:"https://www.canva.com"},
    ],
    keys:["analytical","social","digital","steady"],
  },
  {
    id:"designer", title:"グラフィック・UI/UXデザイナー", subtitle:"センスとツールで高単価を生み出す",
    icon:"🎨", tag:"CREATIVE TECH", tagColor:"#F28BAA", accentColor:"#F28BAA",
    incomeRange:"月3万〜80万円", timeline:"3〜9ヶ月", difficulty:4, remote:true,
    desc:"ロゴ・バナー・LP・UIデザインなど、視覚的価値を創り出す副業。CanvaレベルからFigma・Illustratorへとスキルアップすることで単価が指数関数的に上がる。AIデザインツールの普及で参入しやすい今がチャンス。",
    detail:"「デザインができる人材」は中小企業に絶対的に不足している。Webデザインは特に需要が高く制作会社からの外注案件も多い。UI/UXまで対応できれば、エンジニアと組んで大型案件も狙える。",
    strengths:["自己表現がそのまま収益になる","ポートフォリオが資産になる","需要が高く案件が途切れにくい"],
    weaknesses:["センスと技術の両方が必要","最初のポートフォリオ作りが難関"],
    steps:[
      {title:"Canvaで実績を作りロゴ・バナーを受注", desc:"CanvaレベルでもCoconalaやクラウドワークスで仕事は取れる。最初の1件が全て。"},
      {title:"Figmaを学んでWebデザインへ進化", desc:"Figmaは無料。UI設計ができるようになると単価が3〜5倍になる世界が見えてくる。"},
      {title:"ポートフォリオサイトを作って案件を増やす", desc:"Behanceで作品を発信。案件が向こうからやってくる状態を目指す。"},
    ],
    platforms:["Coconala","クラウドワークス","Behance","Dribbble","Figma"],
    aiTools:[
      {name:"Midjourney", use:"世界観・コンセプトビジュアルを秒速で生成。クライアントへの提案速度が上がる。", url:"https://www.midjourney.com"},
      {name:"Canva AI", use:"デザイン生成・背景削除・画像補正が全自動。制作速度が劇的に上がる。", url:"https://www.canva.com"},
      {name:"Claude", use:"デザインのコンセプト言語化・提案書の文章作成。クライアント説得力が上がる。", url:"https://claude.ai"},
      {name:"Adobe Firefly", use:"商用利用可能なAI画像生成。Adobeツールとシームレスに連携できる。", url:"https://firefly.adobe.com"},
    ],
    keys:["creative","technical","digital","solo"],
  },
  {
    id:"handmade", title:"物販・ハンドメイド・転売", subtitle:"モノで稼ぐ積み上げ最強ルート",
    icon:"📦", tag:"START TODAY", tagColor:"#89C4CF", accentColor:"#89C4CF",
    incomeRange:"月1万〜50万円", timeline:"即日〜1ヶ月", difficulty:2, remote:false,
    desc:"メルカリで不用品を売るところから始めて、仕入れ・転売・ハンドメイド・ドロップシッピングへとスケールアップできる物販副業。初期投資ゼロでも今日から稼ぐ体験ができる最速ルート。",
    detail:"物販の強みは「仕組みが目に見えること」。仕入れ→販売→利益のサイクルが明確でPDCAが回しやすい。メルカリで月2〜3万円稼げるようになったら、Amazon・Yahooへと販路を広げるのが正攻法。",
    strengths:["今日から始められる・初期投資ゼロ","仕組み化・外注化がしやすい","スキルより行動量で結果が出る"],
    weaknesses:["在庫リスク・資金繰りが発生する","リサーチ力がないと利益が出ない"],
    steps:[
      {title:"家の不用品を10点出品する", desc:"「売れる感覚」を体験することが全て。撮り方・タイトルの工夫で売上は3倍変わる。"},
      {title:"売れたカテゴリでリサーチ・仕入れへ", desc:"メルカリの「売り切れ」が需要の証拠。需要があるものを安く仕入れて高く売る。"},
      {title:"minneやCreemaでオリジナル商品へ", desc:"自分だけの商品は価格競争から解放される。ハンドメイドで独自ブランドを作ろう。"},
    ],
    platforms:["メルカリ","ラクマ","minne","Creema","Amazon"],
    aiTools:[
      {name:"ChatGPT", use:"商品タイトル・説明文を「売れる文章」に一瞬で変換。出品作業が爆速になる。", url:"https://chat.openai.com"},
      {name:"Claude", use:"ライバル商品の分析・差別化戦略の言語化。「なぜ売れているか」の整理が得意。", url:"https://claude.ai"},
      {name:"Canva", use:"商品画像の加工・販売バナー作成。見栄えが変わるだけで売上が劇的に変わる。", url:"https://www.canva.com"},
      {name:"Midjourney", use:"ハンドメイドのデザイン案を大量生成。オリジナルパターンの制作に最適。", url:"https://www.midjourney.com"},
    ],
    keys:["steady","service","digital","solo"],
  },
  {
    id:"affiliate", title:"アフィリエイター・ブロガー", subtitle:"SEOとコンテンツで資産を積み上げる",
    icon:"🔗", tag:"PASSIVE INCOME", tagColor:"#A8D8A8", accentColor:"#A8D8A8",
    incomeRange:"月1万〜100万円", timeline:"3〜12ヶ月", difficulty:3, remote:true,
    desc:"ブログやSNSで商品・サービスを紹介し、成約に応じて報酬を得るアフィリエイト副業。一度書いた記事が半永久的に収益を生み続ける「資産型副業」の代表格。正しいSEO戦略があれば不労所得に近い形が作れる。",
    detail:"最初の6ヶ月は無収入でも記事を書き続ける忍耐が必要。しかし正しいキーワード選定と記事構成を学べば、1記事が毎月数万円を生み出す状態になる。AIツールで記事制作が高速化した今が狙い目。",
    strengths:["一度作った資産が永続的に稼ぐ","完全自動・不労所得に近い形が作れる","初期費用がほぼゼロ"],
    weaknesses:["最初の半年〜1年は収益がほぼゼロ","Googleアップデートで収益が変動する"],
    steps:[
      {title:"WordPressブログを開設する", desc:"月1,000円程度のサーバー代だけで始められる。ドメインとサーバーを契約して即スタート。"},
      {title:"特化ジャンルを1つ決めて50記事書く", desc:"「副業・転職・美容・金融」など高単価ジャンルを選ぶのがポイント。量より質より継続。"},
      {title:"ASPに登録してアフィリエイト案件を選ぶ", desc:"A8.net・もしもアフィリエイト・afb に登録。読者の悩みに合った案件を自然に紹介する。"},
    ],
    platforms:["WordPress","A8.net","もしもアフィリエイト","X (Twitter)","Instagram"],
    aiTools:[
      {name:"Claude", use:"記事構成・見出し設計・本文の大幅な品質向上。SEOライティングの精度が上がる。", url:"https://claude.ai"},
      {name:"Perplexity", use:"キーワードリサーチ・競合分析・最新情報の収集を高速化。", url:"https://www.perplexity.ai"},
      {name:"ChatGPT", use:"タイトル案・メタディスクリプション・SNS投稿文の量産に最適。", url:"https://chat.openai.com"},
      {name:"Canva", use:"アイキャッチ画像・インフォグラフィックを秒速で作成。CTRが大幅に改善する。", url:"https://www.canva.com"},
    ],
    keys:["writing","analytical","steady","knowledge"],
  },
  {
    id:"translator", title:"翻訳・語学系副業", subtitle:"英語力を武器に高単価を狙う",
    icon:"🌍", tag:"LANGUAGE", tagColor:"#98D4E8", accentColor:"#98D4E8",
    incomeRange:"月2万〜40万円", timeline:"1〜3ヶ月", difficulty:3, remote:true,
    desc:"英語や他言語のスキルを活かした翻訳・通訳・語学コーチング副業。日英翻訳の需要は常に高く、IT・法律・医療などの専門分野に特化すれば1文字10円以上の高単価も狙える。",
    detail:"AI翻訳の進化で「翻訳そのもの」の単価は落ちているが、「AI翻訳を精度高くチェック・修正できる人間」の需要は逆に増加している。英語力×専門知識の掛け算で差別化する戦略が有効。",
    strengths:["英語力がそのまま武器になる","専門特化で高単価を狙いやすい","需要が安定して継続しやすい"],
    weaknesses:["語学力がないとスタートできない","AI翻訳との差別化が必要"],
    steps:[
      {title:"クラウドワークスで翻訳案件に応募", desc:"まずは得意分野の翻訳案件にひたすら応募。最初の実績が全てを変える。"},
      {title:"専門分野（IT・法律・医療）に特化する", desc:"「なんでも翻訳します」より「〇〇専門」の方が単価が3倍変わる。"},
      {title:"語学コーチングに展開する", desc:"英語を教える側に回れば時間単価が大幅に向上。ストアカで体験レッスンを開こう。"},
    ],
    platforms:["クラウドワークス","ランサーズ","Gengo","ストアカ","Zoom"],
    aiTools:[
      {name:"DeepL", use:"翻訳の初稿を高精度で生成。人間がチェック・修正するハイブリッド翻訳が効率的。", url:"https://www.deepl.com"},
      {name:"Claude", use:"翻訳の文脈確認・ニュアンスの調整・提案書の作成。長文翻訳でも品質が高い。", url:"https://claude.ai"},
      {name:"ChatGPT", use:"語学レッスン教材の作成・例文生成・学習プランの設計に最適。", url:"https://chat.openai.com"},
      {name:"Notion AI", use:"翻訳案件の管理・用語集の作成・クライアント対応の整理に活用。", url:"https://www.notion.so"},
    ],
    keys:["knowledge","people","writing","service"],
  },
  {
    id:"voiceover", title:"音声・ナレーション・ポッドキャスト", subtitle:"声と言葉で唯一無二の価値を届ける",
    icon:"🎙️", tag:"UNIQUE", tagColor:"#D4A8E8", accentColor:"#D4A8E8",
    incomeRange:"月1万〜30万円", timeline:"1〜4ヶ月", difficulty:3, remote:true,
    desc:"ナレーション・朗読・ポッドキャスト・音声コンテンツ販売など、「声」を武器にした副業。動画コンテンツの爆発的増加によりナレーター需要は急増中。自分のポッドキャストを育てれば広告収入も狙える。",
    detail:"声の仕事は参入障壁が低く見えるが、「聴きやすい声・間の取り方・感情表現」が差別化のポイント。スマホ1台から始められるが、マイクに少し投資するだけで品質が劇的に変わる。",
    strengths:["スマホ1台で始められる","AIに代替されにくい個性がある","コンテンツ資産が積み上がる"],
    weaknesses:["収益化まで認知獲得が必要","声質・機材への投資が品質に影響する"],
    steps:[
      {title:"Coconalaでナレーション案件を受注", desc:"まずは格安でも実績を作る。「5分以内の動画ナレーション」から始めるのが入りやすい。"},
      {title:"ポッドキャストを週1配信で始める", desc:"Anchorなら無料で始められる。100エピソードで収益化の道が開けてくる。"},
      {title:"音声コンテンツ・朗読を販売する", desc:"noteやBASEで朗読コンテンツ・音声教材を販売。一度作れば何度でも売れる。"},
    ],
    platforms:["Coconala","Anchor","Spotify","note","YouTube"],
    aiTools:[
      {name:"Descript", use:"音声編集・ノイズ除去・文字起こしを全自動化。編集作業が劇的に短縮される。", url:"https://www.descript.com"},
      {name:"Claude", use:"ポッドキャストの構成・台本・エピソードアイデアを量産。ネタ切れとは無縁に。", url:"https://claude.ai"},
      {name:"ElevenLabs", use:"自分の声をAI学習させてコンテンツ量産。声のクローンで新しい収益源が生まれる。", url:"https://elevenlabs.io"},
      {name:"ChatGPT", use:"台本の草案作成・SNS告知文・エピソードタイトルを即生成。", url:"https://chat.openai.com"},
    ],
    keys:["creative","people","writing","social"],
  },
  {
    id:"investor", title:"投資・資産運用", subtitle:"お金にお金を稼がせる仕組みを作る",
    icon:"💹", tag:"PASSIVE", tagColor:"#C8E8A8", accentColor:"#C8E8A8",
    incomeRange:"月1万〜∞", timeline:"即日〜", difficulty:3, remote:true,
    desc:"株式・インデックス投資・不動産・仮想通貨など、資産を増やす「お金の副業」。厳密には副業ではないが、本業収入を投資に回す仕組みを作ることで、長期的に最も大きなリターンを得られる可能性がある。",
    detail:"投資は「時間を売る」副業ではなく「お金に働いてもらう」仕組み。特にインデックス投資は長期で見れば最も確実性が高い資産形成手段の一つ。副業収入の一部を投資に回すハイブリッド戦略が最強。",
    strengths:["時間・場所・スキルが不要","複利の力で長期的に大きく育つ","完全自動化できる仕組みが作れる"],
    weaknesses:["元本割れリスクがある","短期間では大きな収益は期待できない"],
    steps:[
      {title:"SBI証券・楽天証券でNISA口座を開設", desc:"まず非課税枠を最大活用。月5,000円からでもインデックス積立を始める。"},
      {title:"インデックス投資の基礎を学ぶ", desc:"「お金の大学」「敗者のゲーム」など基礎書籍を2〜3冊読むだけで土台ができる。"},
      {title:"副業収益の50%を自動積立に設定する", desc:"他の副業で稼いだ収益を自動投資に回すハイブリッド戦略が最も強力。"},
    ],
    platforms:["SBI証券","楽天証券","つみたてNISA","iDeCo","Coincheck"],
    aiTools:[
      {name:"Perplexity", use:"投資先のリサーチ・企業分析・市場動向の収集を高速化。情報の質が上がる。", url:"https://www.perplexity.ai"},
      {name:"Claude", use:"投資戦略の整理・ポートフォリオ設計の考え方を一緒に整理できる。", url:"https://claude.ai"},
      {name:"ChatGPT", use:"決算書の読み方・投資用語の解説・銘柄スクリーニングの補助に活用。", url:"https://chat.openai.com"},
      {name:"Notion AI", use:"投資記録・家計管理・ポートフォリオのトラッキングを自動化。", url:"https://www.notion.so"},
    ],
    keys:["analytical","steady","knowledge","digital"],
  },
];

// ── SCORING ───────────────────────────────────────────────────
function calcResult(answers) {
  const total = {};
  answers.forEach(scores => {
    Object.entries(scores).forEach(([k, v]) => { total[k] = (total[k] || 0) + v; });
  });
  const scored = RESULTS.map(r => {
    const s = r.keys.reduce((sum, k) => sum + (total[k] || 0), 0);
    return { ...r, score: s };
  });
  return scored.sort((a, b) => b.score - a.score)[0];
}

// ── DIFF BAR ─────────────────────────────────────────────────
const DiffBar = ({ level, color }) => (
  <div style={{ display:"flex", gap:4, alignItems:"center" }}>
    {[1,2,3,4,5].map(i => (
      <div key={i} style={{ width:24, height:3, borderRadius:2, background: i<=level ? color : "rgba(255,255,255,0.12)" }} />
    ))}
    <span style={{ fontSize:14, color:"rgba(255,255,255,0.8)", marginLeft:6 }}>
      {["","★","★★","★★★","★★★★","★★★★★"][level]}
    </span>
  </div>
);

// ── BLOCK PROGRESS ───────────────────────────────────────────
const BLOCKS = ["PERSONALITY","SKILL","INCOME","LIFESTYLE","INTEREST","VISION"];
const BLOCK_JA = ["性格・価値観","スキル・強み","お金・収入観","働き方","興味・関心","ビジョン"];

// ── MAIN ──────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("intro");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sel, setSel] = useState(null);
  const [fading, setFading] = useState(false);
  const [result, setResult] = useState(null);
  const [loadPct, setLoadPct] = useState(0);
  const [activeAI, setActiveAI] = useState(null);
  const [rev, setRev] = useState(0);
  const topRef = useRef(null);

  // Loading
  useEffect(() => {
    if (phase !== "loading") return;
    setLoadPct(0);
    const steps = [8,20,35,52,68,82,93,100];
    let i = 0;
    const t = setInterval(() => {
      if (i >= steps.length) { clearInterval(t); setTimeout(() => setPhase("result"), 400); return; }
      setLoadPct(steps[i++]);
    }, 300);
    return () => clearInterval(t);
  }, [phase]);

  // Reveal
  useEffect(() => {
    if (phase !== "result") return;
    setRev(0);
    let i = 0;
    const t = setInterval(() => { i++; setRev(i); if (i >= 30) clearInterval(t); }, 90);
    return () => clearInterval(t);
  }, [phase]);

  const handleSelect = (opt, idx) => {
    if (fading || sel !== null) return;
    setSel(idx);
    setTimeout(() => {
      const na = [...answers, opt.scores];
      if (qIdx + 1 >= QUESTIONS.length) {
        setResult(calcResult(na));
        setFading(true);
        setTimeout(() => { setPhase("loading"); setFading(false); }, 500);
      } else {
        setFading(true);
        setTimeout(() => {
          setAnswers(na); setQIdx(qIdx + 1); setSel(null); setFading(false);
          topRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 400);
      }
    }, 300);
  };

  const restart = () => {
    setPhase("intro"); setQIdx(0); setAnswers([]); setSel(null);
    setFading(false); setResult(null); setLoadPct(0); setActiveAI(null); setRev(0);
  };

  const blockIdx = BLOCKS.indexOf(QUESTIONS[qIdx]?.block);
  const blockProgress = qIdx % 5;

  return (
    <div ref={topRef} style={{ minHeight:"100vh", background:"#0C0C12", color:"#fff", fontFamily:"'Georgia','Hiragino Mincho ProN','Yu Mincho',serif", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 16px", position:"relative", overflow:"hidden" }}>

      {/* bg grid */}
      <div style={{ position:"fixed", inset:0, zIndex:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)", backgroundSize:"64px 64px", pointerEvents:"none" }} />
      <div style={{ position:"fixed", top:"5%", left:"5%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(100,60,220,0.055) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:"5%", right:"5%", width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(220,100,60,0.04) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes scaleUp{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
        .opt:hover{background:rgba(255,255,255,0.18)!important;border-color:rgba(255,255,255,0.8)!important;transform:translateX(5px)!important}
        .ai-r:hover{background:rgba(255,255,255,0.12)!important}
        .cta-line:hover{background:#fff!important;color:#0C0C12!important}
        .line-btn:hover{opacity:.88!important;transform:scale(1.02)!important}
        .rb:hover{border-color:rgba(255,255,255,0.6)!important;color:rgba(255,255,255,0.9)!important}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.13);border-radius:3px}
      `}</style>

      <div style={{ width:"100%", maxWidth:680, position:"relative", zIndex:1 }}>

        {/* ══ INTRO ══ */}
        {phase === "intro" && (
          <div style={{ animation:"scaleUp .5s ease-out" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:52 }}>
              <div style={{ height:1, flex:1, background:"rgba(255,255,255,0.12)" }} />
              <span style={{ fontSize:14, letterSpacing:4, color:"rgba(255,255,255,0.7)" }}>FUKUGYOU DIAGNOSIS</span>
              <div style={{ height:1, flex:1, background:"rgba(255,255,255,0.12)" }} />
            </div>
            <h1 style={{ fontSize:32, fontWeight:400, lineHeight:1.45, margin:"0 0 18px", letterSpacing:"-0.5px" }}>
              あなたに本当に<br/>
              <span style={{ fontStyle:"italic", color:"rgba(255,255,255,0.8)" }}>合う</span>副業を、<br/>
              見つけよう。
            </h1>
            <p style={{ color:"rgba(255,255,255,0.85)", fontSize:14, lineHeight:2, margin:"0 0 36px" }}>
              30の質問に答えるだけ。<br/>
              12種類の副業タイプ＋おすすめAIまで完全診断。
            </p>

            {/* blocks preview */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:40 }}>
              {BLOCK_JA.map((b, i) => (
                <div key={i} style={{ padding:"10px 12px", border:"1.5px solid rgba(255,255,255,0.38)", borderRadius:4, fontSize:14, color:"rgba(255,255,255,0.85)", textAlign:"center" }}>
                  {["🧠","🛠","💰","🌿","💡","🔭"][i]} {b}
                </div>
              ))}
            </div>

            {/* result types */}
            <div style={{ marginBottom:44 }}>
              <div style={{ fontSize:14, letterSpacing:3, color:"rgba(255,255,255,0.28)", marginBottom:14 }}>診断できる副業タイプ（12種）</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {RESULTS.map(r => (
                  <div key={r.id} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 11px", border:"1px solid rgba(255,255,255,0.95)", borderRadius:3, fontSize:13, color:"rgba(255,255,255,0.85)" }}>
                    <span>{r.icon}</span><span>{r.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="cta-line" onClick={() => setPhase("quiz")} style={{ width:"100%", padding:"18px 0", background:"rgba(255,255,255,0.92)", color:"#0C0C12", border:"none", borderRadius:4, fontSize:17, fontWeight:700, fontFamily:"Georgia,serif", letterSpacing:1, cursor:"pointer", transition:"all .2s" }}>
              診断を始める →
            </button>
            <p style={{ textAlign:"center", color:"rgba(255,255,255,0.28)", fontSize:14, marginTop:12, letterSpacing:1 }}>30問 / 所要時間 約 3〜4 分</p>
          </div>
        )}

        {/* ══ QUIZ ══ */}
        {phase === "quiz" && (
          <div style={{ opacity:fading?0:1, transform:fading?"translateX(-14px)":"translateX(0)", transition:"all .35s ease" }}>

            {/* block nav */}
            <div style={{ display:"flex", gap:6, marginBottom:24 }}>
              {BLOCKS.map((b, i) => (
                <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i < blockIdx ? "rgba(255,255,255,0.8)" : i === blockIdx ? "#fff" : "rgba(255,255,255,0.2)", transition:"background .4s" }} />
              ))}
            </div>

            {/* meta */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:14, letterSpacing:3, color:"rgba(255,255,255,0.7)" }}>{QUESTIONS[qIdx].blockJa}</span>
              <span style={{ fontSize:14, color:"rgba(255,255,255,0.9)", fontFamily:"Georgia,serif" }}>{qIdx + 1} / {QUESTIONS.length}</span>
            </div>

            {/* sub progress */}
            <div style={{ height:1, background:"rgba(255,255,255,0.1)", marginBottom:32, position:"relative" }}>
              <div style={{ position:"absolute", top:0, left:0, height:"100%", width:`${(blockProgress/5)*100}%`, background:"rgba(255,255,255,0.45)", transition:"width .4s ease" }} />
            </div>

            <h2 style={{ fontSize:24, fontWeight:400, lineHeight:1.65, margin:"0 0 32px", animation:"fadeUp .4s ease-out" }}>
              {QUESTIONS[qIdx].question}
            </h2>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {QUESTIONS[qIdx].options.map((opt, idx) => (
                <button key={idx} className="opt" onClick={() => handleSelect(opt, idx)} style={{
                  background: sel===idx ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
                  border: sel===idx ? "1.5px solid rgba(255,255,255,0.9)" : "1.5px solid rgba(255,255,255,0.4)",
                  borderRadius:4, padding:"15px 18px", textAlign:"left",
                  color: "#fff",
                  fontSize:16, lineHeight:1.6, fontFamily:"Georgia,serif",
                  animation:`fadeUp .4s ease-out ${idx*.06}s both`,
                  display:"flex", alignItems:"center", gap:14, transition:"all .17s ease",
                }}>
                  <span style={{ width:18, height:18, borderRadius:"50%", border: sel===idx ? "2px solid #fff" : "2px solid rgba(255,255,255,0.55)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {sel===idx && <span style={{ width:7, height:7, borderRadius:"50%", background:"#fff", display:"block" }} />}
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ LOADING ══ */}
        {phase === "loading" && (
          <div style={{ textAlign:"center", animation:"fadeIn .4s ease-out" }}>
            <div style={{ fontSize:14, letterSpacing:4, color:"rgba(255,255,255,0.35)", marginBottom:36 }}>ANALYZING YOUR ANSWERS</div>
            <div style={{ fontSize:56, marginBottom:28, animation:"pulse 1.2s ease-in-out infinite" }}>{result?.icon || "🔍"}</div>
            <div style={{ width:"100%", height:1, background:"rgba(255,255,255,0.1)", position:"relative", marginBottom:20 }}>
              <div style={{ position:"absolute", top:0, left:0, height:"100%", width:`${loadPct}%`, background:"rgba(255,255,255,0.6)", transition:"width .32s ease" }} />
            </div>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:14, letterSpacing:1 }}>
              {loadPct < 25 ? "回答を分析しています..." : loadPct < 55 ? "あなたの特性を計測中..." : loadPct < 85 ? "最適な副業タイプを照合中..." : "診断完了。"}
            </p>
          </div>
        )}

        {/* ══ RESULT ══ */}
        {phase === "result" && result && (
          <div style={{ animation:"scaleUp .5s ease-out" }}>

            {/* header rule */}
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:36, opacity:rev>=1?1:0, transition:"opacity .3s" }}>
              <div style={{ height:1, flex:1, background:"rgba(255,255,255,0.12)" }} />
              <span style={{ fontSize:14, letterSpacing:4, color:"rgba(255,255,255,0.7)" }}>DIAGNOSIS RESULT</span>
              <div style={{ height:1, flex:1, background:"rgba(255,255,255,0.12)" }} />
            </div>

            {/* hero */}
            <div style={{ marginBottom:28, opacity:rev>=2?1:0, transition:"opacity .4s .05s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ display:"inline-flex", alignItems:"center", padding:"3px 10px", border:`1px solid ${result.accentColor}55`, borderRadius:2, marginBottom:14 }}>
                    <span style={{ fontSize:9, letterSpacing:3, color:result.accentColor }}>{result.tag}</span>
                  </div>
                  <h2 style={{ fontSize:24, fontWeight:400, margin:"0 0 6px", lineHeight:1.2 }}>{result.title}</h2>
                  <p style={{ color:"rgba(255,255,255,0.85)", fontSize:14, margin:0 }}>{result.subtitle}</p>
                </div>
                <div style={{ fontSize:56, lineHeight:1, flexShrink:0 }}>{result.icon}</div>
              </div>
            </div>

            {/* stats grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20, opacity:rev>=3?1:0, transition:"opacity .4s .1s" }}>
              {[
                {label:"想定収入", value:result.incomeRange},
                {label:"収益化まで", value:result.timeline},
                {label:"フルリモート", value:result.remote?"対応可":"要相談"},
              ].map(({label,value}) => (
                <div key={label} style={{ padding:"13px 10px", border:"1px solid rgba(255,255,255,0.95)", borderRadius:4 }}>
                  <div style={{ fontSize:14, color:"rgba(255,255,255,0.7)", letterSpacing:1, marginBottom:6 }}>{label}</div>
                  <div style={{ fontSize:22, fontWeight:700, color:result.accentColor }}>{value}</div>
                </div>
              ))}
            </div>

            {/* difficulty */}
            <div style={{ padding:"13px 15px", border:"1px solid rgba(255,255,255,0.95)", borderRadius:4, marginBottom:20, opacity:rev>=4?1:0, transition:"opacity .4s .15s" }}>
              <div style={{ fontSize:14, color:"rgba(255,255,255,0.7)", letterSpacing:1, marginBottom:8 }}>難易度</div>
              <DiffBar level={result.difficulty} color={result.accentColor} />
            </div>

            {/* desc */}
            <div style={{ marginBottom:20, opacity:rev>=5?1:0, transition:"opacity .4s .2s" }}>
              <p style={{ color:"rgba(255,255,255,0.95)", fontSize:14, lineHeight:1.9, margin:"0 0 12px" }}>{result.desc}</p>
              <p style={{ color:"rgba(255,255,255,0.95)", fontSize:14, lineHeight:1.85, margin:0, borderLeft:`2px solid ${result.accentColor}44`, paddingLeft:14 }}>{result.detail}</p>
            </div>

            {/* strengths / weaknesses */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20, opacity:rev>=6?1:0, transition:"opacity .4s .25s" }}>
              {[
                {label:"STRENGTHS", labelColor:result.accentColor, items:result.strengths, textColor:"rgba(255,255,255,0.78)"},
                {label:"CAUTION", labelColor:"rgba(255,160,100,0.85)", items:result.weaknesses, textColor:"rgba(255,255,255,0.52)"},
              ].map(({label,labelColor,items,textColor}) => (
                <div key={label} style={{ padding:15, border:"1px solid rgba(255,255,255,0.95)", borderRadius:4 }}>
                  <div style={{ fontSize:14, letterSpacing:2, color:labelColor, marginBottom:12 }}>{label}</div>
                  {items.map((s,i) => (
                    <div key={i} style={{ fontSize:22, color:textColor, lineHeight:1.8, paddingLeft:10, position:"relative" }}>
                      <span style={{ position:"absolute", left:0, color:labelColor }}>·</span>{s}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* steps */}
            <div style={{ marginBottom:20, opacity:rev>=7?1:0, transition:"opacity .4s .3s" }}>
              <div style={{ fontSize:14, letterSpacing:3, color:"rgba(255,255,255,0.65)", marginBottom:18 }}>FIRST 3 STEPS</div>
              {result.steps.map((s,i) => (
                <div key={i} style={{ display:"flex", gap:16, padding:"15px 0", borderBottom: i<2 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                  <div style={{ flexShrink:0, width:28, height:28, border:`1px solid ${result.accentColor}55`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:result.accentColor, fontFamily:"Georgia,serif" }}>{i+1}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{s.title}</div>
                    <div style={{ fontSize:22, color:"rgba(255,255,255,0.95)", lineHeight:1.75 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* platforms */}
            <div style={{ marginBottom:20, opacity:rev>=8?1:0, transition:"opacity .4s .35s" }}>
              <div style={{ fontSize:14, letterSpacing:3, color:"rgba(255,255,255,0.65)", marginBottom:12 }}>PLATFORMS</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                {result.platforms.map(p => (
                  <span key={p} style={{ padding:"5px 11px", border:"1px solid rgba(255,255,255,0.12)", borderRadius:2, fontSize:22, color:"rgba(255,255,255,0.88)" }}>{p}</span>
                ))}
              </div>
            </div>

            {/* AI tools */}
            <div style={{ marginBottom:32, opacity:rev>=9?1:0, transition:"opacity .4s .4s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div style={{ fontSize:14, letterSpacing:3, color:"rgba(255,255,255,0.65)" }}>RECOMMENDED AI TOOLS</div>
                <div style={{ fontSize:14, color:"rgba(255,255,255,0.3)" }}>タップで詳細</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {result.aiTools.map((ai,i) => (
                  <div key={i} className="ai-r" onClick={() => setActiveAI(activeAI===i?null:i)} style={{ padding:"13px 15px", background:activeAI===i?"rgba(255,255,255,0.1)":"transparent", border:"1.5px solid rgba(255,255,255,0.35)", borderRadius:4, cursor:"pointer", transition:"all .18s ease" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:14, fontWeight:700, color:result.accentColor }}>{ai.name}</span>
                        {activeAI!==i && <span style={{ fontSize:22, color:"rgba(255,255,255,0.7)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:220 }}>{ai.use}</span>}
                      </div>
                      <span style={{ fontSize:22, color:"rgba(255,255,255,0.28)", transform:activeAI===i?"rotate(90deg)":"rotate(0)", transition:"transform .2s", display:"block" }}>›</span>
                    </div>
                    {activeAI===i && (
                      <div style={{ marginTop:10, animation:"fadeIn .2s ease-out" }}>
                        <p style={{ fontSize:14, color:"rgba(255,255,255,0.88)", lineHeight:1.75, margin:"0 0 12px" }}>{ai.use}</p>
                        <a href={ai.url} target="_blank" rel="noopener noreferrer" style={{ display:"inline-block", padding:"7px 16px", border:`1px solid ${result.accentColor}66`, borderRadius:2, fontSize:22, color:result.accentColor, textDecoration:"none", letterSpacing:1 }} onClick={e=>e.stopPropagation()}>
                          開く →
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* divider */}
            <div style={{ height:1, background:"rgba(255,255,255,0.2)", marginBottom:20, opacity:rev>=10?1:0, transition:"opacity .4s .45s" }} />

            {/* restart */}
            <button className="rb" onClick={restart} style={{ width:"100%", padding:"15px 0", background:"transparent", border:"1.5px solid rgba(255,255,255,0.35)", borderRadius:4, color:"rgba(255,255,255,0.85)", fontSize:22, fontFamily:"Georgia,serif", letterSpacing:1, cursor:"pointer", transition:"all .2s", opacity:rev>=10?1:0 }}>
              もう一度診断する
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
