"use client";

import { useState } from "react";
import {
    uploadDataset,
    DatasetUploadResponse,
} from "@/services/api";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [dataset, setDataset] = useState<DatasetUploadResponse | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleUpload() {
        if (!file) return;

        setLoading(true);
        setError("");
        setDataset(null);

        try {
            const result = await uploadDataset(file);
            setDataset(result);
        }catch (err){
            setError(err instanceof Error ? err.message : "Something went wrong.");
        }finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2>Upload a Dataset</h2>

            <input
                type="file"
                accept=".csv, text/csv"
                onChange={(event) => {
                    setFile(event.target.files?.[0] ?? null);
                    setDataset(null);
                    setError("");
                }}
            />

            {file && (
                <p>Selected file: {file.name}</p>
            )}

            <button
                onClick={handleUpload}
                disabled={!file || loading}
            >
                {loading ? "Uploading..." : 'Upload CSV'}
            </button>

            {error && (
                <p style={{color:"red"}}>{error}</p>
            )}

            {dataset && (
                <div>
                    <h3>Upload successful!</h3>

                    <p>Filename: {dataset.filename}</p>
                    <p>Row Count: {dataset.row_count}</p>
                    <p>Column Count: {dataset.column_count}</p>

                    <h4>Dataset Columns:</h4>
                    <ul>
                        {dataset.columns.map((column) => (
                            <li key={column}>{column}</li>
                        ))}
                    </ul>

                    <h4>Data Preview</h4>
                    <table>
                        <thead>
                            <tr>
                                {dataset.columns.map((column) => (
                                    <th key={column}>{column}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {dataset.preview.map((row, index) => (
                                <tr key={index}>
                                    {dataset.columns.map((column) => (
                                        <td key={column}>
                                            {String(row[column] ?? "")}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

