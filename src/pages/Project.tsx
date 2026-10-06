import { useRef } from "react";
import { ArrowIcon, FlipText, Footer, Header, Loader, ROUTES, clamp01, cn, easeOut, reducedMotion, useReveal, useScrollFrame, viewport } from "@/components/site/shared";
import { PROJECTS, projectHref, shots, type Project } from "@/components/site/projects-data";
import { Contact } from "@/components/site/contact";

/* ===============================================================
   Ravid Nahum — a single project
   The story runs from outside to inside: the exterior first,
   then an arched window opens in the facade onto the interior.

   =============================================================== */

/* which project: /projects/<slug> in the app, ?slug=<slug> in the static preview */
function currentProject(): Project {
  const q = new URLSearchParams(window.location.search).get("slug");
  const fromPath = window.location.pathname.split("/").filter(Boolean).pop();
  return PROJECTS.find((p) => p.slug === q) ?? PROJECTS.find((p) => p.slug === fromPath) ?? PROJECTS[0];
}

const KIND: Record<Project["kind"], string> = { private: "בית פרטי", apartment: "דירה", commercial: "מסחרי" };

/* a photo that eases in when it scrolls into view; `pos` picks the crop */
function Shot({ src, alt, pos = "50% 50%", className }: { src: string; alt: string; pos?: string; className?: string }) {
  return (
    <figure data-reveal="unveil" className={cn("relative overflow-hidden", className)}>
      <span className="rn-clip absolute inset-0 block overflow-hidden">
        <img src={src} alt={alt} loading="lazy" className="rn-front absolute inset-0 h-full w-full object-cover" style={{ objectPosition: pos }} />
      </span>
    </figure>
  );
}

/* the threshold: an arched window opens in the exterior and grows until the interior fills the screen */
function Threshold({ p }: { p: Project }) {
  const s = shots(p.slug);
  const wrapRef = useRef<HTMLDivElement>(null);
  const winRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  useScrollFrame(() => {
    const wrap = wrapRef.current, win = winRef.current, label = labelRef.current;
    if (!wrap || !win || !label) return;
    const { h } = viewport();
    const r = wrap.getBoundingClientRect();
    const t = reducedMotion() ? 1 : easeOut(clamp01(-r.top / (r.height - h)));
    const W = win.offsetWidth, H = win.offsetHeight;
    const w = W * (0.34 + 0.66 * t), hh = H * (0.6 + 0.4 * t);
    const x = (W - w) / 2, bottom = H * 0.1 * (1 - t), top = H - bottom - hh;
    const rad = (w / 2) * (1 - t);
    win.style.clipPath = `inset(${top}px ${x}px ${bottom}px ${x}px round ${rad}px ${rad}px 0 0)`;
    label.style.opacity = String(1 - clamp01(t * 2.2));
  });
  return (
    <section ref={wrapRef} aria-label="מבחוץ פנימה" className="relative" style={{ height: "calc(230vh / var(--z))" }}>
      <div className="sticky top-0 overflow-hidden" style={{ height: "calc(100vh / var(--z))" }}>
        <img src={s.extHero} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        <span aria-hidden="true" className="absolute inset-0 bg-petrol/35" />
        <div ref={winRef} className="absolute inset-0" style={{ clipPath: "inset(40% 33% 10% 33% round 200px 200px 0 0)" }}>
          <img src={s.intHero} alt={`${p.name}, מבט מבפנים`} className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <p ref={labelRef} className="t-2 absolute inset-x-0 top-[14%] text-center font-light text-stone">מבחוץ פנימה</p>
      </div>
    </section>
  );
}

export default function ProjectPage() {
  useReveal();
  const p = currentProject();
  const [type, place] = p.meta.split(" · ");
  const next = PROJECTS[(PROJECTS.indexOf(p) + 1) % PROJECTS.length];
  const s = shots(p.slug);

  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-stone font-arfilit text-petrol">
      <Loader />
      <Header active="projects" />
      <main id="main">
        {/* the exterior, full screen, with the name */}
        <section className="relative overflow-hidden" style={{ height: "calc(88vh / var(--z))" }}>
          <img src={s.extHero} alt={`${p.name}, מבט מבחוץ`} fetchPriority="high" className="rn-fade-up absolute inset-0 h-full w-full object-cover" />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-petrol/75 via-petrol/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto px-[6vw] pb-[clamp(32px,5vw,64px)] text-stone lg:w-[1325px] lg:px-[99px]">
            <a href={ROUTES.projects} className="t-4 rn-link text-stone/80">כל הפרויקטים</a>
            <h1 data-reveal="flip" className="t-1 mt-3 font-light"><FlipText text={p.name} /></h1>
          </div>
        </section>

        {/* facts and a short story */}
        <section className="border-b-[3px] border-petrol">
          <ul className="mx-auto grid grid-cols-3 lg:w-[1325px]">
            {[["סוג", KIND[p.kind] ?? type], ["מיקום", place], ["שנה", p.year]].map(([k, v], i) => (
              <li key={k} className={cn("flex flex-col items-center gap-1 py-[clamp(20px,4vw,40px)] text-center", i < 2 && "border-l border-petrol/20")}>
                <span className="t-4 text-petrol/60">{k}</span>
                <span className={cn("t-3", k === "שנה" && "font-['Num']")}>{v}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="mx-auto px-[6vw] py-[clamp(56px,9vw,120px)] text-center lg:w-[1325px] lg:px-[99px]">
          <p data-reveal className="t-3 mx-auto max-w-[680px] font-light">{p.text}</p>
        </section>

        {/* outside */}
        <section aria-labelledby="out-h" className="mx-auto px-[4vw] lg:w-[1325px] lg:px-[73px]">
          <h2 id="out-h" data-reveal="flip" className="t-2 mb-[clamp(24px,4vw,48px)] font-light"><FlipText text="מבחוץ" /></h2>
          <div className="grid grid-cols-2 gap-[clamp(10px,2vw,24px)]">
            <Shot src={s.extHero} alt={`${p.name}, החזית`} className="col-span-2 aspect-[16/9]" />
            <Shot src={s.ext1} alt={`${p.name}, פרט מהחזית`} className="aspect-[4/5]" />
            <Shot src={s.ext2} alt={`${p.name}, פרט מבחוץ`} className="mt-[18%] aspect-[4/5]" />
          </div>
        </section>

        <div className="h-[clamp(64px,10vw,140px)]" />
        <Threshold p={p} />

        {/* inside */}
        <section aria-labelledby="in-h" className="mx-auto px-[4vw] pt-[clamp(64px,10vw,140px)] lg:w-[1325px] lg:px-[73px]">
          <h2 id="in-h" data-reveal="flip" className="t-2 mb-[clamp(24px,4vw,48px)] font-light"><FlipText text="מבפנים" /></h2>
          <div className="grid grid-cols-2 gap-[clamp(10px,2vw,24px)]">
            <Shot src={s.int1} alt={`${p.name}, פרט מבפנים`} className="aspect-[4/5]" />
            <Shot src={s.int2} alt={`${p.name}, פרט נוסף מבפנים`} className="mt-[18%] aspect-[4/5]" />
            <Shot src={s.intWide} alt={`${p.name}, מבט כללי`} className="col-span-2 aspect-[16/9]" />
          </div>
        </section>

        {/* next project */}
        <section className="mt-[clamp(80px,12vw,160px)] border-y-[3px] border-petrol">
          <a href={projectHref(next.slug)} className="group mx-auto flex items-center justify-between gap-6 px-[6vw] py-[clamp(28px,5vw,56px)] lg:w-[1325px] lg:px-[99px]">
            <span>
              <span className="t-4 block text-petrol/60">הפרויקט הבא</span>
              <span className="t-2 block font-light">{next.name}</span>
            </span>
            <span className="flex items-center gap-[clamp(16px,3vw,40px)]">
              <span className="relative block aspect-[4/3] w-[clamp(96px,16vw,220px)] overflow-hidden rounded-t-full">
                <img src={shots(next.slug).extHero} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] [transition-timing-function:var(--ease)] group-hover:scale-[1.06]" />
              </span>
              <ArrowIcon className="h-[clamp(24px,3vw,40px)] w-[clamp(24px,3vw,40px)] transition-transform duration-500 group-hover:-translate-x-2" />
            </span>
          </a>
        </section>

        <div className="pb-[clamp(40px,6vw,80px)]"><Contact /></div>
      </main>
      <Footer />
    </div>
  );
}
