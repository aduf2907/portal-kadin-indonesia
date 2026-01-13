import React, { useState, useEffect, useCallback } from "react";
import Card, { CardContent, CardHeader, CardFooter } from "../components/Card";
import { Page, RegistrationType, KadinEvent } from "../types";
import {
  UserPlusIcon,
  ArrowPathIcon,
  ClipboardDocumentCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
} from "../components/icons";

interface HomePageProps {
  navigateTo: (page: Page) => void;
  startRegistration: (type: RegistrationType) => void;
  isAuthenticated: boolean;
  viewEventDetails: (eventId: string) => void;
  events: KadinEvent[];
}

const ActionButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left p-6 flex items-start gap-6 rounded-lg border-2 border-transparent hover:border-sky-600 hover:bg-sky-50 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
  >
    <div className="flex-shrink-0 w-12 h-12 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="mt-1 text-slate-600">{description}</p>
    </div>
  </button>
);

const slides = [
  {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
  },
  {
    url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
  },
  {
    url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
];

const latestNews = [
  {
    title: "KADIN Dorong Peningkatan Ekspor Produk UMKM ke Pasar Global",
    category: "Ekonomi",
    date: "23 September 2023",
    excerpt:
      "KADIN meluncurkan program baru untuk membantu UMKM menembus pasar internasional melalui pelatihan digital dan business matching.",
    imageUrl:
      "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    title: "Regulasi Baru Terkait Pajak Digital Diterbitkan, Ini Kata KADIN",
    category: "Regulasi",
    date: "21 September 2023",
    excerpt:
      "Pemerintah resmi mengeluarkan peraturan menteri keuangan terbaru mengenai pajak untuk transaksi digital. KADIN memberikan beberapa catatan penting.",
    imageUrl:
      "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1102",
  },
];

const hotTopics = [
  {
    title: "Peluang Ekspor Produk Furnitur ke Pasar Eropa",
    author: "Ahmad Subagja",
    category: "Ekspor-Impor",
    authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    title: "Diskusi Mengenai Insentif Pajak Terbaru untuk Industri Manufaktur",
    author: "Citra Lestari",
    category: "Pajak",
    authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    title: "Bagaimana Cara Mendapatkan Sertifikasi Halal untuk Produk Makanan?",
    author: "Rahmat Hidayat",
    category: "Sertifikasi",
    authorAvatar: "https://randomuser.me/api/portraits/men/33.jpg",
  },
];

const HomePage: React.FC<HomePageProps> = ({
  navigateTo,
  startRegistration,
  isAuthenticated,
  viewEventDetails,
  events,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds
    return () => clearTimeout(timer);
  }, [currentIndex, nextSlide]);

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Merged Hero and Carousel Section */}
        <div className="h-[50vh] min-h-[400px] md:h-[60vh] w-full mx-auto mb-12 relative group rounded-2xl shadow-xl overflow-hidden">
          {/* Background Images */}
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                slideIndex === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                style={{ backgroundImage: `url(${slide.url})` }}
                className="w-full h-full bg-center bg-cover"
              ></div>
            </div>
          ))}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/20 to-transparent"></div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              Selamat Datang di Portal Keanggotaan KADIN
            </h1>
            <p className="mt-4 text-lg text-slate-200 max-w-2xl mx-auto drop-shadow-md">
              Langkah mudah untuk bergabung, memperpanjang, atau melakukan
              registrasi ulang keanggotaan Anda di Kamar Dagang dan Industri
              Indonesia.
            </p>
          </div>

          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/30 hover:bg-black/50 text-white cursor-pointer transition-colors z-10"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/30 hover:bg-black/50 text-white cursor-pointer transition-colors z-10"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
          <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2 z-10">
            {slides.map((_, slideIndex) => (
              <button
                key={slideIndex}
                aria-label={`Go to slide ${slideIndex + 1}`}
                onClick={() => setCurrentIndex(slideIndex)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                  currentIndex === slideIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              ></button>
            ))}
          </div>
        </div>
        {/* End Merged Section */}

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-center text-slate-700">
                Pilih Jenis Pendaftaran
              </h2>
            </CardHeader>
            <CardContent className="divide-y divide-slate-200 p-0">
              <ActionButton
                icon={<UserPlusIcon className="w-6 h-6" />}
                title="Daftar Baru"
                description="Bergabung sebagai anggota baru KADIN dan dapatkan Kartu Tanda Anggota (KTA) Anda."
                onClick={() => startRegistration("Daftar Baru")}
              />
              <ActionButton
                icon={<ArrowPathIcon className="w-6 h-6" />}
                title="Perpanjang KTA"
                description="Perpanjang masa berlaku KTA Anda yang akan atau telah berakhir."
                onClick={() => startRegistration("Perpanjang KTA")}
              />
              <ActionButton
                icon={<ClipboardDocumentCheckIcon className="w-6 h-6" />}
                title="Registrasi Ulang"
                description="Lakukan pendaftaran ulang untuk memperbarui data Anda di sistem KTA KADIN."
                onClick={() => startRegistration("Registrasi Ulang")}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Latest News Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-sky-100 rounded-full p-3 mb-4">
              <NewspaperIcon className="w-8 h-8 text-sky-700" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
              Berita & Informasi Terkini
            </h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
              Ikuti perkembangan terbaru dari dunia usaha dan kebijakan di
              Indonesia yang relevan untuk bisnis Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestNews.map((item, index) => (
              <Card key={index} className="flex flex-col group overflow-hidden">
                <div className="overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-100 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500">{item.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 flex-grow">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">{item.excerpt}</p>
                  <button
                    onClick={() => navigateTo("login")}
                    className="font-semibold text-sky-600 hover:text-sky-800 self-start group/link inline-flex items-center"
                  >
                    Baca Selengkapnya
                    <ArrowRightIcon className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Forum Section */}
      <section className="bg-slate-100 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-amber-100 rounded-full p-3 mb-4">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-amber-700" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
              Forum Komunitas Aktif
            </h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
              Bergabunglah dalam diskusi, berbagi pengetahuan, dan perluas
              jaringan Anda dengan sesama anggota KADIN.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y divide-slate-200">
                  {hotTopics.map((topic, index) => (
                    <li key={index} className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={topic.authorAvatar}
                          alt={topic.author}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                        <div className="flex-grow">
                          <h3 className="font-semibold text-slate-800">
                            {topic.title}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Oleh{" "}
                            <span className="font-medium">{topic.author}</span>{" "}
                            dalam{" "}
                            <span className="font-medium text-sky-600">
                              {topic.category}
                            </span>
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => navigateTo("login")}
              className="bg-sky-700 text-white font-semibold py-3 px-8 rounded-md hover:bg-sky-800 transition-colors text-lg shadow-md hover:shadow-lg"
            >
              Lihat Semua Topik & Gabung Diskusi
            </button>
          </div>
        </div>
      </section>

      {/* Kadin Events Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-red-100 rounded-full p-3 mb-4">
              <CalendarDaysIcon className="w-8 h-8 text-red-700" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
              Agenda & Acara Mendatang
            </h2>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
              Jangan lewatkan acara-acara penting KADIN untuk memperluas wawasan
              dan jaringan bisnis Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {events.map((event) => (
              <Card key={event.id} className="flex flex-col">
                <CardContent className="flex-grow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-center bg-red-100 p-3 rounded-lg w-20">
                      <p className="text-3xl font-bold text-red-600">
                        {event.date}
                      </p>
                      {/* <p className="text-sm font-semibold text-red-500">
                        {event.date}
                      </p> */}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-500">
                        {event.year}
                      </span>
                      <h3 className="text-lg font-bold text-slate-800">
                        {event.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {event.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-600 mt-4 text-sm">
                    {event.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <button
                    onClick={() =>
                      isAuthenticated
                        ? viewEventDetails(event.id)
                        : navigateTo("login")
                    }
                    className="w-full bg-sky-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-800 transition-colors"
                  >
                    Lihat Detail & Daftar
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
