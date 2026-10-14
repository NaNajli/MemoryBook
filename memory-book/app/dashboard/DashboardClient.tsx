import { getCurrentUserId } from "@/lib/currentUser";

export default async function DashboardClient({ children }: { children: React.ReactNode }) {
  await getCurrentUserId();
  return <>{children}</>;
}
