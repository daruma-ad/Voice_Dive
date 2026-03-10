'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, PartyPopper } from 'lucide-react';

export default function CompletePage() {
    const [showContent, setShowContent] = useState(false);
    const [evalData, setEvalData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(true);

    useEffect(() => {
        setTimeout(() => setShowContent(true), 500);

        const processResult = async () => {
            try {
                const rawName = sessionStorage.getItem('voicedive_candidate_name') || 'ゲスト';
                const resumeSummary = sessionStorage.getItem('voicedive_resume_summary');
                const rawEval = sessionStorage.getItem('voicedive_evaluation');

                if (rawEval) {
                    const parsed = JSON.parse(rawEval);
                    setEvalData(parsed);

                    // Firestore save (Mock or Real)
                    const { addCandidate } = await import('@/hooks/useFirestore');

                    const newCandidate = {
                        name: rawName,
                        nameReading: rawName, // For real app, could get this from parsing or input
                        nationality: '未設定', // For real app, could extract
                        nationalityFlag: '🇺🇳',
                        desiredPosition: 'ホールスタッフ',
                        status: 'interviewed' as any,
                        interviewDate: new Date().toISOString(),
                        overallScore: parsed.overall_score || 0,
                        rank: parsed.rank || 'E',
                        scores: {
                            listening: parsed.scores?.find((s: any) => s.category.includes('流暢'))?.score || 3.0,
                            keigo: parsed.scores?.find((s: any) => s.category.includes('敬語'))?.score || 3.0,
                            tone: parsed.scores?.find((s: any) => s.category.includes('ホスピタリティ'))?.score || 3.0,
                            adaptability: parsed.scores?.find((s: any) => s.category.includes('臨機応変'))?.score || 3.0,
                            regionalFit: parsed.scores?.find((s: any) => s.category.includes('語彙'))?.score || 3.0,
                        },
                        highlights: parsed.highlights?.map((h: any, i: number) => ({
                            type: h.type === 'best' ? 'best' : 'challenge',
                            label: h.label,
                            startTime: i * 60, // Mock timestamp
                            endTime: i * 60 + 15,
                            transcript: h.transcript,
                        })) || [],
                        aiComment: parsed.ai_comment || '',
                        scenarios: [
                            {
                                id: 's1',
                                name: 'シナリオA',
                                description: '面接シナリオ',
                                result: 'pass' as any,
                                score: parsed.overall_score || 3.0,
                                feedback: parsed.ai_comment,
                                improvementPoints: []
                            },
                        ],
                        onboardingAdvice: parsed.onboarding_advice?.map((a: any) => ({
                            priority: a.priority,
                            category: a.category,
                            advice: a.advice
                        })) || [],
                        responseTimeAvg: 2.0,
                        interviewDuration: 600,
                    };

                    try {
                        // Firestoreの通信（特にモバイル環境）がスタックして画面が止まるのを防ぐため、
                        // 3秒でタイムアウトさせる（バックグラウンドでの保存自体はFirestore SDK側で継続される）
                        const timeoutPromise = new Promise((_, reject) => {
                            setTimeout(() => reject(new Error('Firebase timeout')), 3000);
                        });

                        await Promise.race([
                            addCandidate(newCandidate),
                            timeoutPromise
                        ]);
                    } catch (err) {
                        console.error('Failed to save candidate report:', err);
                    }
                }
            } catch (err) {
                console.error('Error processing interview results:', err);
            } finally {
                setIsSaving(false);
            }
        };

        processResult();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Confetti-like background */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, #10b981, transparent)' }}
                />
                <div
                    className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full opacity-10 blur-[80px]"
                    style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
                />
                <div
                    className="absolute top-1/3 right-1/4 w-[200px] h-[200px] rounded-full opacity-10 blur-[60px]"
                    style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}
                />
            </div>

            <div
                className={`relative z-10 max-w-md w-full text-center transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
            >
                {/* Success Icon */}
                <div className="relative inline-flex mb-8">
                    <div
                        className="w-24 h-24 rounded-full flex items-center justify-center p-[2px]"
                        style={{
                            background: isSaving
                                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                : 'linear-gradient(135deg, #10b981, #059669)',
                            boxShadow: isSaving
                                ? '0 0 40px rgba(99, 102, 241, 0.3)'
                                : '0 0 60px rgba(16, 185, 129, 0.3)',
                        }}
                    >
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                            {isSaving ? (
                                <div className="w-10 h-10 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <CheckCircle className="w-12 h-12 text-accent-success" />
                            )}
                        </div>
                    </div>
                    {!isSaving && (
                        <div className="absolute -top-2 -right-2">
                            <PartyPopper className="w-8 h-8 text-accent-warning" />
                        </div>
                    )}
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-3">
                    お疲れ様でした！
                </h1>
                <p className="text-lg text-text-secondary mb-2">
                    {isSaving ? '結果を保存しています...' : '面接が完了しました'}
                </p>
                <p className="text-sm text-text-muted mb-8">
                    {isSaving ? 'Saving your results...' : 'Great job! The interview is complete.'}
                </p>

                {/* Info Card */}
                {evalData && (
                    <div className="glass-card p-6 mb-8 text-left space-y-4 fade-in-up">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                                <span className="text-2xl font-bold text-accent-primary">{evalData.rank}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-foreground mb-1">
                                    総合評価スコア: <span className="text-lg font-bold">{evalData.overall_score}</span><span className="text-xs text-text-muted">/5.0</span>
                                </p>
                                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                                    {evalData.ai_comment}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-card-border pt-4 mt-2">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                                    ✅
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground mb-1">
                                        データ送信完了
                                    </p>
                                    <p className="text-xs text-text-secondary">
                                        結果は採用担当者に送信されました。後日ご連絡いたします。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!isSaving && !evalData && (
                    <div className="glass-card p-6 mb-8 text-left space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                                💡
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground mb-1">
                                    結果について
                                </p>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    AIがあなたの面接内容を分析しています。結果は採用担当者に送信され、後日ご連絡いたします。
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <Link
                    href="/interview"
                    className="inline-flex items-center justify-center gap-2 w-full py-4 px-8 rounded-2xl text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.25)',
                    }}
                >
                    トップに戻る
                    <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-xs text-text-muted mt-8">
                    VoiceDive — AI音声面接プラットフォーム
                </p>
            </div>
        </div>
    );
}
