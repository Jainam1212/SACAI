// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import morty from "/morty.png";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { SlCursor } from "react-icons/sl";
// import { FaRocket, FaSlidersH } from "react-icons/fa";
// import { MdHighQuality } from "react-icons/md";
// import vidimg from "/vidcall.webp";
// import vidGal from "/videoGallery.jpg"

// import BlurText from "../blocks/TextAnimations/BlurText/BlurText";
// import SpotlightCard from "../blocks/Components/SpotlightCard/SpotlightCard";
// import { trpc } from "../utils/trpc";

// const genAI = new GoogleGenerativeAI("AIzaSyDRc_QLSmYHkk_L_umdR76_IZTHrUnFd-o");
// const modelGemini = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// export const HomePage = () => {
//     const engagementFeatures = [
//       {
//         title: "Get to market faster",
//         description:
//           "Increase development speed and get your video chat experience to market faster with tools like our no-code App Builder and library of extensions like recording, noise suppression, and more.",
//         icon: <FaRocket className="text-2xl text-white" />,
//       },
//       {
//         title: "Customize for your use case",
//         description:
//           "Agora’s flexible, cross-platform live video SDK gives you full control over the user experience so you can build video calling for any use case from telehealth to live shopping.",
//         icon: <FaSlidersH className="text-2xl text-white" />,
//       },
//       {
//         title: "Ensure reliability and quality",
//         description:
//           "Deliver a seamless and uninterrupted video call experience for your users on the world’s only network built to power real-time video with ultra-low latency and intelligent routing.",
//         icon: <MdHighQuality className="text-2xl text-white" />,
//       },
//     ];
//     const features = [
//       {
//         title: "Reliable video communication",
//         description:
//           "Our's video chat API ensures consistent video quality, free of stutter, jitter, and lag, even under challenging network conditions.",
//       },
//       {
//         title: "Screen sharing and collaboration",
//         description:
//           "Video conferencing solutions support screen sharing, interactive whiteboards, and other advanced collaboration features.",
//       },
//       {
//         title: "Easy-to-add extensions",
//         description:
//           "Quick integration of powerful video conferencing features from AI Noise Suppression to Real-Time Speech to Text.",
//       },
//       {
//         title: "Call recording",
//         description:
//           "Enable video meeting recording in the cloud or on-premises with control over the format, storage, and quality.",
//       },
//       {
//         title: "Multi-track video",
//         description:
//           "Support for multiple audio and video tracks making it easy to publish multiple camera or microphone streams in one instance.",
//       },
//       {
//         title: "Global scalability",
//         description:
//           "Power noise suppression at global scale on the network that powers billions of minutes of real-time video annually to users in over 200 countries and regions.",
//       },
//     ];
//     const [topic, setTopic] = useState<string>("");
//     const [minutes, setMinutes] = useState<string>("");
//     const [chatboxOpen, setChatboxOpen] = useState<boolean>(false);
//     const [chatInput, setChatInput] = useState<string>("");
//     const [loading, setLoading] = useState<boolean>(false);
//     const [chatHistory, setChatHistory] = useState<
//         { question: string; answer: string }[]
//     >([]);
//     const navigate = useNavigate();
//     const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
//       []
//     );
//     const { data: inviteData, isLoading: isInvitesLoading } = trpc.inviteData.useQuery();
//     const handleStartMeeting = () => {
//         if (!topic) return alert("Enter a topic");
//         const roomName = topic.toLowerCase().replace(/\s+/g, "-");
//         navigate(`/room/${roomName}?timer=${minutes}`);
//     };

//     const handleAsk = async () => {
//         if (!chatInput.trim()) return;
//         setLoading(true);

//         const prompt =
//             `You are a friendly and insightful professor who guides students on group discussions and interview skills.

// A student has asked: "${chatInput}"

// Instructions:
// - Only answer if the question is related to group discussion (GD) topics, communication, or skill-building for interviews.
// - If unrelated (e.g., random topics like "what is a dinosaur?"), reply with:
//   "Please ask question related to GD or skill improvement guidance."
// - Your reply must be well-structured, between 100 and 300 words, like an ideal mentoring response.
// - Output plain text only. No special formatting, emojis, or bullet points.`;

//         try {
//             const result = await modelGemini.generateContent(prompt);
//             const rawText = result.response.text().trim();

//             const cleanedText = rawText
//                 .replace(/\*\*/g, "")
//                 .replace(/(?:\r\n|\r|\n)/g, "\n");

//             setChatHistory((prev) => [
//                 ...prev,
//                 {
//                     question: chatInput,
//                     answer: cleanedText ||
//                         "Hmm, I couldn't find a good answer. Try rephrasing!",
//                 },
//             ]);
//             setChatInput("");
//         } catch (error) {
//             console.error("AI error:", error);
//             setChatHistory((prev) => [
//                 ...prev,
//                 {
//                     question: chatInput,
//                     answer: "Sorry, there was an error generating a response.",
//                 },
//             ]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//       <div className="flex flex-col">
//         <div className="relative h-fit flex bg-[url(/bgimg.webp)] bg-[50%_100%]">
//           <div className="flex flex-col justify-center gap-4 p-12 w-[70%]">
//             <BlurText
//               text="Start a Jitsi Meeting"
//               delay={150}
//               animateBy="words"
//               direction="bottom"
//               className="text-3xl mb-8 font-bold text-white"
//             />
//             <input
//               placeholder="Enter Topic"
//               value={topic}
//               onChange={(e) => setTopic(e.target.value)}
//               className="p-2 border rounded w-full bg-transparent placeholder:text-white text-white"
//             />
//             <input
//               type="number"
//               placeholder="Enter Timer (mins)"
//               value={minutes}
//               onChange={(e) => setMinutes(e.target.value)}
//               className="p-2 border rounded w-full bg-transparent placeholder:text-white text-white"
//             />
//             <button
//               onClick={handleStartMeeting}
//               className="relative bg-blue-950 text-white p-3 rounded-3xl w-1/2 group"
//             >
//               Start Meeting
//               <SlCursor
//                 className="absolute right-5 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500"
//                 size={20}
//               />
//             </button>
//           </div>
//           <div className="relative w-full h-[50vh] overflow-hidden group">
//             <img
//               src={vidimg}
//               alt="Video Call"
//               className="absolute top-0 right-0 transform translate-x-0 w-[60%] h-full object-cover"
//             />
//           </div>

//           <div className="fixed bottom-4 right-4">
//             <p className="text-white">Chat with MortyAI</p>
//             <img
//               src={morty}
//               alt="mortyAI"
//               className="rounded-3xl size-12 cursor-pointer m-auto"
//               onClick={() => setChatboxOpen(true)}
//             />
//           </div>
//           {chatboxOpen && (
//             <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
//               <div className="bg-white w-[90%] max-w-md p-4 rounded-lg shadow-lg flex flex-col gap-4">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-xl font-semibold">Morty AI</h2>
//                   <button
//                     onClick={() => setChatboxOpen(false)}
//                     className="text-gray-500 hover:text-red-500 text-lg"
//                   >
//                     ✕
//                   </button>
//                 </div>
//                 <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto">
//                   {chatHistory.map((chat, idx) => (
//                     <div key={idx}>
//                       <p className="text-blue-600 font-semibold">
//                         You: {chat.question}
//                       </p>
//                       <p className="text-green-700">Morty: {chat.answer}</p>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={chatInput}
//                     onChange={(e) => setChatInput(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleAsk()}
//                     placeholder="Ask something..."
//                     className="flex-1 p-2 border rounded"
//                   />
//                   <button
//                     onClick={handleAsk}
//                     disabled={loading}
//                     className={`px-3 rounded text-white ${
//                       loading ? "bg-gray-400" : "bg-green-600"
//                     }`}
//                   >
//                     {loading ? "Thinking..." : "Ask"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//         <div className="h-fit bg-black w-full flex flex-col items-center">
//           <BlurText
//             text="Send Invites"
//             delay={150}
//             animateBy="words"
//             direction="bottom"
//             className="text-5xl mb-8 font-bold text-white text-center m-8"
//           />
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {isInvitesLoading ? (
//               <p className="text-white text-xl">Loading participants...</p>
//             ) : (
//               inviteData?.participantList?.map((user, idx) => (
//                 <div
//                   key={idx}
//                   className={`cursor-pointer p-4 rounded-xl border text-white transition-all duration-300 ${
//                     selectedParticipants.includes(user.email)
//                       ? "bg-green-600 border-green-400"
//                       : "bg-white/10 border-white/20"
//                   }`}
//                   onClick={() => handleSelect(user.email)}
//                 >
//                   <p>{user.username}</p>
//                   <p className="text-sm text-gray-300">{user.email}</p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div className="h-fit bg-black w-full flex flex-col items-center">
//           <BlurText
//             text="Send Invites"
//             delay={150}
//             animateBy="words"
//             direction="bottom"
//             className="text-5xl mb-8 font-bold text-white text-center m-8"
//           />
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             //inviting code here
//           </div>
//         </div>
//         <div className="h-fit bg-black w-full flex flex-col items-center">
//           <BlurText
//             text="Video Calling features"
//             delay={150}
//             animateBy="words"
//             direction="bottom"
//             className="text-5xl mb-8 font-bold text-white text-center m-8"
//           />
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {features.map((feature, idx) => (
//               <SpotlightCard
//                 key={idx}
//                 className="custom-spotlight-card text-white w-[300px] h-full p-6"
//                 spotlightColor="rgba(0, 229, 255, 0.2)"
//               >
//                 <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
//                 <p className="text-sm text-gray-300">{feature.description}</p>
//               </SpotlightCard>
//             ))}
//           </div>
//         </div>
//         <div className="w-full bg-black text-white py-16 px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
//           <div className="md:w-1/2">
//             <img
//               src={vidGal}
//               alt="Video Call"
//               className="rounded-xl shadow-lg w-full"
//             />
//           </div>
//           <div className="md:w-1/2 flex flex-col gap-6">
//             <h2 className="text-4xl md:text-5xl font-bold leading-tight">
//               Boost in-app engagement with real-time video
//             </h2>
//             <p className="text-gray-300 text-lg">
//               Adding real-time video to your app keeps users engaged longer in
//               any app—on any platform or device.
//             </p>

//             <div className="flex flex-col gap-6 mt-6">
//               {engagementFeatures.map((feature, idx) => (
//                 <div key={idx} className="flex items-start gap-4">
//                   <div className="bg-gray-800 rounded-full p-3">
//                     {feature.icon}
//                   </div>
//                   <div>
//                     <h4 className="text-lg font-semibold">{feature.title}</h4>
//                     <p className="text-gray-400 text-sm mt-1">
//                       {feature.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
// };


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import morty from "/morty.png";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SlCursor } from "react-icons/sl";
import { FaRocket, FaSlidersH } from "react-icons/fa";
import { MdHighQuality } from "react-icons/md";
import vidimg from "/vidcall.webp";
import vidGal from "/videoGallery.jpg";
import BlurText from "../blocks/TextAnimations/BlurText/BlurText";
import SpotlightCard from "../blocks/Components/SpotlightCard/SpotlightCard";
import { trpc } from "../utils/trpc";

const genAI = new GoogleGenerativeAI("AIzaSyDRc_QLSmYHkk_L_umdR76_IZTHrUnFd-o");
const modelGemini = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const HomePage = () => {
  const engagementFeatures = [
    {
      title: "Get to market faster",
      description:
        "Increase development speed and get your video chat experience to market faster with tools like our no-code App Builder and library of extensions like recording, noise suppression, and more.",
      icon: <FaRocket className="text-2xl text-white" />,
    },
    {
      title: "Customize for your use case",
      description:
        "Agora’s flexible, cross-platform live video SDK gives you full control over the user experience so you can build video calling for any use case from telehealth to live shopping.",
      icon: <FaSlidersH className="text-2xl text-white" />,
    },
    {
      title: "Ensure reliability and quality",
      description:
        "Deliver a seamless and uninterrupted video call experience for your users on the world’s only network built to power real-time video with ultra-low latency and intelligent routing.",
      icon: <MdHighQuality className="text-2xl text-white" />,
    },
  ];

  const features = [
    {
      title: "Reliable video communication",
      description:
        "Our video chat API ensures consistent video quality, free of stutter, jitter, and lag, even under challenging network conditions.",
    },
    {
      title: "Screen sharing and collaboration",
      description:
        "Video conferencing solutions support screen sharing, interactive whiteboards, and other advanced collaboration features.",
    },
    {
      title: "Easy-to-add extensions",
      description:
        "Quick integration of powerful video conferencing features from AI Noise Suppression to Real-Time Speech to Text.",
    },
    {
      title: "Call recording",
      description:
        "Enable video meeting recording in the cloud or on-premises with control over the format, storage, and quality.",
    },
    {
      title: "Multi-track video",
      description:
        "Support for multiple audio and video tracks making it easy to publish multiple camera or microphone streams in one instance.",
    },
    {
      title: "Global scalability",
      description:
        "Power noise suppression at global scale on the network that powers billions of minutes of real-time video annually to users in over 200 countries and regions.",
    },
  ];

  const [topic, setTopic] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");
  const [chatboxOpen, setChatboxOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: string }[]
  >([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const navigate = useNavigate();
  const { data: inviteData, isLoading: isInvitesLoading } =
    trpc.inviteData.useQuery();

  const handleSelect = (email: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleStartMeeting = () => {
    if (!topic) return alert("Enter a topic");
    const roomName = topic.toLowerCase().replace(/\s+/g, "-");
    const participantsQuery = selectedParticipants.length
      ? `&participants=${encodeURIComponent(selectedParticipants.join(","))}`
      : "";
    navigate(`/room/${roomName}?timer=${minutes}${participantsQuery}`);
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
    <div className="flex flex-col">
      <div className="relative h-fit flex bg-[url(/bgimg.webp)] bg-[50%_100%]">
        <div className="flex flex-col justify-center gap-4 p-12 w-[70%]">
          <BlurText
            text="Start a Jitsi Meeting"
            delay={150}
            animateBy="words"
            direction="bottom"
            className="text-3xl mb-8 font-bold text-white"
          />
          <input
            placeholder="Enter Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="p-2 border rounded w-full bg-transparent placeholder:text-white text-white"
          />
          <input
            type="number"
            placeholder="Enter Timer (mins)"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="p-2 border rounded w-full bg-transparent placeholder:text-white text-white"
          />
          <div className="max-h-[200px] overflow-y-auto border rounded p-2 bg-transparent">
            <p className="text-white mb-2">Select Participants:</p>
            {isInvitesLoading ? (
              <p className="text-white">Loading participants...</p>
            ) : (
              inviteData?.participantList?.map((user, idx) => (
                <div
                  key={idx}
                  className={`cursor-pointer p-2 rounded mb-2 transition-all duration-300 ${
                    selectedParticipants.includes(user.email)
                      ? "bg-green-600 border-green-400"
                      : "bg-white/10 border-white/20"
                  }`}
                  onClick={() => handleSelect(user.email)}
                >
                  <p className="text-white">{user.username}</p>
                  <p className="text-sm text-gray-300">{user.email}</p>
                </div>
              ))
            )}
          </div>
          <button
            onClick={handleStartMeeting}
            className="relative bg-blue-950 text-white p-3 rounded-3xl w-1/2 group"
          >
            Start Meeting
            <SlCursor
              className="absolute right-5 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500"
              size={20}
            />
          </button>
        </div>
        <div className="relative w-full h-[50vh] overflow-hidden group">
          <img
            src={vidimg}
            alt="Video Call"
            className="absolute top-0 right-12 transform translate-x-0 w-[60%] h-full object-contain"
          />
        </div>

        <div className="fixed bottom-4 right-4">
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
      <div className="h-fit bg-black w-full flex flex-col items-center">
        <BlurText
          text="Video Calling features"
          delay={150}
          animateBy="words"
          direction="bottom"
          className="text-5xl mb-8 font-bold text-white text-center m-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <SpotlightCard
              key={idx}
              className="custom-spotlight-card text-white w-[300px] h-full p-6"
              spotlightColor="rgba(0, 229, 255, 0.2)"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
      <div className="w-full bg-black text-white py-16 px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="md:w-1/2">
          <img
            src={vidGal}
            alt="Video Call"
            className="rounded-xl shadow-lg w-full"
          />
        </div>
        <div className="md:w-1/2 flex flex-col gap-6">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Boost in-app engagement with real-time video
          </h2>
          <p className="text-gray-300 text-lg">
            Adding real-time video to your app keeps users engaged longer in any
            app—on any platform or device.
          </p>
          <div className="flex flex-col gap-6 mt-6">
            {engagementFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="bg-gray-800 rounded-full p-3">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{feature.title}</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};