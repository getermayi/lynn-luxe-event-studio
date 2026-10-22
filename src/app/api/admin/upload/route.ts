import { NextResponse, type NextRequest } from "next/server";
import { del, list, put } from "@vercel/blob";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

// On Vercel, files go to Vercel Blob (BLOB_READ_WRITE_TOKEN is set). Locally they go to ./uploads.
const useBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg", ".mp4", ".webm"]);
const MAX = 12 * 1024 * 1024;

/** Upload one or more files → returns their public URLs. */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: "No file received" }, { status: 400 });

  const urls: string[] = [];
  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED.has(ext)) return NextResponse.json({ error: `${file.name}: file type not allowed` }, { status: 400 });
    if (file.size > MAX) return NextResponse.json({ error: `${file.name}: larger than 12 MB` }, { status: 400 });
    const base = slugify(path.basename(file.name, ext)).slice(0, 50) || "file";
    const name = `${base}-${Date.now().toString(36)}${ext}`;
    if (useBlob()) {
      const blob = await put(`uploads/${name}`, file, { access: "public", contentType: file.type || undefined });
      urls.push(blob.url);
    } else {
      await mkdir(UPLOAD_DIR, { recursive: true });
      await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
      urls.push(`/media/${name}`);
    }
  }
  return NextResponse.json({ urls });
}

/** Media library: uploaded files + the built-in site images. */
export async function GET() {
  const local = async (dir: string, prefix: string) => {
    try {
      const names = await readdir(dir);
      const items = await Promise.all(
        names
          .filter((n) => ALLOWED.has(path.extname(n).toLowerCase()))
          .map(async (n) => ({ url: `${prefix}/${n}`, name: n, time: (await stat(path.join(dir, n))).mtimeMs })),
      );
      return items.sort((a, b) => b.time - a.time);
    } catch {
      return [];
    }
  };
  let uploads: { url: string; name: string; time: number }[] = [];
  if (useBlob()) {
    const { blobs } = await list({ prefix: "uploads/", limit: 1000 });
    uploads = blobs
      .map((b) => ({ url: b.url, name: path.basename(b.pathname), time: new Date(b.uploadedAt).getTime() }))
      .sort((a, b) => b.time - a.time);
  } else {
    uploads = await local(UPLOAD_DIR, "/media");
  }
  const builtIn = await local(path.join(process.cwd(), "public", "images"), "/images");
  return NextResponse.json([...uploads.map((u) => ({ ...u, uploaded: true })), ...builtIn]);
}

export async function DELETE(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url") ?? "";
  if (!url) return NextResponse.json({ error: "Missing file" }, { status: 400 });
  if (url.startsWith("http")) {
    if (useBlob()) await del(url).catch(() => null);
  } else {
    await unlink(path.join(UPLOAD_DIR, path.basename(url))).catch(() => null);
  }
  return NextResponse.json({ ok: true });
}
