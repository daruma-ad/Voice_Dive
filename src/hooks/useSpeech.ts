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

                // 既に処理された final result のインデックスを追跡する
                let lastProcessedIndex = -1;

                recognitionRef.current.onresult = (event: any) => {
                    let interim = '';
                    let final = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        const transcriptSegment = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            // Android Chromeなどでは同じfinal結果が何度も呼ばれることがあるため
                            // 既に処理したインデックスはスキップする
                            if (i > lastProcessedIndex) {
                                final += transcriptSegment;
                                lastProcessedIndex = i;
                            }
                        } else {
                            interim += transcriptSegment;
                        }
                    }

                    if (final) {
                        setTranscript((prev) => prev + final);
                    }
                    setInterimTranscript(interim);
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
            const jaVoice = voices.find(v => v.lang === 'ja-JP' && v.name.includes('Female'))
                || voices.find(v => v.lang === 'ja-JP' && v.name.includes('Google'))
                || voices.find(v => v.lang === 'ja-JP');

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
