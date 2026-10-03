import React from "react";
import { createClient } from "@/lib/supabase/server";
import { DashboardClientView } from "@/components/dashboard/DashboardClientView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch documents
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false });

  // Fetch total chat sessions count
  const { count: totalChats } = await supabase
    .from("chat_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id || "");

  // Fetch user profile for display name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id || "")
    .single();

  const userName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <DashboardClientView
      userName={userName}
      initialDocuments={documents || []}
      totalChats={totalChats || 0}
    />
  );
}
