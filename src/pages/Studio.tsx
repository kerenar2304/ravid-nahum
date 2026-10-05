import { useEffect, useRef, useState } from "react";
import { FlipText, Footer, Header, cn, reducedMotion, useReveal } from "@/components/site/shared";
import { Contact } from "@/components/site/contact";

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
        {/* title */}
        <section className="px-[6vw] pb-[clamp(40px,6vw,80px)] pt-[clamp(48px,8vw,110px)] text-center">
          <h1 data-reveal="flip" className="t-1 font-light">
            <FlipText text="הסטודיו שלנו" />
          </h1>
        </section>

        {/* numbers — the last one is the wink */}
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

        {/* who we are, then the partners standing on the line where the team's wall begins */}
        <section aria-label="על הסטודיו" className="mx-auto px-[6vw] pt-[clamp(48px,8vw,110px)] lg:w-[1325px] lg:px-[99px]">
          <p data-reveal className="t-4 mx-auto max-w-[620px] text-center text-petrol/85">
            רביד נחום הוא משרד אדריכלות ועיצוב פנים שנוסד ב־<span className="font-['Num']">2004</span>. אנחנו מתכננים כל בית מבחוץ פנימה ומבפנים החוצה, באותו חדר ובאותה שפה. המשרד קטן בכוונה: כל פרויקט עובר דרך שני השותפים, וכל החלטה, מגובה התקרה ועד גוון האבן, נבחנת מול הבית כולו.
          </p>
          <div className="relative mt-[clamp(32px,5vw,64px)] grid grid-cols-[1fr_auto_1fr] items-end gap-[3vw]">
            <div data-reveal className="justify-self-end pb-[clamp(24px,4vw,56px)] text-right">
              <p className="t-3 font-semibold">דפנה רביד</p>
              <p className="t-4 font-light">אדריכלית, שותפה מייסדת</p>
            </div>
            <div data-reveal className="w-[clamp(220px,40vw,460px)]"><img src="/assets/partners.webp" alt="דפנה רביד ועומר נחום, השותפים במשרד" loading="lazy" className="block w-full -scale-x-100" /></div>
            <div data-reveal style={{ ["--d" as string]: "120ms" }} className="justify-self-start pb-[clamp(24px,4vw,56px)] text-right">
              <p className="t-3 font-semibold">עומר נחום</p>
              <p className="t-4 font-light">מעצב פנים, שותף</p>
            </div>
          </div>
        </section>

        {/* team: a facade of windows */}
        <section aria-labelledby="team-h" className="rn-wall pb-[clamp(72px,10vw,130px)] pt-[clamp(56px,8vw,110px)] text-stone">
          <div className="mx-auto px-[6vw] lg:w-[1325px] lg:px-[99px]">
            <h2 id="team-h" data-reveal="flip" className="t-1 text-center font-light"><FlipText text="הצוות" /></h2>
            <div className="mt-[clamp(32px,5vw,64px)]"><TeamFacade /></div>
          </div>
        </section>

        {/* contact: a plain change of surface, the light page again, with room around it */}
        <div className="pb-[clamp(40px,6vw,80px)]"><Contact /></div>
      </main>
      <Footer />
    </div>
  );
}
