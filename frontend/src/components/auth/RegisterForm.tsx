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
  error,
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Fetch clubs on mount
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        // Fetch without authentication (registration doesn't require auth)
        const response = await axios.get<Club[]>('http://localhost:8000/api/clubs/all/');
        setAvailableClubs(response.data);
      } catch (err) {
        console.error('Failed to fetch clubs:', err);
      }
    };
    fetchClubs();
  }, []);

  // Sync favoriteClub to parent formData when it changes
  useEffect(() => {
    if (favoriteClub) {
      // Create a synthetic event to update parent's formData
      const syntheticEvent = {
        target: {
          name: 'favoriteClub',
          value: favoriteClub
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteClub]); // Only depend on favoriteClub, not onChange

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    
    if (currentStep === 1) {
      const errors: string[] = [];
      
      if (formData.password !== formData.re_password) {
        errors.push('Hasła nie są identyczne');
      }
      
      const password = formData.password;
      
      if (password.length < 8) {
        errors.push("składać się przynajmniej z 8 znaków");
      }
      if (!/[A-Z]/.test(password)) {
        errors.push("zawierać dużą literę");
      }
      if (!/\d/.test(password)) {
        errors.push("zawierać liczbę");
      }
      if (/^[a-zA-Z0-9]*$/.test(password)) {
        errors.push("znak specjalny");
      }
      
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submit - log for debugging
      console.log('Submitting registration with club:', favoriteClub);
      console.log('Form data:', formData);
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

  // Progress dots component
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
    <div className="w-full max-w-[356px] mx-auto animate-in fade-in slide-in-from-right-8 duration-300">
      {/* Step 1: Email and Passwords */}
      {currentStep === 1 && (
        <>
          <h2 className="font-['Montserrat',sans-serif] font-semibold text-[24px] text-center text-white mb-2 leading-[1.3] tracking-[1.2px]">
            Zarejestruj się jako nowy użytkownik
          </h2>
          <p className="font-['Montserrat',sans-serif] font-semibold text-[14px] text-center text-white mb-8">
            <span className="capitalize">T</span>
            <span className="lowercase">WOJE BEZPIECZEŃSTWO ZACZYNA SIĘ TUTAJ</span>
          </p>

          <ProgressDots />

          <form onSubmit={handleNext} className="flex flex-col gap-[21px]">
            {/* Email Input */}
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

            {/* Password Input */}
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
                aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-full h-full opacity-50" />
                ) : (
                  <EyeIcon className="w-full h-full opacity-50" />
                )}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                className={`w-full h-[59px] bg-[#343434] text-white placeholder-white rounded-[50px] px-6 pr-14 border transition-all font-['Montserrat',sans-serif] font-medium text-[16px] focus:outline-none ${
                  formData.re_password && formData.password !== formData.re_password
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-[#343434] focus:border-[#274fde]'
                }`}
                type={showConfirmPassword ? "text" : "password"}
                id="re_password"
                name="re_password"
                placeholder="Wpisz ponownie hasło"
                value={formData.re_password}
                onChange={(e) => {
                  onChange(e);
                  setValidationErrors([]);
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-[22px] h-[22px] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                aria-label={showConfirmPassword ? "Ukryj hasło" : "Pokaż hasło"}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="w-full h-full opacity-50" />
                ) : (
                  <EyeIcon className="w-full h-full opacity-50" />
                )}
              </button>
            </div>
            {formData.re_password && formData.password !== formData.re_password && (
              <p className="text-red-500 text-sm font-['Montserrat',sans-serif] -mt-3">
                Hasła nie są identyczne
              </p>
            )}

            {/* Error Display */}
            {(error || validationErrors.length > 0) && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg font-['Montserrat',sans-serif]">
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                {validationErrors.length > 0 && (
                  <div>
                    <p className="text-red-400 text-sm font-semibold mb-2">Hasło musi:</p>
                    <ul className="space-y-1.5">
                      {validationErrors.map((err, index) => (
                        <li key={index} className="text-red-400 text-sm flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{err}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full h-[59px] bg-[#274fde] hover:bg-[#1e3fb8] text-white rounded-[50px] font-['Montserrat',sans-serif] font-semibold text-[16px] transition-all cursor-pointer mt-2"
            >
              Kontynuuj
            </button>

            {/* Login Link */}
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-['Montserrat',sans-serif] font-medium text-[14px] text-white hover:opacity-80 transition-opacity"
              >
                Masz konto?{' '}
                <span className="font-semibold text-[#274fde]">Zaloguj się</span>
              </button>
            </div>

            {/* Privacy Policy */}
            <p className="font-['Montserrat',sans-serif] font-semibold text-[12px] text-center text-[#9ca3af] leading-[1.3] mt-4">
              Klikając dowolny przycisk „kontynuuj z", wyrażasz zgodę na warunki użytkowania i akceptujesz naszą politykę prywatności na naszej stronie internetowej.
            </p>

            {/* Back Button */}
            <button 
              type="button" 
              onClick={handleBack} 
              className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors font-['Montserrat',sans-serif] flex items-center gap-1 mx-auto"
            >
              <ArrowLeftIcon className="w-3 h-3" />
              Wybierz inną metodę
            </button>
          </form>
        </>
      )}

      {/* Step 2: Username and Location */}
      {currentStep === 2 && (
        <>
          <h2 className="font-['Montserrat',sans-serif] font-semibold text-[24px] text-center text-white mb-2 leading-[1.3] tracking-[1.2px]">
            Zarejestruj się jako nowy użytkownik
          </h2>
          <p className="font-['Montserrat',sans-serif] font-semibold text-[14px] text-center text-white mb-8">
            <span className="capitalize">T</span>
            <span className="lowercase">WOJE BEZPIECZEŃSTWO ZACZYNA SIĘ TUTAJ</span>
          </p>

          <ProgressDots />

          <form onSubmit={handleNext} className="flex flex-col gap-[21px]">
            {/* Username Input */}
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

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full h-[59px] bg-[#274fde] hover:bg-[#1e3fb8] text-white rounded-[50px] font-['Montserrat',sans-serif] font-semibold text-[16px] transition-all cursor-pointer mt-2"
            >
              Kontynuuj
            </button>

            {/* Back Button */}
            <button 
              type="button" 
              onClick={handleBack} 
              className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors font-['Montserrat',sans-serif] flex items-center gap-1 mx-auto"
            >
              <ArrowLeftIcon className="w-3 h-3" />
              Wróć
            </button>
          </form>
        </>
      )}

      {/* Step 3: Choose Favorite Club */}
      {currentStep === 3 && (
        <>
          <h2 className="font-['Montserrat',sans-serif] font-semibold text-[24px] text-center text-white mb-2 leading-[1.3] tracking-[1.2px]">
            Wybierz swój klub
          </h2>
          <p className="font-['Montserrat',sans-serif] font-semibold text-[14px] text-center text-white mb-8">
            <span className="capitalize">Dzięki</span>
            <span className="lowercase"> temu pokażemy Ci mapę zagrożeń i sojuszy</span>
          </p>

          <ProgressDots />

          <form onSubmit={handleNext} className="flex flex-col gap-[21px]">
            {/* Club Select */}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-[59px] bg-[#274fde] hover:bg-[#1e3fb8] text-white rounded-[50px] font-['Montserrat',sans-serif] font-semibold text-[16px] transition-all cursor-pointer mt-2"
            >
              Wejdź do gry
            </button>

            {/* Back Button */}
            <button 
              type="button" 
              onClick={handleBack} 
              className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors font-['Montserrat',sans-serif] flex items-center gap-1 mx-auto"
            >
              <ArrowLeftIcon className="w-3 h-3" />
              Wróć
            </button>
          </form>
        </>
      )}
    </div>
  );
}
