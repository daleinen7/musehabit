'use client';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

type NavItem = {
  url?: string;
  func?: () => void;
  text: string;
  auth?: boolean;
  function?: string;
};

const NavItem = ({ url, func, text }: NavItem) => (
  <li
    key={url}
    className="font-satoshi text-lg font-medium text-gray-500 hover:text-black"
  >
    {url ? (
      <Link href={url}>{text}</Link>
    ) : (
      <button onClick={func}>{text}</button>
    )}
  </li>
);

const Nav = () => {
  const { user, signOut } = useAuth();

  const handleLogOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log('ERROR: ', error);
    }
  };

  return (
    <nav className="bg-slate-200 py-3">
      <ul className="width-wrapper w-full flex justify-between items-center">
        <li>
          <Link href="/">
            <h1 className="font-satoshi text-4xl font-bold">Musehabit</h1>
          </Link>
        </li>
        <div className="flex gap-6 items-center">
          <NavItem url="/about" text="About" />
          {user ? (
            <NavItem func={handleLogOut} text="Log Out" />
          ) : (
            <>
              <NavItem url="/login" text="Log In" />
              <NavItem url="/signup" text="Sign Up" />
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};
export default Nav;
