import React from 'react';

import amazonCardImg from '../assets/card-amazon-pkV6XfjL.png';
import flipkartCardImg from '../assets/card-flipkart-SeEfOOvb.png';
import robloxCardImg from '../assets/card-roblox-Cn_R-R5S.png';
import lolCardImg from '../assets/card-lol-eD770gql.png';
import overwatchCardImg from '../assets/overwatch2.png';
import sotCardImg from '../assets/sot.png';
import logoImg from '../assets/logo.png';

const CARDS = [
  { id: 'amazon',    name: 'Amazon',            img: amazonCardImg,   glow: '#ff9900' },
  { id: 'flipkart',  name: 'Flipkart',          img: flipkartCardImg, glow: '#2874f0' },
  { id: 'roblox',    name: 'Roblox',            img: robloxCardImg,   glow: '#ef4444' },
  { id: 'lol',       name: 'League of Legends', img: lolCardImg,      glow: '#c5a880' },
  { id: 'overwatch', name: 'Overwatch 2',       img: overwatchCardImg,glow: '#f06414' },
  { id: 'sot',       name: 'Sea of Thieves',    img: sotCardImg,      glow: '#10b981' },
];

const N = CARDS.length;
const DURATION = 22; // Seconds for full cycle (reverted to original speed)

export default function RevolvingCards() {
  return (
    <div 
      className="revolving-cards-container"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >

      <style>{`
        .revolving-cards-container {
          --orbit-radius: 12vw;
          --card-w: 16vw;
          --card-h: 10vw;
          --card-offset-x: -8vw;
          --card-offset-y: -5vw;
          --core-size: 8vw;
          --container-size: 33vw;
          
          width: var(--container-size);
          max-width: 100%;
          height: var(--container-size);
        }

        @media (min-width: 1600px) {
          .revolving-cards-container {
            --orbit-radius: 190px;
            --card-w: 250px;
            --card-h: 156px;
            --card-offset-x: -125px;
            --card-offset-y: -78px;
            --core-size: 130px;
            --container-size: 530px;
          }
        }

        @media (max-width: 1024px) {
          .revolving-cards-container {
            --orbit-radius: 18vw;
            --card-w: 24vw;
            --card-h: 15vw;
            --card-offset-x: -12vw;
            --card-offset-y: -7.5vw;
            --core-size: 13vw;
            --container-size: 50vw;
          }
        }

        @media (max-width: 768px) {
          .revolving-cards-container {
            --orbit-radius: 26vw;
            --card-w: 36vw;
            --card-h: 22.5vw;
            --card-offset-x: -18vw;
            --card-offset-y: -11.25vw;
            --core-size: 18vw;
            --container-size: 75vw;
          }
        }

        /* ── Orbit track: spins forward around its center ── */
        @keyframes orbitSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        /* ── Each card counter-spins so it remains vertical ── */
        @keyframes cardFace {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }

        .orbit-track {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          animation: orbitSpin ${DURATION}s linear infinite;
        }
        .orbit-track:hover {
          animation-play-state: paused;
        }
        .orbit-slot {
          position: absolute;
        }
        .card-face {
          animation: cardFace ${DURATION}s linear infinite;
          width: var(--card-w);
          height: var(--card-h);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: filter 0.3s;
        }
        .orbit-track:hover .card-face {
          animation-play-state: paused;
        }
        .card-face:hover {
          filter: brightness(1.2);
        }
        .card-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .card-face:hover .card-img {
          transform: scale(1.15) translateY(-5px);
        }
      `}</style>

      {/* ── Central guide ring ── */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(var(--orbit-radius) * 2)',
        height: 'calc(var(--orbit-radius) * 2)',
        borderRadius: '50%',
        border: '1.5px dashed rgba(255,255,255,0.06)',
        pointerEvents: 'none',
      }} />

      {/* ── Rotating Track ── */}
      <div className="orbit-track">
        {CARDS.map((card, i) => {
          const slotAngle = (360 / N) * i;
          const slotStyle = {
            transform: `rotate(${slotAngle}deg) translate(var(--orbit-radius)) rotate(${-slotAngle}deg)`,
            position: 'absolute',
            left: 'var(--card-offset-x)',
            top: 'var(--card-offset-y)',
          };
          return (
            <div key={card.id} className="orbit-slot" style={slotStyle}>
              <div
                className="card-face"
                style={{
                  animationDelay: `-${(DURATION / N) * i}s`,
                }}
              >
                <img
                  src={card.img}
                  alt={card.name}
                  className="card-img"
                  style={{ filter: `drop-shadow(0 10px 24px ${card.glow}77)` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Ambient Glow behind Orb ── */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(var(--core-size) * 1.5)',
        height: 'calc(var(--core-size) * 1.5)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.38) 0%, transparent 70%)',
        filter: 'blur(1.5vw)',
        pointerEvents: 'none',
        animation: 'gcxPulse 3s ease-in-out infinite',
      }} />

      {/* ── Central GCX Core Logo (No sphere wrapper, larger size) ── */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        width: 'calc(var(--core-size) * 1.35)',
        height: 'calc(var(--core-size) * 1.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'gcxFloat 4s ease-in-out infinite',
      }}>
        <img
          src={logoImg}
          alt="GCX Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 16px rgba(14,165,233,0.35)) drop-shadow(0 10px 24px rgba(0,0,0,0.5))'
          }}
        />
      </div>

      {/* Halo rings */}
      {[1.3, 1.55].map((multiplier, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: `calc(var(--core-size) * ${multiplier})`,
          height: `calc(var(--core-size) * ${multiplier})`,
          borderRadius: '50%',
          border: `1px solid rgba(14,165,233,${0.14 - i * 0.05})`,
          pointerEvents: 'none',
          zIndex: 9,
          animation: `gcxHalo ${2.5 + i * 0.8}s ease-in-out infinite ${i * 0.5}s`,
        }} />
      ))}

      <style>{`
        @keyframes gcxFloat {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px);  }
          50%       { transform: translate(-50%, -50%) translateY(-7px); }
        }
        @keyframes gcxPulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.95); }
          50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.1);  }
        }
        @keyframes gcxHalo {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1);    }
          50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.07); }
        }
      `}</style>
    </div>
  );
}
