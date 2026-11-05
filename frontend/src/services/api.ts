const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

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