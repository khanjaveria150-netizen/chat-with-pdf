import React from "react";
import { Check, X } from "lucide-react";

export function LandingBenefits() {
  const comparisons = [
    {
      feature: "Locating answers in 100+ page documents",
      traditional: "Hours of scrolling and guessing keywords",
      chatWithPdf: "Instant response in 2 seconds with exact references",
    },
    {
      feature: "Complex cross-section summarization",
      traditional: "Manual note-taking and syntheses across chapters",
      chatWithPdf: "One-click comprehensive executive summary",
    },
    {
      feature: "Data security & document privacy",
      traditional: "Uploaded to random public converters",
      chatWithPdf: "Dedicated Supabase RLS security per user",
    },
    {
      feature: "Complex technical or legal explanations",
      traditional: "Requires expert knowledge or dense dictionaries",
      chatWithPdf: "Explains technical clauses in plain language",
    },
    {
      feature: "Conversation history & search",
      traditional: "Lost when closing the tab or document reader",
      chatWithPdf: "Persisted securely in your account forever",
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-slate-50/50 border-t border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-2">
            Why ChatWithPDF?
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Save Hours Every Week on Reading & Analysis
          </h3>
          <p className="mt-4 text-base text-slate-600">
            See how conversational AI transforms document workflows compared to traditional methods.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">Capability</th>
                <th className="py-4 px-6 text-slate-400">Traditional Reading / CTRL+F</th>
                <th className="py-4 px-6 text-brand-600 bg-brand-50/40">ChatWithPDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {comparisons.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900">
                    {row.feature}
                  </td>
                  <td className="py-4 px-6 text-slate-500 flex items-center gap-2">
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{row.traditional}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-800 bg-brand-50/20 font-medium">
                    <span className="flex items-center gap-2 text-brand-900">
                      <Check className="w-4 h-4 text-brand-600 shrink-0 font-bold" />
                      {row.chatWithPdf}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
