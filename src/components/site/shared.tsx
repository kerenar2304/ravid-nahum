import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type SVGProps } from "react";

/* ---------------------------------------------------------------
   Ravid Nahum — shared pieces: tokens, hooks, icons, header, footer
   --------------------------------------------------------------- */

export const cn = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

export const ROUTES = {
  home: "/",
  projects: "/projects",
  studio: "/studio",
  about: "/studio",
  contact: "/#contact",
  accessibility: "/accessibility",
  privacy: "/privacy",
  terms: "/terms",
};

export const CONTACT = {
  phone: "050-0000000",
  phoneHref: "tel:+972500000000",
  whatsappHref: "https://wa.me/972500000000",
  instagramHref: "https://www.instagram.com/",
  email: "studio@ravid-nahum.co.il",
  address: "רחוב הדוגמה 1, תל אביב",
  mapsHref: "https://maps.google.com/?q=Tel+Aviv",
};

/* ---------- desktop fluid scale ----------
   The Figma frame is 1325px wide. From 1024px up the whole page is zoomed so the
   frame fills the screen; above 1325px growth is damped (60%) and capped at 1.6.
   Below 1024px there is no zoom and the responsive (mobile/tablet) layout applies. */
export const DESIGN_W = 1325;
export function fluidZoom(w: number) {
  if (w < 1024) return 1;
  if (w <= DESIGN_W) return w / DESIGN_W;
  return Math.min(1.6, 1 + (w / DESIGN_W - 1) * 0.6);
}
export function useFluidScale() {
  useLayoutEffect(() => {
    const apply = () => {
      const r = document.documentElement;
      (r.style as CSSStyleDeclaration & { zoom: string }).zoom = ""; // measure without zoom, minus the scrollbar
      const z = fluidZoom(r.clientWidth || window.innerWidth);
      (r.style as CSSStyleDeclaration & { zoom: string }).zoom = z === 1 ? "" : z.toFixed(4);
      r.style.setProperty("--z", z.toFixed(4));
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);
}

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Viewport height in the same units getBoundingClientRect() reports (zoom-safe),
   and the factor that turns those units into window scroll pixels. */
let probe: HTMLDivElement | null = null;
export function viewport() {
  if (!probe) {
    probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100%;pointer-events:none;visibility:hidden";
    document.body.appendChild(probe);
  }
  const h = probe.getBoundingClientRect().height || window.innerHeight;
  return { h, toScroll: window.innerHeight / h };
}

/* Runs `cb` once per animation frame while the page scrolls or resizes. */
export function useScrollFrame(cb: () => void, deps: unknown[] = []) {
  useEffect(() => {
    let raf = 0;
    const tick = () => { raf = 0; cb(); };
    const req = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => {
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* Adds .is-in to every [data-reveal] element once it scrolls into view. */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* ---------- icons ---------- */
type IconProps = SVGProps<SVGSVGElement>;
export const PhoneIcon = (p: IconProps) => (
  <svg viewBox="0 0 22 22" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12.25 19.34C14.66 20.38 17.55 21 21 21V16L16 14.75 12.25 19.34ZM12.25 19.34C7.45 17.28 4.53 13.56 2.88 9.75M2.88 9.75C1.5 6.59 1 3.37 1 1H6L7.25 6 2.88 9.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const WhatsappIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4a.5.5 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" />
  </svg>
);
export const MailIcon = (p: IconProps) => (
  <svg viewBox="0 0 29 23" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M26.1 5.75 14.5 12.94 2.9 5.75V2.88l11.6 7.19 11.6-7.19M26.1 0H2.9A2.89 2.89 0 0 0 0 2.88v17.24A2.9 2.9 0 0 0 2.9 23h23.2a2.9 2.9 0 0 0 2.9-2.88V2.88A2.9 2.9 0 0 0 26.1 0Z" />
  </svg>
);
export const PinIcon = (p: IconProps) => (
  <svg viewBox="0 0 21 29" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M10.5 13.78a3.69 3.69 0 0 1-3.75-3.63 3.75 3.75 0 0 1 7.5 0 3.69 3.69 0 0 1-3.75 3.63ZM10.5 0A10.33 10.33 0 0 0 0 10.15C0 17.76 10.5 29 10.5 29S21 17.76 21 10.15A10.33 10.33 0 0 0 10.5 0Z" />
  </svg>
);
export const ArrowIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </svg>
);
/* light, unframed line icons: hairline strokes and square corners, in the logo's spirit */
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.15, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
export const LinePhone = (p: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...line} {...p}>
    <path d="M5 3h4l1.5 4.5-2.2 1.6a12 12 0 0 0 6.6 6.6l1.6-2.2L21 15v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  </svg>
);
export const LineInstagram = (p: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...line} strokeLinejoin="miter" {...p}>
    <path d="M3.5 3.5h17v17h-17Z" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.2" cy="6.8" r=".5" fill="currentColor" stroke="none" />
  </svg>
);
export const LineWhatsapp = (p: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...line} {...p}>
    <path d="M12 3a9 9 0 1 1-4.3 16.9L3 21l1.2-4.5A9 9 0 0 1 12 3Z" />
    <path d="M9 8.2h1.8l.8 2-1 .9a5 5 0 0 0 2.3 2.3l.9-1 2 .8V15A6.8 6.8 0 0 1 9 8.2Z" />
  </svg>
);
const MenuIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" {...p}><path d="M3 7h18M3 12h18M3 17h18" /></svg>
);
const CloseIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" {...p}><path d="M5 5l14 14M19 5 5 19" /></svg>
);

/* ---------- header ---------- */
const NAV = [
  { label: "ראשי", href: ROUTES.home, key: "home" },
  { label: "פרויקטים", href: ROUTES.projects, key: "projects" },
  { label: "סטודיו", href: ROUTES.studio, key: "studio" },
  { label: "צור קשר", href: ROUTES.contact, key: "contact" },
];

function IconButton({ href, label, children, external }: { href: string; label: string; children: ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="rn-icon-btn flex h-[40px] w-[40px] items-center justify-center text-stone hover:opacity-75"
    >
      {children}
    </a>
  );
}

export function Header({ active = "home" }: { active?: string }) {
  useFluidScale();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 90) setHidden(false);          // always visible at the very top
      else if (y > last + 3) setHidden(true); // scrolling down: gone
      else if (y < last - 3) setHidden(false); // scrolling up: back
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[60] focus:bg-stone focus:px-4 focus:py-2">
        דילוג לתוכן
      </a>
      <header className={cn("rn-header sticky top-0 z-50", hidden && !open && "is-hidden")}>
        <div className="relative mx-auto flex h-[64px] items-center justify-between rounded-b-[16px] bg-petrol px-4 lg:h-[91px] lg:rounded-b-[20px] lg:px-0">
          <div className="relative flex w-full items-center justify-between lg:mx-auto lg:w-[1325px] lg:px-[73px]">
            <a href={ROUTES.home} aria-label="רביד נחום — לדף הבית" className="block">
              <img src="/assets/logo-cream.svg" alt="Ravid Nahum" className="h-[36px] w-auto lg:h-[45.67px]" />
            </a>

            <nav aria-label="ניווט ראשי" className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
              <ul className="t-4 flex items-center gap-[47px] px-[6px] leading-[22px] text-stone">
                {NAV.map((n) => (
                  <li key={n.key}>
                    <a href={n.href} className="rn-link whitespace-nowrap" aria-current={active === n.key ? "page" : undefined}>
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-[13px] lg:ml-[2px]">
              <span className="hidden lg:contents">
                <IconButton href={CONTACT.instagramHref} label="אינסטגרם" external><LineInstagram className="h-[29px] w-[29px]" /></IconButton>
                <IconButton href={CONTACT.whatsappHref} label="וואטסאפ" external><LineWhatsapp className="h-[29px] w-[29px]" /></IconButton>
                <IconButton href={CONTACT.phoneHref} label={`חייגו ${CONTACT.phone}`}><LinePhone className="h-[29px] w-[29px]" /></IconButton>
              </span>
              <span className="contents lg:hidden">
                <IconButton href={CONTACT.phoneHref} label={`חייגו ${CONTACT.phone}`}><LinePhone className="h-[29px] w-[29px]" /></IconButton>
                <button
                  type="button"
                  onClick={() => setOpen((o) => !o)}
                  aria-expanded={open}
                  aria-controls="mobile-menu"
                  aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
                  className="flex h-[38px] w-[40px] items-center justify-center rounded-[5px] border border-stone/50 text-stone"
                >
                  {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                </button>
              </span>
            </div>
          </div>
        </div>

        {/* mobile menu */}
        <div
          id="mobile-menu"
          className={cn(
            "absolute inset-x-0 top-full -z-10 -mt-[20px] rounded-b-[22px] bg-petrol px-[6vw] pb-7 pt-[44px] text-stone shadow-[0_18px_40px_rgba(4,42,43,.25)] transition-[clip-path] duration-500 [transition-timing-function:var(--ease)] lg:hidden",
            open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
          )}
          aria-hidden={!open}
        >
          <ul className="t-3 flex flex-col gap-4 font-light leading-none">
            {NAV.map((n, i) => (
              <li key={n.key} style={{ transitionDelay: open ? `${150 + i * 70}ms` : "0ms" }} className={cn("transition-all duration-700", open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
                <a href={n.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>{n.label}</a>
              </li>
            ))}
          </ul>
          <div className="t-4 mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-stone/20 pt-5 opacity-80">
            <a href={CONTACT.phoneHref} tabIndex={open ? 0 : -1}>{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`} tabIndex={open ? 0 : -1}>{CONTACT.email}</a>
          </div>
        </div>
        {/* tap outside to close */}
        {open && <button type="button" aria-label="סגירת תפריט" onClick={() => setOpen(false)} className="fixed inset-0 -z-20 cursor-default bg-petrol/25 backdrop-blur-[2px] lg:hidden" />}
      </header>
    </>
  );
}

/* ---------- footer ---------- */
const FOOT_ICON = "flex h-[40px] w-[40px] items-center justify-center text-stone transition-opacity hover:opacity-70";

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-petrol text-stone lg:mt-[144px]">
      <div className="mx-auto flex flex-row-reverse items-start justify-between gap-6 px-[6vw] pt-14 lg:w-[1325px] lg:px-[73px] lg:pt-[72px]">
        {/* brand, legal links, contact icons */}
        <div className="text-left">
          <img src="/assets/logo-footer-cream.svg" alt="Ravid Nahum — Architecture & Interiors" className="mr-auto h-auto w-[170px] sm:w-[240px] lg:w-[300px]" />
          <ul className="t-4 mt-8 flex flex-col gap-3">
            <li><a className="underline decoration-stone/50 underline-offset-[5px] hover:decoration-stone" href={ROUTES.accessibility}>הצהרת נגישות</a></li>
            <li><a className="underline decoration-stone/50 underline-offset-[5px] hover:decoration-stone" href={ROUTES.privacy}>מדיניות פרטיות</a></li>
            <li><a className="underline decoration-stone/50 underline-offset-[5px] hover:decoration-stone" href={ROUTES.terms}>תקנון האתר</a></li>
            <li><a className="underline decoration-stone/50 underline-offset-[5px] hover:decoration-stone" href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer">{CONTACT.address}</a></li>
          </ul>
          <div className="mt-8 flex flex-row-reverse items-center gap-2 sm:gap-4">
            <span data-reveal="rule" aria-hidden="true" className="rule-from-left block h-[2px] w-[40px] bg-stone sm:w-[110px] lg:w-[128px]" style={{ ["--d" as string]: "200ms" }} />
            <a className={FOOT_ICON} href={CONTACT.phoneHref} aria-label={`טלפון: ${CONTACT.phone}`}><LinePhone className="h-[27px] w-[27px]" /></a>
            <a className={FOOT_ICON} href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="וואטסאפ"><LineWhatsapp className="h-[27px] w-[27px]" /></a>
            <a className={FOOT_ICON} href={CONTACT.instagramHref} target="_blank" rel="noopener noreferrer" aria-label="אינסטגרם"><LineInstagram className="h-[27px] w-[27px]" /></a>
                      </div>
        </div>

        {/* site navigation */}
        <nav aria-label="ניווט תחתון" className="mt-[95px] sm:mt-[120px] lg:mt-[142px]">
          <ul className="t-4 flex flex-col gap-3">
            {NAV.map((n) => (
              <li key={n.key}><a className="rn-link" href={n.href}>{n.label}</a></li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-14 px-[6vw] pb-8 lg:mt-[72px] lg:w-[1325px] lg:px-[73px] lg:pb-[34px]">
        <div data-reveal="rule" className="h-[2px] w-full bg-stone" aria-hidden="true" />
        <div className="t-4 mt-6 flex flex-col items-center gap-4 text-center lg:flex-row lg:items-center lg:justify-between lg:text-right">
          <p>כל הזכויות שמורות © {new Date().getFullYear()} רביד נחום אדריכלות ועיצוב פנים</p>
          <a href="https://www.instagram.com/keren.arlihman" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 opacity-90 hover:opacity-100">
            <span>עיצוב ופיתוח האתר:</span>
            <img src="/assets/keren-logo.png" alt="Keren Arlihman — Graphic Designer" className="h-[34px] w-auto lg:h-[38px]" />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ---------- loader: the logo-mark tetris plays once, then fades away ---------- */
export function Loader() {
  const [state, setState] = useState<"on" | "leaving" | "off">(() => (reducedMotion() ? "off" : "on"));
  useEffect(() => {
    if (state === "off") { document.documentElement.classList.remove("is-loading"); return; }
    document.documentElement.classList.add("is-loading");
    document.documentElement.style.overflow = "hidden";
    const fallback = window.setTimeout(() => setState("leaving"), 4500); // never block the site
    return () => window.clearTimeout(fallback);
  }, [state]);
  useEffect(() => {
    if (state !== "leaving") return;
    document.documentElement.classList.remove("is-loading"); // hero animations start as the curtain lifts
    document.documentElement.style.overflow = "";
    const t = window.setTimeout(() => setState("off"), 700);
    return () => window.clearTimeout(t);
  }, [state]);
  if (state === "off") return null;
  return (
    <div
      aria-hidden="true"
      className={cn("fixed inset-0 z-[100] bg-[#0c2e2e] transition-opacity duration-700", state === "leaving" && "pointer-events-none opacity-0")}
    >
      <video
        className="h-full w-full object-cover"
        src="/assets/loader.mp4"
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={() => setState("leaving")}
        onError={() => setState("leaving")}
      />
    </div>
  );
}

/* ---------- animated headline text ---------- */
/* Letters turn on their vertical axis like shutter slats: in on load, out on scroll */
export function FlipText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
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
