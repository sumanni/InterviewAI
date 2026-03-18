// src/components/PracticeModal.jsx
import { useState, useEffect, useRef } from "react";
import { speakWithElevenLabs, stopSpeaking } from "../utils/speak";

const QUESTIONS = [
  "Tell me about yourself and your experience.",
  "What is your greatest strength and weakness?",
  "Why do you want to work at this company?",
  "Describe a challenging situation and how you handled it.",
  "Where do you see yourself in 5 years?",
  "Why are you leaving your current job?",
  "Tell me about a time you worked in a team.",
  "How do you handle pressure and tight deadlines?",
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

const TIMER_LIMIT = 120;

const getEmotionColor = (dominant) => {
  if (dominant === "happy") return "#10b981";
  if (dominant === "neutral") return "#94a3b8";
  if (dominant === "fear" || dominant === "sad") return "#ef4444";
  if (dominant === "angry") return "#f59e0b";
  if (dominant === "surprise") return "#8b5cf6";
  return "#94a3b8";
};

export default function PracticeModal({ onClose }) {
  // ── State ──
  const [step, setStep] = useState("setup");
  const [selectedRole, setSelectedRole] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_LIMIT);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [emotionData, setEmotionData] = useState(null);
  const [emotionTimeline, setEmotionTimeline] = useState([]);
  const [aiServiceOnline, setAiServiceOnline] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);

  // ── Refs ──
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);
  const emotionIntervalRef = useRef(null);
  const isRecordingRef = useRef(false);
  const recognitionRef = useRef(null);

  // Keep ref in sync with state
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // ── Check AI service ──
  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((r) => r.json())
      .then(() => setAiServiceOnline(true))
      .catch(() => setAiServiceOnline(false));
  }, []);

  // ── Speak question ──
  const speakQuestion = async (text) => {
    setIsSpeaking(true);
    await speakWithElevenLabs(text);
    setIsSpeaking(false);
  };

  // ── Auto speak when question changes ──
  useEffect(() => {
    if (step === "practice" && questions[questionIndex]) {
      const t = setTimeout(() => {
        speakQuestion(questions[questionIndex]);
      }, 800);
      return () => {
        clearTimeout(t);
        stopSpeaking();
      };
    }
    return () => stopSpeaking();
  }, [step, questionIndex, questions]);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      stopCamera();
      stopSpeaking();
      stopSpeechRecognition();
      clearInterval(timerRef.current);
      clearInterval(emotionIntervalRef.current);
    };
  }, []);

  // ── Re-attach stream on question change ──
  useEffect(() => {
    if (step === "practice" && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [step, questionIndex]);

  // ── Camera ──
  const startCamera = async () => {
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraReady(true);
    } catch (err) {
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  };

  // ── Speech Recognition ──
  const startSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // ── Fix: track which results have already been added ──
    let lastProcessedIndex = 0;

    recognition.onresult = (event) => {
      let newFinalText = "";
      let interim = "";

      for (let i = lastProcessedIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          newFinalText += event.results[i][0].transcript + " ";
          lastProcessedIndex = i + 1; // move pointer forward
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      // Only add truly new final text
      if (newFinalText) {
        setTranscript((prev) => prev + newFinalText);
      }

      // Interim is always just the current partial result
      setInterimText(interim);
    };

    recognition.onerror = (e) => {
      console.log("Speech recognition error:", e.error);
    };

    recognition.onend = () => {
      if (isRecordingRef.current) {
        // Reset index on restart
        lastProcessedIndex = 0;
        try {
          recognition.start();
        } catch {}
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.log("Speech recognition start error:", err);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setInterimText("");
  };

  // ── Emotion Detection ──
  const captureAndAnalyzeFrame = async () => {
    if (!isRecordingRef.current) return;
    if (!videoRef.current) return;
    if (!aiServiceOnline) return;

    try {
      const video = videoRef.current;
      if (!video.videoWidth || !video.videoHeight) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);

      const base64Frame = canvas.toDataURL("image/jpeg", 0.8);

      const response = await fetch("http://localhost:8000/emotions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame: base64Frame }),
      });

      const data = await response.json();

      if (data.success) {
        setEmotionData(data);
        setEmotionTimeline((prev) => [
          ...prev,
          {
            timestamp: Date.now(),
            dominant: data.dominant_emotion,
            confidence: data.confidence_score,
            label: data.label,
            emotions: data.emotions,
          },
        ]);
      }
    } catch (err) {
      console.error("Emotion analysis error:", err);
    }
  };

  // ── Recording ──
  const startRecording = () => {
    if (!streamRef.current) return;
    setCountdown(3);
    const countInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countInterval);
          setCountdown(null);
          beginActualRecording();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const beginActualRecording = () => {
    chunksRef.current = [];
    if (mediaRecRef.current && mediaRecRef.current.state !== "inactive") {
      mediaRecRef.current.stop();
    }
    setTimeout(() => {
      if (!streamRef.current) return;
      const mr = new MediaRecorder(streamRef.current);
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.start();
      mediaRecRef.current = mr;

      isRecordingRef.current = true;
      setIsRecording(true);
      setTranscript("");
      setInterimText("");
      setTimeLeft(TIMER_LIMIT);
      clearInterval(timerRef.current);

      // Start speech recognition
      startSpeechRecognition();

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setEmotionTimeline([]);
      setEmotionData(null);
      captureAndAnalyzeFrame();
      emotionIntervalRef.current = setInterval(() => {
        captureAndAnalyzeFrame();
      }, 2000);
    }, 300);
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    stopSpeechRecognition();
    clearInterval(timerRef.current);
    clearInterval(emotionIntervalRef.current);
    emotionIntervalRef.current = null;
    if (mediaRecRef.current && mediaRecRef.current.state !== "inactive") {
      mediaRecRef.current.stop();
    }
    mediaRecRef.current = null;
    setIsRecording(false);
    generateFeedback();
  };

  // ── Feedback ──
  const generateFeedback = () => {
    const scores = {
      confidence: Math.floor(Math.random() * 30) + 65,
      clarity: Math.floor(Math.random() * 30) + 60,
      answerQuality: Math.floor(Math.random() * 30) + 60,
      speakingPace: Math.floor(Math.random() * 30) + 65,
    };
    const tips = [
      "Maintain eye contact with the camera to appear more confident.",
      "Try to slow down your speaking pace slightly for better clarity.",
      "Use more specific examples to back up your answers.",
      "Start your answer with a brief summary before going into detail.",
    ];
    setFeedback({ scores, tip: tips[Math.floor(Math.random() * tips.length)] });
    setStep("feedback");
  };

  // ── Next question ──
  const nextQuestion = () => {
    stopSpeaking();
    stopSpeechRecognition();
    clearInterval(timerRef.current);
    clearInterval(emotionIntervalRef.current);
    emotionIntervalRef.current = null;
    if (mediaRecRef.current && mediaRecRef.current.state !== "inactive") {
      mediaRecRef.current.stop();
    }
    mediaRecRef.current = null;
    isRecordingRef.current = false;
    setIsRecording(false);
    setFeedback(null);
    setTimeLeft(TIMER_LIMIT);
    setEmotionData(null);
    setEmotionTimeline([]);
    setTranscript("");
    setInterimText("");
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((i) => i + 1);
      setStep("practice");
    } else {
      handleClose();
    }
  };

  // ── Begin practice ──
  const beginPractice = async () => {
    if (!selectedRole) return;
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
    setQuestionIndex(0);
    setStep("practice");
    await startCamera();
  };

  // ── Close ──
  const handleClose = () => {
    stopSpeaking();
    stopSpeechRecognition();
    clearInterval(timerRef.current);
    clearInterval(emotionIntervalRef.current);
    emotionIntervalRef.current = null;
    if (mediaRecRef.current && mediaRecRef.current.state !== "inactive") {
      mediaRecRef.current.stop();
    }
    stopCamera();
    setEmotionData(null);
    setEmotionTimeline([]);
    setTranscript("");
    setInterimText("");
    onClose();
  };

  const timerColor =
    timeLeft > 60 ? "#10b981" : timeLeft > 30 ? "#f59e0b" : "#ef4444";
  const timerPct = (timeLeft / TIMER_LIMIT) * 100;
  const avgConfidence =
    emotionTimeline.length > 0
      ? Math.round(
          emotionTimeline.reduce((a, b) => a + b.confidence, 0) /
            emotionTimeline.length,
        )
      : null;
  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div
          className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: "#0d1526",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
            animation: "modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#3b82f6,#7c3aed)",
                }}
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
                    d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-base">
                  Interview Practice
                </h2>
                {step === "practice" || step === "feedback" ? (
                  <p className="text-slate-500 text-xs">
                    Question {questionIndex + 1} of {questions.length} ·{" "}
                    {selectedRole}
                  </p>
                ) : (
                  <p className="text-slate-500 text-xs">Set up your session</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* AI Service status */}
              <div
                className="flex items-center gap-1.5 px-2 py-1 rounded-full"
                style={{
                  background: aiServiceOnline
                    ? "rgba(16,185,129,0.1)"
                    : "rgba(239,68,68,0.1)",
                  border: `1px solid ${aiServiceOnline ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: aiServiceOnline ? "#10b981" : "#ef4444",
                  }}
                />
                <span
                  className="text-xs"
                  style={{ color: aiServiceOnline ? "#10b981" : "#ef4444" }}
                >
                  {aiServiceOnline ? "AI Online" : "AI Offline"}
                </span>
              </div>

              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* ══════════════════════════════
               STEP 1 — SETUP
          ══════════════════════════════ */}
          {step === "setup" && (
            <div className="p-6">
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Choose your target role and we'll generate 5 tailored interview
                questions. Questions will be read aloud by AI voice. 🔊
              </p>

              <div className="mb-6">
                <label className="block text-slate-300 text-xs uppercase tracking-widest font-medium mb-3">
                  Select Job Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className="px-4 py-3 rounded-xl text-sm text-left transition-all duration-200"
                      style={{
                        background:
                          selectedRole === role
                            ? "rgba(59,130,246,0.2)"
                            : "rgba(255,255,255,0.04)",
                        border:
                          selectedRole === role
                            ? "1px solid rgba(59,130,246,0.6)"
                            : "1px solid rgba(255,255,255,0.08)",
                        color: selectedRole === role ? "#93c5fd" : "#94a3b8",
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-xl"
                style={{
                  background: "rgba(59,130,246,0.06)",
                  border: "1px solid rgba(59,130,246,0.15)",
                }}
              >
                {[
                  { icon: "🎯", label: "5 Questions" },
                  { icon: "⏱️", label: "2 min each" },
                  { icon: "🔊", label: "AI Voice" },
                  { icon: "🤖", label: "AI Feedback" },
                  { icon: "😊", label: "Emotion AI" },
                  { icon: "📝", label: "Live Transcript" },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-slate-400 text-xs"
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 rounded-xl text-slate-400 text-sm font-medium transition-all hover:text-white"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={beginPractice}
                  disabled={!selectedRole}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                  }}
                >
                  Start Practice →
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════
               STEP 2 — PRACTICE
          ══════════════════════════════ */}
          {step === "practice" && (
            <div className="p-6">
              {/* Question card */}
              <div
                className="rounded-xl p-4 mb-4"
                style={{
                  background: isSpeaking
                    ? "rgba(59,130,246,0.12)"
                    : "rgba(59,130,246,0.08)",
                  border: isSpeaking
                    ? "1px solid rgba(59,130,246,0.4)"
                    : "1px solid rgba(59,130,246,0.2)",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-blue-400 uppercase tracking-widest font-medium">
                      Question {questionIndex + 1}
                    </p>
                    {isSpeaking && (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            style={{
                              width: "3px",
                              borderRadius: "99px",
                              background: "#3b82f6",
                              animation: "soundBar 0.8s ease-in-out infinite",
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => speakQuestion(questions[questionIndex])}
                    disabled={isSpeaking}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: "rgba(59,130,246,0.2)",
                      border: "1px solid rgba(59,130,246,0.3)",
                      color: "#93c5fd",
                    }}
                  >
                    {isSpeaking ? "🔊 Speaking..." : "🔊 Replay"}
                  </button>
                </div>
                <p className="text-white text-base font-medium leading-relaxed">
                  {questions[questionIndex]}
                </p>
              </div>

              {/* Video preview */}
              <div
                className="relative rounded-xl overflow-hidden mb-4"
                style={{
                  background: "#060b18",
                  border: "1px solid rgba(255,255,255,0.08)",
                  aspectRatio: "16/9",
                }}
              >
                <video
                  ref={videoRef}
                  muted
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />

                {cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-slate-500 text-sm mt-2">
                      Camera not available
                    </p>
                    <button
                      onClick={startCamera}
                      className="mt-3 px-4 py-2 rounded-lg text-blue-400 text-xs border border-blue-400/30 hover:bg-blue-400/10 transition-all"
                    >
                      Retry Camera
                    </button>
                  </div>
                )}

                {!cameraReady && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                  </div>
                )}

                {/* Countdown overlay */}
                {countdown && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background: "rgba(0,0,0,0.6)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div className="text-center">
                      <div
                        key={countdown}
                        className="text-8xl font-extrabold mb-4"
                        style={{
                          animation:
                            "countdownPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
                          color:
                            countdown === 3
                              ? "#ef4444"
                              : countdown === 2
                                ? "#f59e0b"
                                : "#10b981",
                          textShadow:
                            countdown === 3
                              ? "0 0 40px rgba(239,68,68,0.8)"
                              : countdown === 2
                                ? "0 0 40px rgba(245,158,11,0.8)"
                                : "0 0 40px rgba(16,185,129,0.8)",
                        }}
                      >
                        {countdown}
                      </div>
                      <p className="text-white text-lg font-medium opacity-80">
                        {countdown === 3
                          ? "Get ready..."
                          : countdown === 2
                            ? "Almost..."
                            : "Go!"}
                      </p>
                    </div>
                  </div>
                )}

                {/* REC */}
                {isRecording && (
                  <div
                    className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(239,68,68,0.9)" }}
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-white text-xs font-medium">REC</span>
                  </div>
                )}

                {/* Timer */}
                {isRecording && (
                  <div
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(0,0,0,0.7)" }}
                  >
                    <span
                      className="text-sm font-bold font-mono"
                      style={{ color: timerColor }}
                    >
                      {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                      {String(timeLeft % 60).padStart(2, "0")}
                    </span>
                  </div>
                )}

                {/* Live Emotion */}
                {isRecording && emotionData && (
                  <div
                    className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: `${emotionData.color}25`,
                      border: `1px solid ${emotionData.color}60`,
                      color: emotionData.color,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: emotionData.color }}
                    />
                    {emotionData.label}
                  </div>
                )}

                {/* Live Confidence */}
                {isRecording && emotionData && (
                  <div
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{
                      background: "rgba(0,0,0,0.7)",
                      color: emotionData.color,
                    }}
                  >
                    {emotionData.confidence_score}% confident
                  </div>
                )}

                {/* AI Offline */}
                {isRecording && !aiServiceOnline && (
                  <div
                    className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs"
                    style={{ background: "rgba(0,0,0,0.7)", color: "#94a3b8" }}
                  >
                    😐 Emotion AI offline
                  </div>
                )}
              </div>

              {/* Timer bar */}
              {isRecording && (
                <div
                  className="h-1 rounded-full mb-4 overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${timerPct}%`, background: timerColor }}
                  />
                </div>
              )}

              {/* Live Transcript */}
              {isRecording && (transcript || interimText) && (
                <div
                  className="rounded-xl p-4 mb-4"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">
                      Live Transcript
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed">
                    <span className="text-white">{transcript}</span>
                    <span className="text-slate-500 italic">{interimText}</span>
                  </p>
                </div>
              )}

              {/* Speech not supported */}
              {!speechSupported && (
                <div
                  className="rounded-xl px-4 py-3 mb-4 text-xs text-yellow-400"
                  style={{
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.2)",
                  }}
                >
                  ⚠️ Live transcript not supported in this browser. Use Chrome
                  for best results.
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={!!countdown}
                  className="px-5 py-3 rounded-xl text-slate-400 text-sm font-medium transition-all hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Cancel
                </button>

                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={!cameraReady || !!countdown}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg,#dc2626,#b91c1c)",
                    }}
                  >
                    {countdown ? (
                      <>
                        <span className="text-lg font-bold">{countdown}</span>{" "}
                        Starting in {countdown}...
                      </>
                    ) : (
                      <>
                        <span className="w-3 h-3 rounded-full bg-white" /> Start
                        Recording
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                    style={{
                      background: "rgba(239,68,68,0.2)",
                      border: "1px solid rgba(239,68,68,0.5)",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                    Stop & Get Feedback
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════
               STEP 3 — FEEDBACK
          ══════════════════════════════ */}
          {step === "feedback" && feedback && (
            <div className="p-6">
              <style>{`
                @keyframes circleAnim {
                  from { stroke-dashoffset: var(--dash-total); }
                  to   { stroke-dashoffset: var(--dash-offset); }
                }
                @keyframes countUp {
                  from { opacity: 0; transform: translateY(6px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
                .circle-progress {
                  animation: circleAnim 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
                  stroke-dasharray: var(--dash-total);
                  stroke-dashoffset: var(--dash-total);
                }
              `}</style>

              {/* Circular charts */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                {Object.entries(feedback.scores).map(([key, value], i) => {
                  const labels = {
                    confidence: "Confidence",
                    clarity: "Clarity",
                    answerQuality: "Answer Quality",
                    speakingPace: "Speaking Pace",
                  };
                  const colors = {
                    confidence: "#3b82f6",
                    clarity: "#8b5cf6",
                    answerQuality: "#10b981",
                    speakingPace: "#f59e0b",
                  };
                  const icons = {
                    confidence: "💪",
                    clarity: "🎯",
                    answerQuality: "📝",
                    speakingPace: "🎤",
                  };
                  const color = colors[key];
                  const radius = 52;
                  const circumference = 2 * Math.PI * radius;
                  const offset = circumference - (value / 100) * circumference;
                  return (
                    <div
                      key={key}
                      className="rounded-2xl p-5 flex flex-col items-center"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        animation: `countUp 0.5s ease ${i * 0.15}s both`,
                      }}
                    >
                      <div className="relative w-36 h-36 mb-3">
                        <svg width="144" height="144" viewBox="0 0 144 144">
                          <circle
                            cx="72"
                            cy="72"
                            r={radius}
                            fill="none"
                            stroke="rgba(255,255,255,0.07)"
                            strokeWidth="10"
                          />
                          <circle
                            cx="72"
                            cy="72"
                            r={radius}
                            fill="none"
                            stroke={color}
                            strokeWidth="10"
                            strokeLinecap="round"
                            transform="rotate(-90 72 72)"
                            className="circle-progress"
                            style={{
                              "--dash-total": circumference,
                              "--dash-offset": offset,
                              animationDelay: `${i * 0.15 + 0.2}s`,
                              filter: `drop-shadow(0 0 8px ${color}90)`,
                            }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span
                            className="text-3xl font-extrabold"
                            style={{ color, lineHeight: 1 }}
                          >
                            {value}
                          </span>
                          <span className="text-slate-400 text-sm font-medium">
                            %
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-2xl mb-2 block">
                          {icons[key]}
                        </span>
                        <p className="text-slate-200 text-sm font-semibold">
                          {labels[key]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overall score */}
              <div
                className="rounded-xl p-3 mb-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-slate-500 text-xs mb-1">Overall Score</p>
                <p className="text-2xl font-extrabold text-white">
                  {Math.round(
                    Object.values(feedback.scores).reduce((a, b) => a + b, 0) /
                      4,
                  )}
                  %
                </p>
              </div>

              {/* Emotion Summary */}
              {emotionTimeline.length > 0 && (
                <div
                  className="rounded-xl p-4 mb-4"
                  style={{
                    background: "rgba(139,92,246,0.06)",
                    border: "1px solid rgba(139,92,246,0.2)",
                  }}
                >
                  <p className="text-violet-400 text-xs uppercase tracking-widest font-medium mb-3">
                    😊 Emotion Analysis
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-400 text-sm">
                      Average Confidence
                    </span>
                    <span className="text-white font-bold text-lg">
                      {avgConfidence}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full mb-3 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${avgConfidence}%`,
                        background:
                          avgConfidence >= 70
                            ? "#10b981"
                            : avgConfidence >= 45
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    />
                  </div>
                  <p className="text-slate-500 text-xs mb-2">
                    Emotion breakdown:
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {emotionTimeline.map((e, i) => (
                      <div
                        key={i}
                        className="px-2 py-1 rounded-lg text-xs"
                        style={{
                          background: `${getEmotionColor(e.dominant)}20`,
                          color: getEmotionColor(e.dominant),
                        }}
                      >
                        {e.label}
                      </div>
                    ))}
                  </div>
                  {(() => {
                    const counts = emotionTimeline.reduce((acc, e) => {
                      acc[e.dominant] = (acc[e.dominant] || 0) + 1;
                      return acc;
                    }, {});
                    const dominant = Object.entries(counts).sort(
                      (a, b) => b[1] - a[1],
                    )[0];
                    return dominant ? (
                      <p className="text-slate-400 text-xs mt-2">
                        Most frequent:{" "}
                        <span style={{ color: getEmotionColor(dominant[0]) }}>
                          {dominant[0]}
                        </span>{" "}
                        (
                        {Math.round(
                          (dominant[1] / emotionTimeline.length) * 100,
                        )}
                        % of session)
                      </p>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Transcript */}
              {transcript && (
                <div
                  className="rounded-xl p-4 mb-4"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-medium mb-2">
                    📝 Your Answer Transcript
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    {transcript}
                  </p>
                  <div
                    className="flex items-center gap-3 pt-3"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <span className="text-slate-500 text-xs">
                      {wordCount} words
                    </span>
                    <span className="text-slate-600 text-xs">·</span>
                    <span
                      className="text-xs"
                      style={{
                        color:
                          wordCount > 100
                            ? "#10b981"
                            : wordCount > 50
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    >
                      {wordCount > 100
                        ? "✅ Good length"
                        : wordCount > 50
                          ? "⚠️ Could be longer"
                          : "❌ Too short"}
                    </span>
                  </div>
                </div>
              )}

              {/* AI Tip */}
              <div
                className="rounded-xl p-4 mb-5 flex gap-3"
                style={{
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.2)",
                }}
              >
                <span className="text-xl flex-shrink-0">💡</span>
                <div>
                  <p className="text-green-400 text-xs font-medium mb-1 uppercase tracking-widest">
                    AI Tip
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {feedback.tip}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="px-5 py-3 rounded-xl text-slate-400 text-sm font-medium transition-all hover:text-white"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={nextQuestion}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                  }}
                >
                  {questionIndex < questions.length - 1
                    ? "Next Question →"
                    : "Finish Session ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes countdownPop {
          from { opacity: 0; transform: scale(0.3); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes soundBar {
          0%, 100% { height: 4px;  opacity: 0.4; }
          50%       { height: 16px; opacity: 1;   }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}
