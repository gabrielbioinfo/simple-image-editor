import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { Bars4Icon, XMarkIcon } from '@heroicons/react/16/solid';

import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold">Simple Image Editor</Link>
      </div>
      <nav className="hidden md:flex space-x-4">
        {isSignedIn ? <UserButton /> : <SignInButton />}
      </nav>
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars4Icon className="h-6 w-6" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-gray-700 rounded-md p-4">
          {isSignedIn ? <UserButton /> : <SignInButton />}
        </div>
      )}
    </header>
  );
};

export default Header;