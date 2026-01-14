import { useState, useEffect } from 'react';
import { Activity, Phone, MessageSquare, Radio, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCCASConfig, getCurrentProvider } from '../services/ccasService';
import { getStats, getChannels, getConnectionStatus } from '../services/genesysService';

export default function CCASConnectionPanel({ provider }) {
  // Use provider from props, or get from config service
  const currentProvider = provider || getCurrentProvider();
  const ccasConfig = getCCASConfig();
  
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [connectionError, setConnectionError] = useState(null);
  const [uptime, setUptime] = useState(0);
  const [stats, setStats] = useState({
    activeCalls: 0,
    queuedMessages: 0,
    throughput: 0,
    latency: 12
  });
  const [channels, setChannels] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Load real stats for Genesys, mock for others - faster polling for real-time
  useEffect(() => {
    if (currentProvider === 'genesys') {
      loadGenesysStats();
      const interval = setInterval(loadGenesysStats, 5000); // Refresh every 5 seconds for real-time updates
      return () => clearInterval(interval);
    } else {
      // Simulate real-time stats for other providers
      const interval = setInterval(() => {
        setUptime(prev => prev + 1);
        setStats(prev => ({
          ...prev,
          throughput: Math.floor(Math.random() * 50) + 150,
          latency: Math.floor(Math.random() * 10) + 8
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentProvider]);

  // Load connection status for Genesys - check immediately and periodically
  useEffect(() => {
    if (currentProvider === 'genesys') {
      // Check immediately
      loadConnectionStatus();
      // Then check every 30 seconds
      const interval = setInterval(loadConnectionStatus, 30000);
      return () => clearInterval(interval);
    } else {
      // For non-Genesys, set to connected
      setConnectionStatus('connected');
      setConnectionError(null);
    }
  }, [currentProvider]);

  const loadGenesysStats = async () => {
    try {
      const [statsData, channelsData] = await Promise.all([
        getStats(),
        getChannels(),
      ]);
      
      setStats({
        activeCalls: statsData.activeCalls || 0,
        queuedMessages: statsData.queuedMessages || 0,
        throughput: statsData.throughput || 0,
        latency: statsData.latency || 12,
      });
      
      setChannels(channelsData || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading Genesys stats:', error);
      // Keep existing stats on error
    }
  };

  const loadConnectionStatus = async () => {
    try {
      setConnectionStatus('connecting');
      setConnectionError(null);
      const status = await getConnectionStatus();
      
      if (status.status === 'connected') {
        setConnectionStatus('connected');
        setConnectionError(null);
      } else if (status.status === 'error' || status.error) {
        setConnectionStatus('error');
        // Format error message for better display
        let errorMsg = status.error || 'Connection failed';
        if (errorMsg.includes('CORS') || errorMsg.includes('Failed to fetch')) {
          errorMsg = 'CORS Error: Browser blocking request. See console for details.';
        }
        setConnectionError(errorMsg);
      } else {
        setConnectionStatus('disconnected');
        setConnectionError(status.error || 'Not connected');
      }
    } catch (error) {
      console.error('Error loading connection status:', error);
      setConnectionStatus('error');
      let errorMsg = error.message || 'Failed to connect';
      if (errorMsg.includes('CORS') || errorMsg.includes('Failed to fetch')) {
        errorMsg = 'CORS Error: Browser blocking request. See console for details.';
      }
      setConnectionError(errorMsg);
    }
  };

  // Get provider-specific configuration from service
  const getProviderConfig = () => {
    const providerConfig = ccasConfig[currentProvider] || {};
    
    switch (currentProvider) {
      case 'genesys':
        return {
          name: 'Genesys Cloud',
          logo: '🔷',
          endpoint: providerConfig.apiEndpoint || 'api.usw2.pure.cloud',
          version: 'PureCloud API v2',
          protocol: 'REST API / WebSocket',
          orgName: providerConfig.orgName || 'tp-ctss42',
          region: providerConfig.region || 'usw2',
        };
      
      case 'freeswitch':
        return {
          name: 'FreeSWITCH',
          logo: '🔷',
          endpoint: providerConfig.sipEndpoint || 'sip.yourcompany.com:5060',
          version: providerConfig.version || 'v1.10.7',
          protocol: providerConfig.protocol || 'SIP/WebRTC',
          region: 'US-West-2',
        };
      
      case 'google-ccai':
        return {
          name: 'Google Contact Center AI',
          logo: '📞',
          endpoint: providerConfig.apiEndpoint || 'contactcenterai.googleapis.com',
          version: 'API v1',
          protocol: 'gRPC / REST API',
          projectId: providerConfig.projectId || '',
          region: providerConfig.region || 'us-central1',
        };
      
      default:
        return {
          name: 'Unknown Provider',
          logo: '❓',
          endpoint: 'N/A',
          version: 'N/A',
          protocol: 'N/A',
          region: 'N/A',
        };
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);
    
    if (diffSeconds < 60) {
      return `${diffSeconds}s ago`;
    } else if (diffSeconds < 3600) {
      return `${Math.floor(diffSeconds / 60)}m ago`;
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const config = getProviderConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden h-full flex flex-col"
    >
      {/* Header - Compact */}
      <div className="bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] px-3 py-2 flex items-center justify-between border-b-2 border-gray-300">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="w-3 h-3 text-white" />
          </motion.div>
          <div>
            <div className="text-white font-bold text-xs">{config.name} CCAS</div>
            <div className="text-white/80 text-[9px] font-medium">{config.version}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <motion.div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold shadow-lg ${
              connectionStatus === 'connected'
                ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white'
                : connectionStatus === 'error'
                ? 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 text-white'
            }`}
            animate={{ scale: connectionStatus === 'connected' ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 2, repeat: connectionStatus === 'connected' ? Infinity : 0 }}
          >
            <div className={`w-1.5 h-1.5 rounded-full bg-white ${connectionStatus === 'connected' ? 'animate-pulse' : connectionStatus === 'connecting' ? 'animate-spin' : ''}`} />
            {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'error' ? 'Error' : connectionStatus === 'disconnected' ? 'Disconnected' : 'Connecting...'}
          </motion.div>
        </div>
      </div>
      
      {/* Connection Error Display - Compact */}
      {connectionStatus === 'error' && connectionError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-2.5 py-2 bg-red-50 dark:bg-red-900/20 border-b-2 border-red-200 dark:border-red-800 max-h-24 overflow-y-auto"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-[10px] font-bold text-red-900 dark:text-red-300 mb-1">Connection Error</div>
              <div className="whitespace-pre-line text-[9px] text-red-700 dark:text-red-400">{connectionError.substring(0, 100)}...</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Connection Summary - Ultra Compact */}
      <div className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
        <div className={`grid gap-1 text-[9px] ${currentProvider === 'genesys' ? 'grid-cols-2' : 'grid-cols-2'}`}>
          <div>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Endpoint:</span>
            <div className="font-mono font-bold text-gray-900 dark:text-white text-[8px] truncate">{config.endpoint}</div>
          </div>
          {currentProvider === 'genesys' && (
            <div>
              <span className="text-gray-600 dark:text-gray-400 font-semibold">Org:</span>
              <div className="font-mono font-bold text-gray-900 dark:text-white text-[8px]">{config.orgName}</div>
            </div>
          )}
          <div>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Uptime:</span>
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-[8px]">
              {currentProvider === 'genesys' && lastUpdate 
                ? `${Math.floor((new Date() - lastUpdate) / 1000 / 60)}m`
                : `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`
              }
            </div>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Region:</span>
            <div className="font-mono font-bold text-gray-900 dark:text-white text-[8px]">{config.region}</div>
          </div>
        </div>
      </div>

      {/* Real-time Stats - Ultra Compact */}
      <div className="p-2 bg-white dark:bg-gray-900 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1">
            <span className="relative flex h-1 w-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-1 w-1 bg-green-500" />
            </span>
            <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300">Live Stats</span>
          </div>
          {lastUpdate && (
            <span className="text-[8px] text-gray-500 dark:text-gray-400">
              {formatTime(lastUpdate)}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5 mb-1.5">
          <motion.div 
            className="text-center p-1.5 bg-white dark:bg-gray-900 rounded border border-blue-300 dark:border-blue-700 shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.activeCalls}</div>
            <div className="text-[8px] text-gray-700 dark:text-gray-300 mt-0.5 font-semibold">Active</div>
          </motion.div>
          <motion.div 
            className="text-center p-1.5 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-lg font-bold text-gray-700 dark:text-gray-300">{stats.queuedMessages}</div>
            <div className="text-[8px] text-gray-700 dark:text-gray-300 mt-0.5 font-semibold">Queue</div>
          </motion.div>
          <motion.div 
            className="text-center p-1.5 bg-white dark:bg-gray-900 rounded border border-amber-300 dark:border-amber-700 shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{stats.throughput}</div>
            <div className="text-[8px] text-gray-700 dark:text-gray-300 mt-0.5 font-semibold">Msg/s</div>
          </motion.div>
          <motion.div 
            className="text-center p-1.5 bg-white dark:bg-gray-900 rounded border border-emerald-300 dark:border-emerald-700 shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.latency}ms</div>
            <div className="text-[8px] text-gray-700 dark:text-gray-300 mt-0.5 font-semibold">Latency</div>
          </motion.div>
        </div>

        {/* Channel Status - Ultra Compact, Scrollable */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-1.5">
          <div className="text-[9px] font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1">
            <Activity className="w-2.5 h-2.5" />
            Channels
          </div>
          <div className="space-y-0.5 max-h-16 overflow-y-auto">
            {(currentProvider === 'genesys' && channels.length > 0 ? channels : [
              { id: 'voice', name: currentProvider === 'google-ccai' ? 'Voice (Dialogflow)' : currentProvider === 'genesys' ? 'Voice (Genesys)' : 'Voice (SIP)', status: 'active', type: 'voice' },
              { id: 'sms', name: 'SMS/WhatsApp', status: 'active', type: 'messaging' },
              ...(currentProvider === 'genesys' || currentProvider === 'google-ccai' 
                ? [{ id: 'email', name: 'Email/Chat', status: 'active', type: 'email' }]
                : [{ id: 'websocket', name: 'WebSocket', status: 'active', type: 'websocket' }]
              ),
            ]).map((channel, index) => {
              const isActive = channel.status === 'active';
              const Icon = channel.type === 'voice' ? Phone : channel.type === 'email' ? Mail : channel.type === 'messaging' ? MessageSquare : Radio;
              
              return (
                <motion.div 
                  key={channel.id}
                  className={`flex items-center justify-between text-[9px] bg-white border rounded-lg px-1.5 py-1 shadow-sm ${
                    isActive ? 'border-green-200' : 'border-gray-200'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 1) * 0.1 }}
                >
                  <div className="flex items-center gap-1">
                    <Icon className={`w-3 h-3 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="font-bold text-gray-900 text-[9px] truncate">{channel.name}</span>
                  </div>
                  <span className={`font-bold flex items-center gap-0.5 ${
                    isActive ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    <span className="text-[8px]">{isActive ? 'On' : 'Off'}</span>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

