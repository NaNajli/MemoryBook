import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";

export async function getCurrentUserId(): Promise<number> {
  const userId = await getSessionUserId();
  if (userId === null) redirect("/login");
  return userId;
}
