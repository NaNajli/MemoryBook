import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero page-shell" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="eyebrow">Because every family has a story.</p>
        <h1 id="hero-heading">Preserve the Stories That Matter</h1>
        <p className="hero-description">
          Turn your family&apos;s photos, memories, and stories into a beautiful
          collection you&apos;ll treasure for generations.
        </p>
        <div className="button-row">
          <Link className="button" href="/register">Create a Memory Book</Link>
          <Link className="button button-secondary" href="#how-it-works">Learn More <span aria-hidden="true">↓</span></Link>
        </div>
        <p className="keepsake-note"><span aria-hidden="true">♥</span> Made to be shared. Designed to be kept.</p>
      </div>

      <div className="hero-art" aria-label="A scrapbook-style collection of family memory placeholders">
        <div className="paper-scrap paper-scrap-one" aria-hidden="true" />
        <div className="paper-scrap paper-scrap-two" aria-hidden="true" />
        <div className="photo-card photo-card-main">
          <div className="photo-placeholder photo-placeholder-family">
            <Image
              src="/images/home/hero-family.png"
              alt="A family gathered together beside a lake at sunset"
              fill
              priority
              sizes="(max-width: 520px) 70vw, (max-width: 760px) 60vw, 34vw"
            />
          </div>
          <p>Together is our favorite place</p>
        </div>
        <div className="photo-card photo-card-small">
          <div className="tape tape-two" aria-hidden="true" />
          <div className="photo-placeholder photo-placeholder-landscape">
            <Image
              src="/images/home/memory-photo-1.png"
              alt="A child gathering wildflowers on a sunny summer afternoon"
              fill
              sizes="(max-width: 760px) 44vw, 24vw"
            />
          </div>
          <p>Summer memories</p>
        </div>
        <div className="tape tape-one" aria-hidden="true" />
        <span className="doodle-heart" aria-hidden="true">♡</span>
        <span className="doodle-sparkle" aria-hidden="true">✦</span>
      </div>
    </section>
  );
}
