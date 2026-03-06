import type { HubTemplate } from "@/types/hub";
import TemplateCard from "./TemplateCard";
import CategoryTabs from "./CategoryTabs";

export default function TemplateGrid({
  templates,
  category,
}: {
  templates: HubTemplate[];
  category: string;
  search: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <CategoryTabs active={category} />
        <span className="text-sm text-[var(--text-muted)]">
          {templates.length} template{templates.length !== 1 ? "s" : ""}
        </span>
      </div>
      {templates.length === 0 ? (
        <p className="py-12 text-center text-[var(--text-muted)]">
          No templates found. Try a different search or category.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <TemplateCard key={t.slug} template={t} />
          ))}
        </div>
      )}
    </section>
  );
}
