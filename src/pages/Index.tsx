import { useEffect, useRef, useState, type ReactNode, type CSSProperties, type FormEvent, type MouseEvent } from "react";
import {
  ArrowIcon, CONTACT, Footer, Header, MailIcon, PhoneIcon, PinIcon, ROUTES,
  clamp01, cn, easeOut, reducedMotion, useReveal, useScrollFrame, viewport,
} from "@/components/site/shared";

/* ===============================================================
   Ravid Nahum — Home
   Desktop measurements follow the Figma frame (1325px wide).
   Every block is mobile-first; `lg:` holds the exact Figma layout.
   =============================================================== */

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as CSSProperties;
const li = (i: number) => ({ ["--i" as string]: i }) as CSSProperties;

/* ---------------------------------------------------------------- HERO */
/* Letters turn on their vertical axis like shutter slats: in on load, out on scroll */
function FlipText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const n = Array.from(text).length;
  let i = 0;
  // letters animate one by one, but each word stays unbroken so lines only wrap between words
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, w) => (
        <span key={w}>
          {w > 0 && " "}
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
            {Array.from(word).map((ch) => {
              const k = i++;
              return (
                <span key={k} className="rn-flip" style={{ animationDelay: `${delay + k * 45}ms`, ["--i" as string]: k, ["--n" as string]: n } as CSSProperties}>
                  <span>{ch}</span>
                </span>
              );
            })}
          </span>
        </span>
      ))}
    </span>
  );
}


function Hero() {
  const houseRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // gentle parallax: the house drifts slower than the page
  useScrollFrame(() => {
    const el = houseRef.current, hero = heroRef.current;
    if (!el || !hero || reducedMotion()) return;
    const r = hero.getBoundingClientRect();
    // the shutter closes again as the hero scrolls away
    titleRef.current?.style.setProperty("--shut", String(clamp01(-r.top / (r.height * 0.55))));
    if (r.bottom < 0) return;
    el.style.transform = `translate3d(0, ${Math.max(0, -r.top) * 0.14}px, 0)`;
  });

  return (
    <section ref={heroRef} id="top" className="relative mx-auto flex overflow-hidden bg-stone lg:overflow-visible lg:bg-transparent flex-col px-[6vw] pt-[clamp(40px,7vw,72px)] lg:block lg:h-[720px] lg:min-h-0 lg:w-[1325px] lg:p-0">
      {/* mobile: full-screen photo, headline over the sky */}
      {/* the photo's light backdrop melts into the page colour (darken blend), so only the house, its slab and the shadow remain */}
      <h1 ref={titleRef} className="rn-flips relative z-10 font-semibold text-petrol">
        <span className="flex flex-col-reverse items-start gap-5 sm:flex-row sm:items-center sm:gap-[3vw] lg:block">
          <FlipText text="קו אחד" className="t-1 rn-fit block leading-[1] lg:absolute lg:right-[73px] lg:top-[51px] lg:leading-[75px]" />
          <span
            data-reveal="rule"
            aria-hidden="true"
            className="block h-[2px] w-[46%] bg-petrol sm:mt-[1.4vw] sm:w-auto sm:flex-1 lg:absolute lg:left-[85px] lg:top-[117px] lg:mt-0 lg:h-[3px] lg:w-[772px] lg:flex-none"
            style={d(550)}
          />
        </span>
        <FlipText text="מהיסוד" delay={120} className="t-1 mt-1 block leading-[1.02] sm:hidden" />
        <FlipText text="עד הפנים" delay={240} className="t-1 block leading-[1.02] sm:hidden" />
        <FlipText text="מהיסוד עד הפנים" delay={120} className="t-1 rn-fit mt-2 hidden whitespace-nowrap leading-[1.02] sm:block lg:absolute lg:right-[324px] lg:top-[153px] lg:mt-0 lg:whitespace-nowrap lg:leading-[75px]" />
      </h1>

      {/* phones: the photo spans the full width right under the headline (never behind it) */}
      <img src="/assets/hero-mobile.webp" alt="" aria-hidden="true" fetchPriority="high" className="relative z-20 -mx-[6vw] mt-1 block h-auto w-[calc(100%+12vw)] max-w-none mix-blend-darken lg:hidden" />

      <div className="relative -mx-[6vw] mt-auto hidden aspect-[1325/543] lg:absolute lg:block lg:inset-x-0 lg:top-[177px] lg:mx-0 lg:mt-0 lg:aspect-auto lg:h-[543px]">
        <div ref={houseRef} className="absolute inset-0 will-change-transform">
          <img
            src="/assets/hero-house.webp"
            alt="בית אבן ים־תיכוני בתכנון המשרד, עם עצי זית וברוש"
            fetchPriority="high"
            className="rn-fade-up absolute left-[3.49%] top-[-35.82%] h-[170.17%] w-[92.98%] max-w-none select-none"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- STATEMENT */
function Pill({ src, alt, from = "right", delay, className }: { src: string; alt: string; from?: "left" | "right"; delay: number; className?: string }) {
  return (
    <span
      data-reveal="pill"
      style={d(delay)}
      className={cn("rn-pill relative block h-[clamp(26px,7.6vw,50px)] flex-1 lg:absolute lg:h-[63px] lg:flex-none", from === "left" && "pill-from-left", className)}
    >
      <span className="rn-clip absolute inset-0 block overflow-hidden rounded-[200px]">
        <img src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      </span>
    </span>
  );
}

function Statement() {
  const word = "t-1 whitespace-nowrap font-light leading-[1.15] lg:absolute lg:leading-[75px]";
  return (
    <section id="studio" aria-label="על המשרד" className="relative mx-auto -mt-4 px-[5vw] lg:mt-[230px] lg:h-[319px] lg:w-[1325px] lg:px-0">
      <h2 className="flex flex-col gap-3 text-petrol sm:gap-4 lg:block">
        <span className="flex items-center gap-3 sm:gap-6 lg:contents">
          <span data-reveal="flip" className={cn(word, "lg:right-[178px] lg:top-[1px]")}><FlipText text="אדריכלות" /></span>
          <Pill src="/assets/pill-architecture.jpg" alt="" delay={200} className="lg:left-[177px] lg:top-0 lg:w-[456px]" />
        </span>
        <span className="flex items-center gap-3 sm:gap-6 lg:contents">
          <Pill src="/assets/pill-interior.jpg" alt="" from="left" delay={320} className="lg:left-[738px] lg:top-[88px] lg:w-[416px]" />
          <span data-reveal="flip" className={cn(word, "lg:right-[627px] lg:top-[89px]")}><FlipText text="ועיצוב פנים" delay={180} /></span>
        </span>
        <span className="flex items-center gap-3 sm:gap-6 lg:contents">
          <span data-reveal="flip" className={cn(word, "lg:right-[172px] lg:top-[176px]")}><FlipText text="מאותו שולחן" delay={360} /></span>
          <Pill src="/assets/pill-table.jpg" alt="" delay={440} className="lg:left-[171px] lg:top-[176px] lg:w-[341px]" />
        </span>
      </h2>
      <p
        data-reveal
        style={d(300)}
        className="t-3 mt-8 text-center font-light leading-[1.6] text-petrol lg:absolute lg:left-[163.5px] lg:top-[276px] lg:mt-0 lg:w-[998px] lg:whitespace-nowrap lg:leading-[43px]"
      >
        כדי שכל חלל ייבנה בשפה אחת, בלי פער בין התוכנית לבין החיים שבתוכו.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------ PROJECTS */
type Project = { slug: string; name: string; meta: string; text: string; exterior: string; interior: string };

const PROJECTS: Project[] = [
  {
    slug: "moshav",
    name: "בית במושב",
    meta: "בית פרטי · השרון",
    text: "קומה אחת סביב בריכה, וכל חדר נפתח אל הגינה.",
    exterior: "/assets/project-moshav-exterior.jpg",
    interior: "/assets/project-moshav-interior.jpg",
  },
  {
    slug: "zichron",
    name: "בית אבן בזכרון יעקב",
    meta: "שימור ותוספת · זכרון יעקב",
    text: "קירות אבן מקוריים, קשתות, ותוספת פלדה וזכוכית שנפתחת לנוף.",
    exterior: "/assets/project-zichron-exterior.jpg",
    interior: "/assets/project-zichron-interior.jpg",
  },
  {
    slug: "herzliya",
    name: "פנטהאוז בהרצליה פיתוח",
    meta: "דירת גג · הרצליה פיתוח",
    text: "קומה אחרונה מול הים, עם מרפסת שמתנהגת כמו עוד חדר בבית.",
    exterior: "/assets/project-herzliya-exterior.jpg",
    interior: "/assets/project-herzliya-interior.jpg",
  },
];

/* Interior photo fills the card; a stone "poster" panel sits on it with an arched window onto the exterior. */
function ProjectCard({ p, className, delay = 0 }: { p: Project; className?: string; delay?: number }) {
  const [type, place] = p.meta.split(" · ");
  return (
    <a
      href={ROUTES.projects}
      data-reveal="unveil"
      style={d(delay)}
      aria-label={`${p.name} — ${p.meta}`}
      className={cn("rn-card group relative block [container-type:size]", className)}
    >
      <span className="rn-clip absolute inset-0 block overflow-hidden">
        <img src={p.interior} alt={`${p.name}, מבט מבפנים`} loading="lazy" className="rn-front rn-card-bg absolute inset-0 h-full w-full object-cover" />
        <span className="rn-card-panel absolute left-1/2 top-1/2 flex h-[88cqh] w-[min(60cqh,84cqw)] -translate-x-1/2 -translate-y-1/2 flex-col bg-stone px-[3.6cqh] pb-[3.4cqh] pt-[3cqh] text-petrol shadow-[0_18px_40px_rgba(4,42,43,.25)]">
          <span className="flex items-baseline justify-between t-4 leading-none tracking-[.04em]">
            <span>{type}</span>
            <span>{place}</span>
          </span>
          <span className="relative mt-[2.6cqh] block flex-1 overflow-hidden rounded-t-full">
            <img src={p.exterior} alt={`${p.name}, מבט מבחוץ`} loading="lazy" className="rn-card-arch absolute inset-0 h-full w-full object-cover" />
          </span>
          <span className="mt-[3cqh] block text-center t-3 font-normal leading-[1.15]">{p.name}</span>
          <span className="mx-auto mt-[1.6cqh] block max-w-[92%] text-center t-4 leading-[1.5] opacity-85">{p.text}</span>
        </span>
      </span>
    </a>
  );
}

/* A rule drawn by the scroll itself, from its own edge, as soon as it enters the screen */
function ScrollRule({ className, from = "left" }: { className: string; from?: "left" | "right" }) {
  const ref = useRef<HTMLSpanElement>(null);
  useScrollFrame(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) { el.style.transform = "none"; return; }
    const { h } = viewport();
    const top = el.getBoundingClientRect().top;
    el.style.transform = `scaleX(${easeOut(clamp01((h * 1.05 - top) / (h * 0.75)))})`;
  });
  return <span ref={ref} aria-hidden="true" className={cn("block scale-x-0 bg-stone will-change-transform", from === "left" ? "origin-left" : "origin-right", className)} />;
}

function Projects() {
  const [a, b, c] = PROJECTS;
  return (
    <section id="projects" aria-labelledby="projects-title" className="relative">
      <div className="relative flex flex-col pb-16 lg:block lg:h-[2445px] lg:pb-0">
        <h2 id="projects-title" data-reveal="lines" className="t-1 pt-[30vw] text-center font-light leading-[1] text-stone lg:absolute lg:inset-x-0 lg:top-[300px] lg:pt-0 lg:leading-[100px]">
          <span className="rn-line" style={li(0)}><span>פרויקטים</span></span>
          <span className="rn-line" style={li(1)}><span>נבחרים</span></span>
        </h2>

        <ScrollRule className="mt-16 h-[2px] w-[60%] lg:absolute lg:left-0 lg:top-[706px] lg:mt-0 lg:h-[3px] lg:w-[calc(50%-68.5px)]" />
        <ScrollRule from="right" className="hidden lg:absolute lg:right-0 lg:top-[1430px] lg:block lg:h-[3px] lg:w-[calc(50%-75.5px)]" />

        <div className="mt-10 px-[4vw] lg:contents lg:px-0">
          <ProjectCard p={a} className="aspect-[4/5] w-full lg:absolute lg:right-0 lg:top-[706px] lg:aspect-auto lg:h-[456px] lg:w-[calc(50%-75.5px)]" />
        </div>
        <div className="mt-4 px-[4vw] lg:contents lg:px-0">
          <ProjectCard p={b} delay={100} className="aspect-[4/5] w-full lg:absolute lg:left-0 lg:top-[1010px] lg:aspect-auto lg:h-[798px] lg:w-[calc(50%-68.5px)]" />
        </div>

        <p
          data-reveal
          className="t-2 order-last mt-16 px-[6vw] font-light leading-[1.2] text-stone lg:absolute lg:left-[calc(50%-576.5px)] lg:top-[1855px] lg:order-none lg:mt-0 lg:w-[602px] lg:px-0 lg:text-left lg:leading-[48px]"
        >
          מהמגרש ועד ידית הדלת, כל החלטה בבית עוברת דרך אותו שולחן.
        </p>

        <div className="mt-4 px-[4vw] lg:contents lg:px-0">
          <ProjectCard p={c} delay={100} className="aspect-[4/5] w-full lg:absolute lg:right-0 lg:top-[1703px] lg:aspect-auto lg:h-[645px] lg:w-[calc(50%-75.5px)]" />
        </div>

        <a
          href={ROUTES.projects}
          data-reveal
          style={d(200)}
          aria-label="לכל הפרויקטים" className="rn-circle relative order-last mx-6 mt-8 flex self-end lg:self-auto h-[132px] w-[132px] items-center justify-center rounded-full bg-stone text-petrol lg:absolute lg:left-[calc(50%-576.5px)] lg:top-[2191px] lg:order-none lg:mx-0 lg:mt-0 lg:h-[157px] lg:w-[157px]"
        >
          <svg viewBox="0 0 160 160" aria-hidden="true" className="rn-ring absolute inset-0 h-full w-full">
            <path id="ring-path" d="M 20 80 A 60 60 0 1 1 140 80 A 60 60 0 1 1 20 80" fill="none" />
            <text fill="currentColor" fontSize="14" direction="rtl" letterSpacing="1">
              <textPath href="#ring-path" startOffset="50%" textAnchor="middle" textLength="360" lengthAdjust="spacing">לכל הפרויקטים · לכל הפרויקטים ·</textPath>
            </text>
          </svg>
          <span className="rn-ring-arrow relative block"><ArrowIcon className="h-[54px] w-[54px] -rotate-45 lg:h-[62px] lg:w-[62px]" strokeWidth={1.1} /></span>
        </a>
      </div>
      <div className="h-[3px] w-full bg-stone" aria-hidden="true" />
    </section>
  );
}

/* -------------------------------------------------------------- STAGES */
type Stroke = { d: string; k?: "t" | "d"; tf?: string };
const HOUSE: Stroke[] = [
  { d: "M0 150 H250" }, { d: "M40 150 V80 H210 V150" }, { d: "M110 80 V45 H210 V80" }, { d: "M30 80 H220" },
  { d: "M100 45 H220" }, { d: "M55 150 V95 H100 V150" }, { d: "M150 150 V95 H195 V150" },
];
const STAGES: { n: number; title: string; text: string; art: Stroke[] }[] = [
  {
    n: 1, title: "תכנון", text: "סקיצה, מדידות ותוכנית: איפה נכנס האור ואיך זורמים החללים.",
    art: [
      { d: "M0 150 H250" },
      { d: "M40 150 V80 H210 V150", k: "d" }, { d: "M110 80 V45 H210 V80", k: "d" }, { d: "M30 80 H220", k: "d" }, { d: "M100 45 H220", k: "d" },
      { d: "M40 22 H210 M40 17 V27 M210 17 V27", k: "t" }, { d: "M232 45 V150 M227 45 H237 M227 150 H237", k: "t" },
    ],
  },
  {
    n: 2, title: "היתר", text: "סט תוכניות מלא, הגשה וליווי מול הוועדה עד לקבלת ההיתר.",
    art: [
      { d: "M4 4 H246 V166 H4 Z" },
      ...HOUSE.map((s) => ({ ...s, tf: "translate(25 10) scale(.8)" })),
      { d: "M178 132 H246 M178 132 V166 M184 144 H238 M184 154 H222" },
      { d: "M23 36 a17 17 0 1 0 34 0 a17 17 0 1 0 -34 0", k: "t" }, { d: "M28 36 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0", k: "t" },
      { d: "M34 36 L39 41 L47 31", k: "t" },
    ],
  },
  {
    n: 3, title: "עיצוב פנים", text: "חומרים, תאורה, נגרות וריהוט, בשפה של הבית.",
    art: [
      ...HOUSE,
      { d: "M60 150 V138 H95 V150 M60 138 V132 H95 V138", k: "t" }, { d: "M172 95 V108 M166 114 A6 6 0 0 1 178 114 Z", k: "t" },
      { d: "M157 150 V141 H188 V150", k: "t" }, { d: "M125 58 H195 V75 H125 Z", k: "t" },
    ],
  },
  {
    n: 4, title: "פיקוח", text: "ליווי באתר מול הקבלנים לאורך הבנייה, עד מסירת המפתח.",
    art: [
      ...HOUSE,
      { d: "M118 150 V100 H134 V150" }, { d: "M18 150 V118" }, { d: "M4 118 a14 12 0 1 0 28 0 a14 12 0 1 0 -28 0" },
      { d: "M150 150 V28 M172 150 V28 M194 150 V28 M216 150 V28", k: "t" }, { d: "M146 115 H220 M146 80 H220 M146 45 H220", k: "t" },
      { d: "M150 115 L172 80 M194 80 L216 45", k: "t" },
    ],
  },
];

function StageArt({ art, className }: { art: Stroke[]; className?: string }) {
  return (
    <svg viewBox="0 0 250 170" fill="none" aria-hidden="true" className={className}>
      {art.map((s, i) => (
        <path
          key={i}
          d={s.d}
          transform={s.tf}
          className={s.k === "d" ? "d" : undefined}
          pathLength={s.k === "d" ? undefined : 1}
          stroke={s.k === "t" ? "#a56332" : "currentColor"}
          strokeWidth={s.k === "t" ? 1.8 : 1.3}
          style={{ ["--j" as string]: i } as CSSProperties}
        />
      ))}
    </svg>
  );
}

/* One stage at a time. The section pins; each new card slides in from the side and covers the
   previous one, which settles back. Once a card is in place its drawing is sketched by the scroll. */
function Stages() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current, stick = stickRef.current, deck = deckRef.current;
    if (!wrap || !stick || !deck) return;
    const cards = Array.from(deck.children) as HTMLElement[];
    const N = cards.length;
    const paths = cards.map((c) => Array.from(c.querySelectorAll<SVGPathElement>("svg path")));
    // drawings are sketched in time (not scrubbed) as soon as their card arrives
    paths.forEach((list) => list.forEach((p, j) => {
      const delay = `${j * 70}ms`;
      if (p.classList.contains("d")) { p.style.opacity = "0"; p.style.transition = `opacity .9s ease ${delay}`; }
      else { p.style.strokeDasharray = "1"; p.style.strokeDashoffset = "1"; p.style.transition = `stroke-dashoffset 1.5s cubic-bezier(.45,0,.25,1) ${delay}`; }
    }));
    const drawn = cards.map(() => false);
    const setDrawn = (i: number, on: boolean) => {
      if (drawn[i] === on) return;
      drawn[i] = on;
      paths[i].forEach((p) => {
        if (p.classList.contains("d")) p.style.opacity = on ? "0.6" : "0";
        else p.style.strokeDashoffset = on ? "0" : "1";
      });
    };
    let cur = 0, target = 0, raf = 0, entered = false;

    const paint = () => {
      const q = cur * N; // 0..N, one unit of scroll per stage
      cards.forEach((card, i) => {
        const local = q - i; // <0 not yet, 0..1 this stage, >1 covered
        const enter = i === 0 ? 1 : clamp01(local / 0.75);
        const e = enter < 0.5 ? 4 * enter ** 3 : 1 - Math.pow(-2 * enter + 2, 3) / 2; // ease in-out
        const covered = clamp01((local - 1) / 0.5);
        card.style.transform = `translate3d(${(e - 1) * 112}%, 0, 0) scale(${1 - covered * 0.03})`;
        setDrawn(i, reducedMotion() || (i === 0 ? entered : local > 0.42));
      });
    };
    const loop = () => {
      cur += (target - cur) * (reducedMotion() ? 1 : 0.06);
      paint();
      raf = Math.abs(target - cur) > 0.0004 ? requestAnimationFrame(loop) : 0;
    };
    const read = () => {
      const w = wrap.getBoundingClientRect(), s = stick.getBoundingClientRect();
      target = clamp01((s.top - w.top) / (w.height - s.height || 1)) * ((N - 0.05) / N);
      entered = w.top < viewport().h * 0.3;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    read(); paint();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => { window.removeEventListener("scroll", read); window.removeEventListener("resize", read); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section aria-labelledby="stages-title" className="relative pb-20 pt-24 text-stone lg:pb-[150px] lg:pt-[150px]">
      <div ref={wrapRef} className="relative" style={{ height: `calc(100vh / var(--z) * ${1 + STAGES.length * 0.4})` }}>
        <div ref={stickRef} className="sticky top-0 flex flex-col justify-center overflow-hidden" style={{ height: "calc(100vh / var(--z))" }}>
          <div className="mx-auto w-full px-[6vw] lg:w-[1325px] lg:px-[99px]">
            <h2 id="stages-title" data-reveal="flip" className="t-1 font-light leading-[1.05] lg:leading-[80px]">
              <FlipText text="ארבעה שלבים," className="block lg:inline" />{" "}
              <FlipText text="משרד אחד" delay={140} className="block lg:inline" />
            </h2>
          </div>

          <ol ref={deckRef} className="relative mx-[6vw] mt-8 h-[min(62vh,560px)] lg:mx-auto lg:mt-[44px] lg:h-[min(58vh,520px)] lg:w-[1127px]">
            {STAGES.map((st, i) => (
              <li
                key={st.n}
                className="absolute inset-0 flex flex-col overflow-hidden rounded-[26px] bg-stone text-petrol shadow-[0_6px_20px_rgba(4,42,43,.07)] will-change-transform sm:flex-row lg:rounded-[34px]"
                style={{ zIndex: i + 1, transform: i === 0 ? "none" : "translate3d(-115%,0,0)" }}
              >
                <div className="flex flex-col px-6 pt-7 sm:w-[46%] sm:justify-between sm:px-[4.5vw] sm:py-[4.5vw] lg:w-[44%] lg:px-[56px] lg:py-[52px]">
                  <div>
                    <span className="t-1 block font-['Num'] leading-[.85] text-terra" dir="ltr" style={{ textAlign: "right" }}>0{st.n}</span>
                    <h3 className="t-2 mt-4 font-normal leading-none lg:mt-8">{st.title}</h3>
                    <p className="t-4 mt-3 max-w-[380px] leading-[1.65] text-petrol/80 lg:mt-5">{st.text}</p>
                  </div>
                  <span className="t-4 hidden tracking-[.2em] text-petrol/50 sm:block">שלב {st.n} מתוך 4</span>
                </div>
                <div className="flex min-h-0 flex-1 items-start justify-end px-6 pb-6 pt-1 sm:items-center sm:justify-center sm:border-r sm:border-petrol/15 sm:p-[4vw] lg:p-[48px]">
                  <StageArt art={st.art} className="h-full max-h-full w-auto max-w-full sm:h-auto sm:w-full sm:max-w-[460px]" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ PARTNERS */
function Year({ children }: { children: string }) {
  return (
    <span className="t-4 mb-2 flex items-center gap-2 leading-none tracking-[.08em] text-stone/75 lg:mb-3">
      <span>מאז</span>
      <span dir="ltr" className="font-['Num'] tracking-[.06em]">{children}</span>
    </span>
  );
}

function Partners() {
  const secRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const mPathRef = useRef<SVGPathElement>(null);

  // the curve draws itself while the section scrolls through
  useScrollFrame(() => {
    const sec = secRef.current, path = pathRef.current;
    if (!sec || !path) return;
    if (reducedMotion()) { path.style.strokeDashoffset = "0"; if (mPathRef.current) { mPathRef.current.style.strokeDasharray = "none"; mPathRef.current.style.strokeDashoffset = "0"; } return; }
    const { h } = viewport();
    const r = sec.getBoundingClientRect();
    const p = clamp01((h * 0.95 - r.top) / (r.height * 0.7)); // draws along with the scroll through the section
    path.style.strokeDashoffset = String(-(1 - p * p * (3 - 2 * p))); // grows from the top end downward
    // mobile S-curve: starts at the top line (right) and draws down to the bottom line (left)
    const mp = mPathRef.current;
    if (mp && mp.ownerSVGElement) {
      const svg = mp.ownerSVGElement, w = svg.clientWidth, h = svg.clientHeight; // drawn in real pixels so the stroke stays even
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      mp.setAttribute("d", `M${w} 1 C ${w * 0.62} 1, ${w * 0.56} ${h * 0.3}, ${w * 0.47} ${h * 0.56} S ${w * 0.26} ${h - 1}, 0 ${h - 1}`);
      const L = mp.getTotalLength();
      mp.style.strokeDasharray = `${L}`;
      mp.style.strokeDashoffset = `${L * (1 - p * p * (3 - 2 * p))}`;
    }
    // leaves fade in as the section arrives
  });

  return (
    <section ref={secRef} aria-labelledby="partners-title" className="relative overflow-x-clip text-stone lg:h-[1017px]">
      <h2 id="partners-title" className="sr-only">השותפים</h2>
      <div className="relative mx-auto flex flex-col px-5 pt-14 lg:block lg:h-full lg:w-[1325px] lg:p-0">
        <svg
          viewBox="0 0 1619.92 1022"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none absolute z-0 hidden -scale-y-100 lg:left-[-105px] lg:top-[-2px] lg:block lg:h-[1019px] lg:w-[1619px]"
        >
          <path
            ref={pathRef}
            d="M0.530221 22.505C124.971 -24.518 431.353 -23.0299 661.358 359.106C948.864 836.776 1097.54 1125.16 1619.53 984.988"
            stroke="#E0E0CF"
            strokeWidth="3"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        </svg>

        <div className="relative flex flex-col gap-9 lg:contents">
          {/* Dafna — right side, text leans toward the centre */}
          <div data-reveal className="text-right lg:absolute lg:left-[941px] lg:top-[195px] lg:w-[321px]">
            <p className="t-2 whitespace-nowrap font-semibold leading-[1.1] lg:h-[56px] lg:leading-[48px]">דפנה רביד</p>
            <p className="t-3s mt-1 font-light leading-[1.35] lg:mt-0 lg:leading-[48px]">אדריכלית,<br className="hidden lg:block" /> שותפה מייסדת</p>
            <p data-reveal style={d(200)} className="t-3s mt-4 font-light leading-[1.7] lg:absolute lg:font-normal lg:top-[384px] lg:mt-0 lg:w-[321px] lg:leading-[1.75]">
              <Year>2004</Year>
              <span className="block">יסדה את המשרד ומתכננת כל בית מבחוץ פנימה: מהמגרש, דרך הקירות, ועד החלון.</span>
            </p>
          </div>
          {/* Omer — left side */}
          <div data-reveal style={d(120)} className="border-t border-stone/30 pt-9 text-right lg:absolute lg:left-[63px] lg:top-[195px] lg:w-[323px] lg:border-0 lg:pt-0">
            <p className="t-2 whitespace-nowrap font-semibold leading-[1.1] lg:h-[56px] lg:leading-[48px]">עומר נחום</p>
            <p className="t-3s mt-1 font-light leading-[1.35] lg:mt-0 lg:leading-[48px]">מעצב פנים,<br className="hidden lg:block" /> שותף</p>
            <p data-reveal style={d(320)} className="t-3s mt-4 font-light leading-[1.7] lg:absolute lg:font-normal lg:right-0 lg:top-[384px] lg:mt-0 lg:w-[321px] lg:leading-[1.75]">
              <Year>2016</Year>
              <span className="block">שותף במשרד ומעצב כל בית מבפנים החוצה: מהחומרים, דרך התאורה, ועד הידית.</span>
            </p>
          </div>
        </div>

        {/* mobile: photo between two edge-to-edge lines, the curve runs from the upper line down to the lower one */}
        <div className="relative order-first -mx-5 mb-12 lg:hidden">
          <span aria-hidden="true" className="block h-[2px] bg-stone" />
          <div className="relative px-5 pt-10">
            <svg fill="none" aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-px -bottom-px h-[calc(100%+2px)] w-full">
              <path ref={mPathRef} d="M1000 1 C 620 1, 560 300, 470 560 S 260 999, 0 999" stroke="#E0E0CF" strokeWidth="2" strokeDasharray="10000" strokeDashoffset="10000" />
            </svg>
            <img src="/assets/partners.webp" alt="דפנה רביד ועומר נחום, השותפים במשרד" loading="lazy" className="relative mx-auto block w-[78%] max-w-[420px] -scale-x-100" />
          </div>
          <span aria-hidden="true" className="block h-[2px] bg-stone" />
        </div>
        <div data-reveal style={d(150)} className="relative z-[2] hidden lg:block lg:absolute lg:left-[calc(50%-264.5px)] lg:top-[309px] lg:mt-0 lg:h-[660px] lg:w-[529px] lg:max-w-none">
          <img src="/assets/partners.webp" alt="דפנה רביד ועומר נחום, השותפים במשרד" loading="lazy" className="block h-full w-full -scale-x-100 object-cover" />
        </div>
        <a href={ROUTES.about} className="t-3 rn-tab group relative z-10 order-last mx-auto mt-14 flex lg:order-none h-[clamp(64px,14vw,110px)] w-[94%] items-end justify-center gap-2 whitespace-nowrap rounded-t-[clamp(64px,14vw,110px)] bg-stone pb-[12px] text-petrol lg:absolute lg:bottom-0 lg:left-[calc(50%-320.5px)] lg:mt-0 lg:h-[80px] lg:w-[641px] lg:rounded-t-[80px] lg:pb-[8px]">
          <span className="rn-link">לקריאה נוספת על הסטודיו</span>
          <span className="block transition-transform duration-500 group-hover:-translate-x-1 group-hover:translate-y-1"><ArrowIcon className="h-[1.2em] w-[1.2em] -rotate-45" /></span>
        </a>
      </div>
    </section>
  );
}

/* The opening layers stay put once their bottom reaches the screen edge,
   so the terracotta arch rises over them and covers them. */
function CoveredLayer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const z = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--z")) || 1;
      el.style.top = `${Math.min(0, window.innerHeight / z - el.offsetHeight)}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    return () => { ro.disconnect(); window.removeEventListener("resize", fit); };
  }, []);
  return <div ref={ref} className="sticky pb-[30vh] lg:pb-[12vh]">{children}</div>;
}

/* ------------------------------------------------- TERRA (arch wrapper) */
const ARCH_TEXT = "בתים שנבנו בשפה אחת · מבחוץ פנימה · ומבפנים החוצה";
const ARCH_TEXT_SHORT = "מבחוץ פנימה · ומבפנים החוצה";

function TerraArch() {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<SVGTextElement>(null);

  // The arch rises as a narrow dome and opens to full width; the curved line of text
  // rides its rim, growing and spreading out as it opens. Eased with a soft follow.
  useEffect(() => {
    const el = ref.current, svg = svgRef.current, path = pathRef.current, text = textRef.current;
    if (!el || !svg || !path || !text) return;
    let cur = -1, target = 0, raf = 0;

    const paint = () => {
      const W = el.offsetWidth;
      const p = easeOut(cur);
      const x = (1 - p) * W * 0.32;
      const r = (W - 2 * x) / 2;
      el.style.clipPath = `inset(0px ${x}px 0px ${x}px round ${r}px ${r}px 0px 0px)`;

      // text circle sits just inside the rim
      const cx = W / 2, cy = r, rr = r * 0.9;
      const a = (16 * Math.PI) / 180;
      const x1 = cx - rr * Math.cos(a), x2 = cx + rr * Math.cos(a), y = cy - rr * Math.sin(a);
      svg.setAttribute("viewBox", `0 0 ${W} ${r}`);
      svg.style.height = `${r}px`;
      path.setAttribute("d", `M ${x1} ${y} A ${rr} ${rr} 0 0 1 ${x2} ${y}`);
      const fs = 13 + p * (W >= 1000 ? 13 : 5);
      text.style.fontSize = `${fs}px`;
      text.style.letterSpacing = `${0.05 + p * 0.5}em`;
      text.style.opacity = String(clamp01(p * 1.6));
      // never longer than the rim: shorter phrase on narrow screens, then shrink to fit
      const tp = text.firstElementChild as SVGTextPathElement | null;
      const phrase = W < 640 ? ARCH_TEXT_SHORT : ARCH_TEXT;
      if (tp && tp.textContent !== phrase) tp.textContent = phrase;
      const room = path.getTotalLength() * 0.92, used = text.getComputedTextLength();
      if (used > room && used > 0) text.style.fontSize = `${fs * room / used}px`;
    };
    const loop = () => {
      cur += (target - cur) * (reducedMotion() ? 1 : 0.09);
      paint();
      raf = Math.abs(target - cur) > 0.0005 ? requestAnimationFrame(loop) : 0;
    };
    const read = () => {
      const { h } = viewport();
      const top = el.getBoundingClientRect().top;
      target = reducedMotion() ? 1 : clamp01((h - top) / (h * 0.9));
      if (cur < 0) cur = target;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => { window.removeEventListener("scroll", read); window.removeEventListener("resize", read); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={ref} className="relative z-10 mt-[55vh] bg-terra lg:mt-[calc(153px+38vh/var(--z))]" style={{ clipPath: "inset(0 round 50vw 50vw 0 0)" }}>
      <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 w-full overflow-visible">
        <path ref={pathRef} id="arch-text-path" fill="none" />
        <text ref={textRef} fill="#e0e0cf" className="font-light" direction="rtl">
          <textPath href="#arch-text-path" startOffset="50%" textAnchor="middle">{ARCH_TEXT}</textPath>
        </text>
      </svg>
      <Projects />
      <Stages />
      <Partners />
    </div>
  );
}

/* ------------------------------------------------------------- CONTACT */
/* Clean and minimal: a heading on one side, three underlined fields and a quiet send on the other. */
function Contact() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // TODO: connect to a form endpoint (e.g. Supabase / Resend) in Lovable
    setSent(true);
  };
  const field = "rn-field block w-full border-0 border-b border-petrol/30 bg-transparent pb-3 pt-1 t-4 text-petrol placeholder:text-petrol/45";

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative mx-auto mt-24 grid gap-12 px-[6vw] lg:mt-[170px] lg:w-[1133px] lg:grid-cols-2 lg:gap-[120px] lg:px-0">
      <div data-reveal className="contents lg:block">
        <h2 id="contact-title" className="t-2 whitespace-nowrap text-center lg:text-right font-light leading-[1.05] text-petrol lg:whitespace-normal">בואו נתחיל<br className="hidden lg:block" /> מקו אחד</h2>
        <p className="t-4 order-last mt-0 lg:order-none lg:mt-6 leading-[1.6] text-petrol/75">
          <a href={CONTACT.phoneHref} className="rn-link">{CONTACT.phone}</a>
          <br />
          <a href={`mailto:${CONTACT.email}`} className="rn-link">{CONTACT.email}</a>
        </p>
      </div>

      {sent ? (
        <p role="status" data-reveal className="t-3 self-end font-light text-petrol">תודה, נחזור אליך בקרוב.</p>
      ) : (
        <form data-reveal style={d(120)} onSubmit={onSubmit} className="flex flex-col gap-8 lg:pt-3">
          <div>
            <label className="sr-only" htmlFor="c-name">שם</label>
            <input id="c-name" name="name" required autoComplete="name" placeholder="שם" className={field} />
          </div>
          <div>
            <label className="sr-only" htmlFor="c-phone">טלפון</label>
            <input id="c-phone" name="phone" type="tel" dir="rtl" required autoComplete="tel" inputMode="tel" placeholder="טלפון" className={cn(field, "text-right")} />
          </div>
          <div>
            <label className="sr-only" htmlFor="c-msg">על מה נדבר?</label>
            <input id="c-msg" name="message" placeholder="על מה נדבר?" className={field} />
          </div>
          <div className="flex items-center justify-between gap-6">
            <label className="t-4 flex items-center gap-2 text-petrol/65">
              <input type="checkbox" name="consent" required className="h-4 w-4 accent-[#a56332]" />
              <span>מאשר/ת את <a href={ROUTES.privacy} className="underline underline-offset-4">מדיניות הפרטיות</a></span>
            </label>
            <button type="submit" className="t-4 rn-send-link group flex items-center gap-3 text-petrol">
              <span className="rn-link">שליחה</span>
              <ArrowIcon className="h-[22px] w-[22px] -rotate-45 transition-transform duration-500 group-hover:-translate-x-1 group-hover:translate-y-1" />
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

/* ---------------------------------------------------------------- PAGE */
export default function Index() {
  useReveal();
  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-stone font-arfilit text-petrol">
      <Header active="home" />
      <main id="main">
        <div>
          <CoveredLayer>
            <Hero />
            <Statement />
          </CoveredLayer>
          <TerraArch />
        </div>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
