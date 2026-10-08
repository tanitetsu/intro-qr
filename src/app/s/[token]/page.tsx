import { SharedPageClient } from "@/components/public/SharedPageClient";

export default async function SharedPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <SharedPageClient token={decodeURIComponent(token)} />;
}
