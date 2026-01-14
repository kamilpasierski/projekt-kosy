const imgDropdownArrow = "https://www.figma.com/api/mcp/asset/a51e733a-42b8-4bf2-a9e2-ab6b4a1816d5";
const imgLineDivider = "https://www.figma.com/api/mcp/asset/b5a31e46-6cc3-4f61-8c16-a0f93345b9d1";

const DataEditor = () => {
  return (
    <div className="relative w-full" data-name="EDYCJA DANYCH UŻYTKOWNIKA" data-node-id="444:1803">
      {/* Title */}
      <p 
        className="font-montserrat font-medium text-[20px] text-white uppercase leading-[1.3] mb-8" 
        data-node-id="428:764"
      >
        edycja danych użytkownika
      </p>

      {/* Main Container */}
      <div className="bg-[#2a2a2a] rounded-[30px] p-8" data-node-id="428:767">
        
        {/* Form Grid - Row 1 */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Username Field */}
          <div>
            <label 
              className="font-montserrat font-medium text-[16px] text-white capitalize mb-2 block" 
              data-node-id="428:927"
            >
              Nazwa użytkownika
            </label>
            <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center" data-node-id="428:926">
              <p className="font-montserrat font-medium text-[16px] text-white" data-node-id="428:929">
                Kibic_Arek
              </p>
            </div>
          </div>

          {/* Location Field */}
          <div>
            <label 
              className="font-montserrat font-medium text-[16px] text-white capitalize mb-2 block" 
              data-node-id="428:986"
            >
              Lokalizacja
            </label>
            <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center justify-between" data-node-id="428:983">
              <p className="font-montserrat font-medium text-[16px] text-white" data-node-id="428:989">
                Dolny Śląsk
              </p>
              <div className="w-[18px] h-[9px]" data-node-id="428:998">
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
        </div>

        {/* Form Grid - Row 2 */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Email Field */}
          <div>
            <label 
              className="font-montserrat font-medium text-[16px] text-white capitalize mb-2 block" 
              data-node-id="428:932"
            >
              email
            </label>
            <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center" data-node-id="428:931">
              <p className="font-montserrat font-medium text-[16px] text-white" data-node-id="428:933">
                arekowalski99@gmail.com
              </p>
            </div>
          </div>

          {/* Favorite Club Field */}
          <div>
            <label 
              className="font-montserrat font-medium text-[16px] text-white capitalize mb-2 block" 
              data-node-id="428:987"
            >
              Ulubiony klub
            </label>
            <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center justify-between" data-node-id="428:984">
              <p className="font-montserrat font-medium text-[16px] text-white" data-node-id="428:990">
                Legia Warszawa
              </p>
              <div className="w-[18px] h-[9px]" data-node-id="428:1002">
                <img alt="" className="block max-w-none w-full h-full" src={imgDropdownArrow} />
              </div>
            </div>
          </div>
        </div>


        {/* Password Field */}
        <div className="mb-8">
          <label 
            className="font-montserrat font-medium text-[16px] text-white capitalize mb-2 block" 
            data-node-id="428:980"
          >
            Hasło
          </label>
          <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center max-w-[440px]" data-node-id="428:979">
            <p className="font-montserrat font-medium text-[16px] text-white" data-node-id="428:981">
              ************
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end mt-12">
          {/* Save Changes Button */}
          <button 
            className="bg-[#274fde] rounded-[50px] px-8 py-3 font-montserrat font-semibold text-[18px] text-white text-center leading-[1.3] hover:bg-[#1e3eb5] transition-colors" 
            data-node-id="436:1048"
          >
            Zapisz zmiany
          </button>

          {/* Delete Account Button */}
          <button 
            className="bg-[#8a2525] rounded-[50px] px-8 py-3 font-montserrat font-semibold text-[18px] text-white text-center leading-[1.3] hover:bg-[#6d1d1d] transition-colors" 
            data-node-id="436:1038"
          >
            Usuń konto
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataEditor;
