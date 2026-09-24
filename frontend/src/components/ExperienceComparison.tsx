import React from 'react';
import { CheckCircle2, Clock, Coffee, ShieldCheck, Award, Zap } from 'lucide-react';

export const ExperienceComparison: React.FC = () => {
  return (
    <section className="w-full py-24 bg-[#0E1116]" id="experiencia">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
        {/* Bloque A: Para el Cliente */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs uppercase font-extrabold">
              Experiencia del Cliente
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              El Ticket Virtual Inteligente: Dignidad y Libertad de Espera
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Nadie quiere perder una hora sentado en una silla incómoda hojeando revistas viejas. Con Barber Pro, la cola se traslada al smartphone de cada cliente sin necesidad de descargas ni logins engorrosos.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-sm block">Monitoreo minuto a minuto</strong>
                  <span className="text-xs text-[#94A3B8]">Cálculo dinámico del tiempo de corte según el ritmo en tiempo real de cada sillón.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-sm block">Botón de cortesía "Retrasar Turno (+15m)"</strong>
                  <span className="text-xs text-[#94A3B8]">Si el cliente está terminando su café o una llamada, pospone su puesto con 1 toque sin perder su lugar preferente.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-sm block">Menú interactivo de Lounge & Bar</strong>
                  <span className="text-xs text-[#94A3B8]">Ofrece tu carta de café de especialidad, bebidas y venta de pomadas directamente en el ticket digital.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Mockup A */}
          <div className="lg:col-span-6 bg-[#181C24] border border-[#2B313E] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="bg-[#0B0E13] border border-[#2B313E] rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#2B313E]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-white">Ticket Activo #C-08</span>
                </div>
                <span className="text-xs bg-secondary/15 border border-secondary/30 text-secondary px-3 py-1 rounded-full font-bold">
                  1 Persona Delante
                </span>
              </div>

              <div className="p-5 rounded-xl bg-[#181C24] text-center space-y-1">
                <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider font-bold">Tu Sillón Asignado</span>
                <p className="text-lg font-bold text-white">Sillón Maestro 01 (Carlos M.)</p>
                <p className="text-3xl font-black text-primary pt-1">~08 MINUTOS</p>
              </div>

              <div className="p-4 rounded-xl bg-[#222733]/60 border border-[#2B313E] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">¿Necesitas unos minutos?</p>
                  <p className="text-[11px] text-[#94A3B8]">Cede el paso al siguiente de la fila</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary text-[#0E1116] text-xs font-bold hover:bg-primary-hover transition-colors">
                  +15 Minutos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bloque B: Para el Barbero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="terminal-preview">
          {/* Visual Mockup B */}
          <div className="lg:col-span-6 order-2 lg:order-1 bg-[#181C24] border border-[#2B313E] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="bg-[#0B0E13] border border-[#2B313E] rounded-2xl p-6 space-y-5">
              {/* Barber Profile */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    alt="Master Barber Mateo Rossi"
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1WUpkLjhsefzSMUq8PeIr9j1Lti9TXd1VdbGYDMRMSEOtuL0ulLm2L4C8RmRnChRsBZsTJRt9GdhkzbKyHB0IBbcqcftt-SMPTzFS-reUmNHb2opajgwvFJZIl9s-onPUzCihZb3RvitQFAZfX_2Y4fZPK4vfoLEN8ARtnc2FMUCfhDJwZ5sHClXNI5T7l3aqSMlRhAfH_LXbN0HZ05WLt7wFQaYp7JkWIpPgV0JSJO0TmJeMFgbFyYz-g"
                  />
                  <div>
                    <h4 className="text-base font-bold text-white">Mateo Rossi</h4>
                    <p className="text-xs text-primary font-bold">Master Barber · Estación 03</p>
                  </div>
                </div>

                <div className="bg-secondary/10 border border-secondary/20 px-3 py-1.5 rounded-xl text-right">
                  <span className="text-[10px] text-secondary uppercase font-bold">Rendimiento</span>
                  <p className="text-lg font-black text-secondary">98%</p>
                </div>
              </div>

              {/* Active station preview */}
              <div className="bg-[#181C24] p-4 rounded-xl space-y-2 border border-[#2B313E]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#94A3B8] uppercase font-bold text-[10px]">Cliente en Sillón</span>
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded font-bold text-[10px]">Walk-in</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <p className="text-base font-bold text-white">Ticket #B-21 · Alejandro S.</p>
                  <span className="text-base font-bold text-primary font-mono">18:20</span>
                </div>
                <p className="text-xs text-[#94A3B8]">Servicio: Fade & Degradado con Navaja Tradicional</p>
              </div>

              <div className="w-full h-12 rounded-xl bg-secondary text-[#0E1116] font-bold text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0E1116]" />
                <span>Completar & Llamar al Siguiente (#B-22)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs uppercase font-extrabold">
              Terminal del Barbero
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Velocidad Quirúrgica para Días de Máxima Saturación
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Los fines de semana no hay tiempo para hacer clics complicados ni rellenar formularios. Diseñamos la interfaz para que el barbero controle todo con un solo dedo entre cortes.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-sm block">Touch Targets XL de 58px</strong>
                  <span className="text-xs text-[#94A3B8]">Botones sobredimensionados para operar con dedos enguantados o tijeras en mano sin errores de pulsación.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-sm block">Cronómetro y Ritmo de Atención</strong>
                  <span className="text-xs text-[#94A3B8]">Conoce el tiempo transcurrido en cada servicio para mantener la agenda sincronizada sin demoras acumuladas.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white text-sm block">Gestión Instantánea de No-Shows</strong>
                  <span className="text-xs text-[#94A3B8]">Si un cliente no responde a su llamado en 2 minutos, el barbero salta al siguiente con 1 toque sin detener la facturación.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
