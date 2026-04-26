"use client";
import { useState, useEffect } from "react";
import { User } from "@/src/types/auth";
import { useRouter } from "next/navigation";
import { getUsers, saveSession } from "@/src/lib/storage";

export default function LoginPage() {

    const router = useRouter();
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleLogin = () => {
        const users = getUsers()
        const user = users.find(
            u => u.email === email && u.password === password
        );

        if (!user) {
            alert('Invalid email or password');
        }

        saveSession({
            userId: user.Id,
            email: user.email
        })

        router.push('/dashboard')
    }


    return (
        <div className="h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-sm space-y-4">
                <h1 className="text-xl font-semibold">
                    Login
                </h1>

                <input
                    className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-violet-600 text-white py-3 rounded-xl active:scale-[0.99]"
                >
                    Login

                </button>
                <p className="text-sm text-center text-white cursor-pointer"
                    onClick={() => router.push('/signup')}
                >
                    Create Account
                </p>
            </div>
        </div>
    )
}