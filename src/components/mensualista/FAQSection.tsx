import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

const faqCategories = [
  {
    id: "vendedores-servicios",
    label: "Vendedores (Servicios)",
    color: "bg-primary/10 text-primary",
  },
  {
    id: "vendedores-crews",
    label: "Vendedores (Crews)",
    color: "bg-neon-purple/10 text-neon-purple",
  },
  {
    id: "empresas",
    label: "Empresas",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "pagos",
    label: "Pagos / Comisiones",
    color: "bg-green-500/10 text-green-500",
  },
];

const faqs = [
  // Vendedores Servicios
  {
    category: "vendedores-servicios",
    question: "¿Necesito experiencia previa en ventas?",
    answer: "No. Mensualista te ofrece capacitación gratuita de 10 minutos por cada servicio. Te enseñamos todo lo que necesitas saber para empezar a vender inmediatamente.",
  },
  {
    category: "vendedores-servicios",
    question: "¿Cómo funciona la comisión recurrente?",
    answer: "Cuando vendes un servicio de suscripción, ganas comisión cada mes mientras ese cliente permanezca activo. Si un cliente paga por 12 meses, tú recibes comisión los 12 meses.",
  },
  {
    category: "vendedores-servicios",
    question: "¿Puedo vender múltiples servicios?",
    answer: "Sí. Puedes elegir tantos servicios como quieras de nuestro catálogo. Cada uno tiene su propia comisión y capacitación.",
  },
  // Vendedores Crews
  {
    category: "vendedores-crews",
    question: "¿Cómo funciona Crews con boletas?",
    answer: "Te unes a una productora de eventos, recibes acceso a los eventos activos, compartes tu link único y ganas comisión por cada boleta vendida. Todo se trackea automáticamente.",
  },
  {
    category: "vendedores-crews",
    question: "¿Qué pasa si un evento se cancela?",
    answer: "Si un evento se cancela, la política de comisiones depende de la productora. Generalmente, si hubo devolución de boletas, la comisión se ajusta proporcionalmente. Revisa los términos de cada productora.",
  },
  {
    category: "vendedores-crews",
    question: "¿Cómo subo de nivel en el ranking?",
    answer: "El ranking se basa en ventas confirmadas. Mientras más vendas, más alto subes. Cada nivel desbloquea mejores comisiones, bonos y acceso a eventos exclusivos.",
  },
  // Empresas
  {
    category: "empresas",
    question: "¿Cuánto cuesta publicar mi servicio/evento?",
    answer: "Publicar es gratis. Solo pagas una comisión sobre las ventas cerradas. Sin costos fijos, sin riesgos. Solo pagas por resultados.",
  },
  {
    category: "empresas",
    question: "¿Cómo me aseguro de la calidad de los vendedores?",
    answer: "Todos los vendedores pasan por un proceso de verificación. Además, tienes acceso a métricas en tiempo real y puedes ver el historial de cada vendedor.",
  },
  // Pagos
  {
    category: "pagos",
    question: "¿Cómo me pagan?",
    answer: "Los pagos se realizan automáticamente a tu cuenta bancaria registrada. Servicios paga mensualmente y Crews cada quincena después del cierre del evento.",
  },
  {
    category: "pagos",
    question: "¿Cuándo cobro mis comisiones?",
    answer: "Para Servicios: las comisiones se pagan el día 15 de cada mes por las ventas del mes anterior. Para Crews: los pagos se procesan dentro de los 7 días hábiles después del cierre del evento.",
  },
  {
    category: "pagos",
    question: "¿Hay un mínimo para retirar?",
    answer: "El mínimo de retiro es de $50.000 COP. Si tu balance es menor, se acumula para el siguiente período de pago.",
  },
];

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState("vendedores-servicios");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const filteredFaqs = faqs.filter((faq) => faq.category === activeCategory);

  return (
    <section id="faq" className="py-24 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
            ❓ Preguntas frecuentes
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            ¿Tienes <span className="text-gradient-mensualista">dudas?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre Mensualista.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setOpenQuestion(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? `${category.color} ring-2 ring-offset-2 ring-current`
                  : "bg-white text-muted-foreground hover:bg-secondary"
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-border overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenQuestion(openQuestion === faq.question ? null : faq.question)
                }
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    openQuestion === faq.question ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openQuestion === faq.question && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
