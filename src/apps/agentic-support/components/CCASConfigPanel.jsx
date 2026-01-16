import { useState, useEffect } from 'react';
import { Shield, Server, Globe, Zap, Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCCASConfig, updateCCASConfig, validateProviderConfig, getCurrentProvider, quickSetupGenesys } from '../services/ccasService';

export default function CCASConfigPanel() {
 const [selectedProvider, setSelectedProvider] = useState(getCurrentProvider());
 const [config, setConfig] = useState({});
 const [validationErrors, setValidationErrors] = useState({});
 const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'success', 'error'

 // Load current configuration on mount
 useEffect(() => {
  loadConfiguration();
 }, [selectedProvider]);

 const loadConfiguration = () => {
  const ccasConfig = getCCASConfig();
  setConfig(ccasConfig[selectedProvider] || {});
  setValidationErrors({});
  setSaveStatus(null);
 };

 const handleProviderChange = (provider) => {
  setSelectedProvider(provider);
  setSaveStatus(null);
  setValidationErrors({});
 };

 const handleConfigChange = (key, value) => {
  setConfig(prev => ({
   ...prev,
   [key]: value
  }));
  // Clear validation error for this field
  if (validationErrors[key]) {
   setValidationErrors(prev => {
    const newErrors = { ...prev };
    delete newErrors[key];
    return newErrors;
   });
  }
 };

 const handleSave = () => {
  // Validate configuration
  const validation = validateProviderConfig(selectedProvider, config);
  
  if (!validation.valid) {
   const errorMap = {};
   validation.errors.forEach(error => {
    // Map error messages to field names (simplified mapping)
    if (error.includes('Organization name')) errorMap.orgName = error;
    else if (error.includes('API endpoint')) errorMap.apiEndpoint = error;
    else if (error.includes('Region')) errorMap.region = error;
    else if (error.includes('SIP endpoint')) errorMap.sipEndpoint = error;
    else if (error.includes('Project ID')) errorMap.projectId = error;
   });
   setValidationErrors(errorMap);
   setSaveStatus('error');
   return;
  }

  setSaveStatus('saving');
  
  try {
   updateCCASConfig(selectedProvider, config);
   setSaveStatus('success');
   setTimeout(() => setSaveStatus(null), 3000);
  } catch (error) {
   console.error('Failed to save CCAS configuration:', error);
   setSaveStatus('error');
  }
 };

 const handleQuickSetup = () => {
  // Quick setup with provided credentials
  const credentials = {
   clientId: 'ae284fa3-a0c9-4451-8182-65dc522ce479',
   clientSecret: '5n2C2JvmfYs2Ns00rtoi_Ugu3kOXSPCmhKbV8X4qjCY',
   orgName: 'tp-ctss42',
   region: 'usw2',
   apiEndpoint: 'https://api.usw2.pure.cloud',
   oauthEndpoint: 'https://login.usw2.pure.cloud/oauth/token',
   environment: 'usw2.pure.cloud',
  };
  
  quickSetupGenesys(credentials);
  loadConfiguration();
  setSaveStatus('success');
  setTimeout(() => setSaveStatus(null), 3000);
 };

 const renderGenesysConfig = () => (
  <div className="space-y-3">
   <div className="bg-gradient-to-br from-neutral01 to-neutral01 rounded-lg p-3 border-2 border-neutral01">
    <div className="flex items-center justify-between mb-2">
     <div className="flex items-center gap-1.5">
      <Shield className="w-4 h-4 text-neutral02" />
      <span className="text-text01 font-bold text-xs">Genesys Cloud Configuration</span>
     </div>
     <button
      onClick={handleQuickSetup}
      className="flex items-center gap-1.5 px-2 py-1 bg-neutral02 text-white rounded text-[10px] font-bold hover:bg-neutral02 transition-all"
      title="Quick setup with provided credentials"
     >
      <RefreshCw className="w-3 h-3" />
      Quick Setup
     </button>
    </div>
    
    <div className="space-y-2">
     <div>
      <label className="text-[10px] font-semibold text-text01 mb-1 block">Organization Name *</label>
      <input
       type="text"
       value={config.orgName || ''}
       onChange={(e) => handleConfigChange('orgName', e.target.value)}
       placeholder="tp-ctss42"
       className={`w-full text-xs px-2 py-1.5 border-2 rounded ${
        validationErrors.orgName 
         ? 'border-error03 bg-error01' 
         : 'border-stroke01 bg-white'
       } focus:ring-2 focus:ring-neutral010 focus:border-neutral010 outline-none`}
      />
      {validationErrors.orgName && (
       <p className="text-[9px] text-error03 mt-0.5 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {validationErrors.orgName}
       </p>
      )}
     </div>

     <div>
      <label className="text-[10px] font-semibold text-text01 mb-1 block">Client ID</label>
      <input
       type="text"
       value={config.clientId || ''}
       onChange={(e) => handleConfigChange('clientId', e.target.value)}
       placeholder="Enter Client ID"
       className="w-full text-xs px-2 py-1.5 border-2 border-stroke01 bg-white rounded focus:ring-2 focus:ring-neutral010 focus:border-neutral010 outline-none"
      />
     </div>

     <div>
      <label className="text-[10px] font-semibold text-text01 mb-1 block">Client Secret</label>
      <input
       type="password"
       value={config.clientSecret || ''}
       onChange={(e) => handleConfigChange('clientSecret', e.target.value)}
       placeholder="Enter Client Secret"
       className="w-full text-xs px-2 py-1.5 border-2 border-stroke01 bg-white rounded focus:ring-2 focus:ring-neutral010 focus:border-neutral010 outline-none"
      />
     </div>

     <div>
      <label className="text-[10px] font-semibold text-text01 mb-1 block">API Endpoint *</label>
      <input
       type="text"
       value={config.apiEndpoint || ''}
       onChange={(e) => handleConfigChange('apiEndpoint', e.target.value)}
       placeholder="https://api.mypurecloud.com"
       className={`w-full text-xs px-2 py-1.5 border-2 rounded ${
        validationErrors.apiEndpoint 
         ? 'border-error03 bg-error01' 
         : 'border-stroke01 bg-white'
       } focus:ring-2 focus:ring-neutral010 focus:border-neutral010 outline-none`}
      />
      {validationErrors.apiEndpoint && (
       <p className="text-[9px] text-error03 mt-0.5 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {validationErrors.apiEndpoint}
       </p>
      )}
     </div>

     <div className="grid grid-cols-2 gap-2">
      <div>
       <label className="text-[10px] font-semibold text-text01 mb-1 block">Region *</label>
       <select
        value={config.region || ''}
        onChange={(e) => handleConfigChange('region', e.target.value)}
        className={`w-full text-xs px-2 py-1.5 border-2 rounded ${
         validationErrors.region 
          ? 'border-error03 bg-error01' 
          : 'border-stroke01 bg-white'
        } focus:ring-2 focus:ring-neutral010 focus:border-neutral010 outline-none`}
       >
        <option value="">Select Region</option>
        <option value="use1">US East 1 (use1)</option>
        <option value="usw2">US West 2 (usw2)</option>
        <option value="euw1">EU West 1 (euw1)</option>
        <option value="aps2">AP Southeast 2 (aps2)</option>
       </select>
      </div>

      <div>
       <label className="text-[10px] font-semibold text-text01 mb-1 block">Environment</label>
       <input
        type="text"
        value={config.environment || ''}
        onChange={(e) => handleConfigChange('environment', e.target.value)}
        placeholder="mypurecloud.com"
        className="w-full text-xs px-2 py-1.5 border-2 border-stroke01 bg-white rounded focus:ring-2 focus:ring-neutral010 focus:border-neutral010 outline-none"
       />
      </div>
     </div>

     <div>
      <label className="text-[10px] font-semibold text-text01 mb-1 block">OAuth Endpoint</label>
      <input
       type="text"
       value={config.oauthEndpoint || ''}
       onChange={(e) => handleConfigChange('oauthEndpoint', e.target.value)}
       placeholder="https://login.mypurecloud.com/oauth/token"
       className="w-full text-xs px-2 py-1.5 border-2 border-stroke01 bg-white rounded focus:ring-2 focus:ring-neutral010 focus:border-neutral010 outline-none"
      />
     </div>
    </div>
   </div>
  </div>
 );

 const renderFreeSwitchConfig = () => (
  <div className="space-y-3">
   <div className="bg-gradient-to-br from-pinkTP/10 to-neutral01 rounded-lg p-3 border-2 border-pinkTP/40">
    <div className="flex items-center gap-1.5 mb-2">
     <Server className="w-4 h-4 text-pinkTP" />
     <span className="text-text01 font-bold text-xs">FreeSWITCH Configuration</span>
    </div>
    
    <div className="space-y-2">
     <div>
      <label className="text-[10px] font-semibold text-text01 mb-1 block">SIP Endpoint *</label>
      <input
       type="text"
       value={config.sipEndpoint || ''}
       onChange={(e) => handleConfigChange('sipEndpoint', e.target.value)}
       placeholder="sip.yourcompany.com:5060"
       className={`w-full text-xs px-2 py-1.5 border-2 rounded ${
        validationErrors.sipEndpoint 
         ? 'border-error03 bg-error01' 
         : 'border-stroke01 bg-white'
       } focus:ring-2 focus:ring-pinkTP/100 focus:border-pinkTP/100 outline-none`}
      />
      {validationErrors.sipEndpoint && (
       <p className="text-[9px] text-error03 mt-0.5 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {validationErrors.sipEndpoint}
       </p>
      )}
     </div>

     <div className="grid grid-cols-2 gap-2">
      <div>
       <label className="text-[10px] font-semibold text-text01 mb-1 block">Version</label>
       <input
        type="text"
        value={config.version || ''}
        onChange={(e) => handleConfigChange('version', e.target.value)}
        placeholder="v1.10.7"
        className="w-full text-xs px-2 py-1.5 border-2 border-stroke01 bg-white rounded focus:ring-2 focus:ring-pinkTP/100 focus:border-pinkTP/100 outline-none"
       />
      </div>

      <div>
       <label className="text-[10px] font-semibold text-text01 mb-1 block">Protocol</label>
       <select
        value={config.protocol || ''}
        onChange={(e) => handleConfigChange('protocol', e.target.value)}
        className="w-full text-xs px-2 py-1.5 border-2 border-stroke01 bg-white rounded focus:ring-2 focus:ring-pinkTP/100 focus:border-pinkTP/100 outline-none"
       >
        <option value="SIP/WebRTC">SIP/WebRTC</option>
        <option value="SIP">SIP</option>
        <option value="IAX2">IAX2</option>
       </select>
      </div>
     </div>

     <div>
      <label className="text-[10px] font-semibold text-text01 mb-1 block">API Endpoint</label>
      <input
       type="text"
       value={config.apiEndpoint || ''}
       onChange={(e) => handleConfigChange('apiEndpoint', e.target.value)}
       placeholder="http://localhost:8080"
       className="w-full text-xs px-2 py-1.5 border-2 border-stroke01 bg-white rounded focus:ring-2 focus:ring-pinkTP/100 focus:border-pinkTP/100 outline-none"
      />
     </div>
    </div>
   </div>
  </div>
 );

 const renderGoogleCCAIConfig = () => (
  <div className="space-y-3">
   <div className="bg-gradient-to-br from-success01 to-success01 rounded-lg p-3 border-2 border-success01">
    <div className="flex items-center gap-1.5 mb-2">
     <Globe className="w-4 h-4 text-success03" />
     <span className="text-text01 font-bold text-xs">Google Contact Center AI Configuration</span>
    </div>
    
    <div className="space-y-2">
     <div>
      <label className="text-[10px] font-semibold text-text01 mb-1 block">Project ID *</label>
      <input
       type="text"
       value={config.projectId || ''}
       onChange={(e) => handleConfigChange('projectId', e.target.value)}
       placeholder="your-project-id"
       className={`w-full text-xs px-2 py-1.5 border-2 rounded ${
        validationErrors.projectId 
         ? 'border-error03 bg-error01' 
         : 'border-stroke01 bg-white'
       } focus:ring-2 focus:ring-success010 focus:border-success010 outline-none`}
      />
      {validationErrors.projectId && (
       <p className="text-[9px] text-error03 mt-0.5 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {validationErrors.projectId}
       </p>
      )}
     </div>

     <div className="grid grid-cols-2 gap-2">
      <div>
       <label className="text-[10px] font-semibold text-text01 mb-1 block">Region *</label>
       <select
        value={config.region || ''}
        onChange={(e) => handleConfigChange('region', e.target.value)}
        className={`w-full text-xs px-2 py-1.5 border-2 rounded ${
         validationErrors.region 
          ? 'border-error03 bg-error01' 
          : 'border-stroke01 bg-white'
        } focus:ring-2 focus:ring-success010 focus:border-success010 outline-none`}
       >
        <option value="">Select Region</option>
        <option value="us-central1">US Central 1</option>
        <option value="us-east1">US East 1</option>
        <option value="us-west1">US West 1</option>
        <option value="europe-west1">Europe West 1</option>
        <option value="asia-east1">Asia East 1</option>
       </select>
      </div>

      <div>
       <label className="text-[10px] font-semibold text-text01 mb-1 block">Location</label>
       <select
        value={config.location || ''}
        onChange={(e) => handleConfigChange('location', e.target.value)}
        className="w-full text-xs px-2 py-1.5 border-2 border-stroke01 bg-white rounded focus:ring-2 focus:ring-success010 focus:border-success010 outline-none"
       >
        <option value="us">US</option>
        <option value="eu">EU</option>
        <option value="asia">Asia</option>
       </select>
      </div>
     </div>

     <div>
      <label className="text-[10px] font-semibold text-text01 mb-1 block">API Endpoint *</label>
      <input
       type="text"
       value={config.apiEndpoint || ''}
       onChange={(e) => handleConfigChange('apiEndpoint', e.target.value)}
       placeholder="https://contactcenterai.googleapis.com"
       className={`w-full text-xs px-2 py-1.5 border-2 rounded ${
        validationErrors.apiEndpoint 
         ? 'border-error03 bg-error01' 
         : 'border-stroke01 bg-white'
       } focus:ring-2 focus:ring-success010 focus:border-success010 outline-none`}
      />
      {validationErrors.apiEndpoint && (
       <p className="text-[9px] text-error03 mt-0.5 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {validationErrors.apiEndpoint}
       </p>
      )}
     </div>

     <div>
      <label className="text-[10px] font-semibold text-text01 mb-1 block">Service Account JSON</label>
      <textarea
       value={config.serviceAccountJson || ''}
       onChange={(e) => handleConfigChange('serviceAccountJson', e.target.value)}
       placeholder='{"type":"service_account", ...}'
       rows={4}
       className="w-full text-xs px-2 py-1.5 border-2 border-stroke01 bg-white rounded focus:ring-2 focus:ring-success010 focus:border-success010 outline-none resize-none font-mono"
      />
      <p className="text-[9px] text-text03 mt-0.5">Paste your Google Cloud service account JSON key</p>
     </div>
    </div>
   </div>
  </div>
 );

 return (
  <motion.div
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ delay: 0.3 }}
   className="bg-white border-2 border-stroke01 rounded-xl p-4 shadow-lg"
  >
   <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
     <Server className="w-5 h-5 text-buttonPrimary" />
     <h3 className="font-bold text-base text-text01">CCAS Configuration</h3>
    </div>
    
    <button
     onClick={handleSave}
     disabled={saveStatus === 'saving'}
     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
      saveStatus === 'success'
       ? 'bg-success010 text-white'
       : saveStatus === 'error'
       ? 'bg-error010 text-white'
       : 'bg-gradient-to-r from-buttonPrimary to-buttonPrimary-hover text-white hover:from-buttonPrimary-hover hover:to-buttonPrimary-active'
     } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
     {saveStatus === 'saving' ? (
      <>
       <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
       Saving...
      </>
     ) : saveStatus === 'success' ? (
      <>
       <CheckCircle2 className="w-4 h-4" />
       Saved
      </>
     ) : (
      <>
       <Save className="w-4 h-4" />
       Save Configuration
      </>
     )}
    </button>
   </div>

   {/* Provider Selection */}
   <div className="mb-4">
    <label className="text-xs font-bold text-text01 mb-2 block">Select CCAS Provider</label>
    <div className="grid grid-cols-3 gap-2">
     {[
      { id: 'genesys', label: 'Genesys Cloud', icon: '🔷' },
      { id: 'freeswitch', label: 'FreeSWITCH', icon: '🔷' },
      { id: 'google-ccai', label: 'Google CCAI', icon: '📞' },
     ].map((provider) => (
      <button
       key={provider.id}
       onClick={() => handleProviderChange(provider.id)}
       className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border-2 ${
        selectedProvider === provider.id
         ? 'bg-gradient-to-r from-buttonPrimary to-buttonPrimary-hover text-white border-buttonPrimary shadow-md'
         : 'bg-white text-text01 border-stroke01 hover:border-text03:border-text03'
       }`}
      >
       <span className="mr-1.5">{provider.icon}</span>
       {provider.label}
      </button>
     ))}
    </div>
   </div>

   {/* Provider-Specific Configuration */}
   <div className="mt-4">
    {selectedProvider === 'genesys' && renderGenesysConfig()}
    {selectedProvider === 'freeswitch' && renderFreeSwitchConfig()}
    {selectedProvider === 'google-ccai' && renderGoogleCCAIConfig()}
   </div>

   {saveStatus === 'error' && Object.keys(validationErrors).length > 0 && (
    <div className="mt-3 p-2 bg-error01 border-2 border-error01 rounded-lg">
     <p className="text-xs text-error02 font-semibold flex items-center gap-1">
      <AlertCircle className="w-3 h-3" />
      Please fix validation errors before saving
     </p>
    </div>
   )}
  </motion.div>
 );
}
