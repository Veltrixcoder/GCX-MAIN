import React from "react";
import { motion } from "motion/react";
import { TiltCard } from "./TiltCard";
import { Shield, ArrowRight, ExternalLink, Star, ArrowLeftRight, CreditCard, Wallet } from "lucide-react";
import partnerLogo from "../../blkcbzr.png";

export function CryptoToINR() {
  return (
    <section id="crypto-to-inr" className="relative py-24 sm:py-32 border-t border-border/40 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-[40vw] w-[40vw] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-[32vw] w-[32vw] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Partnership Messaging & Trust indicators (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full liquid-glass px-4 py-1.5 text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-6 shadow-sm border border-white/5">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              Direct Offramp Integration
            </div>
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display mb-6 tracking-tight leading-tight text-foreground">
              Convert Crypto <br />
              <span className="text-gradient">to INR Cash</span>
            </h2>
            
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-8 max-w-xl font-medium leading-relaxed font-sans">
              We've partnered with <strong>Blockchain Bazaar</strong> to offer a direct offramping route from your Web3 wallet straight to your local bank account. Fully secured by smart contract escrows.
            </p>

            {/* Direct Trust badging */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start">
              {/* Partner Website Link */}
              <a 
                href="https://blockchainbazaar.github.io" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="liquid-glass rounded-2xl p-4 flex items-center gap-4 hover:bg-foreground/[0.03] hover:border-border transition-all duration-300 w-full sm:w-auto shadow-md"
              >
                <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center p-1.5 overflow-hidden shadow-inner shrink-0">
                  <img src={partnerLogo} alt="Blockchain Bazaar" className="h-full w-full object-contain" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] text-muted-foreground font-bold font-mono uppercase tracking-wider">Exchange Partner</div>
                  <div className="text-sm font-bold font-display text-foreground flex items-center gap-1">
                    Blockchain Bazaar <ExternalLink size={11} className="text-muted-foreground" />
                  </div>
                </div>
              </a>

              {/* Trustpilot Badge */}
              <a 
                href="https://www.trustpilot.com/review/blockchainbazaar.github.io" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="liquid-glass rounded-2xl p-4 flex items-center gap-4 hover:bg-foreground/[0.03] hover:border-border transition-all duration-300 w-full sm:w-auto shadow-md"
              >
                <div className="text-emerald-400 font-bold text-lg flex items-center shrink-0 tracking-tighter font-display">
                  ★<span className="text-xs font-black ml-0.5 font-sans">Trustpilot</span>
                </div>
                <div className="text-left">
                  <div className="text-[9px] text-muted-foreground font-bold font-mono uppercase tracking-wider">Customer Rating</div>
                  <div className="text-sm font-bold font-display text-foreground flex items-center gap-1">
                    Rated Excellent <ExternalLink size={11} className="text-muted-foreground" />
                  </div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Column: High-Fidelity Escrow Node Map Graphic (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7 w-full flex justify-center"
          >
            <TiltCard 
              className="liquid-glass rounded-[2.5rem] p-8 sm:p-10 w-full overflow-hidden border border-border/60 shadow-2xl relative"
              intensity={4}
            >
              {/* Grid overlay */}
              <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

              <div className="relative flex flex-col gap-8 items-center text-center" style={{ transformStyle: "preserve-3d" }}>
                
                {/* Visual Flow diagram: Wallet to Bank via Blockchain Bazaar Escrow */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 relative py-4" style={{ transform: "translateZ(25px)" }}>
                  
                  {/* Web3 Wallet Card */}
                  <div className="liquid-glass rounded-2xl p-5 w-full sm:w-44 flex flex-col items-center gap-3 border border-border shadow-lg relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-10 group-hover:opacity-25 transition blur-sm" />
                    <div className="h-11 w-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                      <Wallet size={20} />
                    </div>
                     <div className="text-center">
                      <h4 className="text-xs font-bold font-display text-foreground">Web3 Crypto Wallet</h4>
                      <p className="text-[10px] text-emerald-400 font-bold font-mono mt-0.5">Send USDT / Crypto</p>
                    </div>
                  </div>

                  {/* Escrow Bridge Node (Central lock) */}
                  <div className="flex flex-col items-center gap-1.5 relative shrink-0">
                    {/* Horizontal connecting lines */}
                    <div className="hidden sm:block absolute left-[-40px] right-[-40px] top-1/2 -translate-y-1/2 h-[1.5px] border-t border-dashed border-border z-0 w-32" />
                    
                    <div className="h-12 w-12 rounded-full bg-card border border-border flex items-center justify-center shadow-xl z-10 relative group-hover:border-primary transition duration-300">
                      <Shield size={18} className="text-primary animate-pulse" />
                    </div>
                    <span className="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wider z-10">Escrow Bridge</span>
                  </div>

                  {/* Bank/UPI Card */}
                  <div className="liquid-glass rounded-2xl p-5 w-full sm:w-44 flex flex-col items-center gap-3 border border-border shadow-lg relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-10 group-hover:opacity-25 transition blur-sm" />
                    <div className="h-11 w-11 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                      <CreditCard size={20} />
                    </div>
                     <div className="text-center">
                      <h4 className="text-xs font-bold font-display text-foreground">Local Bank Payout</h4>
                      <p className="text-[10px] text-blue-400 font-bold font-mono mt-0.5">Receive UPI / INR Cash</p>
                    </div>
                  </div>

                </div>

                {/* Features details cards */}
                 <div className="grid sm:grid-cols-2 gap-4 w-full text-left" style={{ transform: "translateZ(15px)" }}>
                  <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-border/60">
                    <h4 className="text-sm font-bold font-display text-foreground mb-1">P2P Escrow Offramp</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">Fast and fully regulated offramps for your USDT balance directly into INR cash.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-border/60">
                    <h4 className="text-sm font-bold font-display text-foreground mb-1">Compliant Settlement</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">Transactions are processed instantly with zero broker fees and direct bank routing.</p>
                  </div>
                </div>

                {/* CTA Action Button */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60" style={{ transform: "translateZ(10px)" }}>
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="h-4 w-4 bg-[#00b67a] text-white text-[11px] font-bold flex items-center justify-center rounded-sm">★</span>
                    ))}
                     <span className="text-[9px] text-muted-foreground font-bold font-mono uppercase tracking-wider ml-1">Excellent Trustpilot Rating</span>
                  </div>
                  
                  <a
                    href="https://blockchainbazaar.github.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto rounded-xl bg-[image:var(--gradient-brand)] animate-gradient px-5 py-3 text-xs font-bold text-background hover:scale-[1.02] transition-transform duration-200 glow-ring text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Visit Blockchain Bazaar</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

              </div>
            </TiltCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default CryptoToINR;
