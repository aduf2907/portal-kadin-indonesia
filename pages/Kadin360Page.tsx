import React from 'react';
import Card, { CardContent } from '../components/Card';
import { GlobeAltIcon, MagnifyingGlassIcon, BriefcaseIcon, ChartBarIcon, UsersIcon } from '../components/icons';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-slate-800 text-white text-sm rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
      </div>
    </div>
  );
};


const Kadin360Page: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <GlobeAltIcon className="w-10 h-10 text-sky-700" />
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Selamat Datang di KADIN 360</h1>
            <p className="text-slate-600 mt-1">Ekosistem bisnis masa depan untuk networking, wawasan pasar, dan pengembangan usaha.</p>
        </div>
      </div>

      <Card>
        <CardContent>
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-slate-800">Platform Terintegrasi untuk Bisnis Anda</h2>
                <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                    KADIN 360 adalah platform eksklusif yang dirancang untuk membantu anggota KADIN tumbuh dan berkembang di era digital. Dapatkan akses ke direktori anggota, peluang bisnis, analisis pasar, dan berbagai alat lain yang akan meningkatkan potensi bisnis Anda.
                </p>
                <div className="mt-8">
                    <a
                        href="#"
                        className="inline-block bg-amber-500 text-sky-900 font-bold px-8 py-3 rounded-md hover:bg-amber-400 transition-colors text-lg shadow-lg"
                    >
                        Jelajahi KADIN 360 Sekarang
                    </a>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200">
                <h3 className="text-xl font-bold text-center text-slate-800 mb-8">Fitur & Manfaat Utama</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    
                    <div className="flex flex-col items-center">
                        <div className="bg-sky-100 p-4 rounded-full mb-3">
                            <MagnifyingGlassIcon className="w-8 h-8 text-sky-700" />
                        </div>
                        <h4 className="font-semibold text-slate-800">
                            <Tooltip text="Temukan mitra bisnis potensial dengan filter pencarian canggih berdasarkan industri, lokasi, dan skala bisnis.">
                                <span className="border-b-2 border-dotted border-slate-400 cursor-help">
                                    Direktori Cerdas
                                </span>
                            </Tooltip>
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">Jaringan bisnis luas & terverifikasi.</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="bg-amber-100 p-4 rounded-full mb-3">
                            <BriefcaseIcon className="w-8 h-8 text-amber-700" />
                        </div>
                        <h4 className="font-semibold text-slate-800">
                             <Tooltip text="Dapatkan akses pertama ke proyek, tender, dan peluang investasi yang hanya tersedia untuk anggota KADIN.">
                                <span className="border-b-2 border-dotted border-slate-400 cursor-help">
                                    Peluang Bisnis
                                </span>
                            </Tooltip>
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">Akses proyek & tender eksklusif.</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="bg-green-100 p-4 rounded-full mb-3">
                            <ChartBarIcon className="w-8 h-8 text-green-700" />
                        </div>
                         <h4 className="font-semibold text-slate-800">
                             <Tooltip text="Manfaatkan data dan wawasan pasar terkini untuk membuat keputusan bisnis yang lebih cerdas dan strategis.">
                                <span className="border-b-2 border-dotted border-slate-400 cursor-help">
                                    Analisis Pasar
                                </span>
                            </Tooltip>
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">Data & wawasan untuk strategi bisnis.</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="bg-red-100 p-4 rounded-full mb-3">
                            <UsersIcon className="w-8 h-8 text-red-700" />
                        </div>
                        <h4 className="font-semibold text-slate-800">
                             <Tooltip text="Berpartisipasi dalam diskusi, webinar, dan acara networking virtual untuk memperluas jaringan Anda tanpa batas.">
                                <span className="border-b-2 border-dotted border-slate-400 cursor-help">
                                    Networking Virtual
                                </span>
                            </Tooltip>
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">Perluas koneksi tanpa batas.</p>
                    </div>
                </div>
            </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default Kadin360Page;