import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  CreditState,
  CreditDeductionResponse,
  CreditBalanceResponse,
  CREDIT_COSTS,
  InsufficientCreditsError,
  CreditOperationError,
} from "@/types/credits";

interface CreditsStore extends CreditState {
  // Actions
  fetchCredits: () => Promise<void>;
  deductCredits: (
    amount: number,
    description: string,
    referenceId?: string
  ) => Promise<boolean>;
  refreshCredits: () => Promise<void>;
  reset: () => void;

  // Utility functions
  hasEnoughCredits: (amount: number) => boolean;
  canAnalyzeImage: () => boolean;
  canApplySuggestion: () => boolean;

  // Optimistic update helpers
  setOptimisticCredits: (newCredits: number) => void;
  rollbackOptimisticUpdate: () => void;
}

const initialState: CreditState = {
  credits: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

let optimisticCreditsBackup: number | null = null;

// Cache management
let fetchPromise: Promise<void> | null = null;
const CACHE_DURATION = 30000; // 30 seconds instead of 5 seconds

export const useCreditsStore = create<CreditsStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    fetchCredits: async () => {
      const currentState = get();

      // Return existing promise if already fetching
      if (fetchPromise) {
        return fetchPromise;
      }

      // Don't fetch if recently updated (within cache duration)
      if (
        currentState.lastUpdated &&
        Date.now() - currentState.lastUpdated < CACHE_DURATION
      ) {
        return;
      }

      // Don't fetch if already loading
      if (currentState.isLoading) {
        return;
      }

      set({ isLoading: true, error: null });

      fetchPromise = (async () => {
        try {
          const response = await fetch("/api/credits/balance", {
            method: "GET",
            credentials: "include",
            // Add cache headers to prevent unnecessary requests
            cache: "no-cache",
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: CreditBalanceResponse = await response.json();

          if (data.success && typeof data.credits === "number") {
            set({
              credits: data.credits,
              isLoading: false,
              error: null,
              lastUpdated: Date.now(),
            });
          } else {
            throw new CreditOperationError(
              "fetch",
              data.error || "Unbekannter Fehler beim Laden der Credits"
            );
          }
        } catch (error) {
          console.error("Error fetching credits:", error);
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Fehler beim Laden der Credits",
          });
        } finally {
          fetchPromise = null;
        }
      })();

      return fetchPromise;
    },

    deductCredits: async (
      amount: number,
      description: string,
      referenceId?: string
    ): Promise<boolean> => {
      const currentState = get();

      // Check if user has enough credits
      if (!get().hasEnoughCredits(amount)) {
        const error = new InsufficientCreditsError(
          amount,
          currentState.credits || 0
        );
        set({ error: error.message });
        throw error;
      }

      // Optimistic update - store backup first
      if (currentState.credits !== null) {
        optimisticCreditsBackup = currentState.credits;
        set({
          credits: currentState.credits - amount,
          isLoading: true,
          error: null,
        });
      }

      try {
        const response = await fetch("/api/credits/deduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            amount,
            description,
            reference_id: referenceId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CreditDeductionResponse = await response.json();

        if (data.success && typeof data.credits === "number") {
          // Update with actual server response
          set({
            credits: data.credits,
            isLoading: false,
            error: null,
            lastUpdated: Date.now(),
          });
          optimisticCreditsBackup = null;
          return true;
        } else {
          // Rollback optimistic update
          get().rollbackOptimisticUpdate();
          const errorMessage =
            data.error || "Unbekannter Fehler beim Abziehen der Credits";

          if (data.error === "Insufficient credits") {
            const error = new InsufficientCreditsError(
              data.required || amount,
              data.credits || 0
            );
            set({ error: error.message });
            throw error;
          } else {
            const error = new CreditOperationError("deduct", errorMessage);
            set({ error: error.message });
            throw error;
          }
        }
      } catch (error) {
        console.error("Error deducting credits:", error);

        // Rollback optimistic update
        get().rollbackOptimisticUpdate();

        if (
          error instanceof InsufficientCreditsError ||
          error instanceof CreditOperationError
        ) {
          throw error;
        }

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Fehler beim Abziehen der Credits";
        set({ error: errorMessage });
        throw new CreditOperationError("deduct", errorMessage);
      }
    },

    refreshCredits: async () => {
      // Force refresh by clearing lastUpdated and cache
      set({ lastUpdated: null });
      fetchPromise = null;
      await get().fetchCredits();
    },

    reset: () => {
      optimisticCreditsBackup = null;
      fetchPromise = null;
      set({ ...initialState });
    },

    // Utility functions - memoized for better performance
    hasEnoughCredits: (amount: number): boolean => {
      const { credits } = get();
      return credits !== null && credits >= amount;
    },

    canAnalyzeImage: (): boolean => {
      return true; // Analysis is now free, so always return true
    },

    canApplySuggestion: (): boolean => {
      return get().hasEnoughCredits(CREDIT_COSTS.APPLY_SUGGESTION);
    },

    // Optimistic update helpers
    setOptimisticCredits: (newCredits: number) => {
      const currentCredits = get().credits;
      if (currentCredits !== null && optimisticCreditsBackup === null) {
        optimisticCreditsBackup = currentCredits;
      }
      set({ credits: newCredits });
    },

    rollbackOptimisticUpdate: () => {
      if (optimisticCreditsBackup !== null) {
        set({
          credits: optimisticCreditsBackup,
          isLoading: false,
        });
        optimisticCreditsBackup = null;
      } else {
        set({ isLoading: false });
      }
    },
  }))
);

// Helper hook for credit operations with error handling
export const useCreditOperations = () => {
  const store = useCreditsStore();

  const deductCreditsWithErrorHandling = async (
    amount: number,
    description: string,
    referenceId?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await store.deductCredits(amount, description, referenceId);
      return { success: true };
    } catch (error) {
      if (error instanceof InsufficientCreditsError) {
        return {
          success: false,
          error: `Nicht genügend Credits! Sie benötigen ${error.required} Credits, haben aber nur ${error.available}.`,
        };
      } else if (error instanceof CreditOperationError) {
        return {
          success: false,
          error: error.message,
        };
      } else {
        return {
          success: false,
          error: "Ein unerwarteter Fehler ist aufgetreten.",
        };
      }
    }
  };

  return {
    ...store,
    deductCreditsWithErrorHandling,
  };
};
