'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Settings,
    BarChart3,
    Mic,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { href: '/dashboard', label: '候補者一覧', icon: Users },
    { href: '/dashboard/analytics', label: '分析', icon: BarChart3 },
    { href: '/dashboard/interviews', label: '面接管理', icon: Mic },
    { href: '/dashboard/settings', label: '設定', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col z-50 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[260px]'
                }`}
        >
            {/* Logo */}
            <div className="p-5 flex items-center gap-3 border-b border-sidebar-border">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    <Mic className="w-5 h-5 text-white" />
                </div>
                {!collapsed && (
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight">VoiceDive</h1>
                        <p className="text-[10px] text-text-muted tracking-widest uppercase">Dashboard</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href === '/dashboard' && pathname?.startsWith('/dashboard/c'));
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item flex items-center gap-3 text-sm font-medium transition-all ${isActive
                                    ? 'active text-accent-primary'
                                    : 'text-text-secondary hover:text-foreground'
                                }`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="p-3 border-t border-sidebar-border">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="nav-item flex items-center gap-3 text-sm text-text-secondary hover:text-foreground w-full"
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5" />
                            <span>折りたたむ</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
}
