import { parseIntentTextSafe, validateDocumentSemantic, type IntentDocument } from "@intenttext/core";

export interface SubmissionValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  document?: IntentDocument;
}

export function validateSubmission(
  source: string,
  meta: { name: string; category: string; description: string }
): SubmissionValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (source.length > 51200) {
    errors.push("Template too large. Maximum size is 50KB.");
  }

  const parseResult = parseIntentTextSafe(source, {
    unknownKeyword: "note",
    maxBlocks: 500,
  });

  if (parseResult.errors.length > 0) {
    errors.push(
      ...parseResult.errors.map((e) => `Line ${e.line}: ${e.message}`)
    );
  }

  if (parseResult.document.blocks.length < 3) {
    errors.push("Template must have at least 3 blocks.");
  }

  const hasTitle = parseResult.document.blocks.some(
    (b) => b.type === "title"
  );
  if (!hasTitle) {
    errors.push("Template must have a title: block.");
  }

  if (!["agent", "workflow", "document"].includes(meta.category)) {
    errors.push("Category must be agent, workflow, or document.");
  }

  const semanticResult = validateDocumentSemantic(parseResult.document);
  for (const issue of semanticResult.issues) {
    if (issue.type === "error") {
      errors.push(`${issue.code}: ${issue.message}`);
    } else if (issue.type === "warning") {
      warnings.push(`${issue.code}: ${issue.message}`);
    }
  }

  const suspiciousPatterns = [/https?:\/\//, /file:\/\//, /javascript:/i];
  for (const block of parseResult.document.blocks) {
    const tool = String(block.properties?.tool ?? "");
    if (suspiciousPatterns.some((p) => p.test(tool))) {
      errors.push(
        `Block "${block.content}" contains a suspicious tool: value.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    document: errors.length === 0 ? parseResult.document : undefined,
  };
}
