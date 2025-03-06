import type { Metadata } from "next";
import { Barlow, Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";

// theme provider
import { ThemeProvider } from "@/components/providers/theme-provider";

import { SidebarProvider } from "@/components/ui/sidebar";

const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["100", "200", "300"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "900"],
});

const space = Space_Grotesk({
  variable: "--font-space",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Aurora AI",
  description: "Personal AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${barlow.variable} ${poppins.variable} ${space.variable} antialiased`}
      >
        <SidebarProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={false}
            storageKey="aurora-theme"
          >
            {children}
          </ThemeProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
