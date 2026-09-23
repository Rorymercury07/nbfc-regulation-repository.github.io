'use client';

const sourceUrl = 'https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=13593';

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-28 border-t border-slate-300 pt-10">
    <p className="text-sm font-semibold uppercase tracking-[.12em] text-blue-900">{number}</p>
    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h3>
    <div className="mt-5 text-base leading-8 text-slate-700">{children}</div>
  </section>;
}

function Matrix({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return <div className="mt-5 overflow-x-auto border-y border-slate-300">
    <table className="w-full min-w-[760px] border-collapse text-left text-sm leading-6">
      <thead><tr className="bg-slate-100 text-slate-950">{headers.map((header) => <th key={header} className="border-b border-slate-300 px-4 py-3 font-semibold">{header}</th>)}</tr></thead>
      <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex} className="align-top">{row.map((cell, cellIndex) => <td key={cellIndex} className={`border-b border-slate-200 px-4 py-3 ${cellIndex === 0 ? 'font-medium text-slate-950' : 'text-slate-700'}`}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function QA({ question, answer, reference, qualification }: { question: string; answer: string; reference: string; qualification?: string }) {
  return <div className="border-b border-slate-200 py-6 last:border-b-0">
    <h4 className="text-lg font-semibold leading-7 text-slate-950">{question}</h4>
    <p className="mt-2">{answer}</p>
    {qualification && <p className="mt-2"><strong>Qualification:</strong> {qualification}</p>}
    <p className="mt-3 text-sm font-medium text-blue-900">Reference: {reference}</p>
  </div>;
}

const actionRows = [
  ['Compliance policy', 'Put a Compliance policy in place; cover culture, structure, CCO role, risk identification, testing, reporting, information access, regulatory dissemination and pre-launch approval.', 'Board / ACB; Compliance function supports implementation', 'Board / ACB approval', 'Review at least annually', '6, 8–9'],
  ['Compliance risk assessment', 'Identify and assess major compliance risks, prepare a management plan and submit periodic and detailed annual reviews.', 'Senior management', 'Review by Board / ACB', 'Assessment annually; other review periodicity prescribed by Board / ACB', '6–7'],
  ['Independent function', 'Maintain an independent, adequately resourced Compliance function with specified responsibilities and periodic independent review.', 'NBFC; CCO heads the Department', 'Not otherwise specified', 'Ongoing; review periodicity not prescribed', '11'],
  ['Staffing and succession', 'Provide suitable skills across law, regulation, accountancy, risk and IT; plan succession to avoid skill gaps.', 'NBFC', 'Not specified', 'Ongoing', '13–14'],
  ['New processes and products', 'Obtain Compliance Department approval before introduction, assess risks and apply mitigants.', 'Compliance Department / CCO', 'Compliance approval before introduction', 'Before introduction', '9(7), 15(2), 31'],
  ['New-product monitoring', 'Subject every new product to intensive monitoring of compliance-risk indicators.', 'Compliance function', 'Not specified', 'At least first six months', '15(2)'],
  ['Compliance testing', 'Perform sufficient representative testing, report results to senior management and circulate failures with preventive instructions.', 'Compliance function; NBFC examines accountability', 'Not specified', 'Periodicity not stated', '15(3)'],
  ['RBI observations', 'Complete RMP/MAP points within prescribed timelines; send inspection-report compliance to RBI through Compliance.', 'Compliance function / assigned action owners', 'As required by RBI', 'Within RBI-prescribed timelines', '15(4)'],
  ['CCO appointment and independence', 'Run the prescribed selection, tenure, seniority, reporting, access and conflict safeguards.', 'Board / ACB and NBFC', 'Board / ACB final appointment decision', 'Minimum three-year tenure, subject to permitted relaxation', '18–28'],
  ['Technology', 'Implement an integrated workflow solution for obligations, collaboration, monitoring, escalation, deviation approval records and a unified dashboard.', 'NBFC; chosen tool depends on size and complexity', 'Competent-authority approval captured for deviations/delays', 'Ongoing; implementation date not separately stated', '32–33'],
];

export function ComplianceReference() {
  return <article className="mx-auto max-w-6xl space-y-12 pb-8">
    <div className="max-w-4xl space-y-4 text-base leading-8 text-slate-700">
      <p className="text-xl leading-9 text-slate-950">Use this page when you need to advise an ML or UL NBFC, review its Compliance function, appoint or change its Chief Compliance Officer, prepare Board papers, or respond to RBI. It converts the Direction into decisions, actions, evidence and reporting triggers.</p>
      <p>Every legal conclusion below is tied to the 2026 Direction. Where the Direction does not prescribe a form, deadline, owner or consequence, the page says so rather than supplying one as a regulatory requirement.</p>
    </div>

    <nav aria-label="I am here because" className="border-y border-slate-300 py-6">
      <p className="font-semibold text-slate-950">I am here because…</p>
      <div className="mt-3 grid gap-x-8 gap-y-2 text-sm leading-6 text-blue-900 sm:grid-cols-2">
        <a href="#applicability" className="hover:underline">I need to determine whether this applies to my NBFC → para 3</a>
        <a href="#cco" className="hover:underline">I need to appoint, transfer or remove the CCO → paras 18–29</a>
        <a href="#board-actions" className="hover:underline">I need to prepare a Board or ACB agenda → paras 6–9, 18, 21–25</a>
        <a href="#new-product" className="hover:underline">I need to launch a new product or process → paras 9(7), 15(2), 31</a>
        <a href="#rbi-triggers" className="hover:underline">I need to report or intimate something to RBI → paras 15(4)–(5), 29–30</a>
        <a href="#documents" className="hover:underline">I am conducting a compliance review → paras 6–33</a>
        <a href="#technology" className="hover:underline">I need to build the compliance workflow/dashboard → paras 32–33</a>
        <a href="#quick-reference" className="hover:underline">I need the two-minute practitioner summary → key clauses</a>
      </div>
    </nav>

    <Section id="at-a-glance" number="1" title="Regulation at a glance">
      <Matrix headers={['Item', 'Position']} rows={[
        ['Exact name', 'Reserve Bank of India (Non-Banking Financial Companies - Compliance Function) Directions, 2026'],
        ['Issuing authority', 'Reserve Bank of India, Department of Supervision'],
        ['Reference and date', 'RBI/DoS/2026-27/460; DoS.CO.PPG.54/11.01.005/2026-27; 31 July 2026'],
        ['Effective date', 'Immediately upon issuance (paragraph 2)'],
        ['Purpose', 'Minimum, proportionate standards for the Compliance function within an NBFC’s governance framework'],
        ['Operational area', 'Compliance governance, policy, risk assessment, testing, CCO independence, regulatory interface and monitoring technology'],
        ['Internal audience', 'Board / ACB, senior management, CCO, Compliance Department, business and specialist departments, every staff member and Internal Audit'],
        ['Repeal', 'Earlier NBFC Compliance-function directions, instructions and guidelines are repealed through the circular identified in paragraph 34, subject to paragraph 35 savings'],
      ]} />
    </Section>

    <Section id="applicability" number="2" title="Applicability — does this apply to my NBFC?">
      <p>Paragraph 3 uses the scale-based layer as the direct threshold. The NBFC must be in the Middle Layer or Upper Layer and registered under the RBI Act, 1934 or the Factoring Regulation Act, 2011. The words “unless specified otherwise” require a provision-by-provision check, but this Direction does not create a general BL or TL regime.</p>
      <Matrix headers={['Entity / layer', 'Position', 'Reason']} rows={[
        ['Base Layer (BL)', 'Not covered by paragraph 3', 'Do not apply this Direction merely because another law requires the BL entity to comply with substantive obligations.'],
        ['Middle Layer (ML)', 'Covered', 'RBI Act or Factoring Regulation Act registration plus ML placement. Paragraph 23 permits one additional level of relaxation in CCO seniority.'],
        ['Upper Layer (UL)', 'Covered', 'RBI Act or Factoring Regulation Act registration plus UL placement. No ML seniority relaxation.'],
        ['Top Layer (TL)', 'Not expressly included', 'Paragraph 3 names ML and UL only. The available Direction does not state a TL transition rule.'],
        ['Factoring company in ML / UL', 'Covered', 'Paragraph 3 expressly includes registration under the Factoring Regulation Act, 2011.'],
        ['Other entities', 'Depends on registration and layer', 'The Direction does not state that every company or every financial entity is covered.'],
      ]} />
      <p className="mt-4"><strong>Exemptions, grandfathering and transition:</strong> no general exemption, asset threshold, implementation window or grandfathering provision is stated. Existing actions and approvals under repealed instructions are protected by paragraph 35.</p>
    </Section>

    <Section id="practical-questions" number="3" title="Practical questions a lawyer or Compliance Officer would ask">
      <QA question="Who must approve the Compliance policy?" answer="The Board or Audit Committee of the Board must ensure that an appropriate policy is put in place and implemented. Paragraph 8 expressly calls it Board-approved." reference="6 and 8" qualification="The Direction does not prescribe a policy format." />
      <QA question="How often must the policy be reviewed?" answer="At least once every year." reference="8" />
      <QA question="Who performs the annual compliance risk assessment?" answer="Senior management. It must identify and assess major risks, prepare a plan to manage them and submit the required review to the Board / ACB." reference="7" qualification="The Board / ACB prescribes the periodicity for reviews other than the detailed annual review." />
      <QA question="Can business teams say that Compliance owns every legal requirement?" answer="No. Separate specialist departments retain prime responsibility for their respective areas, and each staff member is responsible for adherence. Compliance provides overall oversight." reference="12" />
      <QA question="Must Compliance approve a new product?" answer="Yes. The policy must include Compliance Department approval before new processes and products are introduced. The CCO must sit on the new-product committee or evaluate every new product if no such committee exists." reference="9(7) and 31" />
      <QA question="How long must a new product be monitored?" answer="The Compliance function must intensively monitor it for at least the first six months after introduction." reference="15(2)" />
      <QA question="Can the CCO hold a business role as well?" answer="No where it creates conflict. The Direction prohibits dual hatting and says the CCO must not report to business verticals. Committee participation that conflicts with the CCO role is generally barred; if the CCO is on such a committee, the role is advisory only." reference="26–27" />
      <QA question="Who appoints the CCO?" answer="A Board / ACB constituted committee runs the defined selection process and recommends a candidate. The Board / ACB takes the final decision." reference="18" qualification="External recruitment is permitted." />
      <QA question="What is the minimum CCO tenure?" answer="At least three years. In an exceptional case the Board / ACB may relax it by one year if appropriate succession planning is in place." reference="21" />
      <QA question="Can the CCO be transferred or removed early?" answer="Only in exceptional circumstances, with explicit prior Board / ACB approval and a well-defined, transparent internal administrative procedure." reference="22" />
      <QA question="Must RBI approve the CCO appointment?" answer="The Direction requires prior intimation to the Senior Supervisory Manager, not prior RBI approval. For appointment, the intimation includes the candidate profile and MD & CEO Fit and Proper certification." reference="29" />
      <QA question="Who sends inspection compliance to RBI?" answer="Compliance with RBI inspection reports must necessarily be communicated through the office of the Compliance function." reference="15(4)" />
      <QA question="Is a technology tool mandatory?" answer="Yes. The NBFC must implement a comprehensive, integrated, enterprise-wide and workflow-based solution or tool with the functions listed in paragraph 32. The NBFC may choose the particular tool or mechanism based on size and complexity." reference="32–33" />
    </Section>

    <Section id="action-matrix" number="4" title="Obligation → action matrix">
      <Matrix headers={['Regulatory requirement', 'What the NBFC must do', 'Responsible person / function', 'Approval', 'Frequency / timeline', 'Clause']} rows={actionRows} />
    </Section>

    <Section id="responsibility" number="5" title="Responsibility matrix">
      <Matrix headers={['Who', 'What the Direction assigns', 'When / reporting line', 'Clause']} rows={[
        ['Board / ACB', 'Ensure policy exists and is implemented; prescribe review periodicity; approve policy and CCO appointment; control permitted tenure relaxation and early transfer/removal; review CCO appraisal.', 'Receives senior-management reviews; may receive direct CCO reporting.', '6–9, 18, 21–25'],
        ['Senior management', 'Perform annual risk assessment, plan risk management and submit periodic and detailed annual compliance reviews.', 'To Board / ACB at prescribed periodicity and annually.', '7'],
        ['CCO', 'Head Compliance; exercise independent judgment; interact directly with regulators; serve as nodal contact; participate in RBI discussions and new-product assessment.', 'Directly to MD & CEO and/or Board / ACB.', '11, 24–25, 30–31'],
        ['Compliance function', 'Overall oversight; risk analysis, mitigants, testing, new-product monitoring, RBI observation tracking, regulatory interface, staff reference point.', 'Testing results to senior management; findings and views may go freely to senior management and Board / ACB.', '9–10, 12, 15–16'],
        ['Specialist / operational departments', 'Retain prime responsibility for compliance in their own statutory or specialist areas.', 'As organisationally assigned; the Direction does not prescribe their reporting route.', '12'],
        ['Every staff member', 'Adhere to applicable statutory provisions and regulations.', 'Ongoing.', '12'],
        ['Internal Audit', 'Include compliance risk in its risk assessment and regularly audit Compliance.', 'Keep CCO informed of compliance-related audit findings.', '17'],
        ['MD & CEO', 'May receive direct CCO reporting; provides Fit and Proper certification for a proposed CCO appointment.', 'Certification accompanies prior RBI intimation.', '25 and 29'],
      ]} />
    </Section>

    <Section id="board-actions" number="6" title="Board / committee actions">
      <Matrix headers={['Action', 'Who initiates', 'Board / ACB role', 'Frequency / trigger', 'Clause']} rows={[
        ['Compliance policy', 'Compliance / management', 'Ensure it is put in place and implemented; approve it.', 'Review at least annually', '6 and 8'],
        ['Compliance-risk review', 'Senior management', 'Prescribe periodicity and receive periodic plus detailed annual review.', 'Annual assessment; Board-prescribed review cycle', '6–7'],
        ['CCO selection', 'Board / ACB constituted committee', 'Constitute committee; take final appointment decision.', 'On appointment', '18'],
        ['CCO tenure relaxation', 'Relevant management / selection process', 'May reduce three-year minimum by one year in exceptional cases with succession planning.', 'Exceptional case', '21'],
        ['Early transfer or removal', 'Management', 'Give explicit prior approval after transparent procedure.', 'Before the event', '22'],
        ['Private meeting with CCO', 'Board / ACB', 'Meet one-to-one without senior management if CCO reports to MD & CEO.', 'Quarterly', '25'],
        ['CCO appraisal', 'Management / Board process', 'Review performance appraisal.', 'Periodicity not stated', '25'],
      ]} />
    </Section>

    <Section id="rbi-triggers" number="7" title="RBI approval, intimation and reporting triggers">
      <Matrix headers={['Trigger / event', 'Required action', 'Nature', 'Timeline', 'Information', 'Clause']} rows={[
        ['CCO appointment', 'Intimate Senior Supervisory Manager, Department of Supervision.', 'Prior intimation — not approval', 'Before appointment; no number of days stated', 'Detailed profile and MD & CEO Fit and Proper certification', '29'],
        ['Premature CCO transfer or removal', 'Intimate Senior Supervisory Manager.', 'Prior intimation; separate prior Board / ACB approval also required', 'Before event; no number of days stated', 'No prescribed form or document list stated', '22 and 29'],
        ['CCO resignation, early retirement or tenure-condition change', 'Intimate Senior Supervisory Manager.', 'Prior intimation', 'Before event; no number of days stated', 'No prescribed form or document list stated', '29'],
        ['RBI inspection / RMP / MAP action', 'Complete points within RBI-prescribed timeline; communicate inspection compliance through Compliance office.', 'Reporting / response', 'Timeline prescribed in the particular RBI action', 'Compliance response and supporting evidence; format not specified here', '15(4)'],
        ['Other regulator conveys discomfort or authority takes action', 'Bring it to RBI’s notice.', 'Reporting', 'No specific timeline stated', 'Issue and action taken; form not stated', '15(5)'],
        ['Regular RBI discussions', 'CCO participates as the nodal contact.', 'Supervisory engagement', 'As discussions occur', 'Not specified', '30'],
      ]} />
      <p className="mt-4"><strong>No general RBI approval requirement:</strong> the Direction does not state that RBI must approve the CCO appointment. It requires prior intimation. Board / ACB approval is a separate internal requirement.</p>
    </Section>

    <Section id="deadlines" number="8" title="Deadlines, frequencies and triggers">
      <Matrix headers={['Trigger', 'Action', 'Deadline / frequency', 'Clause']} rows={[
        ['Direction issued', 'Implement the Direction', 'Immediately from 31 July 2026', '2'],
        ['Compliance-policy cycle', 'Review policy', 'At least once a year', '8'],
        ['Risk-assessment cycle', 'Conduct compliance risk assessment and detailed review', 'Annually', '7'],
        ['Other compliance-risk review', 'Submit review to Board / ACB', 'Periodicity prescribed by Board / ACB', '6–7'],
        ['New product introduced', 'Intensive monitoring', 'At least first six months', '15(2)'],
        ['CCO appointed', 'Fixed tenure', 'At least three years; exceptional one-year relaxation possible', '21'],
        ['CCO reports to MD & CEO', 'One-to-one Board / ACB meeting', 'Quarterly', '25'],
        ['CCO event in paragraph 29', 'Prior RBI intimation', 'Before event; no number of days stated', '29'],
        ['Compliance testing', 'Perform representative tests and report results', 'Periodicity not stated', '15(3)'],
        ['Internal audit of Compliance', 'Regular audit', '“Regular”; interval not defined', '17'],
      ]} />
    </Section>

    <Section id="documents" number="9" title="Documents the professional should ask for">
      <Matrix headers={['Document / evidence', 'Why ask for it', 'Requirement tested', 'Clause']} rows={[
        ['Current and prior Compliance policies; approval and annual review minutes', 'Confirm required coverage, approval and review.', 'Policy content and annual review', '6, 8–9'],
        ['Annual compliance risk assessment, plan and annual review', 'Test whether major risks, failures, new rules, fair-practice adherence and remediation were reviewed.', 'Senior-management obligations', '7'],
        ['Compliance organisation chart, role descriptions, staffing and succession plan', 'Test independence, resources, responsibilities and skills.', 'Structure and staffing', '11–14'],
        ['Compliance testing plan, samples, results and management reports', 'Verify representative testing and escalation.', 'Monitoring and testing', '15(3)'],
        ['New-product approvals, risk assessment and six-month monitoring reports', 'Verify pre-launch approval and post-launch monitoring.', 'New products / processes', '9(7), 15(2), 31'],
        ['RMP / MAP / inspection tracker and RBI correspondence', 'Verify completion and routing through Compliance.', 'RBI directions and inspection response', '15(4)'],
        ['CCO selection criteria, committee recommendation and Board / ACB minutes', 'Verify defined process and final decision.', 'Appointment', '18'],
        ['CCO integrity / experience assessment and Fit and Proper certification', 'Test suitability and appointment intimation.', 'Suitability / RBI intimation', '19–20, 29'],
        ['CCO appointment letter, tenure, reporting line, committee memberships and job description', 'Test seniority, independence, dual-hatting and conflicts.', 'CCO safeguards', '21–28'],
        ['Prior RBI intimations and acknowledgments', 'Verify all paragraph 29 events were intimated before the event.', 'Regulatory intimation', '29'],
        ['Quarterly one-to-one meeting records and CCO appraisal review', 'Verify Board / ACB access where CCO reports to MD & CEO.', 'Reporting independence', '25'],
        ['Internal Audit risk assessment and Compliance audit reports', 'Verify compliance-risk coverage and regular audit.', 'Independent assurance', '17'],
        ['Workflow-tool records, escalations, approved delays and dashboard extracts', 'Verify paragraph 32 functionality.', 'Technology monitoring', '32–33'],
      ]} />
    </Section>

    <Section id="evidence" number="10" title="Compliance evidence">
      <p><strong>Expressly required records or outputs</strong> include a Board-approved policy, risk assessment and reviews, testing results reported to senior management, RBI inspection compliance sent through Compliance, CCO appointment information and Fit and Proper certification, records of competent-authority approvals for deviations or delayed submissions, and the unified dashboard contemplated by paragraph 32.</p>
      <p className="mt-3"><strong>Useful verification evidence, but not a prescribed form:</strong> a regulatory-obligation register, product-approval checklist, attendance record, succession map, issue log, training communication and testing working papers. These can demonstrate compliance, but the Direction does not prescribe their exact template.</p>
    </Section>

    <Section id="red-flags" number="11" title="Red flags / practitioner alerts">
      <Matrix headers={['Red flag', 'What to look for', 'Why it matters', 'Clause']} rows={[
        ['BL entity treated as automatically covered', 'Applicability conclusion relies only on “NBFC”.', 'Paragraph 3 specifically uses ML / UL.', '3'],
        ['Policy missing required subjects', 'No independence, information access, testing, reporting or new-product approval mechanism.', 'Policy does not cover the minimum content.', '8–9'],
        ['Compliance owns business compliance', 'Operational teams have no identified accountability.', 'Specialist departments retain prime responsibility and each staff member must comply.', '12'],
        ['CCO has revenue or sanction role', 'Business targets, credit sanctions, purchases or conflicting committee vote.', 'Potential dual hatting and loss of independence.', '26–27'],
        ['Short or unstable CCO tenure', 'Appointment below three years without documented exceptional relaxation and succession plan.', 'Minimum tenure safeguard may not be met.', '21'],
        ['CCO change already effective before RBI notice', 'Intimation dated after appointment, resignation, removal or transfer.', 'Paragraph 29 requires prior intimation.', '29'],
        ['New product approved after launch', 'Compliance sign-off or CCO review comes later.', 'Approval/evaluation is required before introduction or launch.', '9(7), 31'],
        ['No first-six-month monitoring', 'No enhanced review of a recently launched product.', 'Minimum intensive-monitoring period is missed.', '15(2)'],
        ['Manual spreadsheet lacks escalation or approvals', 'No issue escalation, deviation approval record or unified view.', 'May not satisfy paragraph 32 functions.', '32'],
      ]} />
    </Section>

    <Section id="can-we" number="12" title="“Can we do this?” questions">
      <QA question="Can an ML NBFC appoint a CCO three levels below the CEO?" answer="Yes, subject to the other requirements. Paragraph 23 requires not below two levels from the CEO but permits ML to relax by one additional level." reference="23" />
      <QA question="Can the CCO report to the MD & CEO?" answer="Yes. If that route is used, the Board / ACB must meet the CCO one-to-one quarterly without senior management, including the MD & CEO, and review the CCO appraisal." reference="25" />
      <QA question="Can the CCO also head a business vertical?" answer="No. The CCO must not report to business verticals and cannot receive responsibilities that create conflict, especially business roles." reference="26–27" />
      <QA question="Can Compliance staff perform other duties?" answer="Yes, subject to no conflict of interest. Their primary focus must remain Compliance." reference="13" />
      <QA question="Can we launch without a new-product committee?" answer="Yes, but not without Compliance review. The CCO must evaluate every new product before launch if no committee exists." reference="31" />
      <QA question="Can we choose our own compliance technology?" answer="Yes, as to the tool or mechanism, based on size and complexity. It must still perform the functions prescribed in paragraph 32." reference="32–33" />
    </Section>

    <Section id="events" number="13" title="Event → what do I do?">
      <Matrix headers={['Event', 'Immediate question', 'Required action / governance', 'Evidence', 'Clause']} rows={[
        ['We are appointing a CCO', 'Does the candidate and process meet the safeguards?', 'Selection committee recommendation; Board / ACB final decision; prior RBI intimation with profile and Fit and Proper certification.', 'Criteria, recommendation, minutes, profile, certification, intimation', '18–21, 23, 29'],
        ['The CCO has resigned', 'Has RBI been told before the resignation event and is succession controlled?', 'Prior RBI intimation; apply succession planning. No number of days prescribed.', 'Resignation, Board papers, intimation, succession record', '14 and 29'],
        ['Management wants to remove or transfer the CCO early', 'Are circumstances exceptional?', 'Transparent procedure, explicit prior Board / ACB approval and prior RBI intimation.', 'Reasons, procedure record, minutes, intimation', '22 and 29'],
        ['We are launching a new product', 'Has Compliance approved and assessed it?', 'Pre-launch approval/evaluation, mitigants and six-month intensive monitoring.', 'Approval, risk assessment, monitoring reports', '9(7), 15(2), 31'],
        ['RBI issued an inspection observation', 'What is the prescribed due date and action owner?', 'Complete within the RBI timeline; route the response through Compliance.', 'RMP/MAP tracker, closure proof, RBI response', '15(4)'],
        ['Another regulator expressed discomfort', 'Must RBI be notified?', 'Bring the issue and action taken to RBI’s notice.', 'Regulator communication, action note, RBI report', '15(5)'],
        ['A compliance deadline will be missed', 'Who is competent to approve the deviation/delay?', 'Escalate and record the competent-authority approval in the workflow. The Direction does not identify that authority.', 'Escalation and approval record', '32(3)–(4)'],
      ]} />
    </Section>

    <Section id="checklist" number="14" title="Internal compliance checklist">
      <div className="mt-2 space-y-5">{[
        ['Governance', ['☐ Current Board-approved Compliance policy covers paragraphs 8–9.','☐ Board / ACB has prescribed compliance-risk review periodicity.','☐ Senior management completed the annual assessment, plan and detailed review.']],
        ['Function and testing', ['☐ Compliance is independent, adequately resourced and periodically independently reviewed.','☐ Specialist teams and staff accountability are documented consistently with paragraph 12.','☐ Representative testing results reach senior management and failures are communicated.']],
        ['CCO', ['☐ Selection, integrity, experience, tenure, stature and reporting line meet paragraphs 18–28.','☐ No dual hatting or conflicting voting role exists.','☐ All paragraph 29 events were intimated to RBI in advance.']],
        ['Products and RBI actions', ['☐ New processes/products received pre-introduction Compliance approval.','☐ New products have six-month intensive monitoring.','☐ RBI RMP/MAP and inspection responses are controlled through Compliance.']],
        ['Technology', ['☐ Workflow covers obligation management, collaboration, escalation and approved delay/deviation.','☐ Senior management receives a unified compliance dashboard.']],
      ].map(([heading,items])=><div key={heading as string}><h4 className="font-semibold text-slate-950">{heading as string}</h4><div className="mt-2 space-y-1">{(items as string[]).map((item)=><p key={item}>{item}</p>)}</div></div>)}</div>
    </Section>

    <Section id="technology" number="15" title="What should be monitored continuously?">
      <Matrix headers={['What', 'Owner under the Direction', 'Frequency / trigger', 'Evidence', 'Clause']} rows={[
        ['Compliance risk and changes in risk profile', 'Compliance function; reports to senior management and Board / ACB', 'Ongoing; formal periodicity set by Board / ACB', 'Risk register, assessment, reports', '6–9, 15(2)'],
        ['Statutory and regulatory obligations', 'Prime department / each staff member; Compliance oversight', 'Ongoing', 'Workflow status and owner records', '10–12, 32'],
        ['New-product indicators', 'Compliance function', 'Intensive monitoring for at least first six months', 'Monitoring reports and exceptions', '15(2)'],
        ['Testing findings and failures', 'Compliance function', 'Periodicity not stated', 'Samples, results, management reports and preventive instructions', '15(3)'],
        ['RMP / MAP and inspection actions', 'Compliance function with action owners', 'Until completed within RBI-prescribed timelines', 'Action tracker and closure evidence', '15(4)'],
        ['Non-compliance, deviations and delayed submissions', 'NBFC through its workflow', 'Event-based / ongoing', 'Escalations and competent-authority approvals', '32(3)–(4)'],
      ]} />
    </Section>

    <Section id="cross-references" number="16" title="Cross-references">
      <Matrix headers={['Source', 'Why consult it', 'Reference here']} rows={[
        ['RBI Act, 1934', 'Statutory power and meanings not otherwise defined.', 'Introduction; 3; 5'],
        ['Factoring Regulation Act, 2011', 'Statutory power and registration route for covered factors.', 'Introduction; 3'],
        ['Registration, Exemptions and SBR Directions, 2025', 'Determine ML / UL placement used by paragraph 3.', 'Note to paragraph 3'],
        ['Banking Regulation Act, 1949; Companies Act, 2013', 'Fallback meaning for undefined expressions where applicable.', '5'],
        ['Other RBI regulations and Glossary of Terms', 'Fallback meanings and substantive obligations overseen by Compliance.', '5 and 10'],
        ['Other-regulator directions, self-regulatory standards and accounting standards', 'Annual review and Compliance oversight extend to applicable requirements.', '7(3), 15(5)'],
      ]} />
    </Section>

    <Section id="gaps" number="17" title="What this regulation does not answer">
      <ul className="list-disc space-y-2 pl-6">
        <li>No prescribed Compliance-policy template.</li>
        <li>No fixed interval for compliance testing, the independent review in paragraph 11 or “regular” Internal Audit.</li>
        <li>No number of days for the prior RBI intimation in paragraph 29 and no prescribed filing form or portal.</li>
        <li>No definition of “senior management,” “competent authority,” “major compliance failure” or “exceptional circumstances.”</li>
        <li>No exhaustive qualifications or age limit for the CCO beyond the stated suitability expectations.</li>
        <li>No prescribed technology product, implementation architecture or go-live date separate from immediate commencement.</li>
        <li>No penalty table for breach. Paragraph 35 preserves prior liabilities and proceedings but does not create a breach-by-breach penalty schedule.</li>
        <li>No express TL application or transition mechanism in paragraph 3.</li>
      </ul>
      <p className="mt-4 font-medium text-slate-950">For each of these: Not specified in this regulation.</p>
    </Section>

    <Section id="quick-reference" number="18" title="Practitioner’s two-minute reference">
      <Matrix headers={['Question', 'Answer']} rows={[
        ['Applies to', 'RBI Act / Factoring Act registered NBFCs in ML and UL'],
        ['Effective from', '31 July 2026, immediately upon issuance'],
        ['Key persons', 'Board / ACB, senior management, CCO, Compliance, prime specialist departments, every staff member and Internal Audit'],
        ['Board actions', 'Policy and review cycle; CCO appointment; permitted tenure relaxation; prior approval for early transfer/removal; quarterly private CCO meeting where applicable; appraisal review'],
        ['RBI actions', 'Prior CCO-event intimation; RMP/MAP and inspection responses through Compliance; report other-regulator discomfort/action; CCO participates in discussions'],
        ['Key deadlines', 'Annual risk assessment and policy review; six-month new-product monitoring; three-year CCO tenure; quarterly private meetings where condition applies'],
        ['Key documents', 'Policy, assessment/review, testing, new-product approvals, CCO file, Board minutes, RBI intimations, inspection tracker, workflow evidence and dashboard'],
        ['Top risks', 'Wrong layer conclusion; incomplete policy; conflicted CCO; late RBI intimation; missing pre-launch approval/six-month monitoring'],
        ['Most important clauses', '3, 6–9, 12, 15, 18–33'],
        ['Related sources', 'SBR Registration Directions; RBI Act; Factoring Act; applicable laws/regulations overseen by Compliance'],
      ]} />
      <div className="mt-6 flex flex-wrap gap-3"><a href={sourceUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">Open the RBI Direction ↗</a><a href="#documents" className="inline-flex rounded-lg border border-blue-950 px-4 py-2.5 text-sm font-semibold text-blue-950 hover:bg-blue-50">Open the document request list</a></div>
    </Section>
  </article>;
}
