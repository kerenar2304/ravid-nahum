import { useEffect, useRef, useState } from "react";
import { ArrowIcon, FlipText, Footer, Header, ROUTES, cn, reducedMotion, useReveal } from "@/components/site/shared";

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

/* ---------- the team inside a facade. Every window is the same opening on one line:
   a plaster wall, a deep reveal (lintel, jambs), a stone sill, a dim room behind.
   The figure images share one frame: `sill` is where the sill line falls in the image. ---------- */
type Win = { p: Person; img: string; scale: number; sill: number; x: number; seated: boolean };
const WINDOWS: Win[] = [
  { p: NOA, img: "/assets/team-win-noa.webp", scale: 0.85, sill: 0.91, x: 10, seated: false },
  { p: YOAV, img: "/assets/team-win-yoav.webp", scale: 1.3, sill: 0.51, x: -15, seated: true },
  { p: MAYA, img: "/assets/team-win-maya.webp", scale: 1.1, sill: 0.52, x: -5, seated: true },
  { p: RON, img: "/assets/team-win-ron.webp", scale: 0.85, sill: 0.89, x: 5, seated: false },
];

const PARTNER_IMG: Record<string, string> = { dafna: "/assets/team-win-dafna.webp", omer: "/assets/team-win-omer.webp" };

/* a partner: same window, terracotta room, the text beside it on the outer side */
function PartnerWindow({ p, side }: { p: Person; side: "start" | "end" }) {
  const t = PARTNER_TEXT[p.key];
  return (
    <div data-reveal className={cn("rn-window flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-[3vw] lg:gap-[32px]", side === "end" && "sm:flex-row-reverse")}>
      <div className={cn("min-w-0 text-stone sm:flex-1 sm:pb-[6%]", side === "end" ? "sm:text-left" : "sm:text-right")}>
        <p className="t-3 whitespace-nowrap font-semibold">{p.name}</p>
        <p className="t-4 text-stone/75">{p.role}</p>
        <p className="t-4 text-stone/60">מאז <span className="font-['Num']">{t.since}</span></p>
        <p className="t-4 mt-3 max-w-[260px] text-stone/85 sm:inline-block">{t.text}</p>
      </div>
      <div className="rn-opening relative aspect-[3/4] w-full sm:w-[40%] sm:flex-none">
        <span aria-hidden="true" className="rn-room rn-room-terra absolute inset-0" />
        <span aria-hidden="true" className="rn-face rn-face-top rn-face-terra absolute inset-0" />
        <span aria-hidden="true" className="rn-face rn-face-start rn-face-terra absolute inset-0" />
        <span aria-hidden="true" className="rn-face rn-face-end rn-face-terra absolute inset-0" />
        <div className="absolute inset-0 z-[2]" style={{ clipPath: "inset(0)" }}>
          <img src={PARTNER_IMG[p.key]} alt={`${p.name}, ${p.role}`} loading="lazy" className="rn-window-figure absolute max-w-none select-none" style={{ width: "100%", left: "0%", top: `${(1 - 0.92) * 100}%` }} />
          <span aria-hidden="true" className="rn-lintel-shade pointer-events-none absolute inset-x-0 top-0 h-[22%] opacity-60" />
        </div>
        <span aria-hidden="true" className="rn-sill absolute -inset-x-[7%] top-full z-[1]" />
      </div>
    </div>
  );
}

function TeamFacade() {
  return (
    <>
    <ul className="grid grid-cols-2 gap-x-[7vw] gap-y-[clamp(40px,8vw,64px)] lg:grid-cols-4 lg:gap-x-[64px]">

      {WINDOWS.map((w, i) => (
        <li key={w.p.key} data-reveal style={{ ["--d" as string]: `${i * 140}ms` }} className="rn-window pb-[88%]">
          <div className="mb-5 text-stone">
            <p className="t-3 font-normal">{w.p.name}</p>
            <p className="t-4 text-stone/70">{w.p.role}</p>
          </div>
          <div className="rn-opening relative aspect-[3/4]">
            <span aria-hidden="true" className="rn-room absolute inset-0" />
            <span aria-hidden="true" className="rn-face rn-face-top absolute inset-0" />
            <span aria-hidden="true" className="rn-face rn-face-start absolute inset-0" />
            <span aria-hidden="true" className="rn-face rn-face-end absolute inset-0" />
            {/* figure: cut by the opening above the sill, legs may hang down over the wall */}
            <div className="absolute inset-0 z-[2]" style={{ clipPath: w.seated ? "inset(0 0 -200% 0)" : "inset(0)" }}>
              <img
                src={w.img}
                alt={`${w.p.name}, ${w.p.role}`}
                loading="lazy"
                className="rn-window-figure absolute max-w-none select-none"
                style={{ width: `${w.scale * 100}%`, left: `${w.x}%`, top: `${(1 - w.sill * w.scale) * 100}%` }}
              />
              <span aria-hidden="true" className="rn-lintel-shade pointer-events-none absolute inset-x-0 top-0 h-[26%]" />
            </div>
            {/* stone sill: top, front face, cast shadow on the wall */}
            <span aria-hidden="true" className="rn-sill absolute -inset-x-[7%] top-full z-[1]" />
          </div>
        </li>
      ))}
    </ul>
    </>
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

        {/* team: a facade of windows */}
        {/* partners: their own terracotta wall */}
        <section aria-labelledby="partners-h" className="rn-wall-terra pb-[clamp(90px,12vw,150px)] pt-[clamp(64px,10vw,130px)] text-stone">
          <div className="mx-auto px-[6vw] lg:w-[1325px] lg:px-[99px]">
            <h2 id="partners-h" data-reveal="flip" className="t-2 text-center font-light"><FlipText text="השותפים" /></h2>
            <div className="mx-auto mt-12 grid max-w-[1000px] gap-14 sm:grid-cols-2 sm:gap-[8vw] lg:mt-16 lg:gap-[100px]">
              <PartnerWindow p={DAFNA} side="start" />
              <PartnerWindow p={OMER} side="end" />
            </div>
          </div>
        </section>

        <section aria-labelledby="team-h" className="rn-wall pb-[clamp(90px,14vw,180px)] pt-[clamp(64px,10vw,140px)] text-stone">
          <div className="mx-auto px-[6vw] lg:w-[1325px] lg:px-[99px]">
            <h2 id="team-h" data-reveal="flip" className="t-2 text-center font-light"><FlipText text="הצוות" /></h2>
            <p data-reveal className="t-4 mx-auto mt-3 max-w-[460px] text-center text-stone/70">ארבעה אנשים שמחזיקים איתנו את הקו. כל אחד בחלון שלו, כולם באותו בניין.</p>
            <div className="mt-12 lg:mt-16"><TeamFacade /></div>
          </div>
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
