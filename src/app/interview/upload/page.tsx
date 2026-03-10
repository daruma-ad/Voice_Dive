'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Upload, FileText, X, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploaded, setIsUploaded] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileSelect(droppedFile);
    };

    const handleFileSelect = async (selectedFile: File) => {
        setFile(selectedFile);
        setUploadProgress(10);
        setIsUploaded(false);

        try {
            // Simulated progress while the real API runs
            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) return 90;
                    return prev + Math.random() * 15;
                });
            }, 500);

            // Import dynamically or configure component to have api imported
            const { parseResume } = await import('@/lib/api');
            const result = await parseResume(selectedFile);

            clearInterval(interval);
            setUploadProgress(100);
            setIsUploaded(true);

            // Save parse result to session storage for the interview session
            sessionStorage.setItem('voicedive_resume_summary', result.summary);
            if (result.name) {
                sessionStorage.setItem('voicedive_candidate_name', result.name);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            setIsUploaded(false);
            setUploadProgress(0);
            alert('アップロードに失敗しました。もう一度お試しください。');
            setFile(null);
        }
    };

    const removeFile = () => {
        setFile(null);
        setUploadProgress(0);
        setIsUploaded(false);
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
                    style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
                />
            </div>

            <div className="relative z-10 max-w-md w-full">
                {/* Back Button */}
                <Link
                    href="/interview"
                    className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    戻る
                </Link>

                {/* Step Indicator */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                            1
                        </div>
                        <span className="text-sm font-medium text-foreground">履歴書</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-card-border rounded-full mx-2" />
                    <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-card-border text-text-muted">
                            2
                        </div>
                        <span className="text-sm text-text-muted">準備</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-card-border rounded-full mx-2" />
                    <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-card-border text-text-muted">
                            3
                        </div>
                        <span className="text-sm text-text-muted">面接</span>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-foreground mb-2">
                    履歴書をアップロード
                </h1>
                <p className="text-sm text-text-secondary mb-6">
                    PDFまたはテキストファイルで履歴書をアップロードしてください。
                    <br />
                    <span className="text-text-muted text-xs">Upload your resume (PDF or text file)</span>
                </p>

                {/* Upload Area */}
                {!file ? (
                    <div
                        className={`glass-card border-2 border-dashed p-8 text-center cursor-pointer transition-all ${isDragging
                            ? 'border-accent-primary bg-accent-primary/5 scale-[1.02]'
                            : 'border-card-border hover:border-accent-primary/50'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.txt,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleFileSelect(f);
                            }}
                        />
                        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))' }}>
                            <Upload className="w-8 h-8 text-accent-primary" />
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">
                            ファイルをドラッグ&ドロップ
                        </p>
                        <p className="text-xs text-text-muted mb-3">
                            またはクリックして選択
                        </p>
                        <p className="text-xs text-text-muted">
                            PDF, TXT, DOC対応 — 最大10MB
                        </p>
                    </div>
                ) : (
                    <div className="glass-card p-5 space-y-4">
                        {/* File Info */}
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))' }}>
                                <FileText className="w-6 h-6 text-accent-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-text-muted">{formatSize(file.size)}</p>
                            </div>
                            <button
                                onClick={removeFile}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-card-border transition-colors"
                            >
                                <X className="w-4 h-4 text-text-muted" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="text-text-secondary">
                                    {isUploaded ? (
                                        <span className="flex items-center gap-1 text-accent-success">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            アップロード完了
                                        </span>
                                    ) : (
                                        'アップロード中...'
                                    )}
                                </span>
                                <span className="text-text-muted font-mono">
                                    {Math.min(Math.round(uploadProgress), 100)}%
                                </span>
                            </div>
                            <div className="w-full h-2 bg-[#1a1b38] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                        width: `${Math.min(uploadProgress, 100)}%`,
                                        background: isUploaded
                                            ? 'linear-gradient(90deg, #10b981, #059669)'
                                            : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Skip Option */}
                <p className="text-center text-xs text-text-muted mt-4 mb-8">
                    履歴書がない場合は、スキップして面接に進めます
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Link
                        href="/interview/ready"
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: isUploaded
                                ? 'linear-gradient(135deg, #10b981, #059669)'
                                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            boxShadow: isUploaded
                                ? '0 8px 32px rgba(16, 185, 129, 0.25)'
                                : '0 8px 32px rgba(99, 102, 241, 0.25)',
                        }}
                    >
                        {isUploaded ? '次へ進む' : 'スキップして進む'}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
