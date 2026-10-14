import { getCurrentUserId } from "@/lib/currentUser";

export default async function AccountPage() {
  await getCurrentUserId();
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Account</h1>
      <p>Authentication connected successfully.</p>
    </main>
  );
}