const { GEMINI_API_KEY, GEMINI_MODEL } = require("../config/env");
const Profile = require("../models/Profile");
const Service = require("../models/Service");
const Skill = require("../models/Skill");

// Builds a system prompt from live portfolio data so the assistant always
// answers with up-to-date info about Qamar's skills/services/availability.
const buildSystemPrompt = async () => {
  const [profile, services, skills] = await Promise.all([
    Profile.findOne(),
    Service.find({ active: true }).limit(10),
    Skill.find().limit(20),
  ]);

  const serviceList = services.map((s) => `- ${s.title}${s.startingPrice ? ` (from ${s.startingPrice})` : ""}`).join("\n");
  const skillList = skills.map((s) => s.name).join(", ");

  return `You are the AI assistant on ${profile?.fullName || "Qamar Abbas"}'s portfolio website.
${profile?.fullName || "Qamar Abbas"} is a ${profile?.title || "MERN Stack Developer"}.
Bio: ${profile?.bio || "Builds fast, scalable full-stack web applications."}

Services offered:
${serviceList || "- General MERN stack development"}

Technical skills: ${skillList || "React, Node.js, Express, MongoDB"}

Your job: answer visitor questions about ${profile?.fullName || "Qamar Abbas"}'s skills, services, past
projects, pricing ranges, and general web-development questions, in a friendly, concise, helpful tone.
If a visitor wants to discuss a specific project, get a custom quote, or talk to ${profile?.fullName || "Qamar Abbas"}
directly, tell them they can click "Talk to ${(profile?.fullName || "Qamar").split(" ")[0]} directly" to open
the live chat. Keep answers short (2-4 sentences) unless more detail is clearly needed. Do not make up
project details, prices, or availability you don't know — speak in general terms instead.`;
};

const askAssistant = async (history, message) => {
  if (!GEMINI_API_KEY) {
    throw new Error("AI assistant is not configured (missing GEMINI_API_KEY)");
  }

  const systemInstruction = await buildSystemPrompt();

  // Gemini's chat format: alternating { role: "user"|"model", parts: [{ text }] }
  const contents = [
    ...history.map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.text }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents,
      generationConfig: { maxOutputTokens: 500 },
    }),
  });

  if (!response.ok) {
    let providerMessage = "";
    try {
      const errBody = await response.json();
      providerMessage = errBody?.error?.message || "";
    } catch (e) {
      providerMessage = await response.text();
    }

    if (response.status === 400 && /api key not valid/i.test(providerMessage)) {
      throw new Error(
        "AI assistant is misconfigured — the GEMINI_API_KEY in the backend .env is missing or invalid. Get a key from aistudio.google.com/apikey and restart the server."
      );
    }
    if (response.status === 403) {
      throw new Error(
        "AI assistant is misconfigured — this Gemini API key doesn't have access. Check aistudio.google.com/apikey."
      );
    }
    if (response.status === 429) {
      throw new Error("AI assistant has hit the free-tier rate limit — please try again in a minute.");
    }

    console.error("Gemini API error:", response.status, providerMessage);
    throw new Error("The AI assistant is temporarily unavailable. Please try again in a moment.");
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
  return text || "Sorry, I couldn't generate a response right now.";
};

module.exports = { askAssistant };
