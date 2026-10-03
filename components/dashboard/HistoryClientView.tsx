"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, FileText, Calendar, Trash2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "./EmptyState";
import { formatDate } from "@/lib/utils";

interface SessionItem {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  document_id: string;
  documents?: {
    file_name: string;
  } | null;
}

interface HistoryClientViewProps {
  initialSessions: SessionItem[];
}

export function HistoryClientView({ initialSessions }: HistoryClientViewProps) {
  const [sessions, setSessions] = useState<SessionItem[]>(initialSessions);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteSession = async () => {
    if (!selectedSessionId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/chat/sessions/${selectedSessionId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== selectedSessionId));
        setSelectedSessionId(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete chat session");
      }
    } catch (err) {
      console.error("Delete session error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Chat History
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review and continue previous conversations with your PDF documents
        </p>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          title="No chat history yet"
          description="When you start chatting with your uploaded PDFs, your conversations and insights will appear here."
          icon={MessageSquare}
        />
      ) : (
        <div className="space-y-3">
          {sessions.map((sess) => (
            <Card
              key={sess.id}
              className="p-5 hover:border-brand-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">
                    {sess.title || "Chat Session"}
                  </h4>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <FileText className="w-3.5 h-3.5 text-brand-600" />
                      {sess.documents?.file_name || "Unknown Document"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(sess.updated_at || sess.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Link href={`/chat/${sess.document_id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Open Chat
                  </Button>
                </Link>
                <button
                  onClick={() => setSelectedSessionId(sess.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete chat session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!selectedSessionId}
        onClose={() => !isDeleting && setSelectedSessionId(null)}
        title="Delete Chat Session"
        description="Are you sure you want to delete this conversation? All messages in this session will be permanently erased. The PDF file itself will not be deleted."
      >
        <div className="mt-4 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setSelectedSessionId(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            isLoading={isDeleting}
            onClick={handleDeleteSession}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete Session
          </Button>
        </div>
      </Modal>
    </div>
  );
}
