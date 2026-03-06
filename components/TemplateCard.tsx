import Link from "next/link";
import type { HubTemplate } from "@/types/hub";

const categoryColors: Record<string, { bg: string; text: string }> = {
  agent: { bg: "rgba(203,166,247,0.15)", text: "var(--purple)" },
  workflow: { bg: "rgba(137,180,250,0.15)", text: "var(--blue)" },
  document: { bg: "rgba(166,227,161,0.15)", text: "var(--green)" },
};

export default function TemplateCard({
  template,
}: {
  template: HubTemplate;
}) {
  const colors = categoryColors[template.category] ?? categoryColors.document;

  return (
    <Link
      href={`/templates/${template.slug}`}
      className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--purple)]"
    >
      <span
        className="mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase"
        style={{ background: colors.bg, color: colors.text }}
      >
        {template.category}
      </span>
      <h3 className="mb-1 text-lg font-bold text-[var(--text)] group-hover:text-[var(--purple)]">
        {template.name}
      </h3>
      <p className="mb-4 line-clamp-2 text-sm text-[var(--text-muted)]">
        {template.description}
      </p>
      <div className="mt-auto flex flex-wrap gap-2">
        {template.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
          >
            {tag}
          </span>
        ))}
      </div>
      <span className="mt-3 text-xs font-medium text-[var(--purple)] opacity-0 transition-opacity group-hover:opacity-100">
        View template →
      </span>
    </Link>
  );
}
