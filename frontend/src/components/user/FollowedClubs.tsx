const imgLegiaLogo = "https://www.figma.com/api/mcp/asset/76ba9d6c-eb9b-40ae-8649-c6aae0111dc5";
const imgLechiaLogo = "https://www.figma.com/api/mcp/asset/28ace135-108e-40b3-a8ef-a8d0d4fb6079";
const imgEditIcon = "https://www.figma.com/api/mcp/asset/4b795deb-91cf-41c6-adea-c06a7a27c315";
const imgLineDivider = "https://www.figma.com/api/mcp/asset/b1768ae6-b042-49fa-9f56-89bfb8bb80cf";

const FollowedClubs = () => {
  const clubs = [
    { id: 1, name: 'LEGIA WARSZAWA', logo: imgLegiaLogo, followingSince: '12.03.2025' },
    { id: 2, name: 'LECHIA GDAŃSK', logo: imgLechiaLogo, followingSince: '30.03.2025' },
    { id: 3, name: 'LEGIA WARSZAWA', logo: imgLegiaLogo, followingSince: '10.07.2025' },
    { id: 4, name: 'LECHIA GDAŃSK', logo: imgLechiaLogo, followingSince: '05.01.2026' },
  ];

  return (
    <div className="relative w-full" data-name="MOJE OBSERWOWANE KLUBY" data-node-id="444:1801">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <p 
          className="font-montserrat font-medium text-[20px] text-white uppercase leading-[1.3]" 
          data-node-id="428:766"
        >
          Moje obserwowane kluby
        </p>
        
        {/* Edit Button */}
        <button 
          className="bg-[#343434] rounded-[30px] px-6 py-2 flex items-center gap-2 hover:bg-[#404040] transition-colors" 
          data-node-id="428:893"
        >
          <div className="w-4 h-4" data-node-id="428:896">
            <img alt="" className="block max-w-none w-full h-full" src={imgEditIcon} />
          </div>
          <span className="font-montserrat font-medium text-[16px] text-white leading-[1.3]" data-node-id="428:895">
            Edytuj
          </span>
        </button>
      </div>

      {/* Green Background Container */}
      <div className="bg-[rgba(36,127,70,0.42)] border border-[#247f46] rounded-[30px] p-6" data-node-id="436:1214">
        {/* Clubs Grid */}
        <div className="grid grid-cols-4 gap-6" data-node-id="436:1285">
          {clubs.map((club) => (
            <div 
              key={club.id}
              className="bg-[#343434] border-[0.5px] border-[#222629] rounded-[30px] shadow-[-5px_5px_18px_0px_rgba(0,0,0,0.6)] p-4"
              data-node-id={`436:${1214 + club.id}`}
            >
              {/* Number Badge */}
              <div className="bg-[#1f1f1f] w-12 h-12 rounded-br-[30px] rounded-tl-[30px] flex items-center justify-center mb-4">
                <p className="font-montserrat font-semibold text-[20px] text-white uppercase leading-[1.3]">
                  {club.id}
                </p>
              </div>

              {/* Club Logo */}
              <div className="flex justify-center items-center h-[92px] mb-4">
                <img 
                  alt={club.name} 
                  className="max-w-[90px] max-h-[92px] object-contain" 
                  src={club.logo} 
                />
              </div>

              {/* Club Name */}
              <p className="font-montserrat font-semibold text-[20px] text-white text-center uppercase leading-[1.3] mb-4">
                {club.name}
              </p>


              {/* Following Since */}
              <p className="font-montserrat font-medium text-[16px] text-white text-center leading-[1.3]">
                <span className="capitalize">O</span>bserwujesz od: {club.followingSince}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowedClubs;
