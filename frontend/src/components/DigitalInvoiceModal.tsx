import React, { useState } from 'react';
import {
  X,
  Receipt,
  Printer,
  MessageSquare,
  CheckCircle2,
  Clock,
  User,
  Scissors,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { SaleTicket } from '../types';

interface DigitalInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: SaleTicket | null;
  onConfirmPaymentAndFreeChair: (updatedReceipt: SaleTicket) => void;
  onSendWhatsApp: (receipt: SaleTicket) => void;
}

export const DigitalInvoiceModal: React.FC<DigitalInvoiceModalProps> = ({
  isOpen,
  onClose,
  receipt,
  onConfirmPaymentAndFreeChair,
  onSendWhatsApp
}) => {
  if (!isOpen || !receipt) return null;

  const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'YAPE' | 'PLIN' | 'TARJETA'>(
    receipt.paymentMethod || 'YAPE'
  );

  const handleFinish = () => {
    onConfirmPaymentAndFreeChair({
      ...receipt,
      paymentMethod
    });
  };

  const invoiceNumber = `B001-${receipt.id.slice(-6).toUpperCase()}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#13151D] border border-[#2B313E] rounded-3xl p-6 sm:p-7 shadow-2xl relative my-auto overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-[#1C202C] text-[#8C93A4] hover:text-white flex items-center justify-center border border-[#2A3040]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1C1F28] to-[#12141A] border border-frank-orange/40 flex items-center justify-center p-2 mb-2 shadow-lg shadow-frank-orange/15">
            <img
              src="./el_cartel_.png"
              alt="Logo El Cartel"
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = './el_cartel.png';
              }}
            />
          </div>
          <h2 className="font-display tracking-widest text-2xl font-bold text-white leading-none">
            EL CARTEL BARBERSHOP
          </h2>
          <span className="text-[10px] tracking-widest uppercase font-semibold text-frank-gold mt-1">
            BOLETA DIGITAL DE VENTA
          </span>
          <span className="font-mono text-xs text-[#7F8698] mt-0.5">
            {invoiceNumber} · Ticket #{receipt.ticketCode}
          </span>
        </div>

        {/* Invoice Ticket Body (Paper style dark border) */}
        <div className="bg-[#181B26] border border-[#252A38] rounded-2xl p-5 text-left text-xs space-y-3 mb-5 relative">
          <div className="flex justify-between items-center pb-2.5 border-b border-[#252A38]">
            <span className="text-[#7F8698]">Fecha & Hora:</span>
            <span className="font-mono font-bold text-white">{receipt.createdAt}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-[#252A38]">
            <span className="text-[#7F8698]">Cliente:</span>
            <span className="font-bold text-white">{receipt.clientName}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-[#252A38]">
            <span className="text-[#7F8698]">Servicio Prestado:</span>
            <span className="font-bold text-frank-gold">{receipt.serviceName}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-[#252A38]">
            <span className="text-[#7F8698]">Barbero / Sillón:</span>
            <span className="font-semibold text-white">
              {receipt.barberName} (Sillón #{receipt.chairNumber})
            </span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-[#252A38]">
            <span className="text-[#7F8698]">Tiempo de Corte:</span>
            <span className="font-mono font-bold text-white">{receipt.durationMinutes} minutos</span>
          </div>

          {/* Selector de Método de Pago */}
          <div className="pt-1">
            <span className="text-[#7F8698] block mb-2 font-bold uppercase tracking-wider text-[10px]">
              Seleccionar Método de Pago:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {(['YAPE', 'PLIN', 'EFECTIVO', 'TARJETA'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-1 rounded-xl font-bold text-[11px] transition-all border ${
                    paymentMethod === method
                      ? 'bg-frank-orange text-white border-frank-orange shadow-md shadow-frank-orange/25'
                      : 'bg-[#12141C] text-[#8C93A4] border-[#2A3040] hover:text-white'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="pt-3 border-t border-[#252A38] flex justify-between items-baseline">
            <span className="text-sm font-extrabold text-white uppercase tracking-wider">TOTAL PAGADO:</span>
            <div className="flex items-baseline gap-1 text-secondary font-display text-3xl font-black">
              <span className="text-sm font-bold text-frank-orange">S/</span>
              <span>{receipt.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleFinish}
            className="w-full py-4 px-6 bg-gradient-to-r from-secondary to-emerald-600 hover:brightness-110 text-white font-black uppercase text-xs tracking-wider rounded-2xl shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Cobrar y Liberar Sillón #{receipt.chairNumber}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onSendWhatsApp({ ...receipt, paymentMethod })}
              className="py-2.5 px-3 bg-emerald-500/15 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enviar WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="py-2.5 px-3 bg-[#1C202C] hover:bg-[#252A38] border border-[#2B313E] text-[#8C93A4] hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4 text-frank-gold" />
              <span>Imprimir Boleta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
