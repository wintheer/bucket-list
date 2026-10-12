export function cleanGoodThings(raw: unknown) {
  if (!Array.isArray(raw)) return []
  return raw
    .map((t: any) => ({ text: String(t?.text ?? '').trim(), why: String(t?.why ?? '').trim() || undefined }))
    .filter(t => t.text)
    .slice(0, 3)
}
