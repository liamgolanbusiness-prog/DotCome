import { createHash } from "crypto";

export type ContractVars = {
  clientName?: string | null;
  priceAmount: number;
  priceCurrency: string;
  projectDescription?: string | null;
};

// TODO: replace the body with the real contract text provided by the business.
// Use placeholders: {{clientName}}, {{priceAmount}}, {{priceCurrency}}, {{projectDescription}}, {{date}}.
const TEMPLATE = `הסכם למתן שירותי עיצוב ופיתוח אתרי אינטרנט

בין: DotCome (להלן "נותן השירות")
לבין: {{clientName}} (להלן "הלקוח")

תאריך: {{date}}

1. מהות ההתקשרות
נותן השירות יספק ללקוח שירותי עיצוב, פיתוח והקמה של אתר אינטרנט, בהתאם למפרט: {{projectDescription}}.

2. תמורה
הלקוח ישלם לנותן השירות סך של {{priceAmount}} {{priceCurrency}} בתוספת מע"מ כחוק.

3. [PLACEHOLDER — שאר סעיפי ההסכם יוכנסו כאן לאחר שתספקו את הטקסט המלא]

חתימת הלקוח מהווה אישור לכך שקרא/ה את ההסכם על כל סעיפיו והסכים/ה לתנאיו.
`;

export function renderContract(vars: ContractVars): string {
  const today = new Date().toLocaleDateString("he-IL");
  return TEMPLATE.replaceAll("{{clientName}}", vars.clientName ?? "________________")
    .replaceAll("{{priceAmount}}", vars.priceAmount.toLocaleString("he-IL"))
    .replaceAll("{{priceCurrency}}", vars.priceCurrency)
    .replaceAll("{{projectDescription}}", vars.projectDescription ?? "________________")
    .replaceAll("{{date}}", today);
}

export function hashContract(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}
