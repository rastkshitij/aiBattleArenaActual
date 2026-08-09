import React, { useState, useEffect } from 'react';
import './App.css';
import AuthForm from '../components/AuthForm';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { authApi, chatApi, aiApi } from '../services/api';

function cleanMdAndLatex(text) {
  if (!text) return '';
  return String(text)
    .replace(/[#_*`~>-]/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\\\[|\\\]/g, '')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\\(|\\\)/g, '')
    .replace(/\\/g, '')
    .replace(/\n+/g, '\n')
    .trim();
}

export default function App() {
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const res = await authApi.me();
      setUser(res.data.user);
      await fetchChats();
    } catch (error) {
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await chatApi.getAll();
      const list = res.data.chats || [];
      setChats(list);

      if (!activeChatId && list.length) {
        setActiveChatId(list[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      setChats([]);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const loadChat = async (chatId) => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    try {
      const res = await chatApi.getById(chatId);
      setMessages(res.data.chat.messages || []);
    } catch (error) {
      console.error('Load chat failed:', error);
    }
  };

  useEffect(() => {
    loadChat(activeChatId);
  }, [activeChatId]);

  const handleAuthSubmit = async ({ email, password }) => {
    setAuthError('');
    setIsAuthLoading(true);

    try {
      const action = authMode === 'login' ? authApi.login : authApi.register;
      const res = await action({ email, password });
      setUser(res.data.user);
      await fetchChats();
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Authentication failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setChats([]);
      setMessages([]);
      setActiveChatId(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!chatId) return;

    try {
      await chatApi.delete(chatId);
      const remainingChats = chats.filter((chat) => chat._id !== chatId);
      setChats(remainingChats);

      if (activeChatId === chatId) {
        setActiveChatId(remainingChats[0]?._id || null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Delete chat failed:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim() || isLoading || !user) return;

    const problem = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      let chatId = activeChatId;

      if (!chatId) {
        const createdChat = await chatApi.create({
          title: problem.slice(0, 30) || 'New chat',
          firstMessage: problem,
        });

        chatId = createdChat.data.chat._id;
        setActiveChatId(chatId);
        setChats((prev) => [createdChat.data.chat, ...prev]);
      }

      const response = await aiApi.invoke({ input: problem, chatId });
      const result = response.data.result;

      const cleanedResult = {
        problem,
        solution_1: cleanMdAndLatex(result.solution_1),
        solution_2: cleanMdAndLatex(result.solution_2),
        judge: {
          solution_1_score: result.judge.solution_1_score,
          solution_2_score: result.judge.solution_2_score,
          solution_1_reasoning: cleanMdAndLatex(result.judge.solution_1_reasoning),
          solution_2_reasoning: cleanMdAndLatex(result.judge.solution_2_reasoning),
        },
      };

      setMessages((prev) => [...prev, { role: 'user', content: problem }, { role: 'assistant', content: cleanedResult }]);
      const updatedChats = await chatApi.getAll();
      setChats(updatedChats.data.chats || []);
    } catch (error) {
      console.error('Chat submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-gray-300">Loading...</div>;
  }

  if (!user) {
    return (
      <>
        {authError && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-950/80 border border-red-800 text-red-200 px-4 py-2 rounded-lg text-sm">
            {authError}
          </div>
        )}
        <AuthForm
          mode={authMode}
          onSubmit={handleAuthSubmit}
          isLoading={isAuthLoading}
          switchMode={() => setAuthMode((prev) => (prev === 'login' ? 'register' : 'login'))}
        />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-gray-200">
      <Sidebar
        user={user}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={() => {
          setActiveChatId(null);
          setMessages([]);
        }}
        onLogout={handleLogout}
        onDeleteChat={handleDeleteChat}
      />

      <ChatWindow
        activeChatId={activeChatId}
        messages={messages}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        input={input}
        setInput={setInput}
      />
    </div>
  );
}
