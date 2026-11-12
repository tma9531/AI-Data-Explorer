const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export type DatasetUploadResponse = {
    filename: string,
    row_count: number,
    column_count: number,
    columns: string[],
    preview: Record<string, unknown>[];
};

/**
 * Checks whether the backend is running.
 */
export async function checkBackendHealth() {
    const response = await fetch(`${API_URL}/api/health`);

    if(!response.ok) {
        throw new Error("Backend connection failed.")
    }

    return response.json();
}

/**
 * Uploads a dataset to the backend.
 */
export async function uploadDataset(file: File): Promise<DatasetUploadResponse> {
    const formData = new FormData();
    formData.append("file", file)

    const response = await fetch(
        `${API_URL}/api/datasets/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if(!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "File upload failed.")
    }

    return response.json();
}