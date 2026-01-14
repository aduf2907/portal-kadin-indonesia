import React, { useState, useRef, useEffect } from "react";
import Card, { CardContent, CardHeader } from "../components/Card";
import supabase from "@/src/supabase-client";
import {
  NewspaperIcon,
  CalendarDaysIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ArrowUpOnSquareIcon,
} from "../components/icons";
import { KadinEvent, NewsItem, NotificationType } from "../types";

interface AdminPageProps {
  addNotification: (message: string, type: NotificationType) => void;
}

const initialNews: NewsItem[] = [
  {
    id: "1",
    title: "KADIN Dorong Peningkatan Ekspor Produk UMKM ke Pasar Global",
    category: "Ekonomi",
    date: "2023-09-23",
    excerpt:
      "KADIN meluncurkan program baru untuk membantu UMKM menembus pasar internasional.",
  },
  {
    id: "2",
    title: "Regulasi Baru Terkait Pajak Digital Diterbitkan",
    category: "Regulasi",
    date: "2023-09-21",
    excerpt:
      "Pemerintah resmi mengeluarkan peraturan menteri keuangan terbaru mengenai pajak digital.",
  },
];

const initialEvents: KadinEvent[] = [
  {
    id: "rapimnas-2025",
    date: "2025-11-30",
    year: "2026",
    title: "RAPIMNAS Kadin 2025",
    location: "Jakarta Convention Center, Jakarta",
    description:
      "Rapat Pimpinan Nasional KADIN untuk membahas arah kebijakan dan strategi ekonomi nasional.",
    details: "Full details here...",
    schedule: [],
    registrationFee: "Rp 1.500.000,-",
    contactPerson: {
      name: "Sekretariat",
      email: "event@kadin.id",
      phone: "021-1234",
    },
  },
];

const AdminPage: React.FC<AdminPageProps> = ({ addNotification }) => {
  const [activeTab, setActiveTab] = useState<"news" | "events">("news");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [events, setEvents] = useState<KadinEvent[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const newsImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoadingNews(true);

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) {
      console.error(error);
      addNotification("Gagal memuat berita", "error");
    } else {
      setNews(data as NewsItem[]);
    }

    setLoadingNews(false);
  };

  // News Form State
  const [newsForm, setNewsForm] = useState({
    title: "",
    category: "Ekonomi",
    excerpt: "",
    date: new Date().toISOString().split("T")[0],
    imageUrl: "",
  });

  // Event Form State
  const [eventForm, setEventForm] = useState({
    title: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    registrationFee: "Gratis",
  });

  // const handleNewsImageUpload = async (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const fileExt = file.name.split(".").pop();
  //   const fileName = `${Date.now()}.${fileExt}`;
  //   const filePath = `news/${fileName}`;

  //   const { error: uploadError } = await supabase.storage
  //     .from("news-images")
  //     .upload(filePath, file);

  //   if (uploadError) {
  //     console.error(uploadError);
  //     addNotification("Gagal upload gambar", "error");
  //     return;
  //   }

  //   const { data } = supabase.storage
  //     .from("news-images")
  //     .getPublicUrl(filePath);

  //   setNewsForm((prev) => ({
  //     ...prev,
  //     imageUrl: data.publicUrl,
  //   }));
  // };

  const handleNewsImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `news/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      addNotification("Gagal upload gambar", "error");
      return;
    }

    const { data } = supabase.storage
      .from("news-images")
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      addNotification("Gagal mendapatkan URL gambar", "error");
      return;
    }

    setNewsForm((prev) => ({
      ...prev,
      imageUrl: data.publicUrl,
    }));
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Hapus berita ini?")) return;

    const { error } = await supabase.from("news").delete().eq("id", id);

    if (error) {
      console.error(error);
      addNotification("Gagal menghapus berita", "error");
      return;
    }

    addNotification("Berita berhasil dihapus", "success");
    fetchNews();
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus agenda ini?")) {
      setEvents(events.filter((e) => e.id !== id));
      addNotification("Agenda berhasil dihapus.", "success");
    }
  };

  // const handleSaveNews = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const payload: any = {
  //     title: newsForm.title,
  //     category: newsForm.category,
  //     excerpt: newsForm.excerpt,
  //     published_at: new Date(newsForm.date).toISOString(),
  //   };

  //   if (newsForm.imageUrl) {
  //     payload.image_url = newsForm.imageUrl;
  //   }

  //   let error;

  //   if (editingItem) {
  //     ({ error } = await supabase
  //       .from("news")
  //       .update(payload)
  //       .eq("id", editingItem.id));
  //   } else {
  //     ({ error } = await supabase.from("news").insert(payload));
  //   }

  //   if (error) {
  //     console.error(error);
  //     addNotification("Gagal menyimpan berita", "error");
  //     return;
  //   }

  //   addNotification(
  //     editingItem ? "Berita diperbarui" : "Berita berhasil dibuat",
  //     "success"
  //   );

  //   setIsNewsModalOpen(false);
  //   setEditingItem(null);
  //   fetchNews();
  // };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      title: newsForm.title,
      category: newsForm.category,
      excerpt: newsForm.excerpt,
      published_at: new Date(newsForm.date).toISOString(),
    };

    if (newsForm.imageUrl) {
      payload.image_url = newsForm.imageUrl;
    }

    let error;

    if (editingItem) {
      ({ error } = await supabase
        .from("news")
        .update(payload)
        .eq("id", editingItem.id));
    } else {
      ({ error } = await supabase.from("news").insert(payload));
    }

    if (error) {
      console.error(error);
      addNotification("Gagal menyimpan berita", "error");
      return;
    }

    addNotification(
      editingItem ? "Berita diperbarui" : "Berita berhasil dibuat",
      "success"
    );

    setIsNewsModalOpen(false);
    setEditingItem(null);
    fetchNews();
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: KadinEvent = {
      id: editingItem
        ? editingItem.id
        : Math.random().toString(36).substr(2, 9),
      title: eventForm.title,
      location: eventForm.location,
      date: eventForm.date,
      year: eventForm.title,
      description: eventForm.description,
      details: eventForm.description,
      schedule: [],
      registrationFee: eventForm.registrationFee,
      contactPerson: {
        name: "Admin Kadin",
        email: "admin@kadin.id",
        phone: "021-0000",
      },
    };

    if (editingItem) {
      setEvents(events.map((ev) => (ev.id === editingItem.id ? newEvent : ev)));
      addNotification("Agenda berhasil diperbarui.", "success");
    } else {
      setEvents([newEvent, ...events]);
      addNotification("Agenda baru berhasil dibuat.", "success");
    }
    setIsEventModalOpen(false);
    setEditingItem(null);
    setEventForm({
      title: "",
      location: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      registrationFee: "Gratis",
    });
  };

  const openEditNews = (item: NewsItem) => {
    setEditingItem(item);
    setNewsForm({
      title: item.title,
      category: item.category,
      excerpt: item.excerpt,
      date: item.published_at
        ? item.published_at.split("T")[0]
        : new Date().toISOString().split("T")[0],
      imageUrl: item.image_url || "",
    });
    setIsNewsModalOpen(true);
  };

  const openEditEvent = (item: KadinEvent) => {
    setEditingItem(item);
    setEventForm({
      title: item.title,
      location: item.location,
      date: item.date,
      description: item.description,
      registrationFee: item.registrationFee,
    });
    setIsEventModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Panel Administrasi CMS
          </h1>
          <p className="text-slate-600">
            Kelola portal informasi dan agenda kegiatan KADIN Indonesia.
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === "news" ? (
            <button
              onClick={() => {
                setEditingItem(null);
                setNewsForm({
                  title: "",
                  category: "Ekonomi",
                  excerpt: "",
                  date: new Date().toISOString().split("T")[0],
                  imageUrl: "",
                });
                setIsNewsModalOpen(true);
              }}
              className="bg-sky-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-sky-800 transition-colors shadow-sm"
            >
              <PlusIcon className="w-5 h-5" /> Buat Berita
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingItem(null);
                setEventForm({
                  title: "",
                  location: "",
                  date: new Date().toISOString().split("T")[0],
                  description: "",
                  registrationFee: "Gratis",
                });
                setIsEventModalOpen(true);
              }}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-amber-700 transition-colors shadow-sm"
            >
              <PlusIcon className="w-5 h-5" /> Buat Agenda
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("news")}
          className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "news"
              ? "border-b-2 border-sky-700 text-sky-700"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <NewspaperIcon className="w-5 h-5" /> Manajemen Berita
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`px-6 py-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "events"
              ? "border-b-2 border-amber-600 text-amber-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <CalendarDaysIcon className="w-5 h-5" /> Manajemen Agenda
        </button>
      </div>

      {/* Filter bar */}
      <div className="mb-6 relative">
        <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={`Cari ${activeTab === "news" ? "berita" : "agenda"}...`}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {activeTab === "news" ? "Kategori" : "Lokasi"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {activeTab === "news"
                ? news
                    .filter((n) =>
                      n.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt=""
                                className="w-10 h-10 rounded object-cover flex-shrink-0"
                              />
                            )}
                            <div>
                              <div className="text-sm font-semibold text-slate-800 line-clamp-1">
                                {item.title}
                              </div>
                              <div className="text-xs text-slate-500 line-clamp-1">
                                {item.excerpt}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold bg-sky-100 text-sky-800 rounded-full">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {item.published_at
                            ? new Date(item.published_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => openEditNews(item)}
                              className="text-sky-600 hover:text-sky-900"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteNews(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                : events
                    .filter((e) =>
                      e.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-semibold text-slate-800">
                              {item.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-600 flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4" /> {item.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => openEditEvent(item)}
                              className="text-sky-600 hover:text-sky-900"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* News Modal */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl animate-fade-in-scale">
            <CardHeader className="flex justify-between items-center bg-white rounded-t-xl sticky top-0 z-10">
              <h2 className="text-xl font-bold">
                {editingItem ? "Edit Berita" : "Buat Berita Baru"}
              </h2>
              <button onClick={() => setIsNewsModalOpen(false)}>
                <XMarkIcon className="w-6 h-6 text-slate-400" />
              </button>
            </CardHeader>
            <form onSubmit={handleSaveNews}>
              <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Gambar Berita
                  </label>
                  <div className="flex items-center gap-4">
                    <div
                      onClick={() => newsImageInputRef.current?.click()}
                      className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all overflow-hidden"
                    >
                      {newsForm.imageUrl ? (
                        <img
                          src={newsForm.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <ArrowUpOnSquareIcon className="w-8 h-8 text-slate-400" />
                          <span className="text-[10px] text-slate-500 mt-1">
                            Upload Foto
                          </span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={newsImageInputRef}
                      onChange={handleNewsImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                    <p className="text-xs text-slate-500 max-w-[200px]">
                      Gunakan gambar berkualitas tinggi (format JPG, PNG).
                      Maksimal 2MB.
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Judul Berita
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 outline-none"
                    value={newsForm.title}
                    onChange={(e) =>
                      setNewsForm({ ...newsForm, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Kategori
                    </label>
                    <select
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 outline-none"
                      value={newsForm.category}
                      onChange={(e) =>
                        setNewsForm({ ...newsForm, category: e.target.value })
                      }
                    >
                      <option>Ekonomi</option>
                      <option>Regulasi</option>
                      <option>UMKM</option>
                      <option>Teknologi</option>
                      <option>Internasional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Tanggal Publikasi
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 outline-none"
                      value={newsForm.date}
                      onChange={(e) =>
                        setNewsForm({ ...newsForm, date: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Ringkasan (Excerpt)
                  </label>
                  <textarea
                    rows={3}
                    required
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="Tuliskan ringkasan singkat berita..."
                    value={newsForm.excerpt}
                    onChange={(e) =>
                      setNewsForm({ ...newsForm, excerpt: e.target.value })
                    }
                  ></textarea>
                </div>
              </CardContent>
              <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t rounded-b-xl">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sky-700 text-white font-bold rounded shadow-lg hover:bg-sky-800 transition-colors"
                >
                  Simpan Berita
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Event Modal - Removed Image Upload as per request */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl animate-fade-in-scale">
            <CardHeader className="flex justify-between items-center bg-white rounded-t-xl sticky top-0 z-10">
              <h2 className="text-xl font-bold">
                {editingItem ? "Edit Agenda" : "Buat Agenda Baru"}
              </h2>
              <button onClick={() => setIsEventModalOpen(false)}>
                <XMarkIcon className="w-6 h-6 text-slate-400" />
              </button>
            </CardHeader>
            <form onSubmit={handleSaveEvent}>
              <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Nama Agenda / Acara
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: KADIN Tech Summit 2025"
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Tanggal Acara
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                      value={eventForm.date}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      Biaya Registrasi
                    </label>
                    <input
                      type="text"
                      placeholder="Gratis atau Rp 1.500.000"
                      className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                      value={eventForm.registrationFee}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          registrationFee: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Jakarta Convention Center"
                    required
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                    value={eventForm.location}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, location: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Deskripsi & Detail Acara
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tuliskan detail lengkap agenda kegiatan..."
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 outline-none"
                    value={eventForm.description}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </CardContent>
              <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t rounded-b-xl">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 text-white font-bold rounded shadow-lg hover:bg-amber-700 transition-colors"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
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
  );
};

export default AdminPage;
