import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{6,18}$/, "Please enter a valid phone number"),
  email: z.string().trim().email("Please enter a valid email").max(120).or(z.literal("")).optional(),
  eventType: z.string().max(60).optional(),
  eventDate: z.string().max(40).optional(),
  guests: z.string().max(40).optional(),
  budget: z.string().max(40).optional(),
  services: z.string().max(400).optional(),
  message: z.string().max(2000).optional(),
  source: z.string().max(40).optional(),
  page: z.string().max(200).optional(),
  website: z.string().optional(), // honeypot — real people never fill this
});

const recent = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (hits.length >= 5) {
    return NextResponse.json({ error: "Too many requests — please call or WhatsApp us instead." }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid details" }, { status: 400 });
  }
  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // silently drop bots

  recent.set(ip, [...hits, now]);
  const lead = await db.lead.create({
    data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? ""])) as typeof data & { name: string; phone: string },
  });

  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) {
    fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    }).catch(() => null);
  }

  return NextResponse.json({ ok: true, id: lead.id });
}
