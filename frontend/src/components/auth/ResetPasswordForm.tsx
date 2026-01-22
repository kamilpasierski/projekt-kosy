import React from 'react';
import ActionButton from '../../shared/ActionButton';

interface ResetPasswordFormProps {
  resetEmail: string;
  onSubmit: (e: React.FormEvent) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBackToLogin: () => void;
}

const inputStyles = "w-full h-14 bg-neutral-700/50 text-white placeholder-gray-400 rounded-[50px] px-6 border border-transparent focus:border-green-500 focus:bg-neutral-700 focus:outline-none transition-all";

export default function ResetPasswordForm({
  resetEmail,
  onSubmit,
  onEmailChange,
  onBackToLogin
}: ResetPasswordFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="text-gray-300 text-sm text-center mb-2">
        Wpisz swój login, a wyślemy Ci link do zmiany hasła.
      </div>

      <input 
        type="email" 
        placeholder="Wpisz swój E-mail" 
        className={inputStyles} 
        value={resetEmail}
        onChange={onEmailChange}
        required
      />

      <ActionButton type="submit">
        Wyślij link resetujący
      </ActionButton>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Wróć do logowania
        </button>
      </div>
    </form>
  );
}
