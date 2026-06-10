import { For } from "solid-js";
import { TiltCard } from "./TiltCard";
import { Shield, ExternalLink, Wallet, CreditCard } from "lucide-solid";
import partnerLogo from "../assets/images/blkcbzr.png";

export function CryptoToINR() {
  return (
    <section id="crypto-to-inr" class="relative py-10 sm:py-14 border-t border-border/40 overflow-hidden">
      {/* Background ambient lighting */}
      <div class="absolute top-1/2 left-1/4 -translate-y-1/2 h-[40vw] w-[40vw] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />
      <div class="absolute bottom-0 right-1/4 h-[32vw] w-[32vw] rounded-full bg-accent/5 blur-[130px] pointer-events-none" />
      <div class="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div class="relative mx-auto max-w-7xl px-4 z-10">
        <div class="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Partnership Messaging & Trust indicators (5 cols) */}
          <div class="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div class="inline-flex items-center gap-2 rounded-full liquid-glass px-4 py-1.5 text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-3 shadow-sm border border-white/5">
              <span class="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
              Direct Offramp Integration
            </div>
            
            <h2 class="text-2xl sm:text-4xl lg:text-5xl font-black font-display mb-3 tracking-tight leading-tight text-foreground">
              Convert Crypto <br />
              <span class="text-gradient">to INR Cash</span>
            </h2>
            
            <p class="text-muted-foreground text-sm sm:text-base md:text-lg mb-4 max-w-xl font-medium leading-relaxed font-sans">
              We've partnered with <strong>Blockchain Bazaar</strong> to offer a direct offramping route from your Web3 wallet straight to your local bank account. Fully secured by smart contract escrows.
            </p>

            {/* Direct Trust badging */}
            <div class="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start">
              {/* Partner Website Link */}
              <a 
                href="https://blockchainbazaar.github.io" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="liquid-glass rounded-2xl p-4 flex items-center gap-4 hover:bg-foreground/[0.03] hover:border-border transition-all duration-300 w-full sm:w-auto shadow-md"
              >
                <div class="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center p-1.5 overflow-hidden shadow-inner shrink-0">
                  <img src={partnerLogo} alt="Blockchain Bazaar" class="h-full w-full object-contain" />
                </div>
                <div class="text-left">
                  <div class="text-[9px] text-muted-foreground font-bold font-mono uppercase tracking-wider">Exchange Partner</div>
                  <div class="text-sm font-bold font-display text-foreground flex items-center gap-1">
                    Blockchain Bazaar <ExternalLink size={11} class="text-muted-foreground" />
                  </div>
                </div>
              </a>

              {/* Trustpilot Badge */}
              <a 
                href="https://www.trustpilot.com/review/blockchainbazaar.github.io" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="liquid-glass rounded-2xl p-4 flex items-center gap-4 hover:bg-foreground/[0.03] hover:border-border transition-all duration-300 w-full sm:w-auto shadow-md"
              >
                <div class="text-emerald-400 font-bold text-lg flex items-center shrink-0 tracking-tighter font-display">
                  ★<span class="text-xs font-black ml-0.5 font-sans">Trustpilot</span>
                </div>
                <div class="text-left">
                  <div class="text-[9px] text-muted-foreground font-bold font-mono uppercase tracking-wider">Customer Rating</div>
                  <div class="text-sm font-bold font-display text-foreground flex items-center gap-1">
                    Rated Excellent <ExternalLink size={11} class="text-muted-foreground" />
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: High-Fidelity Escrow Node Map Graphic (7 cols) */}
          <div class="lg:col-span-7 w-full flex justify-center">
            <TiltCard 
              class="liquid-glass rounded-[2.5rem] p-8 sm:p-10 w-full overflow-hidden border border-border/60 shadow-2xl relative"
              intensity={4}
            >
              {/* Grid overlay */}
              <div class="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

              <div class="relative flex flex-col gap-8 items-center text-center" style={{ "transform-style": "preserve-3d" }}>
                
                {/* Visual Flow diagram */}
                <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 relative py-4" style={{ transform: "translateZ(25px)" }}>
                  
                  {/* Web3 Wallet Card */}
                  <div class="liquid-glass rounded-2xl p-5 w-full sm:w-44 flex flex-col items-center gap-3 border border-border shadow-lg relative group">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl opacity-10 group-hover:opacity-25 transition blur-sm" />
                    <div class="h-11 w-11 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-inner">
                      <Wallet size={20} />
                    </div>
                    <div class="text-center">
                      <h4 class="text-xs font-bold font-display text-foreground">Web3 Crypto Wallet</h4>
                      <p class="text-[10px] text-orange-400 font-bold font-mono mt-0.5">Send USDT / Crypto</p>
                    </div>
                  </div>

                  {/* Escrow Bridge Node (Central lock) */}
                  <div class="flex flex-col items-center gap-1.5 relative shrink-0">
                    <div class="hidden sm:block absolute left-[-40px] right-[-40px] top-1/2 -translate-y-1/2 h-[1.5px] border-t border-dashed border-border z-0 w-32" />
                    <div class="h-12 w-12 rounded-full bg-card border border-border flex items-center justify-center shadow-xl z-10 relative">
                      <Shield size={18} class="text-primary animate-pulse" />
                    </div>
                    <span class="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wider z-10">Escrow Bridge</span>
                  </div>

                  {/* Bank/UPI Card */}
                  <div class="liquid-glass rounded-2xl p-5 w-full sm:w-44 flex flex-col items-center gap-3 border border-border shadow-lg relative group">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-primary rounded-2xl opacity-10 group-hover:opacity-25 transition blur-sm" />
                    <div class="h-11 w-11 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner">
                      <CreditCard size={20} />
                    </div>
                    <div class="text-center">
                      <h4 class="text-xs font-bold font-display text-foreground">Local Bank Payout</h4>
                      <p class="text-[10px] text-rose-400 font-bold font-mono mt-0.5">Receive UPI / INR Cash</p>
                    </div>
                  </div>
                </div>

                {/* Features details cards */}
                <div class="grid sm:grid-cols-2 gap-4 w-full text-left" style={{ transform: "translateZ(15px)" }}>
                  <div class="p-4 rounded-2xl bg-foreground/[0.02] border border-border/60">
                    <h4 class="text-sm font-bold font-display text-foreground mb-1">P2P Escrow Offramp</h4>
                    <p class="text-[11px] text-muted-foreground leading-relaxed font-sans">Fast and fully regulated offramps for your USDT balance directly into INR cash.</p>
                  </div>
                  <div class="p-4 rounded-2xl bg-foreground/[0.02] border border-border/60">
                    <h4 class="text-sm font-bold font-display text-foreground mb-1">Compliant Settlement</h4>
                    <p class="text-[11px] text-muted-foreground leading-relaxed font-sans">Transactions are processed instantly with zero broker fees and direct bank routing.</p>
                  </div>
                </div>

                {/* CTA Action Button */}
                <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60" style={{ transform: "translateZ(10px)" }}>
                  <div class="flex items-center gap-1.5">
                    <For each={[0, 1, 2, 3, 4]}>
                      {() => (
                        <span class="h-4 w-4 bg-[#00b67a] text-white text-[11px] font-bold flex items-center justify-center rounded-sm">★</span>
                      )}
                    </For>
                    <span class="text-[9px] text-muted-foreground font-bold font-mono uppercase tracking-wider ml-1">Excellent Trustpilot Rating</span>
                  </div>
                  
                  <a
                    href="https://blockchainbazaar.github.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full sm:w-auto rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 hover:border-primary/45 text-primary backdrop-blur-md px-5 py-3 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5"
                  >
                    <span>Visit Blockchain Bazaar</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CryptoToINR;
