import MensualistaHeader from "@/components/mensualista/MensualistaHeader";
import HeroSection from "@/components/mensualista/HeroSection";
import HowItWorksSection from "@/components/mensualista/HowItWorksSection";
import ServiciosSection from "@/components/mensualista/ServiciosSection";
import CrewsSection from "@/components/mensualista/CrewsSection";
import EmpresasSection from "@/components/mensualista/EmpresasSection";
import TestimonialsSection from "@/components/mensualista/TestimonialsSection";
import FAQSection from "@/components/mensualista/FAQSection";
import CTASection from "@/components/mensualista/CTASection";
import MensualistaFooter from "@/components/mensualista/MensualistaFooter";

export default function MensualistaLanding() {
  return (
    <div className="min-h-screen bg-background">
      <MensualistaHeader />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ServiciosSection />
        <CrewsSection />
        <EmpresasSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <MensualistaFooter />
    </div>
  );
}
