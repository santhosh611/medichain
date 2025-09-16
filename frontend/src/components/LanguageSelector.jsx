// medichain/frontend/src/components/LanguageSelector.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const languageName = (lng) => {
    switch (lng) {
      case 'en': return 'English';
      case 'ta': return 'தமிழ்';
      case 'bn': return 'বাংলা';
      case 'te': return 'తెలుగు';
      case 'hi': return 'हिन्दी';
      default: return 'EN';
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
          id="language-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {languageName(i18n.language)}
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div
        className={`${isOpen ? 'block' : 'hidden'} origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="language-menu-button"
      >
        <div className="py-1" role="none">
          <button onClick={() => changeLanguage('en')} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left" role="menuitem">English</button>
          <button onClick={() => changeLanguage('ta')} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left" role="menuitem">தமிழ்</button>
          <button onClick={() => changeLanguage('bn')} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left" role="menuitem">বাংলা</button>
          <button onClick={() => changeLanguage('te')} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left" role="menuitem">తెలుగు</button>
          <button onClick={() => changeLanguage('hi')} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left" role="menuitem">हिन्दी</button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;