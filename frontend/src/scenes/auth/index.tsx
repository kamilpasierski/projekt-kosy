import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios, {isAxiosError} from 'axios';
import {useAuth} from "../../hooks/useAuth.ts";
import {type CredentialResponse} from "@react-oauth/google";
import AuthBackground from '../../components/auth/AuthBackground';
import AuthButtons from '../../components/auth/AuthButtons';
import RegisterForm from '../../components/auth/RegisterForm';
import LoginForm from '../../components/auth/LoginForm';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

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
    const [rememberMe, setRememberMe] = useState<boolean>(true); // Changed default to true
    const navigate = useNavigate();
    const [resetEmail, setResetEmail] = useState<string>('');


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

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        const googleToken = credentialResponse.credential;

        if (!googleToken) {
            console.error("Nie otrzymano tokenu od Google");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/google/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: googleToken
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Sukces Google:', data);

                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);

                window.location.href = '/';
            } else {
                console.error('Błąd backendu:', data);
                alert('Logowanie nieudane: ' + (data.error || 'Błąd serwera'));
            }
        } catch (error) {
            console.error('Błąd sieci:', error);
        }
    };

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

        if (!resetEmail) {
            setError("Podaj adres e-mail.");
            return;
        }

        try {
            const API_URL = 'http://127.0.0.1:8000/password-reset/';

            await axios.post(API_URL, { email: resetEmail });

            // Sukces
            alert("Jeśli podany e-mail jest przypisany do konta, wysłaliśmy link na niego link.");
            setView('login');
            setResetEmail('');

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

    return (
        <div className="w-full min-h-screen bg-stone-900 flex flex-col lg:flex-row relative overflow-hidden">
            {/* ================= LEWA STRONA (LOGO + TŁO) ================= */}
            <AuthBackground />

            {/* ================= PRAWA STRONA (CONTENT) ================= */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative z-10">{/* Nagłówek */}
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
                        <AuthButtons 
                            onEmailClick={() => setView('login')}
                            onGoogleSuccess={handleGoogleSuccess}
                        />
                    )}

                    {/* 2. FORMULARZ REJESTRACJI */}
                    {view === 'register' && (
                        <RegisterForm
                            formData={formData}
                            error={error}
                            onSubmit={handleRegister}
                            onChange={handleChange}
                            onSwitchToLogin={() => setView('login')}
                            onBackToButtons={() => setView('buttons')}
                        />
                    )}

                    {/* 3. FORMULARZ LOGOWANIA */}
                    {view === 'login' && (
                        <LoginForm
                            formData={formData}
                            error={error}
                            rememberMe={rememberMe}
                            onSubmit={handleLogin}
                            onChange={handleChange}
                            onRememberMeChange={handleRememberMe}
                            onSwitchToRegister={() => setView('register')}
                            onSwitchToReset={() => setView('reset')}
                            onBackToButtons={() => setView('buttons')}
                        />
                    )}

                    {/* 4. FORMULARZ RESET HASŁA */}
                    {view === 'reset' && (
                        <ResetPasswordForm
                            resetEmail={resetEmail}
                            onSubmit={handleResetPassword}
                            onEmailChange={(e) => setResetEmail(e.target.value)}
                            onBackToLogin={() => setView('login')}
                        />
                    )}

                </div>
            </div>
        </div>
    );
};

export default AuthScene;
