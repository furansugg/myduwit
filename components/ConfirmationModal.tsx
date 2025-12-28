import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Ya, Hapus',
  cancelLabel = 'Batal',
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const accentColor = variant === 'danger' ? 'bg-rose-300' : 'bg-amber-300';

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[200]">
      <div className="bg-white border-4 border-stone-900 w-full max-w-sm p-8 retro-shadow animate-in fade-in zoom-in duration-200">
        <div className={`-mt-12 -ml-12 mb-6 w-16 h-16 border-4 border-stone-900 ${accentColor} flex items-center justify-center rotate-12 retro-shadow-sm`}>
          <span className="text-2xl font-black">!</span>
        </div>
        
        <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2 text-stone-900">{title}</h2>
        <p className="text-sm font-bold text-stone-600 mb-8 uppercase leading-relaxed">
          {message}
        </p>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border-4 border-stone-900 font-bold uppercase hover:bg-stone-100 transition-all text-stone-900"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 ${variant === 'danger' ? 'bg-rose-500' : 'bg-amber-500'} text-white py-3 border-4 border-stone-900 font-bold uppercase retro-shadow-hover transition-all`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;