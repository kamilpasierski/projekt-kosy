import React from 'react';
import ActionButton from '../../shared/ActionButton';

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

const inputStyles = "w-full h-14 bg-neutral-700/50 text-white placeholder-gray-400 rounded-[50px] px-6 border border-transparent focus:border-green-500 focus:bg-neutral-700 focus:outline-none transition-all";

export default function RegisterForm({
  formData,
  error,
  onSubmit,
  onChange,
  onSwitchToLogin,
  onBackToButtons
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-8 duration-300">
      <input
        className={inputStyles}
        type="text"
        id="username"
        name="username"
        placeholder="Wpisz swój login"
        value={formData.username}
        onChange={onChange}
        required
      />
      <input
        className={inputStyles}
        type="text"
        id="email"
        name="email"
        placeholder="Wpisz swój e-mail"
        value={formData.email}
        onChange={onChange}
        required
      />
      <input
        className={inputStyles}
        type="password"
        id="password"
        name="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={onChange}
        required
      />
      <input
        className={inputStyles}
        type="password"
        id="re_password"
        name="re_password"
        placeholder="••••••••"
        value={formData.re_password}
        onChange={onChange}
        required
      />

      {/* Sekcja błędów */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Przycisk Submit */}
      <div className="flex justify-center mt-4">
        <ActionButton type="submit">
          Zarejestruj się
        </ActionButton>
      </div>

      {/* Switcher do Logowania */}
      <div className="mt-4 text-center">
        <span className="text-gray-400 text-sm font-medium">
          Posiadasz już konto?
        </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-green-500 hover:text-green-400 text-sm font-bold hover:underline ml-1 cursor-pointer"
        >
          Zaloguj się tutaj.
        </button>
      </div>

      {/* Powrót do metod */}
      <button 
        type="button" 
        onClick={onBackToButtons} 
        className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
      >
        ← Wybierz inną metodę
      </button>
    </form>
  );
}
