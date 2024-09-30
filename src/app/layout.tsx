import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import AppProvider from "@/components/app-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Nhà Hàng Baemyn",
  description:
    "Trải nghiệm ẩm thực đẳng cấp tại nhà hàng chất lượng ở Đà Nẵng. Chúng tôi tự hào mang đến những món ăn tinh tế, chế biến từ nguyên liệu tươi ngon nhất, trong không gian sang trọng và dịch vụ chuyên nghiệp. Đến với chúng tôi để tận hưởng hương vị ẩm thực đỉnh cao cùng phong cách phục vụ chu đáo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <AppProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
