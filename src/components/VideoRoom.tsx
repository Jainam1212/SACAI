import { useEffect, useRef, useState } from "react";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";

interface Props {
  roomId: string;
}

const APP_ID = "a7a0a22625804c57a63d4e1ccd739da2";
const TOKEN = null;
const VideoRoom: React.FC<Props> = ({ roomId }) => {
  const [joined, setJoined] = useState(false);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const localTracksRef = useRef<any[]>([]);

  useEffect(() => {
    const joinRoom = async () => {
      console.log("🔄 Creating Agora client...");
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      try {
        console.log("🚪 Joining channel...");
        const uid = await client.join(APP_ID, roomId, TOKEN || null, null);
        console.log("✅ Joined channel with UID:", uid);

        const [audioTrack, videoTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks();
        console.log("🎙️ Audio and video tracks created");

        localTracksRef.current = [audioTrack, videoTrack];

        if (localVideoRef.current) {
          const localContainer = document.createElement("div");
          localContainer.id = `local-${uid}`;
          localContainer.style.width = "400px";
          localContainer.style.height = "300px";
          localVideoRef.current.appendChild(localContainer);
          console.log("📦 Appending video container");

          videoTrack.play(localContainer);
        }

        await client.publish([audioTrack, videoTrack]);
        console.log("📡 Published tracks");
        setJoined(true);
      } catch (err) {
        console.error("❌ Failed to join room:", err);
      }
    };

    joinRoom();

    return () => {
      const cleanup = async () => {
        localTracksRef.current.forEach((track) => track.close());
        await clientRef.current?.leave();
      };
      cleanup();
    };
  }, [roomId]);

  return (
    <div>
      <h3>{joined ? "You have joined the call" : "Joining..."}</h3>
      <div ref={localVideoRef} />
    </div>
  );
};

export default VideoRoom;
