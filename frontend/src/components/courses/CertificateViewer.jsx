import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";

const CertificateViewer = ({ enrollmentId }) => {
  const { accessToken } = useAuth();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enrollmentId || !accessToken) return;

    const fetchCertificate = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/courses/certificate/download/${enrollmentId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Failed to load certificate");
        }

        const blob = await response.blob();

        if (blob.type === "application/pdf") {
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          toast("Certificate loaded", {
            description: "You can now preview and download your certificate.",
          });
        } else {
          const text = await blob.text();
          throw new Error(text || "Unexpected response format.");
        }
      } catch (err) {
        console.error("Certificate error:", err);
        toast("Error loading certificate", {
          description: err.message,
          className: "text-red-500",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [enrollmentId, accessToken]);

  return (
    <div className="p-4">
      {loading && <p>Loading certificate...</p>}

      {pdfUrl && (
        <div>
          <iframe
            src={pdfUrl}
            title="Certificate Preview"
            width="100%"
            height="700px"
            className="rounded border shadow"
          />
          <a
            href={pdfUrl}
            download={`certificate_${enrollmentId}.pdf`}
            className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition"
          >
            Download Certificate
          </a>
        </div>
      )}
    </div>
  );
};

export default CertificateViewer;
