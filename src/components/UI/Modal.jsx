import React, { useEffect } from 'react';

/**
 * Reusable Modal Component
 * @param {boolean} isOpen - controls visibility
 * @param {function} onClose - callback to close the modal
 * @param {string} title - modal header title
 * @param {React.ReactNode} children - modal body content
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        className={`relative w-full ${sizeClasses[size]} bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl border border-outline-variant/50 animate-[slideUp_0.25s_ease] sm:animate-[fadeIn_0.2s_ease] max-h-[90dvh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-outline-variant/40 shrink-0">
          {/* Drag Handle (Mobile) */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-outline-variant rounded-full sm:hidden" />
          <h2 className="text-title-md font-bold text-on-surface">{title}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors shrink-0"
            aria-label="Tutup"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Modal;
