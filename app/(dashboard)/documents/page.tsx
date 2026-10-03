import React from "react";
import { createClient } from "@/lib/supabase/server";
import { DocumentsClientView } from "@/components/dashboard/DocumentsClientView";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false });

  return <DocumentsClientView initialDocuments={documents || []} />;
}
