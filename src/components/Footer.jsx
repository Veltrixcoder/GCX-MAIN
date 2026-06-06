import React from "react";
import logoImg from "../assets/logo.png";

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 py-12 mt-12">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="GCX Logo" className="h-6 w-auto object-contain" />
          <span className="font-bold font-display text-foreground">GCX</span>
          <span>· Gift card exchange</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition">Privacy</a>
          <a href="#" className="hover:text-foreground transition">Terms</a>
          <a href="#" className="hover:text-foreground transition">Support</a>
        </div>
        <p>© {new Date().getFullYear()} GCX. All rights reserved.</p>
      </div>
    </footer>
  );
}
export default Footer;
