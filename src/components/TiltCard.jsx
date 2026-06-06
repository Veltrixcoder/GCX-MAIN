import React, { useRef } from "react";

export function TiltCard({ children, className = "", intensity = 14 }) {
  const ref = useRef(null);
  const glowRef = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * intensity;
    const ry = (x - 0.5) * intensity;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    if (glowRef.current) {
      glowRef.current.style.setProperty("--gx", `${x * 100}%`);
      glowRef.current.style.setProperty("--gy", `${y * 100}%`);
      glowRef.current.style.opacity = "1";
    }
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    if (glowRef.current) glowRef.current.style.opacity = "0";
  };

  return (
    <div className="[perspective:1200px]">
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{
          transform: "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
          transformStyle: "preserve-3d",
          transition: "transform 0.18s ease-out",
        }}
        className={`relative ${className}`}
      >
        {children}
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle at var(--gx,50%) var(--gy,50%), oklch(1 0 0 / 18%), transparent 50%)",
            mixBlendMode: "overlay",
          }}
        />
      </div>
    </div>
  );
}
