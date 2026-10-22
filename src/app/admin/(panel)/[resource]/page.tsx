import { notFound } from "next/navigation";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { resources } from "@/lib/resources";

const ALLOWED = ["services", "events", "venues", "gallery", "testimonials", "faqs", "projects", "posts"];

export default async function ResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!ALLOWED.includes(resource) || !resources[resource]) notFound();
  return <ResourceManager resourceKey={resource} />;
}
