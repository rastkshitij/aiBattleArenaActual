import React from 'react';

export default function Sidebar({ user, chats, activeChatId, onSelectChat, onNewChat, onLogout, onDeleteChat }) {
  return (
    <aside className="w-80 border-r border-[#222] bg-[#0F0F0F] p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#222] flex items-center justify-center">❋</div>
          <div>
            <div className="font-semibold">AI Battle Arena</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        </div>
        <button onClick={onLogout} className="text-sm text-gray-400 hover:text-white">Logout</button>
      </div>

      <button
        type="button"
        onClick={onNewChat}
        className="mb-4 rounded-xl border border-[#333] bg-[#141414] py-2 text-sm hover:border-gray-500"
      >
        + New chat
      </button>

      <div className="space-y-2 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`flex items-center gap-2 rounded-xl border px-3 py-3 transition ${
              activeChatId === chat._id ? 'border-gray-500 bg-[#1A1A1A]' : 'border-[#222] bg-[#111111] hover:border-[#333]'
            }`}
          >
            <button
              type="button"
              onClick={() => onSelectChat(chat._id)}
              className="flex-1 text-left"
            >
              <div className="text-sm font-medium text-gray-200 truncate">{chat.title || 'Untitled chat'}</div>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat._id);
              }}
              className="text-xs text-gray-400 hover:text-red-300 transition"
              aria-label={`Delete chat ${chat.title || 'Untitled chat'}`}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
