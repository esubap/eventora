import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService, PlatformStats } from '../../services/adminService';
import { storage } from '../../lib/storage';
import type { UserProfile, Event, Booking, Payment, PlatformSetting } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { 
  Shield, 
  Users, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Settings, 
  CreditCard, 
  TrendingUp, 
  BarChart3, 
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Eye
} from 'lucide-react';

// Recharts components
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'analytics' | 'moderation' | 'users' | 'finance' | 'settings'>('analytics');
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [payments, setPayments] = useState<{ payment: Payment; booking: Booking }[]>([]);
  const [settings, setSettings] = useState<PlatformSetting[]>([]);

  // Moderation state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // User search/filter
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  const refreshData = () => {
    const s = adminService.getPlatformStats();
    setStats(s);
    setAllUsers(adminService.getAllUsers());
    setAllEvents(storage.getEvents());
    setPayments(adminService.getAllPayments());
    setSettings(adminService.getSettings());
  };

  useEffect(() => {
    refreshData();

    window.addEventListener('eventora:events-updated', refreshData);
    window.addEventListener('eventora:users-updated', refreshData);
    window.addEventListener('eventora:bookings-updated', refreshData);
    window.addEventListener('eventora:settings-updated', refreshData);

    return () => {
      window.removeEventListener('eventora:events-updated', refreshData);
      window.removeEventListener('eventora:users-updated', refreshData);
      window.removeEventListener('eventora:bookings-updated', refreshData);
      window.removeEventListener('eventora:settings-updated', refreshData);
    };
  }, []);

  const handleApproveEvent = (eventId: string) => {
    adminService.approveEvent(eventId);
    toast.success('Event approved and published to public marketplace!', 'Approved');
    refreshData();
  };

  const handleOpenRejectModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setRejectionReason('Event details require more specific venue information or valid licensing.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedEventId || !rejectionReason.trim()) return;
    adminService.rejectEvent(selectedEventId, rejectionReason.trim());
    toast.warning('Event rejected. Notification sent to organizer.', 'Event Rejected');
    setRejectModalOpen(false);
    setSelectedEventId(null);
    refreshData();
  };

  const handleToggleUserStatus = (userId: string) => {
    const updated = adminService.toggleUserStatus(userId);
    if (updated) {
      toast.info(`User status changed to ${updated.status.toUpperCase()}`);
      refreshData();
    }
  };

  const handleToggleFeature = (eventId: string) => {
    const updated = adminService.toggleFeatureEvent(eventId);
    if (updated) {
      toast.success(updated.featured ? 'Event marked as Featured' : 'Event unfeatured');
      refreshData();
    }
  };

  const handleUpdateSetting = (key: string, value: string) => {
    adminService.updateSetting(key, value);
    toast.success(`Setting '${key}' updated to ${value}`, 'Setting Saved');
    refreshData();
  };

  const pendingEvents = allEvents.filter(e => e.status === 'pending_approval');

  // Filtered users
  const filteredUsers = allUsers.filter(u => {
    const matchesQuery = 
      u.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesQuery && matchesRole;
  });

  // Chart data
  const categoryChartData = [
    { name: 'Tech', count: 4, fill: '#38BDF8' },
    { name: 'Music', count: 6, fill: '#7C3AED' },
    { name: 'Business', count: 3, fill: '#10B981' },
    { name: 'Sports', count: 2, fill: '#F59E0B' },
    { name: 'Culture', count: 2, fill: '#EC4899' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. TOP ADMIN BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Master Governance</span>
            <Badge variant="error" size="sm">Executive Administrator</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Platform Administration & Oversight
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete management of events moderation, users, payment gateways, and system integrity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="cyan" size="md">
            System Status: 100% Operational
          </Badge>
        </div>
      </div>

      {/* 2. PLATFORM KPIS GRID */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Gross Sales */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Gross Volume</span>
            <span className="text-lg font-extrabold text-white font-mono block">
              {formatCurrency(stats.totalGrossRevenue, stats.currency)}
            </span>
            <span className="text-[9px] text-emerald-400 font-semibold">Total processed</span>
          </div>

          {/* Platform Revenue */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-purple-400 block">Platform Fee</span>
            <span className="text-lg font-extrabold text-purple-300 font-mono block">
              {formatCurrency(stats.totalPlatformRevenue, stats.currency)}
            </span>
            <span className="text-[9px] text-slate-400">5% Commission</span>
          </div>

          {/* Tickets Sold */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Tickets Sold</span>
            <span className="text-lg font-extrabold text-sky-400 font-mono block">
              {stats.totalTicketsSold}
            </span>
            <span className="text-[9px] text-slate-400">{stats.totalBookings} bookings</span>
          </div>

          {/* Total Users */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Users</span>
            <span className="text-lg font-extrabold text-white font-mono block">
              {stats.totalUsers}
            </span>
            <span className="text-[9px] text-slate-400">{stats.totalOrganizers} organizers</span>
          </div>

          {/* Total Events */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Events</span>
            <span className="text-lg font-extrabold text-white font-mono block">
              {stats.totalEvents}
            </span>
            <span className="text-[9px] text-slate-400">{stats.approvedEvents} approved</span>
          </div>

          {/* Pending Approval */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 shadow-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-amber-300 block">Pending Review</span>
            <span className="text-lg font-extrabold text-amber-400 font-mono block">
              {stats.pendingEvents}
            </span>
            <span className="text-[9px] text-amber-200">Requires review</span>
          </div>
        </div>
      )}

      {/* 3. TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Platform Growth Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'moderation'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Event Moderation ({pendingEvents.length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'finance'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Transactions Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>System Settings</span>
        </button>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Event Distribution by Category</h3>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                  <Bar dataKey="count" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Platform Health & Verification Summary</h3>
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Total Registered Organizers</span>
                <span className="font-bold text-white">{stats?.totalOrganizers}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Total Customers / Attendees</span>
                <span className="font-bold text-white">{stats?.totalCustomers}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Pending Event Review Queue</span>
                <span className="font-bold text-amber-400">{stats?.pendingEvents} awaiting action</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Default Currency</span>
                <span className="font-bold text-purple-400">ETB (Ethiopian Birr)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVENT MODERATION */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Event Approval & Moderation Queue</h2>
              <p className="text-xs text-slate-400">Review organizer submissions before they are listed on the public platform</p>
            </div>
            <Badge variant="warning" size="md">{pendingEvents.length} Pending Review</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allEvents.map(evt => (
              <div key={evt.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex gap-3">
                  <img src={evt.cover_image} alt={evt.title} className="w-20 h-20 rounded-xl object-cover border border-slate-800 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        variant={evt.status === 'published' ? 'success' : evt.status === 'pending_approval' ? 'warning' : 'error'}
                        size="sm"
                      >
                        {evt.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {evt.featured && <Badge variant="cyan" size="sm">FEATURED</Badge>}
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{evt.title}</h3>
                    <p className="text-[11px] text-purple-400 mt-0.5">{evt.venue_name || evt.city}</p>
                    <p className="text-[10px] text-slate-400">Organizer: {evt.organizer?.full_name || 'Organizer'}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleFeature(evt.id)}
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>{evt.featured ? 'Unfeature' : 'Feature on Home'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {evt.status === 'pending_approval' ? (
                      <>
                        <button
                          onClick={() => handleApproveEvent(evt.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleOpenRejectModal(evt.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900 border border-rose-500/30 font-semibold text-xs transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-500">
                        Status: <strong className="text-slate-300 capitalize">{evt.status}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">User Accounts & Roles</h2>
              <p className="text-xs text-slate-400">Inspect user accounts, permissions, and toggle access suspensions</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name/email..."
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              />
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 flex items-center gap-2.5">
                        <img
                          src={u.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.full_name)}`}
                          alt={u.full_name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="font-semibold text-white">{u.full_name}</span>
                      </td>
                      <td className="p-4 text-slate-400">{u.email}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-slate-800 text-purple-300 border border-slate-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant={u.status === 'active' ? 'success' : 'error'} size="sm">
                          {u.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                              u.status === 'active'
                                ? 'bg-rose-950/60 text-rose-300 hover:bg-rose-900'
                                : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FINANCE & TRANSACTIONS */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white">Platform Payment Ledger</h2>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4">Txn Reference</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Gateway</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {payments.map(item => (
                    <tr key={item.payment.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-purple-300">{item.payment.transaction_reference}</td>
                      <td className="p-4 font-semibold text-white">{item.booking.customer_name}</td>
                      <td className="p-4 uppercase text-sky-400 font-bold">{item.payment.payment_gateway}</td>
                      <td className="p-4 font-bold text-white">{formatCurrency(item.payment.amount, item.payment.currency)}</td>
                      <td className="p-4 text-slate-400">{formatDate(item.payment.created_at)}</td>
                      <td className="p-4">
                        <Badge variant="success" size="sm">SETTLED</Badge>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No transactions recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white pb-3 border-b border-slate-800">
              Platform Configuration
            </h2>

            <div className="space-y-4 text-xs">
              {settings.map(s => (
                <div key={s.key} className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-400 block">
                    {s.description || s.key}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={s.value}
                      onBlur={(e) => handleUpdateSetting(s.key, e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectModalOpen && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Event Submission"
          maxWidth="md"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Please specify the reason for rejection. This feedback will be sent directly to the event creator.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
