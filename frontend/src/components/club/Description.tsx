interface DescriptionProps {
  description?: string;
}

export default function Description({ 
  description
}: DescriptionProps) {
  if (!description) return null; // Nie renderuj jeśli brak opisu

  return (
    <div className="relative w-full max-w-[1440px] py-8 sm:py-12 md:py-16">
      <h2 className="mb-4 sm:mb-5 md:mb-6 px-4 sm:px-8 md:px-[calc(6.25%+45px)] font-['Montserrat'] text-[16px] sm:text-[18px] md:text-[20px] font-medium uppercase leading-[1.3] text-white">
        O klubie
      </h2>
      <div className="mx-4 sm:mx-8 md:mx-[9.24%] rounded-[20px] sm:rounded-[25px] md:rounded-[30px] bg-[#333232] px-4 sm:px-6 md:px-[3.07%] py-3 sm:py-3.5 md:py-4 shadow-[6px_2px_19.1px_0px_rgba(0,0,0,0.19)]">
        <p className="font-['Montserrat'] text-[14px] sm:text-[16px] md:text-[20px] font-medium leading-[1.63] tracking-[0.4px] sm:tracking-[0.5px] md:tracking-[0.6px] text-white">
         {description}
        </p>
      </div>
    </div>
  );
}