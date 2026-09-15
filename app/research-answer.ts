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

type Profile = { category: string; layer: string; deposits: string; digital: boolean; customer: boolean };

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
    case 8: return { title: 'DLG — Default Loss Guarantee', meaning: 'A DLG is a promise by a qualifying service provider to compensate an NBFC for a pre-agreed share of defaults in a specified loan portfolio. It is a portfolio-level arrangement, not a waiver of the borrower’s debt.', simple: 'The NBFC makes and manages the loans. If borrowers default, the provider covers some loss up to the agreed limit. The NBFC still assesses credit and classifies each loan correctly.', why: 'DLG can share limited default risk, but it can also hide poor underwriting if misused. RBI therefore controls who can provide it, its form, its size and when it can be invoked.', example: 'Illustration: if ₹4 crore has been disbursed from a fixed DLG set, a 5% ceiling permits at most ₹20 lakh of cover at that point (₹4 crore × 5%). This is not a separate regulatory threshold.', flow: 'NBFC lends → fixed DLG set → qualifying provider gives cover → borrower defaults → NBFC recognises NPA/provision → NBFC invokes DLG', related: ['Digital lending', 'LSP', 'Credit underwriting', 'NPA', 'Provisioning'] };
    case 9: return { title: 'KYC / AML — Know Your Customer / Anti-Money Laundering', meaning: 'KYC is how an NBFC identifies its customers and understands who really owns or controls a legal-entity customer. AML controls use that information and transaction monitoring to reduce money-laundering and terrorist-financing risk.', simple: 'Before and during a customer relationship, the NBFC checks identity, assigns a risk category, updates information and monitors activity according to risk.', why: 'Reliable customer information helps prevent misuse of the financial system and supports lawful reporting and supervision.', related: ['CDD', 'Beneficial owner', 'Risk categorisation', 'Periodic KYC', 'Transaction monitoring'] };
    case 2: return { title: 'CRAR — Capital to Risk-Weighted Assets Ratio', meaning: 'CRAR compares an NBFC’s eligible regulatory capital with its risk-weighted assets. It indicates how much loss-absorbing capital supports the risks the NBFC has taken.', simple: 'A riskier loan can carry a larger risk weight. The ratio is not simply accounting equity divided by loan book.', why: 'Minimum capital buffers help an NBFC withstand credit and other losses.', related: ['Tier 1 capital', 'Tier 2 capital', 'Risk weights', 'CET1'] };
    case 3: return { title: 'NPA — Non-Performing Asset', meaning: 'An NPA is a credit asset that has crossed the applicable overdue test and must be treated as impaired under the asset-classification rules.', simple: 'When a borrower has not paid for long enough, the NBFC stops treating the loan as a normal performing asset and applies the required income and provisioning treatment.', why: 'NPA recognition prevents unpaid income and credit losses from being hidden.', related: ['Days past due', 'Income recognition', 'Provisioning', 'Restructuring'] };
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
