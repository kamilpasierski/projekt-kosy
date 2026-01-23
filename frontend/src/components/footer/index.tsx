import { Link } from 'react-router-dom';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  links?: FooterLink[];
  copyrightText?: string;
}

const defaultLinks: FooterLink[] = [
  { label: "Strona główna", href: "/" },
  { label: "Kluby", href: "/mapa" },
  { label: "O nas", href: "/" },
];

export default function Footer({
  links = defaultLinks,
  copyrightText = "© Copyright 2025 - Piłkarskie Kosy"
}: FooterProps) {
  return (
    <footer className="relative w-full border-t border-white/5 bg-black/5 py-8 md:py-12">
      <div className="flex flex-col items-center gap-6 md:gap-12 px-4">
        {/* Navigation Links */}
        <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-8 lg:gap-14">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="text-sm md:text-[14px] font-normal leading-[16px] text-white hover:text-[#274fde] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs md:text-[14px] font-normal text-[#274fde] opacity-65 text-center">
          {copyrightText}
        </p>
      </div>
    </footer>
  );
}
