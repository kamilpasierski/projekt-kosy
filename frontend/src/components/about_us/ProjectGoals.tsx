export default function ProjectGoals() {
  return (
    <div className="mb-12 md:mb-16">
      <h2 className="font-['Montserrat'] text-[18px] md:text-[20px] font-medium uppercase text-white leading-[1.3] mb-6 md:mb-10">
        Cel projektu
      </h2>
      
      <div className="bg-[#2a2a2a] rounded-[20px] md:rounded-[30px] p-6 md:p-8 lg:p-12 shadow-lg">
        <div className="font-['Montserrat'] text-[16px] md:text-[18px] lg:text-[20px] font-medium text-white leading-[1.77] tracking-[0.6px] space-y-6">
          <p>
            Projekt powstał z myślą o analizie relacji między klubami sportowymi, wizualizacji tych danych na mapie, 
            informowaniu użytkowników o potencjalnym zagrożeniu w ich okolicy oraz budowaniu systemu zgłoszeń i powiadomień 
            opartych na danych.
          </p>
          
          <div>
            <p className="mb-3">Celem projektu było:</p>
            <ul className="space-y-2 pl-6">
              <li>• zrozumienie i analiza zależności między klubami sportowymi,</li>
              <li>• wizualizacja danych w kontekście przestrzennym,</li>
              <li>• zwiększenie świadomości użytkowników o możliwych ryzykach w ich okolicy,</li>
              <li>• stworzenie systemu informacyjno-zgłoszeniowego opartego na danych.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
