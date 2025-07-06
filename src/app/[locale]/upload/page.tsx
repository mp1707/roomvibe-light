"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "@/i18n/navigation";
import UploadForm from "@/components/UploadForm";

export default function UploadPage() {
  const [user, setUser] = useState<any>(null);
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // Redirect to login if not authenticated
          router.push("/auth/login");
          return;
        }

        setUser(user);
      } catch (error) {
        console.error("Error getting user:", error);
        router.push("/auth/login");
      }
    };

    getUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push("/auth/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  // Don't show anything if user is not authenticated (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <>
      <UploadForm />
    </>
  );
}
