interface LegendItem {
  label: string;
  color: string;
}

interface LegendProps {
  title?: string;
  items?: LegendItem[];
}

const defaultItems: LegendItem[] = [
  { label: "KOSA", color: "#cb0000" },
  { label: "ZGODA", color: "#20ca5f" },
  { label: "NEUTRALNIE", color: "#fbf201" },
  { label: "BRAK DANYCH", color: "#6b7280" },
];

export default function Legend({
  title = "LEGENDA :",
  items = defaultItems
}: LegendProps) {
  return (
    <div className="relative w-full max-w-[1440px] py-8">
      <div className="mx-[8.4%] rounded-[30px] border-[0.5px] border-solid border-[#274fde] bg-[#2a2a2a] p-6">
        <div className="flex items-center gap-8">
          {/* Title */}
          <p className="font-['Montserrat'] text-[16px] font-medium text-white whitespace-nowrap">
            {title}
          </p>

          {/* Legend Items */}
          <div className="flex items-center gap-8">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-10">
                <p className="font-['Montserrat'] text-[16px] font-medium uppercase text-white whitespace-nowrap">
                  {item.label}
                </p>
                <div 
                  className="h-[45px] w-[45px] rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
