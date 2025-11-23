import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../../shared/ActionButton';
import { useAuth } from "../../hooks/useAurh.ts";

interface DjangoErrorResponse {
    [key: string]: string[];
}

// interfejs dla odpowiedzi z tokenem
interface TokenResponse {
    access: string;
    refresh: string;
}

const LoginScene = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();

    const navigate = useNavigate();

    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(e.target.checked);
    }

    const handleSubmit = async (e: React.FormEvent) => {
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

    // Wspólne klasy dla inputów, żeby nie powtarzać kodu
    const inputStyles = `mb-5 w-full rounded-lg bg-primary-300 px-5 py-3 placeholder-white text-white 
                       focus:outline-none focus:ring-2 focus:ring-secondary-500 border-none`;

    return (
        <section className="mx-auto w-5/6 pt-24 pb-20 md:h-5/6">
            <div className="md:mt-16 md:w-3/5 mx-auto">
                {/* Nagłówek */}
                <h1 className="basis-3/5 font-montserrat text-3xl font-bold mb-8 text-center">
                    <span className="text-primary-500">Witaj</span> Ponownie
                </h1>

                <p className="my-5 text-sm text-center">
                    Zaloguj się poniżej
                </p>

                {/* Formularz */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-10 flex flex-col gap-4 w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-xl"
                >
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-bold text-primary-500 mb-2"
                        >
                            Nazwa użytkownika
                        </label>
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
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-bold text-primary-500 mb-2"
                        >
                            Hasło
                        </label>
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
                    </div>

                    <div className="flex items-center justify-center mb-2">
                        <input
                            id="remember-me"
                            type="checkbox"
                            name="rememberMe"
                            onChange={handleRememberMe}
                            className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
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
                </form>
            </div>
        </section>
    );
};

export default LoginScene;