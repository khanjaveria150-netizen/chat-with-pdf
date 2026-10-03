"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/utils";

interface PDFUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: (documentId: string) => void;
}

export function PDFUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: PDFUploadModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

  const validateFile = (file: File): boolean => {
    setErrorMessage(null);

    // Validate type
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Only PDF documents are supported. Please select a valid .pdf file.");
      return false;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(`The selected PDF is too large (${formatBytes(file.size)}). Maximum allowed size is 20MB.`);
      return false;
    }

    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(20);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      setUploadProgress(45);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(80);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload and process PDF");
      }

      setUploadProgress(100);
      setSuccess(true);

      setTimeout(() => {
        setIsUploading(false);
        setSuccess(false);
        setSelectedFile(null);
        onClose();
        if (onUploadSuccess) {
          onUploadSuccess(result.document.id);
        } else {
          router.push(`/chat/${result.document.id}`);
        }
      }, 1000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMessage(err.message || "Failed to upload and parse PDF. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleResetModal = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setErrorMessage(null);
      setSuccess(false);
      setUploadProgress(0);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetModal}
      title="Upload PDF Document"
      description="Upload your PDF file to extract its content and start an AI-powered conversation."
    >
      <div className="mt-4 space-y-4">
        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>PDF processed successfully! Opening conversation...</span>
          </div>
        )}

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
            dragActive
              ? "border-brand-500 bg-brand-50/50"
              : selectedFile
              ? "border-emerald-400 bg-emerald-50/30"
              : "border-slate-200 hover:border-brand-400 hover:bg-slate-50/60"
          } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />

          {selectedFile ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-900 max-w-xs truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {formatBytes(selectedFile.size)}
              </p>
              <p className="text-xs text-brand-600 font-medium mt-2">
                Click or drag another file to replace
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Drag and drop your PDF here, or{" "}
                <span className="text-brand-600">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF up to 20MB
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
                {uploadProgress < 50
                  ? "Uploading PDF..."
                  : uploadProgress < 90
                  ? "Extracting text & page structures..."
                  : "Finalizing..."}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            onClick={handleResetModal}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            isLoading={isUploading}
          >
            Upload & Process PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
}
