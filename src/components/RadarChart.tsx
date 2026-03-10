'use client';

import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
} from 'chart.js';
import type { Scores } from '@/lib/mockData';
import { scoreLabels } from '@/lib/mockData';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

interface RadarChartProps {
    scores: Scores;
}

export default function RadarChart({ scores }: RadarChartProps) {
    const labels = Object.keys(scores).map(
        (key) => scoreLabels[key as keyof Scores]
    );
    const values = Object.values(scores);

    const data = {
        labels,
        datasets: [
            {
                label: 'VoiceDive Score',
                data: values,
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                borderColor: 'rgba(99, 102, 241, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#6366f1',
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            tooltip: {
                backgroundColor: 'rgba(18, 19, 42, 0.95)',
                titleColor: '#e8e9f0',
                bodyColor: '#9ca3af',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 5,
                min: 0,
                ticks: {
                    stepSize: 1,
                    color: '#4b5563',
                    backdropColor: 'transparent',
                    font: { size: 10 },
                },
                grid: {
                    color: 'rgba(99, 102, 241, 0.08)',
                },
                angleLines: {
                    color: 'rgba(99, 102, 241, 0.1)',
                },
                pointLabels: {
                    color: '#9ca3af',
                    font: {
                        size: 11,
                        family: "'Noto Sans JP', sans-serif",
                    },
                },
            },
        },
        animation: {
            duration: 1200,
            easing: 'easeOutQuart' as const,
        },
    };

    return (
        <div className="w-full max-w-[360px] mx-auto">
            <Radar data={data} options={options} />
        </div>
    );
}
