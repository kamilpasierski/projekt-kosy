// src/components/navbar.tsx
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="w-full bg-gray-900 border-b border-gray-800 py-4 px-4 md:px-8 xl:px-[45px]">
            <div className="flex justify-between items-center">
                {/* Logo/Brand */}
                <Link to="/" className="text-white font-bold text-xl">
                    Projekt Kosy
                </Link>
                
                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    <Link 
                        to="/" 
                        className="text-white hover:text-blue-400 transition-colors"
                    >
                        Strona główna
                    </Link>
                    <Link 
                        to="/mapa" 
                        className="text-white hover:text-blue-400 transition-colors"
                    >
                        Mapa
                    </Link>
                    <Link 
                        to="/club/1" 
                        className="text-white hover:text-blue-400 transition-colors"
                    >
                        Przykładowy klub
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;