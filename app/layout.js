import './globals.css';

export const metadata = {
  title: 'FitPulse ⚡ Akıllı Kalori & Makro Asistanı',
  description: 'Günlük TDEE kalori, protein ve makro hesaplayıcı.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-[#070b14] text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}