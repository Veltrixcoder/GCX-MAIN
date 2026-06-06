import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, ShieldCheck } from 'lucide-react';

const FEATURES_DATA = [
  {
    icon: <Zap size={24} color="var(--secondary)" />,
    title: 'Lightning Payouts',
    desc: 'Average transaction completes in 42 seconds. Directly routed to your UPI address or USDT crypto wallet with automated block-validation.',
    glow: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.3)'
  },
  {
    icon: <TrendingUp size={24} color="var(--primary)" />,
    title: 'Top Exchange Rates',
    desc: 'Receive up to 95% of your gift card\'s face value. Our automated market-making algorithms match orders instantly to optimize liquidation yield.',
    glow: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(139, 92, 246, 0.3)'
  },
  {
    icon: <ShieldCheck size={24} color="var(--green)" />,
    title: 'Cryptographic Escrow',
    desc: 'Military-grade cryptographic APIs process card credentials securely. Transactions are ledger-verified, eliminating counterparty risks.',
    glow: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.3)'
  }
];

export default function Features() {
  return (
    <div style={{ padding: '80px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: '14px',
            color: 'var(--primary)',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '10px'
          }}
        >
          Engineered for Speed
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="display-title"
          style={{ fontSize: '36px', fontWeight: '800' }}
        >
          Why Swapping with GCX is Next-Gen
        </motion.h2>
      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          width: '100%',
          padding: '0 10px'
        }}
      >
        {FEATURES_DATA.map((feat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="glass-panel"
            style={{
              padding: '40px 30px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{ 
              y: -8, 
              boxShadow: `0 15px 35px ${feat.glow}`,
              borderColor: feat.border
            }}
          >
            {/* Ambient light ring behind icon */}
            <div 
              style={{
                position: 'absolute',
                top: '-30px',
                left: '-30px',
                width: '100px',
                height: '100px',
                background: `radial-gradient(circle, ${feat.glow} 0%, rgba(0,0,0,0) 70%)`,
                pointerEvents: 'none'
              }}
            />

            {/* Glowing Icon Container */}
            <div 
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1.5px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${feat.glow}`
              }}
            >
              {feat.icon}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 
                style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '20px', 
                  fontWeight: '700',
                  color: '#ffffff'
                }}
              >
                {feat.title}
              </h3>
              <p 
                style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  fontWeight: '400'
                }}
              >
                {feat.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
