'use client';

import { useEffect, useState } from 'react';

interface SubtitleDisplayProps {
    text: string;
    isVisible: boolean;
    instant?: boolean; // 追加: タイピングアニメーションをスキップするかどうか
}

export default function SubtitleDisplay({ text, isVisible, instant = false }: SubtitleDisplayProps) {
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!isVisible || !text) {
            setDisplayText('');
            setIsTyping(false);
            return;
        }

        if (instant) {
            setDisplayText(text);
            setIsTyping(false);
            return;
        }

        setIsTyping(true);
        setDisplayText('');

        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayText(text.substring(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [text, isVisible, instant]);

    if (!isVisible || !text) return null;

    return (
        <div className="w-full max-w-md mx-auto">
            <div
                className="rounded-2xl p-4 backdrop-blur-lg transition-all"
                style={{
                    background: 'rgba(18, 19, 42, 0.9)',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                }}
            >
                <p className="text-sm text-foreground leading-relaxed">
                    {displayText}
                    {isTyping && (
                        <span className="inline-block w-0.5 h-4 bg-accent-primary ml-0.5 animate-pulse" />
                    )}
                </p>
            </div>
        </div>
    );
}
