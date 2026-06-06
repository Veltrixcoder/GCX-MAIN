import React from 'react';
import { motion } from 'motion/react';
import { TiltCard } from './TiltCard';
import { CreditCard, Users, Coins } from 'lucide-react';

const STEPS = [
  {
    num: "01",
    icon: <CreditCard className="text-primary h-6 w-6" />,
    title: "Submit Your Card",
    desc: "Provide your unused Amazon, Flipkart, or gaming gift cards. Our secure system processes the card credentials in seconds.",
    glow: "rgba(236, 72, 153, 0.15)",
    borderGlow: "rgba(236, 72, 153, 0.3)"
  },
  {
    num: "02",
    icon: <Users className="text-cyan-400 h-6 w-6" />,
    title: "We Match & Sell",
    desc: "We securely list and sell the cards to verified buyers who need them, operating as a trusted, high-volume brokerage.",
    glow: "rgba(6, 182, 212, 0.15)",
    borderGlow: "rgba(6, 182, 212, 0.3)"
  },
  {
    num: "03",
    icon: <Coins className="text-emerald-400 h-6 w-6" />,
    title: "Get Paid minus Brokerage",
    desc: "Once the card is redeemed by the buyer, we take a minor brokerage fee and instantly transfer the remaining funds to your UPI or USDT wallet.",
    glow: "rgba(16, 185, 129, 0.15)",
    borderGlow: "rgba(16, 185, 129, 0.3)"
  }
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-20 sm:py-28 border-t border-border/40 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[35vw] w-[35vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Title */}
        <div className="text-center mb-16 sm:mb-20 max-w-2xl mx-auto">
          <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-4">The Process</p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display mb-5 tracking-tight leading-tight text-foreground">
            How it <span className="text-gradient">works</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-sans">
            We act as a secure bridge between cardholders and buyers, taking care of the escrow and payout logistics.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.num}
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
                  style={{ background: step.borderGlow }}
                />

                <div className="relative flex flex-col h-full" style={{ transformStyle: "preserve-3d" }}>
                  {/* Top Segment: Step number + Icon */}
                  <div className="flex items-center justify-between mb-8" style={{ transform: "translateZ(30px)" }}>
                    <div className="h-12 w-12 rounded-xl bg-foreground/[0.03] border border-border flex items-center justify-center shadow-lg">
                      {step.icon}
                    </div>
                    <span className="text-3xl sm:text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-br from-foreground/25 to-foreground/5 tracking-tight group-hover:from-primary group-hover:to-accent transition-all duration-500">
                      {step.num}
                    </span>
                  </div>

                  {/* Body Segment: Title + Description */}
                  <div className="mt-4" style={{ transform: "translateZ(20px)" }}>
                    <h3 className="text-lg sm:text-xl font-bold font-display mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {step.desc}
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

export default HowItWorks;
