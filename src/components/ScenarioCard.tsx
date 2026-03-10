import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { ScenarioDetail } from '@/lib/mockData';
import { useState } from 'react';

interface ScenarioCardProps {
    scenario: ScenarioDetail;
    index: number;
}

export default function ScenarioCard({ scenario, index }: ScenarioCardProps) {
    const [expanded, setExpanded] = useState(false);
    const isPassed = scenario.result === 'pass';

    return (
        <div
            className="glass-card overflow-hidden transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Header */}
            <div
                className="p-4 cursor-pointer flex items-center justify-between"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    {isPassed ? (
                        <div className="w-8 h-8 rounded-full bg-accent-success/15 flex items-center justify-center">
                            <CheckCircle className="w-4.5 h-4.5 text-accent-success" />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-accent-danger/15 flex items-center justify-center">
                            <XCircle className="w-4.5 h-4.5 text-accent-danger" />
                        </div>
                    )}
                    <div>
                        <h4 className="text-sm font-semibold text-foreground">
                            {scenario.name}
                        </h4>
                        <p className="text-xs text-text-muted">{scenario.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <span
                            className={`text-lg font-bold ${isPassed ? 'text-accent-success' : 'text-accent-danger'
                                }`}
                        >
                            {scenario.score.toFixed(1)}
                        </span>
                        <span className="text-xs text-text-muted">/5.0</span>
                    </div>
                    <div
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isPassed
                                ? 'bg-accent-success/15 text-accent-success'
                                : 'bg-accent-danger/15 text-accent-danger'
                            }`}
                    >
                        {isPassed ? '合格' : '不合格'}
                    </div>
                    {expanded ? (
                        <ChevronUp className="w-4 h-4 text-text-muted" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-text-muted" />
                    )}
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="px-4 pb-4 border-t border-card-border pt-4 space-y-3">
                    <div>
                        <h5 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                            フィードバック
                        </h5>
                        <p className="text-sm text-foreground leading-relaxed">
                            {scenario.feedback}
                        </p>
                    </div>
                    {scenario.improvementPoints.length > 0 && (
                        <div>
                            <h5 className="text-xs font-semibold text-accent-warning uppercase tracking-wider mb-2">
                                改善ポイント
                            </h5>
                            <ul className="space-y-1.5">
                                {scenario.improvementPoints.map((point, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm text-text-secondary"
                                    >
                                        <span className="text-accent-warning mt-1 text-xs">●</span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
