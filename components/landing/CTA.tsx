import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LandingCTA() {
  return (
    <section className="py-20 relative overflow-hidden bg-brand-900 text-white">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(129,140,248,0.25),rgba(255,255,255,0))]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-800/80 border border-brand-700/60 px-3.5 py-1 text-xs font-medium text-brand-200 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-brand-300" />
          <span>Ready to transform your reading experience?</span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          Start Chatting With Your PDFs Today
        </h2>

        <p className="mt-4 text-base sm:text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">
          Create your account in seconds. Upload your first document and get immediate, 
          grounded answers to any question.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-white text-brand-950 hover:bg-brand-50 hover:text-brand-900 shadow-xl font-semibold px-8"
              rightIcon={<ArrowRight className="w-5 h-5 ml-1 text-brand-600" />}
            >
              Create Free Account
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button
              variant="outline"
              size="lg"
              className="border-brand-700 text-white hover:bg-brand-800/50"
            >
              Sign In to Existing Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
