import { useEffect, useRef, useState } from "react";
import { ArrowIcon, FlipText, Footer, Header, ROUTES, clamp01, cn, easeOut, reducedMotion, useReveal, useScrollFrame, viewport } from "@/components/site/shared";

/* ===============================================================
   Ravid Nahum — Studio
   Built from the logo's language: squares, frames and straight lines
   (arches belong to the projects only).
   Two options for presenting the team, one after the other:
   A · a puzzle that assembles itself   B · seated around the table
   =============================================================== */

const STATS = [
  { value: 2004, label: "שנת הקמה", suffix: "" },
  { value: 120, label: "בתים וחללים", suffix: "+" },
  { value: 6, label: "אנשים בסטודיו", suffix: "" },
  { value: 1, label: "שולחן אחד", suffix: "" },
];

type Person = { key: string; name: string; role: string; img: string; partner?: boolean };
const DAFNA: Person = { key: "dafna", name: "דפנה רביד", role: "אדריכלית, שותפה מייסדת", img: "/assets/studio-dafna.webp", partner: true };
const OMER: Person = { key: "omer", name: "עומר נחום", role: "מעצב פנים, שותף", img: "/assets/studio-omer.webp", partner: true };
const NOA: Person = { key: "noa", name: "נועה לוי", role: "אדריכלית", img: "/assets/team-noa_levi.webp" };
const YOAV: Person = { key: "yoav", name: "יואב כהן", role: "מעצב פנים", img: "/assets/team-yoav_cohen.webp" };
const MAYA: Person = { key: "maya", name: "מאיה ברק", role: "הדמיות ותכנון", img: "/assets/team-maya_barak.webp" };
const RON: Person = { key: "ron", name: "רון אלון", role: "ניהול פרויקטים ופיקוח", img: "/assets/team-ron_alon.webp" };

const PARTNER_TEXT: Record<string, { since: string; text: string }> = {
  dafna: { since: "2004", text: "יסדה את המשרד ומתכננת כל בית מבחוץ פנימה: מהמגרש, דרך הקירות, ועד החלון." },
  omer: { since: "2016", text: "מעצב כל בית מבפנים החוצה: מהחומרים, דרך התאורה, ועד הידית." },
};

const PRINCIPLES = [
  { n: "01", title: "מבחוץ פנימה", text: "מתחילים במגרש, באור ובכיווני הרוח. הבית נבנה סביב מה שכבר שם." },
  { n: "02", title: "שולחן אחד", text: "אדריכלות ועיצוב פנים מתוכננים יחד, מהיום הראשון ועד מסירת המפתח." },
  { n: "03", title: "קו אחד", text: "שפה אחת של חומרים, פרופורציות ופרטים, מהחזית ועד המטבח." },
];

/* a number that counts up once it scrolls into view */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(reducedMotion() ? to : 0);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const from = to > 1000 ? to - 40 : 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1600;
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        setN(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref} className="font-['Num']" dir="ltr">{n}{suffix}</span>;
}

/* a photo inside a square frame offset like the logo mark */
function FramedPhoto({ p, className }: { p: Person; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <span aria-hidden="true" className="absolute inset-0 translate-x-[-10px] translate-y-[10px] border border-current opacity-60" />
      <img src={p.img} alt={`${p.name}, ${p.role}`} loading="lazy" className="relative block aspect-[4/5] w-full object-cover object-top" />
    </div>
  );
}

/* ---------- option A: a puzzle of square tiles that slide into place as you scroll ---------- */
const PUZZLE: { p: Person; area: string; from: [number, number] }[] = [
  { p: DAFNA, area: "lg:col-[1/3] lg:row-[1/3]", from: [-40, -20] },
  { p: NOA, area: "lg:col-[3/4] lg:row-[1/2]", from: [30, -60] },
  { p: YOAV, area: "lg:col-[4/5] lg:row-[1/2]", from: [70, -30] },
  { p: OMER, area: "lg:col-[3/5] lg:row-[2/4]", from: [40, 30] },
  { p: MAYA, area: "lg:col-[1/2] lg:row-[3/4]", from: [-70, 40] },
  { p: RON, area: "lg:col-[2/3] lg:row-[3/4]", from: [-20, 70] },
];

function TeamPuzzle() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollFrame(() => {
    const el = ref.current;
    if (!el) return;
    const tiles = Array.from(el.children) as HTMLElement[];
    const { h } = viewport();
    const r = el.getBoundingClientRect();
    const p = reducedMotion() ? 1 : easeOut(clamp01((h - r.top) / (h * 0.85)));
    tiles.forEach((t, i) => {
      const [dx, dy] = PUZZLE[i].from;
      t.style.transform = `translate3d(${dx * (1 - p)}%, ${dy * (1 - p)}%, 0)`;
      t.style.opacity = String(0.2 + 0.8 * p);
    });
  });
  return (
    <div ref={ref} className="grid grid-cols-2 gap-[6px] lg:aspect-[4/3] lg:grid-cols-4 lg:grid-rows-3">
      {PUZZLE.map(({ p, area }) => (
        <figure key={p.key} className={cn("rn-tile group relative overflow-hidden bg-petrol will-change-transform", p.partner ? "col-span-2 aspect-square lg:col-span-1 lg:aspect-auto" : "aspect-[4/5] lg:aspect-auto", area)}>
          <img src={p.img} alt={`${p.name}, ${p.role}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[1.4s] [transition-timing-function:var(--ease)] group-hover:scale-[1.04]" />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-petrol/80 to-transparent p-4 pt-12 text-stone lg:p-5">
            <span className={cn("block font-normal", p.partner ? "t-3" : "t-4")}>{p.name}</span>
            <span className="t-4 block opacity-80">{p.role}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ---------- option B: seated around the table, partners at the heads ---------- */
function Seat({ p, side }: { p: Person; side: "top" | "bottom" | "start" | "end" }) {
  return (
    <figure className={cn("flex flex-col items-center text-center", side === "top" && "justify-end", side === "bottom" && "justify-start")}>
      <div className="relative w-full max-w-[200px]">
        <span aria-hidden="true" className="absolute inset-0 translate-x-[-6px] translate-y-[6px] border border-petrol/50" />
        <img src={p.img} alt={`${p.name}, ${p.role}`} loading="lazy" className="relative block aspect-square w-full object-cover object-top" />
      </div>
      <figcaption className="mt-3">
        <span className={cn("block font-normal", p.partner ? "t-3" : "t-4")}>{p.name}</span>
        <span className="t-4 block text-petrol/65">{p.role}</span>
      </figcaption>
    </figure>
  );
}

function TeamTable() {
  return (
    <div data-reveal className="rn-table grid grid-cols-4 items-center gap-x-[3vw] gap-y-6 lg:gap-x-[40px] lg:gap-y-[28px]">
      <span />
      <Seat p={NOA} side="top" />
      <Seat p={YOAV} side="top" />
      <span />
      <Seat p={DAFNA} side="start" />
      {/* the table: drawn as one line when it comes into view */}
      <div className="col-span-2 flex aspect-[2.2/1] items-center justify-center">
        <svg viewBox="0 0 440 200" className="h-full w-full overflow-visible" aria-hidden="true">
          <rect x="2" y="2" width="436" height="196" fill="none" stroke="#042a2b" strokeWidth="2" pathLength={1} className="rn-table-line" />
          <line x1="220" y1="2" x2="220" y2="198" stroke="#a56332" strokeWidth="1.5" pathLength={1} className="rn-table-line rn-table-line-2" />
        </svg>
      </div>
      <Seat p={OMER} side="end" />
      <span />
      <Seat p={MAYA} side="bottom" />
      <Seat p={RON} side="bottom" />
      <span />
    </div>
  );
}

export default function StudioPage() {
  useReveal();
  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-stone font-arfilit text-petrol">
      <Header active="studio" />
      <main id="main">
        {/* manifesto: the headline carries the line, like the home page */}
        <section className="mx-auto px-[6vw] pb-[clamp(56px,9vw,120px)] pt-[clamp(48px,9vw,120px)] lg:w-[1325px] lg:px-[99px]">
          <h1 data-reveal="flip" className="t-1 font-light">
            <span className="flex items-center gap-[3vw] lg:gap-[40px]">
              <FlipText text="שני קצוות," className="block whitespace-nowrap" />
              <span data-reveal="rule" aria-hidden="true" className="mt-[.12em] block h-[2px] flex-1 bg-petrol lg:h-[3px]" style={{ ["--d" as string]: "500ms" }} />
            </span>
            <FlipText text="שולחן אחד" delay={160} className="block" />
          </h1>
          <div className="mt-10 grid gap-6 border-t border-petrol/20 pt-8 sm:grid-cols-2 sm:gap-[5vw] lg:mt-14 lg:gap-[80px] lg:pt-10">
            <p data-reveal className="t-3 font-light text-petrol/85">
              רביד נחום הוא משרד אדריכלות ועיצוב פנים שנוסד ב־<span className="font-['Num']">2004</span>. אנחנו מתכננים כל בית מבחוץ פנימה ומבפנים החוצה, באותו חדר ובאותה שפה.
            </p>
            <p data-reveal style={{ ["--d" as string]: "120ms" }} className="t-3 font-light text-petrol/85">
              המשרד קטן בכוונה. כל פרויקט עובר דרך שני השותפים, וכל החלטה, מגובה התקרה ועד גוון האבן, נבחנת מול הבית כולו.
            </p>
          </div>
        </section>

        {/* numbers */}
        <section aria-label="הסטודיו במספרים" className="border-y-[3px] border-petrol">
          <ul className="mx-auto grid grid-cols-2 lg:w-[1325px] lg:grid-cols-4">
            {STATS.map((s, i) => (
              <li key={s.label} className={cn("flex flex-col items-center gap-2 py-[clamp(28px,5vw,56px)] text-center", i % 2 === 0 && "border-l border-petrol/20", i < 2 && "border-b border-petrol/20 lg:border-b-0", i === 1 && "lg:border-l")}>
                <span className="t-1 font-light leading-none text-terra"><CountUp to={s.value} suffix={s.suffix} /></span>
                <span className="t-4 text-petrol/75">{s.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* partners: two equal framed portraits */}
        <section aria-labelledby="partners-h" className="mt-[clamp(64px,10vw,140px)] bg-terra py-[clamp(56px,8vw,110px)] text-stone">
          <div className="mx-auto px-[6vw] lg:w-[1325px] lg:px-[99px]">
            <h2 id="partners-h" data-reveal="flip" className="t-2 font-light"><FlipText text="השותפים" /></h2>
            <div className="mt-10 grid gap-14 sm:grid-cols-2 sm:gap-[6vw] lg:mt-14 lg:gap-[90px]">
              {[DAFNA, OMER].map((p, i) => (
                <article key={p.key} data-reveal style={{ ["--d" as string]: `${i * 140}ms` }}>
                  <FramedPhoto p={p} className="text-stone" />
                  <p className="t-4 mt-8 text-stone/70">מאז <span className="font-['Num']">{PARTNER_TEXT[p.key].since}</span></p>
                  <h3 className="t-2 mt-1 whitespace-nowrap font-semibold">{p.name}</h3>
                  <p className="t-3s font-light">{p.role}</p>
                  <p className="t-4 mt-4 text-stone/85">{PARTNER_TEXT[p.key].text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* how we work: one even grid, three equal columns between two lines */}
        <section aria-labelledby="how-h" className="mx-auto px-[6vw] py-[clamp(64px,10vw,140px)] lg:w-[1325px] lg:px-[99px]">
          <h2 id="how-h" data-reveal="flip" className="t-2 font-light"><FlipText text="איך אנחנו עובדים" /></h2>
          <ol className="mt-10 grid border-y-[3px] border-petrol lg:mt-14 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <li key={p.n} data-reveal style={{ ["--d" as string]: `${i * 120}ms` }} className={cn("px-0 py-8 lg:px-[40px] lg:py-[44px]", i > 0 && "border-t border-petrol/20 lg:border-r lg:border-t-0")}>
                <p className="t-4 font-['Num'] text-terra" dir="ltr" style={{ textAlign: "right" }}>{p.n}</p>
                <h3 className="t-2 mt-2 font-light">{p.title}</h3>
                <p className="t-4 mt-3 text-petrol/75">{p.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* team, option A */}
        <section aria-labelledby="team-a" className="bg-petrol py-[clamp(64px,10vw,140px)] text-stone">
          <div className="mx-auto px-[6vw] lg:w-[1325px] lg:px-[99px]">
            <p className="t-4 text-stone/60">אפשרות א׳ · פאזל</p>
            <h2 id="team-a" data-reveal="flip" className="t-2 mt-2 font-light"><FlipText text="הצוות" /></h2>
            <div className="mt-10 lg:mt-14"><TeamPuzzle /></div>
          </div>
        </section>

        {/* team, option B */}
        <section aria-labelledby="team-b" className="mx-auto px-[6vw] py-[clamp(64px,10vw,140px)] lg:w-[1325px] lg:px-[99px]">
          <p className="t-4 text-petrol/60">אפשרות ב׳ · סביב השולחן</p>
          <h2 id="team-b" data-reveal="flip" className="t-2 mt-2 font-light"><FlipText text="הצוות" /></h2>
          <div className="mt-10 lg:mt-14"><TeamTable /></div>
        </section>

        {/* call to action */}
        <section className="bg-petrol py-[clamp(64px,10vw,130px)] text-center text-stone">
          <p data-reveal className="t-2 mx-auto max-w-[760px] px-[6vw] font-light">רוצים לשבת איתנו ליד השולחן?</p>
          <a href={ROUTES.contact} className="group t-3 mt-8 inline-flex items-center gap-3 border border-stone px-8 py-3 transition-colors hover:bg-stone hover:text-petrol">
            בואו נתחיל מקו אחד
            <ArrowIcon className="h-[1em] w-[1em] -rotate-45 transition-transform duration-500 group-hover:-translate-x-1 group-hover:translate-y-1" />
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
