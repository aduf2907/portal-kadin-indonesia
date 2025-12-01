import React from 'react';
import Card, { CardContent } from '../components/Card';
import { ChatBubbleLeftRightIcon } from '../components/icons';

const forumTopics = [
  {
    title: 'Peluang Ekspor Produk Furnitur ke Pasar Eropa',
    author: 'Ahmad Subagja',
    replies: 12,
    lastActivity: '2 jam yang lalu',
    category: 'Ekspor-Impor',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    title: 'Diskusi Mengenai Insentif Pajak Terbaru untuk Industri Manufaktur',
    author: 'Citra Lestari',
    replies: 8,
    lastActivity: '5 jam yang lalu',
    category: 'Pajak',
    authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    title: 'Bagaimana Cara Mendapatkan Sertifikasi Halal untuk Produk Makanan?',
    author: 'Rahmat Hidayat',
    replies: 25,
    lastActivity: '1 hari yang lalu',
    category: 'Sertifikasi',
     authorAvatar: 'https://randomuser.me/api/portraits/men/33.jpg'
  },
  {
    title: 'Tips & Trik Pemasaran Digital untuk Meningkatkan Penjualan',
    author: 'Sari Puspita',
    replies: 31,
    lastActivity: '2 hari yang lalu',
    category: 'Pemasaran',
    authorAvatar: 'https://randomuser.me/api/portraits/women/48.jpg'
  },
];


const ForumPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="sm:flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
            <ChatBubbleLeftRightIcon className="w-10 h-10 text-sky-700" />
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Forum Komunitas</h1>
                <p className="text-slate-600 mt-1">Ruang diskusi, berbagi pengetahuan, dan jejaring antar anggota KADIN.</p>
            </div>
        </div>
        <button className="mt-4 sm:mt-0 w-full sm:w-auto bg-sky-700 text-white font-semibold py-2 px-5 rounded-md hover:bg-sky-800 transition-colors">
            Buat Topik Baru
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-slate-200">
            {forumTopics.map((topic, index) => (
              <li key={index} className="p-4 hover:bg-slate-50 transition-colors">
                 <a href="#" className="block">
                    <div className="flex items-start sm:items-center gap-4">
                        <img src={topic.authorAvatar} alt={topic.author} className="w-10 h-10 rounded-full flex-shrink-0 mt-1 sm:mt-0"/>
                        <div className="flex-grow">
                            <h2 className="font-semibold text-slate-800 text-base sm:text-lg">{topic.title}</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Oleh <span className="font-medium">{topic.author}</span> dalam <span className="font-medium text-sky-600">{topic.category}</span>
                            </p>
                        </div>
                        <div className="hidden sm:flex flex-col items-end text-sm w-40 text-right flex-shrink-0">
                            <span className="font-semibold">{topic.replies} balasan</span>
                            <span className="text-slate-500">
                                {topic.lastActivity}
                            </span>
                        </div>
                    </div>
                 </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumPage;
