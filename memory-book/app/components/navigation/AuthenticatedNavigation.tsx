import Link from "next/link";

const authenticatedLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "My Books" },
  { href: "/account", label: "Account" },
];

export default function AuthenticatedNavigation() {
  return (
    <header className="site-header">
      <nav className="site-nav page-shell" aria-label="Account navigation">
        <Link className="brand" href="/">
          <span className="brand-mark brand-initials" aria-hidden="true">MB</span>
          <span>Memory Book</span>
        </Link>
        <div className="nav-menu authenticated-menu">
          <div className="nav-links">
            {authenticatedLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </div>
          {/* TODO: Connect this control to the authentication provider's sign-out action. */}
          <button className="nav-logout" type="button" disabled title="Available after authentication is connected">Log Out</button>
        </div>
      </nav>
    </header>
  );
}
