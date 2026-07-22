"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredTokens } from "@/lib/auth-storage";

/**
 * Portier d'authentification côté client.
 *
 * Rôle : si aucun token n'est présent, rediriger vers /login avant d'afficher
 * une page protégée. La vraie serrure reste le backend (401 sur tout sans
 * token) ; ce garde évite seulement d'afficher une UI qui se remplirait
 * d'erreurs. Posé dans AppShell, il ne concerne jamais /login (qui n'utilise
 * pas AppShell) — donc pas de boucle de redirection.
 *
 * Un token présent mais expiré n'est PAS bloqué ici : le backend renverra
 * 401 et l'interceptor du client API gère déjà le refresh puis la
 * redirection. Ce garde ne traite que le cas "aucun token".
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (!getStoredTokens()) {
      const next = encodeURIComponent(pathname);
      router.replace(`/login?next=${next}`);
    } else {
      setChecked(true);
    }
  }, [router, pathname]);

  // Tant que le token n'est pas confirmé présent, on n'affiche rien
  // (évite le flash de contenu avant redirection).
  if (!checked) return null;

  return <>{children}</>;
}
