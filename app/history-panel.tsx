'use client';

import { useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const chapters = [
  {
    era: '1960s', title: 'A starting point: protect depositors',
    headline: 'Non-bank finance entered the RBI rulebook.',
    story: 'Chapter III-B was added to the RBI Act in 1964. The initial concern was how financial companies raised money from the public and how depositors could be protected.',
    meaning: 'The NBFC story began with the regulatory perimeter—not with today’s BL, ML or UL labels.',
    source: 'RBI Bulletin: Regulatory Environment for NBFCs', url: 'https://www.rbi.org.in/Scripts/BS_ViewBulletin.aspx?Id=17147',
  },
  {
    era: '1997–98', title: 'From a loose perimeter to registration',
    headline: 'The entry gate became more formal.',
    story: 'After rapid sector growth and failures, Parliament strengthened Chapter III-B in 1997. Section 45-IA made RBI registration and minimum net owned fund central to carrying on NBFC business; the supervisory framework followed in 1998.',
    meaning: 'Before asking which operating rule applies, ask whether the company is within the NBFC perimeter and has the required registration or an exemption.',
    source: 'RBI FAQ: regulation and supervision of NBFCs', url: 'https://www.rbi.org.in/scripts/FAQView.aspx?Id=3',
  },
  {
    era: '2014', title: 'Risk, public funds and customer interface',
    headline: 'Not every NBFC carried the same risk.',
    story: 'RBI’s revised framework distinguished smaller non-deposit-taking NBFCs by whether they accessed public funds and dealt with customers. It also strengthened prudential and governance requirements where risk was greater.',
    meaning: 'Funding source and customer-facing activity became important applicability questions. The 2014 circular is historical context; test today’s rule against the current directions.',
    source: 'RBI: Revised Regulatory Framework for NBFC, 10 Nov 2014', url: 'https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=9327',
  },
  {
    era: '2018–19', title: 'Growth exposed funding and category gaps',
    headline: 'A bigger sector needed a clearer map.',
    story: 'The IL&FS defaults in 2018 shook market confidence in NBFC funding. In 2019, RBI harmonised asset finance, loan and investment companies into NBFC-ICC; registration and regulation of housing finance companies also moved to RBI.',
    meaning: 'An NBFC’s type, assets and funding model affect which specialist direction and liquidity obligations need review.',
    source: 'RBI: Harmonisation of NBFC categories, 22 Feb 2019', url: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11483',
    extraSource: 'RBI publication on 2019 HFC transfer', extraUrl: 'https://rbi.org.in/scripts/PublicationsView.aspx?Id=18086',
  },
  {
    era: '2021–22', title: 'Scale-Based Regulation arrived',
    headline: 'One sector; different degrees of oversight.',
    story: 'RBI announced Scale-Based Regulation in October 2021. The framework took effect in October 2022 and organised NBFCs into Base, Middle, Upper and Top Layers using size, activity and risk considerations.',
    meaning: 'A layer is an applicability test, not a substitute for reading the NBFC category, deposit status and subject-specific rule.',
    source: 'RBI: Scale Based Regulation framework, 22 Oct 2021', url: 'https://www.rbi.org.in/Scripts/BS_CircularIndexDisplay.aspx?Id=12179',
  },
  {
    era: '2022 onward', title: 'Digital journeys, real-world responsibility',
    headline: 'A loan through an app is still a regulated loan.',
    story: 'RBI’s 2022 digital-lending guidelines addressed borrower disclosures, money flows, data and outsourced lending service providers. Using an app or a partner does not remove the regulated lender’s responsibility.',
    meaning: 'New products add overlays. Check the underlying lending rule and the digital-lending rule together when the activity triggers both.',
    source: 'RBI: Guidelines on Digital Lending, 2 Sep 2022', url: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12382',
  },
];

export function HistoryPanel({ onBegin, onBrowse }: { onBegin: () => void; onBrowse: () => void }) {
  const [active, setActive] = useState(0);
  const chapter = chapters[active];

  return <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm" aria-labelledby="history-heading">
    <div className="bg-[#07182b] px-5 py-8 text-white sm:px-8 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-[.16em] text-cyan-200">A beginning · a turning point · where we are</p>
      <h3 id="history-heading" className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">Evolution of NBFCs</h3>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">Why does the current rulebook ask so many questions about registration, category, funding, activity and layer? Follow the changes that brought us here.</p>
    </div>
    <div className="grid lg:grid-cols-[290px_minmax(0,1fr)]">
      <nav aria-label="NBFC history chapters" className="border-b border-border bg-secondary/35 p-4 lg:border-b-0 lg:border-r sm:p-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">Choose a chapter</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">{chapters.map((item, index) => <button type="button" key={item.era} onClick={() => setActive(index)} aria-current={active === index ? 'step' : undefined} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${active === index ? 'border-primary bg-background shadow-sm' : 'border-transparent hover:border-border hover:bg-background/80'}`}><span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${active === index ? 'bg-primary text-primary-foreground' : 'bg-background text-primary'}`}>{index + 1}</span><span><span className="block text-xs font-semibold text-primary">{item.era}</span><span className="mt-0.5 block text-sm font-medium leading-5">{item.title}</span></span></button>)}</div>
      </nav>
      <div className="p-5 sm:p-8 lg:p-10" aria-live="polite">
        <div className="flex items-center gap-3"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Chapter {active + 1} of {chapters.length}</span><span className="text-sm font-semibold text-muted-foreground">{chapter.era}</span></div>
        <h4 className="mt-6 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">{chapter.headline}</h4>
        <div className="mt-6 grid gap-4 xl:grid-cols-2"><div className="rounded-2xl border border-border p-5"><p className="text-xs font-semibold uppercase tracking-[.1em] text-muted-foreground">What happened</p><p className="mt-3 text-[15px] leading-7">{chapter.story}</p></div><div className="rounded-2xl border border-blue-200 bg-blue-50 p-5"><p className="text-xs font-semibold uppercase tracking-[.1em] text-blue-800">Why it matters today</p><p className="mt-3 text-[15px] leading-7 text-blue-950">{chapter.meaning}</p></div></div>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm"><a className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline" href={chapter.url} target="_blank" rel="noopener noreferrer">Read the RBI source<ArrowUpRight className="size-4" /></a>{chapter.extraUrl && <a className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline" href={chapter.extraUrl} target="_blank" rel="noopener noreferrer">HFC context<ArrowUpRight className="size-4" /></a>}</div><p className="mt-1 text-xs leading-5 text-muted-foreground">{chapter.source}{chapter.extraSource ? ` · ${chapter.extraSource}` : ''}</p>
        <div className="mt-8 flex items-center justify-between border-t border-border pt-5"><span className="text-xs text-muted-foreground">Historical context, not a statement of today’s full legal position.</span><Button variant="outline" size="sm" onClick={() => setActive((current) => (current + 1) % chapters.length)}>Next chapter<ArrowRight className="size-4" /></Button></div>
      </div>
    </div>
    <div className="border-t border-border bg-[#eef6fc] p-5 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[.12em] text-primary">The end is your starting point</p><h4 className="mt-2 text-xl font-semibold">Use the story to read a rule correctly.</h4><p className="mt-2 max-w-4xl text-sm leading-6 text-foreground/80">First establish whether the company is an NBFC and its category. Then identify its layer, deposit and public-funds position, customer interface and activity. Finally open the current direction, check the clause and record why it does—or does not—apply.</p><div className="mt-5 flex flex-wrap gap-2"><Button onClick={onBegin}><GraduationCap className="size-4" />Start with “What is an NBFC?”</Button><Button variant="outline" onClick={onBrowse}><BookOpen className="size-4" />Browse today’s regulations</Button></div></div>
  </section>;
}
