import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const [topic, setTopic] = useState("");
  const [minutes, setMinutes] = useState("");
  const navigate = useNavigate();

  const handleStartMeeting = () => {
    if (!topic) return alert("Enter a topic");
    const roomName = topic.toLowerCase().replace(/\s+/g, "-");
    navigate(`/room/${roomName}?timer=${minutes}`);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
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
    </div>
  );
};
