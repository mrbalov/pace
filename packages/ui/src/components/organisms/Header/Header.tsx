import Link from 'next/link';

import ActivityEmoji from '@/components/molecules/ActivityEmoji';

import HeaderActions from './HeaderActions';

/**
 * Logo linking to home page.
 * @returns {JSX.Element} Logo component.
 */
const Logo = () => (
  <Link href="/" className="text-inherit no-underline">
    <h3 className="m-0 font-bold cursor-pointer flex items-center gap-2 text-xl">
      <ActivityEmoji />
      {'\u00A0'}
      TORQ
    </h3>
  </Link>
);

/**
 * Application header.
 * @returns {JSX.Element} Header component.
 */
const Header = () => (
  <header className="fixed top-0 left-0 right-0 h-[60px] w-full flex items-center justify-center bg-background px-4 box-border z-[999]">
    <div className="flex items-center justify-between w-full h-full max-w-[1000px] border-b border-border">
      <Logo />
      <HeaderActions />
    </div>
  </header>
);

export default Header;
