import React from "react";
import Card, { CardContent, CardFooter } from "../components/Card";
import { KadinEvent, Page } from "../types";
import {
  CalendarDaysIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "../components/icons";

interface AgendaPageProps {
  events: KadinEvent[];
  viewEventDetails: (eventId: string) => void;
  isAuthenticated: boolean;
  navigateTo: (page: Page) => void;
}

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MEI",
  "JUN",
  "JUL",
  "AGU",
  "SEP",
  "OKT",
  "NOV",
  "DES",
];

const AgendaPage: React.FC<AgendaPageProps> = ({
  events,
  viewEventDetails,
  isAuthenticated,
  navigateTo,
}) => {
  const formatDateParts = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: months[date.getMonth()],
      year: date.getFullYear().toString(),
    };
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <CalendarDaysIcon className="w-10 h-10 text-amber-600" />
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Agenda & Acara Mendatang
          </h1>
          <p className="text-slate-600 mt-1">
            Daftar kegiatan KADIN Indonesia untuk penguatan jaringan bisnis
            Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.map((event) => {
          const parts = formatDateParts(event.date);
          return (
            <Card
              key={event.id}
              className="flex flex-col group hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="flex-grow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-center bg-amber-100 p-3 rounded-lg w-20">
                    <p className="text-3xl font-bold text-amber-700">
                      {parts.day}
                    </p>
                    <p className="text-sm font-semibold text-amber-600">
                      {parts.month}
                    </p>
                  </div>
                  <div className="flex-grow">
                    <span className="text-sm font-semibold text-slate-500">
                      {parts.year}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-sky-700 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 mt-6 text-sm leading-relaxed line-clamp-3">
                  {event.description}
                </p>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t border-slate-100 p-4">
                <button
                  onClick={() =>
                    isAuthenticated
                      ? viewEventDetails(event.id)
                      : navigateTo("login")
                  }
                  className="w-full bg-sky-700 text-white font-bold py-2.5 px-4 rounded-md hover:bg-sky-800 transition-all flex items-center justify-center gap-2"
                >
                  Lihat Detail & Pendaftaran
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <CalendarDaysIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-500">
            Belum ada agenda mendatang.
          </h2>
          <p className="text-slate-400 mt-1">
            Silakan periksa kembali beberapa saat lagi.
          </p>
        </div>
      )}
    </div>
  );
};

export default AgendaPage;
