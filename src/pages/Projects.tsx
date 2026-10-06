import { useState } from "react";
import { ArrowIcon, FlipText, Footer, Header, Loader, ROUTES, cn, useReveal } from "@/components/site/shared";
import { PROJECTS, ProjectCard, type Project } from "@/components/site/projects-data";

/* ===============================================================
   Ravid Nahum — Projects
   Same visual language as the home page: the terracotta arch,
   the poster cards (interior behind, arched window onto the exterior)
   and the 4-step type scale.
   =============================================================== */

const FILTERS: { key: "all" | Project["kind"]; label: string }[] = [
  { key: "all", label: "הכל" },
  { key: "private", label: "בתים פרטיים" },
  { key: "apartment", label: "דירות" },
  { key: "commercial", label: "מסחרי ומשרדים" },
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  useReveal([filter]); // re-observe the cards after every filter change
  const list = PROJECTS.filter((p) => filter === "all" || p.kind === filter);

  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-stone font-arfilit text-petrol">
      <Loader />
      <Header active="projects" />
      <main id="main">
        {/* the arch, then the grid on terracotta */}
        <section aria-label="רשימת הפרויקטים" className="relative">
          <div className="relative mt-[clamp(24px,5vw,64px)] flex min-h-[clamp(320px,50vw,662px)] w-full flex-col items-center justify-end rounded-t-[50%_100%] bg-terra px-[6vw] pb-[4%] text-center text-stone">
            <p data-reveal className="t-4 tracking-[.25em] text-stone/80">תיק עבודות</p>
            <h1 data-reveal="flip" className="t-1 mt-3 font-light">
              <FlipText text="פרויקטים" className="block" />
            </h1>
            <p data-reveal style={{ ["--d" as string]: "150ms" }} className="t-3 mb-[clamp(24px,4vw,48px)] mt-4 max-w-[560px] font-light text-stone/85">
              בתים, דירות וחללי עבודה שתוכננו מהמגרש ועד הידית. כולם נולדו על אותו שולחן.
            </p>
            {/* filters */}
            <div role="tablist" aria-label="סינון פרויקטים" className="relative mx-auto flex flex-wrap justify-center gap-2 px-[6vw] sm:gap-3">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={filter === f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "t-4 rounded-full border border-stone/60 px-5 py-2 transition-colors duration-300",
                    filter === f.key ? "bg-stone text-petrol" : "text-stone hover:bg-stone/15",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="t-4 mt-5 text-center text-stone/75" aria-live="polite">
              <span className="font-['Num']">{list.length}</span> פרויקטים
            </p>
          </div>

          <div className="-mt-px bg-terra pb-24 text-stone lg:pb-[140px]">
            <ul key={filter} className="mx-auto grid gap-6 px-[4vw] pt-10 sm:grid-cols-2 sm:gap-x-[4vw] sm:gap-y-12 lg:w-[1133px] lg:gap-x-[64px] lg:gap-y-[72px] lg:px-0 lg:pt-[40px]">
              {list.map((p, i) => (
                <li key={p.slug} className={cn("rn-grid-in", i % 2 === 1 && "sm:mt-[18%]")} style={{ animationDelay: `${i * 90}ms` }}>
                  <ProjectCard p={p} className="aspect-[4/5] w-full" />
                  <p className="t-4 mt-3 flex justify-between text-stone/80">
                    <span>{p.meta.replace(" · ", " — ")}</span>
                    <span className="font-['Num']">{p.year}</span>
                  </p>
                </li>
              ))}
            </ul>

            {/* call to action */}
            <div className="mx-auto mt-24 flex flex-col items-center gap-6 px-[6vw] text-center lg:mt-[140px]">
              <p className="t-2 font-light">יש לכם מגרש, בית או חלל?</p>
              <a href={ROUTES.contact} className="rn-send-link group t-3 inline-flex items-center gap-3 rounded-full border border-stone px-8 py-3 transition-colors hover:bg-stone hover:text-petrol">
                בואו נתחיל מקו אחד
                <ArrowIcon className="h-[1em] w-[1em] -rotate-45 transition-transform duration-500 group-hover:-translate-x-1 group-hover:translate-y-1" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
