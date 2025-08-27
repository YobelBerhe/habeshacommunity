// /lib/url.ts
export function getParam(sp: URLSearchParams, key: string): string | undefined {
  const v = sp.get(key);
  return v && v !== "all" ? v : undefined;
}

export function setParams(sp: URLSearchParams, kv: Record<string, string | undefined>) {
  const n = new URLSearchParams(sp);
  for (const [k, v] of Object.entries(kv)) {
    if (v === undefined || v === "") n.delete(k);
    else n.set(k, v);
  }
  return n;
}