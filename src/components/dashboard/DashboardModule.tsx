import React, { useState } from 'react';
import {
  User,
  Asset,
  Ticket,
  Attendance,
  LeaveRequest,
  TicketStatus,
  WorkLocation,
} from '../../types';
import {
  Server,
  Laptop,
  Monitor,
  HardDrive,
  Ticket as TicketIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Building,
  Building2,
  UserCheck,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Package,
  Wrench,
  AlertOctagon,
  ShieldCheck,
  ChevronRight,
  Plus,
  Search,
  Filter,
  User as UserIcon,
  Activity,
  ShieldAlert,
  Headphones,
  Tag,
  Flame,
  Radio,
  FileSpreadsheet,
  Globe2,
  Compass,
} from 'lucide-react';

interface DashboardModuleProps {
  currentUser: User;
  assets: Asset[];
  tickets: Ticket[];
  attendances: Attendance[];
  leaves: LeaveRequest[];
  onNavigate: (module: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  currentUser,
  assets = [],
  tickets = [],
  attendances = [],
  leaves = [],
  onNavigate,
}) => {
  // Ticket Metrics Filter State in Dashboard
  const [ticketTabFilter, setTicketTabFilter] = useState<'all' | 'Open' | 'In Progress' | 'Resolved'>('all');
  const [ticketLocationFilter, setTicketLocationFilter] = useState<'all' | 'Site Luwuk' | 'HO Jakarta'>('all');
  const [ticketSearch, setTicketSearch] = useState('');

  // ----------------------------------------------------
  // LOCATION-BASED COMPARISON DATA CALCULATIONS
  // ----------------------------------------------------

  // 1. Tickets breakdown
  const siteTickets = tickets.filter(t => t.work_location === 'Site Luwuk');
  const hoTickets = tickets.filter(t => t.work_location === 'HO Jakarta');

  const openTickets = tickets.filter(t => t.status === 'Open');
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress');
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed');

  const siteOpenTickets = siteTickets.filter(t => t.status === 'Open');
  const siteInProgressTickets = siteTickets.filter(t => t.status === 'In Progress');
  const siteResolvedTickets = siteTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed');

  const hoOpenTickets = hoTickets.filter(t => t.status === 'Open');
  const hoInProgressTickets = hoTickets.filter(t => t.status === 'In Progress');
  const hoResolvedTickets = hoTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed');

  // 2. Assets breakdown
  const siteAssets = assets.filter(a => a.work_location === 'Site Luwuk');
  const hoAssets = assets.filter(a => a.work_location === 'HO Jakarta');

  const inUseAssets = assets.filter(a => (a.asset_state || 'use') === 'use');
  const inStoreAssets = assets.filter(a => a.asset_state === 'store');
  const inLendAssets = assets.filter(a => a.asset_state === 'lend');
  const inServicesAssets = assets.filter(a => a.asset_state === 'services');
  const brokenAssets = assets.filter(a => a.asset_state === 'broken');

  const siteInUse = siteAssets.filter(a => (a.asset_state || 'use') === 'use');
  const siteInStore = siteAssets.filter(a => a.asset_state === 'store');
  const siteInServices = siteAssets.filter(a => a.asset_state === 'services');
  const siteBroken = siteAssets.filter(a => a.asset_state === 'broken');
  const siteLend = siteAssets.filter(a => a.asset_state === 'lend');

  const hoInUse = hoAssets.filter(a => (a.asset_state || 'use') === 'use');
  const hoInStore = hoAssets.filter(a => a.asset_state === 'store');
  const hoInServices = hoAssets.filter(a => a.asset_state === 'services');
  const hoBroken = hoAssets.filter(a => a.asset_state === 'broken');
  const hoLend = hoAssets.filter(a => a.asset_state === 'lend');

  // Hardware types
  const siteLaptops = siteAssets.filter(a => a.type_name === 'Laptop');
  const siteDesktops = siteAssets.filter(a => a.type_name === 'Desktop');
  const siteMonitors = siteAssets.filter(a => a.type_name === 'Monitor');

  const hoLaptops = hoAssets.filter(a => a.type_name === 'Laptop');
  const hoDesktops = hoAssets.filter(a => a.type_name === 'Desktop');
  const hoMonitors = hoAssets.filter(a => a.type_name === 'Monitor');

  const totalLaptops = assets.filter(a => a.type_name === 'Laptop');
  const totalDesktops = assets.filter(a => a.type_name === 'Desktop');
  const totalMonitors = assets.filter(a => a.type_name === 'Monitor');

  // 3. Attendance breakdown
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendances = attendances.filter(a => (a.clock_in || a.created_at || '').startsWith(todayStr));
  const effectiveAttendances = todayAttendances.length > 0 ? todayAttendances : attendances;

  const siteAttendances = effectiveAttendances.filter(a => a.work_location === 'Site Luwuk');
  const hoAttendances = effectiveAttendances.filter(a => a.work_location === 'HO Jakarta');

  // 4. Leaves breakdown
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  const approvedLeaves = leaves.filter(l => l.status === 'Approved');

  const siteLeaves = leaves.filter(l => l.work_location === 'Site Luwuk');
  const hoLeaves = leaves.filter(l => l.work_location === 'HO Jakarta');
  const sitePendingLeaves = siteLeaves.filter(l => l.status === 'Pending');
  const hoPendingLeaves = hoLeaves.filter(l => l.status === 'Pending');

  // Directorate Distribution
  const directorates = [
    { name: 'Operations & Plant Batui', count: tickets.filter(t => (t.department || '').toLowerCase().includes('operat') || (t.department || '').toLowerCase().includes('plant') || (t.department || '').toLowerCase().includes('hse') || (t.department || '').toLowerCase().includes('prod')).length, color: 'bg-[#004380]' },
    { name: 'Finance & Corporate Support', count: tickets.filter(t => (t.department || '').toLowerCase().includes('finan') || (t.department || '').toLowerCase().includes('corp') || (t.department || '').toLowerCase().includes('procure') || (t.department || '').toLowerCase().includes('supply')).length, color: 'bg-[#00A3E0]' },
    { name: 'Commercial, HR & Legal', count: tickets.filter(t => (t.department || '').toLowerCase().includes('hr') || (t.department || '').toLowerCase().includes('legal') || (t.department || '').toLowerCase().includes('comm')).length, color: 'bg-emerald-600' },
    { name: 'Technical & Engineering', count: tickets.filter(t => (t.department || '').toLowerCase().includes('eng') || (t.department || '').toLowerCase().includes('tech') || (t.department || '').toLowerCase().includes('ict') || (t.department || '').toLowerCase().includes('maint')).length, color: 'bg-purple-600' },
  ];

  // Role privileges
  const isPrivileged = currentUser.role === 'admin' || currentUser.role === 'it_helpdesk';

  // Filtered tickets
  const displayedTickets = tickets
    .filter((t) => {
      const matchStatus =
        ticketTabFilter === 'all'
          ? true
          : ticketTabFilter === 'Resolved'
          ? t.status === 'Resolved' || t.status === 'Closed'
          : t.status === ticketTabFilter;

      const matchLocation =
        ticketLocationFilter === 'all' ? true : t.work_location === ticketLocationFilter;

      const matchSearch =
        ticketSearch === '' ||
        t.ticket_code.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.requester_name.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        (t.department && t.department.toLowerCase().includes(ticketSearch.toLowerCase()));

      return matchStatus && matchLocation && matchSearch;
    })
    .slice(0, 8);

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Open</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>In Progress</span>
          </span>
        );
      case 'Resolved':
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Resolved</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Welcome & Operational Status Hero Card */}
      <div className="bg-gradient-to-r from-[#004380] via-[#005599] to-[#00A3E0] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Server className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-sky-200 bg-white/15 px-3 py-1 rounded-md inline-flex items-center gap-1.5 backdrop-blur-xs">
              <Building className="w-3.5 h-3.5" />
              <span>PT Donggi-Senoro LNG &bull; ICT Operations Portal</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-400/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Dual Location Live Sync (Site Batui &bull; HO Jakarta)</span>
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {currentUser.name}
          </h1>
          <p className="text-xs md:text-sm text-sky-100 mt-2 leading-relaxed">
            Portal operasional terpadu ICT PT Donggi-Senoro LNG. Memantau integrasi langsung tiket helpdesk staff & IT, status inventaris aset kilang Batui Luwuk dan HO Jakarta, log presensi GPS, serta alur pengajuan cuti.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5 text-xs">
            <div className="bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5 font-medium">
              <span className="text-sky-200">Role:</span>
              <strong className="uppercase font-bold tracking-wide">{currentUser.role.replace('_', ' ')}</strong>
            </div>
            <div className="bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-sky-300" />
              <span>{currentUser.work_location === 'HO Jakarta' ? 'HO Jakarta (Sentral Senayan II)' : 'Site Luwuk (Plant Batui)'}</span>
            </div>
            <div className="bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5 font-medium">
              <span className="text-sky-200">Dept:</span>
              <strong>{currentUser.department || 'ICT Operations'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY KPI CARDS WITH TOTAL & LOCATION BREAKDOWN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Tickets */}
        <div
          onClick={() => onNavigate('helpdesk')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#00A3E0] hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tiket Layanan (Helpdesk)</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition">
                <TicketIcon className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">{tickets.length}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
            </div>

            {/* Status breakdown */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold mt-1 flex-wrap text-slate-600">
              <span className="text-rose-600 font-bold">{openTickets.length} Open</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-amber-600 font-bold">{inProgressTickets.length} In Progress</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-emerald-600 font-bold">{resolvedTickets.length} Selesai</span>
            </div>
          </div>

          {/* Location Split Sub-Box */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-sky-50/70 p-2 rounded-xl border border-sky-100">
              <div className="text-[10px] font-bold text-[#004380] uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 text-amber-600" />
                <span>Site Luwuk</span>
              </div>
              <div className="text-base font-extrabold text-[#004380] mt-0.5">{siteTickets.length}</div>
              <div className="text-[10px] text-slate-500">{siteOpenTickets.length} open &bull; {siteResolvedTickets.length} selesai</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-2.5 h-2.5 text-[#00A3E0]" />
                <span>HO Jakarta</span>
              </div>
              <div className="text-base font-extrabold text-slate-800 mt-0.5">{hoTickets.length}</div>
              <div className="text-[10px] text-slate-500">{hoOpenTickets.length} open &bull; {hoResolvedTickets.length} selesai</div>
            </div>
          </div>
        </div>

        {/* KPI 2: Assets */}
        <div
          onClick={() => isPrivileged ? onNavigate('assets') : onNavigate('profile')}
          className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-xs transition flex flex-col justify-between ${
            isPrivileged ? 'cursor-pointer hover:border-[#00A3E0] hover:shadow-md group' : ''
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Aset ICT</span>
              <div className="p-2 rounded-xl bg-sky-50 text-[#004380] group-hover:bg-sky-100 transition">
                <Server className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">{assets.length}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
            </div>

            {/* Asset state breakdown */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold mt-1 flex-wrap">
              <span className="text-emerald-700">{inUseAssets.length} Use</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-sky-700">{inStoreAssets.length} Store</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-purple-700">{inServicesAssets.length} Servis</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-rose-700">{brokenAssets.length} Afkir</span>
            </div>
          </div>

          {/* Location Split Sub-Box */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-sky-50/70 p-2 rounded-xl border border-sky-100">
              <div className="text-[10px] font-bold text-[#004380] uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 text-amber-600" />
                <span>Site Luwuk</span>
              </div>
              <div className="text-base font-extrabold text-[#004380] mt-0.5">{siteAssets.length}</div>
              <div className="text-[10px] text-slate-500">{siteInUse.length} use &bull; {siteInStore.length} store</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-2.5 h-2.5 text-[#00A3E0]" />
                <span>HO Jakarta</span>
              </div>
              <div className="text-base font-extrabold text-slate-800 mt-0.5">{hoAssets.length}</div>
              <div className="text-[10px] text-slate-500">{hoInUse.length} use &bull; {hoInStore.length} store</div>
            </div>
          </div>
        </div>

        {/* KPI 3: Leaves */}
        <div
          onClick={() => onNavigate('leave')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#00A3E0] hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pengajuan Cuti</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition">
                <Calendar className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">{leaves.length}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
            </div>

            <div className="text-[11px] text-purple-700 font-semibold mt-1">
              {pendingLeaves.length} Pengajuan Menunggu E-Sign
            </div>
          </div>

          {/* Location Split Sub-Box */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-purple-50/70 p-2 rounded-xl border border-purple-100">
              <div className="text-[10px] font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 text-amber-600" />
                <span>Site Luwuk</span>
              </div>
              <div className="text-base font-extrabold text-purple-900 mt-0.5">{siteLeaves.length}</div>
              <div className="text-[10px] text-purple-700">{sitePendingLeaves.length} pending approval</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-2.5 h-2.5 text-[#00A3E0]" />
                <span>HO Jakarta</span>
              </div>
              <div className="text-base font-extrabold text-slate-800 mt-0.5">{hoLeaves.length}</div>
              <div className="text-[10px] text-slate-500">{hoPendingLeaves.length} pending approval</div>
            </div>
          </div>
        </div>

        {/* KPI 4: Attendance */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#00A3E0] hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Presensi Helpdesk</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">{effectiveAttendances.length}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Log GPS</span>
            </div>

            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              Kamera Selfie + Verifikasi Geofence
            </div>
          </div>

          {/* Location Split Sub-Box */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 text-amber-600" />
                <span>Batui Luwuk</span>
              </div>
              <div className="text-base font-extrabold text-emerald-900 mt-0.5">{siteAttendances.length}</div>
              <div className="text-[10px] text-emerald-700">Radius Kilang 1000m</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-2.5 h-2.5 text-[#00A3E0]" />
                <span>HO Senayan</span>
              </div>
              <div className="text-base font-extrabold text-slate-800 mt-0.5">{hoAttendances.length}</div>
              <div className="text-[10px] text-slate-500">Radius Gedung 200m</div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. DEDICATED LOCATION COMPARISON BOARD (SITE LUWUK vs HO JAKARTA) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-50 text-[#004380]">
                <Globe2 className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Perbandingan Operasional 2 Lokasi Kerja (Site Luwuk &bull; HO Jakarta)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Matriks perbandingan real-time antara Kilang LNG Batui Luwuk (Sulawesi Tengah) dan Head Office Senayan Jakarta.
            </p>
          </div>

          {/* Location Badges without percentages */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#004380]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004380]"></span>
              <span>Site Luwuk (Plant Batui)</span>
            </div>
            <span className="text-slate-300 font-bold">&bull;</span>
            <div className="flex items-center gap-1.5 font-bold text-[#00A3E0]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00A3E0]"></span>
              <span>HO Jakarta (Sentral Senayan II)</span>
            </div>
          </div>
        </div>

        {/* Side-by-side location cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Card A: Site Luwuk (Plant Batui) */}
          <div className="bg-gradient-to-br from-sky-50/70 via-white to-slate-50/50 rounded-2xl p-5 border-2 border-sky-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#004380] text-white">
                    <Flame className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Site Luwuk (Plant Batui)</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Kilang LNG &bull; Banggai, Sulawesi Tengah</p>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-[#004380] font-mono text-[11px] font-bold border border-sky-200">
                -1.2721, 122.5851
              </span>
            </div>

            {/* Metrics Matrix for Site Luwuk */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
              <div className="bg-white p-3 rounded-xl border border-sky-100 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Tiket Layanan</div>
                <div className="text-xl font-extrabold text-[#004380] mt-0.5">{siteTickets.length}</div>
                <div className="text-[10px] text-rose-600 font-semibold">{siteOpenTickets.length} Open</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-sky-100 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Aset Kilang</div>
                <div className="text-xl font-extrabold text-[#004380] mt-0.5">{siteAssets.length}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">{siteInUse.length} In Use</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-sky-100 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Presensi Helpdesk</div>
                <div className="text-xl font-extrabold text-[#004380] mt-0.5">{siteAttendances.length}</div>
                <div className="text-[10px] text-slate-500 font-semibold">GPS Batui</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-sky-100 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Pengajuan Cuti</div>
                <div className="text-xl font-extrabold text-[#004380] mt-0.5">{siteLeaves.length}</div>
                <div className="text-[10px] text-purple-600 font-semibold">{sitePendingLeaves.length} Pending</div>
              </div>
            </div>

            {/* Hardware allocation in site */}
            <div className="mt-3.5 pt-3 border-t border-sky-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <span className="font-semibold text-slate-700">Inventaris Perangkat:</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-medium"><Laptop className="w-3.5 h-3.5 text-[#00A3E0]" /> {siteLaptops.length} Laptop</span>
                <span className="flex items-center gap-1 font-medium"><HardDrive className="w-3.5 h-3.5 text-purple-600" /> {siteDesktops.length} Desktop</span>
                <span className="flex items-center gap-1 font-medium"><Monitor className="w-3.5 h-3.5 text-emerald-600" /> {siteMonitors.length} Monitor</span>
              </div>
            </div>
          </div>

          {/* Card B: HO Jakarta (Sentral Senayan II) */}
          <div className="bg-gradient-to-br from-slate-50/70 via-white to-sky-50/30 rounded-2xl p-5 border-2 border-slate-200 shadow-xs relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-slate-800 text-white">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">HO Jakarta (Head Office)</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Sentral Senayan II Lt. 17 &bull; GBK, Jakarta Pusat</p>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px] font-bold border border-slate-200">
                -6.2255, 106.7997
              </span>
            </div>

            {/* Metrics Matrix for HO Jakarta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Tiket Layanan</div>
                <div className="text-xl font-extrabold text-slate-800 mt-0.5">{hoTickets.length}</div>
                <div className="text-[10px] text-rose-600 font-semibold">{hoOpenTickets.length} Open</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Aset HO</div>
                <div className="text-xl font-extrabold text-slate-800 mt-0.5">{hoAssets.length}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">{hoInUse.length} In Use</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Presensi Helpdesk</div>
                <div className="text-xl font-extrabold text-slate-800 mt-0.5">{hoAttendances.length}</div>
                <div className="text-[10px] text-slate-500 font-semibold">GPS Senayan</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Pengajuan Cuti</div>
                <div className="text-xl font-extrabold text-slate-800 mt-0.5">{hoLeaves.length}</div>
                <div className="text-[10px] text-purple-600 font-semibold">{hoPendingLeaves.length} Pending</div>
              </div>
            </div>

            {/* Hardware allocation in HO */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <span className="font-semibold text-slate-700">Inventaris Perangkat:</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-medium"><Laptop className="w-3.5 h-3.5 text-[#00A3E0]" /> {hoLaptops.length} Laptop</span>
                <span className="flex items-center gap-1 font-medium"><HardDrive className="w-3.5 h-3.5 text-purple-600" /> {hoDesktops.length} Desktop</span>
                <span className="flex items-center gap-1 font-medium"><Monitor className="w-3.5 h-3.5 text-emerald-600" /> {hoMonitors.length} Monitor</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. LIVE CONNECTED HELPDESK TICKETS SECTION (WITH LOCATION & STATUS FILTER) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <TicketIcon className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Tiket Helpdesk Terkini (Live Feed &bull; Terhubung ke Seluruh Lokasi)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tiket yang dibuat oleh Staff IT Helpdesk & Karyawan terkoneksi langsung secara real-time ke sistem helpdesk dan data aset.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-dash-create-ticket"
              onClick={() => onNavigate('helpdesk')}
              className="px-3.5 py-2 bg-[#004380] hover:bg-[#003366] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Tiket Baru</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('helpdesk')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition"
            >
              <span>Buka Modul Helpdesk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Controls: Location Selector + Status Tabs + Search */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Location Selector Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setTicketLocationFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  ticketLocationFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Lokasi ({tickets.length})
              </button>
              <button
                type="button"
                onClick={() => setTicketLocationFilter('Site Luwuk')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  ticketLocationFilter === 'Site Luwuk' ? 'bg-[#004380] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Flame className="w-3 h-3 text-amber-300" />
                <span>Site Luwuk ({siteTickets.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setTicketLocationFilter('HO Jakarta')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                  ticketLocationFilter === 'HO Jakarta' ? 'bg-[#00A3E0] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>HO Jakarta ({hoTickets.length})</span>
              </button>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setTicketTabFilter('all')}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  ticketTabFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Status
              </button>
              <button
                type="button"
                onClick={() => setTicketTabFilter('Open')}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  ticketTabFilter === 'Open' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Open ({openTickets.length})
              </button>
              <button
                type="button"
                onClick={() => setTicketTabFilter('In Progress')}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  ticketTabFilter === 'In Progress' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In Progress ({inProgressTickets.length})
              </button>
              <button
                type="button"
                onClick={() => setTicketTabFilter('Resolved')}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  ticketTabFilter === 'Resolved' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Resolved ({resolvedTickets.length})
              </button>
            </div>
          </div>

          <div className="relative w-full lg:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
              placeholder="Cari no. tiket, subjek, pemohon..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#004380] outline-none transition"
            />
          </div>
        </div>

        {/* Live Tickets Table / Card Feed */}
        {tickets.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-8 text-center border border-dashed border-slate-300 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <TicketIcon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Belum Ada Tiket yang Dibuat</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Saat Staff IT Helpdesk atau Karyawan membuat pengaduan atau permintaan penanganan perangkat di Site Luwuk maupun HO Jakarta, tiket akan otomatis muncul dan terhubung di sini.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('helpdesk')}
                className="px-4 py-2 bg-[#004380] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#003366] transition inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Tiket Pertama</span>
              </button>
            </div>
          </div>
        ) : displayedTickets.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200 text-xs text-slate-500">
            Tidak ada tiket yang sesuai dengan filter lokasi ({ticketLocationFilter}) atau status ({ticketTabFilter}).
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3.5 rounded-l-xl">No. Tiket</th>
                  <th className="py-3 px-3.5">Lokasi Kerja</th>
                  <th className="py-3 px-3.5">Subjek / Masalah</th>
                  <th className="py-3 px-3.5">Pemohon</th>
                  <th className="py-3 px-3.5">Kategori</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5">Dibuat Pada</th>
                  <th className="py-3 px-3.5 text-right rounded-r-xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {displayedTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-sky-50/50 transition">
                    <td className="py-3 px-3.5 font-mono font-bold text-[#004380]">
                      {ticket.ticket_code}
                    </td>
                    <td className="py-3 px-3.5">
                      {ticket.work_location === 'Site Luwuk' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-[#004380] font-bold text-[10px] border border-sky-200">
                          <Flame className="w-2.5 h-2.5 text-amber-600" />
                          <span>Site Luwuk</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                          <Building2 className="w-2.5 h-2.5 text-[#00A3E0]" />
                          <span>HO Jakarta</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-900 line-clamp-1">{ticket.subject}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{ticket.body}</div>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-slate-900">{ticket.requester_name}</div>
                      <div className="text-[10px] text-slate-500">
                        {ticket.department || 'Operations'}
                      </div>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                        {ticket.category}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="py-3 px-3.5 text-slate-500 text-[11px]">
                      {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onNavigate('helpdesk')}
                        className="px-2.5 py-1 text-xs font-bold text-[#004380] bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition inline-flex items-center gap-1"
                      >
                        <span>Lihat</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer ticket connection summary */}
        {tickets.length > 0 && (
          <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-100 gap-2">
            <div>
              Menampilkan {displayedTickets.length} dari total {tickets.length} tiket di database ICT (Site Luwuk: {siteTickets.length} &bull; HO Jakarta: {hoTickets.length}).
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Open: <strong>{openTickets.length}</strong>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> In Progress: <strong>{inProgressTickets.length}</strong>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Selesai: <strong>{resolvedTickets.length}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 5. VISUAL CHARTS & DETAILED ASSET/LOCATION BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ticket Performance & Directorate Distribution Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <TicketIcon className="w-4 h-4 text-[#00A3E0]" />
                <span>Distribusi Beban 4 Direktorat (Site vs HO)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Sebaran beban kendala teknis dan penanganan SLA</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('helpdesk')}
              className="text-xs font-bold text-[#004380] hover:underline flex items-center gap-1"
            >
              <span>Buka Ticketing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Ticket Status Breakdown Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Open (Menunggu Tindakan)
                </span>
                <span className="font-bold text-slate-900">
                  {openTickets.length} ({tickets.length ? Math.round((openTickets.length / tickets.length) * 100) : 0}%)
                  <span className="text-[11px] text-slate-400 font-normal ml-1.5">[Site: {siteOpenTickets.length} | HO: {hoOpenTickets.length}]</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-500 h-2 rounded-full transition-all" style={{ width: `${tickets.length ? (openTickets.length / tickets.length) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> In Progress (Sedang Dikerjakan)
                </span>
                <span className="font-bold text-slate-900">
                  {inProgressTickets.length} ({tickets.length ? Math.round((inProgressTickets.length / tickets.length) * 100) : 0}%)
                  <span className="text-[11px] text-slate-400 font-normal ml-1.5">[Site: {siteInProgressTickets.length} | HO: {hoInProgressTickets.length}]</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${tickets.length ? (inProgressTickets.length / tickets.length) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved / Closed (Selesai)
                </span>
                <span className="font-bold text-slate-900">
                  {resolvedTickets.length} ({tickets.length ? Math.round((resolvedTickets.length / tickets.length) * 100) : 0}%)
                  <span className="text-[11px] text-slate-400 font-normal ml-1.5">[Site: {siteResolvedTickets.length} | HO: {hoResolvedTickets.length}]</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${tickets.length ? (resolvedTickets.length / tickets.length) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>

          {/* Directorate breakdown */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-800 mb-2">Sebaran Beban 4 Direktorat DSLNG:</div>
            <div className="grid grid-cols-2 gap-2">
              {directorates.map((d, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="text-[11px] font-medium text-slate-700 truncate pr-2" title={d.name}>{d.name}</div>
                  <span className="text-xs font-bold text-[#004380] bg-white px-2 py-0.5 rounded border border-slate-200">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Asset State & Location Hardware Comparison Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-[#00A3E0]" />
                <span>Kondisi Aset Perangkat (Site Luwuk vs HO Jakarta)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Perbandingan kondisi fisik dan alokasi perangkat per lokasi</p>
            </div>
            {isPrivileged && (
              <button
                type="button"
                onClick={() => onNavigate('assets')}
                className="text-xs font-bold text-[#004380] hover:underline flex items-center gap-1"
              >
                <span>Kelola Aset</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Asset State Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>In Use (Aktif)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-xl font-bold text-emerald-900 mt-1">{inUseAssets.length} <span className="text-xs font-normal text-emerald-700">Total</span></div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Site: {siteInUse.length} &bull; HO: {hoInUse.length}</div>
            </div>

            <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200">
              <div className="flex items-center justify-between text-xs font-bold text-[#004380]">
                <span>In Store (Gudang)</span>
                <Package className="w-3.5 h-3.5 text-[#00A3E0]" />
              </div>
              <div className="text-xl font-bold text-[#004380] mt-1">{inStoreAssets.length} <span className="text-xs font-normal text-sky-700">Total</span></div>
              <div className="text-[10px] text-sky-700 mt-0.5">Site: {siteInStore.length} &bull; HO: {hoInStore.length}</div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                <span>Lend (Dipinjam)</span>
                <Clock className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-xl font-bold text-amber-900 mt-1">{inLendAssets.length} <span className="text-xs font-normal text-amber-700">Total</span></div>
              <div className="text-[10px] text-amber-700 mt-0.5">Site: {siteLend.length} &bull; HO: {hoLend.length}</div>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
              <div className="flex items-center justify-between text-xs font-bold text-purple-800">
                <span>Services (Servis)</span>
                <Wrench className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="text-xl font-bold text-purple-900 mt-1">{inServicesAssets.length} <span className="text-xs font-normal text-purple-700">Total</span></div>
              <div className="text-[10px] text-purple-700 mt-0.5">Site: {siteInServices.length} &bull; HO: {hoInServices.length}</div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
              <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                <span>Broken (Afkir)</span>
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              </div>
              <div className="text-xl font-bold text-rose-900 mt-1">{brokenAssets.length} <span className="text-xs font-normal text-rose-700">Total</span></div>
              <div className="text-[10px] text-rose-700 mt-0.5">Site: {siteBroken.length} &bull; HO: {hoBroken.length}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Total Inventaris</span>
                <MapPin className="w-3.5 h-3.5 text-[#00A3E0]" />
              </div>
              <div className="text-xl font-bold text-slate-900 mt-1">{assets.length}</div>
              <div className="text-[10px] text-slate-600 mt-0.5 font-semibold">
                Site Luwuk: {siteAssets.length} &bull; HO: {hoAssets.length}
              </div>
            </div>
          </div>

          {/* Hardware Type Counts with Location Details */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600">
                <Laptop className="w-3 h-3 text-[#00A3E0]" /> Laptop ({totalLaptops.length})
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1">
                Site: {siteLaptops.length} &bull; HO: {hoLaptops.length}
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600">
                <HardDrive className="w-3 h-3 text-purple-600" /> Desktop ({totalDesktops.length})
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1">
                Site: {siteDesktops.length} &bull; HO: {hoDesktops.length}
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600">
                <Monitor className="w-3 h-3 text-emerald-600" /> Monitor ({totalMonitors.length})
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1">
                Site: {siteMonitors.length} &bull; HO: {hoMonitors.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. QUICK NAVIGATION MODULES */}
      {currentUser.role === 'user' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigate('profile')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#00A3E0] hover:shadow-md transition cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-sky-50 text-[#004380] w-fit mb-3 group-hover:bg-[#004380] group-hover:text-white transition">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">ICT Profile & Maps</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Peta satelit akurat Site Batui Luwuk & HO Senayan Jakarta serta pedoman operasional terpadu.
            </p>
          </div>

          <div
            onClick={() => onNavigate('helpdesk')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#00A3E0] hover:shadow-md transition cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 w-fit mb-3 group-hover:bg-amber-600 group-hover:text-white transition">
              <TicketIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">System Ticketing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Buka permohonan bantuan hardware, instalasi software, jaringan VPN, dan monitoring SLA helpdesk 4 direktorat.
            </p>
          </div>

          <div
            onClick={() => onNavigate('profile')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#00A3E0] hover:shadow-md transition cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit mb-3 group-hover:bg-emerald-600 group-hover:text-white transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Policy & Work Instruction</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Akses dokumen pedoman resmi keamanan siber, standar operasional prosedur, dan tata kelola ICT DSLNG.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('profile')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#00A3E0] hover:shadow-md transition cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-sky-50 text-[#004380] w-fit mb-3 group-hover:bg-[#004380] group-hover:text-white transition">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">ICT Profile & Maps</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Peta satelit akurat Site Batui Luwuk & HO Senayan Jakarta, serta dokumen kebijakan resmi.
            </p>
          </div>

          <div
            onClick={() => onNavigate('helpdesk')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#00A3E0] hover:shadow-md transition cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 w-fit mb-3 group-hover:bg-amber-600 group-hover:text-white transition">
              <TicketIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">System Ticketing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Buka permohonan bantuan hardware, instalasi software, jaringan VPN, dan monitoring SLA helpdesk 4 direktorat.
            </p>
          </div>

          <div
            onClick={() => isPrivileged ? onNavigate('assets') : onNavigate('profile')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#00A3E0] hover:shadow-md transition cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit mb-3 group-hover:bg-emerald-600 group-hover:text-white transition">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Data Asset</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Master database aset dengan Asset State (store, use, lend, services, broken), bulk Excel upload, dan hostname.
            </p>
          </div>

          <div
            onClick={() => isPrivileged ? onNavigate('attendance') : onNavigate('leave')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#00A3E0] hover:shadow-md transition cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 w-fit mb-3 group-hover:bg-purple-600 group-hover:text-white transition">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Attandance Helpdesk</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Presensi selfie kamera dengan verifikasi akurasi GPS Sentral Senayan II Jakarta dan Kilang Batui Luwuk.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
