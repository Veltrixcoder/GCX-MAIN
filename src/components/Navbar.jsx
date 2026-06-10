import { createSignal, onSettled } from "solid-js";
import { Link, currentPath } from "./router";
import { Menu, X } from "lucide-solid";
import logoImg from "../assets/images/logo.png";

export function Navbar() {
  const [isOpen, setIsOpen] = createSignal(false);

  onSettled(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    
    const applyTheme = () => {
      if (mediaQuery.matches) {
        root.classList.add("light");
      } else {
        root.classList.remove("light");
      }
    };

    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  });

  const getNavLink = (hash) => {
    return currentPath() === "/" ? hash : `/${hash}`;
  };

  return (
    <header class="fixed top-0 inset-x-0 z-50">
      <div class="mx-auto mt-4 max-w-6xl px-4 flex flex-col gap-2">
        <nav class="liquid-glass flex items-center justify-between rounded-full px-6 py-2.5">
          <Link to="/" class="flex items-center gap-2">
            <img src={logoImg} alt="GCX Logo" class="h-8 w-auto object-contain" />
            <span class="text-lg font-bold tracking-wide font-display text-foreground">GCX</span>
          </Link>
          
          {/* Desktop links */}
          <div class="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href={getNavLink("#brands")} class="hover:text-foreground transition">Cards</a>
            <a href={getNavLink("#how")} class="hover:text-foreground transition">How it works</a>
            <a href={getNavLink("#payouts")} class="hover:text-foreground transition">Payouts</a>
            <Link to="/reviews" class="hover:text-foreground transition">Reviews</Link>
            <a href={getNavLink("#faq")} class="hover:text-foreground transition">FAQ</a>
          </div>

          <div class="flex items-center gap-2.5">
            {/* Desktop CTA */}
            <a
              href={getNavLink("#brands")}
              class="hidden md:inline-flex rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 hover:border-primary/45 text-primary backdrop-blur-md px-5 py-2 text-sm font-semibold transition-all duration-300 shadow-sm cursor-pointer"
            >
              Sell card
            </a>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen())}
              class="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen() ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        <div
          class={`md:hidden liquid-glass rounded-[2rem] p-5 flex flex-col gap-4 border border-border/60 shadow-2xl overflow-hidden transition-all duration-200 transform origin-top ${
            isOpen() ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-2 pointer-events-none invisible absolute"
          }`}
        >
          <div class="flex flex-col gap-3.5 text-xs font-semibold text-muted-foreground">
            <a 
              href={getNavLink("#brands")} 
              onClick={() => setIsOpen(false)}
              class="hover:text-foreground transition py-1.5 border-b border-border/10"
            >
              Cards
            </a>
            <a 
              href={getNavLink("#how")} 
              onClick={() => setIsOpen(false)}
              class="hover:text-foreground transition py-1.5 border-b border-border/10"
            >
              How it works
            </a>
            <a 
              href={getNavLink("#payouts")} 
              onClick={() => setIsOpen(false)}
              class="hover:text-foreground transition py-1.5 border-b border-border/10"
            >
              Payouts
            </a>
            <Link 
              to="/reviews" 
              onClick={() => setIsOpen(false)}
              class="hover:text-foreground transition py-1.5 border-b border-border/10"
            >
              Reviews
            </Link>
            <a 
              href={getNavLink("#faq")} 
              onClick={() => setIsOpen(false)}
              class="hover:text-foreground transition py-1.5"
            >
              FAQ
            </a>
          </div>
          <a
            href={getNavLink("#brands")}
            onClick={() => setIsOpen(false)}
            class="w-full text-center rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 hover:border-primary/45 text-primary backdrop-blur-md py-2.5 text-xs font-bold transition block"
          >
            Sell Card
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
