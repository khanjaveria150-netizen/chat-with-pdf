import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePDFAnswer } from "@/lib/ai/provider";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId, sessionId, message } = await request.json();

    if (!documentId || !message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Document ID and a valid question message are required." },
        { status: 400 }
      );
    }

    // 1. Fetch document and ensure user ownership
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("id, file_name, extracted_text, page_count")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { error: "Document not found or access denied." },
        { status: 404 }
      );
    }

    // 2. Ensure or fetch chat session
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const { data: newSession } = await supabase
        .from("chat_sessions")
        .insert({
          user_id: user.id,
          document_id: document.id,
          title: message.trim().slice(0, 40),
        })
        .select()
        .single();

      currentSessionId = newSession?.id;
    }

    // 3. Save User message to chat_messages
    const { data: userMessageRecord, error: userMsgError } = await supabase
      .from("chat_messages")
      .insert({
        session_id: currentSessionId,
        user_id: user.id,
        role: "user",
        content: message.trim(),
      })
      .select()
      .single();

    if (userMsgError) {
      console.error("Failed to insert user message:", userMsgError);
    }

    // 4. Fetch recent chat history in this session for conversational continuity
    const { data: historyData } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("session_id", currentSessionId)
      .order("created_at", { ascending: true })
      .limit(8);

    const formattedHistory = (historyData || []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // 5. Generate grounded AI response based on PDF text
    const aiResult = await generatePDFAnswer({
      question: message.trim(),
      documentText: document.extracted_text || "",
      pageCount: document.page_count || 1,
      chatHistory: formattedHistory,
    });

    // 6. Save Assistant response to chat_messages
    const { data: assistantMessageRecord, error: asstMsgError } = await supabase
      .from("chat_messages")
      .insert({
        session_id: currentSessionId,
        user_id: user.id,
        role: "assistant",
        content: aiResult.answer,
      })
      .select()
      .single();

    if (asstMsgError) {
      console.error("Failed to insert assistant message:", asstMsgError);
    }

    // 7. Update session updated_at timestamp
    await supabase
      .from("chat_sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", currentSessionId);

    return NextResponse.json({
      success: true,
      sessionId: currentSessionId,
      message: assistantMessageRecord || {
        role: "assistant",
        content: aiResult.answer,
        created_at: new Date().toISOString(),
      },
      provider: aiResult.provider,
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process chat message." },
      { status: 500 }
    );
  }
}
