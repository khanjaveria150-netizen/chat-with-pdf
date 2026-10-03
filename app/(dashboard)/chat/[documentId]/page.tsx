import React from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SplitChatRoom } from "@/components/chat/SplitChatRoom";

export const dynamic = "force-dynamic";

interface ChatPageProps {
  params: {
    documentId: string;
  };
}

export default async function ChatDocumentPage({ params }: ChatPageProps) {
  const { documentId } = params;
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // 1. Fetch document
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .single();

  if (docError || !document) {
    notFound();
  }

  // 2. Fetch or create chat session
  let { data: session } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("document_id", documentId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!session) {
    const { data: newSession } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: user.id,
        document_id: document.id,
        title: `Chat with ${document.file_name.slice(0, 30)}`,
      })
      .select()
      .single();

    session = newSession;
  }

  // 3. Fetch chat messages
  let initialMessages: any[] = [];
  if (session?.id) {
    const { data: messages } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", session.id)
      .order("created_at", { ascending: true });

    initialMessages = messages || [];
  }

  return (
    <SplitChatRoom
      document={document}
      sessionId={session?.id}
      initialMessages={initialMessages}
    />
  );
}
