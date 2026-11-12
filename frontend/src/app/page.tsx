import FileUpload from "@/components/data/FileUpload";

export default function Home() {
  return (
    <main>
      <h1>AI Data Explorer</h1>

      <p>Upload a dataset to get started.</p>

      <FileUpload/>
    </main>
  );
}