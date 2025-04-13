import { useState } from "react";
import Aurora from "../blocks/Backgrounds/Aurora/Aurora";
import BlurText from "../blocks/TextAnimations/BlurText/BlurText";
import morty from "/morty.png";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Navbar from "./StudentNavbar";

const genAI = new GoogleGenerativeAI("AIzaSyDRc_QLSmYHkk_L_umdR76_IZTHrUnFd-o");
const modelGemini = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const StudentMeeting = () => {
  const [meetingCode, setMeetingCode] = useState("");
  const [chatboxOpen, setChatboxOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: string }[]
  >([]);

  const handleJoinMeeting = () => {
    if (!meetingCode.trim()) return;
    const url = `https://${meetingCode}`;
    window.open(url, "_blank");
  };

  const handleAccept = () => {
    console.log("Meeting Accepted!");
  };

  const handleDecline = () => {
    console.log("Meeting Declined!");
  };

  const handleAsk = async () => {
    if (!chatInput.trim()) return;
    setLoading(true);

    const prompt = `You are a friendly and insightful professor who guides students technical support and interview skills.

A student has asked: "${chatInput}"

Instructions:
- Only answer if the question is related to technical topics, communication, or skill-building for interviews.
- If unrelated (e.g., random topics like "what is a dinosaur?"), reply with:
  "Please ask question related to GD or skill improvement guidance."
- Your reply must be well-structured, between 100 and 300 words, like an ideal mentoring response.
- Output plain text only. No special formatting, emojis, or bullet points.`;

    try {
      const result = await modelGemini.generateContent(prompt);
      const rawText = result.response.text().trim();
      const cleanedText = rawText.replace(/\*\*/g, "").replace(/\n/g, "\n");

      setChatHistory((prev) => [
        ...prev,
        {
          question: chatInput,
          answer:
            cleanedText ||
            "Hmm, I couldn't find a good answer. Try rephrasing!",
        },
      ]);
      setChatInput("");
    } catch (error) {
      console.error("AI error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          question: chatInput,
          answer: "Sorry, there was an error generating a response.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-4 bg-gray-950 text-white font-sans overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Navbar />
        <Aurora />
      </div>

      {/* Header */}
      <header className="relative z-10 py-12 mt-4 text-center">
        <BlurText
          text="Join Your Class Meeting"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-5xl mb-8 justify-center"
        />
      </header>

      <section className="relative z-10 flex flex-col items-center justify-center mt-4 px-6">
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 w-full max-w-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl text-center text-white font-semibold mb-6">
            Enter Meeting Code
          </h2>

          <input
            type="text"
            value={meetingCode}
            onChange={(e) => setMeetingCode(e.target.value)}
            placeholder="e.g., class-meet-2025"
            className="w-full px-5 py-3 rounded-lg bg-gray-800 text-white text-lg outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          />
          <button
            onClick={handleJoinMeeting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transform transition duration-300 ease-in-out hover:scale-105"
          >
            Join Meeting
          </button>
        </div>
      </section>

      {/* Upcoming Meeting Section */}
      <section className="relative z-10 flex flex-col items-center mb-24 justify-center mt-20 px-6">
        <div className="flex flex-col gap-5 bg-white/20 backdrop-blur-xl rounded-3xl p-8 w-auto max-w-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl text-center text-white font-semibold mb-4">
            Upcoming Meeting
          </h2>
          Math Class - Algebra Session
          <div className="flex justify-center gap-6">
            <button
              onClick={handleAccept}
              className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transform transition duration-300 ease-in-out hover:scale-105"
            >
              Accept
            </button>

            <button
              onClick={handleDecline}
              className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transform transition duration-300 ease-in-out hover:scale-105"
            >
              Decline
            </button>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <div className="fixed bottom-4 right-4 z-50">
        <p className="text-white">Chat with MortyAI</p>
        <img
          src={morty}
          alt="mortyAI"
          className="rounded-3xl size-12 cursor-pointer m-auto bg-white"
          onClick={() => setChatboxOpen(true)}
        />
      </div>

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

export default StudentMeeting;
