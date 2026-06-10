export function TiltCard(props) {
  let cardRef;
  let glowRef;
  const intensity = props.intensity ?? 14;

  const handleMove = (e) => {
    if (!cardRef) return;
    const r = cardRef.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * intensity;
    const ry = (x - 0.5) * intensity;
    cardRef.style.setProperty("--rx", `${rx}deg`);
    cardRef.style.setProperty("--ry", `${ry}deg`);
    if (glowRef) {
      glowRef.style.setProperty("--gx", `${x * 100}%`);
      glowRef.style.setProperty("--gy", `${y * 100}%`);
      glowRef.style.opacity = "1";
    }
  };

  const reset = () => {
    if (!cardRef) return;
    cardRef.style.setProperty("--rx", "0deg");
    cardRef.style.setProperty("--ry", "0deg");
    if (glowRef) glowRef.style.opacity = "0";
  };

  return (
    <div class="[perspective:1200px]">
      <div
        ref={el => (cardRef = el)}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{
          transform: "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
          "transform-style": "preserve-3d",
          transition: "transform 0.18s ease-out",
        }}
        class={`relative ${props.class || ""}`}
      >
        {props.children}
        <div
          ref={el => (glowRef = el)}
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle at var(--gx,50%) var(--gy,50%), oklch(1 0 0 / 18%), transparent 50%)",
            "mix-blend-mode": "overlay",
          }}
        />
      </div>
    </div>
  );
}
