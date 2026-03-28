import { useState, useEffect } from 'react';
import { X, Mail, Clock, MessageSquare, Inbox } from 'lucide-react';
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
        setMessages(data);
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
              <h3 className={`font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Contact Submissions</h3>
              <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Inbox for all Reach Out form submissions</p>
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
              <p className="font-medium">No messages yet</p>
              <p className="text-sm mt-1">When users submit the contact form, they will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`p-5 rounded-2xl border transition-colors ${dark ? 'border-slate-800 bg-slate-800/20 hover:bg-slate-800/40' : 'border-slate-100 bg-white hover:bg-slate-50 shadow-sm'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${dark ? 'bg-slate-800 text-blue-400' : 'bg-slate-100 text-blue-600'}`}>
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
                          {msg.name}
                        </h4>
                        <div className={`flex items-center gap-1.5 text-xs mt-0.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <Mail className="w-3 h-3" />
                          <a href={`mailto:${msg.email}`} className="hover:text-blue-500 transition-colors">{msg.email}</a>
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <Clock className="w-3 h-3" />
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className={`pl-0 sm:pl-13 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {msg.subject && (
                      <div className="mb-2 text-sm font-semibold flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${dark ? 'bg-blue-500' : 'bg-blue-600'}`} />
                        {msg.subject}
                      </div>
                    )}
                    <div className={`p-4 rounded-xl text-sm leading-relaxed ${dark ? 'bg-slate-900/50 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                      <MessageSquare className="w-4 h-4 mb-2 opacity-50" />
                      {msg.message}
                    </div>
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
