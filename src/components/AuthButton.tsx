"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { signOut } from "@/app/auth/login/actions";

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="btn btn-primary btn-sm loading">Loading...</div>;
  }

  if (!user) {
    const handleSignIn = () => {
      window.location.href = "/auth/login";
    };

    return (
      <button onClick={handleSignIn} className="btn btn-primary btn-sm">
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-base-content/70">Hey, {user.email}!</span>
      <form action={signOut}>
        <button className="btn btn-outline btn-sm">Sign Out</button>
      </form>
    </div>
  );
}
