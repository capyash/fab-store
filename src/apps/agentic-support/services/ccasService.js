/**
 * CCAS (Contact Center as a Service) Configuration Service
 * Supports multiple CCAS providers: Genesys, FreeSWITCH, Google CCAI
 * Author: Vinod Kumar V (VKV)
 */

// CCAS provider configuration (in production, this would come from settings/API)
const CCAS_CONFIG = {
  provider: localStorage.getItem("agenticSupport.ccasProvider") || "genesys", // genesys, freeswitch, google-ccai
  genesys: {
    orgName: localStorage.getItem("agenticSupport.genesys.orgName") || "tp-ctss42",
    clientId: localStorage.getItem("agenticSupport.genesys.clientId") || "",
    clientSecret: localStorage.getItem("agenticSupport.genesys.clientSecret") || "",
    apiEndpoint: localStorage.getItem("agenticSupport.genesys.apiEndpoint") || "https://api.usw2.pure.cloud",
    region: localStorage.getItem("agenticSupport.genesys.region") || "usw2",
    oauthEndpoint: localStorage.getItem("agenticSupport.genesys.oauthEndpoint") || "https://login.usw2.pure.cloud/oauth/token",
    environment: localStorage.getItem("agenticSupport.genesys.environment") || "usw2.pure.cloud",
  },
  freeswitch: {
    sipEndpoint: localStorage.getItem("agenticSupport.freeswitch.sipEndpoint") || "sip.yourcompany.com:5060",
    version: localStorage.getItem("agenticSupport.freeswitch.version") || "v1.10.7",
    protocol: localStorage.getItem("agenticSupport.freeswitch.protocol") || "SIP/WebRTC",
    apiEndpoint: localStorage.getItem("agenticSupport.freeswitch.apiEndpoint") || "http://localhost:8080",
  },
  "google-ccai": {
    projectId: localStorage.getItem("agenticSupport.google-ccai.projectId") || "",
    region: localStorage.getItem("agenticSupport.google-ccai.region") || "us-central1",
    apiEndpoint: localStorage.getItem("agenticSupport.google-ccai.apiEndpoint") || "https://contactcenterai.googleapis.com",
    serviceAccountJson: localStorage.getItem("agenticSupport.google-ccai.serviceAccountJson") || "",
    location: localStorage.getItem("agenticSupport.google-ccai.location") || "us",
  },
};

/**
 * Get current CCAS configuration
 * @returns {Object} Current CCAS configuration
 */
export function getCCASConfig() {
  return CCAS_CONFIG;
}

/**
 * Get current CCAS provider
 * @returns {string} Current provider name (genesys, freeswitch, google-ccai)
 */
export function getCurrentProvider() {
  return CCAS_CONFIG.provider || "genesys";
}

/**
 * Update CCAS provider configuration
 * @param {string} provider - Provider name (genesys, freeswitch, google-ccai)
 * @param {Object} config - Provider-specific configuration object
 */
export function updateCCASConfig(provider, config) {
  if (!provider || !["genesys", "freeswitch", "google-ccai"].includes(provider)) {
    throw new Error(`Invalid provider: ${provider}. Must be one of: genesys, freeswitch, google-ccai`);
  }

  // Update provider in localStorage
  localStorage.setItem("agenticSupport.ccasProvider", provider);
  CCAS_CONFIG.provider = provider;

  // Update provider-specific configuration
  if (config) {
    Object.keys(config).forEach((key) => {
      const storageKey = `agenticSupport.${provider}.${key}`;
      localStorage.setItem(storageKey, config[key]);
      if (!CCAS_CONFIG[provider]) {
        CCAS_CONFIG[provider] = {};
      }
      CCAS_CONFIG[provider][key] = config[key];
    });
  }

  // Reload config
  return CCAS_CONFIG;
}

/**
 * Get provider-specific configuration
 * @param {string} provider - Provider name
 * @returns {Object} Provider configuration
 */
export function getProviderConfig(provider) {
  return CCAS_CONFIG[provider] || {};
}

/**
 * Validate provider configuration
 * @param {string} provider - Provider name
 * @param {Object} config - Configuration to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateProviderConfig(provider, config) {
  const errors = [];

  switch (provider) {
    case "genesys":
      if (!config.orgName || config.orgName.trim() === "") {
        errors.push("Organization name is required");
      }
      if (!config.apiEndpoint || config.apiEndpoint.trim() === "") {
        errors.push("API endpoint is required");
      }
      if (!config.region || config.region.trim() === "") {
        errors.push("Region is required");
      }
      break;

    case "freeswitch":
      if (!config.sipEndpoint || config.sipEndpoint.trim() === "") {
        errors.push("SIP endpoint is required");
      }
      break;

    case "google-ccai":
      if (!config.projectId || config.projectId.trim() === "") {
        errors.push("Project ID is required");
      }
      if (!config.region || config.region.trim() === "") {
        errors.push("Region is required");
      }
      break;

    default:
      errors.push(`Unknown provider: ${provider}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
