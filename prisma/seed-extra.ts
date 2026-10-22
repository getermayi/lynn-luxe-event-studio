// Content added in v2: services from the live site, portfolio case studies and journal articles.

type Sub = { title: string; summary: string; description: string; features: string[]; image: string };

export const planningService = {
  slug: "event-planning",
  title: "Event Planning",
  kicker: "From first concept to final farewell",
  tagline: "Every moving part, handled.",
  summary: "We take care of the planning, coordination and details behind your event so you can focus on enjoying the occasion.",
  description:
    "Great events are part design, part logistics and part hospitality. Our planners take on the concept, the vendors, the timeline and the hundred small decisions behind every occasion — and run the day itself — so you get one plan, one point of contact and none of the stress.",
  image: "/images/recap-longtable.jpg",
  icon: "ClipboardCheck",
  highlights: ["One dedicated planner from the first call", "Clear proposal, budget and timeline", "Our team on site, running the day"],
  subs: [
    { title: "Event Concept & Planning", image: "/images/intro-florals.jpg", summary: "A clear concept, budget and plan for your occasion — before anything is booked.", description: "We start with a relaxed conversation about your guests, budget and the feeling you want, then shape a concept with mood, palette, décor and flow — shared as a clear proposal for you to refine.", features: ["Concept, mood & palette", "Budget planning", "Written proposal to refine"] },
    { title: "Vendor Coordination", image: "/images/gold-dinner.jpg", summary: "Every vendor booked, briefed and managed — nothing lost between teams.", description: "Décor, catering, sound, photography and more are booked and briefed by us against one plan, so everyone arrives knowing exactly what to do.", features: ["Vendor shortlisting & booking", "Briefs against one plan", "Single point of contact"] },
    { title: "Timeline Management", image: "/images/details-invitations.jpg", summary: "A planning timeline and a minute-by-minute run of show.", description: "From the first booking to the last guest leaving, we build and manage the timeline — with regular updates so you always know what's next.", features: ["Planning milestones", "Run-of-show schedule", "Regular progress updates"] },
    { title: "Guest Experience", image: "/images/hospitality-banquet.jpg", summary: "Every guest welcomed, seated and looked after.", description: "Arrivals, seating, flow between moments, dietary needs and VIP care — designed so guests feel considered from the first invitation to the last goodbye.", features: ["Arrival & welcome flow", "Seating & VIP care", "Dietary & accessibility needs"] },
    { title: "On-Site Coordination", image: "/images/venue-walkway.jpg", summary: "Our team sets up, runs the schedule and handles the unexpected.", description: "On the day our coordinators manage setup, vendors, timings and every surprise — you simply arrive and enjoy.", features: ["Setup supervision", "Run-of-show management", "Problem-solving on the spot"] },
    { title: "Permits & Compliance", image: "/images/table-setting.jpg", summary: "Permissions and paperwork, handled the right way.", description: "We help arrange the permissions an event needs — sound, venue and local approvals — so the day runs without interruptions.", features: ["Local permissions", "Sound & venue approvals", "Paperwork handled"] },
  ] as Sub[],
};

export const cateringService = {
  slug: "catering-and-hospitality",
  title: "Catering & Hospitality",
  kicker: "Thoughtful hospitality, beautiful presentation",
  tagline: "Your guests should feel taken care of.",
  summary: "Food is part of the experience. Menus, presentation, service and guest care — designed as carefully as the décor.",
  description:
    "Our catering focuses on presentation, hospitality and a memorable dining experience. We plan the menu with you, present it beautifully and serve it with trained staff — and look after transport, logistics and guest coordination around it.",
  image: "/images/hospitality-banquet.jpg",
  icon: "UtensilsCrossed",
  highlights: ["Multi-cuisine menus for every guest", "Presentation that matches your décor", "Trained service staff and managers"],
  subs: [
    { title: "Event Catering", image: "/images/hospitality-banquet.jpg", summary: "Multi-cuisine catering — local, Indian, continental and more.", description: "Buffets, plated dinners and live counters with options for every dietary need on your guest list.", features: ["Buffet, plated or live counters", "Local, Indian & continental", "Dietary options"] },
    { title: "Menu Planning", image: "/images/gold-tablescape.jpg", summary: "A menu designed around your guests, season and budget.", description: "We plan the menu with you — courses, counters and quantities — and arrange tastings for larger events.", features: ["Menu design & quantities", "Tastings for larger events", "Budget-aware choices"] },
    { title: "Food Presentation", image: "/images/champagne.jpg", summary: "Counters, platters and styling that look as good as they taste.", description: "Buffet styling, signage, serveware and counter design matched to the event's look.", features: ["Styled counters & signage", "Serveware to match décor", "Dessert & cake tables"] },
    { title: "Guest Service & Staffing", image: "/images/gold-dinner.jpg", summary: "Trained hosts, servers and managers who keep everything running.", description: "Uniformed service staff, hosts and event managers briefed on your timeline and guests.", features: ["Hosts & service staff", "Event managers", "Briefed on your timeline"] },
    { title: "Guest Coordination", image: "/images/recap-longtable.jpg", summary: "RSVPs, seating and VIP care — your guests, looked after.", description: "Guest lists, RSVPs, seating plans, welcome desks and VIP care so every guest feels expected.", features: ["RSVP & guest lists", "Seating plans", "Welcome desk & VIP care"] },
    { title: "Transportation & Logistics", image: "/images/venue-aerial.jpg", summary: "Guest transport, vendor logistics and timing — all coordinated.", description: "Guest pick-ups, parking management, vendor deliveries and timings coordinated on one schedule.", features: ["Guest pick-up & drop", "Parking management", "Vendor logistics"] },
  ] as Sub[],
};

export const keepsakesService = {
  slug: "invitations-media-and-gifts",
  title: "Invitations, Media & Gifts",
  kicker: "The details guests take home",
  tagline: "And every little detail, handled.",
  summary: "Invitations, photography & videography and return gifts — the pieces that start and end the story.",
  description:
    "The first thing guests see is your invitation; the last is a return gift; the thing you keep forever is the film. We design, arrange and coordinate all three in the same look as your event.",
  image: "/images/details-invitations.jpg",
  icon: "Gift",
  highlights: ["Invites designed in your event's look", "Photo & film teams who know the plan", "Curated gifts for every budget"],
  subs: [
    { title: "Invitation Design", image: "/images/details-invitations.jpg", summary: "Printed and digital invitations that set the tone for your event.", description: "Custom-designed printed invites, e-invites and video invitations in your theme.", features: ["Printed & digital invites", "Video invitations", "Matching stationery"] },
    { title: "Photography & Videography", image: "/images/champagne.jpg", summary: "Photo and film teams that capture every moment — candid and cinematic.", description: "Photographers, videographers and drone operators briefed on your timeline, so no key moment is missed.", features: ["Candid & traditional photography", "Cinematic films & reels", "Drone coverage"] },
    { title: "Return Gifts & Hampers", image: "/images/cake.jpg", summary: "Thoughtful return gifts and hampers your guests will remember.", description: "Curated, beautifully packed return gifts and hampers for every budget.", features: ["Curated gift ideas", "Custom packaging", "Every budget"] },
  ] as Sub[],
};

export const privateEvent = {
  slug: "private-events",
  title: "Private Events",
  image: "/images/centerpiece.jpg",
  tagline: "Intimate, considered, beautifully hosted.",
  summary: "Private soirées, baby showers, family functions and dinners — small in size, big on detail.",
  description: "Private celebrations deserve the same care as a wedding. We design intimate dinners, baby showers, family functions and soirées with refined styling, thoughtful food and hosting that lets you be with your guests.",
  highlights: ["Refined styling at any scale", "Curated menus & service", "Baby showers, soirées & family functions"],
  included: ["event-planning", "decor-and-styling", "catering-and-hospitality"],
};

export const projects = [
  {
    slug: "velvet-grandeur",
    title: "Velvet Grandeur",
    occasion: "Birthday Celebration",
    location: "Jollang, Arunachal Pradesh",
    year: "2026",
    guests: "",
    summary: "An atmospheric celebration designed around rich textures, elegant lighting and a bold visual identity.",
    brief: "A milestone birthday that needed to feel grown-up and dramatic — an evening guests would walk into and immediately feel was different.",
    design: "Deep velvet tones, candlelight and gold accents set the mood. Layered lighting did the heavy lifting, turning the space warm and intimate while keeping the stage and cake table as the focal points.",
    details: "Tall candlesticks, textured linens and a styled cake table carried the identity from entrance to dessert, with every surface considered for photos.",
    palette: ["#3b0d1c", "#6e1f33", "#c9a15a", "#f3e6cf", "#1b1410"],
    cover: "/images/hook-candlesticks.jpg",
    gallery: ["/images/hook-candlesticks.jpg", "/images/candles.jpg", "/images/cake.jpg", "/images/hook-chandelier.jpg", "/images/champagne.jpg"],
    services: ["event-planning", "decor-and-styling", "catering-and-hospitality"],
    featured: true,
  },
  {
    slug: "elegant-celebration",
    title: "Elegant Celebration",
    occasion: "Private Event",
    location: "Arunachal Pradesh",
    year: "2026",
    guests: "",
    summary: "A refined private celebration with carefully considered styling and intimate details.",
    brief: "An intimate gathering for family and close friends — elegant, calm and personal rather than loud.",
    design: "White florals, soft greenery and clean tablescapes kept the look light and timeless, with warm lighting for the evening.",
    details: "Personal touches at each place setting, a considered menu and quiet, attentive service made it feel like a dinner at home — only effortless.",
    palette: ["#fbf8f2", "#e8e1d3", "#9fae8f", "#c9a15a", "#2f3a2c"],
    cover: "/images/centerpiece.jpg",
    gallery: ["/images/centerpiece.jpg", "/images/luxe-table.jpg", "/images/cta-roses.jpg", "/images/decor-florals.jpg"],
    services: ["decor-and-styling", "catering-and-hospitality"],
    featured: true,
  },
  {
    slug: "golden-evening",
    title: "Golden Evening",
    occasion: "Corporate Event",
    location: "Arunachal Pradesh",
    year: "2026",
    guests: "",
    summary: "A sophisticated corporate gathering combining elegant styling with a warm and welcoming atmosphere.",
    brief: "A company evening that needed to feel premium and on-brand while staying warm and relaxed for guests.",
    design: "Gold-toned tablescapes, chandeliers and a polished stage gave the evening a celebratory feel, with branding integrated discreetly.",
    details: "A clear run of show, smooth guest flow and attentive service kept the evening on time without ever feeling rushed.",
    palette: ["#1d1a14", "#7d5e2d", "#d6b06a", "#f4e8c9", "#ffffff"],
    cover: "/images/gold-dinner.jpg",
    gallery: ["/images/gold-dinner.jpg", "/images/gold-tablescape.jpg", "/images/chandelier.jpg", "/images/concert-stage.jpg"],
    services: ["event-planning", "sound-light-and-entertainment", "catering-and-hospitality"],
    featured: true,
  },
];

export const posts = [
  {
    slug: "german-hangar-vs-pandal",
    title: "German Hangar or pandal? Choosing a structure for an outdoor celebration",
    category: "Venues",
    cover: "/images/hangar.jpg",
    publishedAt: "2026-10-12",
    featured: true,
    excerpt: "Outdoor celebrations in Arunachal need a plan for rain. Here's how a German Hangar compares with a traditional pandal — and when each makes sense.",
    body: `An open field with mountain views is one of the most beautiful places to celebrate. It's also one of the hardest to plan for — because the weather doesn't read your invitation.

## The traditional pandal
Pandals are familiar and flexible. They work well for smaller gatherings and dry seasons, and they can be decorated beautifully.

- Bamboo or metal poles run through the space, which can block views and appear in photos
- Fabric roofs can struggle in heavy rain
- Great for budget-conscious, fair-weather events

## The German Hangar
A German Hangar is a clear-span aluminium frame with a waterproof PVC roof.

- Zero centre poles — clean sightlines and photos
- Waterproof roof that seals the structure completely
- AC-ready, all-weather build
- Sizes that grow with your guest list

## How to choose
If your date falls in a rainy month, your guest list is large, or the stage and photos matter most, a German Hangar removes the biggest risk from the day. For a small, dry-season gathering, a well-styled pandal can be perfect.

Either way, the structure is only the start — lighting, flooring and décor are what make it feel like a hall rather than a tent. Talk to us about your date and we'll recommend the right option.`,
  },
  {
    slug: "wedding-planning-timeline",
    title: "A calm wedding planning timeline (that actually works)",
    category: "Weddings",
    cover: "/images/stage-floral.jpg",
    publishedAt: "2026-10-05",
    featured: false,
    excerpt: "From the first idea to the final toast — a simple timeline to keep your wedding planning calm, clear and on budget.",
    body: `The secret to a calm wedding isn't a bigger budget — it's knowing what needs deciding, and when.

## As early as you can
- Fix your date range, guest count and overall budget
- Decide whether you want full planning, design & styling or day-of coordination
- Shortlist venues — or plan for a structure like a German Hangar outdoors

## A few months out
- Lock the venue and key vendors: décor, catering, photography
- Agree the concept: mood, palette, stage and florals
- Send save-the-dates or invitations

## The final weeks
- Confirm guest numbers and seating
- Finalise the menu and run of show
- Walk through the venue with your planner

## The day
Hand the timeline to your coordinator and step away from your phone. Your only job is to enjoy it.`,
  },
  {
    slug: "milestone-birthday-ideas",
    title: "Making a milestone birthday feel like an occasion",
    category: "Birthdays",
    cover: "/images/cake.jpg",
    publishedAt: "2026-09-28",
    featured: false,
    excerpt: "Theme, lighting and one memorable moment — the three ingredients that turn a birthday party into a celebration.",
    body: `A milestone birthday deserves more than balloons. The best ones we've designed share three things.

## A clear theme
Pick a mood rather than a cartoon: velvet and candlelight, garden whites, golden evening. A clear theme makes every other decision easier.

## Lighting does the heavy lifting
Warm, layered lighting changes a room more than any prop. Candles, fairy lights and a lit cake table instantly make the space feel special.

## One memorable moment
Plan a single highlight — a grand entrance, a surprise performance, a toast — and build the evening around it.

- Keep the guest list and venue size in proportion
- Style the cake table as a focal point
- Think about return gifts that match the theme

Want help putting it together? Share your date and we'll suggest a concept.`,
  },
];

export const faqsV2 = [
  ["How far in advance should we book?", "As early as you can. For weddings and large events, a few months' notice gives us the most room to secure venues and vendors. Smaller celebrations can often come together in a few weeks, so it's always worth asking.", "Booking"],
  ["Do you only offer full planning?", "No. You can hand us the entire occasion or just the parts you need, such as décor and styling, catering or day-of coordination. We'll recommend the right level of support after our first conversation.", "Services"],
  ["Which areas do you cover?", "We're based in Jollang and plan events across Arunachal Pradesh. If your celebration is further afield, get in touch and we'll talk through the logistics.", "General"],
  ["Can you work within our budget?", "Yes. Tell us your budget at the start and we'll design around it, putting the money where it makes the biggest difference to how the event looks and feels.", "Pricing"],
  ["What happens after I send an inquiry?", "We'll reply on WhatsApp, usually within a day, to set up a short call. After that we'll send you a tailored concept and proposal. You're under no obligation until you're happy with the plan.", "Booking"],
  ["Do you have your own venue?", "Yes — our open-air venue at Papu Nallah, Naharlagun (behind Royal International School) hosts 1000+ guests, has parking for 200+ cars and is just 500 m from the highway.", "Venue"],
  ["What is a German Hangar and why choose it?", "It's a clear-span aluminium structure with a waterproof PVC roof. Unlike a pandal there are no centre poles, it's fully rain-proof and AC-ready — perfect for big outdoor events in any weather.", "Venue"],
  ["Do you provide catering?", "Yes. Our catering covers menu planning, beautiful presentation and trained service staff — local, Indian and continental, with options for every dietary need.", "Services"],
] as const;
