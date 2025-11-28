import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import ActionButton from '../../shared/ActionButton';
import Logo from "@/assets/Logo.png";
import Start_1 from "@/assets/Start_1.png";
import {useAuth} from "../../hooks/useAurh.ts";

interface DjangoErrorResponse {
    [key: string]: string[];
}

// interfejs dla odpowiedzi z tokenem
interface TokenResponse {
    access: string;
    refresh: string;
}

// Definicja możliwych widoków
type AuthView = 'buttons' | 'register' | 'login' | 'reset';

const AuthScene = () => {
    // Stan kontrolujący, który widok jest aktualnie wyświetlany
    const [view, setView] = useState<AuthView>('buttons');

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        re_password: '',
    });

    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const navigate = useNavigate();
    const [resetLogin, setResetLogin] = useState<string>('');


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) return "Hasło musi mieć min. 8 znaków.";
        if (!/[A-Z]/.test(password)) return "Hasło musi zawierać dużą literę.";
        if (!/\d/.test(password)) return "Hasło musi zawierać cyfrę.";
        if (/^[a-zA-Z0-9]+$/.test(password)) return "Hasło musi zawierać znak specjalny.";
        return null;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.re_password) {
            setError('Hasła nie są zgodne!');
            return;
        }

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        try {
            const API_URL = 'http://127.0.0.1:8000/api/register/';

            const dataToSend = {
                email: formData.email,
                username: formData.username,
                password: formData.password,
                re_password: formData.re_password,
            };

            await axios.post(API_URL, dataToSend);
            setView('login');
            alert("Sprawdź swoją skrzynkę mailową, aby aktywować konto.")


        } catch (err: unknown) {
            let errorMessage = 'Błąd sieci. Spróbuj ponownie.';

            if (isAxiosError(err) && err.response) {
                const data = err.response.data as DjangoErrorResponse;

                if (data) {
                    errorMessage = Object.values(data).flat().join(' ');
                } else {
                    errorMessage = 'Wystąpił nieznany błąd odpowiedzi.';
                }
            }

            setError(errorMessage || 'Błąd rejestracji.');
        }
    };

    const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(e.target.checked);
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const API_URL = 'http://127.0.0.1:8000/api/token/';

            // Oczekiwanie na odpowiedzi z tokenami
            const response = await axios.post<TokenResponse>(API_URL, formData);

            // Zapisywanie tokenów po logowaniu
            if (response.data && response.data.access) {
                login(response.data.access, response.data.refresh, rememberMe);

                navigate('/');
            } else {
                setError('Nie udało się uzyskać tokenu z serwera.');
            }

        } catch (err: unknown) {
            let errorMessage = 'Błąd sieci. Spróbuj ponownie.';

            if (isAxiosError(err) && err.response) {
                // Błąd 401 (Unauthorized) - złe dane logowania
                if (err.response.status === 401) {
                    errorMessage = 'Nieprawidłowa nazwa użytkownika lub hasło.';
                } else {
                    const data = err.response.data as DjangoErrorResponse;
                    if (data) {
                        errorMessage = Object.values(data).flat().join(' ');
                    } else {
                        errorMessage = 'Wystąpił nieznany błąd odpowiedzi.';
                    }
                }
            }

            setError(errorMessage || 'Błąd logowania.');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!resetLogin) {
            setError("Podaj login.");
            return;
        }

        try {
            const API_URL = 'http://127.0.0.1:8000/api/login/forgot-password/';

            // WAŻNE: Backend oczekuje klucza "username"
            await axios.post(API_URL, { username: resetLogin });

            // Sukces
            alert("Jeśli podany login istnieje, wysłaliśmy link na przypisany do niego email.");
            setView('login');
            setResetLogin('');

        } catch (err: unknown) {
            // Tutaj celowo nie pokazujemy szczegółowych błędów (security),
            // chyba że to błąd sieci.
            console.error(err);
            setError('Wystąpił błąd podczas wysyłania żądania. Spróbuj ponownie.');
        }
    }

    // Helper do renderowania odpowiedniego nagłówka
    const getHeaderTitle = () => {
        if (view === 'login') return 'Witaj ponownie';
        if (view === 'register') return 'Stwórz konto';
        return 'Zaloguj się lub Zarejestruj';
    };

    const inputStyles = "w-full h-14 bg-neutral-700/50 text-white placeholder-gray-400 rounded-[50px] px-6 border border-transparent focus:border-green-500 focus:bg-neutral-700 focus:outline-none transition-all";

    return (
        <div className="w-full min-h-screen bg-stone-900 flex flex-col lg:flex-row relative overflow-hidden">

            {/* ================= LEWA STRONA (LOGO + TŁO) ================= */}
            <div className="absolute top-4 left-4 z-20 scale-75 lg:scale-100 origin-top-left">
                <Link to="/" className="block w-80 h-24 relative">
                    <div className="w-80 h-16 left-[6px] top-[17px] absolute bg-gradient-to-r from-neutral-400/70 via-neutral-500/50 to-stone-900/30 rounded-[50px] shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)]"></div>
                    <div className="left-[91px] top-[37px] absolute justify-start text-white text-lg font-semibold leading-6 tracking-widest">PIŁKARSKIE KOSY</div>
                    <img className="w-24 h-24 left-0 top-0 absolute" src={Logo} alt="Logo" />
                </Link>
            </div>

            <div className="w-full h-48 lg:h-auto lg:w-1/2 relative shrink-0">
                <img
                    className="w-full h-full object-cover absolute inset-0"
                    src={Start_1}
                    alt="Background"
                />
                <div className="absolute inset-0 bg-black/40 lg:hidden"></div>
            </div>

            {/* ================= PRAWA STRONA (CONTENT) ================= */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative z-10">

                {/* Nagłówek */}
                <div className="text-center mb-8 space-y-2 max-w-md">
                    <h2 className="text-white text-2xl lg:text-3xl font-semibold tracking-wide transition-all duration-300">
                        {getHeaderTitle()}
                    </h2>
                    <div className="flex justify-center items-center gap-1">
                        {view === 'buttons' && (
                            <>
                                <span className="text-white text-sm font-semibold leading-4">Twoje bezpieczeństwo zaczyna się tutaj</span>
                            </>
                        )}
                        {view !== 'buttons' && (
                            <span className="text-gray-400 text-sm">
                        Wypełnij poniższe dane.
                    </span>
                        )}
                    </div>
                </div>

                {/* --- KONTENER GŁÓWNY --- */}
                <div className="w-full max-w-sm">

                    {/* 1. WIDOK BUTTONÓW (Google, FB, Email) */}
                    {view === 'buttons' && (
                        <div className="flex flex-col gap-6 w-full items-center animate-in fade-in zoom-in-95 duration-300">

                            {/* Google */}
                            <button className="w-80 h-14 relative group cursor-pointer transition-transform active:scale-95">
                                <div className="w-80 h-14 left-0 top-0 absolute">
                                    <div className="w-80 h-14 left-0 top-0 absolute bg-neutral-700 rounded-[50px] shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] group-hover:bg-neutral-600 transition-colors"></div>
                                    <div className="w-10 h-10 left-[24.93px] top-[10px] absolute"></div>
                                </div>
                                <div className="w-9 h-9 left-[24px] top-[12px] absolute overflow-hidden">
                                    <div className="w-6 h-3 left-[4.26px] top-[2.19px] absolute opacity-95 bg-red-500"></div>
                                    <div className="w-1.5 h-3.5 left-[2.73px] top-[10.76px] absolute opacity-95 bg-yellow-400"></div>
                                    <div className="w-3.5 h-3.5 left-[17.77px] top-[14.67px] absolute opacity-95 bg-blue-500"></div>
                                    <div className="w-6 h-3 left-[4.38px] top-[20.39px] absolute opacity-95 bg-green-600"></div>
                                </div>
                                <div className="left-[78px] top-[19px] absolute justify-start text-white text-base font-medium leading-5">Kontynuuj z kontem Google</div>
                            </button>

                            {/* Facebook */}
                            <button className="w-80 h-14 relative group cursor-pointer transition-transform active:scale-95">
                                <div className="w-80 h-14 left-0 top-0 absolute">
                                    <div className="w-80 h-14 left-0 top-0 absolute bg-neutral-700 rounded-[50px] shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] group-hover:bg-neutral-600 transition-colors"></div>
                                    <div className="w-10 h-10 left-[24.93px] top-[10px] absolute"></div>
                                </div>
                                <div className="w-9 h-9 left-[24px] top-[11px] absolute overflow-hidden">
                                    <div className="w-9 h-9 left-0 top-0 absolute bg-blue-600 rounded-sm"></div>
                                    <div className="w-3.5 h-7 left-[10.32px] top-[6.84px] absolute bg-white"></div>
                                </div>
                                <div className="left-[78px] top-[19px] absolute justify-start text-white text-base font-medium leading-5">Kontynuuj z Facebookiem</div>
                            </button>

                            {/* Email KLIKNIĘCIE OTWIERA REJESTRACJĘ */}
                            <button
                                onClick={() => setView('register')}
                                className="w-80 h-14 relative group cursor-pointer transition-transform active:scale-95"
                            >
                                <div className="w-80 h-14 left-0 top-0 absolute">
                                    <div className="w-80 h-14 left-0 top-0 absolute bg-neutral-700 rounded-[50px] shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] group-hover:bg-neutral-600 transition-colors"></div>
                                    <div className="w-10 h-10 left-[24.93px] top-[10px] absolute"></div>
                                </div>
                                {/* Prosta ikona koperty CSS/SVG */}
                                <div className="w-10 h-10 left-[23px] top-[13px] absolute">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-6 h-6">
                                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                    </svg>
                                </div>
                                <div className="left-[78px] top-[19px] absolute justify-start text-white text-base font-medium leading-5">Kontynuuj z adresem email</div>
                            </button>
                            {/*DO POPRAWY*/}
                            <Link to="/">Powrót do strony głównej</Link>

                            <div className="mt-8 text-center text-gray-400 text-xs font-semibold leading-4 max-w-xs">
                                Klikając dowolny przycisk „kontynuuj z”, wyrażasz zgodę na "warunki użytkowania" i akceptujesz naszą "politykę prywatności" na naszej stronie internetowej.                            </div>
                        </div>
                    )}

                    {/* 2. FORMULARZ REJESTRACJI (Domyślny po kliknięciu email) */}
                    {view === 'register' && (
                        <form onSubmit={handleRegister} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-8 duration-300">
                            <input
                                className={inputStyles}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Wpisz swój login"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className={inputStyles}
                                type="text"
                                id="email"
                                name="email"
                                placeholder="Wpisz swój e-mail"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className={inputStyles}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className={inputStyles}
                                type="password"
                                id="re_password"
                                name="re_password"
                                placeholder="••••••••"
                                value={formData.re_password}
                                onChange={handleChange}
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
                                    onClick={() => setView('login')}
                                    className="text-green-500 hover:text-green-400 text-sm font-bold hover:underline ml-1 cursor-pointer"
                                >
                                    Zaloguj się tutaj.
                                </button>
                            </div>

                            {/* Powrót do metod */}
                            <button type="button" onClick={() => setView('buttons')} className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                                ← Wybierz inną metodę
                            </button>
                        </form>
                    )}

                    {/* 3. FORMULARZ LOGOWANIA (Tylko po przełączeniu z rejestracji) */}
                    {view === 'login' && (
                        <form onSubmit={handleLogin} className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-8 duration-300">
                            <input
                                className={inputStyles}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Wpisz swój login"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className={inputStyles}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <div className="flex items-center justify-center mb-2">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    name="rememberMe"
                                    onChange={handleRememberMe}
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
                                    onClick={() => setView('reset')}
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
                                    onClick={() => setView('register')}
                                    className="text-green-500 hover:text-green-400 text-sm font-bold hover:underline ml-1 cursor-pointer"
                                >
                                    Zarejestruj się tutaj.
                                </button>
                            </div>

                            {/* Powrót do metod */}
                            <button type="button" onClick={() => setView('buttons')} className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                                ← Wybierz inną metodę
                            </button>
                        </form>
                    )}
                    {/* 4. NOWY WIDOK: RESET HASŁA */}
                    {view === 'reset' && (
                        <form onSubmit={handleResetPassword} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-8 duration-300">

                            <div className="text-gray-300 text-sm text-center mb-2">
                                Wpisz swój login, a wyślemy Ci link do zmiany hasła.
                            </div>

                            <input type="text" placeholder="Wpisz swój Login" className={inputStyles} value={resetLogin}
                                   onChange={(e) => setResetLogin(e.target.value)}
                                   required
                            />

                            <ActionButton type="submit">
                                Wyślij link resetujący
                            </ActionButton>

                            <div className="mt-4 text-center">
                                <button
                                    type="button"
                                    onClick={() => setView('login')}
                                    className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    ← Wróć do logowania
                                </button>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AuthScene;