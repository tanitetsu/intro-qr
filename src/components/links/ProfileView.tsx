import { LinkCard } from "@/components/links/LinkCard";
import type { ProfilePage } from "@/lib/types";

export function ProfileView({
  page,
  showPageTitle = false,
}: {
  page: ProfilePage;
  showPageTitle?: boolean;
}) {
  const interestLinks = [...page.links]
    .sort((a, b) => a.order - b.order)
    .filter((l) => l.type === "interest" || l.type === "org");
  const contactLinks = [...page.links]
    .sort((a, b) => a.order - b.order)
    .filter((l) => l.type === "contact" || l.type === "other");

  const ordered =
    interestLinks.length || contactLinks.length
      ? [...interestLinks, ...contactLinks]
      : [...page.links].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-5">
      <header className="space-y-2">
        {showPageTitle ? (
          <p className="text-xs font-medium tracking-wide text-violet-700">
            {page.title}
          </p>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {page.displayName}
        </h1>
        {page.bio ? (
          <p className="text-sm leading-6 text-zinc-600">{page.bio}</p>
        ) : null}
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-800">リンク</h2>
        {ordered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-4 text-sm text-zinc-500">
            まだリンクがありません。
          </p>
        ) : (
          <div className="space-y-3">
            {ordered.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
