import { useState } from "react";
import { useNavigate } from "react-router-dom";
import morty from "/morty.png";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyDRc_QLSmYHkk_L_umdR76_IZTHrUnFd-o");
const modelGemini = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const HomePage = () => {
  const [topic, setTopic] = useState("");
  const [minutes, setMinutes] = useState("");
  const [chatboxOpen, setChatboxOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: string }[]
  >([]);
  const navigate = useNavigate();

  const handleStartMeeting = () => {
    if (!topic) return alert("Enter a topic");
    const roomName = topic.toLowerCase().replace(/\s+/g, "-");
    navigate(`/room/${roomName}?timer=${minutes}`);
  };

  const handleAsk = async () => {
  if (!chatInput.trim()) return;
  setLoading(true);

  const prompt = `You are a friendly and insightful professor who guides students on group discussions and interview skills.

A student has asked: "${chatInput}"

Instructions:
- Only answer if the question is related to group discussion (GD) topics, communication, or skill-building for interviews.
- If unrelated (e.g., random topics like "what is a dinosaur?"), reply with:
  "Please ask question related to GD or skill improvement guidance."
- Your reply must be well-structured, between 100 and 300 words, like an ideal mentoring response.
- Output plain text only. No special formatting, emojis, or bullet points.`;

  try {
    const result = await modelGemini.generateContent(prompt);
    const rawText = result.response.text().trim();

    const cleanedText = rawText.replace(/\*\*/g, "").replace(/(?:\r\n|\r|\n)/g, "\n");

    setChatHistory((prev) => [
      ...prev,
      {
        question: chatInput,
        answer: cleanedText || "Hmm, I couldn't find a good answer. Try rephrasing!",
      },
    ]);
    setChatInput("");
  } catch (error) {
    console.error("AI error:", error);
    setChatHistory((prev) => [
      ...prev,
      { question: chatInput, answer: "Sorry, there was an error generating a response." },
    ]);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative h-[88vh] flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Start a Jitsi Meeting</h1>
      <input
        placeholder="Enter Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Enter Timer (mins)"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        className="p-2 border rounded"
      />
      <button
        onClick={handleStartMeeting}
        className="bg-blue-600 text-white p-2 rounded"
      >
        Start Meeting
      </button>

      {/* Morty Button */}
      <div className="absolute bottom-4 right-4">
        <img
          src={morty}
          alt="mortyAI"
          className="rounded-3xl size-12 cursor-pointer"
          onClick={() => setChatboxOpen(true)}
        />
      </div>

      {/* Chatbox */}
      {chatboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-4 rounded-lg shadow-lg flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Morty AI</h2>
              <button
                onClick={() => setChatboxOpen(false)}
                className="text-gray-500 hover:text-red-500 text-lg"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto">
              {chatHistory.map((chat, idx) => (
                <div key={idx}>
                  <p className="text-blue-600 font-semibold">
                    You: {chat.question}
                  </p>
                  <p className="text-green-700">Morty: {chat.answer}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                placeholder="Ask something..."
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={handleAsk}
                disabled={loading}
                className={`px-3 rounded text-white ${
                  loading ? "bg-gray-400" : "bg-green-600"
                }`}
              >
                {loading ? "Thinking..." : "Ask"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
