import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מדיניות פרטיות · DotCome",
  description: "מדיניות הפרטיות של DotCome — איזה מידע אנחנו אוספים, למה ואיך מגינים עליו.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-28 md:px-6 md:py-36">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">מדיניות פרטיות</p>
      <h1 className="mt-3 font-display text-4xl font-black leading-[1.05] md:text-6xl">
        פרטיות המשתמש <span className="gradient-text">חשובה לנו</span>
      </h1>
      <p className="mt-4 text-sm text-muted">עדכון אחרון: {new Date().toLocaleDateString("he-IL")}</p>

      <div className="prose-invert mt-10 space-y-6 text-base leading-7 text-fg/90 md:text-lg">
        <Section title="1. כללי">
          <p>
            DotCome (להלן "אנחנו") מכבדת את פרטיות המשתמשים באתר dotcome.co.il. מסמך זה מסביר איזה
            מידע נאסף, לאילו מטרות, וכיצד אנחנו שומרים עליו, בהתאם לחוק הגנת הפרטיות,
            התשמ"א-1981 ולתקנות הנלוות.
          </p>
        </Section>

        <Section title="2. איזה מידע אנחנו אוספים">
          <ul className="list-disc space-y-2 pr-6">
            <li>פרטי קשר שאתם מוסרים מרצון בטופס יצירת הקשר (שם, אימייל, טלפון, תקציב משוער ותיאור הפרויקט).</li>
            <li>
              במסגרת חתימה על הסכם: שם מלא, תעודת זהות, כתובת, טלפון, אימייל, פרטי חברה (אם יש), חתימה
              דיגיטלית, כתובת IP, פרטי הדפדפן וחותמת זמן.
            </li>
            <li>נתוני שימוש אנונימיים מ-Vercel Analytics (דפים נצפים, דפדפן, מדינה) ללא איסוף זיהוי אישי.</li>
          </ul>
        </Section>

        <Section title="3. שימוש במידע">
          <ul className="list-disc space-y-2 pr-6">
            <li>מענה לפניות וניהול התקשרות עסקית.</li>
            <li>אימות זהות, תיעוד הסכמים ועמידה בדרישות דין.</li>
            <li>שיפור השירות וחוויית המשתמש באתר.</li>
          </ul>
        </Section>

        <Section title="4. העברת מידע לצדדים שלישיים">
          <p>
            המידע נשמר בשירותי ענן מאובטחים: Supabase (מסד הנתונים), Vercel (אחסון האתר) ו-Resend
            (שליחת אימיילים). לא נעביר מידע לצדדים שלישיים נוספים ללא הסכמה, למעט כנדרש על פי דין.
          </p>
        </Section>

        <Section title="5. אבטחת מידע">
          <p>
            המידע מועבר בהצפנת TLS, מאוחסן ב-Postgres עם Row-Level Security, וגישה אליו מוגבלת
            באמצעות מפתחות שירות. עם זאת, אין אפשרות לאבטח מערכת אינטרנטית באופן מוחלט.
          </p>
        </Section>

        <Section title="6. זכויות המשתמש">
          <p>
            באפשרותכם לפנות אלינו כדי לעיין במידע, לבקש תיקון או מחיקה, או לבטל הסכמה לשימוש עתידי.
            פנו אלינו במייל{" "}
            <a className="underline hover:text-neon-cyan" href="mailto:liamgolanbusiness@gmail.com">
              liamgolanbusiness@gmail.com
            </a>
            .
          </p>
        </Section>

        <Section title="7. עוגיות (Cookies)">
          <p>
            האתר משתמש בעוגיות טכניות הכרחיות לפעולה תקינה. איננו משתמשים בעוגיות שיווקיות או
            בפרסום מבוסס-עקיבה.
          </p>
        </Section>

        <Section title="8. שינויים במדיניות">
          <p>
            אנו רשאים לעדכן את מדיניות הפרטיות מעת לעת. התאריך בראש המסמך מציין את מועד העדכון האחרון.
          </p>
        </Section>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-black md:text-3xl">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
