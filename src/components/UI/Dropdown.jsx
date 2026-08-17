import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Reusable Dropdown Menu Component
 * @param {React.ReactNode} trigger - the element that triggers the dropdown
 * @param {Array} items - array of { label, icon, onClick, danger }
 */
const Dropdown = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const menuRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, openUpward: false });

  // Close on outside click and calculate position
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target) && menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    // Do not close on scroll, just update position. 
    // We only close on mousedown.
    document.addEventListener('mousedown', handleClickOutside);
    
    // Update position on scroll/resize if open
    const updatePosition = () => {
      if (isOpen && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceNeeded = 180; // Approximate menu height
        
        const openUpward = spaceBelow < spaceNeeded;
        
        setCoords({
          top: openUpward ? rect.top + window.scrollY - 4 : rect.bottom + window.scrollY + 4,
          left: rect.right + window.scrollX,
          openUpward
        });
      }
    };
    
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={(e) => { e.stopPropagation(); setIsOpen(prev => !prev); }}>
        {trigger}
      </div>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          ref={menuRef}
          className="absolute z-[9999] w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/50 py-1 animate-[fadeIn_0.15s_ease]"
          style={{ 
            top: `${coords.top}px`, 
            left: `${coords.left - 192}px`, // 192px is w-48. Subtracting to align right edge
            transform: coords.openUpward ? 'translateY(-100%)' : 'none'
          }}
        >
          {items.map((item, idx) =>
            item.divider ? (
              <div key={idx} className="my-1 border-t border-outline-variant/40" />
            ) : (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); item.onClick?.(); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-container ${
                  item.danger ? 'text-error hover:bg-error-container/30' : 'text-on-surface'
                }`}
              >
                {item.icon && (
                  <span className={`material-symbols-outlined text-[18px] ${item.danger ? 'text-error' : 'text-on-surface-variant'}`}>
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            )
          )}
        </div>,
        document.body
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default Dropdown;
