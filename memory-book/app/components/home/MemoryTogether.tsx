import Image from "next/image";
import Link from "next/link";

export default function MemoryTogether() {
  return (
    <section className="together page-shell" aria-labelledby="together-heading">
      <div className="together-photo">
        <div className="together-photo-placeholder">
          <Image
            src="/images/home/family-memories.png"
            alt="Three generations looking through a family photo album together"
            fill
            sizes="(max-width: 760px) calc(100vw - 64px), 46vw"
          />
        </div>
        <div className="photo-caption"><span aria-hidden="true">✦</span><p>Every memory becomes part of something bigger.</p></div>
      </div>
      <div className="together-copy">
        <p className="eyebrow">Near or far, always connected</p>
        <h2 id="together-heading">Memories Are Better Together</h2>
        <p>No matter where your family is, everyone can contribute to a shared memory book. Keep your family&apos;s history alive, one story at a time.</p>
        <Link className="button" href="/register">Get Started Today</Link>
      </div>
    </section>
  );
}
