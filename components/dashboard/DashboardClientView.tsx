"use client";

import React, { useState, useContext } from "react";
import Link from "next/link";
import { Files, MessageSquare, HardDrive, Plus, ArrowRight, UploadCloud } from "lucide-react";
import { StatCard } from "./StatCard";
import { DocumentCard } from "./DocumentCard";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/utils";
import { DocumentItem } from "@/types";
import { UploadContext } from "./DashboardShell";

interface DashboardClientViewProps {
  userName: string;
  initialDocuments: DocumentItem[];
  totalChats: number;
}

export function DashboardClientView({
  userName,
  initialDocuments,
  totalChats,
}: DashboardClientViewProps) {
  const { openUploadModal } = useContext(UploadContext);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);

  const totalPdfs = documents.length;
  const storageUsedBytes = documents.reduce((acc, doc) => acc + (doc.file_size || 0), 0);

  const handleDeleteDocument = async (id: string) => {
    const res = await fetch(`/api/documents/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } else {
      const err = await res.json();
      alert(err.error || "Failed to delete document");
    }
  };

  const recentDocuments = documents.slice(0, 6);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-brand-500/15">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {userName}!
          </h2>
          <p className="mt-1.5 text-sm text-brand-100 max-w-xl">
            Upload your PDF documents and ask questions in natural language. Instant, fact-checked AI answers.
          </p>
        </div>
        <div className="shrink-0">
          <Button
            size="lg"
            onClick={openUploadModal}
            className="bg-white text-brand-900 hover:bg-brand-50 hover:text-brand-950 font-semibold shadow-md"
            leftIcon={<UploadCloud className="w-5 h-5 text-brand-600" />}
          >
            Upload PDF
          </Button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total PDFs"
          value={totalPdfs}
          subtitle="Uploaded documents"
          icon={Files}
          iconBgColor="bg-blue-50"
          iconTextColor="text-blue-600"
        />
        <StatCard
          title="Total Chats"
          value={totalChats}
          subtitle="Conversations held"
          icon={MessageSquare}
          iconBgColor="bg-purple-50"
          iconTextColor="text-purple-600"
        />
        <StatCard
          title="Storage Used"
          value={formatBytes(storageUsedBytes)}
          subtitle="Out of 100 MB free quota"
          icon={HardDrive}
          iconBgColor="bg-emerald-50"
          iconTextColor="text-emerald-600"
        />
      </div>

      {/* Recent PDFs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Recent PDFs
            </h3>
            <p className="text-xs text-slate-500">
              Access and chat with your uploaded documents
            </p>
          </div>
          {documents.length > 0 && (
            <Link
              href="/documents"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-500"
            >
              <span>View all ({documents.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recentDocuments.length === 0 ? (
          <EmptyState
            title="No PDFs uploaded yet"
            description="Upload your first PDF document to start chatting with its content using AI."
            actionText="Upload Your First PDF"
            onAction={openUploadModal}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDelete={handleDeleteDocument}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
