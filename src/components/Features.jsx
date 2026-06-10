import { For } from "solid-js";
import { Zap, TrendingUp, ShieldCheck } from "lucide-solid";

const FEATURES_DATA = [
  {
    icon: <Zap size={24} color="var(--secondary)" />,
    title: "Lightning Payouts",
    desc: "Average transaction completes in 42 seconds. Directly routed to your UPI address or USDT crypto wallet with automated block-validation.",
    glow: "rgba(6, 182, 212, 0.15)",
    border: "rgba(6, 182, 212, 0.3)"
  },
  {
    icon: <TrendingUp size={24} color="var(--primary)" />,
    title: "Top Exchange Rates",
    desc: "Receive up to 95% of your gift card's face value. Our automated market-making algorithms match orders instantly to optimize liquidation yield.",
    glow: "rgba(139, 92, 246, 0.15)",
    border: "rgba(139, 92, 246, 0.3)"
  },
  {
    icon: <ShieldCheck size={24} color="var(--green)" />,
    title: "Cryptographic Escrow",
    desc: "Military-grade cryptographic APIs process card credentials securely. Transactions are ledger-verified, eliminating counterparty risks.",
    glow: "rgba(16, 185, 129, 0.15)",
    border: "rgba(16, 185, 129, 0.3)"
  }
];

export default function Features() {
  return (
    <div style={{ padding: "80px 0", "border-top": "1px solid rgba(255, 255, 255, 0.05)" }}>
      <div style={{ "text-align": "center", "margin-bottom": "50px" }}>
        <div
          style={{
            "font-size": "14px",
            color: "var(--primary)",
            "font-weight": "700",
            "text-transform": "uppercase",
            "letter-spacing": "2px",
            "margin-bottom": "10px"
          }}
        >
          Engineered for Speed
        </div>
        
        <h2
          class="display-title"
          style={{ "font-size": "36px", "font-weight": "800" }}
        >
          Why Swapping with GCX is Next-Gen
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          "grid-template-columns": "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
          width: "100%",
          padding: "0 10px"
        }}
      >
        <For each={FEATURES_DATA}>
          {(feat) => (
            <div
              class="glass-panel"
              style={{
                padding: "40px 30px",
                "text-align": "left",
                display: "flex",
                "flex-direction": "column",
                gap: "20px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Ambient light ring behind icon */}
              <div
                style={{
                  position: "absolute",
                  top: "-30px",
                  left: "-30px",
                  width: "100px",
                  height: "100px",
                  background: `radial-gradient(circle, ${feat.glow} 0%, rgba(0,0,0,0) 70%)`,
                  "pointer-events": "none"
                }}
              />

              {/* Glowing Icon Container */}
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  "border-radius": "14px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1.5px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  "align-items": "center",
                  "justify-content": "center",
                  "box-shadow": `0 4px 12px ${feat.glow}`
                }}
              >
                {feat.icon}
              </div>

              <div style={{ display: "flex", "flex-direction": "column", gap: "10px" }}>
                <h3
                  style={{
                    "font-family": "var(--font-display)",
                    "font-size": "20px",
                    "font-weight": "700",
                    color: "#ffffff"
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    "font-size": "14px",
                    "line-height": "1.6",
                    "font-weight": "400"
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
