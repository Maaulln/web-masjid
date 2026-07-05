import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NavbarClient } from './NavbarClient';

export const Navbar = async () => {
  const session = await getServerSession(authOptions);
  
  return (
    <NavbarClient isLoggedIn={!!session} />
  );
};
