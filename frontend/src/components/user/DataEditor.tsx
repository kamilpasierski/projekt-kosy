import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useAuth } from '../../hooks/useAuth';

// Assets
const IMG_DROPDOWN_ARROW = "https://www.figma.com/api/mcp/asset/a51e733a-42b8-4bf2-a9e2-ab6b4a1816d5";

const DataEditor = () => {
  const { user } = useAuth();

  // Lokalny stan formularza
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });

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

  // --- LOGIKA ZAPISYWANIA ---
const handleSave = async () => {
    setMessage(null);
    setIsSaving(true);

    try {
      // 1. POPRAWKA: Używamy Twojej nazwy klucza z localStorage
      const token = localStorage.getItem('accessToken'); 
      
      // Guard clause: jeśli token nie istnieje (np. użytkownik wyczyścił cache)
      if (!token) {
        throw new Error("Brak tokena. Zaloguj się ponownie.");
      }

      // Wysyłamy tylko username
      const payload = {
        username: formData.username
      };

      await axios.patch('http://127.0.0.1:8000/api/users/me/', payload, {
        headers: {
          'Authorization': `Bearer ${token}`, // Ważne: spacja po Bearer
          'Content-Type': 'application/json'
        }
      });

      setMessage({ text: 'Zapisano! Odśwież stronę (F5), aby zaktualizować baner.', type: 'success' });
      
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

          {/* Password (STATIC) */}
          <div>
            <label className="font-montserrat font-medium text-[16px] text-white capitalize mb-2 block">
              Hasło
            </label>
            <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center justify-between opacity-50 cursor-not-allowed">
              <p className="font-montserrat font-medium text-[16px] text-white tracking-widest mt-1">
                ************
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Email & Club */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Email (READ ONLY) */}
          <div>
            <label className="font-montserrat font-medium text-[16px] text-white capitalize mb-2 block">
              Email
            </label>
            <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center opacity-50 cursor-not-allowed">
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled // Zablokowane
                className="font-montserrat font-medium text-[16px] text-gray-400 w-full bg-transparent border-none outline-none"
              />
            </div>
          </div>

          {/* Favorite Club (STATIC) */}
          <div>
            <label className="font-montserrat font-medium text-[16px] text-white capitalize mb-2 block">
              Ulubiony klub
            </label>
            <div className="bg-[#1f1f1f] border-[0.5px] border-[#222629] rounded-[30px] h-[59px] px-6 flex items-center justify-between cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
              <p className="font-montserrat font-medium text-[16px] text-white">
                Legia Warszawa
              </p>
              <div className="w-[18px] h-[9px]">
                <img alt="Dropdown" className="block w-full h-full" src={IMG_DROPDOWN_ARROW} />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {message && (
            <div className={`mb-6 text-center font-montserrat font-medium ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
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