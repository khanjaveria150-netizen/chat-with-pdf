"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "./Sidebar";
import { PDFUploadModal } from "@/components/pdf/PDFUploadModal";

interface DashboardShellProps {
  userEmail: string;
  userName: string;
  avatarUrl?: string;
  children: React.ReactNode;
}

export const UploadContext = React.createContext<{
  openUploadModal: () => void;
}>({
  openUploadModal: () => {},
});

export function DashboardShell({
  userEmail,
  userName,
  avatarUrl,
  children,
}: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <UploadContext.Provider
      value={{ openUploadModal: () => setUploadModalOpen(true) }}
    >
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar */}
        <DashboardSidebar
          userEmail={userEmail}
          userName={userName}
          avatarUrl={avatarUrl}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <main className="flex-1">{children}</main>
        </div>

        {/* Global PDF Upload Modal */}
        <PDFUploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
        />
      </div>
    </UploadContext.Provider>
  );
}
