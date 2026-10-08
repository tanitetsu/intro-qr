import { PublicPageClient } from "@/components/public/PublicPageClient";

export default async function LocalPublicPage({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;
  return <PublicPageClient pageId={pageId} />;
}
