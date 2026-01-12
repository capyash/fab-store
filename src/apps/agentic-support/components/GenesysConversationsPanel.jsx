import { useState, useEffect } from 'react';
import { Phone, MessageSquare, Mail, RefreshCw, ExternalLink, Clock, User, Activity, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConversations, getConversationDetails, getConversationMessages, getConnectionStatus } from '../services/genesysService';

export default function GenesysConversationsPanel({ onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationDetails, setConversationDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  // Load conversations on mount and periodically
  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Load connection status
  useEffect(() => {
    loadConnectionStatus();
    const interval = setInterval(loadConnectionStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Load conversation details when selected
  useEffect(() => {
    if (selectedConversation) {
      loadConversationDetails(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConnectionStatus = async () => {
    try {
      const status = await getConnectionStatus();
      setConnectionStatus(status);
    } catch (error) {
      console.error('Error loading connection status:', error);
    }
  };

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getConversations({ state: 'active', pageSize: 50 });
      setConversations(data.entities || []);
      setLastSync(new Date());
    } catch (error) {
      console.error('Error loading conversations:', error);
      setError(error.message);
      // Set empty array on error
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadConversationDetails = async (conversationId) => {
    try {
      const [details, conversationMessages] = await Promise.all([
        getConversationDetails(conversationId),
        getConversationMessages(conversationId),
      ]);
      setConversationDetails(details);
      setMessages(conversationMessages.entities || []);
    } catch (error) {
      console.error('Error loading conversation details:', error);
      setConversationDetails(null);
      setMessages([]);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (onSelectConversation) {
      onSelectConversation(conversation);
    }
  };

  const getChannelIcon = (conversation) => {
    if (conversation.mediaType === 'voice' || conversation.mediaType === 'call') {
      return Phone;
    } else if (conversation.mediaType === 'chat' || conversation.mediaType === 'message') {
      return MessageSquare;
    } else if (conversation.mediaType === 'email') {
      return Mail;
    }
    return MessageSquare;
  };

  const getChannelColor = (conversation) => {
    if (conversation.mediaType === 'voice' || conversation.mediaType === 'call') {
      return 'text-blue-600 bg-blue-50 border-blue-200';
    } else if (conversation.mediaType === 'chat' || conversation.mediaType === 'message') {
      return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    } else if (conversation.mediaType === 'email') {
      return 'text-purple-600 bg-purple-50 border-purple-200';
    }
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const formatDuration = (startTime) => {
    if (!startTime) return 'N/A';
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}m ${seconds}s`;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] px-4 py-3 flex items-center justify-between border-b-2 border-gray-300">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-white" />
          <div>
            <div className="text-white font-bold text-sm">Genesys Conversations</div>
            <div className="text-white/80 text-[10px] font-medium">
              {connectionStatus?.status === 'connected' ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-400 rounded-full" />
                  {connectionStatus?.error || 'Disconnected'}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={loadConversations}
          disabled={loading}
          className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-700 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400 font-semibold">Active:</span>
          <span className="font-bold text-gray-900 dark:text-white">{conversations.length}</span>
        </div>
        {lastSync && (
          <div className="text-gray-500 dark:text-gray-400">
            Last sync: {formatTime(lastSync)}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-b-2 border-red-200 flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading && conversations.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" />
              <p className="text-xs text-gray-500">Loading conversations...</p>
            </div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No active conversations</p>
              <p className="text-[10px] text-gray-400 mt-1">
                {error ? 'Check your Genesys configuration' : 'Conversations will appear here'}
              </p>
            </div>
          </div>
        ) : (
          conversations.map((conversation) => {
            const Icon = getChannelIcon(conversation);
            const colorClass = getChannelColor(conversation);
            const isSelected = selectedConversation?.id === conversation.id;

            return (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#2E2E2E] text-white border-[#2E2E2E] shadow-md'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : colorClass}`}>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : ''}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <User className={`w-3.5 h-3.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`} />
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          {conversation.participants?.[0]?.name || conversation.participants?.[0]?.address || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-3 h-3 ${isSelected ? 'text-white/60' : 'text-gray-400'}`} />
                        <span className={`text-[10px] ${isSelected ? 'text-white/60' : 'text-gray-500'}`}>
                          {formatDuration(conversation.startTime)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                        {conversation.mediaType || 'chat'}
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        ID: {conversation.id?.substring(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Conversation Details Panel */}
      <AnimatePresence>
        {selectedConversation && conversationDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <div className="p-4 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">Conversation Details</h4>
                <button
                  onClick={() => {
                    setSelectedConversation(null);
                    setConversationDetails(null);
                    setMessages([]);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-xs"
                >
                  Close
                </button>
              </div>
              
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-600 dark:text-gray-400 font-semibold">Start Time:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {formatTime(conversationDetails.startTime)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400 font-semibold">Duration:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {formatDuration(conversationDetails.startTime)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400 font-semibold">State:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {conversationDetails.state || 'active'}
                  </span>
                </div>
                
                {messages.length > 0 && (
                  <div className="mt-3">
                    <div className="text-gray-600 dark:text-gray-400 font-semibold mb-2">Messages ({messages.length}):</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {messages.slice(0, 5).map((msg, idx) => (
                        <div key={idx} className="text-[10px] bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
                          <div className="font-semibold text-gray-700 dark:text-gray-300 mb-0.5">
                            {msg.direction === 'outbound' ? 'Agent' : 'Customer'}:
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {msg.textBody || msg.body || 'No text content'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {onSelectConversation && (
                  <button
                    onClick={() => {
                      if (onSelectConversation) {
                        onSelectConversation(selectedConversation);
                      }
                    }}
                    className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] text-white rounded-lg text-xs font-bold hover:from-[#4A4A4A] hover:to-[#666666] transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Process with FAB Agents
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
