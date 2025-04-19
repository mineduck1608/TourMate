import React, { useEffect, useState } from 'react';

const AuthSwitcher: React.FC = () => {
  const [hoveringRegister, setHoveringRegister] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative flex bg-transparent overflow-hidden w-fit p-1">
      <button
        className={`transition-all duration-300 px-6 py-2 rounded-[13px] z-10
          ${isAtTop ? 'text-white' : ''}
          ${hoveringRegister ? 'bg-transparent text-black' : 'bg-black text-white'}
        `}
      >
        ĐĂNG NHẬP
      </button>

      <button
        onMouseEnter={() => setHoveringRegister(true)}
        onMouseLeave={() => setHoveringRegister(false)}
        className={`transition-all duration-300 px-6 py-2 rounded-[13px] z-10
          ${isAtTop ? 'text-white' : ''}
          ${hoveringRegister ? 'bg-black text-white' : 'bg-transparent text-black'}
        `}
      >
        ĐĂNG KÝ
      </button>
    </div>
  );
};

export default AuthSwitcher;
