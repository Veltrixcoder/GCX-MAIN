import React from 'react';
import { motion } from 'framer-motion';

// Import the high-fidelity 3D PNG assets
import amazonCardImg from '../assets/card-amazon-pkV6XfjL.png';
import flipkartCardImg from '../assets/card-flipkart-SeEfOOvb.png';
import robloxCardImg from '../assets/card-roblox-Cn_R-R5S.png';
import lolCardImg from '../assets/card-lol-eD770gql.png';
import overwatchCardImg from '../assets/overwatch2.png';
import sotCardImg from '../assets/sot.png';

const CARDS_DATA = [
  {
    id: 'amazon',
    name: 'Amazon Card',
    subtitle: 'RET LIQ',
    glow: 'rgba(255, 153, 0, 0.35)',
    accent: '#ff9900',
    imgSrc: amazonCardImg
  },
  {
    id: 'flipkart',
    name: 'Flipkart Card',
    subtitle: 'RET LIQ',
    glow: 'rgba(40, 116, 240, 0.35)',
    accent: '#2874f0',
    imgSrc: flipkartCardImg
  },
  {
    id: 'roblox',
    name: 'Roblox Card',
    subtitle: 'GAM SWAP',
    glow: 'rgba(239, 68, 68, 0.35)',
    accent: '#ef4444',
    imgSrc: robloxCardImg
  },
  {
    id: 'league',
    name: 'League Card',
    subtitle: 'GAM SWAP',
    glow: 'rgba(197, 168, 128, 0.3)',
    accent: '#c5a880',
    imgSrc: lolCardImg
  },
  {
    id: 'overwatch',
    name: 'Overwatch 2 Card',
    subtitle: 'GAM SWAP',
    glow: 'rgba(240, 100, 20, 0.35)',
    accent: '#f06414',
    imgSrc: overwatchCardImg
  },
  {
    id: 'sot',
    name: 'Sea of Thieves Card',
    subtitle: 'GAM SWAP',
    glow: 'rgba(16, 185, 129, 0.35)',
    accent: '#10b981',
    imgSrc: sotCardImg
  }
];

export default function CardIllustrations({ onSelectCard, selectedCardId }) {
  
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Subtle tilt calculations since the images are pre-rendered at an angle
    const rotateX = ((y - centerY) / centerY) * 12;
    const rotateY = -((x - centerX) / centerX) * 12;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    
    // Glare positioning
    const glare = card.querySelector('.card-3d-glare');
    if (glare) {
      glare.style.left = `${(x / rect.width) * 100}%`;
      glare.style.top = `${(y / rect.height) * 100}%`;
      glare.style.opacity = '0.5';
    }
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    
    const glare = card.querySelector('.card-3d-glare');
    if (glare) {
      glare.style.opacity = '0';
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          width: '100%'
        }}
      >
        {CARDS_DATA.map((card) => {
          const isSelected = selectedCardId === card.id;
          return (
            <div
              key={card.id}
              onClick={() => onSelectCard?.(card.id)}
              style={{
                cursor: 'pointer',
                perspective: '1000px'
              }}
            >
              {/* Outer Card Plate */}
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="preserve-3d transition-3d"
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1.6 / 1',
                  borderRadius: '16px',
                  background: isSelected 
                    ? 'rgba(15, 18, 40, 0.45)' 
                    : 'rgba(8, 9, 20, 0.25)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: isSelected 
                    ? `1.5px solid ${card.accent}` 
                    : '1.5px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: isSelected 
                    ? `0 0 25px ${card.glow}, inset 0 0 15px rgba(255,255,255,0.03)` 
                    : '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(255,255,255,0.02)',
                  overflow: 'hidden',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* 3D Layer: Background Grid */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px',
                    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 1px, transparent 1px)',
                    backgroundSize: '10px 10px',
                    pointerEvents: 'none',
                    transform: 'translateZ(0px)'
                  }}
                />

                {/* 3D Layer: High-Fidelity 3D Image Asset (translateZ: 45px) */}
                <img
                  src={card.imgSrc}
                  alt={card.name}
                  style={{
                    width: '90%',
                    height: '90%',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    transform: 'translateZ(45px)',
                    filter: `drop-shadow(0 6px 12px ${card.glow})`
                  }}
                />

                {/* 3D Layer: Subtitle Tag (translateZ: 20px) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '9px',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    fontFamily: 'Space Grotesk',
                    fontWeight: '700',
                    pointerEvents: 'none',
                    letterSpacing: '1px',
                    transform: 'translateZ(20px)'
                  }}
                >
                  {card.subtitle}
                </div>

                {/* 3D Layer: Liquid Glare (translateZ: 70px) */}
                <div
                  className="card-3d-glare"
                  style={{
                    position: 'absolute',
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 75%)',
                    pointerEvents: 'none',
                    transform: 'translate3d(-50%, -50%, 70px)',
                    opacity: 0,
                    transition: 'opacity 0.15s ease',
                    mixBlendMode: 'overlay',
                    left: '50%',
                    top: '50%'
                  }}
                />
              </div>

              {/* Card Title */}
              <div 
                style={{ 
                  marginTop: '10px', 
                  textAlign: 'center',
                  fontFamily: 'Space Grotesk',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  textShadow: isSelected ? `0 0 10px ${card.glow}` : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {card.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
