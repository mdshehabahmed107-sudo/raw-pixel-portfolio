import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAW PIXEL — MD Shehab Ahmed",
  description: "Independent graphic designer crafting distinctive brand identities and visual experiences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
