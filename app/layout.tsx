import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Move Planner — Know if you're ready to buy before you sell",
  description:
    "A product discovery prototype: helping homeowners understand whether they're financially ready to buy their next home before selling their current one.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
