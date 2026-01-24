import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface Club {
  id: number;
  name: string;
}

interface RegisterFormProps {
  formData: {
    email: string;
    username: string;
    password: string;
    re_password: string;
  };
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchToLogin: () => void;
  onBackToButtons: () => void;
}

export default function RegisterForm({
  formData,
  onSubmit,
  onChange,
  onSwitchToLogin,
  onBackToButtons
}: RegisterFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [favoriteClub, setFavoriteClub] = useState('');
  const [availableClubs, setAvailableClubs] = useState<Club[]>([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get<Club[]>('http://localhost:8000/api/clubs/all/');
        setAvailableClubs(response.data);
      } catch (err) {
        console.error('Failed to fetch clubs:', err);
      }
    };
    fetchClubs();
  }, []);

  useEffect(() => {
    if (favoriteClub) {
      const syntheticEvent = {
        target: {
          name: 'favoriteClub',
          value: favoriteClub
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  }, [favoriteClub, onChange]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1) {
      const errors: string[] = [];
      if (formData.password !== formData.re_password) {
        errors.push('Hasła nie są identyczne');
      }
      const password = formData.password;
      if (password.length < 8) errors.push("składać się przynajmniej z 8 znaków");
      if (!/[A-Z]/.test(password)) errors.push("zawierać dużą literę");
      if (!/\d/.test(password)) errors.push("zawierać liczbę");
      if (/^[a-zA-Z0-9]*$/.test(password)) errors.push("znak specjalny");

      if (errors.length > 0) {
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(e);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBackToButtons();
    }
  };

  const ProgressDots = () => (
    <div className="flex gap-2 justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`w-2 h-2 rounded-full transition-colors ${
            step === currentStep ? 'bg-[#274fde]' : 'bg-gray-600'
          }`}
        />
      ))}
    </div>
  );

  return (

    <div className="w-full max-w-[356px] mx-auto pt-[10px] animate-in fade-in slide-in-from-right-8 duration-300">

      {/* Step 1: Email and Passwords */}
      {currentStep === 1 && (
        <>

          <h2 className="font-['Montserrat',sans-serif] font-semibold text-[24px] text-center text-white mb-3 leading-[1.3] tracking-[1.2px] whitespace-nowrap mx-[-40px]">
            Zarejestruj się jako nowy użytkownik
          </h2>
          <p className="font-['Montserrat',sans-serif] font-medium text-[14px] text-center text-white mb-8">
            <span className="capitalize">T</span>
            <span className="lowercase">WOJE BEZPIECZEŃSTWO ZACZYNA SIĘ TUTAJ</span>
          </p>

          <ProgressDots />

          <form onSubmit={handleNext} className="flex flex-col gap-[21px]">
            <div className="relative">
              <input
                className="w-full h-[59px] bg-[#343434] text-white placeholder-white rounded-[50px] px-6 border border-[#343434] focus:border-[#274fde] focus:outline-none transition-all font-['Montserrat',sans-serif] font-medium text-[16px]"
                type="email"
                id="email"
                name="email"
                placeholder="Wpisz email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>

            <div className="relative">
              <input
                className="w-full h-[59px] bg-[#343434] text-white placeholder-white rounded-[50px] px-6 pr-14 border border-[#343434] focus:border-[#274fde] focus:outline-none transition-all font-['Montserrat',sans-serif] font-medium text-[16px]"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Wpisz hasło"
                value={formData.password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-[22px] h-[22px] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
              >
                {showPassword ? <EyeSlashIcon className="w-full h-full opacity-50" /> : <EyeIcon className="w-full h-full opacity-50" />}
              </button>
            </div>

            <div className="relative">
              <input
                className={`w-full h-[59px] bg-[#343434] text-white placeholder-white rounded-[50px] px-6 pr-14 border transition-all font-['Montserrat',sans-serif] font-medium text-[16px] focus:outline-none ${
                  formData.re_password && formData.password !== formData.re_password ? 'border-red-500' : 'border-[#343434] focus:border-[#274fde]'
                }`}
                type={showConfirmPassword ? "text" : "password"}
                id="re_password"
                name="re_password"
                placeholder="Wpisz ponownie hasło"
                value={formData.re_password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-[22px] h-[22px] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
              >
                {showConfirmPassword ? <EyeSlashIcon className="w-full h-full opacity-50" /> : <EyeIcon className="w-full h-full opacity-50" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-[59px] bg-[#274fde] hover:bg-[#1e3fb8] text-white rounded-[50px] font-['Montserrat',sans-serif] font-semibold text-[16px] transition-all cursor-pointer mt-2"
            >
              Kontynuuj
            </button>

            <div className="text-center mt-2">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-['Montserrat',sans-serif] font-medium text-[14px] text-white hover:opacity-80 transition-opacity"
              >
                Masz konto? <span className="font-semibold text-[#274fde]">Zaloguj się</span>
              </button>
            </div>

            {/* STOPKA: Zgodna z Twoim stylem polityki */}
            <div className="mt-2 text-center text-[#9CA3AF] text-[12px] font-semibold leading-[130%] max-w-[356px] px-2 font-['Montserrat',sans-serif] mx-auto">
              Klikając dowolny przycisk „kontynuuj z", wyrażasz zgodę na <span className="underline">warunki użytkowania</span> i akceptujesz naszą <span className="underline">politykę prywatności</span> na naszej stronie internetowej.
            </div>

            <button
              type="button"
              onClick={handleBack}
              className="mt-4 text-[#9ca3af] hover:text-white transition-colors font-['Montserrat',sans-serif] flex items-center gap-1 mx-auto text-[12px] font-semibold underline"
            >
              <ArrowLeftIcon className="w-3 h-3" />
              Wybierz inną metodę
            </button>
          </form>
        </>
      )}

      {/* KROK 2 - Tutaj również zastosowałem whitespace-nowrap dla spójności */}
      {currentStep === 2 && (
        <>
          <h2 className="font-['Montserrat',sans-serif] font-semibold text-[24px] text-center text-white mb-2 leading-[1.3] tracking-[1.2px] whitespace-nowrap mx-[-40px]">
            Zarejestruj się jako nowy użytkownik
          </h2>
          <p className="font-['Montserrat',sans-serif] font-medium text-[14px] text-center text-white mb-8">
            <span className="capitalize">T</span><span className="lowercase">WOJE BEZPIECZEŃSTWO ZACZYNA SIĘ TUTAJ</span>
          </p>

          <ProgressDots />

          <form onSubmit={handleNext} className="flex flex-col gap-[21px]">
            <div className="relative">
              <input
                className="w-full h-[59px] bg-[#343434] text-white placeholder-white rounded-[50px] px-6 border border-[#343434] focus:border-[#274fde] focus:outline-none transition-all font-['Montserrat',sans-serif] font-medium text-[16px]"
                type="text"
                id="username"
                name="username"
                placeholder="Wpisz login"
                value={formData.username}
                onChange={onChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full h-[59px] bg-[#274fde] hover:bg-[#1e3fb8] text-white rounded-[50px] font-['Montserrat',sans-serif] font-semibold text-[16px] transition-all cursor-pointer mt-2"
            >
              Kontynuuj
            </button>
            <button type="button" onClick={handleBack} className="mt-4 text-[#9ca3af] hover:text-white transition-colors font-['Montserrat',sans-serif] flex items-center gap-1 mx-auto text-[12px] font-semibold underline">
              <ArrowLeftIcon className="w-3 h-3" />
              Wróć
            </button>
          </form>
        </>
      )}

      {/* KROK 3 - Tutaj nagłówek jest krótszy, więc nie potrzebuje whitespace-nowrap */}
      {currentStep === 3 && (
        <>
          <h2 className="font-['Montserrat',sans-serif] font-semibold text-[24px] text-center text-white mb-2 leading-[1.3] tracking-[1.2px]">
            Wybierz swój klub
          </h2>
          <p className="font-['Montserrat',sans-serif] font-medium text-[14px] text-center text-white mb-8">
            <span className="capitalize">Dzięki</span><span className="lowercase"> temu pokażemy Ci mapę zagrożeń i sojuszy</span>
          </p>

          <ProgressDots />

          <form onSubmit={handleNext} className="flex flex-col gap-[21px]">
            <div className="relative">
              <select
                className="w-full h-[59px] bg-[#343434] text-white rounded-[50px] px-6 pr-14 border border-[#343434] focus:border-[#274fde] focus:outline-none transition-all font-['Montserrat',sans-serif] font-medium text-[16px] appearance-none cursor-pointer"
                value={favoriteClub}
                onChange={(e) => setFavoriteClub(e.target.value)}
                required
              >
                <option value="" disabled>Wyszukaj swój klub</option>
                {availableClubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white opacity-50 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="w-full h-[59px] bg-[#274fde] hover:bg-[#1e3fb8] text-white rounded-[50px] font-['Montserrat',sans-serif] font-semibold text-[16px] transition-all cursor-pointer mt-2"
            >
              Wejdź do gry
            </button>
            <button type="button" onClick={handleBack} className="mt-4 text-[#9ca3af] hover:text-white transition-colors font-['Montserrat',sans-serif] flex items-center gap-1 mx-auto text-[12px] font-semibold underline">
              <ArrowLeftIcon className="w-3 h-3" />
              Wróć
            </button>
          </form>
        </>
      )}
    </div>
  );
}