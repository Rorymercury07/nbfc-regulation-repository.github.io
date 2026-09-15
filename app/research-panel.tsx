import { classifyQuestion, getConceptPrimer, type ResearchAnswer } from './research-answer';

const section = 'mt-5 border-t border-white/15 pt-5';
const heading = 'text-sm font-semibold text-cyan-200';
const body = 'mt-2 text-base leading-7 text-slate-200';

function SourceTable({ answer }: { answer: ResearchAnswer }) {
  if (!answer.rows.length) return <p className={body}>No exact operative clause has been verified for this question.</p>;
  return <div className="mt-3 overflow-x-auto rounded-xl border border-white/15">
    <table className="w-full min-w-[680px] text-left text-sm leading-6">
      <thead className="bg-slate-950/30 text-slate-300"><tr><th className="p-3">RBI source</th><th className="p-3">Paragraph</th><th className="p-3">Plain-English rule</th><th className="p-3">Who / when</th></tr></thead>
      <tbody>{answer.rows.map((row, index) => <tr key={index} className="border-t border-white/10 align-top"><td className="p-3 text-slate-200">{row.source}</td><td className="p-3 font-semibold text-cyan-100">{row.provision}</td><td className="p-3 text-slate-200">{row.requirement}</td><td className="p-3 text-slate-200">{row.applicability}</td></tr>)}</tbody>
    </table>
  </div>;
}

function CalculationSection({ answer }: { answer: ResearchAnswer }) {
  const guide = answer.calculation;
  if (!guide) return null;
  return <div className={section}>
    <h3 className={heading}>Formula and calculation</h3>
    <p className="mt-3 rounded-xl border border-cyan-200/25 bg-cyan-200/10 p-4 text-base font-semibold leading-7 text-white">{guide.formula}</p>
    <h4 className="mt-5 text-sm font-semibold text-cyan-100">What goes into the formula?</h4>
    <div className="mt-3 overflow-x-auto rounded-xl border border-white/15"><table className="w-full min-w-[620px] text-left text-sm leading-6"><thead className="bg-slate-950/30 text-slate-300"><tr><th className="p-3">Part</th><th className="p-3">Plain-English treatment</th><th className="p-3">Source</th></tr></thead><tbody>{guide.parts.map((part) => <tr key={part.name} className="border-t border-white/10 align-top"><td className="p-3 font-semibold text-cyan-100">{part.name}</td><td className="p-3 text-slate-200">{part.explanation}</td><td className="p-3 text-slate-300">{part.source}</td></tr>)}</tbody></table></div>
    <h4 className="mt-5 text-sm font-semibold text-cyan-100">Calculate it step by step</h4>
    <ol className="mt-2 space-y-2 text-base leading-7 text-slate-200">{guide.steps.map((step) => <li key={step}>{step}</li>)}</ol>
    <h4 className="mt-5 text-sm font-semibold text-cyan-100">Worked example</h4>
    <p className={body}>{guide.example}</p>
    <p className="mt-3 text-sm leading-6 text-slate-400">{guide.caveat}</p>
  </div>;
}

function SourceList({ answer, relatedTitle, onOpenRelated }: { answer: ResearchAnswer; relatedTitle?: string; onOpenRelated?: () => void }) {
  return <>{answer.sources.length ? <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">{answer.sources.map((item) => <li key={item}>{item}</li>)}</ul> : <p className={body}>The available regulatory material does not provide enough information to reach a definitive conclusion from this answer index. No paragraph number is inferred from a document overview.</p>}{relatedTitle && onOpenRelated && <button type="button" onClick={onOpenRelated} className="mt-4 rounded-lg border border-cyan-200/30 px-3 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-200/10">Open related direction: {relatedTitle}</button>}</>;
}

export function ResearchPanel({ question, answer, relatedTitle, onOpenRelated }: { question: string; answer: ResearchAnswer; relatedTitle?: string; onOpenRelated?: () => void }) {
  const intent = classifyQuestion(question);
  const primer = answer.supported && intent === 'concept' ? getConceptPrimer(answer.regulationId) : null;
  const narrow = intent === 'specific' || intent === 'timeline' || intent === 'applicability';

  return <section aria-live="polite" className="mt-5 rounded-2xl border border-cyan-200/25 bg-white/[.07] p-5 sm:p-7">
    <p className="text-sm font-semibold uppercase tracking-[.08em] text-cyan-200">{primer ? 'Understand the concept' : 'Answer from the indexed RBI directions'}</p>
    <h2 className="mt-2 text-xl font-semibold leading-7 text-white">{primer?.title ?? answer.issue}</h2>
    <p className="mt-1 text-sm text-slate-400">“{question}”</p>

    {primer ? <>
      <div className={section}><h3 className={heading}>What is it?</h3><p className={body}>{primer.meaning}</p></div>
      <div className={section}><h3 className={heading}>In simple words</h3><p className={body}>{primer.simple}</p></div>
      <div className={section}><h3 className={heading}>Why does it matter?</h3><p className={body}>{primer.why}</p></div>
      <CalculationSection answer={answer} />
      {primer.example && <div className={section}><h3 className={heading}>Simple example</h3><p className={body}>{primer.example}</p></div>}
      <div className={section}><h3 className={heading}>Does it apply to this NBFC?</h3><p className={body}>{answer.applicability}</p></div>
      <div className={section}><h3 className={heading}>Key RBI rules</h3><SourceTable answer={answer} /></div>
      {primer.flow && <div className={section}><h3 className={heading}>How it works</h3><p className={body}>{primer.flow}</p></div>}
      <div className={section}><h3 className={heading}>Bottom line</h3><p className="mt-2 text-base font-semibold leading-7 text-white">{answer.conclusion}</p></div>
      <details className="mt-6 rounded-xl border border-white/15 bg-slate-950/20 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-cyan-100">Read the detailed RBI requirements, exceptions and compliance actions</summary>
        <div className={section}><h3 className={heading}>What RBI requires and what it means</h3>{answer.analysis.map((item) => <p key={item} className={body}>{item}</p>)}</div>
        <div className={section}><h3 className={heading}>What the NBFC needs to do</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-base leading-7 text-slate-200">{answer.actions.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div className={section}><h3 className={heading}>Important exceptions</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-base leading-7 text-slate-200">{answer.exceptions.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div className={section}><h3 className={heading}>Regulatory sources</h3><SourceList answer={answer} relatedTitle={relatedTitle} onOpenRelated={onOpenRelated} /></div>
      </details>
      <p className="mt-5 text-sm leading-6 text-slate-300">Related concepts: {primer.related.join(' · ')}</p>
    </> : narrow ? <>
      <div className={section}><h3 className={heading}>Short answer</h3><p className="mt-2 text-base font-semibold leading-7 text-white">{answer.short}</p></div>
      <div className={section}><h3 className={heading}>Why?</h3>{answer.analysis.map((item) => <p key={item} className={body}>{item}</p>)}</div>
      <div className={section}><h3 className={heading}>What RBI says</h3><SourceTable answer={answer} /></div>
      <div className={section}><h3 className={heading}>Application to this NBFC</h3><p className={body}>{answer.applicability}</p></div>
      <div className={section}><h3 className={heading}>What you need to do</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-base leading-7 text-slate-200">{answer.actions.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div className={section}><h3 className={heading}>Exceptions and source</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-base leading-7 text-slate-200">{answer.exceptions.map((item) => <li key={item}>{item}</li>)}</ul><SourceList answer={answer} relatedTitle={relatedTitle} onOpenRelated={onOpenRelated} /></div>
    </> : <>
      <div className={section}><h3 className={heading}>Short answer</h3><p className="mt-2 text-base font-semibold leading-7 text-white">{answer.short}</p></div>
      <div className={section}><h3 className={heading}>Applicability</h3><p className={body}>{answer.applicability}</p></div>
      <div className={section}><h3 className={heading}>Governing regulations</h3><SourceTable answer={answer} /></div>
      <div className={section}><h3 className={heading}>Regulatory analysis</h3>{answer.analysis.map((item) => <p key={item} className={body}>{item}</p>)}</div>
      <div className={section}><h3 className={heading}>Exceptions</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-base leading-7 text-slate-200">{answer.exceptions.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div className={section}><h3 className={heading}>Compliance action</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-base leading-7 text-slate-200">{answer.actions.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div className={section}><h3 className={heading}>Conclusion</h3><p className="mt-2 text-base font-semibold leading-7 text-white">{answer.conclusion}</p></div>
      <div className={section}><h3 className={heading}>Sources</h3><SourceList answer={answer} relatedTitle={relatedTitle} onOpenRelated={onOpenRelated} /></div>
    </>}
    <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-slate-400">Based on the cited folder copies. Later amendments may not be present; verify the latest complete source before relying on a compliance conclusion.</p>
  </section>;
}
