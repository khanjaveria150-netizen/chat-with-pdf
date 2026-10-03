import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatWithPDF - Chat With Your PDFs Using AI",
  description:
    "Upload PDF documents and have intelligent, AI-powered conversations with their content in seconds. Fast, secure, and accurate.",
  keywords: ["PDF chat", "AI PDF", "document intelligence", "summarize PDF", "ask PDF"],
  authors: [{ name: "ChatWithPDF Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full font-sans antialiased text-slate-900 bg-slate-50 flex flex-col">
        {children}
      </body>
    </html>
  );
}
