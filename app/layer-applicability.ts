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
};

export function getLayerGuide(id: number): LayerGuide | null { return guide[id] ?? null; }
export const verifiedLayerGuides = Object.keys(guide).length;
