import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { hashContract, renderContract } from "@/lib/contract";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  token: string;
  contractText: string;
  signatureDataUrl: string;
  agreed: boolean;
  fullName: string;
  idNumber: string;
  address: string;
  phone: string;
  email: string;
  companyName?: string;
  companyId?: string;
};

const OWNER_EMAIL = "liamgolanbusiness@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "DotCome <onboarding@resend.dev>";

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const required: (keyof Payload)[] = [
    "token", "contractText", "signatureDataUrl", "fullName",
    "idNumber", "address", "phone", "email",
  ];
  for (const k of required) {
    if (!body[k]) return NextResponse.json({ error: `שדה חסר: ${k}` }, { status: 400 });
  }
  if (!body.agreed) {
    return NextResponse.json({ error: "חובה לאשר את תנאי ההסכם" }, { status: 400 });
  }
  if (!/^\d{9}$/.test(body.idNumber)) {
    return NextResponse.json({ error: "תעודת זהות לא תקינה" }, { status: 400 });
  }
  if (!body.signatureDataUrl.startsWith("data:image/png;base64,")) {
    return NextResponse.json({ error: "חתימה לא תקינה" }, { status: 400 });
  }

  const sb = supabaseAdmin();

  const { data: contract, error: cErr } = await sb
    .from("contracts")
    .select("id, token, client_name, project_description, price_amount, price_currency, status, expires_at")
    .eq("token", body.token)
    .maybeSingle();

  if (cErr || !contract) {
    return NextResponse.json({ error: "הקישור לא תקין" }, { status: 404 });
  }
  if (contract.status !== "pending") {
    return NextResponse.json({ error: "ההסכם כבר נחתם או בוטל" }, { status: 409 });
  }
  if (contract.expires_at && new Date(contract.expires_at) < new Date()) {
    return NextResponse.json({ error: "הקישור פג תוקף" }, { status: 410 });
  }

  // Re-render the contract server-side and verify the client signed the same text
  const serverText = renderContract({
    clientName: contract.client_name,
    priceAmount: Number(contract.price_amount),
    priceCurrency: contract.price_currency,
    projectDescription: contract.project_description,
  });
  if (serverText !== body.contractText) {
    return NextResponse.json({ error: "תוכן ההסכם השתנה. רעננו את הדף ונסו שוב." }, { status: 409 });
  }
  const contractHash = hashContract(serverText);

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;
  const userAgent = req.headers.get("user-agent");

  const { data: sigRow, error: sErr } = await sb
    .from("signatures")
    .insert({
      contract_id: contract.id,
      full_name: body.fullName,
      id_number: body.idNumber,
      address: body.address,
      phone: body.phone,
      email: body.email,
      company_name: body.companyName || null,
      company_id: body.companyId || null,
      signature_data_url: body.signatureDataUrl,
      contract_text: serverText,
      contract_hash: contractHash,
      agreed: true,
      ip,
      user_agent: userAgent,
    })
    .select("id, signed_at")
    .single();

  if (sErr || !sigRow) {
    return NextResponse.json({ error: "שמירה נכשלה", detail: sErr?.message }, { status: 500 });
  }

  await sb
    .from("contracts")
    .update({ status: "signed", signed_at: sigRow.signed_at })
    .eq("id", contract.id);

  // Email both parties (best-effort)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const sigBase64 = body.signatureDataUrl.replace(/^data:image\/png;base64,/, "");
      const attachments = [
        { filename: "signature.png", content: sigBase64 },
        { filename: "contract.txt", content: Buffer.from(serverText, "utf8").toString("base64") },
      ];
      const summary = `
שם: ${body.fullName}
ת.ז.: ${body.idNumber}
כתובת: ${body.address}
טלפון: ${body.phone}
אימייל: ${body.email}
חברה: ${body.companyName || "-"} ${body.companyId ? `(${body.companyId})` : ""}
תאריך חתימה: ${new Date(sigRow.signed_at).toLocaleString("he-IL")}
IP: ${ip ?? "-"}
Hash: ${contractHash}
`.trim();

      await Promise.all([
        resend.emails.send({
          from: FROM_EMAIL,
          to: OWNER_EMAIL,
          subject: `הסכם נחתם — ${body.fullName}`,
          text: summary,
          attachments,
        }),
        resend.emails.send({
          from: FROM_EMAIL,
          to: body.email,
          subject: "אישור חתימה על הסכם — DotCome",
          text: `שלום ${body.fullName},\n\nמצורף עותק של ההסכם שחתמתם עליו ב-${new Date(sigRow.signed_at).toLocaleString("he-IL")}.\n\nתודה,\nDotCome`,
          attachments,
        }),
      ]);
    } catch (e) {
      console.error("email send failed", e);
    }
  }

  return NextResponse.json({ ok: true, id: sigRow.id });
}
