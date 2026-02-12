import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCertificate, downloadCertificateFile } from "../api/certificates";
import type { Certificate } from "../api/certificates";
import { Button, Input, Card } from "../Components/ui";

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchId, setSearchId] = useState(id || "");

  async function load(certId: number) {
    setIsLoading(true);
    try {
      const data = await getCertificate(certId);
      setCertificate(data);
    } catch (err) {
      console.error(err);
      setCertificate(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      load(Number(id));
    }
  }, [id]);

  async function onSearch() {
    if (!searchId) return;
    navigate(`/certificate/${searchId}`);
  }

  async function onDownload() {
    if (!certificate) return;
    try {
      setIsDownloading(true);
      const blob = await downloadCertificateFile(certificate.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate_${certificate.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex gap-3 mb-8">
        <Input
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter certificate ID..."
        />
        <Button onClick={onSearch}>Search</Button>
      </div>
      <Card className="p-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : certificate ? (
          <>
            <h2 className="text-xl font-bold mb-4">
              Certificate #{certificate.id}
            </h2>

            <div className="space-y-2">
              <div>
                <strong>Course:</strong> {certificate.course_name}
              </div>
              <div>
                <strong>Course ID:</strong> {certificate.course_id}
              </div>
              <div>
                <strong>User ID:</strong> {certificate.user_id}
              </div>
              <div>
                <strong>Created:</strong>{" "}
                {new Date(certificate.created_at).toLocaleString()}
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={onDownload}
                disabled={isDownloading}
              >
                {isDownloading ? "Downloading..." : "Download PDF"}
              </Button>
            </div>
          </>
        ) : (
          <div>No certificate found.</div>
        )}
      </Card>
    </div>
  );
}
