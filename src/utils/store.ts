import { create } from "zustand";
import { Suggestion } from "@/types/suggestions";

interface AppState {
  // Image management
  localImageUrl: string | null;
  hostedImageUrl: string | null;
  currentGeneratedImage: string | null;

  // Suggestion management
  appliedSuggestions: Set<string>;
  suggestions: Suggestion[];
  customSuggestions: Suggestion[];

  // Style management
  selectedStyle: string | null;
  appliedStyles: Map<string, string>; // styleId -> generatedImageUrl
  lastAppliedStyleId: string | null;
  styleGenerationProgress: number;

  // Generation state
  prediction: any | null;
  isGenerating: boolean;
  generationError: string | null;

  // Image setters
  setLocalImageUrl: (file: File | null) => void;
  setHostedImageUrl: (url: string | null) => void;

  // Suggestion setters
  addAppliedSuggestion: (suggestionId: string) => void;
  removeAppliedSuggestion: (suggestionId: string) => void;
  toggleAppliedSuggestion: (suggestionId: string) => void;
  setSuggestions: (suggestions: Suggestion[]) => void;
  setCustomSuggestions: (suggestions: Suggestion[]) => void;
  addCustomSuggestion: (suggestion: Omit<Suggestion, "id">) => void;
  editCustomSuggestion: (
    id: string,
    suggestion: Omit<Suggestion, "id">
  ) => void;
  removeCustomSuggestion: (id: string) => void;

  // Style setters
  setSelectedStyle: (styleId: string | null) => void;
  addAppliedStyle: (styleId: string, imageUrl: string) => void;
  setLastAppliedStyleId: (styleId: string | null) => void;
  removeAppliedStyle: (styleId: string) => void;
  setStyleGenerationProgress: (progress: number) => void;

  // Generation setters
  setPrediction: (prediction: any | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationError: (error: string | null) => void;

  // Reset utilities
  reset: () => void;
  resetForNewImage: () => void;
  resetSuggestionsAndGeneration: () => void;
}

const initialState = {
  localImageUrl: null,
  hostedImageUrl: null,
  currentGeneratedImage: null,
  appliedSuggestions: new Set<string>(),
  suggestions: [],
  customSuggestions: [],
  selectedStyle: null,
  appliedStyles: new Map<string, string>(),
  lastAppliedStyleId: null,
  styleGenerationProgress: 0,
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

  addAppliedSuggestion: (suggestionId) => {
    set((state) => ({
      appliedSuggestions: new Set([...state.appliedSuggestions, suggestionId]),
    }));
  },

  removeAppliedSuggestion: (suggestionId) => {
    set((state) => {
      const newSet = new Set(state.appliedSuggestions);
      newSet.delete(suggestionId);
      return { appliedSuggestions: newSet };
    });
  },

  toggleAppliedSuggestion: (suggestionId) => {
    set((state) => {
      const newSet = new Set(state.appliedSuggestions);
      if (newSet.has(suggestionId)) {
        newSet.delete(suggestionId);
      } else {
        newSet.add(suggestionId);
      }
      return { appliedSuggestions: newSet };
    });
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

  setSelectedStyle: (styleId) => {
    set({ selectedStyle: styleId });
  },

  addAppliedStyle: (styleId, imageUrl) => {
    set((state) => {
      const newAppliedStyles = new Map(state.appliedStyles);
      newAppliedStyles.set(styleId, imageUrl);
      return { appliedStyles: newAppliedStyles };
    });
  },

  setLastAppliedStyleId: (styleId) => set({ lastAppliedStyleId: styleId }),

  removeAppliedStyle: (styleId) => {
    set((state) => {
      const newAppliedStyles = new Map(state.appliedStyles);
      newAppliedStyles.delete(styleId);
      return { appliedStyles: newAppliedStyles };
    });
  },

  setStyleGenerationProgress: (progress) => {
    set({ styleGenerationProgress: progress });
  },

  setPrediction: (prediction) => {
    // Extract the current image from prediction output
    let currentImage: string | null = null;

    if (prediction?.output) {
      if (Array.isArray(prediction.output)) {
        currentImage = prediction.output[0] || null;
      } else if (typeof prediction.output === "string") {
        currentImage = prediction.output;
      }
    }

    const currentState = get();

    set({
      prediction,
      isGenerating:
        prediction?.status === "starting" ||
        prediction?.status === "processing",
      generationError: prediction?.error ? prediction.error : null,
      // Only update currentGeneratedImage if we have a new image, otherwise preserve the existing one
      currentGeneratedImage: currentImage || currentState.currentGeneratedImage,
    });
  },

  setIsGenerating: (isGenerating) => {
    set({ isGenerating });
  },

  setGenerationError: (error) => {
    set({ generationError: error });
  },

  // Complete reset - for page reloads or complete app restart
  reset: () => {
    // Clean up object URLs to prevent memory leaks
    const currentUrl = get().localImageUrl;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }

    set({
      ...initialState,
      appliedSuggestions: new Set<string>(),
      appliedStyles: new Map<string, string>(),
    });
  },

  // Reset for new image upload - keeps settings but clears image-related state
  resetForNewImage: () => {
    // Clean up object URLs to prevent memory leaks
    const currentUrl = get().localImageUrl;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }

    set({
      localImageUrl: null,
      hostedImageUrl: null,
      currentGeneratedImage: null,
      appliedSuggestions: new Set<string>(),
      suggestions: [],
      customSuggestions: [],
      selectedStyle: null,
      appliedStyles: new Map<string, string>(),
      lastAppliedStyleId: null,
      styleGenerationProgress: 0,
      prediction: null,
      isGenerating: false,
      generationError: null,
    });
  },

  // Reset suggestions and generation state - for when restarting the suggestion flow
  resetSuggestionsAndGeneration: () => {
    set({
      appliedSuggestions: new Set<string>(),
      suggestions: [],
      customSuggestions: [],
      selectedStyle: null,
      appliedStyles: new Map<string, string>(),
      styleGenerationProgress: 0,
      prediction: null,
      isGenerating: false,
      generationError: null,
      currentGeneratedImage: null,
    });
  },
}));
