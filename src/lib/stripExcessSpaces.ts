export function stripExcessSpaces(word: string) {
  return word.replace(/\s+/g, " ").trim();
}