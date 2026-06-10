import amazonCard from "../assets/images/card-amazon-pkV6XfjL.png";
import robloxCard from "../assets/images/card-roblox-Cn_R-R5S.png";

export function CTA() {
  return (
    <section id="start" class="relative py-10 sm:py-14 overflow-hidden">
      {/* Background ambient lighting */}
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[42vw] w-[42vw] rounded-full bg-primary/5 blur-[130px] pointer-events-none" />

      <div class="mx-auto max-w-5xl px-4 relative z-10">
        <div class="relative overflow-hidden rounded-[2.5rem] p-8 sm:p-16 text-center liquid-glass border border-border/60 hover:border-border transition-colors duration-500 shadow-2xl">
          {/* Subtle grid overlay */}
          <div class="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          
          {/* Accent lighting spots inside CTA */}
          <div class="absolute inset-0 [background:var(--gradient-brand)] opacity-10 animate-gradient pointer-events-none" />
          <div class="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
          <div class="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-accent/20 blur-[100px] pointer-events-none" />

          {/* 3D Decorative Floating Cards (peeking from edges) */}
          <img 
            src={amazonCard} 
            alt="Amazon Card Deco" 
            class="absolute -left-12 top-10 h-40 w-auto object-contain opacity-20 blur-[1px] hidden lg:block select-none pointer-events-none animate-float-left"
          />
          <img 
            src={robloxCard} 
            alt="Roblox Card Deco" 
            class="absolute -right-14 bottom-8 h-40 w-auto object-contain opacity-25 blur-[1px] hidden lg:block select-none pointer-events-none animate-float-right"
          />

          <div class="relative z-10">
            <h2 class="text-2xl sm:text-4xl lg:text-5xl font-black font-display mb-5 tracking-tight leading-tight text-foreground">
              Got a card just <span class="text-gradient">sitting there?</span>
            </h2>
            <p class="text-muted-foreground text-sm sm:text-lg mb-8 max-w-xl mx-auto font-medium">
              Turn it into cash in your bank, USDT in your wallet, or a card you'll actually use. Right now, securely.
            </p>
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="https://wa.me/919120138828"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full sm:w-auto rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 hover:border-primary/45 text-primary backdrop-blur-md px-8 py-4 text-base font-bold transition-all duration-300 shadow-lg text-center cursor-pointer"
              >
                <span class="relative z-10">Cash out a card →</span>
              </a>
              <a
                href="#brands"
                class="w-full sm:w-auto rounded-xl liquid-glass border border-border px-8 py-4 text-base font-bold text-foreground hover:bg-foreground/[0.04] hover:border-border/80 transition-all duration-300 text-center shadow-sm"
              >
                View rates
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatLeft {
          0%, 100% { transform: translateY(0px) rotate(-12deg); }
          50%       { transform: translateY(-8px) rotate(-9deg); }
        }
        @keyframes floatRight {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50%       { transform: translateY(-8px) rotate(9deg); }
        }
        .animate-float-left {
          animation: floatLeft 6s ease-in-out infinite;
        }
        .animate-float-right {
          animation: floatRight 7s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

export default CTA;
