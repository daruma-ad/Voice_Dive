'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            setError(null);
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'ログインに失敗しました';
            setError(getErrorMessage(message));
            throw err;
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            setError(null);
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'アカウント作成に失敗しました';
            setError(getErrorMessage(message));
            throw err;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'ログアウトに失敗しました';
            setError(getErrorMessage(message));
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

function getErrorMessage(errorMessage: string): string {
    if (errorMessage.includes('auth/user-not-found') || errorMessage.includes('auth/wrong-password') || errorMessage.includes('auth/invalid-credential')) {
        return 'メールアドレスまたはパスワードが正しくありません';
    }
    if (errorMessage.includes('auth/email-already-in-use')) {
        return 'このメールアドレスは既に使用されています';
    }
    if (errorMessage.includes('auth/weak-password')) {
        return 'パスワードは6文字以上にしてください';
    }
    if (errorMessage.includes('auth/invalid-email')) {
        return '有効なメールアドレスを入力してください';
    }
    if (errorMessage.includes('auth/too-many-requests')) {
        return 'ログイン試行回数が多すぎます。しばらくしてから再試行してください';
    }
    return errorMessage;
}
