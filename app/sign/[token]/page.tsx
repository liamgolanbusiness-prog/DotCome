import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { renderContract } from "@/lib/contract";
import SignForm from "./SignForm";

export const dynamic = "force-dynamic";

type Params = { token: string };

export default async function SignPage({ params }: { params: Promise<Params> }) {
  const { token } = await params;

  const sb = supabaseAdmin();
  const { data: contract, error } = await sb
    .from("contracts")
    .select("id, token, client_name, project_description, price_amount, price_currency, status, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (error || !contract) notFound();

  if (contract.expires_at && new Date(contract.expires_at) < new Date()) {
    return (
      <ExpiredOrSigned title="הקישור פג תוקף" body="פנו אלינו לקבלת קישור חדש." />
    );
  }

  if (contract.status === "signed") {
    return (
      <ExpiredOrSigned title="ההסכם כבר נחתם" body="תודה! עותק חתום נשלח אליכם במייל." />
    );
  }

  if (contract.status === "voided") {
    return <ExpiredOrSigned title="הקישור בוטל" body="פנו אלינו לפרטים." />;
  }

  const contractText = renderContract({
    clientName: contract.client_name,
    priceAmount: Number(contract.price_amount),
    priceCurrency: contract.price_currency,
    projectDescription: contract.project_description,
  });

  return (
    <section className="relative mx-auto max-w-3xl px-5 py-28 md:px-6 md:py-36">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.2),transparent_60%)]"
      />

      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">חתימת הסכם</p>
        <h1 className="mt-3 font-display text-3xl font-black leading-[1.05] md:text-5xl">
          חתימה דיגיטלית <span className="gradient-text">על ההסכם</span>
        </h1>
        <p className="mt-4 text-muted">
          קראו את ההסכם, מלאו את הפרטים שלכם וחתמו. העותק החתום יישלח אליכם במייל.
        </p>
      </header>

      <article className="mb-8 max-h-[50vh] overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-7 whitespace-pre-wrap md:p-8 md:text-base">
        {contractText}
      </article>

      <SignForm
        token={contract.token}
        contractText={contractText}
        prefillName={contract.client_name ?? ""}
      />
    </section>
  );
}

function ExpiredOrSigned({ title, body }: { title: string; body: string }) {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl font-black md:text-6xl">{title}</h1>
      <p className="mt-4 max-w-md text-muted">{body}</p>
    </section>
  );
}
