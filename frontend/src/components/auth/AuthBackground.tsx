import { Link } from 'react-router-dom';
import Logo from "@/assets/Logo.png";
import Start_1 from "@/assets/Start_1.png";

export default function AuthBackground() {
  return (
    <>
      <div className="absolute top-4 left-4 z-20 scale-75 lg:scale-100 origin-top-left">
        <Link to="/" className="block w-80 h-24 relative">

          <div className="w-80 h-16 left-[6px] top-[17px] absolute bg-gradient-to-r from-neutral-400/70 via-neutral-500/50 to-stone-900/30 rounded-[50px]"></div>

          <div className="left-[91px] top-[37px] absolute justify-start text-white text-lg font-semibold leading-[130%] tracking-[1.8px] whitespace-nowrap font-montserrat">
            PIŁKARSKIE KOSY
          </div>

          <img className="w-24 h-24 left-0 top-0 absolute" src={Logo} alt="Logo" />
        </Link>
      </div>

      <div className="w-full h-48 lg:h-auto lg:w-1/2 relative shrink-0">
        <img
          className="w-full h-full object-cover absolute inset-0"
          src={Start_1}
          alt="Background"
        />
        <div className="absolute inset-0 bg-black/40 lg:hidden"></div>
      </div>
    </>
  );
}