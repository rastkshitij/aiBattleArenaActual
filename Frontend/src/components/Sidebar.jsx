import React, { useState } from 'react';
import { Swords, Plus, MessageSquare, Trash2, LogOut, User, Cpu, ShieldCheck } from 'lucide-react';

export default function Sidebar({ user, chats, activeChatId, onSelectChat, onNewChat, onLogout, onDeleteChat }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = (e, chatId) => {
    e.stopPropagation();
    if (deletingId === chatId) {
      onDeleteChat(chatId);
      setDeletingId(null);
    } else {
      setDeletingId(chatId);
      setTimeout(() => {
        setDeletingId((current) => (current === chatId ? null : current));
      }, 3000);
    }
  };

  return (
    <aside className="w-80 border-r border-gray-800/80 bg-[#070a12] p-4 flex flex-col h-full relative z-20 select-none">
      {/* Top Arena Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0b101d] border border-cyan-500/30 flex items-center justify-center glow-cyan-sm">
            <Swords className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="font-heading font-bold text-sm text-gray-100 tracking-wide">AI BATTLE ARENA</div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>OPERATIONAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Battle Button */}
      <button
        type="button"
        onClick={onNewChat}
        className="w-full mb-4 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 to-purple-950/40 hover:from-cyan-900/60 hover:to-purple-900/60 text-cyan-300 font-heading font-semibold py-3 px-4 text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:glow-cyan-sm cursor-pointer group"
      >
        <Plus className="w-4 h-4 text-cyan-400 group-hover:rotate-90 transition-transform" />
        <span>+ NEW BATTLE</span>
      </button>

      {/* Chat List Section */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-2 mb-2">
          Battle Archives ({chats.length})
        </div>

        {chats.length === 0 ? (
          <div className="text-center py-8 px-4 text-xs font-mono text-gray-600 border border-dashed border-gray-850 rounded-xl">
            No previous battles. Start a new duel!
          </div>
        ) : (
          chats.map((chat) => {
            const isActive = activeChatId === chat._id;
            const isDeleting = deletingId === chat._id;

            return (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat._id)}
                className={`group relative flex items-center justify-between rounded-xl px-3.5 py-3 text-xs transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-[#0d1526] border-cyan-500/50 text-cyan-200 glow-cyan-sm font-medium'
                    : 'bg-[#0a0e19] border-gray-800/80 text-gray-400 hover:border-gray-700 hover:text-gray-200 hover:bg-[#0e1424]'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full glow-cyan-sm" />
                )}

                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-400'}`} />
                  <span className="truncate">{chat.title || 'Untitled Battle'}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDelete(e, chat._id)}
                  className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
                    isDeleting
                      ? 'bg-red-950/80 text-red-300 border border-red-800'
                      : 'opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 hover:bg-red-950/40'
                  }`}
                  title={isDeleting ? 'Click again to confirm delete' : 'Delete battle'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* User Profile Footer */}
      <div className="pt-4 mt-auto border-t border-gray-800/80">
        <div className="flex items-center justify-between bg-[#0a0e19] p-3 rounded-xl border border-gray-850">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold flex-shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-gray-200 truncate">{user?.email || 'Commander'}</div>
              <div className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" /> Active Session
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
