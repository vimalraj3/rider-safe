import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, QrCode, HeartPulse, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      {/* Navbar Minimal */}
      <nav className="border-b border-border/40 backdrop-blur-md bg-background/60 fixed top-0 w-full z-50 transition-all duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
            <Shield className="h-6 w-6 text-primary" />
            <span>RiderSafe</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="rounded-full px-6 font-semibold shadow-sm hover:shadow-primary/20 transition-all"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-primary/20 rounded-full blur-[100px] sm:blur-[120px] -z-10 pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 ring-1 ring-primary/20 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Your safety, our priority
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-br from-foreground via-foreground to-foreground/70 leading-[1.1] sm:leading-[1.1]">
              Ride with Confidence. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-indigo-600 block mt-2 sm:mt-4">
                Be RiderSafe.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              The ultimate emergency QR safety app for bike riders. Instantly
              share vital medical info, emergency contacts, and personalized
              details when every second counts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-14 w-full sm:w-auto rounded-full px-8 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                >
                  Create Your Free Profile{" "}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 w-full sm:w-auto rounded-full px-8 text-base border-border/60 hover:bg-muted/50 transition-all"
                >
                  How it works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section
        id="features"
        className="py-24 sm:py-32 bg-muted/40 border-t border-border/50 relative overflow-hidden"
      >
        <div className="absolute top-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 sm:mb-24 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Built for the unexpected
            </h2>
            <p className="text-muted-foreground w-full max-w-2xl mx-auto text-lg pt-2">
              Because emergencies don't give warnings. Be prepared with a smart
              safety ecosystem designed specifically for motorcyclists and
              cyclists.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12 max-w-6xl mx-auto">
            <div className="bg-background/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <QrCode className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Instant QR Access</h3>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                First responders scan your unique helmet or bike sticker to
                instantly access your critical medical dashboard—no app
                required.
              </p>
              <div className="absolute -right-16 -bottom-16 h-40 w-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors duration-500" />
            </div>

            <div className="bg-background/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-border/50 shadow-sm hover:shadow-xl hover:border-rose-500/20 transition-all duration-300 relative overflow-hidden group">
              <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all duration-300">
                <HeartPulse className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Vital Health Data</h3>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                Store your blood group, allergies, conditions, and custom
                medical notes securely to ensure accurate and fully informed
                emergency care.
              </p>
              <div className="absolute -right-16 -bottom-16 h-40 w-40 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors duration-500" />
            </div>

            <div className="bg-background/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-border/50 shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 relative overflow-hidden group">
              <div className="h-14 w-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">
                Emergency Contacts
              </h3>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                Keep your loved ones in the loop. Store multiple emergency
                contacts with one-tap direct calling and relationship mapping.
              </p>
              <div className="absolute -right-16 -bottom-16 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 text-center text-muted-foreground bg-background">
        <div className="flex items-center justify-center gap-2 mb-6 text-foreground font-semibold text-lg">
          <Shield className="h-6 w-6 text-primary" /> RiderSafe
        </div>
        <p className="text-sm">
          © {new Date().getFullYear()} RiderSafe. All rights reserved.
        </p>
        <p className="text-xs pt-2 text-muted-foreground/60 max-w-sm mx-auto px-4">
          This service is designed to aid emergency responders but should not
          replace professional medical ID bracelets in critical situations.
        </p>
      </footer>
    </div>
  );
}
