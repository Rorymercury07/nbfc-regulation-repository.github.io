import { AlertTriangle, CheckCircle2, ChevronDown, FileWarning, Mail, Radar, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const immediateActions = [
  ['Register the complete advisory chain', 'Keep the 1 October 2026 parent advisory, ADD.1 dated 15 October 2026 and the revised ADD.2 dated 30 October 2026 together in the cyber-advisory register. Record receipt, owner, applicability and implementation status.'],
  ['Use the revised ADD.2 as the controlling copy', 'The revised communication removes certain IP addresses. Security teams should reconcile monitoring and blocklists to the revised attachment and avoid continuing to rely on the earlier ADD.2 indicator set.'],
  ['Restrict access and distribution', 'Store the attachment only in an approved access-controlled repository. Share it on a need-to-know basis with authorised security, IT, SOC and fraud-monitoring teams; do not place it, its IOCs or its detection rules on a public website.'],
  ['Deploy in alert-only mode first', 'Implement the additional indicators, TLS fingerprints and detection rules together with the parent advisory and ADD.1. Baseline and tune alerts, investigate false positives and corroborate multiple indicators before enabling blocking.'],
  ['Perform the required retrospective review', 'Search the relevant historical security and transaction logs for the newly supplied indicators and the behaviours identified in the restricted advisory. Retain the approved queries, review period, data sources, findings and sign-off.'],
  ['Escalate, contain and report', 'If suspected campaign activity is found, preserve logs and supporting evidence, activate the approved incident-response process and report to CERT-In/CSIRT-Fin at the earliest while checking every other applicable regulatory and contractual reporting route.'],
] as const;

const responsibilityRows = [
  ['CISO / Information Security', 'Own applicability, restricted handling, technical response, threat hunting and closure sign-off.'],
  ['SOC', 'Replace superseded indicators, deploy the revised rules in alert-only mode, tune alerts, investigate matches and retain evidence.'],
  ['Application and API teams', 'Assess payment and disbursement API controls and support investigation using approved internal details from the restricted advisory.'],
  ['Infrastructure / Cloud / Network', 'Apply the revised monitoring content to the relevant security controls and preserve the required network and cloud telemetry.'],
  ['Fraud Risk / Operations', 'Correlate technical alerts with payment, disbursement and transaction-monitoring records.'],
  ['Compliance and Legal', 'Maintain the advisory register, control distribution, confirm reporting routes and preserve evidence of assessment and implementation.'],
] as const;

const evidenceItems = [
  'Parent advisory, ADD.1 and revised ADD.2 retained together',
  'Receipt date, version, source and internal ticket',
  'Restricted-access list and distribution record',
  'Evidence that the earlier ADD.2 IOC set was reconciled',
  'Affected-system and control-owner inventory',
  'IOC and rule deployment evidence, version and approval',
  'Alert-only testing, tuning and false-positive assessment',
  'Retrospective-search queries, period, data sources and results',
  'Alerts, investigation notes, preserved logs and transaction evidence',
  'Containment, recovery, reporting and closure records',
] as const;

const supervisoryExpectations = [
  ['Track authoritative cyber advisories', 'Maintain a controlled register of relevant RBI, CERT-In, CSIRT-Fin and CSITEG advisories and alerts, with an owner and assessment status.'],
  ['Assess applicability to the NBFC', 'Map each advisory to the NBFC’s systems, products and technology stack, including payment or disbursement APIs, internet-facing applications and PHP-based services where relevant.'],
  ['Implement and validate safeguards', 'Apply the relevant patches, hardening, monitoring, detection and fraud controls, then test that the remediation works and does not create unmanaged operational risk.'],
  ['Retain auditable evidence', 'Keep the applicability assessment, implementation tickets, approvals, configuration or patch evidence, test results, monitoring records, exceptions and closure sign-off.'],
  ['Be ready to demonstrate compliance', 'When RBI or another competent authority seeks confirmation, provide an accurate and authorised account of the action taken through the verified supervisory channel and retain proof of submission.'],
] as const;

function Expandable({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <details className="group border-t border-slate-200 first:border-t-0">
      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-800"><ChevronDown className="size-4 transition-transform group-open:rotate-180" /></span>
        <span className="min-w-0"><span className="block font-semibold text-slate-950">{title}</span><span className="mt-1 block text-sm leading-6 text-slate-600">{subtitle}</span></span>
      </summary>
      <div className="px-5 pb-6 sm:px-6">{children}</div>
    </details>
  );
}

export function CsirtFinAdvisory() {
  return (
    <section className="overflow-hidden rounded-3xl border border-rose-200 bg-card shadow-sm" aria-labelledby="csirt-fin-title">
      <header className="bg-[#2b0b18] p-5 text-white sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-rose-200 text-rose-950 hover:bg-rose-200">Critical cybersecurity advisory</Badge>
              <Badge variant="outline" className="border-white/25 text-white">CSIRT-Fin / CERT-In</Badge>
              <Badge variant="outline" className="border-amber-200/40 text-amber-100">TLP:AMBER</Badge>
              <span className="text-xs font-medium text-rose-100">Issued 30 October 2026 · revised IOC copy</span>
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-rose-200">Advisory 261830103401_ADD.2</p>
            <h2 id="csirt-fin-title" className="mt-2 text-2xl font-semibold leading-tight tracking-[-.025em] sm:text-3xl">Multi-tool AI-driven attack infrastructure: revised compliance response</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-rose-50/85">This critical addendum continues the alert on unauthorised fund transfers through payment and disbursement API abuse. CSIRT-Fin identifies the campaign as CRAFTY FALCON and requires the revised ADD.2 material to be used with the parent advisory and ADD.1. The technical attachment remains restricted and is not reproduced here.</p>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-rose-200/20 bg-rose-200/10"><ShieldAlert className="size-6 text-rose-200" /></span>
        </div>
        <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
          {[['What it affects', 'BFSI security, payment and disbursement controls'], ['What must happen', 'Replace revised IOCs; deploy, tune and retrospectively review'], ['How urgent', 'Critical; act on a priority basis']].map(([label, value]) => <div key={label}><p className="text-xs font-semibold uppercase tracking-[.1em] text-rose-200">{label}</p><p className="mt-1 text-sm font-semibold leading-6 text-white">{value}</p></div>)}
        </div>
      </header>

      <div className="border-b border-amber-200 bg-amber-50 px-5 py-4 sm:px-6">
        <div className="flex gap-3">
          <FileWarning className="mt-0.5 size-5 shrink-0 text-amber-700" />
          <div><p className="text-sm font-semibold text-amber-950">Public compliance notice only - restricted technical content withheld</p><p className="mt-1 text-sm leading-6 text-amber-900">The revised ADD.2 is marked “TLP:AMBER [RESTRICTED - Not for Hosting in Public Domain]”. This page therefore does not host or reproduce the attachment, IOCs, TLS fingerprints, detection rules or other restricted technical detail. Authorised teams must work from the controlled internal copy.</p></div>
        </div>
      </div>

      <div className="border-b border-sky-200 bg-sky-50 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-sky-800 text-white hover:bg-sky-800">Supervisory cybersecurity expectation</Badge>
              <Badge variant="outline" className="border-sky-300 bg-white text-sky-950">NBFC compliance</Badge>
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-[-.02em] text-slate-950">Cyber advisories must become documented controls</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">RBI supervision may require an NBFC to demonstrate what it has done in response to cybersecurity advisories, including alerts concerning unauthorised fund transfers through payment and disbursement APIs and critical vulnerabilities in internet-facing technology.</p>
            <p className="mt-2 text-sm leading-6 text-slate-700"><strong>In practical terms:</strong> receiving an advisory is not the end of the process. The NBFC should assess whether it applies, implement the relevant safeguards, validate the result and retain evidence that can be produced during supervision.</p>
          </div>
          <AlertTriangle className="size-7 shrink-0 text-red-700" />
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {supervisoryExpectations.map(([title, body], index) => (
            <div key={title} className={`flex gap-3 rounded-2xl border border-sky-200 bg-white p-4 ${index === supervisoryExpectations.length - 1 ? 'lg:col-span-2' : ''}`}>
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-sky-100 font-mono text-xs font-semibold text-sky-950">{index + 1}</span>
              <div><p className="text-sm font-semibold text-slate-950">{title}</p><p className="mt-1 text-sm leading-6 text-slate-600">{body}</p></div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-950">Applicability must still be tested</p>
          <p className="mt-1 text-sm leading-6 text-amber-900">A supervisory email to one company does not, by itself, make every underlying advisory universally applicable to every NBFC. The entity should test its layer, business activities, systems and exposure, while separately following any direct RBI communication addressed to it.</p>
        </div>
      </div>

      <div>
        <Expandable title="What should the NBFC do now?" subtitle="Six actions for the revised ADD.2, without exposing restricted technical content.">
          <ol className="grid gap-3 lg:grid-cols-2">{immediateActions.map(([title, body], index) => <li key={title} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-rose-100 font-mono text-xs font-semibold text-rose-900">{index + 1}</span><div><p className="text-sm font-semibold text-slate-950">{title}</p><p className="mt-1 text-sm leading-6 text-slate-600">{body}</p></div></li>)}</ol>
        </Expandable>

        <Expandable title="Who owns each part?" subtitle="A practical responsibility map for the incident-response team.">
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">{responsibilityRows.map(([owner, action]) => <div key={owner} className="grid gap-1 p-4 sm:grid-cols-[210px_minmax(0,1fr)] sm:gap-5"><p className="text-sm font-semibold text-slate-950">{owner}</p><p className="text-sm leading-6 text-slate-600">{action}</p></div>)}</div>
        </Expandable>

        <Expandable title="What evidence should be retained?" subtitle="Show that the revised copy was controlled, assessed, implemented and closed.">
          <div className="grid gap-2 sm:grid-cols-2">{evidenceItems.map((item) => <div key={item} className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-950"><CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-700" />{item}</div>)}</div>
        </Expandable>
      </div>

      <footer className="grid gap-4 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6">
        <div className="flex gap-3"><Radar className="mt-1 size-5 shrink-0 text-cyan-800" /><div><p className="text-sm font-semibold text-slate-950">If related campaign activity is identified</p><p className="mt-1 text-sm leading-6 text-slate-600">Preserve relevant logs and supporting evidence and report to CERT-In/CSIRT-Fin at the earliest. Separately test every applicable regulatory, statutory and contractual notification requirement; this public summary is not a substitute for the restricted advisory.</p></div></div>
        <div className="flex flex-wrap gap-2 sm:justify-end"><a href="mailto:incident@cert-in.org.in" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"><Mail className="size-4" />Report incident</a><a href="mailto:csirt-fin@cert-in.org.in" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100"><Mail className="size-4" />Contact CSIRT-Fin</a></div>
      </footer>
    </section>
  );
}
