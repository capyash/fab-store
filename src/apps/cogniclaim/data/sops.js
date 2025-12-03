/**
 * Standard Operating Procedures (SOP) Index
 * Enhanced with denial codes, document references, and state-specific information
 */

export const SOP_INDEX = {
    "Pending Review": {
      title: "SOP 3.1 — Pending Review Resolution",
      steps: [
        "Verify eligibility & pre-authorization documents",
        "Check diagnosis/procedure coding alignment",
        "If modifier missing, request resubmission with -59/-25 as applicable",
        "Escalate to coding QA if mismatch persists",
      ],
      link: "https://example.com/sop/pending-review",
      denialCodes: [],
      documentReferences: [],
      states: ["All"],
    },
    "Information Needed": {
      title: "SOP 4.2 — Missing Information Handling",
      steps: [
        "Send provider information request template",
        "Set a 48h follow-up task",
        "If no response, trigger auto-denial workflow",
      ],
      link: "https://example.com/sop/info-needed",
      denialCodes: [],
      documentReferences: [],
      states: ["All"],
    },
    "Under Process": {
      title: "SOP 2.7 — In-Process Queue",
      steps: [
        "Validate claim line items vs. policy limits",
        "Run fraud checks on high-amount line items",
        "Prepare adjudication summary for approver",
      ],
      link: "https://example.com/sop/under-process",
      denialCodes: [],
      documentReferences: [],
      states: ["All"],
    },
    "Escalated": {
      title: "SOP 5.5 — Escalation Path",
      steps: [
        "Attach case notes & artifacts",
        "Route to L2 clinical reviewer",
        "Notify provider of escalation status",
      ],
      link: "https://example.com/sop/escalated",
      denialCodes: [],
      documentReferences: [],
      states: ["All"],
    },
  };

/**
 * Scenario-specific SOPs
 */
export const SCENARIO_SOPS = {
  "build-days": {
    title: "SOP — Build Days Exceed Authorized Days (Texas)",
    state: "Texas",
    page: "Page 9",
    steps: [
      "Assess patient days vs. authorized days",
      "Verify build-in patient days against state limits",
      "Check provider eligibility and effective dates",
      "Apply denial code N26 if itemized bill missing",
      "Apply denial code N24 if provider not eligible",
    ],
    denialCodes: [
      { code: "N26", description: "Missing itemized bill or statement" },
      { code: "N24", description: "Charges covered under a capitation agreement/managed care plan" },
    ],
    documentReferences: ["Page 9"],
    link: "https://example.com/sop/texas-build-days",
  },
  "cob": {
    title: "SOP — Coordination of Benefits (COB)",
    state: "All",
    page: "N/A",
    steps: [
      "Verify member SSN availability",
      "Query external databases for benefit eligibility",
      "Update member profile with Medicare (MCR) data",
      "Update managed medic paid (m) records",
      "Update external enrollment records",
      "Process Letters of Intent (LOI)",
      "Coordinate with secondary/tertiary payers",
    ],
    denialCodes: [],
    documentReferences: [],
    link: "https://example.com/sop/cob",
  },
  "precertification": {
    title: "SOP — Precertification Requirements",
    state: "All",
    page: "Page 11-12",
    steps: [
      "Identify claim type (UB04) and surgery type",
      "Evaluate precertification criteria",
      "Check admission type (Type 1)",
      "Verify revenue codes (45X or 7BX)",
      "Verify precertification document at Page 11-12",
      "Confirm compliance with payer guidelines",
    ],
    denialCodes: [],
    documentReferences: ["Page 11", "Page 12"],
    link: "https://example.com/sop/precertification",
  },
  "provider-eligibility": {
    title: "SOP — Provider Eligibility Verification",
    state: "All",
    page: "Page 9",
    steps: [
      "Identify provider from claim",
      "Verify provider eligibility status",
      "Compare date of service (DOS) against effective date",
      "Check memorandum effective dates",
      "Apply denial code N24 if provider not eligible",
    ],
    denialCodes: [
      { code: "N24", description: "Charges covered under a capitation agreement/managed care plan" },
    ],
    documentReferences: ["Page 9"],
    link: "https://example.com/sop/provider-eligibility",
  },
  "duplicate-claim-same-day": {
    title: "SOP — Duplicate Claim / Same Day Services",
    state: "All",
    page: "Page 30",
    steps: [
      "Identify potential duplicate by matching member, provider, date of service, and key procedure codes.",
      "Confirm whether the earlier claim for the same service has already been processed or paid.",
      "Check if the later submission is clearly marked as a corrected claim or adjustment.",
      "If the second submission is a true duplicate (no new information, same billed units), maintain denial with duplicate claim code.",
      "If the second submission is a valid corrected claim, adjust or void the original claim and reprocess according to policy.",
      "Document rationale and communicate outcome to the provider following standard notification templates.",
    ],
    denialCodes: [
      { code: "CO-18", description: "Duplicate claim/service" },
    ],
    documentReferences: ["Page 30"],
    link: "https://example.com/sop/duplicate-claim-same-day",
    category: "Billing Integrity",
    effectiveDate: "01/01/2025",
    revision: "1.0",
    totalSteps: 6,
  },
  "split-bill-overlap": {
    title: "SOP — Split-Bill / Overlapping Inpatient Claims",
    state: "All",
    page: "Page 32-33",
    steps: [
      "Review the member's admission and discharge dates for all related inpatient claims.",
      "Identify overlapping date ranges or revenue codes that may indicate split-billing for a single stay.",
      "Determine whether the split-billing pattern is allowed under plan and regulatory policy (e.g., interim billing vs. duplicate billing).",
      "If only one claim should be paid, determine which claim is correct (e.g., complete bill vs. partial/duplicate).",
      "Deny or adjust the inappropriate claim(s) using duplicate/overlap denial codes and recoup any overpayments if necessary.",
      "Document findings and communicate the decision to the provider, including instructions for corrected or consolidated billing when applicable.",
    ],
    denialCodes: [
      { code: "CO-18", description: "Duplicate claim/service" },
      { code: "N347", description: "Your claim/service has been processed under a more appropriate claim" },
    ],
    documentReferences: ["Page 32", "Page 33"],
    link: "https://example.com/sop/split-bill-overlap",
    category: "Billing Integrity",
    effectiveDate: "01/01/2025",
    revision: "1.0",
    totalSteps: 6,
  },
};

/**
 * Get SOP by scenario type
 */
export const getSOPByScenario = (scenario) => {
  return SCENARIO_SOPS[scenario] || null;
};

/**
 * Get SOP by status
 */
export const getSOPByStatus = (status) => {
  return SOP_INDEX[status] || null;
};

/**
 * Get all denial codes for a scenario
 */
export const getDenialCodes = (scenario) => {
  const sop = getSOPByScenario(scenario);
  return sop?.denialCodes || [];
};

/**
 * Get document references for a scenario
 */
export const getDocumentReferences = (scenario) => {
  const sop = getSOPByScenario(scenario);
  return sop?.documentReferences || [];
};

/**
 * Get all healthcare SOPs (combines SOP_INDEX and SCENARIO_SOPS)
 */
export const getAllHealthcareSOPs = () => {
  // Convert SOP_INDEX to array format
  const indexSOPs = Object.entries(SOP_INDEX).map(([key, sop]) => ({
    id: key,
    category: "Status Resolution",
    state: sop.states?.[0] || "All",
    ...sop,
  }));

  // Convert SCENARIO_SOPS to array format
  const scenarioSOPs = Object.entries(SCENARIO_SOPS).map(([key, sop]) => ({
    id: key,
    category: sop.category || "Scenario-Specific",
    state: sop.state || "All",
    ...sop,
  }));

  return [...indexSOPs, ...scenarioSOPs];
};

/**
 * Get applicable SOPs for a claim
 */
export const getApplicableSOPsForClaim = (claim) => {
  const allSOPs = getAllHealthcareSOPs();
  return allSOPs.filter(sop => {
    // Filter by state if claim has state info
    if (claim.state && sop.state !== "All" && sop.state !== claim.state) {
      return false;
    }
    // Filter by status if claim has status
    if (claim.status && SOP_INDEX[claim.status]) {
      return sop.id === claim.status || sop.id === claim.scenario;
    }
    // Filter by scenario
    if (claim.scenario && sop.id === claim.scenario) {
      return true;
    }
    return true;
  });
};

/**
 * Get SOP by code
 */
export const getSOPByCode = (code) => {
  return SOP_INDEX[code] || SCENARIO_SOPS[code] || null;
};

/**
 * Get SOPs by state
 */
export const getSOPsByState = (state) => {
  return getAllHealthcareSOPs().filter(sop => 
    sop.state === "All" || sop.state === state
  );
};

/**
 * Get SOP by denial code
 */
export const getSOPByDenialCode = (denialCode) => {
  return getAllHealthcareSOPs().find(sop => 
    sop.denialCodes?.some(dc => dc.code === denialCode)
  );
};
