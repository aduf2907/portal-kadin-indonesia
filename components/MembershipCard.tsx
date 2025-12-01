import React from "react";
import { KadinLogo } from "./KadinLogo";

const MembershipCard: React.FC<{ user: any }> = ({ user }) => {
  const member = {
    name: user?.name ?? "Member",
    company: user?.company ?? "Perusahaan tidak ditemukan",
    ktaNumber: "10201-1234567890",
    membershipType: user?.membership_type,
    expiryDate: "31 DES 2024",
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
  };

  const qrCodeData = `KADIN_MEMBER_KTA:${member.ktaNumber}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
    qrCodeData
  )}&bgcolor=ffffff&qzone=1`;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-sky-800 to-sky-600 text-white rounded-2xl shadow-2xl p-6 relative overflow-hidden aspect-[85.6/53.98] flex flex-col justify-between bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_rgba(255,255,255,0)_60%)]">
        {/* Subtle Watermark */}
        <KadinLogo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 text-white opacity-10 pointer-events-none" />

        {/* Smart Chip Element */}
        <div className="absolute top-6 left-6 w-12 h-9 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md shadow-inner">
          <div className="w-full h-full border border-yellow-600/50 rounded-md grid grid-cols-2 gap-px p-1">
            <span className="bg-yellow-600/50 rounded-sm"></span>
            <span className="bg-yellow-600/50 rounded-sm"></span>
            <span className="bg-yellow-600/50 rounded-sm"></span>
            <span className="bg-yellow-600/50 rounded-sm"></span>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center gap-2 self-end relative z-10">
          <KadinLogo className="h-8 w-8" />
          <div>
            <h2 className="font-bold text-sm tracking-wider">
              KARTU TANDA ANGGOTA
            </h2>
            <p className="text-xs opacity-80">
              Kamar Dagang dan Industri Indonesia
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-between items-end relative z-10">
          {/* Left Side: Info & Photo */}
          <div>
            <p className="font-bold text-xl tracking-wide">{member.name}</p>

            <div className="flex items-end gap-4 pt-2">
              <img
                src={user?.avatar_url ?? member.avatarUrl}
                alt="Member Photo"
                className="w-16 h-20 rounded-lg border-2 border-white/50 object-cover"
              />
              <div className="space-y-1">
                <p className="font-mono text-sm tracking-wider bg-black/20 px-2 py-1 rounded-md inline-block">
                  {member.ktaNumber}
                </p>
                <p className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full inline-block">
                  {member.membershipType}
                </p>
                <div className="pt-1">
                  <p className="text-xs opacity-80">Berlaku Hingga</p>
                  <p className="font-semibold">{member.expiryDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: QR Code */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-1 rounded-md shadow-md">
              <img
                src={qrCodeUrl}
                alt="QR Code Identifikasi Anggota"
                className="w-24 h-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;
