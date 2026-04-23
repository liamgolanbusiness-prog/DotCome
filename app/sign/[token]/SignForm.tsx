"use client";

import { useState } from "react";
import SignaturePad from "@/components/ui/SignaturePad";
import Button from "@/components/ui/Button";

type Props = {
  token: string;
  contractText: string;
  prefillName?: string;
};

type FormState = {
  fullName: string;
  idNumber: string;
  address: string;
  phone: string;
  email: string;
  companyName: string;
  companyId: string;
};

export default function SignForm({ token, contractText, prefillName = "" }: Props) {
  const [form, setForm] = useState<FormState>({
    fullName: prefillName,
    idNumber: "",
    address: "",
    phone: "",
    email: "",
    companyName: "",
    companyId: "",
  });
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signatureDataUrl) {
      setError("נא לחתום בחלון החתימה");
      return;
    }
    if (!agreed) {
      setError("יש לאשר שקראתם והסכמתם לתנאים");
      return;
    }
    if (!/^\d{9}$/.test(form.idNumber)) {
      setError("תעודת זהות חייבת להכיל 9 ספרות");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          contractText,
          signatureDataUrl,
          agreed,
          ...form,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "שגיאה בשליחה");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה לא צפויה");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl">
        <h2 className="font-display text-3xl font-black md:text-4xl">תודה! ✦</h2>
        <p className="mt-3 text-muted">ההסכם נחתם בהצלחה. עותק חתום נשלח אליכם למייל.</p>
      </div>
    );
  }

  const field = (
    label: string,
    key: keyof FormState,
    opts?: { type?: string; required?: boolean; placeholder?: string; dir?: "ltr" | "rtl" }
  ) => (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">{label}</label>
      <input
        type={opts?.type ?? "text"}
        required={opts?.required ?? true}
        value={form[key]}
        onChange={set(key)}
        placeholder={opts?.placeholder}
        dir={opts?.dir}
        className="w-full rounded-xl border border-white/10 bg-ink-950/50 px-4 py-3 text-fg outline-none transition-all focus:border-neon-violet focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
      />
    </div>
  );

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        {field("שם מלא", "fullName")}
        {field("תעודת זהות", "idNumber", { placeholder: "9 ספרות", dir: "ltr" })}
        {field("כתובת", "address")}
        {field("טלפון", "phone", { type: "tel", dir: "ltr" })}
        {field("אימייל", "email", { type: "email", dir: "ltr" })}
        <div />
        {field("שם חברה (אם יש)", "companyName", { required: false })}
        {field("ח.פ. / ע.מ. (אם יש)", "companyId", { required: false, dir: "ltr" })}
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">חתימה</label>
        <SignaturePad onChange={setSignatureDataUrl} />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 accent-neon-violet"
        />
        <span>
          קראתי את ההסכם במלואו, הבנתי את תוכנו ואני מסכים/ה לכל תנאיו. חתימתי הדיגיטלית מהווה
          הסכמה מחייבת בהתאם לחוק חתימה אלקטרונית, התשס&quot;א-2001.
        </span>
      </label>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? "שולח..." : "חתימה ושליחה"}
      </Button>
    </form>
  );
}
