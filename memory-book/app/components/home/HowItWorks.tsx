const steps = [
  { number: "01", title: "Create", description: "Start a book and choose a topic, or get inspired with suggested topics.", icon: "book" },
  { number: "02", title: "Invite", description: "Invite family and friends to contribute photos, memories, and stories.", icon: "people" },
  { number: "03", title: "Remember", description: "Everyone can add photos, descriptions, memories, and anecdotes.", icon: "heart" },
  { number: "04", title: "Bring It Together", description: "View everyone's contributions together in one shared memory book.", icon: "album" },
] as const;

function StepIcon({ icon }: { icon: (typeof steps)[number]["icon"] }) {
  if (icon === "people") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="11" r="4" /><circle cx="23" cy="13" r="3" /><path d="M4.5 25c.8-5.2 3.3-8 7.5-8s6.7 2.8 7.5 8M19 19c4.7-.8 7.5 1.2 8.5 6" /></svg>;
  if (icon === "heart") return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 26S5 20 5 12.5A6.5 6.5 0 0 1 16 7.8a6.5 6.5 0 0 1 11 4.7C27 20 16 26 16 26Z" /><path d="M12 13h8M16 9v8" /></svg>;
  if (icon === "album") return <svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="5" width="20" height="22" rx="2" /><path d="M11 5v22M15 12h6M15 17h6" /></svg>;
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 7h9a4 4 0 0 1 4 4v16H9a4 4 0 0 1-4-4V7Z" /><path d="M18 11a4 4 0 0 1 4-4h5v16a4 4 0 0 0-4 4h-5" /></svg>;
}

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works" aria-labelledby="how-it-works-heading">
      <div className="page-shell">
        <div className="section-heading">
          <p className="eyebrow">A story made by everyone</p>
          <h2 id="how-it-works-heading">How It Works</h2>
          <p>Four simple steps turn scattered moments into something your family can hold onto.</p>
        </div>
        <ol className="steps-grid">
          {steps.map((step) => (
            <li className="step-card" key={step.number}>
              <div className="step-card-top"><span className="step-icon"><StepIcon icon={step.icon} /></span><span className="step-number">{step.number}</span></div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
