import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/currentUser";

export default async function DashboardPage() {
  redirect(`/dashboard/${getCurrentUserId()}`);
}
