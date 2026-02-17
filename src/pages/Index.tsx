import { motion } from "framer-motion";
import { Scan, Upload, Watch, LogIn, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/bio-twin-hero.jpg";
import BioTwinVisualization from "@/components/BioTwinVisualization";
import VitalsGrid from "@/components/VitalsGrid";
import DrugSimulator from "@/components/DrugSimulator";
import DNAProfile from "@/components/DNAProfile";
import DNAUpload from "@/components/DNAUpload";
import WearableSync from "@/components/WearableSync";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { user, signOut, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground text-lg">Bio<span className="text-primary">Twin</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-body text-muted-foreground">
            <a href="#dashboard" className="hover:text-foreground transition-colors">Dashboard</a>
            <a href="#simulate" className="hover:text-foreground transition-colors">Simulate</a>
            <a href="#dna" className="hover:text-foreground transition-colors">DNA Profile</a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-xs text-muted-foreground font-body hidden sm:block">{user.email}</span>
                <div className="flex items-center gap-1.5 text-xs text-glow-accent font-body">
                  <span className="w-1.5 h-1.5 rounded-full bg-glow-accent animate-pulse-glow" />
                  Twin Online
                </div>
                <button onClick={signOut} className="text-xs text-muted-foreground hover:text-foreground font-body flex items-center gap-1">
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-display font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-body mb-4">Personalized Pharmacology</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                Your Digital Twin.{" "}
                <span className="text-primary glow-text">Your Medicine.</span>
              </h1>
              <p className="mt-5 text-base text-muted-foreground font-body max-w-lg leading-relaxed">
                Simulate how any medication interacts with your unique genetics, metabolism, and real-time biometrics — before you take it.
              </p>
              {!user && (
                <div className="flex gap-3 mt-8">
                  <Link to="/auth" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-display font-medium text-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <User className="w-4 h-4" /> Get Started
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Vitals */}
        <section id="dashboard">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="font-display font-semibold text-xl text-foreground">Live Biometrics</h2>
            <span className="text-xs text-muted-foreground font-body">· Synced 2 min ago</span>
          </div>
          <VitalsGrid />
        </section>

        {/* Bio-Twin + Simulator */}
        <section id="simulate" className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 glass rounded-lg p-6">
            <h3 className="font-display font-semibold text-foreground mb-2">Your Bio-Twin</h3>
            <p className="text-xs text-muted-foreground font-body mb-4">Real-time metabolic simulation model</p>
            <BioTwinVisualization />
          </div>
          <div className="lg:col-span-3">
            <DrugSimulator />
          </div>
        </section>

        {/* Data integration section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DNAUpload />
          <WearableSync />
        </section>

        {/* DNA Profile */}
        <section id="dna">
          <DNAProfile />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 flex items-center justify-between text-xs text-muted-foreground font-body">
          <span>© 2026 BioTwin Pharmacist</span>
          <span>Preventing adverse drug reactions through simulation</span>
        </div>
      </footer>
    </div>
  );
}
