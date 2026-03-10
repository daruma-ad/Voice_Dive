'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Clock,
    Timer,
    Briefcase,
    Globe,
    CalendarDays,
    GraduationCap,
    Sparkles,
    Loader2,
} from 'lucide-react';
import { formatDate, formatDuration } from '@/lib/mockData';
import { useCandidate } from '@/hooks/useFirestore';
import RankBadge from '@/components/RankBadge';
import RadarChart from '@/components/RadarChart';
import ScoreCard from '@/components/ScoreCard';
import AudioPlayer from '@/components/AudioPlayer';
import ScenarioCard from '@/components/ScenarioCard';
import OnboardingAdvice from '@/components/OnboardingAdvice';

export default function CandidateDetailPage({
    params,
}: {
    params: Promise<{ candidateId: string }>;
}) {
    const { candidateId } = use(params);
    const { candidate, loading, error } = useCandidate(candidateId);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent-primary animate-spin mb-4" />
                <p className="text-text-secondary">候補者データを読み込み中...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="glass-card p-6 text-center max-w-md border-accent-danger/20">
                    <p className="text-accent-danger mb-4">エラーが発生しました</p>
                    <p className="text-sm text-text-secondary">{error}</p>
                </div>
            </div>
        );
    }

    if (!candidate) {
        notFound();
    }

    return (
        <div className="max-w-6xl mx-auto fade-in-up">
            {/* Back Button */}
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                候補者一覧に戻る
            </Link>

            {/* Header Card */}
            <div className="glass-card p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-5">
                        <RankBadge rank={candidate.rank} size="lg" />
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-foreground">
                                    {candidate.name}
                                </h1>
                                <span className="text-lg">{candidate.nationalityFlag}</span>
                            </div>
                            <p className="text-sm text-text-muted mb-3">
                                {candidate.nameReading}
                            </p>
                            <div className="flex items-center gap-5 text-sm text-text-secondary">
                                <span className="flex items-center gap-1.5">
                                    <Globe className="w-4 h-4 text-text-muted" />
                                    {candidate.nationality}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4 text-text-muted" />
                                    {candidate.desiredPosition}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CalendarDays className="w-4 h-4 text-text-muted" />
                                    {formatDate(candidate.interviewDate)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="flex items-center gap-1 text-text-muted mb-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-xs">面接時間</span>
                            </div>
                            <p className="text-lg font-bold text-foreground">
                                {formatDuration(candidate.interviewDuration)}
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-1 text-text-muted mb-1">
                                <Timer className="w-3.5 h-3.5" />
                                <span className="text-xs">平均応答</span>
                            </div>
                            <p className="text-lg font-bold text-foreground">
                                {candidate.responseTimeAvg.toFixed(1)}s
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-text-muted mb-1">総合スコア</p>
                            <p className="text-3xl font-bold gradient-text">
                                {candidate.overallScore.toFixed(1)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* AI Comment */}
                <div
                    className="mt-5 rounded-xl p-4"
                    style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(139, 92, 246, 0.04))',
                        border: '1px solid rgba(99, 102, 241, 0.12)',
                    }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-accent-primary" />
                        <span className="text-xs font-semibold text-accent-primary uppercase tracking-wider">
                            AI 総合評価
                        </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                        {candidate.aiComment}
                    </p>
                </div>
            </div>

            {/* Score Section */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Radar Chart */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <div className="w-1 h-5 rounded-full" style={{ background: 'var(--gradient-primary)' }} />
                        VoiceDive Score™
                    </h2>
                    <RadarChart scores={candidate.scores} />
                </div>

                {/* Score Details */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <div className="w-1 h-5 rounded-full" style={{ background: 'var(--gradient-accent)' }} />
                        評価項目別スコア
                    </h2>
                    <ScoreCard scores={candidate.scores} />
                </div>
            </div>

            {/* Audio Highlights */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full" style={{ background: 'var(--gradient-accent)' }} />
                    ハイライト音声
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    {candidate.highlights.map((highlight, index) => (
                        <AudioPlayer key={index} highlight={highlight} />
                    ))}
                </div>
            </div>

            {/* Scenario Results */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full" style={{ background: 'var(--gradient-primary)' }} />
                    シーン別結果詳細
                </h2>
                <div className="space-y-3 stagger-children">
                    {candidate.scenarios.map((scenario, index) => (
                        <ScenarioCard key={scenario.id} scenario={scenario} index={index} />
                    ))}
                </div>
            </div>

            {/* Onboarding Advice */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-accent-secondary" />
                    オンボーディングアドバイス
                </h2>
                <p className="text-sm text-text-muted mb-4">
                    採用後、現場に出す前に教えるべき具体的なポイント
                </p>
                <OnboardingAdvice adviceList={candidate.onboardingAdvice} />
            </div>
        </div>
    );
}
