export type InterviewPhase = 'intro' | 'scenario_a' | 'scenario_b' | 'scenario_c' | 'closing';
export type AIState = 'speaking' | 'listening' | 'thinking' | 'idle';

export interface InterviewMessage {
    id: string;
    phase: InterviewPhase;
    speaker: 'ai' | 'user';
    text: string;
    duration?: number; // seconds for AI speech
}

export interface InterviewScenario {
    id: InterviewPhase;
    label: string;
    labelEn: string;
    description: string;
    icon: string;
}

export const scenarios: InterviewScenario[] = [
    {
        id: 'intro',
        label: '自己紹介',
        labelEn: 'Self Introduction',
        description: 'レジュメに基づく質問',
        icon: '👋',
    },
    {
        id: 'scenario_a',
        label: 'オーダー取り',
        labelEn: 'Taking Orders',
        description: 'イレギュラーな注文を含む',
        icon: '📝',
    },
    {
        id: 'scenario_b',
        label: 'クレーム対応',
        labelEn: 'Complaint Handling',
        description: '混雑時のお客様対応',
        icon: '🙇',
    },
    {
        id: 'scenario_c',
        label: '常連客対応',
        labelEn: 'Regular Customer',
        description: '方言混じりの会話',
        icon: '💬',
    },
    {
        id: 'closing',
        label: 'まとめ',
        labelEn: 'Closing',
        description: '面接のまとめ',
        icon: '✨',
    },
];

export const demoConversation: InterviewMessage[] = [
    // Intro
    {
        id: 'm1',
        phase: 'intro',
        speaker: 'ai',
        text: 'こんにちは！VoiceDive面接へようこそ。私はAI面接官のミナです。今日はリラックスして、普段の接客のように話してくださいね。まず、あなたのお名前と、日本に来てどのくらいか教えていただけますか？',
        duration: 8,
    },
    {
        id: 'm2',
        phase: 'intro',
        speaker: 'user',
        text: 'はい、グエン・ティ・ミンアンと申します。ベトナムから来まして、日本に来て3年になります。',
    },
    {
        id: 'm3',
        phase: 'intro',
        speaker: 'ai',
        text: 'ミンアンさん、ありがとうございます。3年も日本にいらっしゃるんですね。飲食店での経験はありますか？どんなお仕事をされていましたか？',
        duration: 6,
    },
    {
        id: 'm4',
        phase: 'intro',
        speaker: 'user',
        text: 'はい、渋谷のラーメン店で1年間ホールスタッフとして働いていました。オーダー取りやレジ対応を担当していました。',
    },
    // Scenario A
    {
        id: 'm5',
        phase: 'scenario_a',
        speaker: 'ai',
        text: 'ありがとうございます。それでは、ここからは実際の接客を想定したロールプレイをしましょう。私がお客様役をしますので、あなたはホールスタッフとして対応してください。——いらっしゃーい！あ、3人なんだけど、テーブル空いてる？',
        duration: 10,
    },
    {
        id: 'm6',
        phase: 'scenario_a',
        speaker: 'user',
        text: 'いらっしゃいませ！3名様ですね。少々お待ちください...はい、奥のテーブル席にご案内いたします。こちらへどうぞ。',
    },
    {
        id: 'm7',
        phase: 'scenario_a',
        speaker: 'ai',
        text: 'ありがとう。えーっと、ビール2つと、ウーロン茶1つ。あと、この「本日のおすすめ」って何？それと、友達が卵アレルギーなんだけど、この親子丼って卵抜きにできる？',
        duration: 9,
    },
    {
        id: 'm8',
        phase: 'scenario_a',
        speaker: 'user',
        text: 'かしこまりました。生ビール2つとウーロン茶1つですね。本日のおすすめは、旬のブリを使った照り焼き定食です。親子丼の卵抜きについては、キッチンに確認して参ります。少々お待ちください。',
    },
    // Scenario B
    {
        id: 'm9',
        phase: 'scenario_b',
        speaker: 'ai',
        text: 'それでは次のシナリオです。お店がとても混雑している状況を想像してください。——すみません！さっき注文した料理、もう30分も待ってるんだけど！まだ来ないの？',
        duration: 8,
    },
    {
        id: 'm10',
        phase: 'scenario_b',
        speaker: 'user',
        text: 'お待たせして大変申し訳ございません。ただいまご注文の状況を確認して参ります。恐れ入りますが、あと5分ほどお時間をいただけますでしょうか。お詫びにサラダをサービスさせていただきます。',
    },
    {
        id: 'm11',
        phase: 'scenario_b',
        speaker: 'ai',
        text: '5分？本当に5分で来る？さっきも「もうすぐ」って言ってたじゃない。もう帰ろうかな...',
        duration: 6,
    },
    {
        id: 'm12',
        phase: 'scenario_b',
        speaker: 'user',
        text: '重ねてお詫び申し上げます。ただいまキッチンに最優先で準備するよう伝えて参りました。確実に5分以内にお届けいたします。本当に申し訳ございません。',
    },
    // Scenario C
    {
        id: 'm13',
        phase: 'scenario_c',
        speaker: 'ai',
        text: '最後のシナリオです。あなたは関西のお店で働いています。常連のお客様が来ました。——おっ、久しぶりやな！今日はなんかええもんあるん？最近暑いから、さっぱりしたもんがええねんけど。',
        duration: 9,
    },
    {
        id: 'm14',
        phase: 'scenario_c',
        speaker: 'user',
        text: 'お久しぶりです！お元気でしたか？今日はですね、冷やしうどんが始まりました！さっぱりしていてとても人気ですよ。あと、新しい梅サワーも入りましたので、一緒にいかがですか？',
    },
    // Closing
    {
        id: 'm15',
        phase: 'closing',
        speaker: 'ai',
        text: '素晴らしい対応でした！ミンアンさん、本日の面接は以上です。ありがとうございました。結果は採用担当者から後日ご連絡差し上げます。お疲れ様でした！',
        duration: 7,
    },
];

export function getPhaseIndex(phase: InterviewPhase): number {
    return scenarios.findIndex((s) => s.id === phase);
}

export function getPhaseProgress(phase: InterviewPhase): number {
    const index = getPhaseIndex(phase);
    return ((index + 1) / scenarios.length) * 100;
}
