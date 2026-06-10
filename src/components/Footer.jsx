import logoImg from "../assets/images/logo.png";

export function Footer() {
  return (
    <footer class="relative border-t border-border/50 py-6 mt-6">
      <div class="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div class="flex items-center gap-2">
          <img src={logoImg} alt="GCX Logo" class="h-6 w-auto object-contain" />
          <span class="font-bold font-display text-foreground">GCX</span>
          <span>· Gift card exchange</span>
        </div>
        <div class="flex gap-6">
          <a href="#" class="hover:text-foreground transition">Privacy</a>
          <a href="#" class="hover:text-foreground transition">Terms</a>
          <a href="#" class="hover:text-foreground transition">Support</a>
        </div>
        <p>© {new Date().getFullYear()} GCX. All rights reserved.</p>
      </div>
    </footer>
  );
}
export default Footer;
