import { Outfit } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
          <ThemeProvider>
            <SidebarProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </SidebarProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}