import { redirect } from "next/navigation";

export default async function SaveRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const { url } = await searchParams;
  if (url) {
    try {
      const parsed = new URL(url, "http://localhost");
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts[0] === "s" && parts[1]) {
        redirect(`/s/${parts[1]}`);
      }
      if (parts[0] === "u" && parts[1]) {
        redirect(`/u/${parts[1]}`);
      }
    } catch {
      // ignore
    }
  }
  redirect("/");
}
