import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Ticket, Building2 } from "lucide-react";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-cta opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-border">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Elige tu camino:{" "}
            <span className="text-gradient-mensualista">Servicios</span> o{" "}
            <span className="text-gradient-crews">Crews</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Empieza hoy a generar ingresos extra vendiendo lo que te apasiona. 
            Sin costos, sin riesgos, sin compromisos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button
              size="lg"
              onClick={() => navigate("/servicios")}
              className="bg-gradient-mensualista hover:opacity-90 text-white gap-2 shadow-lg"
            >
              <Briefcase className="w-5 h-5" />
              Quiero vender servicios
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/crews")}
              className="bg-gradient-crews hover:opacity-90 text-white gap-2 shadow-lg glow-purple"
            >
              <Ticket className="w-5 h-5" />
              Quiero vender boletas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <button
            onClick={() => navigate("/empresas")}
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mx-auto"
          >
            <Building2 className="w-4 h-4" />
            Soy empresa →
          </button>
        </div>
      </motion.div>
    </section>
  );
}
