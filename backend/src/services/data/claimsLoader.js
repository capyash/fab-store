/**
 * Claims Data Loader
 * Loads claim data from the data files
 */

import { CLAIMS } from './claims.js';

/**
 * Get a claim by ID
 * @param {string} claimId - Claim ID
 * @returns {Promise<Object|null>} Claim object or null if not found
 */
export async function getClaimById(claimId) {
  // Simulate async database lookup
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const claim = CLAIMS.find(c => c.id === claimId);
  return claim || null;
}

/**
 * Get all claims with optional filters
 * @param {Object} filters - { status, search, page, pageSize }
 * @returns {Promise<Object>} { claims, total, page, pageSize, totalPages }
 */
export async function getAllClaims(filters = {}) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let filtered = [...CLAIMS];
  
  if (filters.status && filters.status !== 'All') {
    filtered = filtered.filter(c => c.status === filters.status);
  }
  
  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(c =>
      c.id.toLowerCase().includes(q) ||
      c.member.toLowerCase().includes(q) ||
      c.provider.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    );
  }
  
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    claims: filtered.slice(start, end),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
}

export default {
  getClaimById,
  getAllClaims,
};

