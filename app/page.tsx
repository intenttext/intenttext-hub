import { Suspense } from "react";
import { getTemplates, getTemplateCount } from "@/lib/templates";
import TemplateGrid from "@/components/TemplateGrid";
import HubHeader from "@/components/HubHeader";

const PAGE_SIZE = 12;

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; page?: string };
}) {
  const category = searchParams.category ?? "all";
  const search = searchParams.q ?? "";
  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const skip = (page - 1) * PAGE_SIZE;

  const [templates, total] = await Promise.all([
    getTemplates({ category, search, limit: PAGE_SIZE, skip }),
    getTemplateCount({ category, search }),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

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
          page={page}
          totalPages={totalPages}
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
        </div>
      </section>
    </main>
  );
}
