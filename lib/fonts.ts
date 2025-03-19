import { Geist, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local';

export const primary_font = localFont({
    src: "../public/Satoshi-Variable.ttf",
    display: 'swap',
});

/*Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});*/

export const secondary_font = localFont({
    src: "../public/ClashDisplay-Variable.ttf",
    display: 'swap',
});

/*Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});*/