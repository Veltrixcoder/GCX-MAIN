import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import RevolvingCards from "./RevolvingCards";

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const rotateX = useTransform(smy, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smx, [-0.5, 0.5], [-15, 15]);
  const tx = useTransform(smx, [-0.5, 0.5], [-30, 30]);
  const ty = useTransform(smy, [-0.5, 0.5], [-20, 20]);

  useEffect(() => {
    const onMove = (e) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section className="relative min-h-screen pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-0 [background:var(--gradient-hero)] pointer-events-none" />

      {/* Animated blob orbs */}
      <motion.div
        style={{ x: tx, y: ty }}
        className="absolute top-1/4 -left-20 h-80 w-80 bg-primary/30 blur-[110px] animate-blob"
      />
      <motion.div
        style={{ x: useTransform(smx, [-0.5, 0.5], [30, -30]), y: useTransform(smy, [-0.5, 0.5], [20, -20]) }}
        className="absolute bottom-1/4 -right-20 h-[28rem] w-[28rem] bg-accent/30 blur-[140px] animate-blob"
      />
      <motion.div
        style={{ x: useTransform(smx, [-0.5, 0.5], [-15, 15]) }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 h-72 w-72 bg-[var(--neon)]/20 blur-[100px] animate-pulse-glow"
      />

      <div className="relative mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left flex flex-col items-center lg:items-start"
        >
          <div className="inline-flex items-center gap-2 rounded-full liquid-glass px-4 py-1.5 text-xs font-bold tracking-wider font-mono text-muted-foreground mb-6">
            <span className="h-2 w-2 rounded-full bg-[var(--neon)] animate-pulse" />
            Secure payouts · 24/7
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display leading-[1.15] lg:leading-[1.1] mb-6 max-w-2xl">
            Turn gift cards into <span className="text-gradient animate-gradient">real cash</span>.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-8">
            GCX converts your unused Amazon, Flipkart, Roblox, Overwatch 2, Sea of Thieves & League of Legends gift cards into UPI, USDT, or
            another gift card of equivalent value — securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start">
            <a
              href="#start"
              className="relative overflow-hidden rounded-xl bg-[image:var(--gradient-brand)] animate-gradient px-6 py-3.5 text-sm font-semibold text-background hover:scale-105 transition-transform glow-ring group text-center block sm:inline-block w-full sm:w-auto"
            >
              <span className="relative z-10">Start a trade →</span>
              <span className="absolute inset-0 shine opacity-0 group-hover:opacity-100" />
            </a>
            <a
              href="#how"
              className="rounded-xl liquid-glass px-6 py-3.5 text-sm font-semibold hover:bg-secondary/40 transition text-center block sm:inline-block w-full sm:w-auto"
            >
              How it works
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-y-6 gap-x-4 sm:flex sm:items-center sm:gap-10 text-xs text-muted-foreground w-full justify-items-center max-w-lg mx-auto lg:mx-0">
            <Stat value="5 days" label="Avg payout" />
            <Stat value="Upto ₹3L" label="Card processed" />
            <Stat value="₹5Lakh+" label="Paid out" />
            <Stat value="4.9★" label="User rating" />
          </div>
        </motion.div>

        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative h-[75vw] md:h-[50vw] lg:h-[33vw] 2xl:h-[530px] flex items-center justify-center [perspective:1400px] z-10 w-full overflow-visible"
        >
          <RevolvingCards />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="text-center lg:text-left">
      <div className="text-sm sm:text-base font-black font-display text-foreground leading-none mb-1.5">{value}</div>
      <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/80">{label}</div>
    </div>
  );
}

export default Hero;
