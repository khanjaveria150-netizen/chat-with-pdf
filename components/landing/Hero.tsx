import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap, FileText, Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-300/30 to-indigo-400/20 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3.5 py-1 text-xs font-medium text-brand-700 mb-6 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-brand-600" />
          <span>Next-Generation Document Intelligence</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-tight">
          Chat With Your PDFs <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Using AI
          </span>
        </h1>

        {/* Supporting text */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload research papers, financial reports, manuals, or legal contracts and get instant, 
          accurate, fact-checked answers grounded exclusively in your documents.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/sign-up">
            <Button
              size="lg"
              className="w-full sm:w-auto shadow-lg shadow-brand-500/25 text-base px-8 py-3"
              rightIcon={<ArrowRight className="w-5 h-5 ml-1" />}
            >
              Get Started Free
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-3 bg-white hover:bg-slate-50 border-slate-300 text-slate-700"
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Private & User-Isolated
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> Instant Processing
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-600" /> No Hallucinations
          </span>
        </div>

        {/* Product Preview Mockup */}
        <div className="mt-14 relative mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-slate-900/5 p-2 shadow-2xl backdrop-blur-sm lg:p-4">
          <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-inner">
            {/* App Header Bar Mockup */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-medium text-slate-500">
                  ChatWithPDF — Q3_Financial_Review.pdf
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">Page 1 of 18</div>
            </div>

            {/* Split Screen Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 min-h-[380px] text-left">
              {/* Left: PDF Document Preview */}
              <div className="p-6 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
                    <FileText className="w-4 h-4" /> Original Document
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    Executive Summary & Operating Metrics
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                    <p className="bg-white p-3 rounded-lg border border-slate-200/70 shadow-sm">
                      <strong>Section 3.1:</strong> In Q3 2026, operating revenue expanded by 34.2% year-over-year to $4.8M. Gross margins remained stable at 78.5%, driven by streamlined infrastructure and multi-tenant scaling efficiencies.
                    </p>
                    <p className="bg-white p-3 rounded-lg border border-slate-200/70 shadow-sm">
                      <strong>Section 3.2:</strong> Net customer retention reached 124% across enterprise cohorts, while operational expenditures declined by 6.4%.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span>Zoom: 100%</span>
                  <span>Fit Width</span>
                </div>
              </div>

              {/* Right: AI Chat Interface */}
              <div className="p-6 flex flex-col justify-between bg-white">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <Bot className="w-4 h-4 text-brand-600" /> AI Assistant
                  </div>

                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-brand-600 text-white text-xs px-3.5 py-2 rounded-2xl rounded-br-sm max-w-[85%] shadow-sm">
                      What was the revenue growth and gross margin in Q3?
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 text-xs font-bold">
                      AI
                    </div>
                    <div className="bg-slate-100 text-slate-800 text-xs p-3.5 rounded-2xl rounded-tl-sm max-w-[90%] leading-relaxed border border-slate-200/60">
                      Based on Section 3.1 of the document:
                      <ul className="list-disc ml-4 mt-1.5 space-y-1">
                        <li><strong>Revenue Growth:</strong> Increased by <strong>34.2% YoY</strong> to $4.8M.</li>
                        <li><strong>Gross Margin:</strong> Remained steady at <strong>78.5%</strong>.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Mock Input Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-400">
                    Ask anything about this PDF...
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
