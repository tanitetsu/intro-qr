import { SavedDetailClient } from "@/components/saved/SavedDetailClient";

export default async function SavedDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SavedDetailClient savedId={id} />;
}
