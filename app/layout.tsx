import type { Metadata } from "next";
import { Barlow, Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";

// clerk provider
import { ClerkProvider } from "@clerk/nextjs";

// theme provider
import { ThemeProvider } from "@/components/providers/theme-provider";

// components
import { ModalProvider } from "@/components/providers/modal-provider";
import ChatSheet from "@/components/QuickSheet/QuickSheet";

// toaster
import { Toaster } from "@/components/ui/sonner";

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
    <ClerkProvider afterSignOutUrl={"/login"}>
      <html lang="en">
        <body
          className={`${barlow.variable} ${poppins.variable} ${space.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={false}
            storageKey="aurora-theme"
          >
            <Toaster richColors={true} />
            <ModalProvider />
            <ChatSheet />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
