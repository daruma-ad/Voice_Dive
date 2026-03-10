'use client';

import type { AIState } from '@/lib/interviewFlow';

interface InterviewAvatarProps {
    state: AIState;
}

export default function InterviewAvatar({ state }: InterviewAvatarProps) {
    const isActive = state === 'speaking' || state === 'thinking';

    return (
        <div className="relative flex items-center justify-center">
            {/* Outer Pulse Rings */}
            {state === 'speaking' && (
                <>
                    <div
                        className="absolute w-44 h-44 rounded-full pulse-ring"
                        style={{
                            border: '2px solid rgba(99, 102, 241, 0.2)',
                            animationDelay: '0s',
                        }}
                    />
                    <div
                        className="absolute w-52 h-52 rounded-full pulse-ring"
                        style={{
                            border: '2px solid rgba(99, 102, 241, 0.1)',
                            animationDelay: '0.5s',
                        }}
                    />
                    <div
                        className="absolute w-60 h-60 rounded-full pulse-ring"
                        style={{
                            border: '1px solid rgba(99, 102, 241, 0.05)',
                            animationDelay: '1s',
                        }}
                    />
                </>
            )}

            {/* Thinking animation */}
            {state === 'thinking' && (
                <div
                    className="absolute w-40 h-40 rounded-full animate-spin"
                    style={{
                        border: '2px solid transparent',
                        borderTopColor: '#6366f1',
                        borderRightColor: '#8b5cf6',
                        animationDuration: '2s',
                    }}
                />
            )}

            {/* Main Avatar Circle */}
            <div
                className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-100' : 'scale-95'
                    }`}
                style={{
                    background: isActive
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : 'linear-gradient(135deg, #1e2048, #2a2d5e)',
                    boxShadow: isActive
                        ? '0 0 60px rgba(99, 102, 241, 0.3), inset 0 0 30px rgba(255,255,255,0.1)'
                        : '0 0 20px rgba(0,0,0,0.3)',
                }}
            >
                {/* AI Face */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-1">
                        {/* Eyes */}
                        <div
                            className={`w-2.5 h-2.5 rounded-full bg-white transition-all ${state === 'speaking' ? 'animate-pulse' : ''
                                }`}
                        />
                        <div
                            className={`w-2.5 h-2.5 rounded-full bg-white transition-all ${state === 'speaking' ? 'animate-pulse' : ''
                                }`}
                        />
                    </div>
                    {/* Mouth */}
                    <div
                        className={`mx-auto rounded-full bg-white/80 transition-all duration-300 ${state === 'speaking' ? 'w-6 h-3 animate-pulse' : 'w-5 h-1.5'
                            }`}
                    />
                </div>
            </div>

            {/* State Label */}
            <div className="absolute -bottom-8">
                <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${state === 'speaking'
                            ? 'bg-accent-primary/15 text-accent-primary'
                            : state === 'listening'
                                ? 'bg-accent-success/15 text-accent-success'
                                : state === 'thinking'
                                    ? 'bg-accent-warning/15 text-accent-warning'
                                    : 'bg-card-border text-text-muted'
                        }`}
                >
                    {state === 'speaking' && '🔊 AIが話しています'}
                    {state === 'listening' && '🎤 あなたの番です'}
                    {state === 'thinking' && '💭 考え中...'}
                    {state === 'idle' && '⏸ 待機中'}
                </span>
            </div>
        </div>
    );
}
