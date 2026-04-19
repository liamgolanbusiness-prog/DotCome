import type { Metadata, Viewport } from "next";
import { Heebo, Rubik } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import PageLoader from "@/components/ui/PageLoader";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-rubik",
  display: "swap",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "DotCome · סטודיו לבניית אתרים שלא נשכחים",
  description:
    "DotCome הוא סטודיו דיגיטלי שבונה אתרים, מותגים וחוויות שמשאירים רושם. עיצוב, פיתוח, ומיתוג ברמה עולמית.",
  metadataBase: new URL("https://dotcome.co.il"),
  openGraph: {
    title: "DotCome · סטודיו דיגיטלי",
    description: "אתרים, מותגים וחוויות שלא נשכחים.",
    locale: "he_IL",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${rubik.variable}`}>
      <body className="bg-ink-950 text-fg font-sans antialiased noise">
        <LenisProvider>
          <PageLoader />
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          <main className="relative">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
