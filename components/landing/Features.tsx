import React from "react";
import { MessageSquare, Shield, Zap, Search, BookOpen, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export function LandingFeatures() {
  const features = [
    {
      icon: MessageSquare,
      title: "Natural Conversations",
      description:
        "Ask questions in plain English or any language. Receive coherent, structured answers complete with bullet points and summaries.",
    },
    {
      icon: Search,
      title: "Context-Aware Answers",
      description:
        "Our AI answers strictly using the content of your PDF. No invented facts or external hallucinations.",
    },
    {
      icon: Lock,
      title: "Private & User-Isolated",
      description:
        "Powered by Supabase Row Level Security (RLS). Your documents, chat sessions, and profile remain 100% private to you.",
    },
    {
      icon: Zap,
      title: "Fast Text Extraction",
      description:
        "High-performance PDF parsing extracts text, page counts, and metadata in seconds upon upload.",
    },
    {
      icon: BookOpen,
      title: "Split-Screen PDF Viewer",
      description:
        "Read your original PDF alongside your chat. Zoom, navigate pages, and cross-reference citations effortlessly.",
    },
    {
      icon: Shield,
      title: "Chat History & Management",
      description:
        "All conversations are automatically saved. Resume previous chats, export insights, or delete documents anytime.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50/50 border-t border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-2">
            Powerful Capabilities
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Everything You Need to Unlock Your Documents
          </h3>
          <p className="mt-4 text-base text-slate-600">
            Engineered for speed, strict factual accuracy, and effortless navigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                className="hover:border-brand-300 hover:shadow-md transition-all group bg-white"
              >
                <CardHeader>
                  <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed pt-1">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
