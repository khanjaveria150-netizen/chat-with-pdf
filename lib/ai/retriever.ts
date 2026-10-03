import { createTextChunks, PDFChunk } from "../pdf/extractor";

/**
 * Retrieves the most relevant chunks from document text for a given user query.
 */
export function retrieveContext(
  documentText: string,
  pageCount: number,
  query: string,
  maxChunks = 6
): { context: string; matchedChunks: PDFChunk[] } {
  if (!documentText) {
    return { context: "No document text available.", matchedChunks: [] };
  }

  // If the document is small (< 8,000 characters), pass the full text directly
  if (documentText.length <= 8000) {
    return {
      context: documentText,
      matchedChunks: [{ id: 0, text: documentText, approxPage: 1 }],
    };
  }

  const chunks = createTextChunks(documentText, pageCount, 1200, 250);
  const normalizedQuery = query.toLowerCase();
  const queryTokens = normalizedQuery
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);

  // Score each chunk based on term frequency and matching density
  const scoredChunks = chunks.map((chunk) => {
    let score = 0;
    const chunkLower = chunk.text.toLowerCase();

    // Exact phrase match bonus
    if (chunkLower.includes(normalizedQuery)) {
      score += 15;
    }

    // Token occurrences
    for (const token of queryTokens) {
      const regex = new RegExp(`\\b${token}\\b`, "g");
      const matches = chunkLower.match(regex);
      if (matches) {
        score += matches.length * 2;
      } else if (chunkLower.includes(token)) {
        score += 1;
      }
    }

    return { chunk, score };
  });

  // Sort chunks by highest score
  scoredChunks.sort((a, b) => b.score - a.score);

  // Take top chunks, or if scores are 0 (e.g. general questions like "summarize"), take beginning chunks
  let selected = scoredChunks.slice(0, maxChunks);
  if (selected[0]?.score === 0) {
    // For summarization or broad queries, select first few chunks and last chunk
    selected = [
      ...chunks.slice(0, Math.min(4, chunks.length)),
      ...chunks.slice(Math.max(0, chunks.length - 2)),
    ].map((chunk) => ({ chunk, score: 1 }));
  }

  // Sort selected chunks back into original document order
  const orderedChunks = selected
    .map((s) => s.chunk)
    .sort((a, b) => a.id - b.id);

  const context = orderedChunks
    .map((c) => `[Approx Page ${c.approxPage || "?"}]:\n${c.text}`)
    .join("\n\n---\n\n");

  return {
    context,
    matchedChunks: orderedChunks,
  };
}
