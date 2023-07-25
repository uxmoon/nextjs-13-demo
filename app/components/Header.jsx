import Link from 'next/link';

const Header = () => {
  return (
    <header className='header'>
      <div className='container'>
        <div className='logo'>
          <Link href='/'>Home</Link>
        </div>
        <div className='links'>
          <Link href='/'>About</Link>
          <Link href='/about'>Our team</Link>
          <Link href='/code/repos'>Code</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
