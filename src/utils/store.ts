import { create } from "zustand";

type Suggestion = Record<string, string>;

interface AppState {
	localImageUrl: string | null;
	hostedImageUrl: string | null;
	suggestions: Suggestion[];
	suggestionsToApply: Set<string>;

	setLocalImageUrl: (file: File | null) => void;
	setHostedImageUrl: (url: string | null) => void;
	setSuggestions: (suggestions: Suggestion[]) => void;
	setSuggestionsToApply: (suggestions: Set<string>) => void;
	reset: () => void;
}

const initialState = {
	localImageUrl: null,
	hostedImageUrl: null,
	suggestions: [],
	suggestionsToApply: new Set<string>(),
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

	setSuggestions: (newSuggestions) => {
		set({ suggestions: newSuggestions });
	},

	setSuggestionsToApply: (suggestions) => {
		set({ suggestionsToApply: suggestions });
	},

	reset: () => {
		// Wichtig: Auch beim Reset die eventuell noch vorhandene lokale URL freigeben.
		const currentUrl = get().localImageUrl;
		if (currentUrl) {
			URL.revokeObjectURL(currentUrl);
		}
		set(initialState);
	},
}));
