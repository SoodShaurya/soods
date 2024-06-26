import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <div className="container pt-4 animate-in fade-in">{children}</div>;
}
