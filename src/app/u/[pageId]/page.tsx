import { CloudOrLocalPublicPage } from "@/components/public/CloudOrLocalPublicPage";

export default async function LocalPublicPage({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;
  return <CloudOrLocalPublicPage pageId={pageId} />;
}
