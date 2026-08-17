import React, { useState, useEffect } from 'react';

/**
 * Toast Notification Component
 * Usage: <Toast message="..." type="success|error|info" onClose={fn} />
 */
const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: { icon: 'check_circle', bg: 'bg-primary', text: 'text-on-primary' },
    error: { icon: 'error', bg: 'bg-error', text: 'text-on-error' },
    info: { icon: 'info', bg: 'bg-secondary', text: 'text-on-secondary' },
    warning: { icon: 'warning', bg: 'bg-tertiary', text: 'text-on-tertiary' },
  };

  const { icon, bg, text } = config[type] || config.info;

  return (
    <div className={`fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl ${bg} ${text} max-w-xs animate-[slideUp_0.3s_ease]`}>
      <span className="material-symbols-outlined text-[22px] shrink-0">{icon}</span>
      <p className="font-semibold text-sm flex-1">{message}</p>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity ml-1">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Toast;
