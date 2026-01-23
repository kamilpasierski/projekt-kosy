import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useAuth } from '../../hooks/useAuth';

const DataEditor = () => {
  const { user } = useAuth();

  // Lokalny stan formularza
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });

  // Stan dla zmiany hasła
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Stan UI: czy trwa zapisywanie?
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Wypełnienie formularza przy starcie
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --- LOGIKA ZMIANY HASŁA ---
  const handlePasswordSave = async () => {
    setMessage(null);
    setIsSaving(true);

    try {
      // Walidacja hasła
      if (!passwordData.currentPassword) {
        setMessage({ text: 'Podaj aktualne hasło.', type: 'error' });
        setIsSaving(false);
        return;
      }

      if (passwordData.newPassword.length < 8) {
        setMessage({ text: 'Nowe hasło musi mieć minimum 8 znaków.', type: 'error' });
        setIsSaving(false);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage({ text: 'Nowe hasła nie są identyczne.', type: 'error' });
        setIsSaving(false);
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("Brak tokena. Zaloguj się ponownie.");
      }

      const payload = {
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      };

      await axios.patch('http://127.0.0.1:8000/api/users/change-password/', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage({ text: '✓ Hasło zostało zmienione pomyślnie!', type: 'success' });
      
      // Reset password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordFields(false);

      setTimeout(() => {
        setMessage(null);
      }, 5000);

    } catch (error: unknown) {
      console.error("Błąd zmiany hasła:", error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { old_password?: string[], new_password?: string[], detail?: string } } };
        
        if (axiosError.response?.status === 401) {
          setMessage({ text: 'Sesja wygasła. Wyloguj się i zaloguj ponownie.', type: 'error' });
        } else if (axiosError.response?.data?.old_password) {
          setMessage({ text: 'Nieprawidłowe aktualne hasło.', type: 'error' });
        } else if (axiosError.response?.data?.new_password) {
          setMessage({ text: `Błąd: ${axiosError.response.data.new_password[0]}`, type: 'error' });
        } else if (axiosError.response?.data?.detail) {
          setMessage({ text: axiosError.response.data.detail, type: 'error' });
        } else {
          setMessage({ text: 'Nie udało się zmienić hasła.', type: 'error' });
        }
      } else {
        setMessage({ text: 'Nie udało się zmienić hasła.', type: 'error' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // --- LOGIKA ZAPISYWANIA ---
const handleSave = async () => {
    setMessage(null);
    setIsSaving(true);

    try {
      // Walidacja email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setMessage({ text: 'Podaj prawidłowy adres email.', type: 'error' });
        setIsSaving(false);
        return;
      }

      // 1. POPRAWKA: Używamy Twojej nazwy klucza z localStorage
      const token = localStorage.getItem('accessToken'); 
      
      // Guard clause: jeśli token nie istnieje (np. użytkownik wyczyścił cache)
      if (!token) {
        throw new Error("Brak tokena. Zaloguj się ponownie.");
      }

      // Wysyłamy username i email
      const payload = {
        username: formData.username,
        email: formData.email
      };

      await axios.patch('http://127.0.0.1:8000/api/users/me/', payload, {
        headers: {
          'Authorization': `Bearer ${token}`, // Ważne: spacja po Bearer
          'Content-Type': 'application/json'
        }
      });

      setMessage({ text: '✓ Dane zostały pomyślnie zapisane!', type: 'success' });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      
    } catch (error: unknown) {
      console.error("Błąd zapisu:", error);

      // Obsługa wygasłego tokena (401)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { username?: string[] } } };
        
        if (axiosError.response?.status === 401) {
          setMessage({ text: 'Sesja wygasła. Wyloguj się i zaloguj ponownie.', type: 'error' });
        } 
        // Obsługa błędu walidacji (np. zajęty nick)
        else if (axiosError.response?.data?.username) {
          setMessage({ text: `Błąd: ${axiosError.response.data.username[0]}`, type: 'error' });
        } 
        // Inne błędy
        else {
          setMessage({ text: 'Nie udało się zapisać zmian.', type: 'error' });
        }
      } else {
         setMessage({ text: 'Nie udało się zapisać zmian.', type: 'error' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative w-full mb-8" data-component="DataEditor">
      {/* Title */}
      <p className="font-montserrat font-medium text-[20px] text-white uppercase leading-[1.3] mb-8 mt-8">
        edycja danych użytkownika
      </p>

      {/* Main Container */}
      <div className="bg-[#2a2a2a] rounded-[30px] p-8">
        
        {/* Row 1: Username & Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Username (EDYTOWALNE) */}
          <div>
            <label className="font-montserrat font-medium text-[16px] text-white capitalize mb-2 block">
              Nazwa użytkownika
            </label>
            <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center transition-colors focus-within:border-[#274fde]">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="font-montserrat font-medium text-[16px] text-white w-full bg-transparent border-none outline-none placeholder-gray-500"
                placeholder="Nazwa użytkownika"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="font-montserrat font-medium text-[16px] text-white capitalize mb-2 block">
              Hasło
            </label>
            {!showPasswordFields ? (
              <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center justify-between">
                <p className="font-montserrat font-medium text-[16px] text-white tracking-widest mt-1">
                  ************
                </p>
                <button
                  onClick={() => setShowPasswordFields(true)}
                  className="text-[#274fde] hover:text-[#1e3eb5] font-montserrat font-medium text-[14px] transition-colors"
                >
                  Zmień hasło
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center transition-colors focus-within:border-[#274fde]">
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="font-montserrat font-medium text-[16px] text-white w-full bg-transparent border-none outline-none placeholder-gray-500"
                    placeholder="Aktualne hasło"
                  />
                </div>
                <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center transition-colors focus-within:border-[#274fde]">
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="font-montserrat font-medium text-[16px] text-white w-full bg-transparent border-none outline-none placeholder-gray-500"
                    placeholder="Nowe hasło (min. 8 znaków)"
                  />
                </div>
                <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center transition-colors focus-within:border-[#274fde]">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="font-montserrat font-medium text-[16px] text-white w-full bg-transparent border-none outline-none placeholder-gray-500"
                    placeholder="Potwierdź nowe hasło"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePasswordSave}
                    disabled={isSaving}
                    className={`flex-1 rounded-[50px] px-4 py-2 font-montserrat font-medium text-[14px] text-white transition-all ${
                      isSaving ? 'bg-blue-900 cursor-wait' : 'bg-[#274fde] hover:bg-[#1e3eb5]'
                    }`}
                  >
                    {isSaving ? 'Zapisywanie...' : 'Zapisz hasło'}
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordFields(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="flex-1 rounded-[50px] px-4 py-2 font-montserrat font-medium text-[14px] text-white bg-[#555] hover:bg-[#666] transition-colors"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Email */}
          <div>
            <label className="font-montserrat font-medium text-[16px] text-white capitalize mb-2 block">
              Email
            </label>
            <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center transition-colors focus-within:border-[#274fde]">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="font-montserrat font-medium text-[16px] text-white w-full bg-transparent border-none outline-none placeholder-gray-500"
                placeholder="Email"
              />
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {message && (
            <div className={`mb-6 p-4 rounded-[20px] text-center font-montserrat font-medium text-[16px] transition-all ${
              message.type === 'success' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'bg-red-500/20 text-red-400 border border-red-500/50'
            }`}>
                {message.text}
            </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 justify-end mt-4 flex-wrap">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`rounded-[50px] px-8 py-3 font-montserrat font-semibold text-[18px] text-white text-center leading-[1.3] transition-all shadow-lg shadow-blue-900/20 
              ${isSaving ? 'bg-blue-900 cursor-wait' : 'bg-[#274fde] hover:bg-[#1e3eb5]'}`}
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </button>

          <button 
            className="bg-[#8a2525] rounded-[50px] px-8 py-3 font-montserrat font-semibold text-[18px] text-white text-center leading-[1.3] hover:bg-[#6d1d1d] transition-colors"
          >
            Usuń konto
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataEditor;