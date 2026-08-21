const img = (file: string) => `/projects/elix/${file}`;

export const elixCase = {
  eyebrow: "Our Creation",
  tags: "Branding · Hospitality Design",
  title: "ELIX SPA",
  titleLines: ["ELIX", "SPA"],
  intro:
    "Elix Spa is a hotel refurbishment project of the St. Tropez Hotel located in the Heart of Europe on Dubai Islands. This unique “party spa” aims to revitalize hotel guests and “bring them back to life” by balancing vibrancy with harmony.",
  facts: [
    { label: "Client", value: "The Heart of Europe" },
    { label: "Location", value: "St. Tropez Hotel" },
    { label: "Date", value: "February, 2023" },
    { label: "Venue", value: "Spa" },
  ],
  images: {
    hero: img("elixa-spa-images01.jpg"),
    award: img("elixa-spa-images02.png"),
    clientMark: img("elixa-spa-images03.png"),
    sauna: img("elixa-spa-images04.jpg"),
    concept: [
      img("elixa-spa-images05.jpg"),
      img("elixa-spa-images06.jpg"),
      img("elixa-spa-images07.jpg"),
    ],
    direction: img("elixa-spa-images08.jpg"),
    treatment: img("elixa-spa-images09.jpg"),
    treatmentWide: img("elixa-spa-images21.jpg"),
    fullBleedA: img("elixa-spa-images11.jpg"),
    soap: img("elixa-spa-images12.jpg"),
    brand: img("elixa-spa-images13.jpg"),
    entranceA: img("elixa-spa-images14.jpg"),
    entranceB: img("elixa-spa-images15.jpg"),
    changingRooms: img("elixa-spa-images16.jpg"),
    wetAreas: img("elixa-spa-images17.jpg"),
    jacuzzi: img("elixa-spa-images18.jpg"),
    fullBleedB: img("elixa-spa-images19.jpg"),
    experience: img("elixa-spa-images20.jpg"),
    fullBleedC: img("elixa-spa-images21.jpg"),
    review: img("elixa-spa-images22.jpg"),
  },
  concept: {
    eyebrow: "Concept",
    title: ["The Design", "Concept"],
    paragraphs: [
      "ELIX is establishing itself as a unique “party spa” dedicated to revitalizing hotel guests and “bringing them back to life.” With this vision, our concept focuses on developing a brand that embodies both vibrancy and harmony.",
      "Additionally, we are drawing inspiration from the ancient belief that elixirs could transform base metals into gold. This idea influences our visual branding, incorporating golden and brass accents into our brand materials and interior designs.",
    ],
  },
  direction: {
    eyebrow: "Direction",
    title: ["The Design", "Direction"],
    paragraphs: [
      "Elix Spa is crafted to offer a one-of-a-kind and refreshing experience that revitalizes guests, harmoniously blending vibrancy with tranquility for an unforgettable visit.",
      "The spa features premium materials, including blue fluted tiles, antique brass accents, blue faux leather seating, blue marble, beige travertine, blue granite, and oak wood cladding, all contributing to a luxurious and welcoming ambiance.",
    ],
  },
  treatment: {
    eyebrow: "Spaces",
    title: ["Treatment", "Rooms"],
    paragraphs: [
      "The encorporation of contemporary and soothing materials like blue fluted ceramic tiles, beige travertine, beige marble wall panels, antique brass accents, blue mosaic tiles, blue ceramic wall tiles, oak wood, and blue granite creates a tranquil, treatment focus atmosphere.",
      "The idea of natural healing is intricately integrated into the brand’s identity, evident in every treatment room and enriching the overall guest experience.",
    ],
  },
  entrance: {
    eyebrow: "Arrival",
    title: ["The Entrance", "Design"],
    paragraphs: [
      "Drawing inspiration from the sea and water, the restaurant’s distinctive blue color, reminiscent of the ocean, symbolizes tranquility. The orange hue roots in raw salmon, while beige tones pay homage to traditional Japanese canvases and wall partitions. The brand pattern, resembling Damascus steel, epitomizes a traditional Japanese forging technique, creating a cohesive and meaningful narrative for Nama Yoso.",
    ],
    caption:
      "Consistent brand identity: distinctive Elix elements. The design upholds a robust brand identity by integrating features that resonate with Elix Spa’s philosophy of natural healing and rejuvenation.",
    rooms: [
      { src: img("elixa-spa-images16.jpg"), label: "Changing Rooms Large" },
      { src: img("elixa-spa-images17.jpg"), label: "Co-ed Wet Areas" },
      { src: img("elixa-spa-images18.jpg"), label: "Jacuzzi Pool" },
    ],
  },
  experience: {
    eyebrow: "Experience",
    title: ["The Spa", "Experience"],
    paragraphs: [
      "The inspiration behind ELIX Spa stems from the belief that elixirs are natural potions designed to rejuvenate and heal individuals. This idea is intricately embedded in the brand's core identity.",
      "In this spa, the principle of natural healing will be integrated into every treatment offered, broadening the definition of “elixir” to encompass more than just liquid forms.",
    ],
  },
  review: {
    eyebrow: "Client Review",
    quote:
      "I had the pleasure of working with Govind Shepley, Mike, Hannah, Sabiha and Satinder on Voco Monaco Lobby renovation and ELIX Spa. Twentyone06’s creativity, hard work, passion and patience is truly inspiring on all project portfolios we collaborate on. Well done to you all!",
    name: "Marwa Sharaky",
    role: "Senior Design Manager",
    org: "Kleindienst Group (Voco Monaco, Elix Spa)",
  },
} as const;
