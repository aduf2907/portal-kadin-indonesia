import React, { useState } from 'react';
import { Page } from '../types';
import Card, { CardContent, CardHeader, CardFooter } from '../components/Card';
import { KadinLogo } from '../components/KadinLogo';
import { EnvelopeIcon, CheckCircleIcon } from '../components/icons';

interface ForgotPasswordPageProps {
  navigateTo: (page: Page) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ navigateTo }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call to send reset link
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, we'll always show success
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex flex-col items-center mb-8">
        <KadinLogo className="h-16 w-16 mb-4" />
        <h1 className="text-3xl font-bold text-sky-800">Lupa Password</h1>
        <p className="text-gray-600 mt-2 text-center">
          {isSent 
            ? 'Tautan reset password telah dikirim.' 
            : 'Masukkan email Anda untuk menerima tautan reset password.'}
        </p>
      </div>

      <Card>
        {isSent ? (
          <CardContent className="text-center p-8">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800">Periksa Email Anda</h2>
            <p className="text-slate-600 mt-2">
              Kami telah mengirimkan instruksi untuk mereset password Anda ke <strong>{email}</strong>. Silakan periksa folder inbox atau spam Anda.
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                  <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
                      {error}
                  </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Email Terdaftar
                </label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                        placeholder="anda@perusahaan.com"
                    />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sky-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}
              </button>
            </CardFooter>
          </form>
        )}
      </Card>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Ingat password Anda?{' '}
          <button onClick={() => navigateTo('login')} className="font-medium text-sky-600 hover:text-sky-500">
            Kembali ke Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
