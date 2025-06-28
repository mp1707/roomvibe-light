"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useAppState } from "@/utils/store";

export function StateGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { localImageUrl, hostedImageUrl } = useAppState();

  // Wir brauchen einen Zustand, um zu wissen, ob die Komponente auf dem Client gemountet wurde.
  // Auf dem Server ist dieser Wert immer `false`.
  const [isClient, setIsClient] = useState(false);

  // Sobald die Komponente im Browser des Nutzers geladen wird, setzen wir diesen Wert auf `true`.
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Define routes that should be protected (require localImageUrl or hostedImageUrl)
    const protectedRoutes = ["/suggestions", "/analyze"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Only redirect if we're on a protected route without any image
    if (isClient && isProtectedRoute && !localImageUrl && !hostedImageUrl) {
      router.replace("/");
    }
  }, [isClient, pathname, localImageUrl, hostedImageUrl, router]);

  // Only block rendering for protected routes without an image
  const protectedRoutes = ["/suggestions", "/analyze"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isClient && isProtectedRoute && !localImageUrl && !hostedImageUrl) {
    return null; // Redirect is happening in useEffect above
  }

  // In allen anderen Fällen (entweder auf dem Server, auf der Startseite,
  // oder auf dem Client mit gültigem Zustand) wird die Seite normal angezeigt.
  return <>{children}</>;
}
