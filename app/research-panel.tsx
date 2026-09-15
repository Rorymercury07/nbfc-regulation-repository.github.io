import type { ResearchAnswer } from './research-answer';

export function ResearchPanel({ question, answer, relatedTitle, onOpenRelated }: { question: string; answer: ResearchAnswer; relatedTitle?: string; onOpenRelated?: () => void }) {
  const section = 'mt-6 border-t border-white/15 pt-5';
  const heading = 'text-sm font-semibold text-cyan-200';
  const body = 'mt-2 text-[15px] leading-7 text-slate-200';
  return <section aria-live="polite" className="mt-5 rounded-2xl border border-cyan-200/25 bg-white/[.07] p-5 sm:p-7">
    <p className="text-sm font-semibold uppercase tracking-[.08em] text-cyan-200">Regulatory research answer</p>
    <h2 className="mt-2 text-xl font-semibold leading-7 text-white">{answer.issue}</h2>
    <p className="mt-1 text-sm text-slate-400">Your question: “{question}”</p>
    <div className={section}><h3 className={heading}>Short Answer</h3><p className={body}>{answer.short}</p></div>
    <div className={section}><h3 className={heading}>Applicability</h3><p className={body}>{answer.applicability}</p></div>
    <div className={section}><h3 className={heading}>Governing Regulations</h3>
      {answer.rows.length ? <div className="mt-3 overflow-x-auto rounded-xl border border-white/15"><table className="w-full min-w-[700px] text-left text-sm leading-6"><thead className="bg-slate-950/30 text-slate-300"><tr><th className="p-3">Source</th><th className="p-3">Provision</th><th className="p-3">Requirement</th><th className="p-3">Applicability</th></tr></thead><tbody>{answer.rows.map((row, index) => <tr key={index} className="border-t border-white/10 align-top"><td className="p-3 text-slate-200">{row.source}</td><td className="p-3 font-semibold text-cyan-100">{row.provision}</td><td className="p-3 text-slate-200">{row.requirement}</td><td className="p-3 text-slate-200">{row.applicability}</td></tr>)}</tbody></table></div> : <p className={body}>No exact operative clause has been verified for this query.</p>}
    </div>
    <div className={section}><h3 className={heading}>Regulatory Analysis</h3>{answer.analysis.map((item) => <p key={item} className={body}>{item}</p>)}</div>
    <div className={section}><h3 className={heading}>Exceptions / Qualifications</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-[15px] leading-7 text-slate-200">{answer.exceptions.map((item) => <li key={item}>{item}</li>)}</ul></div>
    <div className={section}><h3 className={heading}>Compliance Action</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-[15px] leading-7 text-slate-200">{answer.actions.map((item) => <li key={item}>{item}</li>)}</ul></div>
    <div className={section}><h3 className={heading}>Conclusion</h3><p className="mt-2 text-[15px] font-semibold leading-7 text-white">{answer.conclusion}</p></div>
    <div className={section}><h3 className={heading}>Sources</h3>{answer.sources.length ? <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">{answer.sources.map((item) => <li key={item}>{item}</li>)}</ul> : <p className={body}>No exact provision is cited because this question needs further clause-level research.</p>}{relatedTitle && onOpenRelated && <button type="button" onClick={onOpenRelated} className="mt-4 rounded-lg border border-cyan-200/30 px-3 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-200/10">Open related direction: {relatedTitle}</button>}</div>
    <p className="mt-5 text-xs leading-5 text-slate-400">Based only on the cited folder copies. Check later amendments and the complete source before relying on a compliance conclusion.</p>
  </section>;
}
