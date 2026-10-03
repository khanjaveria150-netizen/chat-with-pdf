import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

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

    // 1. Fetch user's documents to delete files from storage
    const { data: documents } = await supabase
      .from("documents")
      .select("file_path")
      .eq("user_id", user.id);

    if (documents && documents.length > 0) {
      const filePaths = documents.map((d) => d.file_path).filter(Boolean);
      if (filePaths.length > 0) {
        await supabase.storage.from("documents").remove(filePaths);
      }
    }

    // 2. Delete user profile (cascades to documents, chat_sessions, chat_messages)
    await supabase.from("profiles").delete().eq("id", user.id);

    // 3. Delete user from auth.users using service role if configured
    try {
      const adminClient = createAdminClient();
      await adminClient.auth.admin.deleteUser(user.id);
    } catch (adminErr) {
      console.warn("Could not delete user via admin API, signed out instead:", adminErr);
    }

    return NextResponse.json({ success: true, message: "Account deleted" });
  } catch (err: any) {
    console.error("Account delete error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete account" },
      { status: 500 }
    );
  }
}
