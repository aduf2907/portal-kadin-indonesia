
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Kamar Dagang dan Industri Indonesia (KADIN). All rights reserved.</p>
        <p className="text-sm text-slate-400 mt-2">
          Menara Kadin Indonesia, Lt. 29. Jl. H.R. Rasuna Said Blok X-5, Kav. 2-3 Jakarta 12950, Indonesia
        </p>
        <p className="text-sm text-slate-400 mt-1">
          Hubungi Admin: <a href="mailto:anggota@kadinindonesia.id" className="underline hover:text-amber-400">anggota@kadinindonesia.id</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
