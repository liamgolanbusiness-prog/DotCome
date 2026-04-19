export default function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 inline-flex items-center gap-4 text-sm font-medium uppercase tracking-[0.3em] text-neon-cyan">
      <span className="h-px w-12 bg-gradient-to-l from-neon-cyan to-transparent" />
      {children}
    </div>
  );
}
