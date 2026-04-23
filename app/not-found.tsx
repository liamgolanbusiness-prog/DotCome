import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.25),transparent_60%)]"
      />
      <p className="font-display text-sm uppercase tracking-[0.3em] text-muted">404</p>
      <h1 className="mt-4 font-display text-5xl font-black leading-[1.05] md:text-7xl">
        הדף <span className="gradient-text">לא נמצא</span>
      </h1>
      <p className="mt-5 max-w-md text-base text-muted md:text-lg">
        הקישור שבחרתם לא קיים או הוזז. חזרו לדף הבית ונמשיך משם.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-neon-gradient px-6 py-3 text-sm font-semibold text-ink-950 transition-all hover:scale-[1.05] md:text-base"
      >
        חזרה לדף הבית
      </Link>
    </section>
  );
}
