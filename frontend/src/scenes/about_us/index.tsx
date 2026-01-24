import Banner from "../../components/about_us/Banner";
import WhoWeAre from "../../components/about_us/WhoWeAre";
import ProjectGoals from "../../components/about_us/ProjectGoals";
import O_nas_2 from "@/assets/O_nas_2.png";

export default function AboutUs() {
  return (
    <div className="w-full min-h-screen font-montserrat antialiased">
      <Banner />

      <div className="w-full max-w-[1180px] mx-auto px-4 md:px-6 lg:px-0 pb-16 md:pb-24">
        <WhoWeAre />
        <ProjectGoals />

        {/* Tekst edukacyjny */}
        <p className="text-center text-[18px] md:text-[20px] lg:text-[22px] font-medium text-white leading-[1.77] tracking-[0.66px] mb-1">
          Aplikacja ma charakter edukacyjny i prototypowy, jednak została zaprojektowana zgodnie z realnymi standardami
          tworzenia oprogramowania.
        </p>

        <img
          src={O_nas_2}
          alt="O nas"
          className="mx-auto mt-4 mb-0"
        />

        <p className="text-center text-[18px] md:text-[20px] lg:text-[22px] font-medium text-white leading-[1.77] tracking-[0.66px] mt-0">
          Dziękujemy za zainteresowanie naszym projektem!
        </p>
      </div>
    </div>
  );
}