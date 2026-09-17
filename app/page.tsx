'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, ArrowUpRight, BadgeIndianRupee, BookOpen, CalendarDays, CheckCircle2, ChevronRight, Clock3, Compass, FileText, GraduationCap, Landmark, Network, Route, Scale, Search, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { frameResearchAnswer } from './research-answer';
import { ResearchPanel } from './research-panel';
import { LayerPanel } from './layer-panel';
import { RegulationsWorkbench } from './regulations-workbench';

type Regulation = { id: number; title: string; short: string; category: string; layers: string[]; status: 'Core' | 'Specialist' | 'Reference'; updated: string; summary: string; highlights: string[] };
type RegulationDetail = { applies: string; requirements: string[]; timing: string[]; checks: string[]; related: number[] };
type ThresholdDetail = { value: string; label: string; note: string; tone: string; source: string; clause: string; meaning: string; test: string[]; layers: Record<'BL' | 'ML' | 'UL', { result: string; detail: string; clause: string }>; caution: string; regulationId: number };

type WebMcpTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute(input: unknown): unknown | Promise<unknown>;
};

declare global {
  interface Document {
    readonly modelContext?: {
      registerTool(tool: WebMcpTool, options?: { signal?: AbortSignal }): void | Promise<void>;
    };
  }
}

function Checkbox({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return <input type="checkbox" checked={checked} onChange={(event) => onCheckedChange(event.target.checked)} className="size-4 accent-primary" />;
}

const regulations: Regulation[] = [
  { id: 1, title: 'Registration & Scale Based Regulation', short: 'Registration', category: 'Perimeter', layers: ['BL','ML','UL'], status: 'Core', updated: '01 Jul 2026', summary: 'Determines registration, exemptions, category, layer and minimum net owned fund—the starting point for every analysis.', highlights: ['BL/ML threshold: ₹1,000 crore', 'UL threshold: ₹1,00,000 crore', 'Principal business: 50–50 test'] },
  { id: 2, title: 'Capital Adequacy', short: 'Capital', category: 'Prudential', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'Sets regulatory capital composition, deductions, risk weights, leverage and ICAAP expectations.', highlights: ['ML+: CRAR 15%', 'ML+: Tier 1 10%', 'UL: CET1 9%'] },
  { id: 3, title: 'Income Recognition, Asset Classification & Provisioning', short: 'IRACP', category: 'Prudential', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'Controls overdue recognition, borrower-wise NPA classification, income reversal, upgrading and provisioning.', highlights: ['NPA: generally >90 days', 'Substandard provision: 10%', 'Upgrade after all arrears are cleared'] },
  { id: 4, title: 'Resolution of Stressed Assets', short: 'Resolution', category: 'Credit risk', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'Provides early-warning, review, inter-creditor, restructuring and project-finance resolution rules.', highlights: ['Review period: 30 days', 'ICA vote: 75% value + 60% number', 'Delayed RP provision: up to 35%'] },
  { id: 5, title: 'Concentration Risk Management', short: 'Concentration', category: 'Prudential', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'Sets different exposure-control chapters for BL, ML and UL, subject to category and public-funds exclusions.', highlights: ['BL: Board/internal limits', 'ML: ordinary 25% single / 40% group', 'UL: separate large-exposure framework'] },
  { id: 6, title: 'Asset Liability Management', short: 'ALM & LCR', category: 'Liquidity', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'Governs maturity mismatches, liquidity governance, stress testing, contingency funding and LCR.', highlights: ['1–7 day mismatch: 10%', '8–14 day mismatch: 10%', 'LCR: 100%'] },
  { id: 7, title: 'Responsible Business Conduct', short: 'Conduct', category: 'Conduct', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'The main customer-protection direction for KFS, APR, charges, recovery, prepayment and collateral release.', highlights: ['KFS for retail/MSME term loans', 'Property papers: 30 days', 'Delay compensation: ₹5,000/day'] },
  { id: 8, title: 'Credit Facilities', short: 'Credit facilities', category: 'Products', layers: ['BL','ML','UL'], status: 'Core', updated: 'Dec 2025', summary: 'Product rules for digital lending, DLG, gold/silver, MFI, project finance, IPO and housing loans.', highlights: ['DLG cap: 5%', 'MFI income: ≤₹3 lakh', 'Gold LTV: 75%–85%'] },
  { id: 9, title: 'Know Your Customer', short: 'KYC / AML', category: 'Financial crime', layers: ['BL','ML','UL'], status: 'Core', updated: '29 Dec 2025', summary: 'Customer acceptance, identification, beneficial ownership, monitoring, sanctions and FIU reporting.', highlights: ['Periodic KYC: 2 / 8 / 10 years', 'CKYCR upload: 10 days', 'Records: at least 5 years'] },
  { id: 10, title: 'Governance', short: 'Governance', category: 'Governance', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'Board composition, fit-and-proper, committees, CRO/CCO, compensation, subsidiaries and UL listing.', highlights: ['CRO above ₹5,000 crore', 'ID: max 3 ML/UL Boards', 'UL listing: within 3 years'] },
  { id: 11, title: 'Managing Risks in Outsourcing', short: 'Outsourcing', category: 'Operations', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'Accountability, vendor due diligence, contracts, audit access, cloud controls and cyber reporting.', highlights: ['NBFC remains accountable', 'Core decisions cannot be outsourced', 'Cyber report: within 6 hours'] },
  { id: 12, title: 'Credit Information Reporting', short: 'CIC reporting', category: 'Reporting', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'CIC membership, fortnightly reporting, corrections, customer alerts and complaint compensation.', highlights: ['All four CICs', 'Submit within 7 days', 'Delay compensation: ₹100/day'] },
  { id: 13, title: 'Financial Statements & Disclosures', short: 'Disclosures', category: 'Reporting', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'Financial-statement presentation, Ind AS prudential overlays and extensive Notes to Accounts.', highlights: ['Year-end: 31 March', 'Finalise within 3 months', 'Regulatory impairment reserve'] },
  { id: 14, title: 'Transfer & Distribution of Credit Risk', short: 'Loan transfer', category: 'Credit risk', layers: ['BL','ML','UL'], status: 'Specialist', updated: '28 Nov 2025', summary: 'Loan transfers, stressed-loan sales and co-lending, with true risk transfer and due-diligence safeguards.', highlights: ['MHP: 3 or 6 months', 'Co-lender retention: 10%', 'Partner booking: 15 days'] },
  { id: 15, title: 'Securitisation Transactions', short: 'Securitisation', category: 'Credit risk', layers: ['BL','ML','UL'], status: 'Specialist', updated: '28 Nov 2025', summary: 'Eligibility, MHP/MRR, STC criteria, supporting facilities, investor due diligence and capital.', highlights: ['MRR: 5% or 10%', 'RMBS MRR: 5%', 'STC tests apply continuously'] },
  { id: 16, title: 'Wilful & Large Defaulters', short: 'Defaulters', category: 'Enforcement', layers: ['ML','UL'], status: 'Specialist', updated: '28 Nov 2025', summary: 'Natural-justice process, reporting, penal measures, guarantors and preventive controls.', highlights: ['Wilful default: ₹25 lakh', 'Large default: ₹1 crore', 'Show-cause response: 21 days'] },
  { id: 17, title: 'Acceptance of Public Deposits', short: 'Deposits', category: 'Funding', layers: ['ML','UL'], status: 'Specialist', updated: '28 Nov 2025', summary: 'Eligibility, rating, tenor, ceiling, liquid assets, premature repayment and depositor protection.', highlights: ['Tenor: 12–60 months', 'Deposit ceiling: 1.5× NOF', 'Liquid assets: 15%'] },
  { id: 18, title: 'Credit Cards — Issuance & Conduct', short: 'Credit cards', category: 'Products', layers: ['BL','ML','UL'], status: 'Specialist', updated: '28 Nov 2025', summary: 'Prior approval, issuance, billing, consent, closure, co-branding, defaults and grievances.', highlights: ['Minimum NOF: ₹100 crore', 'Closure: 7 working days', 'Delay penalty: ₹500/day'] },
  { id: 19, title: 'Declaration of Dividends', short: 'Dividends', category: 'Prudential', layers: ['BL','ML','UL'], status: 'Specialist', updated: '28 Nov 2025', summary: 'Capital and NNPA eligibility, payout ceilings, exceptional profits and post-declaration reporting.', highlights: ['NNPA: below 6%', 'Ordinary payout cap: 50%', 'Limited route: 10% payout'] },
  { id: 20, title: 'Acquisition of Shareholding or Control', short: 'Ownership', category: 'Corporate actions', layers: ['BL','ML','UL'], status: 'Specialist', updated: '28 Nov 2025', summary: 'Prior RBI approval and public-notice requirements for takeover, control and material share transfers.', highlights: ['Share threshold: 26%', 'Public notice: 30 days', 'FATF investor cap: below 20%'] },
  { id: 21, title: 'Undertaking of Financial Services', short: 'Financial services', category: 'Corporate actions', layers: ['BL','ML','UL'], status: 'Specialist', updated: '05 Dec 2025', summary: 'AIFs, overseas investment, insurance, mutual funds, NPS and other financial-service activities.', highlights: ['AIF contribution: 10%', 'Overseas total: 100% NOF', 'Single overseas entity: 15%'] },
  { id: 22, title: 'Branch Authorisation', short: 'Branches', category: 'Corporate actions', layers: ['BL','ML','UL'], status: 'Specialist', updated: '28 Nov 2025', summary: 'Domestic branch expansion, gold-loan branch approval, closure and overseas representative offices.', highlights: ['Deposit branch notice: 30 days', 'Closure notice: 3 months', 'Gold branches >1,000 need approval'] },
  { id: 23, title: 'Voluntary Amalgamation', short: 'Amalgamation', category: 'Corporate actions', layers: ['BL','ML','UL'], status: 'Specialist', updated: '28 Nov 2025', summary: 'RBI NOC/prior approval before approaching NCLT or Court for an NBFC amalgamation.', highlights: ['RBI step comes first', '26% equity-change test', '>30% director-change test'] },
  { id: 24, title: 'Investment Portfolio', short: 'Investments', category: 'Treasury', layers: ['BL','ML','UL'], status: 'Specialist', updated: '28 Nov 2025', summary: 'Classification, valuation, government securities, corporate-bond reporting, AIFs and derivatives.', highlights: ['OTC bonds: report in 15 minutes', 'Derivatives for hedging', 'Board investment policy'] },
  { id: 25, title: 'Climate Finance & Green Deposits', short: 'Green deposits', category: 'Funding', layers: ['ML','UL'], status: 'Specialist', updated: '28 Nov 2025', summary: 'Green-deposit policy, financing framework, eligible use, assurance, impact assessment and disclosures.', highlights: ['INR deposits only', 'Annual external assurance', 'Impact report on website'] },
  { id: 26, title: 'Credit Risk Management', short: 'Credit risk', category: 'Credit risk', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'Appraisal, connected lending, related directors/senior officers, end-use, LEI and security registration.', highlights: ['Enhanced appraisal ≥₹5 crore', 'No loans on own shares', 'Board conflict controls'] },
  { id: 27, title: 'Miscellaneous Directions', short: 'Miscellaneous', category: 'Operations', layers: ['BL','ML','UL'], status: 'Reference', updated: '26 Feb 2026', summary: 'NCD private placement, factoring, electronic payments, virtual-currency CDD and general operating rules.', highlights: ['NCD minimum: ₹20,000', 'No partnership/LLP capital', 'Factoring 50–50 test'] },
  { id: 28, title: 'Payment & Settlement Systems Act, 2007', short: 'PSS Act', category: 'Payments', layers: ['Reference'], status: 'Reference', updated: 'Through 2019', summary: 'RBI authorisation and supervision of payment systems, settlement finality, inspections, directions and offences.', highlights: ['RBI authorisation required', 'Settlement finality protected', 'Electronic dishonour remedy'] },
];

const thresholds: ThresholdDetail[] = [
  {
    value: '₹1,000 cr', label: 'BL → ML', note: 'Asset-size threshold', tone: 'blue', regulationId: 1,
    source: 'RBI (NBFC – Registration, Exemptions and Framework for Scale Based Regulation) Directions, 2025',
    clause: 'Paragraphs 10(1), 11(2), 17–23; see paragraphs 12 and 24 for Upper Layer',
    meaning: '₹1,000 crore is the main asset-size boundary between Base Layer and Middle Layer for a non-deposit taking NBFC. It is not the only test: deposit status, activity category and group aggregation can place an NBFC in ML even where its own assets are lower.',
    test: ['Check the latest audited total assets and monitor when the threshold is crossed during the year.', 'Aggregate registered NBFC assets under common control for the group test.', 'Check whether the category is fixed in BL or ML irrespective of size.', 'Record the conclusion and the date from which the new layer requirements apply.'],
    layers: {
      BL: { result: 'Normally below ₹1,000 crore', detail: 'A non-deposit taking NBFC below ₹1,000 crore is generally BL, subject to activity-based placement. P2P, Account Aggregator, NOFHC and the specified Type I category remain in BL.', clause: 'Paragraphs 10 and 15(1)' },
      ML: { result: '₹1,000 crore or more—or included by activity', detail: 'A non-deposit taking NBFC enters ML on reaching ₹1,000 crore. All deposit-taking NBFCs and specified categories such as CIC, HFC and IFC are ML or UL regardless of this threshold. Group assets may also pull ICC, MFI, Factor and MGC entities into ML.', clause: 'Paragraphs 11, 15(2)–(3), 17–23' },
      UL: { result: 'Separate ₹1,00,000 crore test', detail: '₹1,000 crore does not by itself place an NBFC in UL. Under the June 2026 amendment reflected in the folder copy, UL comprises NBFCs with assets of ₹1,00,000 crore or more, with RBI identification and transition requirements.', clause: 'Paragraphs 12, 24 and 27' },
    },
    caution: 'Layer classification is not a pure standalone asset test. Deposit-taking status, activity category, group structure and RBI identification must all be checked.',
  },
  {
    value: '15%', label: 'CRAR', note: 'General ML+ minimum', tone: 'teal', regulationId: 2,
    source: 'RBI (NBFC – Prudential Norms on Capital Adequacy) Directions, 2025',
    clause: 'Paragraph 3 (applicability) and paragraph 6(1)–(4)',
    meaning: 'CRAR compares eligible regulatory capital with risk-weighted assets. The general 15% minimum in this direction is expressly stated for Middle Layer and above; additional capital composition requirements apply by layer and category.',
    test: ['Confirm that the entity is within paragraph 3 and is not excluded.', 'Calculate risk-weighted assets using the prescribed risk weights.', 'Deduct ineligible items from Tier 1 and Tier 2 capital.', 'Test the ratio continuously—not only on the reporting date.'],
    layers: {
      BL: { result: 'No universal 15% ML+ rule', detail: 'The general paragraph 6(3) minimum is written for ML and above. A gold-jewellery lending NBFC covered by paragraph 6(1) has 15% CRAR and 12% Tier 1. Category-specific rules and paragraph 3 exclusions must still be checked.', clause: 'Paragraphs 3, 6(1) and 6(3)' },
      ML: { result: 'CRAR ≥15%; Tier 1 ≥10%', detail: 'ML entities covered by the direction must maintain at least 15% CRAR on an ongoing basis, with Tier 1 of at least 10%. Tier 2 cannot exceed 100% of Tier 1.', clause: 'Paragraphs 6(2) and 6(3)' },
      UL: { result: 'CRAR ≥15%; Tier 1 ≥10%; CET1 ≥9%', detail: 'UL inherits the ML capital minima and must additionally maintain Common Equity Tier 1 of at least 9% of risk-weighted assets.', clause: 'Paragraphs 6(2), 6(3) and 6(4)' },
    },
    caution: 'The direction has entity-specific inclusions and exclusions in paragraph 3. Do not apply the headline percentage without first confirming category and layer applicability.',
  },
  {
    value: '>90 days', label: 'NPA', note: 'General overdue test', tone: 'amber', regulationId: 3,
    source: 'RBI (NBFC – Income Recognition, Asset Classification and Provisioning) Directions, 2025',
    clause: 'Paragraphs 43–44 for BL, paragraph 51 for ML, and paragraph 56 for UL',
    meaning: 'For covered NBFCs, a loan or other specified credit asset generally becomes non-performing when interest or principal remains overdue for more than 90 days. Classification is borrower-wise where the direction requires it.',
    test: ['Calculate days past due consistently from the contractual due date.', 'Apply the test across all relevant facilities of the same borrower.', 'Stop or reverse income recognition as required once the account becomes NPA.', 'Apply the correct sub-standard, doubtful or loss classification and provision.'],
    layers: {
      BL: { result: '>90 days from 31 March 2026', detail: 'Paragraph 43 contains the BL asset types and an older 180-day formulation. Paragraph 44 replaces that period through a completed glide path, reaching more than 90 days by 31 March 2026 for applicable BL entities.', clause: 'Paragraphs 42–44' },
      ML: { result: '>90 days', detail: 'For ML, paragraph 51 directly applies the more-than-90-day test to interest, term-loan instalments, demand/call loans, bills and other listed assets.', clause: 'Paragraphs 50–51' },
      UL: { result: '>90 days through ML rules', detail: 'UL applies the ML asset-classification requirements in paragraphs 50–53 mutatis mutandis, in addition to the common rules.', clause: 'Paragraph 56 read with paragraphs 50–53' },
    },
    caution: 'Paragraph 10 excludes certain categories and profiles. Product-specific or restructuring rules may also change the analysis, so check the full borrower and facility facts.',
  },
  {
    value: '5%', label: 'DLG cap', note: 'Defined loan portfolio', tone: 'red', regulationId: 8,
    source: 'RBI (NBFC – Credit Facilities) Directions, 2025',
    clause: 'Paragraph 24(1)–(3); read with paragraphs 3 and 19–28',
    meaning: 'A Default Loss Guarantee cannot exceed 5% of the amount disbursed from the identified, fixed loan portfolio at any time. A DLG does not replace credit appraisal, NPA recognition or provisioning.',
    test: ['Define and freeze the identifiable DLG set before measuring the cover.', 'Measure the cap against the amount disbursed—not merely the sanctioned amount.', 'Use only permitted DLG forms and a legally enforceable contract.', 'Track invocation, non-reinstatement, capital treatment and monthly disclosure.'],
    layers: {
      BL: { result: 'Applies when a covered BL entity uses DLG', detail: 'The Credit Facilities Directions apply across layers to the listed NBFC categories unless stated otherwise. For BL profiles, first check paragraph 3 limitations, including the treatment of customer-facing entities without public funds.', clause: 'Paragraphs 3 and 24' },
      ML: { result: '5% cap applies', detail: 'A covered ML entity entering a DLG arrangement must apply the 5% cap, provider due diligence, permitted-form, contract, NPA and disclosure requirements.', clause: 'Paragraphs 19–28, especially 24' },
      UL: { result: '5% cap applies', detail: 'The same DLG cap and Chapter III controls apply to a covered UL entity. Higher-layer governance does not increase the permitted percentage.', clause: 'Paragraphs 3 and 19–28, especially 24' },
    },
    caution: 'NBFC-P2P cannot enter DLG arrangements for loans facilitated on its platform under paragraph 21(2). Confirm the entity is covered by paragraph 3 before applying the cap.',
  },
];

const categoryOptions = ['All categories', ...Array.from(new Set(regulations.map((r) => r.category)))];

const entityGuidance: Record<string, string> = {
  'NBFC-ICC': 'A general lending and investment NBFC. Start with registration, prudential, lending-conduct, KYC and governance rules.',
  'NBFC-MFI': 'An NBFC focused on collateral-free microfinance. Household-income, repayment-burden, pricing and recovery protections need special attention.',
  'NBFC-Factor': 'An NBFC whose principal business is factoring. Check the factoring activity tests, assignment documents and debtor-level controls.',
  HFC: 'A housing finance company. Apply the NBFC framework together with housing-finance product, funding and customer-protection requirements.',
  CIC: 'A core investment company holding group investments. Group structure, leverage, capital and governance are the main starting points.',
  IFC: 'An infrastructure finance company. Infrastructure asset tests, concentration limits, funding and capital treatment become central.',
  'IDF-NBFC': 'An infrastructure debt fund NBFC. Review permitted assets, funding structure, capital and concentration requirements.',
  'NBFC-P2P': 'A peer-to-peer lending platform. Platform-only activities, participant limits, fund flows, disclosures and technology controls apply.',
  'Account Aggregator': 'A consent-based financial-data intermediary. Data consent, security, permitted activity and outsourcing controls are the priority.',
  SPD: 'A standalone primary dealer. Securities-market activity, capital, risk management and RBI reporting require specialist review.',
};

const layerGuidance: Record<string, string> = {
  BL: 'Base Layer is the starting rule set. It carries foundational registration, conduct, KYC, governance and prudential duties.',
  ML: 'Middle Layer adds stronger capital, governance, concentration, liquidity and disclosure controls on top of Base Layer rules.',
  UL: 'Upper Layer is subject to the most intensive framework, including enhanced capital, governance, listing and supervisory expectations.',
};

const categoryConsequences: Record<string, string> = {
  Perimeter: 'Getting this wrong can make the entire compliance conclusion unreliable because category and layer decide which later rules apply.',
  Prudential: 'These rules protect solvency and the balance sheet. Breaches can restrict growth, distributions and supervisory standing.',
  'Credit risk': 'These rules control how credit is originated, monitored, transferred and resolved, limiting losses and hidden risk.',
  Liquidity: 'These rules help ensure the NBFC can meet cash obligations even during stress.',
  Conduct: 'These rules protect borrowers and make pricing, recovery and servicing fair and transparent.',
  Products: 'These rules translate regulatory expectations into product design, customer journeys and system controls.',
  'Financial crime': 'These controls help prevent identity misuse, money laundering, sanctions breaches and reportable transaction failures.',
  Governance: 'These rules make the Board and senior management demonstrably accountable for regulatory outcomes.',
  Operations: 'These rules keep accountability with the NBFC even when technology or services are delivered by another party.',
  Reporting: 'Accurate, timely reporting is how regulators and customers receive a reliable view of the NBFC and its borrowers.',
  Enforcement: 'These rules require a fair, evidence-based process before serious borrower labels and restrictions are applied.',
  Funding: 'These rules protect depositors and ensure funding is raised, held and deployed within permitted safeguards.',
  'Corporate actions': 'These rules prevent ownership, control or structural changes from taking effect without required regulatory review.',
  Treasury: 'These rules control valuation, dealing, concentration and capital effects in the investment book.',
  Payments: 'These rules protect authorisation, settlement finality and the integrity of payment-system operations.',
};

const regulationDetails: Record<number, RegulationDetail> = {
  1: { applies: 'Every company assessing whether it is an NBFC, the registration category it requires, and its placement in Base, Middle or Upper Layer.', requirements: ['Apply the 50–50 principal-business test to financial assets and financial income.', 'Identify category-specific NOF and activity conditions before applying for or varying registration.', 'Aggregate assets of registered NBFCs under common control when testing the ₹1,000 crore Middle Layer threshold.', 'Treat higher layers as inheriting lower-layer rules unless a direction expressly excludes them.'], timing: ['The July 2026 Upper Layer threshold is ₹1,00,000 crore.', 'An identified UL entity files a Board-approved plan within 3 months and complies within 24 months.', 'NOF glide-path requirements for ICC/MFI/Factor run to 31 March 2027.'], checks: ['Document category, asset size, public funds, customer interface and group structure.', 'Obtain annual Board resolution/disclosure before relying on the Type-I exemption.', 'Reassess layer and exemptions after any funding, customer-interface or group change.'], related: [2, 5, 10] },
  2: { applies: 'Only categories and profiles covered by paragraph 3. The general 15% CRAR rule is ML+, with separate BL gold-lender and leverage provisions and restricted HFC/CIC coverage.', requirements: ['Maintain ML+ CRAR of at least 15% and Tier 1 of at least 10%; UL maintains CET1 of 9%.', 'Cap Tier 2 at Tier 1 and apply the Base Layer leverage ceiling of 7 where applicable.', 'Deduct goodwill, specified deferred tax assets, own shares, excess exposures, outstanding DLG and specified unrealised gains.', 'Apply prescribed risk weights, including 125% for most consumer credit subject to product exclusions.'], timing: ['Monitor capital continuously and report on the applicable RBI return cycle.', 'Run forward-looking capital assessment before dividends, acquisitions, rapid growth or material product launches.'], checks: ['Reconcile regulatory capital to audited equity and Ind AS adjustments.', 'Maintain a deduction register and risk-weight mapping by product.', 'Stress capital for concentration, credit migration, liquidity events and growth plans.'], related: [3, 5, 19] },
  3: { applies: 'Loan and advance portfolios of NBFCs, with layer- and product-specific overlays for overdue recognition and provisioning.', requirements: ['Classify asset quality borrower-wise, not facility-wise, and upgrade only after all relevant arrears are cleared.', 'Use the >90-day NPA norm for ML/UL and the completed BL glide path from 31 March 2026.', 'Provide 10% on substandard assets; apply ageing-based secured and 100% unsecured provisioning for doubtful assets.', 'Appropriate any regulatory provision shortfall against Ind AS ECL to an Impairment Reserve.'], timing: ['SMA-0: up to 30 days; SMA-1: >30–60; SMA-2: >60–90 days.', 'CRILC coverage applies at aggregate exposure of ₹5 crore and above.'], checks: ['Align DPD and NPA status across all borrower facilities.', 'Automate income reversal, suspense accounting and upgrade controls.', 'Reconcile ECL, regulatory provisions and Impairment Reserve each reporting date.'], related: [4, 12, 13] },
  4: { applies: 'Specified lenders resolving defaults, stressed accounts, restructurings, compromise settlements and project-finance stress.', requirements: ['Begin a 30-day review period on default and decide the resolution strategy.', 'Use an ICA where multiple lenders are involved; approval is 75% by value and 60% by number.', 'Obtain independent credit evaluation for qualifying restructuring/change-of-ownership plans.', 'Continue criminal or penal action where compromise involves fraud or wilful default.'], timing: ['20% additional provision after 180 days from review-period end; another 15% at 365 days from review commencement.', 'Exposure ≥₹100 crore needs one evaluation; ≥₹500 crore needs two.', 'Board-set cooling period after compromise settlement must be at least 12 months.'], checks: ['Record default date, review milestones, ICA votes and implementation evidence.', 'Track liquidation-value protection for dissenting lenders.', 'Apply downgrade, ageing and satisfactory-performance conditions before upgrade.'], related: [3, 16, 26] },
  5: { applies: 'Covered BL, ML and UL entities, with different chapters and paragraph 3 category/public-funds exclusions. HFC, MGC and SPD have restricted coverage.', requirements: ['Use BL Board-approved concentration policies and internal limits where Chapter II applies.', 'Apply ML Chapter III single/group norms only to covered ML entities, including category and infrastructure modifications.', 'For UL, use the separate Chapter IV Large Exposure Framework rather than copying ML limits.', 'Maintain Board limits for sensitive sectors and aggregate exposure to other NBFCs.'], timing: ['Test headroom before sanction, enhancement, disbursement and material market-value movement.', 'Escalate breaches immediately and implement an approved rectification plan.'], checks: ['Maintain a single counterparty/group master across lending, investments and guarantees.', 'Reconcile exposure values to eligible Tier 1 capital.', 'Capture infrastructure/IFC add-ons and Board exceptions separately.'], related: [2, 24, 26] },
  6: { applies: 'NBFCs under applicable ALM rules; LCR generally covers deposit-taking NBFCs and non-deposit-taking NBFCs with assets of ₹5,000 crore or more.', requirements: ['Maintain cumulative negative mismatch within 10% for 1–7 days, 10% for 8–14 days and 20% for 15–30/31 days.', 'Maintain LCR of at least 100% over a 30-day stress period where applicable.', 'Cap recognised inflows at 75% of outflows and hold unencumbered HQLA.', 'Maintain Board-approved liquidity risk tolerance, stress tests and contingency funding plan.'], timing: ['Monitor short buckets frequently enough to prevent a breach, not only at reporting dates.', 'Refresh stress assumptions and contingency-funding contacts periodically.'], checks: ['Reconcile contractual and behavioural cash flows.', 'Identify encumbrance, concentration and monetisation time for liquid assets.', 'Test survival horizons under institution-specific and market-wide stress.'], related: [2, 17, 25] },
  7: { applies: 'All customer-facing NBFC lending, with added protections for retail, MSME, individual and MFI borrowers.', requirements: ['Issue clear terms, annualised pricing, penal-charge disclosures and communications in a language understood by the borrower.', 'Provide the standard KFS with APR and amortisation for retail/MSME term loans; undisclosed charges need explicit consent.', 'Do not capitalise penal charges or disguise them as penal interest.', 'Release original property documents and charges within 30 days after full repayment/settlement.'], timing: ['KFS validity: at least 3 working days for tenor ≥7 days and 1 working day for shorter loans.', 'From 1 January 2026, specified floating-rate loans cannot carry prepayment charges.', 'Attributable document-release delay: ₹5,000 per day.'], checks: ['Reconcile sanction letter, KFS, loan agreement and system charges.', 'Restrict general recovery calls to 8 a.m.–7 p.m.; MFI recovery to 9 a.m.–6 p.m.', 'Track collateral documents from custody through release.'], related: [8, 11, 12] },
  8: { applies: 'NBFCs offering digital loans, DLG-backed portfolios, gold/silver loans, MFI credit, project finance, IPO finance or housing products.', requirements: ['Keep digital disbursal and repayment directly between the NBFC and borrower bank accounts, subject to stated exceptions.', 'Pay LSP fees directly and retain responsibility for LSP/DLA conduct, privacy and compliance.', 'Cap eligible DLG at 5% of the frozen disbursed portfolio and preserve ordinary NPA/provisioning.', 'For MFI, test household income ≤₹3 lakh and monthly debt obligations ≤50% of household income.'], timing: ['Digital cooling-off period is at least 1 day.', 'DLG invocation must occur no later than 120 days overdue.', 'Gold/silver rules apply no later than 1 April 2026.'], checks: ['Maintain DLA/LSP inventory, website disclosures and consent logs.', 'Test gold LTV continuously: 85% / 80% / 75% by loan-size band.', 'Evidence assay, storage, auction notice and collateral return.'], related: [7, 9, 11] },
  9: { applies: 'All regulated NBFC customer relationships, beneficial owners, authorised signatories, PEPs and monitored transactions.', requirements: ['Operate Board-approved customer acceptance, identification, risk management and transaction-monitoring programmes.', 'Do not open or continue anonymous/fictitious relationships or relationships where CDD cannot be completed.', 'Identify beneficial ownership, screen sanctions and apply enhanced checks to PEP relationships.', 'File required FIU reports without tipping off the customer.'], timing: ['Periodic KYC: high risk 2 years, medium 8 years, low 10 years.', 'Customer document changes: 30 days; new CKYCR upload: 10 days; update: 7 days.', 'Retain transaction records at least 5 years and identification records 5 years after relationship end.'], checks: ['Separate Designated Director and Principal Officer responsibilities.', 'Apply OTP-only account limits and complete full CDD within 1 year.', 'Document risk rating, alerts, disposition and ongoing due diligence.'], related: [8, 11, 12] },
  10: { applies: 'All NBFC Boards, with enhanced committee, function, personnel and listing duties for Middle and Upper Layer entities.', requirements: ['Maintain fit-and-proper assessment, conflicts controls and at least one director with banking/NBFC experience.', 'ML/UL establishes Audit and Nomination & Remuneration Committees plus an independent compliance function.', 'NBFCs above ₹5,000 crore appoint an independent CRO with fixed tenure and documented views on material credit proposals.', 'Apply restrictions on KMP and independent-director positions across ML/UL entities.'], timing: ['Complete periodic fit-and-proper declarations and Board review.', 'An identified UL entity must list within 3 years, subject to applicable direction.'], checks: ['Map each regulatory duty to a Board/committee charter and calendar.', 'Keep succession, remuneration, independence and conflict records current.', 'Track subsidiary governance and information flows.'], related: [2, 19, 20] },
  11: { applies: 'All material outsourced activities and applicable IT/cloud outsourcing arrangements of an NBFC.', requirements: ['The NBFC and Board remain accountable; strategy, compliance, KYC decisions, sanction and portfolio management generally remain in-house.', 'Perform vendor due diligence and execute enforceable contracts covering confidentiality, audit/RBI access, BCP, subcontracting and exit.', 'Use need-to-know access, strong IAM/MFA, encryption, logging, resilience and secure data-purge controls.', 'Maintain an inventory and materiality classification for outsourced arrangements.'], timing: ['Applicable cyber incidents detected by the provider must be reported by the NBFC to RBI within 6 hours.', 'Test BCP/DR and exit arrangements periodically and before material renewals.'], checks: ['Link every material service to an owner, risk assessment and audit plan.', 'Verify data location, tenant separation and regulator access.', 'Track fourth parties and concentration risk.'], related: [7, 9, 10] },
  12: { applies: 'NBFCs required to be members of CICs and report borrower credit information.', requirements: ['Maintain membership of all four CICs where applicable.', 'Submit accurate borrower data fortnightly for the 15th and month-end reference dates.', 'Correct and resubmit rejected records and operate a time-bound dispute process.', 'Notify customers as required when information is submitted or corrected.'], timing: ['Submit within 7 calendar days of each reporting date.', 'Correct rejected records within 7 days.', 'Complaint timeline: 30 days overall—21 days for the credit institution and 9 days for CIC; delay costs ₹100/day.'], checks: ['Reconcile bureau files to the loan system and general ledger.', 'Monitor rejection, ageing, disputes and compensation.', 'Align borrower identifiers and NPA status across all facilities.'], related: [3, 7, 9] },
  13: { applies: 'All NBFC financial statements, with Ind AS and layer-specific regulatory disclosures where applicable.', requirements: ['Use 31 March as financial year-end and present required schedules and Notes to Accounts.', 'Bridge Ind AS ECL to RBI prudential provisions and create the Impairment Reserve for any shortfall.', 'Disclose capital, asset quality, exposures, liquidity, related parties, complaints and category-specific information.', 'Keep regulatory classifications consistent with returns and public disclosures.'], timing: ['Finalise the annual financial statements within 3 months of year-end, subject to applicable company-law requirements.', 'Update disclosures for every reporting period and material post-balance-sheet event.'], checks: ['Tie disclosures to audited ledgers and RBI returns.', 'Maintain a disclosure checklist with owner and evidence.', 'Obtain governance review of judgements, overlays and restatements.'], related: [2, 3, 19] },
  14: { applies: 'Originators and transferees in loan transfers, stressed-loan sales and co-lending arrangements.', requirements: ['Transfer economic interest, risks and rewards without concealed support or an obligation to reacquire.', 'Use cash, arm’s-length transactions and independent transferee due diligence.', 'Where a full pool review is impracticable, review at least one-third by value and number and retain at least 10% economic interest.', 'In co-lending, each regulated entity retains at least 10% of every loan and the customer receives one interface and blended-rate KFS.'], timing: ['MHP: 3 months for loans up to 2 years and 6 months for longer loans.', 'Co-lending partner booking: within 15 calendar days; SMA/NPA alignment: by next working day.', 'Revised co-lending framework applies from 1 January 2026.'], checks: ['Document true-sale analysis, valuation, due diligence and servicing.', 'Route co-lending flows through escrow and reconcile partner books.', 'Track unrealised gains and capital deductions.'], related: [3, 4, 15] },
  15: { applies: 'NBFC originators and investors in securitisation exposures.', requirements: ['Meet eligibility, true-sale, MHP and minimum retention requirements.', 'Retain MRR unhedged and unencumbered throughout the transaction.', 'Use STC capital treatment only while every simple, transparent and comparable criterion remains satisfied.', 'Investors perform and document independent due diligence, monitoring and stress testing.'], timing: ['MRR: 5% for loans up to 24 months, 10% for longer/bullet loans and 5% for RMBS.', 'Test continuing STC eligibility and investor monitoring throughout the exposure life.'], checks: ['Maintain pool stratification, cash-flow waterfall and servicing controls.', 'Evidence retention, disclosure and no implicit support.', 'Reassess capital after trigger events or structural changes.'], related: [2, 3, 14] },
  16: { applies: 'Lenders examining large-default and wilful-default cases, borrowers, promoters and capable guarantors.', requirements: ['Examine NPA accounts at or above ₹25 lakh for wilful-default indicators.', 'Use separate Identification and Review Committees with reasoned decisions and natural-justice safeguards.', 'Report qualifying borrowers/guarantors to CICs and apply prescribed credit restrictions.', 'Continue penal and recovery processes independently of compromise settlement.'], timing: ['Show-cause response: 21 days; Review Committee representation: 15 days.', 'Where indicated, classification should finish within 6 months of NPA classification.', 'No additional credit while listed and for 1 year after removal; no new-venture credit for 5 years after removal.'], checks: ['Evidence capacity to pay, diversion, siphoning, security disposal or guarantee failure.', 'Keep committee membership independent and records complete.', 'Submit monthly CIC updates.'], related: [3, 4, 12] },
  17: { applies: 'Authorised NBFC-D and deposit-taking HFCs; non-authorised NBFCs must not accept public deposits.', requirements: ['Hold an annual fixed-deposit rating of at least BBB- and accept only 12–60 month deposits.', 'Cap aggregate public deposits at 1.5 times NOF and interest at 12.5% p.a.', 'Maintain 15% prescribed unencumbered liquid assets, including at least 10% approved securities.', 'Maintain full asset cover and a registered floating charge through a trust deed for depositors.'], timing: ['Notify maturity at least 14 days in advance.', 'Ordinary lock-in is 3 months, subject to death/emergency exceptions.', 'Measure liquid assets against deposits on the last working day of the second preceding quarter.'], checks: ['Confirm authorisation and rating before solicitation or renewal.', 'Monitor branch eligibility, depositor registers and liquid-asset encumbrance.', 'Apply prescribed premature-payment rates and claim process.'], related: [6, 22, 25] },
  18: { applies: 'NBFCs issuing credit cards or co-branded cards and their outsourced/co-branding partners.', requirements: ['Obtain RBI approval and maintain minimum NOF of ₹100 crore before issuing cards.', 'Issue only with explicit consent; disclose pricing, billing, interest calculation and default reporting.', 'Control co-branding, data access, telemarketing and recovery practices.', 'Provide effective blocking, closure, dispute and grievance channels.'], timing: ['Close a card within 7 working days after a valid request and dues clearance.', 'Delay in eligible closure attracts ₹500 per day.', 'Apply notice and correction processes before reporting default.'], checks: ['Evidence consent and delivery/activation.', 'Reconcile statements, charges and interest to disclosed methodology.', 'Audit partner access and complaint outcomes.'], related: [7, 9, 12] },
  19: { applies: 'NBFCs proposing dividend declarations, subject to category-specific payout caps and prudential eligibility.', requirements: ['Meet applicable capital requirements for the preceding 3 financial years and the current year.', 'Keep NNPA below 6% in each of the preceding 3 years for the ordinary route.', 'Apply ordinary payout caps: generally 50%, with 60% for CIC/SPD.', 'Exclude or appropriately treat exceptional profits in the payout calculation.'], timing: ['A limited 10% route may apply when current capital is met and NNPA is below 4%.', 'Report the declaration and prudential position as prescribed after Board approval.'], checks: ['Recalculate CRAR, Tier 1/CET1, leverage and NNPA before recommendation.', 'Document distributable profit and exceptional items.', 'Preserve a post-dividend capital buffer under stress.'], related: [2, 3, 13] },
  20: { applies: 'Proposed takeovers, acquisition of control and cumulative transfers/acquisitions of material NBFC shareholding.', requirements: ['Obtain prior RBI approval for takeover/control and for cumulative acquisition or transfer of 26% or more of paid-up equity.', 'Conduct fit-and-proper, source-of-funds and ownership-chain review of incoming holders.', 'Keep aggregate investment from FATF non-compliant jurisdictions below 20% of existing and potential voting power.', 'Complete the prescribed public-notice process after approval and before the transaction.'], timing: ['Publish public notice at least 30 days before transfer of ownership/control.', 'Seek approval before signing/closing arrangements that create effective control.'], checks: ['Calculate direct, indirect, beneficial and acting-in-concert holdings.', 'Map Board changes and veto/contractual control rights.', 'Align RBI approval, company-law filings and closing conditions.'], related: [10, 21, 23] },
  21: { applies: 'NBFC investments or activities in AIFs, overseas entities, insurance/mutual-fund distribution, NPS and other financial services.', requirements: ['From 1 January 2026, cap one NBFC’s AIF contribution at 10% of scheme corpus; regulated entities collectively at 20%.', 'Apply proportionate 100% provision where >5% AIF contribution combines with qualifying downstream debtor investment.', 'Obtain prior RBI approval for overseas subsidiary/JV/investment and stay within 100% of NOF aggregate and 15% in one overseas entity.', 'Keep distribution voluntary, suitable and unlinked to credit; do not assure returns.'], timing: ['Test AIF downstream investments and capital/provisioning continuously.', 'Obtain approval before overseas commitment, remittance or structural change.'], checks: ['Maintain look-through data for AIFs and debtor connections.', 'Confirm profitability, NNPA, capital and KYC conditions for overseas activity.', 'Separate agency/distribution revenue and customer consent.'], related: [2, 20, 24] },
  22: { applies: 'NBFCs opening, relocating or closing domestic branches, gold-loan branches or overseas representative offices.', requirements: ['Follow NOF/rating-based branch geography rules for deposit-taking NBFCs.', 'Gold-loan ICCs require prior RBI approval to exceed 1,000 branches.', 'Do not open an overseas branch; an approved representative office may only perform liaison/market research without funds outlay.', 'Protect customers, records and complaints during relocation or closure.'], timing: ['Eligible deposit branch expansion requires 30-day RBI notice/non-rejection.', 'Give customers 3 months’ notice for closure, subject to applicable exceptions.', 'Secure prior approval before opening an overseas representative office.'], checks: ['Maintain branch master, authorisation and business/activity scope.', 'Check security, cash, gold custody and record-transfer controls.', 'Publish notices and preserve servicing access.'], related: [17, 20, 23] },
  23: { applies: 'Schemes of voluntary amalgamation where one or more parties is an NBFC.', requirements: ['Approach RBI for NOC/prior approval before filing the scheme with NCLT or Court.', 'Assess whether the scheme changes control, 26% or more shareholding, or more than 30% of directors.', 'Provide financial, prudential, ownership, governance and scheme information requested by RBI.', 'Protect depositor/creditor and customer continuity through the combination.'], timing: ['RBI step precedes the NCLT/Court step.', 'Build approval conditions and regulatory timelines into the transaction schedule.'], checks: ['Map each party’s regulatory status and post-merger category/layer.', 'Pro forma test capital, NOF, concentration and asset quality.', 'Plan CoR, returns, systems, contracts and customer communications.'], related: [1, 20, 22] },
  24: { applies: 'NBFC treasury and investment portfolios, including government securities, corporate bonds, AIFs and derivatives.', requirements: ['Follow Board-approved classification, valuation, impairment and dealing policies.', 'Report OTC corporate-bond trades within 15 minutes as applicable.', 'Use derivatives for permitted hedging and maintain documentation and effectiveness controls.', 'Apply AIF, related-party, concentration and capital-deduction overlays.'], timing: ['Mark and reconcile investments at each reporting date and more frequently for traded books.', 'Report eligible market transactions within prescribed market-infrastructure timelines.'], checks: ['Separate trading, settlement, custody and valuation duties.', 'Use independent prices and exception escalation.', 'Monitor issuer/group limits, encumbrance and liquidity.'], related: [2, 5, 21] },
  25: { applies: 'Authorised deposit-taking NBFC-D and deposit-taking HFC under paragraph 3. Middle or Upper Layer status without deposit-taking authorisation is not enough.', requirements: ['Accept eligible green deposits in INR under a Board-approved policy and financing framework.', 'Allocate proceeds only to permitted green activities and manage temporary unallocated balances as prescribed.', 'Obtain annual independent third-party assurance on allocation.', 'Publish required allocation and impact information.'], timing: ['External assurance is annual.', 'Impact assessment and website reporting follow the applicable annual disclosure cycle.'], checks: ['Maintain project eligibility and exclusion taxonomy.', 'Trace each deposit rupee to allocation, balance and maturity.', 'Control greenwashing through evidence, governance and methodology disclosure.'], related: [6, 13, 17] },
  26: { applies: 'All NBFC credit underwriting, sanction, monitoring and related-party/connected-lending decisions.', requirements: ['Use enhanced appraisal for exposures of ₹5 crore and above.', 'Do not lend against the NBFC’s own shares and control lending to directors, senior officers and related interests.', 'Verify end use and register security/charges as applicable.', 'Obtain and report LEI for covered large borrowers and transactions.'], timing: ['Complete appraisal and conflict checks before sanction/disbursement.', 'Monitor end use and covenants through the loan life.'], checks: ['Keep delegation, rating, appraisal and deviation evidence.', 'Aggregate connected exposures before approval.', 'Track CERSAI/security perfection and post-disbursement documents.'], related: [4, 5, 10] },
  27: { applies: 'NBFC activities not fully covered by a specialist direction, including private NCD placement, factoring, electronic payments and virtual-asset CDD.', requirements: ['Apply the NCD private-placement framework, including the ₹20,000 minimum denomination where relevant.', 'Do not contribute capital to partnership firms or LLPs where prohibited.', 'For factoring status, apply the applicable 50–50 asset/income test and registration conditions.', 'Apply enhanced CDD and risk controls for permitted virtual-asset related exposure or transactions.'], timing: ['Use the direction updated 26 February 2026 for current interpretation.', 'Complete market and regulatory reporting within the transaction-specific deadline.'], checks: ['Confirm no specialist direction overrides the miscellaneous rule.', 'Map each activity to approval, limit, documentation and return requirements.', 'Escalate novel products before launch.'], related: [1, 9, 21] },
  28: { applies: 'Operators and participants in payment, clearing and settlement systems regulated under the Payment and Settlement Systems Act, 2007.', requirements: ['No person other than RBI may operate a payment system without RBI authorisation.', 'Comply with RBI standards, information requests, inspections and affirmative or cease-and-desist directions.', 'Apply statutory settlement finality and collateral protections within authorised system rules.', 'Use the statutory dispute framework and electronic funds-transfer dishonour remedy where applicable.'], timing: ['Obtain authorisation before commencing payment-system operations.', 'Follow the procedural timelines in authorisation, inspection, direction and offence provisions.'], checks: ['Determine whether the proposed arrangement is a payment system under the Act.', 'Maintain system rules, participant agreements, security and settlement records.', 'Route participant disputes to the correct panel/RBI/Central Government forum.'], related: [8, 9, 11] },
};

const regulatoryBoxes = [
  ['Registration', 'CoR, NOF, principal-business test', [1]],
  ['Classification', 'Category and BL / ML / UL placement', [1, 10]],
  ['Prudential', 'Capital, leverage, IRACP, provisioning', [2, 3, 5]],
  ['Lending', 'KFS, pricing, penal charges, recovery', [7, 8]],
  ['KYC / AML', 'CDD, beneficial owner, CKYCR, FIU', [9]],
  ['Digital lending', 'LSP, DLA, data and fund flows', [8, 11]],
  ['Outsourcing', 'Vendor diligence, contracts, monitoring', [11]],
  ['Governance', 'Board, committees, policies, fit-and-proper', [10, 19]],
  ['Reporting', 'CIC, financial statements, regulatory returns', [12, 13]],
  ['Corporate actions', 'Control, branches, merger, investments', [20, 21, 22, 23]],
] as const;

const issuePaths = [
  { title: 'Launch an unsecured MSME loan through an app', chain: ['ICC authority & layer', 'Product terms and underwriting', 'KFS, APR and penal charges', 'Digital lending and LSP controls', 'KYC, data consent and privacy', 'Grievance and CIC reporting'], regulations: [1, 7, 8, 9, 11, 12] },
  { title: 'A borrower has defaulted', chain: ['Days past due and SMA status', 'Borrower-wise asset classification', 'Income reversal and provisioning', 'Review and resolution route', 'Recovery-conduct limits', 'CIC / CRILC reporting'], regulations: [3, 4, 7, 12] },
  { title: 'Acquire 30% of an NBFC', chain: ['Beneficial holding and control test', 'Prior RBI approval', 'Fit-and-proper and source of funds', '30-day public notice', 'Closing conditions and post-change governance'], regulations: [20, 10, 23] },
  { title: 'Engage a new LSP or cloud vendor', chain: ['Activity and materiality', 'Non-outsourcable functions', 'Vendor and fourth-party diligence', 'Contract and RBI audit access', 'Data, BCP and cyber controls', 'Ongoing monitoring and exit'], regulations: [8, 9, 11] },
  { title: 'Accept public deposits', chain: ['Authorisation and NBFC-D status', 'Rating and deposit ceiling', 'Tenor, pricing and disclosures', 'Liquid assets and asset cover', 'Branch and maturity rules', 'ALM and LCR overlay'], regulations: [17, 6, 22] },
  { title: 'Declare a dividend', chain: ['Three-year capital record', 'NNPA eligibility', 'Payout-ratio calculation', 'Exceptional-profit treatment', 'Board approval and reporting'], regulations: [19, 2, 3, 13] },
];

const practiceCases = [
  { title: 'Is this Middle Layer capital ratio enough?', facts: 'A covered ML NBFC has ₹100 crore risk-weighted assets and ₹18 crore eligible regulatory capital. Its eligible Tier 1 capital is ₹11 crore.', prompt: 'Calculate CRAR and Tier 1. Does it clear the general minima?', answer: 'CRAR = ₹18 crore ÷ ₹100 crore = 18%. Tier 1 ratio = ₹11 crore ÷ ₹100 crore = 11%. Both exceed the general ML floors of 15% and 10%. This checks only the stated ratios: verify paragraph 3 coverage, deductions and all other capital conditions.', source: 'Capital Adequacy Directions, 2025, paragraphs 3 and 6(2)–(3)', regulationId: 2 },
  { title: 'Is a loan 75 days overdue already an NPA?', facts: 'A covered ML NBFC has a term-loan instalment 75 days overdue. No restructuring or special product rule is given.', prompt: 'Is the account NPA under the general overdue test?', answer: 'Not on the more-than-90-day overdue test alone. It may need earlier warning/monitoring, but the facts do not establish an NPA. Check other facilities of the same borrower and any special classification trigger before concluding.', source: 'IRACP Directions, 2025, paragraphs 50–51', regulationId: 3 },
  { title: 'Can an LSP give a 10% default-loss guarantee?', facts: 'A covered NBFC wants DLG of ₹2 crore over an identified portfolio with ₹20 crore already disbursed.', prompt: 'Does the proposed guarantee stay within the regulatory cap?', answer: 'No. ₹2 crore ÷ ₹20 crore = 10%; the general cap is 5% of the amount disbursed from the fixed, identifiable portfolio, or ₹1 crore on these facts. Provider, contract, form, invocation and disclosure conditions still need review.', source: 'Credit Facilities Directions, 2025, paragraphs 3 and 24(1)–(3)', regulationId: 8 },
];

const beginnerSteps = [
  { number: '01', title: 'What is an NBFC?', body: 'Understand the principal-business test, registration perimeter and why an NBFC is not a bank.', ids: [1] },
  { number: '02', title: 'Which type of NBFC?', body: 'Identify whether the business is an ICC, MFI, Factor, HFC, CIC, P2P, Account Aggregator or another category.', ids: [1] },
  { number: '03', title: 'What is Scale Based Regulation?', body: 'Learn how size, activity and perceived risk place an NBFC in Base, Middle or Upper Layer.', ids: [1] },
  { number: '04', title: 'What changes by layer?', body: 'Compare capital, governance, concentration, liquidity and disclosure requirements across BL, ML and UL.', ids: [1, 2, 5, 6, 10, 13] },
  { number: '05', title: 'How does an NBFC operate?', body: 'See how lending, KYC, customer conduct, reporting, technology and outsourcing fit together.', ids: [7, 8, 9, 11, 12] },
  { number: '06', title: 'How do I reach a legal conclusion?', body: 'Use applicability, trigger, obligation, exception and reporting evidence before reading the final clause.', ids: [1] },
];

type FoundationAnswer = {
  question: string;
  meaning: string;
  source: string;
  applicability: string;
  how: string;
  conditions: string[];
  example: string;
  impact: string;
  relatedIds: number[];
};

const foundationAnswers: FoundationAnswer[] = [
  {
    question: 'What is an NBFC?',
    meaning: 'An NBFC is a company whose principal business is a financial activity such as lending, making advances or acquiring securities, but which is not a bank. Being incorporated as a company is not enough: the nature and scale of the actual business determine whether the company falls within the NBFC perimeter.',
    source: 'Sections 45-I(c), 45-I(f) and 45-IA of the Reserve Bank of India Act, 1934, read with the RBI (NBFC – Registration, Exemptions and Framework for Scale Based Regulation) Directions, 2025.',
    applicability: 'Start with every company carrying on financing, investment, asset-finance or another financial activity. Then check statutory exemptions, RBI exemptions and whether another specialist regulatory category applies.',
    how: 'Apply the principal-business test to both financial assets and income from financial assets. If the business falls within the statutory definition and no exemption applies, the company generally needs an RBI Certificate of Registration and the prescribed minimum Net Owned Fund before commencing or carrying on NBFC business.',
    conditions: ['The entity must be a company.', 'Financial activity must be its principal business; the commonly used test examines whether financial assets exceed 50% of total assets and income from financial assets exceeds 50% of gross income.', 'A Certificate of Registration under section 45-IA is generally required unless a valid exemption applies.', 'An NBFC cannot accept demand deposits, issue cheques drawn on itself like a bank, or describe itself as a bank.'],
    example: 'A company whose assets and income are mainly generated from MSME loans is likely within the NBFC perimeter. A manufacturing company that occasionally gives an inter-corporate loan is not automatically an NBFC merely because it earned some interest.',
    impact: 'Before launching a product, taking funding or drafting a compliance checklist, document the principal-business calculation, registration status, NBFC category, deposit status and SBR layer. A wrong perimeter conclusion makes every later applicability conclusion unreliable.',
    relatedIds: [1, 2, 7],
  },
  {
    question: 'Which type of NBFC is it?',
    meaning: '“NBFC” is the umbrella. The category identifies the permitted or principal activity and therefore the specialist rules that sit on top of the common NBFC framework.',
    source: 'Paragraph 6 of the RBI Registration and Scale Based Regulation Directions, 2025, together with the relevant specialist directions for ICCs, MFIs, Factors, HFCs, CICs, IFCs, IDF-NBFCs, P2P platforms and Account Aggregators.',
    applicability: 'Every registered NBFC must identify its correct activity-based category. Category is determined from the business actually carried on, regulatory conditions and prescribed asset or income tests—not simply from the name appearing in corporate records.',
    how: 'Begin with the business model. A general lender or investor is normally an NBFC-ICC. Then test whether specialist criteria redirect it to MFI, Factor, HFC, CIC, IFC, IDF-NBFC, P2P, Account Aggregator, SPD or another category. After category, identify deposit status, asset size, SBR layer and operating overlays.',
    conditions: ['Use current audited and management data to test activity, asset and income thresholds.', 'Check whether the proposed product is permitted for that category.', 'Apply the common directions plus every category-specific direction.', 'Reassess classification when the business mix, group structure, assets or customer interface changes.'],
    example: 'A company making ordinary secured and unsecured business loans will usually begin with the NBFC-ICC definition. If at least the prescribed proportion of its assets is deployed toward infrastructure lending, the IFC category must be tested instead.',
    impact: 'Keep a one-page identity record: category, CoR number, deposit status, layer, asset size, NOF, main products, digital lending, LSPs and group entities. This becomes the first page of every regulatory analysis.',
    relatedIds: [1, 8, 9],
  },
  {
    question: 'What is Scale Based Regulation?',
    meaning: 'Scale Based Regulation places NBFCs into Base, Middle, Upper and Top Layers so that regulatory intensity increases with size, activity, complexity and perceived systemic risk.',
    source: 'RBI (NBFC – Registration, Exemptions and Framework for Scale Based Regulation) Directions, 2025, particularly the layer framework and classification provisions.',
    applicability: 'The framework applies across NBFC categories, but placement is not a single asset-size test. Deposit-taking status, activity-based placement, group aggregation and RBI identification can alter the result.',
    how: 'Identify category and deposit status first; calculate asset size and relevant group assets; apply fixed category placement; then test whether RBI has identified the entity for Upper Layer. Higher layers generally inherit lower-layer requirements and add stricter obligations.',
    conditions: ['A non-deposit-taking NBFC below the relevant threshold is generally BL unless activity rules place it elsewhere.', 'All deposit-taking NBFCs and specified categories are at least ML.', 'UL placement follows the applicable quantitative and RBI identification framework.', 'Layer changes require a documented transition plan and implementation of additional controls.'],
    example: 'A non-deposit-taking NBFC-ICC below ₹1,000 crore will generally begin in BL. If it crosses ₹1,000 crore or group aggregation applies, ML requirements must be tested even though its products remain unchanged.',
    impact: 'Maintain a layer-assessment file and a gap analysis covering capital, governance, concentration, liquidity, disclosures and reporting. Recheck it at every material asset or group-structure change.',
    relatedIds: [1, 2, 5, 6],
  },
  {
    question: 'What changes by layer?',
    meaning: 'The layer determines regulatory intensity. Base Layer carries the common foundation; Middle Layer adds stronger prudential and governance controls; Upper Layer adds enhanced capital, governance, disclosure and supervisory expectations.',
    source: 'The SBR provisions in the RBI Registration Directions, read with the Capital Adequacy, Concentration Risk, ALM, Governance and Financial Statement Directions.',
    applicability: 'Compare only provisions that apply to the NBFC’s category and activity. A specialist direction may apply across layers, while a particular obligation may begin only at ML or UL.',
    how: 'Build a matrix with BL, ML and UL as columns. For each subject—NOF, leverage, CRAR, concentration, LCR, governance, disclosures and reporting—record applicable, not applicable or applicable with modification.',
    conditions: ['Do not assume that every BL requirement disappears in ML or UL; higher layers generally inherit it.', 'Check category-specific exclusions and thresholds.', 'Separate continuous requirements from periodic and event-based requirements.', 'Record the effective date and transition period for a layer movement.'],
    example: 'A general ML NBFC must normally maintain the prescribed CRAR and Tier 1 minimum. A UL NBFC inherits those requirements and adds the applicable CET1 and enhanced governance or disclosure expectations.',
    impact: 'Use a layer-wise compliance register with provision, owner, evidence, frequency and status. This prevents a headline threshold from being applied without its exceptions or transition rules.',
    relatedIds: [1, 2, 5, 6, 10, 13],
  },
  {
    question: 'How does an NBFC operate?',
    meaning: 'An NBFC operates through connected compliance systems: product approval and underwriting, customer disclosures, KYC/AML, disbursement and servicing, asset classification, recovery, outsourcing, reporting and governance.',
    source: 'The RBI Credit Facilities, Responsible Business Conduct, KYC, IRACP, Outsourcing, Governance and Credit Information Reporting Directions, 2025.',
    applicability: 'The common controls apply to ordinary lending NBFCs, while product, customer, digital, outsourcing and funding features add overlays. The exact set depends on the identity profile and transaction.',
    how: 'Trace a product through its lifecycle: authority to offer it → underwriting → KYC → sanction/KFS → disbursement → servicing → monitoring/NPA → recovery or resolution → CIC and regulatory reporting → closure and record retention.',
    conditions: ['Obtain Board-approved policies and delegated authority before launch.', 'Give the borrower prescribed disclosures and fair treatment.', 'Keep regulated decisions and accountability with the NBFC even where an LSP or vendor is used.', 'Maintain evidence that operational systems match the regulatory rule.'],
    example: 'An app-based MSME loan requires the ICC and layer analysis, underwriting controls, KFS and APR disclosure, digital-lending fund-flow and data controls, KYC, LSP oversight, grievance handling and CIC reporting.',
    impact: 'Convert each direction into a regulation → requirement → action → owner → frequency → evidence register. Compliance becomes an operating system rather than a collection of PDF notes.',
    relatedIds: [7, 8, 9, 11, 12],
  },
  {
    question: 'How do I reach a regulatory conclusion?',
    meaning: 'A reliable conclusion connects the legal source to the entity and facts. Finding a paragraph containing the right words is only the beginning.',
    source: 'Use the RBI Act, the governing Master Direction, later amendments or circulars, applicable FAQs/clarifications and the NBFC’s implementing policy or SOP—in that order.',
    applicability: 'Use this method for every NBFC question, including lending, NPA classification, recovery, KYC, digital lending, governance, outsourcing and reporting.',
    how: 'First identify the subject and governing direction. Then apply the seven-part answer: Meaning → Regulatory source → Applicability → How it works → Key regulatory conditions → Example → Practical/compliance impact.',
    conditions: ['Read the objective, applicability, definitions, operative provision and annexures first.', 'Classify the language as mandatory, prohibition, conditional or guidance.', 'Separate prudential classification from contractual or legal enforcement rights.', 'Check amendments, effective dates, exceptions, reporting and documentary evidence before concluding.'],
    example: 'A 90-day NPA rule determines regulatory classification, income recognition and provisioning. It does not by itself say that contractual recovery action must wait for 90 days; that requires a separate legal and contractual analysis.',
    impact: 'End every note with one of three outcomes—Applicable, Not applicable, or Applicable with modification—followed by the required action, owner, deadline and evidence to retain.',
    relatedIds: [1, 3, 7],
  },
];

const regulatoryMap = [
  { stage: 'Entry & identity', prompt: 'Can we become or remain an NBFC?', body: 'Registration, CoR, principal business, NOF, category and SBR layer.', ids: [1], tone: 'border-blue-200 bg-blue-50 text-blue-950' },
  { stage: 'Running the business', prompt: 'What must we do every day?', body: 'Capital, lending, NPA, KYC, conduct, governance, reporting, digital lending and outsourcing.', ids: [2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 26], tone: 'border-emerald-200 bg-emerald-50 text-emerald-950' },
  { stage: 'Funding & specialist activity', prompt: 'Are we entering a special product or transaction?', body: 'Deposits, securitisation, loan transfer, investments, credit cards and green deposits.', ids: [14, 15, 17, 18, 24, 25], tone: 'border-amber-200 bg-amber-50 text-amber-950' },
  { stage: 'Change, ownership & structure', prompt: 'Is the institution or its control changing?', body: 'Shareholding, control, branches, financial services, amalgamation and dividends.', ids: [19, 20, 21, 22, 23], tone: 'border-violet-200 bg-violet-50 text-violet-950' },
];

const problemTopics = [
  ['Starting an NBFC', 'Registration & category', [1]], ['Minimum capital', 'NOF & capital adequacy', [1, 2]], ['Giving loans', 'Credit and conduct', [7, 8, 26]], ['When a loan becomes NPA', 'Asset classification', [3]], ['Interest or penal charges', 'Pricing & disclosure', [7]], ['Recovering a loan', 'Recovery conduct & resolution', [4, 7]], ['Customer complaints', 'Grievance & CIC correction', [7, 12]], ['KYC and AML', 'Identity & monitoring', [9]], ['Lending through an app', 'Digital lending', [8, 11]], ['Using a third-party vendor', 'Outsourcing', [11]], ['Reporting borrower data', 'CIC reporting', [12]], ['Changing shareholders', 'Control approval', [20]], ['Changing directors', 'Governance', [10]], ['Accepting deposits', 'Public deposits', [17]], ['Declaring a dividend', 'Distribution conditions', [19]],
] as const;

type LearningModule = {
  number: number;
  title: string;
  question: string;
  concepts: string;
  answer: string;
  flow: string[];
  example: string;
  whatIf: string;
  terms: string[];
  ids: number[];
  next: string;
};

const learningModules: LearningModule[] = [
  { number: 1, title: 'NBFC Fundamentals', question: 'A company lends money but is not a bank. What exactly is it?', concepts: 'What is an NBFC, purpose, NBFC vs bank and RBI’s role', answer: 'An NBFC is a company whose principal business is a regulated financial activity such as lending or investment. It can perform many activities people associate with banks, but it is not a bank: it cannot accept demand deposits or issue cheques drawn on itself, and it operates under a different RBI framework.', flow: ['Company carries on financial activity', 'Principal-business and exemption tests are applied', 'RBI registration and the correct NBFC category are identified'], example: 'A company mainly earning from MSME loans is likely to fall within the NBFC perimeter. A manufacturer that occasionally gives one inter-corporate loan is not automatically an NBFC.', whatIf: 'What if financial activity is only a small side business? The company may fail the principal-business test, so the facts and financial statements must be checked before concluding.', terms: ['NBFC', 'Principal business', 'CoR', 'RBI'], ids: [1], next: 'How did NBFCs become such an important part of India’s financial system?' },
  { number: 2, title: 'Evolution of NBFCs in India', question: 'Why did India need NBFCs alongside banks?', concepts: 'History, regulatory evolution and major milestones', answer: 'NBFCs grew by serving borrowers, products and regions that conventional banking did not always reach efficiently. As the sector became larger and more connected, regulation evolved from basic registration and deposit protection toward prudential norms, customer protection and the present Scale Based Regulation framework.', flow: ['Specialised non-bank finance expands', 'Failures and systemic links lead to stronger RBI oversight', 'Scale Based Regulation aligns intensity with size and risk'], example: 'A small local finance company and a systemically significant nationwide lender may both be NBFCs, but their potential impact is very different. Modern regulation recognises that difference.', whatIf: 'What if every NBFC followed exactly the same rulebook? Smaller entities could face disproportionate requirements, while the largest and most complex firms might receive too little scrutiny.', terms: ['Prudential regulation', 'Systemic risk', 'SBR', 'Customer protection'], ids: [1, 2, 7], next: 'If NBFCs do different jobs, how do we identify the right type?' },
  { number: 3, title: 'Types of NBFCs', question: 'Are all NBFCs really the same business?', concepts: 'ICC, MFI, Factor, IFC, CIC, P2P, AA, HFC and other categories', answer: 'NBFC is an umbrella term. The category tells you the main activity: ordinary lending and investment, microfinance, factoring, housing finance, infrastructure finance, group investment, peer-to-peer facilitation or consent-based account aggregation. Category decides which specialist rules sit on top of the common framework.', flow: ['Understand the actual business model', 'Apply the category definition and activity tests', 'Add the specialist direction to the common NBFC rules'], example: 'An NBFC-ICC may finance an MSME term loan. An NBFC-Factor primarily acquires receivables. An Account Aggregator transmits consented financial data and does not lend that money.', whatIf: 'What if the company name says “microfinance” but its portfolio does not meet the regulatory test? The label is not decisive; actual business and prescribed thresholds control the category.', terms: ['ICC', 'MFI', 'Factor', 'HFC', 'CIC', 'P2P', 'AA', 'IFC'], ids: [1, 8], next: 'Two NBFC-ICCs can look similar—so why might RBI regulate them differently?' },
  { number: 4, title: 'Scale Based Regulation', question: 'Why does the size and risk of an NBFC change the rules?', concepts: 'Base, Middle, Upper and Top Layers', answer: 'Scale Based Regulation places NBFCs into layers so regulatory intensity increases with size, activity, complexity and perceived systemic risk. Base Layer is the foundation; Middle and Upper Layers add stronger prudential, governance and disclosure expectations. The Top Layer is intended to remain empty unless exceptional systemic risk requires it.', flow: ['Identify category and deposit status', 'Test asset size, activity placement and group aggregation', 'Confirm whether RBI has identified the entity for Upper Layer'], example: 'A non-deposit-taking NBFC-ICC below ₹1,000 crore generally begins in BL. Crossing ₹1,000 crore may move it to ML, while UL depends on the applicable framework and RBI identification rather than a self-selected label.', whatIf: 'What if one small NBFC belongs to a group with several other NBFCs? Group aggregation can affect Middle Layer classification even if that individual entity is below the threshold.', terms: ['BL', 'ML', 'UL', 'TL', 'Group aggregation'], ids: [1, 2, 5, 6, 10], next: 'Once the category and layer are known, how does an NBFC actually start?' },
  { number: 5, title: 'Starting an NBFC', question: 'You want to start an MSME lender. What must happen before the first loan?', concepts: 'Incorporation, NOF, RBI registration and Certificate of Registration', answer: 'The promoter first creates the company and designs the permitted business. The company must meet the applicable Net Owned Fund and ownership conditions, prepare its governance and operating framework, apply to RBI and obtain the correct Certificate of Registration before carrying on regulated NBFC business.', flow: ['Incorporate and fund the company', 'Build the business plan, policies, systems and governance', 'Obtain RBI CoR and become operationally ready before lending'], example: 'A proposed MSME lender should not treat company incorporation as permission to lend as an NBFC. Its capital, directors, source of funds, systems and regulatory application all form part of readiness.', whatIf: 'What if the company starts lending before receiving its CoR? Incorporation alone does not satisfy the RBI registration requirement and may expose the company and promoters to regulatory action.', terms: ['NOF', 'CoR', 'Promoter', 'Operational readiness'], ids: [1, 10, 26], next: 'If the NBFC is ready to lend, where does the money on its balance sheet come from?' },
  { number: 6, title: 'Understanding an NBFC Balance Sheet', question: 'If an NBFC lends ₹100 crore, where did that ₹100 crore come from?', concepts: 'Assets, liabilities, loan book, borrowings and capital', answer: 'An NBFC funds itself through shareholder capital and permitted borrowings or other funding sources. It deploys that money into loans and investments. On the balance sheet, the loan book is an asset because borrowers owe money to the NBFC; borrowings are liabilities because the NBFC must repay its funders.', flow: ['Capital and permitted funding come in', 'Funds are deployed into loans and investments', 'Repayments, interest, losses and funding costs change the balance sheet'], example: '₹20 crore of equity plus ₹80 crore of borrowings can support a ₹100 crore pool before liquidity buffers and other assets are considered. Loan losses reduce earnings and may ultimately erode capital.', whatIf: 'What if many borrowers stop paying while the NBFC’s own borrowings still fall due? The institution can face both credit loss and liquidity stress.', terms: ['Assets', 'Liabilities', 'Loan book', 'Borrowings', 'Equity'], ids: [2, 3, 6, 13], next: 'How much loss-absorbing capital must the NBFC keep?' },
  { number: 7, title: 'Capital & Prudential Concepts', question: 'What protects an NBFC when some loans go bad?', concepts: 'NOF, CRAR, Tier 1/Tier 2, leverage and risk-weighted assets', answer: 'Capital is the cushion that absorbs unexpected loss. NOF is an entry and ongoing financial-strength measure. CRAR compares eligible regulatory capital with risk-weighted assets; riskier exposures require more capital. Tier 1 is the strongest going-concern capital, while Tier 2 provides supplementary support.', flow: ['Classify eligible capital', 'Apply risk weights to assets and exposures', 'Compare capital with risk-weighted assets and monitor leverage'], example: 'If eligible capital is ₹18 crore and risk-weighted assets are ₹100 crore, CRAR is 18%. Whether that is sufficient depends on the entity’s category, layer and every applicable deduction.', whatIf: 'What if accounting equity looks high but much of it is deducted for regulatory purposes? The regulatory capital ratio can be materially lower than the balance-sheet number.', terms: ['NOF', 'CRAR', 'Tier 1', 'Tier 2', 'RWA', 'Leverage'], ids: [2, 5], next: 'How does the NBFC turn that funding and capital into an actual loan?' },
  { number: 8, title: 'How NBFC Lending Works', question: 'What happens between a loan application and final repayment?', concepts: 'Origination, underwriting, sanction, disbursement and repayment', answer: 'A loan moves through a controlled lifecycle: the NBFC sources the customer, completes KYC, assesses repayment ability and credit risk, sanctions approved terms, signs documents, disburses through the permitted route, monitors repayment and finally closes the account and releases security.', flow: ['Application + KYC', 'Underwriting + sanction + documentation', 'Disbursement + servicing + repayment + closure'], example: 'For a ₹25 lakh MSME loan, business cash flows, bureau history, existing debt, collateral and end use may all affect the underwriting decision and conditions.', whatIf: 'What if a sales partner sourced the borrower? The NBFC may use a service provider, but responsibility for credit, conduct and regulatory compliance remains with the NBFC.', terms: ['Origination', 'Underwriting', 'Sanction', 'Disbursement', 'Servicing'], ids: [7, 8, 9, 11, 26], next: 'Which loan product best fits the borrower’s real need?' },
  { number: 9, title: 'Loan Products', question: 'Does every borrower need the same kind of loan?', concepts: 'Term loans, MSME finance, invoice finance, secured/unsecured and co-lending', answer: 'The product should match the borrower’s purpose, cash-flow pattern, security and repayment capacity. Term loans fund a defined need over time; working-capital and invoice products follow business cycles; secured lending relies on collateral; unsecured lending relies more heavily on cash flow and credit assessment; co-lending shares exposure between regulated lenders.', flow: ['Identify the customer’s purpose and cash-flow need', 'Choose structure, security, tenor and repayment pattern', 'Apply product-specific conduct, prudential and reporting rules'], example: 'A supplier waiting 60 days for invoices may need receivables finance rather than a five-year term loan. Product design changes documentation, monitoring and risk.', whatIf: 'What if the product name is changed but the economics remain the same? RBI expectations generally follow the substance of the activity, not merely the marketing label.', terms: ['Term loan', 'Working capital', 'Invoice finance', 'Secured loan', 'Co-lending'], ids: [7, 8, 14, 26], next: 'Once the product is chosen, how should price and charges be explained?' },
  { number: 10, title: 'Interest & Charges', question: 'What does the borrower really pay—not just the headline rate?', concepts: 'Interest calculation, APR, penal charges and fees', answer: 'The customer’s cost can include interest, processing fees and other charges. APR expresses the annualised cost more completely than a headline rate. Material terms must be disclosed clearly, and penal charges should respond to non-compliance without being disguised as additional penal interest or being capitalised improperly.', flow: ['Set a Board-approved pricing method', 'Disclose KFS, APR, fees and repayment schedule', 'Apply charges consistently and communicate changes'], example: 'A loan advertised at 14% may have a higher effective cost after processing fees. The KFS and APR help the borrower compare the real price.', whatIf: 'What if a charge was not included in the prescribed disclosure? The NBFC should not assume it can collect an undisclosed amount without the required consent and regulatory basis.', terms: ['Interest rate', 'APR', 'KFS', 'Processing fee', 'Penal charge'], ids: [7, 8], next: 'Before lending, how does the NBFC know who the customer really is?' },
  { number: 11, title: 'KYC & AML Basics', question: 'Would you lend ₹20 lakh to someone whose identity and ownership you cannot verify?', concepts: 'KYC, beneficial ownership, PEP, CKYCR and FIU-IND', answer: 'KYC is a risk-based process, not a one-time photocopy exercise. The NBFC identifies and verifies the customer and beneficial owner, understands the purpose of the relationship, risk-rates the customer, screens relevant lists, monitors transactions, updates KYC and reports suspicious activity when required.', flow: ['Identify customer and beneficial owner', 'Risk-rate, screen and onboard', 'Monitor, update records and escalate suspicious activity'], example: 'For a company borrower, the NBFC must look beyond the company’s name to the natural persons who ultimately own or control it, subject to the applicable test.', whatIf: 'What if documents appear valid but transaction behaviour is inconsistent with the stated business? Ongoing monitoring may require investigation and, where appropriate, confidential FIU-IND reporting.', terms: ['CDD', 'Beneficial owner', 'PEP', 'CKYCR', 'STR', 'FIU-IND'], ids: [9], next: 'After onboarding, how does repayment behaviour enter the wider credit system?' },
  { number: 12, title: 'Credit Information', question: 'The borrower paid late. Who needs to know?', concepts: 'CICs, credit bureaus, reporting and borrower credit history', answer: 'NBFCs report prescribed borrower information to Credit Information Companies so lenders can assess indebtedness and repayment behaviour. Accurate and timely reporting also affects the customer’s credit history, so corrections and complaints must follow a controlled process.', flow: ['Capture accurate loan and borrower data', 'Submit information on the prescribed cycle', 'Resolve rejections, disputes and corrections within timelines'], example: 'A missed instalment can affect the borrower’s bureau record. If the NBFC reports the wrong status, it must investigate, correct the data and manage the complaint within the applicable timeline.', whatIf: 'What if the loan is closed but the bureau still shows an outstanding balance? The systems, closure record and bureau submission must be reconciled and corrected.', terms: ['CIC', 'Credit bureau', 'Credit history', 'Dispute', 'Correction'], ids: [12], next: 'When does a late account become stressed or non-performing?' },
  { number: 13, title: 'Asset Classification', question: 'When does “late” become an NPA—and why does that matter?', concepts: 'DPD, overdue accounts, NPA, provisioning and write-offs', answer: 'Days Past Due measures how long an amount remains unpaid. Regulatory rules classify stress and, after the applicable trigger, may classify the borrower’s facilities as NPA. Classification affects income recognition, provisioning, capital and reporting. A write-off is an accounting action; it does not automatically end recovery rights.', flow: ['Track due date and DPD', 'Apply borrower-wise classification and income rules', 'Create provisions, report status and test conditions for upgrade'], example: 'A term-loan instalment 75 days overdue at an ML NBFC is serious and may be SMA, but the general more-than-90-day test alone has not yet made it NPA.', whatIf: 'What if one facility is current but another facility of the same borrower becomes NPA? Borrower-wise classification can affect the other facilities too.', terms: ['DPD', 'SMA', 'NPA', 'Provision', 'Write-off', 'Upgrade'], ids: [3, 12, 13], next: 'Can the account be repaired before recovery becomes the only option?' },
  { number: 14, title: 'Stressed Borrowers', question: 'What can an NBFC do when a viable borrower cannot pay on the original schedule?', concepts: 'Restructuring, resolution and recovery', answer: 'The NBFC identifies stress early, reviews the borrower’s viability and chooses a lawful resolution route. Restructuring may change terms but can carry classification and provisioning consequences. Multi-lender cases may require coordinated decision-making, while fraud or wilful-default concerns require separate treatment.', flow: ['Recognise default and begin review', 'Assess viability and choose a resolution plan', 'Implement, monitor performance and apply classification consequences'], example: 'A viable MSME facing a temporary cash-flow shock may be considered for restructuring, but the NBFC must document viability, approvals, revised cash flows and regulatory treatment.', whatIf: 'What if lenders disagree? An inter-creditor framework may govern voting and implementation, while dissenting-lender protections and provisioning still need attention.', terms: ['Resolution plan', 'Restructuring', 'ICA', 'Viability', 'Compromise settlement'], ids: [4, 3, 16], next: 'If resolution fails, how can recovery remain firm but fair?' },
  { number: 15, title: 'Digital Lending', question: 'What changes when the entire loan journey happens through an app?', concepts: 'RE, LSP, DLA, DLG/FLDG and the digital ecosystem', answer: 'The regulated entity remains responsible even when an LSP or app performs parts of the customer journey. Digital rules focus on transparent identity, direct fund flows, consent-based data use, borrower disclosures, cooling-off rights, grievance handling and controlled default-loss guarantees.', flow: ['RE designs and owns the regulated product', 'LSP/DLA supports acquisition or servicing under oversight', 'Funds, data, disclosures and complaints follow RBI controls'], example: 'An app may display the offer and collect information, but loan disbursal and repayment generally move directly between the borrower and the regulated entity’s bank accounts, subject to stated exceptions.', whatIf: 'What if the app vendor mishandles customer data? The NBFC cannot treat that as only the vendor’s problem; its own oversight and accountability remain.', terms: ['RE', 'LSP', 'DLA', 'DLG', 'Cooling-off period'], ids: [8, 11, 9], next: 'What happens when a borrower still does not pay?' },
  { number: 16, title: 'Collections & Recovery', question: 'How can an NBFC recover money without crossing the conduct line?', concepts: 'Collection lifecycle, recovery agents and legal recovery', answer: 'Collections begin with reminders and engagement, then may move to approved recovery or legal routes. The NBFC must control agents, contact practices, customer information, collateral enforcement and grievance handling. Recovery pressure cannot become intimidation, harassment or misuse of data.', flow: ['Contact and understand the reason for non-payment', 'Offer permitted resolution or use controlled recovery agents', 'Use contractual/legal enforcement and close records correctly'], example: 'A recovery agent may contact a borrower within permitted hours and follow an approved script, but must not threaten relatives, publish the debt or use abusive conduct.', whatIf: 'What if recovery is outsourced? The NBFC remains responsible for selection, training, monitoring, complaints and the agent’s conduct.', terms: ['Recovery agent', 'Repossession', 'Fair practices', 'Grievance', 'Legal recovery'], ids: [7, 11, 4], next: 'Who inside the NBFC makes sure these systems work?' },
  { number: 17, title: 'NBFC Governance', question: 'Who is accountable when compliance, risk and business priorities conflict?', concepts: 'Board, committees, compliance, risk and audit', answer: 'The Board sets risk appetite and approves key policies; management implements them; compliance interprets and monitors regulatory duties; risk challenges exposures and emerging threats; internal audit independently tests whether controls actually work. Layer and size can add committee, CRO, CCO and independence requirements.', flow: ['Board sets direction and accountability', 'Management, risk and compliance operate the framework', 'Audit tests evidence and reports weaknesses for remediation'], example: 'A new digital lending product should pass through business, credit, legal, compliance, technology and risk review before launch, with material issues escalated to the correct committee.', whatIf: 'What if a policy exists but operations do something different? Regulators and auditors will examine implementation evidence, not merely the signed policy.', terms: ['Board', 'ACB', 'NRC', 'CRO', 'CCO', 'Internal audit'], ids: [10, 11, 19], next: 'How does RBI see what is happening inside the institution?' },
  { number: 18, title: 'RBI Supervision', question: 'Why does RBI ask NBFCs for so much information?', concepts: 'Returns, inspections, supervisory communication and enforcement', answer: 'RBI uses returns, financial statements, risk data, inspections and supervisory engagement to understand the institution and the wider system. Inaccurate reporting hides risk; unresolved observations can lead to remediation, restrictions, monetary penalties or stronger enforcement.', flow: ['NBFC files accurate and timely information', 'RBI analyses data and conducts supervision or inspection', 'NBFC answers observations, fixes gaps and retains evidence'], example: 'A mismatch between the loan system, financial statements and regulatory return can signal a weak control environment even if the underlying ratio appears compliant.', whatIf: 'What if an NBFC disagrees with an observation? It should respond with facts, legal analysis and evidence, while respecting the required remediation and communication process.', terms: ['Regulatory return', 'Inspection', 'Supervisory observation', 'Remediation', 'Enforcement'], ids: [1, 10, 12, 13], next: 'What technology and data controls keep daily operations safe?' },
  { number: 19, title: 'Technology & Data', question: 'If a vendor suffers a data breach, is it only the vendor’s problem?', concepts: 'IT systems, cybersecurity, privacy and outsourcing', answer: 'No. Technology can be outsourced, but regulatory accountability cannot. The NBFC must assess vendors, control access and data, preserve audit and RBI rights, test resilience, respond to incidents and maintain an exit plan. Consent and purpose limitation matter throughout the data lifecycle.', flow: ['Classify systems, data and outsourced services', 'Apply access, security, resilience and contract controls', 'Monitor incidents, concentration, continuity and exit readiness'], example: 'A cloud provider may host the loan platform, but the NBFC still needs access controls, logs, encryption, recovery testing, incident escalation and the ability to retrieve or securely delete data.', whatIf: 'What if the main vendor relies on another subcontractor? Fourth-party dependence and concentration risk still need to be identified and managed.', terms: ['Outsourcing', 'Cyber incident', 'BCP', 'DR', 'Fourth party', 'Data consent'], ids: [11, 8, 9], next: 'Can you now connect every part and run an NBFC for a year?' },
  { number: 20, title: 'Life of an NBFC', question: 'Can you run a Base Layer NBFC-ICC for one complete year?', concepts: 'End-to-end case study connecting every module', answer: 'The final module connects identity, funding, lending, KYC, pricing, monitoring, default, capital, governance, technology and reporting. The aim is not to memorise every paragraph; it is to know which question to ask next, which function owns it and which RBI source must be checked.', flow: ['Build and fund the NBFC', 'Make, service and resolve loans', 'Govern, report and answer RBI with evidence'], example: 'Your NBFC receives its CoR, raises funding, sanctions a ₹25 lakh MSME loan, reports it to CICs, handles missed repayments, reassesses provisions and presents the portfolio to the Board before responding to RBI.', whatIf: 'What if one fact changes—deposit status, asset size, digital channel or group structure? Re-run applicability because the governing layer or additional direction may change.', terms: ['Applicability', 'Owner', 'Evidence', 'Frequency', 'Regulatory conclusion'], ids: [1, 2, 3, 7, 9, 10, 12], next: 'You now understand how an NBFC works. Use the Case Lab to test the complete journey.' },
];

const learningPhases = [
  { label: '01 · Understand', range: 'Modules 1–5', body: 'What an NBFC is, how it evolved, categories, layers and registration.' },
  { label: '02 · Fund & lend', range: 'Modules 6–10', body: 'Balance sheet, capital, lending lifecycle, products and pricing.' },
  { label: '03 · Know & monitor', range: 'Modules 11–16', body: 'KYC, bureaus, asset quality, stress, digital lending and recovery.' },
  { label: '04 · Run the institution', range: 'Modules 17–20', body: 'Governance, RBI supervision, technology and the capstone.' },
];

const learnGlossary = [
  ['NBFC', 'A company whose principal business is a regulated financial activity, but which is not a bank.'], ['CoR', 'The RBI Certificate of Registration authorising the company to carry on the permitted NBFC business.'], ['NOF', 'Net Owned Fund—the regulatory measure of owned financial strength used for entry and other requirements.'], ['SBR', 'Scale Based Regulation, which places NBFCs in Base, Middle, Upper or Top Layer.'], ['CRAR', 'Eligible regulatory capital divided by risk-weighted assets.'], ['RWA', 'Assets and exposures adjusted by regulatory risk weights.'], ['KFS', 'Key Facts Statement summarising material loan terms, APR and charges.'], ['APR', 'Annual Percentage Rate—a standardised annual measure of the borrower’s credit cost.'], ['CDD', 'Customer Due Diligence: identifying, verifying and understanding the customer and relationship.'], ['PEP', 'A Politically Exposed Person, requiring the applicable enhanced risk controls.'], ['CKYCR', 'The Central KYC Records Registry used to store and retrieve KYC records.'], ['CIC', 'A Credit Information Company or credit bureau receiving borrower credit data.'], ['DPD', 'Days Past Due—the number of days a payment remains overdue.'], ['NPA', 'A Non-Performing Asset classified under the applicable RBI overdue and other triggers.'], ['LSP', 'A Lending Service Provider supporting one or more functions for a regulated digital lender.'], ['DLA', 'A Digital Lending App through which parts of the lending journey are delivered.'], ['DLG', 'A permitted Default Loss Guarantee subject to provider, cap, form, invocation and disclosure rules.'], ['FIU-IND', 'The Financial Intelligence Unit—India, which receives prescribed AML reports.'], ['CRO', 'Chief Risk Officer, responsible for independent risk oversight where required.'], ['CCO', 'Chief Compliance Officer, leading the independent compliance function where required.'],
] as const;

const caseLabSteps = [
  { title: 'Receive the CoR', prompt: 'Confirm the company’s category, permitted business, NOF and Base Layer profile.', ids: [1] },
  { title: 'Raise funding', prompt: 'Decide the mix of shareholder capital and permitted borrowing; map cost, maturity and liquidity.', ids: [2, 6] },
  { title: 'Receive a ₹25 lakh MSME application', prompt: 'Choose the suitable product and capture the borrower’s purpose, cash flows and existing debt.', ids: [7, 26] },
  { title: 'Complete KYC', prompt: 'Identify the customer, beneficial owner and risk profile; screen and retain evidence.', ids: [9] },
  { title: 'Underwrite and sanction', prompt: 'Assess repayment capacity, bureau data, collateral, end use and approval authority.', ids: [12, 26] },
  { title: 'Disclose the price', prompt: 'Issue the KFS, APR, repayment schedule, fees and penal-charge terms.', ids: [7] },
  { title: 'Disburse and service', prompt: 'Execute documents, use permitted fund flows and begin repayment monitoring.', ids: [7, 8] },
  { title: 'Report to CICs', prompt: 'Submit accurate borrower and account information on the prescribed reporting cycle.', ids: [12] },
  { title: 'Borrower misses repayments', prompt: 'Track DPD and SMA status; contact the borrower within the conduct framework.', ids: [3, 7] },
  { title: 'Assess NPA and provisioning', prompt: 'Apply borrower-wise classification, income recognition and provision consequences.', ids: [3, 13] },
  { title: 'Consider resolution or recovery', prompt: 'Test viability, restructuring, controlled collections and legal recovery routes.', ids: [4, 7] },
  { title: 'Measure the effect on the NBFC', prompt: 'Recalculate earnings, provisions, capital, concentration and liquidity impact.', ids: [2, 3, 5, 6] },
  { title: 'Board and RBI review', prompt: 'Present the portfolio, document oversight, complete reporting and answer a supervisory question with evidence.', ids: [10, 12, 13] },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');
  const [layer, setLayer] = useState('All layers');
  const [status, setStatus] = useState('All statuses');
  const [selected, setSelected] = useState<Regulation | null>(null);
  const [selectedThreshold, setSelectedThreshold] = useState<ThresholdDetail | null>(null);
  const [entityType, setEntityType] = useState('NBFC-ICC');
  const [depositStatus, setDepositStatus] = useState('Non-deposit taking');
  const [assetSizeCrore, setAssetSizeCrore] = useState('');
  const [publicFundsStatus, setPublicFundsStatus] = useState('Not specified');
  const [characteristics, setCharacteristics] = useState({ customer: true, digital: false, outsourcing: false });
  const [issueIndex, setIssueIndex] = useState(0);
  const [primaryArea, setPrimaryArea] = useState<'learn' | 'regulations' | 'compliance' | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState('start');
  const [answeredQuestion, setAnsweredQuestion] = useState('');
  const [answerIds, setAnswerIds] = useState<number[]>([]);
  const [foundationIndex, setFoundationIndex] = useState<number | null>(null);
  const [openScenario, setOpenScenario] = useState<string | null>(null);
  const [activeGlossary, setActiveGlossary] = useState<string | null>(null);
  const [activeBasic, setActiveBasic] = useState<'meaning' | 'types' | 'classified' | 'regulated'>('meaning');
  const [openUpdate, setOpenUpdate] = useState<number | null>(0);
  const [activeLearningModule, setActiveLearningModule] = useState(0);
  const [activeCaseStep, setActiveCaseStep] = useState(0);
  const [learningGlossaryTerm, setLearningGlossaryTerm] = useState<string | null>('NBFC');
  const foundationDrawerRef = useRef<HTMLDivElement>(null);
  const attachFoundationDrawer = useCallback((node: HTMLDivElement | null) => {
    foundationDrawerRef.current = node;
    if (node) node.scrollTop = 0;
  }, []);

  useLayoutEffect(() => {
    if (foundationIndex === null) return;
    const resetScroll = () => {
      if (foundationDrawerRef.current) foundationDrawerRef.current.scrollTop = 0;
    };
    resetScroll();
    const frame = requestAnimationFrame(() => requestAnimationFrame(resetScroll));
    const afterOpen = window.setTimeout(resetScroll, 240);
    return () => { cancelAnimationFrame(frame); window.clearTimeout(afterOpen); };
  }, [foundationIndex]);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const afterPaint = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const reportError = (error: unknown) => console.warn('WebMCP registration failed', error);

    const tools: WebMcpTool[] = [
      {
        name: 'filter_regulations',
        title: 'Filter regulations',
        description: 'Update the visible regulation library using a search term, category, and SBR layer.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' },
            category: { type: 'string', enum: categoryOptions },
            layer: { type: 'string', enum: ['All layers', 'BL', 'ML', 'UL', 'Reference'] },
          },
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) {
          if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Input must be an object.');
          const values = input as { query?: unknown; category?: unknown; layer?: unknown };
          if (values.query !== undefined && typeof values.query !== 'string') throw new Error('query must be a string.');
          if (values.category !== undefined && (typeof values.category !== 'string' || !categoryOptions.includes(values.category))) throw new Error('category is not recognized.');
          const allowedLayers = ['All layers', 'BL', 'ML', 'UL', 'Reference'];
          if (values.layer !== undefined && (typeof values.layer !== 'string' || !allowedLayers.includes(values.layer))) throw new Error('layer is not recognized.');
          const nextQuery = values.query ?? '';
          const nextCategory = (values.category ?? 'All categories') as string;
          const nextLayer = (values.layer ?? 'All layers') as string;
          setQuery(nextQuery);
          setCategory(nextCategory);
          setLayer(nextLayer);
          setStatus('All statuses');
          await afterPaint();
          const needle = nextQuery.trim().toLowerCase();
          const count = regulations.filter((reg) => (!needle || [reg.title, reg.short, reg.category, reg.summary, ...reg.highlights].join(' ').toLowerCase().includes(needle)) && (nextCategory === 'All categories' || reg.category === nextCategory) && (nextLayer === 'All layers' || reg.layers.includes(nextLayer))).length;
          return { query: nextQuery, category: nextCategory, layer: nextLayer, resultCount: count };
        },
      },
      {
        name: 'open_regulation_detail',
        title: 'Open regulation detail',
        description: 'Open the visible detail panel for one regulation by its numeric library id.',
        inputSchema: {
          type: 'object',
          properties: { id: { type: 'integer', minimum: 1, maximum: regulations.length } },
          required: ['id'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input) {
          if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Input must be an object.');
          const id = (input as { id?: unknown }).id;
          if (!Number.isInteger(id)) throw new Error('id must be an integer.');
          const regulation = regulations.find((item) => item.id === id);
          if (!regulation) throw new Error('No regulation exists for that id.');
          setSelected(regulation);
          await afterPaint();
          return { id: regulation.id, title: regulation.title, panel: 'open' };
        },
      },
    ];

    for (const tool of tools) {
      try {
        void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(reportError);
      } catch (error) {
        reportError(error);
      }
    }

    return () => lifecycle.abort();
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return regulations.filter((reg) => {
      const matchesText = !needle || [reg.title, reg.short, reg.category, reg.summary, ...reg.highlights].join(' ').toLowerCase().includes(needle);
      return matchesText && (category === 'All categories' || reg.category === category) && (layer === 'All layers' || reg.layers.includes(layer)) && (status === 'All statuses' || reg.status === status);
    });
  }, [query, category, layer, status]);
  const selectedDetails = selected ? regulationDetails[selected.id] : null;
  const profileLayer = layer === 'All layers' || layer === 'Reference' ? 'BL' : layer;
  const priorityIds = Array.from(new Set([
    1,
    2,
    9,
    10,
    ...(characteristics.customer ? [7, 12] : []),
    ...(characteristics.digital ? [8, 11] : []),
    ...(characteristics.outsourcing ? [11] : []),
    ...(depositStatus === 'Deposit taking' ? [17, 6] : []),
  ])).slice(0, 7);
  const activeCharacteristics = [
    characteristics.customer && 'customer conduct and grievance handling',
    characteristics.digital && 'digital lending, consent and LSP controls',
    characteristics.outsourcing && 'vendor governance, audit access and exit planning',
  ].filter(Boolean) as string[];
  const answerRegulations = answerIds.map((id) => regulations.find((item) => item.id === id)).filter(Boolean) as Regulation[];
  const primaryAnswer = answerRegulations[0];
  const researchAnswer = answeredQuestion ? frameResearchAnswer(answeredQuestion, { category: entityType, layer: profileLayer, deposits: depositStatus, digital: characteristics.digital, customer: characteristics.customer, assetCrore: assetSizeCrore.trim() ? Number(assetSizeCrore) : undefined, publicFunds: publicFundsStatus }, primaryAnswer?.id ?? 0) : null;

  const answerQuestion = () => {
    const question = query.trim();
    if (!question) return;
    const normalized = question.toLowerCase();
    const stopWords = new Set(['about','after','also','before','being','between','could','does','from','have','into','should','that','their','there','these','they','this','through','under','what','when','where','which','with','would','your','base','middle','upper','layer','nbfc']);
    const tokens = normalized.split(/[^a-z0-9₹]+/).filter((word) => word.length > 2 && !stopWords.has(word));
    const aliases: Array<[RegExp, number[]]> = [
      [/start|register|registration|certificate|\bcor\b|principal business/, [1]], [/capital|crar|tier|net owned fund|\bnof\b/, [2,1]], [/npa|overdue|past due|90 day|asset classification|provision/, [3]], [/default|stress|restructur|resolution/, [4,3]], [/concentration|exposure limit|single borrower|group borrower/, [5]], [/liquidity|alm|lcr|mismatch/, [6]], [/penal|interest|charge|recovery|complaint|kfs|apr|fair practice|prepayment/, [7]], [/digital|\blsp\b|\bdla\b|guarantee|\bdlg\b|microfinance|gold loan|project finance/, [8]], [/kyc|aml|beneficial owner|ckycr|fiu|pep|money laundering/, [9]], [/director|board|committee|governance|cro|cco/, [10]], [/outsourc|vendor|cloud|service provider/, [11]], [/credit information|bureau|\bcic\b|cibil|crilc/, [12]], [/financial statement|disclosure|ind as|impairment reserve/, [13]], [/transfer|co-lending|loan sale/, [14]], [/securitis/, [15]], [/wilful|large defaulter/, [16]], [/public deposit|accept deposit|deposit taking/, [17]], [/credit card|co-brand/, [18]], [/dividend|payout/, [19]], [/shareholder|shareholding|takeover|change in control|acquisition/, [20]], [/aif|overseas|insurance|mutual fund|financial service/, [21]], [/branch|registered office/, [22]], [/amalgamation|merger/, [23]], [/investment portfolio|treasury|derivative|bond/, [24]], [/climate|green deposit|green finance/, [25]], [/underwriting|credit appraisal|end use|related party lending/, [26]], [/ncd|factoring|virtual asset|electronic payment/, [27]], [/payment system|settlement/, [28]],
    ];
    const scored = regulations.map((reg) => {
      const detail = regulationDetails[reg.id];
      const title = `${reg.title} ${reg.short} ${reg.category}`.toLowerCase();
      const corpus = `${title} ${reg.summary} ${reg.highlights.join(' ')} ${detail?.applies ?? ''} ${detail?.requirements.join(' ') ?? ''} ${detail?.timing.join(' ') ?? ''} ${detail?.checks.join(' ') ?? ''}`.toLowerCase();
      let score = tokens.reduce((total, token) => total + (title.includes(token) ? 4 : corpus.includes(token) ? 1 : 0), 0);
      for (const [pattern, ids] of aliases) if (pattern.test(normalized) && ids.includes(reg.id)) score += 10 - ids.indexOf(reg.id);
      if (reg.layers.includes(profileLayer)) score += 0.5;
      return { id: reg.id, score };
    }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
    setAnsweredQuestion(question);
    setAnswerIds(scored.slice(0, 3).map((item) => item.id));
  };

  const goHome = () => {
    setPrimaryArea(null);
    setFoundationIndex(null);
    setSelectedThreshold(null);
    setSelected(null);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectPrimaryArea = (area: 'learn' | 'regulations' | 'compliance' | null) => {
    setFoundationIndex(null);
    setSelectedThreshold(null);
    setSelected(null);
    if (area === null) {
      goHome();
      return;
    }
    setPrimaryArea(area);
    if (area === 'learn') {
      setWorkspaceTab('start');
      return;
    }
    if (area === 'regulations') {
      setWorkspaceTab('regulations');
      return;
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="regulatory-line" aria-hidden="true" />
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <button type="button" onClick={goHome} className="flex items-center gap-3 rounded-2xl text-left transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Return to homepage">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"><Scale className="size-5" /></div>
            <div><p className="text-[15px] font-semibold leading-none tracking-tight">NBFC Regulatory Desk</p><p className="mt-1 text-xs text-muted-foreground">RBI consolidated directions · working index</p></div>
          </button>
          <nav aria-label="Primary product areas" className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-secondary/65 p-1 sm:grid-cols-4">
              {([
                [null, 'Home', Landmark],
                ['learn', 'Learn NBFCs', GraduationCap],
                ['regulations', 'Regulations', BookOpen],
                ['compliance', 'Compliance', ShieldCheck],
              ] as const).map(([area, label, Icon]) => (
                <button
                  key={area}
                  type="button"
                  aria-current={primaryArea === area ? 'page' : undefined}
                  onClick={() => selectPrimaryArea(area)}
                  className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors sm:text-sm ${primaryArea === area ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:bg-card/70 hover:text-foreground'}`}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {primaryArea === null && (
          <section className="space-y-5">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#07182b] text-white shadow-[0_24px_70px_-42px_rgba(2,12,27,.8)]">
              <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.15fr)_.85fr] lg:p-10">
                <div>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-sm font-semibold text-cyan-100"><Landmark className="size-4" />The NBFC Dossier</div>
                  <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">You have used an NBFC before. You just were not asked to notice.</h1>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">NBFCs fund the gold-loan counter, the five-minute lending app, and a large part of India's two-wheeler finance. Open the case file: what they can do, what they can't, and how to tell a real one from a risky one.</p>
                  <div className="mt-6 max-w-2xl rounded-2xl border border-white/15 bg-white/[.08] p-2">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input aria-label="Ask a question about NBFCs" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { setPrimaryArea('regulations'); answerQuestion(); } }} placeholder="Ask a question — e.g. Is my lending app an NBFC?" className="h-12 border-white/15 bg-white/10 pl-10 pr-24 text-[15px] text-white placeholder:text-slate-400 focus-visible:border-cyan-300" />
                      <button type="button" onClick={() => { setPrimaryArea('regulations'); answerQuestion(); }} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-cyan-200 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-100">Search</button>
                    </div>
                  </div>
                  <div className="mt-5 max-w-2xl rounded-2xl border border-white/15 bg-white/[.07] p-4">
                    <p className="text-sm font-semibold text-cyan-100">New to NBFCs?</p>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight">Get the basics in 2 minutes.</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {([
                        ['meaning', 'What is an NBFC?'],
                        ['types', 'Types of NBFCs'],
                        ['classified', 'How are they classified?'],
                        ['regulated', 'How are they regulated?'],
                      ] as const).map(([key, label]) => (
                        <button key={key} type="button" aria-pressed={activeBasic === key} onClick={() => setActiveBasic(key)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${activeBasic === key ? 'border-cyan-200 bg-cyan-200 text-slate-950' : 'border-white/15 bg-white/[.08] text-slate-200 hover:border-cyan-200 hover:text-white'}`}>{label} <span aria-hidden="true">→</span></button>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl border border-white/15 bg-slate-950/25 p-4 text-sm leading-6 text-slate-200">
                      {activeBasic === 'meaning' && <div><h3 className="font-semibold text-white">What is an NBFC?</h3><p className="mt-2">An NBFC is a company carrying on specified financial activities such as lending, investment or other regulated financial business.</p><p className="mt-2"><span className="font-semibold text-cyan-100">In simple words:</span> it can perform many financial activities you associate with banks, but it is not a bank and operates under a different regulatory framework.</p></div>}
                      {activeBasic === 'types' && <div><h3 className="font-semibold text-white">Not every NBFC does the same thing.</h3><div className="mt-3 flex flex-wrap gap-2">{['ICC','MFI','HFC','CIC','Factor','P2P','AA','IFC'].map((type) => <span key={type} className="rounded-full border border-cyan-200/25 bg-cyan-200/10 px-2.5 py-1 text-xs font-semibold text-cyan-100">{type}</span>)}</div><p className="mt-3">Each label points to a different business model or regulatory category. Select a type in Learn to see what it does.</p></div>}
                      {activeBasic === 'classified' && <div><h3 className="font-semibold text-white">How are NBFCs classified?</h3><p className="mt-2">Start with what the company does, then check whether it takes deposits, its asset size, customer interface and its Scale Based Regulation layer: Base, Middle, Upper or Top.</p></div>}
                      {activeBasic === 'regulated' && <div><h3 className="font-semibold text-white">How does RBI regulate them?</h3><p className="mt-2">RBI regulation starts with registration, then applies prudential, conduct, governance, KYC, reporting and product rules depending on category, layer and activity.</p></div>}
                      <button type="button" onClick={() => selectPrimaryArea('learn')} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-cyan-100 hover:text-white">Want to understand NBFCs in detail? Explore the learning centre <ArrowRight className="size-3.5" /></button>
                    </div>
                  </div>
                </div>
                <div id="bank-vs-nbfc" className="scroll-mt-24 rounded-2xl border border-cyan-300/20 bg-white/[.06] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[.14em] text-cyan-200">Bank vs NBFC</p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight">A bit like a bank. Except when it really matters.</h2>
                  <div className="mt-5 overflow-hidden rounded-xl border border-white/15">
                    {[
                      ['Can it hold your savings account?', 'Yes', 'No'],
                      ['Is your deposit insured?', 'DICGC cover up to ₹5 lakh', 'No deposit insurance'],
                      ['Which rulebook applies?', 'Banking Regulation Act', 'RBI Act, Chapter IIIB'],
                      ['Can it issue a cheque book?', 'Yes', 'No'],
                      ['Can it give you a loan?', 'Yes', 'Yes'],
                    ].map(([question, bank, nbfc]) => (
                      <div key={question} className="grid grid-cols-[1.3fr_.75fr_.9fr] border-b border-white/10 text-sm last:border-b-0">
                        <div className="p-3 text-slate-200">{question}</div>
                        <div className="border-l border-white/10 p-3 font-semibold text-white">{bank}</div>
                        <div className="border-l border-white/10 p-3 font-semibold text-cyan-100">{nbfc}</div>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => setFoundationIndex(0)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 hover:text-white">So why do so many NBFCs exist? <ArrowRight className="size-4" /></button>
                </div>
              </div>
            </div>

            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow">What&apos;s new in NBFC regulation</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">Recent NBFC rules—explained in plain English.</h2>
                </div>
                <p className="max-w-md text-sm leading-6 text-muted-foreground">Each note tells you what the rule means, who should check it and the next compliance action. Verify the cited RBI direction before filing or issuing formal advice.</p>
              </div>
              <div className="mt-6 divide-y divide-border rounded-2xl border border-border">
                {[
                  { tag: 'UPDATED', date: '01 JUL 2026', title: 'First decide: is it an NBFC, and which SBR layer applies?', summary: 'Before checking any compliance rule, confirm the entity’s RBI registration, NBFC category, deposit status, asset size and group structure. These facts decide whether it falls in the Base, Middle or Upper Layer.', applies: 'Companies testing NBFC registration and every registered NBFC', effective: 'Consolidated up to 01 July 2026', changed: 'Base Layer generally covers non-deposit-taking NBFCs below ₹1,000 crore, subject to category-specific rules. Middle Layer includes all deposit-taking NBFCs, non-deposit-taking NBFCs with assets of ₹1,000 crore or more, and specified categories such as HFCs, CICs and IFCs. Upper Layer is not reached merely by crossing a single number: RBI identifies NBFCs for it through its supervisory methodology.', action: 'Record the CoR number, category, deposit status, standalone assets, consolidated group assets and RBI layer before testing any obligation.', source: 'Registration, Exemptions and Framework for Scale Based Regulation Directions, 2025 — paragraphs 3 and 8–17.', id: 1 },
                  { tag: 'AMENDED', date: '24 JUN 2026', title: 'Upper Layer status must be confirmed from RBI’s identification', summary: 'A large NBFC does not label itself “Upper Layer” only because of its asset size. RBI identifies Upper Layer entities annually based on size, activity and perceived systemic risk.', applies: 'NBFCs already identified as UL and NBFCs that may enter RBI’s assessment', effective: 'Second Amendment dated 24 June 2026', changed: 'The practical question is not simply “Are assets above ₹1,000 crore?” That threshold generally moves a non-deposit-taking NBFC into Middle Layer. Upper Layer treatment begins when RBI specifically identifies the NBFC under the SBR framework. An NBFC already identified as UL must continue applying the enhanced framework for the prescribed period, even if it later drops out of the annual list.', action: 'Keep the latest RBI Upper Layer identification, the Board’s gap assessment and the implementation evidence with the entity’s regulatory profile.', source: 'Registration, Exemptions and Framework for Scale Based Regulation Directions, 2025 — paragraphs 12 and 24 onward, read with the 24 June 2026 amendment.', id: 1 },
                  { tag: 'CORE RULE', date: '28 NOV 2025', title: 'KYC is an ongoing control—not a one-time document check', summary: 'The NBFC must identify the customer and beneficial owner, understand the relationship, screen relevant lists, monitor transactions and report suspicious activity where required.', applies: 'Customer-facing NBFCs across BL, ML and UL, subject to the direction’s applicability and exceptions', effective: 'Directions dated 28 November 2025', changed: 'Collecting PAN and an identity document is only the starting point. The control continues after onboarding through risk classification, periodic updating, transaction monitoring, record retention and escalation or reporting of suspicious activity. The depth of checks should follow the customer’s risk and the product or delivery channel used.', action: 'Review the customer-acceptance policy, beneficial-owner test, sanctions screening, KYC update calendar, monitoring alerts and FIU-IND escalation trail.', source: 'RBI (NBFC — Know Your Customer) Directions, 2025 — applicability and customer due-diligence provisions.', id: 9 },
                ].map((item, index) => (
                  <article key={item.title} className="p-4 sm:p-5">
                    <div className="grid gap-3 lg:grid-cols-[150px_1fr_auto] lg:items-start">
                      <div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{item.tag}</span><p className="mt-2 font-mono text-xs font-semibold text-muted-foreground">{item.date}</p></div>
                      <div><h3 className="font-semibold">{item.title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.summary}</p><div className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2"><p><span className="font-semibold text-foreground">Applies to:</span> {item.applies}</p><p><span className="font-semibold text-foreground">Effective:</span> {item.effective}</p></div></div>
                      <button type="button" onClick={() => setOpenUpdate(openUpdate === index ? null : index)} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Explain this rule <span aria-hidden="true">{openUpdate === index ? '↑' : '↓'}</span></button>
                    </div>
                    {openUpdate === index && <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/[.045] p-4 text-sm leading-6 sm:p-5"><p className="font-semibold text-primary">What this means</p><p className="mt-2 text-foreground/85">{item.changed}</p><div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-xl border border-primary/10 bg-background p-4"><p className="text-xs font-semibold uppercase tracking-[.08em] text-muted-foreground">What your team should do</p><p className="mt-2 text-foreground/85">{item.action}</p></div><div className="rounded-xl border border-primary/10 bg-background p-4"><p className="text-xs font-semibold uppercase tracking-[.08em] text-muted-foreground">Where the rule comes from</p><p className="mt-2 text-foreground/85">{item.source}</p></div></div><p className="mt-4"><span className="font-semibold">Applies to:</span> {item.applies}</p><p><span className="font-semibold">Status / date:</span> {item.effective}</p><button type="button" onClick={() => { const reg = regulations.find((entry) => entry.id === item.id); if (reg) setSelected(reg); }} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Open the detailed regulation note <ArrowRight className="size-3.5" /></button></div>}
                  </article>
                ))}
              </div>
            </section>

            <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
              <section id="nbfc-scenarios" className="scroll-mt-24 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div><p className="eyebrow">Where you have already met one</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">NBFCs hide in ordinary financial moments.</h2></div>
                  <button type="button" onClick={() => selectPrimaryArea('learn')} className="text-sm font-semibold text-primary hover:underline">Learn the basics</button>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {[
                    ['Gold loan counter', 'Not a bank. Often an NBFC. What changes about interest and gold safety?', 'That local gold-loan chain is usually an NBFC. It may approve faster than a bank because it follows a different rulebook, but the rate, auction process and custody controls still need to be checked carefully.', 'gold loan NBFC'],
                    ['Instant loan app', 'Five-minute approval usually has a regulated lender behind the screen. Who is it?', 'The app may only be the technology layer. The actual lender should be a bank or RBI-registered NBFC, and digital-lending rules require the lender name and total cost to be disclosed before you accept.', 'digital lending LSP NBFC'],
                    ['Vehicle finance', 'Dealer financing is one of the oldest NBFC use cases. Why is it everywhere?', 'Vehicle-finance NBFCs grew around dealer networks. The offer may be convenient, but comparing the bank quote, processing fee and foreclosure conditions is still worth doing.', 'vehicle finance NBFC'],
                    ['Business loan', 'MSME credit increasingly runs through NBFCs. What does that mean for borrowers?', 'NBFCs often lend to small businesses using cash-flow and invoice data where banks may ask for longer records or collateral. The trade-off is usually pricing and documentation.', 'MSME loan NBFC'],
                    ['Chit fund confusion', 'Near the NBFC world, but not the same. The difference matters when things go wrong.', 'Chit funds are not ordinary RBI-regulated NBFCs. They sit under a different legal framework, so the complaint route and recovery path can be very different.', 'chit fund NBFC difference'],
                    ['Co-lending offer', 'Sometimes a bank and NBFC share the loan. Whose rule protects you?', 'Co-lending lets a bank and an NBFC jointly fund one loan. The agreement should show both lenders and their shares so the borrower knows who is responsible for what.', 'co-lending NBFC'],
                  ].map(([title, body, notes, search]) => (
                    <article key={title} className="group rounded-2xl border border-border p-4 text-left hover:border-primary/30 hover:bg-secondary/35">
                      <button type="button" onClick={() => setOpenScenario(openScenario === title ? null : title)} className="w-full text-left">
                        <div className="flex items-start justify-between gap-3"><h3 className="font-semibold group-hover:text-primary">{title}</h3><ChevronRight className={`size-4 text-muted-foreground transition-transform ${openScenario === title ? 'rotate-90' : ''}`} /></div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                        <p className="mt-3 text-xs font-semibold text-primary">{openScenario === title ? 'Close file ↑' : 'Open file →'}</p>
                      </button>
                      {openScenario === title && <div className="mt-4 rounded-xl border border-primary/15 bg-primary/[.045] p-4 text-sm leading-6 text-foreground/85"><p>{notes}</p></div>}
                    </article>
                  ))}
                </div>
              </section>

              <aside id="nbfc-checker" className="scroll-mt-24 rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6">
                <AlertTriangle className="size-5 text-amber-700" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-[.12em] text-amber-800">Before you hand over documents</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-amber-950">Check if it&apos;s legit.</h2>
                <p className="mt-3 text-sm leading-6 text-amber-950">A genuine NBFC carries an RBI Certificate of Registration and appears in RBI&apos;s public records. Before you share KYC documents with an app, agent, or branch counter, three checks take less than five minutes.</p>
                <a href="https://rbi.org.in/Scripts/BS_NBFCList.aspx" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-800">Check registration route <ArrowRight className="size-4" /></a>
                <div className="mt-5 space-y-3 border-t border-amber-200 pt-5">
                  {[
                    ['1', 'Match the exact legal name.', 'Take the name precisely as it appears on the lender’s paperwork or app — not a shortened or marketing name. A name close to a well-known NBFC, such as an extra word or swapped letter, is itself a common impersonation tactic. RBI records are matched by exact legal entity name, so this step makes the rest of the check meaningful.'],
                    ['2', 'Ask for the CoR number.', 'Every registered NBFC has a Certificate of Registration number issued by RBI. A legitimate lender should produce this without hesitation — it is usually printed on loan agreements and often disclosed on the lender’s own website. Reluctance or a vague answer is itself informative.'],
                  ].map(([step, title, body]) => (
                    <div key={step} className="rounded-2xl border border-amber-200 bg-white/55 p-4">
                      <div className="flex items-start gap-3">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-amber-900 font-mono text-xs font-semibold text-white">{step}</span>
                        <div><p className="text-sm font-semibold text-amber-950">{title}</p><p className="mt-1 text-xs leading-5 text-amber-950/85">{body}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-amber-300 bg-white/60 p-4 text-xs leading-5 text-amber-950">
                  <p><strong>Step 3 happens on RBI&apos;s public list:</strong> cross-check the exact legal name and CoR number together. RBI&apos;s site structure can change, so this page links to the official RBI domain rather than relying on a hidden third-party source.</p>
                </div>
              </aside>
            </div>

            <div className="grid gap-5">
              <section id="nbfc-glossary" className="scroll-mt-24 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
                <p className="eyebrow">Glossary preview</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">Ten terms that show up everywhere.</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    ['NBFC-D', 'Deposit-taking NBFC.'],
                    ['NBFC-ND', 'Non-deposit-taking NBFC.'],
                    ['Upper Layer', 'A higher-intensity SBR category.'],
                    ['CRAR', 'Capital cushion against risk-weighted assets.'],
                    ['KYC', 'Customer identity and AML checks.'],
                    ['Fair Practices Code', 'Borrower-facing conduct rules.'],
                    ['Co-lending', 'A bank and NBFC sharing a loan.'],
                    ['Securitisation', 'Turning loan pools into tradable exposures.'],
                    ['Ombudsman', 'A complaint escalation route.'],
                    ['Systemically Important', 'Large or interconnected NBFCs that attract tighter supervision.'],
                  ].map(([term, meaning]) => (
                    <button key={term} type="button" title={meaning} aria-pressed={activeGlossary === term} onClick={() => setActiveGlossary(activeGlossary === term ? null : term)} className={`rounded-full border px-3 py-2 text-sm font-semibold ${activeGlossary === term ? 'border-primary bg-primary text-primary-foreground' : 'border-primary/20 bg-primary/[.045] text-primary hover:bg-primary hover:text-primary-foreground'}`}>{term}</button>
                  ))}
                </div>
                {activeGlossary && (() => {
                  const item = [
                    ['NBFC-D', 'Deposit-taking NBFC.'],
                    ['NBFC-ND', 'Non-deposit-taking NBFC.'],
                    ['Upper Layer', 'A higher-intensity SBR category.'],
                    ['CRAR', 'Capital cushion against risk-weighted assets.'],
                    ['KYC', 'Customer identity and AML checks.'],
                    ['Fair Practices Code', 'Borrower-facing conduct rules.'],
                    ['Co-lending', 'A bank and NBFC sharing a loan.'],
                    ['Securitisation', 'Turning loan pools into tradable exposures.'],
                    ['Ombudsman', 'A complaint escalation route.'],
                    ['Systemically Important', 'Large or interconnected NBFCs that attract tighter supervision.'],
                  ].find(([term]) => term === activeGlossary);
                  return item ? <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/[.045] p-4 text-sm leading-6"><span className="font-semibold text-primary">{item[0]} — </span>{item[1]}<button type="button" onClick={() => { setQuery(item[0]); setPrimaryArea('regulations'); }} className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Open source <ArrowRight className="size-3" /></button></div> : null;
                })()}
                <button type="button" onClick={() => selectPrimaryArea('learn')} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Full glossary, with examples → Learn NBFCs</button>
              </section>
            </div>

            <section className="rounded-3xl border border-border bg-[#07182b] p-5 text-white shadow-[0_24px_70px_-42px_rgba(2,12,27,.8)] sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-cyan-200">Want to go deeper?</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Explore ends here. Three ways to keep going.</h2>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  ['🎓', 'Learn it', 'Start from zero: what an NBFC actually is, the ten terms that matter, and every scenario in full.', 'Learn NBFCs', () => selectPrimaryArea('learn')],
                  ['📋', 'Find the rule', 'Search RBI’s actual directions and circulars, plain-language summaries attached.', 'Regulations', () => selectPrimaryArea('regulations')],
                  ['⚖', 'Apply it', 'Tell us about a specific NBFC or loan, and see exactly what applies to it.', 'Compliance', () => selectPrimaryArea('compliance')],
                ].map(([icon, title, body, label, action]) => (
                  <button key={title as string} type="button" onClick={action as () => void} className="group rounded-2xl border border-white/15 bg-white/[.06] p-5 text-left hover:border-cyan-200/60 hover:bg-white/[.1]">
                    <span className="text-2xl" aria-hidden="true">{icon as string}</span>
                    <h3 className="mt-4 text-lg font-semibold group-hover:text-cyan-100">{title as string}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{body as string}</p>
                    <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">{label as string} <ArrowRight className="size-4" /></p>
                  </button>
                ))}
              </div>
            </section>

            <footer className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <p className="text-sm leading-6 text-muted-foreground">Written for general understanding, sourced from public RBI records. This site does not lend, take deposits, or give financial advice.</p>
              <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['Just starting out', 'Bank vs NBFC · Glossary'],
                  ['Dealing with one now', 'Check registration · Know your rights'],
                  ['Go deeper', 'Test yourself · Types of NBFCs'],
                  ['About this desk', 'Sources · Corrections'],
                ].map(([title, body]) => (
                  <div key={title}>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-muted-foreground">{body}</p>
                  </div>
                ))}
              </div>
            </footer>
          </section>
        )}

        <section className={`grid items-start gap-4 ${primaryArea === 'regulations' ? 'xl:grid-cols-1' : primaryArea === 'compliance' ? 'xl:grid-cols-[minmax(0,1fr)_390px]' : 'hidden'}`}>
          <div className="grid self-start gap-4">
          <div className={`command-panel overflow-hidden rounded-3xl border border-slate-200 bg-[#07182b] p-6 text-white shadow-[0_24px_70px_-42px_rgba(2,12,27,.8)] sm:p-8 ${primaryArea === 'regulations' ? '' : 'hidden'}`}>
            <div className="relative z-10 max-w-3xl"><div className="mb-5 flex items-center gap-2 text-sm text-cyan-200"><BookOpen className="size-4" />Regulations</div><h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Search and browse NBFC regulations.</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">Use the indexed RBI directions, circulars and requirements. Keep the advanced filters here, away from the learning and compliance journeys.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_175px_130px_130px]">
                <div className="relative"><Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input aria-label="Ask an NBFC compliance question" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') answerQuestion(); }} placeholder="Ask an NBFC compliance question…" className="h-11 border-white/15 bg-white/10 pl-10 pr-24 text-[15px] text-white placeholder:text-slate-400 focus-visible:border-cyan-300" /><button type="button" onClick={answerQuestion} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-cyan-200 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-cyan-100">Answer</button></div>
                <NativeSelect aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full [&_select]:h-11 [&_select]:border-white/15 [&_select]:bg-white/10 [&_select]:text-white">{categoryOptions.map((option) => <NativeSelectOption key={option} value={option}>{option}</NativeSelectOption>)}</NativeSelect>
                <NativeSelect aria-label="Filter by layer" value={layer} onChange={(e) => setLayer(e.target.value)} className="w-full [&_select]:h-11 [&_select]:border-white/15 [&_select]:bg-white/10 [&_select]:text-white">{['All layers','BL','ML','UL','Reference'].map((option) => <NativeSelectOption key={option} value={option}>{option}</NativeSelectOption>)}</NativeSelect>
                <NativeSelect aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full [&_select]:h-11 [&_select]:border-white/15 [&_select]:bg-white/10 [&_select]:text-white">{['All statuses','Core','Specialist','Reference'].map((option) => <NativeSelectOption key={option} value={option}>{option}</NativeSelectOption>)}</NativeSelect>
              </div>
              {researchAnswer && <ResearchPanel question={answeredQuestion} answer={researchAnswer} relatedTitle={primaryAnswer?.title} onOpenRelated={primaryAnswer ? () => setSelected(primaryAnswer) : undefined} />}
            </div>
          </div>
          <section className={`rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7 ${primaryArea === 'compliance' ? '' : 'hidden'}`}>
            <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div><p className="eyebrow">Your regulatory starting point</p><h2 className="mt-1 text-xl font-semibold tracking-tight">Turn the identity card into a reading order</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">The selections on the right narrow the library. Use this summary to see what the profile changes and which directions to examine first.</p></div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"><CheckCircle2 className="size-4" />Profile applied</span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
              <div className="rounded-2xl bg-secondary/55 p-5">
                <p className="text-xs font-semibold uppercase tracking-[.1em] text-muted-foreground">Current conclusion</p>
                <p className="mt-2 text-lg font-semibold">{entityType} in {profileLayer}</p>
                <p className="mt-2 text-sm leading-6 text-foreground/80">{layerGuidance[profileLayer]} {depositStatus === 'Deposit taking' ? 'Public-deposit requirements must also be tested.' : 'Public-deposit rules do not apply unless RBI authorisation and the actual funding model indicate otherwise.'}</p>
                {activeCharacteristics.length > 0 && <p className="mt-3 border-t border-border pt-3 text-sm leading-6 text-foreground/80"><strong>Operating overlays:</strong> {activeCharacteristics.join(', ')}.</p>}
              </div>
              <div>
                <p className="text-sm font-semibold">Open these directions first</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">{priorityIds.slice(0,4).map((id, index) => { const reg = regulations.find((item) => item.id === id); return reg ? <button type="button" key={id} onClick={() => setSelected(reg)} className="group flex min-h-14 items-center gap-3 rounded-xl border border-border px-3.5 py-2.5 text-left hover:border-primary/30 hover:bg-secondary/40"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 font-mono text-xs font-semibold text-primary">{index + 1}</span><span className="text-sm font-semibold leading-5 group-hover:text-primary">{reg.short}</span><ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></button> : null; })}</div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">{[['1','Confirm applicability','Check category, layer, deposit status and operating model.'],['2','Find the trigger','Identify the event: sanction, default, outsourcing, control change or reporting date.'],['3','Record the conclusion','State applicable, not applicable, or applicable with modification—and retain the evidence.']].map(([number,title,body]) => <div key={number} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{number}</span><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p></div></div>)}</div>
          </section>
          </div>
          <aside id="identity-card" onFocusCapture={() => setPrimaryArea('compliance')} onClick={() => setPrimaryArea('compliance')} className={`scroll-mt-20 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6 ${primaryArea === 'compliance' ? '' : 'hidden'}`}>
            <div className="flex items-start justify-between gap-4">
              <div><p className="eyebrow">Step one · applicability</p><h2 className="mt-1 text-xl font-semibold tracking-tight">Build the NBFC identity</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">This profile tells you which regulatory rulebook to open first. Change any answer when the business model changes.</p></div>
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10"><Network className="size-5 text-primary" /></span>
            </div>
            <div className="mt-5 grid gap-4">
              <label className="text-sm font-semibold">1. What kind of NBFC is it?<NativeSelect value={entityType} onChange={(e) => setEntityType(e.target.value)} className="mt-1.5 w-full"><NativeSelectOption value="NBFC-ICC">NBFC-ICC</NativeSelectOption>{['NBFC-MFI','NBFC-Factor','HFC','CIC','IFC','IDF-NBFC','NBFC-P2P','Account Aggregator','SPD'].map((item) => <NativeSelectOption key={item} value={item}>{item}</NativeSelectOption>)}</NativeSelect><span className="mt-1.5 block text-xs font-normal leading-5 text-muted-foreground">Category is based on the activity actually carried on—not only the company name.</span></label>
              <label className="text-sm font-semibold">2. Which Scale Based Regulation layer?<NativeSelect value={profileLayer} onChange={(e) => setLayer(e.target.value)} className="mt-1.5 w-full">{['BL','ML','UL'].map((item) => <NativeSelectOption key={item} value={item}>{item}</NativeSelectOption>)}</NativeSelect><span className="mt-1.5 block text-xs font-normal leading-5 text-muted-foreground">Higher layers generally inherit lower-layer rules and add stricter controls.</span></label>
              <label className="text-sm font-semibold">3. Can it accept public deposits?<NativeSelect value={depositStatus} onChange={(e) => setDepositStatus(e.target.value)} className="mt-1.5 w-full"><NativeSelectOption value="Non-deposit taking">No — non-deposit taking</NativeSelectOption><NativeSelectOption value="Deposit taking">Yes — deposit taking</NativeSelectOption></NativeSelect><span className="mt-1.5 block text-xs font-normal leading-5 text-muted-foreground">Choose “Yes” only where RBI authorisation permits public deposits.</span></label>
              <label className="text-sm font-semibold">4. What is its asset size? (₹ crore)<Input type="number" min="0" step="any" value={assetSizeCrore} onChange={(e) => setAssetSizeCrore(e.target.value)} placeholder="Enter audited asset size if known" className="mt-1.5" /><span className="mt-1.5 block text-xs font-normal leading-5 text-muted-foreground">Used for size-triggered rules such as LCR. Leave blank if not known.</span></label>
              <label className="text-sm font-semibold">5. Does it avail public funds?<NativeSelect value={publicFundsStatus} onChange={(e) => setPublicFundsStatus(e.target.value)} className="mt-1.5 w-full"><NativeSelectOption value="Not specified">Not specified</NativeSelectOption><NativeSelectOption value="Yes">Yes</NativeSelectOption><NativeSelectOption value="No">No</NativeSelectOption></NativeSelect><span className="mt-1.5 block text-xs font-normal leading-5 text-muted-foreground">Public funds can change applicability for certain Base Layer NBFCs.</span></label>
              <fieldset><legend className="text-sm font-semibold">6. How does it operate?</legend><p className="mt-1 text-xs leading-5 text-muted-foreground">Select every feature that applies; each one adds a regulatory overlay.</p><div className="mt-2 grid grid-cols-2 gap-2">{([['customer','Customer-facing'],['digital','Digital lending'],['outsourcing','Uses outsourcing']] as const).map(([key,label]) => <label key={key} className="flex min-h-10 items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium"><Checkbox checked={characteristics[key]} onCheckedChange={(checked) => setCharacteristics((current) => ({ ...current, [key]: Boolean(checked) }))} />{label}</label>)}</div></fieldset>
              <div className="rounded-2xl border border-primary/15 bg-primary/[.045] p-4">
                <p className="text-xs font-semibold uppercase tracking-[.1em] text-primary">What this profile means</p>
                <p className="mt-2 text-sm font-semibold leading-6">{entityType} · {profileLayer} · {depositStatus}</p>
                <p className="mt-2 text-sm leading-6 text-foreground/85">{entityGuidance[entityType]}</p>
                <p className="mt-2 text-sm leading-6 text-foreground/85">{layerGuidance[profileLayer]}</p>
                {activeCharacteristics.length > 0 && <p className="mt-2 text-sm leading-6 text-foreground/85">Its operating model also brings in {activeCharacteristics.join(', ')}.</p>}
                <div className="mt-4 border-t border-primary/10 pt-3"><p className="text-xs font-semibold text-foreground">Review these directions first</p><div className="mt-2 flex flex-wrap gap-2">{priorityIds.map((id) => { const reg = regulations.find((item) => item.id === id); return reg ? <button type="button" key={id} onClick={() => setSelected(reg)} className="rounded-full border border-primary/20 bg-background px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground">{reg.short}</button> : null; })}</div></div>
              </div>
            </div>
          </aside>
        </section>

        <section aria-label="Key thresholds" className={`mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4 ${primaryArea === 'regulations' ? '' : 'hidden'}`}>{thresholds.map((item) => <button type="button" key={item.label} onClick={() => setSelectedThreshold(item)} aria-label={`Explain ${item.value} ${item.label}, source clauses and layer applicability`} className={`threshold-card tone-${item.tone} group rounded-2xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5`}><p className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">{item.value}</p><div className="mt-3 flex items-end justify-between gap-3"><div><p className="text-sm font-semibold">{item.label}</p><p className="mt-0.5 text-xs text-muted-foreground">{item.note}</p></div><span className="grid size-8 place-items-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><ArrowUpRight className="size-4" /></span></div><p className="mt-3 border-t border-border/70 pt-3 text-xs font-medium text-primary">Open source, clauses and BL / ML / UL view</p></button>)}</section>

        <Tabs id="workbench" value={workspaceTab} onValueChange={(value) => { setWorkspaceTab(value); setPrimaryArea(value === 'regulations' ? 'regulations' : 'learn'); }} className={`mt-8 scroll-mt-20 ${primaryArea === 'learn' || primaryArea === 'regulations' ? '' : 'hidden'}`}><div className="flex flex-col gap-4 border-b border-border pb-3"><div><p className="eyebrow">{primaryArea === 'regulations' ? 'Regulatory law library' : 'Learn NBFCs'}</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">{primaryArea === 'regulations' ? 'Learn how to find, read and apply the governing rule' : 'From first question to practical understanding'}</h2></div><TabsList variant="line" className="h-auto w-full justify-start overflow-x-auto"><TabsTrigger value="start" className={primaryArea === 'learn' ? '' : 'hidden'}><GraduationCap />Start here</TabsTrigger><TabsTrigger value="learn" className={primaryArea === 'learn' ? '' : 'hidden'}><Compass />Learning journey</TabsTrigger><TabsTrigger value="decision" className={primaryArea === 'learn' ? '' : 'hidden'}><BookOpen />Explore concepts</TabsTrigger><TabsTrigger value="examples" className={primaryArea === 'learn' ? '' : 'hidden'}><BadgeIndianRupee />Case lab</TabsTrigger><TabsTrigger value="history" className={primaryArea === 'learn' ? '' : 'hidden'}><FileText />Glossary</TabsTrigger><TabsTrigger value="regulations" className={primaryArea === 'regulations' ? '' : 'hidden'}><Scale />Regulations course & library</TabsTrigger></TabsList></div>
          <TabsContent value="regulations" className="pt-5"><RegulationsWorkbench regulations={regulations} onOpenRegulation={(regulation) => setSelected(regulation)} /></TabsContent>
          <TabsContent value="history" className="pt-5">{(() => { const entry = learnGlossary.find(([term]) => term === learningGlossaryTerm); return <div className="grid gap-5 lg:grid-cols-[1fr_.85fr]"><section className="rounded-3xl border border-border bg-card p-5 sm:p-8"><p className="eyebrow">Plain-English glossary</p><h3 className="mt-1 text-2xl font-semibold">Decode the language of NBFCs</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Select any term. The definition appears beside the list without taking you away from the learning journey.</p><div className="mt-6 flex flex-wrap gap-2">{learnGlossary.map(([term]) => <button type="button" key={term} aria-pressed={learningGlossaryTerm === term} onClick={() => setLearningGlossaryTerm(term)} className={`rounded-full border px-3 py-2 text-sm font-semibold ${learningGlossaryTerm === term ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary/30 hover:text-primary'}`}>{term}</button>)}</div></section><aside className="rounded-3xl border border-primary/20 bg-[#07182b] p-6 text-white sm:p-8"><p className="text-xs font-semibold uppercase tracking-[.16em] text-cyan-200">Selected term</p><h3 className="mt-4 text-4xl font-semibold tracking-[-.04em]">{entry?.[0] ?? 'Choose a term'}</h3><p className="mt-5 text-lg leading-8 text-slate-200">{entry?.[1] ?? 'Select a term to see a plain-English explanation.'}</p><div className="mt-7 border-t border-white/10 pt-5"><button type="button" onClick={() => { const moduleIndex = learningModules.findIndex((module) => module.terms.includes(entry?.[0] ?? '')); if (moduleIndex >= 0) { setActiveLearningModule(moduleIndex); setWorkspaceTab('learn'); } }} className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:underline">See this term in the learning journey<ArrowRight /></button></div></aside></div>; })()}</TabsContent>
          <TabsContent value="start" className="pt-5"><div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#07182b] text-white shadow-[0_28px_80px_-48px_rgba(2,12,27,.9)]"><div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.15fr_.85fr] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-200">Start from zero</p><h3 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-.04em] sm:text-4xl">How does an NBFC actually work?</h3><p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">You do not need to know RBI regulations yet. Begin with one simple question and follow the institution from registration to lending, borrower default, governance and RBI supervision.</p><div className="mt-6 flex flex-wrap items-center gap-3"><Button className="bg-cyan-200 text-slate-950 hover:bg-cyan-100" onClick={() => { setActiveLearningModule(0); setWorkspaceTab('learn'); document.getElementById('workbench')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>Start with: What is an NBFC?<ArrowRight /></Button><span className="text-sm font-medium text-slate-300">20 modules · Beginner → practical understanding</span></div></div><div className="rounded-2xl border border-white/10 bg-white/[.06] p-5"><p className="text-xs font-semibold uppercase tracking-[.14em] text-cyan-200">You will finish able to</p><p className="mt-3 text-2xl font-semibold leading-tight">“Understand how an NBFC works.”</p><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">{['Identify its category and SBR layer','Follow one loan through its complete lifecycle','Connect capital, KYC, NPA, governance and reporting','Know which RBI rule to open next'].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-1 size-4 shrink-0 text-cyan-200" />{item}</li>)}</ul></div></div><div className="border-t border-white/10 bg-white/[.035] p-6 sm:p-9"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-cyan-200">Your journey</p><h4 className="mt-1 text-xl font-semibold">Four chapters. Twenty connected questions.</h4></div><button type="button" onClick={() => setWorkspaceTab('decision')} className="hidden text-sm font-semibold text-cyan-200 hover:underline sm:block">View full syllabus →</button></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{learningPhases.map((phase) => <div key={phase.label} className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><p className="font-semibold text-cyan-100">{phase.label}</p><p className="mt-1 text-xs font-semibold uppercase tracking-[.08em] text-slate-400">{phase.range}</p><p className="mt-3 text-sm leading-6 text-slate-300">{phase.body}</p></div>)}</div><div className="mt-5 flex gap-2 overflow-x-auto pb-2">{learningModules.map((module, index) => <button type="button" key={module.number} title={module.title} onClick={() => { setActiveLearningModule(index); setWorkspaceTab('learn'); }} className="group flex min-w-[150px] items-center gap-3 rounded-xl border border-white/10 bg-white/[.04] px-3 py-3 text-left hover:border-cyan-200/50 hover:bg-cyan-200/10"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-cyan-200/10 font-mono text-xs font-semibold text-cyan-100">{String(module.number).padStart(2,'0')}</span><span className="text-xs font-semibold leading-4 text-slate-200 group-hover:text-cyan-100">{module.title}</span></button>)}</div></div></div></TabsContent>
          <TabsContent value="examples" className="pt-5"><div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]"><aside className="rounded-3xl border border-border bg-card p-5 sm:p-6"><p className="eyebrow">Capstone · Base Layer NBFC-ICC</p><h3 className="mt-1 text-2xl font-semibold">Run an NBFC for a year</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Move from registration to an RBI question. Every decision connects to a module you have already learned.</p><div className="mt-6 max-h-[640px] space-y-2 overflow-y-auto pr-1">{caseLabSteps.map((step, index) => <button type="button" key={step.title} onClick={() => setActiveCaseStep(index)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${activeCaseStep === index ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary/30 hover:bg-secondary/40'}`}><span className={`grid size-8 shrink-0 place-items-center rounded-lg font-mono text-xs font-semibold ${activeCaseStep === index ? 'bg-white/15' : 'bg-primary/10 text-primary'}`}>{String(index + 1).padStart(2,'0')}</span><span className="text-sm font-semibold leading-5">{step.title}</span><ChevronRight className="ml-auto size-4 shrink-0" /></button>)}</div></aside><section className="rounded-3xl border border-border bg-card p-5 sm:p-8"><div className="flex flex-wrap items-center gap-2"><Badge className="bg-primary">Year-one decision {String(activeCaseStep + 1).padStart(2,'0')}</Badge><Badge variant="outline">NBFC-ICC · BL · Non-deposit taking</Badge></div><h3 className="mt-5 text-3xl font-semibold tracking-[-.035em]">{caseLabSteps[activeCaseStep].title}</h3><p className="mt-4 text-lg leading-8 text-foreground/85">{caseLabSteps[activeCaseStep].prompt}</p><div className="mt-7 grid gap-4 sm:grid-cols-3">{[['Ask','What fact or event activates the rule?'],['Decide','Which function owns the action and approval?'],['Prove','What document, system record or report shows compliance?']].map(([title,body], index) => <div key={title} className="rounded-2xl border border-border bg-secondary/25 p-4"><span className="font-mono text-xs font-semibold text-primary">0{index + 1}</span><p className="mt-2 font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p></div>)}</div><div className="mt-7 rounded-2xl border border-blue-200 bg-blue-50 p-5"><p className="eyebrow text-blue-800">Open the governing material</p><p className="mt-2 text-sm leading-6 text-blue-950">Use the detailed notes to test applicability, conditions, timelines and evidence for this decision.</p><div className="mt-4 flex flex-wrap gap-2">{caseLabSteps[activeCaseStep].ids.map((id) => { const reg = regulations.find((item) => item.id === id); return reg ? <Button key={id} variant="outline" className="border-blue-300 bg-white text-blue-950" onClick={() => setSelected(reg)}>{reg.short}<ArrowUpRight /></Button> : null; })}</div></div><div className="mt-7 flex items-center justify-between border-t border-border pt-5"><Button variant="outline" disabled={activeCaseStep === 0} onClick={() => setActiveCaseStep((current) => Math.max(0, current - 1))}>Previous decision</Button>{activeCaseStep < caseLabSteps.length - 1 ? <Button onClick={() => setActiveCaseStep((current) => Math.min(caseLabSteps.length - 1, current + 1))}>What happens next?<ArrowRight /></Button> : <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">You completed the year ✓</div>}</div></section></div></TabsContent>
          <TabsContent value="map" className="pt-5"><div className="rounded-3xl border border-border bg-card p-5 sm:p-8"><div className="max-w-3xl"><p className="eyebrow">The whole system on one screen</p><h3 className="mt-1 text-2xl font-semibold tracking-tight">NBFC regulatory map</h3><p className="mt-2 text-base leading-7 text-muted-foreground">Start with where the institution is in its lifecycle. Then open the subject—not a circular number.</p></div><div className="mt-7 grid gap-4 xl:grid-cols-4">{regulatoryMap.map((group, index) => <section key={group.stage} className={`rounded-2xl border p-5 ${group.tone}`}><div className="flex items-center justify-between"><span className="font-mono text-xs font-semibold">0{index + 1}</span><ArrowRight className="size-4" /></div><h4 className="mt-4 text-lg font-semibold">{group.stage}</h4><p className="mt-1 text-sm font-semibold leading-5">{group.prompt}</p><p className="mt-2 text-sm leading-6 opacity-80">{group.body}</p><div className="mt-4 flex flex-wrap gap-1.5">{group.ids.slice(0,6).map((id) => { const reg = regulations.find((item) => item.id === id); return reg ? <button type="button" key={id} onClick={() => setSelected(reg)} className="rounded-full border border-current/15 bg-white/70 px-2.5 py-1 text-xs font-semibold hover:bg-white">{reg.short}</button> : null; })}</div></section>)}</div></div></TabsContent>
          <TabsContent value="library" className="pt-5">
            {filtered.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((reg) => (
                  <button key={reg.id} onClick={() => setSelected(reg)} className="reg-card group min-h-[230px] rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_18px_38px_-28px_rgba(2,20,40,.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><FileText className="size-5" /></span><Badge variant={reg.status === 'Core' ? 'default' : 'outline'} className={reg.status === 'Core' ? 'bg-primary' : ''}>{reg.status}</Badge></div>
                    <h3 className="mt-5 text-lg font-semibold leading-snug tracking-tight group-hover:text-primary">{reg.short}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{reg.summary}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4 text-xs text-muted-foreground"><span>{reg.category}</span><span>·</span><span>{reg.layers.join(' / ')}</span><span className="ml-auto rounded-full bg-blue-50 px-2 py-1 font-semibold text-blue-900">Check BL / ML / UL</span><ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" /></div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center"><Search className="mx-auto size-6 text-muted-foreground" /><h3 className="mt-3 font-semibold">No matching regulation</h3><p className="mt-1 text-sm text-muted-foreground">Try a broader term or reset one of the filters.</p><Button variant="outline" className="mt-4" onClick={() => { setQuery(''); setCategory('All categories'); setLayer('All layers'); setStatus('All statuses'); }}>Clear filters</Button></div>
            )}
          </TabsContent>
          <TabsContent value="problems" className="pt-5"><div className="rounded-3xl border border-border bg-card p-5 sm:p-7"><p className="eyebrow">Start with the work question</p><h3 className="mt-1 text-xl font-semibold">What are you trying to understand?</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Choose the question that sounds closest to the issue on your desk. The governing regulation opens with a plain-language explanation and applicability test.</p><div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{problemTopics.map(([question, destination, ids]) => <button type="button" key={question} onClick={() => { const reg = regulations.find((item) => item.id === ids[0]); if (reg) setSelected(reg); }} className="group flex items-center gap-3 rounded-xl border border-border p-3.5 text-left hover:border-primary/30 hover:bg-secondary/40"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><ArrowRight className="size-4" /></span><span><span className="block text-sm font-semibold group-hover:text-primary">{question}</span><span className="mt-0.5 block text-xs text-muted-foreground">{destination}</span></span></button>)}</div></div><div className="mt-5 grid gap-4 lg:grid-cols-[.82fr_1.18fr]"><div className="space-y-2">{issuePaths.map((issue, index) => <button key={issue.title} onClick={() => setIssueIndex(index)} className={`w-full rounded-xl border p-4 text-left transition-colors ${issueIndex === index ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/30'}`}><p className="text-sm font-semibold leading-5">{issue.title}</p></button>)}</div><div className="rounded-2xl border border-border bg-card p-5 sm:p-7"><p className="eyebrow">Follow a complete scenario</p><h3 className="mt-1 text-xl font-semibold">{issuePaths[issueIndex].title}</h3><div className="mt-6 space-y-3">{issuePaths[issueIndex].chain.map((step, index) => <button key={step} type="button" onClick={() => { const ids = issuePaths[issueIndex].regulations; const id = ids[Math.min(index, ids.length - 1)]; const reg = regulations.find((item) => item.id === id); if (reg) setSelected(reg); }} className="flex w-full items-center gap-3 rounded-xl border border-transparent px-2 py-2 text-left transition-colors hover:border-primary/20 hover:bg-secondary/60"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">{index + 1}</span><span className="text-sm font-medium">{step}</span><ChevronRight className="ml-auto size-4 text-muted-foreground" /></button>)}</div></div></div></TabsContent>
          <TabsContent value="learn" className="pt-5">{(() => { const module = learningModules[activeLearningModule]; return <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]"><aside className="rounded-3xl border border-border bg-card p-4 sm:p-5"><div className="border-b border-border pb-4"><p className="eyebrow">Learning journey</p><h3 className="mt-1 text-lg font-semibold">20 connected modules</h3><div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((activeLearningModule + 1) / learningModules.length) * 100}%` }} /></div><p className="mt-2 text-xs font-semibold text-muted-foreground">Module {activeLearningModule + 1} of {learningModules.length}</p></div><div className="mt-4 max-h-[760px] space-y-1.5 overflow-y-auto pr-1">{learningModules.map((item, index) => <button type="button" key={item.number} onClick={() => setActiveLearningModule(index)} className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left ${activeLearningModule === index ? 'border-primary bg-primary text-primary-foreground' : 'border-transparent hover:border-border hover:bg-secondary/50'}`}><span className={`grid size-8 shrink-0 place-items-center rounded-lg font-mono text-xs font-semibold ${activeLearningModule === index ? 'bg-white/15' : 'bg-primary/10 text-primary'}`}>{String(item.number).padStart(2,'0')}</span><span className="text-sm font-semibold leading-5">{item.title}</span></button>)}</div></aside><article className="overflow-hidden rounded-3xl border border-border bg-card"><header className="border-b border-border bg-[#07182b] p-6 text-white sm:p-8"><div className="flex flex-wrap items-center gap-2"><Badge className="bg-cyan-200 text-slate-950 hover:bg-cyan-200">Module {String(module.number).padStart(2,'0')}</Badge><span className="text-sm text-slate-300">{module.title}</span></div><p className="mt-6 text-xs font-semibold uppercase tracking-[.16em] text-cyan-200">Start with a question</p><h3 className="mt-2 max-w-4xl text-3xl font-semibold leading-tight tracking-[-.035em] sm:text-4xl">{module.question}</h3><p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">You are learning: {module.concepts}</p></header><div className="space-y-8 p-6 sm:p-8"><section><p className="eyebrow">The simple answer</p><p className="mt-3 text-lg leading-8 text-foreground/90">{module.answer}</p></section><section><p className="eyebrow">See how it works</p><div className="mt-4 grid gap-3 md:grid-cols-3">{module.flow.map((step, index) => <div key={step} className="relative rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-950"><span className="font-mono text-xs font-semibold text-blue-700">0{index + 1}</span><p className="mt-2 text-sm font-semibold leading-6">{step}</p>{index < module.flow.length - 1 && <ArrowRight className="absolute -right-2.5 top-1/2 hidden size-5 -translate-y-1/2 rounded-full bg-white text-blue-700 md:block" />}</div>)}</div></section><div className="grid gap-4 lg:grid-cols-2"><section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><p className="eyebrow text-emerald-800">Real-world example</p><p className="mt-3 text-sm leading-7 text-emerald-950">{module.example}</p></section><section className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="eyebrow text-amber-800">What if?</p><p className="mt-3 text-sm leading-7 text-amber-950">{module.whatIf}</p></section></div><section><p className="eyebrow">Key terms</p><div className="mt-3 flex flex-wrap gap-2">{module.terms.map((term) => <span key={term} className="rounded-full border border-primary/20 bg-primary/[.045] px-3 py-1.5 text-sm font-semibold text-primary">{term}</span>)}</div></section><section className="rounded-2xl border border-border bg-secondary/25 p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="eyebrow">RBI source · optional deeper reading</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Open the related regulation only when you want clauses, layer applicability, deadlines and compliance evidence.</p></div><div className="flex flex-wrap gap-2">{module.ids.slice(0,4).map((id) => { const reg = regulations.find((item) => item.id === id); return reg ? <Button key={id} variant="outline" size="sm" onClick={() => setSelected(reg)}>{reg.short}<ArrowUpRight /></Button> : null; })}</div></div></section><footer className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between"><Button variant="outline" disabled={activeLearningModule === 0} onClick={() => setActiveLearningModule((current) => Math.max(0, current - 1))}>Previous module</Button><div className="max-w-xl text-right"><p className="text-xs font-semibold uppercase tracking-[.1em] text-muted-foreground">Next curiosity</p><p className="mt-1 text-sm font-semibold leading-6">{module.next}</p></div>{activeLearningModule < learningModules.length - 1 ? <Button onClick={() => { setActiveLearningModule((current) => Math.min(learningModules.length - 1, current + 1)); document.getElementById('workbench')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>Next question<ArrowRight /></Button> : <Button onClick={() => { setActiveCaseStep(0); setWorkspaceTab('examples'); }}>Enter the Case Lab<ArrowRight /></Button>}</footer></div></article></div>; })()}</TabsContent>
<TabsContent value="issues" className="pt-5"><div className="grid gap-4 lg:grid-cols-[.82fr_1.18fr]"><div className="space-y-2">{issuePaths.map((issue, index) => <button key={issue.title} onClick={() => setIssueIndex(index)} className={`w-full rounded-xl border p-4 text-left transition-colors ${issueIndex === index ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/30'}`}><p className="text-sm font-semibold leading-5">{issue.title}</p></button>)}</div><div className="rounded-2xl border border-border bg-card p-5 sm:p-7"><p className="eyebrow">Question-led research path</p><h3 className="mt-1 text-xl font-semibold">{issuePaths[issueIndex].title}</h3><div className="mt-6 space-y-3">{issuePaths[issueIndex].chain.map((step, index) => <button key={step} type="button" onClick={() => { const ids = issuePaths[issueIndex].regulations; const id = ids[Math.min(index, ids.length - 1)]; const reg = regulations.find((item) => item.id === id); if (reg) setSelected(reg); }} className="flex w-full items-center gap-3 rounded-xl border border-transparent px-2 py-2 text-left transition-colors hover:border-primary/20 hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">{index + 1}</span><span className="text-sm font-medium">{step}</span><ChevronRight className="ml-auto size-4 text-muted-foreground" /></button>)}</div><div className="mt-7 border-t border-border pt-5"><p className="eyebrow">Open the governing directions</p><div className="mt-3 flex flex-wrap gap-2">{issuePaths[issueIndex].regulations.map((id) => { const reg = regulations.find((item) => item.id === id); return reg ? <Button key={id} variant="outline" size="sm" onClick={() => setSelected(reg)}>{reg.short}<ArrowUpRight className="size-3.5" /></Button> : null; })}</div></div></div></div></TabsContent>
          <TabsContent value="decision" className="pt-5"><div className="rounded-3xl border border-border bg-card p-5 sm:p-8"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Complete syllabus</p><h3 className="mt-1 text-2xl font-semibold">Explore all 20 concepts</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Use this view when you already know the topic you need. Every card opens the same question-led lesson—simple answer, visual flow, example, scenario, terms and RBI source.</p></div><Badge variant="outline" className="w-fit">Beginner → practical</Badge></div><div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{learningModules.map((module, index) => <button type="button" key={module.number} onClick={() => { setActiveLearningModule(index); setWorkspaceTab('learn'); document.getElementById('workbench')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="group rounded-2xl border border-border p-5 text-left hover:-translate-y-0.5 hover:border-primary/30 hover:bg-secondary/25 hover:shadow-sm"><div className="flex items-center justify-between"><span className="font-mono text-xs font-semibold text-primary">MODULE {String(module.number).padStart(2,'0')}</span><ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" /></div><h4 className="mt-4 text-lg font-semibold leading-6 group-hover:text-primary">{module.title}</h4><p className="mt-2 text-sm font-medium leading-6">{module.question}</p><p className="mt-3 text-xs leading-5 text-muted-foreground">{module.concepts}</p></button>)}</div></div></TabsContent>
        </Tabs>
      </div>

      <Sheet open={foundationIndex !== null} onOpenChange={(open) => !open && setFoundationIndex(null)}>
        <SheetContent key={foundationIndex ?? 'closed'} ref={attachFoundationDrawer} className="!w-[min(98vw,1240px)] !max-w-none overflow-y-auto border-l-slate-200 bg-background xl:!w-[min(92vw,1240px)]">
          {foundationIndex !== null && (() => { const answer = foundationAnswers[foundationIndex]; return <>
            <SheetHeader className="border-b border-border bg-card p-6 pr-14 sm:p-9 sm:pr-16">
              <div className="mb-3">
                <Button type="button" variant="outline" size="sm" onClick={goHome} className="gap-2"><Landmark className="size-4" />Back to Home</Button>
              </div>
              <div className="flex flex-wrap gap-2"><Badge className="bg-primary">Foundation {String(foundationIndex + 1).padStart(2,'0')}</Badge><Badge variant="outline">Seven-part answer</Badge></div>
              <SheetTitle className="mt-3 max-w-4xl text-3xl leading-tight sm:text-4xl">{answer.question}</SheetTitle>
              <SheetDescription className="max-w-4xl text-base leading-7">A practical explanation connected to the governing source, the relevant NBFC profile and the action a compliance team should take.</SheetDescription>
            </SheetHeader>
            <div className="space-y-5 p-6 sm:p-9">
              <section className="rounded-2xl border border-primary/15 bg-primary/[.045] p-5 sm:p-6"><p className="eyebrow text-primary">1 · Meaning</p><p className="mt-3 text-lg font-medium leading-8">{answer.meaning}</p></section>
              <div className="grid gap-5 lg:grid-cols-2">
                <section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><p className="eyebrow">2 · Regulatory source</p><p className="mt-3 text-[15px] font-semibold leading-7 text-primary">{answer.source}</p></section>
                <section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><p className="eyebrow">3 · Applicability</p><p className="mt-3 text-[15px] leading-7">{answer.applicability}</p></section>
              </div>
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6"><p className="eyebrow">4 · How it works</p><p className="mt-3 text-[15px] leading-7">{answer.how}</p></section>
              <section><p className="eyebrow">5 · Key regulatory conditions</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{answer.conditions.map((item, index) => <div key={item} className="flex gap-3 rounded-xl border border-border bg-card p-4 text-[15px] leading-6"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 font-mono text-xs font-semibold text-primary">{index + 1}</span><span>{item}</span></div>)}</div></section>
              <div className="grid gap-5 lg:grid-cols-2">
                <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6"><p className="eyebrow text-blue-800">6 · Example</p><p className="mt-3 text-[15px] leading-7 text-blue-950">{answer.example}</p></section>
                <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6"><p className="eyebrow text-emerald-800">7 · Practical / compliance impact</p><p className="mt-3 text-[15px] leading-7 text-emerald-950">{answer.impact}</p></section>
              </div>
              <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Open the governing directions</p><p className="mt-1 text-sm text-muted-foreground">Continue from the explanation to detailed obligations, timelines and evidence.</p><div className="mt-3 flex flex-wrap gap-2">{answer.relatedIds.map((id) => { const reg = regulations.find((item) => item.id === id); return reg ? <Button key={id} variant="outline" size="sm" onClick={() => setSelected(reg)}>{reg.short}<ArrowUpRight className="size-3.5" /></Button> : null; })}</div></div><div className="flex shrink-0 gap-2"><Button variant="outline" disabled={foundationIndex === 0} onClick={() => setFoundationIndex((current) => current === null ? 0 : Math.max(0, current - 1))}>Previous</Button><Button disabled={foundationIndex === foundationAnswers.length - 1} onClick={() => setFoundationIndex((current) => current === null ? 0 : Math.min(foundationAnswers.length - 1, current + 1))}>Next answer<ChevronRight /></Button></div></section>
            </div>
          </>; })()}
        </SheetContent>
      </Sheet>

      <Sheet open={Boolean(selectedThreshold)} onOpenChange={(open) => !open && setSelectedThreshold(null)}>
        <SheetContent className="!w-[min(98vw,1240px)] !max-w-none overflow-y-auto border-l-slate-200 bg-background xl:!w-[min(92vw,1240px)]">
          {selectedThreshold && <>
            <SheetHeader className="border-b border-border bg-card p-6 pr-14 sm:p-9 sm:pr-16">
              <div className="mb-3">
                <Button type="button" variant="outline" size="sm" onClick={goHome} className="gap-2"><Landmark className="size-4" />Back to Home</Button>
              </div>
              <div className="flex flex-wrap items-center gap-2"><Badge className="bg-primary">Key threshold</Badge><Badge variant="outline">{selectedThreshold.label}</Badge></div>
              <div className="mt-2 flex items-baseline gap-3"><span className="text-4xl font-semibold tracking-[-.04em] text-primary sm:text-5xl">{selectedThreshold.value}</span></div>
              <SheetTitle className="text-2xl leading-tight">What this number means—and when it applies</SheetTitle>
              <SheetDescription className="max-w-4xl text-base leading-7">{selectedThreshold.meaning}</SheetDescription>
            </SheetHeader>
            <div className="space-y-9 p-6 sm:p-9">
              <section className="rounded-2xl border border-primary/15 bg-primary/[.045] p-5 sm:p-6"><p className="eyebrow text-primary">Regulatory source</p><h3 className="mt-2 text-lg font-semibold leading-7">{selectedThreshold.source}</h3><div className="mt-4 rounded-xl border border-primary/15 bg-background p-4"><p className="text-xs font-semibold uppercase tracking-[.08em] text-muted-foreground">Clause / paragraph reference</p><p className="mt-1 text-[15px] font-semibold leading-6 text-primary">{selectedThreshold.clause}</p></div><p className="mt-3 text-xs leading-5 text-muted-foreground">References follow the numbering in the consolidated direction stored in this NBFC Regulations folder. Amendment numbering and effective dates should be rechecked before a filing or formal opinion.</p></section>

              <section><p className="eyebrow">Layer-by-layer applicability</p><h3 className="mt-1 text-xl font-semibold">Base, Middle and Upper Layer treatment</h3><div className="mt-4 grid gap-4 lg:grid-cols-3">{(['BL','ML','UL'] as const).map((layerName) => { const item = selectedThreshold.layers[layerName]; return <article key={layerName} className="overflow-hidden rounded-2xl border border-border bg-card"><div className="flex items-center justify-between border-b border-border bg-secondary/60 px-5 py-4"><div><p className="text-xs font-semibold uppercase tracking-[.1em] text-muted-foreground">{layerName === 'BL' ? 'Base Layer' : layerName === 'ML' ? 'Middle Layer' : 'Upper Layer'}</p><p className="mt-1 text-base font-semibold text-primary">{item.result}</p></div><span className="grid size-9 place-items-center rounded-full bg-background font-mono text-sm font-semibold text-primary">{layerName}</span></div><div className="p-5"><p className="text-sm leading-6 text-foreground/85">{item.detail}</p><div className="mt-4 border-t border-border pt-3"><p className="text-xs font-semibold text-muted-foreground">Read</p><p className="mt-1 text-sm font-semibold leading-5">{item.clause}</p></div></div></article>; })}</div></section>

              <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><div><p className="eyebrow">How to use this threshold</p><h3 className="mt-1 text-lg font-semibold">Four checks before concluding</h3><div className="mt-4 space-y-3">{selectedThreshold.test.map((item, index) => <div key={item} className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-6"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 font-mono text-xs font-semibold text-primary">{index + 1}</span><span>{item}</span></div>)}</div></div><aside className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><AlertTriangle className="size-5 text-amber-700" /><p className="mt-3 font-semibold text-amber-950">Do not apply the headline in isolation</p><p className="mt-2 text-sm leading-6 text-amber-950">{selectedThreshold.caution}</p></aside></section>

              <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Need the complete direction summary?</p><p className="mt-1 text-sm text-muted-foreground">Open its full applicability, obligations, timelines and evidence checklist.</p></div><Button onClick={() => { const reg = regulations.find((item) => item.id === selectedThreshold.regulationId); setSelectedThreshold(null); if (reg) setSelected(reg); }}>Open full regulation<ChevronRight /></Button></section>
            </div>
          </>}
        </SheetContent>
      </Sheet>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="!w-[min(98vw,1240px)] !max-w-none overflow-y-auto border-l-slate-200 bg-background xl:!w-[min(92vw,1240px)]">
          {selected && selectedDetails && <>
            <SheetHeader className="border-b border-border bg-card p-6 pr-14 sm:p-9 sm:pr-16">
              <div className="mb-3">
                <Button type="button" variant="outline" size="sm" onClick={goHome} className="gap-2"><Landmark className="size-4" />Back to Home</Button>
              </div>
              <div className="mb-3 flex flex-wrap gap-2"><button type="button" title={`Show all ${selected.status.toLowerCase()} regulations`} onClick={() => { setStatus(selected.status); setSelected(null); }} className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-85">{selected.status}</button><button type="button" title={`Filter by ${selected.category}`} onClick={() => { setCategory(selected.category); setSelected(null); }} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground hover:border-primary/40 hover:text-primary">{selected.category}</button>{selected.layers.map((item) => <button type="button" key={item} title={`Filter the library by ${item}; see the clause-based comparison below`} onClick={() => { setLayer(item); setSelected(null); }} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground hover:bg-primary hover:text-primary-foreground">{item}</button>)}</div>
              <SheetTitle className="max-w-3xl text-2xl leading-tight sm:text-3xl">{selected.title}</SheetTitle>
              <SheetDescription className="max-w-3xl text-sm leading-6">A practical explanation of who must follow this direction, what it requires and what evidence should be kept.</SheetDescription>
              <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground"><Clock3 className="size-3.5" />Source copy in this folder: {selected.updated}</div>
            </SheetHeader>
            <div className="space-y-10 p-6 sm:p-9">
              <section className="rounded-2xl border border-primary/15 bg-primary/[.045] p-5 sm:p-6"><p className="eyebrow text-primary">In simple terms</p><p className="mt-2 text-lg font-medium leading-8 text-foreground">{selected.summary}</p><div className="mt-4 flex gap-3 border-t border-primary/10 pt-4"><AlertTriangle className="mt-1 size-5 shrink-0 text-amber-600" /><div><p className="text-sm font-semibold">Why this matters</p><p className="mt-1 text-sm leading-6 text-foreground/80">{categoryConsequences[selected.category] ?? 'This direction changes what the NBFC must do, when it must act and what records it must retain to demonstrate compliance.'}</p></div></div></section>

              <LayerPanel regulationId={selected.id} selectedLayer={layer} />

              <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
                <section><p className="eyebrow">Does this apply to us?</p><h3 className="mt-1 text-lg font-semibold">Who should use this direction</h3><p className="mt-3 text-[15px] leading-7 text-foreground/90">{selectedDetails.applies}</p></section>
                <section className="rounded-2xl border border-border bg-card p-5"><p className="eyebrow">First answer these questions</p><ol className="mt-3 space-y-3 text-sm leading-6"><li className="flex gap-3"><span className="font-mono font-semibold text-primary">01</span><span>Is the entity category, SBR layer or product named in the applicability clause?</span></li><li className="flex gap-3"><span className="font-mono font-semibold text-primary">02</span><span>Has the event that activates the rule happened—for example sanction, default, outsourcing or a change in control?</span></li><li className="flex gap-3"><span className="font-mono font-semibold text-primary">03</span><span>Does an exemption, threshold, transition period or stricter specialist rule change the result?</span></li></ol></section>
              </div>

              <section><p className="eyebrow">What the NBFC must do</p><h3 className="mt-1 text-lg font-semibold">Main obligations, translated into actions</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{selectedDetails.requirements.map((item, index) => <div key={item} className="flex gap-3 rounded-xl border border-border bg-card p-4 text-[15px] leading-6"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 font-mono text-xs font-semibold text-primary">{index + 1}</span><span>{item}</span></div>)}</div></section>

              <section><p className="eyebrow">Numbers and deadlines</p><h3 className="mt-1 text-lg font-semibold">Thresholds, limits and timing to watch</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{selected.highlights.map((highlight) => <div key={highlight} className="flex items-center gap-3 rounded-xl bg-secondary/70 px-4 py-3 text-sm font-semibold"><BadgeIndianRupee className="size-4 shrink-0 text-primary" />{highlight}</div>)}{selectedDetails.timing.map((item) => <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm leading-6"><CalendarDays className="mt-1 size-4 shrink-0 text-amber-600" /><span>{item}</span></div>)}</div></section>

              <section><p className="eyebrow">What good compliance looks like</p><h3 className="mt-1 text-lg font-semibold">Evidence and control checklist</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Use these as review questions. A “yes” should be supported by a policy, system record, approval, reconciliation or other auditable evidence.</p><div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">{selectedDetails.checks.map((item) => <div key={item} className="flex gap-3 py-2.5 text-[15px] leading-6 text-emerald-950"><CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-700" /><span>{item}</span></div>)}</div></section>

              <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6"><p className="eyebrow text-blue-800">How to reach a defensible answer</p><div className="mt-4 grid gap-4 sm:grid-cols-4">{[['1','Profile','Confirm category, layer, deposit status and operating model.'],['2','Trigger','Identify the transaction, event or exposure that activates the rule.'],['3','Test','Read the obligation together with thresholds, exceptions and dates.'],['4','Conclude','Record Applicable, Not applicable, or Applicable with modification—and why.']].map(([number,title,body]) => <div key={number}><span className="grid size-8 place-items-center rounded-lg bg-blue-900 font-mono text-xs font-semibold text-white">{number}</span><p className="mt-2 text-sm font-semibold text-blue-950">{title}</p><p className="mt-1 text-xs leading-5 text-blue-900">{body}</p></div>)}</div><p className="mt-5 border-t border-blue-200 pt-4 text-sm leading-6 text-blue-950"><strong>Before filing or approval:</strong> verify the exact paragraph in the latest RBI direction and check later amendments, circulars and FAQs.</p></section>

              <section><div><p className="eyebrow">Continue the analysis</p><h3 className="mt-1 text-lg font-semibold">Related regulations</h3><p className="mt-1 text-sm text-muted-foreground">Most NBFC questions cross more than one direction. Open these next.</p></div><div className="mt-4 grid gap-2 sm:grid-cols-3">{selectedDetails.related.map((id) => { const related = regulations.find((item) => item.id === id); return related ? <Button key={id} variant="outline" className="h-auto justify-between whitespace-normal px-4 py-3 text-left" onClick={() => setSelected(related)}><span>{related.short}</span><ChevronRight className="size-4 shrink-0" /></Button> : null; })}</div></section>
            </div>
          </>}
        </SheetContent>
      </Sheet>
    </main>
  );
}
