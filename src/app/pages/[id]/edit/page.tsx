import { EditPageClient } from "@/components/pages/EditPageClient";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditPageClient pageId={id} />;
}
