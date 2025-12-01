import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BeritaPage from "./pages/BeritaPage";
import ForumPage from "./pages/ForumPage";
import Kadin360Page from "./pages/Kadin360Page";
import EventDetailsPage from "./pages/EventDetailsPage";
import DirectoryPage from "./pages/DirectoryPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import {
  Page,
  RegistrationType,
  AppNotification,
  NotificationType,
  KadinEvent,
} from "./types";
import Kadin360Banner from "./components/Kadin360Banner";
import { ChatBubbleLeftRightIcon, SparklesIcon } from "./components/icons";
import supabase from "./src/supabase-client";

const upcomingEvents: KadinEvent[] = [
  {
    id: "rapimnas-2025",
    date: { day: "30", month: "NOV" },
    year: "2025",
    title: "RAPIMNAS Kadin 2025",
    location: "Jakarta Convention Center, Jakarta",
    description:
      "Rapat Pimpinan Nasional KADIN untuk membahas arah kebijakan dan strategi ekonomi nasional.",
    details:
      'Rapat Pimpinan Nasional (RAPIMNAS) KADIN adalah acara tahunan paling penting yang mengumpulkan para pemimpin bisnis, pejabat pemerintah, dan pemangku kepentingan dari seluruh Indonesia. Acara ini bertujuan untuk mengevaluasi program kerja tahun berjalan, merumuskan rekomendasi kebijakan strategis untuk pemerintah, dan menetapkan arah organisasi untuk tahun mendatang. RAPIMNAS 2025 akan berfokus pada tema "Akselerasi Ekonomi Digital dan Pembangunan Berkelanjutan".',
    schedule: [
      { time: "08:00 - 09:00", activity: "Registrasi & Sarapan Pagi" },
      { time: "09:00 - 10:00", activity: "Upacara Pembukaan oleh Presiden RI" },
      {
        time: "10:00 - 12:00",
        activity: "Sesi Pleno I: Proyeksi Ekonomi Global & Nasional 2026",
      },
      { time: "12:00 - 13:00", activity: "Makan Siang & Networking" },
      {
        time: "13:00 - 15:00",
        activity: "Sesi Pleno II: Inovasi Teknologi sebagai Penggerak Industri",
      },
      { time: "15:00 - 15:30", activity: "Coffee Break" },
      {
        time: "15:30 - 17:00",
        activity: "Sesi Pleno III: Perumusan Rekomendasi Kebijakan",
      },
      { time: "17:00 - 17:30", activity: "Upacara Penutupan" },
    ],
    registrationFee: "Rp 1.500.000,-",
    contactPerson: {
      name: "Sekretariat KADIN",
      email: "event@kadin.id",
      phone: "021-1234-5678",
    },
    materialsUrl: "/downloads/rapimnas-2025-materials.pdf",
  },
  {
    id: "tech-summit-2025",
    date: { day: "15", month: "OKT" },
    year: "2025",
    title: "KADIN Tech Summit 2025",
    location: "Bali International Convention Centre, Bali",
    description:
      "Forum inovasi dan teknologi yang mempertemukan para pemimpin industri, startup, dan investor.",
    details:
      "KADIN Tech Summit adalah platform utama bagi para inovator, pemimpin teknologi, dan investor untuk terhubung dan berkolaborasi. Dengan fokus pada tren terbaru seperti AI, blockchain, dan energi terbarukan, KTT ini akan menampilkan keynote speaker kelas dunia, panel diskusi interaktif, dan sesi pitching untuk startup. Ini adalah kesempatan emas untuk mendapatkan wawasan, membangun kemitraan, dan menemukan peluang investasi baru.",
    schedule: [
      { time: "08:30 - 09:30", activity: "Registrasi & Pameran Inovasi" },
      {
        time: "09:30 - 10:30",
        activity: 'Keynote: "Masa Depan AI dalam Bisnis"',
      },
      { time: "10:30 - 12:00", activity: 'Panel: "Investasi di Era Digital"' },
      { time: "12:00 - 13:00", activity: "Networking Lunch" },
      { time: "13:00 - 15:00", activity: "Startup Pitching Competition" },
      { time: "15:00 - 15:30", activity: "Coffee Break" },
      {
        time: "15:30 - 17:00",
        activity: "Workshop Paralel (Blockchain & Green Tech)",
      },
      {
        time: "17:00 - 18:00",
        activity: "Closing Remarks & Networking Reception",
      },
    ],
    registrationFee: "Gratis (Registrasi Wajib)",
    contactPerson: {
      name: "Panitia Tech Summit",
      email: "techsummit@kadin.id",
      phone: "0812-9876-5432",
    },
  },
];

// Inlined Chatbot Widget Component
interface ChatbotWidgetProps {
  addNotification: (message: string, type: NotificationType) => void;
  isAuthenticated: boolean;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  addNotification,
  isAuthenticated,
}) => {
  if (!isAuthenticated) {
    return null;
  }

  const handleClick = () => {
    addNotification("Fitur AI Chatbot akan segera hadir!", "info");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-sky-700 text-white p-4 rounded-full shadow-lg hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transform hover:scale-110 transition-transform duration-200 z-50 group"
      aria-label="Open AI Chatbot"
    >
      <ChatBubbleLeftRightIcon className="w-8 h-8" />
      <SparklesIcon className="w-5 h-5 absolute top-1 right-1 text-amber-300 group-hover:animate-pulse" />
    </button>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [registrationType, setRegistrationType] =
    useState<RegistrationType>("Daftar Baru");
  const [selectedEvent, setSelectedEvent] = useState<KadinEvent | null>(null);

  // Notification State
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    const handleAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session) {
        const user = session.user;

        // cek user di table "users"
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!existingUser) {
          await supabase.from("users").insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata.full_name,
            avatar_url: user.user_metadata.avatar_url,
            phone: user.phone ?? null,
            address: null,
          });

          console.log("User Google baru ditambahkan ke table users");
        }
      }
    };

    handleAuth();
  }, []);

  type Step = "TYPE_SELECTION" | "ACCOUNT_CREATION" | "OTP" | "SUCCESS";

  const [step, setStep] = useState<Step>("TYPE_SELECTION");
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setStep("SUCCESS");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Check for 'Remember Me' on initial load
    const wasRemembered = localStorage.getItem("kadin_remember_me") === "true";
    if (wasRemembered) {
      setIsAuthenticated(true);
      setCurrentPage("dashboard");
    }

    if ("Notification" in window) {
      Notification.requestPermission().then(setNotificationPermission);
    }
  }, []);

  const addNotification = (message: string, type: NotificationType) => {
    const newNotification: AppNotification = {
      id: Date.now(),
      message,
      type,
      read: false,
      timestamp: new Date(),
    };
    setNotifications((prev) => [...prev, newNotification]);

    if (notificationPermission === "granted") {
      new Notification("KADIN Indonesia", {
        body: message,
        icon: "/vite.svg", // In a real app, this would be a proper KADIN logo URL
      });
    }
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const navigateTo = (page: Page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const handleLoginSuccess = (rememberMe: boolean) => {
    if (rememberMe) {
      localStorage.setItem("kadin_remember_me", "true");
    }
    setIsAuthenticated(true);
    navigateTo("dashboard");
    // Simulate initial notifications on login
    addNotification("Selamat datang kembali, Budi Santoso!", "info");
    setTimeout(() => {
      addNotification(
        "Pengingat: KTA Anda akan berakhir dalam 30 hari. Segera lakukan perpanjangan.",
        "warning"
      );
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("kadin_remember_me");
    setIsAuthenticated(false);
    clearNotifications();
    navigateTo("home");
  };

  const startRegistration = (type: RegistrationType) => {
    setRegistrationType(type);
    navigateTo("register");
  };

  const handleViewEventDetails = (eventId: string) => {
    const event = upcomingEvents.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      navigateTo("eventDetails");
    }
  };

  const renderPage = () => {
    if (isAuthenticated) {
      switch (currentPage) {
        case "dashboard":
          return <DashboardPage addNotification={addNotification} />;
        case "berita":
          return <BeritaPage />;
        case "directory":
          return <DirectoryPage addNotification={addNotification} />;
        case "forum":
          return <ForumPage />;
        case "kadin360":
          return <Kadin360Page />;
        case "eventDetails":
          return selectedEvent ? (
            <EventDetailsPage
              event={selectedEvent}
              addNotification={addNotification}
              navigateTo={navigateTo}
              allEvents={upcomingEvents}
              viewEventDetails={handleViewEventDetails}
            />
          ) : (
            <DashboardPage addNotification={addNotification} />
          );
        default:
          return <DashboardPage addNotification={addNotification} />;
      }
    } else {
      switch (currentPage) {
        case "home":
          return (
            <HomePage
              navigateTo={navigateTo}
              startRegistration={startRegistration}
              isAuthenticated={isAuthenticated}
              viewEventDetails={handleViewEventDetails}
              events={upcomingEvents}
            />
          );
        case "register":
          return (
            <RegistrationPage
              registrationType={registrationType}
              navigateTo={navigateTo}
              addNotification={addNotification}
            />
          );
        case "login":
          return (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              navigateTo={navigateTo}
              addNotification={addNotification}
            />
          );
        case "forgotPassword":
          return <ForgotPasswordPage navigateTo={navigateTo} />;
        default:
          return (
            <HomePage
              navigateTo={navigateTo}
              startRegistration={startRegistration}
              isAuthenticated={isAuthenticated}
              viewEventDetails={handleViewEventDetails}
              events={upcomingEvents}
            />
          );
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        navigateTo={navigateTo}
        currentPage={currentPage}
        notifications={notifications}
        markNotificationAsRead={markNotificationAsRead}
        markAllNotificationsAsRead={markAllNotificationsAsRead}
      />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {renderPage()}
      </main>
      <Kadin360Banner
        navigateTo={navigateTo}
        isAuthenticated={isAuthenticated}
      />
      <Footer />
      <ChatbotWidget
        isAuthenticated={isAuthenticated}
        addNotification={addNotification}
      />
    </div>
  );
};

export default App;
