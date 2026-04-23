import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "תנאי שימוש · DotCome",
  description: "תנאי השימוש של אתר DotCome.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-28 md:px-6 md:py-36">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">תנאי שימוש</p>
      <h1 className="mt-3 font-display text-4xl font-black leading-[1.05] md:text-6xl">
        תנאי <span className="gradient-text">שימוש באתר</span>
      </h1>
      <p className="mt-4 text-sm text-muted">עדכון אחרון: {new Date().toLocaleDateString("he-IL")}</p>

      <div className="mt-10 space-y-6 text-base leading-7 text-fg/90 md:text-lg">
        <Section title="1. כללי">
          <p>
            ברוכים הבאים ל-DotCome. השימוש באתר dotcome.co.il כפוף לתנאים שלהלן. כניסה לאתר או שימוש
            בשירותיו מהווים הסכמה מלאה לתנאים אלה. אם אינכם מסכימים לתנאים, אנא הימנעו משימוש באתר.
          </p>
        </Section>

        <Section title="2. השירות">
          <p>
            האתר מציג את שירותי הסטודיו, מאפשר יצירת קשר וחתימה דיגיטלית על הסכמים. אנו שומרים את
            הזכות לשנות או להפסיק חלקים מהשירות בכל עת וללא הודעה מוקדמת.
          </p>
        </Section>

        <Section title="3. קניין רוחני">
          <p>
            כל התכנים באתר — עיצוב, טקסטים, קוד, גרפיקה ותמונות — הם רכושה הבלעדי של DotCome או של
            בעלי הזכויות הרלוונטיים. אין להעתיק, לשכפל, להפיץ או לעשות שימוש מסחרי בתכנים ללא אישור
            מראש ובכתב.
          </p>
        </Section>

        <Section title="4. חתימה דיגיטלית">
          <p>
            חתימה דיגיטלית המבוצעת באתר באמצעות עמוד החתימה הייעודי נחשבת לחתימה אלקטרונית רגילה
            בהתאם לחוק חתימה אלקטרונית, התשס"א-2001, ומהווה הסכמה מחייבת לתוכן המסמך שנחתם.
          </p>
        </Section>

        <Section title="5. הגבלת אחריות">
          <p>
            האתר מוצע "כפי שהוא" (AS-IS). אין אנו אחראים לנזקים עקיפים, תוצאתיים או מיוחדים הנובעים
            משימוש באתר או מהסתמכות על תכניו. אחריותנו הכוללת בכל מקרה לא תעלה על התמורה ששולמה עבור
            השירות הספציפי.
          </p>
        </Section>

        <Section title="6. פרטיות">
          <p>
            השימוש באתר כפוף גם ל
            <a className="mx-1 underline hover:text-neon-cyan" href="/privacy">מדיניות הפרטיות</a>
            שלנו, המפרטת כיצד אנו אוספים, משתמשים ושומרים על המידע שלכם.
          </p>
        </Section>

        <Section title="7. סמכות שיפוט">
          <p>
            תנאים אלה כפופים לדין הישראלי בלבד. סמכות השיפוט הבלעדית בכל מחלוקת תהיה נתונה לבתי
            המשפט המוסמכים במחוז תל אביב.
          </p>
        </Section>

        <Section title="8. יצירת קשר">
          <p>
            לשאלות בנושא תנאי השימוש ניתן לפנות ל
            <a className="mx-1 underline hover:text-neon-cyan" href="mailto:liamgolanbusiness@gmail.com">
              liamgolanbusiness@gmail.com
            </a>
            .
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
