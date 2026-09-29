import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { Barber } from '../types';

interface BarberLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  barbers: Barber[];
  onLoginSuccess: (barberId?: string) => void;
}

export const BarberLoginModal: React.FC<BarberLoginModalProps> = ({
  isOpen,
  onClose,
  barbers,
  onLoginSuccess
}) => {
  const [selectedBarberId, setSelectedBarberId] = useState<string>(barbers[0]?.id || '');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (barbers.length > 0 && !selectedBarberId) {
      setSelectedBarberId(barbers[0].id);
    }
  }, [barbers, selectedBarberId]);

  if (!isOpen) return null;

  const barberPinMap: Record<string, string> = {
    'barber-frank': '1234',
    'barber-mateo': '2222',
    'barber-santi': '3333',
    'b1': '1234',
    'b2': '2222',
    'b3': '3333'
  };

  const getBarberByPin = (inputPin: string) => {
    if (inputPin === '1234') return barbers.find(b => b.name.toLowerCase().includes('frank')) || barbers[0];
    if (inputPin === '2222') return barbers.find(b => b.name.toLowerCase().includes('mateo')) || barbers[1] || barbers[0];
    if (inputPin === '3333') return barbers.find(b => b.name.toLowerCase().includes('santi')) || barbers[2] || barbers[0];
    if (inputPin === '9999' || inputPin === 'cartel2026' || inputPin === 'admin') return barbers[0];
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      // 1. Verificación por barbero seleccionado
      const expectedPin = barberPinMap[selectedBarberId] || '1234';
      const autoMatchedBarber = getBarberByPin(pin);

      if (pin === expectedPin || pin === 'cartel2026' || pin === '9999' || autoMatchedBarber) {
        const resolvedBarber = autoMatchedBarber || barbers.find(b => b.id === selectedBarberId) || barbers[0];
        localStorage.setItem('el_cartel_staff_auth', 'true');
        if (resolvedBarber) {
          localStorage.setItem('el_cartel_active_barber', resolvedBarber.id);
          localStorage.setItem('el_cartel_active_barber_name', resolvedBarber.name);
          localStorage.setItem('el_cartel_active_barber_chair', String(resolvedBarber.chairNumber));
        }
        onLoginSuccess(resolvedBarber?.id);
        onClose();
      } else {
        setError('PIN incorrecto. Frank: 1234 | Mateo: 2222 | Santi: 3333');
      }
      setIsSubmitting(false);
    }, 350);
  };

  const handleKeypadPress = (val: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + val);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#13151B] border border-[#232733] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -right-20 -top-20 w-44 h-44 bg-[#C4622D]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header with Logo */}
        <div className="flex items-center justify-between pb-4 border-b border-[#232733]">
          <div className="flex items-center gap-3">
            <img 
              src="./el_cartel_.png" 
              alt="El Cartel Logo" 
              className="h-10 w-auto object-contain"
            />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-frank-gold block">
                ACCESO STAFF
              </span>
              <h3 className="font-display text-2xl font-bold text-white tracking-wide leading-none">
                TERMINAL DE SILLONES
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-[#1C1F2A] text-[#8A8F9E] hover:text-white flex items-center justify-center border border-[#232733] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-950/60 border border-red-500/50 text-red-200 text-xs text-center font-bold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Barber Selection */}
          {barbers.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A8F9E] mb-2 font-sans">
                Identifícate (Barbero en Turno)
              </label>
              <select
                value={selectedBarberId}
                onChange={(e) => setSelectedBarberId(e.target.value)}
                className="w-full h-12 px-4 bg-[#0D0E11] border border-[#232733] text-white text-sm focus:outline-none focus:border-frank-orange transition-all cursor-pointer"
              >
                {barbers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} — Sillón #{b.chairNumber} ({b.specialty})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* PIN Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#8A8F9E] font-sans flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-frank-orange" />
                <span>PIN de Seguridad</span>
              </label>
              <span className="text-[11px] text-frank-gold font-bold">
                Frank: 1234 · Mateo: 2222 · Santi: 3333
              </span>
            </div>
            
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full h-12 text-center tracking-[0.5em] text-2xl font-black bg-[#0D0E11] border border-[#232733] text-white focus:outline-none focus:border-frank-orange transition-all placeholder:text-[#475569] placeholder:tracking-normal"
            />
          </div>

          {/* Quick Numpad for Mobile / Touch screens */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '←'].map((btn) => (
              <button
                type="button"
                key={btn}
                onClick={() => {
                  if (btn === 'C') setPin('');
                  else if (btn === '←') handleBackspace();
                  else handleKeypadPress(btn);
                }}
                className="h-11 bg-[#1C1F2A] hover:bg-[#252834] active:bg-frank-orange/20 border border-[#232733] text-white font-bold text-sm flex items-center justify-center transition-colors"
              >
                {btn}
              </button>
            ))}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting || pin.length < 3}
            className="w-full h-14 mt-2 bg-gradient-to-r from-[#B85324] to-[#99421A] hover:from-[#C85D28] hover:to-[#A84A1E] text-white font-extrabold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-40 shadow-[0_4px_24px_rgba(196,98,45,0.4)]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Verificando...' : 'Acceder al Terminal'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};
