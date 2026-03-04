"use client";

import { useState } from "react";
import { generateQrCodes } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  Download,
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect } from "react";

type QrMapping = {
  id: string;
  qrId: string;
  slug: string | null;
  createdAt: Date;
};

export function AdminQrManager({
  initialMappings,
}: {
  initialMappings: QrMapping[];
}) {
  const [mappings, setMappings] = useState<QrMapping[]>(initialMappings);
  const [count, setCount] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});

  useEffect(() => {
    // Generate data URLs for the QR codes
    const generateImages = async () => {
      const newImages: Record<string, string> = { ...qrImages };
      for (const mapping of mappings) {
        if (!newImages[mapping.qrId]) {
          try {
            const url = `${window.location.origin}/enroll/${mapping.qrId}`;
            newImages[mapping.qrId] = await QRCode.toDataURL(url, {
              width: 250,
              margin: 2,
              color: {
                dark: "#000000",
                light: "#ffffff",
              },
            });
          } catch (err) {
            console.error("Failed to generate QR for", mapping.qrId);
          }
        }
      }
      setQrImages(newImages);
    };

    generateImages();
  }, [mappings]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateQrCodes(count);
      if (res.success) {
        toast.success(res.message);
        // We trigger a hard refresh so the server fetches latest mappings,
        // or we can refresh the page manually
        window.location.reload();
      } else {
        toast.error(res.error || "Failed to generate");
      }
    } catch (e) {
      toast.error("Internal error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "QR ID,Enrollment URL,Status,Linked Slug,Created At\n" +
      mappings
        .map((m) => {
          const url = `${window.location.origin}/enroll/${m.qrId}`;
          const status = m.slug ? "Claimed" : "Unclaimed";
          const date = new Date(m.createdAt).toLocaleDateString();
          return `${m.qrId},${url},${status},${m.slug || ""},${date}`;
        })
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ridersafe-qr-codes-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/50 p-4 rounded-lg border">
        <div className="flex-1 w-full flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="w-24 border-primary/20"
          />
          <span className="text-sm text-muted-foreground mr-4">QR Codes</span>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || count <= 0 || count > 100}
            className="transition-all active:scale-95"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Generate New
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleDownloadCsv}
          className="w-full sm:w-auto"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="w-full sm:w-auto"
        >
          Print Grid
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">
            Generated Profiles ({mappings.length})
          </h3>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Claimed:{" "}
              {mappings.filter((m) => m.slug).length}
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-4 h-4 text-amber-500" /> Unclaimed:{" "}
              {mappings.filter((m) => !m.slug).length}
            </span>
          </div>
        </div>

        {/* Print-friendly grid view */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 print:grid-cols-4 print:gap-4">
          {mappings.map((mapping) => (
            <div
              key={mapping.id}
              className={`border rounded-lg p-3 flex flex-col items-center justify-center text-center space-y-2 transition-all ${
                mapping.slug
                  ? "bg-muted/30 border-green-500/20"
                  : "bg-card shadow-sm hover:shadow-md border-amber-500/20"
              }`}
            >
              {qrImages[mapping.qrId] ? (
                <img
                  src={qrImages[mapping.qrId]}
                  alt={`QR for ${mapping.qrId}`}
                  className="w-full h-auto max-w-[150px] mix-blend-multiply dark:mix-blend-normal dark:bg-white dark:rounded-md p-1"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center bg-muted animate-pulse rounded-md" />
              )}

              <div className="w-full pt-2 border-t text-xs space-y-1 print:hidden">
                <p className="font-mono text-[10px] text-muted-foreground break-all">
                  {mapping.qrId}
                </p>
                {mapping.slug ? (
                  <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Claimed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                    <RefreshCw className="w-3 h-3" /> Ready
                  </span>
                )}
              </div>

              {/* Special print label */}
              <div className="hidden print:block text-[8px] font-mono font-medium text-black">
                ID: {mapping.qrId}
              </div>
            </div>
          ))}
          {mappings.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
              No QR codes generated yet. Use the control above to create
              batches.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
