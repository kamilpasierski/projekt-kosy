import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import Logo from "@/assets/Logo.png";
import ActionButton from "../../shared/ActionButton.tsx";
import { API_BASE_URL } from '../../utils/config.ts';

interface BackendErrorResponse {
    error?: string;
    new_password?: string[];
    re_password?: string[];
    non_field_errors?: string[];
    [key: string]: string | string[] | undefined;
}

const ResetPasswordConfirm = () => {
    // Pobieranie parametrów z linku (uid i token)
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        new_password: '',
        re_password: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const inputStyles = "w-full h-14 bg-neutral-700/50 text-white placeholder-gray-400 rounded-[50px] px-6 border border-transparent focus:border-[#274fde] focus:bg-neutral-700 focus:outline-none transition-all";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Logika walidacji (taka sama jak w AuthScene)
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

        // 1. Walidacja haseł
        if (formData.new_password !== formData.re_password) {
            setError('Hasła nie są zgodne!');
            return;
        }

        const passError = validatePassword(formData.new_password);
        if (passError) {
            setError(passError);
            return;
        }

        try {
            const API_URL = `${API_BASE_URL}/password-reset/confirm/`;

            await axios.post(API_URL, {
                uid: uid,
                token: token,
                password: formData.new_password
            });

            setSuccess(true);

            // Opcjonalne przekierowanie po 3 sek
            setTimeout(() => {
                navigate('/auth');
            }, 3000);

        } catch (err: unknown) {
            let errorMessage = 'Wystąpił błąd podczas zmiany hasła.';

            if (isAxiosError(err) && err.response?.data) {
                const data = err.response.data as BackendErrorResponse;

                if (data.error) {
                    errorMessage = data.error;
                } else if (data.new_password && data.new_password.length > 0) {
                    errorMessage = data.new_password[0];
                } else if (data.non_field_errors && data.non_field_errors.length > 0) {
                    errorMessage = data.non_field_errors[0];
                }
            }
            setError(errorMessage);
        }
    };

    return (
        <div className="w-full min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Logo na górze (link do strony głównej) */}
            <Link to="/" className="mb-8 hover:opacity-80 transition-opacity flex flex-col items-center">
                <img className="w-24 h-24 rounded-full" src={Logo} alt="Logo" />
                <div className="text-white text-lg font-semibold tracking-widest text-center mt-2">
                    PIŁKARSKIE KOSY
                </div>
            </Link>

            {/* Karta formularza */}
            <div className="w-full max-w-md bg-stone-800/80 p-8 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">

                {success ? (
                    // WIDOK SUKCESU
                    <div className="text-center py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 bg-[#274fde] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#274fde]/30">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl text-white font-bold mb-2">Hasło zmienione!</h2>
                        <p className="text-gray-400 mb-8">Możesz się teraz zalogować używając nowego hasła.</p>

                        <div className="flex justify-center">
                            <ActionButton onClick={() => navigate('/auth')}>
                                Przejdź do logowania
                            </ActionButton>
                        </div>
                    </div>
                ) : (
                    // WIDOK FORMULARZA
                    <>
                        <h2 className="text-white text-2xl font-semibold tracking-wide text-center mb-2">
                            Ustaw nowe hasło
                        </h2>
                        <p className="text-gray-400 text-sm text-center mb-8">
                            Wprowadź i potwierdź swoje nowe hasło poniżej.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                className={inputStyles}
                                type="password"
                                name="new_password"
                                placeholder="Nowe hasło"
                                value={formData.new_password}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className={inputStyles}
                                type="password"
                                name="re_password"
                                placeholder="Powtórz hasło"
                                value={formData.re_password}
                                onChange={handleChange}
                                required
                            />

                            {/* Wyświetlanie błędów */}
                            {error && (
                                <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-200 rounded-xl text-sm text-center animate-in fade-in">
                                    {error}
                                </div>
                            )}

                            <div className="mt-2 flex justify-center">
                                <ActionButton type="submit">
                                    Zatwierdź zmianę
                                </ActionButton>
                            </div>

                            <div className="mt-4 text-center">
                                <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                                    Anuluj
                                </Link>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordConfirm;