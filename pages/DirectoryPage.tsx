import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MemberProfile, NotificationType } from '../types';
import Card, { CardContent } from '../components/Card';
import { MagnifyingGlassIcon, MapPinIcon, BuildingOffice2Icon, EnvelopeIcon, TagIcon, XMarkIcon, LinkedInIcon, TwitterIcon, LinkIcon, ArrowDownTrayIcon, DocumentArrowUpIcon, QrCodeIcon } from '../components/icons';

// Inform TypeScript about the globally available Html5Qrcode from the script tag
declare var Html5Qrcode: any;

const initialMockMembers: MemberProfile[] = [
  { id: 1, name: 'Adi Prasetyo', company: 'PT. Teknologi Nusantara', industry: 'Teknologi Informasi', location: 'Jakarta', avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg', joinedYear: 2020, email: 'adi.prasetyo@example.com', ktaNumber: '10201-1234567890', socials: { linkedin: '#', twitter: '#', website: '#' } },
  { id: 2, name: 'Siti Aminah', company: 'CV. Karya Mandiri', industry: 'Manufaktur', location: 'Bandung', avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg', joinedYear: 2019, email: 'siti.aminah@example.com', ktaNumber: '10202-2345678901', socials: { linkedin: '#' } },
  { id: 3, name: 'Bambang Hartono', company: 'PT. Konstruksi Jaya', industry: 'Konstruksi', location: 'Surabaya', avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg', joinedYear: 2021, email: 'bambang.hartono@example.com', ktaNumber: '10203-3456789012', socials: { website: '#' } },
  { id: 4, name: 'Dewi Lestari', company: 'Lestari Fashion', industry: 'Retail Fashion', location: 'Bali', avatarUrl: 'https://randomuser.me/api/portraits/women/4.jpg', joinedYear: 2022, email: 'dewi.lestari@example.com', ktaNumber: '10204-4567890123', socials: { linkedin: '#', twitter: '#' } },
  { id: 5, name: 'Eko Wibowo', company: 'Agro Makmur Sejahtera', industry: 'Agribisnis', location: 'Medan', avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg', joinedYear: 2018, email: 'eko.wibowo@example.com', ktaNumber: '10205-5678901234' },
  { id: 6, name: 'Fitriani', company: 'PT. Logistik Cepat', industry: 'Logistik', location: 'Jakarta', avatarUrl: 'https://randomuser.me/api/portraits/women/6.jpg', joinedYear: 2023, email: 'fitriani@example.com', ktaNumber: '10206-6789012345', socials: { linkedin: '#' } },
  { id: 7, name: 'Gunawan Santoso', company: 'GS Consulting', industry: 'Jasa Keuangan', location: 'Jakarta', avatarUrl: 'https://randomuser.me/api/portraits/men/7.jpg', joinedYear: 2017, email: 'gunawan.santoso@example.com', ktaNumber: '10207-7890123456' },
  { id: 8, name: 'Herlina', company: 'PT. Media Kreatif', industry: 'Media & Kreatif', location: 'Yogyakarta', avatarUrl: 'https://randomuser.me/api/portraits/women/8.jpg', joinedYear: 2020, email: 'herlina@example.com', ktaNumber: '10208-8901234567' },
  { id: 9, name: 'Irfan Hakim', company: 'PT. Energi Terbarukan', industry: 'Energi', location: 'Surabaya', avatarUrl: 'https://randomuser.me/api/portraits/men/9.jpg', joinedYear: 2021, email: 'irfan.hakim@example.com', ktaNumber: '10209-9012345678' },
  { id: 10, name: 'Jasmine Putri', company: 'Tour & Travel Bahagia', industry: 'Pariwisata', location: 'Bali', avatarUrl: 'https://randomuser.me/api/portraits/women/10.jpg', joinedYear: 2022, email: 'jasmine.putri@example.com', ktaNumber: '10210-0123456789', socials: { website: '#', linkedin: '#' } },
  { id: 11, name: 'Rian Hidayat', company: 'Tekno Solusi Digital', industry: 'Teknologi Informasi', location: 'Bandung', avatarUrl: 'https://randomuser.me/api/portraits/men/11.jpg', joinedYear: 2023, email: 'rian.hidayat@example.com', ktaNumber: '10211-1123456789' },
  { id: 12, name: 'Linda Wati', company: 'Garmen Maju Jaya', industry: 'Manufaktur', location: 'Surabaya', avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg', joinedYear: 2018, email: 'linda.wati@example.com', ktaNumber: '10212-2123456789' },
];

const MemberDetailsModal: React.FC<{ member: MemberProfile | null; onClose: () => void; }> = ({ member, onClose }) => {
    if (!member) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 transition-opacity duration-300" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-0 left-0 right-0 h-24 bg-sky-600 rounded-t-xl"></div>
                <button onClick={onClose} className="absolute top-3 right-3 text-sky-200 hover:text-white transition-colors z-10" aria-label="Close modal">
                    <XMarkIcon className="w-7 h-7" />
                </button>
                <div className="p-8 pt-0 text-center relative">
                    <img src={member.avatarUrl} alt={member.name} className="w-36 h-36 rounded-full mx-auto mb-4 ring-4 ring-white relative -mt-16 bg-white object-cover" />
                    <h2 className="text-2xl font-bold text-slate-900">{member.name}</h2>
                    <p className="text-lg text-sky-700 font-semibold">{member.company}</p>
                    <p className="text-sm text-slate-500 mt-1">Anggota KADIN sejak {member.joinedYear}</p>

                    <div className="mt-6 pt-6 border-t border-slate-200 text-left space-y-4">
                        <div className="flex items-start gap-4">
                            <TagIcon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-slate-500">Industri</p>
                                <p className="text-slate-800 font-semibold">{member.industry}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <MapPinIcon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-slate-500">Lokasi</p>
                                <p className="text-slate-800 font-semibold">{member.location}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <EnvelopeIcon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-slate-500">Email</p>
                                <a href={`mailto:${member.email}`} className="text-sky-600 hover:underline font-semibold">{member.email}</a>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    {(member.socials?.linkedin || member.socials?.twitter || member.socials?.website) && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <h3 className="text-sm font-semibold text-slate-500 mb-3 text-center">Terhubung</h3>
                            <div className="flex justify-center gap-4">
                            {member.socials.linkedin && (
                                <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-700 transition-colors" aria-label={`${member.name}'s LinkedIn Profile`}>
                                <LinkedInIcon className="w-6 h-6" />
                                </a>
                            )}
                            {member.socials.twitter && (
                                <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-700 transition-colors" aria-label={`${member.name}'s Twitter Profile`}>
                                <TwitterIcon className="w-6 h-6" />
                                </a>
                            )}
                            {member.socials.website && (
                                <a href={member.socials.website} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-sky-700 transition-colors" aria-label={`${member.name}'s Website`}>
                                <LinkIcon className="w-6 h-6" />
                                </a>
                            )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-full border-t border-slate-200 p-4 bg-slate-50 flex gap-4 rounded-b-xl">
                    <a href={`mailto:${member.email}`} className="w-full bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-700 transition-colors text-sm flex items-center justify-center gap-2">
                        <EnvelopeIcon className="w-4 h-4" />
                        Hubungi Anggota
                    </a>
                    <button 
                        onClick={onClose}
                        className="w-full bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-300 transition-colors text-sm"
                    >
                        Tutup
                    </button>
                </div>
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
    );
};


const MemberCard: React.FC<{ member: MemberProfile; onViewDetails: () => void; }> = ({ member, onViewDetails }) => (
    <Card className="flex flex-col text-center items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardContent className="flex flex-col items-center p-6 flex-grow w-full">
            <img src={member.avatarUrl} alt={member.name} className="w-24 h-24 rounded-full mb-4 ring-4 ring-sky-100 object-cover" />
            <h3 className="font-bold text-lg text-slate-800">{member.name}</h3>
            <p className="text-sm text-sky-700 font-semibold">{member.company}</p>
            <div className="mt-3 text-xs text-slate-500 space-y-1">
                 <div className="flex items-center justify-center gap-1.5">
                    <TagIcon className="w-4 h-4 text-slate-400" />
                    <span>{member.industry}</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                    <MapPinIcon className="w-4 h-4 text-slate-400" />
                    <span>{member.location}</span>
                </div>
            </div>
        </CardContent>
        <div className="w-full border-t border-slate-200 p-4 bg-slate-50 space-y-2">
            <button 
                onClick={onViewDetails}
                className="w-full bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-700 transition-colors text-sm"
            >
                Lihat Detail
            </button>
             <a href={`mailto:${member.email}`} className="w-full bg-white text-sky-600 border border-sky-600 font-semibold py-2 px-4 rounded-md hover:bg-sky-50 transition-colors text-sm flex items-center justify-center gap-2">
                <EnvelopeIcon className="w-4 h-4" />
                Hubungi
            </a>
        </div>
    </Card>
);

interface DirectoryPageProps {
  addNotification: (message: string, type: NotificationType) => void;
}

const DirectoryPage: React.FC<DirectoryPageProps> = ({ addNotification }) => {
    const [members, setMembers] = useState<MemberProfile[]>(initialMockMembers);
    const [searchTerm, setSearchTerm] = useState('');
    const [industryFilter, setIndustryFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const qrScannerRef = useRef<any>(null);

    const uniqueIndustries = useMemo(() => [...new Set(members.map(m => m.industry))].sort(), [members]);
    const uniqueLocations = useMemo(() => [...new Set(members.map(m => m.location))].sort(), [members]);
    
    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const nameMatch = member.name.toLowerCase().includes(lowercasedSearchTerm);
            const companyMatch = member.company.toLowerCase().includes(lowercasedSearchTerm);
            const industrySearchMatch = member.industry.toLowerCase().includes(lowercasedSearchTerm);
            const industryFilterMatch = industryFilter ? member.industry === industryFilter : true;
            const locationFilterMatch = locationFilter ? member.location === locationFilter : true;
            return (nameMatch || companyMatch || industrySearchMatch) && industryFilterMatch && locationFilterMatch;
        });
    }, [members, searchTerm, industryFilter, locationFilter]);
    
    const closeScanner = () => setIsScannerOpen(false);

    useEffect(() => {
        if (isScannerOpen) {
             // Delay to ensure the container element is in the DOM
            const startScanner = () => {
                const scanner = new Html5Qrcode('qr-reader-container');
                qrScannerRef.current = scanner;

                const onScanSuccess = (decodedText: string) => {
                    closeScanner();

                    if (decodedText && decodedText.startsWith('KADIN_MEMBER_KTA:')) {
                        const ktaNumber = decodedText.split(':')[1];
                        const foundMember = members.find(m => m.ktaNumber === ktaNumber);

                        if (foundMember) {
                            setSelectedMember(foundMember);
                            addNotification(`Member profile found: ${foundMember.name}`, 'success');
                        } else {
                            addNotification(`Member with KTA Number ${ktaNumber} not found.`, 'warning');
                        }
                    } else {
                        addNotification('Invalid or unrecognized QR code format.', 'error');
                    }
                };
                
                const config = { fps: 10, qrbox: { width: 250, height: 250 } };
                
                scanner.start({ facingMode: "environment" }, config, onScanSuccess, () => {})
                    .catch((err: any) => {
                        addNotification('Could not start camera. Please check permissions.', 'error');
                        setIsScannerOpen(false);
                    });
            };
            const timeoutId = setTimeout(startScanner, 100);
            return () => clearTimeout(timeoutId);

        } else if (qrScannerRef.current?.isScanning) {
            qrScannerRef.current.stop()
                .catch((err: any) => console.error("Error stopping QR scanner:", err));
        }

        return () => {
             if (qrScannerRef.current?.isScanning) {
                qrScannerRef.current.stop().catch(() => {});
            }
        }
    }, [isScannerOpen, members, addNotification]);

    const handleExportCSV = () => {
        if (filteredMembers.length === 0) {
            addNotification("No members to export.", 'warning');
            return;
        }

        const headers = ['Name', 'Company', 'Industry', 'Location', 'Email', 'Joined Year'];
        const escapeCsvField = (field: string | number) => {
            const str = String(field);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };
        
        const csvRows = [
            headers.join(','),
            ...filteredMembers.map(member => [
                escapeCsvField(member.name),
                escapeCsvField(member.company),
                escapeCsvField(member.industry),
                escapeCsvField(member.location),
                escapeCsvField(member.email),
                escapeCsvField(member.joinedYear)
            ].join(','))
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'kadin_members_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n').filter(line => line.trim() !== '');
                if (lines.length < 2) {
                    throw new Error("CSV file must have a header and at least one data row.");
                }
                
                const headerLine = lines.shift()!.trim();
                const headers = headerLine.split(',').map(h => h.trim().toLowerCase());
                const requiredHeaders = ['name', 'company', 'industry', 'location', 'email', 'joinedyear'];
                
                const missingHeaders = requiredHeaders.filter(rh => !headers.includes(rh));
                if (missingHeaders.length > 0) {
                    throw new Error(`CSV is missing required headers: ${missingHeaders.join(', ')}`);
                }
                
                const headerIndexMap = requiredHeaders.reduce((acc, h) => {
                    acc[h] = headers.indexOf(h);
                    return acc;
                }, {} as Record<string, number>);

                const maxId = members.reduce((max, member) => Math.max(max, member.id), 0);
                
                const newMembers: MemberProfile[] = lines.map((line, index) => {
                    const values = line.split(',');
                    const name = values[headerIndexMap.name]?.trim();
                    const company = values[headerIndexMap.company]?.trim();
                    const industry = values[headerIndexMap.industry]?.trim();
                    const location = values[headerIndexMap.location]?.trim();
                    const email = values[headerIndexMap.email]?.trim();
                    const joinedYearStr = values[headerIndexMap.joinedyear]?.trim();
                    const joinedYear = joinedYearStr ? parseInt(joinedYearStr, 10) : NaN;

                    if (!name || !company || !industry || !location || !email || isNaN(joinedYear)) {
                        console.warn(`Skipping invalid row ${index + 2}: ${line}`);
                        return null;
                    }
                    
                    return {
                        id: maxId + 1 + index,
                        name,
                        company,
                        industry,
                        location,
                        email,
                        joinedYear,
                        avatarUrl: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
                    };
                }).filter((m): m is MemberProfile => m !== null);
                
                if (newMembers.length > 0) {
                    setMembers(prev => [...prev, ...newMembers]);
                    addNotification(`${newMembers.length} new member(s) imported successfully.`, 'success');
                } else {
                     addNotification('No valid new members found in the CSV file.', 'warning');
                }

            } catch (error) {
                console.error("CSV Import Error:", error);
                addNotification(error instanceof Error ? error.message : 'Failed to import CSV.', 'error');
            } finally {
                setIsImporting(false);
                if (event.target) event.target.value = '';
            }
        };

        reader.onerror = () => {
            addNotification('Failed to read the file.', 'error');
            setIsImporting(false);
            if (event.target) event.target.value = '';
        };

        reader.readAsText(file);
    };

    return (
        <div className="max-w-7xl mx-auto">
             <div className="flex flex-col items-center text-center gap-4 mb-10">
                <BuildingOffice2Icon className="w-12 h-12 text-sky-700" />
                <div>
                    <h1 className="text-4xl font-bold text-slate-800">Direktori Anggota KADIN</h1>
                    <p className="text-slate-600 mt-2 max-w-2xl">Temukan, terhubung, dan berkolaborasi dengan sesama anggota dari berbagai industri dan wilayah di seluruh Indonesia.</p>
                </div>
            </div>
            
            <Card className="mb-8">
                <CardContent className="p-4 sm:flex sm:flex-wrap sm:items-center sm:gap-4 space-y-4 sm:space-y-0">
                    <div className="relative flex-grow w-full sm:w-auto">
                        <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text"
                            placeholder="Search by name, company, or industry"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>
                    <select
                        value={industryFilter}
                        onChange={e => setIndustryFilter(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        aria-label="Filter by industry"
                    >
                        <option value="">All Industries</option>
                        {uniqueIndustries.map(industry => <option key={industry} value={industry}>{industry}</option>)}
                    </select>
                     <select
                        value={locationFilter}
                        onChange={e => setLocationFilter(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        aria-label="Filter by location"
                    >
                        <option value="">All Locations</option>
                        {uniqueLocations.map(location => <option key={location} value={location}>{location}</option>)}
                    </select>
                    <div className="flex-shrink-0 w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                         <button
                            onClick={() => setIsScannerOpen(true)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                            aria-label="Scan member QR code"
                         >
                            <QrCodeIcon className="w-5 h-5" />
                            <span>Scan QR</span>
                         </button>
                         <button
                            onClick={handleImportClick}
                            disabled={isImporting}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                            aria-label="Import members from a CSV file"
                        >
                            {isImporting ? (
                                 <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <DocumentArrowUpIcon className="w-5 h-5" />
                            )}
                            <span>{isImporting ? 'Importing...' : 'Import'}</span>
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
                        <button
                            onClick={handleExportCSV}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                            aria-label="Export filtered results to CSV"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            <span>Export</span>
                        </button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMembers.length > 0 ? (
                    filteredMembers.map(member => (
                        <MemberCard key={member.id} member={member} onViewDetails={() => setSelectedMember(member)} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-slate-600">No members match your search criteria.</p>
                    </div>
                )}
            </div>
            
            <MemberDetailsModal member={selectedMember} onClose={() => setSelectedMember(null)} />

            {isScannerOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex flex-col items-center justify-center p-4">
                    <div className="bg-white p-4 rounded-lg shadow-xl relative w-full max-w-sm">
                        <h3 className="text-center text-lg font-semibold mb-2 text-slate-800">Scan Member QR Code</h3>
                        <div id="qr-reader-container" className="w-full border border-slate-200 rounded-md overflow-hidden"></div>
                        <p className="text-center text-xs text-slate-500 mt-2">Position the QR code within the frame.</p>
                    </div>
                    <button 
                        onClick={closeScanner}
                        className="mt-6 bg-white text-slate-800 font-semibold py-2 px-6 rounded-full hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

export default DirectoryPage;