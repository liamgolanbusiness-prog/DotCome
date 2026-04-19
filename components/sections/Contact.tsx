"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { he } from "@/content/he";
import SectionKicker from "@/components/ui/SectionKicker";
import RevealText from "@/components/ui/RevealText";
import Button from "@/components/ui/Button";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="relative overflow-hidden py-20 md:py-32">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(240,171,252,0.28),transparent_60%)]"
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:gap-16 md:grid-cols-[1fr_1fr] md:px-6">

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionKicker>{he.contact.kicker}</SectionKicker>
          <RevealText as="h2" className="font-display text-3xl font-black leading-[1.05] md:text-5xl">
            {he.contact.title}
          </RevealText>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-1 block font-display text-3xl font-black leading-[1.05] gradient-text md:text-5xl"
          >
            {he.contact.titleHighlight}
          </motion.span>
          <p className="mt-5 text-base text-muted md:mt-8 md:text-lg">{he.contact.subtitle}</p>

          <div className="mt-8 space-y-3 md:mt-12 md:space-y-4">
            {[
              { label: "Email", value: he.contact.email, href: `mailto:${he.contact.email}` },
              { label: "WhatsApp", value: `${he.contact.whatsapp} ←`, href: "https://wa.me/972500000000" },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="block rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-all hover:border-white/30 hover:bg-white/[0.06] md:p-6"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-muted">{item.label}</div>
                <div className="mt-2 font-display text-lg font-bold md:text-2xl">{item.value}</div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:rounded-3xl md:p-8"
        >
          <div className="space-y-4 md:space-y-5">
            {(["name", "email", "budget"] as const).map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">
                  {he.contact.fields[f]}
                </label>
                <input
                  type={f === "email" ? "email" : "text"}
                  required
                  className="w-full rounded-xl border border-white/10 bg-ink-950/50 px-4 py-3 text-fg outline-none transition-all focus:border-neon-violet focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
                />
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.44, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">
                {he.contact.fields.message}
              </label>
              <textarea
                rows={4}
                required
                className="w-full resize-none rounded-xl border border-white/10 bg-ink-950/50 px-4 py-3 text-fg outline-none transition-all focus:border-neon-violet focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
              />
            </motion.div>
          </div>
          <div className="mt-6 md:mt-8">
            <Button>{sent ? "תודה! נחזור בקרוב ✦" : he.contact.submit}</Button>
          </div>
        </motion.form>

      </div>
    </section>
  );
}
