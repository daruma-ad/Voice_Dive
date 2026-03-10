'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import InterviewAvatar from '@/components/interview/InterviewAvatar';
import MicButton from '@/components/interview/MicButton';
import InterviewProgress from '@/components/interview/InterviewProgress';
import SubtitleDisplay from '@/components/interview/SubtitleDisplay';
import { useSpeech } from '@/hooks/useSpeech';
import { startInterview, respondToInterview, evaluateInterview } from '@/lib/api';

type AIState = 'idle' | 'listening' | 'thinking' | 'speaking';

export default function SessionPage() {
    const router = useRouter();
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [aiState, setAiState] = useState<AIState>('idle');
    const [currentPhase, setCurrentPhase] = useState<string>('intro');
    const [subtitleText, setSubtitleText] = useState('');
    const [chatLog, setChatLog] = useState<Array<{ speaker: string; text: string }>>([]);
    const [isStarted, setIsStarted] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        resetTranscript,
        speak
    } = useSpeech();

    // Setup initial connection
    const handleStartInterview = async () => {
        setIsStarted(true);
        setAiState('thinking');
        setErrorMsg('');

        try {
            const candidateName = sessionStorage.getItem('voicedive_candidate_name') || 'ゲスト';
            const resumeText = sessionStorage.getItem('voicedive_resume_summary') || undefined;
            const position = 'ホールスタッフ';

            const res = await startInterview(candidateName, resumeText, position);
            setSessionId(res.session_id);
            setCurrentPhase(res.ai_message.phase);

            // AIのテキストからマークダウン記号（**など）を取り除く
            const cleanText = res.ai_message.text.replace(/[*_#`~]+/g, '');

            setChatLog([{ speaker: 'ai', text: cleanText }]);
            setSubtitleText(cleanText);

            // Speak first message
            setAiState('speaking');
            await speak(cleanText);

            setAiState('listening');
            setSubtitleText('');
        } catch (error: any) {
            console.error('Failed to start interview:', error);
            setErrorMsg(error.message || '面接の開始に失敗しました。');
            setAiState('idle');
            setIsStarted(false);
        }
    };

    // Handle Mic toggle
    const handleMicToggle = useCallback(async () => {
        if (aiState !== 'listening' && aiState !== 'idle') return;

        if (!isListening) {
            startListening();
        } else {
            // Stop listening and send to AI
            stopListening();

            const finalUserText = transcript.trim();
            if (!finalUserText || !sessionId) {
                resetTranscript();
                return;
            }

            setChatLog((prev) => [...prev, { speaker: 'user', text: finalUserText }]);
            resetTranscript();
            setAiState('thinking');
            setErrorMsg('');

            try {
                const res = await respondToInterview(sessionId, finalUserText);

                // AIのテキストからマークダウン記号（**など）を取り除く
                const cleanText = res.ai_message.text.replace(/[*_#`~]+/g, '');

                setCurrentPhase(res.ai_message.phase);
                setChatLog((prev) => [...prev, { speaker: 'ai', text: cleanText }]);
                setSubtitleText(cleanText);

                setAiState('speaking');
                await speak(cleanText);

                if (res.is_complete) {
                    setSubtitleText('面接が完了しました。評価レポートを作成しています...');
                    setAiState('thinking');

                    // Trigger evaluation
                    const evalRes = await evaluateInterview(sessionId);
                    sessionStorage.setItem('voicedive_evaluation', JSON.stringify(evalRes.report));

                    router.push('/interview/complete');
                } else {
                    setAiState('listening');
                    setSubtitleText('');
                }
            } catch (error: any) {
                console.error('Failed to get response:', error);
                setErrorMsg(error.message || '応答の取得に失敗しました。');
                setAiState('listening');
                setSubtitleText('');
            }
        }
    }, [aiState, isListening, startListening, stopListening, transcript, resetTranscript, sessionId, speak, router]);

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-10 blur-[120px]"
                    style={{
                        background: aiState === 'speaking'
                            ? 'radial-gradient(circle, #6366f1, transparent)'
                            : aiState === 'listening'
                                ? 'radial-gradient(circle, #10b981, transparent)'
                                : 'radial-gradient(circle, #1e2048, transparent)',
                        transition: 'background 1s ease',
                    }}
                />
            </div>

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between p-4 border-b border-card-border/50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-success animate-pulse" />
                    <span className="text-xs text-text-secondary">面接中</span>
                </div>
                <button
                    onClick={() => router.push('/interview')}
                    className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent-danger transition-colors"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    退出
                </button>
            </div>

            {/* Progress */}
            <div className="relative z-10 px-6 pt-4">
                <InterviewProgress currentPhase={currentPhase as any} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
                {!isStarted ? (
                    <div className="text-center fade-in-up">
                        <InterviewAvatar state="idle" />
                        <div className="mt-16">
                            <h2 className="text-xl font-bold text-foreground mb-2">
                                準備はいいですか？
                            </h2>
                            <p className="text-sm text-text-secondary mb-8">
                                AIの面接官「ミナ」があなたをお待ちしています
                            </p>
                            {errorMsg && (
                                <p className="text-sm text-accent-danger mb-4">{errorMsg}</p>
                            )}
                            <button
                                onClick={handleStartInterview}
                                className="py-4 px-10 rounded-2xl text-white font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                                style={{
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                                }}
                            >
                                面接をはじめる
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-md flex flex-col items-center gap-8">
                        <InterviewAvatar state={aiState} />

                        {errorMsg && (
                            <div className="w-full p-3 rounded-lg bg-accent-danger/10 border border-accent-danger/20 text-accent-danger text-sm text-center">
                                {errorMsg}
                            </div>
                        )}

                        {/* Subtitle / User Input preview */}
                        <div className="mt-4 w-full">
                            {isListening ? (
                                <SubtitleDisplay text={interimTranscript || transcript || '話してください...'} isVisible={true} instant={true} />
                            ) : (
                                <SubtitleDisplay text={subtitleText} isVisible={aiState === 'speaking' || aiState === 'thinking'} />
                            )}
                        </div>

                        {/* Chat Log (last 2 messages) */}
                        <div className="w-full space-y-2 min-h-[60px]">
                            {chatLog.slice(-2).map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.speaker === 'user'
                                            ? 'bg-accent-primary/20 text-foreground rounded-br-md text-right'
                                            : 'bg-card-border/50 text-text-secondary rounded-bl-md'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom: Mic Control */}
            {isStarted && (
                <div className="relative z-10 pb-8 pt-4 px-6">
                    <MicButton
                        isActive={isListening}
                        isDisabled={aiState === 'speaking' || aiState === 'thinking'}
                        onToggle={handleMicToggle}
                    />
                </div>
            )}
        </div>
    );
}
