import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare, Loader2, User, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import api from '../../api/api';

const AITutor = ({ context = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'Hi! I am your SkillForge AI Tutor. How can I help you with your Data Science journey today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { 
        message: currentMessage,
        context 
      });
      
      const reply = res.data?.data?.reply;
      if (res.data?.message?.includes('simulated')) {
        setIsSimulated(true);
      }

      setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'I am having trouble connecting to my brain right now. Please try again in a moment!' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        >
          <Bot className="w-9 h-9 group-hover:animate-bounce" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-[#0a0c12] animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-[400px] h-[550px] bg-white dark:bg-gray-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest">DS Intelligence</h3>
                <p className="text-[10px] font-bold opacity-80 flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Context-Aware Active
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Warning for Simulation Mode */}
          {isSimulated && (
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center gap-2 border-b border-amber-100 dark:border-amber-900/50">
               <AlertTriangle size={12} /> Running in Presentation/Simulation Mode
            </div>
          )}

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-black/20"
          >
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none shadow-lg shadow-primary-500/20' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm rounded-tl-none border border-gray-100 dark:border-gray-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-2 opacity-50 text-[9px] font-black uppercase tracking-tighter">
                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                    <span>{msg.role === 'user' ? 'Student' : 'System Tutor'}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-3">
                  <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tutor Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="relative group">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about pandas, regression..."
                className="w-full pl-6 pr-14 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="absolute right-2 top-2 p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AITutor;
