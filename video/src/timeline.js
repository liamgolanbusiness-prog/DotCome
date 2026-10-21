// One paused GSAP timeline for the whole film. Scene times come from window.CFG.T (timing.*.json).
// Every sound-worthy beat calls cue(); tools/extract-cues.mjs reads window.__cues to build the SFX track.
(function () {
  const { fmt, T } = window.CFG;
  const P = fmt === "port";
  const W = P ? 1080 : 1920;
  const H = P ? 1920 : 1080;
  const S = (id) => T.scenes[id][0];
  const D = (id) => T.scenes[id][1];
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  const cues = (window.__cues = []);
  const cue = (type, t, extra) => cues.push(Object.assign({ type, t: Math.round(t * 1000) / 1000 }, extra || {}));
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const center = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
  };
  function rng(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const reveal = (el, t, from, d, ease) =>
    tl.fromTo(el, Object.assign({ opacity: 0 }, from), { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0, duration: d || 0.5, ease: ease || "power3.out" }, t);
  const exit = (els, t) => tl.to(els, { opacity: 0, duration: 0.4, ease: "power2.in" }, t);

  // ------------------------------------------------------------------ background
  function bg() {
    const tot = T.total;
    tl.fromTo(".glow.g1", { x: -60, y: -30 }, { x: 160, y: 90, duration: tot / 2, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0);
    tl.fromTo(".glow.g2", { x: 60, y: 40 }, { x: -180, y: -60, duration: tot / 2, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0);
    tl.fromTo(".glow.g3", { x: 0, y: 0, scale: 0.9 }, { x: -260, y: 120, scale: 1.15, duration: tot / 3, ease: "sine.inOut", yoyo: true, repeat: 2 }, 0);
    tl.fromTo(".bg-grid", { y: 0 }, { y: 96, duration: tot, ease: "none" }, 0);
    tl.to("#fade-black", { opacity: 1, duration: 0.7, ease: "power1.in" }, tot - 0.75);
    Object.keys(T.scenes).forEach((id, i) => { if (i > 0) cue("whoosh", S(id) - 0.12); });
  }

  // ------------------------------------------------------------------ 1. hook
  function hook() {
    const s = S("hook");
    const sc = $("#sc-hook");
    const notifs = $$(".notif", sc);
    const dot = $(".hook-l2 .period", sc);
    const dc = center(dot);
    const r = rng(7);

    const times = [0.25, 0.55, 0.85, 1.15, 1.5, 1.85, 2.15, 2.5, 2.9, 3.3, 3.75, 4.2];
    notifs.forEach((n, i) => {
      const rot = (r() - 0.5) * 7;
      tl.fromTo(n, { opacity: 0, scale: 0.6, y: 40, rotation: rot * 2.5 }, { opacity: 1, scale: 1, y: 0, rotation: rot, duration: 0.45, ease: "back.out(1.8)" }, s + times[i]);
      cue("notif", s + times[i], { v: i % 4 });
    });
    tl.fromTo($(".hook-notifs", sc), { scale: 1.07 }, { scale: 1, duration: 6, ease: "sine.out" }, s);

    const st = $$(".stamp-item", sc);
    const stT = [0.1, 1.9, 3.7];
    st.forEach((el, i) => {
      tl.fromTo(el, { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.5 }, s + stT[i]);
      if (i < 2) tl.to(el, { opacity: 0, y: -70, duration: 0.3, ease: "power2.in" }, s + stT[i + 1] - 0.15);
    });
    tl.to(st[2], { opacity: 0, y: -50, duration: 0.4, ease: "power2.in" }, s + 6.0);

    const cnt = $(".counter", sc);
    const num = $(".c-num", sc);
    tl.fromTo(cnt, { opacity: 0, y: 30, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)" }, s + 0.4);
    tl.fromTo(num, { innerText: 0 }, { innerText: 47, snap: { innerText: 1 }, duration: 5.2, ease: "power1.in" }, s + 0.5);
    tl.to(cnt, { opacity: 0, y: 20, duration: 0.35, ease: "power2.in" }, s + 6.0);

    // nobody answered
    notifs.forEach((n, i) => tl.to(n, { filter: "grayscale(1) brightness(0.5)", duration: 0.5, ease: "power1.out" }, s + 6.05 + i * 0.05));
    const tb = $(".timer-box", sc);
    const tv = $$(".timer-vals span", sc);
    reveal(tb, s + 6.3, { scale: 0.85 }, 0.45, "back.out(1.7)");
    const tvT = [6.4, 7.1, 7.8];
    tv.forEach((el, i) => {
      tl.fromTo(el, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.35 }, s + tvT[i]);
      if (i < 2) tl.to(el, { opacity: 0, y: -60, duration: 0.25, ease: "power2.in" }, s + tvT[i + 1] - 0.1);
      cue("tick_big", s + tvT[i]);
    });
    tl.to(tb, { opacity: 0, scale: 0.9, duration: 0.35, ease: "power2.in" }, s + 8.5);

    const rw = $(".reply-wrap", sc);
    reveal(rw, s + 8.7, { y: 60, scale: 0.92 }, 0.5, "back.out(1.5)");
    cue("msg_in", s + 8.75);
    notifs.forEach((n) => {
      tl.to(n, { y: "+=" + (P ? 2100 : 1300), rotation: (r() - 0.5) * 50, opacity: 0, duration: 1.0, ease: "power2.in" }, s + 9.7 + r() * 0.35);
    });
    cue("fall", s + 9.7);
    tl.to(rw, { opacity: 0, y: -80, scale: 0.95, duration: 0.45, ease: "power2.in" }, s + 10.35);

    const l1 = $(".hook-l1", sc);
    const word = $(".hook-l2 .word", sc);
    reveal(l1, s + 10.6, { y: 50 }, 0.55);
    tl.fromTo(word, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power4.out" }, s + 11.3);
    tl.fromTo(dot, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(3)" }, s + 11.7);
    cue("slam", s + 11.3);
    cue("pop", s + 11.7);
    // the full stop becomes Danny
    tl.to([l1, word], { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" }, s + 13.0);
    const orbSize = P ? 460 : 420;
    tl.to(dot, { x: W / 2 - dc.x, y: H / 2 - dc.y, scale: orbSize / dc.w, boxShadow: "0 0 0px rgba(34,211,238,0)", duration: 0.95, ease: "power3.inOut" }, s + 13.05);
  }

  // ------------------------------------------------------------------ 2. intro
  function intro() {
    const s = S("intro");
    const sc = $("#sc-intro");
    const stage = $(".orb-stage", sc);
    const orb = $(".orb", sc);
    const c = center(stage);
    tl.fromTo(stage, { x: W / 2 - c.x, y: H / 2 - c.y }, { x: 0, y: 0, duration: 0.9, ease: "power3.inOut" }, s + 0.9);
    tl.fromTo(orb, { scale: 1 }, { scale: 1.1, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }, s);
    cue("reveal", s);
    $$(".orb-ring", sc).forEach((rg, i) => {
      tl.fromTo(rg, { scale: 1, opacity: 0.9 }, { scale: 2.1 + i * 0.35, opacity: 0, duration: 1.5, ease: "power2.out", repeat: 3, repeatDelay: 0.3 }, s + i * 0.2);
    });
    const dots = $$(".orb-dots i", sc);
    tl.fromTo(dots, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.08, ease: "back.out(3)" }, s + 0.35);
    tl.fromTo(dots, { y: 0 }, { y: -16, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: 15, stagger: 0.12, immediateRender: false }, s + 1.0);
    tl.fromTo(stage, { scale: 1 }, { scale: 1.035, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: 3, immediateRender: false }, s + 2.0);

    reveal($(".intro-kicker", sc), s + 1.3, { x: 40 });
    $$(".intro-name span", sc).forEach((l, i) => reveal(l, s + 1.55 + i * 0.09, { y: 120, scale: 0.6 }, 0.55, "back.out(1.8)"));
    cue("name", s + 1.55);
    reveal($(".intro-sub", sc), s + 2.3, { y: 30 });
    reveal($(".intro-desc", sc), s + 2.75, { y: 24 });
    $$(".chip", sc).forEach((ch, i) => {
      reveal(ch, s + 3.6 + i * 0.35, { y: 30, scale: 0.85 }, 0.45, "back.out(2)");
      cue("pop", s + 3.6 + i * 0.35);
    });
    exit($(".intro-wrap", sc), s + D("intro") - 0.4);
  }

  // ------------------------------------------------------------------ 3. agent
  function agent() {
    const s = S("agent");
    const sc = $("#sc-agent");
    const A = $(".agent-a", sc);
    const B = $(".agent-b", sc);
    const botWrap = $(".bot-wrap", sc);
    const botB = $$(".bot-wrap .b", sc);
    reveal($(".agent-h1a", sc), s + 0.15, { y: -30 });
    reveal(botWrap, s + 0.3, { y: 60 }, 0.5);
    [0.7, 1.55, 2.3].forEach((t, i) => {
      reveal(botB[i], s + t, { y: 20, scale: 0.95 }, 0.35, "back.out(1.6)");
      cue(i === 1 ? "msg_in" : "bot", s + t);
    });
    tl.fromTo($(".bot-strike", sc), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power4.out" }, s + 3.0);
    tl.fromTo($(".bot-x span", sc), { opacity: 0, scale: 2.2, rotation: -25 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" }, s + 3.15);
    tl.to($(".bot-wrap .chat-card", sc), { filter: "grayscale(1) brightness(0.55)", duration: 0.3 }, s + 3.0);
    tl.fromTo(botWrap, { x: 0 }, { x: 14, duration: 0.05, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, s + 3.0);
    cue("glitch", s + 3.0);
    tl.to(A, { opacity: 0, y: -60, duration: 0.45, ease: "power2.in" }, s + 4.3);

    $$(".agent-h1b .ln", sc).forEach((l, i) => reveal(l, s + 4.65 + i * 0.35, { y: 40 }, 0.55));
    const cards = $$(".tone", sc);
    cards.forEach((c, i) => {
      reveal(c, s + 5.25 + i * 0.15, { y: 80 }, 0.6);
      const [q, a] = $$(".b", c);
      const typ = $(".chat-sub .typing", c);
      const idle = $(".chat-sub .idle", c);
      const tq = s + 5.9 + i * 0.25;
      const ta = s + (i === 0 ? 7.1 : 8.3);
      reveal(q, tq, { y: 20, scale: 0.95 }, 0.35, "back.out(1.6)");
      tl.to(idle, { opacity: 0, duration: 0.15 }, tq + 0.45);
      tl.fromTo(typ, { opacity: 0 }, { opacity: 1, duration: 0.15 }, tq + 0.45);
      tl.to(typ, { opacity: 0, duration: 0.15 }, ta - 0.05);
      tl.to(idle, { opacity: 1, duration: 0.15 }, ta);
      reveal(a, ta, { y: 20, scale: 0.95 }, 0.4, "back.out(1.6)");
      tl.fromTo($(".tone-tag", c), { scale: 1 }, { scale: 1.15, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out" }, ta + 0.25);
      cue("msg_in", tq);
      cue("msg_out", ta);
    });
    exit(B, s + D("agent") - 0.4);
  }

  // ------------------------------------------------------------------ 4. how
  function how() {
    const s = S("how");
    const sc = $("#sc-how");
    const v1 = $(".st1 .step-vis", sc);
    const docs = $$(".doc", v1);
    const mo1 = $(".mini-orb", v1);
    const oc = center(mo1);
    const dcs = docs.map(center);

    reveal($(".how-h", sc), s + 0.15, { y: 40 });
    const stT = [0.6, 3.1, 5.8];
    $$(".step", sc).forEach((el, i) => {
      reveal(el, s + stT[i], { y: 70, scale: 0.96 }, 0.6);
      cue("whoosh_soft", s + stT[i]);
    });
    const line = $(".how-line", sc);
    tl.fromTo(line, P ? { scaleY: 0 } : { scaleX: 0 }, Object.assign(P ? { scaleY: 1 } : { scaleX: 1 }, { duration: 5.8, ease: "none" }), s + 0.8);

    tl.fromTo(mo1, { scale: 0 }, { scale: 1, duration: 0.45, ease: "back.out(2)" }, s + 0.9);
    docs.forEach((d, i) => {
      reveal(d, s + 1.05 + i * 0.13, { scale: 0.7 }, 0.35, "back.out(2)");
      tl.to(d, { x: oc.x - dcs[i].x, y: oc.y - dcs[i].y, scale: 0.2, opacity: 0, duration: 0.5, ease: "power3.in" }, s + 2.0 + i * 0.1);
      cue("tick", s + 1.05 + i * 0.13);
    });
    tl.fromTo(mo1, { scale: 1 }, { scale: 1.3, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, s + 2.55);
    cue("absorb", s + 2.5);

    const v2 = $(".st2 .step-vis", sc);
    const chs = $$(".ch-ic", v2);
    const lns = $$(".ch-lines line", v2);
    tl.fromTo($(".mini-orb", v2), { scale: 0 }, { scale: 1, duration: 0.45, ease: "back.out(2)" }, s + 3.4);
    chs.forEach((c, i) => {
      const t = s + 3.65 + i * 0.16;
      reveal(c, t, { scale: 0.5 }, 0.4, "back.out(2.2)");
      tl.fromTo(lns[i], { opacity: 0 }, { opacity: 1, duration: 0.3 }, t + 0.1);
      cue("tick", t);
    });

    const v3 = $(".st3 .step-vis", sc);
    reveal($(".status-pill", v3), s + 6.3, { scale: 0.8 }, 0.45, "back.out(2)");
    cue("ding", s + 6.3);
    tl.fromTo($(".status-pill i", v3), { scale: 1 }, { scale: 1.5, duration: 0.45, yoyo: true, repeat: 7, ease: "sine.inOut" }, s + 6.4);
    $$(".feed-row", v3).forEach((r, i) => {
      reveal(r, s + 6.9 + i * 0.6, { x: -40 }, 0.4);
      cue("check", s + 6.9 + i * 0.6);
    });
    exit($(".how-wrap", sc), s + D("how") - 0.4);
  }

  // ------------------------------------------------------------------ 5. demo
  function demo() {
    const s = S("demo");
    const sc = $("#sc-demo");
    const phone = $(".phone", sc);
    const side = $(".demo-side", sc);
    const card = $(".lead-card", sc);
    const list = $(".wa-list", sc);
    const body = $(".wa-body", sc);
    const bubbles = $$(".wa-list .b", sc);
    const typing = $(".wa-typing", sc);
    const typTxt = $(".phone .chat-sub .typing", sc);
    const idle = $(".phone .chat-sub .idle", sc);
    const bodyH = body.clientHeight;
    const bottoms = bubbles.map((b) => b.offsetTop + b.offsetHeight);

    reveal(phone, s + 0.1, { y: 80, rotation: P ? 0 : -3 }, 0.7);
    reveal($(".demo-label", sc), s + 0.4, { y: -20 }, 0.4);
    reveal(card, s + 0.5, P ? { y: 60 } : { x: -60 }, 0.6);

    const seq = [1.0, 2.7, 4.9, 6.3, 8.6, 10.0, 12.6, 13.8];
    let scrolled = 0;
    let firstTyping = true;
    seq.forEach((t, i) => {
      const b = bubbles[i];
      const dan = b.classList.contains("b-out");
      const at = s + t;
      if (dan) {
        const t0 = at - 0.8;
        tl.fromTo(typing, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.2, immediateRender: firstTyping }, t0);
        firstTyping = false;
        tl.to(typing, { opacity: 0, duration: 0.1 }, at - 0.1);
        tl.to(idle, { opacity: 0, duration: 0.1 }, t0);
        tl.to(typTxt, { opacity: 1, duration: 0.1 }, t0);
        tl.to(typTxt, { opacity: 0, duration: 0.1 }, at);
        tl.to(idle, { opacity: 1, duration: 0.1 }, at);
        cue("typing", t0, { dur: 0.7 });
      }
      const need = Math.max(0, bottoms[i] + 100 - bodyH);
      if (need > scrolled) {
        tl.to(list, { y: -need, duration: 0.35, ease: "power2.out" }, at - 0.05);
        scrolled = need;
      }
      reveal(b, at, { y: 24, scale: 0.94 }, 0.32, "back.out(1.6)");
      cue(dan ? "msg_out" : "msg_in", at);
    });
    tl.fromTo($$(".wa-typing i", sc), { y: 0 }, { y: -8, duration: 0.22, ease: "sine.inOut", yoyo: true, repeat: 61, stagger: 0.1 }, s + 1.5);

    const fill = (cls, t) => {
      const row = $("." + cls, card);
      tl.to($(".ph", row), { opacity: 0, duration: 0.2 }, t);
      reveal($(".v", row), t, { x: 30 }, 0.4);
      tl.fromTo($(".flash", row), { opacity: 0 }, { opacity: 1, duration: 0.15, yoyo: true, repeat: 1 }, t);
      cue("fill", t);
    };
    fill("r-name", s + 1.4);
    fill("r-need", s + 1.75);
    fill("r-rev", s + 8.9);
    fill("r-owner", s + 10.55);
    fill("r-meet", s + 14.2);
    tl.to($(".st-new", card), { opacity: 0, scale: 0.8, duration: 0.25 }, s + 10.2);
    tl.fromTo($(".st-hot", card), { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.5)" }, s + 10.25);
    cue("hot", s + 10.25);
    reveal($(".demo-toast", sc), s + 14.8, { y: 30 }, 0.45, "back.out(1.6)");
    cue("notif", s + 14.8, { v: 1 });

    const fin = $(".demo-final", sc);
    tl.to([phone, side], { opacity: 0.22, duration: 0.5 }, s + 15.9);
    tl.fromTo(fin, { opacity: 0 }, { opacity: 1, duration: 0.5 }, s + 16.0);
    tl.fromTo($(".h1", fin), { scale: 0.9, y: 30 }, { scale: 1, y: 0, duration: 0.6 }, s + 16.0);
    cue("whoosh_soft", s + 16.0);
    exit([$(".demo-wrap", sc), fin], s + D("demo") - 0.4);
  }

  // ------------------------------------------------------------------ 6. leads
  function leads() {
    const s = S("leads");
    const sc = $("#sc-leads");
    const wrap = $(".stations", sc);
    const stations = $$(".station", sc);
    const dot = $(".lead-dot", sc);
    const fillEl = $(".track-fill", sc);
    const wr = wrap.getBoundingClientRect();
    const tr = $(".track", sc).getBoundingClientRect();
    const pts = stations.map((st) => {
      const r = $(".st-ic", st).getBoundingClientRect();
      return { x: r.left + r.width / 2 - wr.left, y: r.top + r.height / 2 - wr.top };
    });
    const frac = pts.map((p) =>
      P ? (p.y + wr.top - tr.top) / tr.height : (tr.right - (p.x + wr.left)) / tr.width,
    );
    const DOT = 56;
    const colors = ["#94a3b8", "#22d3ee", "#a78bfa", "#f0abfc", "#fb7185"];

    reveal($(".leads-h", sc), s + 0.15, { y: 40 });
    stations.forEach((st, i) => tl.fromTo(st, { opacity: 0, y: 50 }, { opacity: 0.5, y: 0, duration: 0.5 }, s + 0.45 + i * 0.1));
    const start = P ? { x: pts[0].x - DOT / 2, y: pts[0].y - DOT / 2 - 150 } : { x: pts[0].x - DOT / 2 + 190, y: pts[0].y - DOT / 2 };
    tl.fromTo(dot, Object.assign({ opacity: 0, scale: 0 }, start), { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, s + 1.0);
    const axis = P ? "scaleY" : "scaleX";
    tl.fromTo(fillEl, { [axis]: 0 }, { [axis]: 0, duration: 0.01 }, s + 0.9);

    const stT = [1.5, 3.1, 4.7, 6.3, 7.9];
    stT.forEach((t, i) => {
      const at = s + t;
      tl.to(dot, { x: pts[i].x - DOT / 2, y: pts[i].y - DOT / 2, backgroundColor: colors[i], boxShadow: `0 0 50px ${colors[i]}`, duration: 0.55, ease: "power3.inOut" }, at - 0.55);
      tl.to(fillEl, { [axis]: Math.min(1, Math.max(0, frac[i])), duration: 0.55, ease: "power3.inOut" }, at - 0.55);
      tl.to(stations[i], { opacity: 1, duration: 0.3 }, at);
      tl.fromTo($(".st-glow", stations[i]), { opacity: 0 }, { opacity: 1, duration: 0.3 }, at);
      tl.to($(".st-ic", stations[i]), { borderColor: colors[i], backgroundColor: "rgba(34,211,238,0.10)", duration: 0.3 }, at);
      tl.to($(".st-ic .ic", stations[i]), { color: colors[i], duration: 0.3 }, at);
      tl.fromTo($(".st-ic", stations[i]), { scale: 1 }, { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }, at);
      if (i > 0) tl.to($(".st-glow", stations[i - 1]), { opacity: 0.3, duration: 0.3 }, at);
      cue("station", at, { n: i });
    });
    exit($(".leads-wrap", sc), s + D("leads") - 0.4);
  }

  // ------------------------------------------------------------------ 7. integrations
  function integrations() {
    const s = S("integrations");
    const sc = $("#sc-integrations");
    const con = $(".const", sc);
    const cats = $$(".cat", sc);
    const t2 = $$(".r2", sc);
    const t3 = $$(".r3", sc);
    const l1 = $$(".ln1", sc);
    const l2 = $$(".ln2", sc);
    const g = P ? { cx: 540, cy: 1020, x: 540, y: 605, sc: 0.44 } : { cx: 960, cy: 610, x: 440, y: 590, sc: 0.5 };

    reveal($(".int-h", sc), s + 0.1, { y: -30 });
    tl.fromTo($(".hub", sc), { scale: 0 }, { scale: 1, duration: 0.6, ease: "back.out(2)" }, s + 0.3);
    cue("reveal_small", s + 0.3);
    cats.forEach((c, i) => {
      const t = s + 0.8 + i * 0.12;
      reveal(c, t, { scale: 0.4 }, 0.45, "back.out(2)");
      tl.fromTo(l1[i], { opacity: 0 }, { opacity: 1, duration: 0.3 }, t);
      cue("tick", t);
    });
    t2.forEach((c, i) => {
      const t = s + 1.7 + i * 0.06;
      reveal(c, t, { scale: 0.3 }, 0.4, "back.out(2.2)");
      tl.fromTo(l2[i], { opacity: 0 }, { opacity: 1, duration: 0.3 }, t);
      if (i % 2 === 0) cue("tick_soft", t);
    });
    t3.forEach((c, i) => {
      const t = s + 2.75 + i * 0.045;
      reveal(c, t, { scale: 0.3 }, 0.4, "back.out(2.2)");
      if (i % 3 === 0) cue("tick_soft", t);
    });
    tl.fromTo(con, { scale: 0.95 }, { scale: 1.03, duration: 7, ease: "sine.inOut" }, s + 0.3);
    const r = rng(11);
    $$(".node", con).forEach((n) => {
      const amp = 6 + r() * 8;
      tl.fromTo(n, { y: 0 }, { y: -amp, duration: 1.4 + r() * 0.8, ease: "sine.inOut", yoyo: true, repeat: 3 }, s + 1.2 + r() * 0.6);
    });

    tl.to($(".int-h", sc), { opacity: 0, y: -30, duration: 0.35, ease: "power2.in" }, s + 7.2);
    tl.to(con, { x: g.x - g.cx, y: g.y - g.cy, scale: g.sc, duration: 0.9, ease: "power3.inOut" }, s + 7.3);
    cue("whoosh", s + 7.3);
    reveal($(".int-h2", sc), s + 7.7, { y: 30 });
    $$(".rule", sc).forEach((rl, i) => {
      const t = s + 8.3 + i * 0.8;
      reveal(rl, t, P ? { y: 40 } : { x: 80 }, 0.45);
      cue("rule", t);
    });
    exit([con, $(".int-b", sc)], s + D("integrations") - 0.4);
  }

  // ------------------------------------------------------------------ 8. value
  function value() {
    const s = S("value");
    const sc = $("#sc-value");
    const rows = $$(".vrow", sc);
    rows.forEach((r, i) => reveal(r, s + 0.1 + i * 0.1, { y: 40 }, 0.4));
    rows.forEach((r, i) => {
      const t = s + 0.9 + i * 0.35;
      tl.to($(".pend", r), { opacity: 0, scale: 0.8, duration: 0.2 }, t);
      tl.fromTo($(".done", r), { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)" }, t);
      tl.fromTo($(".vglow", r), { opacity: 0 }, { opacity: 1, duration: 0.2, yoyo: true, repeat: 1 }, t);
      cue("check", t);
    });
    tl.to($(".val-a", sc), { opacity: 0, y: -40, duration: 0.4, ease: "power2.in" }, s + 3.0);

    reveal($(".val-h", sc), s + 3.3, { y: 40 });
    $$(".stat", sc).forEach((st, i) => {
      reveal(st, s + 3.8 + i * 0.45, { y: 60, scale: 0.92 }, 0.55, "back.out(1.6)");
      cue("pop", s + 3.8 + i * 0.45);
    });
    tl.fromTo($(".zero", sc), { innerText: 12 }, { innerText: 0, snap: { innerText: 1 }, duration: 1.2, ease: "power2.out" }, s + 4.9);
    reveal($(".val-line", sc), s + 6.2, { y: 30 });
    tl.fromTo($(".clock-ic", sc), { rotation: 0 }, { rotation: -720, duration: 2.4, ease: "power2.inOut" }, s + 6.3);
    cue("rewind", s + 6.3);
    exit($(".val-b", sc), s + D("value") - 0.4);
  }

  // ------------------------------------------------------------------ 9. cta
  function cta() {
    const s = S("cta");
    const sc = $("#sc-cta");
    const dot = $(".kom-dot", sc);
    const dc = center(dot);
    const btn = $(".cta-btn", sc);
    tl.fromTo(dot, { x: W / 2 - dc.x, y: H / 2 - dc.y, scale: 0 }, { scale: 2.8, duration: 0.55, ease: "back.out(1.8)" }, s + 0.1);
    cue("reveal_small", s + 0.1);
    tl.to(dot, { x: 0, y: 0, scale: 1, duration: 0.85, ease: "power3.inOut" }, s + 1.0);
    tl.fromTo($(".kom", sc), { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power2.inOut" }, s + 1.05);
    tl.to(dot, { scaleX: 1.28, scaleY: 0.78, duration: 0.07, ease: "power2.out" }, s + 1.85);
    tl.to(dot, { scaleX: 1, scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" }, s + 1.92);
    cue("land", s + 1.85);
    $$(".cta-word span", sc).forEach((l, i) => reveal(l, s + 2.1 + i * 0.05, { y: 20 }, 0.4));
    reveal($(".t1", sc), s + 2.8, { y: 30 });
    reveal($(".t2", sc), s + 3.5, { y: 30 });
    reveal(btn, s + 4.4, { scale: 0.7 }, 0.55, "back.out(2)");
    cue("pop", s + 4.4);
    reveal($(".cta-meta", sc), s + 5.0, { y: 20 });
    tl.to(btn, { scale: 0.93, duration: 0.12, ease: "power2.in" }, s + 6.0);
    tl.to(btn, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }, s + 6.12);
    tl.fromTo($(".cta-ripple", sc), { opacity: 0.9, scale: 1 }, { opacity: 0, scale: 1.35, duration: 0.8, ease: "power2.out" }, s + 6.05);
    cue("click", s + 6.0);
    tl.to(btn, { scale: 1.04, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, s + 6.8);
  }

  function build() {
    bg();
    hook();
    intro();
    agent();
    how();
    demo();
    leads();
    integrations();
    value();
    cta();
    cues.sort((a, b) => a.t - b.t);
    window.__timelines["main"] = tl;
    window.__built = true;
  }

  const FONTS = ["400 30px Heebo", "500 30px Heebo", "700 30px Heebo", "500 30px Rubik", "700 30px Rubik", "800 30px Rubik", "900 30px Rubik"];
  Promise.all(FONTS.map((f) => document.fonts.load(f, "אבג abc 123")))
    .then(() => document.fonts.ready)
    .then(build);
})();
