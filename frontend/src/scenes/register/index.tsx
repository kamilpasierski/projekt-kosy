import React, { useState } from 'react';
import axios, { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../../shared/ActionButton';

interface DjangoErrorResponse {
    [key: string]: string[];
}

const RegisterScene = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        re_password: '',
    });

    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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

    const handleSubmit = async (e: React.FormEvent) => {
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
            };

            await axios.post(API_URL, dataToSend);
            navigate('/login');

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

    // Wspólne klasy dla inputów, żeby nie powtarzać kodu
    const inputStyles = `mb-5 w-full rounded-lg bg-primary-300 px-5 py-3 placeholder-white text-white 
                       focus:outline-none focus:ring-2 focus:ring-secondary-500 border-none`;

    return (
        <section className="mx-auto w-5/6 pt-24 pb-20 md:h-5/6">
            <div className="md:mt-16 md:w-3/5 mx-auto">
                {/* Nagłówek */}
                <h1 className="basis-3/5 font-montserrat text-3xl font-bold mb-8 text-center">
                    DOŁĄCZ DO NAS JUŻ <span className="text-primary-500">TERAZ</span>
                </h1>

                <p className="my-5 text-sm text-center">
                    Wypełnij formularz, aby utworzyć nowe konto.
                </p>

                {/* Formularz */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-10 flex flex-col gap-4 w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-xl"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-bold text-primary-500 mb-2"
                        >
                            Adres E-mail
                        </label>
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
                    </div>
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

                    <div>
                        <label
                            htmlFor="re_password"
                            className="block text-sm font-bold text-primary-500 mb-2"
                        >
                            Potwierdź hasło
                        </label>
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
                    </div>

                    {/* Sekcja błędów */}
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Przycisk Submit - wyśrodkowany */}
                    <div className="flex justify-center mt-4">
                        <ActionButton type="submit">
                            Zarejestruj się
                        </ActionButton>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default RegisterScene;