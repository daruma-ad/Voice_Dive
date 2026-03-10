'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    orderBy,
    where,
    type DocumentData,
    type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    candidates as mockCandidates,
    getCandidateById as getMockCandidateById,
    type Candidate,
    type Rank,
} from '@/lib/mockData';

// Flag to switch between Firestore and mock data
// Set to true when Firebase is properly configured
const USE_FIRESTORE = true;

/**
 * Fetch all candidates from Firestore or mock data
 */
export function useCandidates(filters?: {
    rank?: Rank | 'all';
    searchQuery?: string;
}) {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCandidates = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!USE_FIRESTORE) {
                // Use mock data
                let data = [...mockCandidates];

                if (filters?.rank && filters.rank !== 'all') {
                    data = data.filter((c) => c.rank === filters.rank);
                }
                if (filters?.searchQuery) {
                    const q = filters.searchQuery.toLowerCase();
                    data = data.filter(
                        (c) =>
                            c.name.toLowerCase().includes(q) ||
                            c.nameReading.includes(q) ||
                            c.nationality.includes(q) ||
                            c.desiredPosition.includes(q)
                    );
                }

                setCandidates(data);
                setLoading(false);
                return;
            }

            // Firestore query
            const constraints: QueryConstraint[] = [
                orderBy('interviewDate', 'desc'),
            ];

            if (filters?.rank && filters.rank !== 'all') {
                constraints.unshift(where('rank', '==', filters.rank));
            }

            const q = query(collection(db, 'candidates'), ...constraints);
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Candidate[];

            if (filters?.searchQuery) {
                const searchQ = filters.searchQuery.toLowerCase();
                const filtered = data.filter(
                    (c) =>
                        c.name.toLowerCase().includes(searchQ) ||
                        c.nameReading.includes(searchQ) ||
                        c.nationality.includes(searchQ) ||
                        c.desiredPosition.includes(searchQ)
                );
                setCandidates(filtered);
            } else {
                setCandidates(data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
        } finally {
            setLoading(false);
        }
    }, [filters?.rank, filters?.searchQuery]);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    return { candidates, loading, error, refetch: fetchCandidates };
}

/**
 * Fetch a single candidate by ID from Firestore or mock data
 */
export function useCandidate(candidateId: string) {
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCandidate = async () => {
            setLoading(true);
            setError(null);

            try {
                if (!USE_FIRESTORE) {
                    const data = getMockCandidateById(candidateId);
                    setCandidate(data || null);
                    setLoading(false);
                    return;
                }

                const docRef = doc(db, 'candidates', candidateId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCandidate({
                        id: docSnap.id,
                        ...docSnap.data(),
                    } as Candidate);
                } else {
                    setCandidate(null);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };

        fetchCandidate();
    }, [candidateId]);

    return { candidate, loading, error };
}

/**
 * Add a new candidate evaluation result to Firestore
 */
export async function addCandidate(data: Omit<Candidate, 'id'>) {
    if (!USE_FIRESTORE) {
        console.log('Mock mode: candidate data not actually saved to Firestore', data);
        return 'mock-id-' + Math.random().toString(36).substr(2, 9);
    }

    try {
        const { addDoc } = await import('firebase/firestore');
        const docRef = await addDoc(collection(db, 'candidates'), data);
        return docRef.id;
    } catch (err) {
        console.error('Failed to add candidate:', err);
        throw err;
    }
}
