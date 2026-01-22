import React from 'react';
import ActionButton from '../../shared/ActionButton';

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

const inputStyles = "w-full h-14 bg-neutral-700/50 text-white placeholder-gray-400 rounded-[50px] px-6 border border-transparent focus:border-green-500 focus:bg-neutral-700 focus:outline-none transition-all";

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
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-8 duration-300">
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
        type="password"
        id="password"
        name="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={onChange}
        required
      />
      <div className="flex items-center justify-center mb-2">
        <input
          id="remember-me"
          type="checkbox"
          name="rememberMe"
          onChange={onRememberMeChange}
          checked={rememberMe}
          className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-primary-50">
          Nie wylogowywuj mnie
        </label>
      </div>

      {/* Sekcja błędów */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Przycisk Submit */}
      <div className="flex justify-center mt-4">
        <ActionButton type="submit">
          Zaloguj się
        </ActionButton>
      </div>

      {/* Switcher do resetu hasła */}
      <div className="mt-4 text-center">
        <span className="text-gray-400 text-sm font-medium">
          Nie pamiętasz hasła?
        </span>
        <button
          type="button"
          onClick={onSwitchToReset}
          className="text-green-500 hover:text-green-400 text-sm font-bold hover:underline ml-1 cursor-pointer"
        >
          Resetuj hasło.
        </button>
      </div>

      {/* Switcher do Rejestracji */}
      <div className="text-center">
        <span className="text-gray-400 text-sm font-medium">
          Nie masz jeszcze konta?
        </span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-green-500 hover:text-green-400 text-sm font-bold hover:underline ml-1 cursor-pointer"
        >
          Zarejestruj się tutaj.
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
