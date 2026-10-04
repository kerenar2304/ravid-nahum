import { type CSSProperties } from "react";
import { ROUTES, cn } from "@/components/site/shared";

/* Projects: data + the "poster" card shared by the home page and the projects page */
export type Project = { slug: string; name: string; meta: string; text: string; exterior: string; interior: string; kind: "private" | "apartment" | "commercial"; year: string };

export const PROJECTS: Project[] = [
  {
    slug: "moshav",
    name: "בית במושב",
    meta: "בית פרטי · השרון",
    text: "קומה אחת סביב בריכה, וכל חדר נפתח אל הגינה.",
    exterior: "/assets/project-moshav-exterior.jpg",
    interior: "/assets/project-moshav-interior.jpg",
    kind: "private",
    year: "2024",
  },
  {
    slug: "zichron",
    name: "בית אבן בזכרון יעקב",
    meta: "שימור ותוספת · זכרון יעקב",
    text: "קירות אבן מקוריים, קשתות, ותוספת פלדה וזכוכית שנפתחת לנוף.",
    exterior: "/assets/project-zichron-exterior.jpg",
    interior: "/assets/project-zichron-interior.jpg",
    kind: "private",
    year: "2023",
  },
  {
    slug: "herzliya",
    name: "פנטהאוז בהרצליה פיתוח",
    meta: "דירת גג · הרצליה פיתוח",
    text: "קומה אחרונה מול הים, עם מרפסת שמתנהגת כמו עוד חדר בבית.",
    exterior: "/assets/project-herzliya-exterior.jpg",
    interior: "/assets/project-herzliya-interior.jpg",
    kind: "apartment",
    year: "2025",
  },
  {
    slug: "clinic",
    name: "קליניקה ברמת השרון",
    meta: "מסחרי · רמת השרון",
    text: "מרחב קבלה רך, עץ ואור טבעי, שמרגיע עוד לפני שנכנסים לחדר.",
    exterior: "/assets/project-clinic-exterior.jpg",
    interior: "/assets/project-clinic-interior.jpg",
    kind: "commercial",
    year: "2024",
  },
  {
    slug: "hitech",
    name: "משרדי הייטק",
    meta: "משרדים · תל אביב",
    text: "קומת עבודה פתוחה מול קו הרקיע, עם זכוכית, ירוק ופלדה שחורה.",
    exterior: "/assets/project-hitech-exterior.jpg",
    interior: "/assets/project-hitech-interior.jpg",
    kind: "commercial",
    year: "2025",
  },
];

/* Interior photo fills the card; a stone "poster" panel sits on it with an arched window onto the exterior. */
export function ProjectCard({ p, className, delay = 0 }: { p: Project; className?: string; delay?: number }) {
  const [type, place] = p.meta.split(" · ");
  return (
    <a
      href={ROUTES.projects}
      data-reveal="unveil"
      style={{ ["--d" as string]: `${delay}ms` } as CSSProperties}
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
