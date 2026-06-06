import React, { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_DATA = [
  {
    q: 'How long does a typical card cashout take?',
    a: 'Trades typically complete within 5 days. Once your gift card details are verified, our payout ledger routes your bank UPI or USDT stablecoin transfer securely.'
  },
  {
    q: 'What types of gift cards can I sell here?',
    a: 'Currently, GCX supports Amazon Retail Cards, Flipkart Cards, Roblox (Robux Value Cards), and League of Legends (RP Cards). We are expanding our integrations and will soon support Steam, PlayStation Network, and Apple Store cards.'
  },
  {
    q: 'Is UPI and Crypto payment route secure?',
    a: 'Absolutely. We use end-to-end TLS 1.3 encryption and automated smart routers. For UPI, transactions go through secured banking gateways. For USDT, funds are disbursed directly via decentralized liquidity smart contracts on the TRON/Ethereum blockchain, leaving zero room for escrow leaks.'
  },
  {
    q: 'How are exchange rates determined?',
    a: 'Exchange rates represent card demand and global market liquidity. Amazon has the highest rate (92%) due to retail demand, while gaming cards (Roblox, League of Legends) trade at 86% to 88%. Payout rates are locked the moment you start a trade.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-16 sm:py-24 border-t border-border/40 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
      <div className="relative mx-auto max-w-4xl px-4">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-primary mb-3">FAQ</p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-foreground leading-tight">Frequently asked <span className="text-gradient">questions</span></h2>
        </div>

        <div className="flex flex-col gap-4">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="liquid-glass rounded-2xl overflow-hidden border border-border/40 transition-colors duration-300"
                style={{
                  borderColor: isOpen ? 'var(--primary)' : 'var(--border)'
                }}
              >
                {/* Question Trigger */}
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center text-left text-foreground font-semibold text-sm sm:text-lg gap-4"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle size={18} className="text-primary shrink-0" />
                    <span>{faq.q}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground shrink-0"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                {/* Answer Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 sm:pb-5 pl-10 sm:pl-11 pr-4 sm:pr-6 text-muted-foreground text-xs sm:text-sm leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
