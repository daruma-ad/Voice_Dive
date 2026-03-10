'use client';

import Link from 'next/link';
import { Mic, ArrowRight, Shield, Globe, Clock } from 'lucide-react';

export default function InterviewLandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
                />
                <div
                    className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
                    style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-md w-full text-center">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                        <Mic className="w-10 h-10 text-white" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
                    Voice<span className="gradient-text">Dive</span>
                </h1>
                <p className="text-text-secondary text-lg mb-2">AI音声面接</p>
                <p className="text-text-muted text-sm mb-10">
                    AI Voice Interview for Service Industry
                </p>

                {/* Description Card */}
                <div className="glass-card p-6 mb-8 text-left space-y-4">
                    <p className="text-sm text-foreground leading-relaxed">
                        AIとの音声対話を通じて、あなたの接客スキルを評価します。カメラは使いません。リラックスして、普段の接客のようにお話しください。
                    </p>

                    <div className="border-t border-card-border pt-4 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-text-secondary">
                            <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-4 h-4 text-accent-primary" />
                            </div>
                            <span>所要時間：約10〜15分</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-text-secondary">
                            <div className="w-8 h-8 rounded-lg bg-accent-success/10 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-4 h-4 text-accent-success" />
                            </div>
                            <span>カメラ不要・音声のみ</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-text-secondary">
                            <div className="w-8 h-8 rounded-lg bg-accent-warning/10 flex items-center justify-center flex-shrink-0">
                                <Globe className="w-4 h-4 text-accent-warning" />
                            </div>
                            <span>日本語で会話します</span>
                        </div>
                    </div>
                </div>

                {/* Multi-language notice */}
                <div className="mb-8 space-y-1">
                    <p className="text-xs text-text-muted">
                        🇻🇳 Phỏng vấn bằng giọng nói AI dành cho ngành dịch vụ
                    </p>
                    <p className="text-xs text-text-muted">
                        🇰🇷 서비스 업계를 위한 AI 음성 면접
                    </p>
                    <p className="text-xs text-text-muted">
                        🇨🇳 面向服务行业的AI语音面试
                    </p>
                    <p className="text-xs text-text-muted">
                        🇺🇸 AI Voice Interview for the Service Industry
                    </p>
                </div>

                {/* CTA Button */}
                <Link
                    href="/interview/upload"
                    className="inline-flex items-center justify-center gap-3 w-full py-4 px-8 rounded-2xl text-white font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                    }}
                >
                    面接を始める
                    <ArrowRight className="w-5 h-5" />
                </Link>

                <p className="text-xs text-text-muted mt-4">
                    Start Interview
                </p>
            </div>
        </div>
    );
}
