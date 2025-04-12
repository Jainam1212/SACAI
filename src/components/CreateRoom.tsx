import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CreateRoom = () => {
  const [roomLink, setRoomLink] = useState("");
  const [copied, setCopied] = useState(false);

  const createRoom = () => {
    const roomId = uuidv4();
    const link = `${window.location.origin}/room/${roomId}`;
    setRoomLink(link);
    setCopied(false); // Reset copied state when a new link is created
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div>
      <button onClick={createRoom}>Create Room</button>

      {roomLink && (
        <div>
          <p>Share this link:</p>
          <a href={roomLink}>{roomLink}</a>
          <button onClick={copyToClipboard}>
            {copied ? "Copied!" : "(Click to Copy)"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;
