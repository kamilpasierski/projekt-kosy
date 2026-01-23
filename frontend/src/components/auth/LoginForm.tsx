import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface LoginFormProps {
  formData: {
    username: string;
    password: string;
  };
  error: string | null;
  rememberMe: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRememberMeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchToRegister: () => void;
  onSwitchToReset: () => void;
  onBackToButtons: () => void;
}

export default function LoginForm({
  formData,
  error,
  rememberMe,
  onSubmit,
  onChange,
  onRememberMeChange,
  onSwitchToRegister,
  onSwitchToReset,
  onBackToButtons
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-[356px] mx-auto animate-in fade-in slide-in-from-left-8 duration-300">
      {/* Nagłówek */}
      <h2 className="font-['Montserrat',sans-serif] font-semibold text-[24px] text-center text-white mb-2 leading-[1.3] tracking-[1.2px]">
        Zaloguj się na swoje konto
      </h2>
      <p className="font-['Montserrat',sans-serif] font-semibold text-[14px] text-center text-white mb-8">
        <span className="capitalize">T</span>
        <span className="lowercase">WOJE BEZPIECZEŃSTWO ZACZYNA SIĘ TUTAJ</span>
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-[21px]">
        {/* Email Input */}
        <div className="relative">
          <input
            className="w-full h-[59px] bg-[#343434] text-white placeholder-white rounded-[50px] px-6 border border-[#343434] focus:border-[#274fde] focus:outline-none transition-all font-['Montserrat',sans-serif] font-medium text-[16px]"
            type="text"
            id="username"
            name="username"
            placeholder="Wpisz email lub login"
            value={formData.username}
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
          {/* Eye Icon */}
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              id="remember-me"
              type="checkbox"
              name="rememberMe"
              onChange={onRememberMeChange}
              checked={rememberMe}
              className="w-[15px] h-[15px] bg-[#bdbdbd] border border-[#343434] rounded-none cursor-pointer"
            />
            <label 
              htmlFor="remember-me" 
              className="font-['Montserrat',sans-serif] font-medium text-[12px] text-white cursor-pointer"
            >
              Zapamiętaj mnie
            </label>
          </div>
          <button
            type="button"
            onClick={onSwitchToReset}
            className="font-['Montserrat',sans-serif] font-medium text-[12px] text-[#274fde] hover:underline cursor-pointer"
          >
            Nie pamiętam hasła
          </button>
        </div>

        {/* Sekcja błędów */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm font-['Montserrat',sans-serif]">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full h-[59px] bg-[#274fde] hover:bg-[#1e3fb8] text-white rounded-[50px] font-['Montserrat',sans-serif] font-semibold text-[16px] transition-all cursor-pointer mt-2"
        >
          Kontynuuj
        </button>

        {/* Register Link */}
        <div className="text-center mt-2">
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-['Montserrat',sans-serif] font-medium text-[14px] text-white hover:opacity-80 transition-opacity"
          >
            Nie masz konta?{' '}
            <span className="font-semibold text-[#274fde]">Zarejestruj się</span>
          </button>
        </div>

        {/* Privacy Policy Text */}
        <p className="font-['Montserrat',sans-serif] font-semibold text-[12px] text-center text-[#9ca3af] leading-[1.3] mt-4">
          Klikając dowolny przycisk „kontynuuj z", wyrażasz zgodę na warunki użytkowania i akceptujesz naszą politykę prywatności na naszej stronie internetowej.
        </p>

        {/* Back to Methods */}
        <button 
          type="button" 
          onClick={onBackToButtons} 
          className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors font-['Montserrat',sans-serif] flex items-center gap-1 mx-auto"
        >
          <ArrowLeftIcon className="w-3 h-3" />
          Wybierz inną metodę
        </button>
      </form>
    </div>
  );
}
