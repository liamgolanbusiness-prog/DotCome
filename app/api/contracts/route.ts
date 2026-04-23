import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateBody = {
  clientName?: string;
  projectDescription?: string;
  priceAmount: number;
  priceCurrency?: string;
  expiresInDays?: number;
};

function auth(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CreateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.priceAmount !== "number" || body.priceAmount <= 0) {
    return NextResponse.json({ error: "priceAmount must be a positive number" }, { status: 400 });
  }

  const token = randomBytes(24).toString("base64url");
  const expiresAt = body.expiresInDays
    ? new Date(Date.now() + body.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("contracts")
    .insert({
      token,
      client_name: body.clientName ?? null,
      project_description: body.projectDescription ?? null,
      price_amount: body.priceAmount,
      price_currency: body.priceCurrency ?? "ILS",
      expires_at: expiresAt,
    })
    .select("id, token, expires_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Insert failed" }, { status: 500 });
  }

  const origin = req.headers.get("origin") ?? "https://dotcome.co.il";
  return NextResponse.json({
    id: data.id,
    token: data.token,
    url: `${origin}/sign/${data.token}`,
    expiresAt: data.expires_at,
  });
}
