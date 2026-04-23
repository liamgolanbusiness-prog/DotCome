import { he } from "@/content/he";

export default function Footer() {
  const cols = he.footer.columns;
  return (
    <footer className="relative border-t border-white/5 bg-ink-950 pt-16 md:pt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="grid gap-8 md:gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <h3 className="font-display text-4xl font-black leading-none md:text-5xl">
              {he.footer.heading}
            </h3>
            <p className="mt-4 max-w-xs text-sm text-muted">
              {he.footer.made}
            </p>
            <a
              href="mailto:liamgolanbusiness@gmail.com"
              className="mt-6 inline-flex items-center gap-2 text-sm text-neon-cyan hover:text-fg"
            >
              liamgolanbusiness@gmail.com ←
            </a>
          </div>

          {/* Link columns — 3 columns on mobile, inline with brand on md+ */}
          <div className="grid grid-cols-3 gap-4 md:contents">
            {[cols.studio, cols.services, cols.social].map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-xs uppercase tracking-[0.2em] text-muted md:mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2 md:space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-fg/80 hover:text-fg">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none mt-16 w-full select-none overflow-clip md:mt-24"
      >
        <div
          dir="ltr"
          className="w-full bg-neon-gradient bg-clip-text text-center font-display font-black leading-[0.9] text-transparent"
          style={{ fontSize: "clamp(3.5rem, 19vw, 22rem)" }}
        >
          DotCome
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 py-6 text-xs text-muted md:flex-row md:gap-4 md:py-8">
          <span>{he.footer.copy}</span>
          <span className="tracking-[0.2em]">Tel Aviv · Worldwide</span>
        </div>
      </div>
    </footer>
  );
}
