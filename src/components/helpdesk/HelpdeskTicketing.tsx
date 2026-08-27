import React, { useState } from 'react';
import {
  Ticket,
  TicketCategory,
  TicketStatus,
  Department,
  WorkLocation,
  User,
  CreatedByRole,
} from '../../types';
import { notifySuccess, notifyError, notifyConfirm } from '../../utils/notifications';
import { exportTicketsToExcel } from '../../utils/excel';
import {
  Headphones,
  Plus,
  Filter,
  Search,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Clock3,
  FileText,
  UserCheck,
  ChevronRight,
  TrendingUp,
  DownloadCloud,
  X,
  PhoneCall,
  Calendar,
  Trash2,
  Flame,
  Zap,
  UserPlus,
  RotateCcw,
  ShieldCheck,
  Check,
  ArrowRightLeft,
  UserX,
} from 'lucide-react';

interface HelpdeskProps {
  tickets: Ticket[];
  users: User[];
  currentUser: User;
  onAddTicket: (ticket: Ticket) => void;
  onUpdateTicketStatus: (
    ticketId: number,
    status: TicketStatus,
    notes?: string,
    assignment?: {
      assigned_to?: string;
      assigned_to_name?: string;
      assigned_to_id?: number;
      picked_up_at?: string;
    }
  ) => void;
  onDeleteTicket?: (ticketId: number) => void;
  onClearAllTickets?: () => void;
}

// Directorate to Primary Work Location Configuration
export const DIRECTORATE_LOCATION_CONFIG: Record<
  Department,
  {
    primaryLocation: WorkLocation | 'Both';
    locationLabel: string;
    locationShort: string;
    description: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
  }
> = {
  'President Directorate': {
    primaryLocation: 'HO Jakarta',
    locationLabel: 'HO Jakarta (Senayan)',
    locationShort: 'HO Jakarta',
    description: 'Executive Management & Board Office',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
  },
  'Operations Directorate': {
    primaryLocation: 'Site Luwuk',
    locationLabel: 'Site Luwuk (Plant Batui)',
    locationShort: 'Site Luwuk',
    description: 'LNG Plant Operations, Maintenance & Production',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
  },
  'Finance Directorate': {
    primaryLocation: 'HO Jakarta',
    locationLabel: 'HO Jakarta (Senayan)',
    locationShort: 'HO Jakarta',
    description: 'Treasury, Accounting & Financial Governance',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-[#004380]',
    badgeBorder: 'border-sky-200',
  },
  'Corporate Affairs Director': {
    primaryLocation: 'Both',
    locationLabel: 'Site Luwuk & HO Jakarta',
    locationShort: 'Site & HO',
    description: 'ICT, HR, CSR, Legal & External Relations',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
  },
};

export const HelpdeskTicketing: React.FC<HelpdeskProps> = ({
  tickets,
  users,
  currentUser,
  onAddTicket,
  onUpdateTicketStatus,
  onDeleteTicket,
  onClearAllTickets,
}) => {
  // Directorate Performance Dashboard Filter State
  const [directorateTimeRange, setDirectorateTimeRange] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [selectedDirectorateFilter, setSelectedDirectorateFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'my_pickup' | 'unassigned' | 'assigned'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [resolutionInput, setResolutionInput] = useState('');

  // Create Ticket Form State
  // IT Helpdesk can choose on behalf of user
  const isHelpdeskOrAdmin = currentUser.role === 'it_helpdesk' || currentUser.role === 'admin';
  const itStaffList = users.filter((u) => u.role === 'it_helpdesk' || u.role === 'admin');

  const [selectedRequesterId, setSelectedRequesterId] = useState<number>(currentUser.id);
  const [formDepartment, setFormDepartment] = useState<Department>(currentUser.department);
  const [formWorkLocation, setFormWorkLocation] = useState<WorkLocation>(currentUser.work_location);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Software');
  const [formAutoPickup, setFormAutoPickup] = useState<boolean>(true);

  // When IT helpdesk changes selected requester, auto-sync department and work location
  const activeRequester = users.find((u) => u.id === selectedRequesterId) || currentUser;

  const handleOpenCreateModal = () => {
    setSelectedRequesterId(currentUser.id);
    setFormDepartment(currentUser.department);
    setFormWorkLocation(currentUser.work_location);
    setSubject('');
    setBody('');
    setCategory('Software');
    setFormAutoPickup(isHelpdeskOrAdmin);
    setShowCreateModal(true);
  };

  const handleRequesterChange = (userId: number) => {
    setSelectedRequesterId(userId);
    const found = users.find((u) => u.id === userId);
    if (found) {
      setFormDepartment(found.department);
      setFormWorkLocation(found.work_location);
    }
  };

  const handleDepartmentChange = (newDept: Department) => {
    setFormDepartment(newDept);
    // Auto-adjust work location according to directorate
    if (newDept === 'Operations Directorate') {
      setFormWorkLocation('Site Luwuk');
    } else if (newDept === 'President Directorate' || newDept === 'Finance Directorate') {
      setFormWorkLocation('HO Jakarta');
    } else if (newDept === 'Corporate Affairs Director') {
      // Retain existing or default to Site Luwuk
      if (!formWorkLocation) setFormWorkLocation('Site Luwuk');
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !body.trim()) {
      notifyError('Gagal membuat tiket: Mohon lengkapi Subject dan Body permasalahan.');
      return;
    }

    const nextCodeNumber = String(tickets.length + 1).padStart(4, '0');
    const ticketCode = `#TICK-2026-${nextCodeNumber}`;

    const isDirectPickup = isHelpdeskOrAdmin && formAutoPickup;

    const newTicket: Ticket = {
      id: Date.now(),
      ticket_code: ticketCode,
      requester_id: activeRequester.id,
      requester_name: activeRequester.name,
      requester_email: activeRequester.email,
      requester_extension: activeRequester.extension,
      created_by_role: isHelpdeskOrAdmin && activeRequester.id !== currentUser.id ? 'it_helpdesk' : 'user',
      subject: subject.trim(),
      body: body.trim(),
      category: category,
      department: formDepartment,
      work_location: formWorkLocation,
      status: isDirectPickup ? 'In Progress' : 'Open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assigned_to: isDirectPickup ? currentUser.name : undefined,
      assigned_to_name: isDirectPickup ? currentUser.name : undefined,
      assigned_to_id: isDirectPickup ? currentUser.id : undefined,
      picked_up_at: isDirectPickup ? new Date().toISOString() : undefined,
    };

    onAddTicket(newTicket);
    notifySuccess(
      isDirectPickup
        ? `Tiket ${ticketCode} berhasil dibuat dan otomatis di-pickup oleh ${currentUser.name}.`
        : `Tiket ${ticketCode} berhasil dibuat dan masuk antrean pickup IT Helpdesk.`
    );
    setShowCreateModal(false);
  };

  const handlePickupTicket = (ticket: Ticket) => {
    if (!isHelpdeskOrAdmin) {
      notifyError('Hanya personil IT Helpdesk atau Admin yang dapat mengambil tiket.');
      return;
    }
    const newStatus: TicketStatus = ticket.status === 'Open' ? 'In Progress' : ticket.status;
    const nowIso = new Date().toISOString();
    const assignment = {
      assigned_to: currentUser.name,
      assigned_to_name: currentUser.name,
      assigned_to_id: currentUser.id,
      picked_up_at: nowIso,
    };

    onUpdateTicketStatus(ticket.id, newStatus, ticket.resolution_notes, assignment);
    notifySuccess(`⚡ Anda berhasil mengambil (pickup) tiket ${ticket.ticket_code}! Status diubah ke '${newStatus}'.`);

    if (selectedTicket && selectedTicket.id === ticket.id) {
      setSelectedTicket({
        ...selectedTicket,
        status: newStatus,
        ...assignment,
        updated_at: nowIso,
      });
    }
  };

  const handleReleaseTicket = (ticket: Ticket) => {
    if (!isHelpdeskOrAdmin) return;
    const nowIso = new Date().toISOString();
    const assignment = {
      assigned_to: '',
      assigned_to_name: '',
      assigned_to_id: undefined,
      picked_up_at: undefined,
    };

    onUpdateTicketStatus(ticket.id, 'Open', ticket.resolution_notes, assignment);
    notifySuccess(`Tiket ${ticket.ticket_code} telah dilepaskan dan kembali ke antrean pickup umum.`);

    if (selectedTicket && selectedTicket.id === ticket.id) {
      setSelectedTicket({
        ...selectedTicket,
        status: 'Open',
        assigned_to: undefined,
        assigned_to_name: undefined,
        assigned_to_id: undefined,
        picked_up_at: undefined,
        updated_at: nowIso,
      });
    }
  };

  const handleReassignTicket = (ticket: Ticket, newAssigneeId: number) => {
    if (!isHelpdeskOrAdmin) return;
    const targetUser = users.find((u) => u.id === newAssigneeId);
    if (!targetUser) return;
    const nowIso = new Date().toISOString();
    const newStatus: TicketStatus = ticket.status === 'Open' ? 'In Progress' : ticket.status;
    const assignment = {
      assigned_to: targetUser.name,
      assigned_to_name: targetUser.name,
      assigned_to_id: targetUser.id,
      picked_up_at: nowIso,
    };

    onUpdateTicketStatus(ticket.id, newStatus, ticket.resolution_notes, assignment);
    notifySuccess(`Tiket ${ticket.ticket_code} berhasil dialihkan ke ${targetUser.name}.`);

    if (selectedTicket && selectedTicket.id === ticket.id) {
      setSelectedTicket({
        ...selectedTicket,
        status: newStatus,
        ...assignment,
        updated_at: nowIso,
      });
    }
  };

  const handleStatusChange = (ticket: Ticket, newStatus: TicketStatus) => {
    onUpdateTicketStatus(ticket.id, newStatus, resolutionInput);
    notifySuccess(`Status tiket berhasil diperbarui menjadi ${newStatus}.`);
    if (selectedTicket && selectedTicket.id === ticket.id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus, resolution_notes: resolutionInput });
    }
  };

  const handleDeleteCurrentTicket = (ticket: Ticket) => {
    if (onDeleteTicket) {
      onDeleteTicket(ticket.id);
      notifySuccess(`Tiket ${ticket.ticket_code} berhasil dihapus.`);
      setSelectedTicket(null);
    }
  };

  const handleClearAll = () => {
    if (onClearAllTickets) {
      onClearAllTickets();
      notifySuccess('Seluruh data tiket berhasil dibersihkan.');
    }
  };

  // 4 Directorates Breakdown Calculations
  const directoratesList: Department[] = [
    'President Directorate',
    'Operations Directorate',
    'Finance Directorate',
    'Corporate Affairs Director',
  ];

  const directorateStats = directoratesList.map((dir) => {
    const dirTickets = tickets.filter((t) => t.department === dir);
    const openCount = dirTickets.filter((t) => t.status === 'Open').length;
    const inProgressCount = dirTickets.filter((t) => t.status === 'In Progress').length;
    const resolvedCount = dirTickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;
    const siteCount = dirTickets.filter((t) => t.work_location === 'Site Luwuk').length;
    const hoCount = dirTickets.filter((t) => t.work_location === 'HO Jakarta').length;
    const config = DIRECTORATE_LOCATION_CONFIG[dir];

    return {
      department: dir,
      config,
      total: dirTickets.length,
      open: openCount,
      inProgress: inProgressCount,
      resolved: resolvedCount,
      siteCount,
      hoCount,
      resolutionRate: dirTickets.length > 0 ? Math.round((resolvedCount / dirTickets.length) * 100) : 100,
    };
  });

  // Filtered tickets list according to user permissions:
  // User (Karyawan) can only see their own tickets unless they are Helpdesk/Admin
  const visibleTickets = tickets.filter((ticket) => {
    // If standard user, only view own tickets
    if (currentUser.role === 'user' && ticket.requester_id !== currentUser.id) {
      return false;
    }

    const matchesSearch =
      ticket.ticket_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.requester_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.assigned_to_name && ticket.assigned_to_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ticket.assigned_to && ticket.assigned_to.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ticket.body.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDir =
      selectedDirectorateFilter === 'all' || ticket.department === selectedDirectorateFilter;

    const matchesLocation = locationFilter === 'all' || ticket.work_location === locationFilter;
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesCat = categoryFilter === 'all' || ticket.category === categoryFilter;

    let matchesAssignment = true;
    const isPickedUp = Boolean(
      ticket.assigned_to_name ||
      (ticket.assigned_to && ticket.assigned_to !== '' && ticket.assigned_to !== 'Tim ICT Helpdesk')
    );

    if (assignmentFilter === 'my_pickup') {
      matchesAssignment =
        ticket.assigned_to_id === currentUser.id ||
        ticket.assigned_to === currentUser.name ||
        ticket.assigned_to_name === currentUser.name;
    } else if (assignmentFilter === 'unassigned') {
      matchesAssignment = !isPickedUp;
    } else if (assignmentFilter === 'assigned') {
      matchesAssignment = isPickedUp;
    }

    return matchesSearch && matchesDir && matchesLocation && matchesStatus && matchesCat && matchesAssignment;
  });

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
      case 'In Progress':
        return 'bg-sky-50 text-[#004380] border-sky-300 font-semibold';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-300 font-semibold';
    }
  };

  const getCategoryBadge = (cat: TicketCategory) => {
    switch (cat) {
      case 'Software':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Hardware':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Service Lainnya':
        return 'bg-teal-50 text-teal-700 border-teal-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#004380] uppercase tracking-wider">
            <Headphones className="w-4 h-4 text-[#00A3E0]" />
            <span>Layanan Pengaduan ICT Helpdesk</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            System Ticketing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen tiket gangguan sistem, pelaporan insiden, dan monitoring SLA berdasarkan 4 direktorat serta lokasi kerja PT DSLNG.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isHelpdeskOrAdmin && tickets.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition border border-red-200"
              title="Hapus / Reset semua tiket data lama"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Bersihkan Tiket</span>
            </button>
          )}

          {isHelpdeskOrAdmin && (
            <button
              type="button"
              onClick={() => exportTicketsToExcel(visibleTickets)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition"
            >
              <DownloadCloud className="w-4 h-4 text-emerald-600" />
              <span>Export XLS</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-[#004380] hover:bg-[#003366] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>
              {isHelpdeskOrAdmin ? 'Buat Tiket Baru (User / via Ext)' : 'Ajukan Permohonan / Tiket Baru'}
            </span>
          </button>
        </div>
      </div>

      {/* DASHBOARD 4 DIREKTORAT & LOKASI KERJA STRIP (For Helpdesk & Admin) */}
      {isHelpdeskOrAdmin && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#004380]" />
                <span>Distribusi Direktorat & Lokasi Kerja</span>
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">&bull; Klik kartu untuk filter langsung</span>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Rentang:
              </span>
              <button
                type="button"
                onClick={() => setDirectorateTimeRange('weekly')}
                className={`px-3 py-1 rounded-md transition ${
                  directorateTimeRange === 'weekly' ? 'bg-white text-[#004380] shadow-xs' : 'text-slate-600'
                }`}
              >
                Mingguan
              </button>
              <button
                type="button"
                onClick={() => setDirectorateTimeRange('monthly')}
                className={`px-3 py-1 rounded-md transition ${
                  directorateTimeRange === 'monthly' ? 'bg-white text-[#004380] shadow-xs' : 'text-slate-600'
                }`}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setDirectorateTimeRange('yearly')}
                className={`px-3 py-1 rounded-md transition ${
                  directorateTimeRange === 'yearly' ? 'bg-white text-[#004380] shadow-xs' : 'text-slate-600'
                }`}
              >
                Tahunan
              </button>
            </div>
          </div>

          {/* 4 Directorates Cards with Work Location Mappings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {directorateStats.map((d) => (
              <div
                key={d.department}
                onClick={() =>
                  setSelectedDirectorateFilter(
                    selectedDirectorateFilter === d.department ? 'all' : d.department
                  )
                }
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  selectedDirectorateFilter === d.department
                    ? 'border-[#004380] bg-sky-50/50 ring-2 ring-[#004380]'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-900 truncate pr-2">
                      {d.department}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex-shrink-0">
                      {d.resolutionRate}% SLA
                    </span>
                  </div>

                  {/* Work Location Tag matched to Directorate */}
                  <div className="flex items-center gap-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold ${d.config.badgeBg} ${d.config.badgeText} ${d.config.badgeBorder}`}>
                      {d.config.primaryLocation === 'Site Luwuk' ? (
                        <Flame className="w-2.5 h-2.5 text-amber-500" />
                      ) : d.config.primaryLocation === 'HO Jakarta' ? (
                        <Building2 className="w-2.5 h-2.5 text-[#00A3E0]" />
                      ) : (
                        <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                      )}
                      <span>{d.config.locationLabel}</span>
                    </span>
                  </div>
                </div>

                <div className="my-2.5">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-extrabold text-[#004380]">{d.total}</span>
                      <span className="text-[10px] text-slate-500 font-medium">Tiket</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                      <span className="text-amber-700 font-semibold" title="Tiket dari Site Luwuk">Site: {d.siteCount}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-purple-700 font-semibold" title="Tiket dari HO Jakarta">HO: {d.hoCount}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 text-[10px]">
                  <div className="bg-amber-50 p-1.5 rounded text-center text-amber-800 font-semibold">
                    <div>{d.open}</div>
                    <div className="text-[9px] text-amber-600">Open</div>
                  </div>
                  <div className="bg-sky-50 p-1.5 rounded text-center text-sky-800 font-semibold">
                    <div>{d.inProgress}</div>
                    <div className="text-[9px] text-sky-600">Process</div>
                  </div>
                  <div className="bg-emerald-50 p-1.5 rounded text-center text-emerald-800 font-semibold">
                    <div>{d.resolved}</div>
                    <div className="text-[9px] text-emerald-600">Done</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode (#TICK..), subjek, requester, PIC..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-[#004380] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Directorate Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Building2 className="w-3.5 h-3.5 text-[#004380]" />
            <select
              value={selectedDirectorateFilter}
              onChange={(e) => setSelectedDirectorateFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#004380] outline-none"
            >
              <option value="all">Semua 4 Direktorat</option>
              <option value="President Directorate">President Directorate (HO)</option>
              <option value="Operations Directorate">Operations Directorate (Site)</option>
              <option value="Finance Directorate">Finance Directorate (HO)</option>
              <option value="Corporate Affairs Director">Corporate Affairs Director (Site & HO)</option>
            </select>
          </div>

          {/* Work Location Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-[#00A3E0]" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#004380] outline-none"
            >
              <option value="all">Semua Lokasi Kerja</option>
              <option value="Site Luwuk">Site Luwuk (Plant Batui)</option>
              <option value="HO Jakarta">HO Jakarta (Sentral Senayan)</option>
            </select>
          </div>

          {/* IT Helpdesk Pickup Filter */}
          {isHelpdeskOrAdmin && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <select
                value={assignmentFilter}
                onChange={(e) => setAssignmentFilter(e.target.value as any)}
                className="px-2.5 py-1.5 bg-sky-50 border border-sky-200 rounded-lg text-xs font-semibold text-[#004380] focus:ring-2 focus:ring-[#004380] outline-none"
              >
                <option value="all">Semua Pickup (Antrean & PIC)</option>
                <option value="my_pickup">⚡ Pickup Saya ({currentUser.name})</option>
                <option value="unassigned">⏳ Antrean Terbuka (Belum Ada PIC)</option>
                <option value="assigned">✓ Sudah Ada PIC</option>
              </select>
            </div>
          )}

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#004380] outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#004380] outline-none"
          >
            <option value="all">Semua Kategori</option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="Service Lainnya">Service Lainnya</option>
          </select>
        </div>
      </div>

      {/* Ticket List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nomor Tiket</th>
                <th className="py-3 px-4">Pelapor (Requester)</th>
                <th className="py-3 px-4">Direktorat & Lokasi</th>
                <th className="py-3 px-4">Kategori & Permasalahan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">IT Helpdesk (PIC)</th>
                <th className="py-3 px-4">Tanggal Masuk</th>
                <th className="py-3 px-4 text-right">Aksi & Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {visibleTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                        <Headphones className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        Belum ada tiket pengaduan ICT
                      </div>
                      <p className="text-xs text-slate-500 max-w-sm">
                        Halaman System Ticketing dalam keadaan bersih dan siap untuk penginputan permohonan atau laporan gangguan baru.
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#004380] hover:bg-[#003366] text-white text-xs font-bold rounded-xl shadow-xs transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Buat Tiket Baru Sekarang</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                visibleTickets.map((ticket) => {
                  const hasPic = Boolean(
                    ticket.assigned_to_name ||
                    (ticket.assigned_to && ticket.assigned_to !== '' && ticket.assigned_to !== 'Tim ICT Helpdesk')
                  );
                  const isMyPic =
                    ticket.assigned_to_id === currentUser.id ||
                    ticket.assigned_to_name === currentUser.name ||
                    ticket.assigned_to === currentUser.name;

                  return (
                    <tr key={ticket.id} className="hover:bg-sky-50/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-[#004380] text-xs">
                          {ticket.ticket_code}
                        </div>
                        {ticket.created_by_role === 'it_helpdesk' && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1">
                            <PhoneCall className="w-2.5 h-2.5" /> Via Ext Helpdesk
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{ticket.requester_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {ticket.requester_extension} &bull; {ticket.requester_email}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{ticket.department}</div>
                        <div className="mt-1 flex items-center gap-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              ticket.work_location === 'Site Luwuk'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-sky-50 text-[#004380] border-sky-200'
                            }`}
                          >
                            {ticket.work_location === 'Site Luwuk' ? (
                              <Flame className="w-2.5 h-2.5 text-amber-500" />
                            ) : (
                              <Building2 className="w-2.5 h-2.5 text-[#00A3E0]" />
                            )}
                            <span>{ticket.work_location === 'Site Luwuk' ? 'Site Luwuk (Plant)' : 'HO Jakarta (Office)'}</span>
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-sm">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getCategoryBadge(ticket.category)}`}>
                            {ticket.category}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-800 line-clamp-1">{ticket.subject}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{ticket.body}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-[10px] uppercase px-2.5 py-1 rounded-full border ${getStatusBadge(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>

                      {/* IT Helpdesk Column (Pickup System) */}
                      <td className="py-3 px-4">
                        {hasPic ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  isMyPic
                                    ? 'bg-[#004380] text-white ring-2 ring-sky-300'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {ticket.assigned_to_name ? ticket.assigned_to_name.charAt(0).toUpperCase() : 'IT'}
                              </div>
                              <div className="font-bold text-slate-900 flex items-center gap-1">
                                <span>{ticket.assigned_to_name || ticket.assigned_to}</span>
                                {isMyPic && (
                                  <span className="text-[9px] bg-sky-100 text-[#004380] px-1 py-0.2 rounded font-extrabold">
                                    Anda
                                  </span>
                                )}
                              </div>
                            </div>
                            {ticket.picked_up_at && (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                                <Clock className="w-2.5 h-2.5" />
                                <span>Pickup: {new Date(ticket.picked_up_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            )}
                          </div>
                        ) : isHelpdeskOrAdmin ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePickupTicket(ticket);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#004380] hover:bg-[#003366] text-white text-[11px] font-bold rounded-lg shadow-xs hover:shadow transition transform active:scale-95"
                            title="Ambil tiket ini untuk Anda kerjakan langsung (Pickup)"
                          >
                            <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                            <span>Pickup Tiket</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            <Clock3 className="w-3 h-3 text-amber-500" />
                            <span>Antrean Terbuka</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{new Date(ticket.created_at).toLocaleDateString('id-ID')}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 pl-4">
                          {new Date(ticket.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isHelpdeskOrAdmin && !hasPic && (
                            <button
                              type="button"
                              onClick={() => handlePickupTicket(ticket)}
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg transition border border-amber-200"
                              title="Pickup Cepat"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setResolutionInput(ticket.resolution_notes || '');
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-[#004380] hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition"
                          >
                            Buka
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-sky-50/50">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-[#00A3E0]" />
                <h3 className="text-base font-bold text-slate-900">
                  {isHelpdeskOrAdmin ? 'Buat Tiket Baru (IT Helpdesk / User)' : 'Buat Tiket Pengaduan Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              {/* If IT Helpdesk, allow selecting any user */}
              {isHelpdeskOrAdmin ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Karyawan Pemohon (Auto-Sync Department & Lokasi)
                  </label>
                  <select
                    value={selectedRequesterId}
                    onChange={(e) => handleRequesterChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#004380] outline-none"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} &bull; Ext: {u.extension} ({u.department} - {u.work_location})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Pelapor</span>
                    <span className="font-bold text-slate-800">{currentUser.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Email & Ext</span>
                    <span className="font-semibold text-slate-700">{currentUser.email} ({currentUser.extension})</span>
                  </div>
                </div>
              )}

              {/* Directorate & Work Location Selector (Auto-synchronized) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-sky-50/40 p-3.5 rounded-xl border border-sky-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Direktorat
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => handleDepartmentChange(e.target.value as Department)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#004380] outline-none"
                  >
                    <option value="President Directorate">President Directorate (HO)</option>
                    <option value="Operations Directorate">Operations Directorate (Site)</option>
                    <option value="Finance Directorate">Finance Directorate (HO)</option>
                    <option value="Corporate Affairs Director">Corporate Affairs Director (Site & HO)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Lokasi Kerja
                  </label>
                  <select
                    value={formWorkLocation}
                    onChange={(e) => setFormWorkLocation(e.target.value as WorkLocation)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#004380] outline-none"
                  >
                    <option value="Site Luwuk">Site Luwuk (Plant Batui)</option>
                    <option value="HO Jakarta">HO Jakarta (Sentral Senayan)</option>
                  </select>
                </div>

                <div className="sm:col-span-2 text-[10px] text-sky-800 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#00A3E0]" />
                  <span>Lokasi kerja diselaraskan otomatis dengan direktorat ({DIRECTORATE_LOCATION_CONFIG[formDepartment].locationLabel}).</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kategori Permasalahan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Software', 'Hardware', 'Service Lainnya'] as TicketCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                        category === cat
                          ? 'bg-[#004380] text-white border-[#004380] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject / Judul Gangguan
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Contoh: Gangguan Akses Jaringan DCS Kilang / Cisco VPN Token Expired"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#004380] outline-none"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Body / Rincian Masalah
                </label>
                <textarea
                  rows={4}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Jelaskan kendala secara spesifik, waktu kejadian, dan nomor error jika ada..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#004380] outline-none leading-relaxed"
                />
              </div>

              {/* Direct Pickup Option for IT Helpdesk */}
              {isHelpdeskOrAdmin && (
                <div className="bg-sky-50 p-3 rounded-xl border border-sky-200">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formAutoPickup}
                      onChange={(e) => setFormAutoPickup(e.target.checked)}
                      className="w-4 h-4 text-[#004380] rounded border-slate-300 focus:ring-[#004380]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[#004380] block">
                        ⚡ Langsung Pickup & Kerjakan oleh Saya ({currentUser.name})
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {formAutoPickup
                          ? "Tiket akan langsung berstatus 'In Progress' dengan Anda sebagai penanggung jawab (PIC)."
                          : "Tiket akan berstatus 'Open' di antrean umum agar dapat di-pickup oleh rekan IT Helpdesk lainnya."}
                      </span>
                    </div>
                  </label>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2.5">
                <div className="text-[10px] text-slate-400">
                  PT Donggi-Senora LNG &bull; ICT Service Desk
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#004380] hover:bg-[#003366] rounded-lg shadow-sm transition"
                  >
                    Kirim Tiket ke ICT
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TICKET DETAIL & STATUS MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-sky-50">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-[#004380] text-sm bg-white px-2.5 py-1 rounded-lg border border-sky-200 shadow-2xs">
                  {selectedTicket.ticket_code}
                </span>
                <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Requester & Department Information */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Pelapor</span>
                  <span className="font-bold text-slate-900">{selectedTicket.requester_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Direktorat</span>
                  <span className="font-semibold text-slate-800">{selectedTicket.department}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Lokasi Kerja</span>
                  <span className="font-bold text-[#004380] flex items-center gap-1">
                    {selectedTicket.work_location === 'Site Luwuk' ? (
                      <Flame className="w-3 h-3 text-amber-500" />
                    ) : (
                      <Building2 className="w-3 h-3 text-[#00A3E0]" />
                    )}
                    {selectedTicket.work_location} ({selectedTicket.requester_extension || 'N/A'})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Kategori</span>
                  <span className="font-semibold text-indigo-700">{selectedTicket.category}</span>
                </div>
              </div>

              {/* IT HELPDESK PIC & PICKUP STATUS CARD */}
              <div className="bg-gradient-to-r from-sky-50/70 to-slate-50 p-4 rounded-xl border border-sky-200 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#004380]" />
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Penanggung Jawab (IT Helpdesk PIC)
                    </span>
                  </div>
                  {selectedTicket.picked_up_at && (
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Pickup: {new Date(selectedTicket.picked_up_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  )}
                </div>

                {selectedTicket.assigned_to_name || (selectedTicket.assigned_to && selectedTicket.assigned_to !== '' && selectedTicket.assigned_to !== 'Tim ICT Helpdesk') ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#004380] text-white flex items-center justify-center font-bold text-xs">
                        {(selectedTicket.assigned_to_name || selectedTicket.assigned_to || 'IT').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{selectedTicket.assigned_to_name || selectedTicket.assigned_to}</span>
                          {(selectedTicket.assigned_to_id === currentUser.id ||
                            selectedTicket.assigned_to_name === currentUser.name ||
                            selectedTicket.assigned_to === currentUser.name) && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-extrabold">
                              Anda (PIC Aktif)
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Personil IT Helpdesk &bull; Sedang Mengerjakan
                        </div>
                      </div>
                    </div>

                    {isHelpdeskOrAdmin && (
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Reassign dropdown */}
                        <div className="flex items-center gap-1">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleReassignTicket(selectedTicket, Number(e.target.value));
                              }
                            }}
                            defaultValue=""
                            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-medium text-slate-700 focus:ring-1 focus:ring-[#004380] outline-none"
                          >
                            <option value="" disabled>Alihkan PIC...</option>
                            {itStaffList.map((st) => (
                              <option key={st.id} value={st.id}>
                                {st.name} ({st.role.toUpperCase()})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Release button */}
                        <button
                          type="button"
                          onClick={() => handleReleaseTicket(selectedTicket)}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-semibold rounded-md border border-red-200 flex items-center gap-1 transition"
                          title="Kembalikan tiket ke antrean pickup terbuka"
                        >
                          <RotateCcw className="w-3 h-3 text-red-600" />
                          <span>Lepas Pickup</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/60 p-3 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 text-amber-900">
                      <Clock3 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold block">Tiket Belum Di-pickup (Antrean Terbuka)</span>
                        <span className="text-[11px] text-amber-800">
                          Tiket menunggu personil IT Helpdesk yang bersedia mengerjakannya.
                        </span>
                      </div>
                    </div>

                    {isHelpdeskOrAdmin && (
                      <button
                        type="button"
                        onClick={() => handlePickupTicket(selectedTicket)}
                        className="px-4 py-2 bg-[#004380] hover:bg-[#003366] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition transform active:scale-95 flex-shrink-0"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                        <span>Pickup Tiket Ini Sekarang</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Subject & Body */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Subject Permasalahan
                </h4>
                <div className="text-base font-bold text-slate-900">{selectedTicket.subject}</div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Deskripsi Lengkap
                </h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.body}
                </div>
              </div>

              {/* Resolution Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Catatan Penanganan & Tindakan ICT
                </h4>
                {isHelpdeskOrAdmin ? (
                  <textarea
                    rows={3}
                    value={resolutionInput}
                    onChange={(e) => setResolutionInput(e.target.value)}
                    placeholder="Tuliskan catatan perbaikan teknis, penggantian sparepart, atau konfigurasi ulang..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#004380] outline-none"
                  />
                ) : (
                  <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                    {selectedTicket.resolution_notes || 'Belum ada catatan teknis penanganan dari IT Helpdesk.'}
                  </div>
                )}
              </div>

              {/* IT Helpdesk Action Controls (Status Updates) */}
              {isHelpdeskOrAdmin && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Ubah Status Tiket
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedTicket, 'Open')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                        selectedTicket.status === 'Open'
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
                      }`}
                    >
                      Set: Open
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedTicket, 'In Progress')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                        selectedTicket.status === 'In Progress'
                          ? 'bg-[#004380] text-white border-[#003366]'
                          : 'bg-slate-100 text-slate-700 hover:bg-sky-100'
                      }`}
                    >
                      Set: In Progress
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedTicket, 'Resolved')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                        selectedTicket.status === 'Resolved'
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-100'
                      }`}
                    >
                      Set: Resolved
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedTicket, 'Closed')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                        selectedTicket.status === 'Closed'
                          ? 'bg-slate-800 text-white border-slate-900'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Set: Closed
                    </button>
                  </div>
                </div>
              )}

            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div>
                {(isHelpdeskOrAdmin || selectedTicket.requester_id === currentUser.id) && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCurrentTicket(selectedTicket)}
                    className="px-3.5 py-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 flex items-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Tiket Ini</span>
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

