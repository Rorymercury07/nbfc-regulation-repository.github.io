'use client';

import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, ChevronDown, FileCheck2, FileSearch, GraduationCap, Landmark, LibraryBig, Scale, Search, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';

type Area = 'home' | 'learn' | 'regulations' | 'establish' | 'compliance' | 'research';
type Update = { id: number; title: string; category: string; layers: string[]; updated: string; summary: string; highlights: string[] };

const panel = 'rounded-3xl border border-slate-200 bg-white shadow-sm';
const card = 'rounded-2xl border border-slate-200 bg-white';

export function RepositoryHome({
  updates,
  query,
  onQueryChange,
  onSearch,
  onNavigate,
  onOpenUpdate,
}: {
  updates: Update[];
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onNavigate: (area: Area) => void;
  onOpenUpdate: (id: number) => void;
}) {
  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-[#07182b] text-white shadow-[0_28px_80px_-48px_rgba(2,12,27,.85)]">
        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[minmax(0,1.15fr)_.85fr] lg:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-cyan-200">Independent regulatory knowledge repository</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-.045em] sm:text-5xl">Understand the NBFC sector. Find the governing rule. Put it into practice.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">A structured starting point for students, lawyers, compliance teams and anyone trying to understand how an Indian NBFC is established, regulated and operated.</p>
            <div className="mt-7 max-w-2xl rounded-2xl border border-white/15 bg-white/[.07] p-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input value={query} onChange={(event) => onQueryChange(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') onSearch(); }} aria-label="Search the NBFC regulatory repository" placeholder="Ask a question or search a regulation…" className="h-12 border-white/15 bg-white/10 pl-11 pr-24 text-white placeholder:text-slate-400" />
                <button type="button" onClick={onSearch} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-cyan-200 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-100">Search</button>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/[.07] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-cyan-200">Choose your route</p>
            <div className="mt-4 space-y-3">
              {([
                ['learn', GraduationCap, 'I am learning', 'Start with the meaning, history, categories and business of NBFCs.'],
                ['regulations', LibraryBig, 'I am researching', 'Search RBI directions and connected laws, with applicability and source context.'],
                ['compliance', ShieldCheck, 'I manage compliance', 'Map officers, filings, policies, controls and evidence to the entity profile.'],
              ] as const).map(([area, Icon, title, body]) => (
                <button key={area} type="button" onClick={() => onNavigate(area)} className="group flex w-full items-start gap-4 rounded-2xl border border-white/15 bg-slate-950/20 p-4 text-left hover:border-cyan-200/60 hover:bg-white/[.08]">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-200/10 text-cyan-100"><Icon className="size-5" /></span>
                  <span><span className="block font-semibold text-white">{title}</span><span className="mt-1 block text-sm leading-5 text-slate-300">{body}</span></span>
                  <ArrowRight className="ml-auto mt-1 size-4 shrink-0 text-cyan-200 transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className={`${panel} p-5 sm:p-8`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">Regulatory dashboard</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Latest source copies added to the repository</h2></div>
          <p className="max-w-lg text-sm leading-6 text-slate-500">Each entry identifies the authority, source date, broad applicability and practical change. Open the regulation for exact clauses and current legal text.</p>
        </div>
        <div className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200">
          {updates.slice(0, 6).map((update) => (
            <article key={update.id} className="grid gap-4 p-5 lg:grid-cols-[150px_minmax(0,1fr)_220px] lg:p-6">
              <div><span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold uppercase text-cyan-900">{update.category}</span><p className="mt-3 font-mono text-xs text-slate-500">{update.updated}</p><p className="mt-1 text-xs text-slate-500">Authority: RBI</p></div>
              <div><h3 className="text-lg font-semibold leading-6">{update.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{update.summary}</p><div className="mt-3 flex flex-wrap gap-2">{update.layers.map((layer) => <span key={layer} className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">{layer}</span>)}</div></div>
              <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-500">What changed?</p><p className="mt-2 text-sm leading-5 text-slate-700">{update.highlights[0]}. Check the complete direction for conditions and exceptions.</p><button type="button" onClick={() => onOpenUpdate(update.id)} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Open source note <ArrowRight className="size-4" /></button></div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export function LearnPageGuide({ onNavigate }: { onNavigate: (area: Area) => void }) {
  const chapters = [
    ['01', 'Start with the definition', 'What an NBFC is, the principal-business test and why it is not a bank.'],
    ['02', 'Follow the history', 'How the sector grew and why regulation moved towards Scale Based Regulation.'],
    ['03', 'Meet the categories', 'ICC, MFI, Factor, P2P, Account Aggregator, HFC, CIC and specialist models.'],
    ['04', 'See the business work', 'Funding, lending, income, risk, customer protection and the complete loan lifecycle.'],
    ['05', 'Connect concept to law', 'Every lesson ends with the direction, clause or connected law that governs it.'],
  ];
  return (
    <section className={`${panel} mb-7 overflow-hidden`}>
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[.85fr_1.15fr]">
        <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">Understand NBFCs</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.035em]">Learn the sector before memorising the rules.</h1><p className="mt-4 text-base leading-7 text-slate-600">This learning path moves from plain-language foundations to the way an NBFC raises money, lends, manages risk and serves a borrower.</p><button type="button" onClick={() => onNavigate('regulations')} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Already know the basics? Open the legal library <ArrowRight className="size-4" /></button></div>
        <div className="space-y-2">{chapters.map(([number, title, body]) => <div key={number} className="grid grid-cols-[44px_1fr] gap-3 rounded-2xl border border-slate-200 p-4"><span className="font-mono text-xs font-semibold text-primary">{number}</span><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-5 text-slate-600">{body}</p></div></div>)}</div>
      </div>
    </section>
  );
}

export function LibraryPageGuide() {
  return (
    <section className={`${panel} mb-6 p-5 sm:p-8`}>
      <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">Regulatory Library</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Read every rule in two modes.</h2><div className="mt-5 grid gap-3 lg:grid-cols-2"><div className={`${card} p-4`}><p className="font-semibold">Explained simply</p><p className="mt-1 text-sm leading-6 text-slate-600">Why the rule exists, who it affects, an example and the practical compliance impact.</p></div><div className={`${card} p-4`}><p className="font-semibold">Legal reference</p><p className="mt-1 text-sm leading-6 text-slate-600">Exact direction name, paragraph, definitions, applicability, dates, amendments and related obligations.</p></div></div>
    </section>
  );
}

export function ConnectedLawsGuide() {
  const connected = [
    ['Data privacy', 'DPDP Act and Rules'], ['Cybersecurity', 'IT Act, CERT-In directions and RBI technology rules'], ['Corporate governance', 'Companies Act, MCA Rules and Secretarial Standards'], ['Financial crime', 'PMLA, PML Rules and RBI KYC framework'], ['Recovery and insolvency', 'IBC, arbitration and SARFAESI where applicable'], ['Foreign investment', 'FEMA, FDI policy and RBI requirements'], ['Credit information', 'CICRA and RBI reporting rules'], ['Consumer protection', 'Consumer Protection Act and RBI conduct directions'],
  ];
  return (
    <section className={`${panel} mt-8 p-5 sm:p-8`}>
      <p className="text-sm font-semibold">The library also connects RBI directions to other laws.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">{connected.map(([title, body]) => <div key={title} className="rounded-xl bg-slate-50 p-4"><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-600">{body}</p></div>)}</div>
      <p className="mt-4 text-xs leading-5 text-slate-500">Status labels distinguish current, amended, superseded and historical material. Educational explanations do not replace the binding source.</p>
    </section>
  );
}

export function EstablishJourney({ onOpenRegulation }: { onOpenRegulation: (id: number) => void }) {
  const steps = [
    ['01', 'Choose the activity and category', 'Describe the products, customers, funding and revenue. Then test whether the proposal belongs in ICC, MFI, Factor, P2P, AA, HFC, CIC or another specialist category.', ['Business model note', 'Product and customer map', 'Category conclusion']],
    ['02', 'Test entry eligibility', 'Check the principal-business criteria, registration exemptions, Net Owned Fund, ownership, management experience and category-specific conditions.', ['Perimeter analysis', 'NOF calculation', 'Promoter and director profile']],
    ['03', 'Incorporate and prepare the company', 'Set up the company, constitutional objects, capital, governance structure and evidence needed for the regulatory application.', ['Certificate and constitutional documents', 'Ownership chart', 'Board and governance plan']],
    ['04', 'Prepare the RBI application', 'Build a consistent application pack: business plan, financial projections, fit-and-proper material, systems, policies, staffing and source-of-funds evidence.', ['Application narrative', 'Three-year projections', 'Policy and system readiness pack']],
    ['05', 'Navigate PRAVAAH', 'Choose the correct application, upload readable documents, answer clarifications precisely and preserve the submission and tracking record.', ['Portal checklist', 'Clarification log', 'Submission acknowledgement']],
    ['06', 'Become operationally ready', 'Read the Certificate of Registration and conditions, then activate KYC, customer conduct, risk, accounting, cyber, complaints, outsourcing and reporting controls before launch.', ['CoR condition register', 'Compliance calendar', 'Launch-readiness sign-off']],
  ] as const;
  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-[#07182b] p-6 text-white shadow-sm sm:p-9"><p className="text-xs font-semibold uppercase tracking-[.16em] text-cyan-200">Establish an NBFC</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">From business idea to regulatory readiness</h1><p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">A practical path through category selection, entry requirements, incorporation, RBI registration, PRAVAAH and post-registration readiness.</p></header>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className={`${panel} divide-y divide-slate-200 overflow-hidden`}>
          {steps.map(([number, title, body, evidence]) => <details key={number} className="group p-5 open:bg-slate-50 sm:p-6" open={number === '01'}><summary className="flex cursor-pointer list-none items-start gap-4"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-mono text-xs font-semibold text-white">{number}</span><span className="min-w-0"><span className="block text-lg font-semibold">{title}</span><span className="mt-1 block text-sm leading-6 text-slate-600">{body}</span></span><ChevronDown className="ml-auto mt-1 size-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" /></summary><div className="ml-[52px] mt-4 rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-500">Evidence to prepare</p><ul className="mt-3 space-y-2">{evidence.map((item) => <li key={item} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />{item}</li>)}</ul></div></details>)}
        </div>
        <aside className="space-y-4"><div className={`${panel} p-5`}><FileCheck2 className="size-5 text-primary" /><h2 className="mt-3 text-lg font-semibold">PRAVAAH readiness check</h2><ul className="mt-4 space-y-3 text-sm leading-5 text-slate-600">{['Select the correct entity and application type.', 'Keep names, shareholding and numbers consistent across every attachment.', 'Upload readable, signed and current documents.', 'Track clarification ownership and response dates.', 'Preserve acknowledgements and the complete final submission.'].map((item) => <li key={item} className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />{item}</li>)}</ul></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><strong>Verify before acting.</strong> Entry, exemption and NOF requirements differ by category and can change. Confirm the latest direction and application instructions.</div><button type="button" onClick={() => onOpenRegulation(1)} className="flex w-full items-center justify-between rounded-2xl bg-primary p-4 text-left text-sm font-semibold text-white hover:bg-primary/90">Open Registration & SBR <ArrowRight className="size-4" /></button></aside>
      </div>
    </section>
  );
}

export function CompliancePageGuide() {
  const officers = [
    ['Board of Directors', 'Oversight, approvals and statutory duties', 'Always present; detailed committees depend on law, layer and thresholds'],
    ['Compliance Officer / CCO', 'Regulatory inventory, monitoring and reporting', 'CCO Direction specifically applies to ML and UL; BL still needs clear compliance ownership'],
    ['PMLA Principal Officer', 'AML reporting and FIU-IND coordination', 'Where PMLA reporting-entity obligations apply'],
    ['PMLA Designated Director', 'Senior oversight of AML compliance', 'Where PMLA reporting-entity obligations apply'],
    ['Grievance / Nodal Officer', 'Customer complaints and Ombudsman escalation', 'Role and title depend on the applicable complaint framework'],
    ['Company Secretary', 'Secretarial governance and MCA filings', 'Companies Act triggers and entity facts determine requirement'],
    ['Audit and risk functions', 'Independent assurance and risk oversight', 'Layer, deposit status and asset-size thresholds matter'],
  ];
  return (
    <section className={`${panel} mb-5 overflow-hidden`}>
      <div className="border-b border-slate-200 p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">Compliance & Governance</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.035em]">Turn regulatory duties into owners, dates, controls and evidence.</h1><p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">Start with the entity profile. A role or policy is not automatically mandatory for every NBFC simply because it appears in another layer’s rulebook.</p></div>
      <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[1.25fr_.75fr]">
        <div><h2 className="text-lg font-semibold">Who may own the work?</h2><div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3">Function</th><th className="p-3">Main responsibility</th><th className="p-3">Applicability caution</th></tr></thead><tbody className="divide-y divide-slate-200">{officers.map(([role, duty, trigger]) => <tr key={role}><td className="p-3 font-semibold">{role}</td><td className="p-3 leading-5 text-slate-600">{duty}</td><td className="p-3 leading-5 text-slate-600">{trigger}</td></tr>)}</tbody></table></div></div>
        <div className="space-y-3"><h2 className="text-lg font-semibold">Build four operating registers</h2>{[[CalendarDays, 'RBI returns', 'Applicability, form, reference date, due date, portal, owner and acknowledgement.'], [Landmark, 'MCA and secretarial', 'Meetings, annual and event filings, statutory registers, directors, auditors and ownership.'], [ShieldCheck, 'Policies and controls', 'Approval authority, review cycle, scope, control owner, testing and evidence.'], [FileSearch, 'Regulatory change', 'New source, effective date, impacted process, action owner and closure proof.']].map(([Icon, title, body]) => { const IconComponent = Icon as typeof CalendarDays; return <div key={title as string} className="rounded-2xl border border-slate-200 p-4"><IconComponent className="size-5 text-primary" /><p className="mt-2 font-semibold">{title as string}</p><p className="mt-1 text-sm leading-5 text-slate-600">{body as string}</p></div>; })}</div>
      </div>
    </section>
  );
}

export function ResearchPageGuide({ onNavigate }: { onNavigate: (area: Area) => void }) {
  const tools = [
    [Search, 'Search the primary library', 'Start with the issue, then filter by category, layer and status.', 'regulations'],
    [Scale, 'Compare BL, ML and UL', 'Separate universal duties from layer-specific thresholds and governance.', 'regulations'],
    [FileCheck2, 'Use a compliance checklist', 'Translate a direction into action, owner, frequency and evidence.', 'compliance'],
    [BookOpen, 'Decode technical language', 'Open the learning modules and glossary before applying the clause.', 'learn'],
  ] as const;
  return (
    <section className={`${panel} p-5 sm:p-8`}>
      <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">Research & Resources</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.035em]">Choose the research tool that matches the question.</h1><p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">Use the repository as a path: understand the issue, locate the authoritative source, test applicability and record the practical conclusion.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{tools.map(([Icon, title, body, area]) => <button key={title} type="button" onClick={() => onNavigate(area)} className="group rounded-2xl border border-slate-200 p-5 text-left hover:border-primary/30 hover:bg-slate-50"><Icon className="size-5 text-primary" /><h2 className="mt-4 font-semibold group-hover:text-primary">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">Open tool <ArrowRight className="size-3.5" /></span></button>)}</div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase text-slate-500">1 · Understand</p><p className="mt-2 text-sm">Define the issue and missing facts.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase text-slate-500">2 · Research</p><p className="mt-2 text-sm">Find the controlling source and clause.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase text-slate-500">3 · Implement</p><p className="mt-2 text-sm">Assign the action, owner, date and evidence.</p></div></div>
    </section>
  );
}

