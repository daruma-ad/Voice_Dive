'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

// SpeechRecognition is not standard in all browsers yet (usually webkitSpeechRecognition)
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface UseSpeechReturn {
    // STT state
    isListening: boolean;
    transcript: string;
    interimTranscript: string;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;

    // TTS state
    isSpeaking: boolean;
    speak: (text: string) => Promise<void>;
    stopSpeaking: () => void;
}

export function useSpeech(): UseSpeechReturn {
    // STT
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const recognitionRef = useRef<any>(null);
    const shouldListenRef = useRef(false);
    const accumulatedTranscriptRef = useRef('');

    // TTS
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        // Initialize SpeechRecognition
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'ja-JP';

                // セッションごとの最新の確定テキスト
                let currentSessionFinal = '';

                recognitionRef.current.onstart = () => {
                    currentSessionFinal = '';
                    setInterimTranscript('');
                };

                recognitionRef.current.onresult = (event: any) => {
                    let finalStr = '';
                    let interimStr = '';

                    for (let i = 0; i < event.results.length; ++i) {
                        let segment = event.results[i][0].transcript;
                        let processedSegment = segment;

                        // Android Chrome特有のバグ対策:
                        // インデックスが進むごとに過去のテキストが丸ごと含まれてしまう現象を防ぐため、
                        // 1つ前の結果と前方一致する場合は、新しく追加された差分だけを抽出する。
                        if (i > 0) {
                            let prevSegment = event.results[i - 1][0].transcript;
                            if (segment.startsWith(prevSegment) && segment.length > prevSegment.length) {
                                processedSegment = segment.substring(prevSegment.length);
                            }
                        }

                        if (event.results[i].isFinal) {
                            finalStr += processedSegment;
                        } else {
                            interimStr += processedSegment;
                        }
                    }

                    currentSessionFinal = finalStr;

                    // 画面表示用テキスト = 過去セッションまでの蓄積分 + 今のセッションでの確定分
                    setTranscript(() => accumulatedTranscriptRef.current + currentSessionFinal);

                    setInterimTranscript(interimStr);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    // 致命的なエラーでなければ、onendで自動再開を試みる
                    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                        shouldListenRef.current = false;
                        setIsListening(false);
                    }
                };

                recognitionRef.current.onend = () => {
                    // セッションが終わった（または途切れた）時点で、
                    // そのセッションで確定したテキストを全体蓄積バッファにコミットする
                    accumulatedTranscriptRef.current += currentSessionFinal;
                    currentSessionFinal = '';

                    // ユーザーが意図的に止めていない場合は自動的に再起動する（Chromeの無音停止対策）
                    if (shouldListenRef.current) {
                        try {
                            recognitionRef.current.start();
                        } catch (e) {
                            console.error('Failed to restart recognition:', e);
                            shouldListenRef.current = false;
                            setIsListening(false);
                        }
                    } else {
                        setIsListening(false);
                    }
                };
            }

            // Initialize SpeechSynthesis
            synthRef.current = window.speechSynthesis;
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    shouldListenRef.current = false;
                    recognitionRef.current.stop();
                } catch (e) { }
            }
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !shouldListenRef.current) {
            if (synthRef.current?.speaking) {
                synthRef.current.cancel(); // Stop AI before listening
            }
            try {
                shouldListenRef.current = true;
                setInterimTranscript('');
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error('Failed to start recognition', e);
                shouldListenRef.current = false;
                setIsListening(false);
            }
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && shouldListenRef.current) {
            try {
                shouldListenRef.current = false;
                recognitionRef.current.stop();
                setIsListening(false);
            } catch (e) {
                console.error('Failed to stop recognition', e);
            }
        }
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setInterimTranscript('');
        accumulatedTranscriptRef.current = '';
    }, []);

    const speak = useCallback((text: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!synthRef.current) {
                reject(new Error('Speech synthesis not supported'));
                return;
            }

            // Stop any ongoing speech
            synthRef.current.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ja-JP';
            utterance.pitch = 1.2; // Slightly higher pitch for "Mina"
            utterance.rate = 1.0;

            // Try to find a good Japanese female voice
            const voices = synthRef.current.getVoices();
            // 優先順位: 1. Kyoko (iOS), 2. Female (一般), 3. Google (Chrome), 4. Siri, 5. ja-JP
            const jaVoice = voices.find(v => v.lang.startsWith('ja') && v.name.includes('Kyoko'))
                || voices.find(v => v.lang.startsWith('ja') && (v.name.includes('Female') || v.name.includes('女性')))
                || voices.find(v => v.lang.startsWith('ja') && v.name.includes('Google'))
                || voices.find(v => v.lang.startsWith('ja') && v.name.includes('Siri'))
                || voices.find(v => v.lang.startsWith('ja'));

            if (jaVoice) {
                utterance.voice = jaVoice;
            }

            utterance.onstart = () => {
                setIsSpeaking(true);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
                resolve();
            };

            utterance.onerror = (e) => {
                console.error('Speech synthesis error:', e);
                setIsSpeaking(false);
                reject(e);
            };

            synthRef.current.speak(utterance);
        });
    }, []);

    const stopSpeaking = useCallback(() => {
        if (synthRef.current && synthRef.current.speaking) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        resetTranscript,
        isSpeaking,
        speak,
        stopSpeaking,
    };
}
