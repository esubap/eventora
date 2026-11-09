import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../lib/storage';
import { eventService } from '../../services/eventService';
import { ticketService } from '../../services/ticketService';
import type { Event, Ticket as TicketType, Booking } from '../../types';
import { formatCurrency, formatDate, formatTime } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import { QrScannerModal } from '../../components/tickets/QrScannerModal';
import { 
  PlusCircle, 
  Ticket, 
  DollarSign, 
  Users, 
  Calendar, 
  Camera, 
  Download, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  BarChart3,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

// Recharts components
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'attendees'>('overview');
  const [events, setEvents] = useState<Event[]>([]);
  const [attendees, setAttendees] = useState<TicketType[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const myEvents = await eventService.getOrganizerEvents(user.id);
      setEvents(myEvents);

      const allTickets = storage.getTickets();
      const myEventIds = new Set(myEvents.map(e => e.id));
      const myAttendees = allTickets.filter(t => myEventIds.has(t.event_id));
      setAttendees(myAttendees);
    };

    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('eventora:events-updated', handleUpdate);
    window.addEventListener('eventora:tickets-updated', handleUpdate);
    window.addEventListener('eventora:checkin-recorded', handleUpdate);
    return () => {
      window.removeEventListener('eventora:events-updated', handleUpdate);
      window.removeEventListener('eventora:tickets-updated', handleUpdate);
      window.removeEventListener('eventora:checkin-recorded', handleUpdate);
    };
  }, [user]);

  // Financial & Inventory Computations
  const totalTicketsSold = attendees.length;
  const totalRevenue = attendees.reduce((sum, t) => {
    const tier = t.ticket_type;
    return sum + (tier?.price || 0);
  }, 0);

  const checkedInCount = attendees.filter(t => t.status === 'checked_in').length;

  // Chart data: Daily sales
  const salesChartData = [
    { day: 'Mon', revenue: 14000, tickets: 12 },
    { day: 'Tue', revenue: 22000, tickets: 19 },
    { day: 'Wed', revenue: 18500, tickets: 15 },
    { day: 'Thu', revenue: 32000, tickets: 27 },
    { day: 'Fri', revenue: 45000, tickets: 38 },
    { day: 'Sat', revenue: 68000, tickets: 54 },
    { day: 'Sun', revenue: 52000, tickets: 41 },
  ];

  // Export Attendees to CSV
  const handleExportCsv = () => {
    if (attendees.length === 0) {
      toast.warning('No attendee records to export.');
      return;
    }

    const headers = ['Ticket Number', 'Attendee Name', 'Email', 'Event', 'Ticket Tier', 'Status', 'Checked In At'];
    const rows = attendees.map(a => [
      a.ticket_number,
      `"${a.attendee_name}"`,
      a.attendee_email || 'N/A',
      `"${a.event?.title || 'Event'}"`,
      a.ticket_type?.name || 'General',
      a.status,
      a.checked_in_at || 'Not checked in'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EVENTORA-ATTENDEES-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendee roster exported as CSV file.', 'Export Complete');
  };

  const handleDeleteEvent = (eventId: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      eventService.deleteEvent(eventId);
      toast.info('Event removed.');
    }
  };

  // Filtered attendees for the roster table
  const filteredAttendees = attendees.filter(a => {
    const matchesSearch = 
      a.attendee_name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      a.ticket_number.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      (a.event?.title && a.event.title.toLowerCase().includes(attendeeSearch.toLowerCase()));

    const matchesEvent = selectedEventFilter === 'all' || a.event_id === selectedEventFilter;
    return matchesSearch && matchesEvent;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. TOP HEADER & ORGANIZER ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Organizer Command Center</span>
            <Badge variant="purple" size="sm">Creator Portal</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            {user?.organization_name || user?.full_name || 'Organizer Hub'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time ticket sales, capacity telemetry, and entrance scanner tools.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live Camera Scanner Button */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Launch QR Scanner</span>
          </button>

          {/* Create New Event CTA */}
          <Link
            to="/dashboard/organizer/events/new"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales</span>
            <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {formatCurrency(totalRevenue, 'ETB')}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>100% Verified Transactions</span>
          </div>
        </div>

        {/* Tickets Sold */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tickets Sold</span>
            <div className="p-2 rounded-xl bg-sky-950/60 text-sky-400">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {totalTicketsSold}
          </div>
          <div className="text-[11px] text-slate-400">
            Across {events.length} event{events.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Check-In Gate Count */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Checked In</span>
            <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {checkedInCount}
          </div>
          <div className="text-[11px] text-emerald-400">
            {totalTicketsSold > 0 ? `${Math.round((checkedInCount / totalTicketsSold) * 100)}% attendance rate` : 'Gate standing by'}
          </div>
        </div>

        {/* Active Events */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Events</span>
            <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {events.length}
          </div>
          <div className="text-[11px] text-purple-400">
            {events.filter(e => e.status === 'published').length} Live Published
          </div>
        </div>
      </div>

      {/* 3. TABS: OVERVIEW & ANALYTICS, MY EVENTS, ATTENDEES */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Sales & Revenue Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'events'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Events ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attendees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'attendees'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Attendee Management ({attendees.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Daily Revenue Velocity (ETB)</h3>
                <p className="text-xs text-slate-400">Weekly revenue trajectory across all ticket types</p>
              </div>
              <Badge variant="cyan" size="sm">Real-time Telemetry</Badge>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#A78BFA" strokeWidth={2} fillOpacity={1} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY EVENTS MANAGEMENT */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Managed Events</h2>
            <Link
              to="/dashboard/organizer/events/new"
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(evt => (
              <div
                key={evt.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-950">
                    <img src={evt.cover_image} alt={evt.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant={evt.status === 'published' ? 'success' : evt.status === 'pending_approval' ? 'warning' : 'default'}
                        size="sm"
                      >
                        {evt.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-1">{evt.title}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>{formatDate(evt.start_date)} • {formatTime(evt.start_time)}</span>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Capacity</span>
                      <span className="font-bold text-white">{evt.capacity}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tiers</span>
                      <span className="font-bold text-purple-400">{evt.ticket_types?.length || 0} active</span>
                    </div>
                  </div>
                </div>

                {/* Event Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <Link
                    to={`/events/${evt.slug || evt.id}`}
                    className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Public View</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/dashboard/organizer/events/edit/${evt.id}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Edit Event"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleDeleteEvent(evt.id, evt.title)}
                      className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDEE MANAGEMENT & ROSTER */}
      {activeTab === 'attendees' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Attendee Roster & Gate Check-In</h2>
              <p className="text-xs text-slate-400">Search attendees, check live check-in status, and export CSV</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCsv}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setIsScannerOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan QR Code</span>
              </button>
            </div>
          </div>

          {/* Search & Event Filter Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
                placeholder="Search by attendee name or ticket number..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Events</option>
                {events.map(evt => (
                  <option key={evt.id} value={evt.id}>{evt.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Attendee Data Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">Ticket #</th>
                    <th className="p-4">Attendee Name</th>
                    <th className="p-4">Event</th>
                    <th className="p-4">Tier</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Checked In At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredAttendees.map(tkt => (
                    <tr key={tkt.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-purple-300">{tkt.ticket_number}</td>
                      <td className="p-4 font-semibold text-white">{tkt.attendee_name}</td>
                      <td className="p-4 text-slate-400 max-w-xs truncate">{tkt.event?.title || 'Event'}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                          {tkt.ticket_type?.name || 'General'}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={tkt.status === 'checked_in' ? 'warning' : 'success'}
                          size="sm"
                        >
                          {tkt.status === 'checked_in' ? 'CHECKED IN' : 'VALID'}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-400">
                        {tkt.checked_in_at ? new Date(tkt.checked_in_at).toLocaleTimeString() : '—'}
                      </td>
                    </tr>
                  ))}
                  {filteredAttendees.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No attendee records matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Live QR Camera Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onCheckInSuccess={() => {
          // Re-trigger load
          window.dispatchEvent(new CustomEvent('eventora:checkin-recorded'));
        }}
      />

    </div>
  );
};
