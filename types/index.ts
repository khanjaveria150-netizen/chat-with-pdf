import { Database } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type DocumentItem = Database["public"]["Tables"]["documents"]["Row"];
export type ChatSession = Database["public"]["Tables"]["chat_sessions"]["Row"];
export type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"];

export interface DocumentWithSession extends DocumentItem {
  chat_sessions?: ChatSession[];
}

export interface ChatSessionWithDocument extends ChatSession {
  documents?: {
    id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    page_count: number;
  };
  last_message?: string;
  message_count?: number;
}

export interface DashboardStats {
  totalPdfs: number;
  totalChats: number;
  storageUsedBytes: number;
}

export interface UserAuthSession {
  user: {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
  } | null;
}
