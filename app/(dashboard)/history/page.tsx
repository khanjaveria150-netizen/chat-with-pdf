import React from "react";
import { createClient } from "@/lib/supabase/server";
import { HistoryClientView } from "@/components/dashboard/HistoryClientView";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: sessions } = await supabase
    .from("chat_sessions")
    .select(`
      id,
      title,
      created_at,
      updated_at,
      document_id,
      documents (
        file_name
      )
    `)
    .eq("user_id", user?.id || "")
    .order("updated_at", { ascending: false });

  // Map to format
  const formattedSessions = (sessions || []).map((s: any) => ({
    id: s.id,
    title: s.title,
    created_at: s.created_at,
    updated_at: s.updated_at,
    document_id: s.document_id,
    documents: Array.isArray(s.documents) ? s.documents[0] : s.documents,
  }));

  return <HistoryClientView initialSessions={formattedSessions} />;
}
