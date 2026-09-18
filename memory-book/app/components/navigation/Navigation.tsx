import AuthenticatedNavigation from "./AuthenticatedNavigation";
import PublicNavigation from "./PublicNavigation";

type NavigationProps = {
  variant?: "public" | "authenticated";
};

export default function Navigation({ variant = "public" }: NavigationProps) {
  // TODO: Replace this explicit variant with the real authentication session
  // once authentication is implemented and configured for the application.
  return variant === "authenticated" ? (
    <AuthenticatedNavigation />
  ) : (
    <PublicNavigation />
  );
}
