import { Geist, Geist_Mono, Inter as InterFont } from "next/font/google";
import "./globals.css";

const inter = InterFont({
  subsets: ['latin'],
  weight: ['400', '500', '700'], 
  variable: '--font-inter',  
});

export const metadata = {
  title: 'My App',
  description: '...',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
