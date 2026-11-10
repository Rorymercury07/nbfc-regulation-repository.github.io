'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  Landmark,
  ReceiptIndianRupee,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type Product = {
  id: string;
  title: string;
  label: string;
  audience: string;
  plain: string;
  how: string[];
  forms: string[];
  gate: string;
  source: string;
  regulationIds: number[];
};

const products: Product[] = [
  {
    id: 'business-loans',
    title: 'Business loans',
    label: 'Fund a business need',
    audience: 'Businesses',
    plain:
      'An NBFC lends money to a business for working capital, equipment, expansion or another documented business purpose. The facility may be secured or unsecured and may be repaid in instalments or against an agreed cash-flow cycle.',
    how: [
      'The borrower explains the purpose and supplies financial and KYC information.',
      'The NBFC assesses repayment capacity, security, end use and connected exposure.',
      'The sanction, Key Facts Statement and agreement set out price, repayment, security and default terms.',
    ],
    forms: [
      'MSME term loan',
      'Working-capital facility',
      'Equipment or vehicle finance',
      'Secured or unsecured business loan',
    ],
    gate: 'The NBFC must be permitted to lend and must approve the product through its credit, pricing, conduct and risk processes. Digital origination adds the digital-lending rules; security and recovery add their own controls.',
    source:
      'Credit Facilities, Responsible Business Conduct and Credit Risk Management Directions',
    regulationIds: [8, 7, 26],
  },
  {
    id: 'invoice-discounting',
    title: 'Invoice discounting and factoring',
    label: 'Turn receivables into cash',
    audience: 'Businesses',
    plain:
      'A business receives money against unpaid invoices instead of waiting for the customer to pay. The legal structure matters: the transaction may finance the receivable or involve its assignment to a factor, with or without recourse to the seller.',
    how: [
      'The invoice and underlying supply are verified.',
      'The NBFC determines who bears the risk if the buyer does not pay.',
      'Collection, assignment, recourse and settlement terms are recorded and monitored.',
    ],
    forms: [
      'Invoice discounting',
      'Factoring with recourse',
      'Factoring without recourse',
      'Receivables finance through an eligible platform',
    ],
    gate: 'Do not treat every invoice facility as the same product. Check whether the business model makes the company an NBFC-Factor, whether the receivable is valid and assignable, and whether another platform or factoring rule applies.',
    source:
      'Factoring Regulation Act framework and applicable RBI NBFC operating directions',
    regulationIds: [1, 27, 26],
  },
  {
    id: 'gold-loans',
    title: 'Gold loans',
    label: 'Borrow against pledged gold',
    audience: 'Individuals · Businesses',
    plain:
      'The customer pledges eligible gold jewellery or ornaments and receives a loan against the assessed value. The gold is collateral—it is not sold to the NBFC when the loan is granted.',
    how: [
      'The NBFC verifies the customer and values the eligible gold using the prescribed method.',
      'The sanctioned amount is limited by the applicable loan-to-value and product rules.',
      'The NBFC stores the gold securely and follows notice, transparency and auction safeguards if the loan is not repaid.',
    ],
    forms: [
      'Short-term gold loan',
      'Business-purpose gold loan',
      'Bullet or instalment repayment, where permitted',
      'Renewal or top-up only after the required reassessment',
    ],
    gate: 'The product needs a Board-approved policy covering valuation, ownership checks, custody, insurance, loan-to-value monitoring, borrower communication and a fair auction process.',
    source: 'Credit Facilities and Responsible Business Conduct Directions',
    regulationIds: [8, 7, 2],
  },
  {
    id: 'fixed-deposits',
    title: 'Fixed deposits',
    label: 'Place money for a fixed period',
    audience: 'Individuals · Investors',
    plain:
      'An eligible deposit-taking NBFC accepts money for an agreed period and pays interest under the deposit terms. This is not a bank demand deposit: it cannot operate like a savings or current account payable on demand.',
    how: [
      'First verify that the NBFC is specifically authorised by RBI to accept public deposits.',
      'The depositor receives the prescribed application, disclosures, nomination and repayment terms.',
      'The NBFC tracks maturity, liquid assets, deposit ceilings, credit rating and regulatory reporting.',
    ],
    forms: [
      'Cumulative fixed deposit',
      'Periodic-interest fixed deposit',
      'Renewal on maturity with fresh instructions',
      'Nomination and repayment facilities',
    ],
    gate: 'Most NBFCs cannot accept public deposits. A Middle or Upper Layer classification does not itself create deposit-taking authority. Verify the Certificate of Registration and RBI’s public records before presenting this as an available product.',
    source: 'Acceptance of Public Deposits Directions',
    regulationIds: [17, 1, 6],
  },
];

const otherFamilies = [
  [
    'Personal and consumer finance',
    'Personal loans, durable finance and other retail credit, subject to pricing, KFS, conduct and credit-information rules.',
  ],
  [
    'Vehicle and equipment finance',
    'Finance for cars, commercial vehicles, machinery and productive assets, often with the financed asset as security.',
  ],
  [
    'Housing finance',
    'Home-purchase, construction and related housing loans offered through an eligible Housing Finance Company framework.',
  ],
  [
    'Microfinance',
    'Collateral-free loans to qualifying low-income households, with household-income and repayment-obligation safeguards.',
  ],
  [
    'Infrastructure finance',
    'Longer-tenor finance for eligible infrastructure activity, commonly associated with the IFC category and concentration controls.',
  ],
  [
    'Digital lending',
    'A delivery method for a loan—not a separate permission to ignore the underlying product, KYC, conduct, data or outsourcing rules.',
  ],
];

export function ProductsGuide({
  onOpenRegulation,
}: {
  onOpenRegulation: (id: number) => void;
}) {
  const [selectedId, setSelectedId] = useState(products[0].id);
  const selected =
    products.find((product) => product.id === selectedId) ?? products[0];

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#07182b] text-white">
        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-200">
              Products offered by NBFCs
            </p>
            <h3 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
              Start with the customer need. Then check whether this NBFC may
              offer it.
            </h3>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              NBFCs serve individuals, businesses, investors and rural
              customers, but an NBFC’s Certificate of Registration, category and
              policies determine its actual product range. Select a product to
              understand what it does and which rulebook to open.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.06] p-5">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-cyan-200">
              Keep three ideas separate
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
              <p>
                <strong className="text-white">Product:</strong> what the
                customer receives, such as a business loan.
              </p>
              <p>
                <strong className="text-white">NBFC category:</strong> the
                regulatory identity, such as ICC, MFI, Factor or HFC.
              </p>
              <p>
                <strong className="text-white">Delivery channel:</strong> how it
                reaches the customer, such as a branch, agent or app.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Four products from the NBFC product guide</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight">
              Choose a card to see how the product works
            </h3>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            No product is available merely because a company is an NBFC.
          </span>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              aria-pressed={selected.id === product.id}
              onClick={() => setSelectedId(product.id)}
              className={`group rounded-2xl border p-5 text-left transition-all ${selected.id === product.id ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border hover:-translate-y-0.5 hover:border-primary/30 hover:bg-secondary/25'}`}
            >
              <span
                className={`grid size-9 place-items-center rounded-xl text-sm font-semibold ${selected.id === product.id ? 'bg-white/15' : 'bg-primary/10 text-primary'}`}
              >
                0{index + 1}
              </span>
              <h4 className="mt-4 text-lg font-semibold">{product.title}</h4>
              <p
                className={`mt-1 text-sm ${selected.id === product.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}
              >
                {product.label}
              </p>
              <p
                className={`mt-4 text-xs font-semibold uppercase tracking-[.1em] ${selected.id === product.id ? 'text-cyan-100' : 'text-primary'}`}
              >
                {product.audience}
              </p>
            </button>
          ))}
        </div>

        <article className="mt-6 overflow-hidden rounded-3xl border border-border">
          <header className="border-b border-border bg-secondary/30 p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {selected.audience}
              </span>
              <span className="text-sm font-semibold text-primary">
                {selected.label}
              </span>
            </div>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-.035em]">
              {selected.title}
            </h3>
            <p className="mt-4 max-w-5xl text-base leading-8 text-foreground/85">
              {selected.plain}
            </p>
          </header>
          <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1.15fr_.85fr]">
            <section>
              <p className="eyebrow">How it works</p>
              <ol className="mt-4 space-y-3">
                {selected.how.map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-xl border border-border p-4 text-sm leading-6"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </section>
            <section>
              <p className="eyebrow">Common forms</p>
              <ul className="mt-4 space-y-3">
                {selected.forms.map((form) => (
                  <li key={form} className="flex gap-3 text-sm leading-6">
                    <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-600" />
                    {form}
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <footer className="grid gap-5 border-t border-border bg-amber-50 p-5 text-amber-950 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.12em]">
                Permission and compliance check
              </p>
              <p className="mt-2 max-w-5xl text-sm leading-7">
                {selected.gate}
              </p>
              <p className="mt-3 text-xs font-semibold">
                Read with: {selected.source}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.regulationIds.map((id) => (
                <Button
                  key={id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-amber-300 bg-white text-amber-950"
                  onClick={() => onOpenRegulation(id)}
                >
                  Open rule {id}
                  <ArrowRight className="size-3.5" />
                </Button>
              ))}
            </div>
          </footer>
        </article>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 sm:p-8">
        <div className="max-w-3xl">
          <p className="eyebrow">Other common product families</p>
          <h3 className="mt-1 text-2xl font-semibold">
            The market is broader than four products
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            These examples help you recognise the product. They do not replace
            the category, permission and applicability check.
          </p>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {otherFamilies.map(([title, body], index) => (
            <div key={title} className="rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3">
                {index === 0 ? (
                  <Users className="size-5 text-primary" />
                ) : index === 1 ? (
                  <ReceiptIndianRupee className="size-5 text-primary" />
                ) : index === 2 ? (
                  <Building2 className="size-5 text-primary" />
                ) : index === 3 ? (
                  <ShieldCheck className="size-5 text-primary" />
                ) : index === 4 ? (
                  <Landmark className="size-5 text-primary" />
                ) : (
                  <FileText className="size-5 text-primary" />
                )}
                <h4 className="font-semibold">{title}</h4>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
