'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Check, Clipboard, ExternalLink, FileText, Flag, Search, ShieldCheck } from 'lucide-react';
import { classifyQuestion, frameResearchAnswer, getConceptPrimer, type ResearchAnswer } from './research-answer';

type Regulation = { id: number; title: string; short: string; category: string; layers: string[]; status: 'Core' | 'Specialist' | 'Reference'; updated: string; summary: string; highlights: string[] };

const officialLinks: Record<number, string> = {
  1: 'https://rbi.org.in/scripts/NotificationUser.aspx?Mode=0&Id=13539',
  29: 'https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13274',
  30: 'https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13593',
};
const rbiDirectionsIndex = 'https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx';

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

function findRegulation(question: string, regulations: Regulation[]) {
  const normalized = question.toLowerCase();
  const tokens = normalized.split(/[^a-z0-9₹]+/).filter((token) => token.length > 2);
  const scored = regulations.map((regulation) => {
    const title = `${regulation.title} ${regulation.short} ${regulation.category}`.toLowerCase();
    const corpus = `${title} ${regulation.summary} ${regulation.highlights.join(' ')}`.toLowerCase();
    let score = tokens.reduce((total, token) => total + (title.includes(token) ? 4 : corpus.includes(token) ? 1 : 0), 0);
    for (const [pattern, ids] of aliases) if (pattern.test(normalized) && ids.includes(regulation.id)) score += 12 - ids.indexOf(regulation.id);
    return { regulation, score };
  }).sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].regulation : undefined;
}

function inferProfile(question: string) {
  const q = question.toLowerCase();
  const category = /p2p/.test(q) ? 'NBFC-P2P' : /microfinance|\bmfi\b/.test(q) ? 'NBFC-MFI' : /factor|invoice discount/.test(q) ? 'NBFC-Factor' : /housing finance|\bhfc\b/.test(q) ? 'HFC' : /core investment|\bcic\b/.test(q) ? 'CIC' : /infrastructure finance|\bifc\b/.test(q) ? 'IFC' : 'NBFC-ICC';
  const statedLayer = /base layer|\bbl\b/.test(q) ? 'BL' : /middle layer|\bml\b/.test(q) ? 'ML' : /upper layer|\bul\b/.test(q) ? 'UL' : null;
  return {
    category,
    layer: statedLayer ?? 'BL',
    deposits: /deposit.taking|public deposit/.test(q) && !/non.deposit/.test(q) ? 'Deposit taking' : 'Non-deposit taking',
    digital: /digital|\blsp\b|\bdla\b|app/.test(q),
    customer: true,
    publicFunds: 'Not specified',
    missingLayer: !statedLayer,
    missingCategory: category === 'NBFC-ICC' && !/nbfc.icc|investment and credit company|\bicc\b/.test(q),
  };
}

function shapeAnswer(question: string, matched: Regulation | undefined) {
  const inferred = inferProfile(question);
  const conceptOnly = /^(what is|what does|meaning of|explain|define)\b/i.test(question.trim());
  const result = frameResearchAnswer(question, { category: inferred.category, layer: inferred.layer, deposits: inferred.deposits, digital: inferred.digital, customer: inferred.customer, publicFunds: inferred.publicFunds }, matched?.id ?? 0);
  const primer = conceptOnly ? getConceptPrimer(result.regulationId || matched?.id || 0) : null;
  if (primer) return { answer: { ...result, short: primer.meaning, applicability: 'This explains the concept only. Applicability depends on the NBFC category, SBR layer, activity and any threshold in the cited direction.', analysis: [primer.simple] }, followUp: '' };
  const asksApplicability = classifyQuestion(question) === 'applicability' || /\bmust\b|\brequired\b|\bminimum\b|\bthreshold\b/.test(question.toLowerCase());
  const followUp = asksApplicability && (inferred.missingLayer || inferred.missingCategory) ? `To confirm applicability, what is the NBFC’s ${inferred.missingCategory ? 'category' : ''}${inferred.missingCategory && inferred.missingLayer ? ' and ' : ''}${inferred.missingLayer ? 'SBR layer (BL, ML or UL)' : ''}?` : '';
  return { answer: result, followUp };
}

function answerAsText(question: string, answer: ResearchAnswer, followUp: string, matched?: Regulation) {
  return [
    `Question: ${question}`,
    '',
    `Answer: ${answer.supported ? answer.short : 'No definitive answer could be verified from the available regulatory sources.'}`,
    answer.analysis[0] ? `Repository explanation: ${answer.analysis[0]}` : '',
    followUp ? `Follow-up needed: ${followUp}` : '',
    '',
    'Regulatory reference:',
    ...answer.rows.map((row) => `${row.source}, ${row.provision}: ${row.requirement}`),
    '',
    `Read more on this website: ${matched?.title ?? 'No verified repository section identified.'}`,
  ].filter(Boolean).join('\n');
}

export function RegulatoryResearchAssistant({ regulations, onOpenRegulation, onReportInaccuracy }: { regulations: Regulation[]; onOpenRegulation: (id: number) => void; onReportInaccuracy: () => void }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<ResearchAnswer | null>(null);
  const [followUp, setFollowUp] = useState('');
  const [answeredQuestion, setAnsweredQuestion] = useState('');
  const [matchedRegulation, setMatchedRegulation] = useState<Regulation | undefined>();
  const [copied, setCopied] = useState(false);
  const [validation, setValidation] = useState('');

  const referenceRegulation = useMemo(() => regulations.find((regulation) => regulation.id === answer?.regulationId) ?? matchedRegulation, [answer, matchedRegulation, regulations]);
  const officialUrl = referenceRegulation ? officialLinks[referenceRegulation.id] ?? rbiDirectionsIndex : rbiDirectionsIndex;
  const conceptPrimer = useMemo(() => {
    if (!answer || classifyQuestion(answeredQuestion) !== 'concept') return null;
    return getConceptPrimer(answer.regulationId || matchedRegulation?.id || 0);
  }, [answer, answeredQuestion, matchedRegulation]);
  const conceptSteps = conceptPrimer?.flow?.split('→').map((step) => step.trim()).filter(Boolean) ?? [];

  const research = () => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) { setValidation('Enter an NBFC regulatory question first.'); return; }
    setValidation(''); setCopied(false);
    const matched = findRegulation(cleanQuestion, regulations);
    const shaped = shapeAnswer(cleanQuestion, matched);
    setAnsweredQuestion(cleanQuestion); setMatchedRegulation(matched); setAnswer(shaped.answer); setFollowUp(shaped.followUp);
  };

  const copyAnswer = async () => {
    if (!answer) return;
    await navigator.clipboard.writeText(answerAsText(answeredQuestion, answer, followUp, referenceRegulation));
    setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="regulatory-research-assistant" className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 bg-[#07182b] p-6 text-white sm:p-9">
        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200"><ShieldCheck className="size-4" />Repository-backed answers</div>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Ask the NBFC Regulatory Research Assistant</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">Ask a focused NBFC compliance question. The assistant answers from the regulations indexed in this repository, cites the provision and takes you to the relevant website note.</p>
        <div className="relative mt-6 max-w-5xl"><Search className="absolute left-4 top-4 size-5 text-slate-400" /><textarea value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); research(); } }} rows={4} aria-label="Ask an NBFC regulatory question" placeholder="Example: Does the 90-day NPA rule apply to a Base Layer NBFC?" className="min-h-[116px] w-full resize-none rounded-2xl border border-white/15 bg-white/10 py-4 pl-12 pr-4 text-base leading-7 text-white outline-none placeholder:text-slate-400 focus:border-cyan-200" /></div>
        <div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" onClick={research} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-200 px-5 text-sm font-semibold text-slate-950 hover:bg-cyan-100"><FileText className="size-4" />Answer my question</button><p className="text-xs leading-5 text-slate-400">Questions are processed in the browser and are not stored by this repository.</p></div>
        {validation && <p className="mt-3 text-sm font-medium text-amber-200">{validation}</p>}
      </header>

      {!answer && <div className="grid gap-3 p-6 sm:grid-cols-3 sm:p-8">{[['1', 'Direct answer first', 'A short response focused on the question asked.'], ['2', 'Provision-level reference', 'The direction and paragraph or clause, where verified in the repository.'], ['3', 'Read more here', 'A direct route to the relevant regulation note on this website.']].map(([number, title, body]) => <div key={number} className="rounded-2xl border border-slate-200 p-4"><span className="font-mono text-xs font-semibold text-primary">{number}</span><h2 className="mt-3 font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></div>)}</div>}

      {answer && <div className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-primary">Question</p><h2 className="mt-2 text-xl font-semibold">{answeredQuestion}</h2></div><div className="flex shrink-0 gap-2"><button type="button" onClick={copyAnswer} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary">{copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}{copied ? 'Copied' : 'Copy answer'}</button><button type="button" onClick={onReportInaccuracy} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-red-300 hover:text-red-700"><Flag className="size-4" />Report an inaccuracy</button></div></div>

        <section className={`rounded-2xl border p-5 sm:p-6 ${answer.supported ? 'border-blue-200 bg-blue-50' : 'border-amber-200 bg-amber-50'}`}><h3 className="font-semibold">Answer:</h3><p className="mt-2 text-base leading-7">{answer.supported ? answer.short : 'No definitive answer could be verified from the available regulatory sources.'}</p>{answer.analysis[0] && <div className="mt-4 border-t border-current/10 pt-4"><p className="text-xs font-semibold uppercase tracking-[.1em]">Repository explanation — not regulator wording</p><p className="mt-2 text-sm leading-7">{answer.analysis[0]}</p></div>}{followUp && <p className="mt-4 rounded-xl bg-white/70 p-3 text-sm font-semibold leading-6">Follow-up needed: {followUp}</p>}</section>

        {conceptPrimer && conceptSteps.length > 0 && <section className="rounded-2xl border border-cyan-200 bg-cyan-50/60 p-5 sm:p-6"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-cyan-900">Concept illustration</p><h3 className="mt-2 text-lg font-semibold text-slate-950">{conceptPrimer.title} — how it works</h3></div><span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-cyan-900 ring-1 ring-cyan-200">Simple flow</span></div><div className="mt-5 flex flex-wrap items-stretch gap-2">{conceptSteps.map((step, index) => <div key={`${step}-${index}`} className="contents"><div className="flex min-w-[150px] flex-1 items-start gap-3 rounded-xl border border-cyan-200 bg-white p-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-cyan-100 font-mono text-[10px] font-semibold text-cyan-950">{index + 1}</span><p className="text-sm font-semibold leading-5 text-slate-800">{step}</p></div>{index < conceptSteps.length - 1 && <ArrowRight aria-hidden="true" className="self-center text-cyan-700" />}</div>)}</div><p className="mt-4 text-sm leading-6 text-slate-700"><span className="font-semibold">Why it matters:</span> {conceptPrimer.why}</p>{conceptPrimer.example && <p className="mt-2 rounded-xl border border-cyan-100 bg-white/80 p-3 text-sm leading-6 text-slate-700">{conceptPrimer.example}</p>}</section>}

        <section><h3 className="text-lg font-semibold">Regulatory reference:</h3>{answer.rows.length > 0 ? <div className="mt-3 space-y-3">{answer.rows.map((row) => <article key={`${row.source}-${row.provision}`} className="rounded-2xl border border-slate-200 p-5"><p className="font-semibold">{row.source}</p><p className="mt-1 text-sm font-semibold text-primary">Paragraph / clause: {row.provision}</p><p className="mt-3 text-sm leading-7 text-slate-700"><span className="font-semibold">Source says:</span> {row.requirement}</p></article>)}</div> : <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">The repository does not contain a verified provision-level reference for this precise question.</p>}<div className="mt-3"><a href={officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Open the official RBI source <ExternalLink className="size-4" /></a></div></section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><h3 className="text-lg font-semibold">Read more on this website:</h3>{referenceRegulation ? <div className="mt-3"><button type="button" onClick={() => onOpenRegulation(referenceRegulation.id)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">Open {referenceRegulation.title}<ArrowRight className="size-4" /></button><p className="mt-3 text-xs text-slate-500">Repository source date shown for this note: {referenceRegulation.updated}.</p></div> : <p className="mt-3 text-sm leading-6 text-slate-600">No verified repository page has been identified. A more specific question or an additional source is needed.</p>}</section>
      </div>}
    </section>
  );
}
