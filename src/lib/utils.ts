import clsx, { type ClassValue } from "clsx";

export const cn = (...v: ClassValue[]) => clsx(v);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** JSON columns come back as unknown — read them as string arrays safely. */
export const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];

export const objList = <T = Record<string, string>>(v: unknown): T[] =>
  Array.isArray(v) ? (v.filter((x) => x && typeof x === "object") as T[]) : [];

export const waLink = (number: string, text: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

/** Indian 10-digit numbers get the 91 country code for WhatsApp. */
export const waNumber = (phone: string) => {
  const d = phone.replace(/\D/g, "").replace(/^0+/, "");
  return d.length === 10 ? `91${d}` : d;
};

export const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Deep-merge saved settings over defaults so new default fields still appear. */
export function deepMerge<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) || typeof base !== "object" || base === null) return over as T;
  if (typeof over !== "object" || Array.isArray(over)) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(over as Record<string, unknown>)) {
    out[k] = k in out ? deepMerge(out[k], v) : v;
  }
  return out as T;
}
