import { create } from "zustand";
import { Suggestion } from "@/types/suggestions";

interface AppState {
  localImageUrl: string | null;
  hostedImageUrl: string | null;
  generatedImageUrls: string[];
  currentGeneratedImage: string | null;
  appliedSuggestions: Set<string>;
  suggestions: Suggestion[];
  customSuggestions: Suggestion[];
  suggestionsToApply: Set<string>;
  selectedSuggestionsForGeneration: Suggestion[];
  prediction: any | null;
  isGenerating: boolean;
  generationError: string | null;

  setLocalImageUrl: (file: File | null) => void;
  setHostedImageUrl: (url: string | null) => void;
  setGeneratedImageUrls: (urls: string[]) => void;
  setCurrentGeneratedImage: (url: string | null) => void;
  setAppliedSuggestions: (suggestions: Set<string>) => void;
  addAppliedSuggestion: (suggestionId: string) => void;
  setSuggestions: (suggestions: Suggestion[]) => void;
  setCustomSuggestions: (suggestions: Suggestion[]) => void;
  addCustomSuggestion: (suggestion: Omit<Suggestion, "id">) => void;
  editCustomSuggestion: (
    id: string,
    suggestion: Omit<Suggestion, "id">
  ) => void;
  removeCustomSuggestion: (id: string) => void;
  getAllSuggestions: () => Suggestion[];
  setSuggestionsToApply: (suggestions: Set<string>) => void;
  setSelectedSuggestionsForGeneration: (suggestions: Suggestion[]) => void;
  setPrediction: (prediction: any | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  localImageUrl: null,
  hostedImageUrl: null,
  generatedImageUrls: [],
  currentGeneratedImage: null,
  appliedSuggestions: new Set<string>(),
  suggestions: [],
  customSuggestions: [],
  suggestionsToApply: new Set<string>(),
  selectedSuggestionsForGeneration: [],
  prediction: null,
  isGenerating: false,
  generationError: null,
};

export const useAppState = create<AppState>((set, get) => ({
  ...initialState,

  setLocalImageUrl: (file) => {
    // Gibt die URL des alten Bildes frei, um Memory-Leaks im Browser zu verhindern.
    const currentUrl = get().localImageUrl;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }

    if (file) {
      const newLocalUrl = URL.createObjectURL(file);
      set({ localImageUrl: newLocalUrl });
    } else {
      set({ localImageUrl: null });
    }
  },

  setHostedImageUrl: (url) => {
    set({ hostedImageUrl: url });
  },

  setGeneratedImageUrls: (urls) => {
    set({ generatedImageUrls: urls });
  },

  setCurrentGeneratedImage: (url) => {
    set({ currentGeneratedImage: url });
  },

  setAppliedSuggestions: (suggestions) => {
    set({ appliedSuggestions: suggestions });
  },

  addAppliedSuggestion: (suggestionId) => {
    set((state) => ({
      appliedSuggestions: new Set([...state.appliedSuggestions, suggestionId]),
    }));
  },

  setSuggestions: (newSuggestions) => {
    set({ suggestions: newSuggestions });
  },

  setCustomSuggestions: (customSuggestions) => {
    set({ customSuggestions });
  },

  addCustomSuggestion: (suggestionData) => {
    const newSuggestion: Suggestion = {
      ...suggestionData,
      explanation: suggestionData.explanation || "",
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state) => ({
      customSuggestions: [...state.customSuggestions, newSuggestion],
    }));
  },

  editCustomSuggestion: (id, suggestionData) => {
    set((state) => ({
      customSuggestions: state.customSuggestions.map((suggestion) =>
        suggestion.id === id
          ? {
              ...suggestionData,
              explanation: suggestionData.explanation || "",
              id,
            }
          : suggestion
      ),
    }));
  },

  removeCustomSuggestion: (id) => {
    set((state) => ({
      customSuggestions: state.customSuggestions.filter(
        (suggestion) => suggestion.id !== id
      ),
    }));
  },

  getAllSuggestions: () => {
    const state = get();
    return [...state.suggestions, ...state.customSuggestions];
  },

  setSuggestionsToApply: (suggestions) => {
    set({ suggestionsToApply: suggestions });
  },

  setSelectedSuggestionsForGeneration: (suggestions) => {
    set({ selectedSuggestionsForGeneration: suggestions });
  },

  setPrediction: (prediction) => {
    // Ensure generatedImageUrls is always an array
    let urls: string[] = [];
    let currentImage: string | null = null;

    if (prediction?.output) {
      if (Array.isArray(prediction.output)) {
        urls = prediction.output;
        currentImage = prediction.output[0] || null;
      } else if (typeof prediction.output === "string") {
        urls = [prediction.output];
        currentImage = prediction.output;
      }
    }

    set({
      prediction,
      isGenerating:
        prediction?.status === "starting" ||
        prediction?.status === "processing",
      generationError: prediction?.error ? prediction.error : null,
      generatedImageUrls: urls,
      currentGeneratedImage: currentImage,
    });
  },

  setIsGenerating: (isGenerating) => {
    set({ isGenerating });
  },

  setGenerationError: (error) => {
    set({ generationError: error });
  },

  reset: () => {
    // Wichtig: Auch beim Reset die eventuell noch vorhandene lokale URL freigeben.
    const currentUrl = get().localImageUrl;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
    set({
      ...initialState,
      appliedSuggestions: new Set<string>(),
      suggestionsToApply: new Set<string>(),
      currentGeneratedImage: null,
    });
  },
}));
