import React from "react";

export interface NavStep {
  label: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

// Navigation steps configuration
export const getNavigationSteps = (currentRoute: string): NavStep[] => {
  const baseSteps: NavStep[] = [
    {
      label: "Hochladen",
      href: "/upload",
      icon: React.createElement("svg", {
        className: "w-4 h-4",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
      }, React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      })),
    },
    {
      label: "Modus wählen", 
      href: "/select-mode",
      icon: React.createElement("svg", {
        className: "w-4 h-4",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
      }, React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      })),
    }
  ];

  // Add the appropriate third step based on current route
  if (currentRoute.includes('change-style')) {
    baseSteps.push({
      label: "Stil ändern",
      href: "/change-style",
      icon: React.createElement("svg", {
        className: "w-4 h-4",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
      }, React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
      })),
    });
  } else if (currentRoute.includes('suggestions') || currentRoute.includes('analyze')) {
    // Add intermediate analyze step for suggestions workflow
    baseSteps.push({
      label: "Analysieren",
      href: "/analyze",
      icon: React.createElement("svg", {
        className: "w-4 h-4",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
      }, React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M13 10V3L4 14h7v7l9-11h-7z"
      })),
      disabled: currentRoute.includes('select-mode'),
    });
    
    baseSteps.push({
      label: "Vorschläge",
      href: "/suggestions", 
      icon: React.createElement("svg", {
        className: "w-4 h-4",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor"
      }, React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      })),
      disabled: currentRoute.includes('select-mode'),
    });
  }

  return baseSteps;
};

// Helper function to extract route from full path (handles locale prefixes)
export const extractRoute = (fullPath: string): string => {
  // Remove locale prefix (e.g., /de/analyze -> /analyze)
  const pathParts = fullPath.split('/').filter(Boolean);
  
  // If first part looks like a locale (2-letter code), skip it
  if (pathParts.length > 0 && pathParts[0].length === 2) {
    pathParts.shift();
  }
  
  // Return the route part
  return pathParts.length > 0 ? `/${pathParts[0]}` : '/';
};

// Helper function to find current step index
export const findCurrentStepIndex = (currentStep: string, steps: NavStep[]): number => {
  const normalizedCurrentStep = extractRoute(currentStep);
  
  return steps.findIndex(step => {
    const stepRoute = extractRoute(step.href);
    return normalizedCurrentStep === stepRoute;
  });
};