interface SafetyCheckProps {
  title?: string;
  statusTitle?: string;
  description?: string;
  isSafe?: boolean;
}

const imgLocationIcon = "https://www.figma.com/api/mcp/asset/e57279db-f2fa-47c4-938a-b4e9c80462f5";
//Do zmiany na ikone
export default function SafetyCheck({
  title = "TWOJE POŁOŻENIE",
  statusTitle = "Jesteś bezpieczny!",
  description = "Znajdujesz się na terenie Legii Warszawa. Brak aktywnych kos w tej okolicy.", //mockup
  isSafe = true
}: SafetyCheckProps) {
  return (
    <div className="relative w-full max-w-[1440px] py-8">
      {/* Title */}
      <h2 className="mb-6 px-[calc(6.25%+34px)] font-['Montserrat'] text-[20px] font-medium uppercase leading-[1.3] text-white">
        {title}
      </h2>

      {/* Status Card */}
      <div className="mx-[8.47%] rounded-[30px] bg-[#2a2a2a] p-6 shadow-[-19px_13px_25.3px_0px_rgba(0,0,0,0.19)]">
        <div className="flex items-start gap-4">
          {/* Location Icon */}
          <div className="flex h-[68px] w-[68px] flex-shrink-0 items-center justify-center">
            <img 
              src={imgLocationIcon} 
              alt="" 
              className="h-full w-full transition-all duration-300"
              style={{ 
                  filter: isSafe 
                    ? 'sepia(100%) hue-rotate(50deg) saturate(500%) brightness(1.2)' // Zielony
                    : 'sepia(100%) hue-rotate(-50deg) saturate(500%) brightness(0.9)' // Czerwony DODAĆ ŻÓŁTY
              }}
            />
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <h3 className="mb-2 font-['Montserrat'] text-[20px] font-semibold uppercase leading-[1.63] tracking-[0.6px] text-white">
              {statusTitle}
            </h3>
            <p className="font-['Montserrat'] text-[20px] font-medium leading-[1.63] tracking-[0.6px] text-white">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}