import { Link } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

interface AuthButtonsProps {
  onEmailClick: () => void;
  onGoogleSuccess: (credentialResponse: CredentialResponse) => void;
}

export default function AuthButtons({ onEmailClick, onGoogleSuccess }: AuthButtonsProps) {
  return (
    <div className="flex flex-col gap-6 w-full items-center animate-in fade-in zoom-in-95 duration-300">
      {/* Google */}
      <button
        onClick={() => {
          // Trigger Google OAuth flow
          const googleButton = document.querySelector('[role="button"][aria-labelledby]') as HTMLElement;
          if (googleButton) googleButton.click();
        }}
        className="w-80 h-14 relative group cursor-pointer transition-transform active:scale-95"
      >
        <div className="w-80 h-14 left-0 top-0 absolute">
          <div className="w-80 h-14 left-0 top-0 absolute bg-neutral-700 rounded-[50px] shadow-[inset_0px_0px_9px_4px_rgba(0,0,0,0.35)] group-hover:bg-neutral-600 transition-colors"></div>
        </div>
        {/* Google logo SVG */}
        <div className="w-10 h-10 left-[23px] top-[13px] absolute flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
        <div className="left-[78px] top-[19px] absolute justify-start text-white text-base font-medium leading-5">
          Kontynuuj z Google
        </div>
      </button>

      {/* Hidden Google Login for OAuth flow */}
      <div className="hidden">
        <GoogleLogin
          onSuccess={onGoogleSuccess}
          onError={() => console.log('Błąd logowania Google')}
        />
      </div>

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
        <div className="left-[78px] top-[19px] absolute justify-start text-white text-base font-medium leading-5">
          Kontynuuj z Facebookiem
        </div>
      </button>

      {/* Email KLIKNIĘCIE OTWIERA REJESTRACJĘ */}
      <button
        onClick={onEmailClick}
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
        <div className="left-[78px] top-[19px] absolute justify-start text-white text-base font-medium leading-5">
          Kontynuuj z adresem email
        </div>
      </button>

      {/*DO POPRAWY*/}
      <Link to="/">Powrót do strony głównej</Link>

      <div className="mt-8 text-center text-gray-400 text-xs font-semibold leading-4 max-w-xs">
        Klikając dowolny przycisk „kontynuuj z", wyrażasz zgodę na "warunki użytkowania" i akceptujesz naszą "politykę prywatności" na naszej stronie internetowej.
      </div>
    </div>
  );
}
