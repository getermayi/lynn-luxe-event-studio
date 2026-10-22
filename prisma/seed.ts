import { PrismaClient } from "@prisma/client";
import { defaultSettings } from "../src/lib/defaults";
import { cateringService, faqsV2, keepsakesService, planningService, posts, privateEvent, projects } from "./seed-extra";

const db = new PrismaClient();

const slug = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/é/g, "e").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type Sub = { title: string; summary: string; description: string; features: string[]; image: string };

const services: {
  slug: string; title: string; kicker: string; tagline: string; summary: string; description: string;
  image: string; icon: string; highlights: string[]; subs: Sub[];
}[] = [
  {
    slug: "venue-and-structures",
    title: "Venue & Structures",
    kicker: "Spaces that create stories",
    tagline: "It all starts with the right space.",
    summary: "From finding the perfect venue to building one from scratch — tents, marquees, German Hangars, stages and grand entrances.",
    description:
      "The space decides how your event feels before a single flower goes up. We source and manage venues, build indoor and outdoor setups, and raise all-weather structures like German Hangars — complete with stages and entrances designed to make an entrance.",
    image: "/images/venue-hall.jpg",
    icon: "Building2",
    highlights: ["Own open-air venue for 1000+ guests", "Pillarless, waterproof German Hangars", "Stages and entrances built to your theme"],
    subs: [
      { title: "Venue Sourcing & Management", image: "/images/ballroom.jpg", summary: "The right venue for your guest list, budget and vibe — booked, coordinated and managed.", description: "We shortlist venues that genuinely fit your date, guest count and style, handle the negotiations and paperwork, and stay the single point of contact with the venue team right through the event.", features: ["Shortlist matched to guest count & budget", "Site visits and negotiation", "Venue coordination on the day"] },
      { title: "Indoor & Outdoor Setup", image: "/images/venue-field.jpg", summary: "Ballrooms, lawns, rooftops or open fields — planned and set up for comfort and flow.", description: "Layouts that work: guest flow, seating, stage sightlines, power, lighting and weather backup — planned before we build, so the space feels effortless on the day.", features: ["Layout & guest-flow planning", "Power, lighting and weather backup", "Complete build and teardown"] },
      { title: "Tent / Marquee", image: "/images/banquet.jpg", summary: "Elegant tents and marquees that turn open ground into a beautiful, covered space.", description: "Clean-lined marquees and tents in sizes for intimate dinners to large receptions, finished with linings, draping and lighting so they feel like a hall, not a tent.", features: ["Sizes for any guest count", "Linings, draping & flooring", "Lighting and climate options"] },
      { title: "Pandal & German Hangar", image: "/images/hangar.jpg", summary: "Pillarless, waterproof, AC-ready German Hangars — and classic pandals done beautifully.", description: "German Hangars use an aluminium frame and waterproof PVC roof to create a huge, column-free hall that stays dry rain or shine. Prefer a traditional pandal? We build those with the same attention to finish.", features: ["Zero centre poles — clear views & photos", "Waterproof PVC roof, AC-ready", "Scales with your guest list"] },
      { title: "Stage Setup", image: "/images/stage-floral.jpg", summary: "Stages engineered for safety and designed to be the most photographed spot of the night.", description: "Raised stages, ramps, steps and backdrops built to the right height and size for ceremonies, performances and speeches — safe, sturdy and styled to the theme.", features: ["Custom sizes & heights", "Backdrop and lighting integration", "Safe, sturdy construction"] },
      { title: "Gate & Entrance Setup", image: "/images/venue-walkway.jpg", summary: "Grand entrances and walkways that set the tone from the very first step.", description: "Floral arches, themed gates, lit walkways and welcome zones that give your guests a wow moment the second they arrive.", features: ["Themed gates & arches", "Lit pathways and walkways", "Welcome & photo zones"] },
    ],
  },
  {
    slug: "decor-and-styling",
    title: "Décor & Styling",
    kicker: "Your vision, beautifully brought to life",
    tagline: "Make them remember how it felt.",
    summary: "Theme-based décor, stage backdrops, florals, table styling and lighting design — one cohesive look, start to finish.",
    description:
      "Décor is how your event feels. Our designers build one cohesive story — colours, florals, textures and light — and carry it from the welcome board to the last table so every photo looks intentional.",
    image: "/images/decor-florals.jpg",
    icon: "Flower2",
    highlights: ["Custom themes, never templates", "Fresh & premium floral styling", "Lighting that changes the whole mood"],
    subs: [
      { title: "Theme-Based Décor", image: "/images/hook-candlesticks.jpg", summary: "A complete theme — colour, texture and mood — designed around your story.", description: "Royal, minimal, floral, boho or something entirely yours. We build a mood board, finalise it with you, and execute it consistently across every corner of the venue.", features: ["Mood board & colour story", "Consistent styling across the venue", "Custom props and installations"] },
      { title: "Stage & Backdrop Design", image: "/images/stage-floral.jpg", summary: "Stunning stage backdrops that become the hero of every photo.", description: "Floral walls, panelled backdrops, LED and fabric designs — planned for the camera, lit beautifully and built to the exact size of your stage.", features: ["Floral, fabric & panel backdrops", "Designed for photos and video", "Integrated lighting"] },
      { title: "Welcome Boards", image: "/images/details-invitations.jpg", summary: "Custom welcome boards and signage that greet your guests in style.", description: "Welcome boards, seating charts, menus and directional signs designed in your theme and placed where guests actually need them.", features: ["Custom design in your theme", "Seating charts & menus", "Directional signage"] },
      { title: "Table Styling", image: "/images/gold-tablescape.jpg", summary: "Tablescapes with linen, cutlery, centrepieces and candles — styled to the last napkin fold.", description: "Linen, charger plates, glassware, napkin styling, centrepieces and candles combined into tables your guests won't stop photographing.", features: ["Linen, chargers & glassware", "Centrepieces & candles", "Head table styling"] },
      { title: "Floral Styling", image: "/images/centerpiece.jpg", summary: "Fresh and premium florals — centrepieces, arches, aisles and installations.", description: "From delicate centrepieces to statement arches and hanging installations, our florals are chosen for colour, season and longevity on the day.", features: ["Centrepieces & arches", "Aisle and stage florals", "Hanging installations"] },
      { title: "Lighting Design", image: "/images/hook-chandelier.jpg", summary: "Warm, layered lighting that transforms how a space looks and feels.", description: "Fairy lights, chandeliers, uplighting, pin spots and colour washes — designed in layers so the venue glows in person and on camera.", features: ["Chandeliers & fairy lights", "Uplighting & pin spots", "Mood-based colour washes"] },
      { title: "Creative Concept & Styling", image: "/images/intro-florals.jpg", summary: "Not sure what you want? We create the concept for you.", description: "Our team turns a few words, a Pinterest board or a feeling into a full creative concept — then styles every element to match.", features: ["Concept from scratch", "Reference & mood boards", "End-to-end styling"] },
    ],
  },
  {
    slug: "furniture-and-fixtures",
    title: "Furniture & Fixtures",
    kicker: "A seamless experience needs a seamless setup",
    tagline: "Beautiful is only half the job.",
    summary: "Tables, chairs, lounge seating, flooring, draping, truss structures and LED screens — the backbone of a great event.",
    description:
      "Comfort and logistics make or break a guest's night. We supply and set up everything your guests sit on, walk on and look at — matched to your theme and laid out for easy movement.",
    image: "/images/luxe-table.jpg",
    icon: "Armchair",
    highlights: ["Matched to your décor theme", "Laid out for comfort and flow", "Delivered, set up and cleared by us"],
    subs: [
      { title: "Tables", image: "/images/gold-dinner.jpg", summary: "Round, banquet and cocktail tables in sizes for every layout.", description: "Dining, banquet, cocktail and display tables, delivered and placed exactly to plan.", features: ["Round, long & cocktail tables", "Head & display tables", "Placed exactly to plan"] },
      { title: "Chairs", image: "/images/table-setting.jpg", summary: "Comfortable, elegant seating — from classic banquet to designer chairs.", description: "A range of chairs and covers to match your theme, counted and placed for every guest.", features: ["Banquet & designer chairs", "Covers and sashes", "Exact guest counts"] },
      { title: "Lounge Seating", image: "/images/head-table.jpg", summary: "Lounges and sofas that give guests a beautiful place to relax.", description: "Sofa sets, ottomans and lounge corners that add comfort and create natural conversation spots.", features: ["Sofas & ottomans", "Lounge corners & VIP areas", "Themed upholstery"] },
      { title: "Flooring", image: "/images/banquet.jpg", summary: "Carpets, platforms and dance floors — level, safe and stylish.", description: "Carpeting, raised platforms and dance floors that make outdoor ground feel like a finished hall.", features: ["Carpets & runners", "Raised platforms", "Dance floors"] },
      { title: "Draping", image: "/images/chandelier.jpg", summary: "Ceiling and wall draping that softens any space instantly.", description: "Fabric ceilings, wall drapes and swags that hide structure and add warmth and luxury.", features: ["Ceiling canopies", "Wall & pillar draping", "Colours to match your theme"] },
      { title: "Truss Structures", image: "/images/truss-lights.jpg", summary: "Strong truss rigs for lighting, screens, branding and stages.", description: "Aluminium truss systems engineered and rigged safely to carry lights, screens and branding.", features: ["Lighting & screen rigs", "Branding arches", "Safely engineered"] },
      { title: "LED Screens & Displays", image: "/images/concert-stage.jpg", summary: "Bright LED screens so every guest sees every moment.", description: "LED screens and displays for live feeds, photo slideshows, presentations and branding.", features: ["Live feeds & slideshows", "Presentations & branding", "Sizes for any venue"] },
    ],
  },
  {
    slug: "sound-light-and-entertainment",
    title: "Sound, Light & Entertainment",
    kicker: "Technical & entertainment",
    tagline: "Sound, lights and entertainment. All seamless.",
    summary: "Pro sound, stage lighting, DJs and live music, LED walls, projection, SFX, artist management and photo booths.",
    description:
      "The energy of your event lives in what guests hear and see. We design and run the full technical setup — sound, light, screens and special effects — and bring in the entertainment to fill the dance floor.",
    image: "/images/production-stage.jpg",
    icon: "Music",
    highlights: ["Pro audio & lighting crew on site", "DJs, bands and artists booked for you", "SFX moments planned to the second"],
    subs: [
      { title: "Sound", image: "/images/concert-stage.jpg", summary: "Crisp, balanced pro sound for vows, speeches and the dance floor.", description: "Professional speakers, mixers and wireless mics with an engineer on site so every word is heard and every song hits right.", features: ["Pro speakers & mixers", "Wireless mics for speeches", "On-site sound engineer"] },
      { title: "Lighting", image: "/images/truss-lights.jpg", summary: "Stage and event lighting that sets the mood and makes photos glow.", description: "Moving heads, pars, wash and spot lighting programmed to your event's flow — from soft dinner glow to full party mode.", features: ["Stage & wash lighting", "Programmed lighting cues", "Dinner-to-party transitions"] },
      { title: "DJ / Live Music", image: "/images/production-stage.jpg", summary: "DJs and live bands that read the room and keep it moving.", description: "We book DJs, bands and acoustic acts that fit your crowd and coordinate their timing, setup and playlists.", features: ["DJs & live bands", "Playlist & cue planning", "Setup and soundcheck"] },
      { title: "LED Walls", image: "/images/concert-stage.jpg", summary: "Big, bright LED walls for stages, visuals and live feeds.", description: "Modular LED walls for stage backdrops, content loops and live camera feeds, sized to your stage.", features: ["Stage backdrop walls", "Content & visuals", "Live camera feeds"] },
      { title: "Projection", image: "/images/ballroom.jpg", summary: "Projection for presentations, monograms and visual storytelling.", description: "Projectors and screens for slideshows, corporate presentations, gobos and monogram projections.", features: ["Projectors & screens", "Monogram gobos", "Slideshows & presentations"] },
      { title: "SFX", image: "/images/hook-candlesticks.jpg", summary: "Cold pyros, fog, confetti and bubbles for big entrance moments.", description: "Special effects timed to entries, first dances and cake cutting — handled safely by trained operators.", features: ["Cold pyros & confetti", "Low fog & bubbles", "Safely operated"] },
      { title: "Artist Management", image: "/images/production-stage.jpg", summary: "Performers, anchors and artists — booked, briefed and managed.", description: "Anchors, dancers, singers and performers sourced, contracted and managed through rehearsals and showtime.", features: ["Anchors & performers", "Contracts & riders", "Rehearsal & show flow"] },
      { title: "Photo Booth", image: "/images/champagne.jpg", summary: "Fun, branded photo booths guests love — and share.", description: "Themed backdrops, props and instant prints or digital sharing — a favourite for every age group.", features: ["Themed backdrops & props", "Instant prints or digital", "Branded frames"] },
    ],
  },
];

const events = [
  { slug: "weddings", title: "Weddings", image: "/images/stage-floral.jpg", tagline: "The day you've imagined — without the stress.", summary: "Engagements, haldi, mehendi, wedding and reception — planned and designed as one beautiful story.", description: "Your wedding should feel like you. We plan every function, design one cohesive look and run the days so you and your family can be fully present — from the first ritual to the last dance.", highlights: ["Every function planned as one story", "Stage, mandap & floral design", "Guest hospitality & coordination", "German Hangar for rain-proof outdoor weddings"], included: ["venue-and-structures", "decor-and-styling", "sound-light-and-entertainment", "catering-and-hospitality", "event-planning"] },
  { slug: "birthdays", title: "Birthdays", image: "/images/cake.jpg", tagline: "Milestones worth celebrating properly.", summary: "First birthdays to fiftieth — themed décor, entertainment and food everyone remembers.", description: "Whether it's a first birthday or a milestone fiftieth, we create a themed celebration with décor, cake tables, entertainment and food for every age group.", highlights: ["Themed décor & cake tables", "Entertainment for kids and adults", "Photo booths & return gifts"], included: ["decor-and-styling", "sound-light-and-entertainment", "event-planning"] },
  { slug: "anniversaries", title: "Anniversaries", image: "/images/candles.jpg", tagline: "Celebrate the years together.", summary: "Intimate dinners to grand parties — elegant, personal and full of meaning.", description: "From candle-lit dinners for two to grand silver and golden jubilee parties, we design anniversaries that honour your story.", highlights: ["Intimate or grand formats", "Personalised décor & keepsakes", "Music, dinner & toasts planned"], included: ["decor-and-styling", "catering-and-hospitality", "event-planning"] },
  { slug: "corporate-events", title: "Corporate Events", image: "/images/concert-stage.jpg", tagline: "Events that represent your brand.", summary: "Conferences, launches, award nights and annual parties — on brand, on time.", description: "Conferences, product launches, award nights and team celebrations executed with precision — staging, AV, branding, hospitality and run-of-show management.", highlights: ["Stage, AV & LED walls", "Branding & signage", "Run-of-show management"], included: ["venue-and-structures", "furniture-and-fixtures", "sound-light-and-entertainment", "catering-and-hospitality"] },
  privateEvent,
  { slug: "destination-events", title: "Destination Events", image: "/images/venue-wide.jpg", tagline: "Mountains, open skies, unforgettable views.", summary: "Celebrations set against Arunachal's landscapes — we bring the whole event to you.", description: "Open fields, hill views and natural backdrops — we build the full event wherever you dream of, with structures, power, hospitality and logistics handled.", highlights: ["Scenic open-air locations", "German Hangar for weather backup", "Travel & logistics coordination"], included: ["venue-and-structures", "decor-and-styling", "catering-and-hospitality", "event-planning"] },
];

const venues = [
  {
    slug: "open-air-venue-papu-nallah", title: "Open-Air Venue, Papu Nallah", kicker: "Our venue",
    location: "Papu Nallah, Naharlagun — behind Royal International School",
    tagline: "Open sky. Mountain views. Room for everyone.",
    summary: "A spacious open-air event ground with mountain views, a landscaped walkway and parking for 200+ cars — just 500 m from the highway.",
    description: "Set against the hills of Naharlagun, our open-air venue gives you a wide, flexible canvas for weddings, receptions, concerts and corporate events. Add a German Hangar for an all-weather hall, or celebrate under the open sky.",
    image: "/images/venue-aerial.jpg", video: "/video/venue-aerial.mp4",
    gallery: ["/images/venue-aerial.jpg", "/images/venue-wide.jpg", "/images/venue-field.jpg", "/images/venue-walkway.jpg", "/images/venue-aerial-2.jpg", "/images/venue-field-2.jpg"],
    stats: [{ value: "1000+", label: "Guests" }, { value: "200+", label: "Car parking" }, { value: "500 m", label: "From the highway" }],
    features: ["Wide open lawn for ceremonies, receptions & concerts", "Landscaped walkway for grand entries", "Room for a German Hangar — rain or shine", "Easy access, 500 m from the highway", "Parking for 200+ cars", "Mountain views as your backdrop"],
    steps: [],
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Papu+Nallah+Naharlagun+Arunachal+Pradesh",
  },
  {
    slug: "german-hangar", title: "German Hangar", kicker: "All-weather structure",
    location: "At our venue — or yours",
    tagline: "Pillarless. Waterproof. AC-ready. Grand.",
    summary: "A wedding hall in an open field — with zero pillars inside. Aluminium frame, waterproof PVC roof and space that grows with your guest list.",
    description: "Traditional pandals mean poles in every photo and leaks when it rains. A German Hangar is a clear-span aluminium structure with a waterproof PVC roof — no centre poles, full rain cover and ready for air-conditioning, so your celebration stays grand, rain or shine.",
    image: "/images/hangar.jpg", video: "",
    gallery: ["/images/hangar.jpg", "/images/banquet.jpg", "/images/truss-lights.jpg", "/images/stage-floral.jpg"],
    stats: [{ value: "0", label: "Centre poles" }, { value: "100%", label: "Rain cover" }, { value: "500+", label: "Guests" }],
    features: ["Zero centre poles — clear views, clean photos", "Waterproof PVC roof seals it completely", "AC-ready, all-weather build", "Aluminium frame, bolted and anchored", "Space that grows with your guest list"],
    steps: [
      { title: "Survey & level", text: "We survey your site and level the ground." },
      { title: "Frame goes up", text: "The aluminium frame is raised, bolted and anchored." },
      { title: "Roof seals it", text: "A waterproof PVC roof seals the structure completely." },
      { title: "Décor & lighting", text: "We design the décor and lighting for your event." },
      { title: "You celebrate", text: "Rain or shine, the celebration stays grand." },
    ],
    mapUrl: "",
  },
];

const gallery = [
  ["Golden candlelit reception", "Dining", "/images/hook-candlesticks.jpg", true],
  ["Floral stage backdrop", "Weddings", "/images/stage-floral.jpg", true],
  ["Chandelier glow", "Lighting", "/images/hook-chandelier.jpg", true],
  ["Fresh floral styling", "Décor", "/images/decor-florals.jpg", true],
  ["Long-table dinner", "Dining", "/images/recap-longtable.jpg", true],
  ["Open-air venue from above", "Venue", "/images/venue-aerial.jpg", true],
  ["Concert stage", "Production", "/images/concert-stage.jpg", false],
  ["White floral centrepiece", "Décor", "/images/centerpiece.jpg", false],
  ["Reception banquet", "Weddings", "/images/banquet.jpg", false],
  ["Stage lighting rig", "Production", "/images/truss-lights.jpg", false],
  ["Roses & candles", "Décor", "/images/cta-roses.jpg", false],
  ["Gold tablescape", "Dining", "/images/gold-tablescape.jpg", false],
  ["Celebration cake", "Birthdays", "/images/cake.jpg", false],
  ["Invitation suite", "Details", "/images/details-invitations.jpg", false],
  ["Landscaped walkway", "Venue", "/images/venue-walkway.jpg", false],
  ["Banquet hall", "Weddings", "/images/hospitality-banquet.jpg", false],
  ["Candle styling", "Décor", "/images/candles.jpg", false],
  ["Event stage", "Production", "/images/production-stage.jpg", false],
] as const;

const faqs = faqsV2;

async function main() {
  console.log("Seeding Lynn Luxe…");
  await db.subService.deleteMany();
  await db.service.deleteMany();
  await db.eventType.deleteMany();
  await db.venue.deleteMany();
  await db.galleryItem.deleteMany();
  await db.faq.deleteMany();
  await db.testimonial.deleteMany();

  for (const [key, value] of Object.entries(defaultSettings)) {
    await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  await db.project.deleteMany();
  await db.post.deleteMany();
  const allServices = [planningService, ...services, cateringService, keepsakesService];
  for (const [i, s] of allServices.entries()) {
    const { subs, ...data } = s;
    await db.service.create({
      data: {
        ...data,
        order: i,
        subServices: { create: subs.map((sub, j) => ({ ...sub, slug: slug(sub.title), order: j })) },
      },
    });
  }
  for (const [i, p] of projects.entries()) await db.project.create({ data: { ...p, order: i } });
  for (const [i, p] of posts.entries()) await db.post.create({ data: { ...p, order: i } });
  for (const [i, e] of events.entries()) await db.eventType.create({ data: { ...e, order: i } });
  for (const [i, v] of venues.entries()) await db.venue.create({ data: { ...v, order: i } });
  for (const [i, [title, category, image, featured]] of gallery.entries())
    await db.galleryItem.create({ data: { title, category, image, featured, order: i } });
  for (const [i, [question, answer, category]] of faqs.entries())
    await db.faq.create({ data: { question, answer, category, order: i } });

  // Placeholder reviews — unpublished until replaced with real client words in /admin.
  const samples = [
    ["Sample — replace with a real review", "Wedding · Itanagar", "Replace this with a real client review from the admin dashboard, then switch it to Published."],
    ["Sample — replace with a real review", "Birthday · Naharlagun", "Real words from real clients convert best. Add a name, the event and a short quote."],
    ["Sample — replace with a real review", "Corporate event", "Tip: ask happy clients for a 2–3 line quote on WhatsApp right after the event."],
  ];
  for (const [i, [name, event, quote]] of samples.entries())
    await db.testimonial.create({ data: { name, event, quote, order: i, published: false } });

  const count = await db.subService.count();
  console.log(`Done — ${allServices.length} services, ${count} sub-services, ${events.length} event types, ${venues.length} venues.`);
}

main().finally(() => db.$disconnect());
