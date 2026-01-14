const imgLineDividerVertical = "https://www.figma.com/api/mcp/asset/3f15b869-c3bb-46f6-98ce-9a27ed74d259";
const imgLineDividerHorizontal = "https://www.figma.com/api/mcp/asset/18dbc0e6-402d-4650-856a-47adf19a6c99";
const imgArrowLeft = "https://www.figma.com/api/mcp/asset/50c32e7d-6e88-42fe-ae1e-8aaea2c59a70";
const imgArrowRight = "https://www.figma.com/api/mcp/asset/73e7044e-0f4d-4178-8d3f-8ac3d9564ebc";
const imgStatusPending = "https://www.figma.com/api/mcp/asset/d69e27ef-7cff-4449-a44b-560576fbf7ea";
const imgStatusApproved = "https://www.figma.com/api/mcp/asset/e2a11b5d-3a59-40dc-8b6f-6f1b9945b803";
const imgStatusRejected = "https://www.figma.com/api/mcp/asset/c156b8bf-f11d-4c51-8bcd-653eb5f8f604";

const History = () => {
  const historyData = [
    {
      date: '03.12.2025, 14:30',
      type: 'Relacja klubów',
      details: 'Legia Warszawa – Lech Gdańsk (KOSA)',
      status: 'pending',
      statusText: 'Oczekuje',
      statusIcon: imgStatusPending,
    },
    {
      date: '03.12.2025, 14:30',
      type: 'Edycja profilu',
      details: 'Zmiana nicku użytkownika',
      status: 'approved',
      statusText: 'Zatwierdzono',
      statusIcon: imgStatusApproved,
    },
    {
      date: '03.12.2025, 14:30',
      type: 'Ulubione kluby',
      details: 'Dodano: Legia Warszawa',
      status: 'approved',
      statusText: 'Zatwierdzono',
      statusIcon: imgStatusApproved,
    },
    {
      date: '03.12.2025, 14:30',
      type: 'Relacja klubów',
      details: 'Lech Poznań – Zagłębie Lubin (ZGODA)',
      status: 'rejected',
      statusText: 'Odrzucono',
      statusIcon: imgStatusRejected,
    },
  ];

  return (
    <div className="relative w-full" data-name="HISTORIA ZGŁOSZONYCH ZMIAN" data-node-id="444:1802">
      {/* Title */}
      <p 
        className="font-montserrat font-medium text-[20px] text-white uppercase leading-[1.3] mb-8" 
        data-node-id="436:1057"
      >
        Historia zgłoszonych zmian
      </p>

      {/* Table Container */}
      <div className="bg-[#343434] rounded-[30px] overflow-hidden" data-node-id="436:1062">
        {/* Table Header */}
        <div 
          className="bg-[#2a2a2a] border-[0.5px] border-[#274fde] h-[62px] flex items-center px-8" 
          data-node-id="436:1063"
        >
          <div className="flex-1 font-montserrat font-medium text-[16px] text-white">Data</div>
          <div className="flex-1 font-montserrat font-medium text-[16px] text-white">Typ zmiany</div>
          <div className="flex-[2] font-montserrat font-medium text-[16px] text-white">Szczegóły</div>
          <div className="flex-1 font-montserrat font-medium text-[16px] text-white">Status</div>
        </div>

        {/* Table Body */}
        <div>
          {historyData.map((item, index) => (
            <div key={index}>
              <div className="flex items-center px-8 py-6 min-h-[90px]">
                {/* Date Column */}
                <div className="flex-1 font-montserrat font-medium text-[16px] text-white">
                  {item.date}
                </div>

                {/* Type Column */}
                <div className="flex-1 font-montserrat font-medium text-[16px] text-white text-center">
                  {item.type}
                </div>

                {/* Details Column */}
                <div className="flex-[2] font-montserrat font-medium text-[16px] text-white text-center">
                  {item.details}
                </div>

                {/* Status Column */}
                <div className="flex-1 flex items-center justify-center gap-2">
                  <img alt="" className="w-[26px] h-[26px]" src={item.statusIcon} />
                  <p className="font-montserrat font-semibold text-[16px] text-white">
                    {item.statusText}
                  </p>
                </div>
              </div>

            
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2.5 mt-6" data-node-id="436:1190">
        {/* Previous Button */}
        <button 
          className="bg-[#2a2a2a] rounded-[10px] w-[35px] h-[35px] flex items-center justify-center hover:bg-[#353535] transition-colors"
          data-node-id="436:1156"
        >
          <img alt="Previous" className="w-[18px] h-[9px] rotate-90" src={imgArrowLeft} />
        </button>

        {/* Page 1 - Active */}
        <button 
          className="bg-[rgba(39,79,222,0.2)] border-[0.5px] border-[#274fde] rounded-[10px] w-[35px] h-[35px] flex items-center justify-center"
          data-node-id="436:1157"
        >
          <p className="font-montserrat font-medium text-[16px] text-white leading-[1.3]">1</p>
        </button>

        {/* Page 2 */}
        <button 
          className="bg-transparent rounded-[10px] w-[35px] h-[35px] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
          data-node-id="436:1158"
        >
          <p className="font-montserrat font-medium text-[16px] text-white leading-[1.3]">2</p>
        </button>

        {/* Page 3 */}
        <button 
          className="bg-transparent rounded-[10px] w-[35px] h-[35px] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
          data-node-id="436:1159"
        >
          <p className="font-montserrat font-medium text-[16px] text-white leading-[1.3]">3</p>
        </button>

        {/* Page 4 */}
        <button 
          className="bg-transparent rounded-[10px] w-[35px] h-[35px] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
          data-node-id="436:1160"
        >
          <p className="font-montserrat font-medium text-[16px] text-white leading-[1.3]">4</p>
        </button>

        {/* Next Button */}
        <button 
          className="bg-[#2a2a2a] rounded-[10px] w-[35px] h-[35px] flex items-center justify-center hover:bg-[#353535] transition-colors"
          data-node-id="436:1161"
        >
          <img alt="Next" className="w-[18px] h-[9px] -rotate-90" src={imgArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default History;
