interface BanerProps {
  clubName?: string;
  backgroundImage?: string;
  logoImage?: string;
  onFollow?: () => void;
}

const imgRectangle5 = "https://www.figma.com/api/mcp/asset/4635981e-9204-4e01-a31a-275c4a553635";
const imgImage5 = "https://www.figma.com/api/mcp/asset/c4c47f2e-2299-41bf-81fb-de00440554e3";
const imgEllipse8 = "https://www.figma.com/api/mcp/asset/7f6cb56c-53e9-4212-a18f-2fbe92c1e4a6";

export default function Baner({ 
  clubName = "LEGIA WARSZAWA",
  backgroundImage = imgRectangle5,
  logoImage = imgImage5,
  onFollow 
}: BanerProps) {
  return (
    <div className="relative h-[672px] w-full max-w-[1440px]">
      {/* Background Image */}
      <div className="absolute left-0 top-0 h-[672px] w-full rounded-bl-[40px] rounded-br-[40px]">
        <img 
          alt="" 
          className="h-full w-full rounded-bl-[40px] rounded-br-[40px] object-cover pointer-events-none" 
          src={backgroundImage} 
        />
      </div>

      {/* Club Logo Background Circle */}
      <div className="absolute left-1/2 top-[166px] h-[260px] w-[260px] -translate-x-1/2">
        <img 
          alt="" 
          className="h-full w-full" 
          src={imgEllipse8} 
        />
      </div>

      {/* Club Logo */}
      <div className="absolute left-1/2 top-[209px] aspect-[609/768] w-[151px] -translate-x-1/2">
        <img 
          alt="" 
          className="h-full w-full object-cover pointer-events-none" 
          src={logoImage} 
        />
      </div>

      {/* Club Name */}
      <p className="absolute left-1/2 top-[448px] w-[550px] -translate-x-1/2 text-center font-['Montserrat'] text-[48px] font-bold leading-[1.43] tracking-[4.8px] text-white whitespace-pre-wrap">
        {clubName}
      </p>

      {/* Follow Button */}
      <div className="absolute left-1/2 top-[572px] -translate-x-1/2">
        <button 
          onClick={onFollow}
          className="h-[69px] w-[227px] cursor-pointer rounded-[40px] bg-[#274fde] hover:bg-[#1e3fbd] transition-colors"
        >
          <p className="font-['Montserrat'] text-[20px] font-semibold leading-[1.3] text-center text-white">
            OBSERWUJ
          </p>
        </button>
      </div>
    </div>
  );
}
