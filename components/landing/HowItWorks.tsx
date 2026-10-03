import React from "react";
import { UploadCloud, Cpu, MessageSquareText } from "lucide-react";

export function LandingHowItWorks() {
  const steps = [
    {
      step: "01",
      icon: UploadCloud,
      title: "Upload Your PDF",
      description:
        "Drag & drop any PDF document up to 20MB. Our system validates the file and stores it securely in your private workspace.",
    },
    {
      step: "02",
      icon: Cpu,
      title: "Automated Processing",
      description:
        "We extract text, identify page structures, and prepare semantic chunks optimized for high-speed AI retrieval.",
    },
    {
      step: "03",
      icon: MessageSquareText,
      title: "Ask & Understand",
      description:
        "Start chatting instantly. Ask for summaries, specific data points, translations, or comparative insights with full citations.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-2">
            Simple 3-Step Workflow
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            From Document to Insights in Seconds
          </h3>
          <p className="mt-4 text-base text-slate-600">
            No complicated setup or training required. Just upload and start asking questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-200/80 bg-slate-50/60 p-8 transition-all hover:bg-white hover:shadow-lg hover:border-brand-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 font-mono">
                    {item.step}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
