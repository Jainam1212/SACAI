import logo from "/logo.png";
import GradientText from "../blocks/TextAnimations/GradientText/GradientText";
import { useNavigate } from "react-router-dom";
export const Navbar = () => {
    const navigate = useNavigate()
    const handleLogin = ()=>{
        navigate('/sacai/login')
    }

  return (
    <div className="sticky top-0 w-[100vw] h-fit p-4 flex flex-row justify-between items-center">
      <img src={logo} alt="logo" className="w-24" />
      <ul>
        <li>ksdj</li>
        <li>sjkd</li>
      </ul>
      <div>
        <button className="bg-slate-50 pl-4 pr-4 pt-2 pb-2 border rounded-3xl border-slate-300 hover:bg-slate-200" onClick={handleLogin}>
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={3}
            showBorder={false}
            className="custom-class text-2xl"
          >
            Login
          </GradientText>
        </button>
      </div>
    </div>
  );
};
