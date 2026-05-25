import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import { createSupabaseAuthClient } from '~/lib/supabase-auth.client';
import { db } from '~/lib/persistence/useChatHistory';
import { getAll } from '~/lib/persistence/db';
import type { ChatHistoryItem } from '~/lib/persistence/useChatHistory';
import { profileStore } from '~/lib/stores/profile';
import { useStore } from '@nanostores/react';

export default function ProfileRoute() {
  const navigate = useNavigate();
  const client = useMemo(() => createSupabaseAuthClient(), []);
  const profile = useStore(profileStore);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('Loading...');
  const [chats, setChats] = useState<ChatHistoryItem[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    async function load() {
      if (!client) {
        setStatus('Missing Supabase publishable key. Go to /login first.');
        return;
      }

      const { data } = await client.auth.getSession();
      if (!data.session) {
        navigate('/login');
        return;
      }

      setEmail(data.session.user.email || 'Unknown');
      setUserId(data.session.user.id);
      setStatus('Authenticated');
    }

    load();
  }, [client, navigate]);

  useEffect(() => {
    if (!db) {
      setLoadingChats(false);
      return;
    }

    getAll(db)
      .then((items) => {
        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setChats(items);
      })
      .catch((err) => console.error('Failed to load chats:', err))
      .finally(() => setLoadingChats(false));
  }, []);

  const handleDeleteChat = useCallback(async (chatId: string) => {
    if (!db) return;
    const { deleteById } = await import('~/lib/persistence/db');
    try {
      await deleteById(db, chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    await client?.auth.signOut();
    navigate('/login');
  }, [client, navigate]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getDateCategory = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return 'Last 7 Days';
    if (diffDays < 30) return 'Last 30 Days';
    return 'Older';
  };

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      chat.description?.toLowerCase().includes(q) ||
      chat.messages.some((m) => m.content?.toLowerCase().includes(q))
    );
  });

  // Group filtered chats by date category
  const groupedChats: Record<string, ChatHistoryItem[]> = {};
  filteredChats.forEach((chat) => {
    const category = getDateCategory(chat.timestamp);
    if (!groupedChats[category]) groupedChats[category] = [];
    groupedChats[category].push(chat);
  });

  // Maintain order of categories
  const categoryOrder = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Older'];
  const orderedCategories = categoryOrder.filter((cat) => groupedChats[cat]);

  const chatsWithUrlId = chats.filter((c) => c.urlId && c.description).length;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-3 text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
          <img src="/logo-light-styled.png" alt="Bolt" className="w-[90px] inline-block dark:hidden" />
          <img src="/logo-dark-styled.png" alt="Bolt" className="w-[90px] inline-block hidden dark:block" />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
          >
            <div className="i-ph:code-bold text-lg" />
            Back to Builder
          </Link>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
          >
            <div className="i-ph:sign-out text-lg" />
            {signingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-6">
        {/* Profile card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile?.username || email}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  email ? email.charAt(0).toUpperCase() : '?'
                )}
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile?.username || 'User'}
              </h1>
              {profile?.bio && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {profile.bio}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <div className="i-ph:envelope-simple text-base" />
                  {email}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <div className="i-ph:check-circle text-base text-green-500" />
                  {status}
                </span>
              </div>
            </div>

            {/* User ID */}
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono truncate max-w-[200px]">
                {userId ? `${userId.slice(0, 8)}...${userId.slice(-4)}` : ''}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{chats.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Chats</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{chatsWithUrlId}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Saved Chats</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chats.reduce((acc, c) => acc + c.messages.length, 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Messages</p>
            </div>
          </div>
        </div>

        {/* Quick Action: Go to Home */}
        <Link
          to="/"
          className="group flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl p-5 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
              <div className="i-ph:house-line text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Go to Home</h3>
              <p className="text-sm text-white/80">Return to the main page and access your recent conversations from the sidebar</p>
            </div>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
            <div className="i-ph:arrow-right text-xl text-white group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Conversations section */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800">
                <div className="i-ph:chats text-xl text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your Conversations
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {filteredChats.length} of {chats.length} {chats.length === 1 ? 'chat' : 'chats'}
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <div className="i-ph:magnifying-glass text-lg" />
              </div>
              <input
                type="text"
                placeholder="Search conversations by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Chat list */}
          <div className="max-h-[600px] overflow-y-auto">
            {loadingChats ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                <div className="i-svg-spinners:90-ring-with-bg text-4xl mb-3 animate-spin" />
                <p className="text-sm">Loading conversations...</p>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                <div className="i-ph:chats text-6xl mb-4 opacity-30" />
                <p className="text-base font-medium text-gray-600 dark:text-gray-300">
                  {searchQuery ? 'No conversations match your search' : 'No conversations yet'}
                </p>
                <p className="text-sm mt-1">
                  {searchQuery ? 'Try a different search term' : 'Start a new chat to see it here'}
                </p>
                {!searchQuery && (
                  <Link
                    to="/"
                    className="mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
                  >
                    <div className="i-ph:plus text-lg" />
                    Start a Chat
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {orderedCategories.map((category) => (
                  <div key={category}>
                    <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 px-5 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {category}
                    </div>
                    {groupedChats[category].map((chat) => (
                      <ChatCard
                        key={chat.id}
                        chat={chat}
                        formatDate={formatDate}
                        onDelete={handleDeleteChat}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ChatCard({
  chat,
  formatDate,
  onDelete,
}: {
  chat: ChatHistoryItem;
  formatDate: (ts: string) => string;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const urlId = chat.urlId || chat.id;

  // Get the first user message to show as a preview
  const firstUserMsg = chat.messages.find((m) => m.role === 'user');
  const preview = firstUserMsg?.content
    ? firstUserMsg.content.length > 150
      ? firstUserMsg.content.slice(0, 150) + '...'
      : firstUserMsg.content
    : 'No messages';

  return (
    <div className="group bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors px-5 py-4">
      <div className="flex items-start gap-4">
        {/* Chat icon */}
        <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400">
          <div className="i-ph:chat-circle text-xl" />
        </div>

        {/* Content */}
        <Link to={`/chat/${urlId}`} className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {chat.description || 'Untitled Chat'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 break-words">
            {preview}
          </p>
          <div className="flex items-center gap-4 mt-2.5 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1.5">
              <div className="i-ph:clock text-sm" />
              {formatDate(chat.timestamp)}
            </span>
            <span className="flex items-center gap-1.5">
              <div className="i-ph:chat-centered text-sm" />
              {chat.messages.length} {chat.messages.length === 1 ? 'msg' : 'msgs'}
            </span>
          </div>
        </Link>

        {/* Delete button */}
        <div className="flex-shrink-0">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  onDelete(chat.id);
                  setConfirmDelete(false);
                }}
                className="rounded-lg bg-red-500 text-white px-3 py-1.5 text-xs font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1.5 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="opacity-0 group-hover:opacity-100 rounded-lg text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              title="Delete conversation"
            >
              <div className="i-ph:trash text-lg" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
