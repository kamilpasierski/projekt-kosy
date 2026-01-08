import React from "react";

type IconType = "arrow-up" | "arrow-down" | "users" | "clock" | "none";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon?: IconType;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  icon = "none",
}) => {
  const renderIcon = () => {
    switch (icon) {
      case "arrow-up":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rotate-[270deg]"
          >
            <path
              d="M16 6L16 26M16 6L10 12M16 6L22 12"
              stroke="#20CA5F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "arrow-down":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rotate-[270deg]"
          >
            <path
              d="M16 26L16 6M16 26L10 20M16 26L22 20"
              stroke="#274FDE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "users":
        return (
          <svg
            width="57"
            height="57"
            viewBox="0 0 57 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M38.475 49.4999V45.1249C38.475 42.8095 37.5549 40.5896 35.9171 38.9518C34.2793 37.314 32.0594 36.3939 29.744 36.3939H16.2819C13.9665 36.3939 11.7466 37.314 10.1088 38.9518C8.47099 40.5896 7.55089 42.8095 7.55089 45.1249V49.4999"
              stroke="#20CA5F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23.0129 27.6439C27.827 27.6439 31.7284 23.7425 31.7284 18.9284C31.7284 14.1143 27.827 10.2129 23.0129 10.2129C18.1988 10.2129 14.2974 14.1143 14.2974 18.9284C14.2974 23.7425 18.1988 27.6439 23.0129 27.6439Z"
              stroke="#20CA5F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M49.4493 49.5V45.125C49.4474 43.1596 48.7803 41.2523 47.5533 39.7074C46.3263 38.1625 44.613 37.0676 42.6953 36.6025"
              stroke="#20CA5F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M35.3333 10.6025C37.2561 11.0655 38.9747 12.1609 40.2047 13.7079C41.4347 15.2549 42.103 17.1659 42.103 19.1356C42.103 21.1053 41.4347 23.0163 40.2047 24.5633C38.9747 26.1103 37.2561 27.2057 35.3333 27.6687"
              stroke="#20CA5F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "clock":
        return (
          <svg
            width="43"
            height="43"
            viewBox="0 0 43 43"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.5 39.4167C31.3452 39.4167 39.4167 31.3452 39.4167 21.5C39.4167 11.6548 31.3452 3.58333 21.5 3.58333C11.6548 3.58333 3.58333 11.6548 3.58333 21.5C3.58333 31.3452 11.6548 39.4167 21.5 39.4167Z"
              stroke="#FBF201"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21.5 10.75V21.5L28.6667 28.6667"
              stroke="#FBF201"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-[270px] h-[240px] bg-[#343434] rounded-[30px] border-[0.5px] border-[#222629] shadow-[-5px_5px_18px_0px_rgba(0,0,0,0.6)] p-11 relative">
      {/* Title */}
      <h3 className="font-['Montserrat'] text-[20px] font-semibold uppercase text-white leading-[1.3] w-[191px] mb-10 whitespace-pre-wrap">
        {title}
      </h3>

      {/* Value and Icon Container */}
      <div className="flex items-center justify-between">
        {/* Value */}
        <p className="font-['Montserrat'] text-[36px] font-semibold text-white leading-[1.3]">
          {value}
        </p>

        {/* Icon */}
        {icon !== "none" && <div className="flex-shrink-0">{renderIcon()}</div>}
      </div>
    </div>
  );
};

export default AdminStatCard;