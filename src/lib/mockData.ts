export type Rank = 'A' | 'B' | 'C' | 'D' | 'E';
export type ScenarioResult = 'pass' | 'fail';
export type InterviewStatus = 'completed' | 'in_progress' | 'pending';

export interface Scores {
  listening: number;
  keigo: number;
  tone: number;
  adaptability: number;
  regionalFit: number;
}

export interface HighlightClip {
  type: 'best' | 'challenge';
  label: string;
  startTime: number;
  endTime: number;
  transcript: string;
}

export interface ScenarioDetail {
  id: string;
  name: string;
  description: string;
  result: ScenarioResult;
  score: number;
  feedback: string;
  improvementPoints: string[];
}

export interface OnboardingAdvice {
  priority: 'high' | 'medium' | 'low';
  category: string;
  advice: string;
}

export interface Candidate {
  id: string;
  name: string;
  nameReading: string;
  nationality: string;
  nationalityFlag: string;
  desiredPosition: string;
  interviewDate: string;
  status: InterviewStatus;
  rank: Rank;
  overallScore: number;
  aiComment: string;
  scores: Scores;
  highlights: HighlightClip[];
  scenarios: ScenarioDetail[];
  onboardingAdvice: OnboardingAdvice[];
  responseTimeAvg: number;
  interviewDuration: number;
}

export const scoreLabels: Record<keyof Scores, string> = {
  listening: 'リスニング',
  keigo: '接客敬語の正確さ',
  tone: '声のトーン・愛嬌',
  adaptability: '臨機応変さ',
  regionalFit: '地域適応力',
};

export const scoreDescriptions: Record<keyof Scores, string> = {
  listening: '聞き取りの正確さ・理解力',
  keigo: '不自然なバイト敬語の検知を含む',
  tone: '音声データからの感情・活気分析',
  adaptability: '沈黙秒数や想定外の質問への対応力',
  regionalFit: 'ローカルな会話のトーンへの対応',
};

export const candidates: Candidate[] = [
  {
    id: 'c001',
    name: 'Nguyễn Thị Minh Anh',
    nameReading: 'グエン・ティ・ミンアン',
    nationality: 'ベトナム',
    nationalityFlag: '🇻🇳',
    desiredPosition: 'ホールスタッフ',
    interviewDate: '2025-03-08T14:30:00',
    status: 'completed',
    rank: 'A',
    overallScore: 4.6,
    aiComment: '即戦力として期待できます。敬語の使い分けが自然で、クレーム対応でも冷静さを保っています。関西弁への対応にもユーモアを交え、お客様との距離感の取り方が上手です。',
    scores: {
      listening: 4.8,
      keigo: 4.5,
      tone: 4.7,
      adaptability: 4.4,
      regionalFit: 4.6,
    },
    highlights: [
      {
        type: 'best',
        label: 'クレーム対応 — 料理の遅延説明',
        startTime: 245,
        endTime: 260,
        transcript: 'お待たせして大変申し訳ございません。ただいまお料理をお作りしておりますので、あと5分ほどお時間いただけますでしょうか。お詫びにサラダをお持ちいたします。',
      },
      {
        type: 'challenge',
        label: '方言混じりの常連客対応',
        startTime: 380,
        endTime: 400,
        transcript: 'あ、えっと...そうですね、今日のおすすめは...はい、あの...焼き魚定食がとても人気です。えっと、おいしいです。',
      },
    ],
    scenarios: [
      {
        id: 's1',
        name: 'シナリオA: 基本のオーダー取り',
        description: 'イレギュラーな注文を含む基本的なオーダー対応',
        result: 'pass',
        score: 4.7,
        feedback: 'アレルギー確認を自発的に行い、代替メニューの提案もスムーズでした。注文の復唱も正確です。',
        improvementPoints: ['ドリンクメニューの説明がやや簡潔すぎる', '季節限定メニューの案内を忘れている'],
      },
      {
        id: 's2',
        name: 'シナリオB: 混雑時のクレーム対応',
        description: '料理が遅い等へのクッション言葉のテスト',
        result: 'pass',
        score: 4.5,
        feedback: 'クッション言葉を適切に使用し、お客様の怒りを和らげることができました。代替案の提示も的確です。',
        improvementPoints: ['最初の謝罪がやや遅い', '具体的な待ち時間の提示をもう少し早くできるとベター'],
      },
      {
        id: 's3',
        name: 'シナリオC: 常連客との会話',
        description: '関西弁混じり・おすすめ提案のアドリブ対応',
        result: 'pass',
        score: 4.2,
        feedback: '方言への反応は自然でしたが、おすすめメニューの提案にやや時間がかかりました。笑顔が伝わるトーンは好印象。',
        improvementPoints: ['関西弁の聞き取りにやや不安あり', 'おすすめ理由をもう少し具体的に'],
      },
    ],
    onboardingAdvice: [
      { priority: 'medium', category: '方言対応', advice: '関西弁の基本フレーズ（「おおきに」「なんぼ」等）を事前に学習させる。常連客との会話パターンを3日間OJTで練習。' },
      { priority: 'low', category: 'メニュー知識', advice: '季節限定メニューとドリンクメニューの特徴を暗記させる。特にアルコール類の説明ができるように。' },
      { priority: 'low', category: '接客テンポ', advice: 'ピーク時のオペレーションを早い段階で経験させ、マルチタスクに慣れさせる。' },
    ],
    responseTimeAvg: 1.8,
    interviewDuration: 720,
  },
  {
    id: 'c002',
    name: 'Kim Soo-jin',
    nameReading: 'キム・スジン',
    nationality: '韓国',
    nationalityFlag: '🇰🇷',
    desiredPosition: 'キッチンスタッフ',
    interviewDate: '2025-03-08T10:00:00',
    status: 'completed',
    rank: 'B',
    overallScore: 3.8,
    aiComment: '基本的な接客力は十分です。敬語の使い方に一部不自然さがありますが、聞き取り能力が高く、研修次第で短期間でレベルアップが見込めます。',
    scores: {
      listening: 4.2,
      keigo: 3.5,
      tone: 4.0,
      adaptability: 3.6,
      regionalFit: 3.7,
    },
    highlights: [
      {
        type: 'best',
        label: 'オーダー取り — 復唱の正確さ',
        startTime: 120,
        endTime: 135,
        transcript: 'かしこまりました。生ビール2つ、枝豆、唐揚げ、それとサーモンのお刺身をおひとつですね。少々お待ちください。',
      },
      {
        type: 'challenge',
        label: 'クッション言葉の不足',
        startTime: 310,
        endTime: 330,
        transcript: 'すみません、今日は混んでいるので遅くなっています。もう少し待ってください。...あ、申し訳ないです。',
      },
    ],
    scenarios: [
      {
        id: 's1',
        name: 'シナリオA: 基本のオーダー取り',
        description: 'イレギュラーな注文を含む基本的なオーダー対応',
        result: 'pass',
        score: 4.0,
        feedback: '注文の復唱は完璧でした。ただし、メニューにない組み合わせのリクエストへの対応がやや硬い印象です。',
        improvementPoints: ['メニュー外リクエストへの柔軟な対応', 'おすすめの提案を自発的に'],
      },
      {
        id: 's2',
        name: 'シナリオB: 混雑時のクレーム対応',
        description: '料理が遅い等へのクッション言葉のテスト',
        result: 'fail',
        score: 3.2,
        feedback: 'クッション言葉が不足しており、直接的な表現になってしまいました。「お待たせして申し訳ございません」が出るまでに時間がかかりました。',
        improvementPoints: ['クッション言葉のレパートリーを増やす', '謝罪→説明→代替案の順序を徹底'],
      },
      {
        id: 's3',
        name: 'シナリオC: 常連客との会話',
        description: '関西弁混じり・おすすめ提案のアドリブ対応',
        result: 'pass',
        score: 3.6,
        feedback: '親しみやすいトーンは良いですが、方言の理解にやや苦労している場面がありました。',
        improvementPoints: ['方言フレーズの学習', 'より自然な相づちのバリエーション'],
      },
    ],
    onboardingAdvice: [
      { priority: 'high', category: 'クッション言葉', advice: '「恐れ入りますが」「お手数ですが」「あいにく」等のフレーズを毎日のロールプレイで50回反復練習。' },
      { priority: 'medium', category: '敬語矯正', advice: '「〜になります」→「〜でございます」等のバイト敬語を修正。チェックリストを作成し、毎シフト前に確認。' },
      { priority: 'low', category: 'メニュー知識', advice: 'キッチン経験を活かし、料理の食材や調理法も説明できるようにする。' },
    ],
    responseTimeAvg: 2.3,
    interviewDuration: 680,
  },
  {
    id: 'c003',
    name: 'Carlos Eduardo Santos',
    nameReading: 'カルロス・エドゥアルド・サントス',
    nationality: 'ブラジル',
    nationalityFlag: '🇧🇷',
    desiredPosition: 'ホールスタッフ',
    interviewDate: '2025-03-07T16:00:00',
    status: 'completed',
    rank: 'B',
    overallScore: 3.9,
    aiComment: '明るいトーンとフレンドリーな接客スタイルが魅力です。敬語はまだ発展途上ですが、お客様を楽しませる力があります。居酒屋やカジュアルレストランに適性あり。',
    scores: {
      listening: 3.8,
      keigo: 3.4,
      tone: 4.8,
      adaptability: 4.0,
      regionalFit: 3.5,
    },
    highlights: [
      {
        type: 'best',
        label: 'おすすめ提案 — 熱量のある紹介',
        startTime: 200,
        endTime: 215,
        transcript: '今日は特に焼き鳥がおすすめです！大将が朝から仕込んでいて、タレも塩もどっちも最高ですよ！ビールと一緒にいかがですか？',
      },
      {
        type: 'challenge',
        label: '敬語の混乱',
        startTime: 350,
        endTime: 370,
        transcript: 'お料理、もうちょっとで来ますので...えっと、来られます？いえ、お持ちします…参ります…少々お待ちいただけますか。',
      },
    ],
    scenarios: [
      {
        id: 's1',
        name: 'シナリオA: 基本のオーダー取り',
        description: 'イレギュラーな注文を含む基本的なオーダー対応',
        result: 'pass',
        score: 3.8,
        feedback: '元気の良い対応でお客様の印象は良いですが、メニュー名の発音に一部不正確な箇所がありました。',
        improvementPoints: ['メニュー名の正確な発音練習', '「かしこまりました」の自然な使用'],
      },
      {
        id: 's2',
        name: 'シナリオB: 混雑時のクレーム対応',
        description: '料理が遅い等へのクッション言葉のテスト',
        result: 'pass',
        score: 3.6,
        feedback: '誠意は伝わりますが、尊敬語と謙譲語の混用が見られました。気持ちの良い笑顔（声のトーン）でカバーしている面があります。',
        improvementPoints: ['尊敬語・謙譲語の使い分け', '「お待たせして申し訳ございません」を最初に'],
      },
      {
        id: 's3',
        name: 'シナリオC: 常連客との会話',
        description: '関西弁混じり・おすすめ提案のアドリブ対応',
        result: 'pass',
        score: 3.8,
        feedback: 'ノリの良さが活きて、常連客との距離感が自然でした。方言は理解しきれない部分もありましたが、聞き返し方が上手でした。',
        improvementPoints: ['方言の聞き取り強化', '地元イベントや季節の話題を仕入れる'],
      },
    ],
    onboardingAdvice: [
      { priority: 'high', category: '敬語の基礎固め', advice: '尊敬語・謙譲語・丁寧語の3分類を表にまとめ、毎日10分のドリルを実施。特に「いらっしゃいませ」「かしこまりました」「少々お待ちください」の3大フレーズを完璧に。' },
      { priority: 'medium', category: 'メニュー発音', advice: '主要メニュー20品の名前と説明を声に出して練習。先輩スタッフとのペアロールプレイ推奨。' },
      { priority: 'low', category: 'トーン活用', advice: '持ち前の明るさを活かしつつ、TPOに応じたトーンの切り替えを練習。クレーム時は声を落とす等。' },
    ],
    responseTimeAvg: 1.5,
    interviewDuration: 700,
  },
  {
    id: 'c004',
    name: 'Maria Garcia Lopez',
    nameReading: 'マリア・ガルシア・ロペス',
    nationality: 'フィリピン',
    nationalityFlag: '🇵🇭',
    desiredPosition: 'ホールスタッフ',
    interviewDate: '2025-03-07T11:00:00',
    status: 'completed',
    rank: 'C',
    overallScore: 3.2,
    aiComment: '基本的な日本語力はありますが、接客場面での応用力に課題があります。特にクレーム対応と敬語のバリエーションの強化が必要です。1〜2ヶ月の研修でBランクレベルに到達する可能性あり。',
    scores: {
      listening: 3.5,
      keigo: 2.8,
      tone: 3.8,
      adaptability: 3.0,
      regionalFit: 2.9,
    },
    highlights: [
      {
        type: 'best',
        label: '笑顔の伝わるオーダー対応',
        startTime: 90,
        endTime: 105,
        transcript: 'いらっしゃいませ！何名様ですか？お好きなお席にどうぞ。メニューをお持ちしますね。',
      },
      {
        type: 'challenge',
        label: 'クレーム対応での言葉詰まり',
        startTime: 290,
        endTime: 310,
        transcript: 'あ...すみません...えーと...料理は、作っています...もう少し...すみません、ちょっと待って...ください...',
      },
    ],
    scenarios: [
      {
        id: 's1',
        name: 'シナリオA: 基本のオーダー取り',
        description: 'イレギュラーな注文を含む基本的なオーダー対応',
        result: 'pass',
        score: 3.5,
        feedback: '基本的なオーダー取りはできていますが、イレギュラーな注文（アレルギー対応・メニュー変更）で戸惑いが見られました。',
        improvementPoints: ['イレギュラー対応のフレーズ暗記', '分からない時は「確認いたします」と伝える練習'],
      },
      {
        id: 's2',
        name: 'シナリオB: 混雑時のクレーム対応',
        description: '料理が遅い等へのクッション言葉のテスト',
        result: 'fail',
        score: 2.5,
        feedback: '沈黙が長く、適切な謝罪フレーズが出てきませんでした。お客様の怒りがエスカレートするパターンに陥っています。',
        improvementPoints: ['謝罪フレーズの暗記と反射的使用', 'パニック時の対応フローの習得', '先輩への引き継ぎ判断力'],
      },
      {
        id: 's3',
        name: 'シナリオC: 常連客との会話',
        description: '関西弁混じり・おすすめ提案のアドリブ対応',
        result: 'fail',
        score: 2.8,
        feedback: '方言の理解がほぼできておらず、会話が噛み合わない場面が多くありました。ただし、分からないことを正直に伝える姿勢は好感が持てます。',
        improvementPoints: ['関西弁の基本フレーズ学習', '「すみません、もう一度お願いできますか」の活用'],
      },
    ],
    onboardingAdvice: [
      { priority: 'high', category: 'クレーム対応', advice: 'まずは「大変申し訳ございません」「少々お待ちください」「確認して参ります」の3フレーズを完璧にする。毎日のロールプレイを最低2週間。' },
      { priority: 'high', category: '敬語の基礎', advice: 'バイト敬語を含む不自然な表現をリスト化し、正しい表現に置き換えるドリルを実施。' },
      { priority: 'medium', category: '方言理解', advice: '関西弁の頻出フレーズを音声付きで学習させる。まずは聞き取りから。' },
    ],
    responseTimeAvg: 3.5,
    interviewDuration: 750,
  },
  {
    id: 'c005',
    name: 'Zhang Wei',
    nameReading: 'チョウ・イ',
    nationality: '中国',
    nationalityFlag: '🇨🇳',
    desiredPosition: 'ホールスタッフ',
    interviewDate: '2025-03-06T15:00:00',
    status: 'completed',
    rank: 'A',
    overallScore: 4.4,
    aiComment: '非常に丁寧で正確な敬語を使いこなします。やや硬い印象がありますが、それが高級レストランには好印象です。臨機応変さをさらに伸ばせば、リーダー候補にもなれるポテンシャルがあります。',
    scores: {
      listening: 4.5,
      keigo: 4.8,
      tone: 4.0,
      adaptability: 4.2,
      regionalFit: 4.5,
    },
    highlights: [
      {
        type: 'best',
        label: '完璧な敬語でのクレーム対応',
        startTime: 300,
        endTime: 315,
        transcript: '大変申し訳ございません。ただいまご注文のお料理の状況を確認して参ります。お待たせしてしまい、誠に恐れ入ります。',
      },
      {
        type: 'challenge',
        label: 'カジュアルな会話への切り替え',
        startTime: 420,
        endTime: 440,
        transcript: 'はい、本日のおすすめでございますが...あ、はい...えーと、今日は...天ぷら定食が...旬の食材を...はい。',
      },
    ],
    scenarios: [
      {
        id: 's1',
        name: 'シナリオA: 基本のオーダー取り',
        description: 'イレギュラーな注文を含む基本的なオーダー対応',
        result: 'pass',
        score: 4.6,
        feedback: '完璧な復唱と的確な提案。アレルギー確認も自発的で、非常にプロフェッショナルです。',
        improvementPoints: ['もう少しフレンドリーなトーンを混ぜると良い'],
      },
      {
        id: 's2',
        name: 'シナリオB: 混雑時のクレーム対応',
        description: '料理が遅い等へのクッション言葉のテスト',
        result: 'pass',
        score: 4.8,
        feedback: '模範的なクレーム対応。謝罪→状況説明→代案提示の流れが完璧です。',
        improvementPoints: ['声のトーンにもう少し温かみを'],
      },
      {
        id: 's3',
        name: 'シナリオC: 常連客との会話',
        description: '関西弁混じり・おすすめ提案のアドリブ対応',
        result: 'pass',
        score: 4.0,
        feedback: '方言は概ね理解できていますが、カジュアルな雰囲気への切り替えがやや不自然でした。',
        improvementPoints: ['フランクな会話の練習', '笑い声やリアクションを増やす'],
      },
    ],
    onboardingAdvice: [
      { priority: 'medium', category: 'コミュニケーション', advice: '硬い敬語だけでなく、カジュアルなフレンドリーさも身につけさせる。居酒屋スタイルの接客ロールプレイを推奨。' },
      { priority: 'low', category: 'チームワーク', advice: '日本人スタッフとの雑談を意識的に増やし、チーム内でのコミュニケーションを円滑に。' },
    ],
    responseTimeAvg: 1.6,
    interviewDuration: 690,
  },
  {
    id: 'c006',
    name: 'Tanaka Priya',
    nameReading: 'タナカ・プリヤ',
    nationality: 'インド',
    nationalityFlag: '🇮🇳',
    desiredPosition: 'ホールスタッフ',
    interviewDate: '2025-03-06T10:30:00',
    status: 'completed',
    rank: 'C',
    overallScore: 3.0,
    aiComment: '日本語の基礎力はJLPT N3レベルですが、接客シーンでの実践的な運用にはまだ課題があります。聞き取りは良好ですが、アウトプットのスピードと正確さの向上が必要です。',
    scores: {
      listening: 3.8,
      keigo: 2.5,
      tone: 3.2,
      adaptability: 2.8,
      regionalFit: 2.7,
    },
    highlights: [
      {
        type: 'best',
        label: '丁寧な挨拶と案内',
        startTime: 30,
        endTime: 45,
        transcript: 'いらっしゃいませ。2名様ですね。こちらのお席にどうぞ。メニューでございます。',
      },
      {
        type: 'challenge',
        label: 'イレギュラー注文への対応',
        startTime: 180,
        endTime: 200,
        transcript: 'えっと...その、アレルギーの...対応は...ちょっと...えーと...キッチンに...聞きます...すみません。',
      },
    ],
    scenarios: [
      {
        id: 's1',
        name: 'シナリオA: 基本のオーダー取り',
        description: 'イレギュラーな注文を含む基本的なオーダー対応',
        result: 'pass',
        score: 3.2,
        feedback: '基本的な注文は対応可能ですが、イレギュラーな状況での語彙不足が目立ちます。',
        improvementPoints: ['接客に必要な語彙を100語増やす', 'イレギュラー対応フレーズの暗記'],
      },
      {
        id: 's2',
        name: 'シナリオB: 混雑時のクレーム対応',
        description: '料理が遅い等へのクッション言葉のテスト',
        result: 'fail',
        score: 2.5,
        feedback: 'クレーム対応のフレームワークを理解していない印象です。まずは謝罪フレーズの暗記から始めましょう。',
        improvementPoints: ['クレーム対応の3ステップを暗記', '先輩への相談タイミングの判断'],
      },
      {
        id: 's3',
        name: 'シナリオC: 常連客との会話',
        description: '関西弁混じり・おすすめ提案のアドリブ対応',
        result: 'fail',
        score: 2.5,
        feedback: '方言の理解がほぼできず、コミュニケーションが成立しない場面がありました。',
        improvementPoints: ['標準語での会話力を先に強化', '方言は長期的な学習計画で'],
      },
    ],
    onboardingAdvice: [
      { priority: 'high', category: '基礎日本語', advice: '接客日本語の基本フレーズ50個を2週間で暗記。音声付き教材を使用して発音も同時に矯正。' },
      { priority: 'high', category: 'クレーム対応', advice: 'クレーム対応は当面先輩に任せるルールを作り、段階的に対応範囲を広げていく。' },
      { priority: 'medium', category: 'リスニング強化', advice: '日本のバラエティ番組やポッドキャストを1日30分聴く習慣をつける。' },
    ],
    responseTimeAvg: 4.0,
    interviewDuration: 800,
  },
  {
    id: 'c007',
    name: 'David Johnson',
    nameReading: 'デイビッド・ジョンソン',
    nationality: 'アメリカ',
    nationalityFlag: '🇺🇸',
    desiredPosition: 'バーテンダー',
    interviewDate: '2025-03-05T13:00:00',
    status: 'completed',
    rank: 'D',
    overallScore: 2.4,
    aiComment: '日本語の基礎力が不足しています。接客業に就くにはまず日本語学校での学習を推奨します。英語を活かせるインターナショナルバーなどであれば可能性はあります。',
    scores: {
      listening: 2.5,
      keigo: 1.8,
      tone: 3.0,
      adaptability: 2.2,
      regionalFit: 2.5,
    },
    highlights: [
      {
        type: 'best',
        label: '英語を交えた接客',
        startTime: 60,
        endTime: 75,
        transcript: 'いらっしゃいませ！あ、Welcome! 何名様？Two? OK、こちらにどうぞ。',
      },
      {
        type: 'challenge',
        label: '日本語のみでのクレーム対応',
        startTime: 280,
        endTime: 300,
        transcript: 'あー...sorry...えーと...料理...late...すみません...I mean...おそい...wait please...',
      },
    ],
    scenarios: [
      {
        id: 's1',
        name: 'シナリオA: 基本のオーダー取り',
        description: 'イレギュラーな注文を含む基本的なオーダー対応',
        result: 'fail',
        score: 2.5,
        feedback: '基本的な語彙は知っていますが、文として組み立てることが困難です。英語に逃げてしまう傾向があります。',
        improvementPoints: ['日本語のみでの注文対応練習', '基本接客フレーズの反復'],
      },
      {
        id: 's2',
        name: 'シナリオB: 混雑時のクレーム対応',
        description: '料理が遅い等へのクッション言葉のテスト',
        result: 'fail',
        score: 1.8,
        feedback: '日本語でのクレーム対応は現時点では不可能です。英語混じりになってしまいます。',
        improvementPoints: ['日本語クレーム対応は段階的に', 'まず日常会話レベルの強化が先'],
      },
      {
        id: 's3',
        name: 'シナリオC: 常連客との会話',
        description: '関西弁混じり・おすすめ提案のアドリブ対応',
        result: 'fail',
        score: 2.0,
        feedback: '方言以前に標準日本語での会話が困難な状況です。',
        improvementPoints: ['日本語学習の継続が必要', '3ヶ月後に再チャレンジを推奨'],
      },
    ],
    onboardingAdvice: [
      { priority: 'high', category: '日本語学習', advice: '接客業に就く前に、最低3ヶ月間の日本語集中学習コースの受講を強く推奨。JLPT N4相当の力が必要。' },
      { priority: 'high', category: '配置提案', advice: '日本語力が不足しているため、外国人観光客が多いインターナショナルバーやホテルのバーでの勤務を検討。' },
    ],
    responseTimeAvg: 5.2,
    interviewDuration: 600,
  },
  {
    id: 'c008',
    name: 'Pham Duc Minh',
    nameReading: 'ファム・ドゥック・ミン',
    nationality: 'ベトナム',
    nationalityFlag: '🇻🇳',
    desiredPosition: 'キッチンスタッフ',
    interviewDate: '2025-03-09T09:00:00',
    status: 'in_progress',
    rank: 'B',
    overallScore: 3.7,
    aiComment: '面接進行中です。シナリオBまで完了。基本的な接客力は良好で、特にリスニング力が高い印象です。',
    scores: {
      listening: 4.0,
      keigo: 3.5,
      tone: 3.8,
      adaptability: 3.5,
      regionalFit: 3.7,
    },
    highlights: [
      {
        type: 'best',
        label: '正確な聞き取りと復唱',
        startTime: 100,
        endTime: 115,
        transcript: 'はい、ラーメンの大盛り、味玉トッピング、それとチャーハンの半分サイズですね。かしこまりました。',
      },
      {
        type: 'challenge',
        label: '複雑な要望への対応',
        startTime: 250,
        endTime: 270,
        transcript: 'えーと、醤油ラーメンを...塩味に変更...えっと...できるかどうか...ちょっと...キッチンに確認します。',
      },
    ],
    scenarios: [
      {
        id: 's1',
        name: 'シナリオA: 基本のオーダー取り',
        description: 'イレギュラーな注文を含む基本的なオーダー対応',
        result: 'pass',
        score: 3.8,
        feedback: '聞き取りと復唱は正確です。イレギュラーな注文への対応もまずまずでした。',
        improvementPoints: ['もう少し自信を持って対応',  '提案力の強化'],
      },
      {
        id: 's2',
        name: 'シナリオB: 混雑時のクレーム対応',
        description: '料理が遅い等へのクッション言葉のテスト',
        result: 'pass',
        score: 3.5,
        feedback: '基本的なクレーム対応はできていますが、クッション言葉のバリエーションが少ないです。',
        improvementPoints: ['クッション言葉のバリエーション増加', '声のトーン調整'],
      },
      {
        id: 's3',
        name: 'シナリオC: 常連客との会話',
        description: '関西弁混じり・おすすめ提案のアドリブ対応',
        result: 'pass',
        score: 3.5,
        feedback: '（進行中）',
        improvementPoints: [],
      },
    ],
    onboardingAdvice: [
      { priority: 'medium', category: '語彙力', advice: '接客に必要な語彙をさらに増やし、特にクレーム対応のフレーズを強化する。' },
    ],
    responseTimeAvg: 2.1,
    interviewDuration: 450,
  },
];

export function getCandidateById(id: string): Candidate | undefined {
  return candidates.find(c => c.id === id);
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRankColor(rank: Rank): string {
  const colors: Record<Rank, string> = {
    A: '#10b981',
    B: '#6366f1',
    C: '#f59e0b',
    D: '#f97316',
    E: '#ef4444',
  };
  return colors[rank];
}
