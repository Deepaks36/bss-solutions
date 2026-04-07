import { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle, List, Grid3X3, X, AlertTriangle, MoreVertical, Edit2, Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { ContactMessage } from '../types';

interface Props {
  dark: boolean;
}

type ViewMode = 'card' | 'grid';

type SortConfig = {
  key: keyof ContactMessage | 'created_at';
  direction: 'asc' | 'desc' | null;
};

type ColumnFilters = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  status: string;
};

export function AdminMessagesPage({ dark }: Props) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [error, setError] = useState('');
  
  // Dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [verifyConfirm, setVerifyConfirm] = useState<number | null>(null);
  const [revertConfirm, setRevertConfirm] = useState<number | null>(null);
  const [editingMessage, setEditingMessage] = useState<ContactMessage | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  
  // Filtering & Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'created_at', direction: 'desc' });
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    status: 'all'
  });
  
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError('Could not load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      
      const newMessages = messages.filter((m) => m.id !== id);
      setMessages(newMessages);
      
      // Fix pagination if the current page becomes empty
      const newTotalItems = newMessages.length;
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      setDeleteConfirm(null);
    } catch (err) {
      alert('Error deleting message.');
    }
  };


  const handleVerify = async (id: number) => {
    try {
      const res = await fetch(`/api/messages/${id}/verify`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to verify');
      const { message } = await res.json();
      setMessages(messages.map((m) => (m.id === id ? message : m)));
      setVerifyConfirm(null);
    } catch (err) {
      alert('Error verifying message.');
    }
  };

  const handleRevert = async (id: number) => {
    try {
      const res = await fetch(`/api/messages/${id}/unverify`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to revert');
      const { message } = await res.json();
      setMessages(messages.map((m) => (m.id === id ? message : m)));
      setRevertConfirm(null);
    } catch (err) {
      alert('Error reverting message.');
    }
  };

  const handleEditSave = async (updated: ContactMessage) => {
    try {
      const res = await fetch(`/api/messages/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Failed to update');
      const { message } = await res.json();
      setMessages(messages.map((m) => (m.id === updated.id ? message : m)));
      setEditingMessage(null);
    } catch (err) {
      alert('Error updating message.');
    }
  };

  // Filtering & Sorting Logic
  const filteredMessages = messages.filter(msg => {
    // Global Search (for Card View)
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.subject || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Column Filters (for Grid View)
    const matchesName = msg.name.toLowerCase().includes(columnFilters.name.toLowerCase());
    const matchesEmail = msg.email.toLowerCase().includes(columnFilters.email.toLowerCase());
    const matchesPhone = (msg.phone || '').toLowerCase().includes(columnFilters.phone.toLowerCase());
    const matchesSubject = (msg.subject || '').toLowerCase().includes(columnFilters.subject.toLowerCase());
    const matchesStatus = columnFilters.status === 'all' || 
      (columnFilters.status === 'verified' ? msg.verified : !msg.verified);

    // Context-dependent filtering
    if (viewMode === 'card') {
      const matchesGlobalStatus = statusFilter === 'all' || 
        (statusFilter === 'verified' ? msg.verified : !msg.verified);
      return (matchesSearch || (msg.phone || '').toLowerCase().includes(searchTerm.toLowerCase())) && matchesGlobalStatus;
    }
    
    // Grid mode: combine global search with column filters
    return matchesSearch && matchesName && matchesEmail && matchesPhone && matchesSubject && matchesStatus;
  });


  const sortedMessages = [...filteredMessages].sort((a, b) => {
    if (!sortConfig.direction) return 0;
    
    const aValue = a[sortConfig.key] ?? '';
    const bValue = b[sortConfig.key] ?? '';

    if (aValue === bValue) return 0;
    
    const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * multiplier;
    }
    
    return (aValue < bValue ? -1 : 1) * multiplier;
  });

  // Pagination Logic
  const totalItems = sortedMessages.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedMessages = sortedMessages.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, columnFilters]);

  // Sorting Helper
  const requestSort = (key: SortConfig['key']) => {
    let direction: SortConfig['direction'] = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-32 ${dark ? 'text-white bg-slate-950' : 'text-slate-900 bg-slate-50'} min-h-screen`}>
        <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-16 ${dark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black">Reach Out Details</h1>
            <p className={`mt-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Manage and respond to client inquiries.</p>
          </div>
          <div className={`flex rounded-xl p-1 border ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${viewMode === 'grid' ? (dark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900') : (dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
            >
              <List className="w-4 h-4" />
              Grid View
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${viewMode === 'card' ? (dark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900') : (dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
            >
              <Grid3X3 className="w-4 h-4" />
              Card View
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className={`flex flex-col lg:flex-row gap-4 mb-6 p-4 rounded-2xl border ${dark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white shadow-sm'}`}>
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input 
              type="text" 
              placeholder="Search by name, email or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all outline-none ${dark ? 'bg-slate-800 border-slate-700 focus:border-blue-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-500'}`}
            />
          </div>
          <div className="flex gap-2 p-1 rounded-xl bg-slate-200/50 dark:bg-slate-800/50">
            {(['all', 'pending', 'verified'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${statusFilter === status ? (dark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white shadow-md') : (dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="p-4 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">{error}</div>
        ) : filteredMessages.length === 0 ? (
          <div className={`text-center py-20 rounded-3xl border ${dark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
            <Mail className={`w-12 h-12 mx-auto mb-4 opacity-50 ${dark ? 'text-slate-400' : 'text-slate-400'}`} />
            <h3 className="text-xl font-bold">No results found</h3>
            <p className={`mt-2 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col rounded-2xl border transition-all ${dark ? 'border-slate-800 bg-slate-900 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'} ${msg.verified ? 'opacity-70' : ''}`}>
                    <div className={`p-3.5 flex-1 ${dark ? 'border-b border-slate-800' : 'border-b border-slate-100'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="font-bold truncate text-base" title={msg.name}>{msg.name}</h3>
                          <div className="flex flex-col gap-0.5 mt-0.5">
                            <p className={`text-xs truncate ${dark ? 'text-slate-400' : 'text-slate-500'} font-medium`} title={msg.email}>{msg.email}</p>
                            {msg.phone && <p className={`text-[10px] truncate ${dark ? 'text-blue-400/80' : 'text-blue-600/80'} font-bold`}>{msg.phone}</p>}
                          </div>
                        </div>
                        <div className="flex items-start gap-2 relative">
                          {msg.verified && (
                            <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-500">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                          <div className="opacity-100">
                            <button onClick={() => setOpenMenuId(openMenuId === msg.id ? null : msg.id)} className={`p-1 -mt-1 rounded-lg transition-colors z-20 relative text-slate-400 hover:text-slate-600 ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}>
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            {openMenuId === msg.id && (
                              <div className={`absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-xl border overflow-hidden z-[100] ${dark ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200'} animate-[fadeIn_0.2s_ease-out]`}>
                                {msg.verified ? (
                                  <button 
                                    onClick={() => { setRevertConfirm(msg.id); setOpenMenuId(null); }} 
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-left transition-all ${dark ? 'text-slate-300 hover:bg-red-500/10 hover:text-red-400' : 'text-slate-700 hover:bg-red-50 hover:text-red-600'}`}
                                  >
                                    <div className={`p-1.5 rounded-lg ${dark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                                      <AlertTriangle className="w-4 h-4 text-red-500"/> 
                                    </div>
                                    Revert
                                  </button>
                                ) : (
                                  <>
                                    <button 
                                      onClick={() => { setVerifyConfirm(msg.id); setOpenMenuId(null); }} 
                                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-left transition-all ${dark ? 'text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-600'}`}
                                    >
                                      <div className={`p-1.5 rounded-lg ${dark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                                        <CheckCircle className="w-4 h-4 text-emerald-500"/> 
                                      </div>
                                      Verify
                                    </button>
                                    <button 
                                      onClick={() => { setEditingMessage(msg); setOpenMenuId(null); }} 
                                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-left transition-all ${dark ? 'text-slate-300 hover:bg-blue-500/10 hover:text-blue-400' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'}`}
                                    >
                                      <div className={`p-1.5 rounded-lg ${dark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                                        <Edit2 className="w-4 h-4 text-blue-500"/> 
                                      </div>
                                      Edit
                                    </button>
                                    <div className={`h-[1px] ${dark ? 'bg-slate-800' : 'bg-slate-100'} my-1`}></div>
                                    <button 
                                      onClick={() => { setDeleteConfirm(msg.id); setOpenMenuId(null); }} 
                                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-left transition-all ${dark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                                    >
                                      <div className={`p-1.5 rounded-lg ${dark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                                        <Trash2 className="w-4 h-4"/> 
                                      </div>
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <h4 className={`text-xs font-bold mb-1.5 uppercase tracking-widest ${dark ? 'text-blue-400' : 'text-blue-600'}`}>{msg.subject || 'No Subject'}</h4>
                      <p className={`text-sm line-clamp-3 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{msg.message}</p>
                      <p className={`text-[10px] mt-4 font-mono ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{new Date(msg.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`overflow-x-auto rounded-2xl border ${dark ? 'border-slate-800 bg-slate-900 shadow-2xl' : 'border-slate-200 bg-white shadow-xl'}`}>
              <table className="w-full text-left text-sm whitespace-nowrap border-separate border-spacing-0">
                <thead className={`sticky top-0 z-30 ${dark ? 'bg-slate-950/90 backdrop-blur-md' : 'bg-slate-50/90 backdrop-blur-md'}`}>
                  {/* Sorting Header Row */}
                  <tr>
                    <th className={`px-3 py-2.5 font-black border-b ${dark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'} uppercase tracking-wider text-[10px]`}>
                      Actions
                    </th>
                    <th className={`px-3 py-2.5 border-b ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <button 
                        onClick={() => requestSort('verified')}
                        className={`flex items-center gap-2 font-black uppercase tracking-wider text-[10px] transition-colors ${sortConfig.key === 'verified' ? 'text-blue-500' : (dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
                      >
                        Status
                        {sortConfig.key === 'verified' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>)}
                        {sortConfig.key !== 'verified' && <ArrowUpDown className="w-3 h-3 opacity-30"/>}
                      </button>
                    </th>
                    <th className={`px-3 py-2.5 border-b ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <button 
                        onClick={() => requestSort('name')}
                        className={`flex items-center gap-2 font-black uppercase tracking-wider text-[10px] transition-colors ${sortConfig.key === 'name' ? 'text-blue-500' : (dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
                      >
                        Name
                        {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>)}
                        {sortConfig.key !== 'name' && <ArrowUpDown className="w-3 h-3 opacity-30"/>}
                      </button>
                    </th>
                    <th className={`px-3 py-2.5 border-b ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <button 
                        onClick={() => requestSort('email')}
                        className={`flex items-center gap-2 font-black uppercase tracking-wider text-[10px] transition-colors ${sortConfig.key === 'email' ? 'text-blue-500' : (dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
                      >
                        Email
                        {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>)}
                        {sortConfig.key !== 'email' && <ArrowUpDown className="w-3 h-3 opacity-30"/>}
                      </button>
                    </th>
                    <th className={`px-3 py-2.5 border-b ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <button 
                        onClick={() => requestSort('phone')}
                        className={`flex items-center gap-2 font-black uppercase tracking-wider text-[10px] transition-colors ${sortConfig.key === 'phone' ? 'text-blue-500' : (dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
                      >
                        Phone
                        {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>)}
                        {sortConfig.key !== 'phone' && <ArrowUpDown className="w-3 h-3 opacity-30"/>}
                      </button>
                    </th>
                    <th className={`px-3 py-2.5 border-b ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <button 
                        onClick={() => requestSort('subject')}
                        className={`flex items-center gap-2 font-black uppercase tracking-wider text-[10px] transition-colors ${sortConfig.key === 'subject' ? 'text-blue-500' : (dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
                      >
                        Subject
                        {sortConfig.key === 'subject' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>)}
                        {sortConfig.key !== 'subject' && <ArrowUpDown className="w-3 h-3 opacity-30"/>}
                      </button>
                    </th>
                    <th className={`px-3 py-2.5 border-b ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <button 
                        onClick={() => requestSort('created_at')}
                        className={`flex items-center gap-2 font-black uppercase tracking-wider text-[10px] transition-colors ${sortConfig.key === 'created_at' ? 'text-blue-500' : (dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
                      >
                        Date
                        {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>)}
                        {sortConfig.key !== 'created_at' && <ArrowUpDown className="w-3 h-3 opacity-30"/>}
                      </button>
                    </th>
                  </tr>
                  {/* Filtering Header Row */}
                  <tr className={`${dark ? 'bg-slate-900/50' : 'bg-white'}`}>
                    <th className="px-3 py-1.5 border-b border-r dark:border-slate-800 border-slate-100">
                      <div className="flex items-center justify-center">
                        <Filter className="w-3 h-3 opacity-20" />
                      </div>
                    </th>
                    <th className="px-3 py-1.5 border-b dark:border-slate-800 border-slate-100">
                      <select 
                        value={columnFilters.status}
                        onChange={(e) => setColumnFilters({...columnFilters, status: e.target.value})}
                        className={`w-full text-[10px] py-1 px-2 rounded-md border outline-none font-bold ${dark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                      >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                      </select>
                    </th>
                    <th className="px-3 py-1.5 border-b dark:border-slate-800 border-slate-100">
                      <input 
                        type="text" 
                        placeholder="Filter name..."
                        value={columnFilters.name}
                        onChange={(e) => setColumnFilters({...columnFilters, name: e.target.value})}
                        className={`w-full text-[10px] py-1 px-2 rounded-md border outline-none transition-all ${dark ? 'bg-slate-800 border-slate-700 focus:border-blue-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-500'}`}
                      />
                    </th>
                    <th className="px-3 py-1.5 border-b dark:border-slate-800 border-slate-100">
                      <input 
                        type="text" 
                        placeholder="Filter email..."
                        value={columnFilters.email}
                        onChange={(e) => setColumnFilters({...columnFilters, email: e.target.value})}
                        className={`w-full text-[10px] py-1 px-2 rounded-md border outline-none transition-all ${dark ? 'bg-slate-800 border-slate-700 focus:border-blue-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-500'}`}
                      />
                    </th>
                    <th className="px-3 py-1.5 border-b dark:border-slate-800 border-slate-100">
                      <input 
                        type="text" 
                        placeholder="Filter phone..."
                        value={columnFilters.phone}
                        onChange={(e) => setColumnFilters({...columnFilters, phone: e.target.value})}
                        className={`w-full text-[10px] py-1 px-2 rounded-md border outline-none transition-all ${dark ? 'bg-slate-800 border-slate-700 focus:border-blue-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-500'}`}
                      />
                    </th>
                    <th className="px-3 py-1.5 border-b dark:border-slate-800 border-slate-100">
                      <input 
                        type="text" 
                        placeholder="Filter subject..."
                        value={columnFilters.subject}
                        onChange={(e) => setColumnFilters({...columnFilters, subject: e.target.value})}
                        className={`w-full text-[10px] py-1 px-2 rounded-md border outline-none transition-all ${dark ? 'bg-slate-800 border-slate-700 focus:border-blue-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-500'}`}
                      />
                    </th>
                    <th className="px-3 py-1.5 border-b dark:border-slate-800 border-slate-100">
                      <div className="w-full h-6 opacity-0" />
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${dark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
                  {displayedMessages.map((msg) => (
                    <tr key={msg.id} className={`transition-colors group ${dark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'} ${msg.verified ? (dark ? 'opacity-70' : 'bg-slate-50/50') : ''}`}>
                      <td className="px-3 py-1.5 relative">
                        <button onClick={() => setOpenMenuId(openMenuId === msg.id ? null : msg.id)} className={`p-1.5 rounded-lg transition-colors inline-flex z-20 relative text-slate-400 hover:text-slate-600 ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}>
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {openMenuId === msg.id && (
                          <div className={`absolute left-16 top-1/2 -translate-y-1/2 w-48 rounded-2xl shadow-xl border overflow-hidden z-[100] ${dark ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-200'} animate-[fadeIn_0.2s_ease-out]`}>
                            {msg.verified ? (
                              <button 
                                onClick={() => { setRevertConfirm(msg.id); setOpenMenuId(null); }} 
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-left transition-all ${dark ? 'text-slate-300 hover:bg-red-500/10 hover:text-red-400' : 'text-slate-700 hover:bg-red-50 hover:text-red-600'}`}
                              >
                                <div className={`p-1.5 rounded-lg ${dark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                                  <AlertTriangle className="w-4 h-4 text-red-500"/> 
                                </div>
                                Revert
                              </button>
                            ) : (
                              <>
                                <button 
                                  onClick={() => { setVerifyConfirm(msg.id); setOpenMenuId(null); }} 
                                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-left transition-all ${dark ? 'text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-600'}`}
                                >
                                  <div className={`p-1.5 rounded-lg ${dark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                                    <CheckCircle className="w-4 h-4 text-emerald-500"/> 
                                  </div>
                                  Verify
                                </button>
                                <button 
                                  onClick={() => { setEditingMessage(msg); setOpenMenuId(null); }} 
                                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-left transition-all ${dark ? 'text-slate-300 hover:bg-blue-500/10 hover:text-blue-400' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'}`}
                                >
                                  <div className={`p-1.5 rounded-lg ${dark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                                    <Edit2 className="w-4 h-4 text-blue-500"/> 
                                  </div>
                                  Edit
                                </button>
                                <div className={`h-[1px] ${dark ? 'bg-slate-800' : 'bg-slate-100'} my-1`}></div>
                                <button 
                                  onClick={() => { setDeleteConfirm(msg.id); setOpenMenuId(null); }} 
                                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-left transition-all ${dark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                                >
                                  <div className={`p-1.5 rounded-lg ${dark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                                    <Trash2 className="w-4 h-4"/> 
                                  </div>
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-1.5">
                        {msg.verified ? (
                          <span className="inline-flex items-center gap-1.5 font-bold text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter"><CheckCircle className="w-2.5 h-2.5"/> Verified</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-bold text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter"><AlertTriangle className="w-2.5 h-2.5"/> Pending</span>
                        )}
                      </td>
                      <td className="px-3 py-1.5 font-bold transition-colors group-hover:text-blue-500">{msg.name}</td>
                      <td className="px-3 py-1.5 opacity-80">{msg.email}</td>
                      <td className="px-3 py-1.5 text-xs font-bold text-blue-500/80">{msg.phone || '-'}</td>
                      <td className="px-3 py-1.5 max-w-[200px] truncate" title={msg.subject}>{msg.subject || '-'}</td>
                      <td className="px-3 py-1.5 text-[10px] font-mono opacity-60">{new Date(msg.created_at).toLocaleString()}</td>
                    </tr>

                  ))}
                </tbody>
              </table>
            </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <p className={`text-sm ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
                  Showing <span className={`font-bold ${dark ? 'text-slate-300' : 'text-slate-800'}`}>{startIndex + 1}</span> to <span className={`font-bold ${dark ? 'text-slate-300' : 'text-slate-800'}`}>{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className={`font-bold ${dark ? 'text-slate-300' : 'text-slate-800'}`}>{totalItems}</span> results
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-xl border transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : (dark ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50')}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg' : (dark ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-xl border transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : (dark ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50')}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {openMenuId !== null && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
      )}

      {/* Confirmation Modals */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-6 rounded-3xl shadow-2xl text-center ${dark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black mb-2">Delete Message?</h3>
            <p className={`text-sm mb-6 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className={`flex-1 py-3 px-4 rounded-xl font-bold transition-colors ${dark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm!)} className="flex-1 py-3 px-4 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {verifyConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-6 rounded-3xl shadow-2xl text-center ${dark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black mb-2">Verify Message?</h3>
            <p className={`text-sm mb-6 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Verifying this message will mark it as reviewed and hide it from the active notifications count.</p>
            <div className="flex gap-3">
              <button onClick={() => setVerifyConfirm(null)} className={`flex-1 py-3 px-4 rounded-xl font-bold transition-colors ${dark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>Cancel</button>
              <button onClick={() => handleVerify(verifyConfirm!)} className="flex-1 py-3 px-4 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-colors">Verify</button>
            </div>
          </div>
        </div>
      )}

      {revertConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm p-6 rounded-3xl shadow-2xl text-center ${dark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black mb-2">Revert Verification?</h3>
            <p className={`text-sm mb-6 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>This will move the message back to "Pending" and it will appear in your notifications again.</p>
            <div className="flex gap-3">
              <button onClick={() => setRevertConfirm(null)} className={`flex-1 py-3 px-4 rounded-xl font-bold transition-colors ${dark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>Cancel</button>
              <button onClick={() => handleRevert(revertConfirm!)} className="flex-1 py-3 px-4 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg transition-colors">Revert Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl ${dark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Edit</h3>
              <button onClick={() => setEditingMessage(null)} className={`p-2 rounded-xl transition-colors ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Name</label>
                <input value={editingMessage.name} onChange={e => setEditingMessage({...editingMessage, name: e.target.value} as ContactMessage)} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${dark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'}`} />
              </div>
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Email</label>
                <input value={editingMessage.email} onChange={e => setEditingMessage({...editingMessage, email: e.target.value} as ContactMessage)} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${dark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'}`} />
              </div>
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Phone</label>
                <input value={editingMessage.phone} onChange={e => setEditingMessage({...editingMessage, phone: e.target.value.replace(/\D/g, '')} as ContactMessage)} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${dark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'}`} />
              </div>
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Subject</label>
                <input value={editingMessage.subject} onChange={e => setEditingMessage({...editingMessage, subject: e.target.value} as ContactMessage)} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${dark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'}`} />
              </div>
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Message / Notes</label>
                <textarea rows={4} value={editingMessage.message} onChange={e => setEditingMessage({...editingMessage, message: e.target.value} as ContactMessage)} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all ${dark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'}`} />
              </div>
              <div className="pt-4 border-t flex justify-end gap-3 mt-6 border-slate-200 dark:border-slate-800">
                <button onClick={() => setEditingMessage(null)} className={`px-5 py-2.5 rounded-xl font-bold transition-colors ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>Cancel</button>
                <button onClick={() => handleEditSave(editingMessage!)} className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
