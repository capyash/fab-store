/**
 * TP Resolve Standard Operating Procedures (SOP) Index
 * Appeals and Grievances SOPs with regulatory compliance requirements
 */

export const SOP_INDEX = {
  "Filed": {
    title: "SOP 2.1 — Initial Filing Verification",
    steps: [
      "Verify case filing date and deadline compliance",
      "Confirm all required documentation is attached",
      "Validate complainant information and member ID",
      "Check jurisdiction determination (Federal/State/Internal)",
      "Route to appropriate regulatory body",
    ],
    link: "https://example.com/sop/filed",
    denialCodes: [],
    documentReferences: [],
    states: ["All"],
  },
  "Under Investigation": {
    title: "SOP 3.2 — Investigation Process",
    steps: [
      "Assign case to investigation team within 5 business days",
      "Review original decision and supporting documentation",
      "Gather additional evidence and statements",
      "Conduct internal review per regulatory requirements",
      "Document investigation findings",
    ],
    link: "https://example.com/sop/investigation",
    denialCodes: [],
    documentReferences: [],
    states: ["All"],
  },
  "Awaiting Response": {
    title: "SOP 4.3 — Response Management",
    steps: [
      "Send acknowledgment to complainant within 5 business days",
      "Request additional information if needed",
      "Set follow-up reminders for response deadlines",
      "Track response timeline per regulatory requirements",
      "Update case status upon response receipt",
    ],
    link: "https://example.com/sop/awaiting-response",
    denialCodes: [],
    documentReferences: [],
    states: ["All"],
  },
  "Resolved": {
    title: "SOP 5.1 — Resolution Documentation",
    steps: [
      "Document resolution decision and rationale",
      "Notify complainant of resolution within regulatory timeline",
      "Provide appeal rights information if applicable",
      "Close case and archive documentation",
      "Update compliance tracking systems",
    ],
    link: "https://example.com/sop/resolved",
    denialCodes: [],
    documentReferences: [],
    states: ["All"],
  },
  "Escalated": {
    title: "SOP 6.1 — Escalation Procedures",
    steps: [
      "Verify escalation criteria are met",
      "Prepare case file for external review",
      "Route to Independent Review Organization (IRO) if required",
      "Notify complainant of escalation and timeline",
      "Track escalation status and deadlines",
    ],
    link: "https://example.com/sop/escalated",
    denialCodes: [],
    documentReferences: [],
    states: ["All"],
  },
};

/**
 * Scenario-specific SOPs for Appeals and Grievances
 */
export const SCENARIO_SOPS = {
  "timely-filing-appeal": {
    title: "SOP — Timely Filing Appeals (Federal)",
    state: "Federal",
    page: "Page 12",
    steps: [
      "Verify appeal filed within 60-day deadline from original decision",
      "Confirm all required documentation attached (appeal form, original decision, supporting docs)",
      "Check for valid extension requests if past deadline",
      "Route to appropriate review committee based on case type",
      "Notify complainant of receipt within 5 business days",
      "Complete investigation within 30 days per CMS requirements",
    ],
    denialCodes: [
      { code: "TF-001", description: "Appeal filed after 60-day deadline" },
      { code: "TF-002", description: "Missing required documentation for appeal" },
    ],
    documentReferences: ["Page 12"],
    link: "https://example.com/sop/timely-filing-appeal",
    category: "Appeals",
    effectiveDate: "01/01/2025",
    revision: "1.0",
    totalSteps: 6,
  },
  "jurisdiction-determination": {
    title: "SOP — Jurisdiction Determination",
    state: "All",
    page: "Page 14",
    steps: [
      "Review case type (Appeal vs Grievance)",
      "Determine if case falls under Federal or State jurisdiction",
      "Check regulatory body requirements (CMS, State DOH, etc.)",
      "Verify applicable SOPs based on jurisdiction",
      "Route case to appropriate review authority",
      "Document jurisdiction determination rationale",
    ],
    denialCodes: [],
    documentReferences: ["Page 14"],
    link: "https://example.com/sop/jurisdiction-determination",
    category: "Administrative",
    effectiveDate: "01/01/2025",
    revision: "1.0",
    totalSteps: 6,
  },
  "escalation-to-external-review": {
    title: "SOP — Escalation to External Review",
    state: "All",
    page: "Page 15-16",
    steps: [
      "Verify internal review is complete and decision rendered",
      "Confirm complainant has requested external review",
      "Prepare complete case file with all documentation",
      "Submit to Independent Review Organization (IRO) within 5 business days",
      "Notify complainant of IRO assignment and timeline",
      "Track IRO decision and implement resolution",
    ],
    denialCodes: [
      { code: "EXT-001", description: "External review request past deadline" },
    ],
    documentReferences: ["Page 15", "Page 16"],
    link: "https://example.com/sop/escalation-external-review",
    category: "Escalation",
    effectiveDate: "01/01/2025",
    revision: "1.0",
    totalSteps: 6,
  },
  "documentation-requirements": {
    title: "SOP — Documentation Requirements",
    state: "All",
    page: "Page 17",
    steps: [
      "Verify appeal/grievance form is complete and signed",
      "Confirm original decision letter is attached",
      "Check for supporting medical records if applicable",
      "Validate member authorization forms",
      "Ensure all required regulatory forms are included",
      "Document any missing information and request from complainant",
    ],
    denialCodes: [
      { code: "DOC-001", description: "Incomplete appeal/grievance form" },
      { code: "DOC-002", description: "Missing original decision documentation" },
    ],
    documentReferences: ["Page 17"],
    link: "https://example.com/sop/documentation-requirements",
    category: "Administrative",
    effectiveDate: "01/01/2025",
    revision: "1.0",
    totalSteps: 6,
  },
  "resolution-workflow": {
    title: "SOP — Resolution Workflow",
    state: "All",
    page: "Page 18",
    steps: [
      "Review investigation findings and evidence",
      "Determine if original decision should be upheld or overturned",
      "Prepare resolution decision with detailed rationale",
      "Obtain required approvals per regulatory requirements",
      "Notify complainant of resolution within regulatory timeline",
      "Document resolution in compliance tracking system",
    ],
    denialCodes: [],
    documentReferences: ["Page 18"],
    link: "https://example.com/sop/resolution-workflow",
    category: "Resolution",
    effectiveDate: "01/01/2025",
    revision: "1.0",
    totalSteps: 6,
  },
  "grievance-quality-issue": {
    title: "SOP — Grievance: Quality of Care Issues",
    state: "All",
    page: "Page 19",
    steps: [
      "Acknowledge grievance within 5 business days",
      "Assign to quality assurance team for investigation",
      "Review medical records and provider documentation",
      "Conduct interviews with complainant and providers if needed",
      "Complete investigation within 30 days (Federal) or per state requirements",
      "Provide resolution and appeal rights information",
    ],
    denialCodes: [],
    documentReferences: ["Page 19"],
    link: "https://example.com/sop/grievance-quality",
    category: "Grievances",
    effectiveDate: "01/01/2025",
    revision: "1.0",
    totalSteps: 6,
  },
  "grievance-access-issue": {
    title: "SOP — Grievance: Access to Care Issues",
    state: "All",
    page: "Page 20",
    steps: [
      "Acknowledge grievance within 5 business days",
      "Review network adequacy and provider availability",
      "Verify appointment scheduling and wait times",
      "Check for network provider alternatives",
      "Complete investigation within 30 days",
      "Provide resolution and network improvement plan if applicable",
    ],
    denialCodes: [],
    documentReferences: ["Page 20"],
    link: "https://example.com/sop/grievance-access",
    category: "Grievances",
    effectiveDate: "01/01/2025",
    revision: "1.0",
    totalSteps: 6,
  },
  "duplicate-claim-appeal": {
    title: "SOP — Appeals for Duplicate Claim Denials",
    state: "All",
    page: "Page 30",
    steps: [
      "Confirm the original claim and the denied duplicate claim numbers in the core system.",
      "Verify that the denial reason on the appealed claim is a duplicate (e.g., CO-18) and identify the paid or processed claim it references.",
      "Determine whether the appealed claim is a true duplicate, a corrected claim, or a different service that was incorrectly matched.",
      "If the appealed claim is a valid corrected claim, coordinate with claims operations to void/adjust the original and reprocess the corrected claim.",
      "If it is a true duplicate, uphold the denial and provide a clear written explanation to the member and/or provider.",
      "Document the appeal rationale, outcome, and any system corrections in the appeals tracking system.",
    ],
    denialCodes: [
      { code: "CO-18", description: "Duplicate claim/service" },
    ],
    documentReferences: ["Page 30"],
    link: "https://example.com/sop/duplicate-claim-appeal",
    category: "Appeals",
    effectiveDate: "01/01/2025",
    revision: "1.0",
    totalSteps: 6,
  },
  "split-bill-overlap-appeal": {
    title: "SOP — Appeals for Split-Bill / Overlapping Claims",
    state: "All",
    page: "Page 32-33",
    steps: [
      "Review all related inpatient or outpatient claims for the same member, provider, and episode of care.",
      "Identify whether the payer treated one claim as correct and denied the other as a duplicate or overlapping bill.",
      "Determine if provider billing follows permitted split-billing rules (e.g., interim bills) or if there is an error in how the payer grouped the claims.",
      "Recalculate payment as needed to ensure only appropriate days and services are paid once, correcting any over- or under-payments.",
      "If the denial should be overturned, coordinate adjustments and issue a revised decision to the complainant.",
      "Document the rationale and updates in both the claims and appeals systems, including any systemic fixes if pattern issues are found.",
    ],
    denialCodes: [
      { code: "CO-18", description: "Duplicate claim/service" },
      { code: "N347", description: "Your claim/service has been processed under a more appropriate claim" },
    ],
    documentReferences: ["Page 32", "Page 33"],
    link: "https://example.com/sop/split-bill-overlap-appeal",
    category: "Appeals",
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
 * Get all appeals/grievances SOPs
 */
export const getAllAppealsGrievancesSOPs = () => {
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
 * Get applicable SOPs for a case
 */
export const getApplicableSOPsForCase = (caseData) => {
  const allSOPs = getAllAppealsGrievancesSOPs();
  return allSOPs.filter(sop => {
    // Filter by jurisdiction if case has jurisdiction info
    if (caseData.jurisdiction && sop.state !== "All") {
      // Map jurisdiction to state for filtering
      if (caseData.jurisdiction === "Federal" && sop.state !== "Federal" && sop.state !== "All") {
        return false;
      }
      if (caseData.jurisdiction === "State" && sop.state === "Federal") {
        return false;
      }
    }
    // Filter by status if case has status
    if (caseData.status && SOP_INDEX[caseData.status]) {
      return sop.id === caseData.status || sop.id === caseData.scenario;
    }
    // Filter by scenario
    if (caseData.scenario && sop.id === caseData.scenario) {
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
 * Get SOPs by jurisdiction
 */
export const getSOPsByJurisdiction = (jurisdiction) => {
  return getAllAppealsGrievancesSOPs().filter(sop => {
    if (jurisdiction === "Federal") {
      return sop.state === "Federal" || sop.state === "All";
    } else if (jurisdiction === "State") {
      return sop.state !== "Federal" || sop.state === "All";
    }
    return true;
  });
};

/**
 * Get SOP by issue type
 */
export const getSOPByIssueType = (issueType) => {
  if (issueType === "Quality of Care") {
    return SCENARIO_SOPS["grievance-quality-issue"];
  } else if (issueType === "Access to Care") {
    return SCENARIO_SOPS["grievance-access-issue"];
  }
  return null;
};

/**
 * Get SOP by denial code
 */
export const getSOPByDenialCode = (denialCode) => {
  return getAllAppealsGrievancesSOPs().find(sop => 
    sop.denialCodes?.some(dc => dc.code === denialCode)
  );
};

