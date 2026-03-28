import { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle, List, Grid3X3, X, AlertTriangle, MoreVertical, Edit2 } from 'lucide-react';
import { ContactMessage } from '../types';

interface Props {
  dark: boolean;
}

type ViewMode = 'card' | 'grid';

export function AdminMessagesPage({ dark }: Props) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [error, setError] = useState('');
  
  // Dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [verifyConfirm, setVerifyConfirm] = useState<number | null>(null);
  const [editingMessage, setEditingMessage] = useState<ContactMessage | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  
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
      setMessages(messages.filter((m) => m.id !== id));
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

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-32 ${dark ? 'text-white bg-slate-950' : 'text-slate-900 bg-slate-50'} min-h-screen`}>
        <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-24 pb-16 ${dark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {error ? (
          <div className="p-4 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">{error}</div>
        ) : messages.length === 0 ? (
          <div className={`text-center py-20 rounded-3xl border ${dark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
            <Mail className={`w-12 h-12 mx-auto mb-4 opacity-50 ${dark ? 'text-slate-400' : 'text-slate-400'}`} />
            <h3 className="text-xl font-bold">No messages yet</h3>
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col overflow-hidden rounded-2xl border transition-all ${dark ? 'border-slate-800 bg-slate-900 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'} ${msg.verified ? 'opacity-70' : ''}`}>
                <div className={`p-5 flex-1 ${dark ? 'border-b border-slate-800' : 'border-b border-slate-100'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate" title={msg.name}>{msg.name}</h3>
                      <p className={`text-sm truncate mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'} font-medium`} title={msg.email}>{msg.email}</p>
                    </div>
                    {msg.verified && (
                      <span className="flex-shrink-0 ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-500">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <h4 className={`text-sm font-bold mb-2 uppercase tracking-wider ${dark ? 'text-blue-400' : 'text-blue-600'}`}>{msg.subject || 'No Subject'}</h4>
                  <p className={`text-sm line-clamp-4 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{msg.message}</p>
                  <p className={`text-xs mt-4 font-mono ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{new Date(msg.created_at).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-slate-50/5 dark:bg-slate-900/50 flex justify-end relative">
                  <button onClick={() => setOpenMenuId(openMenuId === msg.id ? null : msg.id)} className={`p-2 rounded-lg transition-colors z-20 relative ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}>
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {openMenuId === msg.id && (
                    <div className={`absolute right-4 bottom-full mb-2 w-48 rounded-xl shadow-xl border overflow-hidden z-50 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                      {!msg.verified && (
                        <button onClick={() => { setVerifyConfirm(msg.id); setOpenMenuId(null); }} className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-left hover:bg-emerald-500 hover:text-white transition-colors ${dark ? 'text-slate-200' : 'text-slate-700'}`}><CheckCircle className="w-4 h-4"/> Verify</button>
                      )}
                      <button onClick={() => { setEditingMessage(msg); setOpenMenuId(null); }} className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-left hover:bg-blue-500 hover:text-white transition-colors ${dark ? 'text-slate-200' : 'text-slate-700'}`}><Edit2 className="w-4 h-4"/> Edit</button>
                      <button onClick={() => { setDeleteConfirm(msg.id); setOpenMenuId(null); }} className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-left text-red-500 hover:bg-red-500 hover:text-white transition-colors`}><Trash2 className="w-4 h-4"/> Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`overflow-x-auto rounded-2xl border ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white shadow-sm'}`}>
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className={`border-b ${dark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50'}`}>
                <tr>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Name</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Subject</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${dark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
                {messages.map((msg) => (
                  <tr key={msg.id} className={`transition-colors ${dark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'} ${msg.verified ? (dark ? 'opacity-70' : 'bg-slate-50/50') : ''}`}>
                    <td className="px-6 py-4">
                      {msg.verified ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3"/> Verified</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full"><AlertTriangle className="w-3 h-3"/> Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold">{msg.name}</td>
                    <td className="px-6 py-4">{msg.email}</td>
                    <td className="px-6 py-4 max-w-[200px] truncate" title={msg.subject}>{msg.subject || '-'}</td>
                    <td className="px-6 py-4 text-xs font-mono">{new Date(msg.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right relative">
                      <button onClick={() => setOpenMenuId(openMenuId === msg.id ? null : msg.id)} className={`p-2 rounded-lg transition-colors inline-flex z-20 relative ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}>
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {openMenuId === msg.id && (
                        <div className={`absolute right-12 top-1/2 -translate-y-1/2 w-48 rounded-xl shadow-xl border overflow-hidden z-50 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                          {!msg.verified && (
                            <button onClick={() => { setVerifyConfirm(msg.id); setOpenMenuId(null); }} className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-left hover:bg-emerald-500 hover:text-white transition-colors ${dark ? 'text-slate-200' : 'text-slate-700'}`}><CheckCircle className="w-4 h-4"/> Verify</button>
                          )}
                          <button onClick={() => { setEditingMessage(msg); setOpenMenuId(null); }} className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-left hover:bg-blue-500 hover:text-white transition-colors ${dark ? 'text-slate-200' : 'text-slate-700'}`}><Edit2 className="w-4 h-4"/> Edit</button>
                          <button onClick={() => { setDeleteConfirm(msg.id); setOpenMenuId(null); }} className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-left text-red-500 hover:bg-red-500 hover:text-white transition-colors`}><Trash2 className="w-4 h-4"/> Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 px-4 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg transition-colors">Delete</button>
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
              <button onClick={() => handleVerify(verifyConfirm)} className="flex-1 py-3 px-4 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-colors">Verify</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl ${dark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Edit Message</h3>
              <button onClick={() => setEditingMessage(null)} className={`p-2 rounded-xl transition-colors ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Name</label>
                <input value={editingMessage.name} onChange={e => setEditingMessage({...editingMessage, name: e.target.value})} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${dark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'}`} />
              </div>
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Email</label>
                <input value={editingMessage.email} onChange={e => setEditingMessage({...editingMessage, email: e.target.value})} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${dark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'}`} />
              </div>
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Subject</label>
                <input value={editingMessage.subject} onChange={e => setEditingMessage({...editingMessage, subject: e.target.value})} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${dark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'}`} />
              </div>
              <div>
                <label className={`text-xs font-bold uppercase tracking-wider mb-1.5 block ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Message / Notes</label>
                <textarea rows={4} value={editingMessage.message} onChange={e => setEditingMessage({...editingMessage, message: e.target.value})} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all ${dark ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-white border-slate-200 focus:border-blue-500'}`} />
              </div>
              <div className="pt-4 border-t flex justify-end gap-3 mt-6 border-slate-200 dark:border-slate-800">
                <button onClick={() => setEditingMessage(null)} className={`px-5 py-2.5 rounded-xl font-bold transition-colors ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>Cancel</button>
                <button onClick={() => handleEditSave(editingMessage)} className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
