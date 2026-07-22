/**
 * Twentyone06 — hardcoded content.
 * All imagery is served directly from Pexels' CDN (verified photo IDs).
 */

export function pexels(id: number, w = 1200): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=${w}`;
}

export const nav = {
  brand: "Twentyone06",
  links: [
    { label: "Home", to: "/" as const },
    { label: "Projects", to: "/projects" as const },
    { label: "Services", to: "/services" as const },
    { label: "About", to: "/about" as const },
    { label: "Journal", to: "/journal" as const },
    { label: "FAQ", to: "/faq" as const },
    { label: "Contact", to: "/contact" as const },
  ],
};

export const hero = {
  eyebrow: "Aethel Signature Living",
  title: ["Design by the People,", "For the People."],
  description:
    "Explore exclusive properties designed for comfort, elegance and modern living in prime locations worldwide.",
  primaryCta: "Explore Designs",
  secondaryCta: "Book a Private Tour",
  image: pexels(1571460, 1920),
};

export const about = {
  eyebrow: "About Us",
  title: ["Timeless Interiors", "Elevated Living"],
  body: "Anyone can make a pretty space. We make designs that grab you. Designs that make people stop scrolling, start talking, stay longer, come back. Because in hospitality, the experience is the brand. And we don’t do “nice.” We do impactful, intentional, emotional, and bold. With story, with strategy, and with service at our core.",
  cta: "More About Us",
  imageA: pexels(1080721, 800),
  imageB: pexels(2724749, 900),
};

export const stats = [
  { value: 10, suffix: "+", label: "Years", sub: "Years of Interior Experience" },
  { value: 98, suffix: "%", label: "Satisfied", sub: "Satisfied Valued Clients" },
  { value: 50, suffix: "+", label: "Projects", sub: "Active Interior Projects" },
  { value: 50, suffix: "K+", label: "Clients", sub: "Happy Clients" },
];

export const showcase = [
  {
    title: "Shaazzz Interior Studio",
    concept: "Elegant Coastal Living Concept",
    location: "Elegant Coastal Living Concept",
    description:
      "Minimalist luxury interiors with premium materials, open spaces, and calming ocean-inspired elegance.",
    price: "$19,500.00",
    image: pexels(1918291, 1920),
    preview: pexels(1643384, 600),
    previewLabel: "Infinity View Concept",
  },
  {
    title: "The Private Sanctuary",
    concept: "Coral Gables, FL",
    location: "Coral Gables, FL",
    description:
      "A perfect balance of modern design and tranquil textures, creating an elegant space for relaxation.",
    price: "$28,900.00",
    image: pexels(1643384, 1920),
    preview: pexels(6899260, 600),
    previewLabel: "Infinity View Concept",
  },
  {
    title: "The Atrium Residence",
    concept: "Aspen, Colorado",
    location: "Aspen, Colorado",
    description:
      "Warm timber, sculptural lighting and floor-to-ceiling glass framing an uninterrupted mountain vista.",
    price: "$34,200.00",
    image: pexels(6899260, 1920),
    preview: pexels(1918291, 600),
    previewLabel: "Infinity View Concept",
  },
];

export const services = {
  eyebrow: "Aethel Signature Living Concepts",
  title: ["Curate, Design &", "Elevate with Aethel"],
  cta: "See All Project",
  tabs: [
    {
      id: "residential",
      label: "Residential Design",
      items: [
        {
          index: "01",
          title: "Residential Living Space",
          description:
            "Thoughtfully designed residential spaces that blend comfort, functionality, and modern aesthetics to enhance everyday lifestyle experiences.",
          image: pexels(1571468, 1000),
        },
        {
          index: "02",
          title: "High-Performance Collaboration",
          description:
            "Open-plan living that supports connection and focus — flexible zones, refined acoustics, and materials that stay calm under everyday use.",
          image: pexels(1643384, 1000),
        },
        {
          index: "03",
          title: "Curated Private Art Collections",
          description:
            "Interiors composed as quiet galleries — walls, lighting and sightlines calibrated so art feels intentional rather than decorative.",
          image: pexels(3555615, 1000),
        },
        {
          index: "04",
          title: "Heritage Material Sourcing",
          description:
            "Stone, timber and textiles with provenance — rare finishes selected for tactility, longevity and a sense of quiet permanence.",
          image: pexels(276724, 1000),
        },
        {
          index: "05",
          title: "Minimalist Spatial Restoration",
          description:
            "Editing rooms back to clarity — removing visual noise, restoring proportion, and letting light and volume do the heavy lifting.",
          image: pexels(1080696, 1000),
        },
      ],
    },
    {
      id: "commercial",
      label: "Commercial Spaces",
      items: [
        {
          index: "01",
          title: "Aethel Signature Living Concepts",
          description:
            "Aethel Signature Living Concepts delivers refined luxury interiors blending elegance, comfort, innovation, and timeless sophistication style.",
          image: pexels(271624, 1000),
        },
        {
          index: "02",
          title: "Penthouse Architectural Planning",
          description:
            "Vertical residences planned around views, privacy and flow — terraces, double-height volumes and discrete service cores.",
          image: pexels(6899260, 1000),
        },
        {
          index: "03",
          title: "Minimalist Spatial Restoration",
          description:
            "Commercial interiors stripped to essentials — crisp circulation, generous negative space and materials that age with grace.",
          image: pexels(7018391, 1000),
        },
        {
          index: "04",
          title: "High-End Textile & Material Sourcing",
          description:
            "Performance fabrics and architectural finishes curated for hospitality and workplace environments that still feel residential.",
          image: pexels(6438752, 1000),
        },
        {
          index: "05",
          title: "Bespoke Interior Styling & Decor",
          description:
            "Turnkey styling for lobbies, suites and show apartments — furniture, art and objects composed as a cohesive brand story.",
          image: pexels(1918291, 1000),
        },
      ],
    },
    {
      id: "furniture",
      label: "Bespoke Furniture",
      items: [
        {
          index: "01",
          title: "Handcrafted Statement Pieces",
          description:
            "Bespoke furniture crafted from rare woods and premium textiles, tailored to the proportions and personality of each interior.",
          image: pexels(1866149, 1000),
        },
        {
          index: "02",
          title: "Custom Upholstery Ateliers",
          description:
            "Sofas, chairs and banquette seating built to measure — foam profiles, stitch details and covers chosen for daily comfort.",
          image: pexels(2062431, 1000),
        },
        {
          index: "03",
          title: "Sculptural Seating Editions",
          description:
            "Limited seating forms that act as soft sculpture — bold silhouettes balanced with ergonomic depth and premium fill.",
          image: pexels(1571463, 1000),
        },
        {
          index: "04",
          title: "Modular Living Systems",
          description:
            "Configurable cabinetry and shelving that grow with the room — clean lines, hidden storage and adaptable compositions.",
          image: pexels(2724749, 1000),
        },
        {
          index: "05",
          title: "Artisan Joinery & Cabinetry",
          description:
            "Millwork executed with furniture-grade precision — flush panels, integrated lighting and hardware that disappears into the grain.",
          image: pexels(1080721, 1000),
        },
      ],
    },
    {
      id: "lighting",
      label: "Lighting Curation",
      items: [
        {
          index: "01",
          title: "Architectural Light Design",
          description:
            "Layered lighting schemes that sculpt atmosphere, highlight materiality, and transform interiors from day into evening.",
          image: pexels(2029667, 1000),
        },
        {
          index: "02",
          title: "Statement Chandeliers",
          description:
            "Focal fixtures that set the room’s scale — glass, metal and crystal compositions chosen for presence without visual clutter.",
          image: pexels(3214064, 1000),
        },
        {
          index: "03",
          title: "Ambient Mood Systems",
          description:
            "Soft perimeter and wash lighting that wraps the space — dimmable scenes for dining, rest and quiet evening rituals.",
          image: pexels(279719, 1000),
        },
        {
          index: "04",
          title: "Circadian Smart Control",
          description:
            "Tunable white and scene automation that follows the day — healthier rhythm, effortless control and invisible hardware.",
          image: pexels(262048, 1000),
        },
        {
          index: "05",
          title: "Bespoke Fixture Commissions",
          description:
            "One-off lamps and pendants designed with metalworkers and glassblowers — unique pieces aligned to each project’s palette.",
          image: pexels(1428348, 1000),
        },
      ],
    },
    {
      id: "art",
      label: "Art & Decor",
      items: [
        {
          index: "01",
          title: "Curated Private Art Collections",
          description:
            "A considered edit of art, objects and decor that gives every residence a distinct, collected-over-time character.",
          image: pexels(3555615, 1000),
        },
        {
          index: "02",
          title: "Gallery-Grade Installation",
          description:
            "Museum-level hanging, lighting and conservation practice — so each work sits correctly in the architecture.",
          image: pexels(3990359, 1000),
        },
        {
          index: "03",
          title: "Sculpture & Object Sourcing",
          description:
            "Three-dimensional pieces that punctuate rooms — pedestal works, wall reliefs and found objects with quiet authority.",
          image: pexels(2440471, 1000),
        },
        {
          index: "04",
          title: "Textile & Rug Commissions",
          description:
            "Hand-woven rugs and custom textiles that ground seating groups — color, pile and pattern tuned to the architecture.",
          image: pexels(6032424, 1000),
        },
        {
          index: "05",
          title: "Seasonal Styling Programs",
          description:
            "Rotating décor edits that refresh a home through the year — florals, soft accessories and tabletop without a full redesign.",
          image: pexels(6585757, 1000),
        },
      ],
    },
  ],
};

export const listings = {
  eyebrow: "New Listings",
  title: ["Discover Newly Curated", "Luxury Interiors for Modern", "Elegant Living Spaces"],
  body: "Discover our latest curated interior listings, showcasing timeless elegance, premium craftsmanship, modern aesthetics, and refined living spaces designed to inspire comfort, beauty, and luxury lifestyle experience.",
  cta: "Explore More",
  items: [
    {
      slug: "elegant-modern-dining-haven",
      title: "Elegant Modern Dining Haven",
      location: "Syracuse, Connecticut",
      price: "$19,500.00",
      image: pexels(1080721, 1000),
      span: "tall",
    },
    {
      slug: "minimalist-luxury-lounge",
      title: "Minimalist Luxury Lounge",
      location: "Syracuse, Connecticut",
      price: "$19,500.00",
      image: pexels(1866149, 900),
      span: "short",
    },
    {
      slug: "bright-contemporary-serenity",
      title: "Bright Contemporary Serenity Space",
      location: "Syracuse, Connecticut",
      price: "$19,500.00",
      image: pexels(7018391, 1000),
      span: "wide",
    },
    {
      slug: "warm-modern-comfort-living",
      title: "Warm Modern Comfort Living",
      location: "Syracuse, Connecticut",
      price: "$19,500.00",
      image: pexels(1918291, 1000),
      span: "tall",
    },
    {
      slug: "cozy-elegant-haven",
      title: "Cozy Elegant Haven",
      location: "Syracuse, Connecticut",
      price: "$19,500.00",
      image: pexels(6438752, 900),
      span: "short",
    },
  ],
};

export const journal = {
  eyebrow: "Our Journal",
  title: ["Luxury interior spaces crafted", "with elegance, precision, and", "refined aesthetics"],
  body: "Thoughtfully crafted spaces blending elegance, comfort, and functionality to enhance modern living.",
  cta: "View All Articles",
  featured: {
    slug: "enduring-luxury-interiors-designed-to-inspire",
    title: "Enduring Luxury: Interiors Designed to Inspire",
    excerpt:
      "Designed with precision and refined aesthetics, our featured projects showcase modern elegance, functional design, curated textures, bespoke elements, and a timeless sense of luxury.",
    date: "12 Feb 2026",
    tag: "Interior Design",
    image: pexels(276724, 1200),
  },
  posts: [
    {
      slug: "elevating-modern-living-with-minimalist-elegance",
      title: "Elevating Modern Living with Minimalist Elegance",
      date: "8 Dec 2025",
      tag: "Residential",
      image: pexels(3990359, 800),
    },
    {
      slug: "sustainable-luxury-eco-conscious-interiors",
      title: "Sustainable Luxury: Designing Eco-Conscious Interiors",
      date: "25 Jan 2026",
      tag: "Eco Design",
      image: pexels(2440471, 800),
    },
  ],
};

export const footer = {
  cta: {
    title: ["Discover Timeless Interiors", "Crafted for Modern Living"],
    members: "50k+ Members Joined Us",
    button: "Start Your Design",
    buttonTo: "/contact",
    avatars: [pexels(1043471, 120), pexels(2379005, 120), pexels(1102341, 120)],
  },
  columns: [
    {
      title: "Follow Us",
      links: [
        { label: "Facebook", href: "https://www.facebook.com/p/TwentyOne06-100054351738420/" },
        { label: "Instagram", href: "https://www.instagram.com/twentyone06/" },
        { label: "Linkedin", href: "https://www.linkedin.com/company/twentyone06" },
      ],
      arrow: true,
    },
    {
      title: "Quick Links",
      links: [
        { label: "Projects", to: "/projects" },
        { label: "About Studio", to: "/about" },
        { label: "Design Services", to: "/services" },
        { label: "Journal", to: "/journal" },
        { label: "FAQ", to: "/faq" },
        { label: "Contact", to: "/contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Residential Design", to: "/services/$slug", params: { slug: "residential" } },
        { label: "Commercial Spaces", to: "/services/$slug", params: { slug: "commercial" } },
        { label: "Bespoke Furniture", to: "/services/$slug", params: { slug: "furniture" } },
        { label: "Lighting Curation", to: "/services/$slug", params: { slug: "lighting" } },
        { label: "Art & Decor", to: "/services/$slug", params: { slug: "art" } },
        { label: "See All Services", to: "/services" },
      ],
    },
  ],
  location: {
    title: "Location",
    lines: [
      "Pearl Coast — Office 304",
      "23rd St, Al Barsha First",
      "Al Barsha, Dubai",
    ],
    callTitle: "Call Us",
    phone: "04 554 8082",
    phoneHref: "tel:+97145548082",
    email: "info@twentyone06.com",
  },
  copyright: "@2026 Twentyone06 copyright. All right reserved",
  legal: ["Privacy Policy", "Terms of Service"],
  wordmark: "Twentyone06",
  wordmarkImages: [pexels(1571460, 800), pexels(1080721, 800), pexels(6899260, 800), pexels(7018391, 800)],
};

export const faqPage = {
  eyebrow: "Help Center",
  title: ["Answers Crafted", "With Clarity"],
  description:
    "Everything you need to know about working with Twentyone06 — from first consultation to final styling, timelines, and care.",
  ctaLabel: "Still have questions?",
  ctaButton: "Contact the Studio",
  categories: [
    {
      id: "process",
      label: "Process",
      items: [
        {
          q: "How does a typical design engagement begin?",
          a: "We start with a private consultation to understand your lifestyle, site conditions, and aspirations. From there we prepare a concept direction, scope, and investment outline before any detailed design begins.",
        },
        {
          q: "What is included in a full-service interior project?",
          a: "Concept design, space planning, material and finish selection, custom furniture and joinery, lighting design, procurement, site coordination, and final styling — delivered as a continuous, curated experience.",
        },
        {
          q: "Can Twentyone06 work on a single room or partial renovation?",
          a: "Yes. We offer focused commissions for living rooms, kitchens, suites, and commercial suites, as well as complete residences and hospitality interiors.",
        },
      ],
    },
    {
      id: "timeline",
      label: "Timeline & Delivery",
      items: [
        {
          q: "How long does a residential project usually take?",
          a: "Most full residences run 4–9 months from concept approval to installation, depending on scale, custom fabrication, and construction readiness. We share a clear milestone schedule at kickoff.",
        },
        {
          q: "Do you manage contractors and site works?",
          a: "We coordinate closely with your builder or preferred contractors, providing detailed drawings, finish schedules, and on-site reviews so the design intent is protected through delivery.",
        },
        {
          q: "Can you work on international or remote projects?",
          a: "Yes. We design for clients worldwide with a hybrid of on-site visits and digital collaboration, supported by trusted local fabricators and logistics partners.",
        },
      ],
    },
    {
      id: "investment",
      label: "Investment",
      items: [
        {
          q: "How are fees structured?",
          a: "Fees are tailored to scope — typically a design fee plus procurement and styling. After the consultation we provide a transparent proposal so you know exactly what is included.",
        },
        {
          q: "Do you source furniture and materials?",
          a: "Absolutely. We curate and procure furniture, lighting, textiles, art, and finishes, including bespoke commissions through our atelier network.",
        },
        {
          q: "Is an initial consultation complimentary?",
          a: "Introductory discovery calls are complimentary. In-depth site consultations may include a modest fee, credited toward your project if you proceed.",
        },
      ],
    },
    {
      id: "care",
      label: "Aftercare",
      items: [
        {
          q: "What support do you offer after handover?",
          a: "Every project includes a post-installation review. We also offer seasonal styling programs and maintenance guidance for textiles, finishes, and custom pieces.",
        },
        {
          q: "Can you refresh a previous Twentyone06 interior later?",
          a: "Yes. Many clients return for phased updates — art rotations, soft furnishings, or room additions that stay consistent with the original language of the home.",
        },
      ],
    },
  ],
};

export const contactPage = {
  eyebrow: "Get in Touch",
  title: ["Let’s Begin Your", "Design Journey"],
  description:
    "Share a few details about your project. Our studio will respond within two business days to arrange a private consultation.",
  image: pexels(1571460, 1400),
  form: {
    fields: [
      { id: "name", label: "Full Name", type: "text", placeholder: "Your name", required: true },
      { id: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
      { id: "phone", label: "Phone", type: "tel", placeholder: "+1 000 000 0000", required: false },
      {
        id: "interest",
        label: "Project Interest",
        type: "select",
        placeholder: "Select a focus",
        required: true,
        options: [
          "Residential Design",
          "Commercial Spaces",
          "Bespoke Furniture",
          "Lighting Curation",
          "Art & Decor",
          "Private Tour / Consultation",
        ],
      },
      {
        id: "message",
        label: "Tell Us About Your Space",
        type: "textarea",
        placeholder: "Location, timeline, and what you hope to achieve…",
        required: true,
      },
    ],
    submit: "Send Message",
    note: "By submitting, you agree to be contacted by Twentyone06 regarding your inquiry. We never share your details.",
  },
  details: [
    {
      label: "Visit",
      lines: [
        "Pearl Coast — Office 304",
        "23rd St, Al Barsha First",
        "Al Barsha, Dubai",
      ],
    },
    {
      label: "Call",
      lines: ["04 554 8082"],
      href: "tel:+97145548082",
    },
    {
      label: "Email",
      lines: ["info@twentyone06.com"],
      href: "mailto:info@twentyone06.com",
    },
    {
      label: "Studio Hours",
      lines: ["Mon – Fri · 9:00 – 18:00", "Sat by appointment"],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Catalog pages — projects, services, about, journal                        */
/* -------------------------------------------------------------------------- */

export const projectsPage = {
  eyebrow: "Our Work",
  title: ["Curated Interiors", "Across Residences"],
  description:
    "A selection of residences and spaces shaped by Twentyone06 — each one a study in material, light, and lived-in luxury.",
  filters: ["All", "Residential", "Hospitality", "Commercial"] as const,
};

export type Project = {
  slug: string;
  title: string;
  location: string;
  price: string;
  category: "Residential" | "Hospitality" | "Commercial";
  year: string;
  client: string;
  area: string;
  status: string;
  duration: string;
  typologies: string[];
  scope: string[];
  materials: string[];
  finishes: string[];
  credits: { role: string; name: string }[];
  challenge: string;
  approach: string;
  outcome: string;
  excerpt: string;
  body: string[];
  hero: string;
  gallery: string[];
  span: "tall" | "short" | "wide";
};

export const projects: Project[] = [
  {
    slug: "elegant-modern-dining-haven",
    title: "Elegant Modern Dining Haven",
    location: "Syracuse, Connecticut",
    price: "$19,500.00",
    category: "Residential",
    year: "2025",
    client: "Private Residence — North Shore",
    area: "420 sqft dining + pantry",
    status: "Completed",
    duration: "5 months",
    typologies: ["Dining", "Butler’s pantry", "Wine display"],
    scope: [
      "Concept & space planning",
      "Custom dining table & seating",
      "Stone & millwork detailing",
      "Layered lighting design",
      "Procurement & installation",
    ],
    materials: ["Calacatta marble", "Walnut veneer", "Brushed bronze", "Wool upholstery"],
    finishes: ["Honed stone", "Oil-rubbed timber", "Antique mirror", "Linen sheer"],
    credits: [
      { role: "Lead Designer", name: "Twentyone06 Studio" },
      { role: "Millwork", name: "Atelier North Joinery" },
      { role: "Lighting", name: "Lumen & Form" },
      { role: "Photography", name: "Studio Vale" },
    ],
    challenge:
      "A narrow dining wing needed to host both weekday family meals and formal evenings without feeling either cramped or ceremonial.",
    approach:
      "We clarified circulation, introduced a sculptural table as the room’s center of gravity, and wrapped service functions into a discreet pantry spine.",
    outcome:
      "A dining room that reads as architecture first — calm, luminous, and flexible enough for every register of gathering.",
    excerpt:
      "A dining suite composed around marble, quiet metals, and seating that invites long evenings.",
    body: [
      "The existing dining wing suffered from fragmented storage and a table that never quite aligned with the windows. Guests felt either squeezed against the wall or stranded in the middle of the room.",
      "Our response began with a new axis: a single stone-clad threshold separating dining from pantry, freeing the main volume for a bespoke walnut table sized to the bay.",
      "Lighting is deliberately layered — a linear wash along the stone, a dimmable pendant cluster over the table, and concealed toe-kick glow in the pantry so service never breaks the atmosphere.",
      "Seating mixes banquettes and freestanding chairs so the room can compress for four or expand for twelve without rearranging the architecture.",
    ],
    hero: pexels(1080721, 1600),
    gallery: [
      pexels(1080721, 1200),
      pexels(2724749, 1200),
      pexels(1866149, 1200),
      pexels(1571468, 1200),
      pexels(2062431, 1200),
      pexels(3214064, 1200),
    ],
    span: "tall",
  },
  {
    slug: "minimalist-luxury-lounge",
    title: "Minimalist Luxury Lounge",
    location: "Syracuse, Connecticut",
    price: "$19,500.00",
    category: "Residential",
    year: "2024",
    client: "Private Residence — Hillcrest",
    area: "680 sqft primary lounge",
    status: "Completed",
    duration: "4 months",
    typologies: ["Living", "Media niche", "Library wall"],
    scope: [
      "Full interior reconfiguration",
      "Custom low seating system",
      "Integrated media cabinetry",
      "Acoustic soft finishes",
      "Art placement & styling",
    ],
    materials: ["European oak", "Bouclé textile", "Travertine", "Powder-coated steel"],
    finishes: ["White-oil oak", "Limewash walls", "Matte black metal", "Hand-tufted rug"],
    credits: [
      { role: "Lead Designer", name: "Twentyone06 Studio" },
      { role: "Upholstery", name: "Softform Atelier" },
      { role: "Stone", name: "Pietra Works" },
    ],
    challenge:
      "The lounge felt busy — competing furniture, exposed cables, and no clear place to gather or retreat.",
    approach:
      "We edited ruthlessly, built storage into architecture, and composed a single conversational island with sightlines to the garden.",
    outcome:
      "A quiet living room with hotel-grade composure and residential softness — negative space as a luxury finish.",
    excerpt:
      "Low furniture, generous negative space, and tactile finishes define a lounge made for slow living.",
    body: [
      "Rather than adding more pieces, we removed half of what was there. What remained had to earn its place through proportion, tactility, or function.",
      "A continuous oak plinth runs the length of the media wall, concealing AV, charging, and seasonal storage while reading as architecture rather than furniture.",
      "The seating system is low and modular — deep enough for lounging, light enough visually that the room still feels generous.",
      "Acoustics were treated with a thick rug, upholstered panels behind the sofa, and linen curtains that soften evening reflections from the glass.",
    ],
    hero: pexels(1866149, 1600),
    gallery: [
      pexels(1866149, 1200),
      pexels(1571468, 1200),
      pexels(2062431, 1200),
      pexels(276724, 1200),
      pexels(1080696, 1200),
    ],
    span: "short",
  },
  {
    slug: "bright-contemporary-serenity",
    title: "Bright Contemporary Serenity Space",
    location: "Syracuse, Connecticut",
    price: "$19,500.00",
    category: "Residential",
    year: "2025",
    client: "Private Residence — Lakeside",
    area: "1,100 sqft open living",
    status: "Completed",
    duration: "6 months",
    typologies: ["Open living", "Kitchen adjacency", "Morning room"],
    scope: [
      "Daylighting strategy",
      "Pale material palette",
      "Kitchen–living threshold",
      "Window treatments",
      "Furniture & décor edit",
    ],
    materials: ["Limestone", "Ash timber", "Sheer linen", "Brushed nickel"],
    finishes: ["Honed limestone", "Bleached ash", "Mineral paint", "Frosted glass"],
    credits: [
      { role: "Lead Designer", name: "Twentyone06 Studio" },
      { role: "Glazing Consultant", name: "Clearspan Daylight" },
      { role: "Textiles", name: "Loom & Latitude" },
    ],
    challenge:
      "South-facing glass brought glare and heat; the open plan felt washed-out by midday and flat by evening.",
    approach:
      "We treated light as a material — filtering, bouncing, and staging it through sheers, pale stone, and calibrated artificial layers.",
    outcome:
      "A living volume that stays luminous without glare, calm from breakfast through late dinner.",
    excerpt:
      "Soft daylight, pale textiles, and calibrated sightlines for a home that stays calm from morning to night.",
    body: [
      "The lakeside orientation was a gift and a liability. Unmediated sun flattened textures and heated the sofa zone by early afternoon.",
      "Sheer linen tracks, a limestone floor with high albedo, and ash millwork bounce light deeper into the plan while cutting harsh contrast.",
      "Evening scenes reverse the strategy: warm dimmable washes at the ceiling perimeter, discrete reading lamps, and under-shelf glow in the kitchen adjacency.",
      "Furniture stays low and pale so the horizon and water remain the primary artwork of the room.",
    ],
    hero: pexels(7018391, 1600),
    gallery: [
      pexels(7018391, 1200),
      pexels(1643384, 1200),
      pexels(1080696, 1200),
      pexels(1571460, 1200),
      pexels(2724749, 1200),
    ],
    span: "wide",
  },
  {
    slug: "warm-modern-comfort-living",
    title: "Warm Modern Comfort Living",
    location: "Syracuse, Connecticut",
    price: "$19,500.00",
    category: "Residential",
    year: "2024",
    client: "Private Residence — Cedar Lane",
    area: "740 sqft living + hearth",
    status: "Completed",
    duration: "5 months",
    typologies: ["Living room", "Hearth niche", "Terrace link"],
    scope: [
      "Hearth redesign",
      "Seating plan & rugs",
      "Timber cladding",
      "Ambient lighting scenes",
      "Outdoor–indoor threshold",
    ],
    materials: ["Smoked oak", "Clay plaster", "Wool & silk rug", "Amber glass"],
    finishes: ["Smoked timber oil", "Venetian clay", "Antique brass", "Leather accents"],
    credits: [
      { role: "Lead Designer", name: "Twentyone06 Studio" },
      { role: "Plaster", name: "Earthtone Surfaces" },
      { role: "Rug Commission", name: "Knot & Grain" },
    ],
    challenge:
      "The living room felt cold despite a fireplace — grey finishes and scattered seating diluted any sense of gathering.",
    approach:
      "We rebuilt warmth through material temperature, a protective seating core, and lighting that mimics firelight after dark.",
    outcome:
      "A living room that feels hospitable on first entry and holds conversation without effort.",
    excerpt:
      "Ember tones, layered rugs, and sculptural lighting for a living room that feels hospitable on first entry.",
    body: [
      "Comfort here is compositional, not sentimental. Ember tones, clay plaster, and smoked oak create a thermal palette before anyone sits down.",
      "The hearth niche was deepened and lined so the fire reads as architecture. Seating wraps it without blocking the terrace doors.",
      "A custom rug anchors the conversational island; side tables in amber glass catch evening light from the pendant.",
      "When the terrace doors open, the indoor palette continues outdoors through timber decking and matching lounge textiles.",
    ],
    hero: pexels(1918291, 1600),
    gallery: [
      pexels(1918291, 1200),
      pexels(6899260, 1200),
      pexels(276724, 1200),
      pexels(6438752, 1200),
      pexels(2029667, 1200),
    ],
    span: "tall",
  },
  {
    slug: "cozy-elegant-haven",
    title: "Cozy Elegant Haven",
    location: "Syracuse, Connecticut",
    price: "$19,500.00",
    category: "Residential",
    year: "2025",
    client: "Private Residence — Primary Suite",
    area: "510 sqft suite + dressing",
    status: "Completed",
    duration: "4 months",
    typologies: ["Bedroom", "Dressing", "Ensuite threshold"],
    scope: [
      "Suite planning",
      "Custom headboard millwork",
      "Dressing cabinetry",
      "Circadian lighting",
      "Textile & soft finishes",
    ],
    materials: ["Upholstered panels", "Rift oak", "Cashmere blend", "Veined marble"],
    finishes: ["Matte lacquer", "Brushed nickel", "Blackout + sheer layers", "Stone vanity"],
    credits: [
      { role: "Lead Designer", name: "Twentyone06 Studio" },
      { role: "Cabinetry", name: "Quiet Closet Co." },
      { role: "Textiles", name: "Nightweave Studio" },
    ],
    challenge:
      "The primary suite needed hotel-grade rest without losing the intimacy of a private home.",
    approach:
      "We zoned sleep, dress, and wash with soft thresholds, dimmable scenes, and millwork that hides clutter.",
    outcome:
      "A sanctuary suite where every evening ritual feels deliberate and unhurried.",
    excerpt:
      "A suite designed as a private retreat — soft textiles, dimmable scenes, and quiet luxury details.",
    body: [
      "Sleep architecture starts with darkness and silence. We specified dual window layers, acoustic panels behind the headboard, and carpet that quiets footfall.",
      "The headboard millwork wraps the corners, integrating reading lights and outlets so nightstands stay clear.",
      "Dressing is a corridor of rift-oak cabinets with soft-close hardware and jewel-box lighting that only activates when doors open.",
      "Circadian control shifts from cool morning wash to warm amber night scenes — the suite never feels abrupt.",
    ],
    hero: pexels(6438752, 1600),
    gallery: [
      pexels(6438752, 1200),
      pexels(3990359, 1200),
      pexels(6032424, 1200),
      pexels(279719, 1200),
      pexels(1080721, 1200),
    ],
    span: "short",
  },
  {
    slug: "shaazzz-interior-studio",
    title: "Shaazzz Interior Studio",
    location: "Dubai Marina Concept",
    price: "$42,000.00",
    category: "Hospitality",
    year: "2025",
    client: "Shaazzz Hospitality Group",
    area: "2,400 sqft concept suite + lounge",
    status: "Concept delivered",
    duration: "7 months",
    typologies: ["Hospitality suite", "Arrival lounge", "Coastal F&B niche"],
    scope: [
      "Brand-aligned concept design",
      "FF&E specification",
      "Guest journey mapping",
      "Material boards & CGI",
      "Vendor shortlisting",
    ],
    materials: ["Salt-washed teak", "Coral stone", "Raw linen", "Handblown glass"],
    finishes: ["Weathered timber", "Lime plaster", "Rope detailing", "Sea-glass mosaic"],
    credits: [
      { role: "Creative Direction", name: "Twentyone06 Studio" },
      { role: "Hospitality Consultant", name: "Harbor Protocol" },
      { role: "CGI", name: "Frame North" },
    ],
    challenge:
      "Translate a coastal luxury brand into interiors that feel local and timeless — not themed or transient.",
    approach:
      "We built a material language of salt, sand, and horizon: weathered timber, soft plaster, and low furniture that keeps views primary.",
    outcome:
      "A concept suite and lounge language ready for multi-key rollout across the client’s marina properties.",
    excerpt:
      "Minimalist luxury interiors with premium materials, open spaces, and calming ocean-inspired elegance.",
    body: [
      "Hospitality interiors fail when they shout. Shaazzz needed quiet confidence — spaces that photograph well and recover quickly between guests.",
      "The arrival lounge is a sequence of thresholds: filtered light, a low seating island, and a material sample wall that doubles as brand storytelling.",
      "In the suite, the sleeping zone faces the water; wet areas and wardrobe are pulled into a service spine so the main volume stays clear.",
      "FF&E specifications favor durable textiles and replaceable soft goods so operations can refresh without redesigning architecture.",
    ],
    hero: pexels(1918291, 1600),
    gallery: [
      pexels(1918291, 1200),
      pexels(1643384, 1200),
      pexels(1571460, 1200),
      pexels(7018391, 1200),
      pexels(2440471, 1200),
      pexels(6899260, 1200),
    ],
    span: "wide",
  },
  {
    slug: "the-private-sanctuary",
    title: "The Private Sanctuary",
    location: "Coral Gables, FL",
    price: "$28,900.00",
    category: "Residential",
    year: "2023",
    client: "Private Residence — Coral Way",
    area: "3,200 sqft interior renovation",
    status: "Completed",
    duration: "9 months",
    typologies: ["Whole-home renovation", "Garden pavilion", "Gallery corridor"],
    scope: [
      "Full interior renovation",
      "Garden–house interface",
      "Stone flooring throughout",
      "Art lighting & hanging",
      "Custom furniture program",
    ],
    materials: ["Florida keystone", "Teak", "Linen & cotton", "Cast bronze"],
    finishes: ["Honed keystone", "Natural teak oil", "Mineral wash", "Patina bronze"],
    credits: [
      { role: "Lead Designer", name: "Twentyone06 Studio" },
      { role: "Landscape", name: "Canopy & Court" },
      { role: "Art Advisor", name: "Southern Edit" },
      { role: "General Contractor", name: "Gables Build Co." },
    ],
    challenge:
      "Open the house to lush gardens without sacrificing privacy from the street or overheating the interiors.",
    approach:
      "Layered thresholds, deep overhangs of soft furnishings, and a stone floor that cools underfoot while linking indoor and outdoor rooms.",
    outcome:
      "A residence that breathes with the garden — private, cool, and composed for collecting art and hosting slowly.",
    excerpt:
      "A perfect balance of modern design and tranquil textures, creating an elegant space for relaxation.",
    body: [
      "Coral Gables light is generous. We tempered it with deep reveals, sheer layers, and keystone floors that stay cool through summer.",
      "A gallery corridor becomes the spine of the home — art lit to museum standards, with niches for sculpture that punctuate the walk to the garden pavilion.",
      "Living spaces open through multi-slide glazing; when open, rugs and furniture alignments continue outdoors so the terrace feels like a room.",
      "Privacy from the street is handled with layered planting and a solid entry sequence that never announces the garden beyond.",
    ],
    hero: pexels(1643384, 1600),
    gallery: [
      pexels(1643384, 1200),
      pexels(6899260, 1200),
      pexels(2724749, 1200),
      pexels(3555615, 1200),
      pexels(2440471, 1200),
      pexels(1571468, 1200),
    ],
    span: "tall",
  },
  {
    slug: "the-atrium-residence",
    title: "The Atrium Residence",
    location: "Aspen, Colorado",
    price: "$34,200.00",
    category: "Residential",
    year: "2024",
    client: "Private Residence — Red Mountain",
    area: "4,800 sqft mountain home",
    status: "Completed",
    duration: "11 months",
    typologies: ["Atrium living", "Ski lounge", "Primary wing"],
    scope: [
      "Interior architecture package",
      "Timber & steel detailing",
      "Mountain-view furniture plan",
      "Feature lighting",
      "Seasonal styling program",
    ],
    materials: ["Reclaimed fir", "Blackened steel", "Shearling", "Local stone"],
    finishes: ["Hand-scraped timber", "Waxed steel", "Lime plaster", "Wool throws"],
    credits: [
      { role: "Lead Designer", name: "Twentyone06 Studio" },
      { role: "Architect of Record", name: "Peak Form Architects" },
      { role: "Timber", name: "High Country Mill" },
      { role: "Lighting", name: "Altitude Light Lab" },
    ],
    challenge:
      "A dramatic atrium risked feeling like a lobby — impressive but cold, hard to furnish, difficult to heat emotionally.",
    approach:
      "We humanized the volume with timber warmth, soft seating islands, and lighting that draws the eye to the mountains without competing with them.",
    outcome:
      "An atrium that works as daily living — grounded, warm, and oriented entirely to the landscape.",
    excerpt:
      "Warm timber, sculptural lighting and floor-to-ceiling glass framing an uninterrupted mountain vista.",
    body: [
      "Volume without intimacy is spectacle. We introduced a timber mezzanine soffit and a low seating topography so people occupy the atrium, not just photograph it.",
      "Blackened steel echoes the exterior structure while reclaimed fir softens every touchpoint — handrails, bench, dining shell.",
      "Lighting is mostly architectural: grazers on timber, a single sculptural pendant over dining, and firelight as the evening focal point.",
      "The primary wing peels away for quiet; the atrium remains the social heart for ski days and long winter dinners.",
    ],
    hero: pexels(6899260, 1600),
    gallery: [
      pexels(6899260, 1200),
      pexels(1918291, 1200),
      pexels(3214064, 1200),
      pexels(276724, 1200),
      pexels(1571460, 1200),
      pexels(2029667, 1200),
    ],
    span: "short",
  },
];

export const servicesPage = {
  eyebrow: "What We Offer",
  title: ["Disciplines That", "Shape Every Space"],
  description:
    "From residential living to bespoke furniture and lighting, each discipline is delivered with the same editorial precision.",
};

const serviceIntros: Record<
  string,
  { intro: string; heroImage: string }
> = {
  residential: {
    intro:
      "Private residences designed for how you actually live — proportion, material, and light tuned to daily ritual.",
    heroImage: pexels(1571468, 1600),
  },
  commercial: {
    intro:
      "Hospitality and workplace interiors that feel residential in warmth, commercial in performance.",
    heroImage: pexels(271624, 1600),
  },
  furniture: {
    intro:
      "One-off and limited furniture pieces crafted with ateliers who share our obsession with detail.",
    heroImage: pexels(1866149, 1600),
  },
  lighting: {
    intro:
      "Architectural and decorative light that sculpts atmosphere from morning through evening.",
    heroImage: pexels(2029667, 1600),
  },
  art: {
    intro:
      "Art, objects, and décor curated so every residence feels collected over time — not assembled overnight.",
    heroImage: pexels(3555615, 1600),
  },
};

export type ServiceCategory = (typeof services.tabs)[number] & {
  slug: string;
  intro: string;
  heroImage: string;
};

export function getServiceCategories(): ServiceCategory[] {
  return services.tabs.map((tab) => ({
    ...tab,
    slug: tab.id,
    intro: serviceIntros[tab.id]?.intro ?? "",
    heroImage: serviceIntros[tab.id]?.heroImage ?? tab.items[0]?.image ?? "",
  }));
}

export function getService(slug: string): ServiceCategory | undefined {
  return getServiceCategories().find((s) => s.slug === slug);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getRelatedProjects(slug: string, limit = 3): Project[] {
  return projects.filter((p) => p.slug !== slug).slice(0, limit);
}

export const aboutPage = {
  eyebrow: "The Studio",
  title: ["A Practice Of", "Quiet Luxury"],
  description:
    "Twentyone06 is an interior design studio crafting timeless spaces with elegance, precision, and a deep respect for how people live.",
  story: [
    "We believe luxury is not excess — it is clarity. Every project begins with listening: to the site, to the client, and to the materials that will age with dignity.",
    "Our team moves fluidly between concept, fabrication, and installation, working with trusted artisans so the finished interior feels inevitable rather than assembled.",
    "From private residences to hospitality concepts, the through-line is the same: proportion, tactility, and atmospheres that hold their own over years.",
  ],
  imageA: pexels(1080721, 900),
  imageB: pexels(2724749, 1000),
  cta: "Start a Conversation",
};

export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  image: string;
  body: string[];
  featured?: boolean;
};

export const journalPage = {
  eyebrow: "Our Journal",
  title: ["Notes On Space,", "Material & Living"],
  description:
    "Essays and studio notes on modern elegance, sustainable craft, and the details that make a home endure.",
};

export const journalPosts: JournalPost[] = [
  {
    slug: "enduring-luxury-interiors-designed-to-inspire",
    title: "Enduring Luxury: Interiors Designed to Inspire",
    excerpt:
      "Designed with precision and refined aesthetics, our featured projects showcase modern elegance, functional design, curated textures, bespoke elements, and a timeless sense of luxury.",
    date: "12 Feb 2026",
    tag: "Interior Design",
    image: pexels(276724, 1200),
    featured: true,
    body: [
      "Luxury interiors endure when they are rooted in proportion and material honesty rather than trend cycles.",
      "In our recent residential work we return again and again to the same principles: calm circulation, layered light, and surfaces that invite touch.",
      "The result is a home that photographs beautifully — and more importantly, lives well through seasons of gathering and quiet.",
    ],
  },
  {
    slug: "elevating-modern-living-with-minimalist-elegance",
    title: "Elevating Modern Living with Minimalist Elegance",
    excerpt:
      "How restraint, negative space, and a few considered pieces can elevate everyday living.",
    date: "8 Dec 2025",
    tag: "Residential",
    image: pexels(3990359, 1000),
    body: [
      "Minimalism in our practice is never emptiness — it is editing until only the essential remains.",
      "Furniture silhouettes stay soft, storage disappears into architecture, and art is given room to breathe.",
    ],
  },
  {
    slug: "sustainable-luxury-eco-conscious-interiors",
    title: "Sustainable Luxury: Designing Eco-Conscious Interiors",
    excerpt:
      "Luxury and responsibility can share a room — when materials are chosen with provenance and longevity in mind.",
    date: "25 Jan 2026",
    tag: "Eco Design",
    image: pexels(2440471, 1000),
    body: [
      "We specify reclaimed timber, low-VOC finishes, and textiles with transparent supply chains whenever the brief allows.",
      "Sustainability is also longevity: designing rooms that will not need to be replaced in five years is the most elegant form of conservation.",
    ],
  },
  {
    slug: "the-quiet-power-of-architectural-light",
    title: "The Quiet Power of Architectural Light",
    excerpt:
      "Why layered lighting — not a single chandelier — transforms how a room feels from day into evening.",
    date: "3 Mar 2026",
    tag: "Lighting",
    image: pexels(2029667, 1000),
    body: [
      "Chandeliers can be statements, but atmosphere is built in layers: wash, accent, and task.",
      "Dim scenes and tunable whites let the same room shift from focused work to soft evening gathering without rearranging a single chair.",
    ],
  },
];

export function getPost(slug: string): JournalPost | undefined {
  return journalPosts.find((p) => p.slug === slug);
}

export function getFeaturedPost(): JournalPost {
  return journalPosts.find((p) => p.featured) ?? journalPosts[0];
}
