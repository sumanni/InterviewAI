// src/pages/HomePage.jsx
import { useState } from "react";
import PracticeModal from "../components/PracticeModal";
import PageWrapper, {
  ScrollReveal,
  ShimmerText,
  GlowCard,
  PulseBadge,
  Counter,
  TypingText,
} from "../components/PageWrapper";

/* ══════════════════════════════════════
   NAVBAR
══════════════════════════════════════ */
function Navbar({ onLogin, onSignup, onPractice, onProfile, onPricing, user }) {
  const [scrolled, setScrolled] = useState(false);

  useState(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  });

  return (
    <nav
      className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-300"
      style={{
        zIndex: 9999,
        background: scrolled ? "rgba(6,11,24,0.95)" : "rgba(6,11,24,0.6)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid transparent",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#3b82f6,#7c3aed)" }}
        >
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"
            />
          </svg>
        </div>
        <span className="text-white font-bold text-lg">InterviewAI</span>
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-8">
        {["Features", "How It Works", "About"].map((l) => (
          <a
            key={l}
            href="#"
            className="text-slate-400 text-sm hover:text-white transition-colors duration-200"
          >
            {l}
          </a>
        ))}
        <button
          onClick={onPricing}
          className="text-slate-400 text-sm hover:text-white transition-colors duration-200"
        >
          Pricing
        </button>
      </div>

      {/* Auth buttons */}
      {/* Auth buttons */}
      <div className="flex items-center gap-3">
        {/* Practice Now — always visible */}
        {/* Practice Now — only show when logged in */}
        {user && (
          <button
            onClick={onPractice}
            className="flex items-center gap-2 text-white text-sm px-5 py-2 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Practice Now
          </button>
        )}

        {user ? (
          /* ── Logged in ── */
          <>
            {/* User first letter avatar */}
            <button
              onClick={onProfile}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:opacity-90"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* First letter circle */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{
                  background: "linear-gradient(135deg,#3b82f6,#7c3aed)",
                }}
              >
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              {/* Name (hidden on small screens) */}
              <span className="hidden md:block text-slate-300 text-sm">
                {user.name?.split(" ")[0]}
              </span>
            </button>

            {/* Logout button */}
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                window.location.reload();
              }}
              className="text-slate-400 text-sm px-4 py-2 rounded-lg hover:text-white transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          /* ── Not logged in ── */
          <>
            <button
              onClick={onLogin}
              className="text-slate-300 text-sm px-4 py-2 rounded-lg hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onSignup}
              className="text-white text-sm px-5 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════
   HERO SECTION
══════════════════════════════════════ */
function HeroSection({ onSignup, onLogin }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-4xl mx-auto">
        <div style={{ animation: "fadeDown 0.6s ease both" }}>
          <PulseBadge color="blue">AI-Powered Interview Training</PulseBadge>
        </div>

        <h1
          className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
          style={{ animation: "fadeUp 0.7s ease 0.1s both" }}
        >
          Ace Your Next
          <ShimmerText className="block text-5xl md:text-7xl font-extrabold">
            Interview
          </ShimmerText>
          with AI
        </h1>

        <p
          className="text-slate-400 text-lg md:text-xl mb-4 max-w-2xl mx-auto leading-relaxed"
          style={{ animation: "fadeUp 0.7s ease 0.2s both" }}
        >
          Practice with real interview questions for
        </p>

        <div
          className="text-blue-400 text-xl font-semibold mb-8"
          style={{ animation: "fadeUp 0.7s ease 0.25s both" }}
        >
          <TypingText
            texts={[
              "Frontend Developer roles",
              "Data Scientist roles",
              "Backend Engineer roles",
              "Product Manager roles",
              "ML Engineer roles",
              "DevOps Engineer roles",
            ]}
          />
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          style={{ animation: "fadeUp 0.7s ease 0.3s both" }}
        >
          <button
            onClick={onSignup}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg,#2563eb,#4f46e5)",
              boxShadow: "0 8px 30px rgba(59,130,246,0.35)",
            }}
          >
            Start Practising Free →
          </button>
          <button
            onClick={onLogin}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-white font-medium text-base transition-all hover:-translate-y-0.5"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div
          className="flex flex-wrap justify-center gap-8 md:gap-16"
          style={{ animation: "fadeUp 0.7s ease 0.4s both" }}
        >
          {[
            { value: 10000, suffix: "+", label: "Interviews Practised" },
            { value: 95, suffix: "%", label: "Confidence Increase" },
            { value: 3, suffix: "x", label: "Faster Preparation" },
          ].map(({ value, suffix, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-extrabold text-white mb-1">
                <Counter target={value} suffix={suffix} />
              </div>
              <div className="text-slate-500 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #060b18)",
        }}
      />
    </section>
  );
}

/* ══════════════════════════════════════
   STATS BANNER
══════════════════════════════════════ */
function StatsSection() {
  return (
    <section
      className="py-12 px-4"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {[
            {
              value: 10000,
              suffix: "+",
              label: "Interviews Practiced",
              color: "#3b82f6",
            },
            {
              value: 95,
              suffix: "%",
              label: "Confidence Improvement",
              color: "#8b5cf6",
            },
            {
              value: 49,
              suffix: "/5",
              label: "Average Rating",
              color: "#f59e0b",
            },
            {
              value: 3,
              suffix: "x",
              label: "Faster Preparation",
              color: "#10b981",
            },
            {
              value: 50,
              suffix: "+",
              label: "Job Roles Covered",
              color: "#ec4899",
            },
          ].map(({ value, suffix, label, color }, i) => (
            <ScrollReveal key={label} delay={i * 0.1}>
              <div
                className="text-3xl md:text-4xl font-extrabold mb-1"
                style={{ color }}
              >
                <Counter target={value} suffix={suffix} />
              </div>
              <p className="text-slate-500 text-xs">{label}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   FEATURES SECTION
══════════════════════════════════════ */
const FEATURES = [
  {
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    title: "AI Question Generator",
    desc: "Get tailored interview questions based on your target job role — Frontend, Data Science, Backend and more.",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    title: "Speech & Voice Analysis",
    desc: "AI analyses your speaking speed, pauses, filler words, and confidence level in real time.",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    ),
  },
  {
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.1)",
    title: "Emotion Detection",
    desc: "Computer vision detects your facial expressions — nervous, confident, or confused — frame by frame.",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    title: "Answer Quality Analysis",
    desc: "NLP evaluates keyword relevance, clarity, and completeness of your answers using spaCy and Scikit-learn.",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    title: "Smart Feedback Dashboard",
    desc: "See your confidence score, answer quality, speaking clarity, and personalised improvement tips after every session.",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    color: "#ec4899",
    bg: "rgba(236,72,153,0.1)",
    title: "Video Recording",
    desc: "Record your full interview session with webcam and microphone. Review your performance anytime.",
    icon: (
      <svg
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

function FeaturesSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <PulseBadge color="purple">Everything You Need</PulseBadge>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Powerful AI Features
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A complete interview training system that analyses every dimension
              of your performance.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, color, bg, title, desc }, i) => (
            <ScrollReveal key={title} delay={i * 0.1} direction="up">
              <GlowCard
                color={color}
                style={{ padding: "24px", height: "100%" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: bg, color }}
                >
                  {icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════ */
const STEPS = [
  {
    number: "01",
    color: "#3b82f6",
    title: "Choose Your Role",
    desc: "Select your target role and get tailored questions just for you.",
  },
  {
    number: "02",
    color: "#8b5cf6",
    title: "Record Your Answer",
    desc: "Answer on camera — we capture video, voice, and transcript automatically.",
  },
  {
    number: "03",
    color: "#06b6d4",
    title: "AI Analyses Everything",
    desc: "ML models score your speech pace, emotions, and answer quality simultaneously.",
  },
  {
    number: "04",
    color: "#10b981",
    title: "Get Smart Feedback",
    desc: "Full report with scores, charts, and personalised improvement tips.",
  },
];

function HowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <PulseBadge color="cyan">Simple Process</PulseBadge>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              From zero to interview-ready in four simple steps.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ number, color, title, desc }, i) => (
            <ScrollReveal key={number} delay={i * 0.15} direction="up">
              <div
                className="relative rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="text-5xl font-extrabold mb-4 leading-none select-none"
                  style={{ color, opacity: 0.2 }}
                >
                  {number}
                </div>
                <div
                  className="w-3 h-3 rounded-full mb-4"
                  style={{ background: color, boxShadow: `0 0 10px ${color}` }}
                />
                <h3 className="text-white font-semibold text-lg mb-2">
                  {title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   DEMO SECTION
══════════════════════════════════════ */
function DemoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <PulseBadge color="pink">See It In Action</PulseBadge>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Watch How It Works
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              See how InterviewAI analyses your answers and gives real-time
              feedback in under 2 minutes.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="scale">
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer group"
            style={{
              background: "linear-gradient(135deg,#0f1f3d,#1a0f3d)",
              border: "1px solid rgba(59,130,246,0.3)",
              boxShadow: "0 0 60px rgba(59,130,246,0.15)",
              aspectRatio: "16/9",
            }}
            onClick={() => setPlaying(true)}
          >
            {!playing && (
              <>
                <div className="absolute inset-0 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-md"
                        style={{
                          background: "linear-gradient(135deg,#3b82f6,#7c3aed)",
                        }}
                      />
                      <div className="w-20 h-3 rounded-full bg-white/20" />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-16 h-6 rounded-lg bg-white/10" />
                      <div
                        className="w-20 h-6 rounded-lg"
                        style={{ background: "rgba(59,130,246,0.4)" }}
                      />
                    </div>
                  </div>
                  <div
                    className="rounded-xl p-4 mb-4 flex-shrink-0"
                    style={{
                      background: "rgba(59,130,246,0.15)",
                      border: "1px solid rgba(59,130,246,0.3)",
                    }}
                  >
                    <div
                      className="w-20 h-2 rounded-full mb-2"
                      style={{ background: "rgba(59,130,246,0.6)" }}
                    />
                    <div className="w-full h-3 rounded-full bg-white/20 mb-1" />
                    <div className="w-3/4 h-3 rounded-full bg-white/15" />
                  </div>
                  <div className="flex gap-4 flex-1">
                    <div
                      className="flex-1 rounded-xl overflow-hidden flex items-center justify-center"
                      style={{
                        background: "rgba(0,0,0,0.4)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                          <div className="w-6 h-6 rounded-full bg-white/30" />
                        </div>
                        <div
                          className="flex items-center gap-1 justify-center px-2 py-1 rounded-full mx-auto w-fit"
                          style={{ background: "rgba(239,68,68,0.8)" }}
                        >
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span className="text-white text-xs">REC</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-40">
                      {[
                        { label: "Confidence", val: "78%", color: "#3b82f6" },
                        { label: "Clarity", val: "82%", color: "#8b5cf6" },
                        { label: "Quality", val: "71%", color: "#10b981" },
                        { label: "Pace", val: "85%", color: "#f59e0b" },
                      ].map(({ label, val, color }) => (
                        <div
                          key={label}
                          className="rounded-lg p-2"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: `1px solid ${color}30`,
                          }}
                        >
                          <p
                            className="mb-1"
                            style={{
                              color: "rgba(255,255,255,0.4)",
                              fontSize: "0.6rem",
                            }}
                          >
                            {label}
                          </p>
                          <p className="font-bold text-sm" style={{ color }}>
                            {val}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      border: "2px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div
                  className="absolute bottom-4 right-4 px-3 py-1 rounded-lg text-white text-xs font-medium pointer-events-none"
                  style={{ background: "rgba(0,0,0,0.6)" }}
                >
                  2:34
                </div>
              </>
            )}

            {playing && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: "#000" }}
              >
                <p className="text-white text-lg font-semibold mb-2">
                  ▶ Demo Video
                </p>
                <p className="text-slate-400 text-sm mb-4">
                  Connect your YouTube link here
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlaying(false);
                  }}
                  className="px-4 py-2 rounded-lg text-white text-sm"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  ✕ Close
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {[
            "🎥 Video Recording",
            "🤖 AI Analysis",
            "📊 Instant Scores",
            "💡 Smart Tips",
          ].map((f, i) => (
            <ScrollReveal key={f} delay={i * 0.1} direction="up">
              <div
                className="px-4 py-2 rounded-full text-sm text-slate-300"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {f}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════ */
const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Frontend Developer @ Google",
    avatar: "SJ",
    color: "#3b82f6",
    text: "InterviewAI helped me land my dream job at Google. The AI feedback on my speaking pace was a game changer. I practiced for 2 weeks and felt completely confident.",
  },
  {
    name: "Marcus Chen",
    role: "Data Scientist @ Meta",
    avatar: "MC",
    color: "#8b5cf6",
    text: "The emotion detection feature is incredible. It told me I looked nervous even when I thought I was calm. Fixed that and aced my Meta interview.",
  },
  {
    name: "Priya Patel",
    role: "Backend Engineer @ Amazon",
    avatar: "PP",
    color: "#10b981",
    text: "After 10 sessions my confidence score went from 58% to 89%. Got 3 job offers in one month. This platform is genuinely life changing.",
  },
  {
    name: "James Wilson",
    role: "ML Engineer @ OpenAI",
    avatar: "JW",
    color: "#f59e0b",
    text: "Every question I got in real interviews I had already practiced here. The question generator for ML roles is spot on.",
  },
  {
    name: "Aisha Mohammed",
    role: "Product Manager @ Microsoft",
    avatar: "AM",
    color: "#ec4899",
    text: "As a career switcher I was terrified. InterviewAI gave me structured feedback that no human coach could match. Highly recommend.",
  },
  {
    name: "David Park",
    role: "DevOps Engineer @ Netflix",
    avatar: "DP",
    color: "#06b6d4",
    text: "The speaking clarity analysis showed I was using too many filler words. Fixed it in a week. My interviewers actually commented on it.",
  },
];

function TestimonialsSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <PulseBadge color="yellow">⭐ Success Stories</PulseBadge>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Loved by Job Seekers
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Join thousands who landed their dream jobs using InterviewAI.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, avatar, color, text }, i) => (
            <ScrollReveal key={name} delay={i * 0.1} direction="up">
              <GlowCard
                color={color}
                style={{
                  padding: "24px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">
                  "{text}"
                </p>
                <div
                  className="flex items-center gap-3 pt-2"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg,${color},${color}88)`,
                    }}
                  >
                    {avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{name}</p>
                    <p className="text-slate-500 text-xs">{role}</p>
                  </div>
                </div>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   CTA SECTION
══════════════════════════════════════ */
function CTASection({ onSignup }) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="scale">
          <div
            className="rounded-3xl p-12 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg,rgba(37,99,235,0.2),rgba(79,46,229,0.2))",
              border: "1px solid rgba(59,130,246,0.25)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Ready to <ShimmerText>Ace Your Interview?</ShimmerText>
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of candidates who improved their interview
                performance with AI coaching.
              </p>
              <button
                onClick={onSignup}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                  boxShadow: "0 8px 30px rgba(59,130,246,0.4)",
                }}
              >
                Get Started for Free
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              <p className="text-slate-500 text-sm mt-4">
                No credit card required · Free forever plan
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   FOOTER
══════════════════════════════════════ */
function Footer({ onPricing }) {
  return (
    <footer
      className="py-8 px-8 flex flex-col md:flex-row items-center justify-between gap-4"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#3b82f6,#7c3aed)" }}
        >
          <svg
            width="13"
            height="13"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"
            />
          </svg>
        </div>
        <span className="text-white font-semibold text-sm">InterviewAI</span>
      </div>
      <p className="text-slate-600 text-xs">
        © 2026 InterviewAI. All rights reserved.
      </p>
      <div className="flex items-center gap-6">
        {["Privacy", "Terms", "Contact"].map((l) => (
          <a
            key={l}
            href="#"
            className="text-slate-500 text-xs hover:text-slate-300 transition-colors"
          >
            {l}
          </a>
        ))}
        <button
          onClick={onPricing}
          className="text-slate-500 text-xs hover:text-slate-300 transition-colors"
        >
          Pricing
        </button>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════
   HOME PAGE ← main export
══════════════════════════════════════ */
export default function HomePage({ onLogin, onSignup, onProfile, onPricing }) {
  const [showModal, setShowModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");


  return (
    <PageWrapper>
      <Navbar
        onLogin={onLogin}
        onSignup={onSignup}
        onPractice={() => setShowModal(true)}
        onProfile={onProfile}
        onPricing={onPricing}
        user={user}
      />
      <HeroSection onLogin={onLogin} onSignup={onSignup} />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <DemoSection />
      <TestimonialsSection />
      <CTASection onSignup={onSignup} />
      <Footer onPricing={onPricing} />

      {showModal && <PracticeModal onClose={() => setShowModal(false)} />}
    </PageWrapper>
  );
}
