import { db } from "@/lib/db";

const COLS = ["createdAt", "name", "phone", "email", "eventType", "eventDate", "guests", "budget", "services", "message", "source", "page", "status", "notes"] as const;

const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function GET() {
  const leads = await db.lead.findMany({ orderBy: { createdAt: "desc" } });
  const csv = [
    COLS.join(","),
    ...leads.map((l) => COLS.map((c) => esc(c === "createdAt" ? l.createdAt.toISOString() : l[c])).join(",")),
  ].join("\n");
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lynn-luxe-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
