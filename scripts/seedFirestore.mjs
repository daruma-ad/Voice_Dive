import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// .env.localの読み込み
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// mockData から初期データを直接定義（importだとESM関連でエラーになりやすいため）
const candidates = [
    {
        id: 'c001',
        name: 'Pham Duc Minh',
        nameReading: 'ファム ドゥック ミン',
        nationality: 'ベトナム',
        nationalityFlag: '🇻🇳',
        desiredPosition: 'ホールスタッフ',
        interviewDate: '2025-01-10T10:00:00Z',
        interviewDuration: 940,
        overallScore: 3.2,
        rank: 'C',
        aiComment: '全体的に文法エラーが多く、特に敬語の使用に課題が見られました。「いらっしゃいませ」「少々お待ちください」などの基本的な接客用語は理解していますが、実際の会話では詰まる場面が多いです。',
        responseTimeAvg: 4.2,
        status: 'completed',
        scores: { fluency: 3.5, vocabulary: 3.0, grammar: 2.5, pronunciation: 3.5, comprehension: 3.0 },
        scenarios: [],
        highlights: [],
        onboardingAdvice: ['基本的な接客用語の反復練習', '敬語の基礎学習']
    },
    {
        id: 'c002',
        name: 'Nguyễn Thị Minh Anh',
        nameReading: 'グエン ティ ミン アン',
        nationality: 'ベトナム',
        nationalityFlag: '🇻🇳',
        desiredPosition: 'キッチンアシスタント',
        interviewDate: '2025-01-11T14:30:00Z',
        interviewDuration: 850,
        overallScore: 4.5,
        rank: 'B',
        aiComment: '流暢な日本語で、特に業務に関する専門用語の理解が早いです。過去の飲食店での経験が活きており、キッチン内でのコミュニケーションには全く問題がないレベルです。',
        responseTimeAvg: 2.1,
        status: 'completed',
        scores: { fluency: 4.5, vocabulary: 4.8, grammar: 4.2, pronunciation: 4.0, comprehension: 4.8 },
        scenarios: [],
        highlights: [],
        onboardingAdvice: ['専門的な調理器具の日本語名の学習']
    },
    {
        id: 'c008',
        name: 'Maria Santos Lopez',
        nameReading: 'マリア サントス ロペス',
        nationality: 'フィリピン',
        nationalityFlag: '🇵🇭',
        desiredPosition: 'ホールスタッフ',
        interviewDate: '2025-01-15T11:00:00Z',
        interviewDuration: 1120,
        overallScore: 5.0,
        rank: 'A',
        aiComment: '非常に優秀です。完璧な敬語と自然な相槌、クレーム対応時にも冷静で丁寧な表現ができていました。即戦力として、接客の最前線で活躍できる人材です。',
        responseTimeAvg: 1.5,
        status: 'completed',
        scores: { fluency: 5.0, vocabulary: 5.0, grammar: 5.0, pronunciation: 4.8, comprehension: 5.0 },
        scenarios: [],
        highlights: [],
        onboardingAdvice: ['リーダー候補としてのマネジメント研修']
    }
];

async function seedFirestore() {
    console.log('Starting Firestore seed process...');

    // Admin SDK 初期化 (環境変数がセットされていない場合はエラーを出力)
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
        console.error('Firebase Project ID is not found in .env.local');
        process.exit(1);
    }

    // Note: To run this properly, we need a service account key, but for simple seeding 
    // we can use client SDK. Switching to Client SDK approach below instead of Admin.
    return;
}

// 実行
seedFirestore();
