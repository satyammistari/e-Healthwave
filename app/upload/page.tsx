import { DocumentUploader } from "@/components/DocumentUploader";

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Medical Document Upload</h1>
      <DocumentUploader />
    </div>
  );
} 