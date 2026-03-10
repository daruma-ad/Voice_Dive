'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface MicButtonProps {
    isActive: boolean;
    isDisabled: boolean;
    onToggle: () => void;
}

export default function MicButton({ isActive, isDisabled, onToggle }: MicButtonProps) {
    const [volumeBars, setVolumeBars] = useState<number[]>(Array(20).fill(4));

    useEffect(() => {
        if (!isActive) {
            setVolumeBars(Array(20).fill(4));
            return;
        }

        const interval = setInterval(() => {
            setVolumeBars(
                Array.from({ length: 20 }, () =>
                    Math.max(4, Math.random() * 32)
                )
            );
        }, 100);

        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Volume Visualization */}
            <div className="flex items-center justify-center gap-[3px] h-10 w-full max-w-[200px]">
                {volumeBars.map((height, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-full transition-all duration-100"
                        style={{
                            height: `${height}px`,
                            backgroundColor: isActive
                                ? `hsl(${142 + i * 3}, 70%, ${45 + Math.random() * 15}%)`
                                : '#1e2048',
                            minWidth: '3px',
                        }}
                    />
                ))}
            </div>

            {/* Mic Button */}
            <button
                onClick={onToggle}
                disabled={isDisabled}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:scale-105 active:scale-95'
                    }`}
                style={{
                    background: isActive
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : isDisabled
                            ? '#1e2048'
                            : 'linear-gradient(135deg, #374151, #4b5563)',
                    boxShadow: isActive
                        ? '0 0 40px rgba(16, 185, 129, 0.4)'
                        : 'none',
                }}
            >
                {/* Active ring */}
                {isActive && (
                    <div
                        className="absolute inset-0 rounded-full pulse-ring"
                        style={{ border: '3px solid rgba(16, 185, 129, 0.3)' }}
                    />
                )}

                {isActive ? (
                    <Mic className="w-8 h-8 text-white" />
                ) : (
                    <MicOff className="w-8 h-8 text-white/70" />
                )}
            </button>

            <p className="text-xs text-text-muted">
                {isDisabled
                    ? 'AIが話し終わるまでお待ちください'
                    : isActive
                        ? 'タップして送信'
                        : 'タップして話す'}
            </p>
        </div>
    );
}
