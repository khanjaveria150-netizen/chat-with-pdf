import OpenAI from "openai";
import { PDF_QA_SYSTEM_PROMPT, buildUserPrompt } from "./prompt";
import { retrieveContext } from "./retriever";

export interface GenerateAnswerParams {
  question: string;
  documentText: string;
  pageCount: number;
  chatHistory?: { role: "user" | "assistant"; content: string }[];
}

export interface AnswerResult {
  answer: string;
  provider: "openai" | "gemini" | "local-retrieval";
}

export async function generatePDFAnswer({
  question,
  documentText,
  pageCount,
  chatHistory = [],
}: GenerateAnswerParams): Promise<AnswerResult> {
  const { context } = retrieveContext(documentText, pageCount, question);

  const openaiKey = process.env.OPENAI_API_KEY;

  // 1. If OpenAI API key is configured, use OpenAI
  if (openaiKey && !openaiKey.includes("sk-proj-...")) {
    try {
      const openai = new OpenAI({ apiKey: openaiKey });
      const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

      // Build message payload
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: PDF_QA_SYSTEM_PROMPT },
      ];

      // Add recent history for conversational continuity (up to 4 messages)
      const recentHistory = chatHistory.slice(-4);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content,
        });
      }

      // Add user prompt containing context + question
      messages.push({
        role: "user",
        content: buildUserPrompt(question, context),
      });

      const response = await openai.chat.completions.create({
        model,
        messages,
        temperature: 0.2, // Low temperature for high factual accuracy
        max_tokens: 1000,
      });

      const answer = response.choices[0]?.message?.content?.trim();
      if (answer) {
        return { answer, provider: "openai" };
      }
    } catch (err: any) {
      console.error("OpenAI API call failed, falling back to local extractor:", err.message);
      // Fall through to fallback
    }
  }

  // 2. Built-in Local Semantic Context Engine (Active when API key is pending or network is offline)
  return {
    answer: generateLocalExtractedAnswer(question, documentText, context),
    provider: "local-retrieval",
  };
}

/**
 * Intelligent local grounded answer generator for when external API keys are pending.
 * Guarantees zero hallucinations and adheres to the rules:
 * - If information is found in the text, quotes and formats it accurately.
 * - If not found, explicitly states it was not found.
 */
function generateLocalExtractedAnswer(
  question: string,
  fullText: string,
  context: string
): string {
  if (!fullText || fullText.trim().length === 0) {
    return "I could not find information regarding this in the uploaded document because no readable text was detected. The PDF might consist of scanned images.";
  }

  const qLower = question.toLowerCase();

  // Summary request
  if (
    qLower.includes("summarize") ||
    qLower.includes("summary") ||
    qLower.includes("overview") ||
    qLower.includes("main points") ||
    qLower.includes("key points")
  ) {
    const paragraphs = fullText
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p.length > 60)
      .slice(0, 5);

    if (paragraphs.length > 0) {
      return `### Document Summary\n\nHere are the primary highlights identified in the uploaded document:\n\n${paragraphs
        .map((p, idx) => `* **Key Point ${idx + 1}**: ${p.slice(0, 280)}...`)
        .join("\n\n")}\n\n*(Note: Add your \`OPENAI_API_KEY\` to \`.env.local\` to enable deep generative synthesis).*`;
    }
  }

  // Question answering based on retrieved context
  const lines = context
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 30);

  const keywords = qLower
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((k) => k.length > 3);

  const relevantMatches: string[] = [];
  for (const line of lines) {
    const lineLower = line.toLowerCase();
    const matchCount = keywords.filter((k) => lineLower.includes(k)).length;
    if (matchCount > 0) {
      relevantMatches.push(line);
      if (relevantMatches.length >= 4) break;
    }
  }

  if (relevantMatches.length > 0) {
    return `Based on the uploaded document:\n\n${relevantMatches
      .map((m) => `> "${m}"`)
      .join("\n\n")}\n\n*Relevant excerpts found matching your query.*`;
  }

  return "I could not find information regarding this in the uploaded document. Please check the document or ask a different question.";
}
