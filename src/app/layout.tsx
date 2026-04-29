import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "../components/shared/ServiceWorkerRegister";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Habit Tracker - Your Personal Habit Tracker",
  description: "Habit Tracker is a simple and intuitive habit tracker designed to help you build and maintain positive habits. With a clean interface and powerful features, Habit Tracker makes it easy to stay consistent and motivated on your journey to self-improvement.",
  manifest: "/manifest.json"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}