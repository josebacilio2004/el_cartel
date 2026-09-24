import React from 'react';
import { QrCode, MessageSquare, Hand, Sparkles, CheckCircle, TrendingDown, Zap, Crown, Shield, Coffee } from 'lucide-react';

export const BentoFeatures: React.FC = () => {
  return (
    <div className="w-full py-20 bg-[#111319]" id="pilares">
      {/* Logos Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-16 border-b border-[#2B313E]/60">
        <p className="text-xs uppercase font-extrabold tracking-widest text-[#94A3B8] mb-8">
          Elegido por las barberías y estudios de afeitado más exclusivos
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center justify-center opacity-75">
          <div className="flex items-center justify-center gap-2 text-sm font-black tracking-widest uppercase text-[#94A3B8] hover:text-primary transition-colors">
            <Crown className="w-4 h-4 text-primary" /> THE SOVEREIGN
          </div>
          <div className="flex items-center justify-center gap-2 text-sm font-bold tracking-tight uppercase text-[#94A3B8] hover:text-primary transition-colors">
            <Sparkles className="w-4 h-4 text-primary" /> ATELIER BEARD
          </div>
          <div className="flex items-center justify-center gap-2 text-sm font-semibold tracking-wider uppercase text-[#94A3B8] hover:text-primary transition-colors">
            <Shield className="w-4 h-4 text-primary" /> BLACKWOOD CO.
          </div>
          <div className="flex items-center justify-center gap-2 text-sm font-bold tracking-tight uppercase text-[#94A3B8] hover:text-primary transition-colors">
            <Coffee className="w-4 h-4 text-primary" /> GENTLEMAN'S Q.
          </div>
          <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 text-sm font-light tracking-widest uppercase text-[#94A3B8] hover:text-primary transition-colors">
            <Crown className="w-4 h-4 text-primary" /> MAISON BARBER
          </div>
        </div>
      </div>

      {/* Main Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
            Flujo Operativo Sin Fricción
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
            El caos tradicional de los turnos vs. la fluidez de Barber Pro
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-3 leading-relaxed">
            Sustituye sofás abarrotados de miradas ansiosas por un ambiente exclusivo donde cada cliente se siente respetado y cada barbero trabaja en su zona de máximo rendimiento.
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-[#181C24] border border-[#2B313E] p-7 rounded-3xl flex flex-col justify-between hover:border-primary/40 transition-all group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-105 transition-transform">
                <QrCode className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Pilar 01</div>
              <h3 className="text-lg font-bold text-white mb-3">
                Colas invisibles y clientes libres
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Tus clientes no esperan aburridos en el local. Escanean el código de entrada y pueden tomar un café, hacer recados o relajarse en el lounge conociendo su posición exacta minuto a minuto.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#2B313E] flex items-center gap-2 text-secondary text-xs font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>+35% mayor confort percibido</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#181C24] border border-[#2B313E] p-7 rounded-3xl flex flex-col justify-between hover:border-secondary/40 transition-all group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-6 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Pilar 02</div>
              <h3 className="text-lg font-bold text-white mb-3">
                Alertas automáticas por WhatsApp
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Dispara avisos directos sin que tu recepcionista o barberos toquen el teléfono. El sistema envía notificaciones cuando faltan 2 turnos para que el cliente ingrese al sillón justo a tiempo.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#2B313E] flex items-center gap-2 text-secondary text-xs font-bold">
              <TrendingDown className="w-4 h-4" />
              <span>Cero no-shows y salas despejadas</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#181C24] border border-[#2B313E] p-7 rounded-3xl flex flex-col justify-between hover:border-primary/40 transition-all group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-105 transition-transform">
                <Hand className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Pilar 03</div>
              <h3 className="text-lg font-bold text-white mb-3">
                Terminal ergonómica de 1 toque
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Pensada para operar con tijeras en mano o dedos enguantados. Botones táctiles XL de 58px, cronómetro de servicio y llamada inmediata al siguiente número con un solo toque sin fricción.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#2B313E] flex items-center gap-2 text-secondary text-xs font-bold">
              <Zap className="w-4 h-4" />
              <span>Ahorro de 45 min diarios por barbero</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
