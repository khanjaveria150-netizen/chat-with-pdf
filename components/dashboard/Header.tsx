"use client";

import React from "react";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu: () => void;
  onOpenUpload?: () => void;
  actionButton?: React.ReactNode;
}

export function DashboardHeader({
  title,
  subtitle,
  onOpenMobileMenu,
  onOpenUpload,
  actionButton,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actionButton ? (
          actionButton
        ) : onOpenUpload ? (
          <Button
            size="sm"
            onClick={onOpenUpload}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Upload PDF
          </Button>
        ) : null}
      </div>
    </header>
  );
}
