import { InteriorStyle } from "@/types/suggestions";

export const interiorStyles: InteriorStyle[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    description:
      "Weniger ist mehr - klare Strukturen, neutrale Töne und funktionale Eleganz",
    imageUrl:
      "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320697225-qezz71r8l1.jpg",
    prompt:
      "Change the interior design style to minimalist style with clean lines, neutral tones, functional furniture, and clutter-free spaces",
  },
  {
    id: "scandinavian",
    name: "Scandinavian",
    description:
      "Helle Farben, natürliche Materialien und gemütliche Atmosphäre nach nordischem Vorbild",
    imageUrl:
      "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320702285-mun8s8g4ge.jpg",
    prompt:
      "Change the interior design style to Scandinavian style with light colors, natural wood, cozy textiles, and bright airy atmosphere",
  },
  {
    id: "mid-century-modern",
    name: "Mid-Century Modern",
    description:
      "Ikonisches Design der 50er und 60er Jahre mit organischen Formen und warmen Hölzern",
    imageUrl:
      "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320449428-y0cnntjbdks.jpg",
    prompt:
      "Change the interior design style to mid-century modern style with organic shapes, warm wood tones, vintage furniture, and retro colors",
  },
  {
    id: "industrial",
    name: "Industrial",
    description:
      "Urbaner Loft-Style mit Metall, Beton und rustikalen Elementen",
    imageUrl:
      "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320686053-ocrc8wycln.jpg",
    prompt:
      "Change the interior design style to industrial style with metal elements, concrete textures, exposed brick, and rustic materials",
  },
  {
    id: "bohemian",
    name: "Bohemian",
    description:
      "Lebendige Farben, gemusterte Textilien und kreative Kunstwerke für freie Geister",
    imageUrl:
      "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320713076-00hnl0fg6m7ai.jpg",
    prompt:
      "Change the interior design style to bohemian style with vibrant colors, patterned textiles, eclectic furniture, and artistic decorations",
  },
  {
    id: "farmhouse",
    name: "Farmhouse",
    description:
      "Rustikaler Charme mit natürlichen Materialien und gemütlicher Landhausatmosphäre",
    imageUrl:
      "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320890594-o7maseoihh.jpg",
    prompt:
      "Change the interior design style to farmhouse style with rustic wood, natural materials, cozy textures, and country charm",
  },
  {
    id: "coastal",
    name: "Coastal",
    description:
      "Maritime Frische mit hellen Blautönen, natürlichen Materialien und entspannter Atmosphäre",
    imageUrl:
      "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320885729-16ry0ycg7ue.jpg",
    prompt:
      "Change the interior design style to coastal style with light blue tones, natural materials, nautical elements, and relaxed beach atmosphere",
  },
  {
    id: "eclectic",
    name: "Eclectic",
    description:
      "Kreative Mischung verschiedener Stile, Epochen und Kulturen für einen einzigartigen, persönlichen Look",
    imageUrl:
      "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751321003283-0pp3o3sk00n.jpg",
    prompt:
      "Change the interior design style to eclectic style with a mix of different styles, eras, and cultures, combining unique pieces, diverse textures, and bold accents while maintaining visual harmony",
  },
];

// Helper function to get style by ID
export const getStyleById = (id: string): InteriorStyle | undefined => {
  return interiorStyles.find((style) => style.id === id);
};
