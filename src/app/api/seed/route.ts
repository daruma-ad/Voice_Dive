import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { candidates as mockCands } from '@/lib/mockData';

export async function GET() {
    try {
        console.log('Starting DB seed process...');
        for (const c of mockCands) {
            await setDoc(doc(collection(db, 'candidates'), c.id), c);
            console.log(`Added candidate: ${c.id}`);
        }
        return NextResponse.json({ success: true, message: 'Seeded Firestore with 8 candidates.' });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
