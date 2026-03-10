'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, ArrowUpDown, Clock, Users, TrendingUp } from 'lucide-react';
import { candidates, formatDate } from '@/lib/mockData';
import type { Rank, InterviewStatus } from '@/lib/mockData';
import RankBadge from '@/components/RankBadge';

type SortKey = 'date' | 'score' | 'rank' | 'name';
type SortDir = 'asc' | 'desc';

function getStatusConfig(status: InterviewStatus) {
    switch (status) {
        case 'completed':
            return { label: '完了', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
        case 'in_progress':
            return { label: '進行中', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)' };
        case 'pending':
            return { label: '未実施', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.12)' };
    }
}

export default function DashboardPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRank, setFilterRank] = useState<Rank | 'all'>('all');
    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    const filtered = candidates
        .filter((c) => {
            const matchesSearch =
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.nameReading.includes(searchQuery) ||
                c.nationality.includes(searchQuery) ||
                c.desiredPosition.includes(searchQuery);
            const matchesRank = filterRank === 'all' || c.rank === filterRank;
            return matchesSearch && matchesRank;
        })
        .sort((a, b) => {
            const dir = sortDir === 'asc' ? 1 : -1;
            switch (sortKey) {
                case 'date':
                    return dir * (new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime());
                case 'score':
                    return dir * (a.overallScore - b.overallScore);
                case 'rank':
                    return dir * a.rank.localeCompare(b.rank);
                case 'name':
                    return dir * a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

    const stats = {
        total: candidates.length,
        completed: candidates.filter((c) => c.status === 'completed').length,
        avgScore: (
            candidates.reduce((sum, c) => sum + c.overallScore, 0) / candidates.length
        ).toFixed(1),
    };

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('desc');
        }
    };

    return (
        <div className="max-w-7xl mx-auto fade-in-up">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    候補者一覧
                </h1>
                <p className="text-text-secondary">
                    AI面接の評価結果を確認し、採用判断にお役立てください
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8 stagger-children">
                <div className="glass-card p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))' }}>
                        <Users className="w-6 h-6 text-accent-primary" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                        <p className="text-xs text-text-muted">総候補者数</p>
                    </div>
                </div>
                <div className="glass-card p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))' }}>
                        <Clock className="w-6 h-6 text-accent-success" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                        <p className="text-xs text-text-muted">面接完了</p>
                    </div>
                </div>
                <div className="glass-card p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(249, 115, 22, 0.15))' }}>
                        <TrendingUp className="w-6 h-6 text-accent-warning" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{stats.avgScore}</p>
                        <p className="text-xs text-text-muted">平均スコア</p>
                    </div>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="glass-card p-4 mb-6 flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        type="text"
                        placeholder="名前、国籍、希望職種で検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0a0b14] border border-card-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-accent-primary/50 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-text-muted" />
                    <select
                        value={filterRank}
                        onChange={(e) => setFilterRank(e.target.value as Rank | 'all')}
                        className="bg-[#0a0b14] border border-card-border rounded-xl py-2.5 px-3 text-sm text-foreground focus:outline-none focus:border-accent-primary/50 cursor-pointer"
                    >
                        <option value="all">全ランク</option>
                        <option value="A">ランクA</option>
                        <option value="B">ランクB</option>
                        <option value="C">ランクC</option>
                        <option value="D">ランクD</option>
                        <option value="E">ランクE</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-card-border">
                            <th className="text-left py-4 px-5">
                                <button
                                    onClick={() => toggleSort('name')}
                                    className="flex items-center gap-1 text-xs font-semibold text-text-muted uppercase tracking-wider hover:text-foreground transition-colors"
                                >
                                    候補者
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="text-left py-4 px-5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                                国籍
                            </th>
                            <th className="text-left py-4 px-5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                                希望職種
                            </th>
                            <th className="text-left py-4 px-5">
                                <button
                                    onClick={() => toggleSort('rank')}
                                    className="flex items-center gap-1 text-xs font-semibold text-text-muted uppercase tracking-wider hover:text-foreground transition-colors"
                                >
                                    ランク
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="text-left py-4 px-5">
                                <button
                                    onClick={() => toggleSort('score')}
                                    className="flex items-center gap-1 text-xs font-semibold text-text-muted uppercase tracking-wider hover:text-foreground transition-colors"
                                >
                                    スコア
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="text-left py-4 px-5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                                ステータス
                            </th>
                            <th className="text-left py-4 px-5">
                                <button
                                    onClick={() => toggleSort('date')}
                                    className="flex items-center gap-1 text-xs font-semibold text-text-muted uppercase tracking-wider hover:text-foreground transition-colors"
                                >
                                    面接日
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((candidate) => {
                            const statusConfig = getStatusConfig(candidate.status);
                            return (
                                <tr
                                    key={candidate.id}
                                    onClick={() => router.push(`/dashboard/${candidate.id}`)}
                                    className="border-b border-card-border/50 table-row-hover cursor-pointer"
                                >
                                    <td className="py-4 px-5">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">
                                                {candidate.name}
                                            </p>
                                            <p className="text-xs text-text-muted">
                                                {candidate.nameReading}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <span className="text-sm">
                                            {candidate.nationalityFlag} {candidate.nationality}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5 text-sm text-text-secondary">
                                        {candidate.desiredPosition}
                                    </td>
                                    <td className="py-4 px-5">
                                        <RankBadge rank={candidate.rank} size="sm" />
                                    </td>
                                    <td className="py-4 px-5">
                                        <span className="text-lg font-bold text-foreground">
                                            {candidate.overallScore.toFixed(1)}
                                        </span>
                                        <span className="text-xs text-text-muted">/5.0</span>
                                    </td>
                                    <td className="py-4 px-5">
                                        <span
                                            className="text-xs font-medium px-2.5 py-1 rounded-full"
                                            style={{
                                                color: statusConfig.color,
                                                backgroundColor: statusConfig.bg,
                                            }}
                                        >
                                            {statusConfig.label}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5 text-sm text-text-secondary">
                                        {formatDate(candidate.interviewDate)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-text-muted">該当する候補者が見つかりません</p>
                    </div>
                )}
            </div>
        </div>
    );
}
