import React from "react";
import Link from "next/link";
import { FileText } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-sm text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <FileText className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900 text-base">
              ChatWith<span className="text-brand-600">PDF</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </Link>
            <Link href="#faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </Link>
            <Link href="/sign-in" className="hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link href="/sign-up" className="hover:text-slate-900 transition-colors">
              Sign Up
            </Link>
          </div>

          <div className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} ChatWithPDF. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
