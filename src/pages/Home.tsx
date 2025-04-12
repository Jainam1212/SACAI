import { Link } from "react-router-dom";
import logo from "/logo.png";
import CreateRoom from "../components/CreateRoom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 to-pink-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl max-w-3xl w-full p-10 text-center">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-20" />
        </div>

        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to SkillBridge and CarrierPath AI🎓
        </h1>
        <p className="text-gray-600 mb-8">
          Join live group discussions, connect with mentors, or evaluate
          projects — all in one platform.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <div
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-lg shadow hover:opacity-90 transition"
          >
            <CreateRoom />
          </div>

          <div
            className="px-6 py-3 rounded-lg border-2 border-cyan-500 text-cyan-600 font-medium text-lg hover:bg-cyan-50 transition align-middle"
          >
            Join Existing Room
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-8">
          Made with accuracy for collaborative learning & innovation.
        </p>
      </div>
    </div>
  );
};

export default Home;
