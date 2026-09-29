import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-content">
        <div><Link className="footer-brand" href="/">Memory Book</Link><p>People. Stories. Generations.</p></div>
        <nav aria-label="Footer navigation"><Link href="/about">About</Link></nav>
        <p className="footer-note">Made for the stories worth keeping.</p>
      </div>
    </footer>
  );
}
