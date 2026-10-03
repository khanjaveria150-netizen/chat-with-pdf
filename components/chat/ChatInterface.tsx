"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Trash2,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ChatMessage } from "@/types";
import { formatDateTime } from "@/lib/utils";

interface ChatInterfaceProps {
  documentId: string;
  documentName: string;
  initialSessionId?: string;
  initialMessages?: ChatMessage[];
}

export function ChatInterface({
  documentId,
  documentName,
  initialSessionId,
  initialMessages = [],
}: ChatInterfaceProps) {
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSubmitting]);

  const suggestedPrompts = [
    "Summarize this document.",
    "What are the main points?",
    "Explain this topic in simple words.",
    "What does page 1 discuss?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isSubmitting) return;

    setInputValue("");
    setErrorMessage(null);

    // Optimistically append user message
    const tempUserMsg: ChatMessage = {
      id: crypto.randomUUID(),
      session_id: sessionId || "",
      user_id: "",
      role: "user",
      content: query,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          sessionId,
          message: query,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate answer");
      }

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      setMessages((prev) => [...prev, data.message]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setErrorMessage(
        err.message || "Failed to receive AI response. Please check your connection or try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = async () => {
    if (!sessionId) {
      setMessages([]);
      setShowClearModal(false);
      return;
    }

    try {
      const res = await fetch("/api/chat/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (res.ok) {
        setMessages([]);
        setShowClearModal(false);
      }
    } catch (err) {
      console.error("Failed to clear chat:", err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              Chat with <span className="text-brand-600">{documentName}</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Grounded strictly in PDF content
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowClearModal(true)}
          disabled={messages.length === 0}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 shadow-sm">
              <Bot className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Ask anything about this PDF
            </h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Our AI analyzes the document text and answers questions factually. Choose an example prompt below or type your own question.
            </p>

            {/* Suggested Prompts */}
            <div className="mt-6 w-full space-y-2">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 text-left">
                Suggested Questions
              </p>
              <div className="flex flex-col gap-2">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-left text-xs bg-slate-50 hover:bg-brand-50 hover:border-brand-300 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-700 hover:text-brand-700 transition-all font-medium flex items-center justify-between group shadow-xs"
                  >
                    <span>{prompt}</span>
                    <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-600 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={`relative group max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-brand-600 text-white rounded-br-xs shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-slate-700"
                    }`}
                  >
                    {/* Render message content with markdown formatting */}
                    <div className="whitespace-pre-wrap select-text">
                      {msg.content}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] opacity-70 gap-3">
                      <span>{formatDateTime(msg.created_at)}</span>
                      {!isUser && (
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-100 p-1 rounded"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* AI Generation Loading State */}
            {isSubmitting && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0 text-xs font-bold">
                  AI
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-xs p-4 border border-slate-200/60 dark:border-slate-700 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                  <span className="text-xs text-slate-500 font-medium">
                    Analyzing document & generating answer...
                  </span>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p>{errorMessage}</p>
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  className="font-semibold text-red-800 underline hover:text-red-900"
                >
                  Retry
                </button>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips row when chat has messages */}
      {messages.length > 0 && (
        <div className="px-4 py-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0">
          <span className="text-slate-400 font-medium whitespace-nowrap">Try:</span>
          {suggestedPrompts.slice(0, 3).map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              disabled={isSubmitting}
              className="bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-slate-200/60 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            placeholder="Ask anything about this PDF... (Press Enter to send)"
            className="w-full resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 pl-4 pr-24 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <Button
              type="submit"
              size="sm"
              disabled={!inputValue.trim() || isSubmitting}
              isLoading={isSubmitting}
              className="rounded-lg h-8 px-3"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </form>
      </div>

      {/* Clear Chat Confirmation Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear Conversation"
        description="Are you sure you want to clear all messages in this conversation? The PDF will remain in your documents."
      >
        <div className="mt-4 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setShowClearModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleClearChat}
          >
            Clear Messages
          </Button>
        </div>
      </Modal>
    </div>
  );
}
