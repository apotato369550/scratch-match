import pdfParse from "pdf-parse/lib/pdf-parse.js";

const MIN_TEXT_CHARS = 100;

export class PdfTooSparseError extends Error {
  constructor(public chars: number) {
    super(
      `Extracted only ${chars} characters from PDF — looks like a scanned image. Paste the text manually instead.`
    );
    this.name = "PdfTooSparseError";
  }
}

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const result = (await pdfParse(buffer)) as { text: string };
  const text = (result.text ?? "").trim();
  if (text.length < MIN_TEXT_CHARS) {
    throw new PdfTooSparseError(text.length);
  }
  return text;
}
