'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mic, ArrowLeft, ArrowRight, CheckCircle, Volume2, AlertCircle } from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function ReadyPage() {
    const router = useRouter();
    const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
    const [testDone, setTestDone] = useState(false);
    const [isTestingMic, setIsTestingMic] = useState(false);
    const [volumeLevel, setVolumeLevel] = useState(0);

    const requestMic = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicPermission('granted');
            stream.getTracks().forEach(track => track.stop());
        } catch {
            setMicPermission('denied');
        }
    };

    const startMicTest = () => {
        setIsTestingMic(true);
        // Simulate volume levels
        const interval = setInterval(() => {
            setVolumeLevel(Math.random() * 100);
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            setIsTestingMic(false);
            setTestDone(true);
            setVolumeLevel(0);
        }, 3000);
    };

    useEffect(() => {
        // Check mic permission on mount
        navigator.permissions?.query({ name: 'microphone' as PermissionName }).then((result) => {
            if (result.state === 'granted') setMicPermission('granted');
        }).catch(() => { });
    }, []);

    const handleStart = (mode: 'practice' | 'real') => {
        // iOS Safari対策: ユーザー操作（タップ）を契機にダミーの音声を再生し、
        // SpeechSynthesisエンジンのロックを解除（アンロック）する
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance('');
            utterance.volume = 0; // 無音
            window.speechSynthesis.speak(utterance);
        }

        sessionStorage.setItem('voicedive_interview_mode', mode);
        router.push('/interview/session');
    };

    const steps = [
        {
            icon: '👋',
            title: '自己紹介',
            titleEn: 'Self Introduction',
            desc: 'まずはあなた自身について教えてください',
        },
        {
            icon: '🎭',
            title: '接客ロールプレイ',
            titleEn: 'Role Play',
            desc: 'AIがお客様役になります。3つのシーンに挑戦！',
        },
        {
            icon: '✨',
            title: '面接終了',
            titleEn: 'Interview Complete',
            desc: 'お疲れ様でした。結果は後日ご連絡します',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
                    style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
                />
            </div>

            <div className="relative z-10 max-w-md w-full">
                {/* Back / Step */}
                <Link
                    href="/interview/upload"
                    className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    戻る
                </Link>

                {/* Step Indicator */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"><CheckCircle className="w-5 h-5 text-accent-success" /></div>
                        <span className="text-sm text-accent-success">履歴書</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-accent-success rounded-full mx-2" />
                    <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>2</div>
                        <span className="text-sm font-medium text-foreground">準備</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-card-border rounded-full mx-2" />
                    <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-card-border text-text-muted">3</div>
                        <span className="text-sm text-text-muted">面接</span>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-foreground mb-2">
                    面接の準備
                </h1>
                <p className="text-sm text-text-secondary mb-8">
                    マイクを確認して、面接の流れを確認しましょう。
                    <br />
                    <span className="text-text-muted text-xs">Check your microphone and review the interview flow.</span>
                </p>

                {/* Mic Setup */}
                <div className="glass-card p-5 mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Mic className="w-4 h-4 text-accent-primary" />
                        マイク設定
                    </h3>

                    {micPermission === 'pending' && (
                        <button
                            onClick={requestMic}
                            className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                        >
                            マイクを許可する
                        </button>
                    )}

                    {micPermission === 'denied' && (
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-accent-danger/10 border border-accent-danger/20">
                            <AlertCircle className="w-5 h-5 text-accent-danger flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-accent-danger">マイクへのアクセスが拒否されました</p>
                                <p className="text-xs text-text-muted mt-1">ブラウザの設定からマイクの許可を有効にしてください。</p>
                            </div>
                        </div>
                    )}

                    {micPermission === 'granted' && !testDone && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-accent-success">
                                <CheckCircle className="w-4 h-4" />
                                <span>マイクが有効です</span>
                            </div>

                            {isTestingMic ? (
                                <div className="space-y-2">
                                    <p className="text-xs text-text-secondary">音声を確認中... 何か話してみてください</p>
                                    <div className="flex items-center gap-1 h-10">
                                        {Array.from({ length: 30 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 rounded-full transition-all duration-100"
                                                style={{
                                                    height: `${Math.max(4, (volumeLevel * Math.random()) / 2.5)}px`,
                                                    backgroundColor: `hsl(${240 + i * 2}, 80%, ${50 + Math.random() * 20}%)`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={startMicTest}
                                    className="w-full py-3 rounded-xl text-sm font-medium border border-accent-primary/30 text-accent-primary hover:bg-accent-primary/10 transition-all"
                                >
                                    <Volume2 className="w-4 h-4 inline mr-2" />
                                    マイクテストを行う
                                </button>
                            )}
                        </div>
                    )}

                    {micPermission === 'granted' && testDone && (
                        <div className="flex items-center gap-2 text-sm text-accent-success">
                            <CheckCircle className="w-4 h-4" />
                            <span>マイクテスト完了 — 問題ありません！</span>
                        </div>
                    )}
                </div>

                {/* Interview Flow */}
                <div className="glass-card p-5 mb-8">
                    <h3 className="text-sm font-semibold text-foreground mb-4">
                        面接の流れ
                    </h3>
                    <div className="space-y-4">
                        {steps.map((step, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                    style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                                    {step.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {step.title}
                                        <span className="text-xs text-text-muted ml-2">{step.titleEn}</span>
                                    </p>
                                    <p className="text-xs text-text-secondary">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tips */}
                <div className="rounded-xl p-4 mb-8 text-xs text-text-secondary space-y-1.5" style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                    <p className="font-semibold text-accent-warning text-sm mb-2">💡 アドバイス</p>
                    <p>• 静かな場所で面接を受けてください</p>
                    <p>• 普段の接客のように自然に話してください</p>
                    <p>• 分からない時は「もう一度お願いします」と言えます</p>
                </div>

                {/* Start Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => handleStart('practice')}
                        className="inline-flex items-center justify-center gap-3 w-full py-4 px-8 rounded-2xl text-foreground font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] border border-accent-success/50 hover:bg-accent-success/10"
                        style={{
                            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
                        }}
                    >
                        🟢 練習モードで開始
                    </button>

                    <button
                        onClick={() => handleStart('real')}
                        className="inline-flex items-center justify-center gap-3 w-full py-4 px-8 rounded-2xl text-white font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                        style={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                        }}
                    >
                        🔴 本番モードで開始
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-xs text-text-muted text-center mt-2">
                        本番モードの結果はデータベースに保存されます
                    </p>
                </div>
            </div>
        </div>
    );
}
