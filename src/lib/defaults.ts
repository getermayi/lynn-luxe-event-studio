// Default content for every editable "Setting" key.
// The admin dashboard edits these objects; the site merges saved values over these
// defaults so a missing field never breaks a page.

export const defaultSettings = {
  site: {
    name: "Lynn Luxe Event Studio",
    shortName: "Lynn Luxe",
    tagline: "Crafting moments, creating memories",
    logo: "/brand/logo.png",
    wordmark: "/brand/wordmark.png",
    monogram: "/brand/monogram.png",
    phone: "+91 70852 62635",
    whatsapp: "917085262635",
    whatsappMessage: "Hello Lynn Luxe, I'd like to plan an event.",
    email: "",
    address: "Jollang, Arunachal Pradesh",
    serviceArea: "Jollang, Itanagar, Naharlagun & across Arunachal Pradesh",
    hours: "",
    instagram: "https://www.instagram.com/lynnluxeeventstudio/",
    instagramHandle: "@lynnluxeeventstudio",
    facebook: "",
    youtube: "",
    mapEmbedUrl: "https://www.google.com/maps?q=Jollang,+Arunachal+Pradesh&output=embed",
    announcement: {
      enabled: true,
      text: "Now booking weddings & celebrations for the 2026–27 season",
      linkLabel: "Check your date",
    },
    seo: {
      title: "Lynn Luxe Event Studio | Luxury Event Planning & Styling in Arunachal Pradesh",
      description:
        "Weddings, milestone birthdays and corporate occasions across Arunachal Pradesh — planned, designed and hosted by one studio. Venue, décor, German Hangar, catering and every detail, end to end.",
      ogImage: "/images/hook-chandelier.jpg",
    },
  },

  home: {
    hero: {
      kicker: "Luxury event planning & styling in Arunachal Pradesh",
      titleLines: ["Celebrations,", "beautifully", "composed."],
      subtitle:
        "Weddings, milestone birthdays and corporate occasions, designed with intention and run without a hitch. We look after every detail, so on the day all you have to do is enjoy it.",
      images: ["/images/hook-chandelier.jpg", "/images/hook-candlesticks.jpg", "/images/stage-floral.jpg", "/images/recap-longtable.jpg"],
      primaryCta: "Plan your event",
      secondaryCta: "Explore our work",
      chips: ["Weddings", "Birthdays", "Anniversaries", "Corporate", "Private", "Destination"],
      note: "One team · Design-led · Statewide",
    },
    stats: [
      { value: 40, suffix: "+", label: "Services under one roof" },
      { value: 1000, suffix: "+", label: "Guest capacity at our open-air venue" },
      { value: 200, suffix: "+", label: "Car parking spaces" },
      { value: 1, suffix: "", label: "Team — from first idea to final guest" },
    ],
    marquee: ["Weddings", "Engagements", "Milestone birthdays", "Anniversaries", "Baby showers", "Product launches", "Corporate dinners", "Private soirées"],
    intro: {
      kicker: "The studio",
      title: "We believe the best celebrations feel effortless to the people in them.",
      text: "Behind that ease is careful planning, a clear creative vision and a team that sweats the details, so you never have to. You get one point of contact and one cohesive look — we handle the vendors, timings and surprises.",
      image: "/images/intro-florals.jpg",
      points: [
        "One point of contact, from first idea to final guest",
        "Design-led décor, styling & tablescapes",
        "Clear proposals and itemised quotes",
        "Celebrations across Arunachal Pradesh",
      ],
    },
    featuredSection: { kicker: "Featured celebration", cta: "Read the story" },
    servicesSection: {
      kicker: "Services",
      title: "Everything your occasion needs, under one roof.",
      text: "Planning, design and hospitality from one dedicated team. One vision, one point of contact, nothing lost between vendors.",
    },
    portfolioSection: { kicker: "Portfolio", title: "Recent celebrations.", text: "Each one designed from scratch around the people it was for." },
    eventsSection: {
      kicker: "Occasions",
      title: "Every kind of celebration.",
      text: "Intimate dinners to thousand-guest weddings — designed around you.",
    },
    process: {
      kicker: "How we work",
      title: "A calm, clear process from first call to final toast.",
      text: "Four simple stages and one dedicated planner. You always know what's happening next, and you never carry the logistics alone.",
      steps: [
        { title: "Consult", text: "A relaxed conversation about the occasion, your guests, your budget and the feeling you want the day to have." },
        { title: "Design", text: "We shape a concept with mood, palette, décor and flow, and share a clear proposal for you to refine." },
        { title: "Plan", text: "Venues, vendors, menus and timelines are booked and managed by us, with regular updates along the way." },
        { title: "Host", text: "On the day our team sets up, runs the schedule and handles the unexpected. You simply arrive and enjoy." },
      ],
    },
    venueSection: {
      kicker: "Venues & structures",
      title: "The space sets the stage.",
      text: "Our open-air venue near the highway in Naharlagun — and all-weather German Hangars that turn any open field into a grand, pillarless hall.",
    },
    journalSection: { kicker: "Journal", title: "Ideas & planning notes." },
    gallerySection: { kicker: "Gallery", title: "Looks, details & tablescapes.", text: "Stages, florals, lighting, tables and venues — filter by what inspires you." },
    testimonialsSection: { kicker: "Kind words", title: "What our clients say." },
    faqSection: { kicker: "Good to know", title: "Questions, answered.", text: "Can't find what you're looking for? Call us and we'll be happy to help." },
    cta: {
      kicker: "Start planning",
      title: "Let's create something your guests will talk about for years.",
      text: "Share a few details and we'll reply on WhatsApp, usually within a day. Prefer to talk? Call +91 70852 62635.",
      image: "/images/cta-roses.jpg",
    },
  },

  servicesPage: {
    kicker: "Services",
    title: "Services shaped around your occasion.",
    text: "Book a single service or let us handle the entire event. Either way, it starts with a conversation about what matters most to you.",
    packagesKicker: "Levels of support",
    packagesTitle: "Choose how much you hand over.",
    packagesText: "Every event is quoted on its scope. Pick a starting point — we'll tailor it after our first call.",
  },

  packages: [
    {
      name: "Full Planning",
      tagline: "Concept to final farewell",
      bestFor: "Weddings, large celebrations & corporate events",
      features: ["Dedicated planner from day one", "Concept, mood & palette", "Venue, vendors & budget management", "Décor, catering & entertainment", "Guest experience & logistics", "Full on-site team on the day"],
      highlighted: true,
      cta: "Plan the whole event",
    },
    {
      name: "Design & Styling",
      tagline: "The look and the feeling",
      bestFor: "Hosts who have a venue and want it transformed",
      features: ["Theme & creative concept", "Stage, backdrop & florals", "Table styling & tablescapes", "Lighting design", "Setup & teardown"],
      highlighted: false,
      cta: "Style my event",
    },
    {
      name: "Day-of Coordination",
      tagline: "You planned it, we run it",
      bestFor: "Hosts who've booked vendors but want a calm day",
      features: ["Pre-event walkthrough", "Run-of-show & timeline", "Vendor management on the day", "Guest flow & problem-solving", "On-site supervision"],
      highlighted: false,
      cta: "Run my day",
    },
  ],

  portfolioPage: {
    kicker: "Portfolio",
    title: "Our work, in moments.",
    text: "A look at recent weddings, private celebrations and corporate occasions, each one designed from scratch around the people it was for.",
  },

  journalPage: {
    kicker: "Journal",
    title: "Planning notes from the studio.",
    text: "Ideas, checklists and honest advice for planning celebrations in Arunachal Pradesh.",
  },

  inquire: {
    kicker: "Start a conversation",
    title: "Tell us about your celebration.",
    text: "The more you share, the better we can prepare. Only your name, phone number and occasion are required; the rest can wait for our call.",
    nextTitle: "What happens next",
    nextSteps: [
      "Share a few details about your occasion. It takes about two minutes.",
      "We reply on WhatsApp, usually within a day, to arrange a short call.",
      "We send a tailored concept and proposal for you to refine.",
    ],
    services: ["Full planning", "Design & styling", "Day-of coordination", "Venue / German Hangar", "Catering", "Sound, light & entertainment", "Photography & video", "Invitations & gifts"],
    successTitle: "Thank you — your inquiry is in.",
    successText: "We've saved your details. Tap below to send them on WhatsApp too — it's the fastest way to reach our planner.",
  },

  about: {
    hero: {
      kicker: "About the studio",
      title: "We create moments that feel as good as they look.",
      text: "Lynn Luxe is a design-led event studio based in Jollang, planning and styling celebrations of every scale across Arunachal Pradesh.",
      image: "/images/recap-longtable.jpg",
    },
    philosophy: {
      kicker: "Our philosophy",
      title: "Great events are part design, part logistics and part hospitality. We bring all three together in one studio.",
      text: "We believe hosts deserve to enjoy their own celebrations. So we take on the planning, coordination and the hundred small decisions behind every event, and give you back the joy of being a guest at your own occasion.",
      image: "/images/stage-floral.jpg",
    },
    pillars: [
      { title: "Design", text: "Concept, palette, florals, lighting and tablescapes — one cohesive look.", image: "/images/decor-florals.jpg" },
      { title: "Logistics", text: "Venues, vendors, timelines, structures and the hundred small decisions.", image: "/images/truss-lights.jpg" },
      { title: "Hospitality", text: "Food, service and guest care that makes everyone feel looked after.", image: "/images/hospitality-banquet.jpg" },
    ],
    values: [
      { title: "Personal, never templated", text: "No two events we create look the same. We design around your people, your place and the feeling you want guests to leave with." },
      { title: "Detail as a discipline", text: "Lighting, textures, tablescapes and timing. Guests remember the small decisions, so we give each one our full attention." },
      { title: "One team, fully accountable", text: "Planning, styling and hospitality are run by one studio. You have a single point of contact from the first call to the final farewell." },
    ],
    areas: ["Jollang", "Itanagar", "Naharlagun", "Papu Nallah", "Doimukh", "Across Arunachal Pradesh"],
    promise: {
      title: "Plan. Design. Celebrate.",
      text: "Three words, one promise: we take the work, you take the moments.",
    },
  },

  contact: {
    hero: {
      kicker: "Contact",
      title: "Let's start planning.",
      text: "Whether you have a date, a venue and a vision or just the beginnings of an idea, we'd love to hear from you.",
    },
    channels: {
      call: "Speak directly with a planner.",
      whatsapp: "Our fastest response, usually within a day.",
      instagram: "Recent events and behind the scenes.",
      studio: "Planning events across the state.",
    },
    formTitle: "Send a quick message",
    formText: "Or use the full inquiry form for a tailored proposal.",
  },

  faqPage: {
    kicker: "Good to know",
    title: "Questions, answered.",
    text: "Search below, or call us and we'll be happy to help.",
  },

  popup: {
    enabled: true,
    delaySeconds: 20,
    exitIntent: true,
    frequencyDays: 3,
    kicker: "Free consultation",
    title: "Planning a celebration?",
    text: "Share your date and get a free planning call — with décor ideas and a ballpark budget for your event.",
    image: "/images/cta-roses.jpg",
    buttonLabel: "Get my free consultation",
    successTitle: "You're on our list!",
    successText: "Our planner will reach out shortly. Want to talk now? Message us on WhatsApp.",
  },

  quoteForm: {
    title: "Plan your event",
    subtitle: "3 quick steps · free · no obligation",
    eventTypes: ["Wedding", "Engagement", "Birthday", "Anniversary", "Corporate Event", "Private Event", "Baby Shower", "Catering", "Destination Event", "Other"],
    guestRanges: ["Under 50", "50 – 150", "150 – 300", "300 – 500", "500 – 1000", "1000+"],
    budgets: ["Under ₹1 Lakh", "₹1 – 3 Lakh", "₹3 – 5 Lakh", "₹5 – 10 Lakh", "₹10 Lakh+", "Not sure yet"],
    successTitle: "Thank you — we've got your details!",
    successText: "We'll reply on WhatsApp, usually within a day. For a faster reply, continue on WhatsApp now.",
  },

  footer: {
    blurb: "A full-service event planning and styling studio creating weddings, birthdays and corporate occasions across Arunachal Pradesh.",
    ctaTitle: "Your celebration starts with a conversation.",
  },

  credits: {
    title: "Photo credits",
    text: "Some photographs on this website are used under Creative Commons or Pexels licences. Thank you to the photographers.",
    items: [
      "hook-chandelier, venue-hall, decor-florals, production-stage, hospitality-banquet, details-invitations, hook-candlesticks, recap-longtable, cta-roses, intro-florals — Pexels (Pexels Licence)",
      "banquet, cake, truss-lights — Shixart1985, CC BY 2.0, Wikimedia Commons",
      "centerpiece — Bhullargraphic, CC BY-SA 4.0, Wikimedia Commons",
      "stage-floral — Ayga Events, CC BY-SA 4.0, Wikimedia Commons",
      "concert-stage — Edvard Hansson, CC BY-SA 4.0, Wikimedia Commons",
      "candles — Maekju, CC BY-SA 4.0, Wikimedia Commons",
      "table-setting — User:Mattes, Public domain, Wikimedia Commons",
      "luxe-table, gold-tablescape — zoe.wang, CC BY 2.0, Flickr",
      "champagne — Sam Howzit, CC BY 2.0, Flickr",
      "ballroom — archer10 (Dennis), CC BY-SA 2.0, Flickr",
      "chandelier — JasonParis, CC BY 2.0, Flickr",
      "head-table — Tracy Hunter, CC BY 2.0, Flickr",
      "gold-dinner — uberculture, CC BY 2.0, Flickr",
      "Venue aerials — Lynn Luxe Event Studio",
    ],
  },
};

export type Settings = typeof defaultSettings;
export type SettingKey = keyof Settings;

export const settingLabels: Record<SettingKey, { label: string; help: string }> = {
  site: { label: "Brand, contact & SEO", help: "Logo, phone, WhatsApp, address, social links, announcement bar and search-engine text." },
  home: { label: "Home page", help: "Hero, stats, studio intro, section headings, process steps and the final call-to-action." },
  servicesPage: { label: "Services page", help: "Services page heading and the packages section heading." },
  packages: { label: "Packages", help: "The levels of support compared on the Services page." },
  portfolioPage: { label: "Portfolio page", help: "Portfolio page heading." },
  journalPage: { label: "Journal page", help: "Journal page heading." },
  inquire: { label: "Inquiry page", help: "The full inquiry form page: heading, next steps, service checkboxes, thank-you message." },
  about: { label: "About page", help: "Philosophy, pillars, values, areas and promise." },
  contact: { label: "Contact page", help: "Contact page heading, channel descriptions and form text." },
  faqPage: { label: "FAQ page", help: "FAQ page heading." },
  popup: { label: "Lead popup", help: "The timed / exit-intent offer popup." },
  quoteForm: { label: "Quote form", help: "Event types, guest ranges, budgets and success messages in the quick quote form." },
  footer: { label: "Footer", help: "Footer text." },
  credits: { label: "Photo credits", help: "Attribution for licensed photos." },
};
