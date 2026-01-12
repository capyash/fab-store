import { useState, useEffect } from 'react';
import { Activity, Phone, MessageSquare, Radio, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCCASConfig, getCurrentProvider } from '../services/ccasService';
import { getStats, getChannels, getConnectionStatus } from '../services/genesysService';

export default function CCASConnectionPanel({ provider }) {
  // Use provider from props, or get from config service
  const currentProvider = provider || getCurrentProvider();
  const ccasConfig = getCCASConfig();
  
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [uptime, setUptime] = useState(0);
  const [stats, setStats] = useState({
    activeCalls: 0,
    queuedMessages: 0,
    throughput: 0,
    latency: 12
  });
  const [channels, setChannels] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Load real stats for Genesys, mock for others
  useEffect(() => {
    if (currentProvider === 'genesys') {
      loadGenesysStats();
      const interval = setInterval(loadGenesysStats, 10000); // Refresh every 10 seconds
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

  // Load connection status for Genesys
  useEffect(() => {
    if (currentProvider === 'genesys') {
      loadConnectionStatus();
      const interval = setInterval(loadConnectionStatus, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
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
      const status = await getConnectionStatus();
      setConnectionStatus(status.status || 'connected');
    } catch (error) {
      console.error('Error loading connection status:', error);
      setConnectionStatus('error');
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

  const config = getProviderConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden h-full flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] px-4 py-3 flex items-center justify-between border-b-2 border-gray-300">
        <div className="flex items-center gap-2.5">
          <motion.div
            className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="w-3.5 h-3.5 text-white" />
          </motion.div>
          <div>
            <div className="text-white font-bold text-sm">{config.name} CCAS</div>
            <div className="text-white/80 text-[10px] font-medium">{config.version}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold shadow-lg ${
              connectionStatus === 'connected'
                ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white'
                : connectionStatus === 'error'
                ? 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 text-white'
            }`}
            animate={{ scale: connectionStatus === 'connected' ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 2, repeat: connectionStatus === 'connected' ? Infinity : 0 }}
          >
            <div className={`w-2 h-2 rounded-full bg-white ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`} />
            {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'error' ? 'Error' : 'Connecting...'}
          </motion.div>
        </div>
      </div>

      {/* Connection Summary */}
      <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-700">
        <div className={`grid gap-2 text-xs ${currentProvider === 'genesys' ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <div>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Endpoint:</span>
            <div className="font-mono font-bold text-gray-900 dark:text-white text-[10px]">{config.endpoint}</div>
          </div>
          {currentProvider === 'genesys' && (
            <div>
              <span className="text-gray-600 dark:text-gray-400 font-semibold">Org Name:</span>
              <div className="font-mono font-bold text-gray-900 dark:text-white text-[10px]">{config.orgName}</div>
            </div>
          )}
          <div>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Uptime:</span>
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {currentProvider === 'genesys' && lastUpdate 
                ? `${Math.floor((new Date() - lastUpdate) / 1000 / 60)}m`
                : `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`
              }
            </div>
          </div>
          <div className={currentProvider === 'genesys' ? 'text-right' : 'text-right'}>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Region:</span>
            <div className="font-mono font-bold text-gray-900 dark:text-white">{config.region}</div>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="p-4 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-4 gap-3">
          <motion.div 
            className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.activeCalls}</div>
            <div className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-semibold">Active</div>
          </motion.div>
          <motion.div 
            className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-300 dark:border-gray-700 shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.queuedMessages}</div>
            <div className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-semibold">Queue</div>
          </motion.div>
          <motion.div 
            className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border-2 border-amber-300 dark:border-amber-700 shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.throughput}</div>
            <div className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-semibold">Msg/s</div>
          </motion.div>
          <motion.div 
            className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border-2 border-emerald-300 dark:border-emerald-700 shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.latency}ms</div>
            <div className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-semibold">Latency</div>
          </motion.div>
        </div>
      </div>

      {/* Channel Status */}
      <div className="px-4 pb-4 flex-1">
        <div className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg p-3 h-full">
          <div className="text-xs font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            Channel Status
          </div>
          <div className="space-y-1.5">
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
                  className={`flex items-center justify-between text-xs bg-white border-2 rounded-lg px-2.5 py-2 shadow-sm ${
                    isActive ? 'border-green-200' : 'border-gray-200'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 1) * 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="font-bold text-gray-900">{channel.name}</span>
                  </div>
                  <span className={`font-bold flex items-center gap-1 ${
                    isActive ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {isActive ? 'Active' : 'Inactive'}
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

