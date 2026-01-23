interface DescriptionProps {
  description?: string;
}

export default function Description({ 
  description
}: DescriptionProps) {
  if (!description) return null;

  return (
    /* Ten kontener zajmuje całą dostępną szerokość (w-full),
       ale jego zawartość jest ograniczona do 1180px i wyśrodkowana (mx-auto). */
    <div className="w-full py-8 md:py-12 antialiased">
      <div className="max-w-[1180px] mx-auto px-4 md:px-0">

        {/* Nagłówek "O klubie" */}
        <h2 className="mb-10 font-medium text-[18px] md:text-[20px] uppercase leading-[130%] text-white">
          O klubie
        </h2>

        {/* Kontener Rectangle 20 - Szerokość 1174px zgodnie z Figmą */}
        <div
          className="w-full rounded-[30px] bg-[#333232] px-6 py-8 md:px-[60px] md:py-[40px]"
          style={{
            boxShadow: '6px 2px 19.1px 0px rgba(0, 0, 0, 0.19)'
          }}
        >
          {/* Tekst opisu - Montserrat 20px, Line-height 163% */}
          <p className="font-medium text-[16px] md:text-[20px] leading-[163%] tracking-[0.6px] text-white">
           {description}
          </p>
        </div>

      </div>
    </div>
  );
}