'use client';

import { useState } from 'react';

function Question({ title, source, children }: { title: string; source: string; children: React.ReactNode }) {
  return <div className="border-b border-slate-200 py-7 last:border-b-0">
    <h4 className="text-xl font-semibold leading-snug text-slate-950">{title}</h4>
    <div className="mt-3 space-y-3 text-base leading-8 text-slate-700">{children}</div>
    <p className="mt-4 text-sm font-medium text-blue-900">RBI Direction: {source}</p>
  </div>;
}

function Section({ id, number, title, intro, children }: { id: string; number: string; title: string; intro?: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-28 border-t border-slate-300 pt-10">
    <p className="text-sm font-semibold uppercase tracking-[.12em] text-blue-900">{number}</p>
    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h3>
    {intro && <p className="mt-4 text-base leading-8 text-slate-700">{intro}</p>}
    <div className="mt-3">{children}</div>
  </section>;
}

export function DepositsArticle() {
  const [nof, setNof] = useState('10');
  const [outstanding, setOutstanding] = useState('14');
  const [newDeposit, setNewDeposit] = useState('2');
  const valid = [nof, outstanding, newDeposit].every((n) => n.trim() !== '' && Number.isFinite(Number(n)) && Number(n) >= 0);
  const ceiling = Number(nof) * 1.5;
  const projected = Number(outstanding) + Number(newDeposit);

  return <article className="mx-auto max-w-4xl space-y-12 pb-6">
    <div className="space-y-5 text-base leading-8 text-slate-700">
      <p className="text-xl leading-9 text-slate-950">Suppose ABC Finance wants to offer a fixed deposit to ordinary savers. It cannot simply publish a rate and start collecting money. First it must be permitted to take deposits; then it must satisfy rules about the amount, interest, disclosures, money kept aside, and repayment.</p>
      <p>This guide follows that deposit from the first question—<em>may ABC Finance accept it?</em>—to the last—<em>what if it cannot repay?</em> The examples explain the rule, but the paragraph beneath each answer takes you to the law.</p>
    </div>

    <nav aria-label="On this page" className="border-y border-slate-200 py-5">
      <p className="text-sm font-semibold text-slate-950">On this page</p>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm leading-6 text-blue-900">
        <a href="#deposit-permission" className="hover:underline">1. Permission and scope</a>
        <a href="#deposit-definition" className="hover:underline">2. What counts as a deposit</a>
        <a href="#deposit-offer" className="hover:underline">3. Before offering one</a>
        <a href="#deposit-holding" className="hover:underline">4. While holding the money</a>
        <a href="#deposit-repayment" className="hover:underline">5. Repayment and difficulties</a>
        <a href="#deposit-reference" className="hover:underline">6. Source and current version</a>
      </div>
    </nav>

    <Section id="deposit-permission" number="1 · Start here" title="Who may accept public deposits?" intro="The first decision is about the company, not the deposit product. A scale-based layer is not a licence to raise money from the public.">
      <Question title="Can every NBFC offer fixed deposits?" source="paragraphs 3(1), 7(2) and 7(3)">
        <p>No. A deposit-taking NBFC (NBFC-D) has specific RBI registration to accept public deposits. The Direction also covers deposit-taking housing finance companies (HFCs) and Government-company NBFCs described in its applicability clause. An ordinary non-deposit-taking NBFC cannot acquire this power by calling a product a “fixed return plan” or because it has grown into the Middle or Upper Layer.</p>
        <p>For ABC Finance, the first document to inspect is its Certificate of Registration. If it is registered only as a non-deposit-taking NBFC-ICC, it must stop before designing a public-deposit offer. The RBI definition of an NBFC for these Directions mentions ICCs, HFCs, mutual benefit financial companies and registered factors, but that definition is not itself permission. The exclusions in paragraph 3 must also be read.</p>
      </Question>
      <Question title="Does this rule change for Base, Middle or Upper Layer?" source="paragraphs 3 and 7(14)(xiii)">
        <p>Not in the way many other NBFC rules do. This Direction is primarily switched on by deposit-taking status and entity category. It does not set a different deposit-interest cap or maturity period for BL, ML and UL. A non-deposit-taking UL company does not become eligible just because it is large. A covered deposit-taker does not escape the rules because it is smaller.</p>
        <p>Layer appears in a narrow definition exclusion for perpetual debt instruments issued by non-deposit-taking ML-and-above NBFCs. That exception should not be mistaken for a general layer-by-layer deposit scheme.</p>
      </Question>
      <Question title="What if my NBFC takes no deposits?" source="paragraph 3(2)(iii)–(iv)">
        <p>The Direction generally excludes an NBFC or HFC that neither accepts nor holds public deposits, provided its Board passes the prescribed annual resolution within 30 days of the beginning of the financial year. The resolution says it has not accepted and will not accept public deposits that year. It is evidence of non-deposit-taking status, not permission to start later.</p>
      </Question>
      <Question title="Are deposit-taking HFCs treated exactly like other NBFC-Ds?" source="paragraph 3(1)(ii)">
        <p>No. The Direction applies to them, but expressly removes paragraphs 10, 11, 30, 40, 50–52, 62 and 63. For those subjects, a deposit-taking HFC must also study Chapter VI of the RBI Housing Finance Company Directions, 2025. This is why an “applies to all deposit takers” badge is not enough to answer an HFC question.</p>
      </Question>
    </Section>

    <Section id="deposit-definition" number="2 · Define the money" title="What counts as a public deposit?" intro="Money received by an NBFC is not always a public deposit. Paragraph 7(14) starts with the RBI Act definition and then excludes fifteen specified kinds of receipts. The conditions matter as much as the label.">
      <Question title="Can you give me an ordinary example?" source="RBI Act section 45-I(bb); paragraph 7(14)">
        <p>ABC Finance advertises a two-year fixed deposit to members of the public. A retired teacher pays ₹1 lakh and expects principal plus interest at maturity. That is the familiar public-deposit situation this Direction is built around.</p>
        <p>Now compare a loan ABC Finance receives from its holding company. Money from another company is excluded under paragraph 7(14)(iii). A director’s own money may be excluded only if the paragraph 7(14)(v) conditions, including the written declaration about the source of funds, are met. Calling either receipt a “loan” in the accounts does not by itself prove the exclusion.</p>
      </Question>
      <Question title="What other receipts might be outside the definition?" source="paragraph 7(14)(i)–(xv)">
        <p>The fifteen exclusions cover, among other things, specified Government and institutional money; inter-company funding; qualifying share-application money; qualifying director, shareholder and director-relative receipts; certain secured or convertible instruments; qualifying large-subscription non-convertible debentures; narrowly defined promoter loans; mutual-fund money; certain subordinated or hybrid debt; commercial paper; specified perpetual debt instruments; certain infrastructure bonds; and HFC money from NHB or a public housing agency.</p>
        <p>Each is conditional. Share-application money, for example, is excluded only to the extent and for the period allowed under the Companies deposit rules. ABC Finance should record the precise sub-clause and evidence before excluding a receipt from its public-deposit total. The short descriptions here are a map, not a substitute for reading all fifteen sub-clauses.</p>
      </Question>
    </Section>

    <Section id="deposit-offer" number="3 · Before taking a rupee" title="How is a deposit offer designed?" intro="Permission is only the starting line. The company must still show that the offer is within RBI’s limits and that customers are told what they are buying.">
      <Question title="How strong must the NBFC be?" source="paragraphs 12–14 and 18">
        <p>An NBFC accepting public deposits must obtain an eligible fixed-deposit credit rating at least once each year. RBI specifies a minimum investment-grade rating of BBB− from a SEBI-registered credit-rating agency. A rating is an independent risk opinion, not a promise that RBI will repay depositors.</p>
        <p>If ABC Finance falls below the minimum, it must immediately stop accepting fresh deposits and renewing existing ones. Existing deposits run to maturity, and the company reports the position to its RBI Regional Office within 15 working days. Rating upgrades and downgrades at any level also have a 15-working-day RBI notification rule.</p>
      </Question>
      <Question title="Can it promise ‘withdraw whenever you like’?" source="paragraphs 15–16">
        <p>No. An NBFC cannot accept a public deposit repayable on demand. A normal deposit or renewal must mature after at least 12 months and no later than 60 months. ABC Finance can offer a two-year term, but not a six-month term or a product functioning like a bank savings account.</p>
      </Question>
      <Question title="How much can it raise?" source="paragraph 17">
        <p>If it meets the minimum net owned fund (NOF) and applicable prudential norms, the total public deposits outstanding after a new acceptance or renewal cannot exceed 1.5 times NOF. NOF is a statutory measure of the company’s own funds; it is not the balance in its current account. If the ceiling is already breached, the Direction stops fresh acceptance and renewal until the balance is back within it. A matured deposit cannot be renewed without the depositor’s express, voluntary consent.</p>
        <p>For example, ₹10 crore NOF gives ABC Finance a ₹15 crore ceiling. If ₹14 crore is already outstanding, another ₹2 crore would take it to ₹16 crore and cannot be accepted under this limit.</p>
        <div className="mt-5 border-l-4 border-blue-900 bg-slate-50 px-5 py-4">
          <p className="font-semibold text-slate-950">Try the ceiling with your own numbers</p>
          <div className="mt-3 flex flex-wrap gap-3">{([['NOF (₹ crore)', nof, setNof], ['Already outstanding', outstanding, setOutstanding], ['New deposit', newDeposit, setNewDeposit]] as const).map(([label,value,change])=><label key={label} className="min-w-[150px] flex-1 text-sm">{label}<input type="number" min="0" step="0.01" value={value} onChange={(event)=>change(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base" /></label>)}</div>
          <p aria-live="polite" className="mt-3 text-sm font-semibold">{valid ? `Ceiling: ₹${ceiling.toLocaleString('en-IN')} crore. Proposed total: ₹${projected.toLocaleString('en-IN')} crore — ${projected <= ceiling ? 'within this limit' : 'above this limit'}.` : 'Enter three non-negative amounts.'}</p>
          <p className="mt-1 text-sm leading-6">This checks only the paragraph 17 ceiling; it does not establish permission to accept a deposit.</p>
        </div>
      </Question>
      <Question title="What rate and selling costs are allowed?" source="paragraphs 19–21">
        <p>The deposit rate offered, accepted or renewed cannot exceed 12.5% a year, and interest compounding cannot be more frequent than monthly. A broker’s commission or other benefit is capped at 2% of deposits collected, plus documented expense reimbursement capped at 0.5%. These are ceilings, not rates that RBI recommends charging.</p>
        <p>Deposits from NRIs or persons of Indian origin require a separate FEMA check. Paragraph 20 gives them a one-to-three-year term and ties their interest cap to RBI’s rate for comparable scheduled-bank deposits, rather than simply applying the resident-product terms.</p>
      </Question>
      <Question title="What must a depositor be told?" source="paragraphs 28–34">
        <p>The customer must complete a written deposit application containing prescribed particulars, including the depositor category and fixed-deposit rating. Deposit advertisements have detailed disclosure rules. They must not make a customer think that the deposits are insured or that RBI guarantees the company’s financial soundness or repayment.</p>
        <p>ABC Finance should review the application form, advertisement and any statement in lieu of advertisement against the full clauses before publication. A good sales explanation cannot replace the mandatory written information.</p>
      </Question>
    </Section>

    <Section id="deposit-holding" number="4 · After acceptance" title="What must happen while the NBFC holds the money?" intro="A deposit is a liability until it is repaid. The Direction therefore looks at the money kept available, the records, the customer’s receipt and the company’s reporting.">
      <Question title="Must the NBFC keep any money aside?" source="paragraphs 10–11 and 61; HFC exception in paragraph 3(1)">
        <p>An NBFC-D must maintain unencumbered liquid assets of at least 15% of the relevant outstanding public deposits. At least 10% of public deposits must be in approved securities; eligible unencumbered term deposits or specified bonds can form the remainder. The deposit base is measured at the last working day of the second preceding quarter, while the required holding applies at the close of each day.</p>
        <p>So if the relevant deposit base is ₹100 crore, the minimum total is ₹15 crore, including at least ₹10 crore in approved securities. The ₹10 crore is <em>not</em> 10% of the ₹15 crore buffer. The Direction separately requires full asset cover and a floating charge over statutory liquid assets in favour of depositors, implemented through a trust deed. Deposit-taking HFCs must instead check their specific carve-outs and HFC Directions for liquid-asset rules.</p>
      </Question>
      <Question title="What proof does the customer receive?" source="paragraphs 27 and 41–45">
        <p>Joint deposits are permitted with specified survivor arrangements. For each deposit, the NBFC issues a signed receipt showing essential terms such as the depositor, amount, rate and repayment date. Its deposit register tracks the depositor and the deposit through acceptance, renewal and repayment. These records matter when a customer claims repayment or a regulator checks the company’s liabilities.</p>
      </Question>
      <Question title="What does RBI expect to see?" source="paragraphs 58–61 and 64">
        <p>Deposit obligations continue into financial reporting. The Board’s report must state the number and amount of deposits unclaimed or unpaid after the due date; where the aggregate exceeds ₹5 lakh, it must also explain steps taken or proposed for repayment. Audited accounts, the Board’s report and auditor material are due to RBI within 15 days of the general meeting under paragraph 60, alongside other applicable returns. The company must monitor whether its assets fully cover deposit liabilities and report a shortfall as directed.</p>
      </Question>
      <Question title="Can it expand its deposit-collecting branches freely?" source="Deposit Direction paragraphs 46 and 48; Branch Authorisation Direction paragraphs 5–6 and 11–12">
        <p>Read the separate <a className="font-medium text-blue-900 underline" href="https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12962" target="_blank" rel="noreferrer">NBFC Branch Authorisation Directions</a>. The April 2026 update moved the operative opening and closure rules there. In general, a deposit-taker with NOF up to ₹50 crore or a rating below AA is limited to branches or agents within its home state; more than ₹50 crore NOF <em>and</em> AA or better allows wider expansion. The older opening-notice procedure reproduced in the supplied learning guide is no longer the current text.</p>
      </Question>
    </Section>

    <Section id="deposit-repayment" number="5 · At the end, and if things go wrong" title="How does the depositor get the money back?">
      <Question title="What happens at maturity?" source="paragraphs 17, 22–24">
        <p>At least 14 days before maturity, the NBFC must tell the depositor the maturity details. It then repays according to the agreed terms or renews only with the depositor’s express, voluntary consent. The Direction has special interest rules for early renewal to obtain a higher rate and for an overdue deposit; these need a transaction-specific calculation rather than an automatic rollover.</p>
      </Question>
      <Question title="Can the customer leave early?" source="paragraphs 35–40">
        <p>Ordinarily, neither premature repayment nor a loan against the deposit is allowed in the first three months. After that, a non-problem NBFC may permit early repayment under the contract or lend up to 75% against the deposit at a rate two percentage points above the deposit rate. The amount of interest payable on early repayment depends on how long the money stayed: paragraph 40 provides no interest after three but before six months and a reduced-rate formula thereafter.</p>
        <p>The first-three-month rule has specific exceptions. A “tiny deposit” is defined by the aggregate, not merely one receipt, and can be paid in full without interest. For qualifying emergencies, the Direction permits up to the lower of 50% of principal or ₹5 lakh; for critical illness it permits the full principal, subject to the stated conditions. These are not a general “withdraw anytime” option.</p>
      </Question>
      <Question title="What if the depositor dies?" source="paragraph 35 proviso">
        <p>Death overrides the three-month lock-in. On a request and proof of death satisfactory to the company, it must repay the eligible surviving joint holder, nominee or legal heir even within that period. ABC Finance cannot reject a valid death claim simply by pointing to a two-year deposit term.</p>
      </Question>
      <Question title="What if the NBFC cannot repay?" source="paragraphs 7(13), 38–39 and 62">
        <p>Failure to meet a lawful demand for a matured deposit within five working days is one route to “problem NBFC” status. There are other specified triggers too. A problem NBFC faces much narrower early-repayment and loan-against-deposit options, with a ₹10,000 limit in the cases paragraph 38 describes and account-clubbing under paragraph 39. Separately, paragraph 62 bars a defaulting NBFC from making new loans, investments or other assets while the default continues; that paragraph is one of the express HFC carve-outs.</p>
      </Question>
    </Section>

    <Section id="deposit-reference" number="6 · Go to the law" title="Source, version and next reading">
      <p className="mt-5 text-base leading-8 text-slate-700">This lesson is based on the <a className="font-medium text-blue-900 underline" href="https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12958" target="_blank" rel="noreferrer">Reserve Bank of India (Non-Banking Financial Companies – Acceptance of Public Deposits) Directions, 2025</a>, RBI/DOR/2025-26/346. RBI’s online text is marked updated 15 April 2026. The learning guide and PDF supplied for this site begin with the 28 November 2025 issue-date text, so the live RBI version controls where it has changed.</p>
      <p className="mt-4 text-base leading-8 text-slate-700">For a real company, begin with its registration and deposit-taking status; classify each kind of money under paragraph 7(14); then test the specific offer, operating rule, exception and current amendment. A housing finance company must also read the <a className="font-medium text-blue-900 underline" href="https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12958" target="_blank" rel="noreferrer">HFC carve-out in paragraph 3</a> and the companion HFC Directions. An explanation here is not a substitute for a current-law check before launching a product or filing with RBI.</p>
    </Section>
  </article>;
}
