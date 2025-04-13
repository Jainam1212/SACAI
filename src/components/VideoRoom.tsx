// import { useEffect, useState, useRef } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import { JitsiMeeting } from "@jitsi/react-sdk";

// export const VideoRoom = () => {
//   const { roomName } = useParams<{ roomName: string }>();
//   const [searchParams] = useSearchParams();
//   const [countdown, setCountdown] = useState<string | null>(null);
//   const timerMinutes = parseInt(searchParams.get("timer") || "0");
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     if (timerMinutes > 0) {
//       const end = Date.now() + timerMinutes * 60 * 1000;
//       intervalRef.current = setInterval(() => {
//         const diff = end - Date.now();
//         if (diff <= 0) {
//           setCountdown("Time's up!");
//           if (intervalRef.current) clearInterval(intervalRef.current);
//         } else {
//           const mins = Math.floor(diff / 60000);
//           const secs = Math.floor((diff % 60000) / 1000);
//           setCountdown(`${mins}m ${secs}s`);
//         }
//       }, 1000);
//     }

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [timerMinutes]);

//   return (
//     <div className="p-4 flex flex-col gap-4 closingJisti">
//       <h2 className="text-xl font-bold">
//         Topic: {roomName?.replace(/-/g, " ")}
//       </h2>
//       {timerMinutes > 0 && (
//         <p className="text-lg text-red-600 font-semibold">Timer: {countdown}</p>
//       )}
//       <div className="w-full">
//         <JitsiMeeting
//           domain="meet.jit.si"
//           roomName={roomName || "default-room"}
//           configOverwrite={{
//             startWithAudioMuted: false,
//             startWithVideoMuted: false,
//             disableDeepLinking: true,
//             disableThirdPartyRequests: true,
//             prejoinPageEnabled: false,
//             enableWelcomePage: false,
//             disableModeratorIndicator: true,
//             enableInsecureRoomNameWarning: true,
//             enableNoisyMicDetection: true,
//             enableClosePage: true,
//           }}
//           getIFrameRef={(iframeRef) => {
//             iframeRef.style.height = "600px";
//             iframeRef.style.width = "100%";
//           }}
//         />
//       </div>
//     </div>
//   );
// };


import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { JitsiMeeting } from "@jitsi/react-sdk";

export const VideoRoom = () => {
  const { roomName } = useParams<{ roomName: string }>();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState<string | null>(null);
  const timerMinutes = parseInt(searchParams.get("timer") || "0");
  const participants = searchParams.get("participants")?.split(",") || [];
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerMinutes > 0) {
      const end = Date.now() + timerMinutes * 60 * 1000;
      intervalRef.current = setInterval(() => {
        const diff = end - Date.now();
        if (diff <= 0) {
          setCountdown("Time's up!");
          if (intervalRef.current) clearInterval(intervalRef.current);
        } else {
          const mins = Math.floor(diff / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          setCountdown(`${mins}m ${secs}s`);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerMinutes, roomName, searchParams]);

  const handleSendLink = () => {
    
    //further code
  };

  return (
    <div className="p-4 flex flex-col gap-4 closingJisti">
      <h2 className="text-xl font-bold">
        Topic: {roomName?.replace(/-/g, " ")}
      </h2>
      {timerMinutes > 0 && (
        <p className="text-lg text-red-600 font-semibold">Timer: {countdown}</p>
      )}
      <div className="flex flex-col gap-2">
        <p className="text-lg font-semibold">
          Participants:{" "}
          {participants.length > 0 ? participants.join(", ") : "None"}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded bg-gray-100 text-gray-800"
            placeholder="Meeting link"
          />
          <button
            onClick={handleSendLink}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
      <div className="w-full">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={roomName || "default-room"}
          configOverwrite={{
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            disableDeepLinking: true,
            disableThirdPartyRequests: true,
            prejoinPageEnabled: false,
            enableWelcomePage: false,
            disableModeratorIndicator: true,
            enableInsecureRoomNameWarning: true,
            enableNoisyMicDetection: true,
            enableClosePage: true,
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "600px";
            iframeRef.style.width = "100%";
          }}
        />
      </div>
    </div>
  );
};