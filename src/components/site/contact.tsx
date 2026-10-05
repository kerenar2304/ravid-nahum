import { useState, type FormEvent } from "react";
import { ArrowIcon, CONTACT, ROUTES, cn } from "@/components/site/shared";

/* Contact form, shared by the home page and the studio page */
/* Clean and minimal: a heading on one side, three underlined fields and a quiet send on the other. */
export function Contact({ dark = false }: { dark?: boolean }) {
  // dark: the same form set on the petrol wall (studio page), so the wall runs on into the footer
  const ink = dark ? "text-stone" : "text-petrol";
  const soft = dark ? "text-stone/70" : "text-petrol/75";
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // TODO: connect to a form endpoint (e.g. Supabase / Resend) in Lovable
    setSent(true);
  };
  const field = cn("rn-field block w-full border-0 border-b bg-transparent pb-3 pt-1 t-4", dark ? "border-stone/30 text-stone placeholder:text-stone/50" : "border-petrol/30 text-petrol placeholder:text-petrol/45");

  return (
    <section id="contact" aria-labelledby="contact-title" className={cn("relative mx-auto grid gap-12 px-[6vw] lg:w-[1133px] lg:grid-cols-2 lg:gap-[120px] lg:px-0", dark ? "mt-0" : "mt-24 lg:mt-[170px]")}>
      <div data-reveal className="contents lg:block">
        <h2 id="contact-title" className={cn("t-2 whitespace-nowrap text-center lg:text-right font-light leading-[1.05] lg:whitespace-normal", ink)}>בואו נתחיל<br className="hidden lg:block" /> מקו אחד</h2>
        <p className={cn("t-4 order-last mt-0 lg:order-none lg:mt-6 leading-[1.6]", soft)}>
          <a href={CONTACT.phoneHref} className="rn-link">{CONTACT.phone}</a>
          <br />
          <a href={`mailto:${CONTACT.email}`} className="rn-link">{CONTACT.email}</a>
        </p>
      </div>

      {sent ? (
        <p role="status" data-reveal className={cn("t-3 self-end font-light", ink)}>תודה, נחזור אליך בקרוב.</p>
      ) : (
        <form data-reveal style={{ ["--d" as string]: "120ms" }} onSubmit={onSubmit} className="flex flex-col gap-8 lg:pt-3">
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
            <label className={cn("t-4 flex items-center gap-2", soft)}>
              <input type="checkbox" name="consent" required className="h-4 w-4 accent-[#a56332]" />
              <span>מאשר/ת את <a href={ROUTES.privacy} className="underline underline-offset-4">מדיניות הפרטיות</a></span>
            </label>
            <button type="submit" className={cn("t-4 rn-send-link group flex items-center gap-3", ink)}>
              <span className="rn-link">שליחה</span>
              <ArrowIcon className="h-[22px] w-[22px] -rotate-45 transition-transform duration-500 group-hover:-translate-x-1 group-hover:translate-y-1" />
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

