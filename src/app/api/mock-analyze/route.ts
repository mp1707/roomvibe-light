import { NextRequest, NextResponse } from "next/server";
import { AnalysisResponse } from "@/types/suggestions";

// Mock suggestions data that mimics real analysis results
const mockSuggestions = [
  {
    id: "wandgestaltung-akzentfarbe",
    title: "Akzentfarbe",
    suggestion:
      "Wände in warmem Salbeigrün (RAL 6021) streichen für beruhigende Atmosphäre",
    explanation:
      "Das warme Salbeigrün schafft eine natürliche, beruhigende Atmosphäre und harmoniert perfekt mit vorhandenen Holzelementen. Diese Farbe reduziert Stress und macht den Raum einladender.",
    category: "Wandgestaltung",
  },
  {
    id: "beleuchtung-ambient",
    title: "Ambient Licht",
    suggestion:
      "Warme LED-Streifen hinter TV-Wand installieren für indirektes Licht",
    explanation:
      "Indirektes Licht reduziert harte Schatten und schafft eine gemütliche Atmosphäre. Die warmen 2700K LEDs verbessern das Farbschema und reduzieren Augenermüdung beim Fernsehen.",
    category: "Beleuchtung",
  },
  {
    id: "mobelanordnung-symmetrie",
    title: "Symmetrische Anordnung",
    suggestion:
      "Sofa 30cm vom TV-Möbel entfernt positionieren für optimale Proportionen",
    explanation:
      "Die aktuelle Anordnung wirkt beengt. Mehr Abstand schafft visuelle Balance und verbessert die Raumproportionen nach dem goldenen Schnitt-Prinzip.",
    category: "Möbelanordnung",
  },
  {
    id: "dekoration-pflanzen",
    title: "Grüne Akzente",
    suggestion: "Große Monstera deliciosa in Ecke links vom Sofa platzieren",
    explanation:
      "Eine große Pflanze in dieser Ecke bringt Leben in den Raum und verbessert die Luftqualität. Die Monstera ergänzt das geplante Grünkonzept und schafft einen natürlichen Fokuspunkt.",
    category: "Dekoration",
  },
  {
    id: "textilien-kissen",
    title: "Farbige Kissen",
    suggestion: "3-4 Kissen in Terrakotta und Cremeweiß auf Sofa arrangieren",
    explanation:
      "Warme Terrakotta-Töne schaffen einen schönen Kontrast zum geplanten Salbeigrün und Cremeweiß sorgt für Balance. Diese Farbkombination folgt der 60-30-10 Regel für harmonische Raumgestaltung.",
    category: "Dekoration",
  },
  {
    id: "aufbewahrung-versteckt",
    title: "Versteckter Stauraum",
    suggestion:
      "TV-Möbel mit geschlossenen Fächern gegen offenes Regal tauschen",
    explanation:
      "Geschlossene Fächer reduzieren visuelle Unruhe und lassen den Raum aufgeräumter wirken. Dies verstärkt den minimalistischen Eindruck und lenkt die Aufmerksamkeit auf die Designelemente.",
    category: "Aufbewahrung",
  },
  {
    id: "materialien-texturen",
    title: "Natürliche Texturen",
    suggestion: "Jute-Teppich 200x300cm unter Sitzbereich für warme Textur",
    explanation:
      "Ein Naturfaser-Teppich definiert den Sitzbereich und bringt warme Textur in den Raum. Jute ist nachhaltig und ergänzt das natürliche Farbschema perfekt.",
    category: "Materialien",
  },
  {
    id: "wandkunst-gallery",
    title: "Bildergalerie",
    suggestion: "Drei gerahmte Naturfotos (40x60cm) über Sofa als Dreiergruppe",
    explanation:
      "Eine Bildergalerie in Dreiergruppe schafft einen visuellen Anker über dem Sofa. Naturmotive verstärken das ruhige Ambiente und die 40x60cm Größe ist proportional ideal für diese Wandfläche.",
    category: "Wandgestaltung",
  },
];

export async function POST(request: NextRequest) {
  console.log("=== MOCK ANALYZE API START ===");

  try {
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Keine Bild-URL bereitgestellt" },
        { status: 400 }
      );
    }

    // Validate that it's a valid URL or data URL
    if (
      !imageUrl.startsWith("data:image/") &&
      !imageUrl.startsWith("http://") &&
      !imageUrl.startsWith("https://")
    ) {
      return NextResponse.json(
        {
          error:
            "Ungültige Bild-URL. Muss eine HTTP/HTTPS-URL oder data:image/ URL sein.",
        },
        { status: 400 }
      );
    }

    console.log("Mock image URL:", imageUrl.substring(0, 50) + "...");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Return mock analysis response
    const response: AnalysisResponse = {
      isInteriorSpace: true,
      suggestions: mockSuggestions,
    };

    console.log(
      "Mock analysis completed with",
      mockSuggestions.length,
      "suggestions"
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Mock analyze API error:", error);
    return NextResponse.json(
      { error: "Mock Analyse fehlgeschlagen" },
      { status: 500 }
    );
  }
}
