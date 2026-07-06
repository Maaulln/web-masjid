'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export const NavbarClient = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Transparansi', href: '/transparansi' }
  ];

  return (
    <>
      {/* Floating Island Wrapper */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        
        {/* The Island */}
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="pointer-events-auto w-max max-w-full p-1.5 bg-white/40 backdrop-blur-2xl ring-1 ring-emerald-950/5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2.5rem] flex items-center"
        >
          {/* Inner Core */}
          <div className="flex items-center gap-2 md:gap-8 px-4 py-2 bg-white/60 rounded-[calc(2.5rem-0.375rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mr-4 md:mr-8 group" onClick={() => setIsOpen(false)}>
              <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-[#FBFBFA] font-serif font-bold text-lg leading-none transform group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                M
              </div>
              <span className="font-bold text-sm tracking-tight text-emerald-950 hidden md:block">Masjid Miftahlul Jannah</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#787774]">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="hover:text-emerald-900 transition-colors duration-300">
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2 ml-4">
              {isLoggedIn ? (
                <Link href="/admin/dashboard" className="px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-emerald-900 hover:bg-emerald-50 transition-colors duration-300">
                  Admin
                </Link>
              ) : (
                <Link href="/login" className="px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-[#787774] hover:text-emerald-900 hover:bg-emerald-50 transition-colors duration-300">
                  Login
                </Link>
              )}
              
              <Link href="/donasi" className="p-1 bg-emerald-950/5 ring-1 ring-emerald-950/5 rounded-full group hover:scale-[0.98] transition-transform duration-500 active:scale-[0.95]">
                <div className="px-5 py-2 bg-emerald-900 text-emerald-50 rounded-full text-xs font-bold tracking-widest uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  Donasi
                </div>
              </Link>
            </div>

            {/* Mobile Hamburger Morph */}
            <button 
              className="md:hidden w-10 h-10 relative flex items-center justify-center rounded-full bg-emerald-950/5 ml-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              <div className="w-4 h-4 flex flex-col justify-between items-center relative">
                <span className={`w-full h-[1.5px] bg-emerald-950 rounded-full absolute transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'rotate-45 top-1/2 -translate-y-1/2' : 'top-0'}`} />
                <span className={`w-full h-[1.5px] bg-emerald-950 rounded-full absolute top-1/2 -translate-y-1/2 transition-opacity duration-500 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`w-full h-[1.5px] bg-emerald-950 rounded-full absolute transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? '-rotate-45 top-1/2 -translate-y-1/2' : 'bottom-0'}`} />
              </div>
            </button>

          </div>
        </motion.nav>
      </div>

      {/* Mobile Modal Expansion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-xl md:hidden flex flex-col justify-center px-8"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.div 
                  key={link.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.32, 0.72, 0, 1] }}
                >
                  <Link 
                    href={link.href} 
                    className="text-4xl font-serif text-emerald-950 tracking-tight block"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="mt-8 flex flex-col gap-4"
              >
                <Link 
                  href="/donasi" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 bg-emerald-900 text-emerald-50 rounded-full text-center text-sm font-bold tracking-widest uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                >
                  Donasi Sekarang
                </Link>
                
                <Link 
                  href={isLoggedIn ? "/admin/dashboard" : "/login"} 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 border border-emerald-950/10 text-emerald-950 rounded-full text-center text-sm font-bold tracking-widest uppercase"
                >
                  {isLoggedIn ? "Dashboard Admin" : "Login Pengurus"}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
