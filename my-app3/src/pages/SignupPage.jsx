// src/pages/SignupPage.jsx
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { registerUser, setToken } from "../utils/api";

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

function StrengthMeter({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  score = Math.min(score, 3);
  const colors = ["", "bg-red-500", "bg-yellow-400", "bg-green-400"];
  const labels = ["", "Weak", "Fair", "Strong ✓"];
  const textColors = ["", "text-red-400", "text-yellow-400", "text-green-400"];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="flex-1 h-1 rounded-full overflow-hidden bg-white/10"
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${n <= score ? colors[score] : ""}`}
              style={{ width: n <= score ? "100%" : "0%" }}
            />
          </div>
        ))}
      </div>
      <p className={`text-xs ${textColors[score]}`}>{labels[score]}</p>
    </div>
  );
}

const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
};
const focusOn = (e) => {
  e.target.style.borderColor = "#3b82f6";
  e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)";
};
const focusOff = (e) => {
  e.target.style.borderColor = "rgba(255,255,255,0.1)";
  e.target.style.boxShadow = "none";
};

export default function SignupPage({ onSwitch, onHome }) {
  // ── State ──
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Google Signup ──
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (response) => {
      console.log("Google signup success!", response);
      alert("Google signup successful!");
    },
    onError: () => {
      setError("Google signup failed. Try again.");
    },
  });

  // ── Email Signup ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }
    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service.");
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(
        `${firstName.trim()} ${lastName.trim()}`,
        email.trim(),
        password,
        role,
      );

      if (result.success) {
        setToken(result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        onHome();
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Could not connect to server. Make sure backend is running.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060b18] px-4 py-10">
      <style>{`
        .btn-signup {
          background: linear-gradient(135deg,#2563eb,#4f46e5);
          position: relative;
          overflow: hidden;
          transition: transform .15s, box-shadow .15s;
        }
        .btn-signup::after {
          content: '';
          position: absolute;
          top: -50%; left: -60%;
          width: 40%; height: 200%;
          background: rgba(255,255,255,.12);
          transform: skewX(-20deg);
          transition: left .4s;
        }
        .btn-signup:hover::after { left: 130%; }
        .btn-signup:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(59,130,246,.4);
        }
        .btn-signup:disabled { opacity: 0.45; cursor: not-allowed; }
      `}</style>

      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#3b82f6,#7c3aed)" }}
            >
              <svg
                width="20"
                height="20"
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
            <span className="text-2xl font-bold text-white">InterviewAI</span>
          </div>
          <p className="text-slate-400 text-sm">
            Your AI-powered interview training partner
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h1 className="text-2xl font-bold text-white mb-1">Start for free</h1>
          <p className="text-slate-400 text-sm mb-6">
            Create your account and ace your next interview
          </p>

          {/* Google Button */}
          <button
            onClick={() => loginWithGoogle()}
            className="flex items-center justify-center gap-3 w-full rounded-xl py-3 text-white text-sm font-medium mb-5 transition-all hover:opacity-90"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-xs uppercase tracking-widest">
              or register with email
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none"
                  style={inputStyle}
                  onFocus={focusOn}
                  onBlur={focusOff}
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none"
                  style={inputStyle}
                  onFocus={focusOn}
                  onBlur={focusOff}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-widests mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none"
                style={inputStyle}
                onFocus={focusOn}
                onBlur={focusOff}
              />
            </div>

            {/* Job Role */}
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2">
                Target Job Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer"
                style={inputStyle}
                onFocus={focusOn}
                onBlur={focusOff}
              >
                <option value="" style={{ background: "#0f172a" }}>
                  Select your role...
                </option>
                {ROLES.map((r) => (
                  <option key={r} value={r} style={{ background: "#0f172a" }}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none pr-12"
                  style={inputStyle}
                  onFocus={focusOn}
                  onBlur={focusOff}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPw ? (
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <StrengthMeter password={password} />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 cursor-pointer"
                style={{ accentColor: "#3b82f6" }}
              />
              <label
                htmlFor="terms"
                className="text-slate-400 text-sm cursor-pointer"
              >
                I agree to the{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Error message */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm text-red-400"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!agreed || loading}
              className="btn-signup w-full rounded-xl py-3 text-white font-semibold text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="white"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          {/* Switch to login */}
          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{" "}
            <button
              onClick={onSwitch}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-5">
          Secured with 256-bit SSL · No credit card required
        </p>
      </div>
    </div>
  );
}
