'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/src/lib/auth";
import { SplashScreen } from "@/src/components/shared/SplashScreen";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      console.log("Checking user session...");
      const user = await getCurrentUser();
      if (cancelled) return;
      router.replace(user ? "/dashboard" : "/login");
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [router]);
  return <SplashScreen />;
}