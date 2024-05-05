import { ReactNode } from "react";
import { NavBar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen animate-in fade-in">
      <nav className="sticky top-0 z-50">
        <NavBar />
      </nav>
      <div className="flex flex-col grow h-full sticky">{children}</div>
      <Footer />
    </div>
  );
}