"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './button';
import { Mail, Menu, X, User } from "lucide-react"
import LoginModal from '../../components/login-modal';
import SignUpModal from '../sign-up-modal';
import { useAuth } from '../../lib/hooks/useAuth';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses' },
    { href: '/teach', label: 'Teach' },
    { href: '/lease', label: 'Lease' },
    { href: '/profile', label: 'Profile' },
  ];
  
  // Update the desktop and mobile menu to include these new links

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b-2 border-white py-2 px-4 rounded-md">
      <div className="flex items-center justify-between w-full">
        <Link href="/" className="w-[2rem] lg:w-[4rem] h-auto">
          <Image src="/logo.png" alt="Logo" className="mr-8 w-full" width={60} height={60} />
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4 w-full ml-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-gray-300 ${
                pathname === link.href ? 'text-gray-400' : 'text-pink-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Buttons */}
        {user ? (
          <Link href="/profile" className="flex items-center text-pink-100">
            <User className="w-6 h-6 mr-2" />
            <span>{user.displayName || 'Profile'}</span>
          </Link>
        ) : (
          <>
            <Button className="w-auto mr-2" onClick={() => setIsSignUpModalOpen(true)}>
              Sign Up
            </Button>
            <Button className="w-auto" onClick={() => setIsLoginModalOpen(true)}>
              Login
            </Button>
          </>
        )}

      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2 px-4 hover:bg-gray-700 ${
                pathname === link.href ? 'text-gray-400' : 'text-pink-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Link
              href="/profile"
              className="flex items-center text-pink-100 py-2 px-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="w-6 h-6 mr-2" />
              <span>{user.displayName || 'Profile'}</span>
            </Link>
          ) : (
            <>
              <Button className="w-full mt-2" onClick={() => setIsSignUpModalOpen(true)}>
                Sign Up
              </Button>
              <Button className="w-full mt-2" onClick={() => setIsLoginModalOpen(true)}>
                Login
              </Button>
            </>
          )}
        </div>
      )}

      {/* Add the LoginModal component */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <SignUpModal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} />
    </nav>
  );
};

export default Navbar;