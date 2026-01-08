interface DescriptionProps {
  title?: string;
  clubName?: string;
  description?: string;
}

export default function Description({ 
  title = "O klubie",
  clubName = "Legia Warszawa",
  description = "to jeden z najbardziej utytułowanych i rozpoznawalnych polskich klubów piłkarskich, założony w 1916 roku, znany z dominacji w rozgrywkach po II wojnie światowej, nigdy nie spadając z Ekstraklasy, z dynamiczną kulturą kibicowską (np. trybuna \"Żyleta\"), silnymi zgodami (np. z Zagłębiem Sosnowiec) i bogatą historią, choć mierzący się też z wyzwaniami finansowymi."
}: DescriptionProps) {
  return (
    <div className="relative w-full max-w-[1440px] py-16">
      {/* Title */}
      <h2 className="mb-6 px-[calc(6.25%+45px)] font-['Montserrat'] text-[20px] font-medium uppercase leading-[1.3] text-white">
        {title}
      </h2>

      {/* Description Box */}
      <div className="mx-[9.24%] rounded-[30px] bg-[#333232] px-[3.07%] py-4 shadow-[6px_2px_19.1px_0px_rgba(0,0,0,0.19)]">
        <p className="font-['Montserrat'] text-[20px] font-medium leading-[1.63] tracking-[0.6px] text-white">
          <span className="font-semibold">{clubName}</span> {description}
        </p>
      </div>
    </div>
  );
}
