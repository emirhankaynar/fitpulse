import './globals.css';

export const metadata = {
  title: 'FitPulse Pro - Fitness OS & Makro Takip',
  description: 'Kalori hesaplama, AI tabak tarama, barkod motoru ve antrenman asistanı.',
  other: {
    'google-adsense-account': 'ca-pub-1372440402548858',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <meta name="google-adsense-account" content="ca-pub-1372440402548858" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1372440402548858"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="bg-[#070b14] text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}