import React, { useEffect, useState } from "react";
import { DashboardTab, NotificationType } from "../types";
import DashboardSidebar from "../components/DashboardSidebar";
import Card, { CardContent, CardHeader, CardFooter } from "../components/Card";
import { ArrowUpOnSquareIcon, DocumentTextIcon } from "../components/icons";
import MembershipCard from "../components/MembershipCard";
import ProfilTab from "../components/ProfilTab";
import supabase from "@/src/supabase-client";

interface DashboardPageProps {
  addNotification: (message: string, type: NotificationType) => void;
}

const WelcomeBanner: React.FC<{ user: any; company: any }> = ({
  user,
  company,
}) => {
  return (
    <div className="bg-gradient-to-r from-sky-700 to-sky-500 rounded-xl shadow-lg p-8 mb-8 text-white relative overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-3xl font-bold">
          Selamat Datang, {user?.name ?? "Member"}!
        </h1>
        <p className="mt-2 text-sky-200">
          Ini adalah dasbor keanggotaan Anda di KADIN.
        </p>
        <p className="mt-1 text-sky-200">
          {company?.company_name ?? "-"} | NIK:{" "}
          {user?.ktp ? user.ktp.substring(0, 6) + "..." : "-"} | | NIB:{" "}
          {user?.nib ?? "-"}
        </p>
      </div>
      <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full"></div>
      <div className="absolute -top-12 -right-16 w-48 h-48 bg-white/10 rounded-full"></div>
    </div>
  );
};

const QuickActions: React.FC<{
  addNotification: (message: string, type: NotificationType) => void;
}> = ({ addNotification }) => {
  const handleActionClick = (action: string) => {
    addNotification(`Fitur "${action}" akan segera tersedia.`, "info");
  };
  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold text-lg text-gray-900">Aksi Cepat</h3>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <button
          onClick={() => handleActionClick("Perpanjang KTA")}
          className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
            <DocumentTextIcon className="w-6 h-6" />
          </div>
          <span className="mt-2 text-sm font-semibold text-gray-700">
            Perpanjang KTA
          </span>
        </button>
        <button
          onClick={() => handleActionClick("Upload Dokumen")}
          className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
            <ArrowUpOnSquareIcon className="w-6 h-6" />
          </div>
          <span className="mt-2 text-sm font-semibold text-gray-700">
            Upload Dokumen
          </span>
        </button>
      </CardContent>
    </Card>
  );
};

const initialCompanyData = {
  companyName: "PT. Maju Mundur Sejahtera",
  nib: "1234567890123",
  npwp: "01.234.567.8-901.000",
};

const PerusahaanTab: React.FC<{
  addNotification: (message: string, type: NotificationType) => void;
}> = ({ addNotification }) => {
  const [companyData, setCompanyData] = useState(initialCompanyData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCompany = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        setCompanyData(data);
      }
    };
    loadCompany();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      addNotification("User tidak ditemukan.", "error");
      return;
    }

    const payload = {
      user_id: user.id,
      company_name: companyData.companyName,
      nib: companyData.nib,
      npwp: companyData.npwp,
    };

    const { error } = await supabase.from("companies").upsert(payload);
    setIsLoading(false);

    if (error) {
      addNotification("Gagal menyimpan data perusahaan.", "error");
      console.log(error);
    } else {
      addNotification("Data perusahaan berhasil diperbaharui.", "success");
    }
  };

  const handleCancel = () => {
    setCompanyData(initialCompanyData);
    addNotification("Perubahan data perusahaan dibatalkan.", "info");
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <h2 className="text-xl font-bold">Data Perusahaan</h2>
          <p className="text-sm text-gray-600 mt-1">
            Kelola data legalitas dan informasi detail mengenai perusahaan Anda.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Perusahaan
            </label>
            <input
              type="text"
              name="companyName"
              id="companyName"
              value={companyData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label
              htmlFor="nib"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              NIB (Nomor Induk Berusaha)
            </label>
            <input
              type="text"
              name="nib"
              id="nib"
              value={companyData.nib}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label
              htmlFor="npwp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              NPWP (Nomor Pokok Wajib Pajak)
            </label>
            <input
              type="text"
              name="npwp"
              id="npwp"
              value={companyData.npwp}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-white border border-slate-300 text-slate-800 font-semibold py-2 px-6 rounded-md hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-sky-700 text-white font-semibold py-2 px-6 rounded-md hover:bg-sky-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
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
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </CardFooter>
      </form>
    </Card>
  );
};

// Add other tab components as placeholders
const AnggotaTab: React.FC = () => (
  <Card>
    <CardHeader>
      <h2 className="text-xl font-bold">Kelola Anggota</h2>
    </CardHeader>
    <CardContent>
      <p>Tambahkan atau hapus anggota yang terhubung dengan perusahaan Anda.</p>
    </CardContent>
  </Card>
);
const PembayaranTab: React.FC = () => (
  <Card>
    <CardHeader>
      <h2 className="text-xl font-bold">Pembayaran & Tagihan</h2>
    </CardHeader>
    <CardContent>
      <p>Lihat riwayat pembayaran dan tagihan KTA Anda.</p>
    </CardContent>
  </Card>
);
const PengaturanTab: React.FC = () => (
  <Card>
    <CardHeader>
      <h2 className="text-xl font-bold">Pengaturan Akun</h2>
    </CardHeader>
    <CardContent>
      <p>Ubah password dan pengaturan keamanan akun Anda.</p>
    </CardContent>
  </Card>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ addNotification }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("profil");

  const [userData, setUserData] = useState<any>(null);
  const [companyData, setCompanyData] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      setUserData(data);
    };

    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", auth.user.id)
      .single();
    setUserData(data);
  };
  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", auth.user.id)
        .single();

      setUserData(data);
    };

    getUser();
  }, []);

  useEffect(() => {
    const loadCompany = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) return;

      const { data } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setCompanyData(data);
    };
    loadCompany();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "profil":
        return (
          <ProfilTab
            addNotification={addNotification}
            user={userData}
            onProfileUpdated={loadUser}
          />
        );
      case "perusahaan":
        return <PerusahaanTab addNotification={addNotification} />;
      case "anggota":
        return <AnggotaTab />;
      case "pembayaran":
        return <PembayaranTab />;
      case "pengaturan":
        return <PengaturanTab />;
      default:
        return (
          <ProfilTab
            addNotification={addNotification}
            user={userData}
            onProfileUpdated={loadUser}
          />
        );
    }
  };

  return (
    <>
      <WelcomeBanner user={userData} company={companyData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-center">
        <MembershipCard user={userData} />
        <QuickActions addNotification={addNotification} />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>
        <section className="w-full md:w-3/4">{renderContent()}</section>
      </div>
    </>
  );
};

export default DashboardPage;
