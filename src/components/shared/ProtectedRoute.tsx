"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/src/lib/auth";
import { SplashScreen } from "@/src/components/shared/SplashScreen";

export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const user = await getCurrentUser();
      if (cancelled) return;
      if (!user) {
        router.replace("/login");
        return;
      }
      setReady(true);
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) return <SplashScreen />;
  return <>{children}</>;
}

