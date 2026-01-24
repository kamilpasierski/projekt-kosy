import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ResetPasswordFormProps {
  resetEmail: string;
  onSubmit: (e: React.FormEvent) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBackToLogin: () => void;
}

export default function ResetPasswordForm({
  resetEmail,
  onSubmit,
  onEmailChange,
  onBackToLogin
}: ResetPasswordFormProps) {
  return (
    <div className="w-full max-w-[356px] mx-auto animate-in fade-in slide-in-from-right-8 duration-300">
      {/* Nagłówek */}
      <h2 className="font-['Montserrat',sans-serif] font-semibold text-[24px] text-center text-white mb-5 leading-[1.3] tracking-[1.2px]">
        Nie pamiętam hasła
      </h2>
      <p className="font-['Montserrat',sans-serif] font-medium text-[14px] text-center text-white mb-10 leading-[20px]">
        <span className="capitalize">Podaj</span>
        <span className="lowercase"> ostatni adres email jaki pamiętasz. </span>
        <br />
        <span className="capitalize">Wyślemy</span>
        <span className="lowercase"> na niego link do wygenerowania nowego hasła.</span>
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-[21px]">
        {/* Email Input */}
        <div className="relative">
          <input
            className="w-full h-[59px] bg-[#343434] text-white placeholder-white rounded-[50px] px-6 border border-[#343434] focus:border-[#274fde] focus:outline-none transition-all font-['Montserrat',sans-serif] font-medium text-[16px]"
            type="email"
            placeholder="Wpisz email"
            value={resetEmail}
            onChange={onEmailChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full h-[59px] bg-[#274fde] hover:bg-[#1e3fb8] text-white rounded-[50px] font-['Montserrat',sans-serif] font-semibold text-[16px] transition-all cursor-pointer mt-2"
        >
          Przypomnij hasło
        </button>

        {/* Back to Login Link */}
        <div className="text-center mt-2">
          <button
            type="button"
            onClick={onBackToLogin}
            className="font-['Montserrat',sans-serif] font-medium text-[14px] text-white hover:opacity-80 transition-opacity"
          >
            Wróć do{' '}
            <span className="font-semibold text-[#274fde]">Logowania</span>
          </button>
        </div>

        {/* Back Arrow Button */}
        <button 
          type="button" 
          onClick={onBackToLogin} 
          className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors font-['Montserrat',sans-serif] flex items-center gap-1 mx-auto"
        >
          <ArrowLeftIcon className="w-3 h-3" />
          Wróć do logowania
        </button>
      </form>
    </div>
  );
}
