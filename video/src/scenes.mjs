// Markup for every scene. Rendered once per format by build.mjs; all timing lives in timeline.js.
import fs from "node:fs";
import path from "node:path";
import * as si from "simple-icons";

const LUCIDE = path.resolve("node_modules/lucide-static/icons");

export function icon(name) {
  const raw = fs.readFileSync(path.join(LUCIDE, `${name}.svg`), "utf8");
  const svg = raw
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/class="[^"]*"/, "")
    .replace(/\s(width|height)="24"/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return `<span class="ic">${svg}</span>`;
}

function brand(key, colorOverride) {
  const ic = si[key];
  if (!ic) throw new Error(`simple-icons: missing ${key}`);
  let fill = colorOverride || `#${ic.hex}`;
  // Near-black marks would vanish on the dark tiles.
  if (!colorOverride && ["000000", "0052CC", "002991"].includes(ic.hex)) fill = "#f8fafc";
  return `<svg viewBox="0 0 24 24" role="img" aria-label="${ic.title}"><path fill="${fill}" d="${ic.path}"/></svg>`;
}

const WA = si.siWhatsapp.path;
const waIcon = `<svg viewBox="0 0 24 24"><path d="${WA}"/></svg>`;

const outMeta = (time, speed) =>
  `<div class="b-meta">${speed ? `<span class="speed">${icon("zap")}${speed}</span>` : ""}<span class="dn-tag">דני ✦</span><span>${time}</span>${icon("check-check")}</div>`;
const inMeta = (time) => `<div class="b-meta"><span>${time}</span></div>`;

// ---------------------------------------------------------------- layout tables
const NOTIFS = [
  ["אורי", "23:04", "היי, כמה עולה הנה״ח לעוסק פטור?"],
  ["מיכאל", "23:11", "צריך עו״ד לחוזה שכירות, דחוף 🙏"],
  ["שירן", "14:30", "אפשר לקבוע פגישת ייעוץ?"],
  ["דוד", "14:32", "קיבלתי מכתב ממס הכנסה 😬"],
  ["תמר", "14:41", "כמה עולה לוגו + מיתוג?"],
  ["רונית", "09:12", "מתי אתם זמינים השבוע?"],
  ["אלון", "09:20", "שלחתי מייל ולא חזרתם..."],
  ["ליאת", "09:31", "אפשר הצעת מחיר?"],
  ["עומר", "10:02", "יש לכם זמן לשיחה קצרה?"],
  ["גלית", "10:15", "שלום? מחכה לתשובה"],
  ["יוסי", "11:40", "עדיין רלוונטי?"],
  ["נעמה", "12:03", "אתם עובדים גם עם פרילנסרים?"],
];
const NOTIF_POS = {
  land: [
    [90, 70], [1320, 60], [700, 40], [40, 410], [1370, 390], [110, 790],
    [1300, 800], [700, 905], [960, 200], [30, 600], [1390, 595], [240, 220],
  ],
  port: [
    [20, 40], [460, 1230], [460, 150], [20, 1340], [20, 260], [460, 1450],
    [460, 370], [20, 1560], [20, 480], [460, 1670], [460, 590], [20, 1780],
  ],
};

const CATS = [
  ["calendar-check", "יומן"],
  ["contact", "אנשי קשר"],
  ["list-checks", "משימות"],
  ["users", "CRM"],
  ["credit-card", "סליקה"],
  ["bell", "התראות"],
];
const RING2 = [
  "siGooglecalendar", "siWhatsapp", "siGmail", "siHubspot", "siGooglesheets", "siZoom",
  "siStripe", "siCalendly", "siInstagram", "siFacebook", "siGoogledrive", "siNotion",
  "siPaypal", "siZoho", "siGooglemeet", "siMessenger", "siAirtable", "siClickup",
];
const RING3_ICONS = [
  "siTrello", "siAsana", "siZapier", "siMake", "siN8n", "siShopify", "siWix", "siWordpress",
  "siWoocommerce", "siMailchimp", "siDropbox", "siIcloud", "siQuickbooks", "siXero",
  "siGoogleads", "siTiktok", "siTelegram",
];
const RING3_CHIPS = [
  ["monday.com", "#ff3d57"], ["Salesforce", "#00a1e0"], ["Pipedrive", "#22c55e"], ["Slack", "#e01e5a"],
  ["Outlook", "#0a64ad"], ["Teams", "#6264a7"], ["Priority", "#f59e0b"], ["Morning", "#16a34a"],
  ["iCount", "#38bdf8"], ["חשבשבת", "#2563eb"], ["Cardcom", "#7c3aed"], ["Tranzila", "#0ea5e9"],
  ["Grow", "#10b981"], ["Bit", "#22d3ee"],
];

const RULES = [
  ["flame", "ליד חם נכנס", "bell", "התראה לנייד של איש המכירות"],
  ["calendar-check", "נקבעה פגישה", "calendar-check", "נכנס ליומן + תזכורת ללקוח"],
  ["hourglass", "לקוח לא ענה 3 ימים", "message-circle", "הודעת חימום עדינה"],
  ["file-question", "חסרים מסמכים", "clipboard-list", "דני מבקש ואוסף אותם"],
  ["receipt", "הצעת מחיר אושרה", "credit-card", "לינק לתשלום + חשבונית"],
  ["clock", "סוף יום עבודה", "mail", "סיכום לידים במייל לבעל העסק"],
];

const STATIONS = [
  ["filter", "מסנן", "מי באמת רלוונטי ומי רק סקרן"],
  ["flame", "מחמם", "חוזר בעדינות ללידים שנעלמו"],
  ["clipboard-list", "אוסף", "שם, צורך, תקציב ודחיפות"],
  ["user-check", "משייך", "לאיש המכירות המתאים"],
  ["headset", "מעביר", "לנציג אנושי, עם כל ההקשר"],
];

// ---------------------------------------------------------------- scenes
const clip = (id, T, inner, track = 1) =>
  `<section id="sc-${id}" class="scene clip" data-start="${T.scenes[id][0]}" data-duration="${T.scenes[id][1]}" data-track-index="${track}">${inner}</section>`;

function hook(fmt, T) {
  const notifs = NOTIFS.map(([name, time, msg], i) => {
    const [x, y] = NOTIF_POS[fmt][i];
    return `<div class="notif" style="left:${x}px;top:${y}px"><div class="n-ic">${waIcon}</div><div class="n-txt"><div class="n-top"><span class="n-name">${name}</span><span class="n-time">${time}</span></div><div class="n-msg">${msg}</div></div></div>`;
  }).join("");
  const stamps = [
    ["23:04", "באחת־עשרה בלילה"],
    ["14:30", "באמצע פגישה"],
    ["09:12", "שבת בבוקר"],
  ]
    .map(([t, l]) => `<div class="stamp-item"><div class="stamp-time">${t}</div><div class="stamp-lbl">${l}</div></div>`)
    .join("");
  return clip("hook", T, `
    <div class="layer hook-notifs" data-layout-allow-overlap>${notifs}</div>
    <div class="center-col hook-center">
      <div class="stamp">${stamps}</div>
      <div class="counter"><div class="c-num">0</div><div class="c-lbl">הודעות שלא נענו</div></div>
    </div>
    <div class="center-col hook-timer">
      <div class="timer-box">${icon("hourglass")}<div class="timer-lbl">עברו</div><div class="timer-vals"><span>15 דק׳</span><span>שעה</span><span>4 שעות</span></div></div>
    </div>
    <div class="center-col hook-reply" data-layout-allow-overlap>
      <div class="reply-wrap"><div class="chat-card"><div class="chat-head"><div class="av">א</div><div><div class="chat-name">אורי</div><div class="chat-sub"><span>לקוח פוטנציאלי</span></div></div></div>
        <div class="chat-body"><div class="b b-in">תודה, כבר מצאתי מישהו אחר 👋${inMeta("15:22")}</div></div></div></div>
    </div>
    <div class="center-col hook-head">
      <div class="hook-l1">מי שעונה ראשון —</div>
      <div class="hook-l2"><span class="word">סוגר</span><span class="period"></span></div>
    </div>`);
}

function intro(fmt, T) {
  return clip("intro", T, `
    <div class="intro-wrap">
      <div class="orb-stage"><div class="orb-ring r1"></div><div class="orb-ring r2"></div><div class="orb-ring r3"></div>
        <div class="orb"><div class="orb-dots"><i></i><i></i><i></i></div></div></div>
      <div class="intro-text">
        <div class="intro-kicker">תכירו את</div>
        <div class="intro-name"><span>ד</span><span>נ</span><span>י</span></div>
        <div class="intro-sub">הסוכן החכם של <span class="brand">DotCome</span></div>
        <div class="intro-desc">עובד דיגיטלי שעונה ללקוחות שלכם</div>
        <div class="intro-chips">
          <div class="chip">${icon("zap")}עונה תוך שניות</div>
          <div class="chip">${icon("moon")}24/7, גם בשבת</div>
          <div class="chip">${icon("message-circle")}בטון של העסק שלכם</div>
        </div>
      </div>
    </div>`);
}

function agent(fmt, T) {
  const head = (av, name, sub, typing) =>
    `<div class="chat-head">${av}<div><div class="chat-name">${name}</div><div class="chat-sub"><span class="idle">${sub}</span>${typing ? `<span class="typing">דני מקליד...</span>` : ""}</div></div></div>`;
  return clip("agent", T, `
    <div class="layer agent-a">
      <div class="h1 agent-h1a">לא עוד בוט של <span class="q">״הקישו 1״</span></div>
      <div class="bot-wrap">
        <div class="chat-card">${head(`<div class="av">${icon("bot")}</div>`, "בוט אוטומטי", "מענה אוטומטי")}
          <div class="chat-body">
            <div class="b b-out">שלום! הקישו 1 למכירות, 2 לשירות לקוחות, 3 לחזרה לתפריט הראשי.${inMeta("10:02")}</div>
            <div class="b b-in">רציתי לשאול על פגישת ייעוץ${inMeta("10:03")}</div>
            <div class="b b-out">לא הבנתי 🤖 אנא הקישו 1, 2 או 3.${inMeta("10:03")}</div>
          </div></div>
        <div class="bot-strike"></div>
        <div class="bot-x"><span>✕</span></div>
      </div>
    </div>
    <div class="layer agent-b">
      <div class="h1 agent-h1b"><span class="ln">דני <span class="hl">מבין</span>, עונה כמו בן אדם</span><span class="ln">ומדבר בשפה של העסק שלכם.</span></div>
      <div class="tone-cards">
        <div class="tone formal chat-card">${head(`<div class="av">${icon("scale")}</div>`, "לוי ושות׳ · עורכי דין", "מחובר", true)}
          <div class="tone-tag">טון רשמי</div>
          <div class="chat-body">
            <div class="b b-in">אפשר לקבוע פגישת ייעוץ?${inMeta("10:14")}</div>
            <div class="b b-out">שלום רב, בשמחה. נוכל לתאם עבורך פגישת ייעוץ עם עו״ד לוי ביום שלישי בשעה 10:00. האם המועד מתאים?${outMeta("10:14")}</div>
          </div></div>
        <div class="tone casual chat-card">${head(`<div class="av">${icon("camera")}</div>`, "תום · צלם", "מחובר", true)}
          <div class="tone-tag">טון קליל</div>
          <div class="chat-body">
            <div class="b b-in">אפשר לקבוע פגישה?${inMeta("10:14")}</div>
            <div class="b b-out">בטח! 🙌 שלישי בעשר מתאים לך? אני מביא קפה ☕${outMeta("10:14")}</div>
          </div></div>
      </div>
    </div>`);
}

function how(fmt, T) {
  const docs = [["file-text", "מחירון", 8, 18], ["briefcase", "שירותים", 268, 0], ["file-question", "שאלות נפוצות", 0, 222], ["book-open", "נהלים", 290, 228]];
  const chans = [
    [brand("siWhatsapp"), 20, 30], [brand("siInstagram"), 330, 30], [brand("siFacebook"), 0, 190],
    [brand("siMessenger"), 350, 190], [icon("globe").replace('class="ic"', 'class="ic" style="font-size:50px;color:#22d3ee"'), 176, 212],
  ];
  const chanHtml = chans.map(([svg, x, y]) => `<div class="ch-ic" style="left:${x}px;top:${y}px">${svg}</div>`).join("");
  const lines = chans.map(([, x, y]) => `<line x1="220" y1="150" x2="${x + 44}" y2="${y + 44}" stroke="rgba(34,211,238,.5)" stroke-width="3" stroke-dasharray="6 8"/>`).join("");
  const steps = [
    ["01", "מלמדים אותו את העסק", "מחירים, שירותים, השאלות שחוזרות", `<div class="mini-orb orb"></div>${docs.map(([ic, t, x, y]) => `<div class="doc" style="left:${x}px;top:${y}px">${icon(ic)}${t}</div>`).join("")}`],
    ["02", "מחברים לערוצים", "וואטסאפ, אתר, אינסטגרם ופייסבוק", `<svg class="ch-lines" viewBox="0 0 440 300">${lines}</svg><div class="mini-orb orb" style="width:96px;height:96px;left:172px;top:102px"></div>${chanHtml}`],
    ["03", "והוא בעבודה. 24/7.", "עונה, מסנן, קובע ומעדכן — לבד", `<div class="status-pill"><i></i>פעיל עכשיו</div><div class="feed"><div class="feed-row">${icon("check")}ענה לפנייה חדשה מהאתר</div><div class="feed-row">${icon("check")}קבע פגישה ביומן</div><div class="feed-row">${icon("check")}עדכן את ה־CRM</div></div>`],
  ];
  return clip("how", T, `
    <div class="how-wrap">
      <div class="h1 how-h">איך זה עובד?</div>
      <div class="steps"><div class="how-line"></div>
        ${steps.map(([n, t, d, vis], i) => `<div class="step glass st${i + 1}"><div class="step-num">${n}</div><div class="step-vis">${vis}</div><div class="step-txt"><div class="step-title">${t}</div><div class="step-desc">${d}</div></div></div>`).join("")}
      </div>
    </div>`);
}

function demo(fmt, T) {
  const c = (txt, time) => `<div class="b b-in">${txt}${inMeta(time)}</div>`;
  const d = (txt, time) => `<div class="b b-out">${txt}${outMeta(time, "3 שנ׳")}</div>`;
  const row = (cls, k, v) => `<div class="lc-row ${cls}"><div class="flash"></div><span class="k">${k}</span><div class="vbox"><div class="ph"></div><div class="v">${v}</div></div></div>`;
  return clip("demo", T, `
    <div class="demo-wrap" data-layout-allow-overlap data-layout-allow-occlusion>
      <div class="phone"><div class="phone-screen">
        <div class="chat-head"><div class="av">כ</div><div><div class="chat-name">כהן ושות׳ · רואי חשבון</div><div class="chat-sub"><span class="idle">מחובר · מענה ע״י דני ✦</span><span class="typing">דני מקליד...</span></div></div></div>
        <div class="wa-body"><div class="wa-list">
          <div class="wa-day">היום</div>
          ${c("היי, אני פותחת עסק כמעצבת גרפית. כמה עולה ליווי?", "16:02")}
          ${d("היי, מזל טוב על העסק! 🎉 כדי לתת הצעה מדויקת — עוסק פטור או מורשה?", "16:02")}
          ${c("עוד לא יודעת 😅", "16:03")}
          ${d("בדיוק בשביל זה אנחנו כאן 🙂 מה המחזור השנתי הצפוי, בערך?", "16:03")}
          ${c("בערך 150 אלף", "16:03")}
          ${d("מעולה. אשמח לקבוע לך שיחת היכרות עם מיכל, רואת החשבון שלנו. מחר ב־10:00 או ב־16:30?", "16:04")}
          ${c("16:30 מעולה 🙏", "16:04")}
          ${d("קבעתי! 📅 שלחתי לך זימון ליומן ותזכורת שעה לפני.", "16:04")}
        </div>
        <div class="wa-typing-wrap"><div class="wa-typing"><i></i><i></i><i></i></div></div></div>
        <div class="wa-input"><div>הודעה</div></div>
      </div></div>
      <div class="demo-side">
        <div class="demo-label">${icon("calculator")}דמו · משרד רואי חשבון</div>
        <div class="lead-card glass">
          <div class="lc-head"><div class="lc-title">${icon("users")}כרטיס ליד</div><div class="lc-status"><span class="st-new">ליד חדש</span><span class="st-hot">🔥 ליד חם</span></div></div>
          ${row("r-name", "שם", "נועה ש. · מעצבת גרפית")}
          ${row("r-need", "צורך", "פתיחת עסק + ליווי שוטף")}
          ${row("r-rev", "מחזור צפוי", "כ־150,000 ₪ בשנה")}
          ${row("r-owner", "שויכה ל", `<span class="av">מ</span>מיכל, רואת חשבון`)}
          ${row("r-meet", "פגישה", `מחר · 16:30 <span class="ok">${icon("check")}ביומן</span>`)}
          <div class="lc-foot">${icon("zap")}זמן מענה: שניות · 24/7</div>
        </div>
        <div class="demo-toast"><div class="t-ic">${icon("bell")}</div>מיכל קיבלה התראה: ליד חם חדש 🔥</div>
      </div>
    </div>
    <div class="center-col demo-final"><div class="h1">ואתם? <span class="hl">אפילו לא נגעתם בטלפון.</span></div></div>`);
}

function leads(fmt, T) {
  return clip("leads", T, `
    <div class="leads-wrap">
      <div class="h1 leads-h">מה דני עושה עם כל ליד?</div>
      <div class="stations">
        <div class="track"><div class="track-fill"></div></div>
        <div class="lead-dot"></div>
        ${STATIONS.map(([ic, v, d], i) => `<div class="station glass sn${i + 1}"><div class="st-glow"></div><div class="st-ic">${icon(ic)}</div><div class="st-txt"><div class="st-verb">${v}</div><div class="st-desc">${d}</div></div></div>`).join("")}
      </div>
    </div>`);
}

// Ellipse placement, evenly spaced along the arc; `hdisc` > 1 discounts horizontal distance so wide
// items get more room side by side than stacked; `gapDeg` leaves out a sector around 12 o'clock
// where the headline sits.
function ellipse(n, rx, ry, phase = 0, gapDeg = 0, hdisc = 1) {
  const from = 90 + gapDeg / 2 + phase;
  const span = 360 - gapDeg;
  const STEPS = 3600;
  const pt = (deg) => {
    const a = (deg * Math.PI) / 180;
    return [Math.cos(a) * rx, -Math.sin(a) * ry];
  };
  const cum = [0];
  let prev = pt(from);
  for (let i = 1; i <= STEPS; i++) {
    const cur = pt(from + (span * i) / STEPS);
    cum.push(cum[i - 1] + Math.hypot((cur[0] - prev[0]) / hdisc, cur[1] - prev[1]));
    prev = cur;
  }
  const total = cum[STEPS];
  const pts = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    const target = (total * (i + 0.5)) / n;
    while (j < STEPS && cum[j + 1] < target) j++;
    const [x, y] = pt(from + (span * j) / STEPS);
    pts.push([Math.round(x), Math.round(y)]);
  }
  return pts;
}

export const INT_GEOM = {
  land: {
    cx: 960, cy: 615, r2: [540, 260], r3: [700, 400], arcSpan: 104, colX: 790, colH: 640,
    r1pts: [[-277, -75], [-277, 75], [0, 150], [277, 75], [277, -75], [0, -150]],
  },
  // portrait is too narrow for a third ring: the outer items sit in rows above and below the core
  port: {
    cx: 540, cy: 1020, r2: [410, 500], rows: [-720, -600, 600, 720, 840],
    r1pts: [[-190, -255], [-225, 0], [-190, 255], [190, 255], [225, 0], [190, -255]],
  },
};

const chipW = (name, fmt) => name.length * (fmt === "port" ? 14.5 : 17) + (fmt === "port" ? 56 : 72);

// Outer items: in 16:9 on an ellipse with the wide name chips on its flanks; in 9:16 in centred rows.
function outerLayout(fmt, g, items) {
  if (fmt === "port") {
    const W = 1000, GAP = 22, TILE = 92;
    const width = (it) => (it.icon ? TILE : chipW(it.chip[0], fmt));
    const rows = g.rows.map(() => []);
    let r = 0;
    for (const it of items) {
      const used = rows[r].reduce((a, x) => a + width(x) + GAP, 0);
      if (used + width(it) > W && r < rows.length - 1) r++;
      rows[r].push(it);
    }
    const out = [];
    rows.forEach((row, ri) => {
      const total = row.reduce((a, x) => a + width(x), 0) + GAP * (row.length - 1);
      let x = -total / 2;
      row.forEach((it) => {
        out.push({ it, x: Math.round(x + width(it) / 2), y: g.rows[ri] });
        x += width(it) + GAP;
      });
    });
    return out;
  }
  // 16:9: name chips stacked in two flank columns, logo tiles on the top and bottom arcs
  const chips = items.filter((it) => it.chip);
  const icons = items.filter((it) => it.icon);
  const out = [];
  const perCol = Math.ceil(chips.length / 2);
  chips.forEach((it, i) => {
    const col = i % 2 ? 1 : -1;
    const row = Math.floor(i / 2);
    const y = Math.round(-g.colH / 2 + (g.colH * row) / (perCol - 1));
    out.push({ it, x: col * (g.colX + (row % 2 ? 26 : 0)), y });
  });
  const top = Math.floor(icons.length / 2);
  const arc = (n, centre) => Array.from({ length: n }, (_, i) => {
    const a = ((centre - g.arcSpan / 2 + (g.arcSpan * (i + 0.5)) / n) * Math.PI) / 180;
    return [Math.round(Math.cos(a) * g.r3[0]), Math.round(-Math.sin(a) * g.r3[1])];
  });
  [...arc(top, 90), ...arc(icons.length - top, 270)].forEach(([x, y], i) => out.push({ it: icons[i], x, y }));
  return out;
}

function integrations(fmt, T) {
  const g = INT_GEOM[fmt];
  const p1 = g.r1pts || ellipse(CATS.length, ...g.r1, 30);
  const p2 = ellipse(RING2.length, ...g.r2, 10);
  const ring3 = [];
  RING3_ICONS.forEach((k, i) => {
    ring3.push({ icon: k });
    if (i < RING3_CHIPS.length) ring3.push({ chip: RING3_CHIPS[i] });
  });
  for (let i = RING3_ICONS.length; i < RING3_CHIPS.length; i++) ring3.push({ chip: RING3_CHIPS[i] });
  const outer = outerLayout(fmt, g, ring3);

  const lines = [];
  const cats = CATS.map(([ic, t], i) => {
    const [x, y] = p1[i];
    lines.push(`<line class="ln1" x1="1200" y1="1200" x2="${1200 + x}" y2="${1200 + y}"/>`);
    return `<div class="node" style="left:${x}px;top:${y}px"><div class="cat r1">${icon(ic)}${t}</div></div>`;
  }).join("");
  const tiles2 = RING2.map((k, i) => {
    const [x, y] = p2[i];
    lines.push(`<line class="ln2" x1="1200" y1="1200" x2="${1200 + x}" y2="${1200 + y}"/>`);
    return `<div class="node" style="left:${x}px;top:${y}px"><div class="tile r2">${brand(k)}</div></div>`;
  }).join("");
  const tiles3 = outer.map(({ it, x, y }) => {
    if (it.icon) return `<div class="node" style="left:${x}px;top:${y}px"><div class="tile r3">${brand(it.icon)}</div></div>`;
    const [name, color] = it.chip;
    return `<div class="node" style="left:${x}px;top:${y}px"><div class="tchip r3"><i style="background:${color}"></i>${name}</div></div>`;
  }).join("");

  return clip("integrations", T, `
    <div class="int-h"><div class="h1">מתחבר לכל מה שאתם <span class="hl">כבר עובדים איתו</span></div></div>
    <div class="const" style="left:${g.cx}px;top:${g.cy}px">
      <svg class="const-lines" viewBox="0 0 2400 2400" style="stroke-linecap:round">
        <g stroke="rgba(34,211,238,.45)" stroke-width="3">${lines.filter((l) => l.includes("ln1")).join("")}</g>
        <g stroke="rgba(148,163,184,.22)" stroke-width="2">${lines.filter((l) => l.includes("ln2")).join("")}</g>
      </svg>
      ${tiles3}${tiles2}${cats}
      <div class="hub"><div class="orb" style="width:100%;height:100%"></div><div class="hub-name">דני</div></div>
    </div>
    <div class="int-b">
      <div class="int-h2"><div class="h1">אתם קובעים את הכללים. <span class="hl">דני דואג שזה יקרה.</span></div></div>
      <div class="rules">
        ${RULES.map(([wi, w, ti, t]) => `<div class="rule glass"><div class="when">${icon(wi)}${w}</div><div class="arrow">${icon("arrow-left")}</div><div class="then">${icon(ti)}${t}</div></div>`).join("")}
      </div>
    </div>`);
}

function value(fmt, T) {
  const rows = [
    "היי, כמה עולה הנה״ח לעוסק פטור?",
    "צריך עו״ד לחוזה שכירות, דחוף 🙏",
    "אפשר לקבוע פגישת ייעוץ?",
    "קיבלתי מכתב ממס הכנסה 😬",
  ];
  return clip("value", T, `
    <div class="layer val-a" data-layout-allow-overlap>
      ${rows.map((m) => `<div class="vrow"><div class="vglow"></div><div class="n-ic">${waIcon}</div><div class="n-msg">${m}</div><div class="state"><span class="pend">${icon("clock")}ממתין</span><span class="done">${icon("check-check")}נענה תוך שניות</span></div></div>`).join("")}
    </div>
    <div class="layer val-b">
      <div class="h1 val-h">השורה התחתונה:</div>
      <div class="stats">
        <div class="stat glass"><div class="stat-big">שניות</div><div class="stat-lbl">מענה מהיר ומקצועי לכל לקוח</div></div>
        <div class="stat glass"><div class="stat-big">24/7</div><div class="stat-lbl">גם בלילה, גם בשבת</div></div>
        <div class="stat glass"><div class="stat-big"><span class="zero">12</span></div><div class="stat-lbl">לידים שנופלים בין הכיסאות</div></div>
      </div>
      <div class="val-line"><span class="clock-ic">${icon("clock")}</span><span>ואתם מקבלים בחזרה <span class="hl">שעות של עבודה</span> — כל שבוע.</span></div>
    </div>`);
}

function cta(fmt, T) {
  const word = "DOTCOME".split("").map((ch) => `<span>${ch}</span>`).join("");
  return clip("cta", T, `
    <div class="cta-wrap">
      <div class="cta-logo"><img class="kom" src="assets/img/kom-glyphs.png" alt="קום"><div class="kom-dot orb"></div></div>
      <div class="cta-word">${word}</div>
      <div class="cta-tag"><span class="t1">פחות לרדוף אחרי הודעות.</span><span class="t2 hl">יותר לנהל עסק.</span></div>
      <div class="cta-btn"><div class="cta-ripple"></div>${waIcon.replace("<svg", '<svg')}שלחו הודעה לדני בוואטסאפ</div>
      <div class="cta-meta"><b>058-588-1234</b><i></i><b>dotcome.co.il</b></div>
    </div>`);
}

export function renderScenes(fmt, T) {
  const bg = `<div id="bg" class="clip" data-start="0" data-duration="${T.total}" data-track-index="0">
      <div class="glow g1"></div><div class="glow g2"></div><div class="glow g3"></div>
      <div class="bg-grid"></div><div class="bg-grain"></div><div class="bg-vignette"></div>
    </div>`;
  const fade = `<div id="fade-black" class="clip" data-start="0" data-duration="${T.total}" data-track-index="9"></div>`;
  return [bg, hook(fmt, T), intro(fmt, T), agent(fmt, T), how(fmt, T), demo(fmt, T), leads(fmt, T), integrations(fmt, T), value(fmt, T), cta(fmt, T), fade].join("\n");
}
