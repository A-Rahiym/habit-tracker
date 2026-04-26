'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addUser, saveSession } from "@/src/lib/storage";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSignUp = () => {

        const user = {
            id: crypto.randomUUID(),
            email,
            password,
            createdAt: new Date().toISOString(),
        };

        try {
            addUser(user);
        } catch {
            alert('User already exists');
            return;
        }

        saveSession({
            userId: user.id,
            email: user.email
        })
    }

    return (<div className="h-screen flex items-center justify-center">
        <div className="w-full max-w-sm space-y-4">
            <h1 className="text-xl font-semibold">Create Account</h1>
            <input
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-violet-500"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
               <input
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-violet-500"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button 
            onClick={handleSignUp}
            className="w-full bg-violet-600 text-white py-3 rounded-xl"
            >
                Sign up
            </button>

            <p
            className="text-sm text-center text-white cursor-pointer"
            onClick={() => router.back()}            
            >back to login</p>
        </div>

    </div>)
}