import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "./db";
import { resources, type Resource } from "./resources";
import { slugify } from "./utils";

export function getResource(key: string): Resource | null {
  return resources[key] ?? null;
}

// Prisma delegates share a shape; typing them generically keeps the API tiny.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const delegate = (r: Resource) => (db as any)[r.model];

/** Keep only configured fields and coerce each to its column type. */
export function clean(r: Resource, input: Record<string, unknown>, partial = false) {
  const out: Record<string, unknown> = {};
  for (const f of r.fields) {
    if (!(f.name in input)) continue;
    const v = input[f.name];
    switch (f.type) {
      case "number":
        out[f.name] = Number.isFinite(Number(v)) ? Math.round(Number(v)) : 0;
        break;
      case "boolean":
        out[f.name] = Boolean(v);
        break;
      case "list":
      case "images":
        out[f.name] = Array.isArray(v) ? v.map(String).map((s) => s.trim()).filter(Boolean) : [];
        break;
      case "json":
        out[f.name] = Array.isArray(v) ? v : [];
        break;
      case "slug":
        out[f.name] = slugify(String(v ?? ""));
        break;
      default:
        out[f.name] = v == null ? "" : String(v);
    }
  }
  if (r.fields.some((f) => f.type === "slug") && !partial) {
    if (!out.slug) out.slug = slugify(String(out[r.titleField] ?? "")) || `item-${Date.now()}`;
  }
  if (r.parent && typeof input[r.parent.field] === "string") out[r.parent.field] = input[r.parent.field];
  return out;
}

export function missingRequired(r: Resource, data: Record<string, unknown>) {
  return r.fields.filter((f) => f.required && !String(data[f.name] ?? "").trim()).map((f) => f.label);
}

export function refreshSite() {
  revalidatePath("/", "layout");
}

export function apiError(e: unknown) {
  const msg = e instanceof Error ? e.message : "Something went wrong";
  const friendly = msg.includes("Unique constraint") ? "That URL slug is already used — choose another." : msg;
  return NextResponse.json({ error: friendly }, { status: 400 });
}
