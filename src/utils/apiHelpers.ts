import { useSettingsStore } from "./settingsStore";

// Helper function to get the correct API endpoint based on mock settings
export function getAnalyzeEndpoint(): string {
  const mockImageAnalysis = useSettingsStore.getState().mockImageAnalysis;
  return mockImageAnalysis ? "/api/mock-analyze" : "/api/analyze";
}

export function getGenerateImageEndpoint(): string {
  const mockImageGeneration = useSettingsStore.getState().mockImageGeneration;
  return mockImageGeneration
    ? "/api/mock-generate-image"
    : "/api/generate-image";
}

export function getGeneratePromptEndpoint(): string {
  const mockImageGeneration = useSettingsStore.getState().mockImageGeneration;
  return mockImageGeneration
    ? "/api/mock-generate-prompt"
    : "/api/generate-prompt";
}

export function getPredictionEndpoint(predictionId: string): string {
  // Check if it's a mock prediction ID
  if (predictionId.startsWith("mock_")) {
    return `/api/mock-predictions/${predictionId}`;
  }
  return `/api/predictions/${predictionId}`;
}

// Non-hook version for use in server components or outside React components
export function getAnalyzeEndpointStatic(mockEnabled: boolean): string {
  return mockEnabled ? "/api/mock-analyze" : "/api/analyze";
}

export function getGenerateImageEndpointStatic(mockEnabled: boolean): string {
  return mockEnabled ? "/api/mock-generate-image" : "/api/generate-image";
}
