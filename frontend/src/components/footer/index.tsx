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
  { label: "Kontakt", href: "/" },
];

export default function Footer({
  links = defaultLinks,
  copyrightText = "© Copyright 2025 - Piłkarskie Kosy"
}: FooterProps) {
  return (
    <footer className="relative w-full border-t border-white/5 bg-black/5 py-12">
      <div className="flex flex-col items-center gap-12">
        {/* Navigation Links */}
        <nav className="flex items-center gap-14">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="font-['Montserrat'] text-[14px] font-normal leading-[16px] text-white hover:text-[#274fde] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="font-['DM_Sans'] text-[14px] font-normal text-[#274fde] opacity-65">
          {copyrightText}
        </p>
      </div>
    </footer>
  );
}
