'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/src/lib/storage";

export default function SplashPage() {
const router = useRouter();

useEffect(() => {
    const timer = setTimeout(() => {
        const session = getSession();
        if (session) {
            router.push('/dashboard');
        } else {
            router.push('/signup');
        }
    }, 2000);

    return () => clearTimeout(timer);


}, [router]);

return (
    <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Habit Tracker</h1>
    </div>
);
}