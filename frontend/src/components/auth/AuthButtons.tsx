import { Link } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

interface AuthButtonsProps {
  onEmailClick: () => void;
  onGoogleSuccess: (credentialResponse: CredentialResponse) => void;
}

export default function AuthButtons({ onEmailClick, onGoogleSuccess }: AuthButtonsProps) {
  return (
    <div className="flex flex-col w-full items-center animate-in fade-in zoom-in-95 duration-300 font-montserrat">

      {/* NAGŁÓWEK - Teraz całkowicie na biało, bez niebieskiego */}
      <h1 className="text-white text-[28px] font-semibold tracking-[1.2px] text-center mb-2 font-montserrat">
        Zaloguj się lub Zarejestruj
      </h1>

      <p className="text-white text-[16px] font-medium text-center mb-10 font-montserrat">
        Twoje bezpieczeństwo zaczyna się tutaj
      </p>

      <div className="flex flex-col gap-6 w-full items-center">
        {/* Google */}
        <button
          onClick={() => {
            const googleButton = document.querySelector('[role="button"][aria-labelledby]') as HTMLElement;
            if (googleButton) googleButton.click();
          }}
          className="w-full max-w-[348px] h-[59px] relative group cursor-pointer transition-transform active:scale-95"
        >
          <div className="w-full h-full absolute left-0 top-0">
            <div className="w-full h-full bg-[#343434] rounded-[50px] group-hover:bg-neutral-800 transition-colors"></div>
          </div>
          <div className="w-[35px] h-[35px] left-[24px] top-1/2 -translate-y-1/2 absolute flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <div className="left-[78px] top-1/2 -translate-y-1/2 absolute justify-start text-white text-[16px] font-medium leading-[130%] font-montserrat">
            Kontynuuj z kontem Google
          </div>
        </button>

        <div className="hidden">
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={() => console.log('Błąd logowania Google')}
          />
        </div>

        {/* Facebook */}
        <button className="w-full max-w-[348px] h-[59px] relative group cursor-pointer transition-transform active:scale-95">
          <div className="w-full h-full absolute left-0 top-0">
            <div className="w-full h-full bg-[#343434] rounded-[50px] group-hover:bg-neutral-800 transition-colors"></div>
          </div>
          <div className="w-[35px] h-[35px] left-[24px] top-1/2 -translate-y-1/2 absolute flex items-center justify-center overflow-hidden">
             <svg viewBox="0 0 24 24" className="w-[35px] h-[35px]">
               <rect width="24" height="24" fill="#1877F2" rx="4"/>
               <path fill="white" d="M14.5 14.5l.5-3.5h-3.5v-2c0-1 1-1.5 2-1.5h1.5v-3h-2.5c-2.5 0-4.5 2-4.5 4.5v2h-2v3.5h2v9h4v-9h2.5z"/>
            </svg>
          </div>
          <div className="left-[78px] top-1/2 -translate-y-1/2 absolute justify-start text-white text-[16px] font-medium leading-[130%] font-montserrat">
            Kontynuuj z Facebookiem
          </div>
        </button>

        {/* Email */}
        <button
          onClick={onEmailClick}
          className="w-full max-w-[348px] h-[59px] relative group cursor-pointer transition-transform active:scale-95"
        >
          <div className="w-full h-full absolute left-0 top-0">
            <div className="w-full h-full bg-[#343434] rounded-[50px] group-hover:bg-neutral-800 transition-colors"></div>
          </div>
          <div className="w-[39px] h-[39px] left-[24px] top-1/2 -translate-y-1/2 absolute flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-[28px] h-[28px]">
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
          </div>
          <div className="left-[78px] top-1/2 -translate-y-1/2 absolute justify-start text-white text-[16px] font-medium leading-[130%] font-montserrat">
            Kontynuuj z adresem email
          </div>
        </button>
      </div>

      {/* POWRÓT - Teraz identyczny styl jak w stopce */}
      <Link to="/" className="mt-8 text-[#9CA3AF] text-[12px] font-semibold hover:text-white transition-all underline font-montserrat">
        Powrót do strony głównej
      </Link>

      {/* STOPKA */}
      <div className="mt-8 text-center text-[#9CA3AF] text-[12px] font-semibold leading-[130%] max-w-[356px] px-2 font-montserrat">
        Klikając dowolny przycisk „kontynuuj z", wyrażasz zgodę na <span className="text-[#9CA3AF] underline">warunki użytkowania</span> i akceptujesz naszą <span className="text-[#9CA3AF] underline">politykę prywatności</span> na naszej stronie internetowej.
      </div>
    </div>
  );
}