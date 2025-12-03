/**
 * TP Resolve Mock Data
 * Realistic appeals and grievances cases dataset for development and testing
 */

// Helper function to generate dates
const generateDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Complainants pool
const complainants = [
  "John Doe", "Sarah Lin", "Raj Patel", "Maria Gomez", "Ravi Sharma",
  "Aisha Khan", "Carlos Silva", "Lisa Wong", "Emily Clark", "Mohit Jain",
  "Ana Torres", "Jacob Lee", "Priya Reddy", "Michael Chen", "Sofia Martinez",
  "David Kim", "Nina Patel", "James Wilson", "Fatima Ali", "Robert Brown",
  "Yuki Tanaka", "Ahmed Hassan", "Emma Johnson", "Diego Rodriguez", "Mei Li",
  "Kevin O'Brien", "Samantha Taylor", "Juan Garcia", "Leila Ahmed", "Brian Thompson",
];

// Issue types
const issueTypes = [
  "Coverage Denial",
  "Billing Dispute",
  "Quality of Care",
  "Access to Care",
  "Service Denial",
  "Authorization Issue",
];

// Jurisdictions
const jurisdictions = ["Federal", "State", "Internal"];

// Regulatory bodies
const regulatoryBodies = {
  Federal: ["CMS", "HHS", "OMHA"],
  State: ["State DOH", "State Insurance", "State Medicaid"],
  Internal: ["Internal Review", "Quality Assurance", "Member Services"],
};

// Generate realistic disputed amounts
const generateAmount = () => {
  const rand = Math.random();
  if (rand < 0.4) return Math.floor(Math.random() * 3000) + 500; // $500-$3500 (40%)
  if (rand < 0.7) return Math.floor(Math.random() * 7000) + 3500; // $3500-$10500 (30%)
  if (rand < 0.9) return Math.floor(Math.random() * 15000) + 10500; // $10500-$25500 (20%)
  return Math.floor(Math.random() * 50000) + 25500; // $25500-$75500 (10%)
};

// Generate filing dates
const generateFilingDate = (index) => {
  const rand = Math.random();
  if (rand < 0.3) {
    return generateDate(Math.floor(Math.random() * 7)); // Last 7 days (30%)
  } else if (rand < 0.6) {
    return generateDate(Math.floor(Math.random() * 23) + 7); // 7-30 days (30%)
  } else if (rand < 0.85) {
    return generateDate(Math.floor(Math.random() * 30) + 30); // 30-60 days (25%)
  } else {
    return generateDate(Math.floor(Math.random() * 30) + 60); // 60-90 days (15%)
  }
};

// Calculate filing deadline (60 days from original decision for appeals, varies for grievances)
const calculateDeadline = (filingDate, type, jurisdiction) => {
  const filing = new Date(filingDate);
  let daysToAdd = 60; // Default 60 days for appeals
  
  if (type === "Grievance") {
    daysToAdd = jurisdiction === "Federal" ? 90 : 60; // Grievances have different deadlines
  } else if (type === "Appeal") {
    daysToAdd = jurisdiction === "Federal" ? 60 : 45; // Appeals: 60 days federal, 45 state
  }
  
  filing.setDate(filing.getDate() + daysToAdd);
  return filing.toISOString().split('T')[0];
};

// Generate cases with realistic distribution
export const CASES = Array.from({ length: 80 }, (_, index) => {
  const caseId = `APL-${String(index + 1).padStart(3, '0')}`;
  const caseNumber = `2025-${caseId}`;
  
  // Determine case type (60% Appeals, 40% Grievances)
  const type = Math.random() < 0.6 ? "Appeal" : "Grievance";
  
  // Realistic status distribution
  const statusRand = Math.random();
  let status;
  if (statusRand < 0.3) {
    status = "Under Investigation"; // 30%
  } else if (statusRand < 0.55) {
    status = "Filed"; // 25%
  } else if (statusRand < 0.75) {
    status = "Awaiting Response"; // 20%
  } else if (statusRand < 0.9) {
    status = "Resolved"; // 15%
  } else {
    status = "Escalated"; // 10%
  }
  
  const filingDate = generateFilingDate(index);
  const jurisdiction = jurisdictions[Math.floor(Math.random() * jurisdictions.length)];
  const regulatoryBody = regulatoryBodies[jurisdiction][Math.floor(Math.random() * regulatoryBodies[jurisdiction].length)];
  const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
  const amount = generateAmount();
  const filingDeadline = calculateDeadline(filingDate, type, jurisdiction);
  
  // Calculate days until deadline
  const today = new Date();
  const deadline = new Date(filingDeadline);
  const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  
  // Determine scenario based on case characteristics
  let scenario = null;
  const rand = Math.random();
  
  if (daysUntilDeadline < 7 && daysUntilDeadline > 0) {
    scenario = "timely-filing-appeal"; // Urgent deadline
  } else if (jurisdiction === "Federal" && type === "Appeal") {
    scenario = "jurisdiction-determination";
  } else if (status === "Escalated") {
    scenario = "escalation-to-external-review";
  } else if (issueType === "Quality of Care") {
    scenario = "grievance-quality-issue";
  } else if (issueType === "Access to Care") {
    scenario = "grievance-access-issue";
  } else if (type === "Appeal" && issueType === "Coverage Denial") {
    scenario = "resolution-workflow";
  } else {
    scenario = "documentation-requirements";
  }
  
  // Original decision details
  const originalDecisionDate = generateDate(Math.floor(Math.random() * 30) + 60);
  const originalDecision = {
    date: originalDecisionDate,
    decisionType: type === "Appeal" ? "Denial" : "Service Issue",
    reason: issueType === "Coverage Denial" 
      ? "Service not medically necessary"
      : issueType === "Billing Dispute"
      ? "Billing error - incorrect charges"
      : issueType === "Quality of Care"
      ? "Quality of care concerns"
      : "Access to care limitations",
  };
  
  // Complainant details
  const complainantName = complainants[Math.floor(Math.random() * complainants.length)];
  const memberId = `M${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
  
  // Priority calculation (based on deadline proximity and amount)
  let priority = "Medium";
  if (daysUntilDeadline < 0) {
    priority = "Critical"; // Past deadline
  } else if (daysUntilDeadline < 7) {
    priority = "High"; // Urgent deadline
  } else if (amount > 20000) {
    priority = "High"; // High value
  } else if (daysUntilDeadline < 14) {
    priority = "Medium-High";
  }
  
  const caseData = {
    id: caseId,
    caseNumber,
    type,
    complainant: {
      name: complainantName,
      memberId,
      contact: `${complainantName.toLowerCase().replace(' ', '.')}@example.com`,
    },
    issueType,
    originalDecision,
    filingDate,
    filingDeadline,
    daysUntilDeadline,
    jurisdiction,
    regulatoryBody,
    status,
    priority,
    amount,
    scenario,
    documentReferences: scenario === "timely-filing-appeal" ? ["Page 12"] : [],
    denialCodes: type === "Appeal" ? ["TF-001"] : [],
  };

  // Attach line items so each case has multiple issues/items to resolve.
  // Use a more realistic range driven by amount and urgency:
  // - Lower-value, simple grievances → 1–4 items
  // - Typical appeals / moderate amounts → 3–8 items
  // - High‑value / urgent or escalated cases → 6–20 items
  let minLines;
  let maxLines;
  const isHighValue = amount > 20000;
  const isUrgent = daysUntilDeadline < 7;
  const isEscalated = status === "Escalated" || status === "Under Investigation";

  if (!isHighValue && !isUrgent && !isEscalated) {
    minLines = 1;
    maxLines = 4;
  } else if (!isHighValue && (isUrgent || isEscalated)) {
    minLines = 3;
    maxLines = 8;
  } else {
    minLines = 6;
    maxLines = 20;
  }

  const lineItemCount = Math.floor(Math.random() * (maxLines - minLines + 1)) + minLines;
  const baseDescriptions =
    type === "Appeal"
      ? ["Denied service", "Related ancillary charge", "Follow‑up visit", "Administrative fee"]
      : ["Quality of care concern", "Access to care issue", "Billing dispute line", "Service experience issue"];

  const items = [];
  let remaining = amount;
  for (let i = 0; i < lineItemCount; i++) {
    const isLast = i === lineItemCount - 1;
    const portion = isLast
      ? remaining
      : Math.max(50, Math.round((amount / lineItemCount) * (0.7 + Math.random() * 0.6)));
    remaining -= portion;

    items.push({
      lineId: `${caseId}-L${i + 1}`,
      description: baseDescriptions[i] || baseDescriptions[baseDescriptions.length - 1],
      issueType,
      amount: portion,
      status:
        status === "Resolved"
          ? "Resolved"
          : daysUntilDeadline < 0
          ? "Overdue"
          : "Open",
      daysUntilDeadline,
      scenario,
      denialCodes: [...(caseData.denialCodes || [])],
      documentReferences: [...(caseData.documentReferences || [])],
    });
  }

  caseData.lineItems = items;
  
  return caseData;
});

// Add predefined scenario cases for testing
export const SCENARIO_CASES = [
  {
    id: "SCN-APL-001",
    caseNumber: "2025-SCN-APL-001",
    type: "Appeal",
    complainant: {
      name: "Jane Smith",
      memberId: "M123456",
      contact: "jane.smith@example.com",
    },
    issueType: "Coverage Denial",
    originalDecision: {
      date: "2025-01-10",
      decisionType: "Denial",
      reason: "Service not medically necessary",
    },
    filingDate: "2025-01-15",
    filingDeadline: "2025-03-16", // 60 days from filing
    daysUntilDeadline: 45,
    jurisdiction: "Federal",
    regulatoryBody: "CMS",
    status: "Under Investigation",
    priority: "High",
    amount: 15000,
    scenario: "timely-filing-appeal",
    documentReferences: ["Page 12"],
    denialCodes: ["TF-001"],
  },
  {
    id: "SCN-APL-002",
    caseNumber: "2025-SCN-APL-002",
    type: "Grievance",
    complainant: {
      name: "Robert Johnson",
      memberId: "M789012",
      contact: "robert.johnson@example.com",
    },
    issueType: "Quality of Care",
    originalDecision: {
      date: "2025-01-20",
      decisionType: "Service Issue",
      reason: "Quality of care concerns",
    },
    filingDate: "2025-01-25",
    filingDeadline: "2025-04-25", // 90 days for federal grievance
    daysUntilDeadline: 78,
    jurisdiction: "Federal",
    regulatoryBody: "HHS",
    status: "Awaiting Response",
    priority: "Medium",
    amount: 5000,
    scenario: "grievance-quality-issue",
    documentReferences: ["Page 18"],
    denialCodes: [],
  },
  {
    id: "SCN-APL-003",
    caseNumber: "2025-SCN-APL-003",
    type: "Appeal",
    complainant: {
      name: "Maria Garcia",
      memberId: "M345678",
      contact: "maria.garcia@example.com",
    },
    issueType: "Coverage Denial",
    originalDecision: {
      date: "2024-12-01",
      decisionType: "Denial",
      reason: "Service not covered under plan",
    },
    filingDate: "2024-12-05",
    filingDeadline: "2025-02-03", // Past deadline
    daysUntilDeadline: -25,
    jurisdiction: "State",
    regulatoryBody: "State DOH",
    status: "Escalated",
    priority: "Critical",
    amount: 25000,
    scenario: "escalation-to-external-review",
    documentReferences: ["Page 15", "Page 16"],
    denialCodes: ["TF-002"],
  },
  {
    id: "SCN-APL-DUP-001",
    caseNumber: "2025-SCN-APL-DUP-001",
    type: "Appeal",
    complainant: {
      name: "Lisa Turner",
      memberId: "M567890",
      contact: "lisa.turner@example.com",
    },
    issueType: "Billing Dispute",
    originalDecision: {
      date: "2025-01-12",
      decisionType: "Denial",
      reason: "Duplicate claim/service (CO-18)",
    },
    filingDate: "2025-01-20",
    filingDeadline: "2025-03-21",
    daysUntilDeadline: 40,
    jurisdiction: "Federal",
    regulatoryBody: "CMS",
    status: "Under Investigation",
    priority: "High",
    amount: 3200,
    scenario: "duplicate-claim-appeal",
    documentReferences: ["Page 30"],
    denialCodes: ["CO-18"],
  },
  {
    id: "SCN-APL-SPLIT-001",
    caseNumber: "2025-SCN-APL-SPLIT-001",
    type: "Appeal",
    complainant: {
      name: "David Chen",
      memberId: "M234567",
      contact: "david.chen@example.com",
    },
    issueType: "Billing Dispute",
    originalDecision: {
      date: "2025-01-05",
      decisionType: "Denial",
      reason: "Overlapping inpatient split-bill detected",
    },
    filingDate: "2025-01-15",
    filingDeadline: "2025-03-16",
    daysUntilDeadline: 45,
    jurisdiction: "State",
    regulatoryBody: "State DOH",
    status: "Under Investigation",
    priority: "High",
    amount: 35000,
    scenario: "split-bill-overlap-appeal",
    documentReferences: ["Page 32", "Page 33"],
    denialCodes: ["CO-18", "N347"],
  },
];

// Export combined cases
export const ALL_CASES = [...CASES, ...SCENARIO_CASES];

