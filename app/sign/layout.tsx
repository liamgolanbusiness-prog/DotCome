import Image from "next/image";
import Link from "next/link";

export default function SignLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3 md:px-6">
          <Link href="/" dir="ltr" className="flex items-center gap-2 font-display text-lg font-black">
            <Image src="/logo.png" alt="DotCome" width={28} height={28} className="h-6 w-6" />
            <span>DotCome</span>
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-muted">חתימת הסכם</span>
        </div>
      </header>
      {children}
    </>
  );
}
