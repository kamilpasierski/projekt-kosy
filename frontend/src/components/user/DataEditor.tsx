import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useAuth } from '../../hooks/useAuth';
import { API_BASE_URL } from '../../utils/config';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

      await axios.patch(`${API_BASE_URL}/api/users/change-password/`, payload, {
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
      setMessage({ text: 'Nie udało się zmienić hasła.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // --- LOGIKA USUWANIA KONTA ---
  const handleDeleteAccount = async () => {
    setMessage(null);
    setIsSaving(true);

    try {
      let token = localStorage.getItem('accessToken');
      if (!token) token = sessionStorage.getItem('accessToken');

      if (!token) {
        throw new Error("Brak tokena. Zaloguj się ponownie.");
      }

      await axios.delete(`${API_BASE_URL}/api/users/me/delete/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      // Wyloguj użytkownika i przekieruj
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      window.location.href = '/';

    } catch (error: unknown) {
      console.error("Błąd usuwania konta:", error);
      setMessage({ text: 'Nie udało się usunąć konta.', type: 'error' });
    } finally {
      setIsSaving(false);
      setShowDeleteConfirm(false);
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
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      
      // Guard clause: jeśli token nie istnieje (np. użytkownik wyczyścił cache)
      if (!token) {
        throw new Error("Brak tokena. Zaloguj się ponownie.");
      }

      const payload = {
        username: formData.username,
        email: formData.email
      };

      await axios.patch(`${API_BASE_URL}/api/users/me/`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage({ text: '✓ Dane zostały pomyślnie zapisane!', type: 'success' });

      setTimeout(() => {
        setMessage(null);
      }, 5000);

    } catch (error: unknown) {
      console.error("Błąd zapisu:", error);
      setMessage({ text: 'Nie udało się zapisać zmian.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex justify-center antialiased font-montserrat px-4 md:px-0">
      <div className="relative w-full max-w-[1180px]" data-component="DataEditor">
        {/* Title - Montserrat Medium */}
        <p className="font-montserrat font-medium text-[20px] text-white uppercase leading-[1.3] mb-10 mt-[65px] tracking-widest">
          edycja danych użytkownika
        </p>

        {/* Main Container - BG: #2A2A2A, Szerokość 1180px */}
        <div className="bg-[#2a2a2a] rounded-[30px] p-8 md:p-12 shadow-[-4px_6px_7px_rgba(0,0,0,0.19)] mb-[120px]">

          {/* Row 1: Username & Password - Równe odstępy od brzegów */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 mb-12 justify-items-center md:justify-items-start">

            {/* Username (EDYTOWALNE) */}
            <div className="flex flex-col w-full max-w-[440px]">
              <label className="font-montserrat font-medium text-[16px] text-white capitalize mb-3 block">
                Nazwa użytkownika
              </label>
              <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] w-full px-6 flex items-center transition-colors focus-within:border-[#274fde]">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="font-montserrat font-medium text-[16px] text-white w-full bg-transparent border-none outline-none placeholder-gray-500"
                  placeholder="Nazwa użytkownika"
                />
              </div>
              {/* Linia pod nazwą użytkownika */}
              <div className="h-[0.2px] bg-white/20 w-full max-w-[486px] mt-8" />
            </div>

            {/* Password */}
            <div className="flex flex-col w-full max-w-[440px]">
              <label className="font-montserrat font-medium text-[16px] text-white capitalize mb-3 block">
                Hasło
              </label>
              {!showPasswordFields ? (
                <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] w-full px-6 flex items-center justify-between">
                  <p className="font-montserrat font-medium text-[16px] text-white tracking-widest mt-1 opacity-50">
                    ************
                  </p>
                  <button
                    onClick={() => setShowPasswordFields(true)}
                    className="text-[#274fde] hover:text-[#1e3eb5] font-montserrat font-semibold text-[14px] transition-colors uppercase"
                  >
                    Zmień hasło
                  </button>
                </div>
              ) : (
                <div className="space-y-4 w-full animate-in slide-in-from-top-2">
                  <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center focus-within:border-[#274fde]">
                    <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="font-montserrat font-medium text-[16px] text-white w-full bg-transparent outline-none" placeholder="Aktualne hasło" />
                  </div>
                  <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center focus-within:border-[#274fde]">
                    <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="font-montserrat font-medium text-[16px] text-white w-full bg-transparent outline-none" placeholder="Nowe hasło" />
                  </div>
                  <div className="flex gap-4">
                    <button onClick={handlePasswordSave} className="flex-1 bg-[#274fde] h-[45px] rounded-[30px] text-white font-semibold text-[13px] uppercase">Zapisz</button>
                    <button onClick={() => setShowPasswordFields(false)} className="flex-1 bg-[#333] h-[45px] rounded-[30px] text-white font-semibold text-[13px] uppercase">Anuluj</button>
                  </div>
                </div>
              )}
              {/* Linia pod hasłem */}
              {!showPasswordFields && <div className="h-[0.2px] bg-white/20 w-full max-w-[486px] mt-8" />}
            </div>
          </div>

          {/* Row 2: Email & Buttons Równolegle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 items-end">

            <div className="flex flex-col w-full max-w-[440px]">
              <label className="font-montserrat font-medium text-[16px] text-white capitalize mb-3 block">
                Email
              </label>
              <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] w-full px-6 flex items-center transition-colors focus-within:border-[#274fde]">
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

            {/* Przyciski - Mniej wysokie (50px) i obok maila */}
            <div className="flex gap-4 w-full max-w-[440px] mt-8 md:mt-0">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex-1 rounded-[50px] h-[50px] font-montserrat font-semibold text-[16px] text-white transition-all shadow-lg shadow-blue-900/20
                  ${isSaving ? 'bg-blue-900 cursor-wait' : 'bg-[#274fde] hover:bg-[#1e3eb5]'}`}
              >
                {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 bg-[#8a2525] rounded-[50px] h-[50px] font-montserrat font-semibold text-[16px] text-white hover:bg-[#6d1d1d] transition-colors"
              >
                Usuń konto
              </button>
            </div>
          </div>

          {/* Feedback Message */}
          {message && (
              <div className={`mt-8 p-4 rounded-[20px] text-center font-montserrat font-medium text-[16px] transition-all ${
                message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                  {message.text}
              </div>
          )}
        </div>

        {/* --- PRZYWRÓCONY MODAL USUNIĘCIA KONTA --- */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-[#2a2a2a] rounded-[30px] p-8 max-w-md mx-4  border border-[#8a2525]/50">
              <h3 className="font-montserrat font-semibold text-[24px] text-white mb-4">
                Czy na pewno chcesz usunąć konto?
              </h3>
              <p className="font-montserrat font-medium text-[16px] text-gray-300 mb-6">
                Ta operacja jest nieodwracalna. Wszystkie Twoje dane zostaną trwale usunięte.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isSaving}
                  className={`flex-1 rounded-[50px] px-6 py-3 font-montserrat font-semibold text-[16px] text-white transition-all ${
                    isSaving ? 'bg-red-900 cursor-wait' : 'bg-[#8a2525] hover:bg-[#6d1d1d]'
                  }`}
                >
                  {isSaving ? 'Usuwanie...' : 'Tak, usuń konto'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isSaving}
                  className="flex-1 rounded-[50px] px-6 py-3 font-montserrat font-semibold text-[16px] text-white bg-[#555] hover:bg-[#666] transition-colors disabled:opacity-50"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataEditor;