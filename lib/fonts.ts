import { Geist, Geist_Mono } from "next/font/google";

export const primary_font = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const secondary_font = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});