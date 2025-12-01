import React from 'react';
import Card, { CardContent } from '../components/Card';
import { NewspaperIcon } from '../components/icons';

const newsItems = [
  {
    title: 'Laporan Tahunan KADIN Indonesia 2023 Dirilis',
    category: 'Laporan Tahunan',
    date: '12 September 2023',
    excerpt: 'Laporan tahunan 2023 merangkum pencapaian KADIN dalam advokasi kebijakan, program pengembangan UMKM, serta outlook ekonomi untuk tahun mendatang.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'KADIN Dorong Peningkatan Ekspor Produk UMKM ke Pasar Global',
    category: 'Ekonomi',
    date: '23 September 2023',
    excerpt: 'Kamar Dagang dan Industri Indonesia (KADIN) meluncurkan program baru untuk membantu UMKM menembus pasar internasional melalui pelatihan digital dan business matching.',
    imageUrl: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'Regulasi Baru Terkait Pajak Digital Diterbitkan, Ini Kata KADIN',
    category: 'Regulasi',
    date: '21 September 2023',
    excerpt: 'Pemerintah resmi mengeluarkan peraturan menteri keuangan terbaru mengenai pajak untuk transaksi digital. KADIN memberikan beberapa catatan penting.',
    imageUrl: 'https://images.unsplash.com/photo-1605799732105-5c13316c028c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'KTT KADIN Nasional Akan Digelar di Bali Bulan Depan',
    category: 'Acara',
    date: '18 September 2023',
    excerpt: 'Konferensi Tingkat Tinggi (KTT) KADIN tahun ini akan fokus pada tema "Transformasi Ekonomi Hijau dan Berkelanjutan" dan dihadiri oleh ribuan pengusaha.',
    imageUrl: 'https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
  },
   {
    title: 'Investasi di Sektor Energi Terbarukan Menunjukkan Tren Positif',
    category: 'Investasi',
    date: '15 September 2023',
    excerpt: 'Menurut data yang dirilis KADIN, minat investor untuk menanamkan modal di sektor energi terbarukan di Indonesia meningkat 25% pada kuartal ketiga.',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    title: 'KADIN Mendorong Transformasi Digital di Sektor Logistik',
    category: 'Teknologi',
    date: '10 September 2023',
    excerpt: 'Dalam webinar terbaru, KADIN membahas pentingnya adopsi teknologi digital untuk meningkatkan efisiensi dan transparansi dalam rantai pasok nasional.',
  },
  {
    title: 'Forum Dialog: Kemitraan Strategis Pemerintah dan Swasta',
    category: 'Kebijakan',
    date: '05 September 2023',
    excerpt: 'KADIN menjadi tuan rumah forum dialog yang mempertemukan pejabat pemerintah dan pemimpin bisnis untuk membahas model kemitraan strategis.',
  },
  {
    title: 'Pelatihan Keuangan untuk UMKM Diselenggarakan di Jakarta',
    category: 'UMKM',
    date: '01 September 2023',
    excerpt: 'KADIN bekerja sama dengan institusi keuangan terkemuka mengadakan pelatihan manajemen keuangan untuk membantu UMKM meningkatkan literasi finansial mereka.',
  },
];

const BeritaPage: React.FC = () => {
  const placeholderImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <NewspaperIcon className="w-10 h-10 text-sky-700" />
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Berita & Informasi Terkini KADIN</h1>
            <p className="text-slate-600 mt-1">Ikuti perkembangan terbaru dari dunia usaha dan kebijakan di Indonesia.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {newsItems.map((item, index) => (
          <Card key={index} className="flex flex-col group">
            <div className="overflow-hidden">
              <img src={item.imageUrl || placeholderImage} alt={item.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <CardContent className="flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-100 rounded-full">{item.category}</span>
                <span className="text-xs text-slate-500">{item.date}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex-grow">{item.title}</h2>
              <p className="text-sm text-slate-600 mb-4">{item.excerpt}</p>
              <a href="#" className="font-semibold text-sky-600 hover:underline self-start">Baca Selengkapnya &rarr;</a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BeritaPage;