import React, { useState, useEffect, useRef } from "react";
import { Page, AppNotification, NotificationType } from "../types";
import { KadinLogo } from "./KadinLogo";
import { Cog6ToothIcon } from "./icons";
import supabase from "@/src/supabase-client";
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "./icons";

// Inlined hook to handle clicks outside a component
const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, callback]);

  return ref;
};

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
  switch (type) {
    case "success":
      return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
    case "warning":
      return <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />;
    case "info":
      return <InformationCircleIcon className="w-6 h-6 text-sky-500" />;
    case "error":
      return <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />;
    default:
      return null;
  }
};

const timeSince = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "just now";
};

const NotificationBell: React.FC<{
  notifications: AppNotification[];
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
}> = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const ref = useOutsideClick(() => setIsOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-sky-700 focus:outline-none"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 border-2 border-white"
            aria-hidden="true"
          ></span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50">
          <div className="p-3 flex justify-between items-center border-b">
            <h3 className="font-semibold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-sm text-sky-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              [...notifications].reverse().map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onMarkAsRead(notif.id)}
                  className={`flex items-start gap-3 p-3 border-b cursor-pointer hover:bg-slate-50 ${
                    !notif.read ? "bg-sky-50" : ""
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <NotificationIcon type={notif.type} />
                  </div>
                  <div className="flex-grow">
                    <p
                      className={`text-sm ${
                        !notif.read
                          ? "font-semibold text-slate-800"
                          : "text-slate-600"
                      }`}
                    >
                      {notif.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {timeSince(notif.timestamp)}
                    </p>
                  </div>
                  {!notif.read && (
                    <div
                      className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0"
                      aria-label="Unread"
                    ></div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-slate-500">
                <p>You have no new notifications.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const NavLink: React.FC<{
  page: Page;
  currentPage: Page;
  navigateTo: (page: Page) => void;
  children: React.ReactNode;
}> = ({ page, currentPage, navigateTo, children }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => navigateTo(page)}
      className={`font-semibold px-3 py-2 rounded-md text-sm transition-colors ${
        isActive
          ? "bg-sky-100 text-sky-700"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
};

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  navigateTo: (page: Page) => void;
  currentPage: Page;
  notifications: AppNotification[];
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isAuthenticated,
  onLogout,
  navigateTo,
  currentPage,
  notifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const { data, error } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (!error && data?.is_admin) {
        setIsAdmin(true);
      }
    };

    checkAdmin();
  }, []);

  const handleLogoutRequest = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    // Simulate API call for logout
    setTimeout(() => {
      onLogout();
      // Reset state, although component will likely unmount
      setShowLogoutConfirm(false);
      setIsLoggingOut(false);
    }, 1500);
  };

  const handleCancelLogout = () => {
    if (isLoggingOut) return;
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigateTo(isAuthenticated ? "dashboard" : "home")}
          >
            <KadinLogo className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-amber-600 leading-tight">
                KADIN
              </span>
              <span className="text-sm text-slate-600 leading-tight">
                Indonesia
              </span>
            </div>
          </div>
          <nav className="flex items-center gap-8">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-4">
                  <NavLink
                    page="dashboard"
                    currentPage={currentPage}
                    navigateTo={navigateTo}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    page="berita"
                    currentPage={currentPage}
                    navigateTo={navigateTo}
                  >
                    Berita
                  </NavLink>
                  <NavLink
                    page="agenda"
                    currentPage={currentPage}
                    navigateTo={navigateTo}
                  >
                    Agenda
                  </NavLink>
                  <NavLink
                    page="directory"
                    currentPage={currentPage}
                    navigateTo={navigateTo}
                  >
                    Direktori
                  </NavLink>
                  <NavLink
                    page="forum"
                    currentPage={currentPage}
                    navigateTo={navigateTo}
                  >
                    Forum
                  </NavLink>
                  <NavLink
                    page="kadin360"
                    currentPage={currentPage}
                    navigateTo={navigateTo}
                  >
                    Kadin 360
                  </NavLink>
                  {isAdmin && (
                    <NavLink
                      page="admin"
                      currentPage={currentPage}
                      navigateTo={navigateTo}
                    >
                      <span className="flex items-center gap-1">Admin</span>
                    </NavLink>
                  )}
                </div>
                <NotificationBell
                  notifications={notifications}
                  onMarkAsRead={markNotificationAsRead}
                  onMarkAllAsRead={markAllNotificationsAsRead}
                />
                <button
                  onClick={handleLogoutRequest}
                  className="text-slate-600 font-semibold hover:text-sky-700 transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigateTo("login")}
                className="bg-sky-700 text-white font-semibold px-4 py-2 rounded-md hover:bg-sky-800 transition-colors"
              >
                Login Anggota
              </button>
            )}
          </nav>
        </div>
      </header>
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all animate-fade-in-scale">
            <h3
              id="logout-dialog-title"
              className="text-xl font-bold text-slate-900"
            >
              Confirm Logout
            </h3>
            <p className="mt-2 text-slate-600">
              Are you sure you want to log out?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-slate-100 text-slate-800 font-semibold rounded-md hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                No
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              >
                {isLoggingOut ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    <span>Logging out...</span>
                  </>
                ) : (
                  "Yes"
                )}
              </button>
            </div>
            <style>{`
                @keyframes fade-in-scale {
                    0% { transform: scale(0.95); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.2s ease-out forwards;
                }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
