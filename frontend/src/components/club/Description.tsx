interface DescriptionProps {
  clubName?: string;
  description?: string;
}

export default function Description({ 
  clubName,
  description
}: DescriptionProps) {
  if (!description) return null; // Nie renderuj jeśli brak opisu

  return (
    <div className="relative w-full max-w-[1440px] py-16">
      <h2 className="mb-6 px-[calc(6.25%+45px)] font-['Montserrat'] text-[20px] font-medium uppercase leading-[1.3] text-white">
        O klubie
      </h2>
      <div className="mx-[9.24%] rounded-[30px] bg-[#333232] px-[3.07%] py-4 shadow-[6px_2px_19.1px_0px_rgba(0,0,0,0.19)]">
        <p className="font-['Montserrat'] text-[20px] font-medium leading-[1.63] tracking-[0.6px] text-white">
         {description}
        </p>
      </div>
    </div>
  );
}