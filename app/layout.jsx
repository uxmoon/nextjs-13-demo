import { Montserrat } from 'next/font/google';
import './globals.css';
import Header from './components/Header';

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
        <Header />
        <main className='container'>{children}</main>
      </body>
    </html>
  );
}
