import logo from "/logo.png";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

export const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  const { data, isLoading } = trpc.findDetailsForNav.useQuery(
    { email: username ?? "" },
    { enabled: !!username }
  );

  const getCookie = (name: string): string | null => {
    try {
      const cookieArr = document.cookie.split("; ");
      for (let i = 0; i < cookieArr.length; i++) {
        const cookiePair = cookieArr[i].split("=");
        if (cookiePair[0] === name && cookiePair[1] !== undefined) {
          return decodeURIComponent(cookiePair[1]);
        }
      }
      return null;
    } catch (error) {
      console.error("Error parsing cookies:", error);
      return null;
    }
  };

  const handleLoginLogout = async () => {
    if (username) {
      try {
        document.cookie =
          "username=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure";
        setUsername(null);
        navigate("/sacai/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    } else {
      navigate("/sacai/login");
    }
  };


  useEffect(() => {
    const checkCookie = () => {
      console.log("Raw Cookies:", document.cookie);
      const storedUsername = getCookie("username");
      setUsername(storedUsername);
      console.log("Username Cookie:", storedUsername);
    };

    checkCookie();
  }, []);

  const welcomeMessage = () => {
    if (isLoading) {
      return "Welcome back...";
    }

    if (data && data.success && data.usernameRequired && data.designation) {
      return `Welcome back ${data.designation}, ${data.usernameRequired}`;
    }

    return "Welcome back";
  };

  return (
    <div className="sticky top-0 h-fit p-4 flex flex-row justify-between items-center bg-white z-50">
      <img src={logo} alt="logo" className="w-24" />
      <p className="text-2xl font-bold">{welcomeMessage()}</p>
      <div>
        <button
          className="bg-slate-50 pl-4 pr-4 pt-2 pb-2 border rounded-3xl border-slate-300 hover:bg-slate-200"
          onClick={handleLoginLogout}
        >
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={3}
            showBorder={false}
            className="custom-class text-2xl"
          >
            {username ? "Logout" : "Login"}
          </GradientText>
        </button>
      </div>
    </div>
  );
};
