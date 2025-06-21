import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  KanbanSquare, Users, ShieldCheck, Clock, Rocket, Menu, X, CheckCircle2
} from "lucide-react";

// Reusable Button
function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <main>
        <HeroSection />
        <div className="my-8 flex justify-center">
        {/* <img
            src="/kanban-preview.png"
            alt="Kanban Board Preview"
            className="rounded-xl shadow-lg max-w-full h-auto border border-slate-700"
          /> */}
        </div>
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

// Header
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-purple-400 font-bold text-xl">
          <KanbanSquare className="h-6 w-6" />
          TrackHive
        </a>
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate("/login")} className="bg-transparent border border-purple-600 text-purple-300 hover:bg-purple-700 hover:text-white">
            Log In
          </Button>
          <Button onClick={() => navigate("/register")}>
            Get Started
          </Button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

// Hero Section
function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="py-20 text-center px-4">
      <h1 className="text-4xl font-bold leading-tight">Organize Projects. Track Progress. Empower Teams.</h1>
      <p className="mt-4 text-slate-400 text-lg">
        TrackHive is your all-in-one task management solution for seamless team collaboration.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <Button onClick={() => navigate("/register")}>Get Started Free</Button>
        <Button className="bg-slate-800 border border-slate-700 hover:bg-slate-700" onClick={() => navigate("/login")}>
          Log In
        </Button>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  return (
    <section className="py-16 bg-slate-900">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Features</h2>
        <p className="text-slate-400 mt-2">Everything you need to manage your work efficiently.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-6xl mx-auto">
        <Feature icon={<KanbanSquare />} title="Kanban Boards" desc="Visualize tasks across customizable columns." />
        <Feature icon={<Users />} title="Team Collaboration" desc="Assign tickets, comment, and collaborate in real-time." />
        <Feature icon={<Clock />} title="Task Prioritization" desc="Set priorities and due dates for better planning." />
        <Feature icon={<CheckCircle2 />} title="Progress Tracking" desc="Monitor each project’s overall progress." />
        <Feature icon={<ShieldCheck />} title="Secure & Private" desc="Your data is encrypted and protected." />
        <Feature icon={<Rocket />} title="Fast & Responsive" desc="Built with performance and scalability in mind." />
      </div>
    </section>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 text-center shadow hover:shadow-purple-800/30 transition-transform hover:scale-105 border border-slate-700">
      <div className="flex justify-center mb-4 text-purple-400">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400">{desc}</p>
    </div>
  );
}

// How It Works Section
function HowItWorksSection() {
  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="text-slate-400 mt-2">Simple steps to manage your workflow.</p>
      </div>
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 px-4 text-left">
        <Step number="1" title="Sign Up">
          Create your free account and get started instantly.
        </Step>
        <Step number="2" title="Create Projects">
          Set up boards, invite your team, and add tasks.
        </Step>
        <Step number="3" title="Track & Complete">
          Move tasks through stages, collaborate, and stay productive.
        </Step>
      </div>
    </section>
  );
}

function Step({ number, title, children }) {
  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg">
      <div className="text-purple-400 text-2xl font-bold mb-2">Step {number}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400">{children}</p>
    </div>
  );
}

// CTA Section
function CtaSection() {
  const navigate = useNavigate();
  return (
    <section className="py-20 text-center bg-slate-900">
      <h2 className="text-3xl font-bold mb-4">Start Your Productivity Journey Today</h2>
      <p className="text-slate-400 mb-6">Sign up now and build smarter workflows with TrackHive.</p>
      <Button onClick={() => navigate("/register")}>Get Started Free</Button>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-6 border-t border-slate-800 text-center text-slate-500 text-sm">
      © {new Date().getFullYear()} TrackHive. Built with ♥ for teams that care.
    </footer>
  );
}

export default LandingPage;
