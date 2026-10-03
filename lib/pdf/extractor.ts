import { extractText } from "unpdf";

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  info?: Record<string, any>;
  chunks: PDFChunk[];
}

export interface PDFChunk {
  id: number;
  text: string;
  approxPage?: number;
}

/**
 * Extracts text and page metadata from a PDF buffer using unpdf.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<PDFExtractionResult> {
  try {
    const uint8Array = new Uint8Array(buffer);
    const { totalPages, text } = await extractText(uint8Array, { mergePages: true });

    const rawText = typeof text === "string" ? text : "";
    
    // Clean and normalize text
    const cleanedText = rawText
      .replace(/\r\n/g, "\n")
      .replace(/\t/g, " ")
      .replace(/ +/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const pageCount = totalPages || 1;

    // Chunk text for AI semantic retrieval
    const chunks = createTextChunks(cleanedText, pageCount);

    return {
      text: cleanedText,
      pageCount,
      info: {},
      chunks,
    };
  } catch (error: any) {
    console.error("PDF Extraction error:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message || "Unknown error"}`);
  }
}

/**
 * Splits document text into overlapping context windows suitable for AI retrieval.
 */
export function createTextChunks(
  fullText: string,
  pageCount: number,
  chunkSize = 1200,
  overlap = 200
): PDFChunk[] {
  if (!fullText) return [];

  const chunks: PDFChunk[] = [];
  let startIndex = 0;
  let chunkIndex = 0;

  const totalLength = fullText.length;
  const charsPerPage = pageCount > 0 ? totalLength / pageCount : totalLength;

  while (startIndex < totalLength) {
    const endIndex = Math.min(startIndex + chunkSize, totalLength);
    let chunkText = fullText.substring(startIndex, endIndex);

    // Estimate page number for citation
    const approxPage = Math.min(
      Math.max(1, Math.ceil((startIndex + chunkSize / 2) / (charsPerPage || 1))),
      pageCount
    );

    chunks.push({
      id: chunkIndex++,
      text: chunkText.trim(),
      approxPage,
    });

    if (endIndex === totalLength) break;
    startIndex += chunkSize - overlap;
  }

  return chunks;
}
