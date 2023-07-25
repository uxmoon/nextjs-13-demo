import { Montserrat } from 'next/font/google';
import './globals.css';
// import { Inter } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const metadata = {
  title: 'Next.js 13 crash course',
  description: 'Web development tutorial',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={montserrat.className}>
        <main className='container'>{children}</main>
      </body>
    </html>
  );
}
