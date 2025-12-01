import React, { useState, useRef, useEffect } from "react";
import { NotificationType } from "../types";
import Card, { CardContent, CardHeader, CardFooter } from "./Card";
import { MapPinIcon } from "./icons";
import supabase from "@/src/supabase-client";

interface ProfilTabProps {
  addNotification: (message: string, type: NotificationType) => void;
  user: any;
  onProfileUpdated?: () => void;
}

const initialProfileData = {
  name: "Budi Santoso",
  email: "anggota@kadin.id",
  phone: "081234567890",
  address: "Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan",
};
const initialAvatarData = "https://randomuser.me/api/portraits/men/1.jpg";
const TEMP_AVATAR_KEY = "kadin_temp_avatar";

const ProfilTab: React.FC<ProfilTabProps> = ({ addNotification, user }) => {
  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
  });
  const [avatar, setAvatar] = useState(
    // () => localStorage.getItem(TEMP_AVATAR_KEY) || initialAvatarData
    user?.avatar_url || initialAvatarData
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [errors, setErrors] = useState<{ address?: string; email?: string }>(
    {}
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (name === "address" && errors.address) {
      setErrors((prevErrors) => ({ ...prevErrors, address: undefined }));
    }
    if (name === "email" && errors.email) {
      setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (e.target.files && e.target.files[0]) {
    //   const file = e.target.files[0];
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     const result = reader.result as string;
    //     setAvatar(result);
    //     localStorage.setItem(TEMP_AVATAR_KEY, result);
    //   };
    //   reader.readAsDataURL(file);
    // }
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    setIsLoading(true);

    // Upload file ke supabase storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      addNotification("Gagal mengupload foto.", "error");
      setIsLoading(false);
      return;
    }
    // Ambil URL file
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;

    // Simpan URL avatar ke table users
    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id);

    if (updateError) {
      addNotification("Gagal menyimpan URL avatar.", "error");
      setIsLoading(false);
      return;
    }

    // Update avatar di UI
    setAvatar(avatarUrl);
    addNotification("Foto profil berhasil diperbaharui!", "success");
    setIsLoading(false);
  };

  const validateForm = (): boolean => {
    const newErrors: { address?: string; email?: string } = {};

    // Address validation
    if (profile.address.trim().length === 0) {
      newErrors.address = "Alamat tidak boleh kosong.";
    } else if (profile.address.trim().length < 10) {
      newErrors.address = "Alamat harus memiliki setidaknya 10 karakter.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.email.trim()) {
      newErrors.email = "Email tidak boleh kosong.";
    } else if (!emailRegex.test(profile.email)) {
      newErrors.email = "Format email tidak valid.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase
      .from("users")
      .update({
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
      })
      .eq("id", user.id);

    setIsLoading(false);

    if (error) {
      addNotification("Gagal memperbaharui profil.", "error");
    } else {
      addNotification("Profil berhasil diperbaharui.", "success");
    }
    // if (!validateForm()) {
    //   return;
    // }
    // setIsLoading(true);
    // // Simulate API call to save data
    // setTimeout(() => {
    //   setIsLoading(false);
    //   addNotification("Profil berhasil diperbarui.", "success");
    //   localStorage.removeItem(TEMP_AVATAR_KEY);
    //   console.log("Saved data:", { ...profile, avatar });
    // }, 1500);
  };

  const handleCancel = () => {
    setProfile(initialProfileData);
    setAvatar(initialAvatarData);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    localStorage.removeItem(TEMP_AVATAR_KEY);
    addNotification("Perubahan dibatalkan.", "info");
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      addNotification("Geolocation is not supported by your browser.", "error");
      return;
    }

    setIsFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Simulate reverse geocoding with a delay
        setTimeout(() => {
          const fakeAddress = `Jl. Contoh Alamat No. 123, Dekat Koordinat (${latitude.toFixed(
            4
          )}, ${longitude.toFixed(4)})`;
          setProfile((prev) => ({ ...prev, address: fakeAddress }));
          setErrors((prev) => ({ ...prev, address: undefined }));
          addNotification("Address updated with current location.", "success");
          setIsFetchingLocation(false);
        }, 1000);
      },
      (error) => {
        let errorMessage = "An unknown error occurred while fetching location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Geolocation permission denied. Please enable it in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        }
        addNotification(errorMessage, "error");
        setIsFetchingLocation(false);
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Profil Saya</h2>
        <p className="text-sm text-gray-600 mt-1">
          Perbarui informasi kontak dan data pribadi Anda.
        </p>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
            <img
              src={user?.avatar_url ?? avatar}
              alt="Current avatar"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-200"
            />
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-800 font-semibold rounded-md hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 text-sm"
              >
                Ubah Foto
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/png, image/jpeg"
              />
              <p className="text-xs text-slate-500 mt-2">
                JPG, GIF atau PNG. Ukuran maks 5MB.
              </p>
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={profile.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 transition-colors ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-sky-500"
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nomor Handphone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Alamat
              </label>
              <button
                type="button"
                onClick={handleGeolocate}
                disabled={isFetchingLocation}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center gap-1"
              >
                {isFetchingLocation ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
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
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <MapPinIcon className="w-4 h-4" />
                    <span>Gunakan lokasi saat ini</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              name="address"
              id="address"
              value={profile.address}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-sky-500 transition-colors ${
                errors.address
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-sky-500"
              }`}
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? "address-error" : undefined}
            ></textarea>
            {errors.address && (
              <p id="address-error" className="mt-1 text-sm text-red-600">
                {errors.address}
              </p>
            )}
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

export default ProfilTab;
