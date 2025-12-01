
import React from 'react';
import { DashboardTab } from '../types';
import { UserCircleIcon, BuildingOffice2Icon, UsersIcon, CreditCardIcon, Cog6ToothIcon } from './icons';
import Card, { CardContent } from './Card';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

const menuItems = [
  { id: 'profil', label: 'Profil Saya', icon: <UserCircleIcon className="w-6 h-6" /> },
  { id: 'perusahaan', label: 'Data Perusahaan', icon: <BuildingOffice2Icon className="w-6 h-6" /> },
  { id: 'anggota', label: 'Kelola Anggota', icon: <UsersIcon className="w-6 h-6" /> },
  { id: 'pembayaran', label: 'Pembayaran & Tagihan', icon: <CreditCardIcon className="w-6 h-6" /> },
  { id: 'pengaturan', label: 'Pengaturan Akun', icon: <Cog6ToothIcon className="w-6 h-6" /> },
];

const SidebarButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ isActive, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-md transition-colors ${
        isActive
          ? 'bg-sky-100 text-sky-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Card>
      <CardContent className="p-2">
        <nav className="flex flex-col gap-1">
          {menuItems.map(item => (
            <SidebarButton
              key={item.id}
              isActive={activeTab === item.id}
              onClick={() => setActiveTab(item.id as DashboardTab)}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};

export default DashboardSidebar;
