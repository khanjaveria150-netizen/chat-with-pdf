import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
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

    // Verify document belongs to user
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("id, file_path, file_name")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Create a 1-hour signed URL from private Supabase Storage
    const { data: signedData, error: signError } = await supabase.storage
      .from("documents")
      .createSignedUrl(document.file_path, 3600);

    if (signError || !signedData?.signedUrl) {
      return NextResponse.json(
        { error: signError?.message || "Failed to generate document view URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: signedData.signedUrl,
      fileName: document.file_name,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create signed URL" },
      { status: 500 }
    );
  }
}
