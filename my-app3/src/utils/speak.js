// src/utils/speak.js
const ELEVENLABS_API_KEY =
  "sk_3e9b3d9694735bf0ead26fcbced61d8ff103b14771d48002";

// Best model for most human-like voice
const MODEL_ID = "eleven_turbo_v2_5"; // newest, most natural

// Best voices for interview coach
// Try changing this to see different voices
const VOICE_ID = "onwK4e9ZLuTAKqWW03F9"; // Daniel — British male, very natural
// const VOICE_ID = "N2lVS1w4EtoT3dr4eOWO"; // Callum — British male
// const VOICE_ID = "XB0fDUnXU5powFXDhCwa"; // Charlotte — British female
// const VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2"; // Alice — British female
// const VOICE_ID = "bIHbv24MWmeRgasZH58o"; // Will — friendly male
// const VOICE_ID = "nPczCjzI2devNBz1zQrb"; // Brian — deep American male
// const VOICE_ID = "pqHfZKP75CvOlQylNhV4"; // Bill — strong male narrator

let currentAudio = null;
const speakQuestion = async (text) => {
  setIsSpeaking(true);
  await speakWithElevenLabs(text);
  setIsSpeaking(false);
};

export const speakWithElevenLabs = async (text) => {
  try {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
      currentAudio = null;
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: 0.35, // lower = more natural variation
            similarity_boost: 0.9, // higher = truer to voice
            style: 0.45, // adds expressiveness
            use_speaker_boost: true,
          },
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("ElevenLabs error:", response.status, err);
      fallbackSpeak(text);
      return;
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    currentAudio = new Audio(audioUrl);
    currentAudio.playbackRate = 0.95; // slightly slower = more natural
    await currentAudio.play();

    // Cleanup URL after playing
    currentAudio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
  } catch (err) {
    console.error("Speech error:", err);
    fallbackSpeak(text);
  }
};

export const stopSpeaking = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
  window.speechSynthesis.cancel();
};

const fallbackSpeak = (text) => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  utterance.pitch = 1;
  utterance.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Google") ||
        v.name.includes("Daniel") ||
        v.name.includes("Natural")),
  );
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
};
