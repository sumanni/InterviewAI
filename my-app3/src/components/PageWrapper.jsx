// src/components/PageWrapper.jsx
// Reusable animated background + floating dots + keyframes
// Use this as the wrapper for every page

import { useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════
   FLOATING DOTS
══════════════════════════════════════ */
function FloatingDots() {
  const dots = [
    {
      top: "8%",
      left: "6%",
      w: 8,
      h: 8,
      c: "rgba(96,165,250,0.4)",
      d: "6s",
      dl: "0s",
    },
    {
      top: "55%",
      left: "2%",
      w: 12,
      h: 12,
      c: "rgba(167,139,250,0.3)",
      d: "8s",
      dl: "1s",
    },
    {
      top: "80%",
      left: "8%",
      w: 6,
      h: 6,
      c: "rgba(56,189,248,0.35)",
      d: "5s",
      dl: "2.5s",
    },
    {
      top: "20%",
      right: "5%",
      w: 10,
      h: 10,
      c: "rgba(99,102,241,0.3)",
      d: "7s",
      dl: "0.5s",
    },
    {
      top: "65%",
      right: "3%",
      w: 8,
      h: 8,
      c: "rgba(147,197,253,0.3)",
      d: "9s",
      dl: "1.5s",
    },
    {
      top: "40%",
      right: "8%",
      w: 5,
      h: 5,
      c: "rgba(236,72,153,0.25)",
      d: "6s",
      dl: "3s",
    },
    {
      top: "90%",
      right: "12%",
      w: 14,
      h: 14,
      c: "rgba(16,185,129,0.2)",
      d: "10s",
      dl: "0.8s",
    },
    {
      top: "35%",
      left: "45%",
      w: 6,
      h: 6,
      c: "rgba(245,158,11,0.2)",
      d: "7s",
      dl: "2s",
    },
  ];

  return (
    <>
      {dots.map((dot, i) => (
        <span
          key={i}
          className="fixed rounded-full"
          style={{
            top: dot.top,
            left: dot.left,
            right: dot.right,
            width: dot.w,
            height: dot.h,
            background: dot.c,
            zIndex: 0,
            pointerEvents: "none",
            animation: `dotFloat ${dot.d} ease-in-out infinite ${dot.dl}`,
          }}
        />
      ))}
    </>
  );
}

/* ══════════════════════════════════════
   AURORA BLOBS (slow moving gradients)
══════════════════════════════════════ */
function AuroraBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          top: "-100px",
          left: "-100px",
          animation: "blobMove1 15s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
          bottom: "-100px",
          right: "-100px",
          animation: "blobMove2 18s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)",
          top: "40%",
          left: "40%",
          animation: "blobMove3 20s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════
   GRID OVERLAY
══════════════════════════════════════ */
function GridOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10"
      style={{
        backgroundImage: `
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
      `,
        backgroundSize: "48px 48px",
      }}
    />
  );
}

/* ══════════════════════════════════════
   PARTICLE FIELD (tiny random sparkles)
══════════════════════════════════════ */
function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    top: `${Math.floor((i * 37 + 11) % 100)}%`,
    left: `${Math.floor((i * 53 + 7) % 100)}%`,
    size: (i % 3) + 1,
    dur: `${4 + (i % 6)}s`,
    delay: `${(i * 0.4) % 5}s`,
    opacity: 0.1 + (i % 4) * 0.07,
  }));

  return (
    <>
      {particles.map((p) => (
        <span
          key={p.id}
          className="fixed rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: "#fff",
            opacity: p.opacity,
            pointerEvents: "none",
            zIndex: 0,
            animation: `particleTwinkle ${p.dur} ease-in-out infinite ${p.delay}`,
          }}
        />
      ))}
    </>
  );
}

/* ══════════════════════════════════════
   SCROLL REVEAL WRAPPER
   Wraps any element — fades it in when
   it enters the viewport
══════════════════════════════════════ */
export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const transforms = {
    up: "translateY(30px)",
    down: "translateY(-30px)",
    left: "translateX(-30px)",
    right: "translateX(30px)",
    scale: "scale(0.92)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[direction] || transforms.up,
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════
   SHIMMER TEXT (gradient sweep on text)
══════════════════════════════════════ */
export function ShimmerText({ children, className = "" }) {
  return (
    <span
      className={className}
      style={{
        background:
          "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 30%, #06b6d4 60%, #3b82f6 100%)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "shimmerText 3s linear infinite",
      }}
    >
      {children}
    </span>
  );
}

/* ══════════════════════════════════════
   GLOW CARD (card with animated border)
══════════════════════════════════════ */
export function GlowCard({
  children,
  color = "#3b82f6",
  className = "",
  style = {},
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? color + "60" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "16px",
        boxShadow: hovered ? `0 0 30px ${color}20` : "none",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════
   PULSE BADGE
══════════════════════════════════════ */
export function PulseBadge({ children, color = "blue" }) {
  const colors = {
    blue: {
      bg: "rgba(59,130,246,0.1)",
      border: "rgba(59,130,246,0.25)",
      text: "#93c5fd",
    },
    purple: {
      bg: "rgba(139,92,246,0.1)",
      border: "rgba(139,92,246,0.25)",
      text: "#c4b5fd",
    },
    green: {
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.25)",
      text: "#6ee7b7",
    },
    pink: {
      bg: "rgba(236,72,153,0.1)",
      border: "rgba(236,72,153,0.25)",
      text: "#f9a8d4",
    },
    yellow: {
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.25)",
      text: "#fcd34d",
    },
    cyan: {
      bg: "rgba(6,182,212,0.1)",
      border: "rgba(6,182,212,0.25)",
      text: "#67e8f9",
    },
  };
  const c = colors[color] || colors.blue;
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-4"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
      }}
    >
      <span
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ background: c.text }}
      />
      {children}
    </div>
  );
}

/* ══════════════════════════════════════
   COUNTER (animated number count up)
══════════════════════════════════════ */
export function Counter({ target, suffix = "", duration = 1500 }) {
  const [cur, setCur] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let count = 0;
          const steps = 60;
          const inc = target / steps;
          const t = setInterval(() => {
            count++;
            setCur(Math.min(Math.round(inc * count), target));
            if (count >= steps) clearInterval(t);
          }, duration / steps);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {cur}
      {suffix}
    </span>
  );
}

/* ══════════════════════════════════════
   TYPING TEXT (typewriter effect)
══════════════════════════════════════ */
export function TypingText({ texts = [], speed = 80, pause = 2000 }) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex] || "";
    if (!deleting && charIndex < current.length) {
      const t = setTimeout(() => setCharIndex((i) => i + 1), speed);
      return () => clearTimeout(t);
    }
    if (!deleting && charIndex === current.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && charIndex > 0) {
      const t = setTimeout(() => setCharIndex((i) => i - 1), speed / 2);
      return () => clearTimeout(t);
    }
    if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
    }
  }, [charIndex, deleting, textIndex, texts, speed, pause]);

  useEffect(() => {
    setDisplayed(texts[textIndex]?.slice(0, charIndex) || "");
  }, [charIndex, textIndex, texts]);

  return (
    <span>
      {displayed}
      <span
        style={{
          animation: "cursorBlink 1s step-end infinite",
          color: "#3b82f6",
        }}
      >
        |
      </span>
    </span>
  );
}

/* ══════════════════════════════════════
   PAGE WRAPPER (main export)
   Wrap every page with this
══════════════════════════════════════ */
export default function PageWrapper({ children }) {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "#060b18" }}
    >
      {/* Static background */}
      <div
        className="fixed inset-0 pointer-events-none -z-20"
        style={{
          backgroundImage: `
          radial-gradient(ellipse 80% 50% at 10% 10%, rgba(56,96,220,0.18) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 90% 80%, rgba(124,58,237,0.15) 0%, transparent 55%)
        `,
        }}
      />

      {/* Animated aurora blobs */}
      <AuroraBlobs />

      {/* Grid overlay */}
      <GridOverlay />

      {/* Floating dots */}
      <FloatingDots />

      {/* Particle field */}
      <ParticleField />

      {/* All keyframes */}
      <style>{`
        @keyframes dotFloat {
          0%,100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50%      { transform: translateY(-20px) scale(1.15); opacity: 0.9; }
        }
        @keyframes blobMove1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(80px,60px) scale(1.1); }
          66%     { transform: translate(-40px,80px) scale(0.95); }
        }
        @keyframes blobMove2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(-60px,-80px) scale(1.05); }
          66%     { transform: translate(80px,-40px) scale(1.1); }
        }
        @keyframes blobMove3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(-60px,60px) scale(1.2); }
        }
        @keyframes particleTwinkle {
          0%,100% { opacity: 0.05; transform: scale(1); }
          50%     { opacity: 0.4;  transform: scale(1.5); }
        }
        @keyframes shimmerText {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes cursorBlink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Page content */}
      {children}
    </div>
  );
}
