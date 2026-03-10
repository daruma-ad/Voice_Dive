import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import type { OnboardingAdvice as OnboardingAdviceType } from '@/lib/mockData';

interface OnboardingAdviceProps {
    adviceList: OnboardingAdviceType[];
}

function getPriorityConfig(priority: string) {
    switch (priority) {
        case 'high':
            return {
                icon: AlertTriangle,
                label: '高',
                color: '#ef4444',
                bg: 'rgba(239, 68, 68, 0.1)',
                border: 'rgba(239, 68, 68, 0.2)',
            };
        case 'medium':
            return {
                icon: AlertCircle,
                label: '中',
                color: '#f59e0b',
                bg: 'rgba(245, 158, 11, 0.1)',
                border: 'rgba(245, 158, 11, 0.2)',
            };
        default:
            return {
                icon: Info,
                label: '低',
                color: '#6366f1',
                bg: 'rgba(99, 102, 241, 0.1)',
                border: 'rgba(99, 102, 241, 0.2)',
            };
    }
}

export default function OnboardingAdvice({ adviceList }: OnboardingAdviceProps) {
    return (
        <div className="space-y-3">
            {adviceList.map((advice, index) => {
                const config = getPriorityConfig(advice.priority);
                const Icon = config.icon;

                return (
                    <div
                        key={index}
                        className="rounded-xl p-4 transition-all"
                        style={{
                            background: config.bg,
                            border: `1px solid ${config.border}`,
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ backgroundColor: `${config.color}20` }}
                            >
                                <Icon className="w-4 h-4" style={{ color: config.color }} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className="text-xs font-bold uppercase tracking-wider"
                                        style={{ color: config.color }}
                                    >
                                        優先度: {config.label}
                                    </span>
                                    <span className="text-xs text-text-muted">|</span>
                                    <span className="text-xs font-medium text-text-secondary">
                                        {advice.category}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground leading-relaxed">
                                    {advice.advice}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
