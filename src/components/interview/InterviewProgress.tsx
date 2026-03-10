import { scenarios, type InterviewPhase } from '@/lib/interviewFlow';

interface InterviewProgressProps {
    currentPhase: InterviewPhase;
}

export default function InterviewProgress({ currentPhase }: InterviewProgressProps) {
    const currentIndex = scenarios.findIndex((s) => s.id === currentPhase);

    return (
        <div className="w-full">
            {/* Progress Bar */}
            <div className="flex items-center gap-1 mb-3">
                {scenarios.map((scenario, i) => (
                    <div key={scenario.id} className="flex-1 flex items-center gap-1">
                        <div
                            className="flex-1 h-1.5 rounded-full transition-all duration-500"
                            style={{
                                background:
                                    i < currentIndex
                                        ? 'linear-gradient(90deg, #10b981, #059669)'
                                        : i === currentIndex
                                            ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                                            : '#1e2048',
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Phase Labels */}
            <div className="flex items-center justify-between">
                {scenarios.map((scenario, i) => (
                    <div
                        key={scenario.id}
                        className={`flex flex-col items-center gap-0.5 transition-all ${i === currentIndex
                                ? 'opacity-100'
                                : i < currentIndex
                                    ? 'opacity-60'
                                    : 'opacity-30'
                            }`}
                    >
                        <span className="text-sm">{scenario.icon}</span>
                        <span
                            className={`text-[10px] font-medium ${i === currentIndex ? 'text-accent-primary' : 'text-text-muted'
                                }`}
                        >
                            {scenario.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
