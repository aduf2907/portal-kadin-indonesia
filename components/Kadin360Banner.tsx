import React from 'react';
import { GlobeAltIcon } from './icons';
import { Page } from '../types';

interface Kadin360BannerProps {
  navigateTo: (page: Page) => void;
  isAuthenticated: boolean;
}

const Kadin360Banner: React.FC<Kadin360BannerProps> = ({ navigateTo, isAuthenticated }) => {
  const handleClick = () => {
    navigateTo(isAuthenticated ? 'kadin360' : 'login');
  };

  return (
    <div className="bg-gradient-to-r from-sky-800 to-sky-600 mt-12">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="hidden sm:block flex-shrink-0">
              <GlobeAltIcon className="w-20 h-20 text-sky-300 opacity-80" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">
                Tingkatkan Potensi Bisnis Anda dengan KADIN 360
              </h2>
              <p className="mt-2 text-sky-200 max-w-2xl">
                Platform eksklusif untuk networking, wawasan pasar, dan pengembangan usaha yang terintegrasi. Bergabunglah dengan ekosistem bisnis masa depan.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 mt-6 md:mt-0">
            <button
              onClick={handleClick}
              className="inline-block bg-amber-500 text-sky-900 font-bold px-8 py-3 rounded-md hover:bg-amber-400 transition-colors text-lg shadow-lg"
            >
              Gabung Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kadin360Banner;