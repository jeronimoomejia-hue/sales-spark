import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Ticket, 
  Trophy, 
  TrendingUp, 
  Wallet,
  Flame
} from "lucide-react";

const features = [
  {
    icon: Ticket,
    title: "Eventos activos",
    description: "Accede a los mejores eventos de tu ciudad y vende boletas con tu link único.",
    emoji: "🎫",
  },
  {
    icon: Wallet,
    title: "Comisiones por ticket",
    description: "Gana un porcentaje de cada boleta vendida. Sin topes, sin límites.",
    emoji: "💰",
  },
  {
    icon: Trophy,
    title: "Rankings en tiempo real",
    description: "Compite con otros vendedores y sube en el ranking para desbloquear bonos.",
    emoji: "🏆",
  },
  {
    icon: TrendingUp,
    title: "Cierres y pagos",
    description: "Pagos automáticos cada quincena con reportes detallados de tus ventas.",
    emoji: "📊",
  },
];

const mockRanking = [
  { position: 1, name: "María G.", sales: 156, badge: "🔥" },
  { position: 2, name: "Carlos M.", sales: 142, badge: "⚡" },
  { position: 3, name: "Laura R.", sales: 128, badge: "💎" },
  { position: 4, name: "Tú", sales: 98, badge: "🚀", isYou: true },
  { position: 5, name: "Diego P.", sales: 87, badge: "" },
];

export default function CrewsSection() {
  const navigate = useNavigate();

  return (
    <section id="crews" className="py-24 px-4 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-neon-purple/20 text-neon-purple border-neon-purple/30">
            🎉 Para vendedores de boletas
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Mensualista <span className="text-gradient-crews">Crews</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Vende boletas por comisión con estructura, metas y ranking. 
            Sube de nivel, lidera equipos y desbloquea recompensas exclusivas.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-neon-purple/50 transition-colors group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-crews flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                {feature.emoji}
              </div>
              <h3 className="font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Preview Section */}
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
          {/* Ranking Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-neon-yellow" />
                Ranking del Evento
              </h3>
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                En vivo
              </Badge>
            </div>
            <div className="space-y-3">
              {mockRanking.map((seller) => (
                <div
                  key={seller.position}
                  className={`flex items-center gap-4 p-3 rounded-xl ${
                    seller.isYou
                      ? "bg-neon-purple/20 border border-neon-purple/30"
                      : "bg-white/5"
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    seller.position === 1
                      ? "bg-neon-yellow text-black"
                      : seller.position === 2
                      ? "bg-gray-300 text-black"
                      : seller.position === 3
                      ? "bg-orange-400 text-black"
                      : "bg-white/10 text-white"
                  }`}>
                    {seller.position}
                  </span>
                  <span className="flex-1 text-white font-medium">
                    {seller.name}
                    {seller.isYou && (
                      <Badge className="ml-2 bg-neon-purple text-white text-xs">
                        Tú
                      </Badge>
                    )}
                  </span>
                  <span className="text-sm text-gray-400">{seller.sales} ventas</span>
                  <span className="text-lg">{seller.badge}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Progress Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Goal Progress */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Meta del mes</h3>
                <Badge className="bg-neon-pink/20 text-neon-pink border-neon-pink/30 flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  En fuego
                </Badge>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progreso</span>
                  <span className="text-neon-purple font-medium">98/150 boletas</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "65%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-crews rounded-full"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-400">
                ¡Solo te faltan <span className="text-neon-green font-bold">52 boletas</span> para alcanzar tu meta y ganar el bono de $500.000 COP!
              </p>
            </div>

            {/* Earnings Preview */}
            <div className="bg-gradient-crews rounded-3xl p-6 shadow-lg glow-purple">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Ganancias estimadas</h3>
                <span className="text-sm text-white/70">Este evento</span>
              </div>
              <p className="text-4xl font-bold text-white mb-2">$1.960.000</p>
              <p className="text-sm text-white/70">COP en comisiones + bonos</p>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={() => navigate("/crews")}
            className="bg-gradient-crews hover:opacity-90 text-white gap-2 shadow-lg glow-purple"
          >
            Entrar a Crews
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
