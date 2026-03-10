'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: ReactNode;
    requireAuth?: boolean;
}

/**
 * Auth guard component that protects routes
 * Currently in demo mode - auth check is optional
 * Set REQUIRE_AUTH to true when Firebase is configured
 */
const REQUIRE_AUTH = false;

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!REQUIRE_AUTH) return;
        if (!loading && !user && requireAuth) {
            router.push('/login');
        }
    }, [user, loading, requireAuth, router]);

    // If auth is not required (demo mode), just render children
    if (!REQUIRE_AUTH) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-accent-primary mx-auto mb-3" />
                    <p className="text-sm text-text-muted">読み込み中...</p>
                </div>
            </div>
        );
    }

    if (!user && requireAuth) {
        return null;
    }

    return <>{children}</>;
}
