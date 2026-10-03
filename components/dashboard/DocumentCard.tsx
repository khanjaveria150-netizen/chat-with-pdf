"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, MessageSquare, Trash2, Calendar, HardDrive, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatBytes, formatDate } from "@/lib/utils";
import { DocumentItem } from "@/types";

interface DocumentCardProps {
  document: DocumentItem;
  onDelete: (id: string) => Promise<void>;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(document.id);
      setShowConfirmModal(false);
    } catch (err) {
      console.error("Delete document error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="hover:border-brand-200 transition-all group flex flex-col justify-between p-5 bg-white">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete document"
              aria-label="Delete document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <h4
            className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1"
            title={document.file_name}
          >
            {document.file_name}
          </h4>

          {/* Meta specs */}
          <div className="mt-3 flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(document.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              {formatBytes(document.file_size)}
            </span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600">
              {document.page_count} {document.page_count === 1 ? "page" : "pages"}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <Link href={`/chat/${document.id}`} className="w-full">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-center group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-colors"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Chat With PDF
            </Button>
          </Link>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => !isDeleting && setShowConfirmModal(false)}
        title="Delete Document"
        description="Are you sure you want to delete this PDF? This will permanently remove the document, its extracted text, and all associated chat messages. This action cannot be undone."
      >
        <div className="mt-4 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setShowConfirmModal(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            isLoading={isDeleting}
            onClick={handleDelete}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
