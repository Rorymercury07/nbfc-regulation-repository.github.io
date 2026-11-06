'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, Check, ChevronDown, Clipboard, ExternalLink, FileSearch, Flag, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { frameResearchAnswer, type ResearchAnswer } from './research-answer';

type Regulation = {
  id: number;
  title: string;
  short: string;
  category: string;
  layers: string[];
  status: 'Core' | 'Specialist' | 'Reference';
  updated: string;
  summary: string;
  highlights: string[];
};

const officialLinks: Record<number, string> = {
  1: 'https://rbi.org.in/scripts/NotificationUser.aspx?Mode=0&Id=13539',
  29: 'https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13274',
  30: 'https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13593',
};
const rbiDirectionsIndex = 'https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx';

const subjectOptions = ['All subjects', 'Registration & SBR', 'Capital & prudential', 'KYC / AML', 'Customer protection', 'Digital lending', 'Governance', 'Reporting', 'Technology & cyber'];
const categoryOptions = ['NBFC-ICC', 'NBFC-MFI', 'NBFC-Factor', 'HFC', 'CIC', 'NBFC-P2P', 'NBFC-AA', 'IFC'];
const layerOptions = ['BL', 'ML', 'UL'];

const subjectRegulations: Record<string, number[]> = {
  'Registration & SBR': [1],
  'Capital & prudential': [2, 3, 5, 6],
  'KYC / AML': [9, 33],
  'Customer protection': [7, 12, 29],
  'Digital lending': [8, 11, 32],
  Governance: [10, 30, 34, 35],
  Reporting: [12, 13, 36, 38],
  'Technology & cyber': [31, 32, 33],
};

const aliases: Array<[RegExp, number[]]> = [
  [/register|registration|certificate|\bcor\b|principal business|scale.based|\bsbr\b/, [1]],
  [/capital|crar|tier|cet1|risk.weight|net owned fund|\bnof\b/, [2, 1]],
  [/npa|overdue|past due|90 day|asset classification|provision/, [3]],
  [/liquidity|\balm\b|\blcr\b|mismatch/, [6]],
  [/penal|interest|charge|recovery|complaint|\bkfs\b|\bapr\b|fair practice|prepayment/, [7, 29]],
  [/digital|\blsp\b|\bdla\b|guarantee|\bdlg\b|microfinance|gold loan|project finance/, [8]],
  [/kyc|aml|beneficial owner|ckycr|fiu|pep|money laundering/, [9]],
  [/director|board|committee|governance|cro|cco|compliance function/, [10, 30]],
  [/outsourc|vendor|cloud|service provider/, [11]],
  [/credit information|bureau|\bcic\b|cibil|crilc/, [12]],
  [/return|reporting|dnbs|cims|supervisory return/, [36, 38]],
  [/cyber|technology risk|information security|incident/, [31, 32, 33]],
];

function findRegulation(question: string, subject: string, regulations: Regulation[]) {
  const normalized = question.toLowerCase();
  const tokens = normalized.split(/[^a-z0-9₹]+/).filter((token) => token.length > 2);
  const subjectIds = subjectRegulations[subject] ?? [];
  const scored = regulations.map((regulation) => {
    const title = `${regulation.title} ${regulation.short} ${regulation.category}`.toLowerCase();
    const corpus = `${title} ${regulation.summary} ${regulation.highlights.join(' ')}`.toLowerCase();
    let score = tokens.reduce((total, token) => total + (title.includes(token) ? 4 : corpus.includes(token) ? 1 : 0), 0);
    if (subjectIds.includes(regulation.id)) score += 5;
    for (const [pattern, ids] of aliases) {
      if (pattern.test(normalized) && ids.includes(regulation.id)) score += 12 - ids.indexOf(regulation.id);
    }
    return { regulation, score };
  }).sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].regulation : undefined;
}

function answerAsText(question: string, answer: ResearchAnswer) {
  return [
    `Question: ${question}`,
    '',
    'A. Answer from Regulation',
    answer.short,
    ...answer.rows.map((row) => `${row.source} — ${row.provision}: ${row.requirement}`),
    '',
    'B. AI-Assisted Explanation',
    ...answer.analysis,
    '',
    'C. Applicability and Exceptions',
    answer.applicability,
    ...answer.exceptions,
    '',
    'D. Related Regulations',
    ...answer.sources,
    '',
    'E. Source Verification',
    'Checked against the indexed repository source on 6 November 2026. Verify the latest official consolidation before relying on the answer.',
  ].join('\n');
}

export function RegulatoryResearchAssistant({
  regulations,
  onOpenRegulation,
  onReportInaccuracy,
}: {
  regulations: Regulation[];
  onOpenRegulation: (id: number) => void;
  onReportInaccuracy: () => void;
}) {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('All subjects');
  const [category, setCategory] = useState('NBFC-ICC');
  const [layer, setLayer] = useState('BL');
  const [answer, setAnswer] = useState<ResearchAnswer | null>(null);
  const [answeredQuestion, setAnsweredQuestion] = useState('');
  const [matchedRegulation, setMatchedRegulation] = useState<Regulation | undefined>();
  const [copied, setCopied] = useState(false);
  const [validation, setValidation] = useState('');

  const officialUrl = useMemo(() => matchedRegulation ? officialLinks[matchedRegulation.id] ?? rbiDirectionsIndex : rbiDirectionsIndex, [matchedRegulation]);

  const research = () => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) {
      setValidation('Enter a regulatory question before searching.');
      return;
    }
    setValidation('');
    setCopied(false);
    const matched = findRegulation(cleanQuestion, subject, regulations);
    const result = frameResearchAnswer(cleanQuestion, {
      category,
      layer,
      deposits: 'Non-deposit taking',
      digital: /digital|lsp|dla|app/i.test(cleanQuestion),
      customer: true,
      publicFunds: 'Yes',
    }, matched?.id ?? 0);
    setAnsweredQuestion(cleanQuestion);
    setMatchedRegulation(matched);
    setAnswer(result);
  };

  const copyAnswer = async () => {
    if (!answer) return;
    await navigator.clipboard.writeText(answerAsText(answeredQuestion, answer));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const reportInaccuracy = () => {
    onReportInaccuracy();
  };

  return (
    <section id="regulatory-research-assistant" className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 bg-[#07182b] p-6 text-white sm:p-9">
        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200"><ShieldCheck className="size-4" />Regulation first · interpretation second</div>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Regulatory Research Assistant</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">Ask a question, find the indexed provision and test its applicability. The assistant will not invent a clause when the repository cannot verify one.</p>
        <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_170px_110px]">
          <div className="relative">
            <Search className="absolute left-3.5 top-4 size-4 text-slate-400" />
            <textarea value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); research(); } }} rows={3} aria-label="Ask a regulatory question" placeholder="Example: Does the 90-day NPA rule apply to a Base Layer NBFC?" className="min-h-[92px] w-full resize-none rounded-xl border border-white/15 bg-white/10 py-3 pl-10 pr-3 text-sm leading-6 text-white outline-none placeholder:text-slate-400 focus:border-cyan-200" />
          </div>
          <label className="text-xs font-semibold text-slate-300">Regulatory subject<select value={subject} onChange={(event) => setSubject(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/15 bg-slate-900 px-3 text-sm text-white">{subjectOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-300">NBFC category<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/15 bg-slate-900 px-3 text-sm text-white">{categoryOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-300">Layer<select value={layer} onChange={(event) => setLayer(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/15 bg-slate-900 px-3 text-sm text-white">{layerOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" onClick={research} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-200 px-5 text-sm font-semibold text-slate-950 hover:bg-cyan-100"><FileSearch className="size-4" />Find the regulation</button><p className="text-xs leading-5 text-slate-400">Questions are processed in the browser and are not stored by this repository.</p></div>
        {validation && <p className="mt-3 text-sm font-medium text-amber-200">{validation}</p>}
      </header>

      {!answer && <div className="grid gap-3 p-6 sm:grid-cols-3 sm:p-8">{[['1', 'Find the source', 'Keyword, phrase and subject matching search the indexed regulatory library first.'], ['2', 'Test applicability', 'Category and layer are applied before a rule is presented as relevant.'], ['3', 'Explain carefully', 'Interpretation is separated from the provision note and unsupported answers are refused.']].map(([number, title, body]) => <div key={number} className="rounded-2xl border border-slate-200 p-4"><span className="font-mono text-xs font-semibold text-primary">{number}</span><h2 className="mt-3 font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></div>)}</div>}

      {answer && <div className="space-y-7 p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-primary">Research question</p><h2 className="mt-2 text-xl font-semibold">{answeredQuestion}</h2><p className="mt-2 text-sm text-slate-500">Working profile: {category} · {layer} · customer-facing · public funds assumed. Change the filters if these facts are wrong.</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={copyAnswer} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary">{copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}{copied ? 'Copied' : 'Copy answer'}</button><button type="button" onClick={reportInaccuracy} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-red-300 hover:text-red-700"><Flag className="size-4" />Report an inaccuracy</button></div></div>

        <section>
          <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold text-white">A</span><h3 className="text-xl font-semibold">Answer from Regulation</h3></div>
          <div className={`mt-4 rounded-2xl border p-5 ${answer.supported ? 'border-blue-200 bg-blue-50' : 'border-amber-200 bg-amber-50'}`}><p className="text-base font-medium leading-7">{answer.supported ? answer.short : 'No definitive answer could be verified from the available regulatory sources.'}</p></div>
          {answer.rows.length > 0 && <div className="mt-4 space-y-3">{answer.rows.map((row, index) => <details key={`${row.source}-${row.provision}`} open={index === 0} className="group rounded-2xl border border-slate-200 p-5"><summary className="flex cursor-pointer list-none items-start gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 font-mono text-xs font-semibold text-primary">{index + 1}</span><span><span className="block font-semibold">{row.source}</span><span className="mt-1 block text-sm text-primary">Paragraph / provision: {row.provision}</span></span><ChevronDown className="ml-auto size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" /></summary><div className="ml-10 mt-4 border-l-2 border-primary/20 pl-4"><p className="text-xs font-semibold uppercase tracking-[.1em] text-slate-500">Indexed provision note — verify against original text</p><p className="mt-2 text-sm leading-7 text-slate-700">{row.requirement}</p><p className="mt-3 text-xs leading-5 text-slate-500">Applicability: {row.applicability}</p></div></details>)}</div>}
          <div className="mt-4 flex flex-wrap gap-3"><a href={officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">Open official RBI source <ExternalLink className="size-4" /></a>{matchedRegulation && <button type="button" onClick={() => onOpenRegulation(matchedRegulation.id)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary">Open repository note <ArrowRight className="size-4" /></button>}</div>
        </section>

        {answer.analysis.length > 0 && <section className="rounded-2xl border border-violet-200 bg-violet-50 p-5 sm:p-6"><div className="flex items-center gap-2 text-violet-950"><Sparkles className="size-5" /><h3 className="text-lg font-semibold">B. AI-Assisted Explanation</h3></div><p className="mt-2 text-xs font-semibold uppercase tracking-[.1em] text-violet-700">Interpretive layer — not original regulatory wording</p><div className="mt-4 space-y-3">{answer.analysis.map((paragraph) => <p key={paragraph} className="text-sm leading-7 text-violet-950">{paragraph}</p>)}</div></section>}

        <section><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold text-white">C</span><h3 className="text-xl font-semibold">Applicability and Exceptions</h3></div><p className="mt-4 text-sm leading-7 text-slate-700">{answer.applicability}</p><ul className="mt-4 space-y-2">{answer.exceptions.map((exception) => <li key={exception} className="flex gap-3 text-sm leading-7 text-slate-600"><AlertTriangle className="mt-1.5 size-4 shrink-0 text-amber-600" />{exception}</li>)}</ul></section>

        <section><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold text-white">D</span><h3 className="text-xl font-semibold">Related Regulations</h3></div>{answer.sources.length ? <ul className="mt-4 space-y-2">{answer.sources.map((source) => <li key={source} className="rounded-xl bg-slate-50 p-4 text-sm leading-6">{source}</li>)}</ul> : <p className="mt-4 text-sm leading-6 text-slate-600">No clause-level related source has been verified for this question. The matched library item is a research lead only.</p>}</section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold text-white">E</span><h3 className="text-lg font-semibold">Source Verification</h3></div><p className="mt-3 text-sm leading-7 text-slate-700">Repository source last checked: 6 November 2026. This answer uses the indexed source copy and does not establish that no later amendment, FAQ, transition or supervisory communication exists.</p><p className="mt-2 text-sm font-medium text-slate-700">Verification status: {answer.supported ? 'A provision-level repository note supports the answer; confirm the official source before relying on it.' : 'Insufficient verified source material. No binding conclusion is presented.'}</p></section>
      </div>}
    </section>
  );
}

