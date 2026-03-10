import type { Scores } from '@/lib/mockData';
import { scoreLabels, scoreDescriptions } from '@/lib/mockData';

interface ScoreCardProps {
    scores: Scores;
}

function getScoreColor(score: number): string {
    if (score >= 4.5) return '#10b981';
    if (score >= 3.5) return '#6366f1';
    if (score >= 2.5) return '#f59e0b';
    if (score >= 1.5) return '#f97316';
    return '#ef4444';
}

function getScoreLabel(score: number): string {
    if (score >= 4.5) return '優秀';
    if (score >= 3.5) return '良好';
    if (score >= 2.5) return '普通';
    if (score >= 1.5) return '要改善';
    return '不十分';
}

export default function ScoreCard({ scores }: ScoreCardProps) {
    return (
        <div className="space-y-4">
            {(Object.keys(scores) as Array<keyof Scores>).map((key) => {
                const score = scores[key];
                const color = getScoreColor(score);
                const percentage = (score / 5) * 100;

                return (
                    <div key={key} className="group">
                        <div className="flex items-center justify-between mb-1.5">
                            <div>
                                <span className="text-sm font-medium text-foreground">
                                    {scoreLabels[key]}
                                </span>
                                <p className="text-[11px] text-text-muted">
                                    {scoreDescriptions[key]}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                                    style={{
                                        backgroundColor: `${color}15`,
                                        color: color,
                                    }}
                                >
                                    {getScoreLabel(score)}
                                </span>
                                <span className="text-lg font-bold" style={{ color }}>
                                    {score.toFixed(1)}
                                </span>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-[#1a1b38] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full score-bar-fill transition-all"
                                style={
                                    {
                                        '--score-width': `${percentage}%`,
                                        background: `linear-gradient(90deg, ${color}88, ${color})`,
                                    } as React.CSSProperties
                                }
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
