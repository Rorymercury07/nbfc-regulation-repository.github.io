export type ResearchRow = { source: string; provision: string; requirement: string; applicability: string };
export type CalculationGuide = { formula: string; parts: { name: string; explanation: string; source: string }[]; steps: string[]; example: string; caveat: string };
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
  calculation?: CalculationGuide;
};

type Profile = { category: string; layer: string; deposits: string; digital: boolean; customer: boolean; assetCrore?: number; publicFunds: string };

const credit = 'Reserve Bank of India (Non-Banking Financial Companies – Credit Facilities) Directions, 2025';
const capital = 'Reserve Bank of India (Non-Banking Financial Companies – Prudential Norms on Capital Adequacy) Directions, 2025';
const iracp = 'Reserve Bank of India (Non-Banking Financial Companies – Income Recognition, Asset Classification and Provisioning) Directions, 2025';
const sbr = 'Reserve Bank of India (Non-Banking Financial Companies – Registration, Exemptions and Framework for Scale Based Regulation) Directions, 2025';

export type QuestionIntent = 'concept' | 'applicability' | 'compliance' | 'specific' | 'timeline' | 'comparison';

export function classifyQuestion(question: string): QuestionIntent {
  const q = question.trim().toLowerCase();
  if (/\\bvs\\b|versus|difference between|compare/.test(q)) return 'comparison';
  if (/when|deadline|frequency|how often|how long|within|after \\d+ day/.test(q)) return 'timeline';
  if (/does .* apply|applicable|base layer|middle layer|upper layer|which nbfc|who can/.test(q)) return 'applicability';
  if (/can |may |is .* allowed|is .* permitted|prohibited|must |required to/.test(q)) return 'specific';
  if (/requirements|conditions|what do we need|documents|reporting|comply|what should/.test(q)) return 'compliance';
  return 'concept';
}

export type ConceptPrimer = { title: string; meaning: string; simple: string; why: string; example?: string; flow?: string; related: string[] };

export function getConceptPrimer(regulationId: number): ConceptPrimer | null {
  switch (regulationId) {
    case 6: return { title: 'LCR — Liquidity Coverage Ratio', meaning: 'LCR measures whether a covered NBFC has enough readily saleable high-quality liquid assets to meet stressed cash needs for the next 30 calendar days.', simple: 'It compares liquid assets after eligibility and haircut adjustments with a deliberately stressed cash-outflow estimate.', why: 'The ratio helps the NBFC withstand a short-term funding shock without immediately selling difficult assets.', related: ['HQLA', '30-day cash outflows', 'Asset-liability management', 'Liquidity stress'] };
    case 8: return { title: 'DLG — Default Loss Guarantee', meaning: 'A DLG is a promise by a qualifying service provider to compensate an NBFC for a pre-agreed share of defaults in a specified loan portfolio. It is a portfolio-level arrangement, not a waiver of the borrower’s debt.', simple: 'The NBFC makes and manages the loans. If borrowers default, the provider covers some loss up to the agreed limit. The NBFC still assesses credit and classifies each loan correctly.', why: 'DLG can share limited default risk, but it can also hide poor underwriting if misused. RBI therefore controls who can provide it, its form, its size and when it can be invoked.', example: 'Illustration: if ₹4 crore has been disbursed from a fixed DLG set, a 5% ceiling permits at most ₹20 lakh of cover at that point (₹4 crore × 5%). This is not a separate regulatory threshold.', flow: 'NBFC lends → fixed DLG set → qualifying provider gives cover → borrower defaults → NBFC recognises NPA/provision → NBFC invokes DLG', related: ['Digital lending', 'LSP', 'Credit underwriting', 'NPA', 'Provisioning'] };
    case 9: return { title: 'KYC / AML — Know Your Customer / Anti-Money Laundering', meaning: 'KYC is how an NBFC identifies its customers and understands who really owns or controls a legal-entity customer. AML controls use that information and transaction monitoring to reduce money-laundering and terrorist-financing risk.', simple: 'Before and during a customer relationship, the NBFC checks identity, assigns a risk category, updates information and monitors activity according to risk.', why: 'Reliable customer information helps prevent misuse of the financial system and supports lawful reporting and supervision.', related: ['CDD', 'Beneficial owner', 'Risk categorisation', 'Periodic KYC', 'Transaction monitoring'] };
    case 2: return { title: 'CRAR — Capital to Risk-Weighted Assets Ratio', meaning: 'CRAR compares an NBFC’s eligible regulatory capital with its risk-weighted assets. It indicates how much loss-absorbing capital supports the risks the NBFC has taken.', simple: 'A riskier loan can carry a larger risk weight. The ratio is not simply accounting equity divided by loan book.', why: 'Minimum capital buffers help an NBFC withstand credit and other losses.', related: ['Tier 1 capital', 'Tier 2 capital', 'Risk weights', 'CET1'] };
    case 3: return { title: 'NPA — Non-Performing Asset', meaning: 'An NPA is a credit asset that has crossed the applicable overdue test and must be treated as impaired under the asset-classification rules.', simple: 'When a borrower has not paid for long enough, the NBFC stops treating the loan as a normal performing asset and applies the required income and provisioning treatment.', why: 'NPA recognition prevents unpaid income and credit losses from being hidden.', example: 'Illustration: if a covered term-loan instalment remains unpaid for more than 90 days after its contractual due date, the account may meet the general NPA test. The actual facility, payment and borrower-wise rules must still be checked.', related: ['Days past due', 'Income recognition', 'Provisioning', 'Restructuring'] };
    case 1: return { title: 'SBR — Scale-Based Regulation', meaning: 'SBR places NBFCs in regulatory layers based on size, category and risk-related criteria. Different layers carry different obligations.', simple: 'First establish the type of NBFC and its correct layer; only then test whether a particular rule applies.', why: 'A rule for Middle Layer or Upper Layer must not automatically be applied to Base Layer.', related: ['Base Layer', 'Middle Layer', 'Upper Layer', 'NBFC category', 'Asset size'] };
    default: return null;
  }
}

export function frameResearchAnswer(question: string, profile: Profile, regulationId: number): ResearchAnswer {
  const q = question.toLowerCase();
  const identity = `${profile.category} · ${profile.layer} · ${profile.deposits.toLowerCase()}`;

  if (/\\bdlg\\b|default loss guarantee|loss sharing arrangement/.test(q) && /invoke|invocation/.test(q) && /120|after|deadline|when/.test(q)) {
    return {
      issue: 'Can DLG be invoked after 120 days overdue?',
      short: 'NO. Paragraph 27(1) requires the NBFC to invoke DLG within a maximum overdue period of 120 days, unless the borrower makes good the dues earlier. An invocation after that limit is not supported by this provision.',
      applicability: `This rule concerns an NBFC lender with a DLG arrangement governed by ${credit}. The selected profile is ${identity}; category coverage must first be checked under paragraph 3.`,
      rows: [{ source: credit, provision: '3; 27(1)', requirement: 'Covered lender must invoke DLG within a maximum overdue period of 120 days, unless borrower dues are made good earlier.', applicability: 'Covered NBFC lender with an active DLG arrangement.' }],
      analysis: ['RBI requirement: paragraph 27(1) fixes the maximum overdue period for invocation. It is not a 120-day period counted from the DLG agreement date.', 'What this means: monitor the loan’s overdue date and invoke within the limit if borrower dues remain unpaid.', 'Recommended practice: create an escalation well before day 120. This internal buffer is not itself a stated RBI deadline.'],
      exceptions: ['The paragraph expressly qualifies invocation where the borrower makes good the dues before that point. Check the contract’s invocation timeline under paragraph 22(3).'],
      actions: ['Operations/risk: calculate overdue days and document the invocation date and borrower-payment position.', 'Legal/compliance: verify that the enforceable contract includes the invocation timeline (paragraph 22(3)).'],
      conclusion: 'NO — paragraph 27(1) does not permit invocation beyond the maximum 120-day overdue period.',
      sources: [`${credit}, Chapter I paragraph 3; Chapter III paragraphs 22(3) and 27(1) (folder copy).`], regulationId: 8, supported: true,
    };
  }

  if (/\bdlg\b|default loss guarantee|loss sharing arrangement/.test(q)) {
    if (profile.category === 'NBFC-P2P') return {
      issue: 'Can this NBFC-P2P enter a DLG arrangement?',
      short: 'NO. An NBFC-P2P must not enter into DLG arrangements for loans facilitated over its platform (paragraph 21(2)).',
      applicability: 'The selected profile is NBFC-P2P. Paragraph 3(2)(iii) makes paragraph 21(2), but no other Credit Facilities provision, applicable to NBFC-P2P.',
      rows: [{ source: credit, provision: '3(2)(iii), 21(2)', requirement: 'Prohibits NBFC-P2P DLG for loans facilitated over its platform.', applicability: 'NBFC-P2P platform loans.' }],
      analysis: ['RBI requirement: paragraph 21(2) expressly bars the arrangement. Do not infer that the general 5% DLG permission for other covered NBFCs overrides this specific prohibition.'],
      exceptions: ['This conclusion is for loans facilitated over the P2P platform. No wider proposition about other activities is inferred.'],
      actions: ['Compliance/product: do not offer DLG on platform loans; document the paragraph 3 and 21(2) applicability decision.'],
      conclusion: 'NO — DLG on NBFC-P2P platform loans is prohibited.',
      sources: [credit + ', Chapter I paragraph 3(2)(iii); Chapter III paragraph 21(2) (folder copy).'], regulationId: 8, supported: true,
    };
    const eligibleCategory = ['NBFC-ICC', 'NBFC-MFI', 'NBFC-Factor', 'NBFC-IFC', 'NBFC-D', 'HFC', 'IDF-NBFC'].includes(profile.category);
    const limitedBL = profile.layer === 'BL';
    const applicability = eligibleCategory
      ? `The Credit Facilities Directions list ${profile.category} among covered categories and apply across layers unless stated otherwise (paragraph 3(1)). Your ${profile.layer} layer is not, by itself, an exemption. ${limitedBL ? 'For a BL entity with customer interface but no public funds, paragraph 3(2)(i) limits prudential rules; whether that limitation affects the proposed arrangement needs the public-funds fact and provision-specific analysis.' : ''}`
      : `Paragraph 3 does not make every NBFC category subject to every credit-facility rule. The selected ${profile.category} category must be checked against paragraph 3 before treating DLG as available.`;
    return {
      issue: 'Whether this NBFC can use a Default Loss Guarantee, and under what conditions',
      short: eligibleCategory
        ? `GENERALLY YES, SUBJECT TO CONDITIONS. A covered ${identity} NBFC can enter into a DLG arrangement with a qualifying provider. RBI limits cover to 5% of amounts disbursed from the fixed DLG set at any time and prescribes provider, contract, underwriting, invocation and disclosure controls (paragraphs 19–28).`
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
      conclusion: eligibleCategory ? 'GENERALLY YES, SUBJECT TO CONDITIONS — DLG is permitted for covered NBFCs, but the 5% ceiling alone does not make an arrangement compliant.' : 'DEPENDS — category-specific applicability is unresolved on the selected profile.',
      sources: [`${credit}, Chapter I paragraphs 3 and 4(1)(viii); Chapter III paragraphs 19–29 (folder copy).`],
      regulationId: 8,
      supported: true,
      calculation: {
        formula: 'Maximum DLG cover at any time = 5% × amount disbursed from the fixed, identified DLG set',
        parts: [
          { name: 'Portfolio — fixed DLG set', explanation: 'Identifiable and measurable sanctioned loan assets, frozen for this arrangement; it is not a dynamic pool.', source: 'Paragraph 24(2)' },
          { name: 'Base — disbursed amount', explanation: 'Use loans actually disbursed out of the DLG set at that time, not merely the total sanctioned amount.', source: 'Paragraph 24(1)–(3)' },
          { name: 'Limit — 5%', explanation: 'Total cover cannot exceed five per cent of the disbursed amount; implicit guarantees must not shift more equivalent performance risk.', source: 'Paragraph 24(1)' },
        ],
        steps: ['1. Identify and freeze the measurable sanctioned DLG set.', '2. Add the amount actually disbursed from that set.', '3. Multiply that disbursed amount by 5%.', '4. Compare all outstanding DLG cover on the set with the resulting ceiling.', '5. Do not reinstate invoked cover through later recoveries.'],
        example: 'Illustration only: sanctioned loans in a fixed set = ₹10 crore; actually disbursed = ₹4 crore. Maximum cover now = ₹4 crore × 5% = ₹20 lakh. A ₹50 lakh cover based on sanctioned loans would exceed the disbursement-based ceiling at this point.',
        caveat: 'This illustration is not a separate RBI threshold. Paragraphs 24–25 also govern a fixed set and non-reinstatement.',
      },
    };
  }

  if (/\blcr\b|liquidity coverage ratio|\bhqla\b|high quality liquid asset/.test(q)) {
    const alm = 'Reserve Bank of India (Non-Banking Financial Companies – Asset Liability Management) Directions, 2025';
    const categoryCovered = ['NBFC-ICC', 'NBFC-MFI', 'NBFC-Factor', 'HFC', 'IFC', 'IDF-NBFC'].includes(profile.category);
    const excludedFunds = (!profile.customer && profile.publicFunds === 'No') || (profile.layer === 'BL' && profile.customer && profile.publicFunds === 'No');
    const taking = profile.deposits === 'Deposit taking';
    const size = profile.assetCrore;
    const applies = categoryCovered && !excludedFunds && (taking || (size !== undefined && size >= 5000));
    const notApplies = !categoryCovered || excludedFunds || (!taking && size !== undefined && size < 5000);
    const sizeText = size === undefined ? 'asset size not entered' : 'assets ₹' + size + ' crore';
    const short = applies ? 'YES. Chapter III applies to this covered profile and paragraph 62 requires LCR of at least 100% on an ongoing basis. It is the stock of eligible HQLA divided by stressed net cash outflows over the next 30 calendar days.' : notApplies ? 'NOT APPLICABLE to this selected profile under the cited ALM direction. For a non-deposit-taking NBFC below ₹5,000 crore, Chapter III expressly does not apply; category/public-funds exclusions must also be checked.' : 'DEPENDS. The selected NBFC is non-deposit-taking but its asset size is not entered. Chapter III does not apply below ₹5,000 crore; enter the audited asset figure to determine this trigger.';
    return {
      issue: 'How LCR is calculated and whether it applies to this NBFC',
      short,
      applicability: 'For this NBFC: ' + profile.category + ' · ' + profile.layer + ' · ' + profile.deposits.toLowerCase() + ' · ' + sizeText + ' · public funds ' + profile.publicFunds.toLowerCase() + '. ' + (applies ? 'Paragraph 3 covers the category and the Chapter III size/deposit test is met.' : notApplies ? 'The selected category, exclusion or below-₹5,000-crore non-deposit test blocks Chapter III.' : 'The missing asset size is material to the non-deposit-taking Chapter III test.') + ' The selected SBR layer is a user entry and should be validated separately.',
      rows: [
        { source: alm, provision: '3–5; Chapter III opening', requirement: 'Lists covered/excluded categories; Chapter III does not apply to non-deposit taking NBFCs below ₹5,000 crore.', applicability: profile.category + ', deposits and assets.' },
        { source: alm, provision: '60–62', requirement: 'HQLA / 30-day net cash outflows; minimum LCR 100% ongoing, with stress-use/reporting provisos.', applicability: 'A covered entity meeting the Chapter III trigger.' },
        { source: alm, provision: '64–70', requirement: 'HQLA must be eligible/unencumbered and subject to prescribed haircuts.', applicability: 'LCR numerator.' },
        { source: alm, provision: '75–78', requirement: 'Compute stressed outflows and capped inflows, avoid double counting, disclose LCR quarterly.', applicability: 'LCR denominator, controls and disclosure.' },
      ],
      analysis: ['RBI requirement: paragraph 61 gives the formula; paragraph 62 separately sets the 100% ongoing minimum. In financial stress, HQLA may be used and a drop below 100% must be reported immediately with reasons and corrective steps.', 'RBI requirement: paragraphs 64–70 define eligible unencumbered HQLA and haircuts. HQLA is not every investment on the balance sheet.', 'RBI requirement: paragraph 76 applies 115% to relevant outflow balances, 75% to relevant inflow balances, then caps inflows at 75% of stressed outflows. Paragraph 77 prevents double counting.', 'What this means: LCR tests whether liquid assets could meet a severe 30-day cash drain; it is not cash divided by total liabilities.', 'Recommended practice: maintain exposure-level HQLA eligibility/haircut evidence and a daily stress-cash-flow reconciliation. The reconciliation format is an internal control.'],
      exceptions: ['A covered non-deposit-taking NBFC below ₹5,000 crore is outside Chapter III. CIC is covered by ALM except Chapter III (paragraph 4).', 'Paragraph 5 excludes certain categories and public-funds/customer-interface profiles.', 'Paragraph 62 permits temporary use of HQLA in financial stress, with immediate RBI reporting; that is not a routine waiver of the 100% minimum.', 'Quarterly LCR disclosure is in paragraph 78. Full supervisory return timelines are cross-referenced elsewhere and are not invented here.'],
      actions: ['Treasury: identify eligible unencumbered HQLA and apply asset-specific haircuts.', 'ALM/risk: calculate 30-day stressed cash outflows and inflows, cap inflows and avoid double counting.', 'Compliance/finance: monitor the applicable 100% floor and quarterly disclosure; if HQLA is used in stress, make the immediate report required by paragraph 62.'],
      conclusion: applies ? 'YES — LCR applies to this selected covered size/deposit profile.' : notApplies ? 'NOT APPLICABLE to this profile under the cited Chapter III trigger/exclusion.' : 'DEPENDS — enter audited asset size to resolve the non-deposit-taking ₹5,000-crore test.',
      sources: [alm + ', Chapter I paragraphs 3–5; Chapter III opening and paragraphs 60–78 (folder copy).'],
      regulationId: 6,
      supported: true,
      calculation: {
        formula: 'LCR = eligible unencumbered HQLA after required haircuts ÷ total net stressed cash outflows over the next 30 calendar days × 100',
        parts: [
          { name: 'Numerator — HQLA', explanation: 'Cash and other eligible assets readily monetised in stress; they must be unencumbered. Apply the prescribed haircut to each eligible asset and use no more than its current market value.', source: 'Paragraphs 64–70' },
          { name: 'Denominator — stressed outflows', explanation: 'Relevant 30-day liability and commitment balances multiplied by 115%.', source: 'Paragraph 76' },
          { name: 'Denominator — stressed inflows', explanation: 'Relevant 30-day receivable balances multiplied by 75%, capped at 75% of stressed outflows.', source: 'Paragraph 76' },
          { name: 'Net cash outflows', explanation: 'Stressed outflows minus the smaller of stressed inflows and 75% of stressed outflows. Do not count an HQLA asset and its associated inflow twice.', source: 'Paragraphs 76–77' },
        ],
        steps: ['1. Identify HQLA held at the stress-period start and apply eligibility rules and haircuts.', '2. Identify relevant outflows over the next 30 days and multiply balances by 115%.', '3. Identify relevant inflows over the next 30 days and multiply balances by 75%.', '4. Limit counted inflows to no more than 75% of stressed outflows.', '5. Subtract counted inflows from stressed outflows.', '6. Divide HQLA by net cash outflows and multiply by 100; compare with the 100% floor if Chapter III applies.'],
        example: 'Illustration only (₹ crore): eligible HQLA after haircuts = 120. Assume relevant 30-day outflow balances = 100, so stressed outflows = 100 × 115% = 115. Assume receivable balances = 40, so stressed inflows = 40 × 75% = 30; the 75%-of-outflows cap is 86.25, so count 30. Net cash outflows = 115 − 30 = 85. LCR = 120 ÷ 85 × 100 = 141.18%. Compare with 100% only if Chapter III applies.',
        caveat: 'All amounts are invented illustrations. Actual HQLA categories, haircuts and cash-flow items must be taken from the complete source direction.',
      },
    };
  }

  if (/\bkyc\b|\baml\b|know your customer|beneficial owner|customer due diligence|periodic updation|periodic update/.test(q)) {
    const kyc = 'Reserve Bank of India (Non-Banking Financial Companies – Know Your Customer) Directions, 2025';
    const applies = profile.customer;
    return {
      issue: 'KYC and AML requirements for this NBFC',
      short: applies ? 'YES. KYC applies to customer-facing NBFCs across layers (paragraph 3). Periodic KYC is at least every 2, 8 or 10 years for high-, medium- or low-risk customers (paragraph 42(1)).' : 'NOT APPLICABLE only if the NBFC genuinely has no customer interface under paragraph 3.',
      applicability: 'Selected profile: ' + identity + '. It is ' + (applies ? 'customer-facing.' : 'marked not customer-facing.') + ' Paragraph 3 covers all categories and layers but excludes an NBFC without customer interface.',
      rows: [
        { source: kyc, provision: '3', requirement: 'All categories/layers are covered except an NBFC with no customer interface.', applicability: 'Selected profile and actual customer interface.' },
        { source: kyc, provision: '5(1)(iv)', requirement: 'Defines beneficial owner by legal form and ownership/control.', applicability: 'Legal-entity customers.' },
        { source: kyc, provision: '41(1), 42(1)', requirement: 'Review account risk category at least every six months; update KYC on the 2/8/10-year risk schedule.', applicability: 'Covered customer accounts.' },
      ],
      analysis: ['RBI requirement: paragraph 3 uses customer interface, not ML status alone, as the key coverage test.', 'RBI requirement: paragraph 41(1) requires risk-category review at least every six months. Paragraph 42(1) requires a Board-approved, risk-based KYC update policy.', 'What this means: for an ML NBFC serving borrowers, identify relevant beneficial owners, monitor according to risk and apply the update schedule.', 'Recommended practice: keep case-level evidence and send internal reminders ahead of due dates. The reminder buffer is not itself an RBI timeline.'],
      exceptions: ['Paragraph 3 excludes NBFCs without any customer interface.', 'Paragraph 42(2) contains a limited allowance for low-risk individual customers while requiring regular monitoring; it is not a general waiver.', 'Questions about FIU reporting, CKYCR or sanctions screening need their own operative provisions.'],
      actions: ['Compliance: confirm customer-interface coverage and keep the Board-approved KYC policy.', 'Operations: identify beneficial owners of legal-entity customers.', 'AML/compliance: review risk categories six-monthly and track periodic KYC dates.'],
      conclusion: applies ? 'YES — common KYC/AML duties apply to this customer-facing profile across layers.' : 'NOT APPLICABLE only if no customer interface exists in fact.',
      sources: [kyc + ', Chapter I paragraphs 3 and 5(1)(iv); paragraphs 41(1), 42(1)–(2) (folder copy).'],
      regulationId: 9,
      supported: true,
    };
  }

  if (/\bcrar\b|capital adequacy|tier.?1|common equity tier|risk.weighted asset/.test(q)) {
    const fullCategories = ['NBFC-ICC', 'NBFC-Factor', 'IFC', 'IDF-NBFC', 'NBFC-MFI'];
    const full = fullCategories.includes(profile.category);
    const excludedByFunds = (!profile.customer && profile.publicFunds === 'No') || (profile.layer === 'BL' && profile.customer && profile.publicFunds === 'No');
    const hfc = profile.category === 'HFC';
    const mfi = profile.category === 'NBFC-MFI';
    const standardApplies = full && !excludedByFunds && (profile.layer === 'ML' || profile.layer === 'UL');
    const upperCET1 = profile.layer === 'UL' && (full || hfc) && !excludedByFunds;
    const assetText = profile.assetCrore === undefined ? 'asset size not entered' : 'assets ₹' + profile.assetCrore + ' crore';
    let short: string;
    let conclusion: string;
    if (excludedByFunds) {
      short = 'NOT APPLICABLE under the selected public-funds/customer-interface profile. Paragraph 3(6) excludes this entity from the Capital Adequacy Directions. Confirm that the profile facts are correct.';
      conclusion = 'NOT APPLICABLE under paragraph 3(6), if the selected facts are accurate.';
    } else if (hfc) {
      short = upperCET1 ? 'PARTLY APPLICABLE. For an Upper Layer HFC, paragraph 3(2) applies the 9% CET1 rule in paragraph 6(4), but does not apply the general 15% CRAR rule in paragraph 6(3). A separate HFC capital source must be checked for its total CRAR.' : 'NOT APPLICABLE as a general 15% CRAR rule from this direction. Paragraph 3(2) gives HFCs only listed provisions; paragraph 6(3) is not among them.';
      conclusion = upperCET1 ? 'PARTLY APPLICABLE — UL CET1 applies; total HFC CRAR is not established by these cited paragraphs.' : 'NOT APPLICABLE — paragraph 6(3) is not listed for HFCs.';
    } else if (standardApplies) {
      short = 'YES. The selected ' + profile.layer + ' ' + profile.category + ' is within paragraph 3 and paragraph 6(3) sets at least 15% CRAR on an ongoing basis. ' + (mfi ? 'The separate 10% Tier 1 rule in paragraph 6(2) is expressly excluded for MFI by paragraph 3.' : 'Paragraph 6(2) also sets at least 10% Tier 1.') + (upperCET1 ? ' UL also has a 9% CET1 minimum under paragraph 6(4).' : '');
      conclusion = 'YES — calculate eligible capital and RWA, then compare with the applicable ' + profile.layer + ' minima.';
    } else if (profile.layer === 'BL' && full) {
      short = 'NO universal BL 15% CRAR follows from paragraph 6(3), which addresses ML and above. Paragraph 6(1) separately sets 15% CRAR and 12% Tier 1 for an NBFC primarily engaged in gold-jewellery lending; the gold-loan share is not in this profile.';
      conclusion = 'NOT APPLICABLE as a universal BL 15% rule; a gold-primary BL exception needs the gold-loan share.';
    } else {
      short = 'NOT APPLICABLE under the general paragraph 6(3) rule for this selected category. Paragraph 3 limits or excludes application. Check a category-specific capital source rather than applying an ICC requirement.';
      conclusion = 'NOT APPLICABLE under paragraph 6(3) on this selected category/profile.';
    }
    return {
      issue: 'How CRAR is calculated and whether the minimum applies to this NBFC',
      short,
      applicability: 'For this NBFC: ' + profile.category + ' · ' + profile.layer + ' · ' + profile.deposits.toLowerCase() + ' · ' + assetText + ' · public funds ' + profile.publicFunds.toLowerCase() + '. ' + (standardApplies ? 'Paragraph 3 includes the category and paragraph 6(3) applies at ' + profile.layer + '.' : hfc ? 'Paragraph 3(2) restricts which provisions reach HFCs.' : excludedByFunds ? 'Paragraph 3(6) exclusion matches the selected facts.' : 'The general ML+ minimum cannot be imposed from paragraph 6(3) on this selected profile.') + ' The selected SBR layer is a user entry; audited assets and group/category rules must still validate it.',
      rows: [
        { source: capital, provision: '3(1)–(6)', requirement: 'Lists full, partial and excluded NBFC categories; MFI excludes paragraphs 6(1) and 6(2); HFC receives listed provisions only.', applicability: profile.category + ' and public-funds/customer-interface facts.' },
        { source: capital, provision: '6(1)–(4)', requirement: 'States CRAR = (Tier 1 + Tier 2) / RWA; gold-primary BL, ML+ and UL capital minima.', applicability: profile.layer + ' after paragraph 3 coverage.' },
        { source: capital, provision: '7–16', requirement: 'Defines CET1, owned fund, Tier 1, Tier 2, eligibility caps and regulatory deductions/adjustments.', applicability: 'Use the layer/category-specific capital composition.' },
        { source: capital, provision: '18(1)–(4)', requirement: 'Specifies on-balance risk weights and off-balance credit conversion factors / risk-weight treatment.', applicability: 'RWA denominator of a covered entity.' },
      ],
      analysis: ['RBI requirement: paragraph 6 gives the ratio and the minimum separately. A 15% floor is not the formula.', 'RBI requirement: ML Tier 1 begins with owned fund and permitted PDI after specified deductions (paragraphs 9–10, 12). UL Tier 1 uses CET1 plus eligible additional items (paragraphs 7–8, 11). Tier 2 components and limits are in paragraphs 13–14; additional adjustments are in paragraphs 15–16.', 'RBI requirement: paragraph 18(1) risk-weights on-balance assets. Paragraph 18(3)–(4) first converts relevant off-balance commitments into a credit equivalent using a CCF, then applies the counterparty risk weight.', 'What this means: shareholders’ equity divided by the loan book is not CRAR. Accounting balances can differ from eligible regulatory capital and RWA.', 'Recommended practice: retain a reconciliation from accounting balances to eligible Tier 1/Tier 2 and a risk-weight mapping by exposure. The reconciliation format is an internal control, not a separate RBI formula.'],
      exceptions: ['Paragraph 3(6) excludes some entities, including BL entities with customer interface but no public funds.', 'Paragraph 3(1) excludes MFI from paragraph 6(2), so do not automatically state a 10% Tier 1 minimum for MFI from this direction.', 'Paragraph 3(2) does not apply paragraph 6(3) to HFCs; only paragraph 6(4) among paragraph 6 provisions is listed for UL HFC.', 'Gold-primary lending is defined in paragraph 4(8) as at least 50% of financial assets in such loans and has a specific paragraph 6(1) rule. The profile does not store this activity proportion.', 'Other risk weights, credit risk mitigation, securitisation and Ind AS adjustments can change a real calculation. The example below is deliberately simplified.'],
      actions: ['Finance: determine layer-specific eligible Tier 1 and Tier 2, apply caps/deductions, and calculate RWA by asset and off-balance exposure.', 'Risk: verify risk-weight and CCF treatment for each exposure under paragraph 18.', 'Compliance: compare the resulting CRAR and any Tier 1/CET1 ratio with only the minima applicable after paragraph 3 coverage.'],
      conclusion,
      sources: [capital + ', Chapter I paragraphs 3 and 4(8); Chapter II paragraphs 6–16; Chapter III paragraph 18(1)–(4) (folder copy).'],
      regulationId: 2,
      supported: true,
      calculation: {
        formula: 'CRAR = (eligible Tier 1 capital + eligible Tier 2 capital) ÷ total risk-weighted assets × 100',
        parts: [
          { name: 'Owned fund', explanation: 'Paid-up equity, compulsory-convertible preference shares, free reserves, share premium and specified capital reserves, less accumulated losses, intangible assets and deferred revenue expenditure. It is a regulatory starting point, not simply balance-sheet equity.', source: 'Paragraph 9' },
          { name: 'CET1', explanation: 'Common Equity Tier 1 is the core common-equity and reserve capital recognised for UL after paragraph 8 deductions, including goodwill and other intangibles.', source: 'Paragraphs 7–8' },
          { name: 'Numerator — Tier 1', explanation: 'Core loss-absorbing regulatory capital. For ML, start with owned fund (paragraph 9), deduct excess group/NBFC investments, and add eligible PDI where permitted (paragraphs 10, 12). For UL, use CET1 after paragraph 8 deductions plus eligible paragraph 11 items.', source: 'Paragraphs 7–12' },
          { name: 'Numerator — Tier 2', explanation: 'Supplementary eligible capital such as qualifying general provisions, hybrid/subordinated debt and discounted revaluation reserves, subject to paragraph 13 limits. Total Tier 2 cannot exceed Tier 1 where paragraph 6 prescribes it.', source: 'Paragraphs 6(1)/(3), 13–16' },
          { name: 'Denominator — on-balance RWA', explanation: 'Multiply each relevant asset value by its prescribed risk weight, then sum. For example, cash/bank balances have 0%, ordinary good secured loans generally 100%, and specified retail consumer credit 125%.', source: 'Paragraph 18(1)–(2)' },
          { name: 'Denominator — off-balance RWA', explanation: 'For relevant commitments, apply the credit conversion factor (CCF) to the notional amount, then the applicable risk weight. A formal credit line of original maturity up to one year has a 20% CCF in the listed table.', source: 'Paragraph 18(3)–(4)' },
        ],
        steps: ['1. Determine eligible Tier 1 for the selected layer; deduct ineligible items.', '2. Determine eligible Tier 2 and apply its component and total caps.', '3. Add eligible Tier 1 and Tier 2, after any additional regulatory adjustments.', '4. Multiply each on-balance exposure by its applicable risk weight and sum.', '5. For relevant off-balance items, multiply notional amount by CCF, then by risk weight; add to RWA.', '6. Divide eligible regulatory capital by total RWA and multiply by 100.', '7. Compare the calculated ratio with the minimum actually applicable to this NBFC.'],
        example: 'Illustration only (₹ crore): assume eligible Tier 1 = 12 and eligible Tier 2 = 3, so capital = 15. Assume cash 10 × 0% = 0 RWA; ordinary secured loans 50 × 100% = 50; specified retail consumer credit 20 × 125% = 25; an undrawn formal credit line of one year or less 25 × 20% CCF × 100% risk weight = 5. Total RWA = 80. CRAR = 15 ÷ 80 × 100 = 18.75%. Compare 18.75% with this NBFC’s applicable regulatory minimum.',
        caveat: 'These figures are invented solely to teach the method. A real calculation must apply the full eligibility, deduction, risk-weight, CCF and category rules; the illustration is not a regulatory return.',
      },
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
