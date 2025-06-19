"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppState } from "@/utils/store";

export function StateGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const localImageUrl = useAppState((state) => state.localImageUrl);

    // Wir brauchen einen Zustand, um zu wissen, ob die Komponente auf dem Client gemountet wurde.
    // Auf dem Server ist dieser Wert immer `false`.
    const [isClient, setIsClient] = useState(false);

    // Sobald die Komponente im Browser des Nutzers geladen wird, setzen wir diesen Wert auf `true`.
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && pathname !== "/" && !localImageUrl) {
            router.replace("/");
        }
    }, [isClient, pathname, localImageUrl, router]);


    // Wenn wir auf dem Client sind, auf einer geschützten Route (`!= /`),
    // und der Bild-Zustand fehlt, rendern wir einfach NICHTS.
    // Die Umleitung im `useEffect` oben wird den Rest erledigen.
    if (isClient && pathname !== "/" && !localImageUrl) {
        return null; // Oder einen Lade-Spinner: <Spinner />
    }
    
    // In allen anderen Fällen (entweder auf dem Server, auf der Startseite,
    // oder auf dem Client mit gültigem Zustand) wird die Seite normal angezeigt.
    return <>{children}</>;
}