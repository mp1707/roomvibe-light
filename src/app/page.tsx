"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import UploadForm from "@/components/UploadForm";
import WelcomeScreen from "@/components/WelcomeScreen/WelcomeScreen";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Show welcome screen for unauthenticated users
  if (!user) {
    return <WelcomeScreen />;
  }

  // Show upload form for authenticated users
  return <UploadForm />;
}
