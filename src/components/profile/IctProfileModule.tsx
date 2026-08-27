import React, { useState, useRef } from 'react';
import { IctDocument, DocumentCategory, User } from '../../types';
import { notifySuccess, notifyError } from '../../utils/notifications';
import { DSLNG_OFFICIAL_ARTICLES, DslngArticle } from '../../data/dslngArticles';
import {
  BookOpen,
  FileText,
  UploadCloud,
  DownloadCloud,
  Shield,
  Building,
  Building2,
  Users,
  CheckCircle2,
  Lock,
  Layers,
  Award,
  Compass,
  MapPin,
  FileCode,
  X,
  Eye,
  Plus,
  ExternalLink,
  Navigation,
  Globe,
  Radio,
  Clock,
  Check,
  Phone,
  PhoneCall,
  Mail,
  Flame,
  Newspaper,
  Search,
  Tag,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';

interface IctProfileProps {
  documents: IctDocument[];
  currentUser: User;
  onAddDocument: (doc: IctDocument) => void;
}

export const IctProfileModule: React.FC<IctProfileProps> = ({
  documents,
  currentUser,
  onAddDocument,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'articles' | 'policy' | 'wi'>('about');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<IctDocument | null>(null);
  
  // Articles State
  const [articleCategory, setArticleCategory] = useState<string>('all');
  const [articleSearch, setArticleSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<DslngArticle | null>(null);

  // Exact coordinates, official working hours & verified contact numbers from dslng.com
  const DSLNG_LOCATIONS = {
    'Site Luwuk': {
      title: 'Site Luwuk (Plant Batui)',
      subtitle: 'Kilang LNG & Pelabuhan Khusus Donggi Port',
      coordinates: '-1.2511205, 122.5878024',
      lat: -1.2511205,
      lng: 122.5878024,
      address: 'Desa Uso, Kecamatan Batui, Kabupaten Banggai, Sulawesi Tengah 94762, Indonesia',
      areaType: 'Single-Train LNG Liquefaction Plant, Process Area, Storage Tank & Marine Jetty',
      telpMain: '+62 (461) 312 0000',
      telpAlt: '+62 (461) 312 8000',
      fax: '+62 (461) 312 0001',
      email: 'it.helpdesk@dslng.com',
      emailIct: 'it.helpdesk@dslng.com',
      workingDays: 'Senin – Jumat',
      workingHoursOffice: '07.00 – 17.00 WITA',
      workingHoursPlant: '24 Jam / 7 Hari (24/7 Continuous Shift Operasional Kilang & ICT On-Site Standby)',
      weekendStatus: 'Kantor Admin Tutup • Operasi Kilang & Helpdesk Siaga 24 Jam',
      radioComms: 'UHF Trunking CH 1 (Operations) & CH 4 (ICT Support)',
      geofenceRadius: '1.000 Meter (Radius Presensi Kilang Batui)',
      description: 'Fasilitas kilang pencairan gas alam cair (LNG) terpadu dengan pelabuhan khusus Donggi Port, Central Control Room (CCR), dan pusat komunikasi data satelit & fiber optik kilang.',
      googleMapsUrl: 'https://www.google.com/maps/place/PT+Donggi-Senoro+LNG/@-1.2513726,122.5895453,18z/data=!4m14!1m7!3m6!1s0x2d84391d7dde6b6d:0x7b214be0405e5c3d!2sDonggi+Port!8m2!3d-1.2518151!4d122.5939012!16s%2Fg%2F11d_8ly9b1!3m5!1s0x2d84301aaaaaaaab:0x7e624f16daa4f84a!8m2!3d-1.2511205!4d122.5878024',
      features: [
        'Central Control Room (CCR) & Process Instrumentation',
        'VSAT Satellite Earth Station & Subsea Fiber Optic Link',
        'UHF DMR Radio Trunking & Marine Harbor Jetty Comms',
        'OT / Industrial Control System (ICS) Cybersecurity Center'
      ]
    },
    'HO Jakarta': {
      title: 'HO Jakarta (Head Office)',
      subtitle: 'Kantor Pusat Korporat & Enterprise Data Center',
      coordinates: '-6.225916, 106.799722',
      lat: -6.225916,
      lng: 106.799722,
      address: 'Sentral Senayan II, 8th Floor, Jl. Asia Afrika No. 8, Gelora, Tanah Abang, Jakarta Pusat 10270, Indonesia',
      areaType: 'Corporate Head Office, Executive Boardroom & Hybrid Multi-Cloud Data Center',
      telpMain: '+62 (21) 509 899 99',
      telpAlt: '+62 (21) 5795 4000',
      fax: '+62 (21) 5795 4001',
      email: 'it.helpdesk@dslng.com',
      emailIct: 'it.helpdesk@dslng.com',
      workingDays: 'Senin – Jumat',
      workingHoursOffice: '08.00 – 17.00 WIB',
      workingHoursPlant: '24/7 Enterprise Server & Automated Disaster Recovery Hub',
      weekendStatus: 'Sabtu, Minggu & Hari Libur Nasional: Tutup (ICT Helpdesk On-Call Hotline)',
      radioComms: 'Direct VoIP SIP Trunk to Site Luwuk Ext. 8000',
      geofenceRadius: '200 Meter (Radius Presensi Gedung Sentral Senayan II)',
      description: 'Pusat administrasi korporat, arsitektur enterprise ICT, hybrid data center, monitoring sistem keamanan siber terpadu, dan tata kelola bisnis PT Donggi-Senoro LNG.',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sentral+Senayan+II+Jl+Asia+Afrika+No+8+Jakarta',
      features: [
        'Corporate Executive Boardroom & IT Operations Center',
        'Hybrid Multi-Cloud Data Center & Disaster Recovery Hub',
        'Enterprise Identity, Access Management & SAP S/4HANA',
        'Secure Remote VPN & Global Partner Interconnect'
      ]
    }
  };

  // Upload Form State
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<DocumentCategory>('Work Instruction');
  const [docCode, setDocCode] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
      const isSizeOk = file.size <= 10 * 1024 * 1024; // 10MB max

      if (!isPdf || !isSizeOk) {
        notifyError('Upload dokumen gagal: Ukuran file terlalu besar atau format bukan PDF.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setSelectedPdfFile(null);
        return;
      }
      setSelectedPdfFile(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!docTitle.trim() || !selectedPdfFile) {
      notifyError('Mohon lengkapi judul dokumen dan lampirkan file PDF.');
      return;
    }

    const generatedCode = docCode.trim() || `DSLNG-${docCategory === 'Policy' ? 'POL' : 'WI'}-ICT-${Math.floor(100 + Math.random() * 900)}`;

    const newDoc: IctDocument = {
      id: Date.now(),
      doc_code: generatedCode,
      title: docTitle.trim(),
      category: docCategory,
      file_path: `/docs/${generatedCode}.pdf`,
      uploaded_by: currentUser.id,
      uploaded_by_name: currentUser.name,
      size_kb: Math.round(selectedPdfFile.size / 1024),
      version: 'Rev. 1.0',
      description: docDescription.trim() || 'Dokumen pedoman operasional Departemen ICT PT Donggi-Senoro LNG.',
      created_at: new Date().toISOString(),
    };

    onAddDocument(newDoc);
    const successMsg =
      docCategory === 'Work Instruction'
        ? 'Dokumen Work Instruction baru berhasil di-upload.'
        : 'Dokumen Policy baru berhasil di-upload.';
    notifySuccess(successMsg);

    setShowUploadModal(false);
    setDocTitle('');
    setDocCode('');
    setDocDescription('');
    setSelectedPdfFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredDocs = documents.filter((doc) => {
    if (activeTab === 'policy') return doc.category === 'Policy';
    if (activeTab === 'wi') return doc.category === 'Work Instruction';
    return true;
  });

  const filteredArticles = DSLNG_OFFICIAL_ARTICLES.filter((art) => {
    const matchCategory = articleCategory === 'all' || art.category === articleCategory;
    const matchSearch =
      articleSearch === '' ||
      art.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      art.summary.toLowerCase().includes(articleSearch.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(articleSearch.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Module Title Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#004380] uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-[#00A3E0]" />
            <span>Profil Departemen ICT, Kontak Resmi & Kebijakan Korporat</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            ICT Profile & Informasi Perusahaan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hari & jam kerja operasional, kontak resmi terverifikasi dslng.com, lokasi kantor & kilang, artikel resmi perusahaan, dan repositori kebijakan ICT.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://dslng.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition border border-slate-200"
          >
            <Globe className="w-3.5 h-3.5 text-[#004380]" />
            <span>Web Resmi dslng.com</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {currentUser.role === 'admin' && (
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-[#004380] hover:bg-[#003366] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Upload PDF Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold max-w-2xl overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`flex-1 py-2 px-3.5 whitespace-nowrap rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'about'
              ? 'bg-[#004380] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>About</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('articles')}
          className={`flex-1 py-2 px-3.5 whitespace-nowrap rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'articles'
              ? 'bg-[#004380] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>Artikel DSLNG ({DSLNG_OFFICIAL_ARTICLES.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('policy')}
          className={`flex-1 py-2 px-3.5 whitespace-nowrap rounded-xl transition ${
            activeTab === 'policy'
              ? 'bg-[#004380] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Policy ({documents.filter(d => d.category === 'Policy').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('wi')}
          className={`flex-1 py-2 px-3.5 whitespace-nowrap rounded-xl transition ${
            activeTab === 'wi'
              ? 'bg-[#004380] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Work Instruction ({documents.filter(d => d.category === 'Work Instruction').length})
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. ABOUT US & LOKASI KANTOR (WITH WORKING HOURS & CONTACT) */}
      {/* ======================================================== */}
      {/* 1. ABOUT & STRATEGIC OVERVIEW TAB */}
      {/* ======================================================== */}
      {activeTab === 'about' && (
        <div className="space-y-6">
          
          {/* Vision & Mission Card */}
          <div className="bg-gradient-to-br from-[#0A2540] via-[#004380] to-[#002D57] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00A3E0]/15 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 w-full space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#00A3E0] uppercase tracking-widest flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-md backdrop-blur-xs">
                  <Shield className="w-3.5 h-3.5" />
                  <span>ICT Mandate & Strategic Excellence</span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-400/30">
                  PT Donggi-Senoro LNG &bull; Kelas Dunia
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Mendukung Keandalan Operasi Kilang LNG Kelas Dunia Melalui Infrastruktur Digital Tangguh
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed text-justify w-full">
                Departemen ICT PT Donggi-Senoro LNG bertindak sebagai pilar utama transformasi digital, pengamanan aset siber kilang, dan penyedia konektivitas telekomunikasi tanpa henti (99.98% availability) yang menghubungkan Plant Site di Batui, Kabupaten Banggai, dengan Head Office Jakarta dan mitra energi global.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/15 w-full">
                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
                  <div className="text-lg font-bold text-[#00A3E0]">99.98%</div>
                  <div className="text-[11px] text-slate-300 font-medium">Plant Network Availability</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
                  <div className="text-lg font-bold text-emerald-400">&lt; 15 Menit</div>
                  <div className="text-[11px] text-slate-300 font-medium">Mean Response Time SLA</div>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
                  <div className="text-lg font-bold text-amber-400">Zero Trust</div>
                  <div className="text-[11px] text-slate-300 font-medium">ICS & DCS Cybersecurity</div>
                </div>
              </div>
            </div>
          </div>

          {/* OFFICIAL WORKING HOURS, CONTACT & MERGED LOCATION MAPS SECTION */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-sky-50 text-[#004380]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Hari & Jam Kerja serta Lokasi
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Informasi resmi hari & jam kerja operasional kantor, shift kilang, nomor telepon, email layanan helpdesk, alamat, serta peta lokasi interaktif sesuai portal resmi{' '}
                  <a href="https://dslng.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#004380] hover:underline inline-flex items-center gap-0.5">
                    dslng.com <ExternalLink className="w-2.5 h-2.5" />
                  </a>.
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 self-start sm:self-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Terverifikasi Sesuai Web dslng.com</span>
              </span>
            </div>

            {/* 2 Big Detail Cards: HO Jakarta & Site Luwuk with Integrated Maps & Facilities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Card 1: HO Jakarta */}
              <div className="bg-gradient-to-br from-slate-50/70 via-white to-sky-50/30 rounded-2xl p-5 sm:p-6 border-2 border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-white">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">KANTOR PUSAT KORPORAT</span>
                      <h3 className="text-base font-extrabold text-slate-900">Head Office (HO Jakarta)</h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#004380] bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                    WIB (UTC+7)
                  </span>
                </div>

                {/* Working Days and Hours Block */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Clock className="w-4 h-4 text-[#004380]" />
                    <span>Hari & Jam Kerja Operasional:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-semibold block">Hari Kerja Kantor:</span>
                      <span className="text-xs font-bold text-slate-900">{DSLNG_LOCATIONS['HO Jakarta'].workingDays}</span>
                    </div>
                    <div className="bg-sky-50/60 p-2.5 rounded-lg border border-sky-100">
                      <span className="text-[10px] text-[#004380] font-semibold block">Jam Kerja Kantor:</span>
                      <span className="text-xs font-bold text-[#004380]">{DSLNG_LOCATIONS['HO Jakarta'].workingHoursOffice}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-100 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{DSLNG_LOCATIONS['HO Jakarta'].weekendStatus}</span>
                  </div>
                </div>

                {/* Contact Numbers and Addresses */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="w-full">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Nomor Telepon Kantor:</div>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <a
                          href="tel:+622150989999"
                          className="font-mono text-sm font-extrabold text-slate-900 hover:text-[#004380] hover:underline"
                        >
                          +62 21 509 899 99
                        </a>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                          (Utama / Main)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Hunting / Alternatif: <strong className="font-mono text-slate-700">+62 21 5795 4000</strong> &bull; Fax: <strong className="font-mono text-slate-700">+62 21 5795 4001</strong>
                      </div>
                    </div>
                  </div>

                  {/* Single Clean Email: it.helpdesk@dslng.com */}
                  <div className="flex items-start gap-2.5 pt-2.5 border-t border-slate-100">
                    <Mail className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Pusat Informasi & Email Layanan:</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a href="mailto:it.helpdesk@dslng.com" className="font-semibold text-[#004380] hover:underline">
                          it.helpdesk@dslng.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2.5 border-t border-slate-100">
                    <MapPin className="w-4 h-4 text-[#00A3E0] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Alamat Kantor Pusat:</div>
                      <div className="text-slate-800 mt-0.5 leading-relaxed">
                        Sentral Senayan II, 8th Floor, Jl. Asia Afrika No. 8, Gelora, Tanah Abang, Jakarta Pusat 10270, Indonesia
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-[#004380] bg-slate-50 px-2 py-0.5 rounded inline-block border border-slate-200 font-bold">
                        GPS: -6.225916, 106.799722
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integrated Detail Map Visual Box */}
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 p-4 text-white min-h-[160px] flex flex-col justify-between">
                  <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:12px_12px]"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded backdrop-blur-xs text-purple-200">
                      CORPORATE SENAYAN RADAR VIEW
                    </span>
                    <span className="text-[10px] text-purple-300 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                      HO Jakarta Online
                    </span>
                  </div>

                  <div className="relative z-10 my-2 text-center">
                    <div className="w-9 h-9 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto border border-purple-500/50 text-purple-300 shadow-md">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-extrabold text-white mt-1">Sentral Senayan II Lt. 8</div>
                    <div className="text-[10px] text-slate-300">Jl. Asia Afrika No.8, Gelora, Tanah Abang, Jakarta Pusat</div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Sentral+Senayan+II+Jl+Asia+Afrika+No+8+Jakarta"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 px-2 bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 shadow-xs transition"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka Google Maps</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText('-6.225916, 106.799722');
                        notifySuccess('Koordinat HO Jakarta berhasil disalin!');
                      }}
                      className="py-1.5 px-2.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 transition"
                    >
                      <FileCode className="w-3 h-3" />
                      <span>Salin GPS</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://dslng.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Cek Kontak di dslng.com</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('+62 21 509 899 99');
                      notifySuccess('Nomor telepon HO Jakarta (+62 21 509 899 99) berhasil disalin!');
                    }}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition border border-slate-200"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin Telp</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Site Luwuk */}
              <div className="bg-gradient-to-br from-sky-50/70 via-white to-slate-50/50 rounded-2xl p-5 sm:p-6 border-2 border-sky-200/80 shadow-xs space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#004380] text-white">
                      <Flame className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#004380]">KILANG LNG & PELABUHAN KHUSUS</span>
                      <h3 className="text-base font-extrabold text-slate-900">Site Luwuk (Plant Batui)</h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    WITA (UTC+8)
                  </span>
                </div>

                {/* Working Days and Hours Block */}
                <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-2xs space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-[#004380] font-bold">
                    <Clock className="w-4 h-4 text-[#004380]" />
                    <span>Hari & Jam Kerja Operasional Kilang:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-semibold block">Hari Kerja Kantor/Admin:</span>
                      <span className="text-xs font-bold text-slate-900">{DSLNG_LOCATIONS['Site Luwuk'].workingDays}</span>
                    </div>
                    <div className="bg-sky-50/60 p-2.5 rounded-lg border border-sky-100">
                      <span className="text-[10px] text-[#004380] font-semibold block">Jam Kerja Kantor/Admin:</span>
                      <span className="text-xs font-bold text-[#004380]">{DSLNG_LOCATIONS['Site Luwuk'].workingHoursOffice}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50/80 p-2.5 rounded-lg border border-amber-200 text-[11px] text-amber-900 font-medium flex items-start gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Plant & ICT Shift:</strong> 24 Jam / 7 Hari (24/7 Continuous Shift Operasional Kilang & Siaga Incident Response).</span>
                  </div>
                </div>

                {/* Contact Numbers and Addresses */}
                <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-2xs space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="w-full">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Nomor Telepon Kilang Batui:</div>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <a
                          href="tel:+624613120000"
                          className="font-mono text-sm font-extrabold text-[#004380] hover:underline"
                        >
                          +62 461 312 0000
                        </a>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                          (Utama / Main Site)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Hotline Kilang: <strong className="font-mono text-slate-700">+62 461 312 8000</strong> &bull; Fax: <strong className="font-mono text-slate-700">+62 461 312 0001</strong>
                      </div>
                    </div>
                  </div>

                  {/* Single Clean Email: it.helpdesk@dslng.com */}
                  <div className="flex items-start gap-2.5 pt-2.5 border-t border-slate-100">
                    <Mail className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Pusat Informasi & Email Layanan:</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a href="mailto:it.helpdesk@dslng.com" className="font-semibold text-[#004380] hover:underline">
                          it.helpdesk@dslng.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2.5 border-t border-slate-100">
                    <MapPin className="w-4 h-4 text-[#00A3E0] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Alamat Kilang & Pelabuhan:</div>
                      <div className="text-slate-800 mt-0.5 leading-relaxed">
                        Desa Uso, Kecamatan Batui, Kabupaten Banggai, Kota Luwuk, Sulawesi Tengah 94762, Indonesia
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-[#004380] bg-sky-50 px-2 py-0.5 rounded inline-block border border-sky-200 font-bold">
                        GPS: -1.2511205, 122.5878024
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integrated Detail Map Visual Box */}
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 p-4 text-white min-h-[160px] flex flex-col justify-between">
                  <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#00A3E0_1px,transparent_1px)] [background-size:12px_12px]"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded backdrop-blur-xs text-sky-200">
                      SATELLITE RADAR VIEW
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Batui Plant Online
                    </span>
                  </div>

                  <div className="relative z-10 my-2 text-center">
                    <div className="w-9 h-9 bg-[#00A3E0]/20 rounded-full flex items-center justify-center mx-auto border border-[#00A3E0]/50 text-[#00A3E0] shadow-md">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-extrabold text-white mt-1">PT Donggi-Senoro LNG Plant</div>
                    <div className="text-[10px] text-slate-300">Desa Uso, Batui & Marine Jetty Donggi Port</div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <a
                      href="https://www.google.com/maps/place/PT+Donggi-Senoro+LNG/@-1.2513726,122.5895453,18z/data=!4m14!1m7!3m6!1s0x2d84391d7dde6b6d:0x7b214be0405e5c3d!2sDonggi+Port!8m2!3d-1.2518151!4d122.5939012!16s%2Fg%2F11d_8ly9b1!3m5!1s0x2d84301aaaaaaaab:0x7e624f16daa4f84a!8m2!3d-1.2511205!4d122.5878024"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 px-2 bg-[#004380] hover:bg-[#003366] text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 shadow-xs transition"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka Google Maps</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText('-1.2511205, 122.5878024');
                        notifySuccess('Koordinat Site Luwuk berhasil disalin!');
                      }}
                      className="py-1.5 px-2.5 bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 transition"
                    >
                      <FileCode className="w-3 h-3" />
                      <span>Salin GPS</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://dslng.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-[#004380] hover:bg-[#003366] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Cek Kontak di dslng.com</span>
                    <ExternalLink className="w-3 h-3 text-sky-200" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('+62 461 312 0000');
                      notifySuccess('Nomor telepon Site Luwuk (+62 461 312 0000) berhasil disalin!');
                    }}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition border border-slate-200"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin Telp</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. DONGGI-SENORO LNG ARTICLES & NEWS TAB */}
      {/* ======================================================== */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#004380] uppercase tracking-wider">
                  <Newspaper className="w-4 h-4 text-[#00A3E0]" />
                  <span>Portal Berita & Publikasi Resmi Perusahaan</span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                  Artikel & Warta PT Donggi-Senoro LNG
                </h2>
                <p className="text-xs text-slate-500">
                  Kompilasi artikel dan berita resmi kegiatan operasional kilang, inovasi dekarbonisasi, penghargaan, dan program CSR dari portal resmi{' '}
                  <a href="https://dslng.com" target="_blank" rel="noopener noreferrer" className="text-[#004380] font-semibold hover:underline">
                    dslng.com
                  </a>.
                </p>
              </div>

              <a
                href="https://dslng.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#004380] hover:bg-[#003366] text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 shadow-xs transition self-start md:self-auto"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Kunjungi Portal dslng.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              {/* Category tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setArticleCategory('all')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    articleCategory === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({DSLNG_OFFICIAL_ARTICLES.length})
                </button>
                <button
                  type="button"
                  onClick={() => setArticleCategory('Operasi & Bisnis')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    articleCategory === 'Operasi & Bisnis' ? 'bg-[#004380] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Operasi & Bisnis
                </button>
                <button
                  type="button"
                  onClick={() => setArticleCategory('Inovasi & Lingkungan')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    articleCategory === 'Inovasi & Lingkungan' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Inovasi & Lingkungan
                </button>
                <button
                  type="button"
                  onClick={() => setArticleCategory('CSR & Masyarakat')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    articleCategory === 'CSR & Masyarakat' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  CSR & Komunitas
                </button>
                <button
                  type="button"
                  onClick={() => setArticleCategory('HSE & Keselamatan')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    articleCategory === 'HSE & Keselamatan' ? 'bg-rose-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  HSE & Keselamatan
                </button>
                <button
                  type="button"
                  onClick={() => setArticleCategory('ICT & Digital')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    articleCategory === 'ICT & Digital' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ICT & Digital
                </button>
              </div>

              {/* Search box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  placeholder="Cari judul, topik, atau kata kunci..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#004380] outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              Tidak ada artikel yang cocok dengan pencarian atau filter kategori.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-[#00A3E0] hover:shadow-md transition cursor-pointer p-5 flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-sky-50 text-[#004380] border border-sky-100">
                        {art.category}
                      </span>
                      <span className="text-[11px] text-slate-400">{art.date}</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#004380] transition leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>

                    {/* Tag chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {art.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{art.readTime}</span>
                    </span>
                    
                    <button
                      type="button"
                      className="text-[#004380] font-bold text-xs inline-flex items-center gap-1 group-hover:translate-x-1 transition"
                    >
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* 3. POLICY & WORK INSTRUCTION REPOSITORY LIST */}
      {/* ======================================================== */}
      {(activeTab === 'policy' || activeTab === 'wi') && (
        <div className="space-y-4">
          {filteredDocs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Belum ada dokumen {activeTab === 'policy' ? 'Policy (Kebijakan)' : 'Work Instruction (WI)'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Repositori dokumen dalam kondisi bersih dan siap untuk pengunggahan file PDF baru oleh Administrator.
              </p>
              {currentUser.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    setDocCategory(activeTab === 'policy' ? 'Policy' : 'Work Instruction');
                    setShowUploadModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#004380] hover:bg-[#003366] text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Dokumen PDF Sekarang</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-[#00A3E0] transition space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-[#004380] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {doc.doc_code}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
                        {doc.version} &bull; {doc.size_kb} KB
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{doc.title}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{doc.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Uploaded by {doc.uploaded_by_name} ({new Date(doc.created_at).toLocaleDateString('id-ID')})
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDocPreview(doc)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Preview</span>
                      </button>
                      <a
                        href={`#download-${doc.doc_code}`}
                        onClick={(e) => {
                          e.preventDefault();
                          notifySuccess(`Mengunduh berkas resmi ${doc.doc_code}.pdf...`);
                        }}
                        className="px-3 py-1.5 bg-[#004380] hover:bg-[#003366] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-xs"
                      >
                        <DownloadCloud className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* ARTICLE FULL READING MODAL */}
      {/* ======================================================== */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-sky-50/60">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#004380] text-white">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {selectedArticle.date} &bull; {selectedArticle.readTime}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{selectedArticle.author}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                    {selectedArticle.sourceLabel}
                  </span>
                </div>
              </div>

              {/* Summary quote block */}
              <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-[#004380] text-xs sm:text-sm text-slate-700 font-medium italic leading-relaxed">
                "{selectedArticle.summary}"
              </div>

              {/* Paragraphs */}
              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedArticle.content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Topik Terkait:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Sumber Resmi: <strong className="text-slate-800">PT Donggi-Senoro LNG</strong>
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={selectedArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#004380] hover:bg-[#003366] rounded-xl shadow-xs inline-flex items-center gap-1.5 transition"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Buka Web dslng.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-sky-50/50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00A3E0]" />
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedDocPreview.doc_code}: {selectedDocPreview.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800">Ringkasan Dokumen:</div>
                <p className="text-slate-600 leading-relaxed">{selectedDocPreview.description}</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  <span>Kategori: <strong className="text-slate-800">{selectedDocPreview.category}</strong></span>
                  <span>Versi: <strong className="text-slate-800">{selectedDocPreview.version}</strong></span>
                  <span>Format: <strong className="text-red-700">PDF Document</strong></span>
                </div>
              </div>

              {/* Sample PDF Page Frame Preview */}
              <div className="border border-slate-300 rounded-xl p-6 bg-white shadow-xs space-y-3 font-serif">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <div className="text-[10px] font-sans font-bold text-slate-500 uppercase">PT DONGGI-SENORO LNG ICT REPOSITORY</div>
                  <div className="text-[10px] font-mono text-slate-400">{selectedDocPreview.doc_code}</div>
                </div>
                <h4 className="text-base font-bold font-sans text-slate-900">{selectedDocPreview.title}</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  Dokumen ini merupakan panduan resmi Departemen ICT PT Donggi-Senoro LNG. Segala bentuk pelanggaran terhadap ketentuan dalam dokumen ini dapat dikenakan sanksi sesuai Peraturan Perusahaan PT DSLNG dan standar hukum ketenagakerjaan yang berlaku.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  notifySuccess(`Dokumen ${selectedDocPreview.doc_code}.pdf berhasil diunduh.`);
                  setSelectedDocPreview(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#004380] hover:bg-[#003366] rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>Unduh File PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD PDF MODAL (Admin Only) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-sky-50/50">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#00A3E0]" />
                <h3 className="text-base font-bold text-slate-900">Upload Dokumen PDF Baru</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kategori Dokumen
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDocCategory('Policy')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                      docCategory === 'Policy'
                        ? 'bg-[#004380] text-white border-[#004380]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Policy (Kebijakan)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocCategory('Work Instruction')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                      docCategory === 'Work Instruction'
                        ? 'bg-[#004380] text-white border-[#004380]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Work Instruction (WI)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Dokumen Resmi
                </label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Contoh: Work Instruction Konfigurasi Port Switch Kilang"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#004380] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kode Dokumen (Opsional)
                </label>
                <input
                  type="text"
                  value={docCode}
                  onChange={(e) => setDocCode(e.target.value)}
                  placeholder="Contoh: DSLNG-WI-ICT-088"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#004380] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi / Ruang Lingkup Dokumen
                </label>
                <textarea
                  rows={2}
                  value={docDescription}
                  onChange={(e) => setDocDescription(e.target.value)}
                  placeholder="Ringkasan isi dan sasaran kepatuhan dokumen..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#004380] outline-none"
                />
              </div>

              {/* PDF File Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Lampiran Berkas PDF (Maks. 10MB)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  required
                  onChange={handleFileSelect}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#004380] file:text-white hover:file:bg-[#003366] cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#004380] hover:bg-[#003366] rounded-lg shadow-sm transition"
                >
                  Simpan & Publikasikan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
