"use client";

import React, { useState, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  FileText,
  Loader2,
  AlertCircle,
  Eye,
  AlignLeft,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PDFViewerProps {
  documentId: string;
  fileName: string;
  extractedText?: string | null;
  pageCount?: number;
}

export function PDFViewer({
  documentId,
  fileName,
  extractedText,
  pageCount = 1,
}: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<"pdf" | "text">("pdf");

  useEffect(() => {
    let isMounted = true;

    async function fetchSignedUrl() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/documents/${documentId}/url`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load document preview");
        }

        if (isMounted) {
          setPdfUrl(data.url);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load PDF preview");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSignedUrl();

    return () => {
      isMounted = false;
    };
  }, [documentId]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);

  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Viewer Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 gap-2 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-brand-600 shrink-0" />
          <span
            className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px] sm:max-w-xs"
            title={fileName}
          >
            {fileName}
          </span>
          <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full shrink-0 font-mono">
            {pageCount} {pageCount === 1 ? "pg" : "pgs"}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* View mode toggle (PDF vs Raw Extracted Text) */}
          <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium dark:bg-slate-800">
            <button
              onClick={() => setViewMode("pdf")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                viewMode === "pdf"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="View PDF Document"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={() => setViewMode("text")}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                viewMode === "text"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="View Extracted Text"
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Text</span>
            </button>
          </div>

          {viewMode === "pdf" && (
            <>
              {/* Zoom Out */}
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="text-xs font-mono text-slate-600 min-w-[38px] text-center">
                {zoom}%
              </span>

              {/* Zoom In */}
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              {/* Reset Zoom */}
              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Open In New Tab */}
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
              title="Open PDF in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 relative overflow-auto bg-slate-200/60 dark:bg-slate-950 flex items-center justify-center p-2 sm:p-4">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs font-medium">Loading PDF document...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 text-center p-6 bg-white dark:bg-slate-900 rounded-xl border border-red-200 max-w-sm">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-sm font-semibold text-slate-800">Preview Unavailable</p>
            <p className="text-xs text-slate-500">{error}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setViewMode("text")}
            >
              Read Extracted Text
            </Button>
          </div>
        ) : viewMode === "text" ? (
          <div className="w-full h-full max-w-3xl bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 overflow-y-auto">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Extracted Document Text (Used for AI Context)
            </h4>
            <div className="text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
              {extractedText || "No extractable text detected in this document."}
            </div>
          </div>
        ) : pdfUrl ? (
          <div
            className="w-full h-full transition-transform origin-top duration-150 flex items-center justify-center"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full rounded-lg shadow-md border border-slate-300 bg-white"
              title={fileName}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
