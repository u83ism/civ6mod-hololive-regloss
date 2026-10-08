// Approved-false-positive list for check-text.ts. A finding is hidden only when a human-approved entry matches it exactly:
// same language, tag, message, and a fingerprint of the current ja_JP + target-language text.
// Editing either text changes the fingerprint, so the finding reappears and has to be re-approved (never silently stays hidden).
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { baseLanguage, type Finding, type TextIndex } from "./validate-text.js";

export type IgnoreEntry = {
  readonly language: string;
  readonly tag: string;
  readonly message: string;
  readonly fingerprint: string;
  readonly reason: string;
};

export type IgnoreResult = {
  readonly remaining: readonly Finding[];
  readonly ignoredCount: number;
  readonly staleEntries: readonly IgnoreEntry[];
};

export const computeFingerprint = (index: TextIndex, finding: Finding): string => {
  const byLanguage = index.get(finding.tag);
  const source = `${byLanguage?.get(baseLanguage) ?? ""}\u0000${byLanguage?.get(finding.language) ?? ""}`;
  return createHash("sha256").update(source).digest("hex").slice(0, 12);
};

const isIgnoreEntry = (value: unknown): value is IgnoreEntry => {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return ["language", "tag", "message", "fingerprint", "reason"].every((key) => typeof record[key] === "string");
};

export const readIgnoreList = (path: string): readonly IgnoreEntry[] => {
  if (!existsSync(path)) return [];
  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(parsed) || !parsed.every(isIgnoreEntry)) throw new Error(`${path}: expected an array of {language, tag, message, fingerprint, reason}`);
  const missingReason = parsed.find((entry) => entry.reason.trim() === "");
  if (missingReason !== undefined) throw new Error(`${path}: entry for ${missingReason.language} ${missingReason.tag} has an empty reason (approval needs a reason)`);
  return parsed;
};

const matches = (entry: IgnoreEntry, finding: Finding, index: TextIndex): boolean =>
  entry.language === finding.language &&
  entry.tag === finding.tag &&
  entry.message === finding.message &&
  entry.fingerprint === computeFingerprint(index, finding);

export const applyIgnoreList = (findings: readonly Finding[], entries: readonly IgnoreEntry[], index: TextIndex): IgnoreResult => ({
  remaining: findings.filter((finding) => !entries.some((entry) => matches(entry, finding, index))),
  ignoredCount: findings.filter((finding) => entries.some((entry) => matches(entry, finding, index))).length,
  staleEntries: entries.filter((entry) => !findings.some((finding) => matches(entry, finding, index))),
});

// Template to paste into the ignore list after the finding has been judged a false positive (reason must be filled in).
export const buildIgnoreSuggestions = (findings: readonly Finding[], index: TextIndex): readonly IgnoreEntry[] =>
  findings.map((finding) => ({
    language: finding.language,
    tag: finding.tag,
    message: finding.message,
    fingerprint: computeFingerprint(index, finding),
    reason: "",
  }));
