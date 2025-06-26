// Pure function for process step data
export const getProcessSteps = () =>
  [
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      ),
      title: "Foto hochladen",
      description: "Bild deines Raumes aufnehmen",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      ),
      title: "KI analysiert",
      description: "Stil, Farben und Potenzial erkennen",
      bgColor: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      ),
      title: "Transformation",
      description: "Personalisierte Designvorschläge",
      bgColor: "bg-success/10",
      iconColor: "text-success",
    },
  ] as const;

// Pure function for feature indicators
export const getFeatureIndicators = () =>
  [
    {
      label: "KI Analyse",
      color: "bg-success",
    },
    {
      label: "Farb-Optimierung",
      color: "bg-primary",
    },
    {
      label: "Möbel-Vorschläge",
      color: "bg-accent",
    },
  ] as const;
