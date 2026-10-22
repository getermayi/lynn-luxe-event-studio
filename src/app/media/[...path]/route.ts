import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".avif": "image/avif", ".gif": "image/gif", ".svg": "image/svg+xml", ".mp4": "video/mp4", ".webm": "video/webm",
};

// Serves files uploaded from the admin dashboard (kept outside /public so they
// work in production without a rebuild).
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const name = path.basename((await params).path.join("/"));
  try {
    const file = await readFile(path.join(process.cwd(), "uploads", name));
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
