'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowUpRight, BadgeIndianRupee, BookOpen, ChevronRight, Clock3, FileText, Landmark, Network, Scale, Search, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Regulation = { id: number; title: string; short: string; category: string; layers: string[]; status: 'Core' | 'Specialist' | 'Reference'; updated: string; summary: string; highlights: string[] };

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

const regulations: Regulation[] = [
  { id: 1, title: 'Registration & Scale Based Regulation', short: 'Registration', category: 'Perimeter', layers: ['BL','ML','UL'], status: 'Core', updated: '01 Jul 2026', summary: 'Determines registration, exemptions, category, layer and minimum net owned fund—the starting point for every analysis.', highlights: ['BL/ML threshold: ₹1,000 crore', 'UL threshold: ₹1,00,000 crore', 'Principal business: 50–50 test'] },
  { id: 2, title: 'Capital Adequacy', short: 'Capital', category: 'Prudential', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'Sets regulatory capital composition, deductions, risk weights, leverage and ICAAP expectations.', highlights: ['ML+: CRAR 15%', 'ML+: Tier 1 10%', 'UL: CET1 9%'] },
  { id: 3, title: 'Income Recognition, Asset Classification & Provisioning', short: 'IRACP', category: 'Prudential', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'Controls overdue recognition, borrower-wise NPA classification, income reversal, upgrading and provisioning.', highlights: ['NPA: generally >90 days', 'Substandard provision: 10%', 'Upgrade after all arrears are cleared'] },
  { id: 4, title: 'Resolution of Stressed Assets', short: 'Resolution', category: 'Credit risk', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'Provides early-warning, review, inter-creditor, restructuring and project-finance resolution rules.', highlights: ['Review period: 30 days', 'ICA vote: 75% value + 60% number', 'Delayed RP provision: up to 35%'] },
  { id: 5, title: 'Concentration Risk Management', short: 'Concentration', category: 'Prudential', layers: ['BL','ML','UL'], status: 'Core', updated: '28 Nov 2025', summary: 'Limits exposure to single counterparties, connected groups, sectors and other NBFCs.', highlights: ['Large exposure: ≥10% Tier 1', 'Single counterparty: 20%', 'Connected group: 25%'] },
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

const thresholds = [
  { value: '₹1,000 cr', label: 'BL → ML', note: 'Asset-size threshold', tone: 'blue' },
  { value: '15%', label: 'CRAR', note: 'General ML+ minimum', tone: 'teal' },
  { value: '>90 days', label: 'NPA', note: 'General overdue test', tone: 'amber' },
  { value: '5%', label: 'DLG cap', note: 'Defined loan portfolio', tone: 'red' },
];

const categoryOptions = ['All categories', ...Array.from(new Set(regulations.map((r) => r.category)))];

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');
  const [layer, setLayer] = useState('All layers');
  const [selected, setSelected] = useState<Regulation | null>(null);

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
      return matchesText && (category === 'All categories' || reg.category === category) && (layer === 'All layers' || reg.layers.includes(layer));
    });
  }, [query, category, layer]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="regulatory-line" aria-hidden="true" />
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"><Scale className="size-5" /></div><div><p className="text-[15px] font-semibold leading-none tracking-tight">NBFC Regulatory Desk</p><p className="mt-1 text-xs text-muted-foreground">RBI consolidated directions · working index</p></div></div>
          <Badge variant="outline" className="hidden border-emerald-700/25 bg-emerald-50 text-emerald-800 sm:inline-flex"><span className="mr-1 size-1.5 rounded-full bg-emerald-600" />31 documents indexed</Badge>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="command-panel overflow-hidden rounded-3xl border border-slate-200 bg-[#07182b] p-6 text-white shadow-[0_24px_70px_-42px_rgba(2,12,27,.8)] sm:p-8">
            <div className="relative z-10 max-w-3xl"><div className="mb-6 flex items-center gap-2 text-sm text-cyan-200"><Landmark className="size-4" />Regulatory command centre</div><h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Find the rule. See the threshold. Trace what applies.</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">Explore the 2025–26 RBI NBFC framework by topic, layer and compliance trigger.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px_150px]">
                <div className="relative"><Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input aria-label="Search regulations" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search NPA, KYC, DLG, deposits…" className="h-11 border-white/15 bg-white/10 pl-10 text-[15px] text-white placeholder:text-slate-400 focus-visible:border-cyan-300" /></div>
                <NativeSelect aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full [&_select]:h-11 [&_select]:border-white/15 [&_select]:bg-white/10 [&_select]:text-white">{categoryOptions.map((option) => <NativeSelectOption key={option} value={option}>{option}</NativeSelectOption>)}</NativeSelect>
                <NativeSelect aria-label="Filter by layer" value={layer} onChange={(e) => setLayer(e.target.value)} className="w-full [&_select]:h-11 [&_select]:border-white/15 [&_select]:bg-white/10 [&_select]:text-white">{['All layers','BL','ML','UL','Reference'].map((option) => <NativeSelectOption key={option} value={option}>{option}</NativeSelectOption>)}</NativeSelect>
              </div>
            </div>
          </div>
          <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Use this sequence</p><h2 className="mt-1 text-xl font-semibold tracking-tight">Applicability spine</h2></div><Network className="size-5 text-primary" /></div><ol className="mt-5 space-y-1">{['Entity & registration category','SBR layer & group assets','Funds, interface & deposits','Product / transaction overlay','Prudential + conduct rules'].map((step, index) => <li key={step} className="group flex items-center gap-3 rounded-xl px-2 py-2.5"><span className="grid size-7 shrink-0 place-items-center rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary">{index + 1}</span><span className="text-sm font-medium">{step}</span>{index < 4 && <ChevronRight className="ml-auto size-4 text-muted-foreground" />}</li>)}</ol></aside>
        </section>

        <section aria-label="Key thresholds" className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{thresholds.map((item) => <div key={item.label} className={`threshold-card tone-${item.tone} rounded-2xl border bg-card p-4 sm:p-5`}><p className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">{item.value}</p><div className="mt-3 flex items-end justify-between gap-3"><div><p className="text-sm font-semibold">{item.label}</p><p className="mt-0.5 text-xs text-muted-foreground">{item.note}</p></div><ArrowUpRight className="size-4 text-muted-foreground" /></div></div>)}</section>

        <Tabs defaultValue="library" className="mt-8"><div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Regulation library</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">{filtered.length} directions and references</h2></div><TabsList variant="line"><TabsTrigger value="library"><BookOpen />Explore</TabsTrigger><TabsTrigger value="decision"><ShieldCheck />Decision path</TabsTrigger></TabsList></div>
          <TabsContent value="library" className="pt-5">
            {filtered.length > 0 ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filtered.map((reg) => <button key={reg.id} onClick={() => setSelected(reg)} className="reg-card group min-h-[230px] rounded-2xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_18px_38px_-28px_rgba(2,20,40,.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary"><FileText className="size-5" /></span><Badge variant={reg.status === 'Core' ? 'default' : 'outline'} className={reg.status === 'Core' ? 'bg-primary' : ''}>{reg.status}</Badge></div><h3 className="mt-5 text-lg font-semibold leading-snug tracking-tight group-hover:text-primary">{reg.short}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{reg.summary}</p><div className="mt-5 flex items-center gap-2 border-t border-border/70 pt-4 text-xs text-muted-foreground"><span>{reg.category}</span><span>·</span><span>{reg.layers.join(' / ')}</span><ChevronRight className="ml-auto size-4 transition-transform group-hover:translate-x-0.5" /></div></button>)}</div> : <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center"><Search className="mx-auto size-6 text-muted-foreground" /><h3 className="mt-3 font-semibold">No matching regulation</h3><p className="mt-1 text-sm text-muted-foreground">Try a broader term or reset one of the filters.</p><Button variant="outline" className="mt-4" onClick={() => { setQuery(''); setCategory('All categories'); setLayer('All layers'); }}>Clear filters</Button></div>}
          </TabsContent>
          <TabsContent value="decision" className="pt-5"><div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-2xl border border-border bg-card p-5 sm:p-7"><p className="eyebrow">Start here</p><h3 className="mt-1 text-xl font-semibold">Five facts decide most answers</h3><div className="mt-6 space-y-4">{[['01','What is the registration category?','ICC, MFI, Factor, IFC, IDF, HFC, CIC, P2P, AA, SPD, MGC or NBFC-D.'],['02','Which SBR layer applies?','Use standalone and group asset size, plus mandatory-category placement.'],['03','Are public funds or deposits involved?','This changes exemptions, prudential coverage, liquidity and conduct duties.'],['04','What product or transaction is proposed?','Digital lending, gold, MFI, cards, project finance, transfer and securitisation each add an overlay.'],['05','What event and date matter?','Default, disbursement, ownership change or contract date can trigger a transitional rule.']].map(([num,title,body]) => <div key={num} className="grid grid-cols-[44px_1fr] gap-3"><span className="font-mono text-sm font-semibold text-primary">{num}</span><div><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p></div></div>)}</div></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950 sm:p-7"><div className="flex items-center gap-2"><AlertTriangle className="size-5" /><p className="font-semibold">Interpretation guardrails</p></div><ul className="mt-5 space-y-4 text-sm leading-6"><li>Use the latest updated copy where documents overlap—especially KYC and Registration.</li><li>A higher layer generally inherits lower-layer requirements unless expressly excluded.</li><li>Category-specific directions override a general direction on the same subject.</li><li>Check effective dates and grandfathering before applying a threshold to an existing contract.</li></ul><div className="mt-6 rounded-xl border border-amber-200 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Folder status</p><p className="mt-2 text-sm">Latest included updates run through <strong>1 July 2026</strong>. Confirm later RBI amendments before a formal filing or approval.</p></div></div></div></TabsContent>
        </Tabs>
      </div>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><SheetContent className="w-full overflow-y-auto border-l-slate-200 bg-background sm:max-w-xl">{selected && <><SheetHeader className="border-b border-border p-6 pr-14"><div className="mb-3 flex gap-2"><Badge>{selected.status}</Badge><Badge variant="outline">{selected.category}</Badge></div><SheetTitle className="text-2xl font-semibold tracking-tight">{selected.title}</SheetTitle><SheetDescription className="mt-2 leading-6">{selected.summary}</SheetDescription></SheetHeader><div className="p-6"><div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-border bg-card p-4"><Clock3 className="size-4 text-primary" /><p className="mt-3 text-xs text-muted-foreground">Folder version</p><p className="mt-1 text-sm font-semibold">{selected.updated}</p></div><div className="rounded-xl border border-border bg-card p-4"><Landmark className="size-4 text-primary" /><p className="mt-3 text-xs text-muted-foreground">Layers</p><p className="mt-1 text-sm font-semibold">{selected.layers.join(' / ')}</p></div></div><div className="mt-7"><p className="eyebrow">Key markers</p><div className="mt-3 space-y-2">{selected.highlights.map((highlight) => <div key={highlight} className="flex items-center gap-3 rounded-xl bg-secondary/70 px-4 py-3 text-sm font-medium"><BadgeIndianRupee className="size-4 shrink-0 text-primary" />{highlight}</div>)}</div></div><div className="mt-7 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><strong>How to use this:</strong> confirm entity category, layer, public-funds/customer-interface status and the transaction date before relying on a threshold.</div></div></>}</SheetContent></Sheet>
    </main>
  );
}
