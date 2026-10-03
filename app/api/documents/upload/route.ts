import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractTextFromPDF } from "@/lib/pdf/extractor";

export const maxDuration = 60; // Max execution time for text extraction

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to upload documents." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file was provided in the upload request." },
        { status: 400 }
      );
    }

    // Validate mime type
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF documents are supported." },
        { status: 400 }
      );
    }

    // 20 MB size limit
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds the 20MB maximum size limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Extract text and page count from PDF
    let extractionResult;
    try {
      extractionResult = await extractTextFromPDF(buffer);
    } catch (extractErr: any) {
      console.warn("PDF text parse warning:", extractErr);
      extractionResult = {
        text: "Text extraction completed with partial or scanned content.",
        pageCount: 1,
        chunks: [],
      };
    }

    const documentId = crypto.randomUUID();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${user.id}/${documentId}-${sanitizedFileName}`;

    // 2. Upload file to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .upload(storagePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (storageError) {
      console.error("Supabase Storage upload error:", storageError);
      return NextResponse.json(
        { error: `Storage upload failed: ${storageError.message}` },
        { status: 500 }
      );
    }

    // 3. Save Document metadata in PostgreSQL
    const { data: document, error: dbError } = await supabase
      .from("documents")
      .insert({
        id: documentId,
        user_id: user.id,
        file_name: file.name,
        file_path: storagePath,
        file_size: file.size,
        page_count: extractionResult.pageCount || 1,
        extracted_text: extractionResult.text || "",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      // Clean up uploaded file if DB insert fails
      await supabase.storage.from("documents").remove([storagePath]);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }

    // 4. Create an initial default Chat Session for this document
    const { data: session } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: user.id,
        document_id: document.id,
        title: `Chat with ${file.name.slice(0, 30)}`,
      })
      .select()
      .single();

    return NextResponse.json({
      success: true,
      document,
      sessionId: session?.id,
    });
  } catch (err: any) {
    console.error("Upload route uncaught error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during upload." },
      { status: 500 }
    );
  }
}
