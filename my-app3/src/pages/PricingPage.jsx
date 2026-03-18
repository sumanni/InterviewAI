// src/pages/PricingPage.jsx
import { useState } from "react";
import PageWrapper, {
  ScrollReveal,
  GlowCard,
  PulseBadge,
  ShimmerText,
  Counter,
} from "../components/PageWrapper";

const PLANS = [
  {
    name: "Free",
    price: { monthly: "£0", annual: "£0" },
    period: "forever",
    color: "#64748b",
    border: "rgba(255,255,255,0.08)",
    popular: false,
    description: "Perfect for getting started and exploring the platform.",
    features: [
      "5 practice sessions per month",
      "Basic AI feedback",
      "3 job roles available",
      "Standard question bank",
      "Basic confidence score",
      "Email support",
    ],
    disabled: [
      "Emotion detection",
      "Speech & voice analysis",
      "Unlimited sessions",
      "Session history",
      "Progress dashboard",
      "Priority support",
    ],
    cta: "Get Started Free",
  },
  {
    name: "Pro",
    price: { monthly: "£12", annual: "£10" },
    period: "per month",
    color: "#3b82f6",
    border: "rgba(59,130,246,0.4)",
    popular: true,
    description: "Everything you need to ace your next interview.",
    features: [
      "Unlimited practice sessions",
      "Full AI feedback & analysis",
      "All job roles available",
      "Emotion detection",
      "Speech & voice analysis",
      "Answer quality scoring",
      "Full session history",
      "Progress dashboard",
      "Priority email support",
    ],
    disabled: ["Team management", "Custom question banks", "API access"],
    cta: "Start Pro Trial",
  },
  {
    name: "Enterprise",
    price: { monthly: "£49", annual: "£39" },
    period: "per month",
    color: "#8b5cf6",
    border: "rgba(139,92,246,0.3)",
    popular: false,
    description: "For teams and organisations preparing at scale.",
    features: [
      "Everything in Pro",
      "Team management dashboard",
      "Custom question banks",
      "Bulk user accounts",
      "Advanced analytics",
      "Custom branding",
      "API access",
      "Dedicated account manager",
      "24/7 priority support",
      "SSO & security controls",
    ],
    disabled: [],
    cta: "Contact Sales",
  },
];

const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your subscription at any time. You will keep access until the end of your billing period.",
  },
  {
    q: "Is there a free trial?",
    a: "The Free plan is free forever. Pro and Enterprise plans include a 7-day free trial — no credit card required.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards including Visa, Mastercard, and American Express, as well as PayPal.",
  },
  {
    q: "Can I switch plans?",
    a: "Yes. You can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. All data is encrypted with 256-bit SSL. We never sell your data to third parties. See our privacy policy for full details.",
  },
  {
    q: "Do you offer student discounts?",
    a: "Yes! Students get 50% off the Pro plan. Contact us with your valid student email to claim your discount.",
  },
];

export default function PricingPage({ onHome, onSignup }) {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <PageWrapper>
      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: "rgba(6,11,24,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={onHome}
        >
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
        <button
          onClick={onHome}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          ← Back to Home
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* ── Page Header ── */}
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <PulseBadge color="green">💰 Simple Pricing</PulseBadge>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
              Choose Your <ShimmerText>Plan</ShimmerText>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-8">
              Start free, upgrade when you're ready. No hidden fees. Cancel
              anytime.
            </p>

            {/* Monthly / Annual toggle */}
            <div
              className="inline-flex items-center gap-1 p-1 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <button
                onClick={() => setAnnual(false)}
                className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300"
                style={{
                  background: !annual ? "rgba(59,130,246,0.3)" : "transparent",
                  color: !annual ? "#fff" : "#64748b",
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2"
                style={{
                  background: annual ? "rgba(59,130,246,0.3)" : "transparent",
                  color: annual ? "#fff" : "#64748b",
                }}
              >
                Annual
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    background: "rgba(16,185,129,0.2)",
                    color: "#34d399",
                  }}
                >
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Stats Row ── */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              {
                value: 10000,
                suffix: "+",
                label: "Users Trained",
                color: "#3b82f6",
              },
              {
                value: 95,
                suffix: "%",
                label: "Success Rate",
                color: "#10b981",
              },
              { value: 50, suffix: "+", label: "Job Roles", color: "#8b5cf6" },
              {
                value: 7,
                suffix: "/10",
                label: "Avg Score Increase",
                color: "#f59e0b",
              },
            ].map(({ value, suffix, label, color }) => (
              <div
                key={label}
                className="rounded-2xl p-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="text-2xl font-extrabold mb-1" style={{ color }}>
                  <Counter target={value} suffix={suffix} />
                </div>
                <p className="text-slate-500 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ── Pricing Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PLANS.map(
            (
              {
                name,
                price,
                period,
                color,
                border,
                popular,
                description,
                features,
                disabled,
                cta,
              },
              i,
            ) => {
              const displayPrice = annual ? price.annual : price.monthly;
              return (
                <ScrollReveal key={name} delay={i * 0.15} direction="up">
                  <div
                    className="rounded-2xl p-8 flex flex-col relative h-full transition-all duration-300 hover:-translate-y-2"
                    style={{
                      background: popular
                        ? "rgba(59,130,246,0.08)"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${border}`,
                      boxShadow: popular
                        ? "0 0 50px rgba(59,130,246,0.15)"
                        : "none",
                    }}
                  >
                    {/* Popular badge */}
                    {popular && (
                      <div
                        className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold text-white"
                        style={{
                          background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                          boxShadow: "0 4px 15px rgba(59,130,246,0.4)",
                          animation: "fadeDown 0.5s ease both",
                        }}
                      >
                        ⭐ Most Popular
                      </div>
                    )}

                    {/* Plan header */}
                    <div className="mb-6">
                      <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                        style={{ background: `${color}20`, color }}
                      >
                        {name}
                      </div>
                      <p className="text-slate-400 text-sm mb-4">
                        {description}
                      </p>
                      <div className="flex items-end gap-2">
                        <span
                          className="text-5xl font-extrabold text-white"
                          style={{ animation: "scaleIn 0.4s ease both" }}
                        >
                          {displayPrice}
                        </span>
                        {price.monthly !== "£0" && (
                          <div className="mb-2">
                            <p className="text-slate-500 text-sm">{period}</p>
                            {annual && (
                              <p className="text-green-400 text-xs">
                                billed annually
                              </p>
                            )}
                          </div>
                        )}
                        {price.monthly === "£0" && (
                          <span className="text-slate-500 text-sm mb-2">
                            {period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={onSignup}
                      className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-px mb-6"
                      style={{
                        background: popular
                          ? "linear-gradient(135deg,#2563eb,#4f46e5)"
                          : `${color}20`,
                        border: popular ? "none" : `1px solid ${color}40`,
                        color: "#fff",
                        boxShadow: popular
                          ? "0 4px 20px rgba(59,130,246,0.3)"
                          : "none",
                      }}
                    >
                      {cta}
                    </button>

                    {/* Divider */}
                    <div
                      className="h-px mb-6"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    />

                    {/* Features list */}
                    <div className="flex-1 space-y-3">
                      <p className="text-slate-400 text-xs uppercase tracking-widest font-medium mb-4">
                        What's included
                      </p>
                      {features.map((f, fi) => (
                        <div
                          key={f}
                          className="flex items-start gap-3"
                          style={{
                            animation: `fadeUp 0.4s ease ${fi * 0.05}s both`,
                          }}
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: `${color}25` }}
                          >
                            <svg
                              width="9"
                              height="9"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke={color}
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-slate-300 text-sm">{f}</span>
                        </div>
                      ))}
                      {disabled.map((f) => (
                        <div
                          key={f}
                          className="flex items-start gap-3 opacity-30"
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: "rgba(255,255,255,0.05)" }}
                          >
                            <svg
                              width="9"
                              height="9"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="#64748b"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                          <span className="text-slate-500 text-sm">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              );
            },
          )}
        </div>

        {/* ── Comparison Table ── */}
        <ScrollReveal direction="up">
          <div
            className="rounded-2xl overflow-hidden mb-20"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="px-6 py-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 className="text-white font-bold text-xl">
                Full Feature Comparison
              </h2>
            </div>

            {/* Header row */}
            <div
              className="grid grid-cols-4 px-6 py-3 text-xs uppercase tracking-widest font-medium"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="text-slate-500">Feature</div>
              <div className="text-center text-slate-400">Free</div>
              <div className="text-center" style={{ color: "#3b82f6" }}>
                Pro
              </div>
              <div className="text-center" style={{ color: "#8b5cf6" }}>
                Enterprise
              </div>
            </div>

            {[
              {
                label: "Practice sessions",
                free: "5/month",
                pro: "Unlimited",
                ent: "Unlimited",
              },
              {
                label: "Job roles",
                free: "3",
                pro: "All",
                ent: "All + Custom",
              },
              { label: "AI feedback", free: "Basic", pro: "Full", ent: "Full" },
              { label: "Emotion detection", free: false, pro: true, ent: true },
              { label: "Speech analysis", free: false, pro: true, ent: true },
              { label: "Session history", free: false, pro: true, ent: true },
              {
                label: "Progress dashboard",
                free: false,
                pro: true,
                ent: true,
              },
              { label: "Team management", free: false, pro: false, ent: true },
              {
                label: "Custom question banks",
                free: false,
                pro: false,
                ent: true,
              },
              { label: "API access", free: false, pro: false, ent: true },
              {
                label: "Support",
                free: "Email",
                pro: "Priority",
                ent: "24/7 Dedicated",
              },
            ].map(({ label, free, pro, ent }, i) => (
              <div
                key={label}
                className="grid grid-cols-4 px-6 py-4 items-center transition-all duration-200 hover:bg-white/5"
                style={{
                  background:
                    i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <span className="text-slate-300 text-sm">{label}</span>
                {[free, pro, ent].map((val, j) => (
                  <div key={j} className="flex justify-center">
                    {typeof val === "boolean" ? (
                      val ? (
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="#10b981"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="#374151"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )
                    ) : (
                      <span className="text-slate-400 text-sm">{val}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ── FAQ ── */}
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto mb-20">
            <div className="text-center mb-10">
              <PulseBadge color="blue">FAQ</PulseBadge>
              <h2 className="text-3xl font-extrabold text-white">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {FAQS.map(({ q, a }, i) => (
                <ScrollReveal key={i} delay={i * 0.07} direction="up">
                  <div
                    className="rounded-xl overflow-hidden transition-all duration-200"
                    style={{
                      background:
                        openFaq === i
                          ? "rgba(59,130,246,0.06)"
                          : "rgba(255,255,255,0.03)",
                      border:
                        openFaq === i
                          ? "1px solid rgba(59,130,246,0.2)"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left"
                    >
                      <span className="text-white font-medium text-sm">
                        {q}
                      </span>
                      <span
                        className="text-slate-400 text-xl transition-transform duration-300 flex-shrink-0"
                        style={{
                          transform:
                            openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                        }}
                      >
                        +
                      </span>
                    </button>
                    {openFaq === i && (
                      <div
                        className="px-6 pb-5"
                        style={{ animation: "fadeUp 0.3s ease both" }}
                      >
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {a}
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ── Bottom CTA ── */}
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
                  "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.1) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold text-white mb-4">
                Start Practicing <ShimmerText>Today</ShimmerText>
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of candidates who landed their dream jobs with
                InterviewAI.
              </p>
              <button
                onClick={onSignup}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                  boxShadow: "0 8px 30px rgba(59,130,246,0.4)",
                }}
              >
                Get Started Free →
              </button>
              <p className="text-slate-500 text-sm mt-4">
                No credit card required · Cancel anytime
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </PageWrapper>
  );
}
