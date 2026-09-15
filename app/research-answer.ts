export type ResearchRow = { source: string; provision: string; requirement: string; applicability: string };
export type ResearchAnswer = {
  issue: string;
  short: string;
  applicability: string;
  rows: ResearchRow[];
  analysis: string[];
  exceptions: string[];
  actions: string[];
  conclusion: string;
  sources: string[];
  regulationId: number;
  supported: boolean;
};

type Profile = { category: string; layer: string; deposits: string; digital: boolean };

const credit = 'Reserve Bank of India (Non-Banking Financial Companies – Credit Facilities) Directions, 2025';
const capital = 'Reserve Bank of India (Non-Banking Financial Companies – Prudential Norms on Capital Adequacy) Directions, 2025';
const iracp = 'Reserve Bank of India (Non-Banking Financial Companies – Income Recognition, Asset Classification and Provisioning) Directions, 2025';
const sbr = 'Reserve Bank of India (Non-Banking Financial Companies – Registration, Exemptions and Framework for Scale Based Regulation) Directions, 2025';

export function frameResearchAnswer(question: string, profile: Profile, regulationId: number): ResearchAnswer {
  const q = question.toLowerCase();
  const identity = `${profile.category} · ${profile.layer} · ${profile.deposits.toLowerCase()}`;

  if (/\bdlg\b|default loss guarantee|loss sharing arrangement/.test(q)) {
    const eligibleCategory = ['NBFC-ICC', 'NBFC-MFI', 'NBFC-Factor', 'NBFC-IFC', 'NBFC-D', 'HFC', 'IDF-NBFC'].includes(profile.category);
    const limitedBL = profile.layer === 'BL';
    const applicability = eligibleCategory
      ? `The Credit Facilities Directions list ${profile.category} among covered categories and apply across layers unless stated otherwise (paragraph 3(1)). Your ${profile.layer} layer is not, by itself, an exemption. ${limitedBL ? 'For a BL entity with customer interface but no public funds, paragraph 3(2)(i) limits prudential rules; whether that limitation affects the proposed arrangement needs the public-funds fact and provision-specific analysis.' : ''}`
      : `Paragraph 3 does not make every NBFC category subject to every credit-facility rule. The selected ${profile.category} category must be checked against paragraph 3 before treating DLG as available.`;
    return {
      issue: 'Whether this NBFC can use a Default Loss Guarantee, and under what conditions',
      short: eligibleCategory
        ? `DEPENDS. A ${identity} NBFC may use DLG only if the provider, portfolio, contract and other conditions in paragraphs 19–28 are met. The permitted cover is capped at 5% of the amount disbursed from the fixed DLG set at any time (paragraph 24(1)–(2)).`
        : `DEPENDS. The selected category is not confirmed as fully covered by paragraph 3. Do not apply the 5% DLG rule or enter a DLG arrangement until category-specific applicability has been checked.`,
      applicability,
      rows: [
        { source: credit, provision: '3(1)–(3)', requirement: 'Lists covered categories, partial application and exclusions.', applicability: `${profile.category}; ${profile.layer} must be checked against the listed category and any partial-application rule.` },
        { source: credit, provision: '4(1)(viii), 19', requirement: 'Defines DLG; permits an arrangement only with an LSP or another lender engaged as an LSP. An LSP providing DLG must be a company.', applicability: 'Only if this NBFC is covered and the proposed provider qualifies.' },
        { source: credit, provision: '20–24', requirement: 'Requires policy and provider due diligence, an enforceable contract, permitted cover form and a fixed measurable loan set; caps cover at 5% of disbursed loans.', applicability: 'Every proposed DLG arrangement within this direction.' },
        { source: credit, provision: '25–28', requirement: 'NPA/provisioning remain with the NBFC; invocation within 120 days, minimum agreement tenor and monthly LSP disclosures apply.', applicability: 'The lender and, for disclosure, its LSP.' },
      ],
      analysis: [
        'Express rule: paragraph 24(1) measures the ceiling against amounts disbursed out of the identified portfolio—not merely sanctions or the current outstanding balance. Paragraph 24(2) says the DLG set is fixed, not dynamic.',
        'Express rule: paragraphs 22–23 require a legally enforceable contract and permit cash with the NBFC, a scheduled-bank fixed deposit with lien, or a bank guarantee. Paragraph 20 says DLG cannot replace credit appraisal and requires provider due diligence at entry or renewal.',
        'Application: if the NBFC proposes a ₹10 crore fixed set but has disbursed only ₹4 crore, the maximum currently available cover is ₹20 lakh (5% of ₹4 crore). This is an illustration of paragraph 24, not a separate regulatory threshold.',
        'Express rule: paragraph 25 keeps individual-loan NPA recognition and provisioning with the NBFC regardless of portfolio-level DLG, and invoked DLG cannot be reinstated through recoveries.',
      ],
      exceptions: [
        'Paragraph 21(1) bars DLG on loans covered by the specified trust-fund credit-guarantee schemes; paragraph 21(2) bars NBFC-P2P from DLG on platform loans.',
        'Paragraph 29 excludes specified public/multilateral guarantee schemes from the DLG definition. Paragraph 3 has additional category-specific exclusions and partial application.',
        'Missing facts: whether the proposed provider is a qualifying LSP/company, whether the NBFC avails public funds (relevant to certain BL entities), the fixed loan set, disbursed amount, proposed cover form and contract terms.',
      ],
      actions: [
        'Compliance/credit: document the paragraph 3 applicability decision and retain the DLG policy, underwriting standards and provider due-diligence evidence (paragraph 20).',
        'Legal/operations: sign an enforceable contract and verify provider eligibility, permitted security form and the fixed DLG set before launch (paragraphs 19, 22–24).',
        'Risk/finance: monitor the 5% disbursement-based limit, NPA and provisioning, invocation within 120 overdue days and non-reinstatement (paragraphs 24–27).',
        'LSP oversight: ensure portfolio disclosures are published monthly within seven working days after month-end (paragraph 28).',
      ],
      conclusion: eligibleCategory ? 'DEPENDS — DLG is permitted only subject to the cited applicability and arrangement conditions. The 5% ceiling alone does not make the arrangement compliant.' : 'DEPENDS — category-specific applicability is unresolved on the selected profile.',
      sources: [`${credit}, Chapter I paragraphs 3 and 4(1)(viii); Chapter III paragraphs 19–29 (folder copy).`],
      regulationId: 8,
      supported: true,
    };
  }

  if (/\bcrar\b|capital adequacy|tier.?1|common equity tier|risk.weighted asset/.test(q)) {
    return {
      issue: 'Minimum regulatory capital ratio by SBR layer',
      short: profile.layer === 'BL' ? 'DEPENDS. The general 15% CRAR rule in paragraph 6(3) is expressed for Middle Layer and above; it should not be automatically applied to every Base Layer NBFC. Check paragraph 3 and category-specific paragraph 6(1).' : `YES, subject to paragraph 3 applicability. The general ${profile.layer} requirement is at least 15% CRAR and 10% Tier 1 on an ongoing basis (paragraphs 6(2)–(3)). ${profile.layer === 'UL' ? 'Upper Layer also has a 9% CET1 requirement (paragraph 6(4)).' : ''}`,
      applicability: `${sbr} determines the layer; ${capital} paragraph 3 determines whether this category/profile is within the capital direction. The selected profile is ${identity}.`,
      rows: [{ source: capital, provision: '3, 6(1)–(4)', requirement: 'Category/layer applicability; ML+ 15% CRAR, 10% Tier 1; UL 9% CET1; specified gold-loan category rule.', applicability: profile.layer }],
      analysis: ['Express rule: paragraph 6(3) states a 15% CRAR minimum for ML and above; paragraph 6(2) sets the Tier 1 minimum; paragraph 6(4) adds UL CET1.', 'Application: use the direction’s prescribed capital composition, deductions and risk weights rather than comparing accounting equity with total loans.'],
      exceptions: ['Paragraph 3 contains category/profile exclusions. Paragraph 6(1) contains a specific gold-jewellery-lending category rule. Asset size and actual RBI layer classification were not provided.'],
      actions: ['Finance/risk: confirm category and official layer, calculate eligible capital and risk-weighted assets, and retain the workings.', 'Compliance: monitor continuously and review the applicable regulatory return/frequency in the source direction.'],
      conclusion: profile.layer === 'BL' ? 'DEPENDS — no universal BL 15% conclusion can be drawn from paragraph 6(3).' : 'YES — the ML+ minimum applies if paragraph 3 includes the entity.',
      sources: [`${capital}, paragraphs 3 and 6(1)–(4) (folder copy).`], regulationId: 2, supported: true,
    };
  }

  if (/\bnpa\b|non.performing asset|overdue|past due|asset classification/.test(q)) {
    return {
      issue: 'When a credit asset becomes non-performing',
      short: 'DEPENDS on facility type and coverage. For a covered NBFC, the general test is more than 90 days overdue; BL reaches that test by 31 March 2026 under paragraph 44, ML uses paragraph 51, and UL applies the ML rules through paragraph 56.',
      applicability: `The selected ${identity} profile needs checking against ${iracp} paragraph 10 exclusions and the relevant layer chapter.`,
      rows: [{ source: iracp, provision: '10, 42–44, 50–51, 56', requirement: 'Sets applicability and layer-specific asset classification, including the completed BL glide path to >90 days.', applicability: profile.layer }],
      analysis: ['Express rule: the selected layer’s provisions must be used for the relevant loan/facility, not a universal headline alone.', 'Application: count days past due from the contractual due date and test all relevant borrower facilities where borrower-wise classification is prescribed.'],
      exceptions: ['Paragraph 10 excludes certain categories/profiles. Facility-specific and restructuring provisions can affect treatment. Borrower, facility, due date and payment history were not supplied.'],
      actions: ['Credit operations: record due dates and days past due by facility/borrower.', 'Finance/risk: apply income reversal and provisions after classification; retain the account-level calculation and review evidence.'],
      conclusion: 'DEPENDS — the >90-day test is the general current test for covered entities, but a specific account conclusion requires the facility and payment facts.',
      sources: [`${iracp}, paragraphs 10, 42–44, 50–51 and 56 (folder copy).`], regulationId: 3, supported: true,
    };
  }

  if (/scale.based|\bsbr\b|base layer|middle layer|upper layer|\b1000\b|₹1,000/.test(q)) {
    return {
      issue: 'Which SBR layer applies to this NBFC',
      short: 'DEPENDS. A non-deposit-taking NBFC generally moves from BL to ML at ₹1,000 crore assets, but category, deposit status and group aggregation can place it in ML earlier. UL has a separate threshold/identification test in the folder’s amended SBR direction.',
      applicability: `The selected profile is ${identity}. Its audited assets, group structure and official RBI identification are not entered here, so the layer control is a working assumption, not a verified classification.`,
      rows: [{ source: sbr, provision: '10–12, 15, 17–24', requirement: 'Defines layer placement, category-based placement, group aggregation and separate UL treatment.', applicability: 'BL, ML and UL must be tested separately.' }],
      analysis: ['Express rule: asset size is not the only placement criterion. Deposit-taking status and specified activity categories affect ML placement.', 'Application: compare audited standalone and relevant group assets, the category and any RBI identification before relying on the chosen layer.'],
      exceptions: ['Some categories are fixed in BL or ML irrespective of standalone size. The folder copy includes a June 2026 UL amendment; confirm the effective provision and transition before applying it.'],
      actions: ['Compliance/finance: document category, deposits, audited assets, group aggregation and RBI identification.', 'Update the dashboard profile only after the actual layer has been established.'],
      conclusion: 'DEPENDS — the currently selected layer cannot be confirmed without asset and category/group facts.',
      sources: [`${sbr}, paragraphs 10–12, 15 and 17–24 (folder copy).`], regulationId: 1, supported: true,
    };
  }

  return {
    issue: question,
    short: 'The indexed summaries identify potentially relevant directions, but do not establish a source-supported answer to this precise question. A definite YES/NO/DEPENDS position would require checking the exact provision and facts.',
    applicability: `Selected profile: ${identity}. The category, layer and product-specific triggers must be checked in the controlling direction before applying a rule.`,
    rows: [],
    analysis: ['The available research index has not established the exact operative clause for this question. The related document below is a reading lead, not a conclusion.', 'The available regulatory material presented in this answer does not expressly prescribe a definite position. No requirement or paragraph number is inferred from a document overview.'],
    exceptions: ['Applicability, exemptions, thresholds and later amendments are not verified for this query.'],
    actions: ['Open the related regulation and check its applicability and operative provision. Record the exact clause and source date before acting.'],
    conclusion: 'NOT EXPRESSLY ESTABLISHED BY THIS INDEX — further clause-level research is needed.',
    sources: [], regulationId, supported: false,
  };
}
