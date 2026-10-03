"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function LandingFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does ChatWithPDF guarantee accuracy without hallucinations?",
      a: "Our retrieval pipeline strictly feeds extracted text chunks from your uploaded document directly into the AI prompt with explicit system constraints. If a requested fact is not present in your document, the model is strictly configured to inform you rather than invent answers.",
    },
    {
      q: "Are my documents secure and private?",
      a: "Yes. All uploaded files and chat sessions are stored in Supabase with PostgreSQL Row Level Security (RLS). Only your authenticated account can read, query, or delete your documents. Other users or external parties cannot access your files.",
    },
    {
      q: "What file formats and sizes are supported?",
      a: "ChatWithPDF supports all standard PDF documents up to 20MB in size, including research papers, books, manuals, financial statements, and contracts.",
    },
    {
      q: "Can I delete my documents and chat history?",
      a: "Absolutely. You retain full control over your data. Deleting a document instantly deletes its database record, chat history, and removes the underlying file from Supabase Storage.",
    },
    {
      q: "Can I bring my own AI API key?",
      a: "Yes. ChatWithPDF features a modular architecture that easily connects to your OpenAI or Google Gemini API keys via environment variables.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white border-t border-slate-200/60">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-2">
            Frequently Asked Questions
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Got Questions? We’ve Got Answers.
          </h3>
          <p className="mt-4 text-base text-slate-600">
            Learn more about how ChatWithPDF protects your data and processes documents.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 overflow-hidden transition-all bg-slate-50/50 hover:bg-slate-50"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 focus:outline-none"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ml-4",
                      isOpen && "rotate-180 text-brand-600"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
