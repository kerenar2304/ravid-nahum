import { ArrowIcon, ROUTES, TetrisMark, useFluidScale } from "@/components/site/shared";

/* ===============================================================
   Ravid Nahum — 404
   The tetris of the logo mark lands, a short line, and the way home.
   =============================================================== */

export default function NotFound() {
  useFluidScale();
  return (
    <div dir="rtl" lang="he" className="fixed inset-0 flex flex-col items-center overflow-auto justify-center gap-[clamp(28px,5vh,48px)] bg-[#0c2e2e] px-[6vw] text-center font-arfilit text-stone">
      <TetrisMark className="h-[clamp(140px,24vmin,240px)] w-auto" />
      <div className="rn-404-text">
        <p className="t-4 font-['Num'] tracking-[.3em] text-stone/60" dir="ltr">404</p>
        <h1 className="t-2 mt-3 font-light">החלק הזה עוד לא נבנה</h1>
        <p className="t-4 mt-3 text-stone/70">העמוד שחיפשתם לא נמצא, אבל הבית עומד במקומו.</p>
      </div>
      <a href={ROUTES.home} className="rn-404-text group t-4 inline-flex items-center gap-3 border border-stone px-8 py-3 transition-colors hover:bg-stone hover:text-petrol">
        חזרה לדף הבית
        <ArrowIcon className="h-[1.2em] w-[1.2em] -rotate-45 transition-transform duration-500 group-hover:-translate-x-1 group-hover:translate-y-1" />
      </a>
    </div>
  );
}
