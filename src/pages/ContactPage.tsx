import { CONTACT, FlipText, Footer, Header, Loader, LinePhone, LineWhatsapp, MailIcon, PinIcon, useReveal } from "@/components/site/shared";
import { Contact } from "@/components/site/contact";

/* ===============================================================
   Ravid Nahum — Contact
   A headline that carries the line, one sentence, the details in an
   even row between rules, then the same form as the home page.
   =============================================================== */

const DETAILS = [
  { label: "טלפון", value: CONTACT.phone, href: CONTACT.phoneHref, Icon: LinePhone, ltr: true },
  { label: "וואטסאפ", value: "שלחו הודעה", href: CONTACT.whatsappHref, Icon: LineWhatsapp, external: true },
  { label: "מייל", value: CONTACT.email, href: `mailto:${CONTACT.email}`, Icon: MailIcon, ltr: true },
  { label: "הסטודיו", value: CONTACT.address, href: CONTACT.mapsHref, Icon: PinIcon, external: true },
];

export default function ContactPage() {
  useReveal();
  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-stone font-arfilit text-petrol">
      <Loader />
      <Header active="contact" />
      <main id="main">
        {/* headline with the line, like the home page */}
        <section className="mx-auto px-[6vw] pb-[clamp(40px,6vw,80px)] pt-[clamp(48px,9vw,120px)] lg:w-[1325px] lg:px-[99px]">
          <h1 data-reveal="flip" className="t-1 font-light">
            <span className="flex items-center gap-[3vw] lg:gap-[40px]">
              <FlipText text="כל בית" className="block whitespace-nowrap" />
              <span data-reveal="rule" aria-hidden="true" className="mt-[.12em] block h-[2px] flex-1 bg-petrol lg:h-[3px]" style={{ ["--d" as string]: "500ms" }} />
            </span>
            <FlipText text="מתחיל בשיחה" delay={160} className="block" />
          </h1>
          <p data-reveal style={{ ["--d" as string]: "200ms" }} className="t-3 mt-8 max-w-[560px] font-light text-petrol/80">
            מגרש ריק, בית ישן או חלל שמבקש שינוי. ספרו לנו מה יש לכם, ואנחנו נחזור עם הקו הראשון.
          </p>
        </section>

        {/* the details, one even row between two lines */}
        <section aria-label="פרטי התקשרות" className="border-y-[3px] border-petrol">
          <ul className="mx-auto grid grid-cols-2 lg:w-[1325px] lg:grid-cols-4">
            {DETAILS.map(({ label, value, href, Icon, ltr, external }, i) => (
              <li key={label} className={i % 2 === 0 ? "border-l border-petrol/20" : i === 1 ? "lg:border-l lg:border-petrol/20" : ""}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={"group flex h-full flex-col items-center gap-2 py-[clamp(24px,4vw,48px)] text-center transition-colors hover:bg-petrol hover:text-stone " + (i < 2 ? "border-b border-petrol/20 lg:border-b-0" : "")}
                >
                  <Icon className="h-[26px] w-[26px] text-terra transition-colors group-hover:text-stone" />
                  <span className="t-4 text-petrol/60 transition-colors group-hover:text-stone/70">{label}</span>
                  <span className="t-4" dir={ltr ? "ltr" : undefined}>{value}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="pb-[clamp(40px,6vw,80px)]"><Contact /></div>
      </main>
      <Footer />
    </div>
  );
}
