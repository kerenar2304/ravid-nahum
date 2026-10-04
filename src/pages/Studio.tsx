import { useEffect, useRef, useState } from "react";
import { ArrowIcon, FlipText, Footer, Header, ROUTES, cn, reducedMotion, useReveal } from "@/components/site/shared";

/* ===============================================================
   Ravid Nahum — Studio
   Manifesto, numbers that count up, the two partners in arched
   windows, how we work, and the team (initials until photos arrive).
   =============================================================== */

const STATS = [
  { value: 2004, label: "שנת הקמה", suffix: "" },
  { value: 120, label: "בתים וחללים", suffix: "+" },
  { value: 6, label: "אנשים בסטודיו", suffix: "" },
  { value: 1, label: "שולחן אחד", suffix: "" },
];

const PARTNERS = [
  {
    name: "דפנה רביד",
    role: "אדריכלית, שותפה מייסדת",
    since: "2004",
    img: "/assets/studio-dafna.webp",
    text: "יסדה את המשרד ומתכננת כל בית מבחוץ פנימה: מהמגרש, דרך הקירות, ועד החלון. מאמינה שאור טוב הוא חומר בנייה.",
  },
  {
    name: "עומר נחום",
    role: "מעצב פנים, שותף",
    since: "2016",
    img: "/assets/studio-omer.webp",
    text: "מעצב כל בית מבפנים החוצה: מהחומרים, דרך התאורה, ועד הידית. אוסף דוגמיות אבן כמו שאחרים אוספים תקליטים.",
  },
];

const PRINCIPLES = [
  { n: "01", title: "מבחוץ פנימה", text: "מתחילים במגרש, באור ובכיווני הרוח. הבית נבנה סביב מה שכבר שם." },
  { n: "02", title: "שולחן אחד", text: "אדריכלות ועיצוב פנים מתוכננים יחד, מהיום הראשון ועד מסירת המפתח." },
  { n: "03", title: "קו אחד", text: "שפה אחת של חומרים, פרופורציות ופרטים, מהחזית ועד המטבח." },
];

/* placeholder team: names and roles to be replaced with the real ones */
const TEAM = [
  { name: "נועה לוי", role: "אדריכלית", initials: "נ.ל" },
  { name: "יואב כהן", role: "מעצב פנים", initials: "י.כ" },
  { name: "מאיה ברק", role: "הדמיות ותכנון", initials: "מ.ב" },
  { name: "רון אלון", role: "ניהול פרויקטים ופיקוח", initials: "ר.א" },
];

/* a number that counts up once it scrolls into view */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(reducedMotion() ? to : 0);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const from = to > 1000 ? to - 40 : 0; // years count the last stretch only
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1600;
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(from + (to - from) * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref} className="font-['Num']" dir="ltr">{n}{suffix}</span>;
}

export default function StudioPage() {
  useReveal();
  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-stone font-arfilit text-petrol">
      <Header active="studio" />
      <main id="main">
        {/* manifesto */}
        <section className="mx-auto px-[6vw] pb-[clamp(56px,9vw,120px)] pt-[clamp(48px,9vw,120px)] lg:w-[1325px] lg:px-[99px]">
          <p data-reveal className="t-4 tracking-[.25em] text-terra">הסטודיו</p>
          <h1 data-reveal="flip" className="t-1 mt-4 font-light">
            <FlipText text="שני קצוות," className="block" />
            <FlipText text="שולחן אחד" delay={160} className="block" />
          </h1>
          <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-[90px]">
            <p data-reveal className="t-3 font-light text-petrol/85">
              רביד נחום הוא משרד אדריכלות ועיצוב פנים שנוסד ב־<span className="font-['Num']">2004</span>. אנחנו מתכננים כל בית מבחוץ פנימה ומבפנים החוצה, באותו חדר ובאותה שפה, כך שאין פער בין התוכנית לבין החיים שבתוכה.
            </p>
            <p data-reveal style={{ ["--d" as string]: "120ms" }} className="t-4 text-petrol/70">
              המשרד קטן בכוונה. כל פרויקט עובר דרך שני השותפים, וכל החלטה, מגובה התקרה ועד גוון האבן, נבחנת מול הבית כולו. אנחנו עובדים עם משפחות, יזמים וחברות שמחפשים בית אחד שלם, לא אוסף של פתרונות.
            </p>
          </div>
        </section>

        {/* numbers */}
        <section aria-label="הסטודיו במספרים" className="border-y-[3px] border-petrol/90">
          <ul className="mx-auto grid grid-cols-2 lg:w-[1325px] lg:grid-cols-4">
            {STATS.map((s, i) => (
              <li key={s.label} className={cn("flex flex-col items-center gap-2 py-[clamp(28px,5vw,56px)] text-center", i % 2 === 0 && "border-l border-petrol/20", i < 2 && "border-b border-petrol/20 lg:border-b-0", i === 1 && "lg:border-l")}>
                <span className="t-1 font-light leading-none text-terra"><CountUp to={s.value} suffix={s.suffix} /></span>
                <span className="t-4 text-petrol/75">{s.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* partners */}
        <section aria-labelledby="partners-h" className="mt-[clamp(64px,10vw,140px)] bg-terra pb-[clamp(64px,10vw,140px)] pt-[clamp(56px,8vw,110px)] text-stone">
          <div className="mx-auto px-[6vw] lg:w-[1325px] lg:px-[99px]">
            <h2 id="partners-h" data-reveal="flip" className="t-2 font-light">
              <FlipText text="השותפים" />
            </h2>
            <div className="mt-10 grid gap-14 sm:grid-cols-2 sm:gap-[5vw] lg:mt-14 lg:gap-[80px]">
              {PARTNERS.map((p, i) => (
                <article key={p.name} className={cn(i === 1 && "sm:mt-[18%]")}>
                  <div data-reveal="unveil" style={{ ["--d" as string]: `${i * 140}ms` }} className="relative aspect-[4/5] w-full">
                    <span className="rn-clip absolute inset-0 block overflow-hidden rounded-t-full">
                      <img src={p.img} alt={`${p.name}, ${p.role}`} loading="lazy" className="rn-front rn-studio-photo absolute inset-0 h-full w-full object-cover object-top" />
                    </span>
                  </div>
                  <div data-reveal className="mt-6">
                    <p className="t-4 text-stone/70">מאז <span className="font-['Num']">{p.since}</span></p>
                    <h3 className="t-2 mt-1 whitespace-nowrap font-semibold">{p.name}</h3>
                    <p className="t-3s font-light">{p.role}</p>
                    <p className="t-4 mt-4 max-w-[460px] text-stone/85">{p.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* how we work */}
        <section aria-labelledby="how-h" className="mx-auto px-[6vw] py-[clamp(64px,10vw,140px)] lg:w-[1325px] lg:px-[99px]">
          <h2 id="how-h" data-reveal="flip" className="t-2 font-light">
            <FlipText text="איך אנחנו עובדים" />
          </h2>
          <ol className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-3 lg:gap-[56px]">
            {PRINCIPLES.map((p, i) => (
              <li key={p.n} data-reveal style={{ ["--d" as string]: `${i * 120}ms` }}>
                <span data-reveal="rule" aria-hidden="true" className="block h-[3px] w-full bg-petrol" style={{ ["--d" as string]: `${i * 120}ms` }} />
                <p className="t-4 mt-5 font-['Num'] text-terra" dir="ltr" style={{ textAlign: "right" }}>{p.n}</p>
                <h3 className="t-2 mt-1 font-light">{p.title}</h3>
                <p className="t-4 mt-3 max-w-[340px] text-petrol/75">{p.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* team */}
        <section aria-labelledby="team-h" className="mx-auto px-[6vw] pb-[clamp(64px,10vw,140px)] lg:w-[1325px] lg:px-[99px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="team-h" data-reveal="flip" className="t-2 font-light">
              <FlipText text="הצוות" />
            </h2>
            <p data-reveal className="t-4 max-w-[420px] text-petrol/70">ארבעה אנשים שמחזיקים את הקו יחד איתנו, מהסקיצה ועד האתר.</p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-[3vw] lg:mt-14 lg:grid-cols-4 lg:gap-x-[32px]">
            {TEAM.map((m, i) => (
              <li key={m.name} data-reveal style={{ ["--d" as string]: `${i * 100}ms` }} className="rn-member group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-full bg-terra">
                  <span aria-hidden="true" className="rn-member-initials absolute inset-0 flex items-center justify-center font-light text-stone">{m.initials}</span>
                </div>
                <h3 className="t-3 mt-4 font-normal">{m.name}</h3>
                <p className="t-4 text-petrol/70">{m.role}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* call to action */}
        <section className="bg-petrol py-[clamp(64px,10vw,130px)] text-center text-stone">
          <p data-reveal className="t-2 mx-auto max-w-[760px] px-[6vw] font-light">רוצים לשבת איתנו ליד השולחן?</p>
          <a href={ROUTES.contact} className="group t-3 mt-8 inline-flex items-center gap-3 rounded-full border border-stone px-8 py-3 transition-colors hover:bg-stone hover:text-petrol">
            בואו נתחיל מקו אחד
            <ArrowIcon className="h-[1em] w-[1em] -rotate-45 transition-transform duration-500 group-hover:-translate-x-1 group-hover:translate-y-1" />
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
