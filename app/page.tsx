import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Portfolio from "@/components/sections/Portfolio";
import Impact from "@/components/sections/Impact";
import Testimonials from "@/components/sections/Testimonials";
import About from "@/components/sections/About";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import SectionCurtain from "@/components/ui/SectionCurtain";

export default function Page() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Services />
      <SectionCurtain text="PROCESS · PROCESS · PROCESS" />
      <Process />
      <SectionCurtain text="WORK · WORK · WORK" />
      <Portfolio />
      <Impact />
      <SectionCurtain text="VOICES · VOICES · VOICES" />
      <Testimonials />
      <About />
      <Faq />
      <Contact />
    </>
  );
}
