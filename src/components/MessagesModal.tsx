import { useState, useEffect } from 'react';
import { X, Mail, Clock, Inbox } from 'lucide-react';
import { ContactMessage } from '../types';

interface Props {
  dark: boolean;
  onClose: () => void;
}

export function MessagesModal({ dark, onClose }: Props) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages');
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        setMessages(data.filter((m: ContactMessage) => !m.verified));
      } catch (err) {
        setError('Error loading messages. Please check if the server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden ${dark ? 'bg-[#0A0F1C] border border-slate-800' : 'bg-white'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${dark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Unverified Reach Out Messages</h3>
              <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>New messages pending verification from clients</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${dark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-4">
              <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Loading messages...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm">
              {error}
            </div>
          ) : messages.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-20 text-center ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Mail className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">No new unverified messages</p>
              <p className="text-sm mt-1">When users submit the contact form, they will appear here until verified.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${dark ? 'border-slate-800 bg-slate-800/20 hover:bg-slate-800/40' : 'border-slate-100 bg-white hover:bg-slate-50 shadow-sm'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${dark ? 'bg-slate-800 text-blue-400' : 'bg-slate-100 text-blue-600'}`}>
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <h4 className={`font-bold text-lg ${dark ? 'text-white' : 'text-slate-900'}`}>
                      {msg.name}
                    </h4>
                  </div>
                  <div className={`flex items-center gap-1.5 text-sm font-semibold ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <Clock className="w-4 h-4" />
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
