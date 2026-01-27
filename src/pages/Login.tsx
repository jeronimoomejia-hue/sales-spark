import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Users, Crown, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const demoUsers = [
  { level: 1 as const, name: "Promotor Común", description: "Vendedor individual", icon: User, path: "/dashboard", color: "from-neon-blue to-cyan-500" },
  { level: 2 as const, name: "Promotor Cabeza", description: "Lidera equipo de 6 personas", icon: Users, path: "/dashboard", color: "from-neon-purple to-neon-pink" },
  { level: 3 as const, name: "Sub Socio", description: "Gestiona 3 cabezas + 15 promotores", icon: Shield, path: "/dashboard", color: "from-neon-orange to-yellow-500" },
  { level: 4 as const, name: "Socio/Admin", description: "Vista completa de la organización", icon: Crown, path: "/admin", color: "from-neon-pink to-red-500" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoOptions, setShowDemoOptions] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    sessionStorage.setItem("demoUserLevel", "1");
    navigate("/dashboard");
  };

  const handleDemoLogin = (level: 1 | 2 | 3 | 4, path: string) => {
    sessionStorage.setItem("demoUserLevel", level.toString());
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50 animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-accent/20 via-transparent to-transparent opacity-50 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card variant="glass" className="p-8 border-primary/20">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-party mb-4 shadow-lg shadow-primary/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-display text-gradient-party">CREWS</h1>
            <p className="text-muted-foreground mt-2">Gestión de equipos de venta gamificada</p>
          </motion.div>

          {!showDemoOptions ? (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-border bg-card accent-primary" />
                    <span className="text-muted-foreground">Recordarme</span>
                  </label>
                  <a href="#" className="text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <Button type="submit" variant="party" size="lg" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Ingresar
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Access */}
              <div className="mt-6 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => setShowDemoOptions(true)}
                >
                  <Sparkles className="w-4 h-4" />
                  Acceder al Demo
                </Button>
              </div>
            </>
          ) : (
            /* Demo Options */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-center text-muted-foreground mb-4">
                Selecciona un rol para explorar el demo
              </p>
              
              {demoUsers.map((user, index) => (
                <motion.div
                  key={user.level}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => handleDemoLogin(user.level, user.path)}
                    className={`w-full p-4 rounded-xl bg-gradient-to-r ${user.color} hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-4 text-white shadow-lg`}
                  >
                    <div className="p-2 rounded-lg bg-white/20">
                      <user.icon className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm opacity-80">{user.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-70">Nivel</p>
                      <p className="text-xl font-bold">{user.level}</p>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}

              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={() => setShowDemoOptions(false)}
              >
                Volver al login
              </Button>
            </motion.div>
          )}

          {/* Footer */}
          {!showDemoOptions && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              ¿No tienes cuenta?{" "}
              <a href="#" className="text-primary hover:underline">
                Contacta a tu supervisor
              </a>
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}