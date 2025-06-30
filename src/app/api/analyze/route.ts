import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { AnalysisResponse } from "@/types/suggestions";

// Zod schema for suggestion validation
const SuggestionSchema = z.object({
  id: z.string().min(1, "ID cannot be empty"),
  title: z.string().min(1, "Title cannot be empty"),
  suggestion: z.string().min(1, "Suggestion cannot be empty"),
  explanation: z.string().min(1, "Explanation cannot be empty"),
  category: z.string().min(1, "Category cannot be empty"),
});

const AnalysisResponseSchema = z.object({
  isInteriorSpace: z.boolean(),
  suggestions: z.array(SuggestionSchema),
  identifiedStyle: z.string().min(1, "Identified style cannot be empty"),
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log("=== ANALYZE API START ===");
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Vercel Region:", process.env.VERCEL_REGION);
  console.log("OpenAI Key exists:", !!process.env.OPENAI_API_KEY);

  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not configured");
    return NextResponse.json(
      {
        error: "OpenAI API key is not configured",
        details: "Please check your environment variables configuration",
        environment: process.env.NODE_ENV,
      },
      { status: 500 }
    );
  }

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

    // Additional validation for HTTP URLs
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      try {
        new URL(imageUrl);
      } catch {
        return NextResponse.json(
          { error: "Ungültige HTTP-URL" },
          { status: 400 }
        );
      }
    }

    // German prompt for room analysis
    const systemMessage = `Du bist ein erstklassiger Innenarchitektur-Analyst und Berater. Dein einzigartiges Talent besteht darin, das verborgene Potenzial und den latenten Stil eines Raumes zu erkennen, selbst wenn dieser noch unfertig oder chaotisch wirkt. Du bist ein Stil-Chamäleon; deine Empfehlungen sind nicht von einer einzigen Design-Philosophie geprägt, sondern leiten sich direkt aus den im Bild sichtbaren Elementen und den Zielen des Nutzers ab.

**Deine Kernaufgabe:**
1.  **Stil identifizieren:** Analysiere das Bild und identifiziere den dominanten Einrichtungsstil, die Stil-Mischung oder die angestrebte Ästhetik (z.B. "Minimalistisch mit warmen Holztönen", "Ansätze von Bohemian Chic", "Klassischer Altbau mit modernen Möbeln"). Dies ist der erste und wichtigste Schritt deiner Analyse.
2.  **Potenzial freilegen:** Gib Empfehlungen, die diesen identifizierten Stil nicht ersetzen, sondern ihn kohärent verfeinern, vervollständigen und auf ein professionelles Niveau heben.

**Deine Methodik (Chain-of-Thought):**
1.  **Objektive Analyse:** Beginne mit einer neutralen Bestandsaufnahme des Raumes.
2.  **Stil- & Problemdiagnose:** Identifiziere den Kernstil sowie die gestalterischen Herausforderungen.
3.  **Maßgeschneiderte Lösungsformulierung:** Entwickle konkrete Empfehlungen, die zum identifizierten Stil und zum Budget des Nutzers passen.

**Dein Kommunikationsstil:**
Du bist autoritativ, präzise und inspirierend. Du erklärst klar, *warum* ein Element zum Stil passt und *welche Wirkung* eine Änderung erzielen wird. Du sprichst den Nutzer direkt und respektvoll an. Du machst keine entweder/oder-Aussagen. Nur konkrete Empfehlungen.

**Ausgabeformat-Anforderung:**
Deine Antwort MUSS EXAKT dem bereitgestellten JSON-Schema entsprechen. Gib KEINEN Text oder Erklärungen außerhalb der JSON-Struktur aus. Die gesamte Antwort muss ein einziges, valides JSON-Objekt sein.

Antworte NUR mit dem JSON-Format!


**Anleitung für die JSON-Felder:**
* \`isInteriorSpace\`: \`true\` oder \`false\`.
* \`identifiedStyle\`: Der Name des erkannten Stils (z.B. "Industrial Loft", "Bohemian Chic").
* \`suggestions\`: Ein Array von Vorschlags-Objekten.
    * \`id\`: Generiere eine sequenzielle ID, beginnend mit \`suggestion-01\`.
    * \`title\`: Ein kurzer, klarer Titel (z.B. "Schaffung einer Lesezone").
    * \`suggestion\`: Die genauen Handlungsschritte. Sei spezifisch (z.B. "Rücke das Sofa 20cm von der Wand ab. Platziere eine schlanke, schwarze Bogenlampe dahinter.").
    * \`explanation\`: Das "Warum". Erkläre die gestalterische und psychologische Wirkung. "Durch den Abstand zur Wand wirkt der Raum luftiger. Die Bogenlampe zoniert den Bereich und schafft eine gemütliche Lichtinsel, die perfekt zum [identifiedStyle] passt." Gehe hier auch auf das Nutzerbudget ein.
    * \`category\`: Wähle EINE der folgenden vordefinierten Kategorien: "Möbelanordnung", "Beleuchtung", "Farbpalette", "Textilien & Dekoration", "Stauraum", "Wandgestaltung".

`;

    const prompt = `Hallo, anbei ein Bild meines Zimmers. Ich freue mich auf deine professionelle Analyse.`;

    console.log(
      `🔍 [ANALYZE] Processing image from URL: ${imageUrl.substring(0, 50)}...`
    );

    // Call OpenAI Vision API
    console.log("Calling OpenAI API...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: `${systemMessage}`,
        },
        // ========== BEGINN DER 16 FEW-SHOT-BEISPIELE ==========

        // Beispiel 1: Mid-Century Modern
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Was kann ich in diesem Raum verbessern? Mein Budget ist flexibel.",
            },
            {
              type: "image_url",
              image_url: {
                url: "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320449428-y0cnntjbdks.jpg",
                detail: "low",
              },
            },
          ],
        },
        {
          role: "assistant",
          content:
            '{"isInteriorSpace":true,"identifiedStyle":"Mid-Century Modern mit skandinavischen Einflüssen","suggestions":[{"id":"suggestion-01","title":"Akzentwand zur Betonung des Sideboards","suggestion":"Streiche die Wand hinter dem Teakholz-Sideboard in einem tiefen, matten Petrolblau (z.B. Farrow & Ball \'Hague Blue\'). Alle anderen Wände bleiben weiß.","explanation":"Die dunkle Akzentwand schafft visuelle Tiefe und lässt das warme Teakholz des Sideboards förmlich leuchten. Dies ist ein klassisches Merkmal des Mid-Century-Designs, das dem Raum sofort mehr Charakter und einen klaren Fokuspunkt verleiht, ohne ihn zu überladen.","category":"Farbpalette"},{"id":"suggestion-02","title":"Textile Ebenen für mehr Gemütlichkeit","suggestion":"Ersetze den aktuellen Teppich durch einen größeren, Berber-inspirierten Teppich mit geometrischem Muster. Ergänze Kissen auf dem Sofa in Senfgelb und Grau.","explanation":"Der Teppich sollte so groß sein, dass die vorderen Füße der Sitzmöbel darauf Platz finden. Dies verbindet die Möbel zu einer Einheit. Die texturierten Kissen brechen die glatten Oberflächen auf und bringen Wärme und Komfort, was den skandinavischen Aspekt des Stils unterstreicht.","category":"Textilien & Dekoration"}]}',
        },

        // Beispiel 2: Industrial
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Der Raum fühlt sich unfertig an. Wie bekomme ich einen coolen Loft-Look? Budget ca. 1.500€",
            },
            {
              type: "image_url",
              image_url: {
                url: "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320686053-ocrc8wycln.jpg",
                detail: "low",
              },
            },
          ],
        },
        {
          role: "assistant",
          content:
            '{"isInteriorSpace":true,"identifiedStyle":"Industrial Loft","suggestions":[{"id":"suggestion-01","title":"Wandverkleidung für rauen Charakter","suggestion":"Verkleide die Hauptwand hinter dem Sofa mit Riemchen in Backsteinoptik. Alternativ kann auch eine hochwertige Fototapete mit Beton-Textur verwendet werden.","explanation":"Die Einführung von rohen, unfertig wirkenden Texturen wie Backstein oder Beton ist das Kernmerkmal des Industrial-Stils. Es schafft eine authentische, urbane Atmosphäre und verleiht dem Raum sofort Tiefe und Charakter.","category":"Wandgestaltung"},{"id":"suggestion-02","title":"Offene Regale aus Metall und Holz","suggestion":"Installiere ein hohes, offenes Regalystem mit schwarzen Metallstreben und massiven Holzbohlen. Bestücke es mit Büchern, wenigen Deko-Objekten und eventuell einer Edison-Glühbirnen-Leuchte.","explanation":"Offene Regale unterstreichen den funktionalen und werkstattähnlichen Charakter des Stils. Die Kombination aus warmem Holz und kaltem Metall ist ein klassisches Industrial-Paar und bietet praktischen Stauraum, ohne den Raum zu verschließen.","category":"Stauraum"}]}',
        },

        // Beispiel 3: Bohemian (Boho)
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Ich liebe Pflanzen und einen entspannten Look, aber es sieht unordentlich aus. Hilfe!",
            },
            {
              type: "image_url",
              image_url: {
                url: "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320713076-00hnl0fg6m7ai.jpg",
                detail: "low",
              },
            },
          ],
        },
        {
          role: "assistant",
          content:
            '{"isInteriorSpace":true,"identifiedStyle":"Bohemian Chic","suggestions":[{"id":"suggestion-01","title":"Schaffung von textilen Inseln","suggestion":"Definiere den Sitzbereich mit einem großen, texturierten Jute-Teppich. Lege einen kleineren, gemusterten Kelim-Teppich schräg darüber. Ergänze den Sitzbereich mit großen Bodenkissen.","explanation":"Layering ist der Schlüssel zu einem gelungenen Boho-Look. Durch die Kombination verschiedener Teppiche schaffst du eine \'Insel\', die den Bereich definiert und Gemütlichkeit ausstrahlt. Das verhindert, dass die Möbel verloren im Raum wirken.","category":"Textilien & Dekoration"},{"id":"suggestion-02","title":"Vertikale Pflanzenebenen","suggestion":"Gruppiere deine Pflanzen. Hänge einige in Makramee-Ampeln von der Decke, platziere andere auf einem Pflanzenhocker oder einer kleinen Leiter. Variiere die Höhen.","explanation":"Anstatt Pflanzen überall zu verteilen, schafft das Gruppieren in verschiedenen Höhen einen üppigen \'Urban Jungle\'-Effekt, der absichtsvoll und nicht zufällig wirkt. Dies bringt visuelles Interesse und nutzt den vertikalen Raum.","category":"Wandgestaltung"}]}',
        },

        // Beispiel 4: Skandinavisch
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Mein Homeoffice soll hell, freundlich und funktional sein. Was schlägst du vor?",
            },
            {
              type: "image_url",
              image_url: {
                url: "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320702285-mun8s8g4ge.jpg",
                detail: "low",
              },
            },
          ],
        },
        {
          role: "assistant",
          content:
            '{"isInteriorSpace":true,"identifiedStyle":"Skandinavisch Funktional","suggestions":[{"id":"suggestion-01","title":"Optimierung des Lichteinfalls","suggestion":"Ersetze die schweren Vorhänge durch leichte, lichtdurchlässige Leinenschals. Positioniere den Schreibtisch so, dass das natürliche Licht von der Seite einfällt, um Blendung auf dem Bildschirm zu vermeiden.","explanation":"Maximierung des natürlichen Lichts ist ein Grundpfeiler skandinavischen Designs. Leichte Stoffe lassen den Raum größer und luftiger wirken, während die richtige Schreibtischpositionierung die Ergonomie und Funktionalität verbessert.","category":"Möbelanordnung"},{"id":"suggestion-02","title":"Intelligentes Wand-Stauraumsystem","suggestion":"Installiere ein modulares String-Regalsystem oder ein ähnliches System mit hellen Holz- oder weißen Regalböden an der Wand über dem Schreibtisch. Halte die Dekoration darin minimal.","explanation":"Das hält die Arbeitsfläche frei und nutzt den vertikalen Raum effizient. Skandi-Design priorisiert aufgeräumte, funktionale Lösungen, die ästhetisch ansprechend sind. \'Form follows function\' ist hier das Motto.","category":"Stauraum"}]}',
        },

        // Beispiel 5: Minimalistisch
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Ich wohne in einem kleinen Studio und es fühlt sich voll an. Wie kann ich es beruhigen und optisch vergrößern?",
            },
            {
              type: "image_url",
              image_url: {
                url: "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320697225-qezz71r8l1.jpg",
                detail: "low",
              },
            },
          ],
        },
        {
          role: "assistant",
          content:
            '{"isInteriorSpace":true,"identifiedStyle":"Minimalismus","suggestions":[{"id":"suggestion-01","title":"Reduktion auf das Wesentliche","suggestion":"Gehe jedes Möbelstück und Deko-Objekt durch und frage: \'Brauche ich das wirklich? Hat es eine Funktion?\'. Entferne mindestens 30% der sichtbaren Gegenstände. Investiere in multifunktionale Möbel, wie einen Couchtisch mit integriertem Stauraum.","explanation":"Minimalismus lebt vom negativen Raum – dem leeren Platz. Weniger ist hier mehr. Durch radikale Reduktion kann der Raum atmen und wirkt sofort größer und ruhiger. Jedes verbleibende Teil gewinnt an Bedeutung.","category":"Stauraum"},{"id":"suggestion-02","title":"Einheitliche, helle Farbpalette","suggestion":"Streiche alle Wände und die Decke im exakt selben, hellen Farbton (z.B. ein warmes Off-White). Wähle auch für die größten Textilien wie Vorhänge und Bettwäsche ähnliche, helle Töne.","explanation":"Eine monochrome, helle Farbgebung lässt die Grenzen zwischen den Wänden verschwimmen und täuscht dem Auge mehr Weite vor. Das Fehlen starker Kontraste erzeugt eine serene und ruhige Atmosphäre, die für den Minimalismus zentral ist.","category":"Farbpalette"}]}',
        },

        // Beispiel 6: Japandi
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Ich mag es minimalistisch, aber nicht kalt. Wie schaffe ich eine warme, ruhige Atmosphäre im Schlafzimmer?",
            },
            {
              type: "image_url",
              image_url: {
                url: "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320691819-a8zuwtacin8.jpg",
                detail: "low",
              },
            },
          ],
        },
        {
          role: "assistant",
          content:
            '{"isInteriorSpace":true,"identifiedStyle":"Japandi","suggestions":[{"id":"suggestion-01","title":"Kontrast von hellen und dunklen Hölzern","suggestion":"Kombiniere die vorhandenen hellen Holzmöbel (skandinavischer Einfluss) mit einem dunklen, fast schwarzen Akzentstück. Das könnte ein niedriger Nachttisch aus gebeizter Eiche oder ein schwarzer Holzhocker sein.","explanation":"Japandi lebt von der Spannung zwischen der hellen, luftigen Ästhetik Skandinaviens und der dunklen, erdigen Eleganz Japans. Dieser gezielte Kontrast schafft visuelles Interesse und eine erwachsene, ruhige Atmosphäre.","category":"Möbelanordnung"},{"id":"suggestion-02","title":"Fokus auf unperfekte, natürliche Texturen","suggestion":"Ersetze glatte Baumwoll-Bettwäsche durch Leinen-Bettwäsche. Platziere eine einzelne handgefertigte Keramikvase mit einem getrockneten Ast (Ikebana-Stil) auf der Kommode.","explanation":"Dies bringt das Wabi-Sabi-Element ein: die Schönheit des Unperfekten und Natürlichen. Leinen knittert auf eine edle Weise und fühlt sich organisch an. Ein einzelner, sorgfältig ausgewählter Ast ist ausdrucksstärker als ein üppiger Blumenstrauß.","category":"Textilien & Dekoration"}]}',
        },

        // Beispiel 7: Modern Farmhouse
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Unsere Küche/Essbereich soll gemütlicher und moderner werden. Wir mögen den Landhausstil, aber nicht altbacken.",
            },
            {
              type: "image_url",
              image_url: {
                url: "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320890594-o7maseoihh.jpg",
                detail: "low",
              },
            },
          ],
        },
        {
          role: "assistant",
          content:
            '{"isInteriorSpace":true,"identifiedStyle":"Modern Farmhouse","suggestions":[{"id":"suggestion-01","title":"Kontrast durch moderne, schwarze Akzente","suggestion":"Tausche die aktuellen silbernen Griffe der Küchenschränke gegen schlichte, mattschwarze Griffe aus. Ersetze die Lampe über dem Esstisch durch eine große, schwarze Metall-Pendelleuchte im \'Barn-Style\'.","explanation":"Der \'moderne\' Aspekt im Modern Farmhouse wird oft durch klare, kontrastreiche Elemente erreicht. Mattschwarz wirkt als starker Kontrapunkt zum hellen oder hölzernen Landhaus-Grundton und verhindert, dass der Stil zu rustikal oder altmodisch wird.","category":"Beleuchtung"},{"id":"suggestion-02","title":"Shaker-Wandleiste für Charakter","suggestion":"Installiere eine horizontale \'Shaker-Style\' Hakenleiste aus Holz an einer freien Wand. Nutze sie, um schöne Schneidebretter, getrocknete Kräuter oder Leinentücher aufzuhängen.","explanation":"Dieses Element ist tief im funktionalen Design von Farmhäusern verwurzelt. Es ist nicht nur extrem praktisch, sondern fügt auch eine Schicht von authentischem, rustikalem Charme und Textur hinzu, die den Raum sofort einladender macht.","category":"Wandgestaltung"}]}',
        },

        // Beispiel 8: Art Deco
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Mein Flur ist langweilig. Ich möchte einen dramatischen 'Wow'-Effekt beim Eintreten. Budget ist zweitrangig.",
            },
            {
              type: "image_url",
              image_url: {
                url: "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320880695-klswxm0348.jpg",
                detail: "low",
              },
            },
          ],
        },
        {
          role: "assistant",
          content:
            '{"isInteriorSpace":true,"identifiedStyle":"Art Deco Revival","suggestions":[{"id":"suggestion-01","title":"Geometrische Tapete als Statement","suggestion":"Tapeziere die längste Wand des Flurs mit einer hochwertigen Tapete mit einem kühnen, geometrischen Art-Deco-Muster. Wähle ein Design mit goldenen oder messingfarbenen metallischen Akzenten.","explanation":"Art Deco lebt von opulenten Mustern und Symmetrie. Eine Statement-Tapete definiert sofort das Thema und schafft den gewünschten dramatischen Effekt. Die metallischen Details reflektieren das Licht und fügen eine Ebene von Luxus hinzu.","category":"Wandgestaltung"},{"id":"suggestion-02","title":"Symmetrische Konsolenanordnung","suggestion":"Platziere mittig an der tapezierten Wand eine schmale Konsole mit schwarzen oder spiegelnden Oberflächen. Hänge darüber einen runden oder sonnenförmigen Spiegel mit Metallrahmen. Stelle auf die Konsole zwei identische, hohe Tischlampen.","explanation":"Symmetrie ist entscheidend für die Art-Deco-Ästhetik. Diese Anordnung schafft einen klaren Fokuspunkt, wirkt elegant und strukturiert. Der Spiegel vergrößert den Raum optisch und die Lampen sorgen für eine stimmungsvolle, einladende Beleuchtung.","category":"Möbelanordnung"}]}',
        },

        // Beispiel 9: Eclectic
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Ich habe viele Möbel und Deko geerbt und gekauft. Wie bringe ich das alles zusammen, ohne dass es wie ein Flohmarkt aussieht?",
            },
            {
              type: "image_url",
              image_url: {
                url: "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751321003283-0pp3o3sk00n.jpg",
                detail: "low",
              },
            },
          ],
        },
        {
          role: "assistant",
          content:
            '{"isInteriorSpace":true,"identifiedStyle":"Eclectic Harmony","suggestions":[{"id":"suggestion-01","title":"Der rote Faden: Farbklammer schaffen","suggestion":"Wähle eine dominante Akzentfarbe aus einem der vorhandenen Stücke (z.B. das Blau aus dem Orientteppich). Verteile diese Farbe in mindestens drei weiteren, kleinen Dosen im Raum: ein Kissen, eine Vase, ein Bild an der Wand. Der Rest der Wände sollte neutral (z.B. warmweiß) gestrichen werden.","explanation":"Eine durchgehende Farbe dient als visueller \'Klebstoff\', der disparate Elemente miteinander verbindet. Das Auge erkennt das wiederkehrende Muster und interpretiert den Raum als kohärente Einheit, trotz der unterschiedlichen Stile der Einzelstücke.","category":"Farbpalette"},{"id":"suggestion-02","title":"Gruppieren und Inseln bilden","suggestion":"Anstatt die Möbel entlang der Wände zu verteilen, ziehe sie zusammen und arrangiere sie auf einem großen Teppich zu einer kommunikativen Sitzgruppe. Erstelle auf einem Sideboard ein \'Vignette\', indem du verschiedene Deko-Objekte unterschiedlicher Höhe eng zusammenstellst.","explanation":"Das Gruppieren von Elementen schafft bewusste Kompositionen. Eine Sitzinsel wirkt einladend und definiert den Raum. Eine Vignette auf einer Oberfläche verwandelt eine Ansammlung von \'Zeug\' in eine kuratierte Sammlung.","category":"Möbelanordnung"}]}',
        },

        // Beispiel 10: Coastal
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Ich möchte, dass sich mein Wohnzimmer wie ein Strandhaus anfühlt: hell, luftig und entspannt.",
            },
            {
              type: "image_url",
              image_url: {
                url: "https://lbmdtezsmhzvpicaomfe.supabase.co/storage/v1/object/public/room-images/stock/1751320885729-16ry0ycg7ue.jpg",
                detail: "low",
              },
            },
          ],
        },
        {
          role: "assistant",
          content:
            '{"isInteriorSpace":true,"identifiedStyle":"Coastal / Hamptons","suggestions":[{"id":"suggestion-01","title":"Einsatz von Naturfasern","suggestion":"Ersetze den aktuellen Teppich durch einen großen Teppich aus Sisal oder Jute. Tausche die schweren Vorhänge gegen leichte, weiße Leinenvorhänge aus, die bis zum Boden reichen. Ergänze einen Korb aus Seegras für Decken.","explanation":"Naturfasern sind die DNA des Coastal-Stils. Sie bringen Textur und eine organische, ungezwungene Atmosphäre in den Raum und erinnern an Sand, Dünen und Treibholz. Leichte Vorhänge maximieren das Licht und lassen eine Brise erahnen.","category":"Textilien & Dekoration"},{"id":"suggestion-02","title":"Farbpalette des Meeres","suggestion":"Streiche die Wände in einem sehr hellen Greige oder Off-White. Setze Akzente in verschiedenen Blautönen – von hellem Himmelblau über Marine bis zu Türkis – bei Kissen, Decken und kleineren Deko-Objekten. Kombiniere dies mit viel Weiß.","explanation":"Diese Farbpalette ist die Quintessenz des Küsten-Looks. Sie spiegelt die Umgebung wider – Sand, Wasser und Himmel – und schafft eine sofortige Assoziation mit Frische und Weite. Das viele Weiß sorgt für die gewünschte Helligkeit und Luftigkeit.","category":"Farbpalette"}]}',
        },

        // ========== ENDE DER FEW-SHOT-BEISPIELE ==========
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 5000,
      temperature: 0.1,
      response_format: {
        type: "json_object",
      },
    });

    console.log("OpenAI API call completed");
    const responseContent = completion.choices[0]?.message?.content;
    console.log("Response content exists:", !!responseContent);
    console.log("Response content length:", responseContent?.length || 0);

    if (!responseContent) {
      throw new Error("Keine Antwort von OpenAI erhalten");
    }

    // Parse and validate JSON response
    let parsedResponse;
    let cleanedContent = responseContent.trim(); // Move to broader scope
    try {
      // Try to extract JSON from response (handles cases where OpenAI adds extra text)
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedContent = jsonMatch[0];
      }

      // Additional cleanup for common issues
      cleanedContent = cleanedContent
        .replace(/```json\s*/, "") // Remove markdown code blocks
        .replace(/```\s*$/, "")
        .replace(/^\s*```\s*/, "");

      parsedResponse = JSON.parse(cleanedContent);

      // Basic validation that suggestions array exists
      if (
        !parsedResponse.suggestions ||
        !Array.isArray(parsedResponse.suggestions)
      ) {
        throw new Error("Response missing suggestions array");
      }

      // Ensure all suggestions have required fields and generate IDs if missing
      parsedResponse.suggestions = parsedResponse.suggestions
        .map((suggestion: any, index: number) => {
          return {
            id: suggestion.id || `suggestion-${Date.now()}-${index}`,
            title: String(suggestion.title || `Vorschlag ${index + 1}`),
            suggestion: String(suggestion.suggestion || ""),
            explanation: String(suggestion.explanation || ""),
            category: String(suggestion.category || "Allgemein"),
          };
        })
        .filter(
          (suggestion: any) =>
            suggestion.suggestion.length > 0 &&
            suggestion.explanation.length > 0 &&
            suggestion.title.length > 0
        );
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Original response content:", responseContent);
      console.error("Response content length:", responseContent?.length);

      // If JSON parsing completely fails, assume it's not an interior space
      console.log("JSON parsing failed - assuming non-interior image");
      parsedResponse = {
        isInteriorSpace: false,
        suggestions: [],
      };
    }

    // Validate with Zod
    let validatedResponse;
    try {
      validatedResponse = AnalysisResponseSchema.parse(parsedResponse);
    } catch (validationError) {
      console.error("=== PRODUCTION DEBUG INFO ===");
      console.error("Environment:", process.env.NODE_ENV);
      console.error("Vercel Region:", process.env.VERCEL_REGION);
      console.error("OpenAI API Key exists:", !!process.env.OPENAI_API_KEY);
      console.error("Original OpenAI response:", responseContent);
      console.error("Cleaned content:", cleanedContent);
      console.error(
        "Parsed response:",
        JSON.stringify(parsedResponse, null, 2)
      );
      console.error("Zod validation error:", validationError);
      console.error("=== END DEBUG INFO ===");

      if (validationError instanceof z.ZodError) {
        const errorDetails = validationError.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join("; ");

        // More specific error handling for production debugging
        const isPatternError = validationError.errors.some(
          (err) =>
            err.message.includes("string did not match") ||
            err.message.includes("pattern")
        );

        if (isPatternError) {
          console.error(
            "PATTERN ERROR DETECTED - this will trigger Datenformat-Fehler"
          );
          console.error("Validation error details:", errorDetails);

          return NextResponse.json(
            {
              error: `string did not match pattern: ${errorDetails}`,
              details: errorDetails,
              originalResponse: parsedResponse,
              rawResponse: responseContent,
              environment: process.env.NODE_ENV,
            },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            error: "Die KI-Antwort entspricht nicht dem erwarteten Format",
            details: errorDetails,
            originalResponse: parsedResponse,
          },
          { status: 500 }
        );
      }

      throw validationError;
    }

    console.log("=== ANALYZE SUCCESS ===");
    console.log("Processing time:", Date.now() - startTime, "ms");
    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.log("=== ANALYZE ERROR ===");
    console.error("Analyse-Fehler:", error);
    console.log("Processing time:", Date.now() - startTime, "ms");

    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error details:", {
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type,
      });
      return NextResponse.json(
        {
          error: `OpenAI API Fehler: ${error.message}`,
          details: `Status: ${error.status}, Code: ${error.code}`,
        },
        { status: 500 }
      );
    }

    if (error instanceof z.ZodError) {
      const errorDetails = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("; ");

      return NextResponse.json(
        {
          error: "Validierungsfehler bei OpenAI Antwort",
          details: errorDetails,
        },
        { status: 500 }
      );
    }

    // For any other error, provide more debug info
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      type: error instanceof Error ? error.constructor.name : typeof error,
    });

    return NextResponse.json(
      {
        error: "Fehler bei der Bildanalyse",
        details: errorMessage,
        environment: process.env.NODE_ENV,
      },
      { status: 500 }
    );
  }
}
