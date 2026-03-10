'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { signIn, signUp, error: authError } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const error = localError || authError;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        setIsLoading(true);

        try {
            if (isSignUp) {
                await signUp(email, password);
            } else {
                await signIn(email, password);
            }
            router.push('/dashboard');
        } catch {
            // Error is handled by AuthContext
        } finally {
            setIsLoading(false);
        }
    };

    // Demo mode - skip login
    const handleDemoMode = () => {
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
                    style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
                />
            </div>

            <div className="relative z-10 w-full max-w-md fade-in-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                        >
                            <Mic className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Voice<span className="gradient-text">Dive</span>
                    </h1>
                    <p className="text-text-muted text-sm mt-1">
                        採用担当者向けダッシュボード
                    </p>
                </div>

                {/* Login Card */}
                <div className="glass-card p-8">
                    <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
                        {isSignUp ? 'アカウント作成' : 'ログイン'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-text-secondary mb-1.5">
                                メールアドレス
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    className="w-full bg-[#0a0b14] border border-card-border rounded-xl py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-accent-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium text-text-secondary mb-1.5">
                                パスワード
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full bg-[#0a0b14] border border-card-border rounded-xl py-3 pl-10 pr-12 text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-accent-primary/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="p-3 rounded-xl bg-accent-danger/10 border border-accent-danger/20">
                                <p className="text-xs text-accent-danger">{error}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.25)',
                            }}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isSignUp ? 'アカウント作成' : 'ログイン'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle Sign Up/In */}
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setLocalError(null);
                            }}
                            className="text-xs text-accent-primary hover:underline"
                        >
                            {isSignUp
                                ? '既にアカウントをお持ちですか？ログイン'
                                : 'アカウントをお持ちでないですか？新規作成'}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-card-border" />
                        <span className="text-xs text-text-muted">または</span>
                        <div className="flex-1 h-px bg-card-border" />
                    </div>

                    {/* Demo Mode */}
                    <button
                        onClick={handleDemoMode}
                        className="w-full py-3 rounded-xl text-sm font-medium border border-card-border text-text-secondary hover:border-accent-primary/30 hover:text-foreground transition-all"
                    >
                        🎮 デモモードで確認する
                    </button>
                    <p className="text-[11px] text-text-muted text-center mt-2">
                        Firebaseの設定なしでダッシュボードを確認できます
                    </p>
                </div>
            </div>
        </div>
    );
}
