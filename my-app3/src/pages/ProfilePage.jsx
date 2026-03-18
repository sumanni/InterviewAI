// src/pages/ProfilePage.jsx
import { useState, useEffect, useRef } from "react";
import PageWrapper, {
  ScrollReveal,
  GlowCard,
  PulseBadge,
  Counter,
} from "../components/PageWrapper";

const DEFAULT_PROFILE = {
  name: "John Doe",
  email: "john@example.com",
  role: "Frontend Developer",
  photo: "",
  memberSince: "March 2026",
};

const DEFAULT_STATS = {
  sessions: 3,
  minutes: 24,
  avgScore: 72,
  streak: 2,
  roles: 1,
};

const DEFAULT_GOALS = [
  {
    id: 1,
    title: "Complete 10 practice sessions",
    current: 2,
    target: 10,
    unit: "sessions",
    color: "#3b82f6",
    done: false,
  },
  {
    id: 2,
    title: "Achieve 80% confidence score",
    current: 72,
    target: 80,
    unit: "%",
    color: "#8b5cf6",
    done: false,
  },
  {
    id: 3,
    title: "Practice 5 different job roles",
    current: 1,
    target: 5,
    unit: "roles",
    color: "#10b981",
    done: false,
  },
  {
    id: 4,
    title: "Complete a full mock interview",
    current: 0,
    target: 1,
    unit: "interview",
    color: "#f59e0b",
    done: false,
  },
  {
    id: 5,
    title: "Practice for 60 minutes total",
    current: 24,
    target: 60,
    unit: "minutes",
    color: "#ec4899",
    done: false,
  },
];

const BADGES = [
  {
    id: "first",
    icon: "🎯",
    title: "First Step",
    desc: "Complete 1 session",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.5)",
    check: (s) => s.sessions >= 1,
  },
  {
    id: "fire",
    icon: "🔥",
    title: "On Fire",
    desc: "3 day streak",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.5)",
    check: (s) => s.streak >= 3,
  },
  {
    id: "confident",
    icon: "💪",
    title: "Confident",
    desc: "Score 80%+ confidence",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.5)",
    check: (s) => s.avgScore >= 80,
  },
  {
    id: "speaker",
    icon: "🎤",
    title: "Clear Speaker",
    desc: "Score 80%+ clarity",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.5)",
    check: (s) => s.avgScore >= 80,
  },
  {
    id: "allround",
    icon: "⭐",
    title: "All Rounder",
    desc: "Score 75%+ all metrics",
    color: "#10b981",
    glow: "rgba(16,185,129,0.5)",
    check: (s) => s.avgScore >= 75,
  },
  {
    id: "explorer",
    icon: "🗺️",
    title: "Role Explorer",
    desc: "Practice 3 roles",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.5)",
    check: (s) => s.roles >= 3,
  },
  {
    id: "pro",
    icon: "🏆",
    title: "Interview Pro",
    desc: "Complete 10 sessions",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.5)",
    check: (s) => s.sessions >= 10,
  },
  {
    id: "consistent",
    icon: "📅",
    title: "Consistent",
    desc: "7 day streak",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.5)",
    check: (s) => s.streak >= 7,
  },
];

const ROLES = [
  "Frontend Developer",
  "Backend Engineer",
  "Data Scientist",
  "ML Engineer",
  "Full-Stack Developer",
  "DevOps Engineer",
  "Product Manager",
  "UI/UX Designer",
];

const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#f1f5f9",
  outline: "none",
};
const focusOn = (e) => {
  e.target.style.borderColor = "#3b82f6";
  e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)";
};
const focusOff = (e) => {
  e.target.style.borderColor = "rgba(255,255,255,0.1)";
  e.target.style.boxShadow = "none";
};

// ─── PROFILE HEADER ────────────────────────────────────────
function ProfileHeader({ profile, onUpdate }) {
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const fileRef = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  return (
    <>
      <ScrollReveal direction="up">
        <div
          className="rounded-2xl p-8 mb-6 relative overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)",
            }}
          />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#1e3a5f,#2d1b69)",
                  border: "2px solid rgba(59,130,246,0.3)",
                }}
              >
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-extrabold text-white">
                    {profile.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2"
                style={{ background: "#10b981", borderColor: "#060b18" }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-white mb-1">
                {profile.name}
              </h1>
              <p className="text-slate-400 text-sm mb-3">{profile.email}</p>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
                style={{
                  background: "rgba(59,130,246,0.15)",
                  border: "1px solid rgba(59,130,246,0.3)",
                  color: "#93c5fd",
                }}
              >
                🎯 {profile.role}
              </div>
              <p className="text-slate-600 text-xs">
                Member since {profile.memberSince}
              </p>
            </div>

            {/* Edit button */}
            <button
              onClick={() => {
                setForm({ ...profile });
                setShowEdit(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Edit Modal */}
      {showEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEdit(false);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl"
            style={{
              background: "#0d1526",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
              animation: "scaleIn 0.3s ease both",
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h2 className="text-white font-bold">Edit Profile</h2>
              <button
                onClick={() => setShowEdit(false)}
                className="text-slate-400 hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Photo */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#1e3a5f,#2d1b69)",
                    border: "1px solid rgba(59,130,246,0.3)",
                  }}
                >
                  {form.photo ? (
                    <img
                      src={form.photo}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {form.name?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => fileRef.current.click()}
                    className="px-4 py-2 rounded-lg text-sm text-blue-400 transition-all hover:text-blue-300"
                    style={{
                      background: "rgba(59,130,246,0.1)",
                      border: "1px solid rgba(59,130,246,0.2)",
                    }}
                  >
                    Upload Photo
                  </button>
                  <p className="text-slate-600 text-xs mt-1">
                    JPG, PNG up to 5MB
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhoto}
                  />
                </div>
              </div>
              {/* Name */}
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full rounded-xl px-4 py-3 text-sm placeholder:text-white/30"
                  style={inputStyle}
                  onFocus={focusOn}
                  onBlur={focusOff}
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full rounded-xl px-4 py-3 text-sm placeholder:text-white/30"
                  style={inputStyle}
                  onFocus={focusOn}
                  onBlur={focusOff}
                />
              </div>
              {/* Role */}
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2">
                  Target Job Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                  className="w-full rounded-xl px-4 py-3 text-sm cursor-pointer"
                  style={inputStyle}
                  onFocus={focusOn}
                  onBlur={focusOff}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r} style={{ background: "#0f172a" }}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowEdit(false)}
                  className="flex-1 py-3 rounded-xl text-slate-400 text-sm transition-all hover:text-white"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUpdate(form);
                    setShowEdit(false);
                  }}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── STATS ROW ─────────────────────────────────────────────
function StatsRow({ stats }) {
  const cards = [
    {
      key: "sessions",
      label: "Total Sessions",
      suffix: "",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
      icon: "🎬",
    },
    {
      key: "minutes",
      label: "Minutes Practiced",
      suffix: "m",
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
      icon: "⏱️",
    },
    {
      key: "avgScore",
      label: "Average Score",
      suffix: "%",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      icon: "📊",
    },
    {
      key: "streak",
      label: "Day Streak",
      suffix: "🔥",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      icon: "⚡",
    },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map(({ key, label, suffix, color, bg, icon }, i) => (
        <ScrollReveal key={key} delay={i * 0.1} direction="up">
          <GlowCard color={color} style={{ padding: "20px" }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-xl"
              style={{ background: bg }}
            >
              {icon}
            </div>
            <div className="text-3xl font-extrabold mb-1" style={{ color }}>
              <Counter target={stats[key] || 0} suffix={suffix} />
            </div>
            <p className="text-slate-500 text-xs">{label}</p>
          </GlowCard>
        </ScrollReveal>
      ))}
    </div>
  );
}

// ─── BADGES ────────────────────────────────────────────────
function BadgesSection({ stats }) {
  const unlocked = BADGES.filter((b) => b.check(stats)).length;
  return (
    <ScrollReveal direction="up">
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-bold text-lg">Achievements</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {unlocked} of {BADGES.length} unlocked
            </p>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.2)",
              color: "#93c5fd",
            }}
          >
            {Math.round((unlocked / BADGES.length) * 100)}% Complete
          </div>
        </div>
        {/* Progress bar */}
        <div
          className="h-1.5 rounded-full mb-6 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${(unlocked / BADGES.length) * 100}%`,
              background: "linear-gradient(90deg,#3b82f6,#8b5cf6)",
            }}
          />
        </div>
        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {BADGES.map((badge, i) => {
            const isUnlocked = badge.check(stats);
            return (
              <ScrollReveal key={badge.id} delay={i * 0.07} direction="up">
                <div
                  className="rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: isUnlocked
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.02)",
                    border: isUnlocked
                      ? `1px solid ${badge.color}30`
                      : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    className="text-4xl mb-3 transition-all duration-300"
                    style={{
                      filter: isUnlocked
                        ? `drop-shadow(0 0 12px ${badge.glow})`
                        : "grayscale(1) opacity(0.25)",
                    }}
                  >
                    {badge.icon}
                  </div>
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{
                      color: isUnlocked ? "#f1f5f9" : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {badge.title}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      color: isUnlocked
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(255,255,255,0.12)",
                    }}
                  >
                    {badge.desc}
                  </p>
                  {isUnlocked ? (
                    <div
                      className="mt-2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: badge.color }}
                    >
                      <svg
                        width="10"
                        height="10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="white"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div
                      className="mt-2 text-xs"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      🔒
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </ScrollReveal>
  );
}

// ─── GOALS TRACKER ─────────────────────────────────────────
function GoalsTracker({ goals, onUpdate }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newUnit, setNewUnit] = useState("sessions");

  const addGoal = () => {
    if (!newTitle.trim() || !newTarget) return;
    const colors = [
      "#3b82f6",
      "#8b5cf6",
      "#10b981",
      "#f59e0b",
      "#ec4899",
      "#06b6d4",
    ];
    onUpdate([
      ...goals,
      {
        id: Date.now(),
        title: newTitle.trim(),
        current: 0,
        target: parseInt(newTarget),
        unit: newUnit,
        color: colors[goals.length % colors.length],
        done: false,
      },
    ]);
    setNewTitle("");
    setNewTarget("");
    setShowAdd(false);
  };

  return (
    <ScrollReveal direction="up">
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-lg">Goals</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {goals.filter((g) => g.done).length} of {goals.length} completed
            </p>
          </div>
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}
          >
            + Add Goal
          </button>
        </div>

        {showAdd && (
          <div
            className="rounded-xl p-4 mb-4"
            style={{
              background: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.15)",
              animation: "fadeUp 0.3s ease both",
            }}
          >
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Goal title e.g. Complete 20 sessions"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                style={inputStyle}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Target e.g. 20"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30"
                  style={inputStyle}
                />
                <select
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-sm cursor-pointer"
                  style={inputStyle}
                >
                  {["sessions", "minutes", "%", "roles", "interview"].map(
                    (u) => (
                      <option
                        key={u}
                        value={u}
                        style={{ background: "#0f172a" }}
                      >
                        {u}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 rounded-xl text-slate-400 text-sm transition-all hover:text-white"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={addGoal}
                  className="flex-1 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                  }}
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {goals.map((goal, i) => {
            const pct = Math.min(
              Math.round((goal.current / goal.target) * 100),
              100,
            );
            return (
              <ScrollReveal key={goal.id} delay={i * 0.08} direction="left">
                <div
                  className="rounded-xl p-4 transition-all duration-200"
                  style={{
                    background: goal.done
                      ? "rgba(16,185,129,0.05)"
                      : "rgba(255,255,255,0.02)",
                    border: goal.done
                      ? "1px solid rgba(16,185,129,0.2)"
                      : "1px solid rgba(255,255,255,0.06)",
                    opacity: goal.done ? 0.7 : 1,
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() =>
                          onUpdate(
                            goals.map((g) =>
                              g.id === goal.id
                                ? {
                                    ...g,
                                    done: !g.done,
                                    current: !g.done ? g.target : g.current,
                                  }
                                : g,
                            ),
                          )
                        }
                        className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center mt-0.5 transition-all"
                        style={{
                          background: goal.done
                            ? "#10b981"
                            : "rgba(255,255,255,0.06)",
                          border: goal.done
                            ? "none"
                            : "1px solid rgba(255,255,255,0.15)",
                        }}
                      >
                        {goal.done && (
                          <svg
                            width="10"
                            height="10"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1">
                        <p
                          className="text-sm font-medium"
                          style={{
                            color: goal.done
                              ? "rgba(255,255,255,0.35)"
                              : "#f1f5f9",
                            textDecoration: goal.done ? "line-through" : "none",
                          }}
                        >
                          {goal.title}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: goal.color }}
                        >
                          {goal.current} / {goal.target} {goal.unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-bold"
                        style={{ color: goal.done ? "#10b981" : goal.color }}
                      >
                        {goal.done ? "✓" : `${pct}%`}
                      </span>
                      <button
                        onClick={() =>
                          onUpdate(goals.filter((g) => g.id !== goal.id))
                        }
                        className="text-slate-600 hover:text-red-400 transition-colors text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  {!goal.done && (
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: goal.color }}
                      />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </ScrollReveal>
  );
}

// ─── MAIN PROFILE PAGE ─────────────────────────────────────
export default function ProfilePage({ onHome }) {
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ai_profile")) || DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });
  const [goals, setGoals] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ai_goals")) || DEFAULT_GOALS;
    } catch {
      return DEFAULT_GOALS;
    }
  });

  useEffect(() => {
    localStorage.setItem("ai_profile", JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem("ai_goals", JSON.stringify(goals));
  }, [goals]);

  return (
    <PageWrapper>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: "rgba(6,11,24,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ScrollReveal direction="up">
          <div className="mb-6">
            <PulseBadge color="blue">My Profile</PulseBadge>
            <h1 className="text-3xl font-extrabold text-white mb-1">
              Profile & Progress
            </h1>
            <p className="text-slate-500 text-sm">
              Track your progress, achievements, and goals
            </p>
          </div>
        </ScrollReveal>

        <ProfileHeader profile={profile} onUpdate={setProfile} />
        <StatsRow stats={DEFAULT_STATS} />
        <BadgesSection stats={DEFAULT_STATS} />
        <GoalsTracker goals={goals} onUpdate={setGoals} />

        <p className="text-center text-slate-700 text-xs pb-8">
          Your data is saved locally in your browser
        </p>
      </div>
    </PageWrapper>
  );
}
