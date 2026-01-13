import React, { useEffect, useState } from "react";
import { Page, NotificationType } from "../types";
import Card, { CardContent, CardHeader, CardFooter } from "../components/Card";
import { KadinLogo } from "../components/KadinLogo";
import { GoogleIcon, LinkedInIcon } from "../components/icons";
import supabase from "@/src/supabase-client";

interface LoginPageProps {
  onLoginSuccess: (rememberMe: boolean) => void;
  navigateTo: (page: Page) => void;
  addNotification: (message: string, type: NotificationType) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  navigateTo,
  addNotification,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const params = new URLSearchParams(window.location.search);
  const redirectUrl = params.get("redirect") || "http://localhost:3000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // if (error || !data.session) {
    //   setError("Email atau password salah. Silakan coba lagi.");
    //   setIsLoading(false);
    //   return;
    // }
    // window.location.replace(redirectUrl);

    if (error) {
      setError("Email atau password salah. Silakan coba lagi.");
      setIsLoading(false);
      return;
    }
    onLoginSuccess(rememberMe);
    setIsLoading(false);
  };

  // const handleSocialLogin = (provider: "Google" | "LinkedIn") => {
  //   addNotification(
  //     `Fitur login dengan ${provider} akan segera tersedia.`,
  //     "info"
  //   );
  // };

  const handleSocialLogin = async (provider: "google" | "linkedin") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
      },
    });
  };

  // ini edit
  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data }) => {
  //     if (data.session) {
  //       window.location.replace(redirectUrl);
  //     }
  //   });
  // }, []);

  return (
    <div className="max-w-md mx-auto">
      <div className="flex flex-col items-center mb-8">
        <KadinLogo className="h-16 w-16 mb-4" />
        <h1 className="text-3xl font-bold text-sky-800">Login Anggota KADIN</h1>
        <p className="text-gray-600 mt-2 text-center">
          Masuk ke akun Anda untuk mengakses dasbor keanggotaan.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Alamat Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                placeholder="anda@perusahaan.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                placeholder="********"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Ingat saya
                  </label>
                </div>
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => navigateTo("forgotPassword")}
                    className="font-medium text-sky-600 hover:text-sky-500"
                  >
                    Lupa password?
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Masuk..." : "Masuk"}
            </button>
          </CardFooter>
        </form>
        <div className="relative my-4">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              ATAU LANJUTKAN DENGAN
            </span>
          </div>
        </div>
        <div className="px-6 pb-6 space-y-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <GoogleIcon className="w-5 h-5 mr-3" />
            Masuk dengan Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("linkedin")}
            className="w-full inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-[#0077B5] text-sm font-medium text-white hover:bg-[#006097]"
          >
            <LinkedInIcon className="w-5 h-5 mr-3 text-white" />
            Masuk dengan LinkedIn
          </button>
        </div>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Belum punya akun?{" "}
          <button
            onClick={() => navigateTo("register")}
            className="font-medium text-sky-600 hover:text-sky-500"
          >
            Daftar sekarang
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
