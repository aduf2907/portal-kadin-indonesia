import React, { useEffect, useState } from "react";
import Card, { CardContent, CardFooter, CardHeader } from "../components/Card";
import { KadinEvent, NotificationType, Page } from "../types";
import {
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  TicketIcon,
  UserCircleIcon,
  ArrowDownTrayIcon,
} from "../components/icons";
import supabase from "@/src/supabase-client";

interface EventDetailsPageProps {
  eventId?: string;
  addNotification: (message: string, type: NotificationType) => void;
  navigateTo: (page: Page) => void;
  viewEventDetails: (eventId: string) => void;
  // event: KadinEvent;
  // allEvents: KadinEvent[];
}

const EventDetailsPage: React.FC<EventDetailsPageProps> = ({
  eventId,
  addNotification,
  navigateTo,
  viewEventDetails,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [event, setEvent] = useState<KadinEvent | null>(null);
  const [relatedEvent, setRelatedEvents] = useState<KadinEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // const relatedEvents = allEvents.filter((e) => e.id !== event.id);

  useEffect(() => {
    const fetchEventDetail = async () => {
      setLoading(true);

      // 1️⃣ ambil event utama
      const { data: eventData, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) {
        console.error("Error fetch event:", error);
        setLoading(false);
        return;
      }

      setEvent(eventData);

      // 2️⃣ ambil event lain (related)
      const { data: relatedData } = await supabase
        .from("events")
        .select("*")
        .neq("id", eventId)
        .order("date", { ascending: false })
        .limit(4);

      setRelatedEvents(relatedData ?? []);
      setLoading(false);
    };

    fetchEventDetail();
  }, [eventId]);

  const handleRegistrationConfirm = () => {
    setShowConfirmModal(false);
    setIsRegistering(true);
    // Simulate API call for registration
    setTimeout(() => {
      setIsRegistering(false);
      setIsRegistered(true);
      addNotification(
        `Anda telah berhasil terdaftar pada acara: ${event.title}`,
        "success",
      );
    }, 1500);
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <p>Event tidak ditemukan</p>
        <button
          onClick={() => navigateTo("agenda")}
          className="mt-4 text-sky-600 underline"
        >
          Kembali ke agenda
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigateTo("agenda")}
            className="text-sm font-semibold text-sky-600 hover:underline mb-4"
          >
            &larr; Kembali ke Semua Acara
          </button>
          <div className="bg-slate-800 text-white p-8 rounded-xl shadow-lg">
            <span className="text-amber-400 font-semibold">{event.year}</span>
            <h1 className="text-3xl md:text-4xl font-bold mt-1">
              {event.title}
            </h1>
            <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 mt-4 text-sky-200">
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="w-5 h-5" />
                <span>
                  {event.date} {event.year}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Deskripsi Acara</h2>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 whitespace-pre-line">
                  {event.details}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card className="sticky top-24">
              <CardHeader>
                <h2 className="text-xl font-bold">Informasi & Pendaftaran</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 pt-1">
                    <TicketIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Biaya Registrasi</p>
                    <p className="font-semibold text-sm text-slate-800">
                      {event.registrationFee}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 pt-1">
                    <UserCircleIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Narahubung</p>
                    <p className="font-semibold text-sm text-slate-800">
                      {event.contactPerson.name}
                    </p>
                    <a
                      href={`mailto:${event.contactPerson.email}`}
                      className="text-xs text-sky-600 hover:underline block"
                    >
                      {event.contactPerson.email}
                    </a>
                    <a
                      href={`tel:${event.contactPerson.phone.replace(
                        /\D/g,
                        "",
                      )}`}
                      className="text-xs text-sky-600 hover:underline block"
                    >
                      {event.contactPerson.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="space-y-3">
                {isRegistered ? (
                  <div className="text-center bg-green-100 p-6 rounded-lg border-2 border-green-200">
                    <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-green-800">
                      Pendaftaran Berhasil!
                    </h3>
                    <p className="mt-1 text-sm text-green-700">
                      Anda sudah terdaftar untuk acara ini. Sampai jumpa di
                      sana!
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={isRegistering}
                    className="w-full bg-amber-500 text-sky-900 font-bold py-3 px-4 rounded-md hover:bg-amber-400 transition-colors shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isRegistering ? "Mendaftarkan..." : "Daftar Acara Ini"}
                  </button>
                )}
                {event.materialsUrl && (
                  <a
                    href={event.materialsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-sky-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-sky-700 transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Unduh Materi Acara
                  </a>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Agenda Acara</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 pt-1">
                        <ClockIcon className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800">
                          {item.activity}
                        </p>
                        <p className="text-xs text-slate-500">{item.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {relatedEvent.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">
              Acara Terkait Lainnya
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedEvent.map((relatedEvent) => (
                <Card key={relatedEvent.id} className="flex flex-col">
                  <CardContent className="flex-grow">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 text-center bg-red-100 p-3 rounded-lg w-20">
                        <p className="text-3xl font-bold text-red-600">
                          {relatedEvent.date}
                        </p>
                        {/* <p className="text-sm font-semibold text-red-500">{relatedEvent.date.month}</p> */}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-500">
                          {relatedEvent.year}
                        </span>
                        <h3 className="text-lg font-bold text-slate-800">
                          {relatedEvent.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {relatedEvent.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-600 mt-4 text-sm">
                      {relatedEvent.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <button
                      onClick={() => viewEventDetails(relatedEvent.id)}
                      className="w-full bg-sky-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-800 transition-colors"
                    >
                      Lihat Detail
                    </button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {showConfirmModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all animate-fade-in-scale">
            <h3
              id="confirm-dialog-title"
              className="text-xl font-bold text-slate-900"
            >
              Konfirmasi Pendaftaran
            </h3>
            <p className="mt-2 text-slate-600">
              Apakah Anda yakin ingin mendaftar untuk acara "{event.title}"?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-800 font-semibold rounded-md hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Batal
              </button>
              <button
                onClick={handleRegistrationConfirm}
                className="px-4 py-2 bg-amber-500 text-sky-900 font-semibold rounded-md hover:bg-amber-400 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Konfirmasi
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

export default EventDetailsPage;
