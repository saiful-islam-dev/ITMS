import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  autoFocusKey?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search tickets, serials, employees... ⌘K',
  className = '',
  autoFocusKey = true
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoFocusKey) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [autoFocusKey]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 w-4 h-4 text-[#777587] pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-14 py-2 text-xs bg-[#f2f3ff] hover:bg-[#eaedff] focus:bg-white text-[#131b2e] placeholder-[#777587] rounded-lg border border-transparent focus:border-[#4f46e5] outline-none transition-all shadow-sm"
      />
      <div className="absolute right-2 flex items-center gap-1">
        {value ? (
          <button
            onClick={() => onChange('')}
            className="p-1 text-[#777587] hover:text-[#131b2e] rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#777587] bg-white border border-[#c7c4d8] rounded shadow-xs">
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  );
};

