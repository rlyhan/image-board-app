import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { auth0 } from "@/lib/auth0";
import "./globals.css";
import { MainNav } from "@/components";
import { FavouritesProvider } from "@/context/FavouritesContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Image Board App",
  description: "A simple image board creator where you also buy prints.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();
  const user = session?.user;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <ToastProvider>
            <MainNav isAuthenticated={!!user} />
            <FavouritesProvider>
              {children}
            </FavouritesProvider>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
