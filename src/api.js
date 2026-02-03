let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (!apiUrl.startsWith('http')) {
    apiUrl = `https://${apiUrl}`;
}
export const API_BASE_URL = `${apiUrl}/api`;

export async function uploadDataset(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Upload failed');
    }
    return response.json();
}

export async function trainModel(settings) {
    const response = await fetch(`${API_BASE_URL}/train`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
    });

    if (!response.ok) {
        throw new Error('Training failed');
    }
    return response.json();
}

export async function generateData(numRows) {
    const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numRows }),
    });

    if (!response.ok) {
        throw new Error('Generation failed');
    }
    return response.json();
}

export function getSyntheticDownloadUrl() {
    return `${API_BASE_URL}/download/synthetic`;
}

export function getModelDownloadUrl() {
    return `${API_BASE_URL}/download/model`;
}
