import { AlertTriangle, CheckCircle2, ChevronDown, FileWarning, Mail, Radar, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const immediateActions = [
  ['Preserve both advisories', 'Keep the 1 October 2026 parent advisory and ADD.1 together in the cyber-advisory register. Record receipt, owner, applicability and status.'],
  ['Map the exposed environment', 'Identify payment and disbursement APIs, API gateways, internet-facing applications, privileged identities, service accounts, endpoints, DNS, proxy, firewall and cloud workloads that may be relevant.'],
  ['Deploy and tune detections', 'Load the supplied IOCs and detection logic into the tools that apply to your environment, then tune thresholds and exclusions to reduce false positives without weakening useful detection.'],
  ['Search historical logs', 'Run retrospective analysis for the supplied indicators and for the behaviour or TTPs described in both advisories. Record the period, data sources, queries and results.'],
  ['Hunt beyond the IOC list', 'Indicators change. Look for unusual API calls, credential misuse, anomalous disbursement activity, persistence and unexpected outbound command-and-control traffic.'],
  ['Escalate, contain and report', 'Preserve evidence, activate the approved incident-response process and report a related incident to CERT-In/CSIRT-Fin with logs and supporting material at the earliest, while separately checking every other applicable reporting route.'],
] as const;

const responsibilityRows = [
  ['CISO / Information Security', 'Own the assessment, technical response, threat hunting and closure sign-off.'],
  ['SOC', 'Deploy indicators and rules, tune alerts, investigate matches and retain alert evidence.'],
  ['Application and API teams', 'Review authentication, authorisation, rate limits, API logs and abnormal payment/disbursement behaviour.'],
  ['Infrastructure / Cloud / Network', 'Review outbound C2 traffic, DNS, proxy, firewall, endpoint and cloud telemetry.'],
  ['Fraud Risk / Operations', 'Reconcile suspicious fund movements with technical alerts and transaction records.'],
  ['Compliance and Legal', 'Confirm reporting routes, preserve the regulatory record and support evidence, notification and confidentiality decisions.'],
] as const;

const evidenceItems = [
  'Original advisory and ADD.1 attachment',
  'Source, receipt date, risk assessment and internal ticket',
  'Affected-system and control-owner inventory',
  'IOC and rule deployment evidence, version and approval',
  'Tuning decisions and false-positive assessment',
  'Retrospective-search queries, period, data sources and results',
  'Alerts, investigation notes, preserved logs and transaction evidence',
  'Containment, recovery, reporting and closure records',
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
              <Badge className="bg-rose-200 text-rose-950 hover:bg-rose-200">Priority cybersecurity advisory</Badge>
              <Badge variant="outline" className="border-white/25 text-white">CSIRT-Fin / CERT-In</Badge>
              <span className="text-xs font-medium text-rose-100">Parent advisory: 1 October 2026</span>
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-rose-200">Advisory 261830103401_ADD.1</p>
            <h2 id="csirt-fin-title" className="mt-2 text-2xl font-semibold leading-tight tracking-[-.025em] sm:text-3xl">Additional IOCs and detection rules for command-and-control infrastructure</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-rose-50/85">This addendum supplements the earlier alert on unauthorised fund transfers through payment and disbursement API abuse. It asks concerned entities to deploy the additional detections, tune them, search historical logs and investigate the attacker’s broader behaviour - not merely block a static IOC list.</p>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-rose-200/20 bg-rose-200/10"><ShieldAlert className="size-6 text-rose-200" /></span>
        </div>
        <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
          {[['What it affects', 'Payment and disbursement API security'], ['What must happen', 'Deploy, tune and retrospectively hunt'], ['How urgent', 'Priority basis; investigate and report promptly']].map(([label, value]) => <div key={label}><p className="text-xs font-semibold uppercase tracking-[.1em] text-rose-200">{label}</p><p className="mt-1 text-sm font-semibold leading-6 text-white">{value}</p></div>)}
        </div>
      </header>

      <div className="border-b border-amber-200 bg-amber-50 px-5 py-4 sm:px-6">
        <div className="flex gap-3">
          <FileWarning className="mt-0.5 size-5 shrink-0 text-amber-700" />
          <div><p className="text-sm font-semibold text-amber-950">The actual ADD.1 attachment is not yet in this website record</p><p className="mt-1 text-sm leading-6 text-amber-900">The notification refers to attached IOCs and detection rules, but only the notification text was supplied. Do not invent or reconstruct the missing indicators. Upload the addendum before using this page as a technical detection source.</p></div>
        </div>
      </div>

      <div>
        <Expandable title="What should the NBFC do now?" subtitle="Six actions that turn the advisory into an auditable response.">
          <ol className="grid gap-3 lg:grid-cols-2">{immediateActions.map(([title, body], index) => <li key={title} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-rose-100 font-mono text-xs font-semibold text-rose-900">{index + 1}</span><div><p className="text-sm font-semibold text-slate-950">{title}</p><p className="mt-1 text-sm leading-6 text-slate-600">{body}</p></div></li>)}</ol>
        </Expandable>

        <Expandable title="Who owns each part?" subtitle="A practical responsibility map for the incident-response team.">
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">{responsibilityRows.map(([owner, action]) => <div key={owner} className="grid gap-1 p-4 sm:grid-cols-[210px_minmax(0,1fr)] sm:gap-5"><p className="text-sm font-semibold text-slate-950">{owner}</p><p className="text-sm leading-6 text-slate-600">{action}</p></div>)}</div>
        </Expandable>

        <Expandable title="What evidence should be retained?" subtitle="A response is not complete until the NBFC can show what it assessed and implemented.">
          <div className="grid gap-2 sm:grid-cols-2">{evidenceItems.map((item) => <div key={item} className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-950"><CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-700" />{item}</div>)}</div>
        </Expandable>
      </div>

      <footer className="grid gap-4 border-t border-slate-200 bg-slate-50 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6">
        <div className="flex gap-3"><Radar className="mt-1 size-5 shrink-0 text-cyan-800" /><div><p className="text-sm font-semibold text-slate-950">If a related incident is identified</p><p className="mt-1 text-sm leading-6 text-slate-600">The communication requests reporting to CERT-In/CSIRT-Fin at the earliest, with relevant logs and supporting evidence. Also test all other applicable regulatory, statutory and contractual notification requirements.</p></div></div>
        <div className="flex flex-wrap gap-2 sm:justify-end"><a href="mailto:incident@cert-in.org.in" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"><Mail className="size-4" />Report incident</a><a href="mailto:csirt-fin@cert-in.org.in" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100"><Mail className="size-4" />Contact CSIRT-Fin</a></div>
      </footer>
    </section>
  );
}
