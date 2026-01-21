import React, { useState, useEffect } from "react";
import {
  Page,
  RegistrationType,
  MembershipType,
  NotificationType,
} from "../types";
import Card, { CardContent, CardHeader, CardFooter } from "../components/Card";
import {
  ChevronRightIcon,
  CheckCircleIcon,
  GoogleIcon,
  LinkedInIcon,
  ExclamationTriangleIcon,
  EyeIcon,
} from "../components/icons";
import supabase from "@/src/supabase-client";

interface RegistrationPageProps {
  registrationType: RegistrationType;
  navigateTo: (page: Page) => void;
  addNotification: (message: string, type: NotificationType) => void;
}

type Step = "TYPE_SELECTION" | "ACCOUNT_CREATION" | "OTP" | "SUCCESS";

const StepIndicator: React.FC<{ currentStep: number; steps: string[] }> = ({
  currentStep,
  steps,
}) => (
  <nav className="flex items-center justify-center" aria-label="Progress">
    <ol className="flex items-center space-x-2 sm:space-x-4">
      {steps.map((step, index) => (
        <li key={step}>
          <div className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-5 w-5 text-gray-300 mx-2" />
            )}
            <span
              className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full ${
                index < currentStep
                  ? "bg-sky-600"
                  : index === currentStep
                  ? "border-2 border-sky-600 bg-sky-100"
                  : "border-2 border-gray-300 bg-white"
              }`}
            >
              {index < currentStep ? (
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              ) : (
                <span
                  className={`${
                    index === currentStep ? "text-sky-600" : "text-gray-500"
                  } font-bold`}
                >
                  {index + 1}
                </span>
              )}
            </span>
            <span className="hidden sm:inline-block ml-3 font-medium text-sm text-gray-700">
              {step}
            </span>
          </div>
        </li>
      ))}
    </ol>
  </nav>
);

const RegistrationPage: React.FC<RegistrationPageProps> = ({
  registrationType,
  navigateTo,
  addNotification,
}) => {
  const [step, setStep] = useState<Step>("TYPE_SELECTION");
  const [membershipType, setMembershipType] = useState<MembershipType | "">("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    ktp: "",
    nib: "",
    npwp: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const steps = ["Tipe KTA", "Buat Akun", "Verifikasi", "Selesai"];
  const currentStepIndex = [
    "TYPE_SELECTION",
    "ACCOUNT_CREATION",
    "OTP",
    "SUCCESS",
  ].indexOf(step);

  useEffect(() => {
    let timer: number;
    if (resendCooldown > 0) {
      timer = window.setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeSelection = (type: MembershipType) => {
    setMembershipType(type);
    setStep("ACCOUNT_CREATION");
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      addNotification("Password dan konfirmasi password tidak cocok.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone,
            ktp: formData.ktp,
            nib: formData.nib,
            npwp: formData.npwp,
            membership_type: membershipType,
          },
        },
      });
      if (error) throw error;
      addNotification(`Kode OTP telah dikirim ke ${formData.email}`, "info");
      setStep("OTP");
      setResendCooldown(30);
    } catch (error: any) {
      addNotification(`Gagal mengirim OTP: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) return;

    // Simulate resending OTP
    console.log("Resending OTP to", formData.email);
    addNotification(`Kode OTP baru telah dikirim ke ${formData.email}`, "info");
    setResendCooldown(30); // Reset cooldown to 30 seconds
    setOtpError(""); // Clear previous errors
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOtpError("");

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: otp,
        type: "email",
      });
      if (verifyError) throw verifyError;

      // dapatkan session & user
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) throw new Error("User session tidak ditemukan.");

      // SET PASSWORD di Supabase Auth (lebih aman)
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
      });
      if (updateError) throw updateError;

      // insert profil ke tabel users tanpa password
      const { error: insertError } = await supabase.from("users").insert({
        id: user.id,
        name: formData.name,
        phone: formData.phone,
        ktp: formData.ktp,
        nib: formData.nib,
        npwp: formData.npwp,
        email: formData.email,
        membership_type: membershipType,
        address: formData.address,
      });
      if (insertError) throw insertError;

      addNotification("Kode OTP benar! Akun berhasil dibuat.", "success");
      setStep("SUCCESS");
    } catch (err: any) {
      setOtpError("Kode OTP salah atau sudah kadaluwarsa.");
      addNotification(`Verifikasi OTP gagal: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "Google" | "LinkedIn") => {
    if (provider === "Google") {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });

      if (error) {
        addNotification("Gagal login dengan Google.", "error");
      }
      return;
    }

    if (provider === "LinkedIn") {
      addNotification("Login dengan LinkedId belum tersedia.", "info");
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "TYPE_SELECTION":
        return (
          <>
            <h3 className="text-xl font-semibold text-center">
              Pilih Tipe KTA
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => handleTypeSelection("Anggota Biasa (AB)")}
                className="p-6 border-2 rounded-lg text-left hover:border-sky-500 hover:bg-sky-50 transition"
              >
                <h4 className="font-bold text-lg">Anggota Biasa (AB)</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Untuk Badan Hukum / Perusahaan (PT, CV, dsb.)
                </p>
              </button>
              <button
                onClick={() => handleTypeSelection("Anggota Luar Biasa (ALB)")}
                className="p-6 border-2 rounded-lg text-left hover:border-sky-500 hover:bg-sky-50 transition"
              >
                <h4 className="font-bold text-lg">Anggota Luar Biasa (ALB)</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Untuk Asosiasi Usaha tingkat Pusat, Provinsi, atau
                  Kabupaten/Kota.
                </p>
              </button>
            </div>
          </>
        );
      case "ACCOUNT_CREATION":
        return (
          <>
            <div className="mb-6 space-y-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <GoogleIcon className="w-5 h-5 mr-3" />
                Daftar dengan Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("LinkedIn")}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm bg-[#0077B5] text-sm font-medium text-white hover:bg-[#006097]"
              >
                <LinkedInIcon className="w-5 h-5 mr-3 text-white" />
                Daftar dengan LinkedIn
              </button>
            </div>

            <div className="relative my-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  ATAU DAFTAR DENGAN EMAIL
                </span>
              </div>
            </div>

            <form onSubmit={handleAccountSubmit}>
              <h3 className="text-xl font-semibold text-center">
                Buat Akun di Sistem KTA
              </h3>
              <p className="text-center text-sm text-gray-500 mt-1">
                Tipe KTA: <strong>{membershipType}</strong>
              </p>
              <div className="space-y-4 mt-6">
                <input
                  name="name"
                  placeholder="Nama Lengkap Penanggung Jawab"
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
                <input
                  name="phone"
                  placeholder="Nomor Handphone"
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
                <input
                  name="ktp"
                  placeholder="No. KTP"
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
                <input
                  name="nib"
                  placeholder="No. NIB (Nomor Induk Berusaha)"
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
                <input
                  name="npwp"
                  placeholder="No. NPWP (Nomor Pokok Wajib Pajak)"
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi Password"
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <CardFooter className="p-0 pt-6 mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-sky-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-800 transition-colors disabled:bg-slate-400"
                >
                  {isLoading ? "Memproses..." : "Buat Akun & Kirim OTP"}
                </button>
              </CardFooter>
            </form>
          </>
        );
      case "OTP":
        return (
          <form onSubmit={handleOtpSubmit}>
            <h3 className="text-xl font-semibold text-center">
              Masukkan Kode OTP
            </h3>
            <p className="text-center text-sm text-gray-500 mt-2">
              Kode OTP telah dikirim ke email <strong>{formData.email}</strong>.
            </p>
            {otpError && (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md text-sm text-center">
                {otpError}
              </div>
            )}
            <div className="relative mt-6">
              <input
                name="otp"
                placeholder="6-digit kode OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                className={`w-full bg-white text-center tracking-[1em] text-2xl font-bold px-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  otpError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : isVerified
                    ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                    : "border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-400"
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
                ) : otpError ? (
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                ) : isVerified ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : null}
              </div>
            </div>
            {/* <div className="mt-2 p-2 bg-amber-100 text-amber-800 text-sm rounded-md text-center">
              Untuk demo, gunakan OTP: <strong>123456</strong>
            </div> */}
            <div className="mt-4 text-center text-sm">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className="font-medium text-sky-600 hover:text-sky-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Kirim Ulang OTP{" "}
                {resendCooldown > 0 ? `(${resendCooldown}d)` : ""}
              </button>
            </div>
            <CardFooter className="p-0 pt-6 mt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sky-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-800 transition-colors disabled:bg-slate-400"
              >
                {isLoading ? "Verifikasi..." : "Verifikasi & Lanjutkan"}
              </button>
            </CardFooter>
          </form>
        );
      case "SUCCESS":
        return (
          <div className="text-center">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold mt-4">
              Pendaftaran Akun Berhasil!
            </h3>
            <p className="text-gray-600 mt-2">
              Sebuah notifikasi konfirmasi telah dikirimkan. Silakan login untuk
              melengkapi data perusahaan dan melanjutkan proses pendaftaran KTA.
            </p>
            <button
              onClick={() => navigateTo("login")}
              className="mt-8 w-full bg-sky-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-800 transition-colors"
            >
              Login ke Sistem KTA
            </button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-sky-800">{registrationType}</h1>
        <p className="text-gray-600">
          Ikuti langkah-langkah berikut untuk menyelesaikan pendaftaran.
        </p>
      </div>

      <div className="mb-10">
        <StepIndicator currentStep={currentStepIndex} steps={steps} />
      </div>

      <Card>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>
    </div>
  );
};

export default RegistrationPage;
