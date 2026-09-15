import { getLayerGuide, type Layer } from './layer-applicability';

const layers: { code: Layer; name: string }[] = [
  { code: 'BL', name: 'Base Layer' },
  { code: 'ML', name: 'Middle Layer' },
  { code: 'UL', name: 'Upper Layer' },
];

export function LayerPanel({ regulationId, selectedLayer }: { regulationId: number; selectedLayer: string }) {
  const guide = getLayerGuide(regulationId);
  return <section id="layer-comparison" className="scroll-mt-5 rounded-2xl border border-blue-200 bg-blue-50/60 p-5 sm:p-6">
    <p className="eyebrow text-blue-800">Check by scale-based layer</p>
    <h3 className="mt-1 text-xl font-semibold text-blue-950">Base, Middle and Upper Layer—side by side</h3>
    <p className="mt-2 max-w-4xl text-sm leading-6 text-blue-900">These cards explain what changes by layer. A final applicability decision still needs the NBFC category, deposit status, public-funds/customer-interface test, activity and any exemption.</p>
    <div className="mt-5 grid gap-3 md:grid-cols-3">{layers.map(({ code, name }) => {
      const rule = guide?.rules[code];
      return <article key={code} className={`rounded-xl border bg-white p-4 sm:p-5 ${selectedLayer === code ? 'border-blue-700 ring-2 ring-blue-100' : 'border-blue-200'}`}>
        <div className="flex items-center justify-between gap-2"><span className="rounded-full bg-blue-900 px-2.5 py-1 text-xs font-bold text-white">{code}</span>{selectedLayer === code && <span className="text-xs font-semibold text-blue-800">Selected filter</span>}</div>
        <h4 className="mt-3 text-base font-semibold text-blue-950">{name}</h4>
        <p className="mt-3 text-sm font-semibold text-blue-900">{rule?.position ?? 'Clause check needed'}</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{rule?.explanation ?? 'This regulation is indexed in the library, but its layer-by-layer applicability has not yet been verified against the exact scope and obligation clauses. Do not treat the library filter as a legal conclusion.'}</p>
        <p className="mt-4 border-t border-blue-100 pt-3 text-xs leading-5 text-slate-600"><strong>Clause:</strong> {rule?.clause ?? 'Not yet verified'}</p>
      </article>;
    })}</div>
    {guide ? <p className="mt-4 text-sm leading-6 text-blue-950"><strong>Regulatory source:</strong> {guide.source}. <strong>Scope qualification:</strong> {guide.scope}</p> : <p className="mt-4 text-sm leading-6 text-blue-950">The full source remains available in the indexed library. This three-layer view is deliberately marked for clause verification rather than assuming that all three layers are covered.</p>}
  </section>;
}
