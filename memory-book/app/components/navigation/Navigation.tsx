import AuthenticatedNavigation from "./AuthenticatedNavigation";
import PublicNavigation from "./PublicNavigation";

type NavigationProps = {
  variant?: "public" | "authenticated";
};

export default function Navigation({ variant = "public" }: NavigationProps) {
  // Navigation presentation only; pages and API routes enforce session access.
  return variant === "authenticated" ? (
    <AuthenticatedNavigation />
  ) : (
    <PublicNavigation />
  );
}
