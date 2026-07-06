'use client';
import React from 'react';
import { SignOut as LogOut } from '@phosphor-icons/react/dist/ssr';
import { signOut } from 'next-auth/react';

export const MobileLogoutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="p-2.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors active:scale-95 shadow-sm border border-red-100"
      aria-label="Logout"
    >
      <LogOut size={20} weight="bold" />
    </button>
  );
};
