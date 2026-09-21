export type Layer = 'BL' | 'ML' | 'UL';
export type LayerRule = { position: string; explanation: string; clause: string };
export type LayerGuide = { source: string; scope: string; rules: Record<Layer, LayerRule> };

const guide: Record<number, LayerGuide> = {
  1: { source: 'Registration, Exemptions and Framework for Scale Based Regulation Directions, 2025', scope: 'Classification also depends on category, deposit status, group assets and RBI identification.', rules: {
    BL: { position: 'Classification route', explanation: 'Generally non-deposit taking entities below ₹1,000 crore, with named categories fixed in BL.', clause: 'Paragraphs 10, 15(1)' },
    ML: { position: 'Classification route', explanation: 'Non-deposit taking entities at ₹1,000 crore or more; deposit takers and specified categories may enter ML irrespective of own size.', clause: 'Paragraphs 11, 15(2)–(3), 17–23' },
    UL: { position: 'Separate UL test', explanation: 'The folder copy includes a ₹1,00,000 crore UL threshold and transition provisions; ₹1,000 crore alone does not create UL status.', clause: 'Paragraphs 12, 24, 27' },
  } },
  2: { source: 'Prudential Norms on Capital Adequacy Directions, 2025', scope: 'Paragraph 3 limits category coverage; HFC, CIC and entities without public funds/customer interface need a separate scope test.', rules: {
    BL: { position: 'Not the general ML CRAR rule', explanation: 'The 15% general rule in paragraph 6(3) is ML+. A covered gold-jewellery lending BL NBFC has a separate 15% CRAR and 12% Tier 1 rule; covered BL entities also test leverage.', clause: 'Paragraphs 3, 6(1), 6(3), 17' },
    ML: { position: '15% CRAR; 10% Tier 1', explanation: 'For entities covered by this direction, ML must maintain these minimums on an ongoing basis.', clause: 'Paragraphs 3, 6(2)–(3)' },
    UL: { position: 'ML minima plus 9% CET1', explanation: 'Covered UL entities inherit the ML capital minima and add the common-equity Tier 1 floor.', clause: 'Paragraphs 3, 6(2)–(4)' },
  } },
  3: { source: 'Income Recognition, Asset Classification and Provisioning Directions, 2025', scope: 'The category/profile exclusions in paragraph 10 and product-specific provisions must be checked first.', rules: {
    BL: { position: 'Overdue test with BL transition', explanation: 'The BL glide path reaches the generally more-than-90-day NPA test by 31 March 2026.', clause: 'Paragraphs 42–44' },
    ML: { position: 'More than 90 days', explanation: 'ML has the express asset-wise overdue and classification requirements.', clause: 'Paragraphs 50–53' },
    UL: { position: 'ML rules carried forward', explanation: 'UL uses the ML asset-classification provisions in addition to common requirements.', clause: 'Paragraph 56 read with 50–53' },
  } },
  5: { source: 'Concentration Risk Management Directions, 2025', scope: 'Paragraph 3 excludes several categories and profiles; HFC, MGC and SPD have restricted coverage.', rules: {
    BL: { position: 'BL concentration controls', explanation: 'Covered BL entities use Board-approved concentration policies and internal limits; do not apply ML or UL headline limits automatically.', clause: 'Paragraphs 3, 6–11' },
    ML: { position: 'ML exposure norms', explanation: 'For covered ML entities, ordinary single-party and group limits are 25% and 40% of Tier 1, with category/infrastructure modifications.', clause: 'Paragraphs 3, 12–14' },
    UL: { position: 'Large Exposure Framework', explanation: 'UL uses Chapter IV. The ML Chapter III limits are expressly not the UL exposure framework.', clause: 'Paragraphs 3, 12, 25 onward' },
  } },
  6: { source: 'Asset Liability Management Directions, 2025', scope: 'Category, deposit status and asset size determine which chapter applies; CIC and some specialist categories differ.', rules: {
    BL: { position: 'Chapter/size check', explanation: 'Covered entities below ₹100 crore are exempt from Chapter II; deposit-taking and asset-size facts still matter.', clause: 'Paragraphs 3–5; Chapter II introduction' },
    ML: { position: 'ALM; LCR if triggered', explanation: 'Chapter II applies where the asset-size exemption is not met. Chapter III LCR is not universal to every non-deposit taking ML entity.', clause: 'Paragraphs 3–5; Chapter II and III introductions' },
    UL: { position: 'ALM and LCR scope test', explanation: 'Apply maturity and liquidity controls, then test Chapter III’s deposit/asset trigger and specialist exclusions.', clause: 'Paragraphs 3–5; Chapter III introduction, 60–62' },
  } },
  7: { source: 'Responsible Business Conduct Directions, 2025', scope: 'Primarily customer-facing listed categories; P2P has limited paragraphs and entities without customer interface are excluded.', rules: {
    BL: { position: 'Conduct provisions can apply', explanation: 'Covered customer-facing BL entities follow the common conduct requirements; individual clauses may specify a layer.', clause: 'Paragraphs 3–5' },
    ML: { position: 'Common and ML provisions', explanation: 'Covered ML entities follow common conduct rules plus any provision expressly written for ML or above.', clause: 'Paragraphs 3–5; check issue-specific clause' },
    UL: { position: 'Common and UL provisions', explanation: 'Covered UL entities follow common rules plus any UL-specific requirement; the issue clause controls.', clause: 'Paragraphs 3–5; check issue-specific clause' },
  } },
  8: { source: 'Credit Facilities Directions, 2025', scope: 'Product and category drive the answer; customer-facing BL entities without public funds have a conduct/prudential distinction.', rules: {
    BL: { position: 'Product-triggered', explanation: 'Covered BL entities may face digital lending, DLG or other product rules when they carry on that activity; paragraph 3 limits some prudential provisions.', clause: 'Paragraph 3; relevant product chapter' },
    ML: { position: 'Product-triggered', explanation: 'For covered ML entities, apply the product chapter only if the product or arrangement exists, such as DLG.', clause: 'Paragraph 3; DLG paragraphs 19–29' },
    UL: { position: 'Product-triggered', explanation: 'UL does not make every product chapter relevant. Check the underlying lending activity and any UL-specific overlay.', clause: 'Paragraph 3; relevant product chapter' },
  } },
  9: { source: 'Know Your Customer Directions, 2025', scope: 'Applies across layers to covered customer-facing entities; no-customer-interface entities are excluded.', rules: {
    BL: { position: 'KYC/AML applies if in scope', explanation: 'Customer due diligence, beneficial-owner identification, monitoring and periodic updates are not merely ML requirements.', clause: 'Paragraphs 3, 5(1)(iv), 39–42' },
    ML: { position: 'Same core KYC/AML framework', explanation: 'ML status does not remove the common customer identification and transaction-monitoring duties.', clause: 'Paragraphs 3, 5(1)(iv), 39–42' },
    UL: { position: 'Same core KYC/AML framework', explanation: 'UL entities remain subject to the common KYC/AML duties when the direction covers their customer activity.', clause: 'Paragraphs 3, 5(1)(iv), 39–42' },
  } },
  10: { source: 'Governance Directions, 2025', scope: 'Paragraph 3 also gives category-specific partial coverage; NOFHC is excluded under paragraph 4.', rules: {
    BL: { position: 'Chapter III generally', explanation: 'BL generally follows Chapter III. Account Aggregators and P2P have specifically listed governance paragraphs despite BL status.', clause: 'Paragraphs 3(1), 3(6)–(7), 4' },
    ML: { position: 'Chapters II–IV', explanation: 'ML adds Chapters II and IV to the Chapter III requirements, subject to category-specific scope.', clause: 'Paragraphs 3(1)–(5)' },
    UL: { position: 'Chapters II–V', explanation: 'UL adds Chapter V to the ML governance package, subject to category-specific scope.', clause: 'Paragraphs 3(1)–(5)' },
  } },
  11: { source: 'Managing Risks in Outsourcing Directions, 2025', scope: 'Only an actual outsourced financial-service or IT arrangement activates its relevant controls; NOFHC is excluded.', rules: {
    BL: { position: 'Except Chapter IV/IT-specific Chapter II', explanation: 'Covered BL entities follow the direction except the expressly excluded chapter and IT-specific provisions.', clause: 'Paragraphs 3(1)–(4)' },
    ML: { position: 'Full direction if outsourcing', explanation: 'Covered ML entities follow financial-services and material IT-outsourcing requirements when such arrangements exist.', clause: 'Paragraph 3; Chapters III–IV' },
    UL: { position: 'Full direction if outsourcing', explanation: 'Covered UL entities follow the full direction, including material IT outsourcing, when triggered.', clause: 'Paragraph 3; Chapters III–IV' },
  } },
  16: { source: 'Treatment of Wilful Defaulters and Large Defaulters Directions, 2025', scope: 'The main lender procedure is ML+ for specified categories. Some credit restrictions apply to all RBI-regulated entities.', rules: {
    BL: { position: 'Main procedure generally not BL', explanation: 'Do not run the ML+ identification procedure merely because the entity is BL. The proviso extends specified credit restrictions beyond the lender definition.', clause: 'Paragraph 2(1) and proviso' },
    ML: { position: 'Main procedure if lender in scope', explanation: 'Covered ML lenders apply identification, review, reporting and restrictions when the qualifying default trigger occurs.', clause: 'Paragraphs 2(1)–(2)' },
    UL: { position: 'Main procedure if lender in scope', explanation: 'Covered UL lenders apply the same main process when the qualifying default trigger occurs.', clause: 'Paragraphs 2(1)–(2)' },
  } },
  25: { source: 'Climate Finance and Management Directions, 2025', scope: 'Deposit-taking status, not merely SBR layer, is decisive: paragraph 3 covers deposit-taking NBFC-D and HFC.', rules: {
    BL: { position: 'Not generally a BL rule', explanation: 'The direction is framed for authorised deposit-taking entities, which are not generally BL.', clause: 'Paragraph 3' },
    ML: { position: 'Only if authorised deposit-taking', explanation: 'A non-deposit taking ML entity does not become covered merely by being ML.', clause: 'Paragraphs 3, 6' },
    UL: { position: 'Only if authorised deposit-taking', explanation: 'A non-deposit taking UL entity does not become covered merely by being UL.', clause: 'Paragraphs 3, 6' },
  } },
  4: { source: 'Resolution of Stressed Assets Directions, 2025', scope: 'The direction covers listed lender categories across layers unless a particular part/paragraph sets a narrower asset-size or activity test.', rules: {
    BL: { position: 'If stress or restructuring occurs', explanation: 'BL is not automatically outside the direction; use the applicable part for the account and entity size.', clause: 'Paragraph 3; relevant resolution chapter' },
    ML: { position: 'If stress or restructuring occurs', explanation: 'A covered ML lender tests default, review, restructuring and reporting provisions against the specific account.', clause: 'Paragraph 3; relevant resolution chapter' },
    UL: { position: 'If stress or restructuring occurs', explanation: 'UL uses the relevant stress-resolution clauses; layer alone does not make every restructuring chapter relevant.', clause: 'Paragraph 3; relevant resolution chapter' },
  } },
  12: { source: 'Credit Information Reporting Directions, 2025', scope: 'Paragraph 3 lists the covered credit institutions, including P2P and CIC, and excludes entities without customer interface and several specialist categories.', rules: {
    BL: { position: 'Reporting if a covered credit institution', explanation: 'The direction says all layers unless otherwise specified; test actual borrower/customer reporting activity.', clause: 'Paragraph 3(1)–(2)' },
    ML: { position: 'Reporting if a covered credit institution', explanation: 'ML has the same paragraph 3 scope test; reporting duties are not generated simply by asset size.', clause: 'Paragraph 3(1)–(2)' },
    UL: { position: 'Reporting if a covered credit institution', explanation: 'UL is covered when it is a listed credit institution with reportable borrower information.', clause: 'Paragraph 3(1)–(2)' },
  } },
  13: { source: 'Financial Statements: Presentation and Disclosures Directions, 2025', scope: 'Paragraphs 3–7 contain category-specific coverage; the Notes to Accounts annex adds ML/UL and UL disclosure sections.', rules: {
    BL: { position: 'Core disclosures', explanation: 'Covered BL entities follow the applicable common presentation and Notes to Accounts requirements.', clause: 'Paragraphs 3–7; Annex I C.1' },
    ML: { position: 'Core plus ML/UL disclosures', explanation: 'Covered ML entities add the annex section expressly written for ML and UL.', clause: 'Paragraphs 3–7; Annex I C.2' },
    UL: { position: 'Core, ML/UL and UL disclosures', explanation: 'Covered UL entities also apply the UL-specific annex section.', clause: 'Paragraphs 3–7; Annex I C.2–C.3' },
  } },
  14: { source: 'Transfer and Distribution of Credit Risk Directions, 2025', scope: 'The transaction must be a permitted loan transfer/acquisition or co-lending arrangement; Part A uses the lender definition in paragraph 12(4).', rules: {
    BL: { position: 'Transaction-triggered', explanation: 'A BL NBFC is not exempt merely because of layer; test whether it acts as a permitted transferor/transferee.', clause: 'Part A paragraphs 7–10, 12(4)' },
    ML: { position: 'Transaction-triggered', explanation: 'A covered ML lender applies transfer rules only when acquiring, selling or participating in a loan exposure.', clause: 'Part A paragraphs 7–10, 12(4)' },
    UL: { position: 'Transaction-triggered', explanation: 'A covered UL lender uses the same Part A transaction and role test.', clause: 'Part A paragraphs 7–10, 12(4)' },
  } },
  15: { source: 'Securitisation Transactions Directions, 2025', scope: 'Paragraph 3 covers listed lending categories across layers but excludes P2P, AA, CIC, SPD, NOFHC and specified no-public-funds profiles.', rules: {
    BL: { position: 'If covered and securitising/investing', explanation: 'A BL entity must satisfy both paragraph 3 scope and a securitisation transaction role; customer-facing BL without public funds is excluded.', clause: 'Paragraph 3' },
    ML: { position: 'If covered and securitising/investing', explanation: 'A listed ML originator or investor applies the transaction requirements when it has a securitisation exposure.', clause: 'Paragraph 3' },
    UL: { position: 'If covered and securitising/investing', explanation: 'The direction applies to listed UL originators/investors; transaction provisions control the detail.', clause: 'Paragraph 3' },
  } },
  17: { source: 'Acceptance of Public Deposits Directions, 2025', scope: 'Paragraph 3 principally covers authorised NBFC-D, deposit-taking HFC and certain Government companies; non-deposit takers are generally outside it.', rules: {
    BL: { position: 'Not a general BL permission', explanation: 'BL status does not permit acceptance of public deposits. Check authorisation and the non-deposit declaration requirement.', clause: 'Paragraph 3(1)–(2)' },
    ML: { position: 'Only if authorised to take deposits', explanation: 'A non-deposit taking ML entity is not covered merely by being ML; deposit-taking HFC has specific paragraph carve-outs.', clause: 'Paragraph 3(1)–(2)' },
    UL: { position: 'Only if authorised to take deposits', explanation: 'A non-deposit taking UL entity does not acquire deposit-taking permission from layer classification.', clause: 'Paragraph 3(1)–(2)' },
  } },
  18: { source: 'Credit Cards — Issuance and Conduct Directions, 2025', scope: 'Paragraph 3 lists ICC, Factor, MFI and HFC across layers; issuing a card requires the separate RBI permission.', rules: {
    BL: { position: 'Only if card activity is permitted', explanation: 'A covered BL category must check RBI card-issuer permission and actual credit/co-branded card activity.', clause: 'Paragraphs 3–4; card-issuer definition 5(6)' },
    ML: { position: 'Only if card activity is permitted', explanation: 'ML category coverage does not itself confer approval to issue cards.', clause: 'Paragraphs 3–4; 5(6)' },
    UL: { position: 'Only if card activity is permitted', explanation: 'UL category coverage still requires the product and permission tests.', clause: 'Paragraphs 3–4; 5(6)' },
  } },
  19: { source: 'Prudential Norms on Declaration of Dividends Directions, 2025', scope: 'Paragraph 3 covers most registered NBFC categories across layers but excludes NOFHC; the dividend eligibility route depends on prudential facts.', rules: {
    BL: { position: 'If proposing a dividend', explanation: 'Covered BL entities test the category-appropriate capital, asset-quality and payout conditions before declaration.', clause: 'Paragraph 3; relevant dividend eligibility paragraph' },
    ML: { position: 'If proposing a dividend', explanation: 'Covered ML entities apply the direction with their ML prudential capital requirements.', clause: 'Paragraph 3; relevant dividend eligibility paragraph' },
    UL: { position: 'If proposing a dividend', explanation: 'Covered UL entities apply the direction with applicable UL capital overlays.', clause: 'Paragraph 3; relevant dividend eligibility paragraph' },
  } },
  20: { source: 'Acquisition of Shareholding or Control Directions, 2025', scope: 'Paragraph 3 covers specified categories across layers, with restricted HFC/SPD paragraphs and MGC/NOFHC exclusions.', rules: {
    BL: { position: 'If control or material holding changes', explanation: 'BL is in scope for listed categories when a triggering acquisition or control event occurs.', clause: 'Paragraph 3(1)–(2); paragraphs 6–13' },
    ML: { position: 'If control or material holding changes', explanation: 'ML uses the same event test; separate HFC/SPD provisions must be checked.', clause: 'Paragraph 3(1)–(2); paragraphs 6–13' },
    UL: { position: 'If control or material holding changes', explanation: 'UL uses the same scope/event test; layer alone does not trigger prior approval.', clause: 'Paragraph 3(1)–(2); paragraphs 6–13' },
  } },
  21: { source: 'Undertaking of Financial Services Directions, 2025', scope: 'Paragraph 3 allocates different paragraph sets by category; ICC with customer interface but no public funds has a BL proviso.', rules: {
    BL: { position: 'Activity and paragraph-set test', explanation: 'Only the listed financial-service activity and category clauses apply; the BL ICC no-public-funds proviso removes paragraphs 7–14.', clause: 'Paragraph 3(2)–(3) and BL proviso' },
    ML: { position: 'Common plus ML+ paragraphs', explanation: 'Covered ICC, Factor, MFI and IFC entities add paragraphs 53–57 to the cross-layer set, subject to category scope.', clause: 'Paragraph 3(2)–(4)' },
    UL: { position: 'Common plus ML+ paragraphs', explanation: 'Covered UL entities use the ML+ set, but specialist categories have their own paragraph allocation.', clause: 'Paragraph 3(2)–(8)' },
  } },
  22: { source: 'Branch Authorisation Directions, 2025', scope: 'Paragraph 3 allocates different branch paragraphs to deposit takers, HFC, CIC, gold-loan ICC and other listed categories; P2P/AA etc are excluded.', rules: {
    BL: { position: 'Branch type/category triggered', explanation: 'Only relevant branch-opening, closure or overseas-office clauses apply to a listed BL category.', clause: 'Paragraph 3(1)–(2)' },
    ML: { position: 'Branch type/category triggered', explanation: 'ML does not make deposit-branch rules relevant to a non-deposit taker; test the paragraph allocation.', clause: 'Paragraph 3(1)–(2)' },
    UL: { position: 'Branch type/category triggered', explanation: 'UL uses the same category and branch-event allocation.', clause: 'Paragraph 3(1)–(2)' },
  } },
  23: { source: 'Voluntary Amalgamation Directions, 2025', scope: 'Paragraph 3 covers all NBFC categories and layers; paragraph 6 requires an amalgamation involving an NBFC.', rules: {
    BL: { position: 'If an amalgamation is proposed', explanation: 'A BL NBFC merging with another NBFC or an outside entity is within the stated scope.', clause: 'Paragraphs 3, 6' },
    ML: { position: 'If an amalgamation is proposed', explanation: 'A proposed ML NBFC amalgamation is within the stated scope.', clause: 'Paragraphs 3, 6' },
    UL: { position: 'If an amalgamation is proposed', explanation: 'A proposed UL NBFC amalgamation is within the stated scope.', clause: 'Paragraphs 3, 6' },
  } },
  24: { source: 'Classification, Valuation and Operation of Investment Portfolio Directions, 2025', scope: 'Paragraph 3 covers listed categories including CIC, with explicit specialist and no-public-funds exclusions.', rules: {
    BL: { position: 'Chapter II', explanation: 'A covered BL investment portfolio follows Chapter II, not the ML/UL Chapter III overlay.', clause: 'Paragraph 3(1)–(3)' },
    ML: { position: 'Chapters II and III', explanation: 'A covered ML entity adds Chapter III to the BL investment-portfolio rules.', clause: 'Paragraph 3(1)–(3)' },
    UL: { position: 'Chapters II and III', explanation: 'A covered UL entity follows Chapters II and III.', clause: 'Paragraph 3(1)–(3)' },
  } },
  26: { source: 'Credit Risk Management Directions, 2025', scope: 'Paragraph 3 excludes CIC, P2P, AA, MGC, SPD, NOFHC and specified no-public-funds profiles; paragraphs 6–8 depend on a notified-NBFC test.', rules: {
    BL: { position: 'Common rules plus BL paragraph 13', explanation: 'Covered BL entities follow the common direction and the BL-only paragraph; notified-NBFC provisions need a separate trigger.', clause: 'Paragraph 3(1)–(3); paragraphs 6–8, 13' },
    ML: { position: 'Common rules plus paragraphs 9–12', explanation: 'Covered ML entities follow the common rules and the ML+ set, with 6–8 only if notified.', clause: 'Paragraph 3(1)–(3); paragraphs 6–12' },
    UL: { position: 'Common rules plus paragraphs 9–12', explanation: 'Covered UL entities use the ML+ set; paragraph 13 is BL only.', clause: 'Paragraph 3(1)–(3); paragraphs 6–13' },
  } },
  27: { source: 'Miscellaneous Directions, 2026', scope: 'Paragraph 3 has category-specific partial coverage and specialist chapters for factoring and IDF; not every miscellaneous provision applies to every NBFC.', rules: {
    BL: { position: 'Chapter II generally', explanation: 'Covered BL entities apply Chapter II, subject to the direction’s category/paragraph allocation.', clause: 'Paragraph 3(1)(i)–(x)' },
    ML: { position: 'Chapters II and III generally', explanation: 'Covered ML entities add Chapter III unless a specialist paragraph allocation says otherwise.', clause: 'Paragraph 3(1)(i)–(x)' },
    UL: { position: 'Chapters II and III generally', explanation: 'Covered UL entities also follow Chapters II and III, subject to category-specific coverage.', clause: 'Paragraph 3(1)(i)–(x)' },
  } },
  28: { source: 'Payment and Settlement Systems Act, 2007', scope: 'This is a statute about payment-system operators/participants, not an SBR-layer direction. Determine whether the activity is a payment system under the Act.', rules: {
    BL: { position: 'Activity test, not SBR layer', explanation: 'BL status neither grants payment-system authorisation nor creates a blanket exemption.', clause: 'Payment and Settlement Systems Act, 2007, section 4(1); check the section 4 provisos' },
    ML: { position: 'Activity test, not SBR layer', explanation: 'ML status does not replace the statutory payment-system operator/participant test.', clause: 'Payment and Settlement Systems Act, 2007, section 4(1); check the section 4 provisos' },
    UL: { position: 'Activity test, not SBR layer', explanation: 'UL status does not by itself determine statutory coverage.', clause: 'Payment and Settlement Systems Act, 2007, section 4(1); check the section 4 provisos' },
  } },
  29: { source: 'Reserve Bank of India (Non-Banking Financial Companies - Internal Ombudsman) Directions, 2026', scope: 'SBR layer is not the legal trigger. Deposit status, branch count, asset size, public customer interface and the express exclusions in clause 3 decide applicability.', rules: {
    BL: { position: 'Ordinarily outside the threshold', explanation: 'A non-deposit taking BL NBFC is ordinarily below ₹1,000 crore and therefore cannot meet the ₹5,000 crore NBFC-ND threshold. Deposit-taking NBFCs are placed at least in ML under SBR. Still verify the facts and any later RBI direction.', clause: 'Clause 3; read with the SBR layer rules' },
    ML: { position: 'Conditional—not every ML NBFC', explanation: 'It applies to an NBFC-D with 10 or more branches, or an NBFC-ND with assets of ₹5,000 crore or more and a public customer interface, unless an express exclusion applies.', clause: 'Clause 3(1)–(3)' },
    UL: { position: 'Usually triggered for covered customer-facing types', explanation: 'A non-deposit taking UL NBFC will exceed the ₹5,000 crore size test, but must still have a public customer interface and must not be an excluded category. A deposit taker still needs 10 or more branches.', clause: 'Clause 3(1)–(3)' },
  } },
  30: { source: 'Reserve Bank of India (Non-Banking Financial Companies - Compliance Function) Directions, 2026', scope: 'Clause 3 uses SBR layer as the direct applicability test: the Direction applies to RBI Act or Factoring Regulation Act-registered NBFCs in ML and UL.', rules: {
    BL: { position: 'Not applicable under this Direction', explanation: 'Clause 3 names Middle and Upper Layer only. A BL NBFC should not be shown as covered by these 2026 Directions merely because it has compliance obligations under other laws or RBI instructions.', clause: 'Clause 3' },
    ML: { position: 'Direction applies', explanation: 'An ML NBFC must implement the independent Compliance function and CCO framework. The CCO stature rule may be relaxed by one additional organisational level for ML.', clause: 'Clause 3; clauses 6–33, especially clause 23 proviso' },
    UL: { position: 'Direction applies in full', explanation: 'A UL NBFC follows the complete governance, Compliance function, CCO and technology framework. Its CCO must be positioned not below two levels from the CEO.', clause: 'Clause 3; clauses 6–33, especially clause 23' },
  } },
};

export function getLayerGuide(id: number): LayerGuide | null { return guide[id] ?? null; }
export const verifiedLayerGuides = Object.keys(guide).length;
