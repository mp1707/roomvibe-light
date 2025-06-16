import { create } from "zustand";

type Suggestion = Record<string, string>;

interface ImageState {
	localImageUrl: string | null;
	hostedImageUrl: string | null;
	suggestions: Suggestion[];

	setLocalImageUrl: (file: File | null) => void;
	setHostedImageUrl: (url: string | null) => void;
	setSuggestions: (suggestions: Suggestion[]) => void;
	reset: () => void;
}

const initialState = {
	localImageUrl: null,
	hostedImageUrl: null,
	suggestions: [],
};

export const useImageStore = create<ImageState>((set, get) => ({
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

	reset: () => {
		// Wichtig: Auch beim Reset die eventuell noch vorhandene lokale URL freigeben.
		const currentUrl = get().localImageUrl;
		if (currentUrl) {
			URL.revokeObjectURL(currentUrl);
		}
		set(initialState);
	},
}));
