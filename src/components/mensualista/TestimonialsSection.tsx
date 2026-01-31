import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Andrea Martínez",
    role: "Vendedora de Servicios",
    type: "servicios",
    avatar: "👩‍💼",
    quote: "Llevo 8 meses vendiendo software con Mensualista. Lo mejor es que cada cliente que mantengo me genera comisión mes a mes. Ya tengo ingresos pasivos estables.",
    earnings: "$2.1M COP/mes",
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    role: "Top 10 Crews",
    type: "crews",
    avatar: "👨‍🎤",
    quote: "Empecé vendiendo boletas como hobby y ahora es mi ingreso principal. El sistema de ranking me motiva a vender más y los bonos son increíbles.",
    earnings: "$3.8M COP/mes",
  },
  {
    id: 3,
    name: "Laura Gómez",
    role: "Vendedora de Servicios",
    type: "servicios",
    avatar: "👩‍💻",
    quote: "La capacitación de 10 minutos es real. En una semana ya había cerrado mi primera venta de CRM y empecé a ganar comisión recurrente.",
    earnings: "$890K COP/mes",
  },
  {
    id: 4,
    name: "Diego Ramírez",
    role: "Líder de Crew",
    type: "crews",
    avatar: "🧔",
    quote: "Armé un equipo de 12 vendedores y ahora gano comisiones de sus ventas también. Mensualista Crews me permitió escalar sin límites.",
    earnings: "$5.2M COP/mes",
  },
  {
    id: 5,
    name: "Valentina Torres",
    role: "Vendedora de Servicios",
    type: "servicios",
    avatar: "👩‍🔬",
    quote: "Trabajo desde casa y elijo mis horarios. Vendo plataformas de contabilidad a PYMEs y cada mes mis ingresos crecen con mis clientes activos.",
    earnings: "$1.5M COP/mes",
  },
  {
    id: 6,
    name: "Sebastián Herrera",
    role: "Promotor Crews",
    type: "crews",
    avatar: "👨‍🎓",
    quote: "Como estudiante, Crews me permite ganar dinero vendiendo boletas de eventos que de todas formas iba a ir. Es perfecto para mí.",
    earnings: "$1.2M COP/mes",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
            ⭐ Historias reales
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Vendedores que{" "}
            <span className="text-gradient-mensualista">transformaron</span> sus ingresos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Miles de personas ya están generando ingresos extra con Mensualista. 
            Conoce sus historias.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-6 shadow-lg border ${
                testimonial.type === "crews"
                  ? "bg-gradient-to-br from-gray-900 to-gray-800 border-neon-purple/20"
                  : "bg-white border-border"
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md ${
                  testimonial.type === "crews"
                    ? "bg-gradient-crews"
                    : "bg-gradient-mensualista"
                }`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className={`font-bold ${
                    testimonial.type === "crews" ? "text-white" : "text-foreground"
                  }`}>{testimonial.name}</h4>
                  <p className={`text-sm ${
                    testimonial.type === "crews" ? "text-gray-400" : "text-muted-foreground"
                  }`}>{testimonial.role}</p>
                </div>
              </div>

              <Badge
                className={`mb-4 ${
                  testimonial.type === "crews"
                    ? "bg-neon-purple/20 text-neon-purple border-neon-purple/30"
                    : "bg-primary/10 text-primary border-0"
                }`}
              >
                {testimonial.type === "crews" ? "🎫 Crews" : "💼 Servicios"}
              </Badge>

              <p className={`text-sm mb-4 italic ${
                testimonial.type === "crews" ? "text-gray-300" : "text-muted-foreground"
              }`}>
                "{testimonial.quote}"
              </p>

              <div className={`flex items-center justify-between pt-4 border-t ${
                testimonial.type === "crews" ? "border-white/10" : "border-border"
              }`}>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-neon-yellow text-neon-yellow" />
                  ))}
                </div>
                <span className={`font-bold ${
                  testimonial.type === "crews" ? "text-neon-green" : "text-primary"
                }`}>{testimonial.earnings}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
