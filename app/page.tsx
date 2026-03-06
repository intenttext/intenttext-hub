import { Suspense } from "react";
import { getTemplates } from "@/lib/templates";
import TemplateGrid from "@/components/TemplateGrid";
import HubHeader from "@/components/HubHeader";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const category = searchParams.category ?? "all";
  const search = searchParams.q ?? "";

  const templates = await getTemplates({ category, search });

  return (
    <main>
      <Suspense>
        <HubHeader />
      </Suspense>
      <Suspense>
        <TemplateGrid
          templates={JSON.parse(JSON.stringify(templates))}
          category={category}
          search={search}
        />
      </Suspense>

      {/* Coming Soon */}
      <section className="mx-auto max-w-6xl border-t border-[var(--border)] px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-muted)]">
              Coming Soon
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              GitHub OAuth · intenttext install CLI · Template composition ·
              Star &amp; fork · Org templates
            </p>
          </div>
          <Link
            href="/submit"
            className="rounded-lg bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--purple)] hover:bg-[var(--border)]"
          >
            Submit a template
          </Link>
        </div>
      </section>
    </main>
  );
}
