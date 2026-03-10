import { ref, uploadBytesResumable, getDownloadURL, type UploadTask } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export interface UploadProgress {
    progress: number;
    downloadURL: string | null;
    error: string | null;
    isComplete: boolean;
}

/**
 * Upload a file to Firebase Cloud Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'resumes/user123/resume.pdf')
 * @param onProgress - Callback for upload progress
 * @returns Promise resolving to the download URL
 */
export async function uploadFile(
    file: File,
    path: string,
    onProgress?: (progress: number) => void
): Promise<string> {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) onProgress(progress);
            },
            (error) => {
                reject(new Error(getUploadErrorMessage(error.code)));
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
}

/**
 * Upload a resume file for a candidate
 */
export async function uploadResume(
    file: File,
    candidateId: string,
    onProgress?: (progress: number) => void
): Promise<string> {
    const ext = file.name.split('.').pop() || 'pdf';
    const path = `resumes/${candidateId}/resume_${Date.now()}.${ext}`;
    return uploadFile(file, path, onProgress);
}

/**
 * Upload an audio recording from an interview session
 */
export async function uploadAudioRecording(
    blob: Blob,
    sessionId: string,
    segmentIndex: number,
    onProgress?: (progress: number) => void
): Promise<string> {
    const file = new File([blob], `segment_${segmentIndex}.webm`, {
        type: 'audio/webm',
    });
    const path = `recordings/${sessionId}/segment_${segmentIndex}_${Date.now()}.webm`;
    return uploadFile(file, path, onProgress);
}

function getUploadErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'storage/unauthorized':
            return 'アップロードの権限がありません。ログインしてください。';
        case 'storage/canceled':
            return 'アップロードがキャンセルされました。';
        case 'storage/quota-exceeded':
            return 'ストレージの容量が不足しています。';
        case 'storage/invalid-checksum':
            return 'ファイルが破損しています。再度アップロードしてください。';
        default:
            return 'アップロードに失敗しました。もう一度お試しください。';
    }
}
