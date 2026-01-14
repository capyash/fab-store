import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Phone, MessageSquare, Mail, RefreshCw, ExternalLink, Clock, User, Activity, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConversations, getConversationDetails, getConversationMessages, getConnectionStatus, createTestConversation } from '../services/genesysService';

const GenesysConversationsPanel = forwardRef(function GenesysConversationsPanel({ onSelectConversation }, ref) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationDetails, setConversationDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const [newConversations, setNewConversations] = useState(new Set()); // Track new conversations
  const [autoProcess, setAutoProcess] = useState(() => {
    return localStorage.getItem('agenticSupport.autoProcessGenesys') === 'true';
  });

  // Load conversations on mount and periodically with fast polling (2-3 seconds)
  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 2500); // Refresh every 2.5 seconds for real-time updates
    return () => clearInterval(interval);
  }, []);

  // Load connection status
  useEffect(() => {
    // Clean up old "Demo Customer" conversations on mount
    try {
      const stored = JSON.parse(localStorage.getItem('genesys_demo_conversations') || '[]');
      const names = ['Sarah Mitchell', 'David Chen', 'Michael Rodriguez', 'Emily Johnson', 'James Wilson', 'Lisa Anderson', 'Robert Taylor', 'Jennifer Martinez'];
      const cleaned = stored.map(conv => {
        if (conv.participants?.[0]?.name === 'Demo Customer' || !conv.participants?.[0]?.name) {
          const randomName = names[Math.floor(Math.random() * names.length)];
          return {
            ...conv,
            participants: conv.participants.map((p, idx) => 
              idx === 0 ? { ...p, name: randomName } : p
            )
          };
        }
        return conv;
      });
      if (cleaned.length > 0) {
        localStorage.setItem('genesys_demo_conversations', JSON.stringify(cleaned));
      }
    } catch (e) {
      console.error('Error cleaning demo conversations:', e);
    }
    
    loadConnectionStatus();
    loadConversations();
    
    const statusInterval = setInterval(loadConnectionStatus, 30000); // Check every 30 seconds
    const conversationsInterval = setInterval(loadConversations, 5000); // Poll conversations every 5 seconds
    
    return () => {
      clearInterval(statusInterval);
      clearInterval(conversationsInterval);
    };
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
      const newConversationsList = data.entities || [];
      
      // Detect new conversations by comparing IDs
      const existingIds = new Set(conversations.map(c => c.id));
      const newlyAdded = newConversationsList.filter(c => !existingIds.has(c.id));
      
      if (newlyAdded.length > 0) {
        // Mark new conversations
        setNewConversations(prev => {
          const updated = new Set(prev);
          newlyAdded.forEach(c => updated.add(c.id));
          return updated;
        });
        
        // Auto-process if enabled
        if (autoProcess && onSelectConversation) {
          newlyAdded.forEach(conversation => {
            // Small delay to show notification first
            setTimeout(() => {
              onSelectConversation(conversation);
            }, 500);
          });
        }
        
        // Clear "new" badge after 10 seconds
        setTimeout(() => {
          setNewConversations(prev => {
            const updated = new Set(prev);
            newlyAdded.forEach(c => updated.delete(c.id));
            return updated;
          });
        }, 10000);
      }
      
      setConversations(newConversationsList);
      setLastSync(new Date());
      
      // Return newly added conversations for external use
      return newlyAdded;
    } catch (error) {
      console.error('Error loading conversations:', error);
      setError(error.message);
      // Set empty array on error
      setConversations([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Expose refresh function via ref
  useImperativeHandle(ref, () => ({
    refresh: loadConversations,
    selectConversation: (conversation) => {
      if (onSelectConversation) {
        onSelectConversation(conversation);
      }
    }
  }));

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
      {/* Ultra Compact Header - Live Queue Style */}
      <div className="bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] px-3 py-2 flex items-center justify-between border-b-2 border-gray-300">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Activity className="w-4 h-4 text-white flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-xs">Genesys Live Queue</div>
            <div className="flex items-center gap-2 mt-0.5">
              {connectionStatus?.status === 'connected' ? (
                <span className="flex items-center gap-0.5 text-white/80 text-[9px] font-medium">
                  <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-white/80 text-[9px] font-medium">
                  <span className="w-1 h-1 bg-red-400 rounded-full" />
                  {connectionStatus?.error || 'Disconnected'}
                </span>
              )}
              {/* Channel Counts - Ultra Compact Pills */}
              <div className="flex items-center gap-1">
                {(() => {
                  const voiceCount = conversations.filter(c => c.mediaType === 'call' || c.mediaType === 'voice').length;
                  const chatCount = conversations.filter(c => c.mediaType === 'chat' || c.mediaType === 'message').length;
                  const emailCount = conversations.filter(c => c.mediaType === 'email').length;
                  return (
                    <>
                      {voiceCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-blue-500/30 text-white text-[8px] font-bold rounded-full border border-blue-400/50">
                          V:{voiceCount}
                        </span>
                      )}
                      {chatCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-emerald-500/30 text-white text-[8px] font-bold rounded-full border border-emerald-400/50">
                          C:{chatCount}
                        </span>
                      )}
                      {emailCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-purple-500/30 text-white text-[8px] font-bold rounded-full border border-purple-400/50">
                          E:{emailCount}
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {lastSync && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/10 rounded border border-white/20">
              <span className="relative flex h-1 w-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1 w-1 bg-green-400" />
              </span>
              <span className="text-white text-[8px] font-semibold">
                {formatTime(lastSync)}
              </span>
            </div>
          )}
          <button
            onClick={loadConversations}
            disabled={loading}
            className="p-1 rounded bg-white/20 hover:bg-white/30 text-white transition-all disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Ultra Compact Status Bar */}
      <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-gray-600 dark:text-gray-400 font-semibold text-[9px]">Active:</span>
            <span className="font-bold text-gray-900 dark:text-white text-[9px]">{conversations.length}</span>
          </div>
          {newConversations.size > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 rounded-full"
            >
              <span className="relative flex h-1 w-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500" />
              </span>
              <span className="text-emerald-700 dark:text-emerald-300 font-bold text-[8px]">{newConversations.size} New</span>
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={async () => {
              const names = ['Sarah Mitchell', 'David Chen', 'Michael Rodriguez', 'Emily Johnson', 'James Wilson', 'Lisa Anderson', 'Christopher Lee', 'Amanda White'];
              const randomName = names[Math.floor(Math.random() * names.length)];
              const result = await createTestConversation({
                phoneNumber: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
                customerName: randomName,
              });
              if (result.success) {
                loadConversations();
                if (autoProcess && onSelectConversation) {
                  setTimeout(() => {
                    onSelectConversation(result.conversation);
                  }, 500);
                }
              }
            }}
            className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] text-white rounded text-[9px] font-bold hover:from-[#4A4A4A] hover:to-[#666666] transition-all shadow-sm"
            title="Simulate a mobile call coming into Genesys"
          >
            <Phone className="w-2.5 h-2.5" />
            Simulate
          </button>
          {/* Auto-process toggle */}
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={autoProcess}
              onChange={(e) => {
                const value = e.target.checked;
                setAutoProcess(value);
                localStorage.setItem('agenticSupport.autoProcessGenesys', value.toString());
              }}
              className="w-3 h-3 rounded border-gray-300 text-[#2E2E2E] focus:ring-[#2E2E2E]"
            />
            <span className="text-gray-600 dark:text-gray-400 font-semibold text-[9px]">Auto</span>
          </label>
        </div>
      </div>

      {/* Error Message - Professional */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border-b-2 border-red-200 dark:border-red-800"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">
                Connection Error
              </div>
              <div className="text-xs text-red-700 dark:text-red-400 whitespace-pre-line">
                {error}
              </div>
              {error.includes('credentials') && (
                <div className="mt-2 text-[10px] text-red-600 dark:text-red-400">
                  💡 Go to Admin → CCAS Configuration to update your Genesys credentials
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Ultra Compact Conversations List - Pill Style */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading && conversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mx-auto mb-3"
              >
                <RefreshCw className="w-8 h-8 text-[#2E2E2E] dark:text-gray-400" />
              </motion.div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">Loading queue...</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Connecting to Genesys Cloud</p>
            </div>
          </motion.div>
        ) : conversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center py-12"
          >
            <div className="text-center max-w-xs">
              <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">No active conversations</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">
                {error ? 'Check your Genesys configuration' : 'Active conversations will appear here in real-time'}
              </p>
              {!error && (
                <button
                  onClick={async () => {
                    const names = ['Sarah Mitchell', 'David Chen', 'Michael Rodriguez', 'Emily Johnson', 'James Wilson', 'Lisa Anderson'];
                    const randomName = names[Math.floor(Math.random() * names.length)];
                    // Let createTestConversation randomly select from HP scenarios
                    const result = await createTestConversation({
                      phoneNumber: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
                      customerName: randomName,
                      // No transcript - will randomly select from HP scenarios
                    });
                    if (result.success) {
                      loadConversations();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] text-white rounded-lg text-[10px] font-semibold hover:from-[#4A4A4A] hover:to-[#666666] transition-all shadow-sm"
                >
                  <Phone className="w-3 h-3" />
                  Simulate Call
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          conversations.map((conversation) => {
            const Icon = getChannelIcon(conversation);
            const colorClass = getChannelColor(conversation);
            const isSelected = selectedConversation?.id === conversation.id;
            const isNew = newConversations.has(conversation.id);
            const customerName = conversation.participants?.[0]?.name || conversation.participants?.[0]?.address || 'Unknown Customer';
            const source = conversation.mediaType === 'call' || conversation.mediaType === 'voice' ? 'from mobile' : 
                          conversation.mediaType === 'chat' || conversation.mediaType === 'message' ? 'from web' : 
                          conversation.mediaType === 'email' ? 'from email' : 'from Genesys';

            return (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: isNew ? [1, 1.01, 1] : 1,
                }}
                transition={{ 
                  scale: { duration: 0.2, repeat: isNew ? 1 : 0 }
                }}
                className={`group rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#2E2E2E] text-white border-[#2E2E2E] shadow-md'
                    : isNew
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                {/* Ultra Compact Pill Row */}
                <div className="flex items-center gap-1.5 px-2 py-1.5">
                  {/* Channel Icon */}
                  <div className={`p-1 rounded flex-shrink-0 ${isSelected ? 'bg-white/20' : colorClass}`}>
                    <Icon className={`w-3 h-3 ${isSelected ? 'text-white' : ''}`} />
                  </div>
                  
                  {/* Customer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-[10px] font-bold truncate ${isSelected ? 'text-white' : isNew ? 'text-emerald-900 dark:text-emerald-300' : 'text-gray-900 dark:text-white'}`}>
                        {customerName}
                      </span>
                      {isNew && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-0.5 py-0 bg-emerald-500 text-white text-[7px] font-bold rounded"
                        >
                          NEW
                        </motion.span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-[8px] ${isSelected ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                        {source}
                      </span>
                      <span className={`text-[8px] ${isSelected ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}`}>
                        • {formatDuration(conversation.startTime)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {isSelected ? (
                      <span className="px-1.5 py-0.5 bg-white/20 text-white text-[8px] font-bold rounded-full">
                        Processing
                      </span>
                    ) : (
                      <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${
                        isNew 
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        Queue
                      </span>
                    )}
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
});

export default GenesysConversationsPanel;
