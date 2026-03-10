import type { Rank } from '@/lib/mockData';

interface RankBadgeProps {
    rank: Rank;
    size?: 'sm' | 'md' | 'lg';
}

export default function RankBadge({ rank, size = 'md' }: RankBadgeProps) {
    const sizeClasses = {
        sm: 'w-7 h-7 text-xs',
        md: 'w-9 h-9 text-sm',
        lg: 'w-14 h-14 text-2xl',
    };

    return (
        <div
            className={`rank-${rank.toLowerCase()} ${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-lg`}
        >
            {rank}
        </div>
    );
}
