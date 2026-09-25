// layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavigationProvider } from "@/context/navigation-context";
import { UserProvider } from "@/context/user-context";
import { Metadata } from "next";
import { PageTransition } from "@/components/ui/page-transition";
import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary";
import DemoRoleSwitcher from "@/components/demo/DemoRoleSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Accenture Resource Management",
  description: "Resource management platform for Accenture projects",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-white`}
      >
        <NavigationProvider>
          <UserProvider>
            <AuthErrorBoundary>
              <PageTransition />
              {children}
              <DemoRoleSwitcher />
            </AuthErrorBoundary>
          </UserProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}
