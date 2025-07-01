// Shared types for suggestions across the app
export interface Suggestion {
  id: string;
  title: string;
  suggestion: string;
  explanation?: string;
  category: string;
}

export interface SuggestionCategory {
  category: string;
  suggestions: Array<Omit<Suggestion, "category">>;
}

export interface AnalysisResponse {
  isInteriorSpace: boolean;
  suggestions: Suggestion[];
}

// Interior design styles for style transformation
export interface InteriorStyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  prompt: string; // For AI generation
}
