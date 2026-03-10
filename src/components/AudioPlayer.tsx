'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import type { HighlightClip } from '@/lib/mockData';
import { formatDuration } from '@/lib/mockData';

interface AudioPlayerProps {
    highlight: HighlightClip;
}

export default function AudioPlayer({ highlight }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const duration = highlight.endTime - highlight.startTime;

    const isBest = highlight.type === 'best';
    const accentColor = isBest ? '#10b981' : '#f59e0b';
    const gradientBg = isBest
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.05))'
        : 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(239, 68, 68, 0.05))';
    const borderColor = isBest
        ? 'rgba(16, 185, 129, 0.2)'
        : 'rgba(245, 158, 11, 0.2)';

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            setProgress(0);
            intervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + 100 / (duration * 10);
                });
            }, 100);
        }
    };

    // Generate random wave bar heights for visualization
    const waveBars = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        maxHeight: Math.random() * 24 + 4,
    }));

    return (
        <div
            className="rounded-2xl p-5 transition-all"
            style={{
                background: gradientBg,
                border: `1px solid ${borderColor}`,
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                />
                <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: accentColor }}
                >
                    {isBest ? '🌟 Best対応' : '⚠️ 課題の対応'}
                </span>
            </div>

            <h4 className="text-sm font-medium text-foreground mb-3">
                {highlight.label}
            </h4>

            {/* Waveform */}
            <div className="flex items-center gap-2 mb-3">
                <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95"
                    style={{
                        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                    }}
                >
                    {isPlaying ? (
                        <Pause className="w-4 h-4 text-white" />
                    ) : (
                        <Play className="w-4 h-4 text-white ml-0.5" />
                    )}
                </button>

                <div className="flex-1 flex items-center gap-[2px] h-8 relative">
                    {waveBars.map((bar) => {
                        const barProgress = (bar.id / waveBars.length) * 100;
                        const isActive = barProgress <= progress;
                        return (
                            <div
                                key={bar.id}
                                className={`flex-1 rounded-full transition-all duration-150 ${isPlaying && isActive ? 'wave-bar' : ''
                                    }`}
                                style={{
                                    height: isPlaying && isActive ? `${bar.maxHeight}px` : '4px',
                                    backgroundColor: isActive ? accentColor : `${accentColor}30`,
                                    animationDelay: `${bar.id * 0.05}s`,
                                    minWidth: '2px',
                                }}
                            />
                        );
                    })}
                </div>

                <div className="flex items-center gap-1 text-text-muted flex-shrink-0">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono">
                        {formatDuration(highlight.startTime)} - {formatDuration(highlight.endTime)}
                    </span>
                </div>
            </div>

            {/* Transcript */}
            <div
                className="rounded-lg p-3 text-xs leading-relaxed text-text-secondary"
                style={{
                    backgroundColor: `${accentColor}08`,
                    border: `1px solid ${accentColor}15`,
                }}
            >
                <span className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">
                    書き起こし
                </span>
                「{highlight.transcript}」
            </div>
        </div>
    );
}
