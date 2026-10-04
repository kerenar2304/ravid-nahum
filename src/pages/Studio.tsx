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

/* ---------- the team inside a facade: everyone is behind the wall.
   "upper" figures stand inside and are cut off by the window frame;
   "sit" figures sit on the sill with their legs hanging out over the wall. ---------- */
type Win = { p: Person; img: string; kind: "upper" | "sit"; top: string; left: string; width: string };
const WINDOWS: Win[] = [
  { p: NOA, img: "/assets/team-cut-noa.webp", kind: "upper", top: "19%", left: "-30%", width: "160%" },
  { p: YOAV, img: "/assets/team-sit-yoav.webp", kind: "sit", top: "28%", left: "-12.5%", width: "125%" },
  { p: MAYA, img: "/assets/team-sit-maya.webp", kind: "sit", top: "34%", left: "-32%", width: "125%" },
  { p: RON, img: "/assets/team-cut-ron.webp", kind: "upper", top: "19%", left: "-30%", width: "160%" },
];

function TeamFacade() {
  return (
    <ul className="grid grid-cols-2 gap-x-[8vw] gap-y-[clamp(48px,10vw,90px)] lg:grid-cols-4 lg:gap-x-[56px]">
      {WINDOWS.map((w, i) => (
        <li key={w.p.key} data-reveal style={{ ["--d" as string]: `${i * 140}ms` }} className={cn("rn-window", i % 2 === 1 && "mt-[24%]")}>
          <div className="relative aspect-[3/4]">
            {/* the opening, and the sill under it */}
            <div className="rn-window-hole absolute inset-0" />
            <span aria-hidden="true" className="absolute -inset-x-[6%] top-full h-[7px] bg-[#164748] shadow-[0_8px_12px_rgba(0,0,0,.35)]" />
            {/* the figure: clipped by the frame on top and sides; seated legs may hang below the sill */}
            <div className="absolute inset-0" style={{ clipPath: w.kind === "upper" ? "inset(0)" : "inset(0 0 -300% 0)" }}>
              <img src={w.img} alt={`${w.p.name}, ${w.p.role}`} loading="lazy" className="rn-window-figure absolute max-w-none select-none" style={{ top: w.top, left: w.left, width: w.width }} />
              {/* shade from the lintel, so the figure sits inside the depth of the wall */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-black/45 to-transparent" />
            </div>
          </div>
          <div className={cn("text-stone", w.kind === "sit" ? "mt-[62%]" : "mt-8")}>
            <p className="t-3 font-normal">{w.p.name}</p>
            <p className="t-4 text-stone/70">{w.p.role}</p>
          </div>
        </li>
      ))}
    </ul>
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

        {/* team: a facade of windows */}
        <section aria-labelledby="team-h" className="rn-wall pb-[clamp(90px,14vw,180px)] pt-[clamp(64px,10vw,140px)] text-stone">
          <div className="mx-auto px-[6vw] lg:w-[1325px] lg:px-[99px]">
            <h2 id="team-h" data-reveal="flip" className="t-2 text-center font-light"><FlipText text="הצוות" /></h2>
            <p data-reveal className="t-4 mx-auto mt-3 max-w-[460px] text-center text-stone/70">ארבעה אנשים שמחזיקים את הקו יחד איתנו, כל אחד בחלון שלו, כולם באותו בניין.</p>
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
