/**
 * Cogniclaim Platform Components Adapter
 *
 * Wraps platform components with Cogniclaim's SOP data provider
 * This allows Cogniclaim components to use platform components without
 * needing to pass sopProvider explicitly
 */

import React from 'react';
// Note: this file lives at src/apps/cogniclaim/components/
// To reach src/platforms/sop-navigator, we need to go up three levels.
// src/apps/cogniclaim/components -> ../.. -> src/apps -> ../.. -> src
import { SOPDataProvider, SOPViewer as PlatformSOPViewer, ReasoningCard as PlatformReasoningCard } from '../../../platforms/sop-navigator';
import * as sopsData from '../data/sops';

// Create SOP data provider with Cogniclaim's SOP data
const sopProvider = new SOPDataProvider({
  SOP_INDEX: sopsData.SOP_INDEX,
  SCENARIO_SOPS: sopsData.SCENARIO_SOPS,
  getSOPByScenario: sopsData.getSOPByScenario,
  getSOPByStatus: sopsData.getSOPByStatus,
  getApplicableSOPsForClaim: sopsData.getApplicableSOPsForClaim,
  getSOPByCode: sopsData.getSOPByCode,
  getSOPsByState: sopsData.getSOPsByState,
  getSOPByDenialCode: sopsData.getSOPByDenialCode,
});

// Wrap SOPViewer with sopProvider
export const SOPViewer = (props) => {
  return React.createElement(PlatformSOPViewer, { ...props, sopProvider, itemStatus: props.claimStatus });
};

// Wrap ReasoningCard with sopProvider
export const ReasoningCard = (props) => {
  return React.createElement(PlatformReasoningCard, { ...props, sopProvider, item: props.claim });
};

// Export sopProvider for components that need direct access
export { sopProvider };

