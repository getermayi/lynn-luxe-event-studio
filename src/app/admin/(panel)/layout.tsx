import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const newLeads = await db.lead.count({ where: { status: "new" } });
  return <AdminShell newLeads={newLeads}>{children}</AdminShell>;
}
