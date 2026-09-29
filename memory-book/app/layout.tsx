import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memory Book | Preserve the Stories That Matter",
  description: "Gather your family's photos, memories, and stories in one shared keepsake.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
