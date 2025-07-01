import { InteriorStyle } from "@/types/suggestions";

export const interiorStyles: InteriorStyle[] = [
  {
    id: "traditional",
    name: "Traditional",
    description:
      "Klassische Eleganz mit warmen Farben, edlen Hölzern und zeitlosen Möbeln",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    prompt:
      "Change the interior design style to traditional classic style with warm colors, rich wooden furniture, elegant fabrics, ornate details, and timeless pieces",
  },
  {
    id: "modern",
    name: "Modern",
    description:
      "Puristische Linien, neutrale Farben und innovative Materialien für zeitgemäßes Wohnen",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    prompt:
      "Change the interior design style to modern contemporary style with clean lines, neutral colors, innovative materials, and sleek furniture",
  },
  {
    id: "contemporary",
    name: "Contemporary",
    description:
      "Aktuelle Trends mit flexiblen Designs und innovativen Elementen",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    prompt:
      "Change the interior design style to contemporary style with current trends, flexible designs, mixed textures, and innovative elements",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description:
      "Weniger ist mehr - klare Strukturen, neutrale Töne und funktionale Eleganz",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    prompt:
      "Change the interior design style to minimalist style with clean lines, neutral tones, functional furniture, and clutter-free spaces",
  },
  {
    id: "scandinavian",
    name: "Scandinavian",
    description:
      "Helle Farben, natürliche Materialien und gemütliche Atmosphäre nach nordischem Vorbild",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    prompt:
      "Change the interior design style to Scandinavian style with light colors, natural wood, cozy textiles, and bright airy atmosphere",
  },
  {
    id: "mid-century-modern",
    name: "Mid-Century Modern",
    description:
      "Ikonisches Design der 50er und 60er Jahre mit organischen Formen und warmen Hölzern",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    prompt:
      "Change the interior design style to mid-century modern style with organic shapes, warm wood tones, vintage furniture, and retro colors",
  },
  {
    id: "industrial",
    name: "Industrial",
    description:
      "Urbaner Loft-Style mit Metall, Beton und rustikalen Elementen",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    prompt:
      "Change the interior design style to industrial style with metal elements, concrete textures, exposed brick, and rustic materials",
  },
  {
    id: "bohemian",
    name: "Bohemian",
    description:
      "Lebendige Farben, gemusterte Textilien und kreative Kunstwerke für freie Geister",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    prompt:
      "Change the interior design style to bohemian style with vibrant colors, patterned textiles, eclectic furniture, and artistic decorations",
  },
  {
    id: "farmhouse",
    name: "Farmhouse",
    description:
      "Rustikaler Charme mit natürlichen Materialien und gemütlicher Landhausatmosphäre",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    prompt:
      "Change the interior design style to farmhouse style with rustic wood, natural materials, cozy textures, and country charm",
  },
  {
    id: "coastal",
    name: "Coastal",
    description:
      "Maritime Frische mit hellen Blautönen, natürlichen Materialien und entspannter Atmosphäre",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    prompt:
      "Change the interior design style to coastal style with light blue tones, natural materials, nautical elements, and relaxed beach atmosphere",
  },
];

// Helper function to get style by ID
export const getStyleById = (id: string): InteriorStyle | undefined => {
  return interiorStyles.find((style) => style.id === id);
};
