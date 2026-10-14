import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/currentUser";

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  redirect(`/dashboard/${userId}`);
}
