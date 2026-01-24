import BanerImage from "@/assets/O_nas_1.png";

export default function Banner() {
  return (
    <div className="relative w-full h-[550px] -mt-[85px] antialiased overflow-hidden mb-16 md:mb-20">
      <div className="absolute inset-0 w-full h-full">
        <img
          alt="background"
          className="h-full w-full object-cover pointer-events-none rounded-bl-[40px] rounded-br-[40px]"
          src={BanerImage}
        />
        {/* Overlay dla czytelności */}
        <div className="absolute inset-0 bg-black/40 rounded-bl-[40px] rounded-br-[40px]" />
      </div>

      {/* Tytuł */}
      <div className="relative h-full w-full flex items-center justify-center z-10">
        <h1 className="text-[36px] md:text-[48px] font-bold text-white uppercase tracking-[4.8px] leading-[1.43] text-center">
          O nas
        </h1>
      </div>
    </div>
  );
}
