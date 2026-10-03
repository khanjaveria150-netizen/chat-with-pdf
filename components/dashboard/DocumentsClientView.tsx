"use client";

import React, { useState, useContext } from "react";
import { Search, Plus, Files } from "lucide-react";
import { DocumentCard } from "./DocumentCard";
import { EmptyState } from "./EmptyState";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DocumentItem } from "@/types";
import { UploadContext } from "./DashboardShell";

interface DocumentsClientViewProps {
  initialDocuments: DocumentItem[];
}

export function DocumentsClientView({
  initialDocuments,
}: DocumentsClientViewProps) {
  const { openUploadModal } = useContext(UploadContext);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documents.filter((doc) =>
    doc.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            My PDFs
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your uploaded documents and initiate AI conversations
          </p>
        </div>
        <Button
          onClick={openUploadModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Upload PDF
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search documents by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Grid of Documents */}
      {filteredDocuments.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No matching documents found" : "No PDFs uploaded yet"}
          description={
            searchQuery
              ? `No document names match "${searchQuery}". Try a different keyword.`
              : "Upload a PDF document to start questioning and exploring its content."
          }
          actionText={searchQuery ? "Clear Search" : "Upload PDF"}
          onAction={searchQuery ? () => setSearchQuery("") : openUploadModal}
          icon={Files}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onDelete={handleDeleteDocument}
            />
          ))}
        </div>
      )}
    </div>
  );
}
