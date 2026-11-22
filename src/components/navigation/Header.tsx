import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { StarfieldLogo } from './StarfieldLogo';

interface HeaderProps {
  onOpenAbout: () => void;
  currentWord: string;
  onWordChange: (newWord: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAbout,
  currentWord,
  onWordChange,
}) => {
  const [inputValue, setInputValue] = useState(currentWord);

  useEffect(() => {
    setInputValue(currentWord);
  }, [currentWord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onWordChange(inputValue);
    } else {
      setInputValue('ATERNOS');
      onWordChange('ATERNOS');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 16);
    setInputValue(val);
    if (val.trim()) {
      onWordChange(val);
    }
  };

  const handleClear = () => {
    setInputValue('ARTENOS');
    onWordChange('ARTENOS');
  };

  return (
    <header className="relative z-30 border-b border-[#302A34]/70 bg-[#08080B]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-3.5">
        {/* Left: Starfield / Reveal Logo */}
        <a
          href="#top"
          className="flex items-center gap-2.5 text-[#F3EFE8] transition-colors hover:text-[#D8BD83] whitespace-nowrap shrink-0 artenos-focus rounded-md py-1 pr-2"
          aria-label="Artenos — Return to starfield top"
        >
          <StarfieldLogo size={32} />
        </a>

        {/* Center: Interactive Starfield Word Input replacing 'A Study in Discovery' */}
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-1 max-w-[210px] sm:max-w-[280px] items-center"
          role="search"
          aria-label="Set starfield text"
        >
          <div className="relative flex w-full items-center rounded-md border border-[#302A34] bg-[#111015]/90 px-3 py-1.5 transition-all duration-200 focus-within:border-[#C5A46D]/80 focus-within:ring-1 focus-within:ring-[#C5A46D]/30 shadow-inner">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              maxLength={16}
              placeholder="TYPE ANY WORD..."
              aria-label="Type word to form from stars"
              className="w-full bg-transparent text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em] text-[#F3EFE8] placeholder:text-[#A59BAA]/50 placeholder:font-normal focus:outline-none"
            />

            {inputValue && inputValue.toUpperCase() !== 'ARTENOS' && (
              <button
                type="button"
                onClick={handleClear}
                title="Reset word to ARTENOS"
                aria-label="Reset text to Artenos"
                className="shrink-0 p-0.5 text-[#A59BAA] transition-colors hover:text-[#F3EFE8] cursor-pointer"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            )}
          </div>
        </form>

        {/* Right: Discreet About Control */}
        <button
          type="button"
          onClick={onOpenAbout}
          className="text-xs font-medium uppercase tracking-[0.18em] text-[#A59BAA] transition-colors hover:text-[#D8BD83] py-1.5 px-2 whitespace-nowrap shrink-0 artenos-focus cursor-pointer"
        >
          About
        </button>
      </div>
    </header>
  );
};
