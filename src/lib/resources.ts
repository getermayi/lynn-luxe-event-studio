// Admin-editable collections. One config drives both the REST API
// (/api/admin/[resource]) and the dashboard forms.

export type FieldType =
  | "text"
  | "textarea"
  | "image"
  | "images"
  | "number"
  | "boolean"
  | "select"
  | "list"
  | "json"
  | "slug"
  | "icon";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  options?: string[];
  required?: boolean;
  /** shape for new items when type = json (array of objects) */
  itemShape?: Record<string, string>;
  half?: boolean;
};

export type Resource = {
  key: string;
  model: "service" | "subService" | "eventType" | "venue" | "galleryItem" | "testimonial" | "faq" | "lead" | "project" | "post";
  label: string;
  singular: string;
  description: string;
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  fields: Field[];
  parent?: { field: string; resource: string };
  orderable?: boolean;
  publicPath?: (row: Record<string, unknown>) => string | null;
};

export const ICONS = [
  "Building2", "Tent", "Flower2", "Armchair", "Music", "Speaker", "ConciergeBell", "UtensilsCrossed",
  "ClipboardCheck", "Sparkles", "Camera", "Gift", "Lightbulb", "PartyPopper", "Heart", "Crown", "Gem", "Cake",
];

const published: Field = { name: "published", label: "Published (visible on site)", type: "boolean", half: true };
const order: Field = { name: "order", label: "Sort order", type: "number", half: true, help: "Lower numbers show first." };

export const resources: Record<string, Resource> = {
  services: {
    key: "services",
    model: "service",
    label: "Services",
    singular: "Service",
    description: "Main service categories. Each one has its own page and its own sub-services.",
    titleField: "title",
    subtitleField: "tagline",
    imageField: "image",
    orderable: true,
    publicPath: (r) => `/services/${r.slug}`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "slug", label: "URL slug", type: "slug", half: true, help: "Used in the page address, e.g. /services/decor-and-styling" },
      { name: "kicker", label: "Kicker (small label above title)", type: "text", half: true },
      { name: "icon", label: "Icon", type: "icon", half: true },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "summary", label: "Short summary (cards)", type: "textarea" },
      { name: "description", label: "Full description (service page)", type: "textarea" },
      { name: "image", label: "Cover image", type: "image" },
      { name: "highlights", label: "Highlights", type: "list" },
      { name: "seoTitle", label: "SEO title (optional)", type: "text" },
      { name: "seoDescription", label: "SEO description (optional)", type: "textarea" },
      order,
      published,
    ],
  },
  subservices: {
    key: "subservices",
    model: "subService",
    label: "Sub-services",
    singular: "Sub-service",
    description: "Individual services inside a service category.",
    titleField: "title",
    subtitleField: "summary",
    imageField: "image",
    orderable: true,
    parent: { field: "serviceId", resource: "services" },
    fields: [
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "slug", label: "URL slug", type: "slug", half: true },
      { name: "summary", label: "Short summary", type: "textarea" },
      { name: "description", label: "Full description", type: "textarea" },
      { name: "image", label: "Image", type: "image" },
      { name: "features", label: "What's included", type: "list" },
      order,
      published,
    ],
  },
  events: {
    key: "events",
    model: "eventType",
    label: "Event types",
    singular: "Event type",
    description: "Weddings, birthdays, corporate… each gets its own landing page.",
    titleField: "title",
    subtitleField: "tagline",
    imageField: "image",
    orderable: true,
    publicPath: (r) => `/events/${r.slug}`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "slug", label: "URL slug", type: "slug", half: true },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "summary", label: "Short summary", type: "textarea" },
      { name: "description", label: "Full description", type: "textarea" },
      { name: "image", label: "Cover image", type: "image" },
      { name: "highlights", label: "Highlights", type: "list" },
      { name: "included", label: "Related services (service slugs)", type: "list", help: "e.g. decor-and-styling — these services are linked on the page." },
      order,
      published,
    ],
  },
  venues: {
    key: "venues",
    model: "venue",
    label: "Venues",
    singular: "Venue",
    description: "Your venue and structures like the German Hangar.",
    titleField: "title",
    subtitleField: "tagline",
    imageField: "image",
    orderable: true,
    publicPath: (r) => `/venues/${r.slug}`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "slug", label: "URL slug", type: "slug", half: true },
      { name: "kicker", label: "Kicker", type: "text", half: true },
      { name: "location", label: "Location", type: "text", half: true },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "summary", label: "Short summary", type: "textarea" },
      { name: "description", label: "Full description", type: "textarea" },
      { name: "image", label: "Cover image", type: "image" },
      { name: "video", label: "Background video URL (optional, .mp4)", type: "text" },
      { name: "gallery", label: "Gallery images", type: "images" },
      { name: "stats", label: "Key numbers", type: "json", itemShape: { value: "", label: "" } },
      { name: "features", label: "Features", type: "list" },
      { name: "steps", label: "Steps / how it works", type: "json", itemShape: { title: "", text: "" } },
      { name: "mapUrl", label: "Google Maps link", type: "text" },
      order,
      published,
    ],
  },
  gallery: {
    key: "gallery",
    model: "galleryItem",
    label: "Gallery",
    singular: "Photo",
    description: "Portfolio photos. Featured photos appear on the home page.",
    titleField: "title",
    subtitleField: "category",
    imageField: "image",
    orderable: true,
    fields: [
      { name: "image", label: "Photo", type: "image", required: true },
      { name: "title", label: "Caption", type: "text", half: true },
      { name: "category", label: "Category", type: "text", half: true, help: "e.g. Weddings, Décor, Dining, Venue" },
      { name: "featured", label: "Featured on home page", type: "boolean", half: true },
      order,
      published,
    ],
  },
  testimonials: {
    key: "testimonials",
    model: "testimonial",
    label: "Testimonials",
    singular: "Testimonial",
    description: "Client reviews. Only published ones show on the site.",
    titleField: "name",
    subtitleField: "event",
    imageField: "image",
    orderable: true,
    fields: [
      { name: "name", label: "Client name", type: "text", required: true, half: true },
      { name: "event", label: "Event (e.g. Wedding · Itanagar)", type: "text", half: true },
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "rating", label: "Rating (1–5)", type: "number", half: true },
      { name: "image", label: "Photo (optional)", type: "image" },
      order,
      published,
    ],
  },
  faqs: {
    key: "faqs",
    model: "faq",
    label: "FAQs",
    singular: "FAQ",
    description: "Questions shown on the home, FAQ and contact pages.",
    titleField: "question",
    subtitleField: "category",
    orderable: true,
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea", required: true },
      { name: "category", label: "Category", type: "text", half: true },
      order,
      published,
    ],
  },
  projects: {
    key: "projects",
    model: "project",
    label: "Portfolio",
    singular: "Project",
    description: "Case studies of past celebrations. Each gets its own story page under /portfolio.",
    titleField: "title",
    subtitleField: "occasion",
    imageField: "cover",
    orderable: true,
    publicPath: (r) => `/portfolio/${r.slug}`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "slug", label: "URL slug", type: "slug", half: true },
      { name: "occasion", label: "Occasion", type: "text", half: true, help: "e.g. Birthday Celebration, Wedding, Corporate Event" },
      { name: "location", label: "Location", type: "text", half: true },
      { name: "year", label: "Year", type: "text", half: true },
      { name: "guests", label: "Guests (optional)", type: "text", half: true },
      { name: "summary", label: "The story (short)", type: "textarea" },
      { name: "brief", label: "The brief", type: "textarea" },
      { name: "design", label: "The design", type: "textarea" },
      { name: "details", label: "The details", type: "textarea" },
      { name: "cover", label: "Cover photo", type: "image" },
      { name: "gallery", label: "Gallery photos", type: "images" },
      { name: "palette", label: "Colour palette (hex codes, e.g. #3b0d1c)", type: "list" },
      { name: "services", label: "Services used (service slugs)", type: "list" },
      { name: "quote", label: "Client quote (optional)", type: "textarea" },
      { name: "quoteBy", label: "Quote by", type: "text" },
      { name: "featured", label: "Featured on home page", type: "boolean", half: true },
      order,
      published,
    ],
  },
  posts: {
    key: "posts",
    model: "post",
    label: "Journal",
    singular: "Article",
    description: "Blog articles — great for Google. Body supports ## headings, - bullet lists and blank lines between paragraphs.",
    titleField: "title",
    subtitleField: "category",
    imageField: "cover",
    orderable: true,
    publicPath: (r) => `/journal/${r.slug}`,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "slug", half: true },
      { name: "category", label: "Category", type: "text", half: true },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "cover", label: "Cover image", type: "image" },
      { name: "body", label: "Article body", type: "textarea", help: "## for a heading, - for a bullet, empty line between paragraphs." },
      { name: "author", label: "Author", type: "text", half: true },
      { name: "publishedAt", label: "Publish date (YYYY-MM-DD)", type: "text", half: true },
      { name: "featured", label: "Featured", type: "boolean", half: true },
      order,
      published,
    ],
  },
  leads: {
    key: "leads",
    model: "lead",
    label: "Leads",
    singular: "Lead",
    description: "Enquiries from the website.",
    titleField: "name",
    subtitleField: "eventType",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "phone", label: "Phone", type: "text", required: true, half: true },
      { name: "email", label: "Email", type: "text", half: true },
      { name: "eventType", label: "Event type", type: "text", half: true },
      { name: "eventDate", label: "Event date", type: "text", half: true },
      { name: "guests", label: "Guests", type: "text", half: true },
      { name: "budget", label: "Budget", type: "text", half: true },
      { name: "services", label: "Services", type: "text", half: true },
      { name: "message", label: "Message", type: "textarea" },
      { name: "status", label: "Status", type: "select", options: ["new", "contacted", "qualified", "booked", "lost"], half: true },
      { name: "source", label: "Source", type: "text", half: true },
      { name: "notes", label: "Internal notes", type: "textarea" },
    ],
  },
};

export const LEAD_STATUSES = ["new", "contacted", "qualified", "booked", "lost"] as const;
