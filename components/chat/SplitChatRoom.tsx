"use client";

import React, { useState } from "react";
import { PDFViewer } from "@/components/pdf/PDFViewer";
import { ChatInterface } from "./ChatInterface";
import { FileText, MessageSquare } from "lucide-react";
import { ChatMessage, DocumentItem } from "@/types";

interface SplitChatRoomProps {
  document: DocumentItem;
  sessionId?: string;
  initialMessages?: ChatMessage[];
}

export function SplitChatRoom({
  document,
  sessionId,
  initialMessages = [],
}: SplitChatRoomProps) {
  const [activeTab, setActiveTab] = useState<"viewer" | "chat">("chat");

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex border-b border-slate-200 bg-white">
        <button
          onClick={() => setActiveTab("viewer")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "viewer"
              ? "border-brand-600 text-brand-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>View PDF</span>
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "chat"
              ? "border-brand-600 text-brand-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>AI Chat</span>
        </button>
      </div>

      {/* Split Screen Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: PDF Viewer */}
        <div
          className={`w-full md:w-1/2 h-full ${
            activeTab === "viewer" ? "block" : "hidden md:block"
          }`}
        >
          <PDFViewer
            documentId={document.id}
            fileName={document.file_name}
            extractedText={document.extracted_text}
            pageCount={document.page_count}
          />
        </div>

        {/* Right Side: AI Chat Interface */}
        <div
          className={`w-full md:w-1/2 h-full ${
            activeTab === "chat" ? "block" : "hidden md:block"
          }`}
        >
          <ChatInterface
            documentId={document.id}
            documentName={document.file_name}
            initialSessionId={sessionId}
            initialMessages={initialMessages}
          />
        </div>
      </div>
    </div>
  );
}
