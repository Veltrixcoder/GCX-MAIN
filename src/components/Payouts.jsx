import React from 'react';
import { motion } from 'motion/react';
import { TiltCard } from './TiltCard';
import { Smartphone, Shield, Gift } from 'lucide-react';

const PAYOUTS_DATA = [
  {
    num: "01",
    icon: <Smartphone className="text-primary h-6 w-6" />,
    title: "UPI Bank Transfer",
    desc: "Instant direct bank deposit routed via UPI. Cash out straight to PhonePe, Paytm, Google Pay, or BHIM instantly.",
    glow: "rgba(236, 72, 153, 0.15)",
    borderGlow: "rgba(236, 72, 153, 0.3)"
  },
  {
    num: "02",
    icon: <Shield className="text-cyan-400 h-6 w-6" />,
    title: "USDT Crypto Address",
    desc: "Receive stablecoins directly to your Web3 wallet address. Supports low-fee TRC-20, ERC-20, and Polygon networks.",
    glow: "rgba(6, 182, 212, 0.15)",
    borderGlow: "rgba(6, 182, 212, 0.3)"
  },
  {
    num: "03",
    icon: <Gift className="text-emerald-400 h-6 w-6" />,
    title: "Voucher Swap 1:1",
    desc: "Swap your card balance for another digital brand voucher of equivalent value like Steam, Apple, or PlayStation.",
    glow: "rgba(16, 185, 129, 0.15)",
    borderGlow: "rgba(16, 185, 129, 0.3)"
  }
];

export function Payouts() {
  return (
    <section id="payouts" className="relative py-20 sm:py-28 border-t border-border/40 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[35vw] w-[35vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Title */}
        <div className="text-center mb-16 sm:mb-20 max-w-2xl mx-auto">
          <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-4">Payout options</p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display mb-5 tracking-tight leading-tight text-foreground">
            Get paid your <span className="text-gradient">way</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-sans">
            Three automated channels to disburse your funds. Pick whichever route matches your financial setup.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {PAYOUTS_DATA.map((item, idx) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <TiltCard 
                className="liquid-glass rounded-[2rem] p-8 h-full flex flex-col justify-between overflow-hidden transition-all duration-300 border border-border/60 group hover:border-border/80 hover:bg-foreground/[0.02]"
                intensity={10}
              >
                {/* Radial Glow on hover */}
                <div 
                  className="absolute -top-20 -right-20 h-48 w-48 rounded-full blur-3xl opacity-10 group-hover:opacity-35 transition-opacity duration-500"
                  style={{ background: item.borderGlow }}
                />

                <div className="relative flex flex-col h-full" style={{ transformStyle: "preserve-3d" }}>
                  {/* Top Segment: Step number + Icon */}
                  <div className="flex items-center justify-between mb-8" style={{ transform: "translateZ(30px)" }}>
                    <div className="h-12 w-12 rounded-xl bg-foreground/[0.03] border border-border flex items-center justify-center shadow-lg">
                      {item.icon}
                    </div>
                    <span className="text-3xl sm:text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-br from-foreground/25 to-foreground/5 tracking-tight group-hover:from-primary group-hover:to-accent transition-all duration-500">
                      {item.num}
                    </span>
                  </div>

                  {/* Body Segment: Title + Description */}
                  <div className="mt-4" style={{ transform: "translateZ(20px)" }}>
                    <h3 className="text-lg sm:text-xl font-bold font-display mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Payouts;
