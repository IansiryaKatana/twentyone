/**
 * Twentyone06, hardcoded content.
 * All imagery is served directly from Pexels' CDN (verified photo IDs).
 */

import { scrapedJournalPosts } from "./journal-posts.generated";
import { scrapedProjects } from "./projects.generated";

export function pexels(id: number, w = 1200): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=${w}`;
}

export const nav = {
  brand: "Twentyone06",
  links: [
    { label: "Home", to: "/" as const },
    { label: "About", to: "/about" as const },
    { label: "Projects", to: "/projects" as const },
    { label: "Services", to: "/services" as const },
    { label: "Our Blogs", to: "/journal" as const },
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

export const partnersSection = {
  title: "Our Clientele",
};

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
  eyebrow: "What We Do",
  title: ["Disciplines That", "Shape Every Space"],
  cta: "See All Services",
  tabs: [
    {
      id: "interior-design",
      label: "Interior Design",
      items: [
        {
          index: "01",
          title: "Hospitality, F&B, and Hotel Interiors",
          description:
            "Full-service interior design for hospitality, F&B, and hotels across the UAE and GCC, from concept through handover.",
          image: pexels(1571468, 1000),
        },
        {
          index: "02",
          title: "Retail and Commercial Space Design",
          description:
            "Commercial and retail environments planned for brand presence, flow, and lasting material performance.",
          image: pexels(271624, 1000),
        },
        {
          index: "03",
          title: "Restaurant and Bar Design",
          description:
            "Dining and bar spaces shaped around guest experience, service flow, and atmosphere that holds through peak service.",
          image: pexels(1918291, 1000),
        },
        {
          index: "04",
          title: "Concept Development and Spatial Planning",
          description:
            "Clear concepts and spatial plans that set proportion, circulation, and material direction before construction begins.",
          image: pexels(1643384, 1000),
        },
        {
          index: "05",
          title: "Construction Documentation and Supervision",
          description:
            "Documentation and on-site supervision so every detail of what was designed is precisely what gets built.",
          image: pexels(1080696, 1000),
        },
      ],
    },
    {
      id: "branding",
      label: "Branding",
      items: [
        {
          index: "01",
          title: "Brand Identity and Visual Systems",
          description:
            "Visual identities, packaging, and systems that reflect the spirit of a space beyond four walls.",
          image: pexels(3184291, 1000),
        },
        {
          index: "02",
          title: "Logo Design and Naming Strategy",
          description:
            "Naming and logo work that gives hospitality, F&B, and retail a clear, consistent voice across the UAE and GCC.",
          image: pexels(3555615, 1000),
        },
        {
          index: "03",
          title: "Signage and Environmental Graphics",
          description:
            "Wayfinding and environmental graphics that extend brand identity into the built environment.",
          image: pexels(2440471, 1000),
        },
        {
          index: "04",
          title: "Brand Guidelines and Asset Libraries",
          description:
            "Guidelines and asset libraries that keep every touchpoint coherent as the brand scales.",
          image: pexels(3990359, 1000),
        },
        {
          index: "05",
          title: "Brand Refresh and Repositioning",
          description:
            "Refresh and repositioning programmes for operators who need a clearer identity without losing what already works.",
          image: pexels(6032424, 1000),
        },
      ],
    },
    {
      id: "design-management",
      label: "Design Management",
      items: [
        {
          index: "01",
          title: "Material Selection and Specification",
          description:
            "Material selection and specification grounded in UAE and GCC market availability, performance, and lead times.",
          image: pexels(276724, 1000),
        },
        {
          index: "02",
          title: "Stakeholder Design Coordination",
          description:
            "Design coordination across all project stakeholders so decisions stay aligned from concept to site.",
          image: pexels(6899260, 1000),
        },
        {
          index: "03",
          title: "On-Site Quality Review and Sign-Off",
          description:
            "On-the-ground quality review and design sign-off across Dubai, the UAE, and the GCC.",
          image: pexels(7018391, 1000),
        },
        {
          index: "04",
          title: "Value Engineering",
          description:
            "Value engineering that protects creative intent while keeping cost and programme under control.",
          image: pexels(6438752, 1000),
        },
        {
          index: "05",
          title: "Cost and Programme Alignment",
          description:
            "Real-time cost and programme alignment so design decisions stay accountable on site.",
          image: pexels(2724749, 1000),
        },
      ],
    },
    {
      id: "design-strategy",
      label: "Design Strategy And Operations",
      items: [
        {
          index: "01",
          title: "Pre-Design Strategic Consultation",
          description:
            "Strategic consultation before drawing begins, clarifying commercial, experiential, and operational goals.",
          image: pexels(1866149, 1000),
        },
        {
          index: "02",
          title: "Space Programming and Viability",
          description:
            "Space programming and commercial viability review for hospitality and F&B operators across the region.",
          image: pexels(2062431, 1000),
        },
        {
          index: "03",
          title: "Guest Experience Mapping",
          description:
            "Guest experience mapping and journey design so the space performs for the people who use it.",
          image: pexels(1571463, 1000),
        },
        {
          index: "04",
          title: "Revenue-Driving Design Frameworks",
          description:
            "Design frameworks that tie spatial decisions to measurable commercial outcomes.",
          image: pexels(1080721, 1000),
        },
        {
          index: "05",
          title: "Post-Occupancy Review",
          description:
            "Post-occupancy review and optimisation so the finished space keeps improving after opening.",
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
  eyebrow: "Our Blogs",
  title: ["Luxury interior spaces crafted", "with elegance, precision, and", "refined aesthetics"],
  body: "Thoughtfully crafted spaces blending elegance, comfort, and functionality to enhance modern living.",
  cta: "View All Articles",
  get featured() {
    const post = scrapedJournalPosts.find((p) => p.featured) ?? scrapedJournalPosts[0];
    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      tag: post.tag,
      image: post.image,
    };
  },
  get posts() {
    const featuredSlug =
      scrapedJournalPosts.find((p) => p.featured)?.slug ?? scrapedJournalPosts[0]?.slug;
    return scrapedJournalPosts
      .filter((p) => p.slug !== featuredSlug)
      .slice(0, 2)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        date: p.date,
        tag: p.tag,
        image: p.image,
      }));
  },
};

export const footer = {
  cta: {
    title: ["Discover Timeless Interiors", "Crafted for Modern Living"],
    members: "50k+ Members Joined Us",
    button: "Start Your Design",
    buttonTo: "/contact",
    avatars: [pexels(1043471, 120), pexels(2379005, 120), pexels(1102341, 120)],
  },
  hiveTitle: "The Hive",
  hiveCta: "Stop by the Studio",
  hiveMapsUrl:
    "https://www.google.com/maps/place/TwentyOne06/@25.113307,55.202634,16z/data=!4m6!3m5!1s0x65e0eb0b9615dd27:0xb05789dd21b237ae!8m2!3d25.1133073!4d55.2026337!16s%2Fg%2F11vjmqd6tl",
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
      title: "Fast Track",
      links: [
        { label: "About Us", to: "/about" },
        { label: "Services", to: "/services" },
        { label: "Projects", to: "/projects" },
        { label: "Press & Awards", to: "/about", hash: "awards" },
        { label: "Blogs", to: "/journal" },
        { label: "FAQ", to: "/faq" },
      ],
    },
  ],
  location: {
    title: "Location",
    lines: [
      "Pearl Coast, Office 304",
      "23rd St, Al Barsha First",
      "Al Barsha, Dubai",
    ],
    callTitle: "Reach Us",
    phone: "04 554 8082",
    phoneHref: "tel:+97145548082",
    email: "info@twentyone06.com",
  },
  newsletter: {
    title: ["We Have News.", "Make Sure You Get It."],
    emailLabel: "Email",
    emailPlaceholder: "Info@twentyone06.com",
    cta: "Count Me In",
    success: "You're in. We'll keep you posted.",
  },
  tagline: "Design by the people, for the people.",
  copyright: "© 2026 TwentyOne06. All rights reserved.",
  legal: [
    { label: "Privacy Policy", to: "/privacy" as const },
    { label: "Terms and Conditions", to: "/terms" as const },
  ],
  wordmark: "Twentyone06",
  wordmarkImages: [pexels(1571460, 800), pexels(1080721, 800), pexels(6899260, 800), pexels(7018391, 800)],
};

export const legalController = {
  name: "TWENTYONE ZERO SIX PROJECT MANAGEMENT (trading as 'TwentyOne06')",
  lines: [
    "Pearl Coast, Office 304, 23rd Street",
    "Al Barsha First, Al Barsha, Dubai",
    "United Arab Emirates",
  ],
  phone: "+971 4 554 8082",
  phoneHref: "tel:+97145548082",
  email: "info@twentyone06.com",
  web: "www.twentyone06.com",
  webHref: "https://www.twentyone06.com",
};

export type FaqItem = {
  q: string;
  a: string;
  link?: { label: string; to: "/services" | "/projects" };
};

export const faqPage = {
  eyebrow: "Help Center",
  title: ["Answers Crafted", "With Clarity"],
  description:
    "Everything you need to know about working with TwentyOne06, from who we are and what we design, to services, timelines, and how to get started.",
  seo: {
    title: "FAQs TwentyOne06 | Interior and Branding Design Firm, Dubai",
    description:
      "Answers to the most common questions about TwentyOne06, Dubai's multi-award winning interior design and branding studio. Interior Design, Branding, Design Project Management, and Design Strategy across the UAE, Saudi Arabia, and Kuwait.",
    keywords: [
      "interior design studio Dubai FAQ",
      "hospitality interior design questions UAE",
      "branding studio Dubai",
      "design project management UAE",
      "full-service design studio GCC",
      "how to start interior design project Dubai",
      "interior design cost Dubai",
      "TwentyOne06 services",
    ],
  },
  categories: [
    {
      id: "about",
      label: "About TwentyOne06",
      items: [
        {
          q: "What is TwentyOne06 and where are we based?",
          a: "TwentyOne06 is a Dubai-based, multi-award-winning interior design and branding studio founded in 2018 by Govind Shepley, Founder and Creative Director.\n\nNamed after the apartment where the business began, TwentyOne06 has grown from a one-person design practice into a full-service studio specialising in hospitality, F&B, hotels, retail, and commercial environments across the UAE and GCC.\n\nToday, we bring together Interior Design, Branding, Design Project Management, and Design Strategy & Operations to create spaces, brands, and experiences built around people and designed to perform.",
        },
        {
          q: "Does TwentyOne06 only do interior design or do we offer other services?",
          a: "We offer four integrated service lines that work together to deliver a seamless project experience:\n• Interior Design\n• Branding\n• Design Project Management\n• Design Strategy & Operations\n\nOur services cover every stage of a project, from concept development and brand positioning to design execution, construction coordination, and post-design support.",
          link: { label: "Explore our services", to: "/services" },
        },
        {
          q: "What makes TwentyOne06 different?",
          a: "What sets TwentyOne06 apart is our ability to bridge design, branding, and project delivery under one roof. Rather than handing over drawings and stepping away, we remain involved throughout the journey, helping clients navigate complex projects with greater clarity, consistency, and confidence. Our approach is built around long-term relationships, operational thinking, and creating spaces that work as well as they look across Dubai, the UAE, and the GCC.",
        },
        {
          q: "What industries does TwentyOne06 work with?",
          a: "We primarily work across hospitality, F&B, hotels, retail, and commercial sectors throughout Dubai, the UAE, and the wider GCC region. Our experience ranges from restaurants and cafés to luxury hotels, retail destinations, workplaces, and customer-focused environments where design plays a critical role in business success.",
          link: { label: "See the work", to: "/projects" },
        },
        {
          q: "What recognition has TwentyOne06 received for its work?",
          a: "We managed to complete 40+ completed projects across Dubai and the UAE. 60+ clients served. 38+ award nominations and 6 confirmed wins across CID MENA, CID Hospitality, Design Middle East, and Luxuri Magazine. Govind Shepley named among the 50 Masters of Design 2026. Clients include Marriott, Jumeirah, Voco Monaco, Double Tree by Hilton and Michelin-starred chef Reif Othman.",
          link: { label: "See the work", to: "/projects" },
        },
      ] satisfies FaqItem[],
    },
    {
      id: "interior-design",
      label: "Interior Design",
      items: [
        {
          q: "What is included in an interior design project with TwentyOne06?",
          a: "Our interior design service covers the full arc of a project, from concept development, space planning, and material selection through to technical drawings, visualisations, construction documentation, and on-site supervision. Every scope is tailored to the project, but our commitment is consistent: what was designed is what gets built.",
        },
        {
          q: "How long does an interior design project take?",
          a: "Timelines vary depending on scale and complexity. A restaurant or F&B interior design project typically runs from 3 to 6 months from brief to handover. A hotel renovation or larger commercial project may run from 6 to 18 months. TwentyOne06 is transparent about timelines from the first conversation, and our Design Project Management service ensures those timelines are protected throughout the build.",
        },
        {
          q: "Can TwentyOne06 manage contractors and consultants during construction?",
          a: "Yes. Through our Design Project Management service, we work directly with contractors, consultants, and suppliers throughout the build, protecting design intent, managing communication, and ensuring the approved design is executed correctly. We do not hand over drawings and disappear.",
        },
        {
          q: "Can TwentyOne06 remain involved after the design phase is complete?",
          a: "Absolutely. Many clients engage TwentyOne06 through construction and fit-out to oversee implementation, coordinate stakeholders, review site progress, and ensure the final result reflects the approved design. Long-term client relationships are a core part of how we work, many of our clients return project after project and refer us to others.",
        },
      ] satisfies FaqItem[],
    },
    {
      id: "branding",
      label: "Branding",
      items: [
        {
          q: "What is included in a branding project with TwentyOne06?",
          a: "Depending on the scope, branding projects include brand strategy and positioning, naming, visual identity design, signage, environmental graphics, brand guidelines, and wayfinding systems. We work across hospitality, F&B, retail, and commercial sectors in Dubai and the UAE, creating brand identities that work inside the space and beyond it.",
        },
        {
          q: "What is the difference between brand strategy and visual identity?",
          a: "Brand strategy defines how your business is positioned, who it serves, and what makes it different. Visual identity brings that strategy to life, through logos, colour systems, typography, and design frameworks. At TwentyOne06, one always informs the other. We do not design logos without understanding the brand behind them.",
        },
        {
          q: "How does TwentyOne06 approach branding for hospitality and F&B businesses?",
          a: "Your space tells a story before anyone reads a word. TwentyOne06's branding practice makes sure that story is the right one, developing visual identities, naming systems, and environmental graphics that give hospitality and F&B businesses across the UAE and GCC a consistent, distinctive voice across every touchpoint, from the logo on the door to the signage on the wall.",
        },
      ] satisfies FaqItem[],
    },
    {
      id: "design-management",
      label: "Design Management",
      items: [
        {
          q: "What is TwentyOne06's Design Management service?",
          a: "TwentyOne06 Design Management service provides expert design oversight, local market knowledge, and on-the-ground accountability for hospitality, F&B, hotel, retail, and commercial projects across Dubai, the UAE, and the GCC. From material specification and design coordination to on-site quality review and final sign-off, we connect client, designer, and contractor under one clear direction. Every decision stays true to the design intent and the standards of the market it is being delivered in.",
        },
        {
          q: "Who is TwentyOne06's Design Management service for?",
          a: "TwentyOne06's Design Management service is for developers, hotel groups, F&B operators, and international brands who need expert design leadership on their project in Dubai, the UAE, or the wider GCC. Whether you are commissioning a full interior design brief with us or bringing an existing design into the region, our team provides the local market expertise, material knowledge, and design accountability your project needs, delivered without compromise.",
        },
        {
          q: "What makes TwentyOne06's Design Management service different?",
          a: "Unlike generalist project management, TwentyOne06's Design Management service is led by design professionals with deep knowledge of UAE and GCC suppliers, materials, and construction standards. Every design decision is informed by both creative expertise and practical local market knowledge, ensuring hospitality, F&B, retail and commercial projects across Dubai, the UAE and wider GCC are delivered on design, on budget, and on brief.",
        },
      ] satisfies FaqItem[],
    },
    {
      id: "design-strategy",
      label: "Design Strategy and Operations",
      items: [
        {
          q: "What is Design Strategy and Operations?",
          a: "Design Strategy and Operations is for clients who need to define what their space needs to achieve before the design process begins. TwentyOne06 works with hospitality and F&B operators across Dubai and the UAE, Saudi Arabia, and Kuwait, to map the guest experience, assess commercial viability, and establish a clear strategic framework, so the design that follows has a purpose and a measurable outcome.",
        },
        {
          q: "Can TwentyOne06 help develop a restaurant or hospitality concept from scratch?",
          a: "Yes. TwentyOne06 supports hospitality and F&B concepts from the earliest stages, helping define the customer experience, operational flow, brand positioning, and interior design direction before a brief is written. This service is particularly valuable for developers, hotel groups, and F&B operators who are launching a new concept and want to get the fundamentals right before committing to design.",
        },
      ] satisfies FaqItem[],
    },
    {
      id: "getting-started",
      label: "Getting Started",
      items: [
        {
          q: "How much does an interior design project cost?",
          a: "Every project is different. Costs depend on scope, scale, complexity, location, and the combination of services required. Following an initial conversation, TwentyOne06 provides a tailored proposal aligned with your project's objectives and budget. We are transparent about fees from the first discussion. No vague estimates, no surprises.",
        },
        {
          q: "How do you design spaces that improve customer experience and commercial performance?",
          a: "We combine design strategy, operational thinking, and a deep understanding of how guests interact with spaces. Every design decision from circulation and spatial flow to material selection and lighting, is considered in terms of how it shapes the guest experience and supports the commercial objectives of the space. This is what we mean when we say we design spaces that perform.",
        },
        {
          q: "How do I start a project with TwentyOne06?",
          a: "The best first step is a conversation. Share a brief outline of your project, the space, the sector, what you are trying to achieve, and any timeline, and we will come back to you. You can reach us through the Let's Talk form on our website, by emailing info@twentyone06.com, or by calling us directly. We work with clients across Dubai, the UAE, Saudi Arabia, Kuwait, and the wider GCC.",
        },
      ] satisfies FaqItem[],
    },
  ],
};

/** Flat list of all FAQ Q&As for JSON-LD FAQPage schema. */
export function getFaqSchemaEntities() {
  return faqPage.categories.flatMap((category) =>
    category.items.map((item) => ({
      "@type": "Question" as const,
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.a,
      },
    }))
  );
}

export const privacyPage = {
  eyebrow: "Legal",
  title: ["Privacy", "Policy"],
  description:
    "How we collect, use, and protect your personal data when you visit our website or engage with TwentyOne06.",
  /** Set when hero art is ready, PageHero will go full-bleed with overlay text. */
  image: undefined as string | undefined,
  controller: legalController,
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      paragraphs: [
        "TwentyOne06 is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, share, and protect your personal data when you visit www.twentyone06.com or engage with our services, and outlines your rights under UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data ('UAE PDPL'). If you have any questions, please contact us at info@twentyone06.com.",
      ],
    },
    {
      id: "who-we-are",
      title: "Who We Are",
      paragraphs: [
        "The data controller responsible for your personal data is TWENTYONE ZERO SIX PROJECT MANAGEMENT, operating under the trading name TwentyOne06, registered in Dubai, United Arab Emirates.",
      ],
      showAddress: true,
    },
    {
      id: "what-we-collect",
      title: "What Personal Data We Collect",
      paragraphs: [
        "We collect personal data when you interact with us. This includes information you provide directly, such as your name, email address, phone number, company name, and project details submitted through our contact forms or by email. When you browse our website, we also collect technical data automatically through cookies and analytics tools, including your IP address, browser type, device information, and pages visited. We may also receive information if you interact with our content on Facebook, Instagram, or LinkedIn. We do not collect sensitive personal data, such as health, biometric, financial, religious, or political information, unless specifically required and with your explicit consent.",
      ],
    },
    {
      id: "how-we-use",
      title: "How We Use Your Personal Data",
      paragraphs: [
        "We use your personal data to respond to your enquiries and discuss potential projects; to manage and deliver our services to clients; to improve our website using anonymised analytics; and to send marketing communications where you have given your consent. You may withdraw your consent for marketing at any time by contacting us at info@twentyone06.com. We also process data where required to comply with applicable UAE law. We do not use your personal data for automated decision-making or profiling.",
      ],
    },
    {
      id: "who-we-share",
      title: "Who We Share Your Data With",
      paragraphs: [
        "TwentyOne06 does not sell, rent, or trade your personal data. We may share it with trusted service providers who support our business operations, such as hosting providers, email platforms, and analytics tools, who are bound to process your data only in accordance with our instructions. We may also share data with professional advisors or with law enforcement and regulatory authorities where required by law. In the event of a business transfer, your data may be transferred to the relevant third party under the same obligations as set out in this policy.",
      ],
    },
    {
      id: "retention",
      title: "How Long We Keep Your Data",
      paragraphs: [
        "We retain your personal data only for as long as necessary. Enquiry data is kept for up to two years from your last contact with us. Client project data is kept for up to seven years following project completion, in line with UAE commercial requirements. Data processed on the basis of consent is kept until you withdraw that consent. Website analytics data is retained in anonymised form for up to 24 months. When no longer needed, your data will be securely deleted or anonymised.",
      ],
    },
    {
      id: "your-rights",
      title: "Your Rights",
      paragraphs: [
        "Under the UAE PDPL, you have the right to access, correct, delete, restrict, or object to the processing of your personal data, and to request a portable copy of your data. To exercise any of these rights, please contact us at info@twentyone06.com. We will respond within 30 days of receipt. Where a request is particularly complex, we may extend this by a further 30 days and will notify you accordingly.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      paragraphs: [
        "Our website uses cookies to improve your browsing experience and analyse traffic. Essential cookies are required for the Website to function. Analytics cookies are used on an anonymised basis. Marketing cookies are only placed with your explicit consent. You can manage your cookie preferences through your browser settings at any time.",
      ],
    },
    {
      id: "security",
      title: "Data Security",
      paragraphs: [
        "TwentyOne06 takes the security of your personal data seriously and implements appropriate technical and organisational measures to protect it against unauthorised access, loss, or disclosure. While we take all reasonable steps to safeguard your data, no electronic transmission or storage is entirely secure. In the event of a data breach, we will notify the UAE Data Office and affected individuals as required by the UAE PDPL.",
      ],
    },
    {
      id: "third-party",
      title: "Third-Party Websites",
      paragraphs: [
        "Our website may link to third-party websites. We are not responsible for their privacy practices and encourage you to review their policies before sharing any personal data with them.",
      ],
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. The date of the most recent update is shown at the top of this page. We encourage you to review it periodically.",
      ],
    },
    {
      id: "contact",
      title: "Contact and Complaints",
      paragraphs: [
        "For questions about this Privacy Policy or to exercise your data rights, please contact us:",
      ],
      showAddress: true,
    },
  ],
};

export const termsPage = {
  eyebrow: "Legal",
  title: ["Terms and", "Conditions"],
  description:
    "The terms that govern your use of the TwentyOne06 website and how we engage with enquiries and services.",
  /** Set when hero art is ready, same treatment as Privacy. */
  image: undefined as string | undefined,
  controller: legalController,
  sections: [
    {
      id: "introduction",
      title: "1. Introduction",
      paragraphs: [
        "Welcome to www.twentyone06.com ('Website'), operated by TWENTYONE ZERO SIX PROJECT MANAGEMENT (trading as 'TwentyOne06'), a full-service interior design and branding studio registered in Dubai, United Arab Emirates under Trade License No. 813936, issued by the Department of Economy and Tourism, Dubai. By accessing or using this Website, you agree to be bound by these Terms and Conditions ('Terms'). If you do not agree to these Terms, please do not continue to use this Website. We reserve the right to amend these Terms at any time, and your continued use of the Website following any amendment constitutes your acceptance of the revised Terms.",
      ],
    },
    {
      id: "intellectual-property",
      title: "2. Intellectual Property",
      paragraphs: [
        "All content published on this Website, including text, project photography, design concepts, graphics, logos, and branding, is the intellectual property of TwentyOne06 or is used with the express permission of the respective rights holders. All such rights are reserved. You may view and print pages from this Website for personal, non-commercial use only, provided that all copyright notices remain intact. Reproduction, distribution, modification, or commercial use of any content without the prior written consent of TwentyOne06 is strictly prohibited.",
      ],
    },
    {
      id: "use-of-website",
      title: "3. Use of This Website",
      paragraphs: [
        "You agree to use this Website only for lawful purposes and in a manner that does not infringe the rights of any third party. You must not use this Website to transmit unsolicited commercial communications, introduce malicious software, attempt to gain unauthorised access to any part of the Website or its systems, copy or extract content without permission, or violate any applicable local, national, or international law or regulation.",
      ],
    },
    {
      id: "enquiries",
      title: "4. Enquiries and Services",
      paragraphs: [
        "Information about TwentyOne06's services on this Website is provided for general information only and does not constitute a binding offer or contract. Submitting an enquiry through our contact form or by email does not create a contractual relationship between you and TwentyOne06. All project engagements are subject to a separate written agreement between TwentyOne06 and the client.",
      ],
    },
    {
      id: "liability",
      title: "5. Disclaimers and Limitation of Liability",
      paragraphs: [
        "The content on this Website is provided in good faith and for general information only. TwentyOne06 makes no warranties, express or implied, regarding the accuracy, completeness, or fitness for purpose of any information on this Website. To the fullest extent permitted by applicable UAE law, TWENTYONE ZERO SIX PROJECT MANAGEMENT shall not be liable for any loss or damage, whether direct, indirect, incidental, or consequential, arising from your use of or reliance on this Website or its content, or from your inability to access the Website. We do not warrant that the Website will be uninterrupted, error-free, or free from viruses or other harmful components.",
      ],
    },
    {
      id: "third-party-links",
      title: "6. Third-Party Links",
      paragraphs: [
        "This Website may contain links to third-party websites for your convenience. TwentyOne06 has no control over the content of those websites and accepts no responsibility for them or for any loss or damage that may arise from your use of them. The inclusion of any link does not imply endorsement by TwentyOne06.",
      ],
    },
    {
      id: "privacy",
      title: "7. Privacy and Data Protection",
      paragraphs: [
        "Your use of this Website is governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand how we collect, use, and protect your information.",
      ],
      link: { label: "Privacy Policy", to: "/privacy" as const },
    },
    {
      id: "severability",
      title: "8. Severability",
      paragraphs: [
        "If any provision of these Terms is found to be invalid, unlawful, or unenforceable, that provision shall be modified or removed to the minimum extent necessary. The remaining provisions shall continue in full force and effect.",
      ],
    },
    {
      id: "governing-law",
      title: "9. Governing Law",
      paragraphs: [
        "These Terms and Conditions shall be governed by and construed in accordance with the laws of the United Arab Emirates, as applied in the Emirate of Dubai. Any disputes shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.",
      ],
    },
    {
      id: "changes",
      title: "10. Changes to These Terms",
      paragraphs: [
        "TwentyOne06 reserves the right to revise these Terms at any time. The date of the most recent revision is shown at the top of this page. Your continued use of the Website following any changes constitutes your acceptance of the revised Terms.",
      ],
    },
    {
      id: "contact",
      title: "11. Contact Us",
      paragraphs: [
        "If you have any questions regarding these Terms and Conditions, please contact us:",
      ],
      showAddress: true,
    },
  ],
};

export const contactPage = {
  eyebrow: "Get in Touch",
  title: ["Let’s Talk!"],
  description:
    "We design spaces for people. Let's start with yours.",
  body:
    "You've seen what we do. Now let's talk about what we can do for you. Whether you have a finished brief or just an idea. Share it with us and we'll take it from there.",
  map: {
    title: "TwentyOne06, Interior Design & Branding",
    embedUrl:
      "https://maps.google.com/maps?q=TwentyOne06%20-%20Interior%20Design%20%26%20Branding&t=m&z=16&output=embed&iwloc=near",
    linkUrl:
      "https://www.google.com/maps/place/TwentyOne06/@25.113307,55.202634,16z/data=!4m6!3m5!1s0x65e0eb0b9615dd27:0xb05789dd21b237ae!8m2!3d25.1133073!4d55.2026337!16s%2Fg%2F11vjmqd6tl",
  },
  image: pexels(1571460, 1400),
  /** Shared with the Services page, both submit as form_name "contact". */
  form: {
    fields: [
      {
        id: "firstName",
        label: "First Name",
        type: "text" as const,
        placeholder: "First name",
        required: true,
      },
      {
        id: "lastName",
        label: "Last Name",
        type: "text" as const,
        placeholder: "Last name",
        required: true,
      },
      {
        id: "email",
        label: "Email Address",
        type: "email" as const,
        placeholder: "Info@twentyone06.com",
        required: true,
      },
      {
        id: "phone",
        label: "Phone Number",
        type: "tel" as const,
        placeholder: "50 000 0000",
        required: false,
      },
      {
        id: "company",
        label: "Company / Restaurant Name",
        type: "text" as const,
        placeholder: "Your company or venue",
        required: true,
      },
      {
        id: "industry",
        label: "Industry",
        type: "select" as const,
        placeholder: "Select industry",
        required: true,
        options: [
          "Hospitality",
          "F&B",
          "Hotels",
          "Retail",
          "Commercial",
          "Other",
        ],
      },
      {
        id: "serviceEnquiry",
        label: "Service Enquiry",
        type: "select" as const,
        placeholder: "Select a service",
        required: true,
        options: [
          "Interior Design",
          "Branding",
          "Design Management",
          "Design Strategy and Operations",
          "Not Sure Yet",
          "All of the Above",
        ],
      },
      {
        id: "message",
        label: "Tell us about your project",
        type: "textarea" as const,
        placeholder:
          "Share as much or as little as you like. We'll take it from there.",
        required: true,
      },
    ],
    submit: "Send Your Brief",
    note: "By submitting, you agree to be contacted by TwentyOne06 regarding your inquiry. We never share your details.",
    thankYouEmail: {
      subject: "Thank You for Getting in Touch",
      body: [
        "Hello,",
        "",
        "Thank you for reaching out to TwentyOne06, Interior and Branding Design Firm.",
        "Every great project starts with a conversation, and we're excited to learn more about yours.",
        "",
        "We've received your submission and will be in touch shortly.",
        "In the meantime, feel free to explore our latest projects and insights.",
        "",
        "We look forward to learning more about your vision.",
        "",
        "Warm regards,",
        "The TwentyOne06 Team",
      ],
    },
  },
  details: [
    {
      label: "Visit",
      lines: [
        "Pearl Coast, Office 304",
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
/*  Catalog pages, projects, services, about, journal                        */
/* -------------------------------------------------------------------------- */

export const projectsPage = {
  seo: {
    title:
      "TwentyOne06 Projects | Full-Service Interior Design Studio, Dubai",
    description:
      "Explore 40+ interior design and branding projects by TwentyOne06, Dubai's multi-award winning full-service design studio. Hospitality, F&B, hotels, retail, and commercial spaces across the UAE and GCC.",
    keywords: [
      "interior design projects Dubai",
      "hospitality design portfolio UAE",
      "F&B interior design Dubai",
      "hotel design UAE",
      "commercial interior design GCC",
      "branding studio portfolio Dubai",
    ],
  },
  hero: {
    eyebrow: "Full-Service Design Studio, Dubai",
    titleLines: [
      { text: "Crafting Spaces", accent: false },
      { text: "Built For People", accent: true },
    ],
    description:
      "From Michelin-starred restaurants to international hotel groups, every space designed to perform, not just to impress.",
    image: pexels(1571460, 1920),
  },
  philosophy: {
    eyebrow: "The Approach",
    title: ["Our", "Philosophy"],
    quote: "Every space tells a story before a single word is spoken.",
    body: "We design spaces that work as hard as they look. Across hospitality, F&B, hotels, retail, and commercial projects in Dubai and the UAE, we have earned the trust of leading hotel groups, Michelin-starred chefs, and major retail brands. Not by following the brief, but by understanding the people behind it. Every space we design is built to shape how guests feel, how long they stay, and whether they come back.",
  },
  portfolio: {
    eyebrow: "Selected Work",
    title: "Our Creations",
  },
  filterGroups: {
    service: {
      label: "Service",
      options: [
        { value: "All", label: "All" },
        { value: "interior-design", label: "Interior Design" },
        { value: "branding", label: "Branding" },
        { value: "design-management", label: "Design Management" },
      ],
    },
    sector: {
      label: "Sector",
      options: [
        { value: "All", label: "All" },
        { value: "F&B", label: "F&B" },
        { value: "Hotels and Hospitality", label: "Hotels and Hospitality" },
        { value: "Retail", label: "Retail" },
        { value: "Commercial", label: "Commercial" },
        { value: "Healthcare", label: "Healthcare" },
        { value: "Workspace", label: "Workspace" },
      ],
    },
    year: {
      label: "Year",
      options: [
        { value: "All", label: "All" },
        { value: "2025", label: "2025" },
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
      ],
    },
    location: {
      label: "Location",
      options: [
        { value: "All", label: "All" },
        { value: "Dubai", label: "Dubai" },
        { value: "Abu Dhabi", label: "Abu Dhabi" },
        { value: "Saudi Arabia", label: "Saudi Arabia" },
        { value: "Kuwait", label: "Kuwait" },
      ],
    },
  },
} as const;

export type ProjectSector =
  | "F&B"
  | "Hotels and Hospitality"
  | "Retail"
  | "Commercial"
  | "Healthcare"
  | "Workspace";

export type Project = {
  slug: string;
  title: string;
  location: string;
  price: string;
  category: "Residential" | "Hospitality" | "Commercial";
  /** Portfolio sector filter, derived when omitted */
  sector?: ProjectSector;
  /** Service slugs this project showcases, used by /projects?service=… */
  services: Array<
    | "interior-design"
    | "branding"
    | "design-management"
    | "design-strategy"
  >;
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

/** Resolve sector for filtering when CMS/seed omits an explicit value. */
export function getProjectSector(project: Project): ProjectSector | undefined {
  if (project.sector) return project.sector;
  const types = project.typologies.join(" ").toLowerCase();
  if (/dining|restaurant|f&b|bar|cafe|café/.test(types)) return "F&B";
  if (/retail|shop|store/.test(types)) return "Retail";
  if (/health|clinic|hospital|medical/.test(types)) return "Healthcare";
  if (/office|workspace|hq|headquarters/.test(types)) return "Workspace";
  if (project.category === "Hospitality") return "Hotels and Hospitality";
  if (project.category === "Commercial") return "Commercial";
  return undefined;
}

export const projects: Project[] = [...scrapedProjects] as unknown as Project[];

export const servicesPage = {
  eyebrow: "Services",
  title: ["Where Vision", "Meets Craft"],
  description:
    "The studio behind Dubai's most talked-about hospitality and F&B spaces, from the first brief to the final handover, and everything in between.",
  heroImage: pexels(1571468, 1800),
  seo: {
    title:
      "TwentyOne06 Services | Interior Design, Branding, Design Management & Strategy, Dubai",
    description:
      "TwentyOne06 offers 4 integrated design services, Interior Design, Branding, Design Management, and Design Strategy and Operations, across hospitality, F&B, hotels, retail, and commercial spaces in Dubai, the UAE, Saudi Arabia, and Kuwait.",
    keywords: [
      "interior design services Dubai",
      "branding studio Dubai",
      "design management UAE",
      "design strategy hospitality Dubai",
      "full-service design studio GCC",
      "hospitality interior design firm Dubai",
      "F&B interior design UAE",
      "hotel interior design Dubai",
      "retail interior design GCC",
      "commercial design firm Dubai",
    ],
  },
  contact: {
    title: "Let’s Talk!",
    eyebrow: "We design spaces for people. Let's start with yours.",
    body: "You've seen what we do. Now let's talk about what we can do for you. Whether you have a finished brief or just an idea. Share it with us and we'll take it from there.",
  },
  sections: [
    {
      id: "interior-design",
      index: "01",
      serviceLabel: "Service 1",
      tabLabel: "Interior Design",
      title: "Interior Design",
      titleLines: ["Interior", "Design"],
      body: [
        "TwentyOne06 is a multi-award winning interior design firm in Dubai, specialising in hospitality, F&B, hotel, retail, and commercial spaces.",
        "40+ projects across Dubai, the UAE, and the GCC, from Michelin-starred restaurants to international hotel groups. We cover every stage, every sector, and every detail from the first brief to the final handover.",
      ],
      bullets: [
        "Hospitality and F&B interior design, Dubai and UAE",
        "Hotel and resort interior design, GCC",
        "Retail and commercial space design",
        "Restaurant and bar interior design",
        "Concept development and spatial planning",
        "Construction documentation and on-site supervision",
      ],
      cta: "Let's Design Your Space",
      ctaTo: "/projects" as const,
      ctaSearch: { service: "interior-design" },
      image: pexels(1571468, 1400),
    },
    {
      id: "branding",
      index: "02",
      serviceLabel: "Service 2",
      tabLabel: "Branding",
      title: "Branding",
      titleLines: ["Branding"],
      body: [
        "Your space tells a story, and we make sure it tells the right one. We develop branding strategies that extend from logos and signage to environmental graphics and wayfinding systems, giving every touchpoint a consistent, distinctive voice.",
      ],
      bullets: [
        "Brand identity and visual systems",
        "Logo design and naming strategy",
        "Signage and environmental graphics",
        "Brand guidelines and asset libraries",
        "Brand refresh and repositioning",
      ],
      cta: "Let's Build Your Brand",
      ctaTo: "/projects" as const,
      ctaSearch: { service: "branding" },
      image: pexels(3184291, 1400),
    },
    {
      id: "design-management",
      index: "03",
      serviceLabel: "Service 3",
      tabLabel: "Design Management",
      title: "Design Management",
      titleLines: ["Design", "Management"],
      body: [
        "Excellence in execution requires meticulous oversight. We add local market expertise to your team, connecting client, designer, and contractor under one clear direction, and bringing the leadership and accountability your project needs to be delivered without compromising on quality or creativity.",
      ],
      bullets: [
        "Material selection and specification",
        "Design coordination and quality control",
        "Value engineering without compromising design intent",
        "Local market and supplier knowledge, UAE and GCC",
        "Cost and programme alignment",
      ],
      cta: "Let's Manage Your Design",
      ctaTo: "/projects" as const,
      ctaSearch: { service: "design-management" },
      image: pexels(271624, 1400),
    },
    {
      id: "design-strategy",
      index: "04",
      serviceLabel: "Service 4",
      tabLabel: "Design Strategy & Operations",
      title: "Design Strategy And Operations",
      titleLines: ["Design Strategy", "And Operations"],
      body: [
        "Before a single line is drawn, the most important decisions are already being made. TwentyOne06's Design Strategy and Operations service helps hospitality and F&B operators across Dubai, the UAE, and the GCC, define what their space needs to achieve, commercially, experientially, and operationally, before the design process begins. From space programming and guest experience mapping to revenue-driven design frameworks, we ensure creative ambition and business reality stay aligned from day one.",
      ],
      bullets: [
        "Pre-design strategic consultation, UAE and GCC",
        "Space programming and commercial viability",
        "Guest experience mapping and journey design",
        "Revenue-driven design frameworks",
        "Post-occupancy review and optimisation",
      ],
      cta: "Plan With Us",
      ctaHref: "#lets-talk",
      image: pexels(1866149, 1400),
    },
  ],
};

const serviceIntros: Record<
  string,
  { intro: string; heroImage: string }
> = {
  "interior-design": {
    intro:
      "TwentyOne06 is a multi-award winning interior design firm in Dubai, specialising in hospitality, F&B, hotel, retail, and commercial spaces. 40+ projects across Dubai, the UAE, and the GCC, from Michelin-starred restaurants to international hotel groups.",
    heroImage: pexels(1571468, 1600),
  },
  branding: {
    intro:
      "Your space tells a story, and we make sure it tells the right one. Branding strategies from logos and signage to environmental graphics and wayfinding, every touchpoint with a consistent, distinctive voice.",
    heroImage: pexels(3184291, 1600),
  },
  "design-management": {
    intro:
      "Excellence in execution requires meticulous oversight. We add local market expertise to your team, connecting client, designer, and contractor under one clear direction across Dubai, the UAE, and the GCC.",
    heroImage: pexels(271624, 1600),
  },
  "design-strategy": {
    intro:
      "Before a single line is drawn, the most important decisions are already being made. Design Strategy and Operations helps hospitality and F&B operators define commercial, experiential, and operational outcomes before design begins.",
    heroImage: pexels(1866149, 1600),
  },
};

export type ServiceCategory = (typeof services.tabs)[number] & {
  slug: string;
  intro: string;
  heroImage: string;
  /** Homepage / admin card fields */
  indexLabel: string;
  title: string;
  description: string;
  detail: string;
  bullets: string[];
  cta: string;
  image: string;
};

export function getServiceCategories(): ServiceCategory[] {
  const pageBySlug = Object.fromEntries(
    servicesPage.sections.map((section) => [section.id, section]),
  );

  return services.tabs.map((tab, i) => {
    const page = pageBySlug[tab.id];
    return {
      ...tab,
      slug: tab.id,
      intro: serviceIntros[tab.id]?.intro ?? page?.body.join(" ") ?? "",
      heroImage:
        serviceIntros[tab.id]?.heroImage ??
        page?.image ??
        tab.items[0]?.image ??
        "",
      indexLabel: page?.index ?? String(i + 1).padStart(2, "0"),
      title: page?.title ?? tab.label,
      description: page?.body[0] ?? tab.items[0]?.description ?? "",
      detail: page?.body.join("\n\n") ?? "",
      bullets: page?.bullets ? [...page.bullets] : [],
      cta: page?.cta ?? "",
      image: page?.image ?? tab.items[0]?.image ?? "",
    };
  });
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
  title: ["About Us"],
  seo: {
    title:
      "About TwentyOne06, Full-Service Interior Design Firm, Dubai",
    description:
      "TwentyOne06 is a multi-award winning interior design and branding firm in Dubai. Founded by Govind Shepley, 50 Masters of Design 2026. Serving hospitality, F&B, hotels, retail, and commercial clients across the UAE and GCC.",
    keywords: [
      "interior design studio Dubai",
      "about TwentyOne06",
      "Govind Shepley interior design",
      "full-service design studio UAE",
      "hospitality design firm Dubai",
    ],
  },
  storyTitle: [
    "It Started in Apartment 2106.",
    "It Hasn't Stopped Since.",
  ],
  story: [
    "In 2018, Govind Shepley turned apartment 2106 into the starting point for what would become one of the most recognised full-service interior design studios in Dubai and across the UAE. What began with a single project and one clear conviction, that great design starts with people, has since grown into a multi-award winning studio trusted by Michelin-starred chefs, international hotel groups, and leading retail brands across the region.",
    "TwentyOne06 now operates across four integrated service lines, Interior Design, Branding, Design Project Management, and Design Strategy and Operations, covering the full arc of a project from the very first brief to handover, and in many cases, well beyond it.",
  ],
  recognition:
    "Govind's recognition among the 50 Masters of Design 2026 is proof that the industry has noticed. Not just for the work, but for how he leads, through trust, authenticity, and an unwavering commitment to raising the standard of design across the Middle East.",
  recognitionCredits:
    "50 Masters of Design 2026  ·  CID Power 50 (2021, 2022)  ·  Design Middle East Powerlist Creative 30 (2022, 2024, 2025)  ·  Design Middle East Cover, January 2025",
  imageA: pexels(1080721, 900),
  imageB: pexels(2724749, 1000),
  cta: "Let Us Design Your Story",
  team: {
    eyebrow: "The Studio",
    title: "Our Team",
    description: "The people behind the work.",
  },
  milestones: {
    title: ["Milestones We're", "Proud Of."],
    body: "We have spent 7 years doing the work that earns the numbers, not the other way around. We don't measure success in square metres. We measure it in spaces that open on time, clients who come back, and awards that prove the work speaks for itself.",
    stats: [
      { value: 40, suffix: "+", label: "Successful Projects" },
      { value: 60, suffix: "+", label: "Clients Served" },
      { value: 38, suffix: "+", label: "Award Nominations" },
    ],
  },
  workTogether: {
    title: ["Got a project", "in mind?"],
    body: "Tell us about it. We'll take it from there.",
    cta: "Let's Talk",
    ctaTo: "/contact" as const,
  },
  awardsSection: {
    title: "Awards & Recognition",
    description:
      "Multi-award winning across interior design, hospitality, retail, and commercial sectors in the UAE and GCC.",
  },
  whySection: {
    title: "Why TwentyOne06",
  },
};

export type WhyUsItem = {
  title: string;
  body: string;
};

export const whyUsItems: WhyUsItem[] = [
  {
    title: "People-First. Always.",
    body: "Every design starts with the people who will use the space. Not the brief. Not the budget. The people.",
  },
  {
    title: "Multi-Award Winning",
    body: "Locally and internationally recognised across CID MENA, CID Hospitality, Design Middle East, and Luxuri Magazine. 38+ nominations. 6 confirmed wins.",
  },
  {
    title: "Client-Centric by Design",
    body: "We adapt to each client's vision, timeline, and constraints, and we stay accountable throughout, not just at handover.",
  },
  {
    title: "Research-Led, Result-Driven",
    body: "Our designs are grounded in real market knowledge. We understand F&B, hospitality, and commercial sectors from the inside.",
  },
  {
    title: "Designed to Perform.",
    body: "We design with functionality, durability, and operational efficiency at the centre. Beautiful is the baseline. Functional is the standard.",
  },
  {
    title: "Full-Service. One Studio.",
    body: "Interior Design, Branding, Design Project Management, and Design Strategy. One team, four service lines, one accountable partner.",
  },
];

export type AwardStatus = "winner" | "highly_commended" | "shortlisted" | "editorial";

export type Award = {
  status: AwardStatus;
  title: string;
  href?: string;
};

export const awards: Award[] = [
  { status: "winner", title: "CID Awards 2024 MENA, Interior Design Concept of the Year, Hotel  ·  Voco Monaco", href: "https://www.commercialinteriordesign.com/events/all-the-winners-from-cid-awards-2024-mena" },
  { status: "winner", title: "CID Awards 2024 MENA, Design Concept of the Year, Retail, Leisure and Education  ·  ELIX Spa", href: "https://www.commercialinteriordesign.com/events/all-the-winners-from-cid-awards-2024-mena" },
  { status: "winner", title: "CID Awards 2025 Hospitality, Best Use of Materials  ·  Flaky Pastry, The Galleria", href: "https://www.commercialinteriordesign.com/news/winners-from-the-cid-awards-2025-hospitality" },
  { status: "winner", title: "CID Awards 2025 MENA, Retail Design of the Year  ·  Cheese Board, Bluewaters Island", href: "/journal/retail-design-to-young-talent-twentyone06-celebrates-double-victory-at-cid-awards-mena-2025" },
  { status: "winner", title: "Design Middle East Awards 2025, Healthcare Project of the Year  ·  Dental Nation", href: "https://design-middleeast.com/design-middle-east-awards-2025-winners-revealed/" },
  { status: "winner", title: "Luxuri Magazine 2025, Best Storytelling-Driven Hospitality Design Studio, Dubai", href: "https://www.luxurimag.com/award-winner-2025/twentyone06/" },
  { status: "highly_commended", title: "Design Middle East Awards 2024, Interior Designer of the Year  ·  Govind Shepley", href: "https://design-middleeast.com/design-middle-east-awards-2024-winners-revealed/" },
  { status: "highly_commended", title: "CID Awards 2024 MENA, Best Casual Restaurant Design  ·  Nama Yoso", href: "https://www.commercialinteriordesign.com/events/all-the-winners-from-cid-awards-2024-mena" },
  { status: "highly_commended", title: "CID Awards 2024 MENA, Best Hotel Design  ·  Voco Monaco", href: "https://www.commercialinteriordesign.com/events/all-the-winners-from-cid-awards-2024-mena" },
  { status: "highly_commended", title: "CID Awards 2024 MENA, Best Spa/Wellness Design  ·  ELIX Spa", href: "https://www.commercialinteriordesign.com/events/all-the-winners-from-cid-awards-2024-mena" },
  { status: "highly_commended", title: "CID Awards 2025 Hospitality, Best Bar/Lounge Design  ·  Observatory Lounge", href: "https://www.commercialinteriordesign.com/news/winners-highly-commended-the-cid-awards-2025-hospitality" },
  { status: "highly_commended", title: "CID Awards 2025 Hospitality, Best Casual Restaurant Design  ·  Flaky Pastry", href: "https://www.commercialinteriordesign.com/news/winners-highly-commended-the-cid-awards-2025-hospitality" },
  { status: "highly_commended", title: "CID Awards 2025 Hospitality, Hospitality Design Firm of the Year", href: "https://www.commercialinteriordesign.com/news/winners-highly-commended-the-cid-awards-2025-hospitality" },
  { status: "highly_commended", title: "CID Awards 2025 Hospitality, Hospitality Designer of the Year  ·  Govind Shepley", href: "https://www.commercialinteriordesign.com/news/winners-highly-commended-the-cid-awards-2025-hospitality" },
  { status: "highly_commended", title: "CID Awards 2026 Hospitality, Rising Star of the Year  ·  Sabiha Yusuf", href: "https://www.commercialinteriordesign.com/events/cid-awards/cid-hospitality-awards-2026-winners-highly-commended" },
  { status: "shortlisted", title: "CID Awards 2024 MENA, Boutique Firm of the Year", href: "https://www.commercialinteriordesign.com/events/cid-awards/revealed-the-cid-awards-2024-mena-shortlist" },
  { status: "shortlisted", title: "CID Awards 2024 Hospitality, Best Casual and Best High-End Restaurant  ·  Nama Yoso", href: "https://www.commercialinteriordesign.com/events/cid-awards/every-shortlist-for-the-cid-awards-2024-hospitality-revealed" },
  { status: "shortlisted", title: "Design Middle East Awards 2024, Interior Design Firm of the Year", href: "https://design-middleeast.com/shortlist-revealed-design-middle-east-awards-2024/" },
  { status: "shortlisted", title: "Design Middle East Awards 2024, Boutique Firm of the Year", href: "https://design-middleeast.com/shortlist-revealed-design-middle-east-awards-2024/" },
  { status: "shortlisted", title: "CID Awards 2025 Hospitality, Best Bar/Lounge Design  ·  Observatory Lounge", href: "https://www.commercialinteriordesign.com/events/revealed-every-shortlist-in-cid-awards-2025-hospitality" },
  { status: "shortlisted", title: "CID Awards 2025 Hospitality, Best Casual Restaurant Design  ·  Flaky Pastry, Abu Dhabi", href: "https://www.commercialinteriordesign.com/events/revealed-every-shortlist-in-cid-awards-2025-hospitality" },
  { status: "shortlisted", title: "CID Awards 2025 Hospitality, Best F&B Franchise Design  ·  Flaky Pastry Dubai", href: "https://www.commercialinteriordesign.com/events/revealed-every-shortlist-in-cid-awards-2025-hospitality" },
  { status: "shortlisted", title: "CID Awards 2025 Hospitality, Best F&B Design Concept  ·  Cheese Board", href: "https://www.commercialinteriordesign.com/events/revealed-every-shortlist-in-cid-awards-2025-hospitality" },
  { status: "shortlisted", title: "CID Awards 2025 Hospitality, Hospitality Designer of the Year  ·  Govind Shepley", href: "https://www.commercialinteriordesign.com/events/revealed-every-shortlist-in-cid-awards-2025-hospitality" },
  { status: "shortlisted", title: "CID Awards 2025 MENA, Interior Design of the Year, Health and Wellness  ·  Dental Nation", href: "https://www.commercialinteriordesign.com/events/the-shortlist-cid-awards-2025-mena" },
  { status: "shortlisted", title: "Design Middle East Awards 2025, Boutique Firm of the Year" },
  { status: "shortlisted", title: "Design Middle East Awards 2025, Commercial Project of the Year  ·  Knowledge Academy Office" },
  { status: "editorial", title: "CID Power 50, Govind Shepley, Top 20 Designers of the Year (2021)", href: "https://www.commercialinteriordesign.com/news/power-50-of-design-industry" },
  { status: "editorial", title: "CID Power 50, Govind Shepley, Top 20 Designers of the Year (2022)", href: "https://www.commercialinteriordesign.com/news/commercial-interior-design-power-50-top-20-designers-of-2022" },
  { status: "editorial", title: "Design Middle East Powerlist Creative 30 (2022)", href: "https://design-middleeast.com/powerlist-creative-30-2022-govind-shepley-founder-and-creative-director-twentyone06/" },
  { status: "editorial", title: "Design Middle East Powerlist Creative 30 (2024)", href: "https://design-middleeast.com/powerlist-creative-30-2024-govind-shepley-founder-and-creative-director-twentyone06/" },
  { status: "editorial", title: "Design Middle East Cover Feature, January 2025", href: "https://design-middleeast.com/twentyone06-a-bold-leap-into-2025/" },
  { status: "editorial", title: "The 50 Masters of Design 2026", href: "https://www.linkedin.com/feed/update/urn:li:activity:7460946394183389184/" },
];

export type TeamMember = {
  name: string;
  title: string;
  image: string;
  linkedin: string;
  instagram?: string;
};

/** Static fallback until CMS portraits are uploaded in admin. */
export const teamMembers: TeamMember[] = [
  {
    name: "Mike Kobzar",
    title: "Brand Director",
    image: "",
    linkedin: "https://www.linkedin.com/in/mike-kobzar-35b926107/",
    instagram: "https://www.instagram.com/thebearhands/",
  },
  {
    name: "Clarice Tungol",
    title: "Interior Design Manager",
    image: "",
    linkedin: "https://www.linkedin.com/in/clarice-t-912862122/",
  },
  {
    name: "Sabiha Yusuf Timalia",
    title: "Interior Designer",
    image: "",
    linkedin: "https://www.linkedin.com/in/sabihayusuf/",
  },
  {
    name: "Janell Voi Cipriano",
    title: "Technical Design Manager",
    image: "",
    linkedin: "",
  },
  {
    name: "Minerva Farag",
    title: "Marketing Manager",
    image: "",
    linkedin: "https://www.linkedin.com/in/minerva-farag-00356087/",
    instagram: "https://www.instagram.com/minervafarag/",
  },
];

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
  eyebrow: "Our Blogs",
  title: ["Blogs"],
  breadcrumb: [
    { label: "Home", to: "/" as const },
    { label: "Blogs" },
  ],
};

export const journalPosts: JournalPost[] = scrapedJournalPosts;

export function getPost(slug: string): JournalPost | undefined {
  return journalPosts.find((p) => p.slug === slug);
}

export function getFeaturedPost(): JournalPost {
  return journalPosts.find((p) => p.featured) ?? journalPosts[0];
}

/* -------------------------------------------------------------------------- */
/*  Homepage (/), reference layout using existing brand content               */
/* -------------------------------------------------------------------------- */

export const newHome = {
  seo: {
    title: "Twentyone06, Design by the People, for the People",
    description:
      "Twentyone06 creative design studio, interiors, branding, and bold hospitality experiences across Dubai and the UAE.",
    keywords: [
      // Primary, high intent
      "interior design company Dubai",
      "interior design studio Dubai",
      "interior design studio Firm",
      "full-service interior design agency Dubai",
      "award winning interior design Dubai",
      "hospitality interior design Dubai",
      "restaurant interior design Dubai",
      "hotel interior design Dubai",
      "commercial interior design Dubai",
      "retail interior design Dubai",
      "F&B interior design Dubai",
      "branding studio Dubai",
      // Secondary, service-specific
      "interior design management Dubai",
      "design strategy consultancy Dubai",
      "brand identity design Dubai",
      "space planning Dubai",
      "concept design hospitality UAE",
      "interior branding agency Dubai",
      // Long-tail, blog and content SEO
      "best interior design studio Dubai",
      "hospitality design firm UAE",
      "luxury hotel interior design Dubai",
      "F&B restaurant design UAE",
      "design firm for developers Dubai",
      // GCC secondary, Saudi Arabia and Kuwait
      "interior design company Saudi Arabia",
      "interior design studio Riyadh",
      "hospitality interior design Jeddah",
      "commercial interior design Saudi Arabia",
      "interior design firm Kuwait",
      "hospitality design GCC",
      "full service interior design Middle East",
      "design studio UAE GCC",
    ],
  },
  hero: {
    eyebrow: "Creative Design Studio",
    titleLines: [
      { before: "Design by the ", accent: "People." },
      { before: "For the ", accent: "People." },
    ],
    description:
      "Dubai's multi-award winning\ninterior design and branding studio.",
    sectors: "Hospitality  ·  F&B  ·  Hotels  ·  Retail  ·  Commercial",
    ctas: [
      { label: "See Our Work", to: "/projects" as const },
      { label: "Let's Talk", to: "/contact" as const },
    ],
    image: pexels(3184291, 1920),
    rail: [
      { label: "Years of Craft", value: "10+" },
      { label: "Projects Delivered", value: "50+" },
      { label: "Clients Worldwide", value: "50K+" },
    ],
  },
  philosophy: {
    eyebrow: "The Twentyone06 Philosophy",
    title: ["We Design For", "People."],
    body: "Every space we design starts with a question: what does this need to do for the people using it? Not aesthetically. Commercially. Experientially. Operationally. In hospitality, F&B, and retail, the design is not decoration. It is the reason guests stay longer, come back, and bring others. We design with that understanding at the centre of every brief, bold where it counts, precise where it matters, and always in service of the people the space is built for.",
    /** Word in `body` rendered in brand red on desktop. */
    bodyAccent: "is",
    cta: about.cta,
    ctaTo: "/about" as const,
    image: pexels(2379005, 1200),
  },
  services: {
    eyebrow: "What We Do",
    title: "Services",
    cta: "View All Services",
    ctaTo: "/services" as const,
    items: [
      {
        index: "01",
        slug: "interior-design",
        title: "Interior Design",
        description:
          "Multi-award winning interior design for hospitality, F&B, hotel, retail, and commercial spaces across Dubai and the GCC.",
        detail:
          "TwentyOne06 is a multi-award winning interior design firm in Dubai, specialising in hospitality, F&B, hotel, retail, and commercial spaces. 40+ projects across Dubai, the UAE, and the GCC, from Michelin-starred restaurants to international hotel groups. We cover every stage, every sector, and every detail from the first brief to the final handover.",
        bullets: [
          "Hospitality and F&B interior design, Dubai and UAE",
          "Hotel and resort interior design, GCC",
          "Retail and commercial space design",
          "Restaurant and bar interior design",
          "Concept development and spatial planning",
          "Construction documentation and on-site supervision",
        ],
        cta: "Let's Design Your Space",
        image: pexels(1571468, 900),
      },
      {
        index: "02",
        slug: "branding",
        title: "Branding",
        description:
          "Branding strategies from logos and signage to environmental graphics, every touchpoint with a consistent voice.",
        detail:
          "Your space tells a story, and we make sure it tells the right one. We develop branding strategies that extend from logos and signage to environmental graphics and wayfinding systems, giving every touchpoint a consistent, distinctive voice.",
        bullets: [
          "Brand identity and visual systems",
          "Logo design and naming strategy",
          "Signage and environmental graphics",
          "Brand guidelines and asset libraries",
          "Brand refresh and repositioning",
        ],
        cta: "Let's Build Your Brand",
        image: pexels(3184291, 900),
      },
      {
        index: "03",
        slug: "design-management",
        title: "Design Management",
        description:
          "Local market expertise connecting client, designer, and contractor under one clear direction.",
        detail:
          "Excellence in execution requires meticulous oversight. We add local market expertise to your team, connecting client, designer, and contractor under one clear direction, and bringing the leadership and accountability your project needs to be delivered without compromising on quality or creativity.",
        bullets: [
          "Material selection and specification",
          "Design coordination and quality control",
          "Value engineering without compromising design intent",
          "Local market and supplier knowledge, UAE and GCC",
          "Cost and programme alignment",
        ],
        cta: "Let's Manage Your Design",
        image: pexels(271624, 900),
      },
      {
        index: "04",
        slug: "design-strategy",
        title: "Design Strategy And Operations",
        description:
          "Define what a space must achieve commercially, experientially, and operationally before a single line is drawn.",
        detail:
          "Before a single line is drawn, the most important decisions are already being made. TwentyOne06's Design Strategy and Operations service helps hospitality and F&B operators across Dubai, the UAE, and the GCC, define what their space needs to achieve, commercially, experientially, and operationally, before the design process begins. From space programming and guest experience mapping to revenue-driven design frameworks, we ensure creative ambition and business reality stay aligned from day one.",
        bullets: [
          "Pre-design strategic consultation, UAE and GCC",
          "Space programming and commercial viability",
          "Guest experience mapping and journey design",
          "Revenue-driven design frameworks",
          "Post-occupancy review and optimisation",
        ],
        cta: "Plan With Us",
        image: pexels(1866149, 900),
      },
    ],
  },
  projects: {
    eyebrow: "Our Work",
    title: "Our Creations",
    cta: "Explore all projects",
    ctaTo: "/projects" as const,
  },
  clients: {
    eyebrow: "Trusted by Visionaries",
  },
  testimonialSection: {
    title: "Our Testimonials",
  },
  journal: {
    title: "We Have News!",
    description:
      "Our take on project reveals, award wins, and the design conversations worth the read.",
    cta: "View All Articles",
    ctaTo: "/journal" as const,
    tabs: [
      {
        id: "whats-new" as const,
        label: "What's New",
        description:
          "Studio updates, project features, and news from TwentyOne06.",
      },
      {
        id: "trend-reports" as const,
        label: "Trend Reports",
        description:
          "Industry research and design insights from our team.",
      },
    ],
  },
  testimonials: [
    {
      quote:
        "The team exceeded our expectations with their exceptional design and development skills. They truly understood our vision and brought it to life. We couldn’t be happier with the final product.",
      name: "Steven Batchelor Frios",
      role: "Managing Director . UN!Que Project Solutions",
      image: "",
    },
    {
      quote:
        "We had the pleasure of working with TwentyOne06 on an office project in Al Barsha. They are a fantastic team of professionals with amazing creativity. The project looks spectacular, we would highly recommend it if your’re looking for a unique and stand-out interior design team.",
      name: "Havelock One Interiors",
      role: "",
      image: "",
    },
    {
      quote:
        "We recently had the privilege of working with TwentyOne06, and we must say, it was an exceptional experience from start to finish. They brought a level of professionalism and creativity that exceeded our expectations. Working with TwentyOne06 was an absolute pleasure! Their Professionalism, creativity, and attention to detail made our collaboration seamless and enjoyable. I highly recommend them for any design project.",
      name: "Lylux Lighting Group",
      role: "",
      image: "",
    },
    {
      quote:
        "Recently had the pleasure of working with TwentyOne06, and i can confidently say they are a fantastic design company. Their commitment to authenticity and quality is evident in every aspect of their work. The team is not only highly professional but also incredibly responsive, making the entire process seamless and enjoyable. From the initial consultation to final delivery, TwentyOne06 exceeded my expectations. Their innovative designs reflect a deep understanding of client needs and current trends, resulting in truly unique and impactful solutions. If you’re looking for a design partner who values excellence and creativity, I wholeheartedly recommend TwentyOne06. They are a cut above the rest.",
      name: "James Knight Pacheco",
      role: "Co-Founder/Chef/Host . the Chef JKP Podcast / Culinary Consultant",
      image: "",
    },
    {
      quote:
        "The process of collaborating with TwentyOne06 began with them getting to know me personally and understanding where I am coming from. They adapted to my expectations while adding their own unique design input. it was a challenge for TwentyOne06 because many restaurant designers tend to replicate designs, but they didn’t. instead, they transformed the design into what it is today, which is commendable.",
      name: "Reif Othman",
      role: "Owner . Hotaru Holdings",
      image: "",
    },
    {
      quote:
        "It was a true pleasure working with TwentyOne06. Govind and his team have successfully combined our vision with their expertise and experienceto come up not only with an innovative design but most importantly a functional space whilst maximizing our resources. throughout the entire design process, TwentyOne06’s attention to detail was second to none. They were professional, flexible and understood every facet of what we wanted to capture in great detail",
      name: "Kishore Sathar",
      role: "General manager . Dusit Thani Hotel",
      image: "",
    },
    {
      quote:
        "As a seasoned F&B operator I’ve had the pleasure to have worked with the best in class pertaining to design specialists. 2106 in my opinion would be considered as best in class.... Govind and his team have demonstrated the ability to understand our vision and interpreted this in to reality. Its also worth mentioning that their ability to adapt to change is commendable and their ability to manage the appointed contractor is substantiated with depth of knowledge in materials and market trends as well as keeping our “the Client” interest at the forefront of the projects 2106 have managed for Sarood Hospitality. On behalf of Sarood I would like to thank Govind and the 2106 team for their services conducted to help drive Flow and The Noodle House Brands.",
      name: "Steven Holloway",
      role: "Contractors Direct . CEO",
      image: "",
    },
    {
      quote:
        "TwentyOne06 was the visionary force behind Reif & Tero, meticulously designing an extraordinary culinary haven that offers diners an unparalleled gastronomic experience. Light Link worked tirelessly with the team at TwentyOne06, to create 2 very different styles of dining experience for Reif Othman in the new Dubai Hills location, and WE LOVE IT! From taking initial sketches and samples of tea brushes through to truly bespoke light fittings, custom neon pendants, and wall sconces all dreamt up in the mind of Govind Shepley and the team, were brought to life by our designers and custom partners.",
      name: "David Cook",
      role: "Contractors Direct . CEO",
      image: "",
    },
    {
      quote:
        "Working with Govind and Studio TwentyOne06 has eased the processes between the client, contractor and design team alike. The clear and detailed design has aided us to execute the design intent and deliver to the agreed timetable. It’s a credit to their design teams’ understanding of the client’s business requirements, knowledge of the F&B industry and more importantly in sourcing local finishes to stay in line with Capex budget is certainly music to our ears! We’re always glad to work alongside Studio TwentyOne06 projects.",
      name: "Esam Bacoush",
      role: "Associate Director . Dif Interiors",
      image: "",
    },
    {
      quote:
        "I had the pleasure of working with Govind Shepley, Mike, Hannah, Sabiha and Satinder on Voco Monaco Lobby renovation and ELIX Spa. TwentyOne06’s creativity, hard work, passion and patience is truly inspiring on all project portfolios we collaborate on. Well done to you all!",
      name: "Marwa Sharaky",
      role: "Senior Design Manager . Kleindienst Group (Voco Monaco, Elix Spa)",
      image: "",
    },
    {
      quote:
        "What an amazing concept this is! It is such a pleasure collaborating with such a talented team like TwentyOne06 on this project. Massive congrats on taking home the Highly Commended award.",
      name: "Pierre Engelbrecht",
      role: "associate . Compass project Consulting",
      image: "",
    },
    {
      quote:
        "TwentyOne06 was the visionary force behind Reif & Tero, meticulously designing an extraordinary culinary haven that offers diners an unparalleled gastronomic experience. Light Link worked tirelessly with the team at TwentyOne06, to create 2 very different styles of dining experience for Reif Othman in the new Dubai Hills location, and WE LOVE IT! From taking initial sketches and samples of tea brushes through to truly bespoke light fittings, custom neon pendants, and wall sconces all dreamt up in the mind of Govind Shepley and the team, were brought to life by our designers and custom partners.",
      name: "Light Link",
      role: "",
      image: "",
    },
  ],
  contact: {
    ctaTitle: ["Let’s Create Something", "Extraordinary."],
    ctaButton: "Start a Project",
    ctaTo: "/contact" as const,
    formTitle: "Send a Message",
    submit: contactPage.form.submit,
    fields: [
      { id: "name", label: "Name", type: "text" as const, placeholder: "Your name", required: true },
      { id: "email", label: "Email", type: "email" as const, placeholder: "Info@twentyone06.com", required: true },
      {
        id: "phone",
        label: "Phone",
        type: "tel" as const,
        placeholder: "50 000 0000",
        required: false,
      },
      {
        id: "interest",
        label: "Project Type",
        type: "select" as const,
        placeholder: "Select a focus",
        required: true,
        options: [
          "Interior Design",
          "Branding",
          "Design Management",
          "Design Strategy and Operations",
        ],
      },
      {
        id: "message",
        label: "Message",
        type: "textarea" as const,
        placeholder: "Tell us about your project…",
        required: true,
      },
    ],
    details: [
      { label: "Email", value: footer.location.email, href: `mailto:${footer.location.email}` },
      { label: "Phone", value: footer.location.phone, href: footer.location.phoneHref },
      { label: "Studio", value: footer.location.lines.join(", ") },
    ],
    social: [
      { label: "Facebook", href: "https://www.facebook.com/p/TwentyOne06-100054351738420/" },
      { label: "Instagram", href: "https://www.instagram.com/twentyone06/" },
      { label: "Linkedin", href: "https://www.linkedin.com/company/twentyone06" },
    ],
    copyright: footer.copyright,
  },
};
