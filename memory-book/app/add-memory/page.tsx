import { getCurrentUserId } from "@/lib/currentUser";
import { notFound } from "next/navigation";
import { resolveCollectionUser } from "@/lib/shareLinks";
import AddMemoryForm from "./AddMemoryForm";

export const metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function AddMemoryPage({ searchParams }: {
  searchParams: Promise<{ share?: string; userId?: string }>;
}) {
  const { share, userId } = await searchParams;
  if (share === undefined) await getCurrentUserId();
  if (userId !== undefined || await resolveCollectionUser(share) === null) notFound();
  return <AddMemoryForm share={share} />;
}
