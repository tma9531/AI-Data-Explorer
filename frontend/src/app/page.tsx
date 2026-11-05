"use client";

import { useEffect, useState } from "react";
import { checkBackendHealth } from "@/services/api";

export default function Home() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    checkBackendHealth()
      .then(() => setStatus("Backend connected!"))
      .catch(() => setStatus("Backend unavailable."));
  }, []);

  return (
    <main>
      <h1>AI Data Explorer</h1>
      <p>{status}</p>
    </main>
  );
}