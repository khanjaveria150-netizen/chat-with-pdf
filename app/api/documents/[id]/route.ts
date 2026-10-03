import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch document to get file path
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("id, file_path, user_id")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !document) {
      return NextResponse.json(
        { error: "Document not found or you do not have permission to delete it." },
        { status: 404 }
      );
    }

    // 2. Remove file from Supabase Storage
    if (document.file_path) {
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([document.file_path]);

      if (storageError) {
        console.warn("Storage removal warning:", storageError.message);
      }
    }

    // 3. Delete document record (foreign keys cascade to chat_sessions & chat_messages)
    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId)
      .eq("user_id", user.id);

    if (deleteError) {
      return NextResponse.json(
        { error: `Database error: ${deleteError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Document deleted successfully." });
  } catch (err: any) {
    console.error("Document delete error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete document." },
      { status: 500 }
    );
  }
}
